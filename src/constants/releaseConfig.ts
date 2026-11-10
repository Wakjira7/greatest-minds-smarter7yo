/**
 * Controls whether the app runs as:
 *  - 'smarter7yo': Standalone "Are You Smarter Than a 7-Year-Old?" Play Store build
 *  - 'minds': Standalone "Talk to the Greatest Minds" Play Store build
 *  - 'ocr': Standalone "OmniScan: Offline PDF OCR Pro" (com.wakjira.offlineocr) Play Store build
 *  - 'dual': Local developer studio mode with top switcher between all portfolio apps
 *
 * When `IS_STORE_PRODUCTION_BUILD` is true (set automatically by `eas.json` production profiles),
 * all internal developer tools (simulated AdMob revenue counters, API token cost meters,
 * Play 2026 Revenue Calculator, and portfolio switcher) are hidden so Google Play
 * reviewers see a 100% clean, policy-compliant standalone consumer app.
 */

export type AppVariant = 'smarter7yo' | 'minds' | 'ocr' | 'dual';

export const BUILD_APP_VARIANT: AppVariant =
  (process.env.EXPO_PUBLIC_APP_VARIANT as AppVariant) || 'dual';

export const IS_STORE_PRODUCTION_BUILD: boolean =
  process.env.EXPO_PUBLIC_RELEASE_MODE === 'production';

export const DEVELOPER_NAME = 'Wakjira';

export const PRIVACY_POLICY_URL =
  process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL ||
  'https://telegra.ph/Privacy-Policy---Smarter-Than-a-7-Year-Old-IQ-10-20';
