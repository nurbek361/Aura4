import React, { useEffect, useState } from 'react';
import { NavigationTab } from '../types';
import { askGroq } from '../utils/groqClient';

interface ReportsScreenProps {
  onNavigateTab: (tab: NavigationTab) => void;
}

type Period = 'День' | 'Неделя' | 'Месяц';

const REPORTS: Record<Period, {
  score: string;
  delta: string;
  focus: string;
  recovery: string;
  insight: string;
  bars: number[];
  labels: string[];
}> = {
  День: {
    score: '74',
    delta: '+12%',
    focus: '5ч 20м',
    recovery: '8.4 / 10',
    insight: 'Сегодня лучше всего сработал вечерний фокус. Оставь после 18:00 одну задачу без переключений.',
    bars: [34, 48, 38, 72, 58, 86, 64, 92],
    labels: ['08', '10', '12', '14', '16', '18', '20', '22'],
  },
  Неделя: {
    score: '81',
    delta: '+18%',
    focus: '27ч 40м',
    recovery: '7.9 / 10',
    insight: 'Ритм становится устойчивее: сон и финансы идут ровно, а лучший день — четверг.',
    bars: [62, 75, 54, 92, 68, 81, 73],
    labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
  },
  Месяц: {
    score: '86',
    delta: '+24%',
    focus: '112ч 15м',
    recovery: '8.1 / 10',
    insight: 'Главный драйвер месяца — привычки. Сохрани короткие утренние ритуалы и не добавляй новые.',
    bars: [50, 63, 72, 58, 78, 88, 69, 94, 83, 91],
    labels: ['1', '4', '7', '10', '13', '16', '19', '22', '25', '28'],
  },
};

export const ReportsScreen: React.FC<ReportsScreenProps> = ({ onNavigateTab }) => {
  const [period, setPeriod] = useState<Period>('День');
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const report = REPORTS[period];

  useEffect(() => {
    setAiInsight(null);
  }, [period]);

  const generateAiInsight = async () => {
    setIsGenerating(true);
    const result = await askGroq(
      `Сделай один короткий практичный вывод на русском для AI-отчёта Aura за период «${period}». Данные: индекс ${report.score}, динамика ${report.delta}, фокус ${report.focus}, восстановление ${report.recovery}. Максимум 2 предложения, без вступления и общих фраз.`,
      'Ты — аналитик Aura. Пиши кратко, конкретно и бережно. Только готовый вывод без markdown.',
    );
    setAiInsight(result);
    setIsGenerating(false);
  };

  return (
    <div className="relative w-full pb-28">
      <div className="aura-grid pointer-events-none fixed inset-0 -z-10 opacity-50" />
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[.22em] text-violet-200/55">Aura intelligence</p>
          <h1 className="mt-2 text-[30px] font-semibold tracking-[-.06em] text-white">AI-отчёты</h1>
        </div>
        <button onClick={() => onNavigateTab('home')} className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[.05] text-white/70 transition hover:text-white" aria-label="На главную">
          <span className="material-symbols-outlined text-[20px]">home</span>
        </button>
      </div>

      <div className="aura-card flex rounded-2xl p-1">
        {(['День', 'Неделя', 'Месяц'] as Period[]).map((item) => (
          <button
            key={item}
            onClick={() => setPeriod(item)}
            className={`flex-1 rounded-xl py-2.5 text-[12px] font-semibold transition ${
              period === item ? 'bg-violet-300 text-[#25124e] shadow-[0_6px_20px_rgba(192,132,252,.25)]' : 'text-white/45 hover:text-white'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <section className="aura-card relative mt-4 overflow-hidden rounded-[30px] p-5">
        <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[.2em] text-white/40">Индекс периода</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-[56px] font-semibold leading-none tracking-[-.08em] text-white">{report.score}</span>
              <span className="text-sm text-emerald-200">{report.delta}</span>
            </div>
          </div>
          <div className="relative h-24 w-24">
            <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
              <path d="M18 2.5a15.5 15.5 0 1 1 0 31a15.5 15.5 0 0 1 0-31" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="2.8" />
              <path d="M18 2.5a15.5 15.5 0 1 1 0 31a15.5 15.5 0 0 1 0-31" fill="none" stroke="url(#reportGradient)" strokeLinecap="round" strokeWidth="2.8" strokeDasharray={`${Number(report.score)},100`} />
              <defs>
                <linearGradient id="reportGradient" x1="0" x2="1">
                  <stop stopColor="#c084fc" />
                  <stop offset="1" stopColor="#67e8f9" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-white/70">AURA</span>
          </div>
        </div>
        <div className="mt-6 flex h-28 items-end gap-2">
          {report.bars.map((height, index) => (
            <div key={index} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <div className="relative flex h-20 w-full items-end overflow-hidden rounded-t-lg bg-white/[.04]">
                <span className="aura-shimmer w-full rounded-t-lg bg-gradient-to-t from-violet-600/45 to-cyan-200/90 transition-all duration-500 hover:brightness-125" style={{ height: `${height}%` }} />
              </div>
              <span className="text-[9px] text-white/35">{report.labels[index]}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-3 grid grid-cols-2 gap-3">
        <div className="aura-card rounded-2xl p-4">
          <span className="material-symbols-outlined text-[20px] text-cyan-200">center_focus_strong</span>
          <p className="mt-3 text-[10px] uppercase tracking-[.16em] text-white/40">Фокус</p>
          <p className="mt-1 text-lg font-semibold text-white">{report.focus}</p>
        </div>
        <div className="aura-card rounded-2xl p-4">
          <span className="material-symbols-outlined text-[20px] text-fuchsia-200">favorite</span>
          <p className="mt-3 text-[10px] uppercase tracking-[.16em] text-white/40">Восстановление</p>
          <p className="mt-1 text-lg font-semibold text-white">{report.recovery}</p>
        </div>
      </section>

      <section className="aura-card mt-3 rounded-3xl p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-300 to-cyan-200 text-[#25124e] shadow-[0_0_24px_rgba(192,132,252,.3)]">
            <span className="material-symbols-outlined text-[21px]">auto_awesome</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-[.2em] text-violet-200/60">Вывод Aura</p>
            <p className="text-sm font-semibold text-white">Что важно сейчас</p>
          </div>
          <button
            onClick={generateAiInsight}
            disabled={isGenerating}
            className="rounded-full border border-violet-200/20 bg-violet-200/10 px-3 py-1.5 text-[10px] font-semibold text-violet-100 transition hover:bg-violet-200/20 disabled:opacity-50"
          >
            {isGenerating ? 'Синтез…' : 'Синтезировать'}
          </button>
        </div>
        <p className="mt-4 text-[14px] leading-relaxed text-white/70">{aiInsight || report.insight}</p>
        {aiInsight && <p className="mt-3 text-[10px] text-emerald-200/70">Сформировано Aura AI</p>}
      </section>

      <section className="aura-card mt-3 rounded-3xl p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[.2em] text-white/40">Связи</p>
            <h2 className="mt-1 text-[16px] font-semibold text-white">Что повлияло</h2>
          </div>
          <span className="text-[10px] text-emerald-200">3 сигнала</span>
        </div>
        <div className="space-y-3">
          {[
            ['sleep', 'Сон', 'поднял энергию', '87%', '#67e8f9'],
            ['task_alt', 'Фокус', 'снизил шум', '74%', '#c084fc'],
            ['account_balance_wallet', 'Финансы', 'держат ритм', '68%', '#6ee7b7'],
          ].map(([icon, title, text, score, color]) => (
            <button key={title} onClick={() => onNavigateTab(title === 'Фокус' ? 'reminders' : title === 'Финансы' ? 'finance' : 'health')} className="group flex w-full items-center gap-3 text-left">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[.04]" style={{ color }}>
                <span className="material-symbols-outlined text-[18px]">{icon}</span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[12px] font-semibold text-white/80">{title}</span>
                <span className="block text-[10px] text-white/35">{text}</span>
              </span>
              <span className="text-[12px] font-semibold text-white/60 group-hover:text-white">{score}</span>
              <span className="material-symbols-outlined text-[16px] text-white/25">arrow_forward</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};