export interface TestQuestion {
  id: number;
  text: string;
  options: { id: string; text: string; value: string }[];
}

export interface TestResult {
  id: string;
  title: string;
  description: string;
  emoji: string;
}

export interface ViralTest {
  slug: string;
  title: string;
  description: string;
  emoji: string;
  questions: TestQuestion[];
  results: TestResult[];
  category: string;
}

export const viralTests: ViralTest[] = [
  {
    slug: 'kakoy-ty-znak',
    title: 'Какой ты знак зодиака на самом деле?',
    description: 'Может, звёзды ошиблись? Узнай свой "истинный" знак по характеру',
    emoji: '✨',
    category: 'Астрология',
    questions: [
      {
        id: 1,
        text: 'Как ты принимаешь важные решения?',
        options: [
          { id: 'a', text: 'Действую быстро и интуитивно', value: 'fire' },
          { id: 'b', text: 'Анализирую все варианты', value: 'earth' },
          { id: 'c', text: 'Советуюсь с близкими', value: 'water' },
          { id: 'd', text: 'Логика и факты прежде всего', value: 'air' },
        ],
      },
      {
        id: 2,
        text: 'Что для тебя важнее всего в жизни?',
        options: [
          { id: 'a', text: 'Свобода и приключения', value: 'fire' },
          { id: 'b', text: 'Стабильность и комфорт', value: 'earth' },
          { id: 'c', text: 'Любовь и семья', value: 'water' },
          { id: 'd', text: 'Знания и развитие', value: 'air' },
        ],
      },
      {
        id: 3,
        text: 'Как ты ведёшь себя в конфликте?',
        options: [
          { id: 'a', text: 'Говорю прямо и громко', value: 'fire' },
          { id: 'b', text: 'Жду, пока всё успокоится', value: 'earth' },
          { id: 'c', text: 'Сильно переживаю внутри', value: 'water' },
          { id: 'd', text: 'Ищу логичное решение', value: 'air' },
        ],
      },
      {
        id: 4,
        text: 'Каким тебя считают друзья?',
        options: [
          { id: 'a', text: 'Энергичным лидером', value: 'fire' },
          { id: 'b', text: 'Надёжным и верным', value: 'earth' },
          { id: 'c', text: 'Чутким и добрым', value: 'water' },
          { id: 'd', text: 'Умным и интересным', value: 'air' },
        ],
      },
    ],
    results: [
      {
        id: 'fire',
        title: 'Ты — огненный знак!',
        description: 'По духу ты Овен, Лев или Стрелец. Тебя переполняет энергия, ты рождён(а) для приключений и лидерства. Огонь в твоей душе освещает путь другим.',
        emoji: '🔥',
      },
      {
        id: 'earth',
        title: 'Ты — земной знак!',
        description: 'Твоя суть близка к Тельцу, Деве или Козерогу. Ты строишь прочный фундамент, ценишь реальное и надёжное. На тебя можно положиться.',
        emoji: '🌍',
      },
      {
        id: 'water',
        title: 'Ты — водный знак!',
        description: 'В тебе живёт дух Рака, Скорпиона или Рыб. Твоя эмпатия и интуиция — твои суперсилы. Ты чувствуешь людей так, как никто другой.',
        emoji: '🌊',
      },
      {
        id: 'air',
        title: 'Ты — воздушный знак!',
        description: 'Твоя стихия — как у Близнецов, Весов или Водолея. Твой острый ум и коммуникабельность делают тебя незаменимым человеком.',
        emoji: '💨',
      },
    ],
  },
  {
    slug: 'kogda-vyjdesh-zamuzh',
    title: 'Когда ты выйдешь замуж?',
    description: 'Звёзды и твой характер подсказывают ответ',
    emoji: '💍',
    category: 'Любовь',
    questions: [
      {
        id: 1,
        text: 'Как часто ты думаешь о замужестве?',
        options: [
          { id: 'a', text: 'Каждый день — мечтаю', value: 'soon' },
          { id: 'b', text: 'Иногда, не тороплюсь', value: 'medium' },
          { id: 'c', text: 'Редко, сейчас не до этого', value: 'later' },
          { id: 'd', text: 'Не думаю об этом', value: 'open' },
        ],
      },
      {
        id: 2,
        text: 'Ты сейчас в отношениях?',
        options: [
          { id: 'a', text: 'Да, серьёзные отношения', value: 'soon' },
          { id: 'b', text: 'Есть симпатия', value: 'medium' },
          { id: 'c', text: 'Нет, но не против', value: 'later' },
          { id: 'd', text: 'Свободна и счастлива', value: 'open' },
        ],
      },
      {
        id: 3,
        text: 'Что для тебя идеальный партнёр?',
        options: [
          { id: 'a', text: 'Уже знаю кто — мой человек', value: 'soon' },
          { id: 'b', text: 'Надёжный и добрый', value: 'medium' },
          { id: 'c', text: 'Интересный и умный', value: 'later' },
          { id: 'd', text: 'Ещё не думала об этом', value: 'open' },
        ],
      },
    ],
    results: [
      {
        id: 'soon',
        title: 'Совсем скоро — в этом году!',
        description: 'Звёзды говорят: всё уже готово. Твоё сердце и жизненный путь ведут тебя к алтарю быстрее, чем ты думаешь. Готовься!',
        emoji: '💍',
      },
      {
        id: 'medium',
        title: 'В течение 1-2 лет',
        description: 'Твой путь к замужеству ясен, но потребует чуть больше времени. Используй его, чтобы стать лучшей версией себя.',
        emoji: '🌸',
      },
      {
        id: 'later',
        title: 'Когда будешь готова — тогда и встретишь',
        description: 'Ты ещё растёшь и развиваешься. Судьба готовит тебе особенного человека, но сначала ты должна найти себя.',
        emoji: '⭐',
      },
      {
        id: 'open',
        title: 'Вселенная держит это в секрете!',
        description: 'Твой путь нестандартный и удивительный. Самое главное — оставайся открытой к любви, и она найдёт тебя в самый неожиданный момент.',
        emoji: '🔮',
      },
    ],
  },
  {
    slug: 'tvoe-secretnoe-ya',
    title: 'Какое ты на самом деле?',
    description: 'Тест на скрытые черты характера, о которых ты сам не знал',
    emoji: '🎭',
    category: 'Психология',
    questions: [
      {
        id: 1,
        text: 'Выбери картину природы, которая тебя притягивает:',
        options: [
          { id: 'a', text: '🌋 Вулкан на рассвете', value: 'warrior' },
          { id: 'b', text: '🌊 Тихий океан ночью', value: 'dreamer' },
          { id: 'c', text: '🌲 Древний лес в тумане', value: 'sage' },
          { id: 'd', text: '🌸 Сад в цвету', value: 'creator' },
        ],
      },
      {
        id: 2,
        text: 'Что ты делаешь, когда тебе плохо?',
        options: [
          { id: 'a', text: 'Иду в спортзал или гулять', value: 'warrior' },
          { id: 'b', text: 'Слушаю музыку и мечтаю', value: 'dreamer' },
          { id: 'c', text: 'Читаю или думаю в тишине', value: 'sage' },
          { id: 'd', text: 'Рисую, готовлю или создаю что-то', value: 'creator' },
        ],
      },
      {
        id: 3,
        text: 'Твоя суперсила в общении:',
        options: [
          { id: 'a', text: 'Убеждать и вдохновлять', value: 'warrior' },
          { id: 'b', text: 'Слушать и понимать', value: 'dreamer' },
          { id: 'c', text: 'Давать мудрые советы', value: 'sage' },
          { id: 'd', text: 'Создавать атмосферу', value: 'creator' },
        ],
      },
    ],
    results: [
      {
        id: 'warrior',
        title: 'Скрытый Воин',
        description: 'Внешне ты можешь казаться спокойным, но внутри горит неугасимый огонь. Ты рождён(а) побеждать, и даже не осознаёшь своей силы.',
        emoji: '⚔️',
      },
      {
        id: 'dreamer',
        title: 'Скрытый Мечтатель',
        description: 'За твоей обычной внешностью скрывается богатейший внутренний мир. Твои мечты — это чертежи будущего, которое ты создашь.',
        emoji: '🌙',
      },
      {
        id: 'sage',
        title: 'Скрытый Мудрец',
        description: 'Люди не подозревают, насколько ты глубок(а). Твоя мудрость — твоё сокровище. Когда ты говоришь — другие слушают.',
        emoji: '📚',
      },
      {
        id: 'creator',
        title: 'Скрытый Творец',
        description: 'Внутри тебя живёт художник, поэт или музыкант. Ты видишь мир иначе, чем остальные, и в этом твой главный дар.',
        emoji: '🎨',
      },
    ],
  },
];

export function getTestBySlug(slug: string): ViralTest | undefined {
  return viralTests.find((t) => t.slug === slug);
}
