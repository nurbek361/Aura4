# Aura — AI Life OS

Минималистичный AI-дэшборд личной системы: фокус, финансы, здоровье, ритм, медиа и отчёты Aura за день, неделю и месяц.

## Run locally

**Prerequisites:** Node.js 20+

```bash
npm install
cp .env.example .env
npm run dev
```

Проект использует npm. `pnpm-lock.yaml` намеренно не добавляется, чтобы Railway не переключал сборку на pnpm и не терял native binding Tailwind.

`GROQ_API_KEY` в `.env` нужен только для голосового AI-чата. Основной интерфейс, графики и локальные отчёты работают без него.

## Production

```bash
npm run build
npm start
```

Подробная инструкция GitHub → Railway находится в [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).