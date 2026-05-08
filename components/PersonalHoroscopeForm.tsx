'use client';

import { useState } from 'react';
import { Star, Heart, DollarSign, Activity, Sparkles, Calendar } from 'lucide-react';

interface HoroscopeReading {
  sign: string;
  signRu: string;
  signEmoji: string;
  period: string;
  general: string;
  love: string;
  finance: string;
  health: string;
  career: string;
  advice: string;
  luckyNumber: number;
  luckyColor: string;
  energyLove: number;
  energyFinance: number;
  energyHealth: number;
  energyCareer: number;
}

function getZodiacSign(day: number, month: number): { sign: string; ru: string; emoji: string } {
  const signs = [
    { sign: 'kozerog',   ru: 'Козерог',    emoji: '♑', from: [12,22], to: [1,19]  },
    { sign: 'vodoley',   ru: 'Водолей',    emoji: '♒', from: [1,20],  to: [2,18]  },
    { sign: 'ryby',      ru: 'Рыбы',       emoji: '♓', from: [2,19],  to: [3,20]  },
    { sign: 'oven',      ru: 'Овен',       emoji: '♈', from: [3,21],  to: [4,19]  },
    { sign: 'telets',    ru: 'Телец',      emoji: '♉', from: [4,20],  to: [5,20]  },
    { sign: 'bliznetsy', ru: 'Близнецы',   emoji: '♊', from: [5,21],  to: [6,20]  },
    { sign: 'rak',       ru: 'Рак',        emoji: '♋', from: [6,21],  to: [7,22]  },
    { sign: 'lev',       ru: 'Лев',        emoji: '♌', from: [7,23],  to: [8,22]  },
    { sign: 'deva',      ru: 'Дева',       emoji: '♍', from: [8,23],  to: [9,22]  },
    { sign: 'vesy',      ru: 'Весы',       emoji: '♎', from: [9,23],  to: [10,22] },
    { sign: 'skorpion',  ru: 'Скорпион',   emoji: '♏', from: [10,23], to: [11,21] },
    { sign: 'strelets',  ru: 'Стрелец',    emoji: '♐', from: [11,22], to: [12,21] },
  ];

  for (const s of signs) {
    const [fm, fd] = s.from;
    const [tm, td] = s.to;
    if (fm === tm) {
      if (month === fm && day >= fd && day <= td) return s;
    } else if (fm > tm) {
      // spans year boundary (Capricorn)
      if ((month === fm && day >= fd) || (month === tm && day <= td)) return s;
    } else {
      if ((month === fm && day >= fd) || (month === tm && day <= td) || (month > fm && month < tm)) return s;
    }
  }
  return signs[0];
}

function StarRating({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-stone-600">{label}</span>
      <div className="flex gap-1">
        {[1,2,3,4,5].map((i) => (
          <Star key={i} className={`w-3.5 h-3.5 ${i <= value ? color : 'text-stone-200'}`} fill={i <= value ? 'currentColor' : 'none'} />
        ))}
      </div>
    </div>
  );
}

export default function PersonalHoroscopeForm({ locale }: { locale: string }) {
  const [form, setForm] = useState({ birthDate: '', gender: 'female' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [reading, setReading] = useState<HoroscopeReading | null>(null);

  const isUz = locale === 'uz';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.birthDate) return;
    setStatus('loading');

    try {
      const res = await fetch('/api/horoscope/personal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ birthDate: form.birthDate, gender: form.gender, locale }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setReading(data);
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'done' && reading) {
    return (
      <div className="space-y-5">
        {/* Sign card */}
        <div className="bg-white rounded-3xl border border-stone-200 p-8 card-shadow text-center">
          <div className="text-7xl mb-3">{reading.signEmoji}</div>
          <p className="text-violet-600 text-sm font-medium uppercase tracking-wide mb-1">
            {isUz ? 'Sizning belgingiz' : 'Ваш знак зодиака'}
          </p>
          <h2 className="font-serif text-3xl font-semibold text-stone-900 mb-1">{reading.signRu}</h2>
          <p className="text-stone-400 text-sm">{reading.period}</p>
        </div>

        {/* Energy ratings */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 card-shadow">
          <h3 className="font-semibold text-stone-900 mb-4">
            {isUz ? 'Energiya darajasi' : 'Уровень энергии'}
          </h3>
          <div className="space-y-3">
            <StarRating value={reading.energyLove}    label={isUz ? 'Sevgi'    : 'Любовь'}    color="text-rose-500" />
            <StarRating value={reading.energyFinance}  label={isUz ? 'Moliya'   : 'Финансы'}   color="text-green-500" />
            <StarRating value={reading.energyHealth}   label={isUz ? 'Salomatlik' : 'Здоровье'} color="text-blue-500" />
            <StarRating value={reading.energyCareer}   label={isUz ? 'Karyera'  : 'Карьера'}   color="text-amber-500" />
          </div>
        </div>

        {/* General */}
        <div className="bg-violet-50 border border-violet-100 rounded-2xl p-6">
          <h3 className="font-semibold text-stone-900 mb-3">{isUz ? 'Umumiy bashorat' : 'Общий прогноз'}</h3>
          <p className="text-stone-700 leading-relaxed">{reading.general}</p>
        </div>

        {/* 4 spheres */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: Heart,      color: 'rose',   label: isUz ? 'Sevgi' : 'Любовь',    text: reading.love    },
            { icon: DollarSign, color: 'green',  label: isUz ? 'Moliya' : 'Финансы',  text: reading.finance },
            { icon: Activity,   color: 'blue',   label: isUz ? 'Salomatlik' : 'Здоровье', text: reading.health  },
            { icon: Star,       color: 'amber',  label: isUz ? 'Karyera' : 'Карьера', text: reading.career  },
          ].map(({ icon: Icon, color, label, text }) => (
            <div key={label} className="bg-white border border-stone-200 rounded-2xl p-5 card-shadow">
              <div className={`flex items-center gap-2 mb-2 text-${color}-600`}>
                <Icon className="w-4 h-4" />
                <span className="font-semibold text-sm">{label}</span>
              </div>
              <p className="text-stone-600 text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        {/* Lucky + advice */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-stone-900 text-sm mb-1">{isUz ? 'Maslahat' : 'Совет дня'}</p>
            <p className="text-stone-600 text-sm leading-relaxed">{reading.advice}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 bg-white border border-stone-200 rounded-xl p-4 text-center">
            <p className="text-xs text-stone-400 mb-1">{isUz ? 'Baxtli raqam' : 'Счастливое число'}</p>
            <p className="text-2xl font-bold text-violet-700">{reading.luckyNumber}</p>
          </div>
          <div className="flex-1 bg-white border border-stone-200 rounded-xl p-4 text-center">
            <p className="text-xs text-stone-400 mb-1">{isUz ? 'Baxtli rang' : 'Счастливый цвет'}</p>
            <p className="text-lg font-semibold text-stone-700 capitalize">{reading.luckyColor}</p>
          </div>
        </div>

        <button
          onClick={() => { setStatus('idle'); setReading(null); }}
          className="w-full py-3 border border-stone-200 text-stone-600 hover:bg-stone-50 rounded-xl font-medium transition-colors text-sm"
        >
          {isUz ? 'Boshqa sana' : 'Рассчитать другую дату'}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-stone-200 p-8 card-shadow space-y-6">
      <div>
        <label className="block font-medium text-stone-900 mb-2 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-violet-600" />
          {isUz ? 'Tug\'ilgan sana' : 'Дата рождения'} *
        </label>
        <input
          type="date"
          value={form.birthDate}
          onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
          max={new Date().toISOString().split('T')[0]}
          className="w-full px-4 py-3 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          required
        />
      </div>

      <div>
        <label className="block font-medium text-stone-900 mb-2">
          {isUz ? 'Jinsi' : 'Пол'}
        </label>
        <div className="flex gap-3">
          {(['female', 'male'] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setForm({ ...form, gender: g })}
              className={`flex-1 py-3 rounded-xl font-medium text-sm transition-colors border ${
                form.gender === g
                  ? 'bg-violet-600 text-white border-violet-600'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-violet-300'
              }`}
            >
              {g === 'female' ? (isUz ? '👩 Ayol' : '👩 Женский') : (isUz ? '👨 Erkak' : '👨 Мужской')}
            </button>
          ))}
        </div>
      </div>

      {status === 'error' && (
        <p className="text-red-500 text-sm">
          {isUz ? 'Xatolik. Qayta urinib ko\'ring.' : 'Ошибка. Попробуйте позже.'}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading' || !form.birthDate}
        className="w-full py-4 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2"
      >
        <Sparkles className="w-5 h-5" />
        {status === 'loading'
          ? (isUz ? 'Hisoblanmoqda...' : 'Рассчитываем...')
          : (isUz ? 'Mening gorizontimni ko\'rsating' : 'Построить мой гороскоп')}
      </button>

      <p className="text-center text-xs text-stone-400">
        {isUz ? 'Bu ma\'lumotlar sir saqlanadi' : 'Данные не сохраняются на сервере'}
      </p>
    </form>
  );
}

// Export the helper so the API route can use it
export { getZodiacSign };
