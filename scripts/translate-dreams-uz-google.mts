/**
 * translate-dreams-uz-google.mts
 * Translates remaining dreams using unofficial Google Translate (free, no API key).
 * One combined request per dream, 7s delay to avoid IP rate limiting.
 * Run: npx tsx scripts/translate-dreams-uz-google.mts
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';

const { dreams } = await import('../data/dreams.js');

const CACHE_FILE = 'scripts/dreams-uz-cache.json';
const OUTPUT_FILE = 'data/dreams-uz.ts';
const DELAY_MS = 7000;
const SEP = ' [|||] ';

interface DreamUz {
  title: string;
  short: string;
  full: string;
  forWoman: string;
  forMan: string;
  byDay: Record<string, string>;
  tags: string[];
}

let cache: Record<string, DreamUz> = {};
if (existsSync(CACHE_FILE)) {
  cache = JSON.parse(readFileSync(CACHE_FILE, 'utf8'));
  console.log(`Loaded cache: ${Object.keys(cache).length} dreams already translated`);
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function googleTranslate(text: string): Promise<string> {
  if (!text.trim()) return text;
  const params = new URLSearchParams({ client: 'gtx', sl: 'ru', tl: 'uz', dt: 't', q: text });
  const res = await fetch(`https://translate.googleapis.com/translate_a/single?${params}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept-Language': 'ru-RU,ru;q=0.9',
      'Referer': 'https://translate.google.com/',
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json() as [Array<[string, string]>, ...unknown[]];
  return data[0].map((pair: [string, string]) => pair[0]).join('');
}

async function translateDream(dream: (typeof dreams)[0]): Promise<DreamUz> {
  const byDayKeys = Object.keys(dream.byDay);
  const byDayVals = Object.values(dream.byDay);

  // Pack all short fields + byDay + tags into one request
  const combined = [
    dream.title,
    dream.short,
    dream.forWoman,
    dream.forMan,
    ...byDayVals,
    ...dream.tags,
  ].join(SEP);

  const [combinedTr, fullTr] = await Promise.all([
    googleTranslate(combined),
    googleTranslate(dream.full),
  ]);

  const parts = combinedTr.split(/\s*\[\|\|\|\]\s*/);
  const offset = 4; // title, short, forWoman, forMan
  const byDay: Record<string, string> = {};
  byDayKeys.forEach((k, i) => { byDay[k] = parts[offset + i] ?? byDayVals[i]; });
  const tags = dream.tags.map((_, i) => parts[offset + byDayKeys.length + i] ?? dream.tags[i]);

  return {
    title: parts[0] ?? dream.title,
    short: parts[1] ?? dream.short,
    forWoman: parts[2] ?? dream.forWoman,
    forMan: parts[3] ?? dream.forMan,
    full: fullTr,
    byDay,
    tags,
  };
}

const seenSlugs = new Set<string>();
const remaining = dreams.filter((d) => {
  if (cache[d.slug] || seenSlugs.has(d.slug)) return false;
  seenSlugs.add(d.slug);
  return true;
});
console.log(`Total: ${dreams.length}, remaining: ${remaining.length}`);

for (let i = 0; i < remaining.length; i++) {
  const dream = remaining[i];
  process.stdout.write(`[${i + 1}/${remaining.length}] ${dream.slug} ... `);

  let ok = false;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      cache[dream.slug] = await translateDream(dream);
      writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
      console.log(`✓ (${Object.keys(cache).length}/${dreams.length})`);
      ok = true;
      break;
    } catch (err: any) {
      console.error(`\n  ✗ attempt ${attempt}: ${err.message?.slice(0, 80)}`);
      if (attempt < 3) await sleep(10000);
    }
  }
  if (!ok) console.error('  Skipping');

  if (i + 1 < remaining.length) await sleep(DELAY_MS);
}

// Generate TypeScript output
console.log(`\nGenerating ${OUTPUT_FILE}...`);
const lines: string[] = [
  '// Auto-generated — do not edit manually',
  '',
  'export interface DreamUzTranslation {',
  '  title: string;',
  '  short: string;',
  '  full: string;',
  '  forWoman: string;',
  '  forMan: string;',
  '  byDay: Record<string, string>;',
  '  tags: string[];',
  '}',
  '',
  'export const dreamsUz: Record<string, DreamUzTranslation> = {',
];

const writtenSlugs = new Set<string>();
let written = 0;
for (const dream of dreams) {
  const uz = cache[dream.slug];
  if (!uz || writtenSlugs.has(dream.slug)) continue;
  writtenSlugs.add(dream.slug);
  lines.push(`  '${dream.slug}': {`);
  lines.push(`    title: ${JSON.stringify(uz.title)},`);
  lines.push(`    short: ${JSON.stringify(uz.short)},`);
  lines.push(`    full: ${JSON.stringify(uz.full)},`);
  lines.push(`    forWoman: ${JSON.stringify(uz.forWoman)},`);
  lines.push(`    forMan: ${JSON.stringify(uz.forMan)},`);
  lines.push(`    byDay: {`);
  for (const [day, text] of Object.entries(uz.byDay)) {
    lines.push(`      ${day}: ${JSON.stringify(text)},`);
  }
  lines.push(`    },`);
  lines.push(`    tags: ${JSON.stringify(uz.tags)},`);
  lines.push(`  },`);
  written++;
}
lines.push('};');
writeFileSync(OUTPUT_FILE, lines.join('\n'));
console.log(`✓ Written ${OUTPUT_FILE} (${written} dreams)`);
