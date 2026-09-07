import React from 'react';
import { ASSETS } from '../data/mockData';
import { NavigationTab } from '../types';
import { ambientSound } from '../utils/audioSynth';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentTab,
  onSelectTab,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0e15]/85 backdrop-blur-2xl">
      <div className="relative w-full max-w-[390px] rounded-3xl bg-[#191b23] border border-white/[0.12] p-5 shadow-2xl flex flex-col space-y-4 text-left">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#d0bcff] flex items-center justify-center text-[#3c0091] shadow-[0_0_16px_rgba(208,188,255,0.4)]">
              <span className="material-symbols-outlined text-[26px]">person</span>
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-[#e1e2ec]">Нурбек</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
                <span className="text-[11px] font-semibold text-[#4edea3]">Aura AI Master</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-[#cbc3d7] flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* System Specs Status */}
        <div className="p-3 rounded-2xl bg-[#0b0e15]/80 border border-white/[0.06] space-y-2">
          <div className="flex justify-between items-center text-[12px]">
            <span className="text-[#cbc3d7]">Операционная среда</span>
            <span className="text-[#4cd7f6] font-semibold">Aura Life OS v2.4</span>
          </div>
          <div className="flex justify-between items-center text-[12px]">
            <span className="text-[#cbc3d7]">Аудио ядро</span>
            <span className="text-[#d0bcff] font-semibold">Lossless 24-bit • 96kHz</span>
          </div>
          <div className="flex justify-between items-center text-[12px]">
            <span className="text-[#cbc3d7]">Синхронизация</span>
            <span className="text-[#4edea3] font-semibold">Локально &amp; Облако</span>
          </div>
        </div>

        {/* Quick Navigation Jump */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-[#958ea0] uppercase tracking-wider">
            Быстрый переход к экранам
          </span>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'home', label: 'Home Center', icon: 'bubble_chart', color: '#d0bcff' },
              { id: 'cinema', label: 'Cinema', icon: 'movie', color: '#4cd7f6' },
              { id: 'music', label: 'Music Player', icon: 'headphones', color: '#a078ff' },
              { id: 'hub', label: 'Modules Hub', icon: 'grid_view', color: '#4edea3' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  ambientSound.playTone(500, 0.1);
                  onSelectTab(s.id as NavigationTab);
                  onClose();
                }}
                className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all text-left ${
                  currentTab === s.id
                    ? 'bg-[#d0bcff]/20 border-[#d0bcff]/40 text-[#d0bcff]'
                    : 'bg-[#1d1f27] border-white/[0.05] text-[#e1e2ec] hover:bg-[#272a32]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]" style={{ color: s.color }}>
                  {s.icon}
                </span>
                <span className="text-[12px] font-semibold">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Ambient sound preview test */}
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.05]">
          <span className="text-[12px] text-[#cbc3d7]">Звуковой тест Aura Chime</span>
          <button
            onClick={() => ambientSound.playTone(528, 0.3)}
            className="px-3 py-1 rounded-xl bg-[#272a32] text-[#4cd7f6] text-[11px] font-semibold hover:bg-[#32353d]"
          >
            528Hz Резонанс
          </button>
        </div>
      </div>
    </div>
  );
};
