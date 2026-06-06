import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Script from 'next/script';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import '../globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' });
const playfair = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'site' });
  return {
    title: { default: `${t('name')} — ${t('tagline')}`, template: `%s | ${t('name')}` },
    description: t('description'),
    metadataBase: new URL('https://ruyo.uz'),
    alternates: {
      canonical: locale === 'uz' ? 'https://ruyo.uz/uz' : 'https://ruyo.uz',
      languages: {
        'ru': 'https://ruyo.uz',
        'uz': 'https://ruyo.uz/uz',
        'x-default': 'https://ruyo.uz',
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'uz' ? 'uz_UZ' : 'ru_RU',
      url: locale === 'uz' ? 'https://ruyo.uz/uz' : 'https://ruyo.uz',
      siteName: 'Ruyo.uz',
      images: [{ url: 'https://ruyo.uz/api/og?title=Ruyo.uz+%E2%80%94+%D0%A1%D0%BE%D0%BD%D0%BD%D0%B8%D0%BA+%D0%B8+%D0%B3%D0%BE%D1%80%D0%BE%D1%81%D0%BA%D0%BE%D0%BF&emoji=%F0%9F%8C%99&type=dream&locale=' + locale, width: 1200, height: 630, alt: 'Ruyo.uz' }],
    },
    robots: { index: true, follow: true },
    verification: { google: 'ZzuUJFm-AAc7zr0PwjFu5_Qd40Nykq7JgXTPvb8Jjc8' },
    other: { 'google-adsense-account': 'ca-pub-7667826503997562' },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as 'ru' | 'uz')) notFound();
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-[#FAF8F5] text-stone-900 min-h-screen font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7667826503997562"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
