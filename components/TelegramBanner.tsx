'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const STORAGE_KEY = 'tg_banner_v1';
const DISMISS_TTL = 7 * 86400000; // 7 days

export default function TelegramBanner({ locale }: { locale: string }) {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const ts = localStorage.getItem(STORAGE_KEY);
      if (ts && Date.now() - parseInt(ts) < DISMISS_TTL) return;
    } catch { return; }

    let triggered = false;
    const reveal = () => {
      if (triggered) return;
      triggered = true;
      setShow(true);
    };

    const timer = setTimeout(reveal, 30000);
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0 && window.scrollY / total > 0.65) reveal();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { clearTimeout(timer); window.removeEventListener('scroll', onScroll); };
  }, []);

  const dismiss = () => {
    try { localStorage.setItem(STORAGE_KEY, Date.now().toString()); } catch {}
    setShow(false);
  };

  if (!mounted) return null;

  const isUz = locale === 'uz';
  const link = isUz ? 'https://t.me/ruyo_uz' : 'https://t.me/ruyouz_ru';

  return (
    <div
      className={`fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4 transition-all duration-500 ${
        show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
      }`}
    >
      <div className="w-full max-w-lg bg-white border border-violet-200 rounded-2xl p-4 shadow-xl shadow-violet-100/40 flex items-center gap-3">
        <span className="text-xl shrink-0">✈️</span>
        <p className="flex-1 text-sm text-stone-700 leading-snug">
          {isUz ? (
            <><strong>Har kuni</strong> — tush taʼbiri va munajjimlar bashorati. Bepul!</>
          ) : (
            <><strong>Каждый день</strong> — гороскоп и толкование сна. Бесплатно!</>
          )}
        </p>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={dismiss}
          className="shrink-0 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-semibold transition-colors whitespace-nowrap"
        >
          {isUz ? "Obuna bo'lish" : 'Подписаться'}
        </a>
        <button onClick={dismiss} className="shrink-0 text-stone-400 hover:text-stone-600 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
