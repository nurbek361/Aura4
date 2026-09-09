import React, { useState } from 'react';
import { AchievementItem } from '../types';
import { INITIAL_ACHIEVEMENTS } from '../data/mockData';
import { ambientSound } from '../utils/audioSynth';

const TIER_STYLES: Record<AchievementItem['badgeTier'], { ring: string; glow: string; fill: string }> = {
  gold: {
    ring: 'from-[#f7d774] via-[#eab308] to-[#b45309]',
    glow: 'shadow-[0_0_18px_rgba(234,179,8,0.45)]',
    fill: 'bg-[#eab308]/15',
  },
  silver: {
    ring: 'from-[#e6e9f0] via-[#a7b0c0] to-[#5c6578]',
    glow: 'shadow-[0_0_16px_rgba(180,190,210,0.35)]',
    fill: 'bg-[#a7b0c0]/15',
  },
  bronze: {
    ring: 'from-[#e0a978] via-[#b06a37] to-[#6b3d1f]',
    glow: 'shadow-[0_0_16px_rgba(176,106,55,0.4)]',
    fill: 'bg-[#b06a37]/15',
  },
  neon: {
    ring: 'from-[#a078ff] via-[#8b5cf6] to-[#4cd7f6]',
    glow: 'shadow-[0_0_18px_rgba(160,120,255,0.45)]',
    fill: 'bg-[#a078ff]/15',
  },
};

const CATEGORY_LABELS: Record<AchievementItem['category'], string> = {
  focus: 'Фокус & Задачи',
  finance: 'Финансы',
  health: 'Здоровье',
  reading: 'Книги',
  spirituality: 'Коран',
};

export const AchievementsScreen: React.FC = () => {
  const [achievements] = useState<AchievementItem[]>(INITIAL_ACHIEVEMENTS);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const filteredAchievements = achievements.filter((a) => {
    if (activeCategory === 'all') return true;
    return a.category === activeCategory;
  });

  // Group into medal "tiers" the way the reference design does — one row of
  // circular badges per category, locked ones shown as grey circles.
  const groupedByCategory = filteredAchievements.reduce<Record<string, AchievementItem[]>>((acc, ach) => {
    acc[ach.category] = acc[ach.category] || [];
    acc[ach.category].push(ach);
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-2 pt-1">
        <span className="text-[11px] font-semibold text-[#eab308] uppercase tracking-wider">
          Геймификация & Награды
        </span>
        <h1 className="font-headline text-2xl font-bold text-[#e1e2ec] tracking-tight">Награды</h1>
        <p className="text-[13px] text-[#8690a2]">
          Открыто {unlockedCount} из {achievements.length}
        </p>

        {/* Leaderboard pill, mirrors the reference design's "N место из M" chip */}
        <button
          className="mt-1 flex items-center gap-2 px-4 py-2 rounded-full bg-[#151821] border border-white/[0.08] text-[13px] font-semibold text-[#e1e2ec] active:scale-95 transition-transform"
          onClick={() => ambientSound.playTone(500, 0.08)}
        >
          <span className="text-[16px]">🏆</span>
          <span>Рейтинг друзей</span>
          <span className="material-symbols-outlined text-[16px] text-[#8690a2]">chevron_right</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#151821] border border-white/[0.05] overflow-x-auto no-scrollbar">
        {[
          { id: 'all', label: 'Все ачивки' },
          { id: 'finance', label: 'Финансы' },
          { id: 'health', label: 'Здоровье' },
          { id: 'focus', label: 'Фокус' },
          { id: 'reading', label: 'Книги' },
          { id: 'spirituality', label: 'Коран' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              ambientSound.playTone(500, 0.05);
              setActiveCategory(cat.id);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-[#eab308] text-[#332200] shadow-sm'
                : 'text-[#8690a2] hover:text-[#e1e2ec]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Medal Grid, grouped by category like the reference "НОВИЧОК / ОПЫТНЫЙ" sections */}
      {Object.entries(groupedByCategory).map(([category, items]) => (
        <div key={category} className="space-y-3">
          <span className="text-[11px] font-bold text-[#8690a2] uppercase tracking-[0.15em]">
            {CATEGORY_LABELS[category as AchievementItem['category']] ?? category}
          </span>

          <div className="grid grid-cols-4 gap-x-2 gap-y-4">
            {(items as AchievementItem[]).map((ach) => {
              const tier = TIER_STYLES[ach.badgeTier];
              const pct = Math.min(100, Math.round((ach.progress / ach.maxProgress) * 100));

              return (
                <button
                  key={ach.id}
                  onClick={() => ambientSound.playTone(ach.unlocked ? 720 : 420, 0.08)}
                  className="flex flex-col items-center gap-1.5 text-center"
                >
                  <div
                    className={`relative w-16 h-16 rounded-full flex items-center justify-center border ${
                      ach.unlocked
                        ? `bg-gradient-to-br ${tier.ring} border-white/20 ${tier.glow}`
                        : 'bg-[#1c1f28] border-white/[0.06]'
                    }`}
                  >
                    {ach.unlocked ? (
                      <span className={`material-symbols-outlined text-[26px] text-[#0b0e15]`}>
                        {ach.icon}
                      </span>
                    ) : (
                      <span className="material-symbols-outlined text-[22px] text-[#4b5266]">lock</span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-semibold leading-tight max-w-[70px] truncate ${
                      ach.unlocked ? 'text-[#e1e2ec]' : 'text-[#697285]'
                    }`}
                  >
                    {ach.title}
                  </span>
                  {!ach.unlocked && (
                    <span className="text-[9px] text-[#4b5266]">
                      {ach.progress}/{ach.maxProgress}
                    </span>
                  )}
                  {ach.unlocked && ach.unlockedDate && (
                    <span className="text-[9px] text-[#34d399]">{ach.unlockedDate}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {filteredAchievements.length === 0 && (
        <div className="text-center text-[13px] text-[#8690a2] py-10">
          В этой категории пока нет наград.
        </div>
      )}
    </div>
  );
};
