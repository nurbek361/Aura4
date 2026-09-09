# Changes

## Initial implementation

- Added mobile shell with four native navigation areas.
- Added local persistence and offline CRUD for tasks and transactions.
- Added habits, goals, local search, profile settings and privacy copy.
- Added 114-surah catalogue validation and learning progress.
- Added Kotlin/Compose portability foundation and API provider interfaces.
- Added audit and deployment documentation.
## Real API integration

- Added live provider layer in `artifacts/personal-life-platform/services/liveApi.ts`.
- Home weather now reads real Open-Meteo current data for Bishkek coordinates.
- Added Online API screen with real weather-adjacent air quality, Frankfurter exchange rates, Open Library books, TVmaze shows, Apple iTunes music metadata and Hacker News stories.
- Added API registry and documented that public-apis is a directory, not a substitute for each provider's official documentation.

## 2026-09-04 — Media services upgrade
- Added Music screen with real iTunes Search API search.
- Added native Expo Audio preview player with progress, play/pause and official-source links.
- Added persistent media favorites and history in AsyncStorage state.
- Added Movies screen powered by TMDB v3 search/details/video/credits endpoints.
- Added movie detail screen with poster/backdrop, metadata, cast, favorite and official YouTube trailer embed.
- Added persistent movie favorites and trailer history.
- Added `/music`, `/movies`, `/movie/[id]` routes and More-screen quick links.
- Added `EXPO_PUBLIC_TMDB_ACCESS_TOKEN` environment variable; no real secret is stored in source.
