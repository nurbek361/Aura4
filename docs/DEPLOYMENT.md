# Aura — GitHub → Railway

## 1. Загрузка в GitHub через сайт

1. Открой GitHub и нажми **New repository**.
2. Назови репозиторий, например `aura-life-os`, выбери **Private** или **Public**, затем создай его.
3. Открой репозиторий → **Add file → Upload files**.
4. Распакуй подготовленный ZIP на компьютере и перетащи **содержимое папки `Aura4-main`**, а не сам ZIP.
5. Внизу нажми **Commit changes**.

В репозитории уже есть `package.json`, `vite.config.ts`, `server.ts` и `railway.json`, поэтому Railway определит стандартный Node.js build.

## 2. Деплой в Railway через сайт

1. Открой Railway → **New Project → Deploy from GitHub repo**.
2. Авторизуй GitHub, выбери репозиторий `aura-life-os`.
3. В настройках сервиса открой **Variables** и добавь:
   - `NODE_ENV` = `production`
   - `GROQ_API_KEY` = свой ключ Groq (не добавляй его в GitHub)
4. Нажми **Deploy**. Railway выполнит `npm install`, `npm run build`, затем `npm start`.
5. Открой вкладку **Settings → Networking → Generate Domain** — это публичный адрес приложения.
6. Проверка сервера: открой `https://ТВОЙ-ДОМЕН/api/health`. В ответе должен быть JSON со статусом `ok`.

## Если Railway просит команды вручную

- **Build Command:** `npm run build`
- **Start Command:** `npm start`
- **Node:** 20 или новее

## Важно

- `.env` не загружай в GitHub; в проекте оставлен только `.env.example`.
- Без `GROQ_API_KEY` приложение и отчёты работают, но голосовой AI-чат вернёт понятный статус `503`.
- Railway передаёт порт через `PORT`; сервер уже использует его автоматически.

## Mobile

Папка `android/` сохранена для дальнейшей сборки в Android Studio. Для web-деплоя на Railway она не нужна.