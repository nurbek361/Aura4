import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Share } from 'react-native';

export type Currency = 'KGS' | 'USD' | 'RUB' | 'EUR' | 'KZT' | 'UZS' | 'TJS';
export type TransactionKind = 'income' | 'expense';

export interface Task {
  id: string;
  title: string;
  done: boolean;
  createdAt: string;
}

export interface Transaction {
  id: string;
  amountMinor: number;
  currency: Currency;
  kind: TransactionKind;
  category: string;
  description: string;
  date: string;
  createdAt: string;
}

export interface Habit {
  id: string;
  title: string;
  completedToday: boolean;
  streak: number;
}

export interface Goal {
  id: string;
  title: string;
  progress: number;
  deadline: string;
  done: boolean;
  createdAt: string;
}

export interface Profile {
  name: string;
}

export type ReminderType = 'personal' | 'payment' | 'task' | 'birthday' | 'event' | 'health' | 'inactivity';
export interface Reminder {
  id: string;
  title: string;
  type: ReminderType;
  date: string;
  done: boolean;
  createdAt: string;
}

export type EventType = 'event' | 'meeting' | 'birthday' | 'payment' | 'goalDeadline';
export interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  date: string;
  note: string;
}

export interface Birthday {
  id: string;
  name: string;
  date: string; // ISO date; year is used only for display context
}

export interface Countdown {
  id: string;
  title: string;
  targetDate: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  bought: boolean;
}
export interface ShoppingList {
  id: string;
  title: string;
  items: ShoppingItem[];
  createdAt: string;
}

export type DebtDirection = 'owedToMe' | 'iOwe';
export interface Debt {
  id: string;
  direction: DebtDirection;
  person: string;
  amountMinor: number;
  currency: Currency;
  date: string;
  description: string;
  settled: boolean;
}

export type SubscriptionPeriod = 'weekly' | 'monthly' | 'yearly';
export interface Subscription {
  id: string;
  name: string;
  costMinor: number;
  currency: Currency;
  period: SubscriptionPeriod;
  nextPaymentDate: string;
}

export type PaymentCategory = 'electricity' | 'water' | 'gas' | 'internet' | 'other' | 'general';
export interface Payment {
  id: string;
  title: string;
  amountMinor: number;
  currency: Currency;
  dueDate: string;
  category: PaymentCategory;
  paid: boolean;
  paidAt?: string;
}

export interface MediaFavorite { id: string; kind: 'music' | 'movie'; title: string; subtitle: string; image?: string; url?: string; externalId?: string; }
export interface MediaHistoryItem extends MediaFavorite { playedAt: string; progress?: number; }

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
}

interface LifeState {
  tasks: Task[];
  transactions: Transaction[];
  habits: Habit[];
  goals: Goal[];
  learnedSurahs: number[];
  profile: Profile;
  primaryCurrency: Currency;
  reminders: Reminder[];
  events: CalendarEvent[];
  birthdays: Birthday[];
  countdowns: Countdown[];
  shoppingLists: ShoppingList[];
  debts: Debt[];
  subscriptions: Subscription[];
  payments: Payment[];
  unlockedAchievements: Record<string, string>;
  hydrated: boolean;
  lastBackupAt?: string;
  mediaFavorites: MediaFavorite[];
  mediaHistory: MediaHistoryItem[];
}

interface LifeContextValue extends LifeState {
  addTask: (title: string) => void;
  toggleTask: (id: string) => void;
  addTransaction: (input: { amount: string; kind: TransactionKind; category: string; description: string }) => boolean;
  toggleHabit: (id: string) => void;
  toggleSurah: (number: number) => void;
  setProfileName: (name: string) => void;
  setPrimaryCurrency: (currency: Currency) => void;
  createBackup: () => Promise<string>;
  restoreBackup: (raw: string) => Promise<boolean>;
  searchAll: (query: string) => Array<{ type: string; title: string; detail: string }>;

  addGoal: (input: { title: string; deadline: string }) => void;
  updateGoalProgress: (id: string, progress: number) => void;
  removeGoal: (id: string) => void;

  addReminder: (input: { title: string; type: ReminderType; date: string }) => void;
  toggleReminder: (id: string) => void;
  removeReminder: (id: string) => void;

  addEvent: (input: { title: string; type: EventType; date: string; note?: string }) => void;
  removeEvent: (id: string) => void;

  addBirthday: (input: { name: string; date: string }) => void;
  removeBirthday: (id: string) => void;

  addCountdown: (input: { title: string; targetDate: string }) => void;
  removeCountdown: (id: string) => void;

  addShoppingList: (title: string) => void;
  removeShoppingList: (id: string) => void;
  addShoppingItem: (listId: string, name: string) => void;
  toggleShoppingItem: (listId: string, itemId: string) => void;
  removeShoppingItem: (listId: string, itemId: string) => void;

  addDebt: (input: { direction: DebtDirection; person: string; amount: string; description: string }) => boolean;
  toggleDebtSettled: (id: string) => void;
  removeDebt: (id: string) => void;

  addSubscription: (input: { name: string; cost: string; period: SubscriptionPeriod; nextPaymentDate: string }) => boolean;
  removeSubscription: (id: string) => void;

  addPayment: (input: { title: string; amount: string; category: PaymentCategory; dueDate: string }) => boolean;
  togglePaymentPaid: (id: string) => void;
  removePayment: (id: string) => void;

  achievements: AchievementDef[];
  unlockedAchievementList: (AchievementDef & { unlockedAt: string })[];
  shareText: (message: string) => Promise<void>;
  toggleMediaFavorite: (item: MediaFavorite) => void;
  addMediaHistory: (item: MediaHistoryItem) => void;
  isMediaFavorite: (kind: 'music' | 'movie', id: string) => boolean;
}

const STORAGE_KEY = '@personal-life-platform/state-v2';
const id = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const initialState: LifeState = {
  tasks: [
    { id: 'welcome-task', title: 'Собрать план на сегодня', done: false, createdAt: new Date().toISOString() },
    { id: 'water-task', title: 'Выпить воду и сделать паузу', done: false, createdAt: new Date().toISOString() },
  ],
  transactions: [
    { id: 'sample-income', amountMinor: 850000, currency: 'KGS', kind: 'income', category: 'Доход', description: 'Основной доход', date: new Date().toISOString(), createdAt: new Date().toISOString() },
    { id: 'sample-expense', amountMinor: 18500, currency: 'KGS', kind: 'expense', category: 'Еда', description: 'Продукты', date: new Date().toISOString(), createdAt: new Date().toISOString() },
  ],
  habits: [
    { id: 'habit-walk', title: 'Прогулка 20 минут', completedToday: true, streak: 4 },
    { id: 'habit-read', title: 'Читать 15 минут', completedToday: false, streak: 2 },
    { id: 'habit-water', title: '6 стаканов воды', completedToday: false, streak: 6 },
  ],
  goals: [
    { id: 'goal-health', title: 'Вернуть энергию', progress: 0.62, deadline: '30 сентября', done: false, createdAt: new Date().toISOString() },
    { id: 'goal-learning', title: 'Изучить 10 сур', progress: 0.3, deadline: '15 октября', done: false, createdAt: new Date().toISOString() },
  ],
  learnedSurahs: [1, 112, 113, 114],
  profile: { name: 'Друг' },
  primaryCurrency: 'KGS',
  reminders: [],
  events: [],
  birthdays: [],
  countdowns: [],
  shoppingLists: [
    { id: 'list-default', title: 'Продукты', items: [], createdAt: new Date().toISOString() },
  ],
  debts: [],
  subscriptions: [],
  payments: [],
  unlockedAchievements: {},
  mediaFavorites: [],
  mediaHistory: [],
  hydrated: false,
};

const ACHIEVEMENT_DEFS: (AchievementDef & { check: (s: LifeState) => boolean })[] = [
  { id: 'tasks-10', title: 'Собранный ум', description: '10 выполненных задач', check: (s) => s.tasks.filter((t) => t.done).length >= 10 },
  { id: 'tasks-50', title: 'Мастер списков', description: '50 выполненных задач', check: (s) => s.tasks.filter((t) => t.done).length >= 50 },
  { id: 'habit-week', title: 'Неделя ритма', description: 'Привычка со стриком 7+ дней', check: (s) => s.habits.some((h) => h.streak >= 7) },
  { id: 'habit-month', title: 'Месяц дисциплины', description: 'Привычка со стриком 30+ дней', check: (s) => s.habits.some((h) => h.streak >= 30) },
  { id: 'savings-1000', title: 'Первая подушка', description: 'Накоплено от 1000 в основной валюте', check: (s) => s.transactions.reduce((sum, t) => sum + (t.kind === 'income' ? t.amountMinor : -t.amountMinor), 0) / 100 >= 1000 },
  { id: 'savings-10000', title: 'Крепкий запас', description: 'Накоплено от 10 000 в основной валюте', check: (s) => s.transactions.reduce((sum, t) => sum + (t.kind === 'income' ? t.amountMinor : -t.amountMinor), 0) / 100 >= 10000 },
  { id: 'surah-10', title: 'Первые шаги', description: '10 изученных сур', check: (s) => s.learnedSurahs.length >= 10 },
  { id: 'surah-50', title: 'На полпути', description: '50 изученных сур', check: (s) => s.learnedSurahs.length >= 50 },
  { id: 'surah-114', title: 'Весь Коран', description: 'Все 114 сур отмечены как изученные', check: (s) => s.learnedSurahs.length >= 114 },
  { id: 'goal-first-progress', title: 'В движении', description: 'Первое обновление прогресса цели', check: (s) => s.goals.some((g) => g.progress > 0) },
  { id: 'goal-done', title: 'Цель достигнута', description: 'Первая полностью завершённая цель', check: (s) => s.goals.some((g) => g.done) },
];

const LifeContext = createContext<LifeContextValue | null>(null);

export function LifeProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<LifeState>(initialState);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (!raw) {
        setState((current) => ({ ...current, hydrated: true }));
        return;
      }
      try {
        const parsed = JSON.parse(raw) as Partial<LifeState>;
        setState({ ...initialState, ...parsed, hydrated: true });
      } catch {
        setState((current) => ({ ...current, hydrated: true }));
      }
    });
  }, []);

  useEffect(() => {
    if (state.hydrated) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => undefined);
    }
  }, [state]);

  // Evaluate achievements whenever the tracked data changes. Each achievement
  // is unlocked at most once (guarded by unlockedAchievements) so re-running
  // this check never reprocesses the same event twice.
  useEffect(() => {
    if (!state.hydrated) return;
    const additions: Record<string, string> = {};
    for (const def of ACHIEVEMENT_DEFS) {
      if (!state.unlockedAchievements[def.id] && def.check(state)) {
        additions[def.id] = new Date().toISOString();
      }
    }
    if (Object.keys(additions).length > 0) {
      setState((current) => ({ ...current, unlockedAchievements: { ...current.unlockedAchievements, ...additions } }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.hydrated, state.tasks, state.habits, state.transactions, state.learnedSurahs, state.goals]);

  const value = useMemo<LifeContextValue>(() => ({
    ...state,
    addTask: (title) => {
      const clean = title.trim();
      if (!clean) return;
      setState((current) => ({ ...current, tasks: [{ id: id(), title: clean, done: false, createdAt: new Date().toISOString() }, ...current.tasks] }));
    },
    toggleTask: (taskId) => setState((current) => ({ ...current, tasks: current.tasks.map((task) => task.id === taskId ? { ...task, done: !task.done } : task) })),
    addTransaction: ({ amount, kind, category, description }) => {
      const numeric = Number(amount.replace(',', '.'));
      if (!Number.isFinite(numeric) || numeric <= 0) return false;
      setState((current) => ({ ...current, transactions: [{
        id: id(),
        amountMinor: Math.round(numeric * 100),
        currency: current.primaryCurrency,
        kind,
        category: category.trim() || 'Другое',
        description: description.trim() || (kind === 'expense' ? 'Расход' : 'Доход'),
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      }, ...current.transactions] }));
      return true;
    },
    toggleHabit: (habitId) => setState((current) => ({ ...current, habits: current.habits.map((habit) => habit.id === habitId ? { ...habit, completedToday: !habit.completedToday, streak: habit.completedToday ? Math.max(0, habit.streak - 1) : habit.streak + 1 } : habit) })),
    toggleSurah: (number) => setState((current) => ({ ...current, learnedSurahs: current.learnedSurahs.includes(number) ? current.learnedSurahs.filter((item) => item !== number) : [...current.learnedSurahs, number].sort((a, b) => a - b) })),
    setProfileName: (name) => setState((current) => ({ ...current, profile: { name: name.trim() || 'Друг' } })),
    setPrimaryCurrency: (currency) => setState((current) => ({ ...current, primaryCurrency: currency })),
    createBackup: async () => {
      const raw = JSON.stringify({ schemaVersion: 1, formatVersion: 1, appData: { ...state, hydrated: undefined } });
      const lastBackupAt = new Date().toISOString();
      setState((current) => ({ ...current, lastBackupAt }));
      return raw;
    },
    restoreBackup: async (raw) => {
      try {
        const parsed = JSON.parse(raw) as { schemaVersion?: number; formatVersion?: number; appData?: Partial<LifeState> };
        if (parsed.schemaVersion !== 1 || parsed.formatVersion !== 1 || !parsed.appData) return false;
        setState({ ...initialState, ...parsed.appData, hydrated: true });
        return true;
      } catch {
        return false;
      }
    },
    searchAll: (query) => {
      const needle = query.trim().toLowerCase();
      if (!needle) return [];
      return [
        ...state.tasks.filter((item) => item.title.toLowerCase().includes(needle)).map((item) => ({ type: 'Задача', title: item.title, detail: item.done ? 'Выполнено' : 'Сегодня' })),
        ...state.transactions.filter((item) => `${item.description} ${item.category}`.toLowerCase().includes(needle)).map((item) => ({ type: item.kind === 'expense' ? 'Расход' : 'Доход', title: item.description, detail: `${(item.amountMinor / 100).toFixed(2)} ${item.currency}` })),
        ...state.goals.filter((item) => item.title.toLowerCase().includes(needle)).map((item) => ({ type: 'Цель', title: item.title, detail: `${Math.round(item.progress * 100)}%` })),
        ...state.reminders.filter((item) => item.title.toLowerCase().includes(needle)).map((item) => ({ type: 'Напоминание', title: item.title, detail: new Date(item.date).toLocaleDateString('ru-RU') })),
        ...state.events.filter((item) => item.title.toLowerCase().includes(needle)).map((item) => ({ type: 'Событие', title: item.title, detail: new Date(item.date).toLocaleDateString('ru-RU') })),
        ...state.birthdays.filter((item) => item.name.toLowerCase().includes(needle)).map((item) => ({ type: 'День рождения', title: item.name, detail: new Date(item.date).toLocaleDateString('ru-RU') })),
        ...state.shoppingLists.flatMap((list) => list.items.filter((item) => item.name.toLowerCase().includes(needle)).map((item) => ({ type: 'Покупка', title: item.name, detail: `${list.title} · ${item.bought ? 'куплено' : 'в списке'}` }))),
        ...state.debts.filter((item) => item.person.toLowerCase().includes(needle) || item.description.toLowerCase().includes(needle)).map((item) => ({ type: item.direction === 'owedToMe' ? 'Мне должны' : 'Я должен', title: item.person, detail: `${(item.amountMinor / 100).toFixed(2)} ${item.currency}` })),
        ...state.subscriptions.filter((item) => item.name.toLowerCase().includes(needle)).map((item) => ({ type: 'Подписка', title: item.name, detail: `${(item.costMinor / 100).toFixed(2)} ${item.currency}` })),
        ...state.payments.filter((item) => item.title.toLowerCase().includes(needle)).map((item) => ({ type: 'Платёж', title: item.title, detail: item.paid ? 'Оплачено' : new Date(item.dueDate).toLocaleDateString('ru-RU') })),
      ];
    },

    addGoal: ({ title, deadline }) => {
      const clean = title.trim();
      if (!clean) return;
      setState((current) => ({ ...current, goals: [{ id: id(), title: clean, progress: 0, deadline: deadline.trim() || 'без срока', done: false, createdAt: new Date().toISOString() }, ...current.goals] }));
    },
    updateGoalProgress: (goalId, progress) => setState((current) => ({ ...current, goals: current.goals.map((goal) => goal.id === goalId ? { ...goal, progress: Math.max(0, Math.min(1, progress)), done: progress >= 1 } : goal) })),
    removeGoal: (goalId) => setState((current) => ({ ...current, goals: current.goals.filter((goal) => goal.id !== goalId) })),

    addReminder: ({ title, type, date }) => {
      const clean = title.trim();
      if (!clean) return;
      setState((current) => ({ ...current, reminders: [{ id: id(), title: clean, type, date, done: false, createdAt: new Date().toISOString() }, ...current.reminders] }));
    },
    toggleReminder: (reminderId) => setState((current) => ({ ...current, reminders: current.reminders.map((r) => r.id === reminderId ? { ...r, done: !r.done } : r) })),
    removeReminder: (reminderId) => setState((current) => ({ ...current, reminders: current.reminders.filter((r) => r.id !== reminderId) })),

    addEvent: ({ title, type, date, note }) => {
      const clean = title.trim();
      if (!clean) return;
      setState((current) => ({ ...current, events: [{ id: id(), title: clean, type, date, note: note?.trim() ?? '' }, ...current.events] }));
    },
    removeEvent: (eventId) => setState((current) => ({ ...current, events: current.events.filter((e) => e.id !== eventId) })),

    addBirthday: ({ name, date }) => {
      const clean = name.trim();
      if (!clean) return;
      setState((current) => ({ ...current, birthdays: [{ id: id(), name: clean, date }, ...current.birthdays] }));
    },
    removeBirthday: (birthdayId) => setState((current) => ({ ...current, birthdays: current.birthdays.filter((b) => b.id !== birthdayId) })),

    addCountdown: ({ title, targetDate }) => {
      const clean = title.trim();
      if (!clean) return;
      setState((current) => ({ ...current, countdowns: [{ id: id(), title: clean, targetDate }, ...current.countdowns] }));
    },
    removeCountdown: (countdownId) => setState((current) => ({ ...current, countdowns: current.countdowns.filter((c) => c.id !== countdownId) })),

    addShoppingList: (title) => {
      const clean = title.trim();
      if (!clean) return;
      setState((current) => ({ ...current, shoppingLists: [{ id: id(), title: clean, items: [], createdAt: new Date().toISOString() }, ...current.shoppingLists] }));
    },
    removeShoppingList: (listId) => setState((current) => ({ ...current, shoppingLists: current.shoppingLists.filter((l) => l.id !== listId) })),
    addShoppingItem: (listId, name) => {
      const clean = name.trim();
      if (!clean) return;
      setState((current) => ({ ...current, shoppingLists: current.shoppingLists.map((list) => list.id === listId ? { ...list, items: [{ id: id(), name: clean, bought: false }, ...list.items] } : list) }));
    },
    toggleShoppingItem: (listId, itemId) => setState((current) => ({ ...current, shoppingLists: current.shoppingLists.map((list) => list.id === listId ? { ...list, items: list.items.map((item) => item.id === itemId ? { ...item, bought: !item.bought } : item) } : list) })),
    removeShoppingItem: (listId, itemId) => setState((current) => ({ ...current, shoppingLists: current.shoppingLists.map((list) => list.id === listId ? { ...list, items: list.items.filter((item) => item.id !== itemId) } : list) })),

    addDebt: ({ direction, person, amount, description }) => {
      const numeric = Number(amount.replace(',', '.'));
      const cleanPerson = person.trim();
      if (!Number.isFinite(numeric) || numeric <= 0 || !cleanPerson) return false;
      setState((current) => ({ ...current, debts: [{
        id: id(), direction, person: cleanPerson, amountMinor: Math.round(numeric * 100),
        currency: current.primaryCurrency, date: new Date().toISOString(),
        description: description.trim(), settled: false,
      }, ...current.debts] }));
      return true;
    },
    toggleDebtSettled: (debtId) => setState((current) => ({ ...current, debts: current.debts.map((d) => d.id === debtId ? { ...d, settled: !d.settled } : d) })),
    removeDebt: (debtId) => setState((current) => ({ ...current, debts: current.debts.filter((d) => d.id !== debtId) })),

    addSubscription: ({ name, cost, period, nextPaymentDate }) => {
      const numeric = Number(cost.replace(',', '.'));
      const cleanName = name.trim();
      if (!Number.isFinite(numeric) || numeric <= 0 || !cleanName) return false;
      setState((current) => ({ ...current, subscriptions: [{
        id: id(), name: cleanName, costMinor: Math.round(numeric * 100),
        currency: current.primaryCurrency, period, nextPaymentDate,
      }, ...current.subscriptions] }));
      return true;
    },
    removeSubscription: (subId) => setState((current) => ({ ...current, subscriptions: current.subscriptions.filter((s) => s.id !== subId) })),

    addPayment: ({ title, amount, category, dueDate }) => {
      const numeric = Number(amount.replace(',', '.'));
      const cleanTitle = title.trim();
      if (!Number.isFinite(numeric) || numeric <= 0 || !cleanTitle) return false;
      setState((current) => ({ ...current, payments: [{
        id: id(), title: cleanTitle, amountMinor: Math.round(numeric * 100),
        currency: current.primaryCurrency, dueDate, category, paid: false,
      }, ...current.payments] }));
      return true;
    },
    togglePaymentPaid: (paymentId) => setState((current) => ({ ...current, payments: current.payments.map((p) => p.id === paymentId ? { ...p, paid: !p.paid, paidAt: p.paid ? undefined : new Date().toISOString() } : p) })),
    removePayment: (paymentId) => setState((current) => ({ ...current, payments: current.payments.filter((p) => p.id !== paymentId) })),

    achievements: ACHIEVEMENT_DEFS.map(({ id: aid, title, description }) => ({ id: aid, title, description })),
    unlockedAchievementList: ACHIEVEMENT_DEFS
      .filter((def) => state.unlockedAchievements[def.id])
      .map((def) => ({ id: def.id, title: def.title, description: def.description, unlockedAt: state.unlockedAchievements[def.id] })),
    toggleMediaFavorite: (item) => setState((current) => {
      const exists = current.mediaFavorites.some((x) => x.kind === item.kind && x.id === item.id);
      return { ...current, mediaFavorites: exists ? current.mediaFavorites.filter((x) => !(x.kind === item.kind && x.id === item.id)) : [item, ...current.mediaFavorites].slice(0, 200) };
    }),
    addMediaHistory: (item) => setState((current) => ({ ...current, mediaHistory: [item, ...current.mediaHistory.filter((x) => !(x.kind === item.kind && x.id === item.id))].slice(0, 100) })),
    isMediaFavorite: (kind, mediaId) => state.mediaFavorites.some((x) => x.kind === kind && x.id === mediaId),
    shareText: async (message) => {
      try {
        await Share.share({ message });
      } catch {
        // Sharing cancelled or unavailable — no-op, nothing sensitive was sent.
      }
    },
  }), [state]);

  return <LifeContext.Provider value={value}>{children}</LifeContext.Provider>;
}

export function useLife() {
  const value = useContext(LifeContext);
  if (!value) throw new Error('useLife must be used inside LifeProvider');
  return value;
}
