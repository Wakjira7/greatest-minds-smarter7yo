import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Shared ad orchestration for both portfolio apps.
 *
 * Patterns re-implemented from SnapReels v1.1.9 (AdsManager.kt / VideoPlayerScreen.kt):
 *  - Multi-network "rotation" mode: each ad format round-robins across the enabled
 *    networks (AdMob, AppLovin MAX, Meta Audience Network), falling back to AdMob.
 *  - Interstitials are preloaded when a screen opens and shown on exit/back; if the
 *    ad is not ready the navigation simply continues (never blocks the user).
 *  - Rewarded ads carry a per-day limit (todayAdCount / dailyAdLimit) so users can't
 *    farm unlimited rewards and the ad account stays policy-safe.
 *
 * Added on top: a time + action based interstitial frequency cap.
 *
 * This file is SDK-agnostic. In the web/Expo Go preview it simulates ads. When you add
 * `react-native-google-mobile-ads`, plug the real SDK calls into `showFullscreen()`.
 */

export type AdNetwork = 'admob' | 'applovin' | 'facebook';
export type AdFormat = 'banner' | 'interstitial' | 'rewarded';

export interface AdsConfig {
  provider: AdNetwork | 'rotation';
  enabled: Record<AdNetwork, Record<AdFormat, boolean>>;
  /** Minimum seconds between two interstitials. */
  interstitialCooldownSec: number;
  /** Show an interstitial only every N qualifying actions. */
  interstitialEveryNActions: number;
  /** Max rewarded ads per user per day. */
  dailyRewardedLimit: number;
  /** Google's official test IDs — replace with your own before release. */
  adUnitIds: {
    banner: string;
    interstitial: string;
    rewarded: string;
  };
}

export const DEFAULT_ADS_CONFIG: AdsConfig = {
  provider: 'rotation',
  enabled: {
    admob: { banner: true, interstitial: true, rewarded: true },
    applovin: { banner: true, interstitial: true, rewarded: true },
    facebook: { banner: true, interstitial: true, rewarded: true },
  },
  /** 2026 Google AdMob Anti-Ban Policy: max 1 interstitial every 4 minutes (240s). */
  interstitialCooldownSec: 240,
  /** 2026 Google AdMob Anti-Ban Policy: only every 3rd completed milestone, never on boot. */
  interstitialEveryNActions: 3,
  dailyRewardedLimit: 10,
  adUnitIds: {
    banner: 'ca-app-pub-3940256099942544/6300978111',
    interstitial: 'ca-app-pub-3940256099942544/1033173712',
    rewarded: 'ca-app-pub-3940256099942544/5224354917',
  },
};

/** 2026 Tier-1 eCPM benchmarks ($0.80 banner, $6.50 interstitial, $12.00 rewarded / 1000). */
export const EST_REVENUE_PER_IMPRESSION_USD: Record<AdFormat, number> = {
  banner: 0.0008,
  interstitial: 0.0065,
  rewarded: 0.012,
};

interface AdsDayState {
  date: string;
  rewardedShownToday: number;
  actionsSinceInterstitial: number;
  lastInterstitialAt: number;
  totalImpressions: Record<AdFormat, number>;
  estRevenueUsd: number;
}

const STORAGE_KEY = '@portfolio_ads_state_v1';
const rotationIndex: Record<AdFormat, number> = { banner: 0, interstitial: 0, rewarded: 0 };
let cachedState: AdsDayState | null = null;
let preloadedInterstitial = false;

const today = () => new Date().toISOString().slice(0, 10);

function freshState(prev?: AdsDayState | null): AdsDayState {
  return {
    date: today(),
    rewardedShownToday: 0,
    actionsSinceInterstitial: prev?.actionsSinceInterstitial ?? 0,
    lastInterstitialAt: prev?.lastInterstitialAt ?? 0,
    totalImpressions: prev?.totalImpressions ?? { banner: 0, interstitial: 0, rewarded: 0 },
    estRevenueUsd: prev?.estRevenueUsd ?? 0,
  };
}

async function loadState(): Promise<AdsDayState> {
  if (cachedState && cachedState.date === today()) return cachedState;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const parsed: AdsDayState | null = raw ? JSON.parse(raw) : null;
    cachedState = parsed && parsed.date === today() ? parsed : freshState(parsed);
  } catch {
    cachedState = freshState(cachedState);
  }
  return cachedState;
}

async function saveState(state: AdsDayState) {
  cachedState = state;
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Non-fatal: ads still work for this session.
  }
}

// ---------------------------------------------------------------------------
// GDPR / EEA consent gate.
// Pattern from Cashloop v3.0 MainActivity.initGoogleConsent() (corroborated by the
// shipped APK containing user-messaging-platform 4.0.0):
//   requestConsentInfoUpdate -> loadAndShowConsentFormIfRequired -> if canRequestAds()
//   -> initialize the ads SDK exactly once (AtomicBoolean guard).
// Declining still allows NON-personalised ads; only "not yet asked" blocks ads.
// NOTE: Cashloop hard-codes DEBUG_GEOGRAPHY_EEA + a test device hash in release code;
// we deliberately do not.
// ---------------------------------------------------------------------------
export type ConsentStatus = 'unknown' | 'personalized' | 'non_personalized' | 'not_required';

const CONSENT_KEY = '@portfolio_ads_consent_v1';
let consentStatus: ConsentStatus = 'unknown';
let consentLoaded = false;
let sdkInitialized = false;

export async function loadConsentStatus(): Promise<ConsentStatus> {
  if (consentLoaded) return consentStatus;
  try {
    const raw = await AsyncStorage.getItem(CONSENT_KEY);
    if (raw === 'personalized' || raw === 'non_personalized' || raw === 'not_required') {
      consentStatus = raw;
    }
  } catch {
    // keep 'unknown'
  }
  consentLoaded = true;
  return consentStatus;
}

export async function setConsentStatus(status: Exclude<ConsentStatus, 'unknown'>) {
  consentStatus = status;
  consentLoaded = true;
  try {
    await AsyncStorage.setItem(CONSENT_KEY, status);
  } catch {
    // Non-fatal
  }
  initializeAdsSdkOnce();
}

/** Equivalent of UMP ConsentInformation.canRequestAds(). */
export function canRequestAds(): boolean {
  return consentStatus !== 'unknown';
}

export function isPersonalizedAds(): boolean {
  return consentStatus === 'personalized' || consentStatus === 'not_required';
}

/** Equivalent of Cashloop's isMobileAdsInitializeCalled guard. */
function initializeAdsSdkOnce() {
  if (sdkInitialized || !canRequestAds()) return;
  sdkInitialized = true;
  // Real SDK: mobileAds().initialize() from react-native-google-mobile-ads goes here.
}

/** Round-robin across enabled networks for a format (SnapReels getProviderForType). */
export function pickNetwork(format: AdFormat, config: AdsConfig = DEFAULT_ADS_CONFIG): AdNetwork {
  if (config.provider !== 'rotation') return config.provider;
  const enabled = (Object.keys(config.enabled) as AdNetwork[]).filter(
    (n) => config.enabled[n][format]
  );
  if (enabled.length === 0) return 'admob';
  const idx = rotationIndex[format] % enabled.length;
  rotationIndex[format] = (idx + 1) % enabled.length;
  return enabled[idx];
}

async function recordImpression(format: AdFormat) {
  const s = await loadState();
  s.totalImpressions[format] += 1;
  s.estRevenueUsd = Number((s.estRevenueUsd + EST_REVENUE_PER_IMPRESSION_USD[format]).toFixed(4));
  await saveState(s);
}

type TransitionListener = (state: { active: boolean; network?: AdNetwork }) => void;
const transitionListeners = new Set<TransitionListener>();

export function subscribeInterstitialTransition(listener: TransitionListener): () => void {
  transitionListeners.add(listener);
  return () => {
    transitionListeners.delete(listener);
  };
}

function notifyTransition(active: boolean, network?: AdNetwork) {
  transitionListeners.forEach((fn) => fn({ active, network }));
}

/** Replace this with the real SDK call once react-native-google-mobile-ads is installed. */
async function showFullscreen(format: 'interstitial' | 'rewarded', network: AdNetwork): Promise<boolean> {
  // Preview mode: simulate a short ad so the UX flow can be tested end-to-end.
  await new Promise((resolve) => setTimeout(resolve, format === 'rewarded' ? 900 : 350));
  return Boolean(network);
}

/** Call when a screen opens (SnapReels LaunchedEffect -> loadInterstitial). */
export function preloadInterstitial() {
  preloadedInterstitial = true;
}

/**
 * Count a qualifying action (e.g. finished a quiz round, exported data, left a chat).
 * 2026 Google AdMob Anti-Ban Compliance:
 *  - Shows ONLY when preloaded AND action count >= 3 AND 4-minute (240s) cooldown has elapsed.
 *  - Displays a 1-second "Saving Progress..." transition screen BEFORE the ad so the user's
 *    finger never accidentally taps the interstitial (prevents 30-day Invalid Traffic freeze).
 */
export async function maybeShowInterstitial(
  opts: { isAdFree?: boolean; config?: AdsConfig } = {}
): Promise<boolean> {
  const config = opts.config ?? DEFAULT_ADS_CONFIG;
  if (opts.isAdFree) return false;
  await loadConsentStatus();
  if (!canRequestAds()) return false;
  const s = await loadState();
  s.actionsSinceInterstitial += 1;
  const cooledDown = Date.now() - s.lastInterstitialAt >= config.interstitialCooldownSec * 1000;
  const enoughActions = s.actionsSinceInterstitial >= config.interstitialEveryNActions;
  if (!preloadedInterstitial || !cooledDown || !enoughActions) {
    await saveState(s);
    return false;
  }
  const chosenNetwork = pickNetwork('interstitial', config);
  // 1-second non-clickable transition guard before showing interstitial
  notifyTransition(true, chosenNetwork);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const shown = await showFullscreen('interstitial', chosenNetwork);
  notifyTransition(false);
  if (shown) {
    s.actionsSinceInterstitial = 0;
    s.lastInterstitialAt = Date.now();
    preloadedInterstitial = false; // consumed; next screen preloads again
    await saveState(s);
    await recordImpression('interstitial');
  }
  return shown;
}

export interface RewardedResult {
  rewarded: boolean;
  reason?: 'daily_limit' | 'failed' | 'needs_consent';
  remainingToday: number;
}

/** Rewarded ad with daily cap (SnapReels todayAdCount / dailyAdLimit). */
export async function showRewardedAd(config: AdsConfig = DEFAULT_ADS_CONFIG): Promise<RewardedResult> {
  await loadConsentStatus();
  const s = await loadState();
  if (!canRequestAds()) {
    return {
      rewarded: false,
      reason: 'needs_consent',
      remainingToday: config.dailyRewardedLimit - s.rewardedShownToday,
    };
  }
  if (s.rewardedShownToday >= config.dailyRewardedLimit) {
    return { rewarded: false, reason: 'daily_limit', remainingToday: 0 };
  }
  const ok = await showFullscreen('rewarded', pickNetwork('rewarded', config));
  if (!ok) {
    return {
      rewarded: false,
      reason: 'failed',
      remainingToday: config.dailyRewardedLimit - s.rewardedShownToday,
    };
  }
  s.rewardedShownToday += 1;
  await saveState(s);
  await recordImpression('rewarded');
  return { rewarded: true, remainingToday: config.dailyRewardedLimit - s.rewardedShownToday };
}

export async function getRewardedRemainingToday(config: AdsConfig = DEFAULT_ADS_CONFIG): Promise<number> {
  const s = await loadState();
  return Math.max(0, config.dailyRewardedLimit - s.rewardedShownToday);
}

export async function recordBannerImpression() {
  await recordImpression('banner');
}

export async function getAdsStats() {
  const s = await loadState();
  return {
    rewardedShownToday: s.rewardedShownToday,
    totalImpressions: { ...s.totalImpressions },
    estRevenueUsd: s.estRevenueUsd,
  };
}
