import React, { useEffect, useState } from 'react';
import { ambientSound } from '../utils/audioSynth';

interface ShortItem {
  id: string;
  youtubeId: string;
  title: string;
  author: string;
  thumbnail: string;
  views?: string;
  duration?: string;
}

const CATEGORIES = ['Продуктивность', 'Мотивация', 'Ислам', 'Финансы', 'Юмор', 'Спорт'];

// Curated fallback so the feed is never empty if the search API is
// unreachable (e.g. offline preview) — swapped out the instant a live
// search succeeds.
const FALLBACK_SHORTS: ShortItem[] = [
  {
    id: 'fb-1',
    youtubeId: 'jfKfPfyJRdk',
    title: 'Lofi Focus Beats',
    author: 'Lofi Girl',
    thumbnail: 'https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg',
  },
];

export const ShortsScreen: React.FC = () => {
  const [category, setCategory] = useState('Продуктивность');
  const [shorts, setShorts] = useState<ShortItem[]>(FALLBACK_SHORTS);
  const [isLoading, setIsLoading] = useState(false);
  const [activeShort, setActiveShort] = useState<ShortItem | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    fetch(`/api/youtube/search?q=${encodeURIComponent(category)}&type=shorts`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('fail'))))
      .then((data) => {
        if (!cancelled && Array.isArray(data.items) && data.items.length > 0) {
          setShorts(data.items);
        }
      })
      .catch(() => {
        // keep whatever was already showing
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [category]);

  const handleHideShort = (id: string) => {
    ambientSound.playTone(320, 0.08);
    setRemovingId(id);
    window.setTimeout(() => {
      setShorts((prev) => prev.filter((s) => s.id !== id));
      setRemovingId(null);
    }, 420);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div>
        <span className="text-[11px] font-semibold text-[#f43f5e] uppercase tracking-wider">
          Быстрые видео
        </span>
        <h1 className="font-headline text-2xl font-bold text-[#e1e2ec] tracking-tight">Shorts</h1>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => {
              ambientSound.playTone(500, 0.07);
              setCategory(c);
            }}
            className={`tap-ripple shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              category === c
                ? 'bg-[#f43f5e]/20 text-[#fb7185] border-[#f43f5e]/40'
                : 'bg-white/[0.04] text-[#8690a2] border-white/[0.06] hover:text-white'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {isLoading && <div className="text-center text-xs text-[#8690a2] py-2">Загрузка Shorts...</div>}

      {/* Vertical 9:16 grid */}
      <div className="grid grid-cols-2 gap-3">
        {shorts.map((s) => (
          <div
            key={s.id}
            className={`hover-lift tap-ripple relative rounded-2xl overflow-hidden border border-white/[0.06] bg-[#151821] aspect-[9/16] cursor-pointer group ${
              removingId === s.id ? 'animate-dissolve-out' : ''
            }`}
            onClick={() => {
              ambientSound.playTone(560, 0.08);
              setActiveShort(s);
            }}
          >
            <img
              src={s.thumbnail}
              alt={s.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/40" />

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleHideShort(s.id);
              }}
              className="tap-ripple absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white z-10"
              aria-label="Скрыть"
            >
              <span className="material-symbols-outlined text-[15px]">close</span>
            </button>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-[36px] text-white drop-shadow-lg">play_circle</span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-2.5">
              <div className="text-[11px] font-semibold text-white line-clamp-2 leading-snug">{s.title}</div>
              <div className="text-[9px] text-white/60 mt-0.5">{s.author}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen-ish vertical player modal */}
      {activeShort && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveShort(null)}
        >
          <div
            className="relative w-full max-w-[380px] aspect-[9/16] rounded-3xl overflow-hidden bg-black shadow-2xl animate-rise-in"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${activeShort.youtubeId}?autoplay=1&playsinline=1&loop=1&playlist=${activeShort.youtubeId}`}
              title={activeShort.title}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
            <button
              onClick={() => setActiveShort(null)}
              className="tap-ripple absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 flex items-center justify-center text-white z-10"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
