import { NextRequest, NextResponse } from 'next/server';
import { broadcastBilingual } from '@/lib/telegram';
import { zodiacSigns, getHoroscopeForToday } from '@/data/horoscopes';

const MONTHS_RU = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
const MONTHS_UZ = ['yanvar','fevral','mart','aprel','may','iyun','iyul','avgust','sentabr','oktabr','noyabr','dekabr'];

function todayLabel(months: string[]): string {
  const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tashkent' }));
  return `${d.getDate()} ${months[d.getMonth()]}`;
}

function utmLink(locale: string, slug: string): string {
  return `https://ruyo.uz/${locale}/goroskop/${slug}?utm_source=telegram&utm_medium=social&utm_campaign=horoscope`;
}

export async function GET(req: NextRequest) {
  const secret = req.headers.get('authorization');
  if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const dayIdx = Math.floor(Date.now() / 86400000);
    const pairIdx = dayIdx % 6;
    const sign1 = zodiacSigns[pairIdx * 2];
    const sign2 = zodiacSigns[pairIdx * 2 + 1];
    const h1 = getHoroscopeForToday(sign1.slug);
    const h2 = getHoroscopeForToday(sign2.slug);

    const dateRu = todayLabel(MONTHS_RU);
    const dateUz = todayLabel(MONTHS_UZ);

    const textRu =
`🔮 <b>Гороскоп на ${dateRu}</b>

${sign1.emoji} <b>${sign1.ru}</b>
${h1.general}
💕 ${h1.love}
💰 ${h1.finance}
💡 <i>${h1.advice}</i>
🔗 ${utmLink('ru', sign1.slug)}

${sign2.emoji} <b>${sign2.ru}</b>
${h2.general}
💕 ${h2.love}
💰 ${h2.finance}
💡 <i>${h2.advice}</i>
🔗 ${utmLink('ru', sign2.slug)}

#гороскоп #${sign1.ru.toLowerCase()} #${sign2.ru.toLowerCase()} #астрология #ruyo`;

    const textUz =
`🔮 <b>${dateUz} uchun munajjimlar bashorati</b>

${sign1.emoji} <b>${sign1.uz}</b>
${h1.general}
💕 ${h1.love}
💰 ${h1.finance}
💡 <i>${h1.advice}</i>
🔗 ${utmLink('uz', sign1.slug)}

${sign2.emoji} <b>${sign2.uz}</b>
${h2.general}
💕 ${h2.love}
💰 ${h2.finance}
💡 <i>${h2.advice}</i>
🔗 ${utmLink('uz', sign2.slug)}

#munajjimlar #${sign1.uz.toLowerCase().replace(/'/g, '')} #${sign2.uz.toLowerCase().replace(/'/g, '')} #astrologiya #ruyo`;

    await broadcastBilingual(textRu, textUz);
    return NextResponse.json({ ok: true, signs: [sign1.slug, sign2.slug] });
  } catch (err: any) {
    console.error('Telegram horoscope error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
