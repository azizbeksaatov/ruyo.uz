import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ALPHABET_RU } from '@/lib/utils';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';
import { fetchDreamsListing, fetchDreamLetters, DREAMS_PAGE_SIZE } from '@/lib/dreams-db';

export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'sonnik' });
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: {
      canonical: locale === 'uz' ? 'https://www.ruyo.uz/uz/sonnik' : 'https://www.ruyo.uz/sonnik',
      languages: { ru: 'https://www.ruyo.uz/sonnik', uz: 'https://www.ruyo.uz/uz/sonnik' },
    },
  };
}

export default async function SonnikPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; letter?: string; page?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { q, letter, page: pageStr } = await searchParams;

  // Auto-switch locale based on script
  if (q?.trim()) {
    const hasCyr = /[Ѐ-ӿ]/.test(q);
    const hasLat = /[a-zA-Z]/.test(q);
    if (locale === 'ru' && hasLat && !hasCyr) redirect(`/uz/sonnik?q=${encodeURIComponent(q)}`);
    if (locale === 'uz' && hasCyr)           redirect(`/sonnik?q=${encodeURIComponent(q)}`);
  }

  const page = Math.max(1, parseInt(pageStr ?? '1') || 1);
  const t = await getTranslations({ locale, namespace: 'sonnik' });

  const [{ dreams: displayDreams, total }, uzAlphabet] = await Promise.all([
    fetchDreamsListing({ q, letter, locale, page }),
    locale === 'uz' ? fetchDreamLetters('uz') : Promise.resolve<string[]>([]),
  ]);

  const totalPages = Math.ceil(total / DREAMS_PAGE_SIZE);
  const sonnikBase = locale === 'ru' ? '/sonnik' : `/${locale}/sonnik`;

  function pageUrl(p: number) {
    const parts: string[] = [];
    if (q) parts.push(`q=${encodeURIComponent(q)}`);
    if (letter) parts.push(`letter=${encodeURIComponent(letter)}`);
    if (p > 1) parts.push(`page=${p}`);
    return parts.length ? `${sonnikBase}?${parts.join('&')}` : sonnikBase;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="mb-10">
        <p className="text-violet-600 text-sm font-medium uppercase tracking-wide mb-2">{t('label')}</p>
        <h1 className="font-serif text-4xl font-semibold text-stone-900 mb-3">
          {t('title_full')}
        </h1>
        <p className="text-stone-500 max-w-xl">{t('subtitle')}</p>
      </div>

      {/* Search */}
      <form className="relative max-w-xl mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input
          name="q"
          type="text"
          defaultValue={q}
          placeholder={t('search_placeholder')}
          className="w-full pl-11 pr-28 py-3 bg-white border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 text-sm card-shadow"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {t('search_btn')}
        </button>
      </form>

      {/* Alphabet */}
      <div className="flex flex-wrap gap-1.5 mb-10">
        <a
          href={sonnikBase}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${!letter && !q ? 'bg-violet-600 text-white' : 'bg-white border border-stone-200 text-stone-600 hover:border-violet-300 hover:text-violet-600'}`}
        >
          {t('alphabet_all')}
        </a>
        {(locale === 'uz' ? uzAlphabet : ALPHABET_RU).map((char) => (
          <a
            key={char}
            href={`${sonnikBase}?letter=${encodeURIComponent(char)}`}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${letter === char ? 'bg-violet-600 text-white' : 'bg-white border border-stone-200 text-stone-600 hover:border-violet-300 hover:text-violet-600'}`}
          >
            {char}
          </a>
        ))}
      </div>

      {(q || letter) && (
        <p className="text-stone-500 text-sm mb-6">
          {q
            ? t('search_results', { q })
            : locale === 'uz'
            ? `«${letter}» harfidan boshlanuvchi:`
            : `Буква «${letter?.toUpperCase()}»:`}{' '}
          <span className="font-medium text-stone-900">{total}</span> {t('dreams_suffix')}
        </p>
      )}

      {displayDreams.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          <div className="text-5xl mb-4">🌙</div>
          <p className="font-medium text-stone-600 mb-2">{t('not_found')}</p>
          <Link href={sonnikBase} className="text-violet-600 hover:underline text-sm">
            {t('see_all')}
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayDreams.map((dream) => (
              <Link
                key={dream.slug}
                href={`${sonnikBase}/${dream.slug}`}
                className="group p-5 rounded-2xl bg-white border border-stone-200 hover:border-violet-200 hover:shadow-md transition-all card-shadow"
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">🌙</span>
                  <div className="min-w-0">
                    <h2 className="font-semibold text-stone-900 group-hover:text-violet-700 transition-colors">
                      {dream.title}
                    </h2>
                    <p className="text-sm text-stone-500 mt-1 line-clamp-2 leading-relaxed">{dream.short}</p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {dream.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-full bg-violet-50 text-violet-600 text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-12">
              {page > 1 ? (
                <Link
                  href={pageUrl(page - 1)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-stone-200 text-stone-700 text-sm font-medium hover:border-violet-300 hover:text-violet-600 transition-colors card-shadow"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {locale === 'uz' ? 'Oldingi' : 'Назад'}
                </Link>
              ) : (
                <span className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-stone-100 text-stone-300 text-sm font-medium cursor-not-allowed">
                  <ChevronLeft className="w-4 h-4" />
                  {locale === 'uz' ? 'Oldingi' : 'Назад'}
                </span>
              )}

              <span className="text-sm text-stone-500 px-2">
                {locale === 'uz' ? `${page} / ${totalPages} sahifa` : `Страница ${page} из ${totalPages}`}
              </span>

              {page < totalPages ? (
                <Link
                  href={pageUrl(page + 1)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-stone-200 text-stone-700 text-sm font-medium hover:border-violet-300 hover:text-violet-600 transition-colors card-shadow"
                >
                  {locale === 'uz' ? 'Keyingi' : 'Вперёд'}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <span className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-stone-100 text-stone-300 text-sm font-medium cursor-not-allowed">
                  {locale === 'uz' ? 'Keyingi' : 'Вперёд'}
                  <ChevronRight className="w-4 h-4" />
                </span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
