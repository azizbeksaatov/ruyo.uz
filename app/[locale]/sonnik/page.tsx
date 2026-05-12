import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { dreams, searchDreams, getDreamsByLetter } from '@/data/dreams';
import { dreamsUz } from '@/data/dreams-uz';
import { ALPHABET_RU } from '@/lib/utils';
import { Search } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'sonnik' });
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: { canonical: `https://ruyo.uz/${locale}/sonnik` },
  };
}

export default async function SonnikPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; letter?: string }>;
}) {
  const { locale } = await params;
  const { q, letter } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'sonnik' });

  const displayDreams = (q
    ? searchDreams(q)
    : letter
    ? getDreamsByLetter(letter.toUpperCase())
    : dreams
  ).sort((a, b) => a.title.localeCompare(b.title, 'ru'));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="mb-10">
        <p className="text-violet-600 text-sm font-medium uppercase tracking-wide mb-2">{t('label')}</p>
        <h1 className="font-serif text-4xl font-semibold text-stone-900 mb-3">
          {t('title_full')}
        </h1>
        <p className="text-stone-500 max-w-xl">
          {t('subtitle')}
        </p>
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
          href={`/${locale}/sonnik`}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${!letter && !q ? 'bg-violet-600 text-white' : 'bg-white border border-stone-200 text-stone-600 hover:border-violet-300 hover:text-violet-600'}`}
        >
          {t('alphabet_all')}
        </a>
        {ALPHABET_RU.map((char) => (
          <a
            key={char}
            href={`/${locale}/sonnik?letter=${encodeURIComponent(char)}`}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${letter?.toUpperCase() === char ? 'bg-violet-600 text-white' : 'bg-white border border-stone-200 text-stone-600 hover:border-violet-300 hover:text-violet-600'}`}
          >
            {char}
          </a>
        ))}
      </div>

      {(q || letter) && (
        <p className="text-stone-500 text-sm mb-6">
          {q ? t('search_results', { q }) : `Буква «${letter?.toUpperCase()}»:`}{' '}
          <span className="font-medium text-stone-900">{displayDreams.length}</span> {t('dreams_suffix')}
        </p>
      )}

      {displayDreams.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          <div className="text-5xl mb-4">🌙</div>
          <p className="font-medium text-stone-600 mb-2">{t('not_found')}</p>
          <Link href={`/${locale}/sonnik`} className="text-violet-600 hover:underline text-sm">
            {t('see_all')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayDreams.map((dream) => {
            const uz = locale === 'uz' ? dreamsUz[dream.slug] : undefined;
            const title = uz?.title ?? dream.title;
            const short = uz?.short ?? dream.short;
            const tags = uz?.tags ?? dream.tags;
            return (
            <Link
              key={dream.slug}
              href={`/${locale}/sonnik/${dream.slug}`}
              className="group p-5 rounded-2xl bg-white border border-stone-200 hover:border-violet-200 hover:shadow-md transition-all card-shadow"
            >
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">🌙</span>
                <div className="min-w-0">
                  <h2 className="font-semibold text-stone-900 group-hover:text-violet-700 transition-colors">
                    {title}
                  </h2>
                  <p className="text-sm text-stone-500 mt-1 line-clamp-2 leading-relaxed">{short}</p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-violet-50 text-violet-600 text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
