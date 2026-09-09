# API Registry

Проверенные реальные интеграции без секретов в исходниках. Каталог `public-apis/public-apis` используется как источник поиска/сверки, а перед интеграцией проверены официальные страницы самих API.

| Name | Purpose | Base URL | Auth | Status | Notes |
|---|---|---|---|---|---|
| Open-Meteo Forecast | Weather | https://api.open-meteo.com/v1/forecast | None | REAL | Current weather; non-commercial use |
| Open-Meteo Air Quality | Air quality | https://air-quality-api.open-meteo.com/v1/air-quality | None | REAL | PM2.5, PM10, EU AQI |
| Open-Meteo Geocoding | City search | https://geocoding-api.open-meteo.com/v1/search | None | REAL | City/coordinates lookup |
| Frankfurter | Currency rates | https://api.frankfurter.dev/v2/rates | None | REAL | Daily central-bank-derived rates; includes NBKR provider |
| Open Library | Books | https://openlibrary.org/search.json | None | REAL | Human-facing search; cache responses and identify app |
| TVmaze | TV/movie metadata | https://api.tvmaze.com/search/shows | None | REAL | Show metadata and links |
| Apple iTunes Search | Music metadata/previews | https://itunes.apple.com/search | None | REAL | Store content usage is subject to Apple terms |
| Hacker News Firebase API | Tech news | https://hacker-news.firebaseio.com/v0/ | None | REAL | Top stories; original links preserved |

## API key policy

No real API keys are stored in the repository. APIs that require credentials (for example some licensed news/video providers) are intentionally not represented as fake integrations.

## Sources checked
- Open-Meteo documents no-key access for non-commercial use.
- Frankfurter public API requires no API key.
- Open Library documents `/search.json` and asks applications to identify themselves and cache responses.
- TVmaze documents `/search/shows`.
- Apple documents the iTunes Search API and usage terms.

Date checked: 2026-09-04

## TMDB — Movies / Trailers
- Name: The Movie Database API v3
- Purpose: movie search, details, genres, cast and trailer metadata
- Official Website: https://developer.themoviedb.org/
- Base URL: https://api.themoviedb.org/3
- Authentication: Bearer API Read Access Token
- Environment Variable: EXPO_PUBLIC_TMDB_ACCESS_TOKEN
- Endpoints: `/search/movie`, `/movie/{id}`, `/movie/{id}/videos`, `/movie/{id}/credits`
- Implementation Status: REAL IMPLEMENTATION; requires API token
- Trailer playback: official YouTube URL returned by TMDB; no protected stream extraction
- Date Checked: 2026-09-04

## Apple iTunes Search API — Music
- Name: iTunes Search API
- Purpose: music search and metadata, including preview URLs when supplied by Apple
- Official Website: https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/
- Base URL: https://itunes.apple.com/search
- Authentication: none for search endpoint
- Implementation Status: REAL IMPLEMENTATION
- Playback: Expo Audio plays the API-provided preview URL; full tracks open at the official Apple source
- Date Checked: 2026-09-04
