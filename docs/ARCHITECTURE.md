# Architecture

The mobile client is local-first: UI → state/context → local repository → AsyncStorage. The Kotlin portability layer mirrors the intended Android architecture: Compose UI → ViewModel/use cases → repository → Room/DataStore/providers.

Remote providers are interfaces. DTOs must be mapped to domain models before reaching UI. The backend is optional and must only handle account, sync, public sharing or provider proxy work that requires a server.

## Privacy boundaries

Finance, Health Connect data, profile, photos, notes and spirituality progress are private by default. Sharing is explicit and must use Android Sharesheet with redacted, user-selected content.