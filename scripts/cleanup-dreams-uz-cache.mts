/**
 * cleanup-dreams-uz-cache.mts
 * Decodes HTML entities and strips HTML tags from dreams-uz-cache.json,
 * then regenerates data/dreams-uz.ts.
 * Run: npx tsx scripts/cleanup-dreams-uz-cache.mts
 */

import { readFileSync, writeFileSync } from 'fs';

const CACHE_FILE = 'scripts/dreams-uz-cache.json';
const OUTPUT_FILE = 'data/dreams-uz.ts';

function clean(text: string): string {
  return text
    .replace(/<[^>]+>/g, '')           // strip HTML tags like <g id="1">...</g>
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanObj(obj: Record<string, string>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) result[k] = clean(v);
  return result;
}

interface DreamUz {
  title: string; short: string; full: string;
  forWoman: string; forMan: string;
  byDay: Record<string, string>; tags: string[];
}

const cache = JSON.parse(readFileSync(CACHE_FILE, 'utf8')) as Record<string, DreamUz>;
let changed = 0;

for (const [slug, dream] of Object.entries(cache)) {
  const cleaned: DreamUz = {
    title: clean(dream.title),
    short: clean(dream.short),
    full: clean(dream.full),
    forWoman: clean(dream.forWoman),
    forMan: clean(dream.forMan),
    byDay: cleanObj(dream.byDay),
    tags: dream.tags.map(clean),
  };
  const before = JSON.stringify(dream);
  const after = JSON.stringify(cleaned);
  if (before !== after) {
    cache[slug] = cleaned;
    changed++;
  }
}

console.log(`Cleaned ${changed} entries`);
writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));

// Regenerate dreams-uz.ts
const { dreams } = await import('../data/dreams.js');

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
