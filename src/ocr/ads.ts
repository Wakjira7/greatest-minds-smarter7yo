import mobileAds, {
  AdEventType,
  AdsConsent,
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

/** Production ad units (AdMob account wakjira7@gmail.com, app ca-app-pub-2094226513922018~3900534717). */
const PROD = {
  rewarded: 'ca-app-pub-2094226513922018/9868633532',
  banner: 'ca-app-pub-2094226513922018/6390966682',
};

export const AD_UNITS = __DEV__
  ? { rewarded: TestIds.REWARDED, banner: TestIds.ADAPTIVE_BANNER }
  : PROD;

let initPromise: Promise<boolean> | null = null;
let canRequest = false;
let rewarded: RewardedAd | null = null;
let rewardedLoaded = false;
let loading = false;
const loadWaiters: Array<(ok: boolean) => void> = [];

/**
 * EU/UK consent (Google UMP) first, then SDK init. Safe to call many times.
 * Ads are only requested when consent allows it.
 */
export function initAds(): Promise<boolean> {
  if (!initPromise) {
    initPromise = (async () => {
      try {
        const info = await AdsConsent.gatherConsent();
        canRequest = info.canRequestAds;
      } catch {
        // Consent service unreachable (e.g. offline): Google allows a request attempt; SDK enforces policy.
        canRequest = true;
      }
      if (!canRequest) return false;
      try {
        await mobileAds().initialize();
      } catch {
        return false;
      }
      preloadRewarded();
      return true;
    })();
  }
  return initPromise;
}

export function adsAllowed(): boolean {
  return canRequest;
}

function settleWaiters(ok: boolean) {
  while (loadWaiters.length) loadWaiters.shift()?.(ok);
}

export function preloadRewarded() {
  if (!canRequest || loading || rewardedLoaded) return;
  loading = true;
  const ad = RewardedAd.createForAdRequest(AD_UNITS.rewarded, { requestNonPersonalizedAdsOnly: false });
  rewarded = ad;
  const unsubLoaded = ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
    loading = false;
    rewardedLoaded = true;
    settleWaiters(true);
  });
  const unsubError = ad.addAdEventListener(AdEventType.ERROR, () => {
    loading = false;
    rewardedLoaded = false;
    settleWaiters(false);
    unsubLoaded();
    unsubError();
  });
  ad.load();
}

function waitForLoad(timeoutMs: number): Promise<boolean> {
  if (rewardedLoaded) return Promise.resolve(true);
  preloadRewarded();
  return new Promise((resolve) => {
    const t = setTimeout(() => resolve(false), timeoutMs);
    loadWaiters.push((ok) => {
      clearTimeout(t);
      resolve(ok);
    });
  });
}

export type RewardOutcome = 'earned' | 'closed' | 'unavailable';

/** Shows a rewarded video. Resolves 'earned' only when AdMob confirms the reward. */
export async function showRewarded(): Promise<RewardOutcome> {
  await initAds();
  if (!canRequest) return 'unavailable';
  const ok = await waitForLoad(9000);
  const ad = rewarded;
  if (!ok || !ad) return 'unavailable';

  return new Promise<RewardOutcome>((resolve) => {
    let earned = false;
    const subs: Array<() => void> = [];
    const done = (r: RewardOutcome) => {
      subs.forEach((u) => u());
      rewardedLoaded = false;
      rewarded = null;
      preloadRewarded(); // have the next video ready
      resolve(r);
    };
    subs.push(ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => (earned = true)));
    subs.push(ad.addAdEventListener(AdEventType.CLOSED, () => done(earned ? 'earned' : 'closed')));
    subs.push(ad.addAdEventListener(AdEventType.ERROR, () => done('unavailable')));
    ad.show().catch(() => done('unavailable'));
  });
}

export async function openPrivacyOptions() {
  try {
    await AdsConsent.showPrivacyOptionsForm();
  } catch {
    // Not required in this region.
  }
}
