import { NextRequest, NextResponse } from 'next/server';
import { broadcastBilingual, dailyIndex } from '@/lib/telegram';
import { zodiacSigns, getHoroscopeForToday } from '@/data/horoscopes';

function utmLink(locale: string, slug: string, campaign: string): string {
  return `https://ruyo.uz/${locale}/goroskop/${slug}?utm_source=telegram&utm_medium=social&utm_campaign=${campaign}`;
}

export async function GET(req: NextRequest) {
  const secret = req.headers.get("authorization");
  if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Today's two signs (pairs: 0-1, 2-3, 4-5 ...)
  const dayIdx = Math.floor(Date.now() / 86400000);
  const pairIdx = dayIdx % 6; // 6 pairs = 12 signs
  const sign1 = zodiacSigns[pairIdx * 2];
  const sign2 = zodiacSigns[pairIdx * 2 + 1];

  const h1 = getHoroscopeForToday(sign1.slug);
  const h2 = getHoroscopeForToday(sign2.slug);

  const dateRu = new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', timeZone: 'Asia/Tashkent' });
  const dateUz = new Date().toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', timeZone: 'Asia/Tashkent' });

  const textRu =
`🔮 <b>Гороскоп на ${dateRu}</b>

${sign1.emoji} <b>${sign1.ru}</b>
${h1.general}
💕 ${h1.love}
💰 ${h1.finance}
💡 <i>${h1.advice}</i>
🔗 ${utmLink('ru', sign1.slug, 'horoscope')}

${sign2.emoji} <b>${sign2.ru}</b>
${h2.general}
💕 ${h2.love}
💰 ${h2.finance}
💡 <i>${h2.advice}</i>
🔗 ${utmLink('ru', sign2.slug, 'horoscope')}

#гороскоп #${sign1.ru.toLowerCase()} #${sign2.ru.toLowerCase()} #астрология #ruyo`;

  const textUz =
`🔮 <b>${dateUz} uchun munajjimlar bashorati</b>

${sign1.emoji} <b>${sign1.uz}</b>
${h1.general}
💕 ${h1.love}
💰 ${h1.finance}
💡 <i>${h1.advice}</i>
🔗 ${utmLink('uz', sign1.slug, 'horoscope')}

${sign2.emoji} <b>${sign2.uz}</b>
${h2.general}
💕 ${h2.love}
💰 ${h2.finance}
💡 <i>${h2.advice}</i>
🔗 ${utmLink('uz', sign2.slug, 'horoscope')}

#munajjimlar #${sign1.uz.toLowerCase().replace(/'/g, '')} #${sign2.uz.toLowerCase().replace(/'/g, '')} #astrologiya #ruyo`;

  await broadcastBilingual(textRu, textUz);
  return NextResponse.json({ ok: true, signs: [sign1.slug, sign2.slug] });
}
