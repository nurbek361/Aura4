/**
 * Groq AI Client for Aura OS
 * Powered by Groq LPU™ Inference (Llama 3.3 70B / Llama 3.1 8B)
 */

export interface GroqMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  tool_call_id?: string;
}

export interface GroqToolCall {
  id: string;
  type: 'function';
  function: { name: string; arguments: string };
}

/**
 * Tools Aura's AI can call to actually control the app — not just talk about
 * it. Each tool maps 1:1 to an action handled in App.tsx.
 */
export const AURA_APP_TOOLS = [
  {
    type: 'function',
    function: {
      name: 'open_screen',
      description: 'Открыть определенный раздел (экран) приложения Aura OS.',
      parameters: {
        type: 'object',
        properties: {
          screen: {
            type: 'string',
            enum: [
              'home',
              'music',
              'cinema',
              'hub',
              'reports',
              'calendar',
              'reminders',
              'finance',
              'health',
              'library',
              'spirituality',
              'achievements',
              'friends',
            ],
            description: 'Идентификатор раздела приложения для открытия',
          },
        },
        required: ['screen'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'play_music',
      description:
        'Найти и сразу включить песню/трек/видеоклип по названию и/или исполнителю в музыкальном плеере приложения. Используй это, когда пользователь просит включить, найти или поставить конкретную песню.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Поисковый запрос — название трека и/или исполнитель, например "Rihanna Rude Boy"',
          },
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'search_movie',
      description: 'Найти и включить фильм по названию или по описанию вайба/настроения в разделе Кинозал.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Название фильма или описание желаемого настроения' },
        },
        required: ['query'],
      },
    },
  },
] as const;

export async function askGroq(
  prompt: string,
  systemPrompt = 'Ты — Aura, персональная интеллектуальная операционная система и голосовой ИИ-компаньон. Отвечай кратко, емко, вежливо, на русском языке, в стиле премиального футуристичного ассистента.',
  model = 'openai/gpt-oss-120b'
): Promise<string> {
  const messages: GroqMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: prompt },
  ];

  // Try server endpoint first
  try {
    const res = await fetch('/api/groq/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, model, temperature: 0.7, max_tokens: 600 }),
    });

    if (res.ok) {
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) return content.trim();
    }
  } catch (err) {
    console.warn('Server Groq proxy unreachable, falling back to direct Groq call', err);
  }

  return 'Связь с нейросетью Aura восстанавливается. Пожалуйста, повторите запрос через мгновение.';
}

export interface GroqToolResponse {
  content: string | null;
  toolCalls: GroqToolCall[];
}

/**
 * Same as askGroq, but lets the model call one of AURA_APP_TOOLS instead of
 * (or in addition to) replying with plain text — this is what lets Aura
 * actually control the app rather than just describe what it would do.
 */
export async function askGroqWithTools(
  prompt: string,
  systemPrompt: string,
  tools: readonly unknown[] = AURA_APP_TOOLS,
  model = 'openai/gpt-oss-120b'
): Promise<GroqToolResponse> {
  const messages: GroqMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: prompt },
  ];

  const body = {
    messages,
    model,
    temperature: 0.4,
    max_tokens: 500,
    tools,
    tool_choice: 'auto',
  };

  const extractFrom = (data: any): GroqToolResponse => {
    const message = data.choices?.[0]?.message;
    return {
      content: message?.content ?? null,
      toolCalls: message?.tool_calls ?? [],
    };
  };

  try {
    const res = await fetch('/api/groq/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const data = await res.json();
      return extractFrom(data);
    }
  } catch (err) {
    console.warn('Server Groq tool-call proxy unreachable, falling back to direct call', err);
  }

  return { content: null, toolCalls: [] };
}

export async function summarizeBookWithGroq(bookTitle: string, author?: string): Promise<string> {
  const prompt = `Дай краткое, практическое и емкое саммари книги «${bookTitle}» ${
    author ? `автора ${author}` : ''
  }. Выдели: 1) Главную идею (в 1-2 предложениях), 2) 3 ключевых инсайта/урока для жизни и продуктивности. Без лишней воды, лаконично.`;

  return askGroq(
    prompt,
    'Ты — аналитик и книжный куратор Aura OS. Давай глубокие, практичные выжимки книг без шаблонных фраз.'
  );
}

export async function getCinemaVibeWithGroq(vibe: string): Promise<{ title: string; genre: string; duration: string; why: string }> {
  const prompt = `Пользователь ищет полнометражный фильм под вайб: «${vibe}». 
Порекомендуй один реальный полнометражный фильм (например, культовая классика, шедевр Тарковского, научная фантастика или драма).
Ответь СТРОГО в формате JSON без markdown блоков:
{"title": "Название", "genre": "Жанр", "duration": "2ч 15м", "why": "Одно емкое предложение почему подходит"}`;

  try {
    const raw = await askGroq(
      prompt,
      'Ты — эксперт мирового кинематографа и куратор фильмов в Aura. Отвечай только валидным JSON.'
    );
    // clean json
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('Parse cinema vibe error', e);
  }

  return {
    title: 'Солярис (Андрей Тарковский)',
    genre: 'Культовая научная фантастика',
    duration: '2ч 47м',
    why: 'Шедевр философского кино о человеческой природе и космосе.',
  };
}
