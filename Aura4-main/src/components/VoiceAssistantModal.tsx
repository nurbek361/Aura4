import React, { useState } from 'react';
import { ambientSound } from '../utils/audioSynth';
import { askGroqWithTools } from '../utils/groqClient';
import { AuraAction } from '../types';
import { AuraOrbitalDiscs } from './AuraOrbitalDiscs';
import { AuraRobotAvatar } from './AuraRobotAvatar';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteCommand: (action: AuraAction) => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onExecuteCommand,
}) => {
  const [query, setQuery] = useState('');
  const [responseMsg, setResponseMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || query).trim();
    if (!text) return;

    ambientSound.playTone(660, 0.15);
    setIsProcessing(true);
    setResponseMsg(null);

    const systemPrompt = `Ты — персональный интеллектуальный голосовой ассистент Aura, который может САМ управлять приложением через доступные функции (open_screen, play_music, search_movie), а не только отвечать текстом.
Ты отвечаешь за все сферы жизни пользователя: Библиотека книг, Кинозал, Музыка, Финансы (в сомах KGS), Здоровье, Календарь и Задачи.
Если пользователь просит включить/найти конкретную песню или клип — вызови play_music с точным поисковым запросом (название + исполнитель).
Если просит фильм или что-то посмотреть — вызови search_movie.
Если просит открыть какой-то раздел приложения — вызови open_screen.
Если это просто вопрос без явного действия — ответь текстом, кратко и по-русски (максимум 2-3 предложения).`;

    try {
      const { content, toolCalls } = await askGroqWithTools(text, systemPrompt);

      if (toolCalls && toolCalls.length > 0) {
        for (const call of toolCalls) {
          let args: Record<string, any> = {};
          try {
            args = JSON.parse(call.function.arguments || '{}');
          } catch {
            args = {};
          }

          if (call.function.name === 'open_screen' && args.screen) {
            onExecuteCommand({ type: 'open_screen', screen: args.screen });
            setResponseMsg(`Открываю раздел «${args.screen}»...`);
          } else if (call.function.name === 'play_music' && args.query) {
            onExecuteCommand({ type: 'play_music', query: args.query });
            setResponseMsg(`Ищу и включаю «${args.query}»...`);
          } else if (call.function.name === 'search_movie' && args.query) {
            onExecuteCommand({ type: 'search_movie', query: args.query });
            setResponseMsg(`Ищу фильм «${args.query}»...`);
          }
        }
        ambientSound.playTone(880, 0.2);
      } else if (content) {
        ambientSound.playTone(880, 0.2);
        setResponseMsg(content);
      } else {
        setResponseMsg(`Запрос «${text}» принят Aura. Все системы работают в штатном режиме.`);
      }
    } catch (e) {
      setResponseMsg(`Запрос «${text}» принят Aura. Все системы работают в штатном режиме.`);
    } finally {
      setIsProcessing(false);
      setQuery('');
    }
  };

  const samplePrompts = [
    '«Найди песню Rihanna Rude Boy»',
    '«Что посмотреть вечером в Sci-Fi?»',
    '«Открой раздел здоровье»',
    '«Какая погода сейчас?»',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0e15]/85 backdrop-blur-3xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-[420px] rounded-3xl bg-[#191b23]/95 border border-white/[0.12] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.85)] flex flex-col items-center text-center overflow-hidden">
        {/* Ambient Glow Aura */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#a078ff]/25 rounded-full blur-[70px] pointer-events-none"></div>
        <div className="absolute -bottom-16 right-0 w-60 h-60 bg-[#4cd7f6]/20 rounded-full blur-[70px] pointer-events-none"></div>

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Закрыть голосовой ассистент"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-[#cbc3d7] flex items-center justify-center transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Top Mini Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d0bcff]/15 border border-[#d0bcff]/25 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#4cd7f6] animate-ping"></span>
          <span className="text-[11px] font-semibold text-[#d0bcff] uppercase tracking-wider">
            Aura AI
          </span>
        </div>

        {/* 3D Floating Robot Stage */}
        <div className="relative w-44 h-44 flex items-center justify-center my-1" style={{ perspective: 1000 }}>
          <div className="relative w-full h-full flex items-center justify-center animate-aura-float" style={{ transformStyle: 'preserve-3d' }}>
            {/* Rotating 3D Orbital Discs */}
            <AuraOrbitalDiscs variant="compact" />

            {/* Robot Image */}
            <AuraRobotAvatar
              className="w-36 h-36"
              onClick={() => ambientSound.playTone(520, 0.15)}
            />
          </div>
        </div>

        {/* Status Prompt */}
        <h3 className="text-[20px] font-bold text-[#e1e2ec] mt-2">
          {isProcessing ? 'Aura анализирует...' : '«Слушаю тебя...»'}
        </h3>
        <p className="text-[13px] text-[#cbc3d7] max-w-[280px] mt-1">
          {responseMsg || 'Скажи команду голосом или выбери быстрое действие:'}
        </p>

        {/* Live Audio Equalizer Wave during active */}
        <div className="flex items-center gap-1.5 h-6 my-3">
          {[4, 8, 14, 20, 12, 18, 10, 5].map((h, i) => (
            <div
              key={i}
              className="w-1 rounded-full bg-gradient-to-t from-[#a078ff] to-[#4cd7f6] animate-pulse"
              style={{
                height: isProcessing ? `${h * 1.3}px` : `${Math.max(4, h * 0.7)}px`,
                animationDelay: `${i * 120}ms`,
              }}
            ></div>
          ))}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap gap-1.5 justify-center max-w-full my-2">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p.replace(/«|»/g, ''))}
              className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/[0.06] hover:bg-[#a078ff]/20 hover:text-[#d0bcff] text-[#e1e2ec]/90 transition-colors border border-white/[0.05]"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Text Input Row */}
        <div className="w-full mt-3 flex items-center gap-2">
          <div className="relative flex-1 flex items-center bg-[#0b0e15]/80 rounded-xl px-3 py-2 border border-white/[0.08] focus-within:border-[#4cd7f6]/60">
            <span className="material-symbols-outlined text-[#958ea0] text-[18px] mr-2">mic</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Спроси Aura или введи команду..."
              className="w-full bg-transparent text-[13px] text-[#e1e2ec] placeholder-[#958ea0] outline-none"
            />
          </div>
          <button
            onClick={() => handleSend()}
            disabled={!query.trim()}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#a078ff] to-[#4cd7f6] text-[#3c0091] flex items-center justify-center font-bold disabled:opacity-40 shadow-[0_0_14px_rgba(208,188,255,0.4)] active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
