# 2026 Google Play Store Upload & Export Guide

## 1. Which App Should You Upload First?

### 🏆 Recommendation: Upload **App #2 ("Are You Smarter Than a 7-Year-Old?")** FIRST, then **App #1 ("Talk to the Greatest Minds")** SECOND.

| Criteria | App #2: "Smarter Than a 7-Year-Old?" (`com.wakjira.smarter7yo`) | App #1: "Greatest Minds: Stoic AI Chat" (`com.wakjira.greatestminds`) |
| :--- | :--- | :--- |
| **Developer Name** | **Wakjira** | **Wakjira** |
| **Server / AI API Cost** | **`$0.00` forever** (100% offline local engine = 100% profit margin) | `$0.00` in offline Socratic mode; uses Gemini Flash-Lite tokens if live API key is enabled |
| **Google Play Review Speed** | **Fastest (Standard Trivia / Education Utility)** — no Generative AI policy friction | Requires Google Play Generative AI content-reporting declaration (already built in-app) |
| **12-Tester / 14-Day Engagement** | **Easiest to keep 12 testers active for 14 days** (2-minute daily trivia climb + badges) | Great for daily philosophy journaling & streaks |
| **Hybrid Monetization** | Rewarded Video Lifelines + `$3.99` One-Time Pro Unlock (Remove Ads + CSV/HTML Transcript Export) | Rewarded Video (+5 Replies) + `$3.99` One-Time Pro Unlock + Virtual Gift Coin Sink (`$0` API cost) |

> **Best Strategy**: Upload **App #2 (`com.wakjira.smarter7yo`)** first so you pass the 14-day closed test with `$0.00` cost risk and start banking AdMob + `$3.99` Pro Unlock revenue immediately. Once App #2 is in Production, upload **App #1 (`com.wakjira.greatestminds`)** as your second standalone app!

---

## 2. One-Command Export (`.aab` for Play Store & `.apk` for Testers)

Both apps are configured as **standalone production apps** inside [`app.config.js`](./app.config.js) and [`eas.json`](./eas.json). When built with the production profiles below, `EXPO_PUBLIC_RELEASE_MODE=production` automatically hides all developer studio tools and locks the binary to the chosen app.

### Step A: First-Time EAS Login (Run Once)
```powershell
npm install -g eas-cli
eas login
```

### Step B: Build **App #2 ("Smarter Than a 7-Year-Old?")**
- **Google Play Store Production Bundle (`.aab`)**:
  ```powershell
  npm run build:aab:smarter7yo
  ```
- **Direct Installable `.apk` (for your phone or 12 testers)**:
  ```powershell
  npm run build:apk:smarter7yo
  ```

### Step C: Build **App #1 ("Greatest Minds: Stoic AI Chat")**
- **Google Play Store Production Bundle (`.aab`)**:
  ```powershell
  npm run build:aab:minds
  ```
- **Direct Installable `.apk` (for your phone or 12 testers)**:
  ```powershell
  npm run build:apk:minds
  ```

### Step C2: Build **App #3 ("OmniScan: Offline PDF OCR Pro" — `com.wakjira.offlineocr`)**
- **Native Android Studio / Gradle Project (`c:\Users\Dabi\Pictures\offline-ocr-app`)**:
  ```powershell
  cd c:\Users\Dabi\Pictures\offline-ocr-app
  .\gradlew.bat bundleRelease
  ```
- **EAS Cloud Build (`.aab` / `.apk`)**:
  ```powershell
  npm run build:aab:ocr
  npm run build:apk:ocr
  ```

### Step D: Export Static Web Build + Public Privacy Policy URL
```powershell
npm run export:web
```
This outputs the static web app plus `dist/privacy-policy.html` (which you can deploy for free to Vercel, Netlify, or Cloudflare Pages in 30 seconds to get your public Privacy Policy URL).

---

## 3. Ready-to-Upload Google Play Store Graphics (`assets/playstore/`)

All required PNG assets have been generated to Google Play's exact pixel dimensions:

### For App #2 ("Smarter Than a 7-Year-Old?"):
- **512×512 High-Res Play Store Icon**: `assets/playstore/icon-512-smarter7yo.png`
- **1024×500 Google Play Feature Graphic**: `assets/playstore/feature-graphic-smarter7yo.png`
- **1024×1024 App Bundle Icon**: `assets/icon-smarter7yo.png`

### For App #1 ("Greatest Minds: Stoic AI Chat"):
- **512×512 High-Res Play Store Icon**: `assets/playstore/icon-512-minds.png`
- **1024×500 Google Play Feature Graphic**: `assets/playstore/feature-graphic-minds.png`
- **1024×1024 App Bundle Icon**: `assets/icon-minds.png`

---

## 4. Exact Google Play Console Copy-Paste Metadata

### Option A — App #2: "Smarter Than a 7-Year-Old?" (`com.wakjira.smarter7yo`)
- **Developer Name**: `Wakjira`
- **App Title (28/30 chars)**:
  `Smarter Than a 7-Year-Old IQ`
- **Short Description (74/80 chars)**:
  `Offline grade-school trivia ladder & report card. Zero login, family quiz!`
- **Full Description**:
  ```text
  Think you remember 1st-to-5th grade Math, Science, Space, Spelling, and History? Step up to the 3D Chalkboard Arena and test your brain against 5 prodigy 7-year-old classmates to climb the 10-rung $1,000,000 Scholarship Ladder!

  Built for Instant Offline Play & Deep Utility:
  • 100% Offline Family Trivia: Works on flights, commutes, and classrooms with zero internet required.
  • 5 3D Classmate Partners & 3 Lifelines: Team up with Leo (Math), Maya (Science), Toby (Space), Chloe (Spelling), and Zane (Riddles). Use Peek, Copy, or Erase-2 when you get stuck!
  • Persistent Offline Report Card & Visual Charts: Track your accuracy, best streak, rung progression bar charts, and 8 unlockable achievement badges.
  • 1-Click CSV, JSON & Transcript Export: Export your official Academy Report Card anytime.

  Privacy & Data Guarantee:
  No account required, 100% offline local storage, zero personal data collected. Optional $3.99 one-time Pro Unlock permanently disables all ads.
  ```

### Option B — App #1: "Greatest Minds: Stoic AI Chat" (`com.wakjira.greatestminds`)
- **Developer Name**: `Wakjira`
- **App Title (29/30 chars)**:
  `Greatest Minds: Stoic AI Chat`
- **Short Description (77/80 chars)**:
  `Offline-first 3D Stoic & Genius AI mentor journal. No login, CSV/JSON export.`
- **Full Description**:
  ```text
  Solve tough life, career, and study decisions in under 60 seconds with 200 interactive 3D historical mentors across 10 Mastery Realms—from Marcus Aurelius and Socrates to Nikola Tesla and Cleopatra VII.

  Why Users Switch to Greatest Minds:
  • 100% No-Login Access: Open the app and start consulting immediately. Never forced to create an account or hand over your email.
  • Offline-First Wisdom Journal & Export: All chat transcripts, daily streaks, XP progression, and action plans are stored locally on your device. Export anytime to CSV, JSON backup, or Printable HTML Summary.
  • 200 Living 3D Ghibli-Style Mentors: Touch any mentor portrait to awaken custom 3D motion physics, voice read-aloud, and Socratic action frameworks.
  • 10 Structured Mastery Realms: Stoics & Philosophers, Cosmic Scientists, Inventors & Futurists, Emperors & Queens, Master Strategists, and more.

  Privacy & Data Guarantee:
  No account required, 100% offline-capable local database, zero personal data sold. Optional $3.99 one-time Pro Unlock permanently removes all ads forever.
  ```

---

## 5. Exact Answers for Google Play Console "App Content" Declarations

1. **App Access**:
   - Select: *"All functionality in my app is available without any access restrictions (no login required)."*
2. **Ads Declaration**:
   - Select: *"Yes, my app contains ads."*
3. **Target Audience & Content**:
   - Select Target Age Groups: **13–15, 16–17, 18 and over** *(Tip: Do NOT select "Under 13 / Designed for Families" unless you want strict Families Policy ad SDK restrictions; selecting 13+ avoids Families Policy rejections while still allowing everyone to download it!)*
4. **Data Safety Questionnaire**:
   - *Does your app collect or share any of the required user data types?*
     - If shipping with simulated/offline mode first: **No**.
     - Once live native AdMob SDK is enabled: Select **Yes** $\rightarrow$ check **Device or other IDs** (Advertising ID used for Analytics & Advertising/Marketing, ephemeral/collected by Google AdMob SDK, encrypted in transit).
5. **Android 16 (API Level 36) Compliance**:
   - Pre-configured in `app.config.js` (`compileSdkVersion: 36`, `targetSdkVersion: 36`, `versionCode: 1`).
