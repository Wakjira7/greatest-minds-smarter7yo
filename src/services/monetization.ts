import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CoinTransaction,
  MonetizationState,
  Persona,
  PersonaBundleGroup,
  SubscriptionPlan,
} from '../types/chat';

const MONETIZATION_STORAGE_KEY = '@persona_advisor_monetization_v1';

export const ADVISOR_COPYRIGHT_WATERMARK =
  'Copyright (c) 2026 Wakjira Shewangzaw Dabi | com.wakjira.greatestminds | com.wakjira.smarter7yo | All Rights Reserved | SHA256:9c3e7b1f4d8a2e6c0b5f9a3d7e1c4b8f2a6d0e9c3b7f1a5d8e2c6b0f4a9d3e7c';

const MONETIZATION_SECRET = 'WakjiraShewangzawDabi::com.wakjira.advisor::2026::9c3e7b1f4d8a2e6c';

export function computeMonetizationMac(s: MonetizationState): string {
  const canonical = `${s.plan}|${s.coinBalance}|${s.rewardedBonusMessages}|${s.unlockedBundles.join(',')}|${s.streakDay}|${s.xpPoints}`;
  const input = `${MONETIZATION_SECRET}|${canonical}|${ADVISOR_COPYRIGHT_WATERMARK.length}`;
  let h1 = 0x811c9dc5;
  let h2 = 0xcbf29ce4;
  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i);
    h1 ^= c;
    h1 = Math.imul(h1, 0x01000193);
    h2 ^= c ^ (i & 0xff);
    h2 = Math.imul(h2, 0x10001935) ^ (h1 >>> 13);
  }
  return `${(h1 >>> 0).toString(16).padStart(8, '0')}${(h2 >>> 0).toString(16).padStart(8, '0')}`;
}

function xorMonetizationCipherHex(text: string): string {
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const k1 = MONETIZATION_SECRET.charCodeAt(i % MONETIZATION_SECRET.length);
    const k2 = ((i * 31 + 17) & 0xff) ^ (k1 & 0xff);
    const enc = (text.charCodeAt(i) & 0xff) ^ k2;
    out += enc.toString(16).padStart(2, '0');
  }
  return out;
}

function xorMonetizationDecipherHex(hex: string): string {
  if (!hex || hex.length % 2 !== 0) return '';
  let out = '';
  for (let i = 0; i < hex.length; i += 2) {
    const byteIndex = i >> 1;
    const k1 = MONETIZATION_SECRET.charCodeAt(byteIndex % MONETIZATION_SECRET.length);
    const k2 = ((byteIndex * 31 + 17) & 0xff) ^ (k1 & 0xff);
    const byteVal = parseInt(hex.slice(i, i + 2), 16);
    if (Number.isNaN(byteVal)) return '';
    out += String.fromCharCode((byteVal ^ k2) & 0xff);
  }
  return out;
}

export const FREE_DAILY_MESSAGE_LIMIT = 3;
export const PRO_DAILY_MESSAGE_LIMIT = 25;
export const REWARDED_VIDEO_BONUS_REPLIES = 5;

export interface StreakRungReward {
  day: number;
  coins: number;
  xp: number;
  label: string;
  isMilestone?: boolean;
}

// Ported from Cashloop v3.0 (StreakBoard / StreakRung) & SnapReels v1.1.9 (RewardsScreen 7-day grid)
export const STREAK_LADDER_REWARDS: StreakRungReward[] = [
  { day: 1, coins: 3, xp: 20, label: 'Day 1' },
  { day: 2, coins: 4, xp: 25, label: 'Day 2' },
  { day: 3, coins: 5, xp: 30, label: 'Day 3' },
  { day: 4, coins: 6, xp: 40, label: 'Day 4' },
  { day: 5, coins: 8, xp: 50, label: 'Day 5' },
  { day: 6, coins: 10, xp: 65, label: 'Day 6' },
  {
    day: 7,
    coins: 20,
    xp: 120,
    label: 'Day 7 Jackpot',
    isMilestone: true,
  },
];

export interface WisdomLevelInfo {
  level: number;
  title: string;
  currentXp: number;
  nextLevelXp: number;
  progressPercent: number;
  badgeEmoji: string;
}

// Ported from Cashloop v3.0 FeedLevelCard.kt progression bar
export function getUserWisdomLevel(xpPoints: number): WisdomLevelInfo {
  const levels = [
    { level: 1, title: 'Novice Seeker', minXp: 0, nextXp: 100, emoji: '🌱' },
    { level: 2, title: 'Stoic Apprentice', minXp: 100, nextXp: 250, emoji: '🔥' },
    { level: 3, title: 'Tactical Strategist', minXp: 250, nextXp: 500, emoji: '⚡' },
    { level: 4, title: 'Council Philosopher', minXp: 500, nextXp: 900, emoji: '🏛️' },
    { level: 5, title: 'Grand Oracle VIP', minXp: 900, nextXp: 1500, emoji: '👑' },
  ];

  const current =
    [...levels].reverse().find((l) => xpPoints >= l.minXp) ?? levels[0];
  const span = Math.max(1, current.nextXp - current.minXp);
  const intoLevel = Math.max(0, xpPoints - current.minXp);
  const progressPercent = Math.min(100, Math.round((intoLevel / span) * 100));

  return {
    level: current.level,
    title: current.title,
    currentXp: xpPoints,
    nextLevelXp: current.nextXp,
    progressPercent,
    badgeEmoji: current.emoji,
  };
}

export const PRICING_TIERS = {
  proLifetime399: {
    id: 'pro_lifetime_399' as const,
    title: 'One-Time Pro Unlock (Ad-Free + Export)',
    price: '$3.99 one-time',
    badge: 'BEST VALUE • NO SUBSCRIPTION',
    subtitle:
      'Permanently removes all Banner & Interstitial Ads forever + unlocks CSV/JSON/Printable Offline Exports + 30 Bonus Coins (= 4,000 ad impressions value!)',
  },
  proMonthly: {
    id: 'pro_monthly' as const,
    title: 'Pro Monthly Pass',
    price: '$6.99 / month',
    badge: 'MOST POPULAR',
    subtitle:
      'Unlock all 200 personalities, 25 messages/day on Gemini 4 Argon, Ad-Free, + Free Action Plans',
  },
  proWeekly: {
    id: 'pro_weekly' as const,
    title: 'Weekly Impulse Pass',
    price: '$2.99 / week',
    badge: 'FLEXIBLE',
    subtitle:
      'Full VIP access for 7 days: all 200 personalities, 25 messages/day, and zero ads',
  },
  coinStarter: {
    id: 'coins_100' as const,
    coins: 100,
    title: 'Starter Coin Pack (100 Replies)',
    price: '$2.99',
    subtitle: '100 Persona Replies powered by Gemini 4 Argon • Never expires',
  },
  coinSolver: {
    id: 'coins_500' as const,
    coins: 500,
    title: 'Problem-Solver Pack (500 Replies)',
    price: '$9.99',
    subtitle: '500 Persona Replies powered by Gemini 4 Argon • Best per-message value',
  },
  vipBundle: {
    price: '$9.99 one-time',
  },
  actionPlan: {
    price: '$0.99',
  },
};

function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

function createTransaction(
  title: string,
  amountText: string,
  type: 'earn' | 'spend' | 'purchase'
): CoinTransaction {
  return {
    id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title,
    amountText,
    type,
    timestamp: Date.now(),
  };
}

export function getDefaultMonetizationState(): MonetizationState {
  return {
    plan: 'free',
    dailyMessagesUsed: 0,
    lastResetDate: getTodayDateString(),
    coinBalance: 5, // Welcome starter coins (Astroway "Free First Consultation" bonus)
    rewardedBonusMessages: 0,
    unlockedBundles: [],
    adUnlockedPersonaIds: [],
    unlockedActionPlanPersonaIds: [],
    streakDay: 1,
    lastStreakClaimDate: null,
    xpPoints: 35,
    claimedQuestIds: [],
    referralClaimed: false,
    likedThreadIds: ['thread-marcus-1', 'thread-blaze-1'],
    transactions: [
      {
        id: 'tx-welcome',
        title: 'Welcome Gift (Astroway First Chat Bonus)',
        amountText: '+5 🪙',
        type: 'earn',
        timestamp: Date.now() - 3600 * 1000,
      },
    ],
    totalMessagesSent: 0,
    totalInputTokens: 0,
    totalOutputTokens: 0,
    totalEstimatedApiCostUsd: 0,
    totalEstimatedRevenueUsd: 0,
    monthlyBudgetCapUsd: 25.0,
    customGeminiApiKey: '',
  };
}

export async function loadMonetizationState(): Promise<MonetizationState> {
  try {
    const raw = await AsyncStorage.getItem(MONETIZATION_STORAGE_KEY);
    if (!raw) {
      const initial = getDefaultMonetizationState();
      await saveMonetizationState(initial);
      return initial;
    }
    const rawParsed = JSON.parse(raw);
    const defaults = getDefaultMonetizationState();
    let parsed: Partial<MonetizationState> = {};
    let isTampered = false;

    if (
      rawParsed &&
      rawParsed.v === 2 &&
      typeof rawParsed.p === 'string' &&
      typeof rawParsed.sig === 'string'
    ) {
      const jsonStr = xorMonetizationDecipherHex(rawParsed.p);
      if (!jsonStr) return defaults;
      parsed = JSON.parse(jsonStr) as Partial<MonetizationState>;
    } else {
      parsed = rawParsed as Partial<MonetizationState>;
    }

    const merged: MonetizationState = {
      ...defaults,
      ...parsed,
      unlockedBundles: parsed.unlockedBundles ?? defaults.unlockedBundles,
      adUnlockedPersonaIds:
        parsed.adUnlockedPersonaIds ?? defaults.adUnlockedPersonaIds,
      unlockedActionPlanPersonaIds:
        parsed.unlockedActionPlanPersonaIds ??
        defaults.unlockedActionPlanPersonaIds,
      claimedQuestIds: parsed.claimedQuestIds ?? defaults.claimedQuestIds,
      likedThreadIds: parsed.likedThreadIds ?? defaults.likedThreadIds,
      transactions: parsed.transactions ?? defaults.transactions,
      totalMessagesSent: parsed.totalMessagesSent ?? 0,
      totalInputTokens: parsed.totalInputTokens ?? 0,
      totalOutputTokens: parsed.totalOutputTokens ?? 0,
      totalEstimatedApiCostUsd: parsed.totalEstimatedApiCostUsd ?? 0,
      totalEstimatedRevenueUsd: parsed.totalEstimatedRevenueUsd ?? 0,
      monthlyBudgetCapUsd: parsed.monthlyBudgetCapUsd ?? 25.0,
      customGeminiApiKey: parsed.customGeminiApiKey ?? '',
    };

    if (rawParsed && rawParsed.v === 2) {
      const expectedSig = computeMonetizationMac(merged);
      if (expectedSig !== rawParsed.sig) {
        isTampered = true;
      }
    } else if (merged.coinBalance > 100 || merged.plan !== 'free') {
      isTampered = true;
    }

    if (isTampered) {
      merged.plan = 'free';
      merged.coinBalance = defaults.coinBalance;
      merged.unlockedBundles = [];
    }

    const today = getTodayDateString();
    if (merged.lastResetDate !== today) {
      const resetState: MonetizationState = {
        ...merged,
        dailyMessagesUsed: 0,
        lastResetDate: today,
        adUnlockedPersonaIds: [],
      };
      await saveMonetizationState(resetState);
      return resetState;
    }
    return merged;
  } catch (err) {
    console.warn('Failed to load monetization state:', err);
    return getDefaultMonetizationState();
  }
}

export async function saveMonetizationState(
  state: MonetizationState
): Promise<MonetizationState> {
  try {
    const sig = computeMonetizationMac(state);
    const p = xorMonetizationCipherHex(JSON.stringify(state));
    await AsyncStorage.setItem(
      MONETIZATION_STORAGE_KEY,
      JSON.stringify({ v: 2, p, sig })
    );
  } catch (err) {
    console.warn('Failed to save monetization state:', err);
  }
  return state;
}

export function isProSubscriber(state: MonetizationState): boolean {
  return (
    state.plan === 'pro_monthly' ||
    state.plan === 'pro_weekly' ||
    state.plan === 'pro_lifetime_399'
  );
}

export function isPersonaUnlocked(state: MonetizationState, persona: Persona): boolean {
  if (persona.isFreeStarter) return true;
  if (isProSubscriber(state)) return true;
  if (state.coinBalance > 0) return true;
  if (state.unlockedBundles.includes(persona.bundleGroup)) return true;
  if (state.adUnlockedPersonaIds.includes(persona.id)) return true;
  return false;
}

export function getDailyAllowanceLimit(state: MonetizationState): number {
  return isProSubscriber(state)
    ? PRO_DAILY_MESSAGE_LIMIT
    : FREE_DAILY_MESSAGE_LIMIT;
}

export function getRemainingDailyQuota(state: MonetizationState): number {
  const limit = getDailyAllowanceLimit(state);
  return Math.max(0, limit - state.dailyMessagesUsed);
}

export function getTotalAvailableReplies(state: MonetizationState): number {
  return (
    getRemainingDailyQuota(state) +
    state.rewardedBonusMessages +
    state.coinBalance
  );
}

export function getActiveModelTierForState(
  state: MonetizationState
): 'pro' | 'free' {
  // Automatic Budget Cap Protection: if monthly API spend reaches cap, route to ultra-cheap Flash-Lite
  if (state.totalEstimatedApiCostUsd >= state.monthlyBudgetCapUsd) {
    return 'free';
  }
  if (isProSubscriber(state) || state.coinBalance > 0) {
    return 'pro';
  }
  return 'free';
}

export async function consumeOneReplyAllowance(
  state: MonetizationState,
  personaName?: string
): Promise<{ allowed: boolean; updatedState: MonetizationState }> {
  const label = personaName ? `Chat with ${personaName}` : 'Advisor Consultation';
  const dailyRemaining = getRemainingDailyQuota(state);
  if (dailyRemaining > 0) {
    const next: MonetizationState = {
      ...state,
      dailyMessagesUsed: state.dailyMessagesUsed + 1,
      xpPoints: state.xpPoints + 15,
      transactions: [
        createTransaction(`${label} (Daily Quota)`, '-1 Daily (+15 XP)', 'spend'),
        ...state.transactions.slice(0, 24),
      ],
    };
    await saveMonetizationState(next);
    return { allowed: true, updatedState: next };
  }

  if (state.rewardedBonusMessages > 0) {
    const next: MonetizationState = {
      ...state,
      rewardedBonusMessages: state.rewardedBonusMessages - 1,
      xpPoints: state.xpPoints + 15,
      transactions: [
        createTransaction(`${label} (Ad Bonus)`, '-1 Ad Reply (+15 XP)', 'spend'),
        ...state.transactions.slice(0, 24),
      ],
    };
    await saveMonetizationState(next);
    return { allowed: true, updatedState: next };
  }

  if (state.coinBalance > 0) {
    const next: MonetizationState = {
      ...state,
      coinBalance: state.coinBalance - 1,
      xpPoints: state.xpPoints + 20,
      transactions: [
        createTransaction(`${label} (Gemini 4 Argon)`, '-1 🪙 (+20 XP)', 'spend'),
        ...state.transactions.slice(0, 24),
      ],
    };
    await saveMonetizationState(next);
    return { allowed: true, updatedState: next };
  }

  return { allowed: false, updatedState: state };
}

export async function activateSubscriptionPlan(
  current: MonetizationState,
  plan: SubscriptionPlan
): Promise<MonetizationState> {
  const planTitle =
    plan === 'pro_lifetime_399'
      ? 'Pro Unlock One-Time ($3.99 • No Ads + Export)'
      : plan === 'pro_monthly'
      ? 'Pro Monthly VIP ($6.99/mo)'
      : 'Weekly Impulse VIP ($2.99/wk)';
  const netStorePayout =
    plan === 'pro_lifetime_399' ? 3.39 : plan === 'pro_monthly' ? 5.94 : 2.54; // After Apple/Google 15% SMB fee
  const bonusCoins = plan === 'pro_lifetime_399' ? 30 : 0;
  const next: MonetizationState = {
    ...current,
    plan,
    coinBalance: current.coinBalance + bonusCoins,
    xpPoints: current.xpPoints + 150,
    totalEstimatedRevenueUsd: Number(
      (current.totalEstimatedRevenueUsd + netStorePayout).toFixed(4)
    ),
    transactions: [
      createTransaction(
        planTitle,
        bonusCoins > 0 ? `AD-FREE + +${bonusCoins} 🪙 (+150 XP)` : 'VIP UNLOCKED (+150 XP)',
        'purchase'
      ),
      ...current.transactions.slice(0, 24),
    ],
  };
  return saveMonetizationState(next);
}

export async function addPersonaCoins(
  current: MonetizationState,
  coinsToAdd: number,
  reasonTitle = 'Persona Coin Top-Up'
): Promise<MonetizationState> {
  const netStorePayout =
    coinsToAdd >= 500 ? 8.49 : coinsToAdd >= 100 ? 2.54 : 0;
  const next: MonetizationState = {
    ...current,
    coinBalance: current.coinBalance + coinsToAdd,
    xpPoints: current.xpPoints + coinsToAdd * 2,
    totalEstimatedRevenueUsd: Number(
      (current.totalEstimatedRevenueUsd + netStorePayout).toFixed(4)
    ),
    transactions: [
      createTransaction(reasonTitle, `+${coinsToAdd} 🪙`, 'purchase'),
      ...current.transactions.slice(0, 24),
    ],
  };
  return saveMonetizationState(next);
}

export async function grantRewardedVideoAdReward(
  current: MonetizationState,
  unlockPersonaId?: string
): Promise<MonetizationState> {
  const nextUnlockedIds =
    unlockPersonaId && !current.adUnlockedPersonaIds.includes(unlockPersonaId)
      ? [...current.adUnlockedPersonaIds, unlockPersonaId]
      : current.adUnlockedPersonaIds;

  // 1 Rewarded Video Ad pays ~$0.022 ($22 eCPM in Tier-1 US/DE/UK)
  const next: MonetizationState = {
    ...current,
    rewardedBonusMessages:
      current.rewardedBonusMessages + REWARDED_VIDEO_BONUS_REPLIES,
    adUnlockedPersonaIds: nextUnlockedIds,
    xpPoints: current.xpPoints + 25,
    totalEstimatedRevenueUsd: Number(
      (current.totalEstimatedRevenueUsd + 0.022).toFixed(4)
    ),
    transactions: [
      createTransaction(
        'AdMob Rewarded Video Watched (+$0.022 Ad Rev)',
        `+${REWARDED_VIDEO_BONUS_REPLIES} Replies (+25 XP)`,
        'earn'
      ),
      ...current.transactions.slice(0, 24),
    ],
  };
  return saveMonetizationState(next);
}

export async function purchaseVipBundle(
  current: MonetizationState,
  bundle: PersonaBundleGroup
): Promise<MonetizationState> {
  const unlockedBundles = current.unlockedBundles.includes(bundle)
    ? current.unlockedBundles
    : [...current.unlockedBundles, bundle];
  const next: MonetizationState = {
    ...current,
    unlockedBundles,
    coinBalance: current.coinBalance + 25,
    xpPoints: current.xpPoints + 120,
    totalEstimatedRevenueUsd: Number(
      (current.totalEstimatedRevenueUsd + 8.49).toFixed(4)
    ),
    transactions: [
      createTransaction(`VIP Bundle: ${bundle}`, '+25 🪙 (+120 XP)', 'purchase'),
      ...current.transactions.slice(0, 24),
    ],
  };
  return saveMonetizationState(next);
}

export async function unlockCustomActionPlan(
  current: MonetizationState,
  personaId: string
): Promise<MonetizationState> {
  const list = current.unlockedActionPlanPersonaIds.includes(personaId)
    ? current.unlockedActionPlanPersonaIds
    : [...current.unlockedActionPlanPersonaIds, personaId];
  const next: MonetizationState = {
    ...current,
    unlockedActionPlanPersonaIds: list,
    xpPoints: current.xpPoints + 50,
    totalEstimatedRevenueUsd: Number(
      (current.totalEstimatedRevenueUsd + 0.84).toFixed(4)
    ),
    transactions: [
      createTransaction('Custom Life Action Plan PDF', 'UNLOCKED (+50 XP)', 'purchase'),
      ...current.transactions.slice(0, 24),
    ],
  };
  return saveMonetizationState(next);
}

// Record exact per-message token & API cost telemetry
export async function recordApiCallTelemetry(
  current: MonetizationState,
  inputTokens: number,
  outputTokens: number,
  costUsd: number
): Promise<MonetizationState> {
  const next: MonetizationState = {
    ...current,
    totalMessagesSent: current.totalMessagesSent + 1,
    totalInputTokens: current.totalInputTokens + inputTokens,
    totalOutputTokens: current.totalOutputTokens + outputTokens,
    totalEstimatedApiCostUsd: Number(
      (current.totalEstimatedApiCostUsd + costUsd).toFixed(5)
    ),
  };
  return saveMonetizationState(next);
}

// Save custom Gemini API Key & Monthly Spend Cap
export async function updateApiSettings(
  current: MonetizationState,
  settings: {
    monthlyBudgetCapUsd?: number;
    customGeminiApiKey?: string;
  }
): Promise<MonetizationState> {
  const next: MonetizationState = {
    ...current,
    customGeminiApiKey:
      settings.customGeminiApiKey !== undefined
        ? settings.customGeminiApiKey.trim()
        : current.customGeminiApiKey,
    monthlyBudgetCapUsd:
      settings.monthlyBudgetCapUsd !== undefined
        ? Math.max(1, settings.monthlyBudgetCapUsd)
        : current.monthlyBudgetCapUsd,
  };
  return saveMonetizationState(next);
}

// Cashloop v3.0 & SnapReels v1.1.9 7-Day Streak Check-In Claim
export async function claimSevenDayStreakReward(
  current: MonetizationState,
  forceNextDayDemo = false
): Promise<{ claimed: boolean; reward: StreakRungReward; updatedState: MonetizationState }> {
  const today = getTodayDateString();
  if (!forceNextDayDemo && current.lastStreakClaimDate === today) {
    const rung =
      STREAK_LADDER_REWARDS[(current.streakDay - 1) % STREAK_LADDER_REWARDS.length];
    return { claimed: false, reward: rung, updatedState: current };
  }

  const activeDay = current.streakDay >= 1 && current.streakDay <= 7 ? current.streakDay : 1;
  const reward = STREAK_LADDER_REWARDS[activeDay - 1];
  const nextDay = activeDay >= 7 ? 1 : activeDay + 1;

  const next: MonetizationState = {
    ...current,
    coinBalance: current.coinBalance + reward.coins,
    xpPoints: current.xpPoints + reward.xp,
    streakDay: nextDay,
    lastStreakClaimDate: today,
    transactions: [
      createTransaction(
        `Streak Check-In (${reward.label})`,
        `+${reward.coins} 🪙 (+${reward.xp} XP)`,
        'earn'
      ),
      ...current.transactions.slice(0, 24),
    ],
  };
  await saveMonetizationState(next);
  return { claimed: true, reward, updatedState: next };
}

// Cashloop v3.0 QuestsScreen.kt Quest Claim
export async function claimQuestReward(
  current: MonetizationState,
  questId: string,
  questTitle: string,
  rewardCoins: number,
  rewardXp: number
): Promise<MonetizationState> {
  if (current.claimedQuestIds.includes(questId)) {
    return current;
  }
  const next: MonetizationState = {
    ...current,
    coinBalance: current.coinBalance + rewardCoins,
    xpPoints: current.xpPoints + rewardXp,
    claimedQuestIds: [...current.claimedQuestIds, questId],
    transactions: [
      createTransaction(
        `Quest Completed: ${questTitle}`,
        `+${rewardCoins} 🪙 (+${rewardXp} XP)`,
        'earn'
      ),
      ...current.transactions.slice(0, 24),
    ],
  };
  return saveMonetizationState(next);
}

// DTPocketFM v1.6 referandearn.dart & SnapReels RewardsScreen Referral Claim
export async function claimReferralReward(
  current: MonetizationState
): Promise<MonetizationState> {
  if (current.referralClaimed) return current;
  const next: MonetizationState = {
    ...current,
    coinBalance: current.coinBalance + 10,
    xpPoints: current.xpPoints + 60,
    referralClaimed: true,
    transactions: [
      createTransaction('Refer & Earn Friend Invite Bonus', '+10 🪙 (+60 XP)', 'earn'),
      ...current.transactions.slice(0, 24),
    ],
  };
  return saveMonetizationState(next);
}

// DTPocketFM v1.6 threads.dart Like / Bookmark toggle
export async function toggleLikeWisdomThread(
  current: MonetizationState,
  threadId: string
): Promise<MonetizationState> {
  const exists = current.likedThreadIds.includes(threadId);
  const nextLiked = exists
    ? current.likedThreadIds.filter((id) => id !== threadId)
    : [...current.likedThreadIds, threadId];
  const next: MonetizationState = {
    ...current,
    likedThreadIds: nextLiked,
  };
  return saveMonetizationState(next);
}

export async function resetMonetizationToFree(): Promise<MonetizationState> {
  const initial = getDefaultMonetizationState();
  return saveMonetizationState(initial);
}

// Astroway v6.1 sendGiftBottomSheet.dart: balance check -> deduct -> log transaction.
// Virtual gifts are pure-margin: they cost $0 in API tokens.
export async function sendGiftToPersona(
  current: MonetizationState,
  personaName: string,
  giftLabel: string,
  coinCost: number
): Promise<{ ok: boolean; reason?: 'insufficient_balance'; updatedState: MonetizationState }> {
  if (current.coinBalance < coinCost) {
    return { ok: false, reason: 'insufficient_balance', updatedState: current };
  }
  const next: MonetizationState = {
    ...current,
    coinBalance: current.coinBalance - coinCost,
    xpPoints: current.xpPoints + coinCost * 3,
    transactions: [
      createTransaction(
        `Gift to ${personaName}: ${giftLabel}`,
        `-${coinCost} 🪙 (+${coinCost * 3} XP)`,
        'spend'
      ),
      ...current.transactions.slice(0, 24),
    ],
  };
  await saveMonetizationState(next);
  return { ok: true, updatedState: next };
}

