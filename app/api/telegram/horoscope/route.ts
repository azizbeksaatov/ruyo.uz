import { NextRequest, NextResponse } from 'next/server';
import { broadcastBilingual } from '@/lib/telegram';
import { zodiacSigns } from '@/data/horoscopes';

const MONTHS_RU = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
const MONTHS_UZ = ['yanvar','fevral','mart','aprel','may','iyun','iyul','avgust','sentabr','oktabr','noyabr','dekabr'];

function todayLabel(months: string[]): string {
  const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tashkent' }));
  return `${d.getDate()} ${months[d.getMonth()]}`;
}

function utmLink(locale: string, slug: string): string {
  return `https://ruyo.uz/${locale}/goroskop/${slug}?utm_source=telegram&utm_medium=social&utm_campaign=horoscope`;
}

interface HoroText { general: string; love: string; finance: string; advice: string }

const templatesRu: Record<string, HoroText> = {
  oven:      { general: 'Сегодня звёзды благоволят вашей энергии. День подходит для новых начинаний.', love: 'В личной жизни царит страсть. Одинокие Овны могут встретить интересного человека.', finance: 'Хороший день для деловых переговоров. Избегайте импульсивных трат.', advice: 'Прежде чем действовать — на секунду остановитесь и подумайте.' },
  telets:    { general: 'День обещает стабильность и небольшие приятные сюрпризы. Ваше терпение даёт плоды.', love: 'Гармония в отношениях. Хороший день для откровенного разговора.', finance: 'Финансы стабильны. Возможна небольшая прибыль от вложений.', advice: 'Не бойтесь принимать комплименты — вы их заслуживаете.' },
  bliznetsy: { general: 'Активный день. Общение приносит новые идеи и возможности.', love: 'Флирт и лёгкое веселье украсят день. Не принимайте всё слишком серьёзно.', finance: 'Информация — ваш главный актив сегодня. Нужный контакт откроет горизонты.', advice: 'Запишите все идеи, которые придут сегодня.' },
  rak:       { general: 'Интуиция на высоте. Доверяйте своим чувствам — они точнее логики.', love: 'Глубокое эмоциональное единение с близкими. Хороший день для семьи.', finance: 'Будьте осторожны с финансами — эмоциональные решения могут быть невыгодны.', advice: 'Сегодня лучший советник — ваше сердце.' },
  lev:       { general: 'День создан для вас. Ваша харизма привлекает внимание и открывает двери.', love: 'Романтика в воздухе. Вы блистаете — партнёр это замечает.', finance: 'Возможность проявить лидерство в деловой сфере. Риск оправдан.', advice: 'Поделитесь своим светом с окружающими — это вернётся к вам.' },
  deva:      { general: 'День для детальной работы и наведения порядка. Ваша точность впечатляет.', love: 'Внимание к деталям поможет решить давний вопрос в отношениях.', finance: 'Хороший момент для планирования бюджета и анализа расходов.', advice: 'Позвольте себе маленькую радость среди рабочего дня.' },
  vesy:      { general: 'День гармонии и баланса. Дипломатия открывает нужные двери.', love: 'Ваше обаяние на пике. Время для романтичного жеста.', finance: 'Переговоры пройдут успешно — ищите компромисс, и он найдётся.', advice: 'Доверяйте своему чувству справедливости.' },
  skorpion:  { general: 'Глубокий и насыщенный день. Скрытая информация выходит на поверхность.', love: 'Страстный день. Ваши чувства сильны — не бойтесь их выражать.', finance: 'Интуиция подскажет верное финансовое решение. Прислушайтесь.', advice: 'Отпустите то, что уже не служит вам.' },
  strelets:  { general: 'Оптимизм и жажда приключений — ваши спутники сегодня.', love: 'Открытость и честность укрепят ваши отношения.', finance: 'Новые горизонты в делах. Смелая идея может принести плоды.', advice: 'Мечтайте масштабно, но действуйте поэтапно.' },
  kozerog:   { general: 'Целеустремлённость приносит результаты. Ваш труд не остаётся незамеченным.', love: 'Стабильность в отношениях. Партнёр ценит вашу надёжность.', finance: 'Долгосрочные инвестиции дают первые плоды. Продолжайте путь.', advice: 'Дайте себе время на отдых — вы его заслужили.' },
  vodoley:   { general: 'Оригинальные идеи льются потоком. Ваше мышление опережает время.', love: 'Дружба может перерасти в нечто большее. Будьте открыты новому.', finance: 'Нестандартный подход решит финансовый вопрос неожиданным образом.', advice: 'Ваша уникальность — это сила, а не слабость.' },
  ryby:      { general: 'Мечты приближаются к реальности. Творчество и интуиция на подъёме.', love: 'Романтика и нежность наполняют ваши отношения сегодня.', finance: 'Творческий проект может принести неожиданный доход.', advice: 'Медитация или тихая прогулка восстановят внутренний баланс.' },
};

const templatesUz: Record<string, HoroText> = {
  oven:      { general: 'Bugun yulduzlar sizning energiyangizga yordam beradi. Yangi boshlanishlar uchun ajoyib kun.', love: 'Shaxsiy hayotda ishtiyoq hukm suradi. Yolg\'iz Qo\'ylar qiziqarli inson bilan uchrashishi mumkin.', finance: 'Ishbilarmonlik muzokaralari uchun qulay kun. Impulsiv xarajatlardan saqlaning.', advice: 'Harakat qilishdan oldin bir daqiqa to\'xtab, o\'ylang.' },
  telets:    { general: 'Kun barqarorlik va kichik yoqimli ajablanishlar va\'da qiladi. Sabr-toqatingiz meva bermoqda.', love: 'Munosabatlarda uyg\'unlik hukm suradi. Samimiy suhbat uchun ajoyib kun.', finance: 'Moliyaviy holat barqaror. Investitsiyalardan kichik daromad kutiladi.', advice: 'Maqtovlarni qabul qilishdan qo\'rqmang — siz buni haqiqatan loyiqsiz.' },
  bliznetsy: { general: 'Faol va qiziqarli kun. Muloqot yangi g\'oyalar va imkoniyatlar keltiradi.', love: 'Flirt va yengil ko\'ngil ochish kunni bezaydi. Hamma narsani jiddiy qabul qilmang.', finance: 'Ma\'lumot bugungi eng asosiy aktivingiz. To\'g\'ri aloqa yangi imkoniyatlar ochadi.', advice: 'Bugun keladigan barcha g\'oyalarni yozib qo\'ying.' },
  rak:       { general: 'Sezgi cho\'qqisida. His-tuyg\'ularingizga ishoning — ular mantiqdan aniqroq.', love: 'Yaqinlar bilan chuqur hissiy birlashuv. Oila ishlari uchun ajoyib kun.', finance: 'Moliyaviy qarorlarda ehtiyot bo\'ling — hissiy qarorlar noqulay bo\'lishi mumkin.', advice: 'Bugun eng yaxshi maslahatchi — sizning yuragingiz.' },
  lev:       { general: 'Bu kun siz uchun yaratilgan. Xarizmaingiz e\'tiborni jalb qiladi va eshiklarni ochadi.', love: 'Romantika havoda. Siz charaqlab turasiz — sherik buni sezadi.', finance: 'Ishbilarmon sohada rahbarlikni namoyon etish imkoniyati. Xavf oqlangan.', advice: 'Yorug\'ligingizni atrofingizlar bilan bo\'lishing — u sizga qaytadi.' },
  deva:      { general: 'Batafsil ish va tartib o\'rnatish kuni. Aniqligingiz hayratga soladi.', love: 'Tafsilotlarga e\'tibor munosabatlardagi uzoq masalani hal qilishga yordam beradi.', finance: 'Byudjetni rejalashtirish va xarajatlarni tahlil qilish uchun yaxshi vaqt.', advice: 'Ish kuni orasida o\'zingizga kichik xursandchilik qilishga ruxsat bering.' },
  vesy:      { general: 'Uyg\'unlik va muvozanat kuni. Diplomatiya kerakli eshiklarni ochadi.', love: 'Jozibadorligingiz cho\'qqisida. Romantik imo-ishora uchun vaqt keldi.', finance: 'Muzokaralar muvaffaqiyatli o\'tadi — murosani toping va u topiladi.', advice: 'Adolat tuyg\'ularingizga ishoning.' },
  skorpion:  { general: 'Chuqur va boy kun. Yashirin ma\'lumot yuzaga chiqadi.', love: 'Ishtiyoqli kun. Hissiyotlaringiz kuchli — ularni ifodalashdan qo\'rqmang.', finance: 'Sezgi to\'g\'ri moliyaviy qarorni aytib beradi. Quloq soling.', advice: 'Sizga xizmat qilmayotgan narsani qo\'yib yuboring.' },
  strelets:  { general: 'Optimizm va sarguzasht ishtiyoqi — bugungi hamroqlaringiz.', love: 'Ochiqlik va halollik munosabatlaringizni mustahkamlaydi.', finance: 'Ishdagi yangi ufqlar. Jasur g\'oya meva berishi mumkin.', advice: 'Katta orzular quling, lekin bosqichma-bosqich harakat qiling.' },
  kozerog:   { general: 'Maqsadga intilish natija beradi. Mehnatingiiz e\'tibordan chetda qolmaydi.', love: 'Munosabatlarda barqarorlik. Sherik ishonchliligingizni qadrlab turibdi.', finance: 'Uzoq muddatli investitsiyalar birinchi mevalrini beryapti. Yo\'lni davom ettiring.', advice: 'O\'zingizga dam olish vaqtini bering — siz buni loyiqsiz.' },
  vodoley:   { general: 'Original g\'oyalar oqim bo\'lib kelmoqda. Fikrlashingiz vaqtdan oldinda.', love: 'Do\'stlik yanada kattaroq narsaga aylanishi mumkin. Yangilikka ochiq bo\'ling.', finance: 'Nostandart yondashuv moliyaviy masalani kutilmagan tarzda hal qiladi.', advice: 'Sizning o\'ziga xosligingiz — bu kuchsizlik emas, balki kuch.' },
  ryby:      { general: 'Orzular haqiqatga yaqinlashmoqda. Ijodkorlik va sezgi ko\'tarilishda.', love: 'Romantika va mehribonlik bugun munosabatlaringizni to\'ldiradi.', finance: 'Ijodiy loyiha kutilmagan daromad keltirishi mumkin.', advice: 'Meditatsiya yoki tinch sayr ichki muvozanatni tiklaydi.' },
};

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
    const h1ru = templatesRu[sign1.slug];
    const h2ru = templatesRu[sign2.slug];
    const h1uz = templatesUz[sign1.slug];
    const h2uz = templatesUz[sign2.slug];

    const dateRu = todayLabel(MONTHS_RU);
    const dateUz = todayLabel(MONTHS_UZ);

    const textRu =
`🔮 <b>Гороскоп на ${dateRu}</b>

${sign1.emoji} <b>${sign1.ru}</b>
${h1ru.general}
💕 ${h1ru.love}
💰 ${h1ru.finance}
💡 <i>${h1ru.advice}</i>
🔗 ${utmLink('ru', sign1.slug)}

${sign2.emoji} <b>${sign2.ru}</b>
${h2ru.general}
💕 ${h2ru.love}
💰 ${h2ru.finance}
💡 <i>${h2ru.advice}</i>
🔗 ${utmLink('ru', sign2.slug)}

#гороскоп #${sign1.ru.toLowerCase()} #${sign2.ru.toLowerCase()} #астрология #ruyo`;

    const textUz =
`🔮 <b>${dateUz} uchun munajjimlar bashorati</b>

${sign1.emoji} <b>${sign1.uz}</b>
${h1uz.general}
💕 ${h1uz.love}
💰 ${h1uz.finance}
💡 <i>${h1uz.advice}</i>
🔗 ${utmLink('uz', sign1.slug)}

${sign2.emoji} <b>${sign2.uz}</b>
${h2uz.general}
💕 ${h2uz.love}
💰 ${h2uz.finance}
💡 <i>${h2uz.advice}</i>
🔗 ${utmLink('uz', sign2.slug)}

#munajjimlar #${sign1.uz.toLowerCase().replace(/'/g, '')} #${sign2.uz.toLowerCase().replace(/'/g, '')} #astrologiya #ruyo`;

    await broadcastBilingual(textRu, textUz);
    return NextResponse.json({ ok: true, signs: [sign1.slug, sign2.slug] });
  } catch (err: any) {
    console.error('Telegram horoscope error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
