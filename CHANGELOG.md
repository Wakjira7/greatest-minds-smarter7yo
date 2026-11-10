# Changelog

All notable changes to **Greatest Minds: Stoic AI Chat (`com.wakjira.greatestminds`)** and **Smarter Than a 7-Year-Old IQ (`com.wakjira.smarter7yo`)** are documented here.

---

## [1.0.6] — Build 7 — 2026-10-22

### Added
- **9-Language Frame-1 Localization (`smarter7yoI18n.ts`)**: Instant first-launch welcome language selector and header switcher across English, Amharic (`አማርኛ`), German, Somali, Arabic (`RTL`), Spanish, French, Portuguese, and Japanese.
- **Question-First Trivia Arena (`SmarterThan7YoApp.tsx`)**: Redesigned main screen placing the active trivia challenge, 4 answer cards, and 3 lifelines immediately above the fold, with collapsible classmate partner drawers.
- **200 Historical & Stoic 3D Personas (`greatestMinds200.ts`)**: Expanded mentor library across 10 Mastery Realms with interactive 3D portrait carousel, Mind Odyssey progression path, and `expo-speech` voice read-aloud.
- **Material Design 3 Live Theme System (`materialTheme.ts`)**: Five runtime-switchable Material You palettes (*Gold Dark*, *Dynamic Violet*, *Ghibli Forest*, *Cyber Ocean*, *Daylight Cream*).

### Security & Stability
- Isolated Android release signing configuration into gitignored `android/keystore.properties` with automatic `debug.keystore` fallback.
- Enforced strict TypeScript validation (`tsc --noEmit`) across all app routes and components.

---

## [1.0.2] — Build 3 — 2026-10-20

### Added
- Android 16 (`compileSdkVersion 36`, `targetSdkVersion 36`) build configuration and multi-variant EAS profiles (`eas.json`).
- Offline Academy Report Card with subject accuracy breakdown, streak tracking, and CSV/JSON/HTML export.
- Supabase Deno Edge Function (`supabase/functions/persona-chat`) with 8-message sliding context window and Google Play Generative AI reporting UI.
