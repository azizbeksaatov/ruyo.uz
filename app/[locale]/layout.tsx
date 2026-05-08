import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
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
    alternates: { canonical: '/', languages: { ru: '/ru', uz: '/uz' } },
    openGraph: {
      type: 'website',
      locale: locale === 'uz' ? 'uz_UZ' : 'ru_RU',
      url: 'https://ruyo.uz',
      siteName: 'Ruyo.uz',
    },
    robots: { index: true, follow: true },
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
      </body>
    </html>
  );
}
