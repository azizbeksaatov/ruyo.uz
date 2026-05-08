import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const KEYWORD_INTERPRETATIONS: Record<string, string> = {
  змея: 'Змея в вашем сне — сильный символ трансформации. Контекст, который вы описали, указывает на скрытые изменения в вашей жизни. Обратите внимание на отношения с людьми, которые могут быть неискренни.',
  зубы: 'Ваш сон о зубах отражает уровень тревоги и контроля над жизненными ситуациями. Детали, которые вы описали, говорят о необходимости уделить больше внимания своей уверенности в себе.',
  вода: 'Вода в вашем сне — зеркало ваших эмоций. Описанные вами детали указывают на эмоциональный поток, который вы сейчас переживаете. Доверяйте своей интуиции.',
  огонь: 'Огонь в вашем сне говорит о мощной внутренней энергии. Ситуация, которую вы описали, указывает на страсть и желание перемен.',
  дом: 'Ваш сон о доме — отражение вашего психологического состояния. Детали говорят о вашем отношении к семье и безопасности.',
};

function generateRuleBasedInterpretation(dreamText: string, context: string): string {
  const text = dreamText.toLowerCase();

  for (const [keyword, interpretation] of Object.entries(KEYWORD_INTERPRETATIONS)) {
    if (text.includes(keyword) || context.toLowerCase().includes(keyword)) {
      return interpretation;
    }
  }

  const emotions = text.includes('страх') || text.includes('боял') || text.includes('ужас')
    ? 'Сон несёт тревожные эмоции, что говорит о стрессе в реальной жизни.'
    : text.includes('радост') || text.includes('счаст') || text.includes('смеял')
    ? 'Позитивные эмоции во сне — хороший знак. Подсознание посылает вам оптимистичный сигнал.'
    : 'Ваш сон содержит нейтральные эмоции.';

  const hasOtherPeople = text.includes('люди') || text.includes('человек') || text.includes('друг') || text.includes('родител') || text.includes('семья');
  const socialPart = hasOtherPeople
    ? ' Присутствие других людей в сне указывает на важность социальных связей в данный момент.'
    : '';

  return `${emotions}${socialPart} Контекст "${context}" в вашем сне символизирует важный аспект вашей жизни, требующий внимания. Прислушайтесь к своим ощущениям после пробуждения — они подскажут правильное направление.`;
}

export async function POST(req: NextRequest) {
  try {
    const { dream, context } = await req.json();

    if (!dream || typeof dream !== 'string') {
      return NextResponse.json({ error: 'Dream text required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const result = await model.generateContent(
        `Ты — опытный толкователь снов для аудитории из Узбекистана и СНГ.
Дай персональное толкование сна (2-3 абзаца, не более 200 слов).
Контекст сна: "${context}".
Описание сна пользователя: "${dream}".
Пиши на русском языке, тепло и доступно.`
      );

      const interpretation = result.response.text();
      return NextResponse.json({ interpretation });
    }

    const interpretation = generateRuleBasedInterpretation(dream, context);
    return NextResponse.json({ interpretation });

  } catch (error) {
    console.error('Interpret error:', error);
    return NextResponse.json(
      { interpretation: 'Произошла ошибка при анализе. Попробуйте позже.' },
      { status: 500 }
    );
  }
}
