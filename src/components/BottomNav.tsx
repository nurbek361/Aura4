import React from 'react';
import { NavigationTab } from '../types';

interface BottomNavProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenVoiceAssistant: () => void;
  isVoiceActive?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenVoiceAssistant,
  isVoiceActive = false,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full z-40 pb-safe pointer-events-none flex justify-center items-center px-4 mb-3.5">
      <div className="pointer-events-auto flex items-center justify-between w-full max-w-[440px] px-2 py-1.5 rounded-full bg-[#0b0e15]/90 backdrop-blur-2xl border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.8)]">
        {/* Aura Home Tab */}
        <button
          onClick={() => onSelectTab('home')}
          aria-label="Aura Home AI Center"
          className={`flex flex-col items-center justify-center min-w-[50px] min-h-[48px] rounded-full transition-all duration-300 ${
            currentTab === 'home'
              ? 'text-[#d0bcff] bg-[#a078ff]/20 shadow-[0_0_16px_rgba(208,188,255,0.35)]'
              : 'text-[#cbc3d7]/70 hover:text-[#e1e2ec]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">bubble_chart</span>
          <span className="text-[10px] font-semibold tracking-tight mt-0.5">Aura</span>
        </button>

        {/* Cinema Tab */}
        <button
          onClick={() => onSelectTab('cinema')}
          aria-label="Cinema"
          className={`flex flex-col items-center justify-center min-w-[50px] min-h-[48px] rounded-full transition-all duration-300 ${
            currentTab === 'cinema'
              ? 'text-[#d0bcff] bg-[#a078ff]/20 shadow-[0_0_16px_rgba(208,188,255,0.35)]'
              : 'text-[#cbc3d7]/70 hover:text-[#e1e2ec]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">movie</span>
          <span className="text-[10px] font-semibold tracking-tight mt-0.5">Cinema</span>
        </button>

        {/* Center Floating Voice Prompt Button */}
        <div className="relative -top-2.5 px-1">
          <button
            onClick={onOpenVoiceAssistant}
            aria-label="Aura Voice AI Prompt"
            className={`flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-gradient-to-tr from-[#a078ff] via-[#d0bcff] to-[#4cd7f6] shadow-[0_0_24px_rgba(208,188,255,0.5)] transition-all duration-300 active:scale-90 ${
              isVoiceActive ? 'ring-4 ring-[#4cd7f6]/60 scale-105 animate-pulse' : ''
            }`}
          >
            <span className="material-symbols-outlined text-[#3c0091] text-[26px] font-semibold animate-pulse">
              graphic_eq
            </span>
          </button>
        </div>

        {/* Music Tab */}
        <button
          onClick={() => onSelectTab('music')}
          aria-label="Music"
          className={`flex flex-col items-center justify-center min-w-[50px] min-h-[48px] rounded-full transition-all duration-300 ${
            currentTab === 'music'
              ? 'text-[#d0bcff] bg-[#a078ff]/20 shadow-[0_0_16px_rgba(208,188,255,0.35)]'
              : 'text-[#cbc3d7]/70 hover:text-[#e1e2ec]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">headphones</span>
          <span className="text-[10px] font-semibold tracking-tight mt-0.5">Music</span>
        </button>

        {/* Hub Tab */}
        <button
          onClick={() => onSelectTab('hub')}
          aria-label="Modules Hub"
          className={`flex flex-col items-center justify-center min-w-[50px] min-h-[48px] rounded-full transition-all duration-300 ${
            currentTab === 'hub'
              ? 'text-[#d0bcff] bg-[#a078ff]/20 shadow-[0_0_16px_rgba(208,188,255,0.35)]'
              : 'text-[#cbc3d7]/70 hover:text-[#e1e2ec]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">grid_view</span>
          <span className="text-[10px] font-semibold tracking-tight mt-0.5">Hub</span>
        </button>
      </div>
    </nav>
  );
};
