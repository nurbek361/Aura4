import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import ytSearch from 'yt-search';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const GROQ_API_KEY =
  process.env.GROQ_API_KEY ||
  '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';

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', groqConfigured: Boolean(GROQ_API_KEY) });
});

// Groq AI Chat Completion Endpoint
app.post('/api/groq/chat', async (req: Request, res: Response) => {
  try {
    let { messages, temperature = 0.7, max_tokens = 800, model = 'openai/gpt-oss-120b', tools, tool_choice } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    // Map any legacy or unavailable model name to working model on this key
    if (!model || model.includes('llama')) {
      model = 'openai/gpt-oss-120b';
    }

    const buildPayload = (m: string) => {
      const payload: Record<string, unknown> = { model: m, messages, temperature, max_tokens };
      if (Array.isArray(tools) && tools.length > 0) {
        payload.tools = tools;
        payload.tool_choice = tool_choice || 'auto';
      }
      return payload;
    };

    let groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify(buildPayload(model)),
    });

    // If 120b fails, fallback to 20b
    if (!groqResponse.ok) {
      console.warn('Groq 120b failed, trying 20b fallback...');
      groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify(buildPayload('openai/gpt-oss-20b')),
      });
    }

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('Groq API error:', errorText);
      return res.status(groqResponse.status).json({ error: 'Aura AI request failed', details: errorText });
    }

    const data = await groqResponse.json();
    return res.json(data);
  } catch (error: any) {
    console.error('Server Aura AI error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error?.message });
  }
});

// Curated popular books database for instant, zero-fail search
const CURATED_BOOKS = [
  {
    title: 'Атомные привычки',
    authors: ['Джеймс Клир'],
    description: 'Проверенный способ сформировать полезные привычки и избавиться от вредных за счет микро-изменений.',
    thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
    pageCount: 320,
    categories: ['Продуктивность', 'Психология'],
    rating: 4.9,
  },
  {
    title: 'Стив Джобс',
    authors: ['Уолтер Айзексон'],
    description: 'Официальная и откровенная биография основателя Apple Стива Джобса, основанная на сорока интервью.',
    thumbnail: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80',
    pageCount: 650,
    categories: ['Бизнес', 'Биографии'],
    rating: 4.9,
  },
  {
    title: 'Размышления',
    authors: ['Марк Аврелий'],
    description: 'Личные записи римского императора и философа-стоика об осознанности, долге и внутреннем спокойствии.',
    thumbnail: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=400&q=80',
    pageCount: 224,
    categories: ['Философия', 'Стоицизм'],
    rating: 4.8,
  },
  {
    title: 'Думай медленно... решай быстро',
    authors: ['Даниэль Канеман'],
    description: 'Бестселлер нобелевского лауреата о двух системах мышления, когнитивных ошибках и принятии решений.',
    thumbnail: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80',
    pageCount: 656,
    categories: ['Психология', 'Мышление'],
    rating: 4.8,
  },
  {
    title: 'От нуля к единице',
    authors: ['Питер Тиль'],
    description: 'Как создать стартап, который изменит будущее, от сооснователя PayPal и первого инвестора Facebook.',
    thumbnail: 'https://images.unsplash.com/photo-1507842229458-574349386d4e?auto=format&fit=crop&w=400&q=80',
    pageCount: 288,
    categories: ['Бизнес', 'Стартапы'],
    rating: 4.7,
  },
  {
    title: 'Эссенциализм: путь к простоте',
    authors: ['Грег МакКеон'],
    description: 'Дисциплинированный подход к определению того, что действительно важно, и отсечению всего лишнего.',
    thumbnail: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=400&q=80',
    pageCount: 272,
    categories: ['Продуктивность', 'Тайм-менеджмент'],
    rating: 4.7,
  },
  {
    title: 'Биохакинг мозга',
    authors: ['Дейв Эспри'],
    description: 'Проверенный план прокачки энергии, фокуса и когнитивных функций за 2 недели.',
    thumbnail: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=400&q=80',
    pageCount: 336,
    categories: ['Биохакинг', 'Здоровье'],
    rating: 4.6,
  },
  {
    title: 'Преступление и наказание',
    authors: ['Федор Достоевский'],
    description: 'Бессмертный психологический роман о морали, совести, падении и духовном воскрешении человека.',
    thumbnail: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=400&q=80',
    pageCount: 576,
    categories: ['Классика', 'Психология'],
    rating: 4.9,
  },
];

// Unified Book Search (Combines Google Books + Open Library + Curated Fallback so search never fails)
const handleBooksSearch = async (req: Request, res: Response) => {
  try {
    const q = ((req.query.q as string) || 'саморазвитие').trim();
    const maxResults = Math.min(Number(req.query.maxResults) || 16, 40);
    const langRestrict = (req.query.langRestrict as string) || 'ru';

    // 1. Try Google Books API
    try {
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        q
      )}&maxResults=${maxResults}&langRestrict=${langRestrict}`;

      const apiRes = await fetch(url);
      if (apiRes.ok) {
        const data = await apiRes.json();
        if (data && data.items && data.items.length > 0) {
          return res.json(data);
        }
      }
    } catch (gErr) {
      console.warn('Google Books failed or rate limited, falling back to Open Library...', gErr);
    }

    // 2. Try Open Library API
    try {
      const openLibUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=${maxResults}`;
      const openLibRes = await fetch(openLibUrl);
      if (openLibRes.ok) {
        const openLibData = await openLibRes.json();
        if (openLibData && openLibData.docs && openLibData.docs.length > 0) {
          const items = openLibData.docs.map((doc: any, idx: number) => ({
            id: doc.key ? doc.key.replace('/works/', '') : `ol-${idx}`,
            volumeInfo: {
              title: doc.title || 'Книга',
              authors: doc.author_name || ['Автор не указан'],
              description: doc.first_sentence ? doc.first_sentence.join(' ') : (doc.subtitle || `Издание «${doc.title}». Доступно для чтения и изучения.`),
              imageLinks: {
                thumbnail: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
                smallThumbnail: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-S.jpg` : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
              },
              pageCount: doc.number_of_pages_median || 280,
              averageRating: 4.8,
              categories: doc.subject ? doc.subject.slice(0, 2) : ['Книга'],
            },
          }));

          return res.json({ items });
        }
      }
    } catch (olErr) {
      console.warn('Open Library failed, using curated fallback...', olErr);
    }

    // 3. Guaranteed Curated Filter fallback matching user query
    const qLower = q.toLowerCase();
    const matched = CURATED_BOOKS.filter(
      (b) =>
        b.title.toLowerCase().includes(qLower) ||
        b.authors.some((a) => a.toLowerCase().includes(qLower)) ||
        b.categories.some((c) => c.toLowerCase().includes(qLower))
    );

    const fallbackList = matched.length > 0 ? matched : CURATED_BOOKS;

    const formattedFallback = fallbackList.map((b, idx) => ({
      id: `curated-${idx}`,
      volumeInfo: {
        title: b.title,
        authors: b.authors,
        description: b.description,
        imageLinks: {
          thumbnail: b.thumbnail,
          smallThumbnail: b.thumbnail,
        },
        pageCount: b.pageCount,
        averageRating: b.rating,
        categories: b.categories,
      },
    }));

    return res.json({ items: formattedFallback });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message });
  }
};

app.get('/api/google-books', handleBooksSearch);
app.get('/api/books/search', handleBooksSearch);

// YouTube Search Endpoint (Films and 3-4 min music clips)
app.get('/api/youtube/search', async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string || '').trim();
    const type = (req.query.type as string) || 'movie';

    if (!q) {
      return res.status(400).json({ error: 'Query parameter q is required' });
    }

    if (type === 'movie') {
      const query = /(фильм|кино|movie|полностью|серия)/i.test(q) ? q : `${q} фильм полностью`;
      const searchResult = await ytSearch(query);

      // Filter for full length movies (>= 45 mins / 2700s)
      let movies = searchResult.videos.filter((v) => v.seconds >= 2700);

      // If none found with >= 2700s, fallback to top results
      if (movies.length === 0) {
        movies = searchResult.videos.slice(0, 8);
      } else {
        movies = movies.slice(0, 12);
      }

      const formatted = movies.map((v) => ({
        id: v.videoId,
        youtubeId: v.videoId,
        title: v.title,
        duration: v.timestamp,
        durationMinutes: Math.round(v.seconds / 60),
        author: v.author?.name || 'YouTube',
        thumbnail: v.thumbnail || `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`,
        views: v.views,
        ago: v.ago,
      }));

      return res.json({ items: formatted });
    } else if (type === 'shorts') {
      // Shorts: vertical, <= 60s clips
      const query = /(shorts|short)/i.test(q) ? q : `${q} shorts`;
      const searchResult = await ytSearch(query);

      let shorts = searchResult.videos.filter((v) => v.seconds > 0 && v.seconds <= 60);
      if (shorts.length === 0) {
        shorts = searchResult.videos.filter((v) => v.seconds > 0 && v.seconds <= 90);
      }

      const formatted = shorts.slice(0, 16).map((v) => ({
        id: v.videoId,
        youtubeId: v.videoId,
        title: v.title,
        author: v.author?.name || 'YouTube',
        thumbnail: v.thumbnail || `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`,
        views: v.views,
        duration: v.timestamp,
      }));

      return res.json({ items: formatted });
    } else {
      // Music clips: STRICT 3-4 MINUTE RESTRICTION
      const query = /(клип|music|video|official)/i.test(q) ? q : `${q} клип`;
      const searchResult = await ytSearch(query);

      // Strict restriction: 3-4 minutes (160 to 270 seconds)
      let clips = searchResult.videos.filter((v) => v.seconds >= 160 && v.seconds <= 270);

      // If strict filter yielded less than 3, slightly expand to 130 to 300s
      if (clips.length < 3) {
        clips = searchResult.videos.filter((v) => v.seconds >= 130 && v.seconds <= 300);
      }

      const formatted = clips.slice(0, 12).map((v) => ({
        id: v.videoId,
        youtubeId: v.videoId,
        title: v.title,
        artist: v.author?.name || 'Артист',
        duration: v.timestamp,
        seconds: v.seconds,
        thumbnail: v.thumbnail || `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`,
        views: v.views,
      }));

      return res.json({ items: formatted });
    }
  } catch (error: any) {
    console.error('YouTube search error:', error);
    return res.status(500).json({ error: error?.message || 'Search failed' });
  }
});

// Quran Surah Proxy with Arabic text, Russian translation and Transliteration
const quranSurahCache = new Map<number, any>();

app.get('/api/quran/surah/:number', async (req: Request, res: Response) => {
  try {
    const surahNumber = parseInt(req.params.number, 10);
    if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
      return res.status(400).json({ error: 'Surah number must be between 1 and 114' });
    }

    if (quranSurahCache.has(surahNumber)) {
      return res.json(quranSurahCache.get(surahNumber));
    }

    const apiUrl = `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,ru.kuliev,en.transliteration`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`AlQuran Cloud returned ${response.status}`);
    }

    const json = await response.json();
    if (json.code === 200 && Array.isArray(json.data) && json.data.length >= 3) {
      const arabicEdition = json.data[0];
      const russianEdition = json.data[1];
      const translitEdition = json.data[2];

      const ayahs = arabicEdition.ayahs.map((ayah: any, index: number) => ({
        numberInSurah: ayah.numberInSurah,
        arabic: ayah.text,
        russian: russianEdition.ayahs[index]?.text || '',
        transliteration: translitEdition.ayahs[index]?.text || '',
      }));

      const result = {
        number: arabicEdition.number,
        name: arabicEdition.name,
        englishName: arabicEdition.englishName,
        englishNameTranslation: arabicEdition.englishNameTranslation,
        numberOfAyahs: arabicEdition.numberOfAyahs,
        revelationType: arabicEdition.revelationType,
        audioUrl: `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahNumber}.mp3`,
        ayahs,
      };

      quranSurahCache.set(surahNumber, result);
      return res.json(result);
    } else {
      throw new Error('Unexpected structure from AlQuran Cloud');
    }
  } catch (error: any) {
    console.error('Quran API fetch error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to fetch Surah data' });
  }
});

// Google News RSS proxy (avoids CORS issues doing this straight from the
// browser, and sidesteps needing an XML parser dependency with a small
// regex-based extraction — Google News RSS item structure is stable).
let newsCache: { at: number; items: any[] } | null = null;
const NEWS_CACHE_MS = 10 * 60 * 1000;

app.get('/api/news/kyrgyzstan', async (req: Request, res: Response) => {
  try {
    if (newsCache && Date.now() - newsCache.at < NEWS_CACHE_MS) {
      return res.json({ items: newsCache.items });
    }

    const topic = ((req.query.q as string) || '').trim();
    const rssUrl = topic
      ? `https://news.google.com/rss/search?q=${encodeURIComponent(topic)}+when:2d&hl=ru&gl=KG&ceid=KG:ru`
      : `https://news.google.com/rss?hl=ru&gl=KG&ceid=KG:ru`;

    const response = await fetch(rssUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AuraLifeOS/1.0)' },
    });
    if (!response.ok) throw new Error(`Google News returned ${response.status}`);

    const xml = await response.text();
    const itemBlocks = xml.split('<item>').slice(1);

    const decodeEntities = (s: string) =>
      s
        .replace(/<!\[CDATA\[/g, '')
        .replace(/\]\]>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .trim();

    const items = itemBlocks
      .map((block) => {
        const titleMatch = block.match(/<title>([\s\S]*?)<\/title>/);
        const linkMatch = block.match(/<link>([\s\S]*?)<\/link>/);
        const pubDateMatch = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
        const sourceMatch = block.match(/<source url="([^"]*)">([\s\S]*?)<\/source>/);

        const rawTitle = titleMatch ? decodeEntities(titleMatch[1]) : '';
        // Google News titles are formatted "Headline - Source Name"
        const sourceName = sourceMatch ? decodeEntities(sourceMatch[2]) : '';
        const headline = sourceName && rawTitle.endsWith(sourceName)
          ? rawTitle.slice(0, rawTitle.length - sourceName.length).replace(/\s*-\s*$/, '')
          : rawTitle;

        return {
          title: headline || rawTitle,
          link: linkMatch ? decodeEntities(linkMatch[1]) : '',
          pubDate: pubDateMatch ? pubDateMatch[1].trim() : '',
          source: sourceName || 'Google News',
        };
      })
      .filter((item) => item.title && item.link)
      .slice(0, 30);

    newsCache = { at: Date.now(), items };
    return res.json({ items });
  } catch (error: any) {
    console.error('News proxy error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to fetch news' });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Aura OS Server running on http://0.0.0.0:${PORT} with Groq AI`);
  });
}

startServer();
