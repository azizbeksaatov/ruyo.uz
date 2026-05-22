import { MetadataRoute } from 'next';
import { dreams } from '@/data/dreams';
import { zodiacSigns } from '@/data/horoscopes';
import { viralTests } from '@/data/tests';
import { getSlugDate, VARIANTS } from '@/lib/discover';
import { createServerSupabase } from '@/lib/supabase';

const BASE_URL = 'https://ruyo.uz';
const locales = ['ru', 'uz'];
const NOW = new Date();

async function fetchNameSlugs(): Promise<string[]> {
  const { data } = await createServerSupabase()
    .from('names').select('slug').eq('status', 'approved').order('slug');
  return (data ?? []).map((r: { slug: string }) => r.slug);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const nameSlugs = await fetchNameSlugs();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    const prefix = locale === 'ru' ? '' : '/uz';

    // Static pages
    entries.push(
      { url: `${BASE_URL}${prefix}/`,        lastModified: NOW, changeFrequency: 'daily',  priority: 1.0 },
      { url: `${BASE_URL}${prefix}/sonnik`,  lastModified: NOW, changeFrequency: 'daily',  priority: 0.9 },
      { url: `${BASE_URL}${prefix}/goroskop`,lastModified: NOW, changeFrequency: 'daily',  priority: 0.9 },
      { url: `${BASE_URL}${prefix}/imena`,   lastModified: NOW, changeFrequency: 'weekly', priority: 0.8 },
      { url: `${BASE_URL}${prefix}/testy`,   lastModified: NOW, changeFrequency: 'weekly', priority: 0.8 },
    );

    // Dream pages — weekly so Google recrawls and picks up freshness signals
    for (const dream of dreams) {
      entries.push({
        url: `${BASE_URL}${prefix}/sonnik/${dream.slug}`,
        lastModified: new Date(getSlugDate(dream.slug)),
        changeFrequency: 'weekly',
        priority: 0.75,
      });

      // Dream variant sub-pages (dlya-zhenshchin, dlya-muzhchin, islamskiy)
      for (const variant of VARIANTS) {
        entries.push({
          url: `${BASE_URL}${prefix}/sonnik/${dream.slug}/${variant}`,
          lastModified: new Date(getSlugDate(dream.slug)),
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
    }

    // Horoscope pages — daily (content changes every day)
    for (const sign of zodiacSigns) {
      entries.push({
        url: `${BASE_URL}${prefix}/goroskop/${sign.slug}`,
        lastModified: NOW,
        changeFrequency: 'daily',
        priority: 0.85,
      });
    }

    // Name pages — from Supabase (all approved names)
    for (const slug of nameSlugs) {
      entries.push({
        url: `${BASE_URL}${prefix}/imena/${slug}`,
        lastModified: new Date(getSlugDate(slug)),
        changeFrequency: 'monthly',
        priority: 0.65,
      });
    }

    // Test pages
    for (const test of viralTests) {
      entries.push({
        url: `${BASE_URL}${prefix}/testy/${test.slug}`,
        lastModified: new Date(getSlugDate(test.slug)),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  return entries;
}
