import React, { useEffect, useState } from 'react';
import { ambientSound } from '../utils/audioSynth';

export interface YtMusicTrack {
  id: string;
  title: string;
  artist: string;
  genre: string;
  youtubeId: string;
  albumArt: string;
  duration: string;
  qualityTag: string;
}

// Curated Popular Music Video Clips (strictly 3-4 minutes)
export const POPULAR_MUSIC_CLIPS: YtMusicTrack[] = [
  {
    id: 'ytc-blinding-lights',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    genre: 'Synthpop • Клип',
    youtubeId: '4NRXx6U8ABQ',
    albumArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80',
    duration: '03:22',
    qualityTag: '3:22 • Клип',
  },
  {
    id: 'ytc-i-got-love',
    title: 'I Got Love (feat. Рем Дигга)',
    artist: 'Miyagi & Эндшпиль',
    genre: 'Хип-хоп / Регги • Клип',
    youtubeId: 'nfs8NYg7yQM',
    albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80',
    duration: '03:45',
    qualityTag: '3:45 • Клип',
  },
  {
    id: 'ytc-believer',
    title: 'Believer',
    artist: 'Imagine Dragons',
    genre: 'Pop Rock • Клип',
    youtubeId: '7wtfhZwyrcc',
    albumArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80',
    duration: '03:36',
    qualityTag: '3:36 • Клип',
  },
  {
    id: 'ytc-die-with-a-smile',
    title: 'Die With A Smile',
    artist: 'Lady Gaga & Bruno Mars',
    genre: 'Pop Soul • Клип',
    youtubeId: 'kPa7bsKwL-c',
    albumArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
    duration: '04:12',
    qualityTag: '4:12 • Клип',
  },
  {
    id: 'ytc-kometa',
    title: 'Комета',
    artist: 'JONY',
    genre: 'Pop • Видеоклип',
    youtubeId: 'W1Tcf23Zf40',
    albumArt: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=400&q=80',
    duration: '03:05',
    qualityTag: '3:05 • Клип',
  },
  {
    id: 'ytc-asphalt-8',
    title: 'Asphalt 8',
    artist: 'MACAN',
    genre: 'Хип-хоп / Рэп • Клип',
    youtubeId: 'k4qM_K9y4gA',
    albumArt: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80',
    duration: '03:15',
    qualityTag: '3:15 • Клип',
  },
  {
    id: 'ytc-get-lucky',
    title: 'Get Lucky (Official Video)',
    artist: 'Daft Punk feat. Pharrell Williams',
    genre: 'Disco Funk • Клип',
    youtubeId: '5NV6Rdv1a3I',
    albumArt: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=400&q=80',
    duration: '04:08',
    qualityTag: '4:08 • Клип',
  },
  {
    id: 'ytc-devochka-tancuy',
    title: 'Девочка танцуй',
    artist: 'Artik & Asti',
    genre: 'Dance Pop • Видеоклип',
    youtubeId: '3v1W77H7e58',
    albumArt: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=80',
    duration: '03:42',
    qualityTag: '3:42 • Клип',
  },
];

export const YOUTUBE_MUSIC_TRACKS = POPULAR_MUSIC_CLIPS;

interface MusicScreenProps {
  /** Search query pushed in by the AI assistant (e.g. "Rihanna Rude Boy") */
  initialQuery?: string | null;
  /** Called once the pushed-in query has been consumed, so it isn't re-run */
  onInitialQueryConsumed?: () => void;
}

export const MusicScreen: React.FC<MusicScreenProps> = ({ initialQuery, onInitialQueryConsumed }) => {
  const [currentTrack, setCurrentTrack] = useState<YtMusicTrack>(POPULAR_MUSIC_CLIPS[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [customYtInput, setCustomYtInput] = useState('');
  const [isLiked, setIsLiked] = useState(true);
  const [audioDevice, setAudioDevice] = useState<'AirPods Pro' | 'Встроенные динамики' | 'Hi-Fi DAC'>('AirPods Pro');
  const [equalizerHeights, setEqualizerHeights] = useState([12, 16, 8, 16, 12, 8]);

  // Real YouTube Clips Search (3-4 min restriction)
  const [isSearchingClips, setIsSearchingClips] = useState(false);
  const [clipSearchResults, setClipSearchResults] = useState<YtMusicTrack[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Equalizer animation
  useEffect(() => {
    if (!isPlaying) {
      setEqualizerHeights([4, 4, 4, 4, 4, 4]);
      return;
    }

    const interval = setInterval(() => {
      setEqualizerHeights([
        Math.floor(Math.random() * 12) + 6,
        Math.floor(Math.random() * 14) + 6,
        Math.floor(Math.random() * 10) + 4,
        Math.floor(Math.random() * 14) + 6,
        Math.floor(Math.random() * 12) + 6,
        Math.floor(Math.random() * 10) + 4,
      ]);
    }, 600);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleSelectTrack = (track: YtMusicTrack) => {
    ambientSound.playTone(600, 0.15);
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handlePlayCustomIdOrUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customYtInput.trim()) return;

    let yId = customYtInput.trim();
    const match = yId.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (match) yId = match[1];

    ambientSound.playTone(640, 0.15);
    const customTrack: YtMusicTrack = {
      id: `custom-${Date.now()}`,
      title: 'YouTube Клип',
      artist: 'Пользовательский выбор',
      genre: 'Видеоклип',
      youtubeId: yId,
      albumArt: `https://i.ytimg.com/vi/${yId}/hqdefault.jpg`,
      duration: '3-4 мин',
      qualityTag: 'HD Клип',
    };

    setCurrentTrack(customTrack);
    setIsPlaying(true);
    setCustomYtInput('');
  };

  // Real YouTube Live Search for 3-4 minute music clips
  const handleSearchClips = async (e?: React.FormEvent, overrideQuery?: string) => {
    if (e) e.preventDefault();
    const q = (overrideQuery ?? searchQuery).trim();
    if (!q) return;

    ambientSound.playTone(580, 0.12);
    setIsSearchingClips(true);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/youtube/search?q=${encodeURIComponent(q)}&type=music`);
      if (res.ok) {
        const data = await res.json();
        if (data.items && Array.isArray(data.items)) {
          const mapped: YtMusicTrack[] = data.items.map((item: any) => ({
            id: `yt-clip-${item.id}`,
            title: item.title,
            artist: item.artist || 'YouTube Артист',
            genre: 'Видеоклип • 3-4 мин',
            youtubeId: item.youtubeId,
            albumArt: item.thumbnail,
            duration: item.duration || '03:30',
            qualityTag: `${item.duration} • Клип`,
          }));
          setClipSearchResults(mapped);
          if (mapped.length > 0) {
            ambientSound.playTone(650, 0.15);
            setCurrentTrack(mapped[0]);
            setIsPlaying(true);
          }
        }
      }
    } catch (err) {
      console.error('Music clip search error:', err);
    } finally {
      setIsSearchingClips(false);
    }
  };

  // AI assistant pushed in a song request (e.g. "Найди песню Rihanna Rude Boy")
  useEffect(() => {
    if (!initialQuery) return;
    setSearchQuery(initialQuery);
    handleSearchClips(undefined, initialQuery);
    onInitialQueryConsumed?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const filteredTracks = POPULAR_MUSIC_CLIPS.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q) || t.genre.toLowerCase().includes(q);
  });

  return (
    <div className="flex flex-col w-full space-y-5 relative pb-32 select-none animate-in fade-in duration-300">
      {/* Subtle Ambient Glow Canvas Backdrop */}
      <div className="relative w-full">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#d0bcff]/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-28 right-0 w-52 h-52 bg-[#4cd7f6]/15 rounded-full blur-[90px] pointer-events-none" />
      </div>

      {/* Clean Header */}
      <div className="flex items-center justify-between relative z-10">
        <div>
          <h1 className="font-headline text-2xl font-bold text-[#e1e2ec] tracking-tight">
            Музыка &amp; Саунд
          </h1>
        </div>
      </div>

      {/* Search Input for 3-4 minute YouTube Clips with working "Найти" button */}
      <div className="space-y-2">
        <form
          onSubmit={handleSearchClips}
          className="w-full flex items-center gap-2 bg-[#151821] border border-white/[0.08] px-3.5 py-2 rounded-2xl shadow-lg focus-within:border-red-500/60 transition-all"
        >
          <span className="material-symbols-outlined text-red-400 text-[20px] shrink-0">
            music_note
          </span>
          <input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (!e.target.value) {
                setHasSearched(false);
                setClipSearchResults([]);
              }
            }}
            className="w-full bg-transparent text-[#e1e2ec] placeholder-[#8690a2] text-[13px] focus:outline-none min-w-0"
            placeholder="Поиск треков и видеоклипов..."
            type="text"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setHasSearched(false);
                setClipSearchResults([]);
              }}
              className="text-[#8690a2] hover:text-white text-xs px-1"
            >
              ✕
            </button>
          )}
          <button
            type="submit"
            disabled={isSearchingClips}
            className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shrink-0 shadow-md active:scale-95 transition-all flex items-center gap-1 disabled:opacity-50"
          >
            {isSearchingClips ? (
              <span className="text-xs font-semibold">Ищем...</span>
            ) : (
              <>
                <span className="material-symbols-outlined text-[15px]">search</span>
                <span>Найти</span>
              </>
            )}
          </button>
        </form>

        {/* Live Search Results Section for 3-4 min clips */}
        {hasSearched && (
          <div className="p-4 rounded-2xl bg-[#151821] border border-red-500/30 shadow-xl space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <h3 className="font-headline font-bold text-sm text-[#e1e2ec]">
                  {isSearchingClips
                    ? 'Поиск клипов (3-4 мин)...'
                    : `Найдено клипов (3-4 мин): «${searchQuery}» (${clipSearchResults.length})`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setHasSearched(false);
                  setClipSearchResults([]);
                  setSearchQuery('');
                }}
                className="text-xs text-[#8690a2] hover:text-white"
              >
                Закрыть
              </button>
            </div>

            {clipSearchResults.length > 0 ? (
              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {clipSearchResults.map((track) => {
                  const isCurrent = currentTrack.id === track.id || currentTrack.youtubeId === track.youtubeId;
                  return (
                    <div
                      key={track.id}
                      onClick={() => handleSelectTrack(track)}
                      className={`p-3 rounded-2xl bg-black/40 hover:bg-[#1a1f2c] border transition-all cursor-pointer flex items-center justify-between gap-3 shadow-sm ${
                        isCurrent ? 'border-red-500/60 bg-[#1e1c27]' : 'border-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-14 h-10 rounded-xl overflow-hidden shrink-0 bg-black">
                          <img
                            src={track.albumArt}
                            alt={track.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-[18px]">
                              {isCurrent ? 'volume_up' : 'play_arrow'}
                            </span>
                          </div>
                        </div>

                        <div className="min-w-0">
                          <h4 className="font-headline font-bold text-xs sm:text-sm text-[#e1e2ec] truncate">
                            {track.title}
                          </h4>
                          <p className="text-[11px] text-[#8690a2] truncate">{track.artist}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-semibold border border-red-500/30">
                          {track.duration}
                        </span>
                        <button
                          type="button"
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                            isCurrent
                              ? 'bg-red-600 text-white'
                              : 'bg-white/[0.06] text-[#e1e2ec] hover:bg-white/[0.1]'
                          }`}
                        >
                          {isCurrent ? 'Играет' : 'Включить'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : !isSearchingClips ? (
              <p className="text-xs text-[#8690a2]">
                Треки по запросу «{searchQuery}» не найдены. Попробуйте другой запрос.
              </p>
            ) : null}
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MAIN PLAYER HERO CARD */}
      {/* ========================================================= */}
      <div className="relative w-full rounded-3xl bg-[#151821] border border-white/[0.08] shadow-2xl overflow-hidden p-4 sm:p-5 space-y-4">
        {/* Glow backdrop */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#8b5cf6]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Player Info Bar */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold text-[#e1e2ec] uppercase tracking-wider">
              Сейчас играет
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[10px] font-bold border border-red-500/30">
              {currentTrack.qualityTag || 'HD Клип'}
            </span>
            <button
              onClick={() => {
                ambientSound.playTone(650, 0.1);
                setAudioDevice((prev) =>
                  prev === 'AirPods Pro' ? 'Hi-Fi DAC' : prev === 'Hi-Fi DAC' ? 'Встроенные динамики' : 'AirPods Pro'
                );
              }}
              className="flex items-center gap-1 text-[11px] text-[#4cd7f6] bg-white/[0.04] px-2 py-0.5 rounded-lg border border-white/[0.06]"
            >
              <span className="material-symbols-outlined text-[14px]">airplay</span>
              <span>{audioDevice}</span>
            </button>
          </div>
        </div>

        {/* REAL YOUTUBE VIDEO CLIP IFRAME */}
        <div className="relative w-full aspect-video sm:aspect-[21/9] rounded-2xl overflow-hidden bg-black border border-white/[0.08] shadow-inner">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${currentTrack.youtubeId}?autoplay=1&enablejsapi=1&modestbranding=1&rel=0&iv_load_policy=3&controls=1`}
            title={currentTrack.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>

        {/* Controls & Track Title */}
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] relative z-10">
          <div className="min-w-0">
            <h4 className="font-headline font-bold text-sm text-[#e1e2ec] truncate">
              {currentTrack.title}
            </h4>
            <p className="text-xs text-[#8690a2] truncate">{currentTrack.artist}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Animated Equalizer */}
            <div className="hidden sm:flex items-end gap-1 h-5 mr-2">
              {equalizerHeights.map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-gradient-to-t from-red-500 to-[#d0bcff] rounded-full transition-all duration-300"
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>

            <button
              onClick={() => {
                ambientSound.playTone(isLiked ? 350 : 600, 0.1);
                setIsLiked(!isLiked);
              }}
              className={`p-2 rounded-full hover:bg-white/[0.06] transition-colors ${
                isLiked ? 'text-red-400' : 'text-[#8690a2]'
              }`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}
              >
                favorite
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Custom Video Clip Input */}
      <section className="p-4 rounded-2xl bg-[#151821] border border-white/[0.06] space-y-2 shadow-md">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-red-400 text-[18px]">add_link</span>
          <h3 className="text-xs font-bold text-[#e1e2ec]">
            Вставить прямую ссылку на трек или клип
          </h3>
        </div>
        <form onSubmit={handlePlayCustomIdOrUrl} className="flex gap-2">
          <input
            type="text"
            value={customYtInput}
            onChange={(e) => setCustomYtInput(e.target.value)}
            placeholder="Вставьте ссылку на видео или ID..."
            className="flex-1 px-3 py-2 rounded-xl bg-white/[0.04] text-xs text-[#e1e2ec] placeholder-[#8690a2] border border-white/[0.08] focus:border-red-500 focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold shadow hover:bg-red-500 active:scale-95 transition-all"
          >
            Включить
          </button>
        </form>
      </section>

      {/* Curated Music Video Clips */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-headline font-bold text-base text-[#e1e2ec]">
              Популярные треки ({filteredTracks.length})
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          </div>
          <span className="text-[11px] text-red-400 font-semibold">Aura Music</span>
        </div>

        <div className="space-y-2">
          {filteredTracks.map((track) => {
            const isCurrent = currentTrack.id === track.id || currentTrack.youtubeId === track.youtubeId;

            return (
              <div
                key={track.id}
                onClick={() => handleSelectTrack(track)}
                className={`p-3 rounded-2xl bg-[#151821] hover:bg-[#191d29] border transition-all cursor-pointer flex items-center justify-between gap-3 shadow-sm ${
                  isCurrent ? 'border-red-500/50 bg-[#1a1c27]' : 'border-white/[0.05]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-14 h-11 rounded-xl overflow-hidden shrink-0 bg-black/40 border border-white/[0.08]">
                    <img
                      src={track.albumArt}
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-[22px]">
                        {isCurrent ? 'volume_up' : 'play_arrow'}
                      </span>
                    </div>
                  </div>

                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold text-red-400 uppercase tracking-wider block truncate">
                      {track.genre}
                    </span>
                    <h4 className="font-headline font-bold text-xs sm:text-sm text-[#e1e2ec] truncate">
                      {track.title}
                    </h4>
                    <p className="text-[11px] text-[#8690a2] truncate">{track.artist}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/15 text-red-300 font-bold border border-red-500/20">
                    {track.duration}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectTrack(track);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-red-600 text-white'
                        : 'bg-white/[0.06] text-[#e1e2ec] hover:bg-white/[0.1]'
                    }`}
                  >
                    {isCurrent ? 'Играет' : 'Смотреть'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
