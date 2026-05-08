'use client';

import { useState } from 'react';
import { Plus, CheckCircle } from 'lucide-react';

const ORIGINS = [
  { value: 'uzbek',        ru: 'Узбекское',        uz: "O'zbek" },
  { value: 'arabic',       ru: 'Арабское',          uz: 'Arab' },
  { value: 'persian',      ru: 'Персидское',        uz: 'Fors' },
  { value: 'turkic',       ru: 'Тюркское',          uz: 'Turkiy' },
  { value: 'slavic',       ru: 'Славянское',        uz: 'Slavyan' },
  { value: 'greek',        ru: 'Греческое',         uz: 'Yunoncha' },
  { value: 'latin',        ru: 'Латинское',         uz: 'Lotin' },
  { value: 'hebrew',       ru: 'Древнееврейское',   uz: 'Ibroniy' },
  { value: 'scandinavian', ru: 'Скандинавское',     uz: 'Skandinaviya' },
];

export default function NameSubmitForm({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [form, setForm] = useState({ name: '', gender: 'male', origin: '', meaning: '', notes: '' });

  const isUz = locale === 'uz';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.origin) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/names/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 border border-dashed border-teal-300 text-teal-600 hover:bg-teal-50 rounded-xl text-sm font-medium transition-colors"
      >
        <Plus className="w-4 h-4" />
        {isUz ? "Ism qo'shish" : 'Предложить имя'}
      </button>
    );
  }

  if (status === 'done') {
    return (
      <div className="bg-teal-50 border border-teal-200 rounded-2xl p-6 text-center">
        <CheckCircle className="w-8 h-8 text-teal-600 mx-auto mb-2" />
        <p className="font-medium text-stone-900">
          {isUz ? 'Rahmat! Ism tekshiruvga yuborildi.' : 'Спасибо! Имя отправлено на проверку.'}
        </p>
        <p className="text-stone-500 text-sm mt-1">
          {isUz ? 'Moderatsiyadan o\'tgach qo\'shiladi.' : 'После модерации будет добавлено в базу.'}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-stone-200 rounded-2xl p-6 card-shadow">
      <h3 className="font-semibold text-stone-900 mb-4">
        {isUz ? "Yangi ism qo'shish" : 'Предложить имя в базу'}
      </h3>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">
            {isUz ? 'Ism' : 'Имя'} *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder={isUz ? 'Ismni kiriting...' : 'Введите имя...'}
            className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">
              {isUz ? 'Jinsi' : 'Пол'} *
            </label>
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-teal-400"
            >
              <option value="male">{isUz ? 'Erkak' : 'Мужское'}</option>
              <option value="female">{isUz ? 'Ayol' : 'Женское'}</option>
              <option value="unisex">{isUz ? 'Ikkalasi' : 'Унисекс'}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1">
              {isUz ? 'Kelib chiqishi' : 'Происхождение'} *
            </label>
            <select
              value={form.origin}
              onChange={(e) => setForm({ ...form, origin: e.target.value })}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-teal-400"
              required
            >
              <option value="">{isUz ? 'Tanlang...' : 'Выберите...'}</option>
              {ORIGINS.map((o) => (
                <option key={o.value} value={o.value}>{isUz ? o.uz : o.ru}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">
            {isUz ? 'Ma\'nosi (ixtiyoriy)' : 'Значение (необязательно)'}
          </label>
          <textarea
            value={form.meaning}
            onChange={(e) => setForm({ ...form, meaning: e.target.value })}
            placeholder={isUz ? 'Ism ma\'nosini kiriting...' : 'Краткое значение имени...'}
            rows={2}
            className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">
            {isUz ? 'Izoh (ixtiyoriy)' : 'Комментарий (необязательно)'}
          </label>
          <input
            type="text"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder={isUz ? 'Qo\'shimcha ma\'lumot...' : 'Источник или дополнение...'}
            className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
          />
        </div>
      </div>

      {status === 'error' && (
        <p className="text-red-500 text-xs mt-3">
          {isUz ? 'Xatolik yuz berdi. Qayta urinib ko\'ring.' : 'Ошибка. Попробуйте позже.'}
        </p>
      )}

      <div className="flex gap-2 mt-4">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex-1 py-2 border border-stone-200 text-stone-600 hover:bg-stone-50 rounded-xl text-sm font-medium transition-colors"
        >
          {isUz ? 'Bekor qilish' : 'Отмена'}
        </button>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors"
        >
          {status === 'loading' ? '...' : (isUz ? 'Yuborish' : 'Отправить')}
        </button>
      </div>
    </form>
  );
}
