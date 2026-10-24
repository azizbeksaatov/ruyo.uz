import { NextRequest, NextResponse } from 'next/server';
import { broadcastBilingual } from '@/lib/telegram';
import { fetchDreamOfDay } from '@/lib/dreams-db';

function utmLink(locale: string, slug: string): string {
  return `https://www.ruyo.uz/${locale === 'uz' ? 'uz/sonnik' : 'sonnik'}/${slug}?utm_source=telegram&utm_medium=social&utm_campaign=sonnik`;
}

export async function GET(req: NextRequest) {
  const secret = req.headers.get("authorization");
  if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [dreamRu, dreamUz] = await Promise.all([
    fetchDreamOfDay('ru'),
    fetchDreamOfDay('uz'),
  ]);

  if (!dreamRu || !dreamUz) {
    return NextResponse.json({ error: 'No dream found' }, { status: 500 });
  }

  const textRu =
`🌙 <b>К чему снится ${dreamRu.title.toLowerCase()}?</b>

💭 ${dreamRu.short}

👩 <b>Для женщин:</b> ${dreamRu.forWoman.slice(0, 120)}...
👨 <b>Для мужчин:</b> ${dreamRu.forMan.slice(0, 120)}...

📖 Полное толкование → ${utmLink('ru', dreamRu.slug)}

#сонник #сон #тушта #ruyo`;

  const textUz =
`🌙 <b>Tushda ${dreamUz.title.toLowerCase()} ko'rish nima degani?</b>

💭 ${dreamUz.short}

👩 <b>Ayollar uchun:</b> ${dreamUz.forWoman.slice(0, 120)}...
👨 <b>Erkaklar uchun:</b> ${dreamUz.forMan.slice(0, 120)}...

📖 To'liq ta'birni o'qish → ${utmLink('uz', dreamUz.slug)}

#tushta #tushta'biri #ruyo`;

  try {
    await broadcastBilingual(textRu, textUz);
    return NextResponse.json({ ok: true, dream: dreamRu.slug });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('Telegram dream error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
