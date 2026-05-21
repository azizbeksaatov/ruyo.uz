import { createServerSupabase } from './supabase';
import type { NameEntry, NameOrigin } from '@/data/names';
import { cyrToLatin, LATIN_TO_CYR, toDbSearchQuery } from './transliterate';

type DbRow = {
  slug: string; name: string; gender: string; origin: string;
  meaning: string; character: string; lucky_numbers: number[];
  element: string; compatible_names: string[]; popularity: number;
  meaning_uz?: string | null; character_uz?: string | null;
};

const ELEMENT_UZ: Record<string, string> = {
  'Огонь': 'Olov', 'Вода': 'Suv', 'Земля': 'Yer', 'Воздух': 'Havo',
};

function mapRow(row: DbRow, locale = 'ru'): NameEntry {
  const useUz = locale === 'uz';
  return {
    slug: row.slug,
    name: useUz ? cyrToLatin(row.name) : row.name,
    gender: row.gender as NameEntry['gender'],
    origin: row.origin as NameOrigin,
    meaning: (useUz && row.meaning_uz) ? row.meaning_uz : row.meaning,
    character: (useUz && row.character_uz) ? row.character_uz : row.character,
    luckyNumbers: row.lucky_numbers ?? [],
    element: useUz ? (ELEMENT_UZ[row.element] ?? row.element) : row.element,
    compatibleNames: (row.compatible_names ?? []).map(n => useUz ? cyrToLatin(n) : n),
    popularity: row.popularity,
  };
}

export async function fetchNames(opts: {
  origin?: string; q?: string; letter?: string; page?: number; limit?: number; locale?: string;
}) {
  const { origin, q, letter, page = 1, limit = 120, locale = 'ru' } = opts;
  const sb = createServerSupabase();
  let query = sb.from('names').select('*', { count: 'exact' })
    .eq('status', 'approved').order('name');
  if (origin) query = query.eq('origin', origin);
  if (q) query = query.ilike('name', `%${toDbSearchQuery(q, locale)}%`);
  if (letter) {
    // For Uzbek locale the letter filter arrives as Latin — convert back to Cyrillic for the DB query
    const dbLetter = locale === 'uz' ? (LATIN_TO_CYR[letter] ?? letter) : letter;
    query = query.ilike('name', `${dbLetter}%`);
  }
  const from = (page - 1) * limit;
  const { data, count } = await query.range(from, from + limit - 1);
  return { names: (data ?? []).map(r => mapRow(r as DbRow, locale)), total: count ?? 0 };
}

export async function fetchNameBySlug(slug: string, locale = 'ru'): Promise<NameEntry | null> {
  const { data } = await createServerSupabase()
    .from('names').select('*').eq('slug', slug).eq('status', 'approved').maybeSingle();
  return data ? mapRow(data as DbRow, locale) : null;
}

export async function fetchRelatedNames(origin: string, excludeSlug: string, limit = 6, locale = 'ru'): Promise<NameEntry[]> {
  const { data } = await createServerSupabase()
    .from('names').select('*').eq('origin', origin).eq('status', 'approved')
    .neq('slug', excludeSlug).order('popularity', { ascending: false }).limit(limit);
  return (data ?? []).map(r => mapRow(r as DbRow, locale));
}
