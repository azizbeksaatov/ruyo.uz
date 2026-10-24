import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTestBySlug, viralTests } from '@/data/tests';
import { testTranslationsUz } from '@/data/testTranslationsUz';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import ViralTestClient from '@/components/ViralTestClient';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return viralTests.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const test = getTestBySlug(slug);
  if (!test) return {};
  const uz = locale === 'uz' ? testTranslationsUz[slug] : null;
  return {
    title: uz?.title ?? test.title,
    description: uz?.description ?? test.description,
    alternates: {
      canonical: locale === 'uz' ? `https://www.ruyo.uz/uz/testy/${slug}` : `https://www.ruyo.uz/testy/${slug}`,
      languages: {
        ru: `https://www.ruyo.uz/testy/${slug}`,
        uz: `https://www.ruyo.uz/uz/testy/${slug}`,
      },
    },
  };
}

export default async function TestPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const test = getTestBySlug(slug);
  if (!test) notFound();

  const pageTitle = (locale === 'uz' ? testTranslationsUz[slug]?.title : null) ?? test.title;
  const tNav = await getTranslations({ locale, namespace: 'nav' });
  const tTests = await getTranslations({ locale, namespace: 'tests' });
  const pageUrl = locale === 'uz' ? `https://www.ruyo.uz/uz/testy/${slug}` : `https://www.ruyo.uz/testy/${slug}`;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-stone-400 mb-8">
        <Link href={`/${locale}`} className="hover:text-stone-700 transition-colors">{tNav('home')}</Link>
        <span>/</span>
        <Link href={`/${locale}/testy`} className="hover:text-stone-700 transition-colors">{tNav('tests')}</Link>
        <span>/</span>
        <span className="text-stone-700 line-clamp-1">{pageTitle}</span>
      </nav>
      <ViralTestClient test={test} locale={locale} backLabel={tTests('back')} pageUrl={pageUrl} />
    </div>
  );
}
