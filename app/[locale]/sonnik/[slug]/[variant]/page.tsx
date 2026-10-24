import { notFound } from 'next/navigation';
import Link from 'next/link';
import { cache } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
  VARIANTS, VARIANT_META, getDreamEmoji, getSlugDate, ogImageUrl,
  getVariantIslamicFaqs, type DreamVariant,
} from '@/lib/discover';
import { User, Users, Calendar, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import { fetchDreamBySlug, fetchDreamTitles } from '@/lib/dreams-db';

const getDream = cache(fetchDreamBySlug);

export const revalidate = 86400;

// Empty list = render each variant on first visit, then serve it from the ISR cache
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string; variant: string }>;
}): Promise<Metadata> {
  const { locale, slug: rawSlug, variant } = await params;
  const slug = decodeURIComponent(rawSlug);
  if (!VARIANTS.includes(variant as DreamVariant)) return {};
  const dream = await getDream(slug, locale);
  if (!dream) return {};

  const title = dream.title;
  const short = dream.short;
  const meta  = VARIANT_META[variant as DreamVariant];

  const discoverTitle = locale === 'uz' ? meta.uzTitle(title, slug) : meta.ruTitle(title, slug);
  const discoverDesc  = locale === 'uz' ? meta.uzDesc(title, short) : meta.ruDesc(title, short);
  const emoji    = getDreamEmoji(slug, dream.tags ?? []);
  const imageUrl = ogImageUrl({ title: discoverTitle, emoji, type: 'dream', locale });
  const base     = locale === 'uz' ? 'https://www.ruyo.uz/uz' : 'https://www.ruyo.uz';
  const canonical = `${base}/sonnik/${slug}/${variant}`;

  return {
    title: discoverTitle,
    description: discoverDesc,
    alternates: {
      canonical,
      languages: {
        ru: `https://www.ruyo.uz/sonnik/${slug}/${variant}`,
        uz: `https://www.ruyo.uz/uz/sonnik/${slug}/${variant}`,
      },
    },
    openGraph: {
      title: discoverTitle,
      description: discoverDesc,
      type: 'article',
      url: canonical,
      siteName: 'Ruyo.uz',
      publishedTime: getSlugDate(`${slug}-${variant}`),
      modifiedTime: new Date().toISOString().split('T')[0],
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title: discoverTitle, description: discoverDesc, images: [imageUrl] },
  };
}

export default async function DreamVariantPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; variant: string }>;
}) {
  const { locale, slug: rawSlug, variant } = await params;
  setRequestLocale(locale);
  const slug = decodeURIComponent(rawSlug);
  if (!VARIANTS.includes(variant as DreamVariant)) notFound();
  const dream = await getDream(slug, locale);
  if (!dream) notFound();

  const t    = await getTranslations({ locale, namespace: 'sonnik' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  const content = {
    title:    dream.title,
    short:    dream.short,
    full:     dream.full,
    forWoman: dream.forWoman,
    forMan:   dream.forMan,
    byDay:    dream.byDay,
    tags:     dream.tags,
  };

  // Related dreams from Supabase
  const relatedDreams = await fetchDreamTitles(dream.related, locale);

  const base     = locale === 'uz' ? 'https://www.ruyo.uz/uz' : 'https://www.ruyo.uz';
  const meta     = VARIANT_META[variant as DreamVariant];
  const h1       = locale === 'uz' ? meta.uzH1(content.title) : meta.ruH1(content.title);
  const leadText = locale === 'uz'
    ? meta.uzLead(content.title, content.full)
    : meta.ruLead(content.title, content.full);

  const emoji    = getDreamEmoji(slug, dream.tags ?? []);
  const ogUrl    = ogImageUrl({ title: h1, emoji, type: 'dream', locale });
  const pubDate  = getSlugDate(`${slug}-${variant}`);
  const today    = new Date().toISOString().split('T')[0];

  // Gender-specific hero text
  const heroText = variant === 'dlya-zhenshchin' ? content.forWoman
    : variant === 'dlya-muzhchin' ? content.forMan
    : content.short;

  const DAY_LABELS: Record<string, string> = {
    monday: t('monday'), tuesday: t('tuesday'), wednesday: t('wednesday'),
    thursday: t('thursday'), friday: t('friday'), saturday: t('saturday'), sunday: t('sunday'),
  };

  // FAQs
  const faqs = variant === 'islamskiy'
    ? getVariantIslamicFaqs(content.title, content.forWoman, content.forMan, locale)
    : locale === 'uz' ? [
        { q: `Tushda ${content.title.toLowerCase()} ko'rish nima anglatadi?`, a: `${content.short} ${content.full}` },
        { q: variant === 'dlya-zhenshchin' ? `Ayol uchun bu tush yaxshimi?` : `Erkak uchun bu tush yaxshimi?`, a: heroText },
        { q: `Bu tush qachon keladi?`, a: content.byDay.monday ?? content.short },
      ] : [
        { q: `К чему снится ${content.title.toLowerCase()}?`, a: `${content.short} ${content.full}` },
        { q: variant === 'dlya-zhenshchin' ? `Хороший ли это сон для женщины?` : `Хороший ли это сон для мужчины?`, a: heroText },
        { q: `В какой день чаще снится ${content.title.toLowerCase()}?`, a: content.byDay.friday ?? content.short },
      ];


  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: h1,
    description: heroText.slice(0, 160),
    image: [ogUrl],
    author: { '@type': 'Organization', name: 'Ruyo.uz', url: 'https://www.ruyo.uz' },
    publisher: {
      '@type': 'Organization', name: 'Ruyo.uz', url: 'https://www.ruyo.uz',
      logo: { '@type': 'ImageObject', url: 'https://www.ruyo.uz/icon.png' },
    },
    datePublished: pubDate,
    dateModified: today,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': locale === 'uz'
        ? `https://www.ruyo.uz/uz/sonnik/${slug}/${variant}`
        : `https://www.ruyo.uz/sonnik/${slug}/${variant}`,
    },
  };

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ruyo.uz', item: 'https://www.ruyo.uz' },
      { '@type': 'ListItem', position: 2, name: tNav('sonnik'), item: `${base}/sonnik` },
      { '@type': 'ListItem', position: 3, name: content.title, item: `${base}/sonnik/${slug}` },
      { '@type': 'ListItem', position: 4, name: h1,            item: `${base}/sonnik/${slug}/${variant}` },
    ],
  };

  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const variantLabel = {
    'dlya-zhenshchin': locale === 'uz' ? 'Ayollar uchun' : 'Для женщин',
    'dlya-muzhchin':   locale === 'uz' ? 'Erkaklar uchun' : 'Для мужчин',
    'islamskiy':       locale === 'uz' ? 'Islomiy ta\'bir' : 'Исламский сонник',
  }[variant as DreamVariant];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-stone-400 mb-8 flex-wrap">
          <Link href={`/${locale}`} className="hover:text-stone-700 transition-colors">{tNav('home')}</Link>
          <span>/</span>
          <Link href={`/${locale}/sonnik`} className="hover:text-stone-700 transition-colors">{tNav('sonnik')}</Link>
          <span>/</span>
          <Link href={`/${locale}/sonnik/${slug}`} className="hover:text-stone-700 transition-colors">{content.title}</Link>
          <span>/</span>
          <span className="text-stone-700">{variantLabel}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main */}
          <div className="lg:col-span-2 space-y-5">

            {/* Hero */}
            <div className="bg-white rounded-3xl border border-stone-200 p-8 card-shadow">
              <div className="flex items-start gap-4">
                <span className="text-5xl">{emoji}</span>
                <div>
                  <span className="inline-block px-3 py-1 bg-violet-50 border border-violet-100 text-violet-600 text-xs font-medium rounded-full mb-2">
                    {variantLabel}
                  </span>
                  <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900 mb-3 leading-snug">
                    {h1}
                  </h1>
                  <p className="text-stone-600 leading-relaxed">{heroText}</p>
                </div>
              </div>
            </div>

            {/* Lead / general interpretation */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 card-shadow">
              <h2 className="font-serif text-xl font-semibold text-stone-900 mb-4">
                {locale === 'uz' ? 'Batafsil tafsir' : 'Подробное толкование'}
              </h2>
              <p className="text-stone-600 leading-relaxed">{leadText}</p>
            </div>

            {/* Gender cards for non-Islamic variants */}
            {variant !== 'islamskiy' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5">
                  <h3 className="font-semibold text-rose-700 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <User className="w-4 h-4" /> {t('for_woman')}
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">{content.forWoman}</p>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                  <h3 className="font-semibold text-blue-700 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <Users className="w-4 h-4" /> {t('for_man')}
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">{content.forMan}</p>
                </div>
              </div>
            )}

            {/* By day */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 card-shadow">
              <h2 className="font-serif text-xl font-semibold text-stone-900 mb-5 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-500" />
                {t('by_day')}
              </h2>
              <div className="divide-y divide-stone-100">
                {Object.entries(content.byDay).map(([day, meaning]) => (
                  <div key={day} className="py-3 flex gap-4">
                    <span className="shrink-0 font-semibold text-sm text-stone-400 w-28">{DAY_LABELS[day]}</span>
                    <span className="text-stone-600 text-sm leading-relaxed">{meaning}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 card-shadow">
              <h2 className="font-serif text-xl font-semibold text-stone-900 mb-5">
                {locale === 'uz' ? 'Ko\'p so\'raladigan savollar' : 'Часто задаваемые вопросы'}
              </h2>
              <div className="space-y-3">
                {faqs.map((faq) => (
                  <details key={faq.q} className="group border border-stone-100 rounded-xl overflow-hidden">
                    <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-medium text-stone-800 text-sm hover:bg-stone-50 transition-colors list-none">
                      <span>{faq.q}</span>
                      <span className="text-stone-400 group-open:rotate-180 transition-transform shrink-0 ml-2">▾</span>
                    </summary>
                    <div className="px-5 pb-4 pt-1 text-stone-600 text-sm leading-relaxed border-t border-stone-100">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>

            {/* Back to main + other variants */}
            <div className="bg-violet-50 border border-violet-100 rounded-2xl p-6">
              <p className="font-semibold text-stone-900 text-sm mb-3">
                {locale === 'uz' ? 'Boshqa talqinlar:' : 'Другие толкования:'}
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/${locale}/sonnik/${slug}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-sm text-stone-700 hover:border-violet-300 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  {locale === 'uz' ? 'Asosiy tafsir' : 'Основная статья'}
                </Link>
                {VARIANTS.filter((v) => v !== variant).map((v) => {
                  const label = {
                    'dlya-zhenshchin': locale === 'uz' ? 'Ayollar uchun' : 'Для женщин',
                    'dlya-muzhchin':   locale === 'uz' ? 'Erkaklar uchun' : 'Для мужчин',
                    'islamskiy':       locale === 'uz' ? 'Islomiy' : 'Исламский',
                  }[v];
                  return (
                    <Link
                      key={v}
                      href={`/${locale}/sonnik/${slug}/${v}`}
                      className="px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-sm text-stone-700 hover:border-violet-300 transition-colors"
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">

            {relatedDreams.length > 0 && (
              <div className="bg-white rounded-2xl border border-stone-200 p-5 card-shadow">
                <h3 className="font-semibold text-stone-900 mb-4 text-sm uppercase tracking-wide">
                  {t('similar_dreams')}
                </h3>
                <div className="space-y-1">
                  {relatedDreams.map((r) => (
                    <Link key={r.slug} href={`/${locale}/sonnik/${r.slug}`}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-stone-50 transition-colors group">
                      <span className="text-base">🌙</span>
                      <span className="text-sm text-stone-600 group-hover:text-violet-600 transition-colors">{r.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Horoscope CTA */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 text-center">
              <div className="text-3xl mb-2">⭐</div>
              <h3 className="font-semibold text-stone-900 mb-2">{t('horoscope_cta_title')}</h3>
              <p className="text-stone-500 text-sm mb-4">{t('horoscope_cta_desc')}</p>
              <Link
                href={`/${locale}/goroskop`}
                className="block px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-medium transition-colors"
              >
                {t('horoscope_cta_btn')}
              </Link>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 card-shadow">
              <h3 className="font-semibold text-stone-900 mb-3 text-sm uppercase tracking-wide">
                {locale === 'uz' ? 'Teglar' : 'Теги'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {content.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-full bg-violet-50 border border-violet-100 text-violet-600 text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
