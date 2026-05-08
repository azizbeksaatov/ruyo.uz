#!/usr/bin/env node
/**
 * cleanup-names.mjs
 * Removes names with Latin script or placeholder meanings.
 * Run: node scripts/cleanup-names.mjs
 * Dry run (preview only): node scripts/cleanup-names.mjs --dry
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

function loadEnv() {
  const content = readFileSync('.env.local', 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const eq = line.indexOf('=');
    if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
  }
  return env;
}

const env = loadEnv();
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const DRY = process.argv.includes('--dry');

function isBad(row) {
  const name = row.name ?? '';
  const meaning = row.meaning ?? '';

  // 1. Name has no Cyrillic characters (Latin-only)
  const hasCyrillic = /[А-Яа-яёЁ]/.test(name);
  if (!hasCyrillic) return 'Latin script name';

  // 2. Placeholder meaning we generated in the seed script
  if (meaning.startsWith('Традиционное ')) return 'Placeholder meaning';

  // 3. Very short meaning (under 20 chars) — not informative
  if (meaning.trim().length < 20) return 'Too short meaning';

  // 4. Wikidata auto-descriptions that leaked through
  if (/^(мужское|женское|унисекс)\s+имя/i.test(meaning)) return 'Generic gender label';
  if (/^(arabic|persian|uzbek|slavic|turkic)\s+(male|female)/i.test(meaning)) return 'English placeholder';

  return null;
}

async function main() {
  console.log(DRY ? '\n[DRY RUN — no deletions]\n' : '\n[LIVE — will delete]\n');

  // Fetch all names in batches
  let page = 0;
  const PAGE = 1000;
  const toDelete = [];

  while (true) {
    const { data, error } = await sb
      .from('names')
      .select('id, name, meaning, origin, source')
      .range(page * PAGE, (page + 1) * PAGE - 1);

    if (error) { console.error(error.message); break; }
    if (!data || data.length === 0) break;

    for (const row of data) {
      const reason = isBad(row);
      if (reason) toDelete.push({ id: row.id, name: row.name, reason });
    }

    page++;
    if (data.length < PAGE) break;
  }

  console.log(`Found ${toDelete.length} names to remove:`);

  // Show breakdown by reason
  const byReason = {};
  for (const r of toDelete) {
    byReason[r.reason] = (byReason[r.reason] ?? 0) + 1;
  }
  for (const [reason, count] of Object.entries(byReason)) {
    console.log(`  ${count.toString().padStart(5)}  ${reason}`);
  }

  // Show samples
  if (toDelete.length > 0) {
    console.log('\nSamples:');
    for (const r of toDelete.slice(0, 10)) {
      console.log(`  [${r.reason}] ${r.name}`);
    }
  }

  if (DRY || toDelete.length === 0) {
    console.log('\nDry run complete. Run without --dry to apply.');
    return;
  }

  // Delete in batches of 200
  const ids = toDelete.map(r => r.id);
  let deleted = 0;
  for (let i = 0; i < ids.length; i += 200) {
    const batch = ids.slice(i, i + 200);
    const { error } = await sb.from('names').delete().in('id', batch);
    if (error) { console.warn('Delete error:', error.message); continue; }
    deleted += batch.length;
    process.stdout.write(`  Deleted ${deleted}/${ids.length}\r`);
  }
  process.stdout.write('\n');

  const { count } = await sb.from('names').select('*', { count: 'exact', head: true });
  console.log(`\n✓ Removed ${deleted} names`);
  console.log(`✓ Remaining in DB: ${count}`);
}

main().catch(e => { console.error(e); process.exit(1); });
