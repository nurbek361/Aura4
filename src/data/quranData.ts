export interface SurahMeta {
  number: number;
  name: string;
  russianName: string;
  arabicName: string;
  ayahCount: number;
  revelationType: 'Мекканская' | 'Мединская';
}

export interface AyahItem {
  numberInSurah: number;
  arabic: string;
  russian: string;
  transliteration: string;
  cyrillicTranscription?: string;
}

export interface SurahDetail {
  number: number;
  name: string;
  russianName: string;
  arabicName: string;
  ayahCount: number;
  audioUrl: string;
  ayahs: AyahItem[];
}

export const ALL_SURAHS_LIST: SurahMeta[] = [
  { number: 1, name: 'Аль-Фатиха', russianName: 'Открывающая', arabicName: 'الفاتحة', ayahCount: 7, revelationType: 'Мекканская' },
  { number: 2, name: 'Аль-Бакара', russianName: 'Корова', arabicName: 'البقرة', ayahCount: 286, revelationType: 'Мединская' },
  { number: 3, name: 'Али Имран', russianName: 'Семейство Имрана', arabicName: 'آل عمران', ayahCount: 200, revelationType: 'Мединская' },
  { number: 4, name: 'Ан-Ниса', russianName: 'Женщины', arabicName: 'النساء', ayahCount: 176, revelationType: 'Мединская' },
  { number: 18, name: 'Аль-Кахф', russianName: 'Пещера', arabicName: 'الكهف', ayahCount: 110, revelationType: 'Мекканская' },
  { number: 36, name: 'Йа Син', russianName: 'Йа Син (Сердце Корана)', arabicName: 'يس', ayahCount: 83, revelationType: 'Мекканская' },
  { number: 55, name: 'Ар-Рахман', russianName: 'Милостивый', arabicName: 'الرحمن', ayahCount: 78, revelationType: 'Мединская' },
  { number: 56, name: 'Аль-Вакиа', russianName: 'Событие', arabicName: 'الواقعة', ayahCount: 96, revelationType: 'Мекканская' },
  { number: 67, name: 'Аль-Мульк', russianName: 'Власть', arabicName: 'الملك', ayahCount: 30, revelationType: 'Мекканская' },
  { number: 78, name: 'Ан-Наба', russianName: 'Весть', arabicName: 'النبأ', ayahCount: 40, revelationType: 'Мекканская' },
  { number: 93, name: 'Ад-Духа', russianName: 'Утро', arabicName: 'الضحى', ayahCount: 11, revelationType: 'Мекканская' },
  { number: 94, name: 'Аш-Шарх', russianName: 'Раскрытие', arabicName: 'الشرح', ayahCount: 8, revelationType: 'Мекканская' },
  { number: 95, name: 'Ат-Тин', russianName: 'Смоковница', arabicName: 'التين', ayahCount: 8, revelationType: 'Мекканская' },
  { number: 97, name: 'Аль-Кадр', russianName: 'Предопределение', arabicName: 'القدر', ayahCount: 5, revelationType: 'Мекканская' },
  { number: 103, name: 'Аль-Аср', russianName: 'Предвечернее время', arabicName: 'العصر', ayahCount: 3, revelationType: 'Мекканская' },
  { number: 108, name: 'Аль-Каусар', russianName: 'Изобилие', arabicName: 'الكوثر', ayahCount: 3, revelationType: 'Мекканская' },
  { number: 109, name: 'Аль-Кафирун', russianName: 'Неверующие', arabicName: 'الكافرون', ayahCount: 6, revelationType: 'Мекканская' },
  { number: 110, name: 'Ан-Наср', russianName: 'Помощь', arabicName: 'النصر', ayahCount: 3, revelationType: 'Мединская' },
  { number: 112, name: 'Аль-Ихлас', russianName: 'Искренность', arabicName: 'الإخلاص', ayahCount: 4, revelationType: 'Мекканская' },
  { number: 113, name: 'Аль-Фалак', russianName: 'Рассвет', arabicName: 'الفلق', ayahCount: 5, revelationType: 'Мекканская' },
  { number: 114, name: 'Ан-Нас', russianName: 'Люди', arabicName: 'الناس', ayahCount: 6, revelationType: 'Мекканская' },
];

export const FALLBACK_SURAHS: Record<number, SurahDetail> = {
  1: {
    number: 1,
    name: 'Аль-Фатиха',
    russianName: 'Открывающая Коран',
    arabicName: 'الفاتحة',
    ayahCount: 7,
    audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/1.mp3',
    ayahs: [
      {
        numberInSurah: 1,
        arabic: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
        transliteration: 'Bismi Allāhi ar-raḥmāni ar-raḥīmi',
        cyrillicTranscription: 'Бисмилляяхир-Рахмаанир-Рахиим',
        russian: 'Во имя Аллаха, Милостивого, Милосердного!',
      },
      {
        numberInSurah: 2,
        arabic: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ',
        transliteration: 'Al-ḥamdu lillāhi rabbi al-‘ālamīna',
        cyrillicTranscription: 'Аль-хамду лилляяхи Раббиль-‘алямиин',
        russian: 'Хвала Аллаху, Господу миров,',
      },
      {
        numberInSurah: 3,
        arabic: 'ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
        transliteration: 'Ar-raḥmāni ar-raḥīmi',
        cyrillicTranscription: 'Ар-Рахмаанир-Рахиим',
        russian: 'Милостивому, Милосердному,',
      },
      {
        numberInSurah: 4,
        arabic: 'مَٰلِكِ يَوْمِ ٱلدِّينِ',
        transliteration: 'Māliki yawmi ad-dīni',
        cyrillicTranscription: 'Маалики йаумид-диин',
        russian: 'Владыке Дня воздаяния!',
      },
      {
        numberInSurah: 5,
        arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        transliteration: 'Iyyāka na‘budu wa-iyyāka nasta‘īnu',
        cyrillicTranscription: 'Иййаака на‘буду ва иййаака наста‘иин',
        russian: 'Тебе одному мы поклоняемся и Тебя одного молим о помощи.',
      },
      {
        numberInSurah: 6,
        arabic: 'ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ',
        transliteration: 'Ihdinā aṣ-ṣirāṭa al-mustaqīma',
        cyrillicTranscription: 'Ихдинас-сырааталь-мустакыим',
        russian: 'Веди нас прямым путем,',
      },
      {
        numberInSurah: 7,
        arabic: 'صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ',
        transliteration: 'Ṣirāṭa allaḏīna an‘amta ‘alayhim ġayri al-maġḍūbi ‘alayhim walā aḍ-ḍāllīna',
        cyrillicTranscription: 'Сыраатол-лязиина ан‘амта ‘алейхим, гайриль-магдууби ‘алейхим ва ляд-дооооллиин',
        russian: 'путем тех, кого Ты облагодетельствовал, не тех, на кого пал гнев, и не заблудших.',
      },
    ],
  },
  112: {
    number: 112,
    name: 'Аль-Ихлас',
    russianName: 'Искренность',
    arabicName: 'الإخلاص',
    ayahCount: 4,
    audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/112.mp3',
    ayahs: [
      {
        numberInSurah: 1,
        arabic: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ',
        transliteration: 'Qul huwa Allāhu aḥadun',
        cyrillicTranscription: 'Куль хува-ллааху ахад',
        russian: 'Скажи: «Он — Аллах Единый,',
      },
      {
        numberInSurah: 2,
        arabic: 'ٱللَّهُ ٱلصَّمَدُ',
        transliteration: 'Allāhu aṣ-ṣamadu',
        cyrillicTranscription: 'Аллаахус-самад',
        russian: 'Аллах Самодостаточный.',
      },
      {
        numberInSurah: 3,
        arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
        transliteration: 'Lam yalid walam yūlad',
        cyrillicTranscription: 'Лям йалид ва лям йууляд',
        russian: 'Он не родил и не был рожден,',
      },
      {
        numberInSurah: 4,
        arabic: 'وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ',
        transliteration: 'Walam yakun lahu kufuwan aḥadun',
        cyrillicTranscription: 'Ва лям йакуль-ляху куфуван ахад',
        russian: 'и нет никого, равного Ему».',
      },
    ],
  },
  113: {
    number: 113,
    name: 'Аль-Фалак',
    russianName: 'Рассвет',
    arabicName: 'الفلق',
    ayahCount: 5,
    audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/113.mp3',
    ayahs: [
      {
        numberInSurah: 1,
        arabic: 'قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ',
        transliteration: 'Qul a‘ūḏu birabbi al-falaqi',
        cyrillicTranscription: 'Куль а‘уузу бираббиль-фаляк',
        russian: 'Скажи: «Ищу убежища у Господа рассвета',
      },
      {
        numberInSurah: 2,
        arabic: 'مِن شَرِّ مَا خَلَقَ',
        transliteration: 'Min šarri mā ḫalaqa',
        cyrillicTranscription: 'Мин шарри маа халяк',
        russian: 'от зла того, что Он сотворил,',
      },
      {
        numberInSurah: 3,
        arabic: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
        transliteration: 'Wamin šarri ġāsiqin iḏā waqaba',
        cyrillicTranscription: 'Ва мин шарри гаасикин изаа вакаб',
        russian: 'от зла мрака, когда он наступает,',
      },
      {
        numberInSurah: 4,
        arabic: 'وَمِن شَرِّ ٱلنَّفَّٰثَٰتِ فِي ٱلْعُقَدِ',
        transliteration: 'Wamin šarri an-naffāṯāti fī al-‘uqadi',
        cyrillicTranscription: 'Ва мин шаррин-наффаасаати филь-‘укад',
        russian: 'от зла колдуний, дующих на узлы,',
      },
      {
        numberInSurah: 5,
        arabic: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
        transliteration: 'Wamin šarri ḥāsidin iḏā ḥasada',
        cyrillicTranscription: 'Ва мин шарри хаасидин изаа хасад',
        russian: 'от зла завистника, когда он завидует».',
      },
    ],
  },
  114: {
    number: 114,
    name: 'Ан-Нас',
    russianName: 'Люди',
    arabicName: 'الناس',
    ayahCount: 6,
    audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/114.mp3',
    ayahs: [
      {
        numberInSurah: 1,
        arabic: 'قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ',
        transliteration: 'Qul a‘ūḏu birabbi an-nāsi',
        cyrillicTranscription: 'Куль а‘уузу бираббин-наас',
        russian: 'Скажи: «Ищу убежища у Господа людей,',
      },
      {
        numberInSurah: 2,
        arabic: 'مَلِكِ ٱلنَّاسِ',
        transliteration: 'Maliki an-nāsi',
        cyrillicTranscription: 'Маликин-наас',
        russian: 'Царя людей,',
      },
      {
        numberInSurah: 3,
        arabic: 'إِلَٰهِ ٱلنَّاسِ',
        transliteration: 'Ilāhi an-nāsi',
        cyrillicTranscription: 'Иляяхин-наас',
        russian: 'Бога людей,',
      },
      {
        numberInSurah: 4,
        arabic: 'مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ',
        transliteration: 'Min šarri al-waswāsi al-ḫannāsi',
        cyrillicTranscription: 'Мин шарриль-васваасиль-ханнаас',
        russian: 'от зла искусителя, исчезающего при поминании Аллаха,',
      },
      {
        numberInSurah: 5,
        arabic: 'ٱلَّذِي يُوَسْوِسُ فِي صُدُورِ ٱلنَّاسِ',
        transliteration: 'Allaḏī yuwaswisu fī ṣudūri an-nāsi',
        cyrillicTranscription: 'Аллязии йувасвису фии судуурин-наас',
        russian: 'который внушает зло в сердца людей,',
      },
      {
        numberInSurah: 6,
        arabic: 'مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ',
        transliteration: 'Mina al-jinnati wa-an-nāsi',
        cyrillicTranscription: 'Миналь-джиннати ван-наас',
        russian: 'из джиннов и людей».',
      },
    ],
  },
  103: {
    number: 103,
    name: 'Аль-Аср',
    russianName: 'Предвечернее время',
    arabicName: 'العصر',
    ayahCount: 3,
    audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/103.mp3',
    ayahs: [
      {
        numberInSurah: 1,
        arabic: 'وَٱلْعَصْرِ',
        transliteration: 'Wal-‘aṣri',
        cyrillicTranscription: 'Валь-‘аср',
        russian: 'Клянусь предвечерним временем!',
      },
      {
        numberInSurah: 2,
        arabic: 'إِنَّ ٱلْإِنسَٰنَ لَفِي خُسْرٍ',
        transliteration: 'Inna al-’insāna lafī ḫusrin',
        cyrillicTranscription: 'Инналь-инсаана ляфии хуср',
        russian: 'Воистину, каждый человек в убытке,',
      },
      {
        numberInSurah: 3,
        arabic: 'إِلَّا ٱلَّذِينَ ءَامَنُوا۟ وَعَمِلُوا۟ ٱلصَّٰلِحَٰتِ وَتَوَاصَوْا۟ بِٱلْحَقِّ وَتَوَاصَوْا۟ بِٱلصَّبْرِ',
        transliteration: '’Illā allaḏīna ’āmanū wa‘amilū aṣ-ṣāliḥāti watawāṣaw bil-ḥaqqi watawāṣaw biṣ-ṣabri',
        cyrillicTranscription: 'Илляль-лязиина аамануу ва ‘амилюс-соолихаати ва таваасав биль-хаккы ва таваасав бис-сабр',
        russian: 'кроме тех, которые уверовали, совершали праведные деяния, заповедовали друг другу истину и заповедовали друг другу терпение!',
      },
    ],
  },
  108: {
    number: 108,
    name: 'Аль-Каусар',
    russianName: 'Изобилие',
    arabicName: 'الكوثر',
    ayahCount: 3,
    audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/108.mp3',
    ayahs: [
      {
        numberInSurah: 1,
        arabic: 'إِنَّآ أَعْطَيْنَٰكَ ٱلْكَوْثَرَ',
        transliteration: '’Innā ’a‘ṭaynāka al-kawṯara',
        cyrillicTranscription: 'Иннааа а‘тайнаакаль-кавсар',
        russian: 'Мы даровали тебе Изобилие (реку в Раю),',
      },
      {
        numberInSurah: 2,
        arabic: 'فَصَلِّ لِرَبِّكَ وَٱنْحَرْ',
        transliteration: 'Faṣalli lirabbika wanḥar',
        cyrillicTranscription: 'Фасалли лираббика ванхар',
        russian: 'посему совершай намаз ради твоего Господа и закалывай жертву.',
      },
      {
        numberInSurah: 3,
        arabic: 'إِنَّ شَانِئَكَ هُوَ ٱلْأَبْتَرُ',
        transliteration: '’Inna šāni’aka huwa al-’abtaru',
        cyrillicTranscription: 'Инна шаани-ака хуваль-абтар',
        russian: 'Воистину, твой ненавистник сам окажется бездетным.',
      },
    ],
  },
};

export async function fetchSurahData(surahNumber: number): Promise<SurahDetail> {
  // Check local fallback first
  if (FALLBACK_SURAHS[surahNumber]) {
    return FALLBACK_SURAHS[surahNumber];
  }

  // Try local server proxy
  try {
    const res = await fetch(`/api/quran/surah/${surahNumber}`);
    if (res.ok) {
      const data = await res.json();
      return {
        number: data.number,
        name: ALL_SURAHS_LIST.find((s) => s.number === surahNumber)?.name || data.name,
        russianName: ALL_SURAHS_LIST.find((s) => s.number === surahNumber)?.russianName || data.englishNameTranslation,
        arabicName: data.name,
        ayahCount: data.numberOfAyahs,
        audioUrl: data.audioUrl || `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahNumber}.mp3`,
        ayahs: data.ayahs,
      };
    }
  } catch (e) {
    console.warn('Server proxy failed, trying direct API...', e);
  }

  // Fallback: Direct call to alquran.cloud
  const directRes = await fetch(
    `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,ru.kuliev,en.transliteration`
  );
  if (!directRes.ok) {
    throw new Error('Не удалось загрузить суру');
  }

  const json = await directRes.json();
  const ar = json.data[0];
  const ru = json.data[1];
  const tr = json.data[2];

  const ayahs: AyahItem[] = ar.ayahs.map((ayah: any, i: number) => ({
    numberInSurah: ayah.numberInSurah,
    arabic: ayah.text,
    russian: ru.ayahs[i]?.text || '',
    transliteration: tr.ayahs[i]?.text || '',
  }));

  return {
    number: ar.number,
    name: ALL_SURAHS_LIST.find((s) => s.number === surahNumber)?.name || ar.englishName,
    russianName: ALL_SURAHS_LIST.find((s) => s.number === surahNumber)?.russianName || ar.englishNameTranslation,
    arabicName: ar.name,
    ayahCount: ar.numberOfAyahs,
    audioUrl: `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahNumber}.mp3`,
    ayahs,
  };
}
