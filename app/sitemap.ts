import { MetadataRoute } from 'next';
import { dreams } from '@/data/dreams';
import { zodiacSigns } from '@/data/horoscopes';
import { names } from '@/data/names';
import { viralTests } from '@/data/tests';

const BASE_URL = 'https://ruyo.uz';
const locales = ['ru', 'uz'];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  for (const locale of locales) {
    const prefix = locale === 'ru' ? '' : '/uz';
    entries.push(
      { url: `${BASE_URL}${prefix}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
      { url: `${BASE_URL}${prefix}/sonnik`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
      { url: `${BASE_URL}${prefix}/goroskop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
      { url: `${BASE_URL}${prefix}/imena`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
      { url: `${BASE_URL}${prefix}/testy`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    );

    // Dream pages
    for (const dream of dreams) {
      entries.push({
        url: `${BASE_URL}${prefix}/sonnik/${dream.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }

    // Horoscope pages
    for (const sign of zodiacSigns) {
      entries.push({
        url: `${BASE_URL}${prefix}/goroskop/${sign.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      });
    }

    // Name pages
    for (const name of names) {
      entries.push({
        url: `${BASE_URL}${prefix}/imena/${name.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }

    // Test pages
    for (const test of viralTests) {
      entries.push({
        url: `${BASE_URL}${prefix}/testy/${test.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  return entries;
}
