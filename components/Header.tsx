'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Menu, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { href: `/${locale}/sonnik`, label: t('sonnik') },
    { href: `/${locale}/goroskop`, label: t('goroskop') },
    { href: `/${locale}/imena`, label: t('names') },
    { href: `/${locale}/testy`, label: t('tests') },
  ];

  const switchLocale = (newLocale: string) => {
    // localePrefix: 'as-needed' — default locale 'ru' has no /ru/ prefix in URLs
    // Russian pathname: '/sonnik/bolezn' (no /ru/ prefix)
    // Uzbek pathname:  '/uz/sonnik/bolezn'
    if (locale === 'ru') {
      // Prepend new locale to the prefix-less path
      const path = pathname === '/' ? '' : pathname;
      router.push(`/${newLocale}${path}`);
    } else {
      // Replace existing locale prefix in segments[1]
      const segments = pathname.split('/');
      segments[1] = newLocale;
      router.push(segments.join('/') || `/${newLocale}`);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/${locale}/sonnik?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#060e30] via-[#0d1f5e] to-[#071540] backdrop-blur-sm border-b border-white/10 shadow-lg shadow-indigo-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center">
            <Image src="/logo_light.png" alt="Ruyo.uz" width={134} height={36} className="h-9 w-auto" priority />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname.startsWith(link.href)
                    ? 'bg-white/15 text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Locale switcher */}
            <div className="hidden sm:flex items-center bg-white/10 rounded-lg p-1 gap-0.5">
              {['ru', 'uz'].map((loc) => (
                <button
                  key={loc}
                  onClick={() => switchLocale(loc)}
                  className={cn(
                    'px-3 py-1 rounded-md text-xs font-semibold uppercase transition-colors',
                    locale === loc
                      ? 'bg-white text-indigo-900 shadow-sm'
                      : 'text-white/60 hover:text-white'
                  )}
                >
                  {loc}
                </button>
              ))}
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="pb-3">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search')}
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/10 text-sm"
              />
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-white/10 mt-2 pt-4">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    'px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    pathname.startsWith(link.href)
                      ? 'bg-white/15 text-white'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-2 px-4 py-2 mt-1">
                {['ru', 'uz'].map((loc) => (
                  <button
                    key={loc}
                    onClick={() => { switchLocale(loc); setMenuOpen(false); }}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-colors',
                      locale === loc ? 'bg-white text-indigo-900' : 'bg-white/10 text-white/70 hover:text-white'
                    )}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
