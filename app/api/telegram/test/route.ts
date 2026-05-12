import { NextRequest, NextResponse } from 'next/server';
import { broadcastBilingual, dailyIndex } from '@/lib/telegram';
import { viralTests } from '@/data/tests';
import { testTranslationsUz, type TestUz } from '@/data/testTranslationsUz';

function utmLink(locale: string, slug: string): string {
  return `https://ruyo.uz/${locale}/test/${slug}?utm_source=telegram&utm_medium=social&utm_campaign=test`;
}

export async function GET(req: NextRequest) {
  const secret = req.headers.get('authorization');
  if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const test = viralTests[dailyIndex(viralTests, 3)];
  const uzTest: TestUz | undefined = (testTranslationsUz as Record<string, TestUz>)[test.slug];

  const teaserIdx = Math.floor(test.results.length / 2);
  const teaserRu = test.results[teaserIdx];
  const teaserUzTitle = uzTest?.results?.[teaserIdx]?.title ?? teaserRu.title;

  const uzTitle = uzTest?.title ?? test.title;
  const uzDesc = uzTest?.description ?? test.description;

  const textRu =
`🧠 <b>${test.emoji} ${test.title}</b>

${test.description}

<i>«${teaserRu.emoji} ${teaserRu.title} — это ты?»</i>

Пройди тест из ${test.questions.length} вопросов и узнай!
▶️ ${utmLink('ru', test.slug)}

#тест #личность #психология #ruyo`;

  const textUz =
`🧠 <b>${test.emoji} ${uzTitle}</b>

${uzDesc}

<i>«${teaserRu.emoji} ${teaserUzTitle} — bu senmisan?»</i>

${test.questions.length} savoldan iborat testni bajaring va biling!
▶️ ${utmLink('uz', test.slug)}

#test #shaxsiyat #psixologiya #ruyo`;

  try {
    await broadcastBilingual(textRu, textUz);
    return NextResponse.json({ ok: true, test: test.slug });
  } catch (err: any) {
    console.error('Telegram test error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
