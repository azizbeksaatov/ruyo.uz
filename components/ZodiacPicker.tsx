'use client';

import Link from 'next/link';
import { ZodiacSign } from '@/data/horoscopes';

export default function ZodiacPicker({ locale, signs }: { locale: string; signs: ZodiacSign[] }) {
  const nameKey = locale === 'uz' ? 'uz' : 'ru';

  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-2">
      {signs.map((sign) => (
        <Link
          key={sign.slug}
          href={`/${locale}/goroskop/${sign.slug}`}
          className="group flex flex-col items-center p-3 rounded-xl bg-white border border-stone-200 hover:border-amber-300 hover:bg-amber-50 transition-all text-center card-shadow"
        >
          <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{sign.emoji}</span>
          <span className="text-xs text-stone-600 group-hover:text-amber-700 font-medium">{sign[nameKey]}</span>
        </Link>
      ))}
    </div>
  );
}
