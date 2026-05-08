'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Sparkles, Loader2 } from 'lucide-react';

interface Props {
  locale: string;
  dreamTitle: string;
}

export default function DreamAiInterpreter({ dreamTitle }: Props) {
  const t = useTranslations('ai');
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dream: text, context: dreamTitle }),
      });
      const data = await res.json();
      setResult(data.interpretation || t('empty'));
    } catch {
      setResult(t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-violet-50 border border-violet-100 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="w-5 h-5 text-violet-600" />
        <h2 className="font-semibold text-stone-900">{t('title')}</h2>
      </div>
      <p className="text-stone-500 text-sm mb-4">
        {t('subtitle')}
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('placeholder', { dream: dreamTitle.toLowerCase() })}
          rows={3}
          className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 resize-none text-sm"
        />
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-colors"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {loading ? t('loading') : t('submit')}
        </button>
      </form>
      {result && (
        <div className="mt-4 p-4 bg-white border border-violet-100 rounded-xl">
          <p className="text-xs font-medium text-violet-600 mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> {t('result_label')}
          </p>
          <p className="text-stone-700 text-sm leading-relaxed">{result}</p>
        </div>
      )}
    </div>
  );
}
