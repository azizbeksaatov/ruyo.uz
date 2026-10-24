import { notFound } from 'next/navigation';
import Link from 'next/link';
import { cache } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getDreamDiscoverTitle, getDreamDiscoverDescription, getDreamEmoji, getSlugDate, ogImageUrl } from '@/lib/discover';
import { User, Users, Calendar, TrendingUp } from 'lucide-react';
import type { Metadata } from 'next';
import DreamAiInterpreter from '@/components/DreamAiInterpreter';
import ShareButtons from '@/components/ShareButtons';
import TelegramBanner from '@/components/TelegramBanner';
import {
  fetchDreamBySlug, fetchDreamTitles, fetchDreamsByLetter,
  TRENDING_DREAM_SLUGS, type DreamData,
} from '@/lib/dreams-db';

export const revalidate = 86400;

// Empty list = render each dream on first visit, then serve it from the ISR cache
export async function generateStaticParams() {
  return [];
}

// Deduplicate Supabase calls within a single request
const getDream = cache(fetchDreamBySlug);

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const dream = await getDream(slug, locale);
  if (!dream) return {};

  const discoverTitle = getDreamDiscoverTitle(dream.title, slug, locale);
  const discoverDesc  = getDreamDiscoverDescription(dream.short, dream.title, locale);
  const emoji = getDreamEmoji(slug, dream.tags);
  const imageUrl = ogImageUrl({ title: discoverTitle, emoji, type: 'dream', locale });
  const canonical = locale === 'uz' ? `https://www.ruyo.uz/uz/sonnik/${slug}` : `https://www.ruyo.uz/sonnik/${slug}`;

  return {
    title: discoverTitle,
    description: discoverDesc,
    alternates: {
      canonical,
      languages: {
        ru: `https://www.ruyo.uz/sonnik/${slug}`,
        uz: `https://www.ruyo.uz/uz/sonnik/${slug}`,
      },
    },
    openGraph: {
      title: discoverTitle,
      description: discoverDesc,
      type: 'article',
      url: canonical,
      siteName: 'Ruyo.uz',
      publishedTime: getSlugDate(slug),
      modifiedTime: new Date().toISOString().split('T')[0],
      images: [{ url: imageUrl, width: 1200, height: 630, alt: dream.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: discoverTitle,
      description: discoverDesc,
      images: [imageUrl],
    },
  };
}

export default async function DreamPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug: rawSlug } = await params;
  setRequestLocale(locale);
  const slug = decodeURIComponent(rawSlug);
  const dream = await getDream(slug, locale);
  if (!dream) notFound();

  const t = await getTranslations({ locale, namespace: 'sonnik' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });

  // Parallel data fetching
  const [relatedDreams, otherDreams, trendingDreams] = await Promise.all([
    fetchDreamTitles(dream.related, locale),
    fetchDreamsByLetter(dream.letter, slug, locale, 6),
    fetchDreamTitles(TRENDING_DREAM_SLUGS.filter(s => s !== slug), locale),
  ]);

  const canonical     = locale === 'uz' ? `https://www.ruyo.uz/uz/sonnik/${slug}` : `https://www.ruyo.uz/sonnik/${slug}`;
  const discoverTitle = getDreamDiscoverTitle(dream.title, slug, locale);
  const dreamEmoji    = getDreamEmoji(slug, dream.tags);
  const ogUrl         = ogImageUrl({ title: discoverTitle, emoji: dreamEmoji, type: 'dream', locale });

  const DAY_LABELS: Record<string, string> = {
    monday: t('monday'), tuesday: t('tuesday'), wednesday: t('wednesday'),
    thursday: t('thursday'), friday: t('friday'), saturday: t('saturday'), sunday: t('sunday'),
  };

  const name = dream.title.toLowerCase();

  const millerText = locale === 'uz'
    ? `Gʻustav Miller talqiniga koʻra, tushda ${name} koʻrish — muhim ramziy obraz. Bunday tushlar koʻpincha hayotdagi oʻzgarishlar, shaxsiy rivojlanish yoki atrofdagilar bilan munosabatlar bilan bogʻliq. Miller bunday tushlar bejiz kelmasligini ta'kidlagan.`
    : `По соннику Густава Миллера, ${name} во сне — значимый символ, который редко появляется без причины. ${dream.full} Миллер считал, что подобные сны связаны с переменами в личной жизни или делах сновидца и требуют внимательного осмысления.`;
  const vangaText = locale === 'uz'
    ? `Bolgar bashoratchi Vanga tushda ${name} koʻrishni muhim voqealar alomati sifatida talqin etgan. Ayol uchun bunday tush yangi bosqich va oʻzgarishlarni anglatadi. Erkak uchun esa bu yangi imkoniyatlar yoki muhim qarorlar bilan bogʻliq. Uning talqiniga koʻra, bunday tush bejiz tushmaydi.`
    : `Болгарская провидица Ванга трактовала образ ${name} как предзнаменование важных событий. ${dream.forWoman} ${dream.forMan} По её мистическим толкованиям, такой сон приходит не случайно и указывает на перемены, которые вскоре проявятся в реальной жизни.`;
  const freudText = locale === 'uz'
    ? `Zigmund Freyd tushda ${name} koʻrishni ong osti bilan bogʻlagan. Psixoanaliz nuqtai nazaridan bu obraz bosilgan xohishlar, hal etilmagan nizolar yoki chuqur his-tuyg'ularni aks ettiradi — ong osti ularni tush orqali yuzaga chiqaradi.`
    : `Зигмунд Фрейд связывал сны о ${name} с работой подсознания. ${dream.short} С позиций психоанализа этот образ отражает подавленные желания, нерешённые конфликты или глубокие переживания, которые подсознание выносит на поверхность через сновидение.`;

  const faqs = locale === 'uz' ? [
    { question: `${name} tushga kirsa nima boʻladi?`, answer: `${dream.short} ${dream.full}` },
    { question: `Tushda ${name} — yaxshi yoki yomon belgi?`, answer: `Maʼnosi tush tafsilotlariga bogʻliq. ${dream.forWoman} Agar tush tinch va ijobiy boʻlsa — bu yaxshi belgi.` },
    { question: `Ayol uchun tushda ${name} nima anglatadi?`, answer: dream.forWoman },
    { question: `Erkak uchun tushda ${name} nima anglatadi?`, answer: dream.forMan },
  ] : [
    { question: `К чему снится ${name}?`, answer: `${dream.short} ${dream.full}` },
    { question: `${dream.title} во сне — хороший или плохой знак?`, answer: `Значение зависит от деталей сна. ${dream.forWoman} Если сон был спокойным и позитивным — это добрый знак.` },
    { question: `Что значит ${name} во сне для женщины?`, answer: dream.forWoman },
    { question: `Что значит ${name} во сне для мужчины?`, answer: dream.forMan },
  ];

  const structuredData = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: discoverTitle, description: dream.short, image: [ogUrl],
    author: { '@type': 'Organization', name: 'Ruyo.uz', url: 'https://www.ruyo.uz' },
    publisher: { '@type': 'Organization', name: 'Ruyo.uz', url: 'https://www.ruyo.uz',
      logo: { '@type': 'ImageObject', url: 'https://www.ruyo.uz/icon.png' } },
    datePublished: getSlugDate(slug),
    dateModified: new Date().toISOString().split('T')[0],
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
  };

  const breadcrumbData = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ruyo.uz', item: 'https://www.ruyo.uz' },
      { '@type': 'ListItem', position: 2, name: tNav('sonnik'), item: locale === 'uz' ? 'https://www.ruyo.uz/uz/sonnik' : 'https://www.ruyo.uz/sonnik' },
      { '@type': 'ListItem', position: 3, name: dream.title, item: canonical },
    ],
  };

  const faqData = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }} />
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
                  <h1 className="font-serif text-3xl font-semibold text-stone-900 mb-3">{dream.title}</h1>
                  <p className="text-stone-600 text-lg leading-relaxed">{dream.short}</p>
                </div>
              </div>
              <ShareButtons url={canonical} title={discoverTitle} locale={locale} />
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

            {/* Sub-page links */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6">
              <h3 className="font-semibold text-stone-900 mb-4">
                {locale === 'uz' ? "Batafsil o'qing:" : 'Читать подробнее:'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { variant: 'dlya-zhenshchin', emoji: '👩', label: locale === 'uz' ? 'Ayollar uchun' : 'Для женщин', desc: locale === 'uz' ? 'Ayolga xos talqin' : 'Толкование для женщины' },
                  { variant: 'dlya-muzhchin',   emoji: '👨', label: locale === 'uz' ? 'Erkaklar uchun' : 'Для мужчин', desc: locale === 'uz' ? 'Erkaklarga xos talqin' : 'Толкование для мужчины' },
                  { variant: 'islamskiy',        emoji: '🕌', label: locale === 'uz' ? "Islomiy ta'bir" : 'Исламский сонник', desc: locale === 'uz' ? "Ibn Sirin bo'yicha" : 'По Ибн Сирину' },
                ].map(({ variant, emoji: em, label, desc }) => (
                  <Link key={variant} href={`/${locale}/sonnik/${slug}/${variant}`}
                    className="flex flex-col items-center text-center p-4 bg-white border border-stone-200 rounded-xl hover:border-violet-300 hover:bg-violet-50 transition-all group">
                    <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">{em}</span>
                    <span className="font-semibold text-stone-800 text-sm mb-1 group-hover:text-violet-700">{label}</span>
                    <span className="text-xs text-stone-500">{desc}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Dream book interpretations */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 card-shadow">
              <h2 className="font-serif text-xl font-semibold text-stone-900 mb-5">
                {locale === 'uz' ? "Mashhur ta'birnomalarga ko'ra" : 'По знаменитым сонникам'}
              </h2>
              <div className="space-y-5">
                {dream.ibnSirin && (
                  <div className="border-l-4 border-emerald-400 pl-4">
                    <p className="font-semibold text-stone-800 text-sm mb-2">
                      {locale === 'uz' ? "🕌 Ibn Sirin ta'birnomasi" : '🕌 Сонник Ибн Сирина'}
                    </p>
                    <p className="text-stone-600 text-sm leading-relaxed">{dream.ibnSirin}</p>
                  </div>
                )}
                <div className="border-l-4 border-amber-400 pl-4">
                  <p className="font-semibold text-stone-800 text-sm mb-2">
                    {locale === 'uz' ? "📖 Miller ta'birnomasi" : '📖 Сонник Миллера'}
                  </p>
                  <p className="text-stone-600 text-sm leading-relaxed">{millerText}</p>
                </div>
                <div className="border-l-4 border-violet-400 pl-4">
                  <p className="font-semibold text-stone-800 text-sm mb-2">
                    {locale === 'uz' ? '🔮 Vanga tabirnomasi' : '🔮 Сонник Ванги'}
                  </p>
                  <p className="text-stone-600 text-sm leading-relaxed">{vangaText}</p>
                </div>
                <div className="border-l-4 border-blue-400 pl-4">
                  <p className="font-semibold text-stone-800 text-sm mb-2">
                    {locale === 'uz' ? '🧠 Freyd talqini' : '🧠 Толкование Фрейда'}
                  </p>
                  <p className="text-stone-600 text-sm leading-relaxed">{freudText}</p>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 card-shadow">
              <h2 className="font-serif text-xl font-semibold text-stone-900 mb-5">
                {locale === 'uz' ? "Ko'p so'raladigan savollar" : 'Часто задаваемые вопросы'}
              </h2>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <details key={faq.question} className="group border border-stone-100 rounded-xl overflow-hidden">
                    <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-medium text-stone-800 text-sm hover:bg-stone-50 transition-colors list-none">
                      <span>{faq.question}</span>
                      <span className="text-stone-400 group-open:rotate-180 transition-transform">▾</span>
                    </summary>
                    <div className="px-5 pb-4 pt-1 text-stone-600 text-sm leading-relaxed border-t border-stone-100">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">

            {relatedDreams.length > 0 && (
              <div className="bg-white rounded-2xl border border-stone-200 p-5 card-shadow">
                <h3 className="font-semibold text-stone-900 mb-4 text-sm uppercase tracking-wide">{t('similar_dreams')}</h3>
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

            {otherDreams.length > 0 && (
              <div className="bg-white rounded-2xl border border-stone-200 p-5 card-shadow">
                <h3 className="font-semibold text-stone-900 mb-4 text-sm uppercase tracking-wide">«{dream.letter}»</h3>
                <div className="space-y-1">
                  {otherDreams.map((r) => (
                    <Link key={r.slug} href={`/${locale}/sonnik/${r.slug}`}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-stone-50 transition-colors group">
                      <span className="text-base">🌙</span>
                      <span className="text-sm text-stone-600 group-hover:text-violet-600 transition-colors">{r.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Telegram CTA */}
            <a
              href={locale === 'uz' ? 'https://t.me/ruyo_uz' : 'https://t.me/ruyouz_ru'}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-2xl p-5 text-center hover:border-violet-300 hover:shadow-md transition-all group"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">✈️</div>
              <h3 className="font-semibold text-stone-900 mb-1 text-sm">
                {locale === 'uz' ? 'Telegram kanalimiz' : 'Telegram-канал Ruyo.uz'}
              </h3>
              <p className="text-stone-500 text-xs mb-3 leading-snug">
                {locale === 'uz'
                  ? 'Har kuni tush taʼbiri va munajjimlar bashorati. Bepul!'
                  : 'Каждый день: гороскоп и толкование сна. Бесплатно!'}
              </p>
              <span className="inline-block px-4 py-1.5 bg-violet-600 text-white rounded-lg text-xs font-semibold">
                {locale === 'uz' ? "Obuna bo'lish" : 'Подписаться'}
              </span>
            </a>

            {/* Horoscope CTA */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 text-center">
              <div className="text-3xl mb-2">⭐</div>
              <h3 className="font-semibold text-stone-900 mb-2">{t('horoscope_cta_title')}</h3>
              <p className="text-stone-500 text-sm mb-4">{t('horoscope_cta_desc')}</p>
              <Link href={`/${locale}/goroskop`}
                className="block px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-medium transition-colors">
                {t('horoscope_cta_btn')}
              </Link>
            </div>

            {trendingDreams.length > 0 && (
              <div className="bg-white rounded-2xl border border-stone-200 p-5 card-shadow">
                <h3 className="font-semibold text-stone-900 mb-4 text-sm uppercase tracking-wide flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-rose-500" />
                  {locale === 'uz' ? "Hozir o'qilmoqda" : 'Сейчас читают'}
                </h3>
                <div className="space-y-1">
                  {trendingDreams.map((tr) => (
                    <Link key={tr.slug} href={`/${locale}/sonnik/${tr.slug}`}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-stone-50 transition-colors group">
                      <span className="text-base shrink-0">🔥</span>
                      <span className="text-sm text-stone-600 group-hover:text-violet-600 transition-colors line-clamp-1">{tr.title}</span>
                    </Link>
                  ))}
                </div>
                <Link href={`/${locale}/sonnik`}
                  className="mt-3 block text-center text-xs text-violet-600 hover:text-violet-700 font-medium">
                  {locale === 'uz' ? 'Barcha tushlar →' : 'Все сны →'}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <TelegramBanner locale={locale} />
    </>
  );
}
