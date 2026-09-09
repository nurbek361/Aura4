import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ALL_SURAHS_LIST, fetchSurahData, SurahDetail } from '../data/quranData';
import { ambientSound } from '../utils/audioSynth';
import { CircularProgress } from './CircularProgress';

type ScriptMode = 'latin' | 'cyrillic';

const formatTime = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export const SpiritualityScreen: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedNumber, setSelectedNumber] = useState<number>(1);
  const [surahDetail, setSurahDetail] = useState<SurahDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [scriptMode, setScriptMode] = useState<ScriptMode>('latin');
  const [showTranslation, setShowTranslation] = useState(true);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [tasbihCount, setTasbihCount] = useState(33);
  const [currentDhikr] = useState('Субханаллах');

  const filteredSurahs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ALL_SURAHS_LIST;
    return ALL_SURAHS_LIST.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.russianName.toLowerCase().includes(q) ||
        String(s.number).includes(q)
    );
  }, [search]);

  // Load surah content (Arabic, translation, Latin transliteration, Cyrillic
  // reading, audio URL) whenever the selection changes.
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);
    setIsPlaying(false);
    setCurrentTime(0);

    fetchSurahData(selectedNumber)
      .then((data) => {
        if (!cancelled) setSurahDetail(data);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err?.message || 'Не удалось загрузить суру');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedNumber]);

  // Keep the <audio> element in sync with isPlaying.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, surahDetail?.audioUrl]);

  const handleSelectSurah = (number: number) => {
    ambientSound.playTone(500, 0.08);
    setSelectedNumber(number);
  };

  const handleTogglePlay = () => {
    ambientSound.playTone(isPlaying ? 400 : 620, 0.08);
    setIsPlaying((p) => !p);
  };

  const handleTasbihTap = () => {
    ambientSound.playTone(560, 0.06);
    setTasbihCount((prev) => prev + 1);
  };

  const handleResetTasbih = () => {
    ambientSound.playTone(400, 0.08);
    setTasbihCount(0);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-[#10b981] uppercase tracking-wider">
            Покой & Осознанность
          </span>
          <h1 className="font-headline text-2xl font-bold text-[#e1e2ec] tracking-tight">
            Духовность & Коран
          </h1>
        </div>

        <div className="px-3 py-1 rounded-full bg-[#10b981]/15 border border-[#10b981]/30 text-xs font-semibold text-[#34d399] flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px]">menu_book</span>
          <span>114 сур</span>
        </div>
      </div>

      {/* Hero Ayah of the Day */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-[#122920] via-[#131e1c] to-[#12151e] border border-[#10b981]/40 shadow-xl space-y-3 relative overflow-hidden hover-glow" style={{ ['--glow-color' as any]: '#10b981' }}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-[#34d399] uppercase tracking-wider">
            Аят дня • Сура Аль-Бакара 2:286
          </span>
          <span className="text-xs text-[#8690a2]">Чтение & Размышление</span>
        </div>

        <div className="py-2 text-right font-serif text-xl sm:text-2xl text-[#f3e8ff] leading-loose tracking-wide" style={{ direction: 'rtl' }}>
          لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا
        </div>

        <div className="text-xs sm:text-sm text-[#e1e2ec] font-medium leading-relaxed italic border-t border-white/[0.06] pt-2.5">
          «Аллах не возлагает на душу сверх ее возможностей. Ей достанется то, что она приобрела, и против нее будет то, что она приобрела...»
        </div>
      </div>

      {/* Audio Player Card */}
      <div className="p-4 rounded-2xl bg-[#151821] border border-white/[0.06] shadow-md space-y-3">
        <div className="flex items-center gap-3">
          <button
            onClick={handleTogglePlay}
            disabled={!surahDetail}
            className="tap-ripple disabled:opacity-40"
            aria-label={isPlaying ? 'Пауза' : 'Слушать чтение суры'}
          >
            <CircularProgress percent={progressPercent} size={58} strokeWidth={5} color="#10b981">
              <span className="material-symbols-outlined text-[24px] text-[#34d399]">
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            </CircularProgress>
          </button>

          <div className="flex-1 min-w-0">
            <div className="font-headline text-sm font-bold text-[#e1e2ec] truncate">
              {surahDetail ? `${surahDetail.number}. ${surahDetail.russianName || surahDetail.name}` : 'Загрузка...'}
            </div>
            <div className="text-[11px] text-[#8690a2]">Чтец: Мишари Рашид аль-Афаси</div>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#10b981] to-[#34d399] rounded-full"
                  style={{ width: `${progressPercent}%`, transition: 'width 0.2s linear' }}
                />
              </div>
              <span className="text-[10px] text-[#8690a2] tabular-nums shrink-0">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>

        {surahDetail?.audioUrl && (
          <audio
            ref={audioRef}
            src={surahDetail.audioUrl}
            preload="none"
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onEnded={() => {
              setIsPlaying(false);
              setCurrentTime(0);
            }}
          />
        )}
      </div>

      {/* Interactive Tasbih Counter */}
      <div className="p-4 rounded-2xl bg-[#151821] border border-white/[0.06] shadow-md flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#e1e2ec]">Электронный тасбих</span>
            <span className="text-[10px] text-[#34d399] bg-[#10b981]/15 px-2 py-0.5 rounded-full font-semibold">
              {currentDhikr}
            </span>
          </div>
          <div className="text-[11px] text-[#8690a2] mt-0.5">
            Нажмите для зикра (каждые 33 повторения)
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTasbihTap}
            className="tap-ripple w-14 h-14 rounded-2xl bg-gradient-to-br from-[#10b981] to-[#059669] text-black font-extrabold font-headline text-lg shadow-[0_0_18px_rgba(16,185,129,0.4)] active:scale-90 transition-all flex flex-col items-center justify-center"
          >
            <span>{tasbihCount}</span>
            <span className="text-[8px] font-normal uppercase tracking-tight">Тап</span>
          </button>

          <button
            onClick={handleResetTasbih}
            className="tap-ripple p-2 rounded-xl text-[#8690a2] hover:text-white bg-white/[0.04]"
            title="Сбросить счетчик"
          >
            <span className="material-symbols-outlined text-[18px]">restart_alt</span>
          </button>
        </div>
      </div>

      {/* Ayah reader for the selected surah */}
      <div className="rounded-2xl bg-[#151821] border border-white/[0.06] shadow-md overflow-hidden">
        <div className="p-3.5 border-b border-white/[0.06] flex items-center justify-between gap-2 flex-wrap">
          <div className="font-headline text-xs font-bold text-[#e1e2ec]">
            Чтение с транслитерацией
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setScriptMode('latin')}
              className={`tap-ripple px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors ${
                scriptMode === 'latin'
                  ? 'bg-[#10b981]/20 text-[#34d399] border border-[#10b981]/40'
                  : 'bg-white/[0.04] text-[#8690a2] border border-transparent'
              }`}
            >
              Латиница
            </button>
            <button
              onClick={() => setScriptMode('cyrillic')}
              className={`tap-ripple px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors ${
                scriptMode === 'cyrillic'
                  ? 'bg-[#10b981]/20 text-[#34d399] border border-[#10b981]/40'
                  : 'bg-white/[0.04] text-[#8690a2] border border-transparent'
              }`}
            >
              Кириллица
            </button>
            <button
              onClick={() => setShowTranslation((v) => !v)}
              className={`tap-ripple px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors ${
                showTranslation
                  ? 'bg-[#a078ff]/20 text-[#d0bcff] border border-[#a078ff]/40'
                  : 'bg-white/[0.04] text-[#8690a2] border border-transparent'
              }`}
            >
              Перевод
            </button>
          </div>
        </div>

        <div key={selectedNumber} className="max-h-[360px] overflow-y-auto no-scrollbar p-3.5 space-y-4 animate-rise-in">
          {isLoading && (
            <div className="py-8 text-center text-xs text-[#8690a2]">Загрузка аятов...</div>
          )}

          {!isLoading && loadError && (
            <div className="py-8 text-center text-xs text-[#f43f5e]">{loadError}</div>
          )}

          {!isLoading &&
            !loadError &&
            surahDetail?.ayahs.map((ayah) => (
              <div key={ayah.numberInSurah} className="pb-3.5 border-b border-white/[0.04] last:border-0 last:pb-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-5 h-5 rounded-full bg-white/[0.06] text-[10px] font-bold text-[#34d399] flex items-center justify-center shrink-0">
                    {ayah.numberInSurah}
                  </span>
                  <div className="h-px flex-1 bg-white/[0.05]" />
                </div>

                <div className="text-right font-serif text-lg text-[#f3e8ff] leading-loose" style={{ direction: 'rtl' }}>
                  {ayah.arabic}
                </div>

                <div className="text-xs text-[#a3d9c9] italic mt-1.5 leading-relaxed">
                  {scriptMode === 'latin' ? ayah.transliteration : ayah.cyrillicTranscription || ayah.transliteration}
                </div>

                {showTranslation && (
                  <div className="text-[11px] text-[#c3c8d4] mt-1.5 leading-relaxed">{ayah.russian}</div>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Surahs Catalog with search */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="text-xs font-semibold text-[#8690a2]">Суры Корана</div>
        </div>

        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#697285]">
            search
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск суры по названию или номеру..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#151821] border border-white/[0.06] text-xs text-[#e1e2ec] placeholder:text-[#697285] focus:outline-none focus:border-[#10b981]/50"
          />
        </div>

        <div className="space-y-2">
          {filteredSurahs.map((surah) => {
            const isSelected = selectedNumber === surah.number;
            return (
              <div
                key={surah.number}
                onClick={() => handleSelectSurah(surah.number)}
                className={`tap-ripple hover-lift p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#10b981]/15 border-[#10b981]/50 shadow-[0_0_14px_rgba(16,185,129,0.2)]'
                    : 'bg-[#151821] border-white/[0.06] hover:border-white/[0.12]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center font-bold text-xs text-[#34d399]">
                    {surah.number}
                  </div>
                  <div>
                    <div className="font-headline text-xs font-bold text-[#e1e2ec] flex items-center gap-2">
                      <span>{surah.name}</span>
                      <span className="text-[11px] text-[#8690a2] font-normal">({surah.russianName})</span>
                    </div>
                    <div className="text-[10px] text-[#8690a2]">
                      {surah.ayahCount} аятов • {surah.revelationType}
                    </div>
                  </div>
                </div>

                <div className="text-right flex items-center gap-2">
                  {isSelected && isPlaying && (
                    <span className="material-symbols-outlined text-[16px] text-[#34d399] animate-pulse">
                      graphic_eq
                    </span>
                  )}
                  <div className="font-serif text-sm text-[#34d399] tracking-wider">{surah.arabicName}</div>
                </div>
              </div>
            );
          })}

          {filteredSurahs.length === 0 && (
            <div className="py-6 text-center text-xs text-[#8690a2]">Ничего не найдено</div>
          )}
        </div>
      </div>
    </div>
  );
};
