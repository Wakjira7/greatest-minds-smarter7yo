# Multi-Variant EAS Build & Android 16 Deployment Guide

This guide documents how standalone Android App Bundles (`.aab`), tester APKs (`.apk`), and static web exports are built from this repository.

---

## 1. SDK & Platform Targets

- **Compile & Target SDK**: Android 16 (`API 36`)
- **Minimum SDK**: Android 7.0 (`API 24`)
- **New Architecture**: `newArchEnabled: false` for rock-solid third-party native SDK compatibility
- **Blocked Permissions**: `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE`, `RECORD_AUDIO`, and `SYSTEM_ALERT_WINDOW` are stripped at build time in [`app.config.js`](../app.config.js)

---

## 2. Signing Credential Isolation (`keystore.properties`)

Release signing credentials are excluded from Git via `.gitignore`.

1. Copy the example template:
   ```bash
   cp android/keystore.properties.example android/keystore.properties
   ```
2. Point `storeFile` to your local `.jks` upload key and set `storePassword`, `keyAlias`, and `keyPassword`.
3. When `android/keystore.properties` is not present (e.g., on contributor clones or CI runners), `android/app/build.gradle` automatically falls back to `debug.keystore`.

---

## 3. Version Synchronization Rule

Because `android/` is tracked in source control, always bump version numbers in **both** files together before submitting a new Google Play build:
- [`app.config.js`](../app.config.js) (`version` + `android.versionCode`)
- [`android/app/build.gradle`](../android/app/build.gradle) (`versionName` + `versionCode`)

---

## 4. Build Commands

```bash
# Authenticate with Expo Application Services
npx eas-cli login

# --- App #1: Smarter Than a 7-Year-Old IQ (com.wakjira.smarter7yo) ---
npm run build:apk:smarter7yo   # Internal QA installable .apk
npm run build:aab:smarter7yo   # Google Play Store production .aab

# --- App #2: Greatest Minds: Stoic AI Chat (com.wakjira.greatestminds) ---
npm run build:apk:minds        # Internal QA installable .apk
npm run build:aab:minds        # Google Play Store production .aab

# --- Static Web Export ---
npm run export:web
```
