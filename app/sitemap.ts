import { MetadataRoute } from 'next';
import { dreams } from '@/data/dreams';
import { zodiacSigns } from '@/data/horoscopes';
import { names } from '@/data/names';
import { viralTests } from '@/data/tests';
import { getSlugDate, VARIANTS } from '@/lib/discover';

const BASE_URL = 'https://ruyo.uz';
const locales = ['ru', 'uz'];
const NOW = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
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

    // Name pages
    for (const name of names) {
      entries.push({
        url: `${BASE_URL}${prefix}/imena/${name.slug}`,
        lastModified: new Date(getSlugDate(name.slug)),
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
