import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSignBySlug, getHoroscopeForToday, getCompatibility, zodiacSigns } from '@/data/horoscopes';
import { weeklyHoroscopes, monthlyHoroscopes } from '@/data/horoscopesExtended';
import { zodiacSignsUz, dailyPoolUz, weeklyHoroscopesUz, monthlyHoroscopesUz } from '@/data/horoscopes-uz';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getHoroscopeDiscoverTitle, ogImageUrl } from '@/lib/discover';
import { fetchHoroscope } from '@/lib/horoscopes-db';
import { Heart, DollarSign, Activity, Lightbulb } from 'lucide-react';
import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import TelegramBanner from '@/components/TelegramBanner';

function getDayIndex() {
  return Math.floor(Date.now() / 86400000) % 4;
}

export async function generateStaticParams() {
  const signParams = zodiacSigns.map((s) => ({ slug: s.slug }));
  const periodParams = ['na-segodnya', 'na-nedelyu', 'lyubovny', 'sovmestimost', 'na-mesyac'].map((slug) => ({ slug }));
  return [...signParams, ...periodParams];
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ period?: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const { period } = await searchParams;
  const sign = getSignBySlug(slug);
  const t = await getTranslations({ locale, namespace: 'goroskop' });

  if (!sign) {
    const siteBase = locale === 'uz' ? 'https://www.ruyo.uz/uz' : 'https://www.ruyo.uz';
    const specialMeta: Record<string, { title: string; description: string }> = {
      'na-segodnya': {
        title: locale === 'uz' ? 'Bugungi munajjimlar bashorati barcha belgilar uchun | Ruyo.uz' : 'Гороскоп на сегодня — все знаки зодиака | Ruyo.uz',
        description: locale === 'uz' ? 'Barcha 12 zodiak belgisi uchun bugungi bashorat. Muhabbat, moliya va sog\'liq bo\'yicha prognoz.' : 'Гороскоп на сегодня для всех 12 знаков зодиака. Прогноз по любви, финансам и здоровью.',
      },
      'na-nedelyu': {
        title: locale === 'uz' ? 'Haftalik munajjimlar bashorati barcha belgilar | Ruyo.uz' : 'Гороскоп на неделю — все знаки зодиака | Ruyo.uz',
        description: locale === 'uz' ? 'Joriy hafta uchun barcha zodiak belgilari bashorati.' : 'Еженедельный гороскоп для всех знаков зодиака на текущую неделю.',
      },
      'na-mesyac': {
        title: locale === 'uz' ? 'Oylik munajjimlar bashorati barcha belgilar | Ruyo.uz' : 'Гороскоп на месяц — все знаки зодиака | Ruyo.uz',
        description: locale === 'uz' ? 'Joriy oy uchun barcha zodiak belgilari bashorati.' : 'Гороскоп на текущий месяц для всех знаков зодиака.',
      },
      'lyubovny': {
        title: locale === 'uz' ? 'Muhabbat munajjimlar bashorati barcha belgilar | Ruyo.uz' : 'Любовный гороскоп — все знаки зодиака | Ruyo.uz',
        description: locale === 'uz' ? 'Barcha zodiak belgilari uchun muhabbat va munosabatlar bashorati.' : 'Любовный гороскоп для всех знаков зодиака — отношения и чувства.',
      },
      'sovmestimost': {
        title: locale === 'uz' ? 'Zodiak belgilari muvofiqligi | Ruyo.uz' : 'Совместимость знаков зодиака | Ruyo.uz',
        description: locale === 'uz' ? 'Zodiak belgilari bo\'yicha munosabatlardagi muvofiqlikni bilib oling.' : 'Узнайте совместимость знаков зодиака в отношениях и любви.',
      },
    };
    const meta = specialMeta[slug];
    if (!meta) return { title: t('title') };
    const canonical = `${siteBase}/goroskop/${slug}`;
    return {
      title: meta.title,
      description: meta.description,
      alternates: {
        canonical,
        languages: {
          ru: `https://www.ruyo.uz/goroskop/${slug}`,
          uz: `https://www.ruyo.uz/uz/goroskop/${slug}`,
        },
      },
      openGraph: { title: meta.title, description: meta.description, url: canonical, siteName: 'Ruyo.uz' },
    };
  }

  const signName = locale === 'uz' ? sign.uz : sign.ru;
  const periodLabel = period === 'week' ? (locale === 'uz' ? 'hafta' : 'неделя') : period === 'month' ? (locale === 'uz' ? 'oy' : 'месяц') : null;
  const discoverTitle = periodLabel
    ? (locale === 'uz' ? `${signName} burji ${periodLabel}lik goroskopi | Ruyo.uz` : `Гороскоп ${signName} на ${periodLabel} | Ruyo.uz`)
    : getHoroscopeDiscoverTitle(signName, slug, locale);
  const discoverDesc = locale === 'uz'
    ? `${signName} burji: muhabbat, moliya va sog'liq bo'yicha prognoz. ${sign.emoji} Ruyo.uz`
    : `${signName}: прогноз — любовь, финансы, здоровье. ${sign.emoji} Ruyo.uz`;
  const imageUrl = ogImageUrl({ title: discoverTitle, emoji: sign.emoji, type: 'horoscope', locale });
  const canonical = locale === 'uz' ? `https://www.ruyo.uz/uz/goroskop/${slug}` : `https://www.ruyo.uz/goroskop/${slug}`;
  const today = new Date().toISOString().split('T')[0];

  return {
    title: discoverTitle,
    description: discoverDesc,
    alternates: {
      canonical,
      languages: {
        ru: `https://www.ruyo.uz/goroskop/${slug}`,
        uz: `https://www.ruyo.uz/uz/goroskop/${slug}`,
      },
    },
    openGraph: {
      title: discoverTitle,
      description: discoverDesc,
      type: 'article',
      url: canonical,
      siteName: 'Ruyo.uz',
      publishedTime: today,
      modifiedTime: today,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: signName }],
    },
    twitter: {
      card: 'summary_large_image',
      title: discoverTitle,
      description: discoverDesc,
      images: [imageUrl],
    },
  };
}

export default async function HoroscopePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ period?: string; s1?: string; s2?: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const { period, s1, s2 } = await searchParams;

  const specialPages: Record<string, ReactElement> = {
    'na-segodnya':   <AllSignsPage locale={locale} period="today" />,
    'na-nedelyu':    <AllSignsPage locale={locale} period="week" />,
    'na-mesyac':     <AllSignsPage locale={locale} period="month" />,
    'lyubovny':      <AllSignsPage locale={locale} period="love" />,
    'sovmestimost':  <CompatibilityPage locale={locale} s1={s1} s2={s2} />,
  };
  if (specialPages[slug]) return specialPages[slug];

  const sign = getSignBySlug(slug);
  if (!sign) notFound();

  const t = await getTranslations({ locale, namespace: 'goroskop' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });
  const signName = locale === 'uz' ? sign.uz : sign.ru;

  // Determine active period
  const activePeriod: 'daily' | 'weekly' | 'monthly' =
    period === 'week' ? 'weekly' : period === 'month' ? 'monthly' : 'daily';

  // Try DB first, fall back to static data
  const dbRow = await fetchHoroscope(slug, activePeriod, locale).catch(() => null);

  const hRu = getHoroscopeForToday(slug);
  const uzMeta = zodiacSignsUz[slug];
  const uzDaily = dailyPoolUz[slug];
  const uzWeekly = weeklyHoroscopesUz[slug];
  const uzMonthly = monthlyHoroscopesUz[slug];

  const dates = locale === 'uz' && uzMeta ? uzMeta.datesUz : sign.dates;
  const element = locale === 'uz' && uzMeta ? uzMeta.elementUz : sign.element;
  const planet = locale === 'uz' && uzMeta ? uzMeta.planetUz : sign.planet;
  const traits = locale === 'uz' && uzMeta ? uzMeta.traitsUz : sign.traits;
  const description = locale === 'uz' && uzMeta ? uzMeta.descriptionUz : sign.description;

  // Content resolution: DB row > static data
  const generalText = dbRow?.general ?? (
    locale === 'uz' && uzDaily ? uzDaily[getDayIndex()] :
    activePeriod === 'weekly' ? (weeklyHoroscopes[slug]?.general ?? hRu.general) :
    activePeriod === 'monthly' ? (monthlyHoroscopes[slug]?.general ?? hRu.general) :
    hRu.general
  );
  const loveText = dbRow?.love ?? (locale === 'uz' ? (uzWeekly?.love ?? hRu.love) : hRu.love);
  const financeText = dbRow?.finance ?? (locale === 'uz' ? (uzWeekly?.finance ?? hRu.finance) : hRu.finance);
  const healthText = dbRow?.health ?? (locale === 'uz' ? (uzWeekly?.health ?? hRu.health) : hRu.health);
  const adviceText = dbRow?.advice ?? (locale === 'uz' ? (uzMonthly?.advice ?? uzWeekly?.advice ?? hRu.advice) : hRu.advice);
  const luckyColor = dbRow?.lucky_color ?? (locale === 'uz' && uzWeekly ? uzWeekly.luckyColor : hRu.luckyColor);
  const luckyNumber = dbRow?.lucky_number ?? hRu.luckyNumber;

  const otherSigns = zodiacSigns.filter((s) => s.slug !== slug).slice(0, 8);

  const siteBase = locale === 'uz' ? 'https://www.ruyo.uz/uz' : 'https://www.ruyo.uz';

  const periodNavItems = [
    { key: undefined,   label: locale === 'uz' ? 'Bugun' : 'Сегодня',   href: `/${locale}/goroskop/${slug}` },
    { key: 'week',      label: locale === 'uz' ? 'Hafta' : 'Неделя',    href: `/${locale}/goroskop/${slug}?period=week` },
    { key: 'month',     label: locale === 'uz' ? 'Oy' : 'Месяц',        href: `/${locale}/goroskop/${slug}?period=month` },
  ];

  const periodTitle = activePeriod === 'weekly'
    ? (locale === 'uz' ? 'Haftalik goroskop' : 'Гороскоп на неделю')
    : activePeriod === 'monthly'
    ? (locale === 'uz' ? 'Oylik goroskop' : 'Гороскоп на месяц')
    : (locale === 'uz' ? 'Bugungi goroskop' : 'Гороскоп на сегодня');

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ruyo.uz', item: 'https://www.ruyo.uz' },
      { '@type': 'ListItem', position: 2, name: tNav('goroskop'), item: `${siteBase}/goroskop` },
      { '@type': 'ListItem', position: 3, name: signName, item: `${siteBase}/goroskop/${slug}` },
    ],
  };

  const articleData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${periodTitle} ${signName}`,
    description: `${signName}: ${t('love_label')}, ${t('finance_label')}, ${t('health_label')}. Ruyo.uz`,
    author: { '@type': 'Organization', name: 'Ruyo.uz' },
    publisher: { '@type': 'Organization', name: 'Ruyo.uz', url: 'https://www.ruyo.uz' },
    datePublished: new Date().toISOString().split('T')[0],
    dateModified: new Date().toISOString().split('T')[0],
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteBase}/goroskop/${slug}` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleData) }} />
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-stone-400 mb-6">
        <Link href={`/${locale}`} className="hover:text-stone-700 transition-colors">{tNav('home')}</Link>
        <span>/</span>
        <Link href={`/${locale}/goroskop`} className="hover:text-stone-700 transition-colors">{tNav('goroskop')}</Link>
        <span>/</span>
        <span className="text-stone-700">{signName}</span>
      </nav>

      {/* Hero */}
      <div className="bg-white rounded-3xl border border-stone-200 p-8 mb-6 card-shadow text-center">
        <div className="text-7xl mb-4">{sign.emoji}</div>
        <p className="text-amber-600 text-sm font-medium uppercase tracking-wide mb-1">{periodTitle}</p>
        <h1 className="font-serif text-3xl font-semibold text-stone-900 mb-2">{signName}</h1>
        <p className="text-stone-500 text-sm mb-5">{dates}</p>
        <div className="flex flex-wrap justify-center gap-2 mb-5">
          <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-sm">{element}</span>
          <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-sm">{planet}</span>
          <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-sm">🍀 {luckyNumber}</span>
          <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-sm capitalize">🎨 {luckyColor}</span>
        </div>
        {/* Period switcher */}
        <div className="flex justify-center gap-1">
          {periodNavItems.map((item) => {
            const isActive = item.key === period;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-amber-500 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-amber-50 hover:text-amber-700'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* General */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 mb-5">
        <h2 className="font-semibold text-stone-900 mb-3">{t('general_forecast')}</h2>
        <p className="text-stone-700 leading-relaxed">{generalText}</p>
      </div>

      {/* 3 spheres */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        {[
          { icon: Heart,      color: 'rose',  label: t('love_label'),    text: loveText },
          { icon: DollarSign, color: 'green', label: t('finance_label'), text: financeText },
          { icon: Activity,   color: 'blue',  label: t('health_label'),  text: healthText },
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
          <p className="text-stone-600 text-sm leading-relaxed">{adviceText}</p>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 mb-8 card-shadow">
        <h2 className="font-serif text-xl font-semibold text-stone-900 mb-3">{t('about_sign')} {signName}</h2>
        <p className="text-stone-600 leading-relaxed mb-4">{description}</p>
        <div className="flex flex-wrap gap-2">
          {traits.map((trait) => (
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
              href={`/${locale}/goroskop/${s.slug}${period ? `?period=${period}` : ''}`}
              className="flex flex-col items-center p-3 rounded-xl bg-white border border-stone-200 hover:border-amber-300 hover:bg-amber-50 transition-all text-center group"
            >
              <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{s.emoji}</span>
              <span className="text-xs text-stone-500 group-hover:text-amber-700">{locale === 'uz' ? s.uz : s.ru}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
      <TelegramBanner locale={locale} />
    </>
  );
}

/* ─── Sub-pages ─── */

async function AllSignsPage({ locale, period }: { locale: string; period: string }) {
  const t = await getTranslations({ locale, namespace: 'goroskop' });

  const cfg: Record<string, { title: string; source: 'today' | 'week' | 'month' | 'love'; linkPeriod?: string }> = {
    today: { title: t('period_today_title'), source: 'today' },
    week:  { title: t('period_week_title'),  source: 'week',  linkPeriod: 'week' },
    month: { title: t('period_month_title'), source: 'month', linkPeriod: 'month' },
    love:  { title: t('period_love_title'),  source: 'love' },
  };
  const { title, source, linkPeriod } = cfg[period] ?? cfg.today;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <p className="text-amber-600 text-sm font-medium uppercase tracking-wide mb-2">{t('label')}</p>
        <h1 className="font-serif text-4xl font-semibold text-stone-900">{title}</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {zodiacSigns.map((sign) => {
          const hRu = source === 'week'
            ? weeklyHoroscopes[sign.slug]
            : source === 'month'
              ? monthlyHoroscopes[sign.slug]
              : getHoroscopeForToday(sign.slug);
          const uzW = weeklyHoroscopesUz[sign.slug];
          const uzM = monthlyHoroscopesUz[sign.slug];
          const uzD = dailyPoolUz[sign.slug];
          const uzMeta = zodiacSignsUz[sign.slug];
          let text: string;
          if (locale === 'uz') {
            if (source === 'week') text = uzW?.general ?? hRu.general;
            else if (source === 'month') text = uzM?.general ?? hRu.general;
            else if (source === 'love') text = uzW?.love ?? hRu.love;
            else text = uzD ? uzD[Math.floor(Date.now() / 86400000) % 4] : hRu.general;
          } else {
            if (source === 'week') text = hRu.general;
            else if (source === 'month') text = hRu.general;
            else if (source === 'love') text = hRu.love;
            else text = hRu.general;
          }
          const signDates = locale === 'uz' && uzMeta ? uzMeta.datesUz : sign.dates;
          const href = linkPeriod
            ? `/${locale}/goroskop/${sign.slug}?period=${linkPeriod}`
            : `/${locale}/goroskop/${sign.slug}`;
          return (
            <Link
              key={sign.slug}
              href={href}
              className="group p-5 rounded-2xl bg-white border border-stone-200 hover:border-amber-300 hover:shadow-md transition-all card-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl group-hover:scale-110 transition-transform">{sign.emoji}</span>
                <div>
                  <div className="font-semibold text-stone-900">{locale === 'uz' ? sign.uz : sign.ru}</div>
                  <div className="text-xs text-stone-400">{signDates}</div>
                </div>
              </div>
              <p className="text-sm text-stone-600 line-clamp-3 leading-relaxed">{text}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

async function CompatibilityPage({
  locale,
  s1,
  s2,
}: {
  locale: string;
  s1?: string;
  s2?: string;
}) {
  const t = await getTranslations({ locale, namespace: 'goroskop' });
  const base = `/${locale}/goroskop/sovmestimost`;

  const sign1 = s1 ? zodiacSigns.find((z) => z.slug === s1) : null;
  const sign2 = s2 ? zodiacSigns.find((z) => z.slug === s2) : null;

  // State 3: both signs selected — show result
  if (sign1 && sign2) {
    const result = getCompatibility(s1!, s2!, locale);
    const barColor = result.level === 'high' ? 'bg-green-500' : 'bg-amber-400';
    const textColor = result.level === 'high' ? 'text-green-600' : 'text-amber-600';
    const swapped = `${base}?s1=${s2}&s2=${s1}`;

    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-6">
          <p className="text-pink-600 text-sm font-medium uppercase tracking-wide mb-2">{t('compat_label')}</p>
          <h1 className="font-serif text-3xl font-semibold text-stone-900">{t('compat_title')}</h1>
        </div>

        {/* Two sign cards */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="flex-1 flex flex-col items-center p-5 rounded-2xl bg-white border border-stone-200 card-shadow">
            <span className="text-5xl mb-2">{sign1.emoji}</span>
            <div className="font-semibold text-stone-900">{locale === 'uz' ? sign1.uz : sign1.ru}</div>
            <div className="text-xs text-stone-400 mt-0.5">{locale === 'uz' ? (zodiacSignsUz[sign1.slug]?.datesUz ?? sign1.dates) : sign1.dates}</div>
          </div>
          <div className="text-stone-300 text-2xl font-light">+</div>
          <div className="flex-1 flex flex-col items-center p-5 rounded-2xl bg-white border border-stone-200 card-shadow">
            <span className="text-5xl mb-2">{sign2.emoji}</span>
            <div className="font-semibold text-stone-900">{locale === 'uz' ? sign2.uz : sign2.ru}</div>
            <div className="text-xs text-stone-400 mt-0.5">{locale === 'uz' ? (zodiacSignsUz[sign2.slug]?.datesUz ?? sign2.dates) : sign2.dates}</div>
          </div>
        </div>

        {/* Result block */}
        <div className="bg-white rounded-2xl border border-stone-200 card-shadow p-6 mb-6">
          <div className={`text-5xl font-bold text-center mb-1 ${textColor}`}>{result.percent}%</div>
          <div className={`text-center font-semibold mb-4 ${textColor}`}>{result.title}</div>

          {/* Progress bar */}
          <div className="h-3 rounded-full bg-stone-100 overflow-hidden mb-5">
            <div
              className={`h-full rounded-full transition-all ${barColor}`}
              style={{ width: `${result.percent}%` }}
            />
          </div>

          <p className="text-stone-600 text-sm leading-relaxed text-center">{result.description}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={swapped}
            className="flex-1 text-center py-3 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-sm font-medium transition-all"
          >
            {locale === 'uz' ? 'Joylarni almashtirish' : 'Поменять местами'}
          </Link>
          <Link
            href={base}
            className="flex-1 text-center py-3 rounded-xl bg-pink-600 text-white hover:bg-pink-700 text-sm font-medium transition-all"
          >
            {locale === 'uz' ? "Boshqa juftlikni tekshirish" : 'Проверить другую пару'}
          </Link>
        </div>
      </div>
    );
  }

  // State 2: first sign selected, picking second
  if (sign1) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <p className="text-pink-600 text-sm font-medium uppercase tracking-wide mb-2">{t('compat_label')}</p>
          <h1 className="font-serif text-3xl font-semibold text-stone-900 mb-1">{t('compat_title')}</h1>
        </div>

        {/* Selected sign */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-pink-50 border border-pink-200 mb-2">
          <span className="text-4xl">{sign1.emoji}</span>
          <div>
            <div className="text-xs text-pink-500 font-medium uppercase tracking-wide mb-0.5">
              {locale === 'uz' ? 'Siz tanladingiz' : 'Вы выбрали'}
            </div>
            <div className="font-semibold text-stone-900">{locale === 'uz' ? sign1.uz : sign1.ru}</div>
          </div>
          <Link href={base} className="ml-auto text-xs text-stone-400 hover:text-stone-600 underline">
            {locale === 'uz' ? "O'zgartirish" : 'Изменить'}
          </Link>
        </div>

        <p className="text-stone-500 text-sm mb-5">
          {locale === 'uz' ? 'Endi ikkinchi belgini tanlang:' : 'Теперь выберите второй знак:'}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {zodiacSigns
            .filter((z) => z.slug !== s1)
            .map((sign) => (
              <Link
                key={sign.slug}
                href={`${base}?s1=${s1}&s2=${sign.slug}`}
                className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-stone-200 hover:border-pink-200 hover:bg-pink-50 transition-all card-shadow group"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">{sign.emoji}</span>
                <div>
                  <div className="font-semibold text-stone-900 group-hover:text-pink-700">{locale === 'uz' ? sign.uz : sign.ru}</div>
                  <div className="text-xs text-stone-400">{locale === 'uz' ? (zodiacSignsUz[sign.slug]?.datesUz ?? sign.dates) : sign.dates}</div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    );
  }

  // State 1: default — pick first sign
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <p className="text-pink-600 text-sm font-medium uppercase tracking-wide mb-2">{t('compat_label')}</p>
        <h1 className="font-serif text-4xl font-semibold text-stone-900 mb-3">{t('compat_title')}</h1>
        <p className="text-stone-500">{t('compat_subtitle')}</p>
      </div>
      <p className="text-stone-500 text-sm mb-5">
        {locale === 'uz' ? 'Birinchi belgini tanlang:' : 'Выберите первый знак:'}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {zodiacSigns.map((sign) => (
          <Link
            key={sign.slug}
            href={`${base}?s1=${sign.slug}`}
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
