import React, { useEffect, useMemo, useState } from 'react';
import { CalendarEvent, ExpenseRecord, NavigationTab, ReminderItem } from '../types';
import { ambientSound } from '../utils/audioSynth';
import { useDailyCounter } from '../utils/dailyCounter';
import { useLiveWeather } from '../utils/weather';
import { AuraOrbitalDiscs } from './AuraOrbitalDiscs';
import { AuraRobotAvatar } from './AuraRobotAvatar';

interface HomeScreenProps {
  onOpenVoice: () => void;
  onNavigateTab: (tab: NavigationTab) => void;
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onOpenVoice,
  onNavigateTab,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [ambientPlaying, setAmbientPlaying] = useState(false);
  const [quranPlaying, setQuranPlaying] = useState(false);
  const { weather } = useLiveWeather();

  // Daily (24h auto-reset) habit counters
  const [waterDone, setWaterDone] = useDailyCounter<boolean>('home_water_done', false);
  const [readingDone, setReadingDone] = useDailyCounter<boolean>('home_reading_done', false);

  // Real data shared with the Reminders / Calendar / Finance screens —
  // no fake example values, just an honest empty state until the user adds
  // something themselves.
  const [reminders, setReminders] = useState<ReminderItem[]>(() => readJson('aura_reminders', []));
  const [calendarEvents] = useState<CalendarEvent[]>(() => readJson('aura_calendar_events', []));
  const [income] = useState<number>(() => Number(localStorage.getItem('aura_finance_income')) || 0);
  const [expenses] = useState<ExpenseRecord[]>(() => readJson('aura_finance_expenses', []));

  // Keep this screen's snapshot fresh if the user just came back from another tab
  useEffect(() => {
    setReminders(readJson('aura_reminders', []));
  }, []);

  const toggleTask = (id: string) => {
    ambientSound.playTone(500, 0.1);
    const updated = reminders.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    setReminders(updated);
    localStorage.setItem('aura_reminders', JSON.stringify(updated));
  };

  const toggleAmbient = () => {
    if (ambientPlaying) {
      ambientSound.stop();
      setAmbientPlaying(false);
    } else {
      ambientSound.playAmbientChord([216, 272, 324, 432]); // 432Hz harmonic
      setAmbientPlaying(true);
    }
  };

  const toggleQuran = () => {
    if (quranPlaying) {
      ambientSound.stop();
      setQuranPlaying(false);
    } else {
      ambientSound.playAmbientChord([196, 246.94, 293.66, 392]);
      setQuranPlaying(true);
    }
  };

  const totalSpent = useMemo(
    () => expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0),
    [expenses]
  );
  const remaining = income > 0 ? Math.max(0, income - totalSpent) : 0;

  const nextEvent = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return calendarEvents
      .filter((e) => new Date(e.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  }, [calendarEvents]);

  const daysUntil = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    return Math.max(0, Math.round((target.getTime() - today.getTime()) / 86400000));
  };

  const upcomingReminders = reminders.filter((r) => !r.completed).slice(0, 3);

  return (
    <div className="flex flex-col w-full relative select-none pb-28">
      {/* Interactive Ambient Atmosphere Background with Aura Glows */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[12%] left-1/2 -translate-x-1/2 w-[340px] h-[340px] rounded-full bg-[#a078ff]/20 blur-[90px] animate-pulse"></div>
        <div className="absolute top-[28%] left-1/3 w-[260px] h-[260px] rounded-full bg-[#4cd7f6]/15 blur-[80px]"></div>
        <div className="absolute bottom-[20%] right-[-10%] w-[300px] h-[300px] rounded-full bg-[#00a572]/20 blur-[100px]"></div>
      </div>

      {/* Center Stage: 3D Holographic AI Assistant with Vibrant 3D Orbital Rings */}
      <div className="relative w-full flex flex-col items-center justify-center pt-3 pb-3">
        {/* 3D Perspective Stage */}
        <div className="relative flex items-center justify-center w-64 h-64 sm:w-72 sm:h-72" style={{ perspective: 1000 }}>
          {/* Ambient Backing Glow Sphere */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#06b6d4]/25 via-[#8b5cf6]/35 to-[#ec4899]/30 blur-3xl pointer-events-none animate-pulse"></div>

          {/* 3D Transform Container for Orbital Rings & Float Motion */}
          <div className="relative w-full h-full flex items-center justify-center animate-aura-float" style={{ transformStyle: 'preserve-3d' }}>
            {/* Dynamic Rotating 3D Holographic Discs */}
            <AuraOrbitalDiscs variant="normal" />

            {/* Assistant Visual Core: Seamless Floating Robot Spherical Assistant without black circle */}
            <AuraRobotAvatar
              onClick={() => {
                ambientSound.playTone(600, 0.2);
                onOpenVoice();
              }}
            />
          </div>
        </div>

        {/* Assistant Status & State Indicator */}
        <div className="flex items-center gap-2 mt-1 px-3 py-1 rounded-full bg-[#272a32]/40 backdrop-blur-xl border border-white/[0.05]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] shadow-[0_0_8px_#4cd7f6] animate-ping"></span>
          <span className="text-[11px] font-semibold text-[#4cd7f6] uppercase tracking-wider">
            Нейросеть активна • Готова к диалогу
          </span>
        </div>
      </div>

      {/* Minimalist Voice Prompt / Interaction Pill */}
      <div className="w-full mt-2 mb-3">
        <button
          onClick={onOpenVoice}
          id="voice-trigger-btn"
          className="w-full p-2.5 sm:p-3 rounded-2xl bg-[#1d1f27]/70 border border-white/[0.08] backdrop-blur-2xl transition-all duration-300 active:scale-[0.98] group flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:border-[#4cd7f6]/40"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#a078ff] via-[#d0bcff] to-[#4cd7f6] flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(160,120,255,0.4)]">
              <span className="material-symbols-outlined text-[#3c0091] text-[20px]">graphic_eq</span>
            </div>
            <div className="flex flex-col text-left min-w-0">
              <span className="text-[14px] font-semibold text-[#e1e2ec] group-hover:text-[#acedff] transition-colors truncate">
                «Слушаю тебя...»
              </span>
              <span className="text-[12px] text-[#cbc3d7] truncate">
                Например: «Найди песню Rihanna Rude Boy»
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#32353d]/50 shrink-0 ml-2">
            <span className="text-[11px] font-medium text-[#4cd7f6]">Aura Speak</span>
            <span className="material-symbols-outlined text-[#4cd7f6] text-[16px]">mic</span>
          </div>
        </button>
      </div>

      {/* Quick Zen Glance / Daily Orbit Pills */}
      <div className="w-full grid grid-cols-4 gap-2 mb-4">
        {/* Weather & Health Widget Pill (live geolocation weather) */}
        <div
          onClick={() => onNavigateTab('health')}
          className="flex flex-col items-center justify-center py-2.5 px-1.5 rounded-2xl bg-[#191b23]/70 border border-white/[0.06] backdrop-blur-xl transition-all duration-200 active:bg-[#1d1f27] cursor-pointer hover:border-white/[0.12]"
        >
          <div className="flex items-center gap-0.5 text-[#4cd7f6] mb-0.5">
            <span className="material-symbols-outlined text-[18px]">wb_sunny</span>
            <span className="text-[17px] font-bold text-[#e1e2ec]">{weather.temperature}</span>
          </div>
          <span className="text-[10px] text-[#cbc3d7] text-center truncate w-full">Здоровье & Погода</span>
        </div>

        {/* Reminders / Tasks Pill */}
        <div
          onClick={() => onNavigateTab('reminders')}
          className="flex flex-col items-center justify-center py-2.5 px-1.5 rounded-2xl bg-[#191b23]/70 border border-white/[0.06] backdrop-blur-xl transition-all duration-200 active:bg-[#1d1f27] cursor-pointer hover:border-white/[0.12]"
        >
          <div className="flex items-center gap-0.5 text-[#eab308] mb-0.5">
            <span className="material-symbols-outlined text-[18px]">alarm</span>
            <span className="text-[17px] font-bold text-[#e1e2ec]">
              {upcomingReminders[0]?.time ?? '—'}
            </span>
          </div>
          <span className="text-[10px] text-[#cbc3d7] text-center truncate w-full">
            {upcomingReminders[0]?.title ?? 'Нет напоминаний'}
          </span>
        </div>

        {/* Daily Finance Pill */}
        <div
          onClick={() => onNavigateTab('finance')}
          className="flex flex-col items-center justify-center py-2.5 px-1.5 rounded-2xl bg-[#191b23]/70 border border-white/[0.06] backdrop-blur-xl transition-all duration-200 active:bg-[#1d1f27] cursor-pointer hover:border-white/[0.12]"
        >
          <div className="flex items-center gap-0.5 text-[#10b981] mb-0.5">
            <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
            <span className="text-[16px] font-bold text-[#e1e2ec]">
              {income > 0 ? `${Math.round(remaining / 1000)}k сом` : 'Добавить'}
            </span>
          </div>
          <span className="text-[10px] text-[#cbc3d7] text-center truncate w-full">Финансы</span>
        </div>

        {/* Calendar / Countdown Pill */}
        <div
          onClick={() => onNavigateTab('calendar')}
          className="flex flex-col items-center justify-center py-2.5 px-1.5 rounded-2xl bg-[#191b23]/70 border border-white/[0.06] backdrop-blur-xl transition-all duration-200 active:bg-[#1d1f27] cursor-pointer hover:border-white/[0.12]"
        >
          <div className="flex items-center gap-0.5 text-[#ec4899] mb-0.5">
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            <span className="text-[17px] font-bold text-[#e1e2ec]">
              {nextEvent ? `${daysUntil(nextEvent.date)} дн` : '—'}
            </span>
          </div>
          <span className="text-[10px] text-[#cbc3d7] text-center truncate w-full">
            {nextEvent?.title ?? 'Нет событий'}
          </span>
        </div>
      </div>

      {/* Collapsible Life Modules Bottom Sheet Drawer */}
      <div className="w-full flex flex-col rounded-3xl bg-[#0b0e15]/85 border border-white/[0.09] backdrop-blur-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.6)] transition-all duration-500 overflow-hidden">
        {/* Drawer Handle & Header Trigger */}
        <button
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          className="w-full py-3 px-4 flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-white/[0.02] active:bg-white/[0.04]"
        >
          <div className="w-10 h-1 rounded-full bg-[#494454]/60 mb-2"></div>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#d0bcff] text-[20px]">layers</span>
              <span className="text-[14px] font-medium text-[#e1e2ec]">Упорядоченные разделы OS</span>
            </div>
            <div className="flex items-center gap-1 text-[#cbc3d7]">
              <span className="text-[11px] uppercase tracking-wider font-semibold">
                {isDrawerOpen ? 'Свернуть' : 'Развернуть'}
              </span>
              <span
                className={`material-symbols-outlined text-[18px] transition-transform duration-300 ${
                  isDrawerOpen ? 'rotate-180' : ''
                }`}
              >
                expand_less
              </span>
            </div>
          </div>
        </button>

        {/* Expandable Functional Content Container */}
        <div
          className={`w-full px-4 flex flex-col gap-3 transition-all duration-500 overflow-y-auto ${
            isDrawerOpen ? 'max-h-[600px] opacity-100 pb-5' : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          {/* Module 1: Reminders & Tasks */}
          <div className="relative overflow-hidden rounded-2xl bg-[#1d1f27]/70 border border-white/[0.06] p-3.5 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#eab308]"></span>
                <span className="text-[14px] font-semibold text-[#e1e2ec]">Напоминания дня</span>
              </div>
              <button
                onClick={() => onNavigateTab('reminders')}
                className="text-[10px] font-medium text-[#fde047] bg-[#eab308]/15 px-2 py-0.5 rounded-full hover:bg-[#eab308]/25"
              >
                Все напоминания →
              </button>
            </div>
            {upcomingReminders.length > 0 ? (
              <div className="space-y-2">
                {upcomingReminders.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className="flex items-center justify-between p-2 rounded-xl bg-[#191b23]/80 hover:bg-[#272a32]/80 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="material-symbols-outlined text-[20px] text-[#eab308]"
                        style={{ fontVariationSettings: "'FILL' 0" }}
                      >
                        radio_button_unchecked
                      </span>
                      <span className="text-[13px] truncate text-[#e1e2ec]">{task.text ?? (task as any).title}</span>
                    </div>
                    <span className="text-[11px] text-[#fde047] font-semibold shrink-0">{task.time}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div
                onClick={() => onNavigateTab('reminders')}
                className="p-3 rounded-xl bg-[#191b23]/80 text-[12px] text-[#8690a2] text-center cursor-pointer hover:bg-[#272a32]/80"
              >
                Пока нет напоминаний — нажмите, чтобы добавить первое
              </div>
            )}
          </div>

          {/* Module 2: Finances & AI Budget Control */}
          <div className="relative overflow-hidden rounded-2xl bg-[#1d1f27]/70 border border-white/[0.06] p-3.5 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
                <span className="text-[14px] font-semibold text-[#e1e2ec]">Финансы &amp; ИИ-учет</span>
              </div>
              <button
                onClick={() => onNavigateTab('finance')}
                className="text-[10px] font-medium text-[#34d399] bg-[#10b981]/15 px-2 py-0.5 rounded-full hover:bg-[#10b981]/25"
              >
                Открыть финансы →
              </button>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#191b23]/80">
              {income > 0 ? (
                <div className="flex flex-col">
                  <span className="text-[11px] text-[#cbc3d7]">
                    Доход: {income.toLocaleString()} сом | Потрачено: {totalSpent.toLocaleString()} сом
                  </span>
                  <span className="text-[18px] font-bold text-[#e1e2ec] tracking-tight">
                    Остаток: {remaining.toLocaleString()} сом
                  </span>
                </div>
              ) : (
                <span className="text-[12px] text-[#8690a2]">Добавьте доход, чтобы включить ИИ-учет бюджета</span>
              )}
              <button
                onClick={() => onNavigateTab('finance')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#10b981] text-[#00391d] font-semibold text-[12px] active:scale-95 transition-transform shrink-0 ml-2"
              >
                <span>Открыть</span>
              </button>
            </div>
          </div>

          {/* Module 3: Quran & Spirituality */}
          <div className="relative overflow-hidden rounded-2xl bg-[#1d1f27]/70 border border-white/[0.06] p-3.5 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#d0bcff]"></span>
                <span className="text-[14px] font-semibold text-[#e1e2ec]">Духовность &amp; Коран</span>
              </div>
              <button
                onClick={() => onNavigateTab('spirituality')}
                className="text-[10px] font-medium text-[#d0bcff] bg-[#d0bcff]/10 px-2 py-0.5 rounded-full hover:bg-[#d0bcff]/20"
              >
                Суры & Тасбих →
              </button>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#191b23]/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#d0bcff]/20 flex items-center justify-center text-[#d0bcff]">
                  <span className="material-symbols-outlined text-[22px]">auto_stories</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-medium text-[#e1e2ec]">Сура Аль-Фатиха (1)</span>
                  <span className="text-[11px] text-[#cbc3d7]">7 аятов • Открывающая</span>
                </div>
              </div>
              <button
                onClick={toggleQuran}
                className="w-9 h-9 rounded-full bg-[#32353d] flex items-center justify-center text-[#d0bcff] active:scale-90 transition-transform shadow-md"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {quranPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>
            </div>
          </div>

          {/* Module 4: Health & Weather Plan (resets automatically every 24h) */}
          <div className="relative overflow-hidden rounded-2xl bg-[#1d1f27]/70 border border-white/[0.06] p-3.5 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#06b6d4]"></span>
                <span className="text-[14px] font-semibold text-[#e1e2ec]">Здоровье & Спорт (ИИ-план)</span>
              </div>
              <button
                onClick={() => onNavigateTab('health')}
                className="text-[10px] text-[#22d3ee] bg-[#06b6d4]/10 px-2 py-0.5 rounded-full hover:bg-[#06b6d4]/20"
              >
                Подробнее →
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div
                onClick={() => setWaterDone(!waterDone)}
                className="p-2.5 rounded-xl bg-[#191b23]/80 flex items-center justify-between cursor-pointer hover:bg-[#272a32]"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-[#06b6d4] text-[20px]">water_drop</span>
                  <div className="flex flex-col truncate">
                    <span className="text-[12px] font-medium text-[#e1e2ec] truncate">Вода после сна</span>
                    <span className="text-[10px] text-[#cbc3d7]">Обновляется каждые 24ч</span>
                  </div>
                </div>
                <span
                  className={`material-symbols-outlined text-[20px] ${
                    waterDone ? 'text-[#4edea3]' : 'text-[#958ea0]'
                  }`}
                  style={{ fontVariationSettings: waterDone ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {waterDone ? 'check_circle' : 'radio_button_unchecked'}
                </span>
              </div>

              <div
                onClick={() => {
                  setReadingDone(true);
                  onNavigateTab('library');
                }}
                className="p-2.5 rounded-xl bg-[#191b23]/80 flex items-center justify-between cursor-pointer hover:bg-[#272a32]"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-[#d0bcff] text-[20px]">menu_book</span>
                  <div className="flex flex-col truncate">
                    <span className="text-[12px] font-medium text-[#e1e2ec] truncate">Библиотека</span>
                    <span className="text-[10px] text-[#cbc3d7]">{readingDone ? 'Читали сегодня' : 'Ещё не читали'}</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[20px] text-[#a078ff]">
                  arrow_forward
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
