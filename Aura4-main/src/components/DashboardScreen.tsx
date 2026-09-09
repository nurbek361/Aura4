import React, { useMemo, useState } from 'react';
import { NavigationTab } from '../types';

interface DashboardScreenProps {
  onOpenVoice: () => void;
  onNavigateTab: (tab: NavigationTab) => void;
}

const MODULES: Array<{
  id: NavigationTab;
  label: string;
  icon: string;
  value: string;
  accent: string;
  glow: string;
}> = [
  { id: 'reminders', label: 'Фокус', icon: 'target', value: '3 задачи', accent: '#c084fc', glow: 'rgba(192,132,252,.22)' },
  { id: 'finance', label: 'Финансы', icon: 'account_balance_wallet', value: '68% лимита', accent: '#6ee7b7', glow: 'rgba(110,231,183,.16)' },
  { id: 'health', label: 'Тело', icon: 'vital_signs', value: '7.8 ч сна', accent: '#67e8f9', glow: 'rgba(103,232,249,.16)' },
  { id: 'calendar', label: 'Ритм', icon: 'calendar_month', value: '2 события', accent: '#f0abfc', glow: 'rgba(240,171,252,.16)' },
  { id: 'library', label: 'Знания', icon: 'auto_stories', value: '42 стр.', accent: '#fcd34d', glow: 'rgba(252,211,77,.14)' },
  { id: 'spirituality', label: 'Баланс', icon: 'flare', value: '12 дней', accent: '#a7f3d0', glow: 'rgba(167,243,208,.14)' },
];

const bars = [42, 58, 46, 75, 62, 84, 71, 92, 78, 88, 66, 96];

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ onOpenVoice, onNavigateTab }) => {
  const [activeModule, setActiveModule] = useState<NavigationTab>('reminders');
  const today = useMemo(
    () =>
      new Intl.DateTimeFormat('ru-RU', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      }).format(new Date()),
    [],
  );

  const openModule = (id: NavigationTab) => {
    setActiveModule(id);
    onNavigateTab(id);
  };

  return (
    <div className="relative w-full pb-28">
      <div className="aura-grid pointer-events-none fixed inset-0 -z-10 opacity-60" />
      <div className="pointer-events-none fixed -top-20 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-600/20 blur-[110px]" />

      <section className="animate-rise-in">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[.22em] text-violet-200/55">
              {today}
            </p>
            <h1 className="font-headline text-[31px] font-semibold leading-[1.04] tracking-[-.06em] text-white">
              День в твоём<br />
              <span className="bg-gradient-to-r from-violet-200 via-fuchsia-200 to-cyan-200 bg-clip-text text-transparent">
                ритме.
              </span>
            </h1>
          </div>
          <button
            onClick={() => onNavigateTab('reports')}
            className="tap-ripple flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[.06] text-violet-100 transition hover:border-violet-200/30 hover:bg-violet-300/10"
            aria-label="Открыть AI-отчёты"
          >
            <span className="material-symbols-outlined text-[21px]">auto_graph</span>
          </button>
        </div>

        <div className="aura-card relative min-h-[310px] overflow-hidden rounded-[30px] p-5 sm:p-7">
          <div className="aura-shimmer absolute inset-0 opacity-20" />
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-violet-600/20 blur-3xl" />
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.18em] text-cyan-200/75">
                <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_14px_#67e8f9]" />
                Aura intelligence
              </div>
              <p className="max-w-[190px] text-[15px] leading-snug text-white/70">
                Мягкий старт. Сначала один важный шаг.
              </p>
            </div>
            <button
              onClick={onOpenVoice}
              className="tap-ripple flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:scale-105 hover:bg-white/15"
              aria-label="Открыть голосового ассистента"
            >
              <span className="material-symbols-outlined text-[20px]">graphic_eq</span>
            </button>
          </div>

          <div className="relative mx-auto mt-1 flex h-[178px] w-[220px] items-center justify-center">
            <div className="aura-ring absolute h-[168px] w-[168px] rounded-full opacity-35 [transform:rotateX(65deg)_rotateY(-15deg)] animate-spin-clockwise-slow" />
            <div className="aura-ring absolute h-[137px] w-[205px] rounded-full opacity-45 [transform:rotateX(70deg)_rotateY(28deg)] animate-spin-counter-medium" />
            <div className="aura-ring absolute h-[112px] w-[112px] rounded-full border-fuchsia-200/40 opacity-60 animate-spin-clockwise-fast" />
            <div className="aura-orb aura-breathe h-[86px] w-[86px] rounded-full" />
            <span className="absolute bottom-0 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] uppercase tracking-[.18em] text-white/45 backdrop-blur">
              online · 74%
            </span>
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[.18em] text-white/40">Состояние</p>
              <p className="mt-1 text-sm font-medium text-white/85">Фокус собран</p>
            </div>
            <button
              onClick={onOpenVoice}
              className="rounded-full bg-white px-4 py-2 text-[12px] font-bold text-[#211044] transition hover:bg-violet-100 active:scale-95"
            >
              Спросить Aura
            </button>
          </div>
        </div>
      </section>

      <section className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="aura-card rounded-2xl p-4">
          <p className="text-[10px] uppercase tracking-[.16em] text-white/40">Индекс дня</p>
          <div className="mt-2 flex items-center gap-3">
            <div className="relative h-12 w-12">
              <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                <path d="M18 2.5a15.5 15.5 0 1 1 0 31a15.5 15.5 0 0 1 0-31" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="3.5" />
                <path d="M18 2.5a15.5 15.5 0 1 1 0 31a15.5 15.5 0 0 1 0-31" fill="none" stroke="#c084fc" strokeLinecap="round" strokeWidth="3.5" strokeDasharray="74,100" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[12px] font-bold">74</span>
            </div>
            <div>
              <p className="text-[12px] text-white/75">+12%</p>
              <p className="text-[10px] text-white/40">к вчера</p>
            </div>
          </div>
        </div>
        <div className="aura-card rounded-2xl p-4">
          <p className="text-[10px] uppercase tracking-[.16em] text-white/40">Энергия</p>
          <p className="mt-2 text-[26px] font-semibold tracking-[-.06em] text-white">8.4<span className="ml-1 text-sm text-cyan-200/60">/10</span></p>
          <div className="mt-2 flex h-1.5 gap-1 overflow-hidden rounded-full bg-white/10">
            <span className="w-[84%] rounded-full bg-gradient-to-r from-cyan-300 to-violet-300" />
          </div>
        </div>
        <div className="aura-card col-span-2 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-[.16em] text-white/40">Активность · 12 часов</p>
            <span className="text-[10px] font-semibold text-emerald-200">+18.4%</span>
          </div>
          <div className="mt-3 flex h-12 items-end gap-1.5">
            {bars.map((height, index) => (
              <span
                key={index}
                className="min-w-0 flex-1 rounded-t-md bg-gradient-to-t from-violet-500/35 to-fuchsia-200/90 transition-all duration-700 hover:from-cyan-300 hover:to-white"
                style={{ height: `${height}%`, animationDelay: `${index * 50}ms` }}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-7">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-violet-200/50">Система жизни</p>
            <h2 className="mt-1 text-lg font-semibold tracking-[-.03em] text-white">Всё связано</h2>
          </div>
          <button onClick={() => onNavigateTab('hub')} className="text-[11px] font-semibold text-violet-200/70 transition hover:text-white">
            Все разделы <span className="ml-1">↗</span>
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {MODULES.map((module) => (
            <button
              key={module.id}
              onClick={() => openModule(module.id)}
              className={`aura-card tap-ripple group relative overflow-hidden rounded-2xl p-3 text-left transition duration-300 ${
                activeModule === module.id ? 'ring-1 ring-violet-200/35' : ''
              }`}
              style={{ ['--module-glow' as string]: module.glow }}
            >
              <div className="absolute -right-5 -top-5 h-16 w-16 rounded-full blur-2xl transition group-hover:scale-150" style={{ background: module.glow }} />
              <span className="relative flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 text-[18px]" style={{ color: module.accent, background: module.glow }}>
                <span className="material-symbols-outlined text-[18px]">{module.icon}</span>
              </span>
              <span className="relative mt-4 block text-[12px] font-semibold text-white/85">{module.label}</span>
              <span className="relative mt-1 block truncate text-[10px] text-white/40">{module.value}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="aura-card mt-4 overflow-hidden rounded-3xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-fuchsia-200/60">AI signal</p>
            <h2 className="mt-1 text-[17px] font-semibold text-white">Один инсайт</h2>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-fuchsia-300/10 text-fuchsia-200">
            <span className="material-symbols-outlined text-[19px]">wand_stars</span>
          </span>
        </div>
        <div className="mt-4 flex items-start gap-3">
          <div className="mt-1 h-2.5 w-2.5 rounded-full bg-fuchsia-300 shadow-[0_0_14px_#f0abfc]" />
          <p className="text-[14px] leading-relaxed text-white/72">
            После 18:00 у тебя выше концентрация. Перенеси одну сложную задачу на вечер — так день станет легче.
          </p>
        </div>
        <button
          onClick={() => onNavigateTab('reports')}
          className="mt-5 flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[.04] px-4 py-3 text-left transition hover:bg-white/[.08]"
        >
          <span className="text-[12px] font-semibold text-violet-100">Открыть полный AI-отчёт</span>
          <span className="material-symbols-outlined text-[18px] text-violet-200">arrow_forward</span>
        </button>
      </section>
    </div>
  );
};