# Deployment

## Mobile

Open `android/` in Android Studio with an installed Android SDK. Configure signing only through `local.properties` or CI secrets. Build debug/release APK/AAB from Android Studio after dependency resolution.

## Railway backend

Use `backend/Dockerfile`, expose the injected `PORT`, and configure `DATABASE_URL`/`SESSION_SECRET` in Railway variables. The current backend is a health/API foundation; local mobile features do not depend on it.

## Replit

Use the configured Expo workflow for preview. Do not commit `.env`, signing keys, keystores or build caches.