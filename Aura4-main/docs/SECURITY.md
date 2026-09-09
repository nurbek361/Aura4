# Security

- No real secrets are stored in source; use Replit Secrets or deployment environment.
- Do not enable cleartext traffic or broad exported components in the Android build.
- Health, finance and profile records stay local unless the user explicitly opts into sync.
- Backup restore must validate schema/format versions before replacing state.
- Do not log tokens, financial descriptions, health data or private notes.
- Provider URLs must be allowlisted and opened through official links; protected media URLs are never extracted.