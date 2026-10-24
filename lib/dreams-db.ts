import { createServerSupabase } from './supabase';

export const TRENDING_DREAM_SLUGS = ['zmeya', 'zuby', 'voda', 'sobaka', 'more', 'polet', 'dengi', 'beremennost'];

interface DreamRow {
  slug: string;
  title: string; title_uz?: string | null;
  letter: string; letter_uz?: string | null;
  short: string; short_uz?: string | null;
  full_text: string; full_text_uz?: string | null;
  for_woman: string; for_woman_uz?: string | null;
  for_man: string; for_man_uz?: string | null;
  by_day: Record<string, string>; by_day_uz?: Record<string, string> | null;
  tags: string[]; tags_uz?: string[] | null;
  related: string[];
  ibn_sirin?: string | null; ibn_sirin_uz?: string | null;
}

export interface DreamData {
  slug: string;
  title: string; letter: string;
  short: string; full: string;
  forWoman: string; forMan: string;
  byDay: Record<string, string>;
  tags: string[]; related: string[];
  ibnSirin?: string | null;
}

function localize(row: DreamRow, locale: string): DreamData {
  const uz = locale === 'uz';
  return {
    slug: row.slug,
    title:    (uz && row.title_uz)     ? row.title_uz     : row.title,
    letter:   (uz && row.letter_uz)    ? row.letter_uz    : row.letter,
    short:    (uz && row.short_uz)     ? row.short_uz     : row.short,
    full:     (uz && row.full_text_uz)  ? row.full_text_uz : row.full_text,
    forWoman: (uz && row.for_woman_uz) ? row.for_woman_uz : row.for_woman,
    forMan:   (uz && row.for_man_uz)   ? row.for_man_uz   : row.for_man,
    byDay:    (uz && row.by_day_uz)    ? (row.by_day_uz as Record<string, string>) : row.by_day,
    tags:     (uz && row.tags_uz?.length) ? row.tags_uz! : row.tags,
    related:  row.related,
    ibnSirin: uz ? (row.ibn_sirin_uz ?? row.ibn_sirin) : row.ibn_sirin,
  };
}

export async function fetchDreamBySlug(slug: string, locale = 'ru'): Promise<DreamData | null> {
  const { data } = await createServerSupabase()
    .from('dreams').select('*').eq('slug', slug).eq('status', 'approved').maybeSingle();
  return data ? localize(data as unknown as DreamRow, locale) : null;
}

export async function fetchDreamTitles(
  slugs: string[], locale = 'ru'
): Promise<{ slug: string; title: string }[]> {
  if (!slugs.length) return [];
  const { data } = await createServerSupabase()
    .from('dreams').select('slug,title,title_uz').in('slug', slugs).eq('status', 'approved');
  return (data ?? []).map((d: Record<string, unknown>) => ({
    slug: d.slug as string,
    title: (locale === 'uz' && d.title_uz) ? d.title_uz as string : d.title as string,
  }));
}

export async function fetchDreamsByLetter(
  letter: string, excludeSlug: string, locale = 'ru', limit = 6
): Promise<{ slug: string; title: string }[]> {
  const col = locale === 'uz' ? 'letter_uz' : 'letter';
  const { data } = await createServerSupabase()
    .from('dreams').select('slug,title,title_uz')
    .eq(col, letter).eq('status', 'approved').neq('slug', excludeSlug).limit(limit);
  return (data ?? []).map((d: Record<string, unknown>) => ({
    slug: d.slug as string,
    title: (locale === 'uz' && d.title_uz) ? d.title_uz as string : d.title as string,
  }));
}

export async function fetchAllDreamSlugs(): Promise<string[]> {
  const { data } = await createServerSupabase()
    .from('dreams').select('slug').eq('status', 'approved');
  return (data ?? []).map((d: Record<string, unknown>) => d.slug as string);
}

// For home/sidebar preview — returns slug + title + short
export async function fetchDreamsPreview(
  slugs: string[], locale = 'ru'
): Promise<{ slug: string; title: string; short: string }[]> {
  if (!slugs.length) return [];
  const { data } = await createServerSupabase()
    .from('dreams').select('slug,title,title_uz,short,short_uz')
    .in('slug', slugs).eq('status', 'approved');
  return (data ?? []).map((d: Record<string, unknown>) => ({
    slug: d.slug as string,
    title: (locale === 'uz' && d.title_uz) ? d.title_uz as string : d.title as string,
    short: (locale === 'uz' && d.short_uz) ? d.short_uz as string : d.short as string,
  }));
}

// For home page — returns random dreams, changes each ISR cycle
export async function fetchRandomDreams(
  count = 8, locale = 'ru'
): Promise<{ slug: string; title: string; short: string }[]> {
  const sb = createServerSupabase();
  const uz = locale === 'uz';

  const { count: total } = await sb
    .from('dreams').select('*', { count: 'exact', head: true }).eq('status', 'approved');
  if (!total) return [];

  // Random offset across the full table, fetch a pool then shuffle to avoid alphabetical clusters
  const poolSize = Math.min(60, total);
  const offset = Math.floor(Math.random() * Math.max(1, total - poolSize));

  const { data } = await sb
    .from('dreams')
    .select('slug,title,title_uz,short,short_uz')
    .eq('status', 'approved')
    .order('id')
    .range(offset, offset + poolSize - 1);

  if (!data?.length) return [];

  // Fisher-Yates shuffle
  const pool = [...data];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, count).map((d: Record<string, unknown>) => ({
    slug: d.slug as string,
    title: (uz && d.title_uz) ? d.title_uz as string : d.title as string,
    short: (uz && d.short_uz) ? d.short_uz as string : d.short as string,
  }));
}

export const DREAMS_PAGE_SIZE = 50;

// For listing page
export async function fetchDreamsListing(opts: {
  q?: string; letter?: string; locale?: string; page?: number;
}): Promise<{ dreams: { slug: string; title: string; short: string; tags: string[] }[]; total: number }> {
  const { q, letter, locale = 'ru', page = 1 } = opts;
  const uz = locale === 'uz';
  const from = (page - 1) * DREAMS_PAGE_SIZE;
  const to = from + DREAMS_PAGE_SIZE - 1;

  let query = createServerSupabase()
    .from('dreams')
    .select('slug,title,title_uz,short,short_uz,tags,tags_uz,letter,letter_uz', { count: 'exact' })
    .eq('status', 'approved')
    .order(uz ? 'title_uz' : 'title')
    .range(from, to);

  if (letter) query = query.eq(uz ? 'letter_uz' : 'letter', letter);
  if (q) query = query.ilike(uz ? 'title_uz' : 'title', `%${q}%`);

  const { data, count } = await query;
  const dreams = (data ?? []).map((d: Record<string, unknown>) => ({
    slug: d.slug as string,
    title: (uz && d.title_uz) ? d.title_uz as string : d.title as string,
    short: (uz && d.short_uz) ? d.short_uz as string : d.short as string,
    tags: ((uz && (d.tags_uz as string[])?.length) ? d.tags_uz : d.tags) as string[],
  }));
  return { dreams, total: count ?? 0 };
}

// For daily telegram/home rotating content — deterministic by day
export async function fetchDreamOfDay(locale = 'ru'): Promise<DreamData | null> {
  const start = new Date(new Date().getFullYear(), 0, 1).getTime();
  const dayOfYear = Math.floor((Date.now() - start) / 86400000);
  const offset = dayOfYear % 503;
  const { data } = await createServerSupabase()
    .from('dreams').select('*').eq('status', 'approved').order('id').range(offset, offset);
  return data?.[0] ? localize(data[0] as unknown as DreamRow, locale) : null;
}

// Distinct letters for alphabet nav
export async function fetchDreamLetters(locale = 'ru'): Promise<string[]> {
  const col = locale === 'uz' ? 'letter_uz' : 'letter';
  const { data } = await createServerSupabase()
    .from('dreams').select(col).eq('status', 'approved').not(col, 'is', null);
  const letters = [...new Set((data ?? []).map((d: Record<string, unknown>) => d[col] as string))]
    .filter(Boolean).sort();
  return letters;
}
