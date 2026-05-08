import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { dreams, TRENDING_DREAMS } from '@/data/dreams';
import { dreamUz } from '@/data/dreamTranslationsUz';
import { zodiacSigns } from '@/data/horoscopes';
import { viralTests } from '@/data/tests';
import DreamSearchForm from '@/components/DreamSearchForm';
import ZodiacPicker from '@/components/ZodiacPicker';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  const trendingDreams = TRENDING_DREAMS.map((slug) => dreams.find((d) => d.slug === slug)).filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-20">

      {/* ── Hero ── */}
      <section className="text-center pt-4">
        <p className="text-sm font-medium text-violet-600 mb-4 tracking-wide uppercase">
          {t('hero_label')}
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold text-stone-900 leading-tight mb-5">
          {t('hero_title')}<br />
          <span className="text-violet-600 italic">{t('hero_title_accent')}</span>
        </h1>
        <p className="text-stone-500 text-lg max-w-xl mx-auto mb-10">
          {t('hero_subtitle')}
        </p>

        <div className="max-w-2xl mx-auto">
          <DreamSearchForm locale={locale} />
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {[
            { href: `/${locale}/goroskop`, emoji: '♈', label: t('quick_horoscope') },
            { href: `/${locale}/imena`, emoji: '✨', label: t('quick_name') },
            { href: `/${locale}/testy`, emoji: '🎯', label: t('quick_test') },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-stone-200 rounded-full text-stone-700 text-sm font-medium hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50 transition-all card-shadow"
            >
              <span>{item.emoji}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Trending dreams ── */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-stone-900">{t('trending_dreams')}</h2>
            <p className="text-stone-500 text-sm mt-1">{t('trending_subtitle')}</p>
          </div>
          <Link href={`/${locale}/sonnik`} className="text-sm text-violet-600 hover:text-violet-700 font-medium">
            {t('all_dreams')}
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {trendingDreams.map((dream) => dream && (
            <Link
              key={dream.slug}
              href={`/${locale}/sonnik/${dream.slug}`}
              className="group p-5 rounded-2xl bg-white border border-stone-200 hover:border-violet-200 hover:shadow-md transition-all card-shadow"
            >
              <div className="text-2xl mb-2">🌙</div>
              <div className="font-semibold text-stone-900 group-hover:text-violet-700 transition-colors text-sm">
                {locale === 'uz' ? (dreamUz[dream.slug]?.title ?? dream.title) : dream.title}
              </div>
              <div className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                {locale === 'uz' ? (dreamUz[dream.slug]?.short ?? dream.short) : dream.short}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-stone-200" />
        <span className="text-stone-400 text-sm">⭐</span>
        <div className="flex-1 h-px bg-stone-200" />
      </div>

      {/* ── Horoscope ── */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-stone-900">{t('today_horoscope')}</h2>
            <p className="text-stone-500 text-sm mt-1">{t('horoscope_subtitle')}</p>
          </div>
          <Link href={`/${locale}/goroskop`} className="text-sm text-amber-600 hover:text-amber-700 font-medium">
            {t('all_horoscopes')}
          </Link>
        </div>
        <ZodiacPicker locale={locale} signs={zodiacSigns} />
      </section>

      {/* ── Name meaning banner ── */}
      <section className="rounded-3xl bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-100 p-8 sm:p-12 flex flex-col sm:flex-row items-center gap-8">
        <div className="flex-1">
          <p className="text-teal-600 text-sm font-medium uppercase tracking-wide mb-2">{t('names_label')}</p>
          <h2 className="font-serif text-3xl font-semibold text-stone-900 mb-3">
            {t('names_title')}
          </h2>
          <p className="text-stone-500 leading-relaxed mb-6 max-w-md">
            {t('names_subtitle')}
          </p>
          <Link
            href={`/${locale}/imena`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium transition-colors"
          >
            {t('names_cta')}
          </Link>
        </div>
        <div className="text-7xl">✨</div>
      </section>

      {/* ── Viral tests ── */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-stone-900">{t('tests_title')}</h2>
            <p className="text-stone-500 text-sm mt-1">{t('tests_subtitle')}</p>
          </div>
          <Link href={`/${locale}/testy`} className="text-sm text-pink-600 hover:text-pink-700 font-medium">
            {t('all_tests')}
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {viralTests.map((test) => (
            <Link
              key={test.slug}
              href={`/${locale}/testy/${test.slug}`}
              className="group p-6 rounded-2xl bg-white border border-stone-200 hover:border-pink-200 hover:shadow-md transition-all card-shadow"
            >
              <div className="text-4xl mb-3">{test.emoji}</div>
              <span className="text-xs text-pink-600 font-medium bg-pink-50 px-2 py-0.5 rounded-full">
                {test.category}
              </span>
              <h3 className="font-semibold text-stone-900 mt-3 mb-2 group-hover:text-pink-700 transition-colors leading-snug">
                {test.title}
              </h3>
              <p className="text-sm text-stone-500 line-clamp-2">{test.description}</p>
              <div className="mt-4 text-sm text-pink-600 font-medium">{t('test_take')}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Telegram CTA ── */}
      <section className="rounded-3xl bg-stone-900 text-white p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="font-serif text-2xl font-semibold mb-2">{t('telegram_title')}</h2>
          <p className="text-stone-400">{t('telegram_desc')}</p>
        </div>
        <a
          href="https://t.me/ruyo_uz"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-2 px-6 py-3 bg-white text-stone-900 hover:bg-stone-100 rounded-xl font-semibold transition-colors"
        >
          <span>✈️</span> {t('telegram_cta')}
        </a>
      </section>

    </div>
  );
}
