import {
  AchievementItem,
  BookItem,
  CalendarEvent,
  CinemaItem,
  DebtItem,
  ExpenseRecord,
  FocusPlaylist,
  FriendItem,
  HabitItem,
  HealthPlanItem,
  MusicTrack,
  QuranState,
  QuranSurah,
  ReminderItem,
  ShoppingItem,
  SleepSchedule,
  SubscriptionItem,
  TaskItem,
  UtilityBillItem,
  WeatherData,
} from '../types';

export const ASSETS = {
  appIcon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbrU19uPE3h4q3B8ZSBi7lXudQwXl1HgpPu5ZpWooQt4xqAQZqqZ2XgI-vVmrUn2wKivrvAGvhVtfmOyb2cOFYtqI-3ILRr5teDBS5ZRaEgVVbaoBMGS7sBrrmbKyf9-h_3aZuFTw452u_ZnqSfQqL1HqP4Xk98WYCwO-HQO-X2i6jM-2KTamvIZu3Qjv36yC9I3CfKrtj00My_lO76yicxyb4sg3zWE5fBwl5LqhW8o4vWmz7IvI',
  robotSphere: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCc7FMcbz-fBnsgtEsSHFjPjh44CI7kYaFa8B8xjDNDcR4LOGr4jZeo7iOS6YxZ5l9Q05GVy3ZzatOk6iVZy6aWm4uNpHVEH3DB_VQ-RISCv5ONwEjSndp8QKlpB9Wv6WCORRyRSUTEEMGIbEDgb4x-tWKd38cd_T-zjLGmmjzNik7dTBd1VNbaTzCmxywSLWbe68dKNgu76UFb_wCe7k1vCLp61Yp03uLEtwtjcuOCP3m4sLir_8A',
  vinylNowPlaying: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbPmJLPYe2sGsqUp75bKmCdZQ2e5-0FuUqcf-xh0nzdCgPS4C55RiXOVtehXncuX0s97fO8BQDcePvQkpbqoWpL_dMVSTdwgsLUVCiDJOyxQ2BxRWHw3-e6LPRbNyM8xlT7RaHe079xv-VtNE7yGlXpSqBKhEFcGTcycIueqYpcDTbvQno_u9zUWfqk8f7PRbEA2Vo_65iBinDsqJzxO4mlzsU5ZGzie9BiviNKFS7BOfvVN46i_I',
  trackSolaris: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDrvo5iVTWIq1WU0R4v63jNbZyAuUEyFS8Z__7a1ss8CGD2Mx5BgBQaxGa6z3S_e7zezWbBRB9Qann5WzKEoPVq6Fe-uTMj98hvrEAmwxGrVPSNertVoTnpF3p5zyjJ_9DQmFb2OV5ASQuMZstjPsVytDLxRgqn2v9akcFtdD6o0OG9Ux_KbitM0EY1teTOjo6FO1dRYccT4RCucmgnR1qPbeOvNAxRectPg8mIQztJE21hHoC2jo',
  trackNeon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATQetZDvky5s6BHUlndwqRrDskFgg0ymhTDa21mUzDxKIU_FiKPc2CAvOp4At3C5YlqzVou_q8m01ykEvxMIKVi-2Ia38VmcqZN9wo4-XNf_Y2hIOFk3oIiGJJZkVkp_wkMm1DMsDHD4-dwv8Xc8-hkwr3RsegGYrf0DNUXS4VX92U7H6Kc4PadzF0yjaPcbUT9SFgzlMr_jhkrWfDsIrh58nZ5ffc_nfap00gN45ZlBF6dILVvJ0',
  trackEchoes: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0swQkBsciQI9GFuzbIvrS0cJQdY-pjLsl4c_NG3l-Ymd3KiqQ7JHbRftcG_mPtdNGQa1Cn6g7FNHNIcHI-d2DRdnmC0Ip0PReG-T5QtfqDLwfsJJWKg26AZb_j3F3Y6WO9pmLA9kAV1WEoIGAxDQDZdHU0nlLuckEktgInmZTm2PyRqQ6APnH-tkJeptwEiBnOXNYsCRYadIm_PsweKjryj2Yn-xEI44YFP-r_Z6jRfOfZ-DTfKs',
  cinemaInterstellar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClVGWpqMIrFlT_FwCleJ4yQzWFmpa65TnHeyhNW4bL3F3ADx5WWP-xskusqisiztLvDE-VpOhLP91IyMCM2CSl-K5YDi4YjQ9-jPLGBOE9XY8HJZdc_Ue-uGvAOa26mbByfw1JaQv7rCca1fQcAx_sPF76HnmkOqB4F10I7hUiMcI3zuMdKJcRhUpLETXwmd813gjHsxDJGC9NNOwzvrEsr3ty7F2ES7VyIBUySEmxoqdWylVOVo4',
  cinemaCyberpunk: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHIYFluMB-NRCdTefWdKlL0yMF8WpFweLbUDMQamuKfLoqUinsRcwePwHud1Kofdwz4BfMHiWrqdixNtM4FIWgbSnld-M0HydofII9MaHY4GLv2Y5q5jBT54JtyKeI1pxee5HrdRbLQZBlvObUfwdVhsuJKGD8VXU1eZ50kiT1kzZOJgLehCVwHRdX_7gjU7vJ8ksYcIuHur_pSXSH_uUiqf7gD_wvWnh0rggdkh9q6qsfNDNFS3U',
  cinemaChronos: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBw6ALwwcyXBDWyHWJ-HGULZ26U4tnESk0hm2b5U-n_Spfq3CCj4bDa4p3ydVPVEWQuiONpFuoe_8wdnxxeO3CL5SmOncIpIQ2jU72h6qTcZBSIbKQYdH6HThHfvTbo6PQwXLUuIvDlGuqz7gkzYlsDCyO5ieMEprDvGlVtJ_q96cg5OuD2thfSXaF_XZ1ZNtIA-uMwcIWiGELgqxsERvXrshVRJVb9k6uResucln62osGhw0f7MiU',
  cinemaEcho: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWidOms2XlqoJjWieW45X0HKzybNBimyg8L9uqWqqiyE5d_oEMtKyI7B8O4XPtHICAcQMZAY3ukhVh4tFK-Qt1XKE8lWPFVVV39l92LPk0ki7m1byxtunH2FwRz8qUONQbW8K-cGm6147v6foKEDvzusrG9hYiKTIW6ZDXRV_SoDREnzz0NNgaRkJYFwPoP3FXKa35bhwiLrH_1AvvlLf-1KXuQOT6QX3J-O_-ayiMI9Z4KkgthRA',
  cinemaAtlas: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2UklqmXdsWWixt0FpABMsz1AbDEMCyYPgxT1ZjA_qvjmcVG6UcW6B4DttTBtndkqbvHBbz_jlIhTjlWwrvSqH0xEVRC7LFBiE4n2fPrNbbePA4vp4laNOC5rbJJ23w7hwY7OxPoesbyF0UP9j6fYBRGq5wYBpGzEsdQC-J3foxusjiQhO0yB416_8b_LPjPXx4P_aa_0T1IrIPP4gD6wmVb4TDBAklPyAWU2Jlqho0xteSJtx2-E',
  zenInsight: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFMUN3XNSyK1OJbgTSTz9In3Q28tmSWn5iYFhKaPPuuYKtL5WFCb-1OT1GNzZTRe_YNoEKsGtSxmbxO9ELdnGTK2TO1TLSf3yo5t078oQ8vj1vG_kEA9tUnT4u-JOP1dvpwze1kE_rVtHNXBfM_GaFZGjhJLsLMmb8FP93vBENxXw2mf70dcNDryR7KwUdID7OjMJrk4VUHKqK55QsuJP_uQ8qd3NPdI0x21byBUhJdxicieMkSBY',
  bookAtomic: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
  bookDeepWork: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80',
  bookThinking: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80',
  bookEssentialism: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=400&q=80',
};

export const INITIAL_TASKS: TaskItem[] = [];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [];

export const INITIAL_REMINDERS: ReminderItem[] = [];

export const INITIAL_SHOPPING_LIST: ShoppingItem[] = [];

export const INITIAL_DEBTS: DebtItem[] = [];

export const INITIAL_SUBSCRIPTIONS: SubscriptionItem[] = [];

export const INITIAL_UTILITIES: UtilityBillItem[] = [];

export const INITIAL_EXPENSES: ExpenseRecord[] = [];

export const INITIAL_HEALTH_PLAN: HealthPlanItem[] = [
  { id: 'hp-1', title: 'Стакан теплой воды с лимоном после сна', time: '07:30', completed: false, category: 'water', icon: 'water_drop' },
  { id: 'hp-2', title: 'Утренняя зарядка и разминка позвоночника (15 мин)', time: '07:45', completed: false, category: 'workout', icon: 'fitness_center' },
  { id: 'hp-3', title: 'Пешая прогулка на свежем воздухе (5000 шагов)', time: '13:30', completed: false, category: 'walk', icon: 'directions_walk' },
  { id: 'hp-4', title: 'Силовая тренировка / Кардио (45 мин)', time: '18:30', completed: false, category: 'workout', icon: 'sports_gymnastics' },
  { id: 'hp-5', title: 'Отказ от экранов за 45 мин до сна & растяжка', time: '22:45', completed: false, category: 'sleep', icon: 'bedtime' },
];

export const INITIAL_SLEEP_SCHEDULE: SleepSchedule = {
  targetBedtime: '23:15',
  targetWakeTime: '07:15',
  actualSleepHours: 7.8,
  sleepQualityPercent: 91,
  statusNote: 'Глубокая фаза 2ч 10м. Идеальное восстановление для ясного мышления.',
};

export const INITIAL_BOOKS: BookItem[] = [
  {
    id: 'bk-1',
    title: 'Атомные привычки',
    author: 'Джеймс Клир',
    coverUrl: ASSETS.bookAtomic,
    totalPages: 320,
    currentPage: 256,
    genre: 'Продуктивность',
    status: 'reading',
    rating: 4.9,
    favoriteQuote: 'Вы не поднимаетесь до уровня своих целей, вы опускаетесь до уровня своих систем.',
  },
  {
    id: 'bk-2',
    title: 'Глубокая работа (Deep Work)',
    author: 'Кэл Ньюпорт',
    coverUrl: ASSETS.bookDeepWork,
    totalPages: 280,
    currentPage: 140,
    genre: 'Фокус & Карьера',
    status: 'reading',
    rating: 4.8,
    favoriteQuote: 'Способность концентрироваться без отвлечений — суперсила XXI века.',
  },
  {
    id: 'bk-3',
    title: 'Думай медленно... решай быстро',
    author: 'Даниэль Канеман',
    coverUrl: ASSETS.bookThinking,
    totalPages: 650,
    currentPage: 650,
    genre: 'Психология',
    status: 'completed',
    rating: 5.0,
    favoriteQuote: 'Наш мозг быстро ищет закономерности даже там, где правит случайность.',
  },
  {
    id: 'bk-4',
    title: 'Эссенциализм: Путь к простоте',
    author: 'Грег МакКеон',
    coverUrl: ASSETS.bookEssentialism,
    totalPages: 240,
    currentPage: 0,
    genre: 'Философия жизни',
    status: 'planned',
    rating: 4.7,
    favoriteQuote: 'Если вы не расставите приоритеты в своей жизни, кто-то другой сделает это за вас.',
  },
];

export const QURAN_SURAHS: QuranSurah[] = [
  { number: 1, name: 'Аль-Фатиха (Открывающая)', englishName: 'Al-Fatihah', ayahCount: 7, revelationType: 'Мекканская' },
  { number: 18, name: 'Аль-Кахф (Пещера)', englishName: 'Al-Kahf', ayahCount: 110, revelationType: 'Мекканская', currentAyah: 46 },
  { number: 36, name: 'Йа Син (Сердце Корана)', englishName: 'Ya-Sin', ayahCount: 83, revelationType: 'Мекканская' },
  { number: 55, name: 'Ар-Рахман (Милостивый)', englishName: 'Ar-Rahman', ayahCount: 78, revelationType: 'Мединская' },
  { number: 67, name: 'Аль-Мульк (Власть)', englishName: 'Al-Mulk', ayahCount: 30, revelationType: 'Мекканская' },
  { number: 112, name: 'Аль-Ихлас (Искренность)', englishName: 'Al-Ikhlas', ayahCount: 4, revelationType: 'Мекканская' },
];

export const INITIAL_SURAHS = QURAN_SURAHS;

export const INITIAL_ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'ach-1',
    title: 'Мастер Фокуса',
    description: 'Завершить 20 важных задач без переноса сроков',
    icon: 'target',
    category: 'focus',
    progress: 0,
    maxProgress: 20,
    unlocked: false,
    badgeTier: 'gold',
  },
  {
    id: 'ach-2',
    title: 'Финансовый Дзен',
    description: 'Не превышать установленный лимит расходов за месяц',
    icon: 'account_balance_wallet',
    category: 'finance',
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    badgeTier: 'neon',
  },
  {
    id: 'ach-3',
    title: 'Хранитель Рассвета',
    description: 'Соблюдать режим сна и подъема в 07:15 7 дней подряд',
    icon: 'wb_sunny',
    category: 'health',
    progress: 0,
    maxProgress: 7,
    unlocked: false,
    badgeTier: 'silver',
  },
  {
    id: 'ach-4',
    title: 'Водный Баланс',
    description: 'Выпивать норму воды 2.5л в течение 10 дней',
    icon: 'water_drop',
    category: 'health',
    progress: 0,
    maxProgress: 10,
    unlocked: false,
    badgeTier: 'gold',
  },
  {
    id: 'ach-5',
    title: 'Книжный Эрудит',
    description: 'Прочесть 3 книги целиком и выделить лучшие цитаты',
    icon: 'menu_book',
    category: 'reading',
    progress: 0,
    maxProgress: 3,
    unlocked: false,
    badgeTier: 'silver',
  },
  {
    id: 'ach-6',
    title: 'Свет Откровения',
    description: 'Освоить чтение 5 сур Корана с разбором смыслов',
    icon: 'auto_stories',
    category: 'spirituality',
    progress: 0,
    maxProgress: 5,
    unlocked: false,
    badgeTier: 'neon',
  },
];

export const INITIAL_FRIENDS: FriendItem[] = [];

export const INITIAL_HABITS: HabitItem[] = [];

export const INITIAL_NOW_PLAYING: MusicTrack = {
  id: 'current-hero',
  title: 'Cybernetic Horizon',
  artist: 'Lorn & Max Richter',
  albumArt: ASSETS.vinylNowPlaying,
  duration: '04:18',
  qualityTag: 'Lossless',
  sampleRate: '96kHz',
};

export const FOCUS_PLAYLISTS: FocusPlaylist[] = [
  {
    id: 'fp-1',
    title: 'Глубокий фокус',
    subtitle: 'Альфа-волны (14Hz)',
    tracksCount: '28 треков',
    icon: 'psychology',
    color: '#a078ff',
  },
  {
    id: 'fp-2',
    title: 'Ночной кодинг',
    subtitle: 'Synthwave & Cyber',
    tracksCount: '42 трека',
    icon: 'terminal',
    color: '#4cd7f6',
  },
  {
    id: 'fp-3',
    title: 'Дзен и релакс',
    subtitle: 'Звуки космоса & Вода',
    tracksCount: '35 треков',
    icon: 'spa',
    color: '#4edea3',
  },
  {
    id: 'fp-4',
    title: 'Энергия дня',
    subtitle: 'Organic House & Beats',
    tracksCount: '19 треков',
    icon: 'bolt',
    color: '#d0bcff',
  },
];

export const ITUNES_TRACKS: MusicTrack[] = [
  {
    id: 'it-1',
    title: 'Solaris Genesis',
    artist: 'Carbon Based Lifeforms',
    albumArt: ASSETS.trackSolaris,
    duration: '05:24',
    qualityTag: 'Lossless',
  },
  {
    id: 'it-2',
    title: 'Neon Requiem',
    artist: 'Kavinsky & Daft Punk Edit',
    albumArt: ASSETS.trackNeon,
    duration: '04:02',
    qualityTag: 'Spatial',
  },
  {
    id: 'it-3',
    title: 'Echoes of Quiet Minds',
    artist: 'Brian Eno & Jon Hopkins',
    albumArt: ASSETS.trackEchoes,
    duration: '06:15',
    qualityTag: 'Hi-Res',
  },
];

export const HERO_MOVIE: CinemaItem = {
  id: 'cm-hero',
  title: 'Интерстеллар 2: Горизонт',
  genre: 'Научная фантастика, Триллер',
  duration: '2ч 48м',
  year: '2025',
  rating: '9.2',
  posterUrl: ASSETS.cinemaInterstellar,
  badge: '4K Ultra HD',
};

export const CONTINUE_WATCHING: CinemaItem = {
  id: 'cw-1',
  title: 'Киберпанк: Город Грезов',
  genre: 'Sci-Fi Драма',
  duration: '02:15:00',
  year: '2024',
  rating: '8.8',
  posterUrl: ASSETS.cinemaCyberpunk,
  episode: 'Сезон 1 • Серия 4',
  progress: 62,
  currentTime: '01:24:10',
  totalTime: '02:15:00',
};

export const WEEKLY_TRENDS: CinemaItem[] = [
  {
    id: 'wt-1',
    title: 'Одиссея Хроноса',
    genre: 'Sci-Fi',
    duration: '2ч 12м',
    year: '2024',
    rating: '8.9',
    posterUrl: ASSETS.cinemaChronos,
  },
  {
    id: 'wt-2',
    title: 'Эхо Сознания',
    genre: 'Триллер',
    duration: '1ч 54м',
    year: '2024',
    rating: '8.6',
    posterUrl: ASSETS.cinemaEcho,
  },
  {
    id: 'wt-3',
    title: 'Небесный Атлас',
    genre: 'Аниме',
    duration: '12 эп.',
    year: '2024',
    rating: '9.1',
    posterUrl: ASSETS.cinemaAtlas,
    episode: 'Сериал • 12 эп.',
  },
];

export const INITIAL_QURAN: QuranState = {
  surahNumber: 18,
  surahName: 'Аль-Кахф (Пещера)',
  ayah: 'Аят 46 • Мишари Рашид',
  reciter: 'Мишари Рашид',
  progressPercent: 40,
  currentTime: '02:14',
  totalTime: '05:42',
  isPlaying: false,
};

export const INITIAL_WEATHER: WeatherData = {
  city: 'Бишкек / Алматы',
  source: 'ОпенМетео AI',
  temperature: '+19°C',
  condition: 'Ясно, легкий горный бриз',
  humidity: '48%',
  aqi: '28 (Отлично)',
  windSpeed: '2.4 м/с',
  workoutAdvice: 'Идеальные условия для утренней пробежки и прогулки 5000 шагов.',
};
