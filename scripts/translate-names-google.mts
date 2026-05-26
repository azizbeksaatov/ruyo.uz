/**
 * translate-names-google.mts  — RU→UZ via Google Translate (unofficial, free).
 * Use this if the Gemini key isn't available. Run after the IP rate-limit resets (~2-4h).
 * Fully resumable: re-run to continue from cache.
 *
 * Run: npx tsx scripts/translate-names-google.mts
 */

import { translate } from '@vitalets/google-translate-api';
import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync, existsSync } from 'fs';

const SUPABASE_URL = 'https://tguyzvmmbnsczwulydgi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRndXl6dm1tYm5zY3p3dWx5ZGdpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODA3MjMyMCwiZXhwIjoyMDkzNjQ4MzIwfQ.ngHjcq2dh8-7gSRnMkbeAbmldDQK07blUKUeDGEZPkg';

const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
const CACHE_FILE   = 'scripts/.names-uz-cache.json';
const UPDATE_EVERY = 50;

// If TRANSLATE_ENDPOINT is set, use the Vercel proxy (bypasses regional blocks).
// Otherwise fall back to direct Google Translate (requires non-blocked IP).
const PROXY_URL    = process.env.TRANSLATE_ENDPOINT ?? ''; // e.g. https://ruyo.uz/api/translate-proxy
const PROXY_SECRET = process.env.TRANSLATE_SECRET   ?? '';
const DELAY_MS     = PROXY_URL ? 6000 : 8000; // 6s through proxy keeps under shared-IP limits

type Cache = Record<number, { meaning_uz: string; character_uz: string }>;
let cache: Cache = {};
if (existsSync(CACHE_FILE)) {
  cache = JSON.parse(readFileSync(CACHE_FILE, 'utf8'));
  console.log(`Cache: ${Object.keys(cache).length} already done`);
}
function saveCache() { writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2)); }
function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function doTranslate(text: string): Promise<string> {
  if (!text.trim()) return text;
  if (PROXY_URL) {
    const res = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-secret': PROXY_SECRET },
      body: JSON.stringify({ text }),
    });
    const data = await res.json() as { result?: string; error?: string };
    if (data.error) throw new Error(data.error);
    return data.result ?? text;
  }
  const { text: result } = await translate(text, { from: 'ru', to: 'uz' });
  return result;
}

// Quick test before processing everything
console.log(PROXY_URL ? `Using proxy: ${PROXY_URL}` : 'Using direct Google Translate');
console.log('Testing...');
try {
  const result = await doTranslate('привет');
  console.log(`OK — "привет" → "${result}"\n`);
} catch (err: any) {
  const msg = String(err?.message ?? err);
  if (!PROXY_URL && (msg.includes('429') || msg.toLowerCase().includes('too many'))) {
    console.error('Still rate-limited by Google. Set TRANSLATE_ENDPOINT to use the Vercel proxy.');
  } else {
    console.error('Translation error:', msg);
  }
  process.exit(1);
}

type DbRow = { id: number; meaning: string; character: string };

async function translateOne(row: DbRow): Promise<void> {
  const SEP = ' ||| ';
  const translated = await doTranslate(`${row.meaning}${SEP}${row.character}`);
  const idx = translated.indexOf(' ||| ');
  if (idx !== -1) {
    cache[row.id] = {
      meaning_uz:   translated.slice(0, idx).trim()  || row.meaning,
      character_uz: translated.slice(idx + 5).trim() || row.character,
    };
  } else {
    const m = await doTranslate(row.meaning);
    await sleep(1000);
    const c = await doTranslate(row.character);
    cache[row.id] = { meaning_uz: m.trim() || row.meaning, character_uz: c.trim() || row.character };
  }
}

async function flushDB(rows: DbRow[]) {
  for (const row of rows) {
    const uz = cache[row.id];
    if (!uz) continue;
    const { error } = await sb.from('names').update({ meaning_uz: uz.meaning_uz, character_uz: uz.character_uz }).eq('id', row.id);
    if (error) console.error(`  DB error id=${row.id}: ${error.message}`);
  }
}

// Fetch all
console.log('Fetching from Supabase...');
let allRows: DbRow[] = [], from = 0;
while (true) {
  const { data, error } = await sb.from('names').select('id, meaning, character').eq('status', 'approved').range(from, from + 999);
  if (error) { console.error(error); process.exit(1); }
  if (!data?.length) break;
  allRows = allRows.concat(data as DbRow[]);
  if (data.length < 1000) break;
  from += 1000;
}

const pending = allRows.filter(r => !cache[r.id]);
console.log(`Total: ${allRows.length}  Pending: ${pending.length}`);
if (!pending.length) {
  await flushDB(allRows); console.log('All done.'); process.exit(0);
}
console.log(`ETA: ~${Math.round(pending.length * DELAY_MS / 3600000 * 10) / 10}h at ${DELAY_MS / 1000}s/name\n`);

let sinceFlush: DbRow[] = [], done = 0, consecErrors = 0;

for (const row of pending) {
  process.stdout.write(`[${done + 1}/${pending.length}] id=${row.id} ... `);
  let ok = false;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await translateOne(row);
      ok = true;
      consecErrors = 0;
      break;
    } catch (err: any) {
      const msg = String(err?.message ?? err);
      const isRate = msg.includes('429') || msg.toLowerCase().includes('too many');
      console.error(`attempt ${attempt}: ${msg.slice(0, 60)}`);
      if (isRate) {
        consecErrors++;
        const wait = Math.min(30, 5 * consecErrors); // 5min → 10min → ... → 30min
        console.log(`  Rate limited (${consecErrors}×). Waiting ${wait} min...`);
        saveCache();
        await sleep(wait * 60 * 1000);
      } else if (attempt < 3) {
        await sleep(4000);
      }
    }
  }
  if (ok) {
    console.log('✓');
    sinceFlush.push(row);
    if (sinceFlush.length >= UPDATE_EVERY) {
      process.stdout.write(`  → DB save... `);
      saveCache(); await flushDB(sinceFlush); sinceFlush = []; console.log('ok');
    }
  } else {
    cache[row.id] = { meaning_uz: row.meaning, character_uz: row.character };
  }
  done++;
  await sleep(DELAY_MS);
}

saveCache();
if (sinceFlush.length) { await flushDB(sinceFlush); }
console.log(`\nDone. ${done} names processed.`);
