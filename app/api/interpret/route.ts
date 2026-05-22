import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const KEYWORD_INTERPRETATIONS: Record<string, string> = {
  змея: 'Змея в вашем сне — сильный символ трансформации. Контекст, который вы описали, указывает на скрытые изменения в вашей жизни. Обратите внимание на отношения с людьми, которые могут быть неискренни.',
  зубы: 'Ваш сон о зубах отражает уровень тревоги и контроля над жизненными ситуациями. Детали, которые вы описали, говорят о необходимости уделить больше внимания своей уверенности в себе.',
  вода: 'Вода в вашем сне — зеркало ваших эмоций. Описанные вами детали указывают на эмоциональный поток, который вы сейчас переживаете. Доверяйте своей интуиции.',
  огонь: 'Огонь в вашем сне говорит о мощной внутренней энергии. Ситуация, которую вы описали, указывает на страсть и желание перемен.',
  дом: 'Ваш сон о доме — отражение вашего психологического состояния. Детали говорят о вашем отношении к семье и безопасности.',
};

function generateRuleBasedInterpretation(dreamText: string): string {
  const text = dreamText.toLowerCase();

  for (const [keyword, interpretation] of Object.entries(KEYWORD_INTERPRETATIONS)) {
    if (text.includes(keyword)) {
      return interpretation;
    }
  }

  const emotions = text.includes('страх') || text.includes('боял') || text.includes('ужас')
    ? 'Сон несёт тревожные эмоции, что говорит о стрессе в реальной жизни.'
    : text.includes('радост') || text.includes('счаст') || text.includes('смеял')
    ? 'Позитивные эмоции во сне — хороший знак. Подсознание посылает вам оптимистичный сигнал.'
    : 'Ваш сон несёт нейтральный эмоциональный фон.';

  const hasOtherPeople = text.includes('люди') || text.includes('человек') || text.includes('друг') || text.includes('родител') || text.includes('семья');
  const socialPart = hasOtherPeople
    ? ' Присутствие других людей в сне указывает на важность социальных связей в данный момент.'
    : '';

  return `${emotions}${socialPart} Прислушайтесь к своим ощущениям после пробуждения — они подскажут правильное направление.`;
}

export async function POST(req: NextRequest) {
  let dream: string;
  try {
    const body = await req.json();
    dream = body.dream;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!dream || typeof dream !== 'string') {
    return NextResponse.json({ error: 'Dream text required' }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const result = await model.generateContent(
        `Ты — опытный толкователь снов для аудитории из Узбекистана и СНГ.
Дай персональное толкование сна (2-3 абзаца, не более 200 слов).
Описание сна пользователя: "${dream}".
Пиши на русском языке, тепло и доступно. Толкуй только то, что описал пользователь.`
      );

      const interpretation = result.response.text();
      return NextResponse.json({ interpretation });
    } catch (geminiError) {
      console.error('Gemini API error:', geminiError instanceof Error ? geminiError.message : geminiError);
    }
  }

  const interpretation = generateRuleBasedInterpretation(dream);
  return NextResponse.json({ interpretation });
}
