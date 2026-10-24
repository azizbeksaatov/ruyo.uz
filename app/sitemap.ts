import { MetadataRoute } from 'next';
import { zodiacSigns } from '@/data/horoscopes';
import { fetchAllDreamSlugs } from '@/lib/dreams-db';
import { viralTests } from '@/data/tests';
import { getSlugDate, VARIANTS } from '@/lib/discover';
import { createServerSupabase } from '@/lib/supabase';

const BASE_URL = 'https://www.ruyo.uz';
const locales = ['ru', 'uz'];
const NOW = new Date();

async function fetchNameSlugs(): Promise<string[]> {
  const { data } = await createServerSupabase()
    .from('names').select('slug').eq('status', 'approved').order('slug');
  return (data ?? []).map((r: { slug: string }) => r.slug);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [nameSlugs, dreamSlugs] = await Promise.all([fetchNameSlugs(), fetchAllDreamSlugs()]);
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    const prefix = locale === 'ru' ? '' : '/uz';

    // Static pages
    entries.push(
      { url: prefix ? `${BASE_URL}${prefix}` : BASE_URL, lastModified: NOW, changeFrequency: 'daily',  priority: 1.0 },
      { url: `${BASE_URL}${prefix}/sonnik`,               lastModified: NOW, changeFrequency: 'daily',  priority: 0.9 },
      { url: `${BASE_URL}${prefix}/goroskop`,             lastModified: NOW, changeFrequency: 'daily',  priority: 0.9 },
      { url: `${BASE_URL}${prefix}/goroskop/personalnyy`, lastModified: NOW, changeFrequency: 'monthly',priority: 0.6 },
      { url: `${BASE_URL}${prefix}/imena`,                lastModified: NOW, changeFrequency: 'weekly', priority: 0.8 },
      { url: `${BASE_URL}${prefix}/testy`,                lastModified: NOW, changeFrequency: 'weekly', priority: 0.8 },
      { url: `${BASE_URL}${prefix}/about`,                lastModified: NOW, changeFrequency: 'monthly',priority: 0.3 },
      { url: `${BASE_URL}${prefix}/privacy`,              lastModified: NOW, changeFrequency: 'monthly',priority: 0.3 },
    );

    // Dream pages — weekly so Google recrawls and picks up freshness signals
    for (const slug of dreamSlugs) {
      entries.push({
        url: `${BASE_URL}${prefix}/sonnik/${slug}`,
        lastModified: new Date(getSlugDate(slug)),
        changeFrequency: 'weekly',
        priority: 0.75,
      });

      // Variant sub-pages omitted from sitemap intentionally — Google finds them
      // via internal links; keeping 3018 thin-variant URLs out of sitemap frees
      // crawl budget for the 500+ main dream pages and other priority content.
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
