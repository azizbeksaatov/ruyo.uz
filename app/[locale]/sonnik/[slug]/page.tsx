import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getDreamBySlug, dreams } from '@/data/dreams';
import { getTranslations } from 'next-intl/server';
import { User, Users, Calendar } from 'lucide-react';
import type { Metadata } from 'next';
import DreamAiInterpreter from '@/components/DreamAiInterpreter';

export async function generateStaticParams() {
  return dreams.map((dream) => ({ slug: dream.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const dream = getDreamBySlug(slug);
  if (!dream) return {};
  const t = await getTranslations({ locale, namespace: 'sonnik' });
  return {
    title: `${t('dream_prefix')} ${dream.title.toLowerCase()} — ${t('dream_meaning')}`,
    description: dream.short,
    alternates: { canonical: `https://ruyo.uz/${locale}/sonnik/${slug}` },
    openGraph: { title: `${t('dream_prefix')} ${dream.title.toLowerCase()} — Ruyo.uz`, description: dream.short },
  };
}

export default async function DreamPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const dream = getDreamBySlug(slug);
  if (!dream) notFound();

  const t = await getTranslations({ locale, namespace: 'sonnik' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  const DAY_LABELS: Record<string, string> = {
    monday: t('monday'), tuesday: t('tuesday'), wednesday: t('wednesday'),
    thursday: t('thursday'), friday: t('friday'), saturday: t('saturday'), sunday: t('sunday'),
  };

  const relatedDreams = dreams.filter((d) => dream.related.includes(d.slug)).slice(0, 5);
  const otherDreams = dreams.filter((d) => d.letter === dream.letter && d.slug !== dream.slug).slice(0, 6);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${t('dream_prefix')} ${dream.title}`,
    description: dream.short,
    author: { '@type': 'Organization', name: 'Ruyo.uz' },
    publisher: { '@type': 'Organization', name: 'Ruyo.uz', url: 'https://ruyo.uz' },
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://ruyo.uz/${locale}/sonnik/${dream.slug}` },
  };

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ruyo.uz', item: 'https://ruyo.uz' },
      { '@type': 'ListItem', position: 2, name: tNav('sonnik'), item: `https://ruyo.uz/${locale}/sonnik` },
      { '@type': 'ListItem', position: 3, name: dream.title, item: `https://ruyo.uz/${locale}/sonnik/${dream.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-stone-400 mb-8">
          <Link href={`/${locale}`} className="hover:text-stone-700 transition-colors">{tNav('home')}</Link>
          <span>/</span>
          <Link href={`/${locale}/sonnik`} className="hover:text-stone-700 transition-colors">{tNav('sonnik')}</Link>
          <span>/</span>
          <span className="text-stone-700">{dream.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main */}
          <div className="lg:col-span-2 space-y-5">

            {/* Hero card */}
            <div className="bg-white rounded-3xl border border-stone-200 p-8 card-shadow">
              <div className="flex items-start gap-4">
                <span className="text-5xl">🌙</span>
                <div>
                  <p className="text-violet-600 text-sm font-medium mb-1">{t('ruyo_label')}</p>
                  <h1 className="font-serif text-3xl font-semibold text-stone-900 mb-3">
                    {t('dream_prefix')} {dream.title.toLowerCase()}
                  </h1>
                  <p className="text-stone-600 text-lg leading-relaxed">{dream.short}</p>
                </div>
              </div>
            </div>

            {/* Full interpretation */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 card-shadow">
              <h2 className="font-serif text-xl font-semibold text-stone-900 mb-4">{t('detailed')}</h2>
              <p className="text-stone-600 leading-relaxed">{dream.full}</p>
            </div>

            {/* For woman / man */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5">
                <h3 className="font-semibold text-rose-700 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                  <User className="w-4 h-4" /> {t('for_woman')}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">{dream.forWoman}</p>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                <h3 className="font-semibold text-blue-700 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                  <Users className="w-4 h-4" /> {t('for_man')}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">{dream.forMan}</p>
              </div>
            </div>

            {/* By day */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 card-shadow">
              <h2 className="font-serif text-xl font-semibold text-stone-900 mb-5 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-500" />
                {t('by_day')}
              </h2>
              <div className="divide-y divide-stone-100">
                {Object.entries(dream.byDay).map(([day, meaning]) => (
                  <div key={day} className="py-3 flex gap-4">
                    <span className="shrink-0 font-semibold text-sm text-stone-400 w-28">{DAY_LABELS[day]}</span>
                    <span className="text-stone-600 text-sm leading-relaxed">{meaning}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Interpreter */}
            <DreamAiInterpreter locale={locale} dreamTitle={dream.title} />

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {dream.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-violet-50 border border-violet-100 text-violet-600 text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">

            {relatedDreams.length > 0 && (
              <div className="bg-white rounded-2xl border border-stone-200 p-5 card-shadow">
                <h3 className="font-semibold text-stone-900 mb-4 text-sm uppercase tracking-wide">{t('similar_dreams')}</h3>
                <div className="space-y-1">
                  {relatedDreams.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/${locale}/sonnik/${r.slug}`}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-stone-50 transition-colors group"
                    >
                      <span className="text-base">🌙</span>
                      <span className="text-sm text-stone-600 group-hover:text-violet-600 transition-colors">{r.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {otherDreams.length > 0 && (
              <div className="bg-white rounded-2xl border border-stone-200 p-5 card-shadow">
                <h3 className="font-semibold text-stone-900 mb-4 text-sm uppercase tracking-wide">«{dream.letter}»</h3>
                <div className="space-y-1">
                  {otherDreams.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/${locale}/sonnik/${r.slug}`}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-stone-50 transition-colors group"
                    >
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
          </div>
        </div>
      </div>
    </>
  );
}
