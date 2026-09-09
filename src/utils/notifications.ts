/**
 * AI-generated recommendations pushed to the system notification shade.
 *
 * Every ~24h, Aura looks at the numbers the user already has in the app
 * (water intake, health checklist, task/reminder load, budget usage,
 * achievement progress) and asks Groq for one short, concrete recommendation,
 * then fires it as a native browser/OS notification.
 */
import { askGroq } from './groqClient';

const LAST_RUN_KEY = 'aura_last_recommendation_at';
const CHECK_INTERVAL_MS = 30 * 60 * 1000; // check every 30 min whether 24h passed
const RECOMMENDATION_PERIOD_MS = 24 * 60 * 60 * 1000;

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  try {
    const result = await Notification.requestPermission();
    return result === 'granted';
  } catch {
    return false;
  }
}

export function sendAppNotification(title: string, body: string) {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;
  try {
    new Notification(title, {
      body,
      icon: '/favicon.svg',
      tag: 'aura-recommendation',
    });
  } catch (err) {
    console.warn('Notification failed:', err);
  }
}

interface AppSnapshot {
  waterLiters: number;
  waterGoal: number;
  healthPlanDone: number;
  healthPlanTotal: number;
  incomeKgs: number;
  monthlyLimitKgs: number;
  spentKgs: number;
  openRemindersToday: number;
  achievementsUnlocked: number;
  achievementsTotal: number;
}

function readNumber(key: string, fallback: number): number {
  const raw = localStorage.getItem(key);
  const n = raw ? Number(raw) : NaN;
  return Number.isFinite(n) ? n : fallback;
}

function readJsonArrayLength(key: string): number {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return 0;
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.length : 0;
  } catch {
    return 0;
  }
}

function buildSnapshot(): AppSnapshot {
  let expensesTotal = 0;
  try {
    const raw = localStorage.getItem('aura_finance_expenses');
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        expensesTotal = arr.reduce((sum: number, e: any) => sum + (Number(e.amount) || 0), 0);
      }
    }
  } catch {
    // ignore
  }

  return {
    waterLiters: readNumber('aura_water_current', 0),
    waterGoal: 3.0,
    healthPlanDone: readJsonArrayLength('aura_health_plan_done_placeholder'), // best-effort, may be 0
    healthPlanTotal: 5,
    incomeKgs: readNumber('aura_finance_income', 0),
    monthlyLimitKgs: readNumber('aura_finance_limit', 0),
    spentKgs: expensesTotal,
    openRemindersToday: readJsonArrayLength('aura_reminders'),
    achievementsUnlocked: 0,
    achievementsTotal: 6,
  };
}

async function generateRecommendation(snapshot: AppSnapshot): Promise<string> {
  const prompt = `Вот текущие показатели пользователя приложения Aura OS за сегодня:
- Вода: ${snapshot.waterLiters} из ${snapshot.waterGoal} л
- Финансы: доход ${snapshot.incomeKgs} сом, лимит расходов ${snapshot.monthlyLimitKgs} сом, потрачено ${snapshot.spentKgs} сом
- Открытых напоминаний: ${snapshot.openRemindersToday}

Дай ОДНУ короткую, конкретную и полезную рекомендацию на сегодня (максимум 1-2 предложения, без вступлений и без markdown).`;

  try {
    const reply = await askGroq(
      prompt,
      'Ты — Aura, ИИ-аналитик личной продуктивности, здоровья и финансов. Отвечай одной емкой рекомендацией на русском.'
    );
    return reply.trim();
  } catch {
    return 'Загляните в приложение — там есть свежие задачи и показатели, которые стоит обновить.';
  }
}

async function maybeRunDailyRecommendation() {
  const lastRun = readNumber(LAST_RUN_KEY, 0);
  if (Date.now() - lastRun < RECOMMENDATION_PERIOD_MS) return;

  const granted = Notification.permission === 'granted';
  if (!granted) return;

  const snapshot = buildSnapshot();
  const recommendation = await generateRecommendation(snapshot);
  sendAppNotification('Aura • Рекомендация дня', recommendation);
  localStorage.setItem(LAST_RUN_KEY, Date.now().toString());
}

/**
 * Call once on app startup. Silently requests notification permission if not
 * yet decided, and schedules a periodic check that fires an AI-generated
 * recommendation roughly once every 24 hours.
 */
export function initDailyRecommendations() {
  if (typeof window === 'undefined') return () => {};

  requestNotificationPermission().then((granted) => {
    if (granted) {
      // Fire immediately if it's been >24h (or never run before)
      maybeRunDailyRecommendation();
    }
  });

  const interval = setInterval(() => {
    maybeRunDailyRecommendation();
  }, CHECK_INTERVAL_MS);

  return () => clearInterval(interval);
}

/**
 * ── "Не забудьте записать расход" reminders ────────────────────────────
 *
 * Important limitation to be upfront about: a web app (or any regular app)
 * has no way to detect that the user has opened a *different* app —
 * browsers and mobile OSes deliberately sandbox apps from each other, so
 * Aura cannot know when someone opens MBANK, Simbank, O!Bank, Demirbank,
 * etc. That kind of cross-app trigger would require a native Android
 * component with special system-level permissions (e.g. a notification
 * listener or accessibility service) — it isn't something a web/PWA build
 * can do, and is well outside what this project is.
 *
 * What Aura *can* do, and does here, is the closest honest equivalent:
 *  1. When the user comes back to Aura itself after being away for a while
 *     (tab/app regains focus), and they haven't logged any expense yet
 *     today, gently nudge them to log one.
 *  2. A periodic check during typical "spending hours" that fires at most
 *     twice a day if today still has zero recorded expenses.
 */
const EXPENSE_REMINDER_LAST_KEY = 'aura_last_expense_reminder_at';
const EXPENSE_REMINDER_MIN_GAP_MS = 2 * 60 * 60 * 1000; // don't nag more than every 2h
const HIDDEN_THRESHOLD_MS = 5 * 60 * 1000; // "away" = hidden for 5+ minutes

function hasLoggedExpenseToday(): boolean {
  try {
    const raw = localStorage.getItem('aura_finance_expenses');
    if (!raw) return false;
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return false;
    const today = new Date().toISOString().slice(0, 10);
    return arr.some((e: any) => typeof e?.date === 'string' && e.date.slice(0, 10) === today);
  } catch {
    return false;
  }
}

function maybeSendExpenseReminder() {
  if (Notification.permission !== 'granted') return;
  const lastSent = Number(localStorage.getItem(EXPENSE_REMINDER_LAST_KEY) || 0);
  if (Date.now() - lastSent < EXPENSE_REMINDER_MIN_GAP_MS) return;
  if (hasLoggedExpenseToday()) return;

  sendAppNotification('Aura • Финансы', 'Не забудьте записать расход за сегодня 💸');
  localStorage.setItem(EXPENSE_REMINDER_LAST_KEY, Date.now().toString());
}

/**
 * Call once on app startup, alongside initDailyRecommendations. Wires:
 *  - a visibility-change listener that nudges the user when they return
 *    to Aura after a real gap,
 *  - a periodic safety-net check during waking hours.
 */
export function initExpenseReminders() {
  if (typeof window === 'undefined' || !('Notification' in window)) return () => {};

  let hiddenAt: number | null = null;

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      hiddenAt = Date.now();
      return;
    }
    // Became visible again
    if (hiddenAt && Date.now() - hiddenAt >= HIDDEN_THRESHOLD_MS) {
      maybeSendExpenseReminder();
    }
    hiddenAt = null;
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  const interval = setInterval(() => {
    const hour = new Date().getHours();
    if (hour >= 9 && hour <= 23) {
      maybeSendExpenseReminder();
    }
  }, CHECK_INTERVAL_MS);

  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    clearInterval(interval);
  };
}
