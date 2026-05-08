import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { viralTests } from '@/data/tests';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'tests' });
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function TestsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'tests' });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="mb-10">
        <p className="text-pink-600 text-sm font-medium uppercase tracking-wide mb-2">{t('label')}</p>
        <h1 className="font-serif text-4xl font-semibold text-stone-900 mb-3">
          {t('title')}
        </h1>
        <p className="text-stone-500 max-w-xl">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {viralTests.map((test) => (
          <Link
            key={test.slug}
            href={`/${locale}/testy/${test.slug}`}
            className="group p-7 rounded-3xl bg-white border border-stone-200 hover:border-pink-200 hover:shadow-lg transition-all card-shadow flex flex-col"
          >
            <div className="text-5xl mb-4">{test.emoji}</div>
            <span className="inline-block text-xs text-pink-600 font-medium bg-pink-50 px-3 py-1 rounded-full mb-3 self-start">
              {test.category}
            </span>
            <h2 className="font-serif text-xl font-semibold text-stone-900 mb-2 group-hover:text-pink-700 transition-colors leading-snug">
              {test.title}
            </h2>
            <p className="text-sm text-stone-500 leading-relaxed flex-1">{test.description}</p>
            <div className="mt-5 flex items-center gap-2 text-sm font-medium text-pink-600">
              {t('take_test')}
              <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
