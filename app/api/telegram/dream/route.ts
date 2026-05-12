import { NextRequest, NextResponse } from 'next/server';
import { broadcastBilingual, dailyIndex } from '@/lib/telegram';
import { dreams } from '@/data/dreams';
import { dreamsUz } from '@/data/dreams-uz';

function utmLink(locale: string, slug: string): string {
  return `https://ruyo.uz/${locale}/sonnik/${slug}?utm_source=telegram&utm_medium=social&utm_campaign=sonnik`;
}

export async function GET(req: NextRequest) {
  const secret = req.headers.get("authorization");
  if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const idx = dailyIndex(dreams, 1);
  const dream = dreams[idx];
  const uz = dreamsUz[dream.slug];

  const textRu =
`🌙 <b>К чему снится ${dream.title.toLowerCase()}?</b>

💭 ${dream.short}

👩 <b>Для женщин:</b> ${dream.forWoman.slice(0, 120)}...
👨 <b>Для мужчин:</b> ${dream.forMan.slice(0, 120)}...

📖 Полное толкование → ${utmLink('ru', dream.slug)}

#сонник #сон #тушта #ruyo`;

  const uzTitle = uz?.title ?? dream.title;
  const uzShort = uz?.short ?? dream.short;
  const uzForWoman = uz?.forWoman ?? dream.forWoman;
  const uzForMan = uz?.forMan ?? dream.forMan;

  const textUz =
`🌙 <b>Tushda ${uzTitle.toLowerCase()} ko'rish nima degani?</b>

💭 ${uzShort}

👩 <b>Ayollar uchun:</b> ${uzForWoman.slice(0, 120)}...
👨 <b>Erkaklar uchun:</b> ${uzForMan.slice(0, 120)}...

📖 To'liq ta'birni o'qish → ${utmLink('uz', dream.slug)}

#tushta #tushta'biri #ruyo`;

  try {
    await broadcastBilingual(textRu, textUz);
    return NextResponse.json({ ok: true, dream: dream.slug });
  } catch (err: any) {
    console.error('Telegram dream error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
