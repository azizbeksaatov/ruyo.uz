import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limit: 5 requests per IP per hour
const ipMap = new Map<string, { count: number; resetAt: number }>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipMap.get(ip);
  if (!entry || now > entry.resetAt) {
    ipMap.set(ip, { count: 1, resetAt: now + 3_600_000 });
    return false;
  }
  if (entry.count >= 5) return true;
  entry.count++;
  return false;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: ip === 'unknown' ? 'Too many requests' : 'Too many requests. Try again in an hour.' },
      { status: 429 }
    );
  }
  let dream: string, context: string, locale: string;
  try {
    const body = await req.json();
    dream   = body.dream   ?? '';
    context = body.context ?? '';
    locale  = body.locale  ?? 'ru';
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!dream || typeof dream !== 'string') {
    return NextResponse.json({ error: 'Dream text required' }, { status: 400 });
  }

  const groqKey  = process.env.GROQ_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (groqKey) {
    const result = await callGroq(dream, context, locale, groqKey);
    if (result) return NextResponse.json({ interpretation: result });
  }

  if (geminiKey) {
    const result = await callGemini(dream, context, locale, geminiKey);
    if (result) return NextResponse.json({ interpretation: result });
  }

  return NextResponse.json({ interpretation: fallback(dream, locale) });
}

function buildPrompt(dream: string, context: string, locale: string): string {
  const isUz = locale === 'uz';
  const contextHint = context
    ? (isUz
        ? `Bu tush "${context}" mavzusiga oid sahifada so'ralmoqda.`
        : `Пользователь находится на странице сна о «${context}».`)
    : '';

  if (isUz) {
    return `Sen O'rta Osiyo va MDH auditoriyasi uchun tush ta'biri bo'yicha mutaxassissan.
${contextHint}
Foydalanuvchi tushini quyidagicha tasvirlab berdi: "${dream}"

Foydalanuvchi tasvirlagan narsalarga asoslanib, shaxsiy ta'bir yoz (2-3 xatboshi, 150-250 so'z).
O'zbek tilida yoz — iliq, qisqa va tushunarli tarzda.
Faqat foydalanuvchi aytgan narsalarni talqin qil, umumiy gaplar aytma.`;
  }

  return `Ты — опытный толкователь снов для аудитории из Узбекистана и СНГ.
${contextHint}
Пользователь описал свой сон: "${dream}"

Напиши персональное толкование (2-3 абзаца, 150-250 слов) строго по тому, что описал пользователь.
Пиши на русском языке — тепло, ёмко, по существу.
Не используй общие фразы вроде «этот сон означает перемены» без связи с конкретными деталями сна.`;
}

async function callGroq(dream: string, context: string, locale: string, apiKey: string): Promise<string | null> {
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: buildPrompt(dream, context, locale) }],
        max_tokens: 400,
        temperature: 0.7,
      }),
    });
    if (!res.ok) {
      console.error('Groq error:', res.status, await res.text());
      return null;
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? null;
  } catch (err) {
    console.error('Groq fetch error:', err);
    return null;
  }
}

async function callGemini(dream: string, context: string, locale: string, apiKey: string): Promise<string | null> {
  const models = ['gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-pro'];
  const prompt = buildPrompt(dream, context, locale);

  for (const model of models) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );
      if (!res.ok) continue;
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
    } catch {
      continue;
    }
  }
  return null;
}

function fallback(dream: string, locale: string): string {
  const text = dream.toLowerCase();
  const isUz = locale === 'uz';

  const hasPositive = /радост|счаст|смеял|весел|летел|полёт/.test(text)
    || /baxt|quvon|chiroyl|yaxshi|uchdim|parvoz/.test(text);
  const hasNegative = /страх|боял|ужас|бежал|упал|темнот/.test(text)
    || /qo'rq|dahshat|qochd|qorong|yiqild/.test(text);
  const hasPeople = /люди|человек|друг|родител|семья|муж|жена|мать|отец/.test(text)
    || /odamlar|do'st|oila|er|xotin|ona|ota/.test(text);

  if (isUz) {
    const emotion = hasPositive
      ? "Tushingizda ijobiy his-tuyg'ular bor — bu ong osti yaxshi signal yuborayotganini bildiradi."
      : hasNegative
      ? "Tushingizda tashvish seziladi — bu haqiqiy hayotdagi stress yoki hal etilmagan muammolarni aks ettirishi mumkin."
      : "Tushingiz neytral kayfiyatda — ong osti biror narsani qayta ishlayapti.";
    const social = hasPeople ? " Tushda boshqa odamlar borligi hozirda ijtimoiy munosabatlar muhim ekanini ko'rsatadi." : "";
    return `${emotion}${social} Uyg'ongandan keyingi his-tuyg'ularingizga quloq soling — ular to'g'ri yo'lni ko'rsatadi.`;
  }

  const emotion = hasPositive
    ? "Позитивные эмоции во сне — хороший знак. Подсознание посылает оптимистичный сигнал."
    : hasNegative
    ? "Тревожные эмоции в сне отражают стресс или нерешённые вопросы в реальной жизни."
    : "Ваш сон несёт нейтральный эмоциональный фон — подсознание обрабатывает события дня.";
  const social = hasPeople ? " Присутствие других людей говорит о важности социальных связей в данный момент." : "";
  return `${emotion}${social} Прислушайтесь к своим ощущениям после пробуждения — они подскажут правильное направление.`;
}
