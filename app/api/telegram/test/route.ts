import { NextRequest, NextResponse } from 'next/server';
import { broadcastBilingual, dailyIndex } from '@/lib/telegram';
import { viralTests } from '@/data/tests';
import { testTranslationsUz } from '@/data/testTranslationsUz';

function utmLink(locale: string, slug: string): string {
  return `https://ruyo.uz/${locale}/test/${slug}?utm_source=telegram&utm_medium=social&utm_campaign=test`;
}

export async function GET(req: NextRequest) {
  const secret = req.headers.get("authorization");
  if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const test = viralTests[dailyIndex(viralTests, 3)];
  const uzTest = (testTranslationsUz as Record<string, { title: string; description: string } | undefined>)[test.slug];

  // Pick a teaser result to show
  const teaserResult = test.results[Math.floor(test.results.length / 2)];

  const textRu =
`🧠 <b>${test.emoji} ${test.title}</b>

${test.description}

<i>«${teaserResult.emoji} ${teaserResult.title} — это ты?»</i>

Пройди тест из ${test.questions.length} вопросов и узнай!
▶️ ${utmLink('ru', test.slug)}

#тест #личность #психология #ruyo`;

  const uzTitle = uzTest?.title ?? test.title;
  const uzDesc = uzTest?.description ?? test.description;

  const textUz =
`🧠 <b>${test.emoji} ${uzTitle}</b>

${uzDesc}

<i>«${teaserResult.emoji} ${teaserResult.title} — bu senmisan?»</i>

${test.questions.length} savoldan iborat testni bajaring va biling!
▶️ ${utmLink('uz', test.slug)}

#test #shaxsiyat #psixologiya #ruyo`;

  await broadcastBilingual(textRu, textUz);
  return NextResponse.json({ ok: true, test: test.slug });
}
