# Contributing & Development Guide

Thank you for checking out **Greatest Minds & Smarter Than a 7-Year-Old IQ**!

> **License Note**: This repository is published as a **source-available engineering portfolio** under copyright (`All Rights Reserved` — see [`LICENSE`](LICENSE)). Bug reports, translation refinements across our 9 supported languages, and pull requests from invited collaborators are welcome.

---

## 1. Setup & Verification

```bash
npm install --legacy-peer-deps
npm run typecheck
npx expo start --web
```

## 2. Contribution Guidelines

- **Strict TypeScript (`npm run typecheck`)**: Every PR must compile with `0` TypeScript errors under `"strict": true`.
- **Variant Safety**: Test changes under both `EXPO_PUBLIC_APP_VARIANT=smarter7yo` and `EXPO_PUBLIC_APP_VARIANT=minds`, as well as `EXPO_PUBLIC_RELEASE_MODE=production`, to verify consumer-only screens remain clean.
- **9-Language Parity**: When adding user-facing strings to `SmarterThan7YoApp`, provide translations across all 9 locales in `src/constants/smarter7yoI18n.ts`.
- **Conventional Commits**: Use `feat:`, `fix:`, `i18n:`, `docs:`, `ci:`, or `chore:`.
