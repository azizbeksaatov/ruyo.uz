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

  'tvoy-temperament': {
    title: "Xarakter tipingiz qanday?",
    description: "Xolerik, sangvinik, flegmatik yoki melanxolik — o'z tipingizni bilib oling",
    category: "Psixologiya",
    questions: [
      {
        id: 1,
        text: "Rejalaringizdagi kutilmagan o'zgarishlarga qanday munosabat bildirasiz?",
        options: [
          { id: 'a', text: "G'azablanaman va asabiylashaman" },
          { id: 'b', text: "Tezda moslashaman va musbat tomonlarini topaman" },
          { id: 'c', text: "Xotirjam qabul qilaman, bo'lganini" },
          { id: 'd', text: "Xafamanaman va uzoq vaqt o'ylashda qolaman" },
        ],
      },
      {
        id: 2,
        text: "Vazifani qanday bajarasiz?",
        options: [
          { id: 'a', text: "Tez, qat'iyat bilan, ba'zan shoshilinch" },
          { id: 'b', text: "Ishtiyoq bilan, lekin tez o'zgartiraman" },
          { id: 'c', text: "Tartibli, shoshilmasdan, oxirigacha" },
          { id: 'd', text: "Ehtiyotkorlik bilan, natija uchun tashvishlanib" },
        ],
      },
      {
        id: 3,
        text: "Qanday dam olasiz?",
        options: [
          { id: 'a', text: "Faol — sport, harakatda" },
          { id: 'b', text: "Yoqimli odamlar bilan, kompaniyada" },
          { id: 'c', text: "Uyda yoki tabiatda tinchgina" },
          { id: 'd', text: "Yolg'iz yoki yaqin bir insonning yonida" },
        ],
      },
      {
        id: 4,
        text: "Do'stlaringiz siz haqingizda nima deydi?",
        options: [
          { id: 'a', text: "Qo'zg'aluvchan, lekin tez tinchlanadiigan" },
          { id: 'b', text: "Quvnoq va oshno" },
          { id: 'c', text: "Xotirjam va ishonchli" },
          { id: 'd', text: "Sezgir va chuqur" },
        ],
      },
    ],
    results: [
      {
        id: 'choleric',
        title: "Siz — Xolerik",
        description: "Portlovchi energiya, tez reaktsiyalar, kuchli iroda. Siz g'alaba qozonish va boshqalarni ergashtirish uchun tug'ilgansiz. Kuchingizni boshqarishni o'rganing — tog'larni ko'chirasiz.",
      },
      {
        id: 'sanguine',
        title: "Siz — Sangvinik",
        description: "Hayotsevarlik, muloqotga ochiqlik va optimizm — sizning ustunliklaringiz. Siz odamlar bilan osonlik bilan tanishasiz va hammasini energiyangiz bilan zaryadlaysiz. Hayot siz uchun bayram.",
      },
      {
        id: 'phlegmatic',
        title: "Siz — Flegmatik",
        description: "Xotirjamlik, barqarorlik va ishonchlilik — sizning kuchingiz. Siz har doim tayanilishi mumkin bo'lgan odamsiz. Sabringiz tog'larni siljitirishga qodir.",
      },
      {
        id: 'melancholic',
        title: "Siz — Melanxolik",
        description: "His-tuyg'ularning chuqurligi, nozik idrok, boy ichki dunyo. Siz boshqalar ko'rmayotgan narsalarni ko'rasiz. Sizning sezgirligingiz — kamdan-kam va qimmatli in'om.",
      },
    ],
  },

  'yazyk-lyubvi': {
    title: "Sizning sevgi tilingiz qanday?",
    description: "Siz sevgini qanday ifodalaysiz va qabul qilasiz — o'z tilingizni bilib oling",
    category: "Sevgi",
    questions: [
      {
        id: 1,
        text: "Hamrohingizdan eng muhimi nima?",
        options: [
          { id: 'a', text: "'Seni sevaman' so'zlarini va maqtovlarni eshitish" },
          { id: 'b', text: "U so'ralmay yordam qilganda" },
          { id: 'c', text: "Ko'ngildan chiqarish va sovg'alar" },
          { id: 'd', text: "Telefonlarsiz birga vaqt o'tkazish" },
        ],
      },
      {
        id: 2,
        text: "Siz o'zingiz sevgini qanday ko'rsatasiz?",
        options: [
          { id: 'a', text: "His-tuyg'ularim haqida gapiram, xabar yozaman" },
          { id: 'b', text: "Sevgilim uchun biror foydali narsa qilaman" },
          { id: 'c', text: "Sovg'alar beraman va yoqimli narsalar qilaman" },
          { id: 'd', text: "Hamma vaqtni birga o'tkazaman" },
        ],
      },
      {
        id: 3,
        text: "Munosabatlarda sizni eng ko'p xafa qiladigan narsa nima?",
        options: [
          { id: 'a', text: "Yaxshi so'zlar eshitmasam" },
          { id: 'b', text: "Mening ishlarimga e'tibor berilmasa" },
          { id: 'c', text: "Bayramlarda 'unutib qo'yilsam'" },
          { id: 'd', text: "Hamroh doim band bo'lsa" },
        ],
      },
    ],
    results: [
      {
        id: 'words',
        title: "Tan olish so'zlari",
        description: "Siz uchun 'seni sevaman', maqtov va so'zlar bilan qo'llab-quvvatlash muhim. Hamrohingizga bu haqda ayting — va munosabatlaringiz gullaydi.",
      },
      {
        id: 'acts',
        title: "Yordam va g'amxo'rlik",
        description: "Siz uchun sevgi — harakatlar. Yaqin inson yordam berganda, o'z tashvishlarini olsa, siz o'zingizni chinakam sevilganday his qilasiz.",
      },
      {
        id: 'gifts',
        title: "Sovg'alar va kutilmagan holatlar",
        description: "Siz e'tiborning belgilarini qadrleysiz. Sovg'a — pul haqida emas, siz haqingizda o'ylanganligi haqida. Siz uchun ramziylık va tafsilotlarga e'tibor muhim.",
      },
      {
        id: 'time',
        title: "Sifatli vaqt",
        description: "Siz uchun eng yaxshi sovg'a — vaqt. Birgalikdagi kechalar, suhbatlar, chalg'imasdan yonida bo'lish — mana sizi sevgi bilan to'ldiradigan narsa.",
      },
    ],
  },

  'introvert-ili-ekstrovert': {
    title: "Siz introvert yoki ekstravertmisiz?",
    description: "Va qay darajada — energiya tipingizni aniq bilib oling",
    category: "Psixologiya",
    questions: [
      {
        id: 1,
        text: "Katta ziyofatdan keyin o'zingizni qanday his qilasiz?",
        options: [
          { id: 'a', text: "Charchagan, tinchlik kerak" },
          { id: 'b', text: "Zaryadlangan va davom ettirgim keladi" },
          { id: 'c', text: "Turlicha, kompaniyaga qarab" },
          { id: 'd', text: "Begona hissiyotlarga to'lgan" },
        ],
      },
      {
        id: 2,
        text: "Muhim qarorlarni qanday qabul qilasiz?",
        options: [
          { id: 'a', text: "Yolg'iz uzoq vaqt o'ylayman" },
          { id: 'b', text: "Ko'pchilik bilan maslahatlashaman, tez qaror qilaman" },
          { id: 'c', text: "Ba'zan yolg'iz, ba'zan birov bilan" },
          { id: 'd', text: "Hammaga nima to'g'ri ekanlini his qilaman" },
        ],
      },
      {
        id: 3,
        text: "Juma kechasi ideal holatda nima qilasiz?",
        options: [
          { id: 'a', text: "Kitob, film, uy tinchlik" },
          { id: 'b', text: "Shovqinli kompaniya yoki ziyofat" },
          { id: 'c', text: "Bir nechta yaqin do'st bilan kechki ovqat" },
          { id: 'd', text: "Ko'ngli og'ir kimgadir yordam berish" },
        ],
      },
    ],
    results: [
      {
        id: 'introvert',
        title: "Siz — Introvert",
        description: "Siz energiyani yolg'izlikda va tinchlikda to'playapsiz. Ichki dunyoingiz boy va chuqur. Sizga olomon kerak emas — sizga chuqurlik kerak.",
      },
      {
        id: 'extrovert',
        title: "Siz — Ekstravert",
        description: "Odamlar — sizning batareyangiz. Siz muloqotda gullab-yashnaysiz, osonlik bilan tanishasiz va atrofingizni energiyangiz bilan zaryadlaysiz. Siz har qanday doiraning joningiz.",
      },
      {
        id: 'ambivert',
        title: "Siz — Ambivert",
        description: "Ikki dunyoning eng yaxshisi! Siz ham shovqinli kompaniyada, ham yolg'iz bo'lishni bilasiz. Moslashuvchanlik — muloqotdagi superkuchingiz.",
      },
      {
        id: 'empath',
        title: "Siz — Empatik",
        description: "Siz odamlarni nozik his qilasiz va ularning hissiyotlarini o'zingizga singdirasiz. Bu sizning in'omingiz — va mas'uliyatingiz. Energiyangizni asrang va 'yo'q' deyishni o'rganing.",
      },
    ],
  },

  'tvoya-planeta': {
    title: "Qaysi sayyora sizni boshqaradi?",
    description: "Quyosh sistemasining qaysi sayyorasi taqdirngizni boshqarishini bilib oling",
    category: "Astrologiya",
    questions: [
      {
        id: 1,
        text: "Hayotda sizni nima harakatga keltiradi?",
        options: [
          { id: 'a', text: "Porlab, eng yaxshi bo'lish istagi" },
          { id: 'b', text: "Munosabatlardagi sevgi va uyg'unlik" },
          { id: 'c', text: "G'alaba va o'zini yengish" },
          { id: 'd', text: "Donolik va ma'no izlash" },
        ],
      },
      {
        id: 2,
        text: "Pulga qanday munosabatda bo'lasiz?",
        options: [
          { id: 'a', text: "Pul — muvaffaqiyatimning tan olinishi" },
          { id: 'b', text: "Go'zallik va lazzatlarga sarflyman" },
          { id: 'c', text: "Maqsadga erishish vositasi" },
          { id: 'd', text: "Muhim, lekin hayotda asosiy emas" },
        ],
      },
      {
        id: 3,
        text: "Sizning asosiy xarakter xususiyatingiz:",
        options: [
          { id: 'a', text: "Ishonch va etakchilik" },
          { id: 'b', text: "Joziba va yoqish mahorati" },
          { id: 'c', text: "Jasorat va qat'iyat" },
          { id: 'd', text: "Optimizm va donolik" },
        ],
      },
    ],
    results: [
      {
        id: 'sun',
        title: "Sizni Quyosh boshqaradi ☀️",
        description: "Siz porlash uchun tug'ilgansiz. Quyosh kabi, siz o'z koinotingizning markazisiz — issiqlik va xarizma bilan odamlarni o'zingizga tortasiz. Sizning yo'lingiz — etakchilik va ijodiy o'z-o'zini ifodalash.",
      },
      {
        id: 'venus',
        title: "Sizni Venera boshqaradi 💫",
        description: "Siz go'zallik va sevgi belgisi ostida ekansiz. Venera sizga joziba, did va uyg'unlik yaratish mahoratini berdi. Sizning yo'lingiz — munosabatlar va go'zallik orqali.",
      },
      {
        id: 'mars',
        title: "Sizni Mars boshqaradi 🔥",
        description: "Siz ruhan jangchisiz. Mars sizga jilovlab bo'lmas energiya, jasorat va g'alaba chanqoqligini beradi. Sizning yo'lingiz — yengish va kurash orqali cho'qqilarga.",
      },
      {
        id: 'jupiter',
        title: "Sizni Yupiter boshqaradi 🌟",
        description: "Siz omad va donolik homiyligida ekansiz. Yupiter sizning ufqingizni kengaytiradi va o'sishga olib boradi. Sizning yo'lingiz — bilim va katta maqsadlar orqali.",
      },
    ],
  },

  'tvoya-supersila': {
    title: "Sizning yashirin superkuchingiz",
    description: "Har bir inson o'ziga xos iste'dodga ega — siznikini toping",
    category: "Psixologiya",
    questions: [
      {
        id: 1,
        text: "Qiyin vaziyatda birinchi navbatda nima qilasiz?",
        options: [
          { id: 'a', text: "Mas'uliyat olaman va harakat qilaman" },
          { id: 'b', text: "Tahlil qilaman va yechim topaman" },
          { id: 'c', text: "Boshqalarni qo'llab-quvvatlayman va jamoani birlashtiraman" },
          { id: 'd', text: "G'ayrioddiy chiqish yo'lini o'ylab topaman" },
        ],
      },
      {
        id: 2,
        text: "Sizni ko'pincha nima uchun maqtashadi?",
        options: [
          { id: 'a', text: "Jasorat va qat'iyatlilik uchun" },
          { id: 'b', text: "Aqlli maslahatlar uchun" },
          { id: 'c', text: "Mehribonlik va sezgirlik uchun" },
          { id: 'd', text: "O'ziga xos g'oyalar uchun" },
        ],
      },
      {
        id: 3,
        text: "Agar siz superqahramon bo'lsangiz, kuchingiz bo'lardi...",
        options: [
          { id: 'a', text: "Zaifmaslik va jismoniy qudrat" },
          { id: 'b', text: "Hamma narsani bilish va oldindan ko'rish" },
          { id: 'c', text: "Yaqinlarni davolash va himoya qilish" },
          { id: 'd', text: "Teleportatsiya va o'zgarishlar" },
        ],
      },
    ],
    results: [
      {
        id: 'courage',
        title: "Sizning superkuchingiz — Jasorat",
        description: "Siz boshqalar qo'rqadigan joyga borasiz. Qo'rqmasligingiz va mas'uliyat olishga tayyorligingiz — kamdan-kam va qimmatli sifat. Dunyo bunday odamlarga muhtoj.",
      },
      {
        id: 'wisdom',
        title: "Sizning superkuchingiz — Donolik",
        description: "Siz boshqalardan chuqurroq va uzoqroq ko'rasiz. Aqlnigiz — har qanday masalani hal qila oladigan vosita. Odamlar sizdan maslahat so'rashga keladi — bu tasodif emas.",
      },
      {
        id: 'love',
        title: "Sizning superkuchingiz — Sevgi",
        description: "Siz odamlarni birlashtirish in'omiga egasiz. Empatiyangiz va mehr-muhabbatingiz atrofingizda qabul va iliqlik muhitini yaratadi. Bu eng kamdan-kam uchraydigan superkuch.",
      },
      {
        id: 'creativity',
        title: "Sizning superkuchingiz — Ijodkorlik",
        description: "Aqlnigiz dunyoni o'zgartiradigan g'oyalar ishlab chiqaradi. Siz boshqalar uchburchak ko'rgan joyda imkoniyatlarni ko'rasiz. O'ziga xosligingiz — bu in'om.",
      },
    ],
  },

  'ty-v-otnosheniyakh': {
    title: "Munosabatlarda qanday odamsiz?",
    description: "Juftlikdagi rolingiz — himoyachi, romantik, erkin ruh yoki sodiq?",
    category: "Sevgi",
    questions: [
      {
        id: 1,
        text: "Juftlikda siz uchun asosiy narsa nima?",
        options: [
          { id: 'a', text: "Hamrohni himoya qilish va g'amxo'rlik" },
          { id: 'b', text: "Romantika, ehtiroslar va kutilmagan holatlar" },
          { id: 'c', text: "Erkinlik va shaxsiy makonni hurmat qilish" },
          { id: 'd', text: "Sadoqat va chuqur ishonch" },
        ],
      },
      {
        id: 2,
        text: "Janjal vaqtida o'zingizni qanday tutasiz?",
        options: [
          { id: 'a', text: "Munosabatlarni hal qilishga va himoya qilishga harakat qilaman" },
          { id: 'b', text: "Yorqin va hissiy ravishda qayg'uraman" },
          { id: 'c', text: "Tanaffus olaman, menga makon kerak" },
          { id: 'd', text: "Birinchi yarashaman, munosabatlarni qadrlayman" },
        ],
      },
      {
        id: 3,
        text: "Hamroh bilan ideal kecha bu...",
        options: [
          { id: 'a', text: "Birgalikdagi ish yoki vazifani hal qilish" },
          { id: 'b', text: "Shamlar, musiqa, maxsus muhit" },
          { id: 'c', text: "Har biri o'z ishi bilan shug'ullanadi, lekin yonma-yon" },
          { id: 'd', text: "Hamma narsa haqida uzoq suhbat" },
        ],
      },
    ],
    results: [
      {
        id: 'protector',
        title: "Siz — Himoyachi",
        description: "Munosabatlarda siz tayanch rolini olasiz. Kuchingiz va g'amxo'rligingiz hamrohingizga xavfsizlik hissini beradi. Siz harakatlar va xatti-harakatlar orqali sevasiz.",
      },
      {
        id: 'romantic',
        title: "Siz — Romantik",
        description: "Siz uchun sevgi — bu bayram. Siz munosabatlarda sehr yaratasiz: kutilmagan holatlar, mehribonlik, yorqin lahzalar. Sizning yoningizda hamrohingiz zerikib qolmaydi.",
      },
      {
        id: 'free',
        title: "Siz — Erkin ruh",
        description: "Sizga muhit bo'lgan munosabatlar kerak. Siz chuqur sevasiz, lekin shaxsiy makoni qadrleysiz. Sizning idelingiz — ikki kuchli shaxsning sherikchilik.",
      },
      {
        id: 'devoted',
        title: "Siz — Sodiq",
        description: "Sadoqat va chuqurlik — sizning qadriyatlaringiz. Siz to'la hayot bo'yi sevasiz. Sizning yoningizda hamrohingiz biladi: u hech qachon yolg'iz bo'lmaydi.",
      },
    ],
  },

  'chto-zhdet-v-etom-godu': {
    title: "Bu yil sizni nima kutmoqda?",
    description: "Yulduzlar va energiyangiz bu yil sizga nima olib kelishini aytadi",
    category: "Taqdir",
    questions: [
      {
        id: 1,
        text: "Qaysi so'z hozirgi holatizni eng yaxshi ifodalaydi?",
        options: [
          { id: 'a', text: "Tayyorlik — o'zgarishlarni his qilyapman" },
          { id: 'b', text: "Diqqat — nima istaganini bilaman" },
          { id: 'c', text: "Ochiqlik — yangi narsalar kutaman" },
          { id: 'd', text: "Tinchlik — ichki o'sishni istayman" },
        ],
      },
      {
        id: 2,
        text: "Yulduz uchayotganda ko'pincha nima tilayman?",
        options: [
          { id: 'a', text: "Hayotda katta o'zgarishlar" },
          { id: 'b', text: "Ish yoki karyerada muvaffaqiyat" },
          { id: 'c', text: "Sevgilini uchratish" },
          { id: 'd', text: "O'zining eng yaxshi versiyasiga aylanish" },
        ],
      },
      {
        id: 3,
        text: "Bulardan qaysi birini allaqachon boshladingiz?",
        options: [
          { id: 'a', text: "Muhitni, odatlarni o'zgartiraman" },
          { id: 'b', text: "Ilgarigidan ko'ra ko'proq maqsadlar ustida ishlayapman" },
          { id: 'c', text: "Yuragimni ochaман va tanishaман" },
          { id: 'd', text: "O'qiyman, o'rganaман, o'z ustimda ishlayapman" },
        ],
      },
    ],
    results: [
      {
        id: 'change',
        title: "Katta o'zgarishlar yili",
        description: "Bu yil sizga sezilarli o'zgarishlar olib keladi — yashash joyi, muhit yoki ichki o'zgarish. O'zgarishlardan qo'rqmang: ular sizni yaxshiroq hayotga olib boradi.",
      },
      {
        id: 'success',
        title: "Muvaffaqiyat va yutuqlar yili",
        description: "Sizning sa'y-harakatlaringiz meva beradi. Bu yil — ekkannizni o'rish vaqti. Karyera, loyihalar, orzular — hammasi yuqoriga ketmoqda. Shunday davom eting.",
      },
      {
        id: 'love',
        title: "Sevgi va uchrashuvlar yili",
        description: "Bu yil muhim tanishuvlar va yurak voqealariga boy. Ehtimol, aynan hozir hayotingizni o'zgartiradigan insonni uchratarsiz.",
      },
      {
        id: 'growth',
        title: "Ichki o'sish yili",
        description: "Bu yil — siz uchun. Siz dono, kuchli va o'zingizga yaqinroq bo'lasiz. Bunday o'sish tashqaridan ko'rinmaydi, lekin hamma narsani o'zgartiradi. Bu yaxshiroq kelajak uchun poydevordir.",
      },
    ],
  },

  'tvoe-taynoe-zhelanie': {
    title: "Sizning yashirin orzuingiz",
    description: "Orzu qiladigan, lekin kamdan-kam gapiradigan narsalaringiz",
    category: "Psixologiya",
    questions: [
      {
        id: 1,
        text: "Agar sizda bir yil bo'sh vaqt bo'lsa — siz...",
        options: [
          { id: 'a', text: "Butun dunyoni kezardingiz" },
          { id: 'b', text: "Buyuk bir narsa yaratardingiz" },
          { id: 'c', text: "Chinakam sevgini topardingiz" },
          { id: 'd', text: "O'zingizni va vazifangizni topardingiz" },
        ],
      },
      {
        id: 2,
        text: "Uxlashdan oldin nima haqida o'ylaysiz?",
        options: [
          { id: 'a', text: "Sayohatlar va yangi joylar haqida" },
          { id: 'b', text: "Ortimda nima qoldirishim haqida" },
          { id: 'c', text: "Sevgi va yaqin odamlar haqida" },
          { id: 'd', text: "Hayotning ma'nosi va yo'lim haqida" },
        ],
      },
      {
        id: 3,
        text: "Agar qo'rqmasangiz, nima qilardingiz?",
        options: [
          { id: 'a', text: "Hammasini tashlab boshqa mamlakatga ketardingiz" },
          { id: 'b', text: "Kitob yozardingiz yoki biznes yaratardingiz" },
          { id: 'c', text: "Sevgingizni tan olardingiz" },
          { id: 'd', text: "Hammasini o'zgartirib yangidan boshlardinigiz" },
        ],
      },
    ],
    results: [
      {
        id: 'freedom',
        title: "Siz Ozodlikka intilasiz",
        description: "Ruhingiz cheksiz kenglikka intilmoqda. Yangi joylar, yangi odamlar, yangi ufqlar — mana sizni ma'no bilan to'ldiradigan narsa. O'zingizga buni berish vaqti keldi.",
      },
      {
        id: 'legacy',
        title: "Siz iz qoldirmoqchi bo'lasiz",
        description: "Siz uchun o'zingizdan omon qoladigan narsa yaratish muhim. Kitob, ish, g'oya — siz mavjudligingizning ahamiyatli bo'lishini istavsiz. Bu juda sharafli.",
      },
      {
        id: 'love',
        title: "Siz chinakam Sevgini qidiryapsiz",
        description: "Boshqa inson bilan chuqur, samimiy aloqa — mana sizning yashirin orzuingiz. Siz to'liq tushunilishni va qabul qilinishni istavsiz. Bu eng insoniy orzudir.",
      },
      {
        id: 'purpose',
        title: "Siz o'z Vazifangizni qidiryapsiz",
        description: "Siz kattaroq narsa uchun tug'ilganligingizni his qilasiz. Siz bu yerda nima uchun ekanligingizni tushunmoqchi bo'lasiz. Bu chuqur savol — va uni berayotganingizning o'zi allaqachon javob.",
      },
    ],
  },

  'tvoy-tsvet-sudby': {
    title: "Sizning taqdir rangingiz",
    description: "Ranglarni tanlang — sezgiingiz siz haqingizda nima deydi",
    category: "Taqdir",
    questions: [
      {
        id: 1,
        text: "Hozir sizni qaysi rang tortmoqda?",
        options: [
          { id: 'a', text: "🔴 Qizil yoki to'q sariq" },
          { id: 'b', text: "💙 Ko'k yoki binafsha" },
          { id: 'c', text: "💚 Yashil yoki moviy" },
          { id: 'd', text: "✨ Oltin yoki oq" },
        ],
      },
      {
        id: 2,
        text: "Uyingizga qaysi rasmni osasiz?",
        options: [
          { id: 'a', text: "Tog'lar ustidagi yorqin quyosh botishi" },
          { id: 'b', text: "Kechasi yulduzli osmon" },
          { id: 'c', text: "O'rmon yayloqi yoki okean" },
          { id: 'd', text: "Yorug'lik va shakllardan abstraksiya" },
        ],
      },
      {
        id: 3,
        text: "Qaysi interyerni tanlarasiz?",
        options: [
          { id: 'a', text: "Yorqin aksent — qizil vaza yoki kreslo" },
          { id: 'b', text: "To'q ranglar, shamlar, mistika" },
          { id: 'c', text: "Tirik o'simliklar, tabiiy materiallar" },
          { id: 'd', text: "Minimalizm, oq, oltin, yorug'lik" },
        ],
      },
    ],
    results: [
      {
        id: 'fire',
        title: "Olov rangi — sizning taqdirningiz",
        description: "Qizil va to'q sariq — ehtiroslar, harakatlar va hayotiy kuchning ranglari. Sizning taqdirlingiz yorqin voqealar, jasur harakatlar va qizg'in hissiyotlar bilan bog'liq.",
      },
      {
        id: 'mystery',
        title: "Sir rangi — sizning taqdirningiz",
        description: "Ko'k va binafsha — chuqurlik, sezgi va jumboqning ranglari. Sizning hayotingiz faqat siz ko'radigan ma'nolarga to'la. Sizni kashfiyotlar va ruhiy o'sish kutmoqda.",
      },
      {
        id: 'harmony',
        title: "Uyg'unlik rangi — sizning taqdirningiz",
        description: "Yashil va moviy — davolash, o'sish va muvozanatning ranglari. Sizning taqdirlingiz — atrofingizgagi odamlar va o'z hayotingizga tinchlik va uyg'unlik olib kelish.",
      },
      {
        id: 'light',
        title: "Yorug'lik rangi — sizning taqdirningiz",
        description: "Oltin va oq — poklik, ma'rifat va oliy yo'lning ranglari. Siz ichingizda yorug'lik ko'tarasiz. Sizning taqdirlingiz — bor bo'lishingiz bilan boshqalarni ilhomlantirish.",
      },
    ],
  },

  'tip-privyazannosti': {
    title: "Sizning bog'lanish tipingiz qanday?",
    description: "Barcha munosabatlaringizni tushuntiradigan psixologik test",
    category: "Psixologiya",
    questions: [
      {
        id: 1,
        text: "Hamroh uzoq vaqt yozmaydi. Nima his qilasiz?",
        options: [
          { id: 'a', text: "Biroz sog'inaman, lekin o'z ishlarim bilan shug'ullanishda davom etaman" },
          { id: 'b', text: "Tashvishlanaman va stsenariylar o'ylay boshlayman" },
          { id: 'c', text: "Rostini aytganda — biroz yengillik, menga makon kerak" },
          { id: 'd', text: "Vahima va ketma-ket 10 ta xabar yozish istagi" },
        ],
      },
      {
        id: 2,
        text: "Munosabatlardagi yaqinlikka qanday munosabatdasiz?",
        options: [
          { id: 'a', text: "Uni yaxshi ko'raman — o'zimni xavfsiz his qilaman" },
          { id: 'b', text: "Imkon qadar yaqin bo'lmoqchi bo'laman, yo'qotishdan qo'rqaman" },
          { id: 'c', text: "Juda yaqin bo'lganda — chekinishim kerak" },
          { id: 'd', text: "Bir vaqtda yaqinlikni xohlaman va undan qo'rqaman" },
        ],
      },
      {
        id: 3,
        text: "Yaqin bilan janjal qilgach nima qilasiz?",
        options: [
          { id: 'a', text: "Xotirjamlanaman va suhbatga boraman" },
          { id: 'b', text: "Qayg'uraman — hamma narsa yaxshi ekanligiga ishonch hosil qilishim kerak" },
          { id: 'c', text: "Jim bo'laman va o'z-o'zidan o'tishini kutaman" },
          { id: 'd', text: "Yarashmoqchi bo'laman, keyin g'azablanaman — bilmayman qanday" },
        ],
      },
      {
        id: 4,
        text: "Hamroh makon so'raydi. Qanday munosabat bildirasiz?",
        options: [
          { id: 'a', text: "Tushunaman va unga vaqt beraman" },
          { id: 'b', text: "Rad etish sifatida qabul qilaman, qattiq qayg'uraman" },
          { id: 'c', text: "Yengillashaman — menga ham makon kerak" },
          { id: 'd', text: "Xafa bo'laman va o'zimam uzoqlashaman" },
        ],
      },
      {
        id: 5,
        text: "Odamlarga qanchalik osonlik bilan ishonasiz?",
        options: [
          { id: 'a', text: "Asta-sekin va qulay ravishda ochilaman" },
          { id: 'b', text: "Ishonishni istayman, lekin xiyonatdan qo'rqaman" },
          { id: 'c', text: "Qiyin — o'ziga tayanganim yaxshiroq" },
          { id: 'd', text: "Ishonch qo'rqitadi — qanday ochilishni bilmayman" },
        ],
      },
      {
        id: 6,
        text: "Munosabatlarda o'zingizni qanday idrok qilasiz?",
        options: [
          { id: 'a', text: "O'zimni qadrlayman va nima istaganini bilaman" },
          { id: 'b', text: "Ba'zan odamlar uchun 'haddan ortiq' ekanligimni his qilaman" },
          { id: 'c', text: "O'z-o'ziga yetarli bo'lishni afzal ko'raman" },
          { id: 'd', text: "Yaxshi munosabatga loyiq ekanligimga ishonmayman" },
        ],
      },
      {
        id: 7,
        text: "O'tgan munosabatlar haqida nima o'ylaysiz?",
        options: [
          { id: 'a', text: "Iliqlik bilan — ko'p narsa o'rgandim" },
          { id: 'b', text: "Og'riq bilan va bo'lishi mumkin bo'lgan narsalar uchun sog'inch bilan" },
          { id: 'c', text: "Tugaganidan xursandman, menga yengilroq bo'ldi" },
          { id: 'd', text: "Aralash hislar — ham og'riq, ham takrorlanishdan qo'rquv" },
        ],
      },
      {
        id: 8,
        text: "Munosabatlarda siz uchun eng qiyini nima?",
        options: [
          { id: 'a', text: "Hech narsa alohida — munosabatlar yoqimli" },
          { id: 'b', text: "Ko'p o'ylamaslik va hamma narsa yaxshi ekanligiga ishonch" },
          { id: 'c', text: "Boshqa insonni hayotimga chinakam kiritishga ruxsat berish" },
          { id: 'd', text: "O'zim nima istaganini tushunish" },
        ],
      },
    ],
    results: [
      {
        id: 'secure',
        title: "Ishonchli bog'lanish tipi",
        description: "Siz iliq va sog'lom munosabatlar qura olasiz. Hamroh bilan ham, yolg'iz ham o'zingizni xavfsiz his qilasiz. Bu kamdan-kam in'om — sizning munosabatlaringiz qo'rquv emas, ishonch asosida quriladi. Ehtiyojlaringiz haqida gaplasha olasiz va boshqalarning ehtiyojlarini qabul qila olasiz.",
      },
      {
        id: 'anxious',
        title: "Xavotirli bog'lanish tipi",
        description: "Yuragingiz ulkan — siz chuqur va sadoqat bilan sevasiz. Lekin yo'qotishdan qo'rquv sizga hozirdan zavqlashishga to'sqinlik qiladi. Yaxshi xabar: bu tip ong va o'z-o'zini hurmat qilish ustida ishlash orqali o'zgaradi. Siz allaqachon yetarlisiz — buni doimo isbotlashingiz shart emas.",
      },
      {
        id: 'avoidant',
        title: "Qochuvchi bog'lanish tipi",
        description: "Siz mustaqillikni qadrleysiz va yolg'iz bo'lishni bilasiz — bu kuch. Lekin quradigan devorlaringiz ba'zan haqiqiy yaqinlikka to'sqinlik qiladi. Kimgadir hayotingizga kirishiga ruxsat berish — zaiflik emas, bu jasorat. Masofangiz ortida juda chuqur inson yashiringan.",
      },
      {
        id: 'fearful',
        title: "Xavotirli-qochuvchi tip",
        description: "Siz sevgini istavsiz, lekin zaif bo'lishdan qo'rqasiz. Bu eng murakkab tiplardan biri — va bu sizning aybingiz emas, bu o'tgan tajribaning izi. Sevgingiz istagi samimiy va qo'rquvdan kuchliroq. O'z-o'zini anglash va terapiya munosabatlaringizni tubdan o'zgartirishi mumkin.",
      },
    ],
  },

  'mentalnyy-vozrast': {
    title: "Aslida yoshingiz nechida?",
    description: "Test sizning aqliy yoshingizni aniqlaydi — natija sizni hayratga soladi",
    category: "Psixologiya",
    questions: [
      {
        id: 1,
        text: "Dam olish kunlarini odatda qanday o'tkazasiz?",
        options: [
          { id: 'a', text: "Kechgacha davom etadigan uchrashuvlar, quvnoq" },
          { id: 'b', text: "Uyda: kitob, serial, tinchlik" },
          { id: 'c', text: "Ko'zim qaerga qarasа — spontanlikni yaxshi ko'raman" },
          { id: 'd', text: "Sayr, fikrlash, meditatsiya" },
        ],
      },
      {
        id: 2,
        text: "Hozir sizni nima eng ko'p tashvishlandiradi?",
        options: [
          { id: 'a', text: "Boshqalar men haqimda nima o'ylashi" },
          { id: 'b', text: "Moliyaviy barqarorlik va kelajak" },
          { id: 'c', text: "Keyingi ta'til qachon bo'ladi" },
          { id: 'd', text: "Hayotning ma'nosi va bu dunyodagi o'rnim" },
        ],
      },
      {
        id: 3,
        text: "Tanqidga qanday munosabat bildirasiz?",
        options: [
          { id: 'a', text: "Yoqimsiz, lekin eng yaxshisini olishga harakat qilaman" },
          { id: 'b', text: "Tahlil qilaman — nima to'g'ri, nima emas" },
          { id: 'c', text: "Xafa bo'laman va himoya qilaman" },
          { id: 'd', text: "O'sish imkoniyati sifatida qabul qilaman" },
        ],
      },
      {
        id: 4,
        text: "Siz uchun pul nima?",
        options: [
          { id: 'a', text: "Lazzat uchun kerak — topamiz-sarflaymiz" },
          { id: 'b', text: "Maqsadga erishish vositasi" },
          { id: 'c', text: "Bor — yaxshi, yo'q — ham o'tamiz" },
          { id: 'd', text: "Muhim, lekin hayotda asosiy emas" },
        ],
      },
      {
        id: 5,
        text: "O'zgarishlarga qanday munosabatdasiz?",
        options: [
          { id: 'a', text: "Tashvishlanaman, lekin moslashaman" },
          { id: 'b', text: "Xavotirlanaman — barqarorlikni yaxshi ko'raman" },
          { id: 'c', text: "Juda yaxshi ko'raman! Bu qiziqarli!" },
          { id: 'd', text: "Xotirjam qabul qilaman — hamma narsa o'zgaradi" },
        ],
      },
      {
        id: 6,
        text: "Siz uchun baxt nima?",
        options: [
          { id: 'a', text: "Yorqin lahzalar, quvnoqlik, hissiyotlar" },
          { id: 'b', text: "Barqarorlik va yaqinlarning salomatligi" },
          { id: 'c', text: "Har kuni erkinlik va spontanlik" },
          { id: 'd', text: "O'zini qabul qilish va ichki tinchlik" },
        ],
      },
      {
        id: 7,
        text: "Sizni ko'proq nima ilhomlantiradi?",
        options: [
          { id: 'a', text: "Sayohatlar, yangi odamlar, sarguzashtlar" },
          { id: 'b', text: "Mehnatimning natijalari" },
          { id: 'c', text: "Atrofdagi hamma narsa — dunyo shu qadar qiziqarli" },
          { id: 'd', text: "Odamlar, tabiat, buyuk g'oyalar" },
        ],
      },
      {
        id: 8,
        text: "Yulduzli osmonni ko'rganingizda nima o'ylaysiz?",
        options: [
          { id: 'a', text: "Chiroyli! Rasmga olish kerak" },
          { id: 'b', text: "Ertaga ish kuni — uxlash kerak" },
          { id: 'c', text: "Voy, o'sha yerga chiqib o'rganmoqchi bo'laman!" },
          { id: 'd', text: "O'zimning qanchalik oz ahamiyat kasb etishimni his qilaman — va bu tinchlantiradi" },
        ],
      },
    ],
    results: [
      {
        id: 'child',
        title: "Aqliy yosh: 16–20 yosh 🎠",
        description: "Siz bolalik qiziquvchanligini va hayratlanish qobiliyatini saqlab qoldingiz. Hozirgi lahzada yashaysiz, ortiqcha tashvishlardan ozodasz. Bunday aqliy yoshdagi odamlar — eng yorqin va samimiylar. Bu uchqunni hech qachon yo'qotmang — u hayotni jonli qiladi.",
      },
      {
        id: 'young',
        title: "Aqliy yosh: 22–28 yosh 🎉",
        description: "Siz eng faol davrdasiz — ambitsiyaga to'la, to'liq yashash va hamma narsani sinab ko'rish istagisiz. Siz o'zingizni qidiryapsiz, va bu normal. Yangiliklarga ochiqligingiz va energiyangiz — hayotda katta ustunlik.",
      },
      {
        id: 'mature',
        title: "Aqliy yosh: 35–45 yosh 🏡",
        description: "Siz kattalar kabi fikrlaysiz: barqarorlikni qadrleysiz, oldini ko'rasiz. Ishonchli va mas'uliyatli odam, tayanish mumkin bo'lgan. Ehtimol, ba'zan o'zingizga biroz mas'uliyatsiz bo'lishga ruxsat berish kerak — hayot faqat rejalar emas.",
      },
      {
        id: 'wise',
        title: "Aqliy yosh: 60+ yosh 🦉",
        description: "Siz donishmandasz. Sizning dunyo idrokingiz chuqur va xotirjam — siz narsalarni illuziyasiz, bo'lganidek ko'rasiz. Bunday odamlar maslahat va ular sochgan ruhiy tinchlik uchun qadrlanadi. Bu har qanday yoshda kamdan-kamlik.",
      },
    ],
  },

  'tvoya-karta-taro': {
    title: "Siz qaysi Taro kartasisiz?",
    description: "Katta Arkanlar sizning haqiqiy mohiyatingizni ochib beradi",
    category: "Astrologiya",
    questions: [
      {
        id: 1,
        text: "Kelajakka qanday munosabatda bo'lasiz?",
        options: [
          { id: 'a', text: "Qizg'inlik bilan — kutilmagan holatlarni kutaman" },
          { id: 'b', text: "Sezgimga ishonaman, u yo'lni biladi" },
          { id: 'c', text: "Umid bilan — hamma narsa yaxshi bo'lishiga ishonaman" },
          { id: 'd', text: "Xotirjam — men allaqachon kelajagimni yaratyapman" },
        ],
      },
      {
        id: 2,
        text: "Sizni eng yaxshi nima tavsiflaydi?",
        options: [
          { id: 'a', text: "Sarguzashtchi, doim yo'lda" },
          { id: 'b', text: "Mistik — atrofdagilar uchun jumboq" },
          { id: 'c', text: "Orzukor va boshqalarni ilhomlantiruvchi" },
          { id: 'd', text: "G'olib, hammani oxirigacha etkazadigan" },
        ],
      },
      {
        id: 3,
        text: "Sizning asosiy in'omingiz nima?",
        options: [
          { id: 'a', text: "Qo'rqmaslik va yangilikka ochiqlik" },
          { id: 'b', text: "Chuqur sezgi va o'tkirlik" },
          { id: 'c', text: "Ilhomlantirish va odamlarga umid berish" },
          { id: 'd', text: "Odamlarni birlashtirish va maqsadlarga erishish" },
        ],
      },
      {
        id: 4,
        text: "Atrofdagilar sizni qanday ko'radi?",
        options: [
          { id: 'a', text: "Biroz g'alati, lekin jozibali" },
          { id: 'b', text: "Sirli va qo'lga tushmas" },
          { id: 'c', text: "Yorqin, issiqlik sochuvchi" },
          { id: 'd', text: "Ishonchli va muvaffaqiyatli" },
        ],
      },
      {
        id: 5,
        text: "Hayotda nima qidiryapsiz?",
        options: [
          { id: 'a', text: "Keyingi sarguzasht va yangi tajriba" },
          { id: 'b', text: "Ma'no, haqiqat va yashirin bilim" },
          { id: 'c', text: "Go'zallik, davolanish va ruhiy o'sish" },
          { id: 'd', text: "Yutuq, tan olinish va yakunlanish" },
        ],
      },
      {
        id: 6,
        text: "Qaysi stixiya sizga yaqinroq?",
        options: [
          { id: 'a', text: "Havo — erkinlik va harakat" },
          { id: 'b', text: "Suv — chuqurlik va oqim" },
          { id: 'c', text: "Efir — yorug'lik va ilhom" },
          { id: 'd', text: "Yer — kuch va yakunlanish" },
        ],
      },
      {
        id: 7,
        text: "Agar hayotingiz ertak bo'lsa, siz bo'lardingiz:",
        options: [
          { id: 'a', text: "Xaritasiz yo'lga chiqadigan" },
          { id: 'b', text: "Sirlar bilan o'rmon uyidagi bashoratchi" },
          { id: 'c', text: "Yordam berish uchun tushgan yulduz" },
          { id: 'd', text: "Zafar bilan uyga qaytgan g'olib" },
        ],
      },
      {
        id: 8,
        text: "Sizni eng ko'p nima qo'rqitadi?",
        options: [
          { id: 'a', text: "To'xtab, rivojlanishni to'xtatish" },
          { id: 'b', text: "Hech kim mening chuqurligimni tushunmasligi" },
          { id: 'c', text: "Ishonchni yo'qotib, siniq bo'lib qolish" },
          { id: 'd', text: "Boshlaganini tugatmaslik" },
        ],
      },
    ],
    results: [
      {
        id: 'fool',
        title: "Siz — Masxaraboz (The Fool)",
        description: "Mutlaq erkinlik va cheksiz imkoniyatlar kartasi. Masxaraboz qo'rqmay noma'lumlikka birinchi qadamni bosadi. Ochiqligingiz va qo'rqmasligingiz — soddalik emas, bu idrokning pokligidir. Siz doimo yangilanasiz, boshqalar xavf ko'rgan joyda quvonch topasiz. Masxaraboz — hamma narsaning boshlanishi.",
      },
      {
        id: 'priestess',
        title: "Siz — Oliy Kohina",
        description: "Yashirin bilimlar va chuqur sezgining kartasi. Siz koinot sirlarini saqlaysiz va boshqalar ko'rmaydigan narsalarni his qilasiz. Sizning kuchingiz — sukunat, kuzatish va ko'rinmas dunyo bilan bog'liqlikda. Odamlar sizdan maslahat olishga keladi — va bu tasodif emas.",
      },
      {
        id: 'star',
        title: "Siz — Yulduz (The Star)",
        description: "Umid, davolanish va ilhomning kartasi. Siz yaqinlaringiz uchun qorong'ulikdagi yorug'liqsiz. Har qanday qiyinchiliklardan keyin tiklanasiz va yana porlaysiz. Siz yaxshilikka ishonasiz — va bu sizning hayotingizda yaxshi voqealar uchun haqiqiy magnit.",
      },
      {
        id: 'world',
        title: "Siz — Dunyo (The World)",
        description: "Yakunlanish, zafar va to'liqlikning kartasi. Siz ishlarni oxirigacha etkazishni va mehnat mevasini o'rishni bilasiz. Sizda shaxsiyatning barcha qismlari o'rtasida ichki uyg'unlik bor. Bu o'zini topgan va qayerga borishini biladigan odamlarning kartasi.",
      },
    ],
  },

  'tsvet-aury': {
    title: "Sizning aurangiz qanday rangda?",
    description: "Shaxsiyatingizning energiyasi rangda yashiringan",
    category: "Astrologiya",
    questions: [
      {
        id: 1,
        text: "Katta kompaniyada o'zingizni qanday his qilasiz?",
        options: [
          { id: 'a', text: "Energiya olaman — voqealar markazidaman" },
          { id: 'b', text: "Gapirganim ko'p emas, ko'proq kuzataman va tinglaman" },
          { id: 'c', text: "Hammaga yaxshi bo'lishini ta'minlash haqida qayg'uraman" },
          { id: 'd', text: "Boshqalar ko'rmaydigan narsalarni sezaman" },
        ],
      },
      {
        id: 2,
        text: "Sizni eng ko'p nima ta'sirlantiradi?",
        options: [
          { id: 'a', text: "Adolatsizlik va hech narsani o'zgartira olmaslik" },
          { id: 'b', text: "Tartibsizlik va izchillik yo'qligi" },
          { id: 'c', text: "Yaqinlarimning azob chekishi va men yordam bera olmasligim" },
          { id: 'd', text: "Yuzakilik va tushunilmaslik" },
        ],
      },
      {
        id: 3,
        text: "Sevgini qanday namoyon qilasiz?",
        options: [
          { id: 'a', text: "Faol ravishda — ishlar, himoya, mavjudlik bilan" },
          { id: 'b', text: "So'zlar, sodiqlik va doimiylik bilan" },
          { id: 'c', text: "G'amxo'rlik va mayda tafsilotlarga e'tibor bilan" },
          { id: 'd', text: "Insonni o'zi bilganidan chuqurroq tushunaman" },
        ],
      },
      {
        id: 4,
        text: "Sizning vazifangiz nima?",
        options: [
          { id: 'a', text: "Dunyoni o'zgartirish va boshqalarni ergashtirish" },
          { id: 'b', text: "Tartibsizlikda tartib va ravshanlik yaratish" },
          { id: 'c', text: "Davolash, qo'llab-quvvatlash, himoya qilish" },
          { id: 'd', text: "Borliq va ruhning sirlarini o'rganish" },
        ],
      },
      {
        id: 5,
        text: "Qaysi dam olish turini yaxshi ko'rasiz?",
        options: [
          { id: 'a', text: "Faol sport yoki sarguzasht" },
          { id: 'b', text: "Kitoblar, musiqa, yolg'iz tabiat" },
          { id: 'c', text: "Yaqin odamlar bilan qulay vaqt" },
          { id: 'd', text: "Meditatsiya, kartalar, yulduzli osmon" },
        ],
      },
      {
        id: 6,
        text: "Sizga eng oson nima?",
        options: [
          { id: 'a', text: "Tez va qat'iy ravishda harakat qilish" },
          { id: 'b', text: "Aniq va ob'ektiv fikrlash" },
          { id: 'c', text: "Boshqa odamga nima kerakligini his qilish" },
          { id: 'd', text: "Yashirin bog'liqlik va ma'nolarni ko'rish" },
        ],
      },
      {
        id: 7,
        text: "Qaysi ibora sizga yaqinroq?",
        options: [
          { id: 'a', text: "'Bu narxga tushsa ham qilaman'" },
          { id: 'b', text: "'Haqiqat har qanday fikrdan ustundir'" },
          { id: 'c', text: "'Siz yaxshi bo'lishingiz men uchun muhim'" },
          { id: 'd', text: "'Dunyo ko'rinadganidan ancha chuqur'" },
        ],
      },
      {
        id: 8,
        text: "Odamlar sizni qanday eslab qolishadi?",
        options: [
          { id: 'a', text: "Doimo harakat qilib, dunyoni o'zgartirgan kishi sifatida" },
          { id: 'b', text: "Doimo haqiqatni aytgan kishi sifatida" },
          { id: 'c', text: "Qiyin lahzada doimo yonida bo'lgan kishi sifatida" },
          { id: 'd', text: "Boshqalar sezmaganlarni ko'rgan kishi sifatida" },
        ],
      },
    ],
    results: [
      {
        id: 'red',
        title: "Qizil aura — Kuch va Ehtiros",
        description: "Siz kuchli hayotiy energiya nurlatmoqdasiz. Qizil auralar tug'ma etakchilar va harakatdagi odamlarda bo'ladi. Siz nima istaganingizni bilasiz va ko'zlaringizda olov bilan unga borasiz. Ba'zan to'xtash kerak bo'ladi — lekin aynan shu qudrat atrofingizda dunyoni o'zgartira oladi.",
      },
      {
        id: 'blue',
        title: "Ko'k aura — Donolik va Tinchlik",
        description: "Sizning energiyangiz okean kabi xotirjam va chuqur. Gapirmasdan oldin o'ylaysiz, ko'rsatganingizdan ko'proq his qilasiz. Ko'k auralar ko'pincha boy ichki dunyoga ega analitiklar, o'qituvchilar va ijodiy odamlarda bo'ladi.",
      },
      {
        id: 'green',
        title: "Yashil aura — Davolanish va Sevgi",
        description: "Siz atrofingizgidagi barcha uchun issiqlik va g'amxo'rlik manba'isiz. Yashil aura — davolovchining belgisi. Siz bo'lgan joyingizda xavfsiz muhit yaratarsiz. Sizning asosiy in'omingiz — faqat mavjudligingiz bilan dunyoni mehribonroq qilish.",
      },
      {
        id: 'purple',
        title: "Binafsha aura — Sir va Sezgi",
        description: "Siz boshqalardan yashiringan narsalarni ko'rasiz. Binafsha auralar mistiklar, bashoratchilar va rivojlangan sezgiga ega odamlarda bo'ladi. Siz makoning va odamlarning energiyasini his qilasiz. Ruhiy dunyo bilan bog'liqligingiz — haqiqiy va kamdan-kam kuch.",
      },
    ],
  },

  'tip-snovidtsa': {
    title: "Siz qanday tush ko'ruvchi tipisisiz?",
    description: "Tushlaringiz — ruhingizning kaliti. O'zingizning maxsus in'omingizni bilib oling",
    category: "Taqdir",
    questions: [
      {
        id: 1,
        text: "Tushlarni qanchalik yorqin eslab qolasiz?",
        options: [
          { id: 'a', text: "Juda yorqin — deyarli har bir tafsilotni eslayman" },
          { id: 'b', text: "Ba'zan ha, ba'zan yo'q" },
          { id: 'c', text: "Ko'pincha tush ichida uxlayotganimni tushunaman" },
          { id: 'd', text: "Mening tushlarim syujetli to'liq filmlar kabi" },
        ],
      },
      {
        id: 2,
        text: "Keyinchalik amalga oshgan tushlar ko'rganmisiz?",
        options: [
          { id: 'a', text: "Ha, bir necha marta aniq" },
          { id: 'b', text: "Ishonchim komil emas, lekin ba'zilar o'xshash edi" },
          { id: 'c', text: "Yo'q, lekin tushlarimning ramzlarini tushunaman" },
          { id: 'd', text: "Mening tushlarim amalga oshishi uchun juda fantastik" },
        ],
      },
      {
        id: 3,
        text: "Uyg'onganda nima his qilasiz?",
        options: [
          { id: 'a', text: "Muhim xabar olganday his" },
          { id: 'b', text: "Hissiy yengillashish yoki yangilik" },
          { id: 'c', text: "Qoniqish — tushimni boshqargan edim" },
          { id: 'd', text: "Hayrat — ajoyib sarguzasht bo'ldi" },
        ],
      },
      {
        id: 4,
        text: "Tushlaringizga qanday munosabatdasiz?",
        options: [
          { id: 'a', text: "Ular ogohlantirishi va yo'naltirishi mumkin deb ishonaman" },
          { id: 'b', text: "Ular kunning tajribalarini qayta ishlashga yordam beradi" },
          { id: 'c', text: "Men uchun tush — ong trenirovkasi" },
          { id: 'd', text: "Bu kunning eng yaxshi qismi — boshqa voqelik" },
        ],
      },
      {
        id: 5,
        text: "Dahshatli tush ko'rganingizda nima bo'ladi?",
        options: [
          { id: 'a', text: "Tushunaman — bu ogohlantirish" },
          { id: 'b', text: "Uyg'ongandan keyin uzoq vaqt xavotir saqlanib qoladi" },
          { id: 'c', text: "Bu tush ekanligini anglayman va stsenariyni o'zgartiraman" },
          { id: 'd', text: "Mening dahshatli tushlarim — epik sarguzashtlar" },
        ],
      },
      {
        id: 6,
        text: "Takrorlanuvchi tushlar ko'rasizmi?",
        options: [
          { id: 'a', text: "Ha, va ularda doimo muhim ramz bor" },
          { id: 'b', text: "O'xshash hissiy mavzular takrorlanadi" },
          { id: 'c', text: "Men o'zim tushni qaytadan ishga tushira olaman" },
          { id: 'd', text: "Menda davom etadigan butun seriallar bor!" },
        ],
      },
      {
        id: 7,
        text: "Ertalab qanday uyg'onasiz?",
        options: [
          { id: 'a', text: "Sekinlik bilan — tushdagi obrazlarni o'ylayman" },
          { id: 'b', text: "Xotirjam — go'yo biror narsa yakunlangandek" },
          { id: 'c', text: "Tushimni nazorat qilganimning aniq hissi bilan" },
          { id: 'd', text: "Qiyin — o'z dunyomga qaytgim kelmaydigan" },
        ],
      },
      {
        id: 8,
        text: "Agar tushda superqudrat tanlasangiz:",
        options: [
          { id: 'a', text: "Tushlar orqali kelajakni ko'rish" },
          { id: 'b', text: "Tush paytida o'zini va boshqalarni davolash" },
          { id: 'c', text: "Har qanday tushni to'liq boshqarish" },
          { id: 'd', text: "Har qanday dunyo va hikoyalarni yaratish" },
        ],
      },
    ],
    results: [
      {
        id: 'lucid',
        title: "Ong bilan tush ko'ruvchi",
        description: "Siz kamdan-kam in'omga egasiz — tushda onglilik. Uxlayotganingizni bilib, sodir bo'layotgan narsani boshqarish qobiliyati — chuqur o'z-o'zini bilish yo'li. Ong bilan tush ko'ruvchilar muammolarni hal qilishi, qo'rquvlarni yengishi va ongsizni o'rganishi mumkin. Tush daftari yurit — u ajoyib narsalarni ochib beradi.",
      },
      {
        id: 'prophet',
        title: "Bashoratchi tush ko'ruvchi",
        description: "Sizning tushlaringiz — ongsizlikning chuqurliklaridan kelgan xabarlar. Siz keyinchalik voqelik bilan kesishgan ramzlar va obrazlarni sezasiz. Bu in'om e'tibor talab qiladi: uyg'ongandan keyin darhol tushlaringizni yozing. Siz ko'pchilik e'tiborsiz qoldiradigan narsani eshita olasiz.",
      },
      {
        id: 'healer',
        title: "Davolovchi tush ko'ruvchi",
        description: "Sizning tushlaringiz ruhinggiz bilan ishlaydi. Ular og'riqni qayta ishlashga, kechirish va o'z-o'zingiz bilan yarashishga yordam beradi. Chuqur uxlashdan keyin uyg'onganda boshqacha his qilasiz. Bu maxsus in'om — ongsizingiz har kecha uxlayotganingizda sizni davolaydi.",
      },
      {
        id: 'explorer',
        title: "Tush ko'ruvchi-Tadqiqotchi",
        description: "Ichki dunyoingiz to'lib-toshgan. Siz ajoyib fazolar bo'ylab sayohat qilasiz va epik hikoyalar yashaysiz. Tushlaringiz — sizning ikkinchi hayotingiz. Bunday tip odamlar ko'pincha yozuvchi, rejissyor yoki rassomga aylanadi — siz butun dunyolar yarata olasiz.",
      },
    ],
  },

  'kto-ty-v-proshloy-zhizni': {
    title: "O'tgan hayotda kim bo'lgansiz?",
    description: "Instinktlaringiz va reaktsiyalaringiz o'tgan tirilishlarning sadosini saqlaydi",
    category: "Taqdir",
    questions: [
      {
        id: 1,
        text: "Adolatsizlikni ko'rganingizda nima qilasiz?",
        options: [
          { id: 'a', text: "Darhol himoya qilish uchun turaman" },
          { id: 'b', text: "Zarar ko'rganga yordam berishga harakat qilaman" },
          { id: 'c', text: "Tahlil qilaman va tizimli yechim qidiraman" },
          { id: 'd', text: "O'tkir og'riq his etaman va ijod orqali ifodalaman" },
        ],
      },
      {
        id: 2,
        text: "Qaysi joyni tanlar edingiz?",
        options: [
          { id: 'a', text: "Tepa ustidagi qasr yoki qal'a" },
          { id: 'b', text: "O'tli bog'li o'rmon chetidagi qulay uy" },
          { id: 'c', text: "Ajoyib kutubxona yoki universitet" },
          { id: 'd', text: "Eski shahardagi rassomning ustaxonasi" },
        ],
      },
      {
        id: 3,
        text: "Tarixda sizni nima hayratga soladi?",
        options: [
          { id: 'a', text: "Buyuk janglar, strategiyalar va qahramonliklar" },
          { id: 'b', text: "Hayot qutqarish va rahmdillik tarixi" },
          { id: 'c', text: "Buyuk aqllar va inqilobiy kashfiyotlar" },
          { id: 'd', text: "Buyuk san'at davrlari — Uyg'onish, romantizm" },
        ],
      },
      {
        id: 4,
        text: "Sizga oson va tabiiy nima keladi?",
        options: [
          { id: 'a', text: "Inqiroziy vaziyatda qaror qabul qilish" },
          { id: 'b', text: "Og'riq ichidagi odamni tinchlantirish va qo'llab-quvvatlash" },
          { id: 'c', text: "Murakkabni oddiy so'zlar bilan tushuntirish" },
          { id: 'd', text: "Hech narsadan chiroyli narsa yaratish" },
        ],
      },
      {
        id: 5,
        text: "Odamlar siz haqingizda nima deydi?",
        options: [
          { id: 'a', text: "'Har qanday vaziyatda unga tayanish mumkin'" },
          { id: 'b', text: "'Uning yonida doimo xotirjam va iliq'" },
          { id: 'c', text: "'U deyarli har qanday savolga javob biladi'" },
          { id: 'd', text: "'U dunyoni hammadan boshqacha ko'radi'" },
        ],
      },
      {
        id: 6,
        text: "Nimani kechira olmaysiz?",
        options: [
          { id: 'a', text: "Qo'rqoqlik va o'ziga ishonganlarni sotish" },
          { id: 'b', text: "Boshqalarning og'rig'iga shafqatsizlik va befarqlik" },
          { id: 'c', text: "Ataylab bilmaslik va o'rganishdan bosh tortish" },
          { id: 'd', text: "Go'zallik va ijodiyotni yo'q qilish" },
        ],
      },
      {
        id: 7,
        text: "Asosiy qo'rquvingiz nima?",
        options: [
          { id: 'a', text: "Sharafni yo'qotish yoki ishonganlarni sotish" },
          { id: 'b', text: "Muhtojlarga yordam berish uchun ulgurmаslik" },
          { id: 'c', text: "Eng muhim narsani bilmay hayot kechirish" },
          { id: 'd', text: "Ichda yonayotgan narsani ifodalashga ulgurmaslik" },
        ],
      },
      {
        id: 8,
        text: "Sizni ko'proq nima ilhomlantiradi?",
        options: [
          { id: 'a', text: "Kuchsizning kuchlini yengish haqidagi hikoyalar" },
          { id: 'b', text: "Inson davolanishi va tiklanishi mo'jizasi" },
          { id: 'c', text: "Dunyoni o'zgartirgan buyuk g'oyalar" },
          { id: 'd', text: "Vaqt sinovidan o'tgan san'at asarlari" },
        ],
      },
    ],
    results: [
      {
        id: 'warrior',
        title: "O'tgan hayotingizda Jangchi bo'lgansiz",
        description: "Ritsar, samuray, qabila himoyachisi — ruhingiz sharaf, janglar va sadoqatni eslamoqda. Bugun siz hali ham kuchsizlarni himoya qilasiz, adolat hissini kuchli his qilasiz va inqiroz paytida nima qilishni bilasiz. O'tgan hayot sizga bukilmas ruh kuchini berdi.",
      },
      {
        id: 'healer',
        title: "O'tgan hayotingizda Davolovchi bo'lgansiz",
        description: "O'tchi, shaman, rohiba yoki tabib — siz odamlarni hayotga qaytara olardingiz. Bugun sizda bu in'om yashaydi: siz intuitiv tarzda odamga nima kerakligini va og'riqni qanday tinchlantirishni bilasiz. Bu kasb emas — bu ruhingizning mohiyati.",
      },
      {
        id: 'sage',
        title: "O'tgan hayotingizda Donishmand bo'lgansiz",
        description: "Faylasuf, alkimyogar, olim yoki bashoratchi — siz haqiqat izladingiz va bilimni saqlagan. Bugun siz hali javob izlashni to'xtatmaysiz. Aqlnigiz — asosiy qurol va asosiy in'om. Siz uchun bilim — bu hokimiyat va ma'no shakli.",
      },
      {
        id: 'artist',
        title: "O'tgan hayotingizda Ijodkor bo'lgansiz",
        description: "Rassom, shoir, musiqachi yoki haykaltarosh — ruhingiz go'zallik yaratish uchun qayta-qayta tug'ilgan. Bugun siz dunyoni boshqalardan o'tkirroq his qilasiz, odamlar ko'rmaydigan narsalarni sezasiz. Sizning ijodingiz — o'tgan hayotlardan kelgan xabar.",
      },
    ],
  },

  'arkhetip-teni': {
    title: "Soyangizning arxetipi qanday?",
    description: "Yung bo'yicha: shaxsiyatning qorong'u tomoni — sizning eng qiziqarli qismingiz",
    category: "Psixologiya",
    questions: [
      {
        id: 1,
        text: "Reja bo'yicha bo'lmayotgan paytda nima qilasiz?",
        options: [
          { id: 'a', text: "O'z maqsadimga erishish uchun qoidalarni buzaman" },
          { id: 'b', text: "Xatoni qidiraman va hammani mukammal tuzatishga harakat qilaman" },
          { id: 'c', text: "O'zimga kirib ketaman — xayollar, uxlash, chalg'itish" },
          { id: 'd', text: "Vaziyatni o'zim nazorat qilishga kirishaman" },
        ],
      },
      {
        id: 2,
        text: "Boshqa odamlarda sizni nima asabiylantiradi?",
        options: [
          { id: 'a', text: "Ularning bo'yinsuvchanlik va kurashishni istamasligi" },
          { id: 'b', text: "Tartibsizlik va yarim-yorti" },
          { id: 'c', text: "Obsessivlik va mavjudlik talabi" },
          { id: 'd', text: "Mas'uliyatsizlik va g'amxo'rlik qila olmaslik" },
        ],
      },
      {
        id: 3,
        text: "Ichki tanqidchingiz qanday ko'rinadi?",
        options: [
          { id: 'a', text: "'Siz juda ko'p bo'yinsunyapsiz — isyon ko'taring'" },
          { id: 'b', text: "'Yaxshiroq qilishingiz mumkin edi — bu yetarli emas'" },
          { id: 'c', text: "'Bularning nima keragi bor? Siz bu yerda bo'lmaganingiz yaxshiroq'" },
          { id: 'd', text: "'Siz bo'lmasangiz kim? Siz bo'lmasangiz hamma narsa qulab tushadi'" },
        ],
      },
      {
        id: 4,
        text: "Ko'pchilikdan nima yashirasiz?",
        options: [
          { id: 'a', text: "Hammani buzib, yangidan boshlashni istash" },
          { id: 'b', text: "Firibgar sifatida fosh bo'lishdan qo'rquv" },
          { id: 'c', text: "Yo'qolib, hech narsaga mas'ul bo'lmaslikni istash" },
          { id: 'd', text: "Hammaga doimiy mas'uliyatdan charchoq" },
        ],
      },
      {
        id: 5,
        text: "Hokimiyat va avtoritetlarga qanday munosabatdasiz?",
        options: [
          { id: 'a', text: "Instinktiv qarshilik ko'rsataman va shubhalayman" },
          { id: 'b', text: "Ularning standartlariga javob berishga intilayman" },
          { id: 'c', text: "To'qnashuvlardan qochaman — chetga chiqib ketaman" },
          { id: 'd', text: "O'zim avtoritet o'rnini egallashga intilayman" },
        ],
      },
      {
        id: 6,
        text: "Sizni eng ko'p nima qo'rqitadi?",
        options: [
          { id: 'a', text: "Hammaga o'xshab qolish va o'zini yo'qotish" },
          { id: 'b', text: "Ommiy ravishda xato qilib, boshqalarni umiddan tushirish" },
          { id: 'c', text: "Abadiy bir rolda qamalib qolish" },
          { id: 'd', text: "Nazoratni to'xtatib qo'ysangiz hamma narsa qulab tushishi" },
        ],
      },
      {
        id: 7,
        text: "Stressdan qanday dam olasiz?",
        options: [
          { id: 'a', text: "Odatni buzaman — o'zimga taqiqlangan nimadir qilaman" },
          { id: 'b', text: "Qayta qilaman va yaxshilayman — shunchaki o'tirolmayman" },
          { id: 'c', text: "Xayollar, o'yinlar, seriallar, uxlashga sho'ng'iyman" },
          { id: 'd', text: "Nimadir tashkil qilaman — rejalashtirishaman, nazorat qilaman" },
        ],
      },
      {
        id: 8,
        text: "Har doim tan olmaydigan superkuchingiz nima?",
        options: [
          { id: 'a', text: "Tizim singanini hammadan oldin ko'rish" },
          { id: 'b', text: "Eng yuqori sifatdagi narsalar yaratish" },
          { id: 'c', text: "Qayta tiklanish va qochishda go'zallik topish" },
          { id: 'd', text: "Boshqalar allaqachon taslim bo'lganida hammani ushlab turish" },
        ],
      },
    ],
    results: [
      {
        id: 'rebel',
        title: "Soya arxetipi: Isyonchi",
        description: "Sizning soyangiz — eskirganini yo'q qilish va o'zinikini yaratishni bostirilgan istagi. Sizning ichingizda isyonchi — buzg'unchi emas, inqilobchidir. Bu energiyani ekologik chiqarishga ruxsat berganingizda — ijod, innovatsiya, qadriyatlarni himoya qilish orqali — u sizning asosiy kuchingizga aylanadi.",
      },
      {
        id: 'perfectionist',
        title: "Soya arxetipi: Perfeksionist",
        description: "Sizning soyangiz yetarli bo'lmaslikdan chuqur qo'rquvdan tug'iladi. Ichki tanqidchi mukammallikni talab qiladi — lekin aynan u sizga yo'ldan zavq olishga to'sqinlik qiladi. Sizning kuchingiz — sifat standartlarida. Uni o'zingizga qarshi emas, buyuk narsa yaratishga yo'naltiring.",
      },
      {
        id: 'escapist',
        title: "Soya arxetipi: Qochqin",
        description: "Sizning soyangiz — xavfsiz joyga voqelikdan chiqish istagi. Bu zaiflik emas — bu boy ichki dunyo. Xayollaringiz va orzularingiz — xazina. Sir: ularni voqelikka aylantirishga yo'l topganingizda, qochishingiz ijodiy kuchga aylanadi.",
      },
      {
        id: 'guardian',
        title: "Soya arxetipi: Qo'riqchi",
        description: "Sizning soyangiz — siz bo'lmasangiz hamma narsa qulab tushishidan qo'rquvdan o'sgan gipermass'uliyat. Sizning ichingizda Qo'riqchi — sevgi va himoya. Lekin siz ba'zan boshqalarga o'zingizga g'amxo'rlik qilishiga ruxsat berishingizga loyiqsiz. Sizning kuchingiz — dunyoni ushlab turishda. Sizning muammongiz — qo'yib yuborishni o'rganish.",
      },
    ],
  },
  'stil-myshleniya': {
    title: "Qanday fikrlaysiz?",
    description: "Vizioner, tahlilchi, amaliyotchi yoki sezgir — o'z fikrlash uslubingizni toping",
    category: "Psixologiya",
    questions: [
      {
        id: 1,
        text: "Sizga murakkab vazifa berishdi. Birinchi navbatda nima qilasiz?",
        options: [
          { id: 'a', text: "Yakuniy natijani tasavvur qilaman — butun rasmni ko'raman" },
          { id: 'b', text: "Bosqichlarga bo'lib, ketma-ket harakat qilaman" },
          { id: 'c', text: "Shunga o'xshash holatlarda nima qilinganini ko'raman" },
          { id: 'd', text: "Kutaman — javob o'zi \"kelishi\" kerak" },
        ],
      },
      {
        id: 2,
        text: "Ma'lumotni eng yaxshi qanday eslab qolasiz?",
        options: [
          { id: 'a', text: "Ko'rish orqali — sxemalar, xaritalar, obrazlar" },
          { id: 'b', text: "Tuzilma orqali — ro'yxatlar, toifalar, bog'liqliklar" },
          { id: 'c', text: "Amaliyot orqali — o'zim sinab ko'rsam, eslab qolaman" },
          { id: 'd', text: "His orqali — \"ta'sir qilsa\", umrbod eslayman" },
        ],
      },
      {
        id: 3,
        text: "Hamkasblaringiz yoki do'stlaringiz siz haqingizda nima deydi?",
        options: [
          { id: 'a', text: "\"Siz keng fikrlaysiz — hali yo'q narsani ko'rasiz\"" },
          { id: 'b', text: "\"Boshqalar qaramaydigan joydan xatoni topasiz\"" },
          { id: 'c', text: "\"Buni qanday qilishni bilasiz — ortiqcha gapsiz\"" },
          { id: 'd', text: "\"Vaziyatni qandaydir oltinchi tuyg'u bilan his qilasiz\"" },
        ],
      },
      {
        id: 4,
        text: "Boshqalarning qarorlarida sizni nima g'ashingizga tegadi?",
        options: [
          { id: 'a', text: "Mayda fikrlash va ko'ra bilmaslik" },
          { id: 'b', text: "Izchilsizlik va faktlarni e'tiborsiz qoldirish" },
          { id: 'c', text: "Shunchaki qilish o'rniga nazariya so'qish" },
          { id: 'd', text: "Ravshan \"belgilar\" va hislarni e'tiborsiz qoldirishlari" },
        ],
      },
      {
        id: 5,
        text: "Muhim qarorni qanday qabul qilasiz?",
        options: [
          { id: 'a', text: "Kelajakning barcha mumkin stsenariylarini tasavvur qilaman" },
          { id: 'b', text: "Ma'lumot yig'ib, afzallik va kamchiliklarni tortaman" },
          { id: 'c', text: "Tajribaga tayanaman — avval nima ishlagan bo'lsa" },
          { id: 'd', text: "Ichki ovozimga quloq solaman" },
        ],
      },
      {
        id: 6,
        text: "Murakkab narsani tushuntirishingiz kerak. Siz...",
        options: [
          { id: 'a', text: "O'xshatish yoki hikoya o'ylab topaman — rasm yaxlit bo'lsin" },
          { id: 'b', text: "Mantiqiy qadamlarga bo'lib, xulosaga olib boraman" },
          { id: 'c', text: "Hayotdan aniq misol keltiraman" },
          { id: 'd', text: "Bu odamga aynan nima kerakligini his qilib, shuni aytaman" },
        ],
      },
      {
        id: 7,
        text: "Sizning eng ko'p uchraydigan xatoyingiz:",
        options: [
          { id: 'a', text: "Haddan tashqari keng niyat qilib, tafsilotlarni yo'qotaman" },
          { id: 'b', text: "Tahlilda qotib qolib, harakatni kechiktiraman" },
          { id: 'c', text: "\"Ishlaydigan\" narsaga yopishib, yangisini qo'ldan chiqaraman" },
          { id: 'd', text: "Boshqalarga tushuntirish qiyin bo'lgan hislarga tayanib qaror qilaman" },
        ],
      },
    ],
    results: [
      {
        id: 'visionary',
        title: "Siz — Vizionersiz",
        description: "Sizning ongingiz kelajakda yashaydi: hali yo'q narsani ko'rasiz va o'z dunyoqarashingiz bilan boshqalarni ilhomlantira olasiz. Buyuk g'oyalar aynan shunday fikrlaydigan odamlarda tug'iladi — me'morlar, asoschilar, strateglar. Siz uy qurmaysiz — xaritada hali yo'q shaharni barpo etasiz. Soyangiz: tafsilotlar va rutina sizni bo'g'adi, amalga oshirish ko'pincha o'z miqyosingizdan aziyat chekadi. O'sish nuqtangiz: ijrochi sherik toping — birgalikda imkonsiz narsaga qodir bo'lasiz.",
      },
      {
        id: 'analyst',
        title: "Siz — Tahlilchisiz",
        description: "\"Nega\" ekanini tushunmaguncha tinchlanmaysiz. Aql — sizning aniqlik qurolingiz: qonuniyatlarni ko'rasiz, ziddiyatlarni topasiz va qarorni kayfiyatga emas, ma'lumotga tayanib qabul qilasiz. Odamlar xolisligingizni qadrlaydi — bahsli vaziyatlarda aynan sizga ishonishadi. Soyangiz: tahlil falaji — ba'zan \"hozirgi yaxshi qaror\" \"ertangi mukammal qaror\"dan afzal. O'sish nuqtangiz: barcha javoblarni kutmay harakat qiling — ular jarayonda o'zi paydo bo'ladi.",
      },
      {
        id: 'practitioner',
        title: "Siz — Amaliyotchisiz",
        description: "Boshqalar muhokama qilayotganda — siz ish qilasiz. Tajribangiz va sog'lom fikringiz har qanday nazariyadan tezroq masalani hal qiladi, haqiqiy natija chiroyli so'zlardan muhimroq. Sizga murakkab ishlar ishonib topshiriladi — siz xafa qilmaysiz. Soyangiz: konservatizm — oldin ishlagan narsaga ko'nikib, yangisini qo'ldan chiqarishingiz mumkin. O'sish nuqtangiz: ba'zan o'zingizga tajriba qilishga ruxsat bering — tajribangiz uni boshqariladigan qiladi.",
      },
      {
        id: 'intuitive',
        title: "Siz — Sezgirsiz",
        description: "Sizning kuchingiz mantiqqa bo'ysunmaydigan, lekin deyarli har doim to'g'ri chiqadigan hislarda. Siz vaziyatni yaxlit his qilasiz — boshqalar alohida notalarni ajratayotganda, musiqachi butun orkestrni eshitgandek. Bunday uslubdagi odamlar ko'pincha ajoyib psixologlar, yetakchilar va rassomlar bo'lishadi. Soyangiz: qarorlaringizni boshqalarga tushuntirish qiyin — bu ta'siringizni pasaytiradi. O'sish nuqtangiz: hislarni so'zga aylantirishni o'rganing, shunda g'oyalaringiz nafaqat to'g'ri, balki eshitiladigan ham bo'ladi.",
      },
    ],
  },
  'toksichnaya-cherta': {
    title: "Sizning zaharli xususiyatingiz qaysi?",
    description: "Halol test — har kimda bor. O'zingizniki bilan tanishing va undan xalos bo'ling",
    category: "Psixologiya",
    questions: [
      {
        id: 1,
        text: "Sizni tanqid qilishganda qanday munosabat bildirasiz?",
        options: [
          { id: 'a', text: "Tashqaridan rozi bo'laman, ichimda alam qaynaydi" },
          { id: 'b', text: "Darhol tanqidchi nega noto'g'ri ekanini tushuntiraman" },
          { id: 'c', text: "Eng yomonini o'ylay boshlayman — men dahshatliman" },
          { id: 'd', text: "Jim turaman, lekin keyin odamdan uzoqlashaman" },
        ],
      },
      {
        id: 2,
        text: "O'zingizni yomon his qilganda nima qilasiz?",
        options: [
          { id: 'a', text: "Yomonligimga ishora qilaman, so'rashlarini kutaman" },
          { id: 'b', text: "Baland va ochiq gapiraman — ba'zan haddan tashqari" },
          { id: 'c', text: "Xavotirga sho'ng'ib, hamma narsani kuchaytiraman" },
          { id: 'd', text: "G'oyib bo'laman — javob bermayman, o'zimga yopilaman" },
        ],
      },
      {
        id: 3,
        text: "Kimdir sizni yarim yo'lda qoldirsa, nima qilasiz?",
        options: [
          { id: 'a', text: "\"Hammasi yaxshi\" deyman, lekin ichimda yaxshi emas" },
          { id: 'b', text: "Darhol xatoni ko'rsataman — ba'zan qattiq" },
          { id: 'c', text: "Odamlar doim men bilan shunday qilishadi, deb o'ylay boshlayman" },
          { id: 'd', text: "Unga tayanishni to'xtataman va uzoqlashaman" },
        ],
      },
      {
        id: 4,
        text: "Hasad qilganingizda o'zingizni qanday tutasiz?",
        options: [
          { id: 'a', text: "Jilmayib tabriklayman, lekin ichimda g'am" },
          { id: 'b', text: "Menda ham bor yoki tez orada bo'ladi, deyman" },
          { id: 'c', text: "Solishtira boshlayman va o'zimni past his qilaman" },
          { id: 'd', text: "O'sha odamdan qochaman — bu hissni his qilgim kelmaydi" },
        ],
      },
      {
        id: 5,
        text: "Mojaroda ko'pincha nima qilasiz?",
        options: [
          { id: 'a', text: "Bo'ysunaman, lekin keyin mayda narsalarda portlayman" },
          { id: 'b', text: "O'z pozitsiyamni g'alabagacha himoya qilaman" },
          { id: 'c', text: "Falokatlashtiraman — \"hammasi yomon, bu oxiri\"" },
          { id: 'd', text: "Javob berishni to'xtataman — sukut mening javobim" },
        ],
      },
      {
        id: 6,
        text: "Yordam so'rashni qanday uddalaysiz?",
        options: [
          { id: 'a', text: "Qiyinchilik bilan — ishora qilaman, kutaman, tushunmaganlaridan jahlim chiqadi" },
          { id: 'b', text: "Qiyinchilik bilan — kuchsiz ko'rinishdan qo'rqaman" },
          { id: 'c', text: "Qiyinchilik bilan — muammom juda katta tuyuladi" },
          { id: 'd', text: "Qiyinchilik bilan — o'zim hal qilgan osonroq" },
        ],
      },
      {
        id: 7,
        text: "Boshqalarda sizni eng ko'p nima jahlingizni chiqaradi?",
        options: [
          { id: 'a', text: "Menga nima kerakligini sezmasliklari" },
          { id: 'b', text: "Men haq ekanimni tan olmasliklari" },
          { id: 'c', text: "\"Xavotir olma\" deyishlari — bu yordam bermaydi" },
          { id: 'd', text: "Yolg'iz qolishim kerak bo'lganda yopishib olishlari" },
        ],
      },
      {
        id: 8,
        text: "Bu testni o'qiyotib nima deb o'ylayapsiz?",
        options: [
          { id: 'a', text: "\"Qiziq, do'stlarim bu haqda nima deyishar ekan\"" },
          { id: 'b', text: "\"Umid qilamanki, natija juda yomon bo'lmaydi\"" },
          { id: 'c', text: "\"Balki menda eng yomoni chiqar?\"" },
          { id: 'd', text: "\"Hmm. Ko'ramiz. Bilishni xohlaymanmi, ishonchim komil emas\"" },
        ],
      },
    ],
    results: [
      {
        id: 'passive',
        title: "Sizning zaharli xususiyatingiz — Passiv tajovuz",
        description: "Hech narsa yaxshi bo'lmaganda \"hammasi yaxshi\" deysiz — va boshqalar o'zi sezishini kutasiz. Bu xarakter zaifligi emas, balki himoya usuli: ehtiyojlarni to'g'ridan-to'g'ri aytish bir vaqtlar xavfli bo'lgani uchun shakllangan. Atrofdagilar keskinlikni his qiladi, qayerdan ekanini tushunmaydi va bu munosabatlarni ochiq mojarodan sekinroq, lekin ishonchliroq buzadi. Yaxshi xabar: ochiq gapira boshlaganingizda — avval qo'rqinchli, keyin ozod qiladi. Bir hafta jim yurish o'rniga bitta halol \"menga og'ir bo'ldi\" deb ko'ring.",
      },
      {
        id: 'defensive',
        title: "Sizning zaharli xususiyatingiz — Himoyalanish reaksiyasi",
        description: "Tanqidni hujum deb qabul qilasiz va darhol barrikada qurasiz — dalillar, qarshi ayblovlar yoki manbani qadrsizlantirish bilan. Buning ortida haq bo'lish va qabul qilinishga bo'lgan chuqur istak turadi — bu insoniy. Lekin muammo shundaki, himoya sizga haqiqatan yordam beradigan fikr-mulohazadan to'sib qo'yadi. Atrofdagilar halol gapirish o'rniga jim bo'la boshlaydi. Sinab ko'ring: keyingi safar e'tiroz bildirgingiz kelganda — to'xtab, \"sizni aynan nima xafa qildi?\" deb so'rang.",
      },
      {
        id: 'spiral',
        title: "Sizning zaharli xususiyatingiz — Falokatlashtirish",
        description: "Siz kichik muammoni global falokatga aylantirishni bilasiz — tez va ishonarli. Bitta omadsiz kun \"menda hech qachon hech narsa chiqmaydi\"ga aylanadi. Bu to'qima ham, zaiflik ham emas — avtopilotda eng yomon stsenariyni qidiradigan asab tizimining xususiyati. Muammo shundaki, haqiqiy xavf bo'lmaganda ham doimiy tarangligida yashaysiz. O'zingizdan so'rab ko'ring: \"Bir haftadan keyin haqiqatda nima bo'ladi?\" — ko'pincha javob tinchlantiradi.",
      },
      {
        id: 'withdraw',
        title: "Sizning zaharli xususiyatingiz — Hissiy chekinish",
        description: "Og'riganda g'oyib bo'lasiz — javob bermaysiz, uzoqlashasiz, o'zingizga yopilasiz. Bu xavfsiz tuyuladi: sizni xafa qilmasa — siz ham xafa qilmaysiz. Lekin yoningizdagilar uchun sukutingiz har qanday so'zdan balandroq jaranglaydi va deyarli doim rad etish sifatida qabul qilinadi. O'zingizni himoya qilasiz, lekin aloqalarni buzasiz. Yaxshi xabar: hammasini birdaniga aytishingiz shart emas. \"Menga hozir vaqt kerak, lekin g'oyib bo'lmayapman\" deyish kifoya. Bu hamma narsani o'zgartiradi.",
      },
    ],
  },
  'ty-v-konflikte': {
    title: "Mojaroda qandaysiz?",
    description: "Bahsdagi strategiyangiz siz haqingizda ko'p narsani aytadi — o'z uslubingizni bilib oling",
    category: "Psixologiya",
    questions: [
      {
        id: 1,
        text: "Mojaro endigina boshlandi. Birinchi lahzada nimani his qilasiz?",
        options: [
          { id: 'a', text: "Adrenalin — jangga tayyorman" },
          { id: 'b', text: "Xavotir — tezroq tugasa deyman" },
          { id: 'c', text: "Ravshanlik — vaziyatni tahlil qila boshlayman" },
          { id: 'd', text: "Charchoq — yana shu narsalar" },
        ],
      },
      {
        id: 2,
        text: "Bahsda odatda qanday g'olib chiqasiz?",
        options: [
          { id: 'a', text: "Raqib taslim bo'lguncha dalillar bilan bosaman" },
          { id: 'b', text: "Ikkala tomonga ham yoqadigan narsa topaman" },
          { id: 'c', text: "Faktlarni ko'rsataman — ular bilan bahslashib bo'lmaydi" },
          { id: 'd', text: "Ba'zan tugasin deb shunchaki rozi bo'laman" },
        ],
      },
      {
        id: 3,
        text: "Mojarodan qochadigan odamlar haqida nima deb o'ylaysiz?",
        options: [
          { id: 'a', text: "Hurmat qilaman, lekin o'zim qila olmayman — adolatsizlik ta'sir qiladi" },
          { id: 'b', text: "Tushunaman — mojaro hech kimga foyda bermaydi" },
          { id: 'c', text: "Aralashmagan ma'qul mojarolar bor, bu oqilona" },
          { id: 'd', text: "Bu men — va bunda yomon narsa ko'rmayman" },
        ],
      },
      {
        id: 4,
        text: "Mojarodan keyin nima bo'ladi?",
        options: [
          { id: 'a', text: "G'alaba qozonsam ham uzoq tinchlana olmayman" },
          { id: 'b', text: "Tinchlik bilan hal bo'lsa, yengil tortaman" },
          { id: 'c', text: "Nima deyilganini va nimani yaxshiroq qilsa bo'lganini tahlil qilaman" },
          { id: 'd', text: "Iloji boricha tezroq unutishga harakat qilaman" },
        ],
      },
      {
        id: 5,
        text: "Mojaroda siz uchun nima muhimroq?",
        options: [
          { id: 'a', text: "O'z haqligimni va pozitsiyamni himoya qilish" },
          { id: 'b', text: "Munosabatlarni saqlash va murosa topish" },
          { id: 'c', text: "Ob'ektiv haqiqatni topish" },
          { id: 'd', text: "Tezroq tugashi" },
        ],
      },
      {
        id: 6,
        text: "Kimdir ovozini ko'targanda qanday munosabat bildirasiz?",
        options: [
          { id: 'a', text: "O'zimniki ham ko'tariladi — bu refleks" },
          { id: 'b', text: "Keskinlikni kamaytirish uchun sekinroq gapirishga harakat qilaman" },
          { id: 'c', text: "Tinch gapirishni so'rayman — bunday muloqot qilib bo'lmaydi" },
          { id: 'd', text: "Jim bo'laman yoki ketaman" },
        ],
      },
      {
        id: 7,
        text: "Mojarodagi uslubingiz haqida nima deb o'ylaysiz?",
        options: [
          { id: 'a', text: "Men juda jizzakiman — bilaman, ustida ishlayapman" },
          { id: 'b', text: "Men juda yumshoqman — ba'zan bu menga qarshi ishlatiladi" },
          { id: 'c', text: "Men juda ratsionalman — odamlar bundan g'ashlanadi" },
          { id: 'd', text: "Men juda qochaman — muammolar to'planib boradi" },
        ],
      },
    ],
    results: [
      {
        id: 'fighter',
        title: "Sizning uslubingiz — Jangchi",
        description: "Siz mojarodan qochmaysiz — unga to'liq tayyorlik bilan kirasiz. Adolatsizlik, qadriyatlaringiz yoki yaqinlaringiz manfaatlarining buzilishi sizda himoya rejimini darhol yoqadi. Bu kuch — muhim narsani himoya qila olasiz. Soyangiz: shiddat bahslarni yutadi, lekin ba'zan munosabatlarni yutqazadi. Odamlar yoningizda ehtiyotkor bo'la boshlaydi. O'sish nuqtangiz: \"adolat uchun kurash\" bilan \"o'z egoing uchun kurash\"ni farqlashni o'rganing — birinchisiga arziydi, ikkinchisiga yo'q.",
      },
      {
        id: 'peacemaker',
        title: "Sizning uslubingiz — Sulhparvar",
        description: "Siz instinktiv ravishda hammaga to'g'ri keladigan yo'lni izlaysiz — bu qimmatli qobiliyat. Faqat borligingiz bilan keskinlikni pasaytirasiz va boshqalar faqat qarama-qarshilikni ko'radigan joyda murosa topa olasiz. Soyangiz: tinchlik istagida o'z manfaatlaringizni kerakdan ko'proq qurbon qilib, bir kun otilib chiqadigan alamni to'plashingiz mumkin. O'sish nuqtangiz: tinchlik faqat o'zingizga nima kerakligi haqida halol bo'lgandagina mumkin.",
      },
      {
        id: 'analyst',
        title: "Sizning uslubingiz — Tahlilchi",
        description: "Mojaroda his-tuyg'ulardan oldin aqlni yoqasiz. Faktlar, mantiq va adolatli yechim izlaysiz — bu sizni har qanday bahsning qadrli ishtirokchisiga aylantiradi. Vaziyatga chetdan qarashni bilasiz. Soyangiz: mojarodagi odamlar ko'pincha tahlil qilinishni emas, his qilinishni xohlaydi — sizning ratsionalligingiz sovuqlik kabi tuyulishi mumkin. O'sish nuqtangiz: yechim taklif qilishdan oldin ba'zan \"og'rinayotganingni tushunaman\" deyish kifoya.",
      },
      {
        id: 'avoider',
        title: "Sizning uslubingiz — Qochuvchi",
        description: "Siz instinktiv ravishda mojarodan chetga chiqasiz — va bunda yolg'iz emassiz. Mojaro munosabatlarga tahdid kabi tuyuladi, shuning uchun jim turib kutish osonroq. Muammo shundaki, muammolar yo'qolmaydi — ular to'planib, keyinroq kuchliroq portlaydi. Soyangiz: qochish qisqa muddatli tinchlik va uzoq muddatli masofa beradi. O'sish nuqtangiz: hozirgi halol kichik mojaro — yillarga munosabatlarga qo'yilgan sarmoya.",
      },
    ],
  },
};
