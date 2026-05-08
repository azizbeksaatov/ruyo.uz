import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ORIGIN_LABELS } from '@/data/names';
import { fetchNameBySlug, fetchRelatedNames } from '@/lib/names-db';
import { getTranslations } from 'next-intl/server';
import { Heart, Star, Hash } from 'lucide-react';
import type { Metadata } from 'next';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const name = await fetchNameBySlug(slug);
  if (!name) return {};
  const t = await getTranslations({ locale, namespace: 'names' });
  return {
    title: `${t('meaning')} ${name.name}`,
    description: name.meaning.slice(0, 120),
    alternates: { canonical: `https://ruyo.uz/${locale}/imena/${slug}` },
  };
}

const ORIGIN_EMOJI: Record<string, string> = {
  uzbek: '🏔️', arabic: '🌙', persian: '🌸', turkic: '⭐',
  slavic: '🌾', greek: '🏛️', latin: '🦅', hebrew: '✡️', scandinavian: '❄️',
};

export default async function NamePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const name = await fetchNameBySlug(slug);
  if (!name) notFound();

  const t = await getTranslations({ locale, namespace: 'names' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });
  const localeKey = locale as 'ru' | 'uz';

  const relatedNames = await fetchRelatedNames(name.origin, name.slug, 6);
  const originLabel = ORIGIN_LABELS[name.origin][localeKey];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-stone-400 mb-8">
        <Link href={`/${locale}`} className="hover:text-stone-700 transition-colors">{tNav('home')}</Link>
        <span>/</span>
        <Link href={`/${locale}/imena`} className="hover:text-stone-700 transition-colors">{tNav('names')}</Link>
        <span>/</span>
        <span className="text-stone-700">{name.name}</span>
      </nav>

      {/* Hero */}
      <div className="bg-white rounded-3xl border border-stone-200 p-8 mb-6 card-shadow text-center">
        <div className="text-6xl mb-1">{ORIGIN_EMOJI[name.origin]}</div>
        <h1 className="font-serif text-5xl font-semibold text-stone-900 mb-4">{name.name}</h1>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-sm">
            {originLabel}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm ${
            name.gender === 'male'
              ? 'bg-blue-50 border border-blue-100 text-blue-700'
              : 'bg-rose-50 border border-rose-100 text-rose-700'
          }`}>
            {name.gender === 'male' ? t('male_full') : t('female_full')}
          </span>
          <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-sm">
            {t('element')}: {name.element}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">

          {/* Meaning */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 card-shadow">
            <h2 className="font-serif text-xl font-semibold text-stone-900 mb-4">{t('meaning')}</h2>
            <p className="text-stone-600 leading-relaxed">{name.meaning}</p>
          </div>

          {/* Character */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 card-shadow">
            <h2 className="font-serif text-xl font-semibold text-stone-900 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              {t('character')}
            </h2>
            <p className="text-stone-600 leading-relaxed">{name.character}</p>
          </div>

          {/* Lucky numbers */}
          <div className="bg-violet-50 border border-violet-100 rounded-2xl p-6">
            <h2 className="font-semibold text-stone-900 mb-4 flex items-center gap-2">
              <Hash className="w-5 h-5 text-violet-600" />
              {t('lucky_numbers')}
            </h2>
            <div className="flex items-center gap-3">
              {name.luckyNumbers.map((n) => (
                <div
                  key={n}
                  className="w-12 h-12 rounded-2xl bg-white border border-violet-200 flex items-center justify-center font-bold text-xl text-violet-700 card-shadow"
                >
                  {n}
                </div>
              ))}
            </div>
          </div>

          {/* Compatible names */}
          {name.compatibleNames.length > 0 && (
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6">
              <h2 className="font-semibold text-stone-900 mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500" />
                {t('compatible_names')}
              </h2>
              <div className="flex flex-wrap gap-2">
                {name.compatibleNames.map((n) => (
                  <span key={n} className="px-4 py-2 rounded-xl bg-white border border-rose-100 text-stone-700 font-medium text-sm">
                    {n}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {relatedNames.length > 0 && (
            <div className="bg-white rounded-2xl border border-stone-200 p-5 card-shadow">
              <h3 className="font-semibold text-stone-900 mb-4 text-sm uppercase tracking-wide">
                {t('other_names', { origin: originLabel.toLowerCase() })}
              </h3>
              <div className="space-y-1">
                {relatedNames.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/${locale}/imena/${r.slug}`}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-stone-50 transition-colors group"
                  >
                    <span className="font-medium text-stone-700 group-hover:text-teal-600 transition-colors">{r.name}</span>
                    <span className="text-xs text-stone-400">{r.gender === 'male' ? t('male_short') : t('female_short')}</span>
                  </Link>
                ))}
              </div>
              <Link
                href={`/${locale}/imena?origin=${name.origin}`}
                className="block mt-3 text-xs text-teal-600 font-medium hover:underline"
              >
                {t('all_origin_names', { origin: originLabel.toLowerCase() })}
              </Link>
            </div>
          )}

          {/* Sonnik CTA */}
          <div className="bg-stone-900 text-white rounded-2xl p-5 text-center">
            <div className="text-3xl mb-2">🌙</div>
            <h3 className="font-semibold mb-1">{t('sonnik_cta_title')}</h3>
            <p className="text-stone-400 text-sm mb-4">{t('sonnik_cta_desc')}</p>
            <Link
              href={`/${locale}/sonnik`}
              className="block px-4 py-2 bg-white text-stone-900 hover:bg-stone-100 rounded-xl text-sm font-medium transition-colors"
            >
              {t('sonnik_cta_btn')}
            </Link>
          </div>

          {/* Goroskop CTA */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 text-center">
            <div className="text-3xl mb-2">⭐</div>
            <h3 className="font-semibold text-stone-900 mb-1">{t('goroskop_cta_title')}</h3>
            <p className="text-stone-500 text-sm mb-4">{t('goroskop_cta_desc')}</p>
            <Link
              href={`/${locale}/goroskop`}
              className="block px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-medium transition-colors"
            >
              {t('goroskop_cta_btn')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
