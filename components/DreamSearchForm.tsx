'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';

const SUGGESTIONS = [
  { slug: 'zmeya',  ru: 'змея',   uz: 'ilon'   },
  { slug: 'zuby',   ru: 'зубы',   uz: 'tish'   },
  { slug: 'voda',   ru: 'вода',   uz: 'suv'    },
  { slug: 'sobaka', ru: 'собака', uz: 'it'     },
  { slug: 'ogon',   ru: 'огонь',  uz: 'olov'   },
  { slug: 'more',   ru: 'море',   uz: 'dengiz' },
];

export default function DreamSearchForm({ locale }: { locale: string }) {
  const t = useTranslations('home');
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/${locale}/sonnik?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('dream_input')}
          className="w-full pl-12 pr-36 py-4 bg-white border border-stone-200 rounded-2xl text-stone-900 placeholder-stone-400 focus:outline-none focus:border-violet-400 focus:ring-3 focus:ring-violet-100 text-base card-shadow transition-shadow"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-violet-600 hover:bg-violet-700 rounded-xl font-medium text-white text-sm transition-colors"
        >
          {t('dream_button')}
        </button>
      </form>

      <div className="flex flex-wrap gap-2 mt-3 justify-center">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.slug}
            onClick={() => router.push(`/${locale}/sonnik/${s.slug}`)}
            className="px-3 py-1 rounded-full bg-white border border-stone-200 hover:border-violet-300 hover:bg-violet-50 text-sm text-stone-600 hover:text-violet-700 transition-all capitalize"
          >
            {locale === 'uz' ? s.uz : s.ru}
          </button>
        ))}
      </div>
    </div>
  );
}
