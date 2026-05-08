import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import PersonalHoroscopeForm from '@/components/PersonalHoroscopeForm';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'goroskop' });
  return {
    title: t('personal_title'),
    description: t('personal_subtitle'),
    alternates: { canonical: `https://ruyo.uz/${locale}/goroskop/personalnyy` },
  };
}

export default async function PersonalHoroscopePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'goroskop' });

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8 text-center">
        <p className="text-violet-600 text-sm font-medium uppercase tracking-wide mb-2">{t('personal_label')}</p>
        <h1 className="font-serif text-4xl font-semibold text-stone-900 mb-3">{t('personal_title')}</h1>
        <p className="text-stone-500">{t('personal_subtitle')}</p>
      </div>
      <PersonalHoroscopeForm locale={locale} />
    </div>
  );
}
