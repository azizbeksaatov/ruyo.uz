/**
 * Adds Uzbek names starting with G' (Ғ), H (Ҳ), O' (Ў) to the names table.
 * These letters are unique to Uzbek and absent from Russian-language scrapers.
 * Names stored in Cyrillic; cyrToLatin() handles uz display automatically.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/seed-uzbek-g-h-o.mts
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

function luckyNumbers(name: string): number[] {
  const codes = name.split('').map(c => c.charCodeAt(0));
  const nums = new Set<number>();
  let i = 0;
  while (nums.size < 3) { nums.add((codes[i % codes.length] % 9) + 1); i++; }
  return [...nums];
}

const ELEMENT: Record<string, string> = {
  arabic: 'Огонь', persian: 'Воздух', uzbek: 'Земля', turkic: 'Земля',
};

interface NameRow {
  slug: string;
  cyrName: string;
  gender: 'male' | 'female';
  origin: 'uzbek' | 'arabic' | 'persian' | 'turkic';
  meaning: string;
  character: string;
  meaning_uz: string;
  character_uz: string;
}

const NAMES: NameRow[] = [
  // ── G' / Ғ — boys ──────────────────────────────────────────────────────────
  {
    slug: 'gaffor', cyrName: 'Ғаффор', gender: 'male', origin: 'arabic',
    meaning: 'Всепрощающий — одно из прекрасных имён Бога в исламе. Имя символизирует безграничное милосердие и прощение.',
    character: 'Носители этого имени отличаются терпением и редкой способностью прощать обиды. Они великодушны, справедливы и умеют сохранять спокойствие в конфликтах.',
    meaning_uz: 'Kechiruvchi — Allohning güzel isimlaridan biri. Ism cheksiz rahmat va kechirish ma\'nosini anglatadi.',
    character_uz: 'Bu ismli odamlar sabr-toqatli va kechirimsiz bo\'ladi. Ular oliyjanob, adolatli va nizolarda tinchlikni saqlay oladi.',
  },
  {
    slug: 'gafur', cyrName: 'Ғафур', gender: 'male', origin: 'arabic',
    meaning: 'Прощающий, снисходительный. Имя арабского происхождения, указывающее на того, кто прощает с лёгкостью.',
    character: 'Обладатели этого имени великодушны и незлопамятны. Они мудры не по годам, умеют видеть хорошее в людях и ценят мир в отношениях.',
    meaning_uz: 'Mag\'firatli, kechiruvchi. Arabcha ism bo\'lib, osongina kechira oladigan kishini anglatadi.',
    character_uz: 'Bu ismli odamlar oliyjanob va kindik xotirali emas. Ular yoshligidanoq donolik ko\'rsatadi va atrofidagilarda yaxshilikni ko\'ra biladi.',
  },
  {
    slug: 'galil', cyrName: 'Ғалил', gender: 'male', origin: 'arabic',
    meaning: 'Величественный, могущественный, достойный уважения. Арабское имя с глубоким духовным смыслом.',
    character: 'Носители имени обладают природным авторитетом и достоинством. Они вызывают уважение без усилий, держатся с достоинством и умеют вести за собой.',
    meaning_uz: 'Ulug\', qudratli, hurmatga loyiq. Chuqur ma\'naviy ma\'no kasb etuvchi arabcha ism.',
    character_uz: 'Bu ismli odamlar tabiiy obro\'ga ega. Ular zo\'rlamasdan hurmat qozonadi, o\'zini munosib tutadi va odamlarni ergashtirishga qodir.',
  },
  {
    slug: 'gani', cyrName: 'Ғани', gender: 'male', origin: 'arabic',
    meaning: 'Богатый, состоятельный, самодостаточный. Имя также означает того, кто ни в чём не нуждается.',
    character: 'Самостоятельные и независимые натуры. Обладатели этого имени умеют создавать благополучие своими руками и не любят просить о помощи.',
    meaning_uz: 'Boy, davlatli, o\'ziga to\'q. Ism shuningdek hech narsaga muhtoj bo\'lmagan kishini anglatadi.',
    character_uz: 'Mustaqil va o\'ziga ishongan shaxslar. Bu ismli odamlar o\'z qo\'llari bilan farovonlik yaratishni biladi va yordam so\'rashni yoqtirmaydi.',
  },
  {
    slug: 'ganisher', cyrName: 'Ғанишер', gender: 'male', origin: 'turkic',
    meaning: 'Богатый лев — тюркское составное имя, сочетающее «богатый» и «лев». Символ щедрости и мужества.',
    character: 'Смелые, щедрые и харизматичные люди. Они умеют защищать близких и открыто идти к своим целям.',
    meaning_uz: 'Boy sher — turkcha qo\'shma ism. Saxovat va jasorat ramzi.',
    character_uz: 'Jasur, saxiy va xarizmatik odamlar. Ular yaqinlarini himoya qila oladi va maqsadlariga ochiqchasiga intiladi.',
  },
  {
    slug: 'garib', cyrName: 'Ғариб', gender: 'male', origin: 'arabic',
    meaning: 'Странник, чужестранец, путешественник. Человек, далеко ушедший от родного дома в поисках смысла.',
    character: 'Любознательные, ищущие натуры с широким взглядом на мир. Носители этого имени открыты новому и не боятся перемен.',
    meaning_uz: 'Musofir, gʻarib, sayohatchi. Maʼno izlab uydan uzoq ketgan kishi.',
    character_uz: 'Qiziquvchan va qidiruvchi tabiatli odamlar. Bu ismlilar yangiga ochiq va o\'zgarishdan qo\'rqmaydi.',
  },
  {
    slug: 'gayrat', cyrName: 'Ғайрат', gender: 'male', origin: 'arabic',
    meaning: 'Усердие, рвение, энергия, старание. Имя призывает к трудолюбию и целеустремлённости.',
    character: 'Трудолюбивые, энергичные и целеустремлённые люди. Они не сдаются при первых трудностях и всегда доводят начатое до конца.',
    meaning_uz: 'G\'ayrat, tirishqoqlik, harakat. Ism mehnatsevarlik va maqsadga intilishga undaydi.',
    character_uz: 'Mehnatsevar, faol va maqsadga yo\'naltirilgan odamlar. Ular birinchi qiyinchiliklarda taslim bo\'lmaydi va boshlaganini oxiriga yetkazadi.',
  },
  {
    slug: 'gilmon', cyrName: 'Ғилмон', gender: 'male', origin: 'arabic',
    meaning: 'Юноша в раю — в исламской традиции так называют прекрасных юношей, служащих в загробном мире.',
    character: 'Добрые, чистые душой и отзывчивые люди. Носители этого имени отличаются искренностью и стремлением помогать окружающим.',
    meaning_uz: 'Jannat yigiti — islomiy an\'anada oxiratda xizmat qiluvchi go\'zal yigitlar.',
    character_uz: 'Yaxshi, pokdil va mehribon odamlar. Bu ismlilar samimiylik va atrofidagilarga yordam berish istagi bilan ajralib turadi.',
  },
  {
    slug: 'giyos', cyrName: 'Ғиёс', gender: 'male', origin: 'arabic',
    meaning: 'Помощь, поддержка, спасение. Имя означает того, кто приходит на выручку в трудную минуту.',
    character: 'Надёжные, отзывчивые и верные люди. К носителям этого имени обращаются за советом и поддержкой, и они редко отказывают.',
    meaning_uz: 'Yordam, madad, najot. Ism qiyin daqiqada yordamga keladigan kishini anglatadi.',
    character_uz: 'Ishonchli, mehribon va sodiq odamlar. Bu ismlilar maslahat va yordam uchun murojaat qiladi va ular kamdan-kam rad etadi.',
  },
  {
    slug: 'giyosiddin', cyrName: 'Ғиёсиддин', gender: 'male', origin: 'arabic',
    meaning: 'Опора веры, помощь религии. Составное арабское имя с духовным значением.',
    character: 'Преданные, принципиальные и духовно зрелые люди. Они строго придерживаются своих убеждений и служат образцом честности.',
    meaning_uz: 'Din madadi, dinning tayanchi. Ma\'naviy ma\'noli murakkab arabcha ism.',
    character_uz: 'Sadoqatli, prinsipli va ma\'nan yetuk odamlar. Ular o\'z e\'tiqodlariga qat\'iy amal qiladi va halollikning namunasi bo\'lib xizmat qiladi.',
  },
  {
    slug: 'golib', cyrName: 'Ғолиб', gender: 'male', origin: 'arabic',
    meaning: 'Победитель, одержавший верх. Имя символизирует стойкость и непобедимость духа.',
    character: 'Целеустремлённые, стойкие и настойчивые натуры. Носители этого имени не боятся соперничества и умеют добиваться своего.',
    meaning_uz: 'G\'olib, yengilmas. Ism ruhning bardoshligi va yengilmasligini anglatadi.',
    character_uz: 'Maqsadga yo\'naltirilgan, bardoshli va qat\'iyatli tabiatli odamlar. Bu ismlilar raqobatdan qo\'rqmaydi va o\'z maqsadiga erisha oladi.',
  },
  {
    slug: 'goyib', cyrName: 'Ғойиб', gender: 'male', origin: 'arabic',
    meaning: 'Невидимый, скрытый, отсутствующий. Имя связано с понятием тайного и непознанного.',
    character: 'Загадочные, глубокие и вдумчивые натуры. Носители этого имени обычно немногословны, но их слова всегда имеют вес.',
    meaning_uz: 'Ko\'rinmas, yashirin, g\'oyib. Ism sir va noma\'lumlik tushunchalari bilan bog\'liq.',
    character_uz: 'Sirli, chuqur va mulohazali tabiatli odamlar. Bu ismlilar odatda kam gapiradi, lekin ularning so\'zlari har doim og\'irlik qiladi.',
  },
  {
    slug: 'gazzol', cyrName: 'Ғаззол', gender: 'male', origin: 'arabic',
    meaning: 'Газель — символ красоты, изящества и стремительности. Поэтическое арабское имя.',
    character: 'Изящные, подвижные и артистичные натуры. Носители этого имени обладают тонким вкусом и эстетическим чувством.',
    meaning_uz: 'Kiyik — go\'zallik, nafislik va tezlik ramzi. Poetik arabcha ism.',
    character_uz: 'Nozik, harakatli va badiiy tabiatli odamlar. Bu ismlilar nozik did va estetik his-tuyg\'uga ega.',
  },
  {
    slug: 'gavvos', cyrName: 'Ғаввос', gender: 'male', origin: 'arabic',
    meaning: 'Ныряльщик, искатель жемчуга. Образный смысл — тот, кто ищет сокровища в глубинах.',
    character: 'Настойчивые, терпеливые и любознательные люди, способные докапываться до сути. Они не боятся трудностей и умеют находить скрытое.',
    meaning_uz: 'Darg\'a, marvariddov. Ko\'chma ma\'nosi — chuqurliklardan xazina izlaydigan kishi.',
    character_uz: 'Qat\'iyatli, sabr-toqatli va qiziquvchan odamlar, asosga yeta oladiganlar. Ular qiyinchiliklardan qo\'rqmaydi va yashirinni topa biladi.',
  },

  // ── G' / Ғ — girls ─────────────────────────────────────────────────────────
  {
    slug: 'gafura', cyrName: 'Ғафура', gender: 'female', origin: 'arabic',
    meaning: 'Прощающая, милосердная. Женская форма имени Ғафур. Символизирует щедрость душевную.',
    character: 'Добросердечные и незлобивые женщины. Они умеют прощать и не держать зла, что делает их опорой для близких.',
    meaning_uz: 'Kechiruvchi, rahmdil. G\'afur ismining ayollik shakli. Ruhiy saxovatni anglatadi.',
    character_uz: 'Yaxshi qalbli va yomon niyatli bo\'lmagan ayollar. Ular kechira oladi va kin-adovat saqlamaydi, bu ularni yaqinlar uchun tayanch qiladi.',
  },
  {
    slug: 'galaba', cyrName: 'Ғалаба', gender: 'female', origin: 'uzbek',
    meaning: 'Победа, триумф. Узбекское имя, выражающее надежду на успех и торжество.',
    character: 'Целеустремлённые и стойкие женщины, умеющие добиваться своего. Они вдохновляют окружающих своей уверенностью.',
    meaning_uz: 'G\'alaba, zafar. Muvaffaqiyat va tantana umidini ifodalovchi o\'zbekcha ism.',
    character_uz: 'Maqsadga yo\'naltirilgan va bardoshli ayollar. Ular o\'z maqsadlariga erishishni biladi va o\'ziga ishonchi bilan atrofidagilarni ilhomlantirad.',
  },
  {
    slug: 'galila', cyrName: 'Ғалила', gender: 'female', origin: 'arabic',
    meaning: 'Величественная, возвышенная, достойная. Женская форма имени Ғалил.',
    character: 'Элегантные и достойные женщины с природным авторитетом. Их уважают за мудрость и умение держать себя с достоинством.',
    meaning_uz: 'Ulug\', yuksak, munosib. G\'alil ismining ayollik shakli.',
    character_uz: 'Elegant va munosib, tabiiy obro\'ga ega ayollar. Ularni donolik va o\'zini munosib tutishi uchun hurmat qiladi.',
  },
  {
    slug: 'ganimat', cyrName: 'Ғанимат', gender: 'female', origin: 'arabic',
    meaning: 'Дар, благо, ценная находка. Имя выражает радость от рождения ребёнка как особого дара.',
    character: 'Ценящие жизнь и умеющие радоваться малому. Носительницы этого имени щедро делятся своей радостью с окружающими.',
    meaning_uz: 'Ne\'mat, sovg\'a, qimmatli topilma. Ism bolaning tug\'ilishini alohida ne\'mat sifatida qabul qilishni ifodalaydi.',
    character_uz: 'Hayotni qadrlaydigan va kichik narsalarga xursand bo\'la oladigan ayollar. Bu ismlilar o\'z quvonchlarini atrofidagilar bilan baham ko\'rishadi.',
  },
  {
    slug: 'gariba', cyrName: 'Ғариба', gender: 'female', origin: 'arabic',
    meaning: 'Странница, чужестранка. Женская форма имени Ғариб. Образный смысл — редкостная, неповторимая.',
    character: 'Оригинальные и неповторимые женщины, идущие своим путём. Они не боятся быть непохожими на других.',
    meaning_uz: 'Musofir qiz, begona. G\'arib ismining ayollik shakli. Ko\'chma ma\'nosi — kamyob, takrorlangisiz.',
    character_uz: 'O\'ziga xos va takrorlangisiz ayollar, o\'z yo\'llarida ketadiganlar. Ular boshqalarga o\'xshash emasligidan qo\'rqmaydi.',
  },
  {
    slug: 'gazal', cyrName: 'Ғазал', gender: 'female', origin: 'persian',
    meaning: 'Газель; лирическое стихотворение — персидское имя, связанное с поэзией и красотой.',
    character: 'Тонко чувствующие, художественно одарённые натуры. Носительницы этого имени нередко обладают поэтическим даром или музыкальным слухом.',
    meaning_uz: 'Kiyikcha; lirik she\'r — she\'riyat va go\'zallik bilan bog\'liq forscha ism.',
    character_uz: 'Nozik his-tuyg\'u va badiiy iste\'dodga ega tabiatlar. Bu ismlilarda she\'riy iste\'dod yoki musiqiy quloq ko\'p uchraydi.',
  },
  {
    slug: 'gazola', cyrName: 'Ғазола', gender: 'female', origin: 'persian',
    meaning: 'Маленькая газель — ласкательная форма имени Ғазал. Символ нежности и изящества.',
    character: 'Нежные, грациозные и артистичные женщины. Они привлекают внимание своей мягкостью и природной красотой.',
    meaning_uz: 'Kichkina kiyikcha — G\'azal ismining erkalash shakli. Nafislik va noziklik ramzi.',
    character_uz: 'Nozik, xushmuomala va badiiy tabiatli ayollar. Ular yumshoqligi va tabiiy go\'zalligi bilan e\'tibor tortadi.',
  },
  {
    slug: 'gizola', cyrName: 'Ғизола', gender: 'female', origin: 'persian',
    meaning: 'Газелёнок, нежная газель. Поэтическое персидское имя, символизирующее молодость и красоту.',
    character: 'Лёгкие, жизнерадостные и добрые женщины. Их присутствие украшает любую компанию.',
    meaning_uz: 'Kiyikcha, nozik. Yoshlik va go\'zallikni ramzlovchi poetik forscha ism.',
    character_uz: 'Yengil, xushchaqchaq va mehribon ayollar. Ularning mavjudligi har qanday jamiyatni bezatadi.',
  },
  {
    slug: 'goliba', cyrName: 'Ғолиба', gender: 'female', origin: 'arabic',
    meaning: 'Победительница. Женская форма имени Ғолиб. Символ стойкости и успеха.',
    character: 'Сильные духом и целеустремлённые женщины. Они умеют преодолевать препятствия и достигать поставленных целей.',
    meaning_uz: 'G\'oliba qiz. G\'olib ismining ayollik shakli. Bardoshlilik va muvaffaqiyat ramzi.',
    character_uz: 'Ruhan kuchli va maqsadga yo\'naltirilgan ayollar. Ular to\'siqlarni yengib o\'ta oladi va belgilangan maqsadlariga erisha oladi.',
  },
  {
    slug: 'guncha', cyrName: 'Ғунча', gender: 'female', origin: 'uzbek',
    meaning: 'Бутон цветка — узбекское имя, символизирующее нераскрытую красоту и молодость.',
    character: 'Нежные, скромные и чистые душой девушки, в которых чувствуется большой потенциал. Как бутон, они раскрываются постепенно.',
    meaning_uz: 'Gul kurtagi — ochilmagan go\'zallik va yoshlikni anglatuvchi o\'zbekcha ism.',
    character_uz: 'Nozik, kamtar va pokdil qizlar, ularda katta salohiyat seziladi. Kurtak kabi ular asta-sekin ochiladi.',
  },
  {
    slug: 'gunchagul', cyrName: 'Ғунчагул', gender: 'female', origin: 'uzbek',
    meaning: 'Цветок-бутон, раскрывающийся цветок. Составное узбекское имя, означающее красоту в расцвете.',
    character: 'Яркие, обаятельные и радостные женщины. Они несут в себе тепло и свет, как распустившийся цветок.',
    meaning_uz: 'Kurtak gul, ochilayotgan gul. O\'z gullagida go\'zallikni anglatuvchi qo\'shma o\'zbekcha ism.',
    character_uz: 'Yorqin, jozibador va quvnoq ayollar. Ular gullab-yashnagan gul kabi issiqlik va nur taratadi.',
  },
  {
    slug: 'gayratoy', cyrName: 'Ғайратой', gender: 'female', origin: 'uzbek',
    meaning: 'Энергичная, старательная девушка. Узбекское имя, выражающее трудолюбие и живость.',
    character: 'Энергичные, деятельные и инициативные женщины. Они всегда в движении и умеют вдохновить других своим примером.',
    meaning_uz: 'G\'ayratli, tirishqoq qiz. Mehnatsevarlik va jonlilikni ifodalovchi o\'zbekcha ism.',
    character_uz: 'Faol, jiddiy va tashabbuskor ayollar. Ular doimo harakatda bo\'ladi va o\'z namunalari bilan boshqalarni ilhomlantira oladi.',
  },

  // ── H / Ҳ — boys ───────────────────────────────────────────────────────────
  {
    slug: 'habib', cyrName: 'Ҳабиб', gender: 'male', origin: 'arabic',
    meaning: 'Любимый, возлюбленный, дорогой сердцу. Одно из самых тёплых арабских имён.',
    character: 'Тёплые, открытые и общительные люди. Носители этого имени легко заводят друзей и умеют создавать вокруг себя атмосферу любви и принятия.',
    meaning_uz: 'Sevimli, aziz, qalban qadrli. Arabcha eng iliq ismlardan biri.',
    character_uz: 'Iliq, ochiq va muloqotchan odamlar. Bu ismlilar osonlik bilan do\'st orttiradi va atrofida muhabbat va qabul muhitini yaratishni biladi.',
  },
  {
    slug: 'habibulla', cyrName: 'Ҳабибулла', gender: 'male', origin: 'arabic',
    meaning: 'Возлюбленный Богом, любимец Аллаха. Духовное имя высокого значения.',
    character: 'Духовные, искренние и преданные люди. Они стремятся жить по совести и служат образцом честности для окружающих.',
    meaning_uz: 'Alloh sevgani, Allohning mahbubi. Yuksak ma\'naviy ma\'noga ega ism.',
    character_uz: 'Ma\'naviy, samimiy va sadoqatli odamlar. Ular vijdon bo\'yicha yashashga intiladi va atrofidagilar uchun halollikning namunasi bo\'lib xizmat qiladi.',
  },
  {
    slug: 'hafiz', cyrName: 'Ҳафиз', gender: 'male', origin: 'arabic',
    meaning: 'Хранитель, знаток. В исламской традиции — тот, кто знает Коран наизусть. Символ памяти и учёности.',
    character: 'Усидчивые, образованные и ответственные люди. Носители этого имени обладают отличной памятью и любовью к знаниям.',
    meaning_uz: 'Saqlovchi, bilimdon. Islomiy an\'anada — Qur\'onni yoddan biluvchi. Xotira va ilmning ramzi.',
    character_uz: 'Chidamli, bilimli va mas\'uliyatli odamlar. Bu ismlilar ajoyib xotiraga va bilimga muhabbatga ega.',
  },
  {
    slug: 'hakim', cyrName: 'Ҳаким', gender: 'male', origin: 'arabic',
    meaning: 'Мудрый, мудрец; правитель, судья. Имя подчёркивает рассудительность и авторитет.',
    character: 'Рассудительные, вдумчивые и справедливые лидеры. К ним часто обращаются за советом, и они редко ошибаются в оценке ситуации.',
    meaning_uz: 'Dono, donishmand; hukmdor, qozi. Ism mulohazakorlikni va obro\'ni ta\'kidlaydi.',
    character_uz: 'Mulohazali, o\'ylanchi va adolatli rahbarlar. Ularga ko\'p maslahat uchun murojaat qilishadi va ular vaziyatni baholashda kamdan-kam yanglishadi.',
  },
  {
    slug: 'hakimiddin', cyrName: 'Ҳакимиддин', gender: 'male', origin: 'arabic',
    meaning: 'Мудрость веры, мудрец религии. Составное арабское имя с глубоким духовным значением.',
    character: 'Принципиальные, образованные и духовно устремлённые люди. Они соединяют религиозную мудрость с практическим умом.',
    meaning_uz: 'Din donosi, dindor donishmand. Chuqur ma\'naviy ma\'noga ega murakkab arabcha ism.',
    character_uz: 'Prinsipli, bilimli va ma\'naviy intiluvchi odamlar. Ular diniy donolikni amaliy aql bilan birlashtiradi.',
  },
  {
    slug: 'halim', cyrName: 'Ҳалим', gender: 'male', origin: 'arabic',
    meaning: 'Кроткий, терпеливый, мягкосердечный. Имя описывает человека, который умеет сдерживать гнев.',
    character: 'Терпеливые, уравновешенные и мягкие по характеру люди. Они редко злятся и умеют находить мирный выход из конфликтов.',
    meaning_uz: 'Yumshoqko\'ngil, sabr-toqatli, muloyim. Ism g\'azabini jilovlay oladigan kishini tasvirlaydi.',
    character_uz: 'Sabr-toqatli, muvozanatli va muloyim tabiatli odamlar. Ular kamdan-kam g\'azablanadi va nizolardan tinch yo\'l topa biladi.',
  },
  {
    slug: 'hamdam', cyrName: 'Ҳамдам', gender: 'male', origin: 'persian',
    meaning: 'Спутник, друг, компаньон — персидское имя. Тот, кто идёт рядом и разделяет судьбу.',
    character: 'Верные, преданные и надёжные друзья. Носители этого имени никогда не бросают близких в трудную минуту.',
    meaning_uz: 'Hamroh, do\'st, sherik — forscha ism. Yonida ketadigan va taqdir ulashadigan kishi.',
    character_uz: 'Sadoqatli, vafodor va ishonchli do\'stlar. Bu ismlilar qiyin daqiqada hech qachon yaqinlarini tashlab ketmaydi.',
  },
  {
    slug: 'hamid', cyrName: 'Ҳамид', gender: 'male', origin: 'arabic',
    meaning: 'Восхваляемый, достойный похвалы. Имя указывает на человека, чьи поступки заслуживают восхищения.',
    character: 'Достойные, ответственные и уважаемые люди. Они делают дело так, что им не нужно хвалить себя — результаты говорят сами за себя.',
    meaning_uz: 'Maqtovga sazovor, ta\'rifga loyiq. Ism harakatlari hayratga sazovor kishini bildiradi.',
    character_uz: 'Munosib, mas\'uliyatli va hurmatli odamlar. Ular ishni shunday qiladiki, o\'zlarini maqtashlariga hojat yo\'q — natijalar o\'zi gapiradi.',
  },
  {
    slug: 'hamidulla', cyrName: 'Ҳамидулла', gender: 'male', origin: 'arabic',
    meaning: 'Хвала Богу, восхваляющий Аллаха. Духовное имя, выражающее благодарность.',
    character: 'Благодарные, скромные и духовно зрелые люди. Они умеют ценить то, что имеют, и не теряют веры в трудные времена.',
    meaning_uz: 'Allohga hamd, Allohni ulug\'lovchi. Shukrona ifodalovchi ma\'naviy ism.',
    character_uz: 'Minnatdor, kamtar va ma\'nan yetuk odamlar. Ular nima bor ekaniga baho bera oladi va qiyin paytlarda imonini yo\'qotmaydi.',
  },
  {
    slug: 'hamro', cyrName: 'Ҳамро', gender: 'male', origin: 'persian',
    meaning: 'Спутник, попутчик, тот, кто сопровождает — персидское имя. Символ верной дружбы.',
    character: 'Верные спутники по жизни. Носители этого имени надёжны в дружбе и любви, всегда готовы разделить и радость, и горе.',
    meaning_uz: 'Hamroh, yo\'ldosh, kuzatuvchi — forscha ism. Sadiq do\'stlikning ramzi.',
    character_uz: 'Hayotda sodiq hamrohlar. Bu ismlilar do\'stlik va muhabbatda ishonchli, har doim quvonch va qayg\'uda ham ulashishga tayyor.',
  },
  {
    slug: 'hamza', cyrName: 'Ҳамза', gender: 'male', origin: 'arabic',
    meaning: 'Лев, сильный, твёрдый. Имя дяди Пророка Мухаммада, известного своим мужеством.',
    character: 'Мужественные, прямолинейные и сильные духом люди. Они встают на защиту слабых и не отступают перед трудностями.',
    meaning_uz: 'Sher, kuchli, mustahkam. Jasorati bilan mashhur Payg\'ambar amakisi ismi.',
    character_uz: 'Jasur, to\'g\'riso\'z va ruhan kuchli odamlar. Ular zaiflarni himoya qiladi va qiyinchiliklar oldida chekinmaydi.',
  },
  {
    slug: 'hasan', cyrName: 'Ҳасан', gender: 'male', origin: 'arabic',
    meaning: 'Красивый, добрый, хороший. Одно из самых распространённых арабских имён с позитивным значением.',
    character: 'Добрые, общительные и располагающие к себе люди. Носители этого имени умеют видеть лучшее в людях и приносить радость.',
    meaning_uz: 'Chiroyli, yaxshi, ezgu. Ijobiy ma\'noga ega eng keng tarqalgan arabcha ismlardan biri.',
    character_uz: 'Yaxshi, muloqotchan va o\'ziga jalb etuvchi odamlar. Bu ismlilar odamlarda yaxshilikni ko\'ra biladi va quvonch keltira oladi.',
  },
  {
    slug: 'husayn', cyrName: 'Ҳусайн', gender: 'male', origin: 'arabic',
    meaning: 'Маленький красавец, прекрасный. Уменьшительная форма имени Ҳасан. Носит имя внука Пророка.',
    character: 'Обаятельные, благородные и глубоко чувствующие люди. Они сочетают красоту внешнюю с красотой душевной.',
    meaning_uz: 'Kichkina go\'zal, chiroyli. Hasan ismining kichraytirish shakli. Payg\'ambar nevarasining ismi.',
    character_uz: 'Jozibador, olijanob va chuqur his-tuyg\'uvchi odamlar. Ular tashqi go\'zallikni ichki go\'zallik bilan uyg\'unlashtiradi.',
  },
  {
    slug: 'hayot', cyrName: 'Ҳаёт', gender: 'male', origin: 'arabic',
    meaning: 'Жизнь, жизненная сила. Имя олицетворяет энергию существования и радость бытия.',
    character: 'Жизнелюбивые, энергичные и оптимистичные люди. Они умеют наполнять смыслом и радостью жизнь тех, кто рядом.',
    meaning_uz: 'Hayot, hayotiy kuch. Ism mavjudlik energiyasi va yashash quvonchini ifodalaydi.',
    character_uz: 'Hayotsevar, faol va optimistik odamlar. Ular yonidagi odamlarning hayotini mazmun va quvonch bilan to\'ldirishni biladi.',
  },

  // ── H / Ҳ — girls ──────────────────────────────────────────────────────────
  {
    slug: 'habiba', cyrName: 'Ҳабиба', gender: 'female', origin: 'arabic',
    meaning: 'Любимая, дорогая сердцу. Женская форма имени Ҳабиб. Символ любви и нежности.',
    character: 'Нежные, тёплые и любящие женщины. Они создают вокруг себя атмосферу уюта и принятия, к ним тянутся люди.',
    meaning_uz: 'Sevimli, qalban aziz. Habib ismining ayollik shakli. Muhabbat va noziklikning ramzi.',
    character_uz: 'Nozik, iliq va sevuvchi ayollar. Ular atrofida qulaylik va qabul muhitini yaratadi, odamlar ularga intiladi.',
  },
  {
    slug: 'hadicha', cyrName: 'Ҳадича', gender: 'female', origin: 'arabic',
    meaning: 'Имя первой жены Пророка Мухаммада. Значение — рождённая прежде срока. Символ веры и стойкости.',
    character: 'Стойкие, мудрые и верные женщины. Они служат опорой для семьи и умеют поддержать в самые тяжёлые моменты.',
    meaning_uz: 'Payg\'ambar Muhammadning birinchi xotinining ismi. Ma\'nosi — muddatidan oldin tug\'ilgan. Iymon va bardoshlikning ramzi.',
    character_uz: 'Bardoshli, dono va sadoqatli ayollar. Ular oila uchun tayanch bo\'lib xizmat qiladi va eng og\'ir daqiqalarda qo\'llab-quvvatlashni biladi.',
  },
  {
    slug: 'hafiza', cyrName: 'Ҳафиза', gender: 'female', origin: 'arabic',
    meaning: 'Хранительница, хранящая. Женская форма имени Ҳафиз. Символ памяти и сохранения.',
    character: 'Ответственные, внимательные и надёжные женщины. Они хранят семейные традиции и умеют беречь то, что дорого.',
    meaning_uz: 'Saqlovchi. Hofiz ismining ayollik shakli. Xotira va saqlashning ramzi.',
    character_uz: 'Mas\'uliyatli, e\'tiborli va ishonchli ayollar. Ular oilaviy an\'analarni saqlaydi va qadrlilikni asrashni biladi.',
  },
  {
    slug: 'hajar', cyrName: 'Ҳажар', gender: 'female', origin: 'arabic',
    meaning: 'Камень, скала. Имя матери пророка Исмаила. Символ стойкости и несокрушимости.',
    character: 'Сильные, стойкие и непоколебимые женщины. Они не сдаются перед трудностями и могут стать надёжной опорой для всей семьи.',
    meaning_uz: 'Tosh, qoya. Ismoil payg\'ambarning onasining ismi. Bardoshlilik va sindirimaslikning ramzi.',
    character_uz: 'Kuchli, bardoshli va qat\'iyatli ayollar. Ular qiyinchiliklar oldida taslim bo\'lmaydi va butun oila uchun ishonchli tayanch bo\'la oladi.',
  },
  {
    slug: 'hakima', cyrName: 'Ҳакима', gender: 'female', origin: 'arabic',
    meaning: 'Мудрая, учёная, судья. Женская форма имени Ҳаким. Символ знания и справедливости.',
    character: 'Умные, рассудительные и справедливые женщины. К ним обращаются за советом, и они дают мудрые, взвешенные ответы.',
    meaning_uz: 'Dono, bilimdon, qozi. Hakim ismining ayollik shakli. Ilm va adolatning ramzi.',
    character_uz: 'Aqlli, mulohazali va adolatli ayollar. Ularga maslahat uchun murojaat qiladi va ular dono, o\'ylangan javoblar beradi.',
  },
  {
    slug: 'halima', cyrName: 'Ҳалима', gender: 'female', origin: 'arabic',
    meaning: 'Кроткая, терпеливая, мягкосердечная. Имя кормилицы Пророка Мухаммада. Символ доброты.',
    character: 'Добросердечные, терпеливые и заботливые женщины. Они умеют успокоить и поддержать, их тепло чувствуют все вокруг.',
    meaning_uz: 'Muloyim, sabr-toqatli, yumshoqko\'ngil. Payg\'ambar Muhammadning emizikchisi ismi. Yaxshilikning ramzi.',
    character_uz: 'Yaxshi qalbli, sabr-toqatli va g\'amxo\'r ayollar. Ular tinchlantirish va qo\'llab-quvvatlashni biladi, ularning issiqligi hamma tomonidan seziladi.',
  },
  {
    slug: 'hamida', cyrName: 'Ҳамида', gender: 'female', origin: 'arabic',
    meaning: 'Достойная похвалы, восхваляемая. Женская форма имени Ҳамид. Символ добродетели.',
    character: 'Трудолюбивые, добросовестные и уважаемые женщины. Они получают признание не словами, а своими делами.',
    meaning_uz: 'Maqtovga sazovor. Hamid ismining ayollik shakli. Fazilatlilikning ramzi.',
    character_uz: 'Mehnatsevar, vijdonli va hurmatli ayollar. Ular tan olishni so\'zlar emas, balki ishlarilari orqali qozonadi.',
  },
  {
    slug: 'hanifa', cyrName: 'Ҳанифа', gender: 'female', origin: 'arabic',
    meaning: 'Благочестивая, праведная, чистой веры. Имя означает ту, что следует истинному пути.',
    character: 'Честные, принципиальные и духовно устремлённые женщины. Их жизнь наполнена смыслом и служением высшим ценностям.',
    meaning_uz: 'Dindor, soliha, iymon pok. Ism haqiqiy yo\'lga amal qiladiganni anglatadi.',
    character_uz: 'Halol, prinsipli va ma\'naviy intiluvchi ayollar. Ularning hayoti ma\'no va yuksak qadriyatlarga xizmat qilish bilan to\'lgan.',
  },
  {
    slug: 'havo', cyrName: 'Ҳаво', gender: 'female', origin: 'arabic',
    meaning: 'Ева — мать всего человечества в авраамических религиях. Имя символизирует начало жизни.',
    character: 'Дающие жизнь и заботу, материнские натуры. Носительницы этого имени обладают природной мудростью и способностью объединять людей.',
    meaning_uz: 'Havvo — Ibrohimiy dinlarda butun insoniyatning onasi. Ism hayotning boshlanishini anglatadi.',
    character_uz: 'Hayot va g\'amxo\'rlik beradigan, onalik tabiatli ayollar. Bu ismlilar tabiiy donolikka ega va odamlarni birlashtirish qobiliyatiga ega.',
  },
  {
    slug: 'hasina', cyrName: 'Ҳасина', gender: 'female', origin: 'arabic',
    meaning: 'Красавица, прекрасная, изящная. Женская форма от Ҳасан. Имя подчёркивает внутреннюю и внешнюю красоту.',
    character: 'Красивые душой и внешне обаятельные женщины. Они привлекают добротой и искренним интересом к людям.',
    meaning_uz: 'Go\'zal, nafis. Hasan ismidan ayollik shakli. Ism ichki va tashqi go\'zallikni ta\'kidlaydi.',
    character_uz: 'Ruhan go\'zal va tashqidan jozibador ayollar. Ular yaxshiligi va odamlarga samimiy qiziqishi bilan jalb qiladi.',
  },
  {
    slug: 'harir', cyrName: 'Ҳарир', gender: 'female', origin: 'arabic',
    meaning: 'Шёлк, шелковистый — образное имя, означающее мягкость, нежность и красоту.',
    character: 'Мягкие, изящные и утончённые женщины. Их движения, речь и характер отличаются особой деликатностью.',
    meaning_uz: 'Ipak, ipakday — yumshoqlik, noziklik va go\'zallikni anglatuvchi majoziy ism.',
    character_uz: 'Yumshoq, nafis va muloyim ayollar. Ularning harakatlari, nutqi va xarakteri alohida noziklik bilan ajralib turadi.',
  },
  {
    slug: 'harisa', cyrName: 'Ҳариса', gender: 'female', origin: 'arabic',
    meaning: 'Усердная, прилежная, осторожная. Имя означает ту, кто тщательно подходит к любому делу.',
    character: 'Внимательные, трудолюбивые и педантичные женщины. Они доводят любое дело до совершенства и умеют планировать.',
    meaning_uz: 'Tirishqoq, sinchkov, ehtiyotli. Ism har qanday ishga puxta yondashadiganni anglatadi.',
    character_uz: 'Diqqatli, mehnatsevar va puxta ayollar. Ular har qanday ishni mukammallikka yetkazadi va rejalashtira biladi.',
  },
  {
    slug: 'hayot-f', cyrName: 'Ҳаёт', gender: 'female', origin: 'arabic',
    meaning: 'Жизнь. Имя, данное в знак пожелания долгой, счастливой и яркой жизни.',
    character: 'Жизнерадостные, позитивные и полные энергии женщины. Они умеют наслаждаться жизнью и передавать эту радость окружающим.',
    meaning_uz: 'Hayot. Uzoq, baxtli va yorqin hayot tilagini bildiruvchi ism.',
    character_uz: 'Xushchaqchaq, ijobiy va energiyaga to\'la ayollar. Ular hayotdan rohatlana biladi va bu quvonchni atrofidagilarga yuqtiradi.',
  },
  {
    slug: 'haqiqat', cyrName: 'Ҳақиқат', gender: 'female', origin: 'arabic',
    meaning: 'Истина, правда, подлинность. Имя символизирует стремление к честности и подлинности.',
    character: 'Честные, прямые и принципиальные женщины. Они говорят правду даже тогда, когда это неудобно, и ценят искренность превыше всего.',
    meaning_uz: 'Haqiqat, to\'g\'rilik, chin. Ism halollik va chinlikka intilishni anglatadi.',
    character_uz: 'Halol, to\'g\'riso\'z va prinsipli ayollar. Ular noqulay bo\'lsa ham haqiqatni aytadi va samimiylikni har narsadan ustun qo\'yadi.',
  },

  // ── O' / Ў — boys ──────────────────────────────────────────────────────────
  {
    slug: 'oktam', cyrName: 'Ўктам', gender: 'male', origin: 'uzbek',
    meaning: 'Смелый, дерзкий, бесстрашный — тюркско-узбекское имя. Символ мужества и решительности.',
    character: 'Смелые, решительные и инициативные люди. Носители этого имени не боятся браться за трудные задачи и идти впереди.',
    meaning_uz: 'Jasur, dadil, qo\'rqmas — turk-o\'zbek ismi. Jasorat va qat\'iyatning ramzi.',
    character_uz: 'Jasur, qat\'iyatli va tashabbuskor odamlar. Bu ismlilar qiyin vazifalarni o\'z zimmasiga olishdan qo\'rqmaydi va oldinda ketishadi.',
  },
  {
    slug: 'oktamali', cyrName: 'Ўктамали', gender: 'male', origin: 'uzbek',
    meaning: 'Смелый Али — составное узбекское имя, соединяющее качество смелости с именем Али.',
    character: 'Мужественные и благородные люди, сочетающие в себе смелость и мудрость. Они умеют действовать решительно и с умом.',
    meaning_uz: 'Jasur Ali — jasurlik sifatini Ali ismi bilan birlashtiruvchi qo\'shma o\'zbek ismi.',
    character_uz: 'Mardona va olijanob, o\'zida jasorat va donolikni birlashtiradigan odamlar. Ular qat\'iyatli va aqlli harakat qila oladi.',
  },
  {
    slug: 'olmas', cyrName: 'Ўлмас', gender: 'male', origin: 'turkic',
    meaning: 'Бессмертный, неувядаемый, вечный — тюркское имя. Символ вечной памяти и нетленной славы.',
    character: 'Стойкие, непоколебимые и выносливые люди. Носители этого имени оставляют след в жизни и памяти окружающих.',
    meaning_uz: 'O\'lmas, so\'lmas, abadiy — turkcha ism. Abadiy xotira va yo\'qolmas shuhratning ramzi.',
    character_uz: 'Bardoshli, silkinmas va chidamli odamlar. Bu ismlilar atrofidagilarning hayoti va xotirasida iz qoldiradi.',
  },
  {
    slug: 'omar-uz', cyrName: 'Ўмар', gender: 'male', origin: 'arabic',
    meaning: 'Долгая жизнь, процветание, расцвет. Имя второго халифа ислама, символ справедливости.',
    character: 'Справедливые, прямолинейные и деятельные люди. Они ценят порядок и справедливость и не боятся брать ответственность.',
    meaning_uz: 'Uzoq umr, farovonlik, gullash. Islomning ikkinchi xalifasi ismi, adolat ramzi.',
    character_uz: 'Adolatli, to\'g\'riso\'z va faol odamlar. Ular tartib va adolatni qadriydi va mas\'uliyat olishdan qo\'rqmaydi.',
  },
  {
    slug: 'orinboy', cyrName: 'Ўринбой', gender: 'male', origin: 'uzbek',
    meaning: 'Достойный бай, занимающий своё место — узбекское составное имя. Символ статуса и достоинства.',
    character: 'Серьёзные, амбициозные и ответственные люди. Они стремятся занять достойное место в жизни и оправдать ожидания.',
    meaning_uz: 'Munosib boi, o\'z o\'rnida — qo\'shma o\'zbek ismi. Maqom va munosiblikning ramzi.',
    character_uz: 'Jiddiy, ambitsiyali va mas\'uliyatli odamlar. Ular hayotda munosib o\'rin egallashga intiladi va kutilganlarni oqlashga harakat qiladi.',
  },
  {
    slug: 'oglon', cyrName: 'Ўғлон', gender: 'male', origin: 'uzbek',
    meaning: 'Юноша, молодой человек, сын — узбекское имя, означающее молодость и свежесть.',
    character: 'Энергичные, любопытные и открытые люди. Носители этого имени сохраняют молодость духа на протяжении всей жизни.',
    meaning_uz: 'Yigit, yosh bola, o\'g\'il — yoshlik va yangilikning o\'zbekcha ismi.',
    character_uz: 'Faol, qiziquvchan va ochiq odamlar. Bu ismlilar butun umr davomida ruhiy yoshlikni saqlab qoladi.',
  },
  {
    slug: 'otkir', cyrName: 'Ўткир', gender: 'male', origin: 'uzbek',
    meaning: 'Острый, проницательный, быстрый — узбекское имя. Символ острого ума и быстрой реакции.',
    character: 'Интеллектуальные, наблюдательные и находчивые люди. Они быстро схватывают суть вещей и умеют точно выражать мысли.',
    meaning_uz: 'O\'tkir, ziyrak, tez — o\'zbekcha ism. O\'tkir aql va tez reaksiyaning ramzi.',
    character_uz: 'Aqlli, kuzatuvchan va topqir odamlar. Ular narsalarning mohiyatini tez idrok etadi va fikrlarini aniq ifodalay oladi.',
  },
  {
    slug: 'olpon', cyrName: 'Ўлпон', gender: 'male', origin: 'uzbek',
    meaning: 'Утренняя звезда, планета Венера на рассвете — узбекское поэтическое имя. Символ света и надежды.',
    character: 'Светлые, оптимистичные и творческие натуры. Носители этого имени несут в себе вдохновение и умеют замечать красоту в обычном.',
    meaning_uz: 'Tong yulduzi, tong paytidagi Venera sayyorasi — poetik o\'zbekcha ism. Nur va umidning ramzi.',
    character_uz: 'Yorqin, optimistik va ijodiy tabiatlar. Bu ismlilar ilhom keltiradi va oddiy narsalarda go\'zallikni ko\'ra biladi.',
  },

  // ── O' / Ў — girls ─────────────────────────────────────────────────────────
  {
    slug: 'ogiloy', cyrName: 'Ўғилой', gender: 'female', origin: 'uzbek',
    meaning: 'Девочка-сын, долгожданная дочь — узбекское имя, выражающее особую ценность ребёнка.',
    character: 'Сильные, самостоятельные и уверенные в себе женщины. Они сочетают женственность с решительностью и умеют добиваться своего.',
    meaning_uz: 'O\'g\'ilday qiz, kutilgan qiz — bolaning alohida qimmatini ifodalovchi o\'zbek ismi.',
    character_uz: 'Kuchli, mustaqil va o\'ziga ishongan ayollar. Ular ayollilikni qat\'iyatlilik bilan uyg\'unlashtiradi va o\'z maqsadlariga erisha oladi.',
  },
  {
    slug: 'olmasoy', cyrName: 'Ўлмасой', gender: 'female', origin: 'uzbek',
    meaning: 'Бессмертная луна, вечная как луна — составное узбекское имя. Символ вечной красоты.',
    character: 'Красивые внутренне и внешне, оставляющие глубокий след в памяти людей. Их влияние не угасает с годами.',
    meaning_uz: 'O\'lmas oy, oy kabi abadiy — qo\'shma o\'zbek ismi. Abadiy go\'zallikning ramzi.',
    character_uz: 'Ichki va tashqi go\'zallikka ega, odamlar xotirasida chuqur iz qoldiradigan ayollar. Ularning ta\'siri yillar o\'tishi bilan so\'nmaydi.',
  },
  {
    slug: 'olponoy', cyrName: 'Ўлпоной', gender: 'female', origin: 'uzbek',
    meaning: 'Лунная утренняя звезда — составное узбекское поэтическое имя. Символ ночного неба.',
    character: 'Мечтательные, творческие и нежные натуры. Они умеют видеть красоту в ночи и создавать вдохновение вокруг себя.',
    meaning_uz: 'Oy-yulduz, tong yulduz-oy — poetik qo\'shma o\'zbek ismi. Tungi osmonning ramzi.',
    character_uz: 'Xayolparast, ijodiy va nozik tabiatlar. Ular tunda go\'zallikni ko\'ra biladi va atrofida ilhom yaratadi.',
  },
  {
    slug: 'oktambu', cyrName: 'Ўктамбу', gender: 'female', origin: 'uzbek',
    meaning: 'Смелая девушка — узбекское составное имя. Символ смелости и жизненной силы.',
    character: 'Отважные, инициативные и независимые женщины. Они не боятся первыми делать шаг и открывать новые пути.',
    meaning_uz: 'Jasur qiz — o\'zbek qo\'shma ismi. Jasorat va hayotiy kuchning ramzi.',
    character_uz: 'Jasur, tashabbuskor va mustaqil ayollar. Ular birinchi qadam tashlashdan qo\'rqmaydi va yangi yo\'llarni ochadigan.',
  },
  {
    slug: 'oljaxon', cyrName: 'Ўлжахон', gender: 'female', origin: 'uzbek',
    meaning: 'Ханша-победительница, добыча ханши — узбекское имя. Символ богатства и значимости.',
    character: 'Царственные, значимые и уверенные в себе женщины. Они умеют руководить и создавать порядок вокруг себя.',
    meaning_uz: 'G\'oliba xonbonu, xon o\'ljai — o\'zbek ismi. Boylik va ahamiyatning ramzi.',
    character_uz: 'Shohona, muhim va o\'ziga ishongan ayollar. Ular boshqarishni biladi va atrofida tartib yaratadi.',
  },
  {
    slug: 'ogilgul', cyrName: 'Ўғилгул', gender: 'female', origin: 'uzbek',
    meaning: 'Цветок-сын, любимая дочь — составное узбекское имя. Символ нежной родительской любви.',
    character: 'Нежные, заботливые и красивые душой женщины. Они умеют дарить любовь и принимать её с благодарностью.',
    meaning_uz: 'O\'g\'il guli, aziz qiz — qo\'shma o\'zbek ismi. Ota-onalik nozik sevgisining ramzi.',
    character_uz: 'Nozik, g\'amxo\'r va ruhan go\'zal ayollar. Ular muhabbat ulasha oladi va uni minnatdorlik bilan qabul qila oladi.',
  },
  {
    slug: 'ogilniso', cyrName: 'Ўғилнисо', gender: 'female', origin: 'uzbek',
    meaning: 'Девушка-сын, желанная дочь — узбекское имя, говорящее об особой ценности дочери.',
    character: 'Сильные, самодостаточные и мудрые женщины. Они соединяют мужскую решительность с женской мудростью.',
    meaning_uz: 'O\'g\'ilday qiz, istalgan qiz — qizning alohida qimmatini aytuvchi o\'zbek ismi.',
    character_uz: 'Kuchli, o\'ziga to\'q va dono ayollar. Ular erkakcha qat\'iyatni ayollik donoligi bilan birlashtiradi.',
  },
];

async function main() {
  const rows = NAMES.map(n => ({
    slug: n.slug,
    name: n.cyrName,
    gender: n.gender,
    origin: n.origin,
    meaning: n.meaning,
    character: n.character,
    meaning_uz: n.meaning_uz,
    character_uz: n.character_uz,
    lucky_numbers: luckyNumbers(n.cyrName),
    element: ELEMENT[n.origin] ?? 'Огонь',
    compatible_names: [],
    popularity: 50,
    source: 'uzbek-seed',
    status: 'approved',
  }));

  console.log(`Bulk upserting ${rows.length} Uzbek names...`);
  const { error } = await sb.from('names').upsert(rows, { onConflict: 'slug', ignoreDuplicates: false });
  if (error) {
    console.error('Upsert failed:', error.message);
    process.exit(1);
  }
  console.log(`Done. Upserted ${rows.length} names.`);
  rows.forEach(r => console.log(`  ✓ ${r.name} → ${r.slug}`));
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
