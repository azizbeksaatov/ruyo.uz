import { NextRequest, NextResponse } from 'next/server';
import { broadcastBilingual, dailyIndex } from '@/lib/telegram';
import { names } from '@/data/names';

function utmLink(locale: string, slug: string): string {
  return `https://ruyo.uz/${locale}/imya/${slug}?utm_source=telegram&utm_medium=social&utm_campaign=imya`;
}

const sortedNames = [...names].sort((a, b) => b.popularity - a.popularity);

const originEmojiMap: Record<string, string> = {
  uzbek: '🇺🇿', arabic: '🌙', persian: '🌺', turkic: '⚡',
  slavic: '❄️', greek: '🏛️', latin: '🦅', hebrew: '✡️',
  scandinavian: '⚔️',
};

const originRu: Record<string, string> = {
  uzbek: 'Узбекское', arabic: 'Арабское', persian: 'Персидское', turkic: 'Тюркское',
  slavic: 'Славянское', greek: 'Греческое', latin: 'Латинское', hebrew: 'Еврейское',
  scandinavian: 'Скандинавское',
};

const originUz: Record<string, string> = {
  uzbek: "O'zbek", arabic: 'Arab', persian: 'Fors', turkic: 'Turk',
  slavic: 'Slavyan', greek: 'Yunon', latin: 'Lotin', hebrew: 'Ibroniy',
  scandinavian: 'Skandinaviya',
};

const elementUz: Record<string, string> = {
  'Земля': 'Yer', 'Вода': 'Suv', 'Огонь': 'Olov', 'Воздух': 'Havo',
  'Эфир': 'Efir', 'Металл': 'Metall', 'Дерево': 'Daraxt',
};

export async function GET(req: NextRequest) {
  const secret = req.headers.get('authorization');
  if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const name = sortedNames[dailyIndex(sortedNames, 2)];
  const genderEmoji = name.gender === 'male' ? '👦' : name.gender === 'female' ? '👧' : '👤';
  const originEmoji = originEmojiMap[name.origin] ?? '✨';
  const origRu = originRu[name.origin] ?? name.origin;
  const origUz = originUz[name.origin] ?? name.origin;
  const elemUz = elementUz[name.element] ?? name.element;

  const textRu =
`${genderEmoji} <b>Имя ${name.name}</b> — что оно означает?

${originEmoji} Происхождение: <i>${origRu}</i>
✨ ${name.meaning}

🔢 Счастливые числа: ${name.luckyNumbers.join(', ')}
🌿 Стихия: ${name.element}

📖 Полный разбор имени → ${utmLink('ru', name.slug)}

#имя #${name.name.toLowerCase()} #значениеимени #ruyo`;

  const textUz =
`${genderEmoji} <b>${name.name} ismi</b> — bu nima degani?

${originEmoji} Kelib chiqishi: <i>${origUz}</i>
✨ ${name.meaning}

🔢 Baxtli raqamlar: ${name.luckyNumbers.join(', ')}
🌿 Element: ${elemUz}

📖 Ismning to'liq tahlili → ${utmLink('uz', name.slug)}

#ism #${name.name.toLowerCase()} #ismmаnosi #ruyo`;

  try {
    await broadcastBilingual(textRu, textUz);
    return NextResponse.json({ ok: true, name: name.slug });
  } catch (err: any) {
    console.error('Telegram name error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
