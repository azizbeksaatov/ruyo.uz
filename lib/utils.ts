import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[а-я]/g, (char) => {
      const map: Record<string, string> = {
        а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'yo',ж:'zh',з:'z',
        и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',
        с:'s',т:'t',у:'u',ф:'f',х:'kh',ц:'ts',ч:'ch',ш:'sh',
        щ:'shch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya'
      };
      return map[char] || char;
    })
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .trim();
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const ZODIAC_SIGNS = [
  { slug: 'oven', ru: 'Овен', uz: 'Qo\'y', emoji: '♈', dates: '21 марта — 19 апреля' },
  { slug: 'telets', ru: 'Телец', uz: 'Buqa', emoji: '♉', dates: '20 апреля — 20 мая' },
  { slug: 'bliznetsy', ru: 'Близнецы', uz: 'Egizaklar', emoji: '♊', dates: '21 мая — 20 июня' },
  { slug: 'rak', ru: 'Рак', uz: 'Qisqichbaqa', emoji: '♋', dates: '21 июня — 22 июля' },
  { slug: 'lev', ru: 'Лев', uz: 'Arslon', emoji: '♌', dates: '23 июля — 22 августа' },
  { slug: 'deva', ru: 'Дева', uz: 'Bokira', emoji: '♍', dates: '23 августа — 22 сентября' },
  { slug: 'vesy', ru: 'Весы', uz: 'Tarozi', emoji: '♎', dates: '23 сентября — 22 октября' },
  { slug: 'skorpion', ru: 'Скорпион', uz: 'Chayon', emoji: '♏', dates: '23 октября — 21 ноября' },
  { slug: 'strelets', ru: 'Стрелец', uz: 'Yoy', emoji: '♐', dates: '22 ноября — 21 декабря' },
  { slug: 'kozerog', ru: 'Козерог', uz: 'Tog\'arka', emoji: '♑', dates: '22 декабря — 19 января' },
  { slug: 'vodoley', ru: 'Водолей', uz: 'Suv quyuvchi', emoji: '♒', dates: '20 января — 18 февраля' },
  { slug: 'ryby', ru: 'Рыбы', uz: 'Baliqlar', emoji: '♓', dates: '19 февраля — 20 марта' },
];

export const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export const ALPHABET_RU = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЭЮЯ'.split('');
