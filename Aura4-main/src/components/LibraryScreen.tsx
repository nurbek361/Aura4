import React, { useEffect, useState } from 'react';
import { INITIAL_BOOKS } from '../data/mockData';
import { BookItem } from '../types';
import { ambientSound } from '../utils/audioSynth';
import { summarizeBookWithGroq } from '../utils/groqClient';

interface GoogleBookVolume {
  id: string;
  volumeInfo: {
    title: string;
    subtitle?: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    pageCount?: number;
    categories?: string[];
    averageRating?: number;
    ratingsCount?: number;
    imageLinks?: {
      smallThumbnail?: string;
      thumbnail?: string;
    };
    language?: string;
    previewLink?: string;
    infoLink?: string;
  };
}

export const LibraryScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'my_books' | 'google_books'>('my_books');
  const [books, setBooks] = useState<BookItem[]>(() => {
    const saved = localStorage.getItem('aura_books');
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  const [shelfFilter, setShelfFilter] = useState<'all' | 'reading' | 'planned' | 'completed'>('reading');

  // Google Books Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [googleBooks, setGoogleBooks] = useState<GoogleBookVolume[]>([]);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('саморазвитие');

  // AI Book Summary Modal
  const [summaryModal, setSummaryModal] = useState<{
    isOpen: boolean;
    title: string;
    author?: string;
    coverUrl?: string;
    content: string;
    isLoading: boolean;
  }>({
    isOpen: false,
    title: '',
    author: '',
    coverUrl: '',
    content: '',
    isLoading: false,
  });

  // Manual Add Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newPages, setNewPages] = useState('300');
  const [newGenre, setNewGenre] = useState('Продуктивность');

  const saveBooks = (updated: BookItem[]) => {
    setBooks(updated);
    localStorage.setItem('aura_books', JSON.stringify(updated));
  };

  const handleUpdateProgress = (id: string, delta: number) => {
    ambientSound.playTone(640, 0.08);
    const updated = books.map((b) => {
      if (b.id !== id) return b;
      const nextCurrent = Math.max(0, Math.min(b.totalPages, b.currentPage + delta));
      const status: BookItem['status'] =
        nextCurrent >= b.totalPages ? 'completed' : nextCurrent > 0 ? 'reading' : 'planned';
      return { ...b, currentPage: nextCurrent, status };
    });
    saveBooks(updated);
  };

  const handleRemoveBook = (id: string) => {
    ambientSound.playTone(380, 0.1);
    const updated = books.filter((b) => b.id !== id);
    saveBooks(updated);
  };

  const handleAddManualBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAuthor.trim()) return;

    const totalPages = Number(newPages) || 200;
    const newBook: BookItem = {
      id: `bk-${Date.now()}`,
      title: newTitle.trim(),
      author: newAuthor.trim(),
      coverUrl:
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
      totalPages,
      currentPage: 0,
      genre: newGenre,
      status: 'planned',
      rating: 4.8,
    };

    saveBooks([newBook, ...books]);
    ambientSound.playTone(580, 0.12);
    setNewTitle('');
    setNewAuthor('');
    setIsAddOpen(false);
  };

  // Google Books API Fetcher
  const fetchGoogleBooks = async (queryToSearch: string) => {
    if (!queryToSearch.trim()) return;
    setIsLoadingGoogle(true);
    setGoogleError(null);

    try {
      // Try local server endpoint first, fallback to direct Google Books API
      const serverUrl = `/api/google-books?q=${encodeURIComponent(queryToSearch)}&maxResults=16&langRestrict=ru`;
      let data: any = null;

      try {
        const res = await fetch(serverUrl);
        if (res.ok) {
          data = await res.json();
        }
      } catch (err) {
        // Fallback to direct API
      }

      if (!data || !data.items) {
        const directUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          queryToSearch
        )}&maxResults=16&langRestrict=ru`;
        const res = await fetch(directUrl);
        if (res.ok) {
          data = await res.json();
        }
      }

      if (data && data.items) {
        setGoogleBooks(data.items);
      } else {
        setGoogleBooks([]);
        setGoogleError('Книги по данному запросу не найдены.');
      }
    } catch (err: any) {
      console.error('Books fetch error:', err);
      setGoogleError('Временная задержка при поиске книг. Попробуйте еще раз.');
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  // Trigger Google Books search on mount or category change
  useEffect(() => {
    fetchGoogleBooks(selectedCategory);
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    ambientSound.playTone(560, 0.1);
    fetchGoogleBooks(searchQuery.trim());
  };

  // Add Google Book to My Shelf
  const handleAddGoogleBookToShelf = (gb: GoogleBookVolume, status: BookItem['status'] = 'planned') => {
    ambientSound.playTone(600, 0.12);
    const vi = gb.volumeInfo;
    const coverUrl =
      vi.imageLinks?.thumbnail?.replace('http://', 'https://') ||
      vi.imageLinks?.smallThumbnail?.replace('http://', 'https://') ||
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80';

    const newBook: BookItem = {
      id: `gb-${gb.id}`,
      title: vi.title || 'Без названия',
      author: vi.authors?.join(', ') || 'Неизвестный автор',
      coverUrl,
      totalPages: vi.pageCount || 280,
      currentPage: status === 'completed' ? vi.pageCount || 280 : 0,
      genre: vi.categories?.[0] || 'Саморазвитие',
      status,
      rating: vi.averageRating || 4.7,
      favoriteQuote: vi.description ? vi.description.slice(0, 140) + '...' : undefined,
    };

    // Avoid duplicate
    const exists = books.find((b) => b.id === newBook.id || b.title.toLowerCase() === newBook.title.toLowerCase());
    if (!exists) {
      saveBooks([newBook, ...books]);
    }

    setActiveTab('my_books');
  };

  // Trigger Groq AI Book Summary
  const handleOpenAiSummary = async (title: string, author?: string, coverUrl?: string) => {
    ambientSound.playTone(720, 0.15);
    setSummaryModal({
      isOpen: true,
      title,
      author,
      coverUrl,
      content: '',
      isLoading: true,
    });

    try {
      const summary = await summarizeBookWithGroq(title, author);
      setSummaryModal((prev) => ({
        ...prev,
        content: summary,
        isLoading: false,
      }));
    } catch (e) {
      setSummaryModal((prev) => ({
        ...prev,
        content: 'Не удалось сгенерировать саммари через Aura AI. Попробуйте еще раз.',
        isLoading: false,
      }));
    }
  };

  const filteredBooks = books.filter((b) => {
    if (shelfFilter === 'all') return true;
    return b.status === shelfFilter;
  });

  const categoriesList = [
    { id: 'саморазвитие', label: 'Саморазвитие' },
    { id: 'продуктивность тайм-менеджмент', label: 'Продуктивность' },
    { id: 'психология мышление', label: 'Психология' },
    { id: 'стоицизм философия', label: 'Философия' },
    { id: 'бизнес стартапы инвестиции', label: 'Бизнес' },
    { id: 'искусственный интеллект технологии', label: 'ИИ & Наука' },
    { id: 'здоровье биохакинг', label: 'Биохакинг' },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-300 pb-28">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-[#8b5cf6] uppercase tracking-wider">
              Aura Библиотека
            </span>
            <span className="px-1.5 py-0.5 rounded-full bg-purple-500/20 text-[#d0bcff] text-[9px] font-bold border border-purple-500/30">
              Каталог
            </span>
          </div>
          <h1 className="font-headline text-2xl font-bold text-[#e1e2ec] tracking-tight">
            Библиотека знаний
          </h1>
        </div>

        <button
          onClick={() => {
            ambientSound.playTone(520, 0.08);
            setIsAddOpen(true);
          }}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-[#e1e2ec] text-xs font-semibold border border-white/[0.08] transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">edit_note</span>
          <span>Вручную</span>
        </button>
      </div>

      {/* Main Mode Toggle: My Shelf vs Catalog */}
      <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#151821] border border-white/[0.08] shadow-lg">
        <button
          onClick={() => {
            ambientSound.playTone(500, 0.08);
            setActiveTab('my_books');
          }}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'my_books'
              ? 'bg-gradient-to-r from-[#8b5cf6] to-[#a078ff] text-white shadow-[0_0_16px_rgba(139,92,246,0.35)]'
              : 'text-[#8690a2] hover:text-[#e1e2ec]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">auto_stories</span>
          <span>Моя полка ({books.length})</span>
        </button>

        <button
          onClick={() => {
            ambientSound.playTone(550, 0.08);
            setActiveTab('google_books');
          }}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'google_books'
              ? 'bg-gradient-to-r from-[#8b5cf6] to-[#a078ff] text-white shadow-[0_0_16px_rgba(139,92,246,0.35)]'
              : 'text-[#8690a2] hover:text-[#e1e2ec]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">travel_explore</span>
          <span>Каталог книг</span>
        </button>
      </div>

      {/* TAB 1: CATALOG SEARCH & EXPLORE */}
      {activeTab === 'google_books' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
            <span className="material-symbols-outlined absolute left-3.5 text-[#8b5cf6] text-[20px]">
              manage_search
            </span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск любых книг, авторов и жанров..."
              className="w-full pl-11 pr-24 py-3 rounded-2xl bg-[#151821] text-[#e1e2ec] placeholder-[#8690a2] text-[13px] focus:outline-none border border-white/[0.08] focus:border-[#8b5cf6] transition-all shadow-md"
              type="text"
            />
            <button
              type="submit"
              disabled={isLoadingGoogle}
              className="absolute right-2 px-3 py-1.5 rounded-xl bg-[#8b5cf6] text-white text-xs font-bold shadow-md hover:bg-[#9d71f7] active:scale-95 transition-all disabled:opacity-50"
            >
              {isLoadingGoogle ? 'Поиск...' : 'Найти'}
            </button>
          </form>

          {/* Quick Categories Carousel */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5 -mx-4 px-4">
            {categoriesList.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    ambientSound.playTone(490, 0.05);
                    setSelectedCategory(cat.id);
                  }}
                  className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-[#8b5cf6]/25 text-[#d0bcff] border border-[#8b5cf6]/40 shadow-sm'
                      : 'bg-[#151821] text-[#8690a2] border border-white/[0.05] hover:text-[#e1e2ec]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Results List */}
          {isLoadingGoogle && (
            <div className="p-8 rounded-2xl bg-[#151821] border border-white/[0.06] text-center space-y-3">
              <div className="w-8 h-8 mx-auto border-2 border-[#8b5cf6] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-[#8690a2]">Поиск книг в каталоге Aura...</p>
            </div>
          )}

          {googleError && !isLoadingGoogle && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 text-center">
              {googleError}
            </div>
          )}

          <div className="space-y-3">
            {googleBooks.map((gb) => {
              const vi = gb.volumeInfo;
              const coverUrl =
                vi.imageLinks?.thumbnail?.replace('http://', 'https://') ||
                vi.imageLinks?.smallThumbnail?.replace('http://', 'https://') ||
                'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80';
              const isAlreadyInShelf = books.some((b) => b.id === `gb-${gb.id}` || b.title === vi.title);

              return (
                <div
                  key={gb.id}
                  className="p-4 rounded-2xl bg-[#151821] border border-white/[0.06] hover:border-[#8b5cf6]/30 transition-all shadow-md flex gap-3.5"
                >
                  {/* Book Cover */}
                  <div className="w-20 h-28 rounded-xl overflow-hidden shrink-0 bg-white/[0.04] border border-white/[0.08] shadow-md relative">
                    <img
                      src={coverUrl}
                      alt={vi.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {vi.averageRating && (
                      <div className="absolute top-1 right-1 px-1 py-0.5 rounded bg-black/70 backdrop-blur-md text-[9px] font-bold text-amber-300 flex items-center gap-0.5">
                        ★ {vi.averageRating}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-semibold text-[#8b5cf6] uppercase tracking-wider truncate">
                          {vi.categories?.[0] || 'Литература'}
                        </span>
                        {vi.publishedDate && (
                          <span className="text-[10px] text-[#8690a2] shrink-0">
                            {vi.publishedDate.slice(0, 4)} г.
                          </span>
                        )}
                      </div>

                      <h3 className="font-headline font-bold text-sm text-[#e1e2ec] line-clamp-1 mt-0.5">
                        {vi.title}
                      </h3>
                      <p className="text-xs text-[#8690a2] truncate">
                        {vi.authors?.join(', ') || 'Автор не указан'}
                      </p>

                      {vi.pageCount && (
                        <span className="inline-block mt-1 text-[10px] text-[#8690a2]">
                          📖 {vi.pageCount} страниц
                        </span>
                      )}

                      {vi.description && (
                        <p className="mt-1 text-[11px] text-[#8690a2]/80 line-clamp-2 leading-relaxed">
                          {vi.description.replace(/<[^>]*>?/gm, '')}
                        </p>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-2 mt-2 border-t border-white/[0.04]">
                      {isAlreadyInShelf ? (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">check</span>
                          На полке
                        </span>
                      ) : (
                        <button
                          onClick={() => handleAddGoogleBookToShelf(gb, 'reading')}
                          className="px-2.5 py-1 rounded-lg bg-[#8b5cf6] hover:bg-[#9d71f7] text-white text-[10px] font-bold active:scale-95 transition-all flex items-center gap-1 shadow-sm"
                        >
                          <span className="material-symbols-outlined text-[14px]">bookmark_add</span>
                          <span>+ Читать</span>
                        </button>
                      )}

                      {/* Aura AI Summary Button */}
                      <button
                        onClick={() => handleOpenAiSummary(vi.title, vi.authors?.[0], coverUrl)}
                        className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-[#8b5cf6]/20 text-[#d0bcff] hover:text-white text-[10px] font-semibold border border-white/[0.06] transition-all flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px] text-[#4cd7f6]">auto_awesome</span>
                        <span>Aura Саммари</span>
                      </button>

                      {vi.previewLink && (
                        <a
                          href={vi.previewLink}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-1 rounded-lg bg-white/[0.03] text-[#8690a2] hover:text-white text-[10px] font-medium flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                          <span>О книге</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: MY READING SHELF */}
      {activeTab === 'my_books' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#151821] border border-white/[0.05]">
            {[
              { id: 'reading', label: 'Читаю' },
              { id: 'planned', label: 'В планах' },
              { id: 'completed', label: 'Прочитано' },
              { id: 'all', label: 'Все' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  ambientSound.playTone(480, 0.05);
                  setShelfFilter(tab.id as any);
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  shelfFilter === tab.id
                    ? 'bg-[#8b5cf6] text-white shadow-sm'
                    : 'text-[#8690a2] hover:text-[#e1e2ec]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {filteredBooks.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#151821] border border-white/[0.06] text-center space-y-3">
              <span className="material-symbols-outlined text-4xl text-[#8690a2]">menu_book</span>
              <p className="text-xs text-[#8690a2]">В этом разделе пока нет книг.</p>
              <button
                onClick={() => setActiveTab('google_books')}
                className="px-4 py-2 rounded-xl bg-[#8b5cf6] text-white text-xs font-bold shadow-md"
              >
                Открыть каталог книг →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBooks.map((book) => {
                const percent = Math.min(100, Math.round((book.currentPage / book.totalPages) * 100));

                return (
                  <div
                    key={book.id}
                    className="p-4 rounded-2xl bg-[#151821] border border-white/[0.06] hover:border-white/[0.12] transition-all shadow-md flex gap-4"
                  >
                    {/* Book Cover */}
                    <div className="w-20 h-28 rounded-xl overflow-hidden shrink-0 bg-white/[0.04] border border-white/[0.08] shadow-md relative">
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 right-1 px-1 py-0.5 rounded bg-black/60 backdrop-blur-md text-[9px] font-bold text-amber-300 flex items-center gap-0.5">
                        ★ {book.rating}
                      </div>
                    </div>

                    {/* Book Info */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-[#a078ff] uppercase tracking-wider truncate">
                            {book.genre}
                          </span>
                          <span className="text-[10px] font-bold text-[#34d399] shrink-0">
                            {percent}%
                          </span>
                        </div>
                        <h3 className="font-headline font-bold text-sm text-[#e1e2ec] line-clamp-1">
                          {book.title}
                        </h3>
                        <div className="text-xs text-[#8690a2] truncate">{book.author}</div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1.5 my-2">
                        <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#8b5cf6] to-[#d0bcff] rounded-full transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-[#8690a2]">
                          <span>
                            {book.currentPage} из {book.totalPages} стр.
                          </span>
                          <span>
                            {book.status === 'completed'
                              ? '✓ Прочитано'
                              : `${Math.max(0, book.totalPages - book.currentPage)} стр. осталось`}
                          </span>
                        </div>
                      </div>

                      {/* Quick Page Update & AI summary */}
                      <div className="flex items-center justify-between pt-1 border-t border-white/[0.04]">
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleUpdateProgress(book.id, 10)}
                            className="px-2 py-0.5 rounded bg-white/[0.06] hover:bg-white/[0.1] text-[10px] font-semibold text-[#d0bcff]"
                          >
                            +10 стр
                          </button>
                          <button
                            onClick={() => handleUpdateProgress(book.id, 25)}
                            className="px-2 py-0.5 rounded bg-white/[0.06] hover:bg-white/[0.1] text-[10px] font-semibold text-[#d0bcff]"
                          >
                            +25 стр
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenAiSummary(book.title, book.author, book.coverUrl)}
                            aria-label="Aura Саммари"
                            className="text-[#4cd7f6] hover:text-[#d0bcff] p-1 text-[11px] font-semibold flex items-center gap-0.5"
                          >
                            <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                            <span>Выжимка</span>
                          </button>

                          <button
                            onClick={() => handleRemoveBook(book.id)}
                            aria-label="Удалить из полки"
                            className="text-[#8690a2] hover:text-red-400 p-1"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Aura AI Book Summary Modal */}
      {summaryModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setSummaryModal((prev) => ({ ...prev, isOpen: false }))}
          />
          <div className="relative z-10 w-full max-w-[420px] rounded-3xl bg-[#161a24] border border-white/[0.12] shadow-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4cd7f6] animate-pulse"></span>
                <span className="text-[11px] font-bold text-[#4cd7f6] uppercase tracking-wider">
                  Aura AI • Саммари
                </span>
              </div>
              <button
                onClick={() => setSummaryModal((prev) => ({ ...prev, isOpen: false }))}
                className="text-[#8690a2] hover:text-white"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex gap-3 items-center">
              {summaryModal.coverUrl && (
                <img
                  src={summaryModal.coverUrl}
                  alt={summaryModal.title}
                  className="w-12 h-16 object-cover rounded-lg border border-white/[0.1] shadow"
                />
              )}
              <div className="min-w-0">
                <h3 className="font-headline font-bold text-sm text-[#e1e2ec] leading-snug">
                  {summaryModal.title}
                </h3>
                {summaryModal.author && (
                  <p className="text-xs text-[#8690a2]">{summaryModal.author}</p>
                )}
              </div>
            </div>

            {summaryModal.isLoading ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-8 h-8 mx-auto border-2 border-[#4cd7f6] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-[#cbc3d7]">
                  Aura генерирует ключевую выжимку и практические уроки книги...
                </p>
              </div>
            ) : (
              <div className="text-xs text-[#e1e2ec] whitespace-pre-line leading-relaxed p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                {summaryModal.content}
              </div>
            )}

            <button
              onClick={() => setSummaryModal((prev) => ({ ...prev, isOpen: false }))}
              className="w-full py-2.5 rounded-xl bg-[#8b5cf6] text-white font-bold text-xs shadow-md active:scale-95 transition-all"
            >
              Отлично, понятно
            </button>
          </div>
        </div>
      )}

      {/* Manual Book Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-md" onClick={() => setIsAddOpen(false)} />
          <div className="relative z-10 w-full max-w-[380px] rounded-3xl bg-[#161a24] border border-white/[0.1] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h2 className="font-headline text-base font-bold text-[#e1e2ec]">Добавить книгу вручную</h2>
              <button onClick={() => setIsAddOpen(false)} className="text-[#8690a2] hover:text-white">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddManualBook} className="space-y-3">
              <div>
                <label className="block text-xs text-[#8690a2] mb-1">Название книги</label>
                <input
                  type="text"
                  placeholder="Например: Атомные привычки"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-[#e1e2ec]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-[#8690a2] mb-1">Автор</label>
                <input
                  type="text"
                  placeholder="Джеймс Клир"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-[#e1e2ec]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#8690a2] mb-1">Всего страниц</label>
                  <input
                    type="number"
                    value={newPages}
                    onChange={(e) => setNewPages(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-[#e1e2ec]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#8690a2] mb-1">Жанр</label>
                  <select
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1a1e29] border border-white/[0.08] text-xs text-[#e1e2ec]"
                  >
                    <option value="Продуктивность">Продуктивность</option>
                    <option value="Психология">Психология</option>
                    <option value="Философия">Философия</option>
                    <option value="Бизнес">Бизнес</option>
                    <option value="Художественная">Художественная</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-3 py-1.5 text-xs text-[#8690a2]">Отмена</button>
                <button type="submit" className="px-4 py-1.5 rounded-xl bg-[#8b5cf6] text-white text-xs font-bold">Добавить</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
