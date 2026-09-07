import React from 'react';
import { NavigationTab } from '../types';
import { ambientSound } from '../utils/audioSynth';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  userName?: string;
  activeRemindersCount?: number;
  unlockedAchievementsCount?: number;
}

interface MenuItem {
  id: NavigationTab;
  title: string;
  subtitle: string;
  icon: string;
  badge?: string;
  color: string;
  group: 'core' | 'life' | 'media' | 'social';
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'home',
    title: 'Главная',
    subtitle: 'AI Ассистент & Быстрый фокус',
    icon: 'bubble_chart',
    color: '#06b6d4',
    group: 'core',
  },
  {
    id: 'calendar',
    title: 'Календарь & События',
    subtitle: 'Важные даты, дни рождения, отсчет',
    icon: 'calendar_today',
    badge: '2 события',
    color: '#ec4899',
    group: 'core',
  },
  {
    id: 'reminders',
    title: 'Напоминания',
    subtitle: 'Тайм-напоминания (в 15:00 визит к врачу)',
    icon: 'alarm',
    badge: '3 сегодня',
    color: '#eab308',
    group: 'core',
  },
  {
    id: 'finance',
    title: 'Финансы & Капитал',
    subtitle: 'Доход 50k сом, лимиты, чеки, долги, ком. услуги',
    icon: 'account_balance_wallet',
    badge: 'ИИ контроль',
    color: '#10b981',
    group: 'life',
  },
  {
    id: 'health',
    title: 'Здоровье & Спорт',
    subtitle: 'План ИИ: вода, зарядка, сон, погода',
    icon: 'fitness_center',
    badge: 'План на день',
    color: '#06b6d4',
    group: 'life',
  },
  {
    id: 'library',
    title: 'Библиотека книг',
    subtitle: 'Чтение, трекинг страниц, цитаты',
    icon: 'menu_book',
    badge: '2 в процессе',
    color: '#8b5cf6',
    group: 'life',
  },
  {
    id: 'music',
    title: 'Музыка & Фокус',
    subtitle: 'Hi-Fi Lossless, винил, синтезатор',
    icon: 'headphones',
    color: '#a078ff',
    group: 'media',
  },
  {
    id: 'cinema',
    title: 'Кино & Сериалы',
    subtitle: 'Тренды, продолжить просмотр 4K',
    icon: 'movie',
    color: '#f43f5e',
    group: 'media',
  },
  {
    id: 'shorts',
    title: 'Shorts',
    subtitle: 'Короткие вертикальные видео по категориям',
    icon: 'video_camera_back',
    badge: 'Новое',
    color: '#f43f5e',
    group: 'media',
  },
  {
    id: 'news',
    title: 'Новости',
    subtitle: 'Google News • Кыргызстан, в реальном времени',
    icon: 'newspaper',
    color: '#06b6d4',
    group: 'life',
  },
  {
    id: 'spirituality',
    title: 'Духовность & Коран',
    subtitle: 'Суры, чтение аятов, переводы, зикры',
    icon: 'auto_stories',
    color: '#10b981',
    group: 'social',
  },
  {
    id: 'achievements',
    title: 'Достижения & Ачивки',
    subtitle: 'Награды за задачи, воду, спорт и финансы',
    icon: 'military_tech',
    badge: 'Топ 14%',
    color: '#eab308',
    group: 'social',
  },
  {
    id: 'friends',
    title: 'Друзья & Соцсеть',
    subtitle: 'Добавление друзей, совместные ачивки',
    icon: 'group',
    badge: '4 друга',
    color: '#06b6d4',
    group: 'social',
  },
];

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  currentTab,
  onSelectTab,
  userName = 'Нурбек',
  activeRemindersCount = 3,
  unlockedAchievementsCount = 14,
}) => {
  if (!isOpen) return null;

  const handleItemClick = (tab: NavigationTab) => {
    ambientSound.playTone(520, 0.08);
    onSelectTab(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Slide-out Menu Panel */}
      <div className="relative z-10 w-full max-w-[340px] sm:max-w-[360px] h-full bg-[#0d1017] border-r border-white/[0.08] shadow-[0_0_50px_rgba(0,0,0,0.85)] flex flex-col pt-safe pb-safe overflow-hidden animate-in slide-in-from-left duration-300">
        {/* Top Header Card */}
        <div className="p-5 border-b border-white/[0.06] bg-gradient-to-b from-[#161a24] to-[#0d1017]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#a078ff]/20 border border-[#a078ff]/40 flex items-center justify-center text-[#d0bcff] shadow-[0_0_16px_rgba(160,120,255,0.3)]">
                <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
              </div>
              <div>
                <h2 className="font-headline text-base font-bold text-[#e1e2ec] tracking-tight">
                  Aura Life OS
                </h2>
                <span className="text-[11px] text-[#949db1] font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
                  Система упорядочена
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-[#949db1] hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* User Quick Info */}
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#d0bcff] flex items-center justify-center text-[#3c0091] font-bold text-xs">
                {userName.charAt(0)}
              </div>
              <div>
                <div className="text-xs font-semibold text-[#e1e2ec]">{userName}</div>
                <div className="text-[10px] text-[#949db1]">Уровень 14 • Стрик 18 дней</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#eab308]/20 text-[#fde047] text-[10px] font-bold">
              {unlockedAchievementsCount} ачивок
            </span>
          </div>
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 no-scrollbar">
          {/* Main Core Section */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold text-[#697285] uppercase tracking-wider">
              Главное & Планирование
            </div>
            <div className="space-y-1">
              {MENU_ITEMS.filter((i) => i.group === 'core').map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 text-left ${
                      isActive
                        ? 'bg-[#a078ff]/15 border border-[#a078ff]/40 text-white shadow-[0_0_12px_rgba(160,120,255,0.2)]'
                        : 'text-[#cbc3d7] hover:bg-white/[0.04] hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: `${item.color}20`,
                          color: item.color,
                        }}
                      >
                        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                      </div>
                      <div className="truncate">
                        <div className="font-headline text-xs font-semibold truncate">
                          {item.title}
                        </div>
                        <div className="text-[10px] text-[#8690a2] truncate">{item.subtitle}</div>
                      </div>
                    </div>
                    {item.badge && (
                      <span className="ml-2 shrink-0 px-2 py-0.5 rounded-md bg-white/[0.06] text-[10px] font-medium text-[#949db1]">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Life & Routine Section */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold text-[#697285] uppercase tracking-wider">
              Жизнь, Финансы & Здоровье
            </div>
            <div className="space-y-1">
              {MENU_ITEMS.filter((i) => i.group === 'life').map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 text-left ${
                      isActive
                        ? 'bg-[#a078ff]/15 border border-[#a078ff]/40 text-white shadow-[0_0_12px_rgba(160,120,255,0.2)]'
                        : 'text-[#cbc3d7] hover:bg-white/[0.04] hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: `${item.color}20`,
                          color: item.color,
                        }}
                      >
                        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                      </div>
                      <div className="truncate">
                        <div className="font-headline text-xs font-semibold truncate">
                          {item.title}
                        </div>
                        <div className="text-[10px] text-[#8690a2] truncate">{item.subtitle}</div>
                      </div>
                    </div>
                    {item.badge && (
                      <span className="ml-2 shrink-0 px-2 py-0.5 rounded-md bg-[#10b981]/20 text-[#34d399] text-[10px] font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Media & Focus */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold text-[#697285] uppercase tracking-wider">
              Медиа & Развлечения
            </div>
            <div className="space-y-1">
              {MENU_ITEMS.filter((i) => i.group === 'media').map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 text-left ${
                      isActive
                        ? 'bg-[#a078ff]/15 border border-[#a078ff]/40 text-white shadow-[0_0_12px_rgba(160,120,255,0.2)]'
                        : 'text-[#cbc3d7] hover:bg-white/[0.04] hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: `${item.color}20`,
                          color: item.color,
                        }}
                      >
                        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                      </div>
                      <div className="truncate">
                        <div className="font-headline text-xs font-semibold truncate">
                          {item.title}
                        </div>
                        <div className="text-[10px] text-[#8690a2] truncate">{item.subtitle}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Social & Spirit */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold text-[#697285] uppercase tracking-wider">
              Духовность & Социум
            </div>
            <div className="space-y-1">
              {MENU_ITEMS.filter((i) => i.group === 'social').map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 text-left ${
                      isActive
                        ? 'bg-[#a078ff]/15 border border-[#a078ff]/40 text-white shadow-[0_0_12px_rgba(160,120,255,0.2)]'
                        : 'text-[#cbc3d7] hover:bg-white/[0.04] hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: `${item.color}20`,
                          color: item.color,
                        }}
                      >
                        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                      </div>
                      <div className="truncate">
                        <div className="font-headline text-xs font-semibold truncate">
                          {item.title}
                        </div>
                        <div className="text-[10px] text-[#8690a2] truncate">{item.subtitle}</div>
                      </div>
                    </div>
                    {item.badge && (
                      <span className="ml-2 shrink-0 px-2 py-0.5 rounded-md bg-[#eab308]/20 text-[#fde047] text-[10px] font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Status Footer */}
        <div className="p-4 border-t border-white/[0.06] bg-[#0b0e15] flex items-center justify-between text-xs text-[#949db1]">
          <span>Aura v3.2 • Unified OS</span>
          <span className="text-[#06b6d4] font-medium">Bishkek / Almaty</span>
        </div>
      </div>
    </div>
  );
};
