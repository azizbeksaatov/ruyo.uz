export interface TestUz {
  title: string;
  description: string;
  category: string;
  questions: {
    id: number;
    text: string;
    options: { id: string; text: string }[];
  }[];
  results: {
    id: string;
    title: string;
    description: string;
  }[];
}

export const testTranslationsUz: Record<string, TestUz> = {
  'kakoy-ty-znak': {
    title: "Aslida qaysi zodiak belgisisiz?",
    description: "Balki yulduzlar yanglishganmi? Xarakter bo'yicha o'zingizning haqiqiy belgingizni bilib oling",
    category: "Astrologiya",
    questions: [
      {
        id: 1,
        text: "Muhim qarorlarni qanday qabul qilasiz?",
        options: [
          { id: 'a', text: "Tez va sezgi bilan harakat qilaman" },
          { id: 'b', text: "Barcha variantlarni tahlil qilaman" },
          { id: 'c', text: "Yaqinlarim bilan maslahatlashaman" },
          { id: 'd', text: "Mantiq va faktlar birinchi o'rinda" },
        ],
      },
      {
        id: 2,
        text: "Hayotda siz uchun eng muhim narsa nima?",
        options: [
          { id: 'a', text: "Erkinlik va sarguzashtlar" },
          { id: 'b', text: "Barqarorlik va qulaylik" },
          { id: 'c', text: "Sevgi va oila" },
          { id: 'd', text: "Bilim va rivojlanish" },
        ],
      },
      {
        id: 3,
        text: "Mojaro vaqtida o'zingizni qanday tutasiz?",
        options: [
          { id: 'a', text: "To'g'ridan-to'g'ri va baland ovoz bilan gapiram" },
          { id: 'b', text: "Hamma narsa tinchlanishini kutaman" },
          { id: 'c', text: "Ichimda qattiq xavotir olaman" },
          { id: 'd', text: "Mantiqiy yechim qidiraman" },
        ],
      },
      {
        id: 4,
        text: "Do'stlaringiz sizni qanday deb hisoblaydi?",
        options: [
          { id: 'a', text: "Faol rahbar" },
          { id: 'b', text: "Ishonchli va sodiq" },
          { id: 'c', text: "Sezgir va mehribon" },
          { id: 'd', text: "Aqlli va qiziqarli" },
        ],
      },
    ],
    results: [
      {
        id: 'fire',
        title: "Siz — olovli belgi!",
        description: "Qo'y, Sher yoki Yoy ruhida ekansiz. Sizda energiya toshib turibdi, siz sarguzasht va rahbarlik uchun tug'ilgansiz. Qalbingizdagi olov boshqalarga yo'l ko'rsatadi.",
      },
      {
        id: 'earth',
        title: "Siz — yerli belgi!",
        description: "Sizning mohiyatingiz Buqa, Qiz yoki Tog' echkisiga yaqin. Siz mustahkam poydevor qurasiz, haqiqiy va ishonchli narsalarni qadrleysiz. Sizga tayanish mumkin.",
      },
      {
        id: 'water',
        title: "Siz — suvli belgi!",
        description: "Sizda Saraton, Chayon yoki Baliq ruhi bor. Sizning empatiya va sezgingiz — kuchingiz. Siz odamlarni boshqacharoq his qilasiz.",
      },
      {
        id: 'air',
        title: "Siz — havoli belgi!",
        description: "Sizning stixiyangiz Egizaklar, Tarozi yoki Dalv kabi. O'tkir aqlingiz va muloqotga mahoratingiz sizni zarur inson qiladi.",
      },
    ],
  },

  'kogda-vyjdesh-zamuzh': {
    title: "Qachon turmushga chiqasiz?",
    description: "Yulduzlar va xarakteringiz javobni aytadi",
    category: "Sevgi",
    questions: [
      {
        id: 1,
        text: "Turmush haqida qanchalik ko'p o'ylaysiz?",
        options: [
          { id: 'a', text: "Har kuni — orzu qilaman" },
          { id: 'b', text: "Ba'zida, shoshilmayapman" },
          { id: 'c', text: "Kamdan-kam, hozir boshqa ishlar bor" },
          { id: 'd', text: "Bu haqda o'ylamayman" },
        ],
      },
      {
        id: 2,
        text: "Hozir munosabatdamiz?",
        options: [
          { id: 'a', text: "Ha, jiddiy munosabat" },
          { id: 'b', text: "Birov menga yoqadi" },
          { id: 'c', text: "Yo'q, lekin qarshi emasman" },
          { id: 'd', text: "Ozod va baxtliman" },
        ],
      },
      {
        id: 3,
        text: "Siz uchun ideal hamroh kim?",
        options: [
          { id: 'a', text: "Allaqachon bilaman — mening odamim" },
          { id: 'b', text: "Ishonchli va mehribon" },
          { id: 'c', text: "Qiziqarli va aqlli" },
          { id: 'd', text: "Hali bu haqda o'ylamadim" },
        ],
      },
    ],
    results: [
      {
        id: 'soon',
        title: "Yaqin orada — bu yil ichida!",
        description: "Yulduzlar aytadi: hamma narsa tayyor. Yuragingiz va hayot yo'lingiz sizni kutganingizdan tezroq olib boradi. Tayyorlaning!",
      },
      {
        id: 'medium',
        title: "1-2 yil ichida",
        description: "Turmush yo'lingiz aniq, lekin biroz ko'proq vaqt kerak bo'ladi. Undan foydalanib, o'zingizning eng yaxshi versiyangizga aylaning.",
      },
      {
        id: 'later',
        title: "Tayyor bo'lganingizda — o'shanda uchrashasiz",
        description: "Siz hali o'sib rivojlanyapsiz. Taqdir sizga maxsus insonni tayyorlab qo'ygan, lekin avvalo o'zingizni topishingiz kerak.",
      },
      {
        id: 'open',
        title: "Koinot buni sir saqlamoqda!",
        description: "Sizning yo'lingiz g'ayrioddiy va ajoyib. Asosiysi — sevgiga ochiq bo'ling, u sizni kutilmagan lahzada topadi.",
      },
    ],
  },

  'tvoe-secretnoe-ya': {
    title: "Aslida qanday odamsiz?",
    description: "O'zingiz bilmagan yashirin xarakter xususiyatlaringizni aniqlash testi",
    category: "Psixologiya",
    questions: [
      {
        id: 1,
        text: "Sizni tortadigan tabiat manzarasini tanlang:",
        options: [
          { id: 'a', text: "🌋 Tong otishida vulqon" },
          { id: 'b', text: "🌊 Kechasi tinch okean" },
          { id: 'c', text: "🌲 Tumanda qadimiy o'rmon" },
          { id: 'd', text: "🌸 Gullagan bog'" },
        ],
      },
      {
        id: 2,
        text: "Ko'ngliz og'ir bo'lganda nima qilasiz?",
        options: [
          { id: 'a', text: "Sport zaliga yoki sayrga boraman" },
          { id: 'b', text: "Musiqa tinglayman va orzu qilaman" },
          { id: 'c', text: "Kitob o'qiyman yoki jim o'ylyman" },
          { id: 'd', text: "Chizaman, pishiraman yoki nimadir yarataman" },
        ],
      },
      {
        id: 3,
        text: "Muloqotdagi kuchingiz:",
        options: [
          { id: 'a', text: "Ishontirish va ilhomlantirish" },
          { id: 'b', text: "Tinglash va tushunish" },
          { id: 'c', text: "Dono maslahat berish" },
          { id: 'd', text: "Muhit yaratish" },
        ],
      },
    ],
    results: [
      {
        id: 'warrior',
        title: "Yashirin Jangchi",
        description: "Tashqi ko'rinishda xotirjam bo'lishingiz mumkin, lekin ichingizda so'nmas olov yonmoqda. Siz g'alaba qozonish uchun tug'ilgansiz va o'z kuchingizni hali to'liq anglamagansiz.",
      },
      {
        id: 'dreamer',
        title: "Yashirin Orzukor",
        description: "Oddiy ko'rinishingiz ortida boy ichki dunyo yashiringan. Orzularingiz — yaratajak kelajakingizning chizmalaridir.",
      },
      {
        id: 'sage',
        title: "Yashirin Donishmand",
        description: "Odamlar siz qanchalik chuqur ekanligingizni bilishmaydi. Donoligingiz — sizning xazinangiz. Siz gapirganingizda — boshqalar tinglaydi.",
      },
      {
        id: 'creator',
        title: "Yashirin Ijodkor",
        description: "Ichingizda rassom, shoir yoki musiqachi yashaydi. Siz dunyoni boshqacharoq ko'rasiz va bu sizning asosiy iste'dodingizdir.",
      },
    ],
  },
};
