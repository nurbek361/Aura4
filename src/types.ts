export type NavigationTab =
  | 'home'
  | 'calendar'
  | 'reminders'
  | 'finance'
  | 'health'
  | 'library'
  | 'music'
  | 'cinema'
  | 'spirituality'
  | 'achievements'
  | 'friends'
  | 'hub'
  | 'reports'
  | 'shorts'
  | 'news'
  | 'settings';

export type CurrencyType = 'KGS' | 'USD' | 'KZT' | 'RUB';

/**
 * Structured action the AI assistant can dispatch to actually control the
 * app (navigate, search & play media, etc.), as opposed to just replying
 * with text.
 */
export type AuraAction =
  | { type: 'open_screen'; screen: NavigationTab }
  | { type: 'play_music'; query: string }
  | { type: 'search_movie'; query: string };

export interface TaskItem {
  id: string;
  title: string;
  tag: string;
  tagType: 'critical' | 'release' | 'sync' | 'default';
  dueTime: string;
  completed: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  type: 'birthday' | 'deadline' | 'meeting' | 'holiday' | 'personal';
  isCountdown: boolean;
  color: string;
  notes?: string;
}

export interface ReminderItem {
  id: string;
  title: string;
  time: string; // e.g. "15:00"
  date: string; // e.g. "Сегодня" or YYYY-MM-DD
  category: 'health' | 'work' | 'finance' | 'personal';
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface ShoppingItem {
  id: string;
  name: string;
  price: number;
  completed: boolean;
  category: string;
}

export interface DebtItem {
  id: string;
  person: string;
  amount: number;
  type: 'owed_to_me' | 'i_owe'; // Кто мне должен / Кому я должен
  dueDate: string;
  note?: string;
  settled: boolean;
}

export interface SubscriptionItem {
  id: string;
  name: string;
  cost: number;
  billingDay: number;
  icon: string;
  active: boolean;
}

export interface UtilityBillItem {
  id: string;
  title: string;
  amount: number;
  period: string;
  isPaid: boolean;
  dueDate: string;
}

export interface ExpenseRecord {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}

export interface FinanceState {
  currency: CurrencyType;
  income: number;
  monthlyLimit: number;
  expenses: ExpenseRecord[];
  shoppingList: ShoppingItem[];
  debts: DebtItem[];
  subscriptions: SubscriptionItem[];
  utilityBills: UtilityBillItem[];
}

export interface HealthPlanItem {
  id: string;
  title: string;
  time: string;
  completed: boolean;
  category: 'water' | 'workout' | 'walk' | 'sleep' | 'nutrition';
  icon: string;
}

export interface SleepSchedule {
  targetBedtime: string;
  targetWakeTime: string;
  actualSleepHours: number;
  sleepQualityPercent: number;
  statusNote: string;
}

export interface HabitItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  current: number;
  max: number;
  unit: string;
  percentage: number;
  color: string;
}

export interface BookItem {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  totalPages: number;
  currentPage: number;
  genre: string;
  status: 'reading' | 'planned' | 'completed';
  rating: number;
  favoriteQuote?: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  audioPreviewUrl?: string;
  youtubeId?: string;
  duration: string;
  qualityTag: 'Lossless' | 'Spatial' | 'Hi-Res' | '24-bit';
  sampleRate?: string;
}

export interface FocusPlaylist {
  id: string;
  title: string;
  subtitle: string;
  tracksCount: string;
  icon: string;
  color: string;
  youtubeId?: string;
}

export interface CinemaItem {
  id: string;
  title: string;
  genre: string;
  duration: string;
  year: string;
  rating: string;
  posterUrl: string;
  backdropUrl?: string;
  badge?: string;
  type?: 'movie' | 'series';
  youtubeId?: string;
  isFullMovie?: boolean;
  durationMinutes?: number;
  progress?: number;
  episode?: string;
  currentTime?: string;
  totalTime?: string;
}

export interface QuranSurah {
  number: number;
  name: string;
  englishName: string;
  ayahCount: number;
  revelationType: 'Мекканская' | 'Мединская';
  currentAyah?: number;
}

export interface QuranState {
  surahNumber: number;
  surahName: string;
  ayah: string;
  reciter: string;
  progressPercent: number;
  currentTime: string;
  totalTime: string;
  isPlaying: boolean;
}

export interface WeatherData {
  city: string;
  source: string;
  temperature: string;
  condition: string;
  humidity: string;
  aqi: string;
  windSpeed: string;
  workoutAdvice: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'focus' | 'finance' | 'health' | 'reading' | 'spirituality';
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedDate?: string;
  badgeTier: 'bronze' | 'silver' | 'gold' | 'neon';
}

export interface FriendItem {
  id: string;
  name: string;
  username?: string;
  avatarUrl: string;
  auraStatus: string;
  level: number;
  unlockedAchievements: number;
  totalAchievements: number;
  streakDays: number;
  recentAchievement: string;
  isOnline: boolean;
  achievements: {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
    date?: string;
  }[];
}
