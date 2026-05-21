const CYR_LAT: Record<string, string> = {
  'А': 'A',  'а': 'a',
  'Б': 'B',  'б': 'b',
  'В': 'V',  'в': 'v',
  'Г': 'G',  'г': 'g',
  'Ғ': "G'", 'ғ': "g'",
  'Д': 'D',  'д': 'd',
  'Е': 'Ye', 'е': 'e',
  'Ё': 'Yo', 'ё': 'yo',
  'Ж': 'J',  'ж': 'j',
  'З': 'Z',  'з': 'z',
  'И': 'I',  'и': 'i',
  'Й': 'Y',  'й': 'y',
  'К': 'K',  'к': 'k',
  'Қ': 'Q',  'қ': 'q',
  'Л': 'L',  'л': 'l',
  'М': 'M',  'м': 'm',
  'Н': 'N',  'н': 'n',
  'О': 'O',  'о': 'o',
  'Ў': "O'", 'ў': "o'",
  'П': 'P',  'п': 'p',
  'Р': 'R',  'р': 'r',
  'С': 'S',  'с': 's',
  'Т': 'T',  'т': 't',
  'У': 'U',  'у': 'u',
  'Ф': 'F',  'ф': 'f',
  'Х': 'X',  'х': 'x',
  'Ц': 'Ts', 'ц': 'ts',
  'Ч': 'Ch', 'ч': 'ch',
  'Ш': 'Sh', 'ш': 'sh',
  'Щ': 'Sh', 'щ': 'sh',
  'Ъ': "'",  'ъ': "'",
  'Ы': 'I',  'ы': 'i',
  'Ь': '',   'ь': '',
  'Э': 'E',  'э': 'e',
  'Ю': 'Yu', 'ю': 'yu',
  'Я': 'Ya', 'я': 'ya',
  'Ҳ': 'H',  'ҳ': 'h',
  'Ҷ': 'J',  'ҷ': 'j',
};

export function cyrToLatin(text: string): string {
  return text.split('').map(ch => CYR_LAT[ch] ?? ch).join('');
}

// Latin letter → Cyrillic prefix for DB ilike filter
export const LATIN_TO_CYR: Record<string, string> = {
  'A': 'А', 'B': 'Б', 'D': 'Д', 'E': 'Э',
  'F': 'Ф', 'G': 'Г', "G'": 'Ғ', 'H': 'Ҳ',
  'I': 'И', 'J': 'Ж', 'K': 'К', 'L': 'Л',
  'M': 'М', 'N': 'Н', 'O': 'О', "O'": 'Ў',
  'P': 'П', 'Q': 'Қ', 'R': 'Р', 'S': 'С',
  'Sh': 'Ш', 'T': 'Т', 'U': 'У', 'V': 'В',
  'X': 'Х', 'Y': 'Й', 'Z': 'З', 'Ch': 'Ч',
};

// Latin → Cyrillic (for converting user search input back to DB format)
// Handles digraphs (sh→ш, ch→ч, etc.) with lookahead before single chars.
export function latinToCyr(text: string): string {
  const s = text.toLowerCase();
  let result = '';
  let i = 0;
  while (i < s.length) {
    const two = s.slice(i, i + 2);
    if      (two === 'sh') { result += 'ш'; i += 2; }
    else if (two === 'ch') { result += 'ч'; i += 2; }
    else if (two === "g'") { result += 'ғ'; i += 2; }
    else if (two === "o'") { result += 'ў'; i += 2; }
    else if (two === 'ts') { result += 'ц'; i += 2; }
    else if (two === 'yu') { result += 'ю'; i += 2; }
    else if (two === 'ya') { result += 'я'; i += 2; }
    else if (two === 'yo') { result += 'ё'; i += 2; }
    else if (two === 'ye') { result += 'е'; i += 2; }
    else {
      const ONE: Record<string, string> = {
        'a':'а','b':'б','v':'в','g':'г','d':'д','e':'е','f':'ф',
        'h':'ҳ','i':'и','j':'ж','k':'к','l':'л','m':'м','n':'н',
        'o':'о','p':'п','q':'қ','r':'р','s':'с','t':'т','u':'у',
        'x':'х','y':'й','z':'з',
      };
      result += ONE[s[i]] ?? s[i];
      i++;
    }
  }
  return result;
}

function hasCyrillic(text: string): boolean {
  return /[Ѐ-ӿ]/.test(text);
}

// Convert search query to Cyrillic if it's in Latin script (for uz locale)
export function toDbSearchQuery(q: string, locale: string): string {
  if (locale !== 'uz' || hasCyrillic(q)) return q;
  return latinToCyr(q);
}

export const LATIN_LETTERS_UZ = [
  'A','B','D','E','F','G',"G'",'H','I','J',
  'K','L','M','N','O',"O'",'P','Q','R','S',
  'Sh','T','U','V','X','Y','Z','Ch',
];
