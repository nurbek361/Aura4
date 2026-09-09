import React, { useState } from 'react';
import { CinemaItem } from '../types';
import { ambientSound } from '../utils/audioSynth';
import { getCinemaVibeWithGroq } from '../utils/groqClient';

interface CinemaScreenProps {
  onOpenVoice: () => void;
  /** Movie/vibe query pushed in by the AI assistant */
  initialQuery?: string | null;
  /** Called once the pushed-in query has been consumed */
  onInitialQueryConsumed?: () => void;
}

// Verified full-length movies on YouTube with Russian audio / official distribution
export const YOUTUBE_FULL_MOVIES: CinemaItem[] = [
  {
    id: 'yt-stalker',
    title: 'Сталкер',
    genre: 'Философская фантастика, Драма',
    duration: '2ч 43м',
    durationMinutes: 163,
    year: '1979',
    rating: '9.4',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    badge: 'Мосфильм • 1080p Full Movie',
    youtubeId: 'baUd0sLqQd0',
    isFullMovie: true,
  },
  {
    id: 'yt-solaris',
    title: 'Солярис',
    genre: 'Культовый Sci-Fi, Космос',
    duration: '2ч 47м',
    durationMinutes: 167,
    year: '1972',
    rating: '9.3',
    posterUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80',
    badge: 'Мосфильм • Full Movie',
    youtubeId: 't5G6X3fW3C8',
    isFullMovie: true,
  },
  {
    id: 'yt-kin-dza-dza',
    title: 'Кин-дза-дза!',
    genre: 'Космическая антиутопия, Комедия',
    duration: '2ч 15м',
    durationMinutes: 135,
    year: '1986',
    rating: '9.2',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    badge: 'Шедевр Данелии • Full Movie',
    youtubeId: 'I47CNxw49TQ',
    isFullMovie: true,
  },
  {
    id: 'yt-dog-heart',
    title: 'Собачье сердце',
    genre: 'Фантастика, Классика',
    duration: '2ч 16м',
    durationMinutes: 136,
    year: '1988',
    rating: '9.5',
    posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80',
    badge: 'Ленфильм • 2 серии целиком',
    youtubeId: 'aO13gDEJ3nU',
    isFullMovie: true,
  },
  {
    id: 'yt-ivan-vasilievich',
    title: 'Иван Васильевич меняет профессию',
    genre: 'Комедия, Путешествия во времени',
    duration: '1ч 33м',
    durationMinutes: 93,
    year: '1973',
    rating: '9.6',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80',
    badge: 'Мосфильм • Full HD',
    youtubeId: 'a50qT9b1NsU',
    isFullMovie: true,
  },
  {
    id: 'yt-cherez-ternii',
    title: 'Через тернии к звёздам',
    genre: 'Космическая фантастика, Экспедиция',
    duration: '2ч 26м',
    durationMinutes: 146,
    year: '1980',
    rating: '8.8',
    posterUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
    badge: 'Студия Горького • Реставрация',
    youtubeId: '4zVv7Tf1L08',
    isFullMovie: true,
  },
  {
    id: 'yt-dead-letters',
    title: 'Письма мёртвого человека',
    genre: 'Постапокалипсис, Философия',
    duration: '1ч 28м',
    durationMinutes: 88,
    year: '1986',
    rating: '8.7',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    badge: 'Культовый фильм • Full Movie',
    youtubeId: 'MhY41r_1pUk',
    isFullMovie: true,
  },
  {
    id: 'yt-alpinist',
    title: 'Отель «У погибшего альпиниста»',
    genre: 'Sci-Fi Детектив, Стругацкие',
    duration: '1ч 24м',
    durationMinutes: 84,
    year: '1979',
    rating: '8.6',
    posterUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    badge: 'Таллинфильм • Полный метр',
    youtubeId: 'pC410iF0h88',
    isFullMovie: true,
  },
  {
    id: 'yt-universe-doc',
    title: 'Тайны Вселенной: Путешествие к краю космоса',
    genre: 'Документальный полный метр, Астрономия',
    duration: '1ч 31м',
    durationMinutes: 91,
    year: '2023',
    rating: '9.1',
    posterUrl: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=1200&q=80',
    badge: 'Full Movie • 4K Space',
    youtubeId: '1fT1l00l6fQ',
    isFullMovie: true,
  },
];

export const CinemaScreen: React.FC<CinemaScreenProps> = ({ onOpenVoice, initialQuery, onInitialQueryConsumed }) => {
  const [activeCategory, setActiveCategory] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiVibeInput, setAiVibeInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeMovie, setActiveMovie] = useState<CinemaItem | null>(null);
  const [customYoutubeUrl, setCustomYoutubeUrl] = useState('');
  const [theaterLightsOff, setTheaterLightsOff] = useState(false);
  const [isSearchingYt, setIsSearchingYt] = useState(false);
  const [ytSearchResults, setYtSearchResults] = useState<CinemaItem[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const categories = [
    'Все',
    'Sci-Fi & Космос',
    'Философия & Артхаус',
    'Детективы',
    'Комедии',
    'Документальные',
  ];

  // Helper to extract YouTube video ID
  const extractYouTubeId = (urlOrId: string): string => {
    const trimmed = urlOrId.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
    const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : trimmed;
  };

  const handleSelectMovie = (movie: CinemaItem) => {
    ambientSound.playTone(440, 0.15);
    setActiveMovie(movie);
  };

  // Play custom movie input
  const handlePlayCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customYoutubeUrl.trim()) return;
    const yId = extractYouTubeId(customYoutubeUrl);
    if (!yId) return;

    ambientSound.playTone(600, 0.15);
    const customItem: CinemaItem = {
      id: `custom-${Date.now()}`,
      title: 'YouTube Полнометражный Фильм',
      genre: 'Пользовательский стрим',
      duration: 'Полный фильм',
      durationMinutes: 90,
      year: '2026',
      rating: '9.0',
      posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
      badge: 'YouTube Full Movie Stream',
      youtubeId: yId,
      isFullMovie: true,
    };

    setActiveMovie(customItem);
    setCustomYoutubeUrl('');
  };

  // Real YouTube Live Search for Movies (e.g. "Области тьмы")
  const handleSearchYt = async (e?: React.FormEvent, overrideQuery?: string) => {
    if (e) e.preventDefault();
    const q = (overrideQuery ?? searchQuery).trim();
    if (!q) return;

    ambientSound.playTone(580, 0.12);
    setIsSearchingYt(true);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/youtube/search?q=${encodeURIComponent(q)}&type=movie`);
      if (res.ok) {
        const data = await res.json();
        if (data.items && Array.isArray(data.items)) {
          const mapped: CinemaItem[] = data.items.map((item: any) => ({
            id: `yt-sr-${item.id}`,
            title: item.title,
            genre: `Полнометражный фильм • ${item.author || 'YouTube'}`,
            duration: item.duration,
            durationMinutes: item.durationMinutes || 90,
            year: item.ago || 'YouTube',
            rating: '9.0',
            posterUrl: item.thumbnail,
            backdropUrl: item.thumbnail,
            badge: `${item.duration} • Полный метр`,
            youtubeId: item.youtubeId,
            isFullMovie: true,
          }));
          setYtSearchResults(mapped);
          if (mapped.length > 0) {
            // Automatically select and play the movie
            ambientSound.playTone(650, 0.15);
            setActiveMovie(mapped[0]);
          }
        }
      }
    } catch (err) {
      console.error('YouTube movie search error:', err);
    } finally {
      setIsSearchingYt(false);
    }
  };

  // AI assistant pushed in a movie/vibe request
  React.useEffect(() => {
    if (!initialQuery) return;
    setSearchQuery(initialQuery);
    handleSearchYt(undefined, initialQuery);
    onInitialQueryConsumed?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  // Groq AI Recommendation
  const handleGenerateVibe = async (promptText?: string) => {
    const text = promptText || aiVibeInput;
    if (!text.trim()) return;
    ambientSound.playTone(700, 0.2);
    setIsAiLoading(true);

    try {
      const rec = await getCinemaVibeWithGroq(text);
      // Find matching or create item
      const foundInList = YOUTUBE_FULL_MOVIES.find((m) =>
        m.title.toLowerCase().includes(rec.title.toLowerCase())
      );

      const targetMovie: CinemaItem = foundInList || {
        id: `ai-${Date.now()}`,
        title: rec.title,
        genre: rec.genre,
        duration: rec.duration,
        durationMinutes: 120,
        year: 'Классика',
        rating: '9.4',
        posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
        badge: 'Aura Рекомендация',
        youtubeId: 'baUd0sLqQd0', // Fallback to Stalker full movie
        isFullMovie: true,
      };

      setActiveMovie(targetMovie);
    } catch (err) {
      console.error(err);
      setActiveMovie(YOUTUBE_FULL_MOVIES[0]);
    } finally {
      setIsAiLoading(false);
      setAiVibeInput('');
    }
  };

  // FILTER RESTRICTION: Only full-length movies (>= 75 mins)
  const filteredMovies = YOUTUBE_FULL_MOVIES.filter((movie) => {
    // Strict restriction: must be marked full movie and at least 75 mins
    if (!movie.isFullMovie || (movie.durationMinutes && movie.durationMinutes < 75)) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = movie.title.toLowerCase().includes(q);
      const matchesGenre = movie.genre.toLowerCase().includes(q);
      const matchesYear = movie.year.includes(q);
      if (!matchesTitle && !matchesGenre && !matchesYear) return false;
    }

    if (activeCategory === 'Sci-Fi & Космос') {
      return movie.genre.includes('Sci-Fi') || movie.genre.includes('фантастика') || movie.genre.includes('Космос');
    }
    if (activeCategory === 'Философия & Артхаус') {
      return movie.genre.includes('Философ') || movie.genre.includes('Драма') || movie.genre.includes('Антиутопия');
    }
    if (activeCategory === 'Детективы') {
      return movie.genre.includes('Детектив');
    }
    if (activeCategory === 'Комедии') {
      return movie.genre.includes('Комедия');
    }
    if (activeCategory === 'Документальные') {
      return movie.genre.includes('Документальный');
    }

    return true;
  });

  const featuredMovie = YOUTUBE_FULL_MOVIES[0];

  return (
    <div className={`flex flex-col w-full space-y-5 relative pb-32 transition-colors duration-500 ${theaterLightsOff ? 'bg-black/95' : ''}`}>
      {/* Ambient Atmospheric Backdrops */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#a078ff]/15 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-[420px] -right-20 w-64 h-64 bg-[#4cd7f6]/10 rounded-full blur-[90px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-2xl font-bold text-[#e1e2ec] tracking-tight">
            Кинотеатр
          </h1>
        </div>
      </div>

      {/* Search Bar strictly restricted to Full Movies on YouTube */}
      <div className="space-y-2">
        <form
          onSubmit={handleSearchYt}
          className="w-full flex items-center gap-2 bg-[#151821] border border-white/[0.08] px-3.5 py-2 rounded-2xl shadow-lg focus-within:border-[#4cd7f6]/60 transition-all"
        >
          <span className="material-symbols-outlined text-[#4cd7f6] text-[20px] shrink-0">
            video_search
          </span>
          <input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (!e.target.value) {
                setHasSearched(false);
                setYtSearchResults([]);
              }
            }}
            placeholder="Поиск полнометражных фильмов..."
            className="w-full bg-transparent text-[#e1e2ec] placeholder-[#8690a2] text-[13px] focus:outline-none min-w-0"
            type="text"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setHasSearched(false);
                setYtSearchResults([]);
              }}
              className="text-[#8690a2] hover:text-white text-xs px-1"
            >
              ✕
            </button>
          )}
          <button
            type="submit"
            disabled={isSearchingYt}
            className="px-3.5 py-1.5 rounded-xl bg-[#4cd7f6] hover:bg-[#38bdf8] text-[#002f38] text-xs font-bold shrink-0 shadow-md active:scale-95 transition-all flex items-center gap-1 disabled:opacity-50"
          >
            {isSearchingYt ? (
              <span className="text-xs font-semibold">Ищем...</span>
            ) : (
              <>
                <span className="material-symbols-outlined text-[15px]">search</span>
                <span>Найти</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onOpenVoice}
            aria-label="Голосовой поиск"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#4cd7f6] hover:text-[#d0bcff] transition-colors shrink-0 active:scale-90"
          >
            <span className="material-symbols-outlined text-[20px]">mic</span>
          </button>
        </form>

        {/* Live Search Results Section */}
        {hasSearched && (
          <div className="p-4 rounded-2xl bg-[#151821] border border-[#4cd7f6]/30 shadow-xl space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4cd7f6] animate-ping" />
                <h3 className="font-headline font-bold text-sm text-[#e1e2ec]">
                  {isSearchingYt
                    ? 'Ищем фильм...'
                    : `Результаты поиска: «${searchQuery}» (${ytSearchResults.length})`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setHasSearched(false);
                  setYtSearchResults([]);
                  setSearchQuery('');
                }}
                className="text-xs text-[#8690a2] hover:text-white"
              >
                Закрыть
              </button>
            </div>

            {ytSearchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {ytSearchResults.map((m) => {
                  const isCurrent = activeMovie?.id === m.id || activeMovie?.youtubeId === m.youtubeId;
                  return (
                    <div
                      key={m.id}
                      onClick={() => handleSelectMovie(m)}
                      className={`p-2.5 rounded-xl bg-black/40 hover:bg-[#1a202c] border transition-all cursor-pointer flex gap-3 ${
                        isCurrent ? 'border-[#4cd7f6] ring-1 ring-[#4cd7f6]/40' : 'border-white/[0.08]'
                      }`}
                    >
                      <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0 bg-black">
                        <img src={m.posterUrl} alt={m.title} className="w-full h-full object-cover" />
                        <div className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/80 text-[9px] font-bold text-white">
                          {m.duration}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1 flex flex-col justify-between">
                        <h4 className="text-xs font-bold text-[#e1e2ec] line-clamp-2 leading-tight">
                          {m.title}
                        </h4>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-cyan-400 font-semibold">Полный метр</span>
                          <span className="text-[11px] font-bold text-[#4cd7f6]">
                            {isCurrent ? 'Играет ▶' : 'Смотреть'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : !isSearchingYt ? (
              <p className="text-xs text-[#8690a2]">
                Фильмы по запросу «{searchQuery}» не найдены. Попробуйте уточнить название.
              </p>
            ) : null}
          </div>
        )}
      </div>

      {/* Category Filter Pills Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 -mx-4 px-4">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                ambientSound.playTone(450, 0.05);
                setActiveCategory(cat);
              }}
              className={`shrink-0 px-3.5 py-1.5 rounded-xl text-[12px] font-semibold flex items-center gap-1.5 transition-all ${
                isActive
                  ? 'bg-[#4cd7f6]/20 text-[#4cd7f6] border border-[#4cd7f6]/40 shadow-sm'
                  : 'bg-[#151821] text-[#8690a2] border border-white/[0.05] hover:text-[#e1e2ec]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* FEATURED HERO MOVIE - Ready to launch in YouTube player */}
      <section className="relative w-full rounded-3xl overflow-hidden bg-[#151821] border border-white/[0.08] shadow-2xl group">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${featuredMovie.posterUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1118] via-[#0e1118]/70 to-transparent" />

        <div className="relative z-10 p-6 flex flex-col justify-end min-h-[300px] space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-red-600/80 text-white text-[10px] font-bold tracking-wide uppercase backdrop-blur-md">
              Aura Премьера
            </span>
            <span className="px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md text-amber-300 text-[11px] font-bold flex items-center gap-0.5">
              ★ {featuredMovie.rating}
            </span>
            <span className="text-[11px] text-white/80 font-medium">
              ⏱ {featuredMovie.duration}
            </span>
          </div>

          <h2 className="font-headline text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight drop-shadow-md">
            {featuredMovie.title}
          </h2>

          <p className="text-xs text-white/80 line-clamp-2 max-w-lg">
            Легендарный фильм Андрея Тарковского по повести братьев Стругацких в отреставрированной версии высокой четкости 1080p.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => handleSelectMovie(featuredMovie)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4cd7f6] to-[#00b4d8] text-[#002f38] font-bold text-xs shadow-lg hover:shadow-cyan-500/25 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">play_circle</span>
              <span>Смотреть фильм</span>
            </button>

            <span className="text-[11px] text-[#8690a2]">
              163 мин • 1080p
            </span>
          </div>
        </div>
      </section>

      {/* Aura AI Cinema Club Section */}
      <section className="p-4 rounded-2xl bg-[#151821] border border-white/[0.06] space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#a078ff] animate-pulse" />
            <span className="text-xs font-bold text-[#d0bcff] uppercase tracking-wider">
              Aura AI Киноклуб
            </span>
          </div>
          <span className="text-[10px] text-[#8690a2]">Aura Intelligence</span>
        </div>

        <p className="text-xs text-[#8690a2]">
          Опишите желаемое настроение, и Aura подберет полнометражный фильм:
        </p>

        {/* Quick Vibe Chips */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {[
            'Глубокая космическая драма',
            'Умный детектив Стругацких',
            'Философия и смысл жизни',
            'Добрая ретро-комедия',
          ].map((chip) => (
            <button
              key={chip}
              onClick={() => handleGenerateVibe(chip)}
              className="shrink-0 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-[#a078ff]/20 text-[11px] text-[#cbc3d7] hover:text-white border border-white/[0.06] transition-all"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Vibe Input */}
        <div className="flex items-center gap-2">
          <input
            value={aiVibeInput}
            onChange={(e) => setAiVibeInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerateVibe()}
            placeholder="Вайб: «что-то про искусственный разум и тайны Вселенной»..."
            className="flex-1 px-3 py-2 rounded-xl bg-white/[0.04] text-xs text-[#e1e2ec] placeholder-[#8690a2] border border-white/[0.06] focus:border-[#a078ff] focus:outline-none"
          />
          <button
            onClick={() => handleGenerateVibe()}
            disabled={isAiLoading}
            className="px-4 py-2 rounded-xl bg-[#a078ff] text-white text-xs font-bold shadow-md hover:bg-[#b08dfc] active:scale-95 transition-all disabled:opacity-50"
          >
            {isAiLoading ? 'ИИ ищет...' : 'Подобрать'}
          </button>
        </div>
      </section>

      {/* FULL MOVIES GRID */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-headline font-bold text-base text-[#e1e2ec]">
            Полнометражные фильмы ({filteredMovies.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => handleSelectMovie(movie)}
              className="group cursor-pointer rounded-2xl bg-[#151821] border border-white/[0.06] hover:border-[#4cd7f6]/40 transition-all overflow-hidden shadow-md flex flex-col"
            >
              <div className="relative aspect-video w-full bg-black overflow-hidden">
                <img
                  src={movie.backdropUrl || movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px] text-red-500">schedule</span>
                  {movie.duration}
                </div>

                {/* Full Movie Tag */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-red-600/90 text-white text-[9px] font-bold uppercase tracking-wider shadow">
                  Полный метр
                </div>

                {/* Center Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <div className="w-12 h-12 rounded-full bg-[#4cd7f6] text-[#002f38] flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                    <span className="material-symbols-outlined text-[28px]">play_arrow</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between text-[10px] text-[#8690a2]">
                    <span>{movie.year} г.</span>
                    <span className="text-amber-300 font-bold">★ {movie.rating}</span>
                  </div>
                  <h4 className="font-headline font-bold text-sm text-[#e1e2ec] group-hover:text-[#4cd7f6] transition-colors line-clamp-1 mt-0.5">
                    {movie.title}
                  </h4>
                  <p className="text-[11px] text-[#8690a2] line-clamp-1">{movie.genre}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                  <span className="text-[10px] text-[#8690a2] truncate">{movie.badge}</span>
                  <span className="text-xs font-semibold text-[#4cd7f6] group-hover:translate-x-0.5 transition-transform">
                    Смотреть →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Paste any Full-Length YouTube Movie URL */}
      <section className="p-4 rounded-2xl bg-[#151821] border border-white/[0.06] space-y-2.5">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">link</span>
          <h4 className="text-xs font-bold text-[#e1e2ec]">Вставить прямую ссылку на фильм</h4>
        </div>
        <p className="text-[11px] text-[#8690a2]">
          Введите ссылку на фильм или ID, и Aura откроет его во встроенном кинозале:
        </p>

        <form onSubmit={handlePlayCustomUrl} className="flex gap-2">
          <input
            type="text"
            value={customYoutubeUrl}
            onChange={(e) => setCustomYoutubeUrl(e.target.value)}
            placeholder="Вставьте ссылку на фильм или ID..."
            className="flex-1 px-3 py-2 rounded-xl bg-white/[0.04] text-xs text-[#e1e2ec] placeholder-[#8690a2] border border-white/[0.08] focus:border-[#4cd7f6] focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[#4cd7f6] text-[#002f38] text-xs font-bold shadow active:scale-95 transition-all"
          >
            Воспроизвести
          </button>
        </form>
      </section>

      {/* ========================================================= */}
      {/* REAL CINEMA MODAL */}
      {/* ========================================================= */}
      {activeMovie && activeMovie.youtubeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="relative w-full max-w-4xl rounded-3xl bg-[#0e1118] border border-white/[0.12] shadow-[0_25px_70px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[95vh]">
            {/* Top Cinema Player Bar */}
            <div className="px-4 py-3 bg-[#151821] border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-[#e1e2ec] truncate">
                    {activeMovie.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] text-[#8690a2]">
                    <span>{activeMovie.genre}</span>
                    <span>•</span>
                    <span className="text-cyan-400 font-semibold">{activeMovie.duration}</span>
                    <span>•</span>
                    <span className="text-emerald-400">Aura Cinema</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTheaterLightsOff(!theaterLightsOff)}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-xs text-[#cbc3d7] transition-all flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[15px]">theater_comedy</span>
                  <span className="hidden sm:inline">Свет</span>
                </button>

                <button
                  onClick={() => {
                    ambientSound.playTone(380, 0.1);
                    setActiveMovie(null);
                  }}
                  className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-red-500/20 text-[#8690a2] hover:text-red-400 flex items-center justify-center transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            </div>

            {/* YouTube Iframe Player Container */}
            {/* Using parameters: modestbranding=1, rel=0, iv_load_policy=3, controls=1, color=white, showinfo=0 */}
            <div className="relative w-full aspect-video bg-black flex items-center justify-center">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeMovie.youtubeId}?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3&controls=1&showinfo=0&fs=1&color=white`}
                title={activeMovie.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* Bottom Controls / Info Bar */}
            <div className="p-4 bg-[#151821] border-t border-white/[0.06] flex items-center justify-between text-xs text-[#8690a2]">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                  ✓ Полнометражный показ
                </span>
                <span className="text-[11px] hidden sm:inline text-white/70">
                  Управление: кликните на плеер для паузы, разворота на весь экран или перемотки
                </span>
              </div>

              <button
                onClick={() => setActiveMovie(null)}
                className="px-4 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-[#e1e2ec] font-semibold text-xs"
              >
                Закрыть плеер
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
