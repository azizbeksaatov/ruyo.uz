'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { ViralTest, TestResult } from '@/data/tests';
import { testTranslationsUz } from '@/data/testTranslationsUz';
import { Share2, RefreshCw } from 'lucide-react';

export default function ViralTestClient({
  test,
  locale,
  backLabel,
}: {
  test: ViralTest;
  locale: string;
  backLabel: string;
}) {
  const t = useTranslations('tests');
  const isUz = locale === 'uz';
  const uz = isUz ? testTranslationsUz[test.slug] : null;

  const title       = uz?.title       ?? test.title;
  const description = uz?.description ?? test.description;
  const category    = uz?.category    ?? test.category;
  const questions   = uz?.questions   ?? test.questions;

  const getResultUz = (id: string) => uz?.results.find((r) => r.id === id);

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<TestResult | null>(null);
  const [started, setStarted] = useState(false);

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQ < test.questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      const counts: Record<string, number> = {};
      newAnswers.forEach((a) => { counts[a] = (counts[a] || 0) + 1; });
      const topId = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
      const r = test.results.find((r) => r.id === topId) || test.results[0];
      setResult(r);
    }
  };

  const handleReset = () => {
    setCurrentQ(0);
    setAnswers([]);
    setResult(null);
    setStarted(false);
  };

  const handleShare = async () => {
    const resultTitle = result ? (getResultUz(result.id)?.title ?? result.title) : '';
    const text = `${title}\n${t('share_text')} ${resultTitle}\n\nruyo.uz`;
    if (navigator.share) {
      await navigator.share({ title, text });
    } else {
      await navigator.clipboard.writeText(text);
      alert(t('copied'));
    }
  };

  /* ── Intro screen ── */
  if (!started) {
    return (
      <div className="bg-white rounded-3xl border border-stone-200 p-8 card-shadow text-center">
        <div className="text-7xl mb-4">{test.emoji}</div>
        <span className="inline-block text-xs text-pink-600 font-medium bg-pink-50 px-3 py-1 rounded-full mb-4">
          {category}
        </span>
        <h1 className="font-serif text-3xl font-semibold text-stone-900 mb-3">{title}</h1>
        <p className="text-stone-500 mb-8 max-w-sm mx-auto">{description}</p>

        <div className="bg-stone-50 rounded-2xl p-4 mb-8 text-left max-w-sm mx-auto">
          <p className="text-xs text-stone-400 font-medium uppercase tracking-wide mb-3">
            {questions.length} {t('questions_label')}
          </p>
          {questions.map((q, i) => (
            <div key={q.id} className="flex items-center gap-2 text-sm text-stone-600 mb-1.5">
              <span className="text-stone-300">{i + 1}.</span>
              <span className="line-clamp-1">{q.text}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => setStarted(true)}
          className="w-full max-w-sm py-4 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl font-semibold text-lg transition-colors"
        >
          {t('start')}
        </button>
      </div>
    );
  }

  /* ── Result screen ── */
  if (result) {
    const resultUz = getResultUz(result.id);
    const resultTitle = resultUz?.title ?? result.title;
    const resultDesc  = resultUz?.description ?? result.description;

    return (
      <div className="bg-white rounded-3xl border border-stone-200 p-8 card-shadow text-center">
        <div className="text-7xl mb-5">{result.emoji}</div>
        <p className="text-stone-400 text-sm uppercase tracking-wide mb-2">{t('your_result')}</p>
        <h2 className="font-serif text-3xl font-semibold text-stone-900 mb-5">{resultTitle}</h2>

        <div className="bg-stone-50 rounded-2xl p-6 mb-7 text-left">
          <p className="text-stone-700 leading-relaxed">{resultDesc}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-medium transition-colors"
          >
            <Share2 className="w-4 h-4" />
            {t('share')}
          </button>
          <button
            onClick={handleReset}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            {t('retake')}
          </button>
        </div>

        <Link href={`/${locale}/testy`} className="inline-block mt-6 text-sm text-stone-400 hover:text-stone-700 transition-colors">
          {backLabel}
        </Link>
      </div>
    );
  }

  /* ── Question screen ── */
  const question = questions[currentQ];
  const origQuestion = test.questions[currentQ];
  const progress = (currentQ / test.questions.length) * 100;

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-8 card-shadow">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-stone-400">
            {t('question_of', { current: currentQ + 1, total: test.questions.length })}
          </span>
          <span className="text-stone-400">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-stone-900 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-7">{question.text}</h2>

      <div className="space-y-3">
        {question.options.map((opt, idx) => (
          <button
            key={opt.id}
            onClick={() => handleAnswer(origQuestion.options[idx].value)}
            className="w-full text-left p-4 rounded-xl bg-stone-50 border border-stone-200 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all group flex items-center gap-4"
          >
            <span className="w-8 h-8 rounded-lg bg-white border border-stone-200 group-hover:border-stone-700 group-hover:bg-stone-800 flex items-center justify-center text-sm font-bold text-stone-500 group-hover:text-white transition-all uppercase shrink-0">
              {opt.id}
            </span>
            <span className="font-medium">{opt.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
