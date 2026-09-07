# Testing

Implemented locally: TypeScript type checking for the Expo artifact and deterministic 114-surah catalogue validation.

Not run in this environment: Android Gradle unit/UI tests, Room migration tests, Health Connect tests and APK/AAB builds. These require Android SDK and/or a device.

Recommended next tests: money minor-unit rounding and currency preservation, achievement idempotency by unique event id, backup schema rejection/transactional restore, timezone-aware reminders, Room migrations and Compose critical flows.