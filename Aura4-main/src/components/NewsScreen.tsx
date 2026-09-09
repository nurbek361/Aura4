import React, { useEffect, useState } from 'react';
import { ambientSound } from '../utils/audioSynth';

interface NewsArticle {
  title: string;
  link: string;
  pubDate: string;
  source: string;
}

const TOPICS = ['Все новости', 'Бишкек', 'Экономика', 'Спорт', 'Технологии'];

const timeAgo = (pubDate: string): string => {
  const date = new Date(pubDate);
  if (Number.isNaN(date.getTime())) return '';
  const diffMs = Date.now() - date.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) return 'только что';
  if (hours < 24) return `${hours} ч назад`;
  const days = Math.floor(hours / 24);
  return `${days} дн назад`;
};

export const NewsScreen: React.FC = () => {
  const [topic, setTopic] = useState('Все новости');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const q = topic === 'Все новости' ? '' : `${topic} Кыргызстан`;

    fetch(`/api/news/kyrgyzstan${q ? `?q=${encodeURIComponent(q)}` : ''}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('Не удалось загрузить новости'))))
      .then((data) => {
        if (!cancelled) setArticles(Array.isArray(data.items) ? data.items : []);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || 'Не удалось загрузить новости');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [topic]);

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-[#06b6d4] uppercase tracking-wider">
            Google News • Кыргызстан
          </span>
          <h1 className="font-headline text-2xl font-bold text-[#e1e2ec] tracking-tight">Новости</h1>
        </div>
        <div className="w-9 h-9 rounded-full bg-[#06b6d4]/15 border border-[#06b6d4]/30 flex items-center justify-center text-[#22d3ee]">
          <span className="material-symbols-outlined text-[18px]">newspaper</span>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {TOPICS.map((t) => (
          <button
            key={t}
            onClick={() => {
              ambientSound.playTone(500, 0.07);
              setTopic(t);
            }}
            className={`tap-ripple shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              topic === t
                ? 'bg-[#06b6d4]/20 text-[#22d3ee] border-[#06b6d4]/40'
                : 'bg-white/[0.04] text-[#8690a2] border-white/[0.06] hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="space-y-2.5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-[72px] rounded-2xl bg-white/[0.03] border border-white/[0.05] animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div className="py-8 text-center text-xs text-[#f43f5e]">{error}</div>
      )}

      {!isLoading && !error && (
        <div className="space-y-2.5">
          {articles.map((a, idx) => (
            <a
              key={`${a.link}-${idx}`}
              href={a.link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover-lift tap-ripple block p-3.5 rounded-2xl bg-[#151821] border border-white/[0.06] hover:border-[#06b6d4]/30 transition-all"
            >
              <div className="text-xs font-semibold text-[#e1e2ec] leading-snug line-clamp-2">{a.title}</div>
              <div className="flex items-center gap-2 mt-2 text-[10px] text-[#8690a2]">
                <span className="px-1.5 py-0.5 rounded bg-[#06b6d4]/15 text-[#22d3ee] font-medium">{a.source}</span>
                {a.pubDate && (
                  <>
                    <span>•</span>
                    <span>{timeAgo(a.pubDate)}</span>
                  </>
                )}
              </div>
            </a>
          ))}

          {articles.length === 0 && (
            <div className="py-8 text-center text-xs text-[#8690a2]">Новостей не найдено</div>
          )}
        </div>
      )}
    </div>
  );
};
