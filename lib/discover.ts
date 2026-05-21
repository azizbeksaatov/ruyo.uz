// Discover-optimized titles, emoji map, and OG helpers

export const DREAM_EMOJI: Record<string, string> = {
  zmeya: '🐍', zuby: '🦷', voda: '💧', sobaka: '🐕', koshka: '🐱',
  more: '🌊', ogon: '🔥', mashina: '🚗', dom: '🏠', rebenok: '👶',
  dengi: '💰', smert: '💀', svadba: '💍', beremennost: '🤰', let: '✈️',
  ryba: '🐟', ptica: '🐦', lev: '🦁', losad: '🐴', byk: '🐂',
  kladbishe: '⚰️', bol: '😣', krov: '🩸', nebo: '☁️', luna: '🌙',
  solnce: '☀️', zvezdy: '⭐', gory: '⛰️', les: '🌲', more2: '🌊',
  koroleva: '👑', svет: '💡', noch: '🌃', den: '🌅', zima: '❄️',
  vesna: '🌸', leto: '☀️', osen: '🍂', dozhd: '🌧️', sneg: '❄️',
  reka: '🏞️', ozero: '🏞️', most: '🌉', doroga: '🛤️', les2: '🌳',
  chelovek: '👤', zhenshchina: '👩', muzhchina: '👨', rebenok2: '👶',
  starushka: '👵', starik: '👴', drug: '🤝', vrag: '😠', lyubov: '❤️',
  seks: '💕', izmena: '💔', razluka: '😢', vstrecha: '🤗',
  yeda: '🍽️', hleb: '🍞', myaso: '🥩', ovoshi: '🥦', frukty: '🍎',
  vino: '🍷', voda2: '💧', chai: '☕', kofe: '☕',
  shkola: '🏫', rabota: '💼', dengi2: '💵', uspeh: '🏆', proval: '😰',
  bolezn: '🤒', lechenie: '💊', smert2: '⚰️', rozhdeniye: '🎂',
  koroleva2: '👑', tsar: '👑', bog: '🙏', angel: '😇', chert: '😈',
  prizrak: '👻', vedomstvo: '🏛️', voyna: '⚔️', mir: '🕊️',
  kladbishe2: '🪦', mogila: '🪦', cerkov: '⛪', mechet: '🕌',
};

function slugHash(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return h;
}

export function getDreamEmoji(slug: string, tags: string[] = []): string {
  if (DREAM_EMOJI[slug]) return DREAM_EMOJI[slug];
  // Try to match by tag
  const tagMap: Record<string, string> = {
    'животные': '🐾', 'вода': '💧', 'огонь': '🔥', 'деньги': '💰',
    'смерть': '💀', 'любовь': '❤️', 'еда': '🍽️', 'страх': '😨',
    'природа': '🌿', 'дом': '🏠', 'тело': '🫀', 'работа': '💼',
    'дорога': '🛤️', 'небо': '☁️', 'мистика': '🔮', 'трансформация': '🌀',
  };
  for (const tag of tags) {
    if (tagMap[tag]) return tagMap[tag];
  }
  return '🌙';
}

// Deterministic publish date per slug (2023-2024 range)
export function getSlugDate(slug: string): string {
  const h = slugHash(slug);
  const start = new Date('2023-06-01').getTime();
  const end   = new Date('2024-10-01').getTime();
  const ts = start + (h % (end - start));
  return new Date(ts).toISOString().split('T')[0];
}

// ── Discover title formulas ────────────────────────────────────────────

const RU_DREAM_FORMULAS = [
  (n: string) => `Почему сон о ${n} — это не просто случайность`,
  (n: string) => `Что на самом деле значит ${n} во сне: толкование`,
  (n: string) => `Сон о ${n}: психологи и эзотерики объясняют`,
  (n: string) => `К чему снится ${n} — 4 версии, которые вас удивят`,
];

const UZ_DREAM_FORMULAS = [
  (n: string) => `Tushda ${n} ko'rish — bu bejiz emas`,
  (n: string) => `${n} tushga kirsa nima bo'ladi: to'liq tafsir`,
  (n: string) => `Tushda ${n}: psixologlar va ta'birchilar izohlamoqda`,
  (n: string) => `${n} tushi haqida 4 ta talqin`,
];

export function getDreamDiscoverTitle(title: string, slug: string, locale: string): string {
  const idx = slugHash(slug) % 4;
  const name = title.toLowerCase();
  return locale === 'uz'
    ? UZ_DREAM_FORMULAS[idx](name)
    : RU_DREAM_FORMULAS[idx](name);
}

export function getDreamDiscoverDescription(short: string, title: string, locale: string): string {
  const name = title.toLowerCase();
  if (locale === 'uz') {
    return `Tushda ${name} ko'rish — bu nima anglatadi? Milliy va xalqaro ta'birchilar, psixologlar va islomiy izohlar bir joyda. ${short.slice(0, 80)}`;
  }
  return `Сон о ${name}: что говорят Миллер, Ванга, Фрейд и исламский сонник. ${short.slice(0, 80)}`;
}

// ── Name titles ────────────────────────────────────────────────────────

const RU_NAME_FORMULAS = [
  (n: string) => `Почему имя ${n} несёт особый смысл: значение и характер`,
  (n: string) => `Имя ${n}: что оно говорит о характере человека`,
  (n: string) => `${n} — значение имени в исламе и астрологии`,
  (n: string) => `Что скрывает имя ${n}: происхождение и тайный смысл`,
];

const UZ_NAME_FORMULAS = [
  (n: string) => `${n} ismi nima anglatadi: kelib chiqishi va tavsifi`,
  (n: string) => `${n} — ismning ma'nosi va ega bo'lgan xarakter`,
  (n: string) => `${n} ismi islomda qanday talqin etiladi`,
  (n: string) => `${n} ismining sir-asrori: ma'no va belgilar`,
];

export function getNameDiscoverTitle(name: string, slug: string, locale: string): string {
  const idx = slugHash(slug) % 4;
  return locale === 'uz'
    ? UZ_NAME_FORMULAS[idx](name)
    : RU_NAME_FORMULAS[idx](name);
}

export function getNameDiscoverDescription(meaning: string, name: string, locale: string): string {
  if (locale === 'uz') {
    return `${name} ismi: kelib chiqishi, ma'nosi va ega bo'lgan xarakter. ${meaning.slice(0, 100)}`;
  }
  return `Имя ${name}: происхождение, значение в исламе, характер и судьба носителя. ${meaning.slice(0, 100)}`;
}

// ── Horoscope titles ───────────────────────────────────────────────────

const RU_HOROSCOPE_FORMULAS = [
  (n: string) => `${n}: что готовят звёзды — прогноз на сегодня`,
  (n: string) => `Гороскоп ${n} на сегодня: будьте готовы к переменам`,
  (n: string) => `${n} — что произойдёт сегодня по мнению астрологов`,
  (n: string) => `Почему именно сегодня важный день для ${n}`,
];

const UZ_HOROSCOPE_FORMULAS = [
  (n: string) => `${n}: yulduzlar bugun nima tayyorlamoqda`,
  (n: string) => `${n} bugungi goroskopi: o'zgarishlarga tayyor bo'ling`,
  (n: string) => `${n} — astrologlar bugun nima deyishadi`,
  (n: string) => `Nega bugun ${n} uchun muhim kun`,
];

export function getHoroscopeDiscoverTitle(signName: string, slug: string, locale: string): string {
  const idx = slugHash(slug) % 4;
  return locale === 'uz'
    ? UZ_HOROSCOPE_FORMULAS[idx](signName)
    : RU_HOROSCOPE_FORMULAS[idx](signName);
}

// ── Programmatic sub-page variants ────────────────────────────────────

export const VARIANTS = ['dlya-zhenshchin', 'dlya-muzhchin', 'islamskiy'] as const;
export type DreamVariant = typeof VARIANTS[number];

interface VariantMeta {
  ruTitle:   (dreamTitle: string, slug: string) => string;
  uzTitle:   (dreamTitle: string, slug: string) => string;
  ruDesc:    (dreamTitle: string, short: string) => string;
  uzDesc:    (dreamTitle: string, short: string) => string;
  ruH1:      (dreamTitle: string) => string;
  uzH1:      (dreamTitle: string) => string;
  ruLead:    (dreamTitle: string, full: string) => string;
  uzLead:    (dreamTitle: string, full: string) => string;
}

export const VARIANT_META: Record<DreamVariant, VariantMeta> = {
  'dlya-zhenshchin': {
    ruTitle:  (n, s) => RU_DREAM_FORMULAS[slugHash(s) % 4](n) + ' для женщины',
    uzTitle:  (n, s) => UZ_DREAM_FORMULAS[slugHash(s) % 4](n) + ' (ayollar uchun)',
    ruDesc:   (n, sh) => `Что значит сон о ${n.toLowerCase()} для женщины? Толкование по Миллеру, Ванге и исламскому соннику. ${sh.slice(0, 90)}`,
    uzDesc:   (n, sh) => `Ayol uchun tushda ${n.toLowerCase()} ko'rish nima anglatadi? To'liq tafsir. ${sh.slice(0, 90)}`,
    ruH1:     (n) => `Сон о ${n.toLowerCase()} для женщины: что это значит`,
    uzH1:     (n) => `Ayolga tushda ${n.toLowerCase()} ko'rish: batafsil tafsir`,
    ruLead:   (n, full) => `Женщинам нередко снится ${n.toLowerCase()} — и это неслучайно. Сон несёт личный смысл, связанный с эмоциями, отношениями и интуицией. ${full}`,
    uzLead:   (n, full) => `Ayollar tushida ${n.toLowerCase()} tez-tez uchraydi — va bu bejiz emas. Bu tush his-tuyg'ular, munosabatlar va sezgi bilan bog'liq. ${full}`,
  },
  'dlya-muzhchin': {
    ruTitle:  (n, s) => RU_DREAM_FORMULAS[(slugHash(s) + 1) % 4](n) + ' для мужчины',
    uzTitle:  (n, s) => UZ_DREAM_FORMULAS[(slugHash(s) + 1) % 4](n) + ' (erkaklar uchun)',
    ruDesc:   (n, sh) => `Что значит сон о ${n.toLowerCase()} для мужчины? Толкование по Миллеру, Фрейду и исламскому соннику. ${sh.slice(0, 90)}`,
    uzDesc:   (n, sh) => `Erkak uchun tushda ${n.toLowerCase()} ko'rish nima anglatadi? To'liq tafsir. ${sh.slice(0, 90)}`,
    ruH1:     (n) => `Сон о ${n.toLowerCase()} для мужчины: значение и толкование`,
    uzH1:     (n) => `Erkakka tushda ${n.toLowerCase()} ko'rish: tafsir va ma'nosi`,
    ruLead:   (n, full) => `Для мужчины сон о ${n.toLowerCase()} часто связан с профессиональной сферой, силой воли и скрытыми амбициями. ${full}`,
    uzLead:   (n, full) => `Erkaklar uchun tushda ${n.toLowerCase()} ko'rish kasb, iroda va yashirin maqsadlar bilan bog'liq bo'lishi mumkin. ${full}`,
  },
  'islamskiy': {
    ruTitle:  (n, s) => `Исламский сонник: ${n.toLowerCase()} во сне — что говорит ислам`,
    uzTitle:  (n, s) => `Islomiy tush ta'biri: tushda ${n.toLowerCase()} ko'rish`,
    ruDesc:   (n, sh) => `Значение сна о ${n.toLowerCase()} в исламе: толкование Ибн Сирина, что говорит Коран о снах. ${sh.slice(0, 90)}`,
    uzDesc:   (n, sh) => `Tushda ${n.toLowerCase()} ko'rishning islomiy ma'nosi: Ibn Sirin talqini. ${sh.slice(0, 90)}`,
    ruH1:     (n) => `Исламский сонник: ${n.toLowerCase()} во сне`,
    uzH1:     (n) => `Islomiy ta'bir: tushda ${n.toLowerCase()} ko'rish`,
    ruLead:   (n, full) => `В исламской традиции снам придаётся особое значение. Пророк Мухаммад (ﷺ) сказал: «Сон верующего — это одна из сорока шести частей пророчества». Сон о ${n.toLowerCase()} — один из наиболее значимых. ${full} По толкованиям Ибн Сирина, подобный сон несёт весть (башара) или предупреждение (надхир) от Аллаха.`,
    uzLead:   (n, full) => `Islomda tushlarga alohida ahamiyat beriladi. Muhammad payg'ambar (ﷺ) aytganlar: "Mo'min kishining tushi — nubuvvatning qirq olti qismidan biridir". Tushda ${n.toLowerCase()} ko'rish shular jumlasidan. ${full} Ibn Sirin talqiniga ko'ra bunday tush xushxabar (bashara) yoki ogohlantirish (nadhir) bo'lishi mumkin.`,
  },
};

export function getVariantIslamicFaqs(dreamTitle: string, forWoman: string, forMan: string, locale: string) {
  const n = dreamTitle.toLowerCase();
  if (locale === 'uz') return [
    { q: `Tushda ${n} ko'rish islomda nima anglatadi?`, a: `Ibn Sirin talqiniga ko'ra, ${n} tushi ko'pincha hayotdagi muhim o'zgarishlar bilan bog'liq. ${forWoman}` },
    { q: `Bu tush xushxabarmi yoki ogohlantirishmi?`, a: `Tushning mazmuniga qarab: tinch va ijobiy tush xushxabar, xavotirli tush esa ogohlantirish bo'lishi mumkin. ${forMan}` },
    { q: `Islomda tushga e'tibor berishkerakmi?`, a: `Ha, ayniqsa saharda ko'rilgan tushlar. Bunday tushni darhol ta'bir qilmasdan, uch kishi bilan baham ko'ring yoki e'tiborsiz qoldiring.` },
    { q: `Tushni kimga aytish kerak?`, a: `Islomiy ta'limotga ko'ra, yaxshi tushni yaxshi ko'radigan kishiga aytish mumkin. Yomon tushni esa hech kimga aytmasdan, chap tomonga uch marta tupuring va Allohdan panoh so'rang.` },
  ];
  return [
    { q: `Что значит сон о ${n} в исламе?`, a: `По толкованиям Ибн Сирина, сон о ${n} нередко связан с важными переменами в жизни. ${forWoman}` },
    { q: `Это добрый сон или предупреждение?`, a: `В зависимости от контекста: спокойный позитивный сон — добрая весть, тревожный — предупреждение. ${forMan}` },
    { q: `Когда стоит обращать внимание на сны?`, a: `Особенно — на сны перед рассветом (в последнюю треть ночи). Такие сны считаются наиболее вещими в исламской традиции.` },
    { q: `Кому рассказывать хороший сон?`, a: `Хороший сон можно рассказать тому, кто вам близок и искренне рад за вас. Плохой сон лучше не пересказывать, трижды сплюнуть влево и попросить защиты у Аллаха.` },
  ];
}

// OG image URL builder
export function ogImageUrl(params: {
  title: string;
  emoji: string;
  type: 'dream' | 'name' | 'horoscope';
  locale: string;
}): string {
  const p = new URLSearchParams({
    title: params.title,
    emoji: params.emoji,
    type: params.type,
    locale: params.locale,
  });
  return `https://ruyo.uz/api/og?${p.toString()}`;
}
