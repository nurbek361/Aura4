import React, { useState } from 'react';
import { HealthPlanItem, SleepSchedule } from '../types';
import {
  INITIAL_HEALTH_PLAN,
  INITIAL_SLEEP_SCHEDULE,
} from '../data/mockData';
import { ambientSound } from '../utils/audioSynth';
import { useLiveWeather } from '../utils/weather';
import { useDailyCounter } from '../utils/dailyCounter';

export const HealthSportScreen: React.FC = () => {
  const [healthPlan, setHealthPlan] = useDailyCounter<HealthPlanItem[]>('health_plan', INITIAL_HEALTH_PLAN);

  const [waterAmount, setWaterAmount] = useDailyCounter<number>('water_current', 0);

  const [sleep] = useState<SleepSchedule>(INITIAL_SLEEP_SCHEDULE);
  const { weather } = useLiveWeather();

  const savePlan = (updated: HealthPlanItem[]) => {
    setHealthPlan(updated);
  };

  const handleTogglePlan = (id: string) => {
    ambientSound.playTone(740, 0.12);
    const updated = healthPlan.map((hp) =>
      hp.id === id ? { ...hp, completed: !hp.completed } : hp
    );
    savePlan(updated);
  };

  const handleAddWater = (amount: number) => {
    ambientSound.playTone(600, 0.1);
    const next = Math.min(4.0, +(waterAmount + amount).toFixed(2));
    setWaterAmount(next);
  };

  const completedCount = healthPlan.filter((p) => p.completed).length;
  const progressPercent = Math.round((completedCount / healthPlan.length) * 100);

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-[#06b6d4] uppercase tracking-wider">
            Биохакинг & Активность
          </span>
          <h1 className="font-headline text-2xl font-bold text-[#e1e2ec] tracking-tight">
            Здоровье & Спорт
          </h1>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#06b6d4]/15 border border-[#06b6d4]/30 text-xs font-semibold text-[#22d3ee]">
          <span className="w-2 h-2 rounded-full bg-[#06b6d4] animate-pulse"></span>
          <span>{progressPercent}% готово</span>
        </div>
      </div>

      {/* Hero AI Daily Plan Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-[#12242b] via-[#131b24] to-[#12151e] border border-[#06b6d4]/35 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#06b6d4]/20 border border-[#06b6d4]/40 flex items-center justify-center text-[#22d3ee] shadow-[0_0_14px_rgba(6,182,212,0.3)]">
              <span className="material-symbols-outlined text-[20px]">smart_toy</span>
            </div>
            <div>
              <h2 className="font-headline text-sm font-bold text-[#e1e2ec]">
                План на каждый день от Aura AI
              </h2>
              <div className="text-[10px] text-[#8690a2]">
                Персональная оптимизация энергии и выносливости
              </div>
            </div>
          </div>
          <span className="text-xs font-bold text-[#22d3ee]">
            {completedCount}/{healthPlan.length}
          </span>
        </div>

        {/* Routine Checklist */}
        <div className="space-y-2">
          {healthPlan.map((item) => (
            <div
              key={item.id}
              onClick={() => handleTogglePlan(item.id)}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                item.completed
                  ? 'bg-white/[0.02] border-white/[0.04] opacity-60'
                  : 'bg-white/[0.04] border-white/[0.08] hover:border-[#06b6d4]/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                    item.completed
                      ? 'bg-[#06b6d4] border-[#06b6d4] text-black font-bold'
                      : 'border-white/[0.2]'
                  }`}
                >
                  {item.completed && <span className="material-symbols-outlined text-[14px]">check</span>}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-[#06b6d4] bg-[#06b6d4]/10 px-1.5 py-0.5 rounded">
                    {item.time}
                  </span>
                  <span
                    className={`font-headline text-xs font-medium ${
                      item.completed ? 'line-through text-[#8690a2]' : 'text-[#e1e2ec]'
                    }`}
                  >
                    {item.title}
                  </span>
                </div>
              </div>

              <span className="material-symbols-outlined text-[#8690a2] text-[18px]">
                {item.icon}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hydration & Sleep Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Hydration Tracker */}
        <div className="p-4 rounded-2xl bg-[#151821] border border-white/[0.06] shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#38bdf8]">
              <span className="material-symbols-outlined text-[20px]">water_drop</span>
              <span>Водный баланс</span>
            </div>
            <span className="text-xs font-bold text-[#e1e2ec]">{waterAmount} / 3.0 л</span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#06b6d4] to-[#38bdf8] rounded-full transition-all duration-300 shadow-[0_0_10px_#06b6d4]"
              style={{ width: `${Math.min(100, (waterAmount / 3.0) * 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-[#8690a2]">Стакан после сна выпит</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => handleAddWater(0.25)}
                className="px-2.5 py-1 rounded-lg bg-[#06b6d4]/15 hover:bg-[#06b6d4]/25 text-[#22d3ee] text-xs font-semibold border border-[#06b6d4]/30"
              >
                +250 мл
              </button>
              <button
                onClick={() => handleAddWater(0.5)}
                className="px-2.5 py-1 rounded-lg bg-[#06b6d4]/15 hover:bg-[#06b6d4]/25 text-[#22d3ee] text-xs font-semibold border border-[#06b6d4]/30"
              >
                +500 мл
              </button>
            </div>
          </div>
        </div>

        {/* Sleep & Awakening Schedule */}
        <div className="p-4 rounded-2xl bg-[#151821] border border-white/[0.06] shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#a078ff]">
              <span className="material-symbols-outlined text-[20px]">bedtime</span>
              <span>Режим сна & пробуждения</span>
            </div>
            <span className="text-xs font-bold text-[#d0bcff]">91% качество</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.04]">
              <div className="text-[10px] text-[#8690a2]">Цель отбоя</div>
              <div className="font-headline text-sm font-bold text-[#e1e2ec]">
                {sleep.targetBedtime}
              </div>
            </div>
            <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.04]">
              <div className="text-[10px] text-[#8690a2]">Пробуждение</div>
              <div className="font-headline text-sm font-bold text-[#06b6d4]">
                {sleep.targetWakeTime}
              </div>
            </div>
          </div>

          <div className="text-[10px] text-[#949db1] leading-tight">
            💡 {sleep.statusNote}
          </div>
        </div>
      </div>

      {/* Weather Analysis for Workouts (Анализ погоды для активности) */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#161a26] to-[#12151e] border border-white/[0.08] shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-300 text-[22px]">wb_sunny</span>
            <div>
              <div className="font-headline text-xs font-bold text-[#e1e2ec]">
                Погода & Уличная активность ({weather.city})
              </div>
              <div className="text-[10px] text-[#8690a2]">{weather.condition}</div>
            </div>
          </div>
          <div className="font-headline text-lg font-bold text-[#e1e2ec]">
            {weather.temperature}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 rounded-xl bg-white/[0.03]">
            <div className="text-[10px] text-[#8690a2]">Влажность</div>
            <div className="font-bold text-[#e1e2ec]">{weather.humidity}</div>
          </div>
          <div className="p-2 rounded-xl bg-white/[0.03]">
            <div className="text-[10px] text-[#8690a2]">Качество воздуха</div>
            <div className="font-bold text-[#10b981]">{weather.aqi}</div>
          </div>
          <div className="p-2 rounded-xl bg-white/[0.03]">
            <div className="text-[10px] text-[#8690a2]">Ветер</div>
            <div className="font-bold text-[#e1e2ec]">{weather.windSpeed}</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2">
          <span className="material-symbols-outlined text-[18px] shrink-0">directions_run</span>
          <span><strong>AI Анализ погоды:</strong> {weather.workoutAdvice}</span>
        </div>
      </div>
    </div>
  );
};
