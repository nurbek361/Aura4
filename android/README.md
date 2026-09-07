# Android Studio handoff

This directory is a portable Kotlin/Compose foundation. Open it in Android Studio, let Gradle resolve dependencies, then run the app on an emulator or device.

The first Replit verification cannot run Gradle because the Android SDK and wrapper distribution are not available here. Add the standard Gradle wrapper from Android Studio/your CI rather than committing secrets or signing keys.

The native layer intentionally keeps local data authoritative: Room for relational data, DataStore for preferences, and provider interfaces for online sources.