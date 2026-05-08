import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Send } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-stone-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🌙</span>
              <span className="font-serif text-xl font-semibold text-stone-900">
                Ruyo<span className="text-violet-600">.uz</span>
              </span>
            </div>
            <p className="text-stone-500 text-sm leading-relaxed mb-5">
              {t('tagline')}
            </p>
            <a
              href="https://t.me/ruyo_uz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-lg text-blue-600 text-sm font-medium hover:bg-blue-100 transition-colors"
            >
              <Send className="w-4 h-4" />
              Telegram
            </a>
          </div>

          {/* Sonnik */}
          <div>
            <h3 className="font-semibold text-stone-900 mb-4 text-sm uppercase tracking-wide">{t('sonnik_section')}</h3>
            <ul className="space-y-2.5">
              {[
                { slug: 'zmeya', label: t('snake') },
                { slug: 'zuby',  label: t('teeth') },
                { slug: 'voda',  label: t('water') },
                { slug: 'sobaka', label: t('dog') },
                { slug: 'more',  label: t('sea') },
              ].map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/${locale}/sonnik/${item.slug}`}
                    className="text-stone-500 hover:text-violet-600 text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={`/${locale}/sonnik`} className="text-violet-600 hover:text-violet-700 text-sm font-medium">
                  {t('all_dreams')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Goroskop */}
          <div>
            <h3 className="font-semibold text-stone-900 mb-4 text-sm uppercase tracking-wide">{t('goroskop_section')}</h3>
            <ul className="space-y-2.5">
              {[
                { href: 'na-segodnya', label: t('today_period') },
                { href: 'na-nedelyu',  label: t('week_period') },
                { href: 'lyubovny',    label: t('love_period') },
                { href: 'sovmestimost', label: t('compat_period') },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={`/${locale}/goroskop/${item.href}`} className="text-stone-500 hover:text-violet-600 text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Other */}
          <div>
            <h3 className="font-semibold text-stone-900 mb-4 text-sm uppercase tracking-wide">{t('other_section')}</h3>
            <ul className="space-y-2.5">
              <li><Link href={`/${locale}/imena`} className="text-stone-500 hover:text-violet-600 text-sm transition-colors">{t('name_meaning')}</Link></li>
              <li><Link href={`/${locale}/testy`} className="text-stone-500 hover:text-violet-600 text-sm transition-colors">{t('tests')}</Link></li>
              <li><Link href={`/${locale}/about`} className="text-stone-500 hover:text-violet-600 text-sm transition-colors">{t('about')}</Link></li>
              <li><Link href={`/${locale}/privacy`} className="text-stone-500 hover:text-violet-600 text-sm transition-colors">{t('privacy')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-stone-400">
          <span>© {year} Ruyo.uz — {t('rights')}</span>
          <span>{t('made_in_uz')}</span>
        </div>
      </div>
    </footer>
  );
}
