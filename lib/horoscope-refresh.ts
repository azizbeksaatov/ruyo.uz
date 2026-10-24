import { GoogleGenerativeAI } from '@google/generative-ai';
import { upsertHoroscope, getPeriodKey } from './horoscopes-db';

const SIGNS = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
];

const SIGN_NAMES_RU: Record<string, string> = {
  aries: 'Овен', taurus: 'Телец', gemini: 'Близнецы', cancer: 'Рак',
  leo: 'Лев', virgo: 'Дева', libra: 'Весы', scorpio: 'Скорпион',
  sagittarius: 'Стрелец', capricorn: 'Козерог', aquarius: 'Водолей', pisces: 'Рыбы',
};

const PERIOD_LABEL: Record<string, string> = {
  daily: 'сегодня', weekly: 'на неделю', monthly: 'на месяц',
};

function extractTextFromHtml(html: string): string {
  const matches = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)];
  return matches
    .map((m) => m[1].replace(/<[^>]+>/g, '').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim())
    .filter((t) => t.length > 60)
    .slice(0, 8)
    .join('\n\n');
}

async function scrapeHoroscope(sign: string, period: 'daily' | 'weekly' | 'monthly'): Promise<string> {
  const urls: Record<string, string> = {
    daily: `https://1001goroskop.ru/?znak=${sign}&kn=today`,
    weekly: `https://1001goroskop.ru/?znak=${sign}&kn=week`,
    monthly: `https://horo.mail.ru/prediction/${sign}/month/`,
  };

  const fallbackUrls: Record<string, string> = {
    monthly: `https://1001goroskop.ru/?znak=${sign}&kn=year`,
  };

  try {
    const res = await fetch(urls[period], {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'ru-RU,ru;q=0.9',
      },
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) {
      const text = extractTextFromHtml(await res.text());
      if (text.length > 100) return text;
    }
  } catch {
    // fall through to fallback
  }

  if (fallbackUrls[period]) {
    try {
      const res = await fetch(fallbackUrls[period], {
        headers: { 'User-Agent': 'Mozilla/5.0 AppleWebKit/537.36' },
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) return extractTextFromHtml(await res.text());
    } catch {
      // fall through
    }
  }

  return '';
}

type GeminiResult = {
  ru: { general: string; love: string; finance: string; health: string; advice: string; lucky_color: string; lucky_number: number };
  uz: { general: string; love: string; finance: string; health: string; advice: string; lucky_color: string };
};

async function processWithGemini(sign: string, period: string, sourceText: string): Promise<GeminiResult | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const signName = SIGN_NAMES_RU[sign] ?? sign;
  const periodLabel = PERIOD_LABEL[period] ?? period;
  const hasSource = sourceText.length > 100;

  const sourceBlock = hasSource
    ? `Источник — популярный российский астрологический сайт.\nОригинальный текст:\n"""\n${sourceText}\n"""\n\nНа основе этого текста`
    : `На основе классической астрологии`;

  const prompt = `${sourceBlock} создай подробный гороскоп для знака ${signName} ${periodLabel}.

Верни ТОЛЬКО валидный JSON (без markdown, без пояснений):
{
  "ru": {
    "general": "Общий прогноз: 4-5 живых предложений без штампов",
    "love": "Любовь и отношения: 3 конкретных предложения",
    "finance": "Финансы и карьера: 3 конкретных предложения",
    "health": "Здоровье и энергия: 2-3 предложения",
    "advice": "Главный совет периода: одно ёмкое предложение",
    "lucky_color": "одно слово цвет на русском",
    "lucky_number": 7
  },
  "uz": {
    "general": "Umumiy prognoz: 4-5 gap, jonli til",
    "love": "Muhabbat va munosabatlar: 3 gap",
    "finance": "Moliya va martaba: 3 gap",
    "health": "Sog'liq va energiya: 2-3 gap",
    "advice": "Davr maslahati: bir aniq gap",
    "lucky_color": "bir so'z rang o'zbek tilida"
  }
}
Узбекский — латиница, современный разговорный, без калек с русского.`;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const raw = result.response.text().replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(raw);
    if (parsed?.ru?.general && parsed?.uz?.general) return parsed as GeminiResult;
  } catch (e) {
    console.error(`Gemini error for ${sign}/${period}:`, e instanceof Error ? e.message : e);
  }

  return null;
}

export async function refreshHoroscopes(period: 'daily' | 'weekly' | 'monthly'): Promise<{ ok: number; failed: number }> {
  const periodKey = getPeriodKey(period);
  let ok = 0;
  let failed = 0;

  for (const sign of SIGNS) {
    try {
      const sourceText = await scrapeHoroscope(sign, period);
      const data = await processWithGemini(sign, period, sourceText);

      if (!data) {
        failed++;
        continue;
      }

      const [ruResult, uzResult] = await Promise.all([
        upsertHoroscope({ sign, period, locale: 'ru', period_key: periodKey, ...data.ru }),
        upsertHoroscope({ sign, period, locale: 'uz', period_key: periodKey, ...data.uz, lucky_number: data.ru.lucky_number }),
      ]);

      if (ruResult.error || uzResult.error) {
        console.error(`Supabase upsert error ${sign}/${period}:`, ruResult.error ?? uzResult.error);
        failed++;
      } else {
        ok++;
      }

      // Small delay between signs to avoid rate limiting
      await new Promise((r) => setTimeout(r, 300));
    } catch (e) {
      console.error(`Error processing ${sign}/${period}:`, e instanceof Error ? e.message : e);
      failed++;
    }
  }

  return { ok, failed };
}
