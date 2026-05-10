import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSignBySlug, getHoroscopeForToday, zodiacSigns } from '@/data/horoscopes';
import { weeklyHoroscopes, monthlyHoroscopes } from '@/data/horoscopesExtended';
import { getTranslations } from 'next-intl/server';
import { Heart, DollarSign, Activity, Lightbulb } from 'lucide-react';
import type { Metadata } from 'next';
import type { ReactElement } from 'react';

export async function generateStaticParams() {
  const signParams = zodiacSigns.map((s) => ({ slug: s.slug }));
  const periodParams = ['na-segodnya', 'na-nedelyu', 'lyubovny', 'sovmestimost', 'na-mesyac'].map((slug) => ({ slug }));
  return [...signParams, ...periodParams];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const sign = getSignBySlug(slug);
  const t = await getTranslations({ locale, namespace: 'goroskop' });
  if (!sign) return { title: t('title') };
  return {
    title: `${t('title')} ${locale === 'uz' ? sign.uz : sign.ru} — ${t('today')}`,
    description: `${locale === 'uz' ? sign.uz : sign.ru}: ${t('love_label')}, ${t('finance_label')}, ${t('health_label')}. Ruyo.uz`,
    alternates: { canonical: `https://ruyo.uz/${locale}/goroskop/${slug}` },
  };
}

export default async function HoroscopePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;

  const specialPages: Record<string, ReactElement> = {
    'na-segodnya':   <AllSignsPage locale={locale} period="today" />,
    'na-nedelyu':    <AllSignsPage locale={locale} period="week" />,
    'na-mesyac':     <AllSignsPage locale={locale} period="month" />,
    'lyubovny':      <AllSignsPage locale={locale} period="love" />,
    'sovmestimost':  <CompatibilityPage locale={locale} />,
  };
  if (specialPages[slug]) return specialPages[slug];

  const sign = getSignBySlug(slug);
  if (!sign) notFound();

  const t = await getTranslations({ locale, namespace: 'goroskop' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });
  const signName = locale === 'uz' ? sign.uz : sign.ru;

  const h = getHoroscopeForToday(slug);
  const otherSigns = zodiacSigns.filter((s) => s.slug !== slug).slice(0, 8);

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ruyo.uz', item: 'https://ruyo.uz' },
      { '@type': 'ListItem', position: 2, name: tNav('goroskop'), item: `https://ruyo.uz/${locale}/goroskop` },
      { '@type': 'ListItem', position: 3, name: signName, item: `https://ruyo.uz/${locale}/goroskop/${slug}` },
    ],
  };

  const articleData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Гороскоп ${signName} — ${t('today')}`,
    description: `${signName}: ${t('love_label')}, ${t('finance_label')}, ${t('health_label')}. Ruyo.uz`,
    author: { '@type': 'Organization', name: 'Ruyo.uz' },
    publisher: { '@type': 'Organization', name: 'Ruyo.uz', url: 'https://ruyo.uz' },
    datePublished: new Date().toISOString().split('T')[0],
    dateModified: new Date().toISOString().split('T')[0],
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://ruyo.uz/${locale}/goroskop/${slug}` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleData) }} />
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-stone-400 mb-8">
        <Link href={`/${locale}`} className="hover:text-stone-700 transition-colors">{tNav('home')}</Link>
        <span>/</span>
        <Link href={`/${locale}/goroskop`} className="hover:text-stone-700 transition-colors">{tNav('goroskop')}</Link>
        <span>/</span>
        <span className="text-stone-700">{signName}</span>
      </nav>

      {/* Hero */}
      <div className="bg-white rounded-3xl border border-stone-200 p-8 mb-6 card-shadow text-center">
        <div className="text-7xl mb-4">{sign.emoji}</div>
        <p className="text-amber-600 text-sm font-medium uppercase tracking-wide mb-1">{t('hero_label')}</p>
        <h1 className="font-serif text-3xl font-semibold text-stone-900 mb-2">{signName}</h1>
        <p className="text-stone-500 text-sm mb-5">{sign.dates}</p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-sm">
            {sign.element}
          </span>
          <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-sm">
            {sign.planet}
          </span>
          <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-sm">
            🍀 {h.luckyNumber}
          </span>
          <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-sm capitalize">
            🎨 {h.luckyColor}
          </span>
        </div>
      </div>

      {/* General */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 mb-5">
        <h2 className="font-semibold text-stone-900 mb-3">{t('general_forecast')}</h2>
        <p className="text-stone-700 leading-relaxed">{h.general}</p>
      </div>

      {/* 3 spheres */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        {[
          { icon: Heart,      color: 'rose',  label: t('love_label'),    text: h.love },
          { icon: DollarSign, color: 'green', label: t('finance_label'), text: h.finance },
          { icon: Activity,   color: 'blue',  label: t('health_label'),  text: h.health },
        ].map(({ icon: Icon, color, label, text }) => (
          <div key={label} className="bg-white border border-stone-200 rounded-2xl p-5 card-shadow">
            <div className={`flex items-center gap-2 mb-3 text-${color}-600`}>
              <Icon className="w-4 h-4" />
              <span className="font-semibold text-sm">{label}</span>
            </div>
            <p className="text-stone-600 text-sm leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      {/* Advice */}
      <div className="bg-violet-50 border border-violet-100 rounded-2xl p-5 mb-8 flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-stone-900 text-sm mb-1">{t('daily_advice')}</p>
          <p className="text-stone-600 text-sm leading-relaxed">{h.advice}</p>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 mb-8 card-shadow">
        <h2 className="font-serif text-xl font-semibold text-stone-900 mb-3">{t('about_sign')} {signName}</h2>
        <p className="text-stone-600 leading-relaxed mb-4">{sign.description}</p>
        <div className="flex flex-wrap gap-2">
          {sign.traits.map((trait) => (
            <span key={trait} className="px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-sm">
              {trait}
            </span>
          ))}
        </div>
      </div>

      {/* Other signs */}
      <div>
        <h3 className="font-semibold text-stone-900 mb-4">{t('other_signs')}</h3>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {otherSigns.map((s) => (
            <Link
              key={s.slug}
              href={`/${locale}/goroskop/${s.slug}`}
              className="flex flex-col items-center p-3 rounded-xl bg-white border border-stone-200 hover:border-amber-300 hover:bg-amber-50 transition-all text-center group"
            >
              <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{s.emoji}</span>
              <span className="text-xs text-stone-500 group-hover:text-amber-700">{locale === 'uz' ? s.uz : s.ru}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}

/* ─── Sub-pages ─── */

async function AllSignsPage({ locale, period }: { locale: string; period: string }) {
  const t = await getTranslations({ locale, namespace: 'goroskop' });

  const cfg: Record<string, { title: string; key: 'general' | 'love' | 'finance' | 'health'; source: 'today' | 'week' | 'month' }> = {
    today: { title: t('period_today_title'), key: 'general', source: 'today' },
    week:  { title: t('period_week_title'),  key: 'general', source: 'week' },
    month: { title: t('period_month_title'), key: 'general', source: 'month' },
    love:  { title: t('period_love_title'),  key: 'love',    source: 'today' },
  };
  const { title, key, source } = cfg[period] ?? cfg.today;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <p className="text-amber-600 text-sm font-medium uppercase tracking-wide mb-2">{t('label')}</p>
        <h1 className="font-serif text-4xl font-semibold text-stone-900">{title}</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {zodiacSigns.map((sign) => {
          const h = source === 'week'
            ? weeklyHoroscopes[sign.slug]
            : source === 'month'
              ? monthlyHoroscopes[sign.slug]
              : getHoroscopeForToday(sign.slug);
          return (
            <Link
              key={sign.slug}
              href={`/${locale}/goroskop/${sign.slug}`}
              className="group p-5 rounded-2xl bg-white border border-stone-200 hover:border-amber-300 hover:shadow-md transition-all card-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl group-hover:scale-110 transition-transform">{sign.emoji}</span>
                <div>
                  <div className="font-semibold text-stone-900">{locale === 'uz' ? sign.uz : sign.ru}</div>
                  <div className="text-xs text-stone-400">{sign.dates}</div>
                </div>
              </div>
              <p className="text-sm text-stone-600 line-clamp-3 leading-relaxed">{h[key]}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

async function CompatibilityPage({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'goroskop' });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <p className="text-pink-600 text-sm font-medium uppercase tracking-wide mb-2">{t('compat_label')}</p>
        <h1 className="font-serif text-4xl font-semibold text-stone-900 mb-3">
          {t('compat_title')}
        </h1>
        <p className="text-stone-500">{t('compat_subtitle')}</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {zodiacSigns.map((sign) => (
          <Link
            key={sign.slug}
            href={`/${locale}/goroskop/${sign.slug}`}
            className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-stone-200 hover:border-pink-200 hover:bg-pink-50 transition-all card-shadow group"
          >
            <span className="text-3xl group-hover:scale-110 transition-transform">{sign.emoji}</span>
            <div>
              <div className="font-semibold text-stone-900 group-hover:text-pink-700">{locale === 'uz' ? sign.uz : sign.ru}</div>
              <div className="text-xs text-stone-400">{sign.dates}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
