'use client';

import { useState } from 'react';
import Link from 'next/link';
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
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/') || `/${newLocale}`);
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <span className="text-2xl">🌙</span>
            <span className="font-serif text-xl font-semibold text-stone-900 tracking-tight">
              Ruyo<span className="text-violet-600">.uz</span>
            </span>
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
                    ? 'bg-violet-50 text-violet-700'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
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
              className="p-2 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Locale switcher */}
            <div className="hidden sm:flex items-center bg-stone-100 rounded-lg p-1 gap-0.5">
              {['ru', 'uz'].map((loc) => (
                <button
                  key={loc}
                  onClick={() => switchLocale(loc)}
                  className={cn(
                    'px-3 py-1 rounded-md text-xs font-semibold uppercase transition-colors',
                    locale === loc
                      ? 'bg-white text-stone-900 shadow-sm'
                      : 'text-stone-500 hover:text-stone-700'
                  )}
                >
                  {loc}
                </button>
              ))}
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-stone-500 hover:bg-stone-100 transition-colors"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="pb-3">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search')}
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 text-sm"
              />
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-stone-100 mt-2 pt-4">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    'px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    pathname.startsWith(link.href)
                      ? 'bg-violet-50 text-violet-700'
                      : 'text-stone-600 hover:bg-stone-100'
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
                      locale === loc ? 'bg-violet-600 text-white' : 'bg-stone-100 text-stone-600'
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
