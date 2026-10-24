import { NextRequest, NextResponse } from 'next/server';
import { names } from '@/data/names';
import { zodiacSigns, getHoroscopeForToday } from '@/data/horoscopes';
import { fetchDreamOfDay } from '@/lib/dreams-db';

const SITE = 'https://www.ruyo.uz';
const IG_API = 'https://graph.facebook.com/v21.0';

const MONTHS_RU = ['января','февраля','марта','апреля','мая','июня',
                   'июля','августа','сентября','октября','ноября','декабря'];

const ORIGIN_RU: Record<string, string> = {
  uzbek: 'Узбекское', arabic: 'Арабское', persian: 'Персидское',
  turkic: 'Тюркское', slavic: 'Славянское', greek: 'Греческое',
  latin: 'Латинское', hebrew: 'Еврейское', scandinavian: 'Скандинавское',
};

function todayLabel(): string {
  const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tashkent' }));
  return `${d.getDate()} ${MONTHS_RU[d.getMonth()]}`;
}

function dayIndex(): number {
  return Math.floor(Date.now() / 86400000);
}

// Rotate: 0=horoscope, 1=dream, 2=name
function contentType(): 'horoscope' | 'dream' | 'name' {
  const types = ['horoscope', 'dream', 'name'] as const;
  return types[dayIndex() % 3];
}

function igImageUrl(params: Record<string, string>): string {
  const qs = new URLSearchParams(params).toString();
  return `${SITE}/api/og/instagram?${qs}`;
}

async function postToInstagram(imageUrl: string, caption: string): Promise<string> {
  const accountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID!;
  const token     = process.env.INSTAGRAM_ACCESS_TOKEN!;

  // Step 1: create media container
  const createRes = await fetch(`${IG_API}/${accountId}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_url: imageUrl, caption, access_token: token }),
  });
  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`IG create media: ${err}`);
  }
  const { id: creationId } = await createRes.json();

  // Step 2: publish
  const publishRes = await fetch(`${IG_API}/${accountId}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ creation_id: creationId, access_token: token }),
  });
  if (!publishRes.ok) {
    const err = await publishRes.text();
    throw new Error(`IG publish: ${err}`);
  }
  const { id: postId } = await publishRes.json();
  return postId;
}

export async function GET(req: NextRequest) {
  const secret = req.headers.get('authorization');
  if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || !process.env.INSTAGRAM_ACCESS_TOKEN) {
    return NextResponse.json({ error: 'Instagram credentials not configured' }, { status: 503 });
  }

  const type = contentType();
  const date = todayLabel();

  try {
    let imageUrl: string;
    let caption: string;

    if (type === 'name') {
      const sorted = [...names].sort((a, b) => b.popularity - a.popularity);
      const name = sorted[dayIndex() % sorted.length];
      const originLabel = ORIGIN_RU[name.origin] ?? name.origin;

      imageUrl = igImageUrl({
        type: 'name',
        name: name.name,
        meaning: name.meaning.slice(0, 80),
        origin: originLabel,
        element: name.element,
        lucky: name.luckyNumbers.join(', '),
      });

      caption =
`✨ Имя <b>${name.name}</b> — что оно означает?

📖 Значение: «${name.meaning}»
🌍 Происхождение: ${originLabel}
🌿 Стихия: ${name.element}
🔢 Счастливые числа: ${name.luckyNumbers.join(', ')}

Полный разбор имени на сайте → ссылка в bio

#имя #${name.name.toLowerCase()} #значениеимени #исламскиеимена #узбекскиеимена #ruyo #имена #${name.origin}`;

    } else if (type === 'dream') {
      const dream = await fetchDreamOfDay('ru');
      if (!dream) throw new Error('No dream found');

      imageUrl = igImageUrl({
        type: 'dream',
        title: dream.title,
        short: dream.short,
        emoji: '🌙',
      });

      caption =
`🌙 К чему снится ${dream.title.toLowerCase()}?

${dream.short}

${dream.forWoman.slice(0, 100)}...

📖 Полное толкование → ссылка в bio

#сонник #сон #толкованиеснов #${dream.title.toLowerCase().replace(/\s+/g, '')} #ruyo #тушта #снывидения`;

    } else {
      // horoscope
      const idx = dayIndex() % zodiacSigns.length;
      const sign = zodiacSigns[idx];
      const h = getHoroscopeForToday(sign.slug);

      imageUrl = igImageUrl({
        type: 'horoscope',
        sign: sign.ru,
        signEmoji: sign.emoji,
        date,
        text: h.general,
        love: h.love.slice(0, 40),
        finance: h.finance.slice(0, 40),
      });

      caption =
`${sign.emoji} Гороскоп для ${sign.ru} • ${date}

${h.general}

💕 Любовь: ${h.love}
💰 Финансы: ${h.finance}
💡 ${h.advice}

📖 Полный гороскоп → ссылка в bio

#гороскоп #${sign.ru.toLowerCase()} #астрология #${date.replace(' ', '')} #ruyo #знакзодиака`;
    }

    const postId = await postToInstagram(imageUrl, caption);
    return NextResponse.json({ ok: true, type, postId, date });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Instagram daily error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
