# Aura — Luminous Void implementation

The mobile app uses the Stitch `Luminous Void` system:
- Surface: #10131A / #0B0E15
- Primary violet: #A078FF
- Secondary cyan: #4CD7F6
- Tertiary emerald: #4EDEA3
- Text: #E1E2EC
- Glass cards with low-contrast spectral borders
- 20px mobile gutters, 12–20px card radii
- Aura glow fields behind content

Cinema:
- TMDB supplies titles, posters, metadata and IDs.
- `getMovieEmbedUrl()` maps TMDB movie IDs to `https://vidsrc.dev/embed/movie/{id}`.
- `/movie/watch` renders the player in a native WebView on Android/iOS and an iframe on web.
- The player is intentionally isolated in its own route so the rest of Aura remains responsive.
