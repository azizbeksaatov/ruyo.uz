import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { ORIGIN_LABELS } from '@/data/names';
import type { NameOrigin } from '@/data/names';
import { fetchNames } from '@/lib/names-db';
import { Search } from 'lucide-react';
import type { Metadata } from 'next';
import NameNotFound from '@/components/NameNotFound';
import NameSubmitForm from '@/components/NameSubmitForm';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'names' });
  return { title: t('title'), description: t('subtitle') };
}

const origins: NameOrigin[] = ['uzbek', 'arabic', 'persian', 'turkic', 'slavic', 'greek', 'latin', 'hebrew', 'scandinavian'];

const ORIGIN_EMOJI: Record<NameOrigin, string> = {
  uzbek: '🏔️', arabic: '🌙', persian: '🌸', turkic: '⭐',
  slavic: '🌾', greek: '🏛️', latin: '🦅', hebrew: '✡️', scandinavian: '❄️',
};

const LIMIT = 120;

const CYRILLIC_LETTERS = ['А','Б','В','Г','Д','Е','Ж','З','И','К','Л','М','Н','О','П','Р','С','Т','У','Ф','Х','Ц','Ч','Ш','Э','Ю','Я'];

export default async function NamesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ origin?: string; q?: string; letter?: string; page?: string }>;
}) {
  const { locale } = await params;
  const { origin, q, letter, page: pageStr } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'names' });
  const page = Math.max(1, parseInt(pageStr ?? '1') || 1);

  const { names: filteredNames, total } = await fetchNames({ origin, q, letter, page, limit: LIMIT });
  const totalPages = Math.ceil(total / LIMIT);

  const notFound = !!q && filteredNames.length === 0;
  const localeKey = locale as 'ru' | 'uz';

  function pageHref(p: number) {
    const sp = new URLSearchParams();
    if (origin) sp.set('origin', origin);
    if (q) sp.set('q', q);
    if (letter) sp.set('letter', letter);
    if (p > 1) sp.set('page', String(p));
    const qs = sp.toString();
    return `/${locale}/imena${qs ? `?${qs}` : ''}`;
  }

  function letterHref(l: string) {
    const sp = new URLSearchParams();
    if (origin) sp.set('origin', origin);
    sp.set('letter', l);
    return `/${locale}/imena?${sp.toString()}`;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-teal-600 text-sm font-medium uppercase tracking-wide mb-2">{t('label')}</p>
          <h1 className="font-serif text-4xl font-semibold text-stone-900 mb-3">{t('title')}</h1>
          <p className="text-stone-500 max-w-xl">{t('subtitle')}</p>
        </div>
        <NameSubmitForm locale={locale} />
      </div>

      {/* Search */}
      <form className="relative max-w-xl mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input
          name="q"
          type="text"
          defaultValue={q}
          placeholder={t('search')}
          className="w-full pl-11 pr-28 py-3 bg-white border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 text-sm card-shadow"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {t('search_btn')}
        </button>
      </form>

      {/* Origin filter */}
      <div className="flex flex-wrap gap-2 mb-10">
        <Link
          href={`/${locale}/imena`}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${!origin && !q ? 'bg-teal-600 text-white' : 'bg-white border border-stone-200 text-stone-600 hover:border-teal-300 hover:text-teal-700'}`}
        >
          {t('all_names')} {!origin && !q && total > 0 && <span className="opacity-70 text-xs">({total})</span>}
        </Link>
        {origins.map((orig) => (
          <Link
            key={orig}
            href={`/${locale}/imena?origin=${orig}`}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${origin === orig ? 'bg-teal-600 text-white' : 'bg-white border border-stone-200 text-stone-600 hover:border-teal-300 hover:text-teal-700'}`}
          >
            <span>{ORIGIN_EMOJI[orig]}</span>
            {ORIGIN_LABELS[orig][localeKey]}
          </Link>
        ))}
      </div>

      {/* Alphabet bar */}
      <div className="flex flex-wrap gap-1 mb-8">
        <Link
          href={`/${locale}/imena${origin ? `?origin=${origin}` : ''}`}
          className={`px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${!letter && !q ? 'bg-teal-600 text-white' : 'bg-white border border-stone-200 text-stone-500 hover:border-teal-300 hover:text-teal-700'}`}
        >
          Все
        </Link>
        {CYRILLIC_LETTERS.map((l) => (
          <Link
            key={l}
            href={letterHref(l)}
            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${letter === l ? 'bg-teal-600 text-white' : 'bg-white border border-stone-200 text-stone-500 hover:border-teal-300 hover:text-teal-700'}`}
          >
            {l}
          </Link>
        ))}
      </div>

      {q && !notFound && (
        <p className="text-stone-500 text-sm mb-6">
          {t('search_results', { q })} <span className="font-medium text-stone-900">{total}</span> {t('names_suffix')}
        </p>
      )}

      {notFound && q && (
        <div className="mb-8">
          <NameNotFound query={q} locale={locale} />
        </div>
      )}

      {!notFound && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNames.map((name) => (
              <Link
                key={name.slug}
                href={`/${locale}/imena/${name.slug}`}
                className="group p-5 rounded-2xl bg-white border border-stone-200 hover:border-teal-200 hover:shadow-md transition-all card-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <h2 className="text-xl font-serif font-semibold text-stone-900 group-hover:text-teal-700 transition-colors">
                    {name.name}
                  </h2>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    name.gender === 'male'   ? 'bg-blue-50 text-blue-600' :
                    name.gender === 'female' ? 'bg-rose-50 text-rose-600' :
                    'bg-stone-100 text-stone-500'
                  }`}>
                    {name.gender === 'male' ? t('male_short') : name.gender === 'female' ? t('female_short') : ''}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-stone-400 mb-3">
                  <span>{ORIGIN_EMOJI[name.origin]}</span>
                  <span>{ORIGIN_LABELS[name.origin][localeKey]}</span>
                </div>
                <p className="text-sm text-stone-600 line-clamp-2 leading-relaxed">{name.meaning}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {name.luckyNumbers.slice(0, 3).map((n) => (
                      <span key={n} className="w-6 h-6 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-xs text-teal-600 font-medium">
                        {n}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-teal-600 font-medium group-hover:underline">{t('details')}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {page > 1 && (
                <Link href={pageHref(page - 1)} className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 hover:border-teal-300 text-sm font-medium transition-colors">
                  ←
                </Link>
              )}
              {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                const p = totalPages <= 7 ? i + 1 : page <= 4 ? i + 1 : page >= totalPages - 3 ? totalPages - 6 + i : page - 3 + i;
                return (
                  <Link
                    key={p}
                    href={pageHref(p)}
                    className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-colors ${p === page ? 'bg-teal-600 text-white' : 'border border-stone-200 text-stone-600 hover:border-teal-300'}`}
                  >
                    {p}
                  </Link>
                );
              })}
              {page < totalPages && (
                <Link href={pageHref(page + 1)} className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 hover:border-teal-300 text-sm font-medium transition-colors">
                  →
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
