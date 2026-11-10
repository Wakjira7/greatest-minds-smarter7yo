# Security Policy

## Supported Versions

| Application | Version | Build Code | Supported |
| :--- | :--- | :--- | :--- |
| `com.wakjira.smarter7yo` | `1.0.6` | `7` | ✅ Active |
| `com.wakjira.greatestminds` | `1.0.6` | `7` | ✅ Active |

## Security Architecture

1. **Zero Client-Side LLM Keys**: `GEMINI_API_KEY` is never bundled in client JavaScript or native assets; it resides strictly in Supabase Edge Function secrets (`Deno.env`).
2. **Release Signing Isolation**: Keystore files (`.jks`) and `android/keystore.properties` are excluded from version control and enforced via automated CI checks.
3. **Minimal Android Permission Surface**: Sensitive Android permissions (`READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE`, `RECORD_AUDIO`, `SYSTEM_ALERT_WINDOW`) are blocked at build time.

## Reporting a Vulnerability

Please report security issues privately rather than opening a public GitHub issue:

- **Email**: `wakjira7@gmail.com`
- **Subject**: `[SECURITY] Greatest Minds / Smarter7YO Report`

All reports are reviewed and acknowledged within **72 hours**.
