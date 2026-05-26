/**
 * translate-names-uz.mts  — RU→UZ via Gemini free tier (30 req/min, no credit card).
 * Get free API key: https://aistudio.google.com/app/apikey
 * Set it: $env:GEMINI_API_KEY="your-key"  (PowerShell) or export GEMINI_API_KEY=...
 *
 * BEFORE RUNNING: add columns in Supabase SQL editor:
 *   ALTER TABLE names ADD COLUMN IF NOT EXISTS meaning_uz TEXT;
 *   ALTER TABLE names ADD COLUMN IF NOT EXISTS character_uz TEXT;
 *
 * Run:    npx tsx scripts/translate-names-uz.mts
 * Resume: re-run the same command — cache skips already-done names.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync, existsSync } from 'fs';

// --- Config ---
const GEMINI_KEY = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? '';
if (!GEMINI_KEY) {
  console.error('ERROR: Set GEMINI_API_KEY environment variable.');
  console.error('  Get free key: https://aistudio.google.com/app/apikey');
  console.error('  PowerShell:  $env:GEMINI_API_KEY="your-key-here"');
  console.error('  Then re-run: npx tsx scripts/translate-names-uz.mts');
  process.exit(1);
}

const SUPABASE_URL = 'https://tguyzvmmbnsczwulydgi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRndXl6dm1tYm5zY3p3dWx5ZGdpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODA3MjMyMCwiZXhwIjoyMDkzNjQ4MzIwfQ.ngHjcq2dh8-7gSRnMkbeAbmldDQK07blUKUeDGEZPkg';

const BATCH     = 5;    // names per Gemini call
const DELAY_MS  = 2500; // between Gemini calls (stays under 30 RPM free limit)
const UPDATE_EVERY = 50;
const CACHE_FILE   = 'scripts/.names-uz-cache.json';

// --- Clients ---
const sb    = createClient(SUPABASE_URL, SUPABASE_KEY);
const genAI = new GoogleGenerativeAI(GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

// Quick sanity check — catches invalid keys before processing 5771 names
console.log('Testing Gemini API key...');
try {
  const test = await model.generateContent('Say "ok" in one word.');
  console.log(`Gemini OK (response: "${test.response.text().trim().slice(0, 20)}")\n`);
} catch (err: any) {
  console.error('Gemini test failed:', err?.message ?? err);
  console.error('Check your GEMINI_API_KEY — get a free key at https://aistudio.google.com/app/apikey');
  process.exit(1);
}

type Cache = Record<number, { meaning_uz: string; character_uz: string }>;
let cache: Cache = {};
if (existsSync(CACHE_FILE)) {
  cache = JSON.parse(readFileSync(CACHE_FILE, 'utf8'));
  console.log(`Loaded cache: ${Object.keys(cache).length} names already translated`);
}
function saveCache() { writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2)); }
function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

// --- Gemini batch translate ---
async function geminiTranslateBatch(texts: string[]): Promise<string[]> {
  const numbered = texts.map((t, i) => `${i + 1}. ${t}`).join('\n');
  const prompt =
    `Translate each numbered line from Russian to Uzbek (Latin script, standard Uzbek).\n` +
    `Return ONLY the numbered translations in the same format, nothing else.\n\n${numbered}`;

  const result   = await model.generateContent(prompt);
  const response = result.response.text().trim();

  // Parse "1. ...\n2. ...\n3. ..." response
  const out: string[] = new Array(texts.length).fill('');
  for (const line of response.split('\n')) {
    const m = line.match(/^(\d+)[.)]\s*(.+)/);
    if (m) {
      const idx = parseInt(m[1], 10) - 1;
      if (idx >= 0 && idx < texts.length) out[idx] = m[2].trim();
    }
  }
  // Fill missing with originals
  return out.map((t, i) => t || texts[i]);
}

type DbRow = { id: number; meaning: string; character: string };

async function translateBatch(rows: DbRow[]): Promise<void> {
  const meanings   = await geminiTranslateBatch(rows.map(r => r.meaning));
  await sleep(DELAY_MS);
  const characters = await geminiTranslateBatch(rows.map(r => r.character));

  for (let i = 0; i < rows.length; i++) {
    cache[rows[i].id] = {
      meaning_uz:   meanings[i]   || rows[i].meaning,
      character_uz: characters[i] || rows[i].character,
    };
  }
}

async function flushToSupabase(rows: DbRow[]): Promise<void> {
  for (const row of rows) {
    const uz = cache[row.id];
    if (!uz) continue;
    const { error } = await sb.from('names').update({ meaning_uz: uz.meaning_uz, character_uz: uz.character_uz }).eq('id', row.id);
    if (error) console.error(`  DB error id=${row.id}: ${error.message}`);
  }
}

// --- Fetch all approved names ---
console.log('Fetching names from Supabase...');
let allRows: DbRow[] = [];
let from = 0;
while (true) {
  const { data, error } = await sb.from('names').select('id, meaning, character').eq('status', 'approved').range(from, from + 999);
  if (error) { console.error(error); process.exit(1); }
  if (!data || data.length === 0) break;
  allRows = allRows.concat(data as DbRow[]);
  if (data.length < 1000) break;
  from += 1000;
}
console.log(`Total: ${allRows.length} names`);

const pending = allRows.filter(r => !cache[r.id]);
console.log(`Pending: ${pending.length}`);
if (pending.length === 0) {
  console.log('All cached. Flushing to DB...');
  await flushToSupabase(allRows);
  console.log('Done.'); process.exit(0);
}

const totalBatches = Math.ceil(pending.length / BATCH);
const etaMin = Math.round(totalBatches * 2 * DELAY_MS / 60000); // 2 calls per batch
console.log(`Batches: ${totalBatches}  |  ETA: ~${etaMin} min  |  re-run to resume\n`);

let sinceFlush: DbRow[] = [];
let batchNum = 0;

for (let i = 0; i < pending.length; i += BATCH) {
  const batch = pending.slice(i, i + BATCH);
  batchNum++;
  process.stdout.write(`[batch ${batchNum}/${totalBatches}, names ${i + 1}–${Math.min(i + BATCH, pending.length)}] ... `);

  let ok = false;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await translateBatch(batch);
      ok = true;
      break;
    } catch (err: any) {
      const msg = String(err?.message ?? err);
      const isQuota = msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.toLowerCase().includes('resource exhausted') || msg.toLowerCase().includes('quota');
      const isAuthError = msg.includes('400') || msg.includes('401') || msg.includes('403') || msg.toLowerCase().includes('api key') || msg.toLowerCase().includes('invalid');
      if (isAuthError) { console.error('\n  API key error — check GEMINI_API_KEY'); process.exit(1); }
      console.error(`\n  attempt ${attempt}: ${msg}`);
      if (isQuota) {
        console.log('  Rate limited — waiting 60s...');
        await sleep(60000);
      } else if (attempt < 3) {
        await sleep(5000);
      }
    }
  }

  if (ok) {
    console.log('✓');
    sinceFlush.push(...batch);
    if (sinceFlush.length >= UPDATE_EVERY) {
      process.stdout.write(`  → saving to DB... `);
      saveCache();
      await flushToSupabase(sinceFlush);
      sinceFlush = [];
      console.log('saved');
    }
  } else {
    console.error('  skipped batch — keeping Russian fallback');
    for (const row of batch) cache[row.id] = { meaning_uz: row.meaning, character_uz: row.character };
  }

  await sleep(DELAY_MS);
}

saveCache();
if (sinceFlush.length > 0) {
  process.stdout.write(`\nFinal save to DB... `);
  await flushToSupabase(sinceFlush);
  console.log('saved');
}
console.log(`\nDone. ${pending.length} names processed.`);
