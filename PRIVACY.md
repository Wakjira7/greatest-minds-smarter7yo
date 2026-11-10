# Privacy & Generative AI Safety Architecture

**Effective Date:** October 20, 2026  
**Applications:** Smarter Than a 7-Year-Old IQ (`com.wakjira.smarter7yo`) & Greatest Minds: Stoic AI Chat (`com.wakjira.greatestminds`)  
**Developer:** Wakjira Shewangzaw Dabi (`wakjira7@gmail.com`)

---

## 1. Local-First Data Design

- **Zero Mandatory Sign-Up**: Neither application requires an account, email address, phone number, or social login.
- **On-Device Storage (`AsyncStorage`)**: Trivia scores, streaks, report cards, achievement badges, and Stoic journal transcripts are stored locally on the user's device. Users can export (CSV / JSON / HTML) or clear their local history at any time.
- **100% Offline Trivia Engine (`com.wakjira.smarter7yo`)**: Every trivia question, hint, lifeline, and report card calculation executes locally on-device without cloud database calls.

---

## 2. Generative AI Safety & Transparency (`com.wakjira.greatestminds`)

In compliance with Google Play's Generative AI User-Generated/AI Content Policy:
- **AI Parody Disclosure**: Every chat screen displays a clear banner ([`DisclaimerBanner.tsx`](src/components/DisclaimerBanner.tsx)) stating that personas are historical/parody AI simulations for educational self-reflection and entertainment, not medical, legal, or clinical advice.
- **In-App Message Reporting**: Every AI chat bubble includes a 1-tap **Report AI Message** control ([`ReportModal.tsx`](src/components/ReportModal.tsx)) allowing users to flag inaccurate or inappropriate responses immediately.
- **Server-Side API Key Isolation**: When cloud LLM mode is enabled, prompts are proxied ephemerally through [`supabase/functions/persona-chat/index.ts`](supabase/functions/persona-chat/index.ts) without selling or profiling personal data.

---

## 3. Permissions

Only `com.google.android.gms.permission.AD_ID` is declared for free-tier AdMob support (gated by EEA/GDPR consent). Legacy storage, microphone, and overlay permissions (`READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE`, `RECORD_AUDIO`, `SYSTEM_ALERT_WINDOW`) are explicitly blocked in `app.config.js`.

Public Privacy Policy URL: <https://telegra.ph/Privacy-Policy---Smarter-Than-a-7-Year-Old-IQ-10-20>
