// Run: npx tsx scripts/export-dreams.ts
// Exports all local dream data to JSON for Supabase migration
import { writeFileSync } from 'fs';
import { dreams } from '../data/dreams';
import { dreamsUz } from '../data/dreams-uz';

function getUzFirstLetter(title: string): string {
  if (!title) return '';
  const ch0 = title.charAt(0).toUpperCase();
  const ch1 = title.charAt(1);
  const isApos = (c: string) => c === "'" || c === 'ʻ' || c === '‘' || c === '’';
  if (ch0 === 'O' && isApos(ch1)) return "O'";
  if (ch0 === 'G' && isApos(ch1)) return "G'";
  return ch0;
}

const rows = dreams.map((dream) => {
  const uz = dreamsUz[dream.slug];
  return {
    slug: dream.slug,
    title: dream.title,
    letter: dream.letter,
    short: dream.short,
    full_text: dream.full,
    for_woman: dream.forWoman,
    for_man: dream.forMan,
    by_day: dream.byDay,
    tags: dream.tags,
    related: dream.related,
    source: 'static',
    status: 'approved',
    title_uz:     uz?.title    ?? null,
    letter_uz:    uz?.title    ? getUzFirstLetter(uz.title) : null,
    short_uz:     uz?.short    ?? null,
    full_text_uz: uz?.full     ?? null,
    for_woman_uz: uz?.forWoman ?? null,
    for_man_uz:   uz?.forMan   ?? null,
    by_day_uz:    uz?.byDay    ?? null,
    tags_uz:      uz?.tags     ?? null,
  };
});

writeFileSync('scripts/dreams-export.json', JSON.stringify(rows));
console.log(`Exported ${rows.length} dreams to scripts/dreams-export.json`);
