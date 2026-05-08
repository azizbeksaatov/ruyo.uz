'use client';

import { useState } from 'react';
import { Search, Sparkles, CheckCircle, XCircle, Plus } from 'lucide-react';

interface LookupResult {
  exists: boolean;
  name?: string;
  gender?: string;
  origin?: string;
  meaning?: string;
  character?: string;
  luckyNumbers?: number[];
  element?: string;
}

const ORIGIN_LABELS: Record<string, string> = {
  uzbek: 'Узбекское', arabic: 'Арабское', persian: 'Персидское',
  turkic: 'Тюркское', slavic: 'Славянское', greek: 'Греческое',
  latin: 'Латинское', hebrew: 'Древнееврейское', scandinavian: 'Скандинавское',
  other: 'Другое',
};

export default function NameNotFound({ query, locale }: { query: string; locale: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'found' | 'notfound' | 'error'>('idle');
  const [result, setResult] = useState<LookupResult | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const lookup = async () => {
    setStatus('loading');
    try {
      const res = await fetch(`/api/names/lookup?name=${encodeURIComponent(query)}&locale=${locale}`);
      const data: LookupResult = await res.json();
      if (!res.ok || !data.exists) {
        setStatus('notfound');
      } else {
        setResult(data);
        setStatus('found');
      }
    } catch {
      setStatus('error');
    }
  };

  const submitToBase = async () => {
    if (!result) return;
    await fetch('/api/names/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: result.name,
        gender: result.gender,
        origin: result.origin,
        meaning: result.meaning,
        notes: 'AI lookup result — pending review',
      }),
    });
    setSubmitted(true);
  };

  const isUz = locale === 'uz';

  if (status === 'idle') {
    return (
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 text-center max-w-md mx-auto">
        <Search className="w-8 h-8 text-stone-300 mx-auto mb-3" />
        <p className="text-stone-600 font-medium mb-1">
          {isUz ? `"${query}" ismini topmadik` : `Имя "${query}" не найдено в базе`}
        </p>
        <p className="text-stone-400 text-sm mb-4">
          {isUz ? 'Biz ushbu ismni boshqa manbalarda qidirib, ma\'lumot beramiz' : 'Мы можем поискать это имя в других источниках'}
        </p>
        <button
          onClick={lookup}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium transition-colors text-sm"
        >
          <Sparkles className="w-4 h-4" />
          {isUz ? 'AI yordamida qidirish' : 'Найти через AI'}
        </button>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-8 text-center max-w-md mx-auto">
        <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-stone-500 text-sm">{isUz ? 'Qidirilmoqda...' : 'Ищем имя...'}</p>
      </div>
    );
  }

  if (status === 'notfound') {
    return (
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 text-center max-w-md mx-auto">
        <XCircle className="w-8 h-8 text-stone-300 mx-auto mb-3" />
        <p className="text-stone-600 font-medium">
          {isUz ? `"${query}" — mavjud ism emas` : `"${query}" — не является именем`}
        </p>
        <p className="text-stone-400 text-sm mt-1">
          {isUz ? 'Boshqa ism kiriting' : 'Попробуйте другое написание'}
        </p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 text-center max-w-md mx-auto">
        <p className="text-stone-500 text-sm">{isUz ? 'Xatolik yuz berdi' : 'Ошибка поиска. Попробуйте позже.'}</p>
      </div>
    );
  }

  if (status === 'found' && result) {
    return (
      <div className="bg-white border border-teal-200 rounded-2xl p-6 max-w-md mx-auto card-shadow">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-teal-600" />
          <span className="text-sm font-medium text-teal-700">
            {isUz ? 'AI tomonidan topildi' : 'Найдено через AI'}
          </span>
          <span className="ml-auto text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full border border-amber-100">
            {isUz ? 'Tekshirilmagan' : 'Не проверено'}
          </span>
        </div>

        <h2 className="font-serif text-3xl font-semibold text-stone-900 mb-1">{result.name}</h2>
        <div className="flex gap-2 mb-4 flex-wrap">
          {result.origin && (
            <span className="px-2 py-0.5 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs">
              {ORIGIN_LABELS[result.origin] ?? result.origin}
            </span>
          )}
          {result.gender && (
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              result.gender === 'male' ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'
            }`}>
              {result.gender === 'male' ? (isUz ? 'Erkak' : 'Мужское') : (isUz ? 'Ayol' : 'Женское')}
            </span>
          )}
          {result.element && (
            <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-xs">
              {result.element}
            </span>
          )}
        </div>

        {result.meaning && (
          <div className="mb-3">
            <p className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-1">
              {isUz ? 'Ma\'nosi' : 'Значение'}
            </p>
            <p className="text-stone-700 text-sm leading-relaxed">{result.meaning}</p>
          </div>
        )}

        {result.character && (
          <div className="mb-4">
            <p className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-1">
              {isUz ? 'Xarakter' : 'Характер'}
            </p>
            <p className="text-stone-600 text-sm leading-relaxed">{result.character}</p>
          </div>
        )}

        {result.luckyNumbers && result.luckyNumbers.length > 0 && (
          <div className="flex gap-2 mb-5">
            {result.luckyNumbers.map((n) => (
              <span key={n} className="w-8 h-8 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-sm text-teal-600 font-medium">
                {n}
              </span>
            ))}
          </div>
        )}

        {!submitted ? (
          <button
            onClick={submitToBase}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            {isUz ? "Bazaga qo'shish" : 'Добавить в базу'}
          </button>
        ) : (
          <div className="flex items-center justify-center gap-2 py-2.5 bg-teal-50 text-teal-700 rounded-xl text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            {isUz ? 'Tekshiruvga yuborildi!' : 'Отправлено на проверку!'}
          </div>
        )}
      </div>
    );
  }

  return null;
}
