import { createServerSupabase } from './supabase';
import type { NameEntry, NameOrigin } from '@/data/names';

type DbRow = {
  slug: string; name: string; gender: string; origin: string;
  meaning: string; character: string; lucky_numbers: number[];
  element: string; compatible_names: string[]; popularity: number;
};

function mapRow(row: DbRow): NameEntry {
  return {
    slug: row.slug,
    name: row.name,
    gender: row.gender as NameEntry['gender'],
    origin: row.origin as NameOrigin,
    meaning: row.meaning,
    character: row.character,
    luckyNumbers: row.lucky_numbers ?? [],
    element: row.element,
    compatibleNames: row.compatible_names ?? [],
    popularity: row.popularity,
  };
}

export async function fetchNames(opts: {
  origin?: string; q?: string; letter?: string; page?: number; limit?: number;
}) {
  const { origin, q, letter, page = 1, limit = 120 } = opts;
  const sb = createServerSupabase();
  let query = sb.from('names').select('*', { count: 'exact' })
    .eq('status', 'approved').order('name');
  if (origin) query = query.eq('origin', origin);
  if (q) query = query.ilike('name', `%${q}%`);
  if (letter) query = query.ilike('name', `${letter}%`);
  const from = (page - 1) * limit;
  const { data, count } = await query.range(from, from + limit - 1);
  return { names: (data ?? []).map(mapRow), total: count ?? 0 };
}

export async function fetchNameBySlug(slug: string): Promise<NameEntry | null> {
  const { data } = await createServerSupabase()
    .from('names').select('*').eq('slug', slug).eq('status', 'approved').maybeSingle();
  return data ? mapRow(data as DbRow) : null;
}

export async function fetchRelatedNames(origin: string, excludeSlug: string, limit = 6): Promise<NameEntry[]> {
  const { data } = await createServerSupabase()
    .from('names').select('*').eq('origin', origin).eq('status', 'approved')
    .neq('slug', excludeSlug).order('popularity', { ascending: false }).limit(limit);
  return (data ?? []).map(r => mapRow(r as DbRow));
}
