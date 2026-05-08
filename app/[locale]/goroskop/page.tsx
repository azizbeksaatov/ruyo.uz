import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { zodiacSigns } from '@/data/horoscopes';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'goroskop' });
  return {
    title: t('title_today'),
    description: t('subtitle'),
  };
}

export default async function GoroskopPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'goroskop' });

  const periods = [
    { slug: 'na-segodnya',  emoji: '☀️', label: t('today'),         desc: t('today_desc') },
    { slug: 'na-nedelyu',   emoji: '📅', label: t('week'),           desc: t('week_desc') },
    { slug: 'na-mesyac',    emoji: '🌙', label: t('month'),          desc: t('month_desc') },
    { slug: 'lyubovny',     emoji: '❤️', label: t('love'),           desc: t('love_desc') },
    { slug: 'sovmestimost', emoji: '💑', label: t('compatibility'),  desc: t('compat_desc') },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="mb-10">
        <p className="text-amber-600 text-sm font-medium uppercase tracking-wide mb-2">{t('label')}</p>
        <h1 className="font-serif text-4xl font-semibold text-stone-900 mb-3">
          {t('title_today')}
        </h1>
        <p className="text-stone-500 max-w-xl">
          {t('subtitle')}
        </p>
      </div>

      {/* Period cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
        {periods.map((p) => (
          <Link
            key={p.slug}
            href={`/${locale}/goroskop/${p.slug}`}
            className="group p-5 rounded-2xl bg-white border border-stone-200 hover:border-amber-300 hover:shadow-md transition-all card-shadow text-center"
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{p.emoji}</div>
            <div className="font-semibold text-stone-900 text-sm mb-1">{p.label}</div>
            <div className="text-xs text-stone-400">{p.desc}</div>
          </Link>
        ))}
      </div>

      {/* Personal horoscope banner */}
      <Link
        href={`/${locale}/goroskop/personalnyy`}
        className="group flex items-center gap-5 p-5 mb-12 rounded-2xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 hover:border-violet-400 hover:shadow-md transition-all"
      >
        <div className="text-4xl group-hover:scale-110 transition-transform shrink-0">✨</div>
        <div className="flex-1">
          <div className="font-semibold text-violet-900 mb-1">{t('personal_title')}</div>
          <div className="text-sm text-violet-600">{t('personal_subtitle')}</div>
        </div>
        <div className="text-violet-400 text-sm font-medium shrink-0">→</div>
      </Link>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-10">
        <div className="flex-1 h-px bg-stone-200" />
        <span className="text-stone-400 text-sm font-medium">{t('choose_sign_divider')}</span>
        <div className="flex-1 h-px bg-stone-200" />
      </div>

      {/* Signs grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {zodiacSigns.map((sign) => (
          <Link
            key={sign.slug}
            href={`/${locale}/goroskop/${sign.slug}`}
            className="group p-5 rounded-2xl bg-white border border-stone-200 hover:border-amber-300 hover:shadow-md transition-all card-shadow"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{sign.emoji}</div>
            <div className="font-semibold text-stone-900 mb-0.5">{locale === 'uz' ? sign.uz : sign.ru}</div>
            <div className="text-xs text-stone-400 mb-3">{sign.dates}</div>
            <div className="flex flex-wrap gap-1">
              {sign.traits.slice(0, 2).map((trait) => (
                <span key={trait} className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs">
                  {trait}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
