import React from 'react';
import { ASSETS } from '../data/mockData';
import { NavigationTab } from '../types';

interface HeaderProps {
  currentTab: NavigationTab;
  userName?: string;
  onOpenProfile?: () => void;
  onOpenMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  userName = 'Нурбек',
  onOpenProfile,
  onOpenMenu,
}) => {
  const getSubTitle = () => {
    switch (currentTab) {
      case 'home':
        return 'AURA • AI OS';
      case 'calendar':
        return 'AURA • КАЛЕНДАРЬ';
      case 'reminders':
        return 'AURA • НАПОМИНАНИЯ';
      case 'finance':
        return 'AURA • ФИНАНСЫ & КАПИТАЛ';
      case 'health':
        return 'AURA • ЗДОРОВЬЕ & СПОРТ';
      case 'library':
        return 'AURA • БИБЛИОТЕКА КНИГ';
      case 'cinema':
        return 'AURA • CINEMA 4K';
      case 'music':
        return 'AURA • LOSSLESS MUSIC';
      case 'spirituality':
        return 'AURA • ДУХОВНОСТЬ & КОРАН';
      case 'achievements':
        return 'AURA • ДОСТИЖЕНИЯ';
      case 'friends':
        return 'AURA • ДРУЗЬЯ & СОЦСЕТЬ';
      case 'hub':
        return 'AURA • ВСЕ РАЗДЕЛЫ';
      case 'reports':
        return 'AURA • AI-ОТЧЕТЫ';
      default:
        return 'AURA • LIFE OS';
    }
  };

  const getMainGreeting = () => {
    if (currentTab === 'home' || currentTab === 'hub') {
      return `Привет, ${userName}`;
    }
    switch (currentTab) {
      case 'calendar':
        return 'События & Отсчет';
      case 'reminders':
        return 'Тайм-напоминания';
      case 'finance':
        return 'Учет & Лимиты ИИ';
      case 'health':
        return 'Биоритм & Планы';
      case 'library':
        return 'Книжный трекер';
      case 'spirituality':
        return 'Коран & Зикры';
      case 'achievements':
        return 'Награды & XP';
      case 'friends':
        return 'Круг общения';
      case 'reports':
        return 'Картина дня';
      default:
        return userName;
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-40 pt-safe bg-[#0b0e15]/85 backdrop-blur-2xl border-b border-white/[0.04]">
      <div className="max-w-[480px] mx-auto h-16 sm:h-20 px-3 sm:px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Menu Drawer Toggle Button */}
          <button
            onClick={onOpenMenu}
            aria-label="Открыть меню разделов"
            className="w-9 h-9 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center text-[#d0bcff] border border-white/[0.06] transition-colors active:scale-95 shadow-sm"
          >
            <span className="material-symbols-outlined text-[22px]">menu</span>
          </button>

          <img
            alt="Aura AI Life OS icon"
            className="h-8 w-8 rounded-xl object-contain shadow-[0_0_12px_rgba(160,120,255,0.25)]"
            src={ASSETS.appIcon}
          />
          <div className="flex flex-col">
            <span className="text-[9px] sm:text-[10px] font-semibold text-[#a078ff] uppercase tracking-wider">
              {getSubTitle()}
            </span>
            <span className="text-[15px] sm:text-[17px] font-semibold text-[#e1e2ec] tracking-tight leading-tight">
              {getMainGreeting()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#272a32]/60 backdrop-blur-md border border-white/[0.05]">
            <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse shadow-[0_0_8px_#4edea3]"></span>
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#4edea3]">
              Online
            </span>
          </div>

          <button
            onClick={onOpenProfile}
            aria-label="Профиль пользователя"
            className="w-8 h-8 rounded-full bg-[#d0bcff] flex items-center justify-center shrink-0 text-[#3c0091] shadow-[0_0_14px_rgba(208,188,255,0.3)] active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[19px]">person</span>
          </button>
        </div>
      </div>
    </header>
  );
};
