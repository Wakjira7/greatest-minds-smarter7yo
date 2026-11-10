export type PersonaCategory = 'Historical' | 'Parody';

export type MindRealm =
  | 'Stoics & Philosophers'
  | 'Cosmic Scientists'
  | 'Inventors & Futurists'
  | 'Emperors & Queens'
  | 'Master Strategists'
  | 'Renaissance & Poets'
  | 'Detectives & Strategists'
  | 'High-Performance Titans'
  | 'Zen & Mystics'
  | 'Explorers & Visionaries';

export type MotionEffectType =
  | 'solar_embers'
  | 'cosmic_stars'
  | 'plasma_lightning'
  | 'royal_gold'
  | 'zen_sakura'
  | 'crimson_scroll'
  | 'noir_rain'
  | 'chef_flames';

export type PersonaBundleGroup =
  | 'Ancient Philosophers Pack'
  | 'Billionaire & Genius Mentors Pack';

export type SubscriptionPlan = 'free' | 'pro_weekly' | 'pro_monthly' | 'pro_lifetime_399';

export interface Persona {
  id: string;
  name: string;
  title: string;
  eraOrOrigin: string;
  category: PersonaCategory;
  realm?: MindRealm;
  portraitKey?: string;
  motionEffect?: MotionEffectType;
  specialtyBadge: string;
  avatarEmoji: string;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  catchphrases: [string, string, string];
  greeting: string;
  quickStarters: string[];
  shortBio: string;
  systemPrompt: string;
  isFreeStarter: boolean;
  bundleGroup: PersonaBundleGroup;
}

export interface ChatMessage {
  id: string;
  personaId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  catchphraseUsed?: string;
  modelUsed?: string;
  isMock?: boolean;
  reported?: boolean;
  reportReason?: string;
  tokensUsed?: number;
  costUsd?: number;
}

export interface ChatRequestPayload {
  personaId: string;
  userMessage: string;
  userTier?: 'free' | 'pro';
  chatHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

export interface ChatResponsePayload {
  reply: string;
  catchphraseUsed?: string;
  model: string;
  isMock: boolean;
  historyWindowUsed: number;
  inputTokens?: number;
  outputTokens?: number;
  costUsd?: number;
}

export interface MessageReport {
  id: string;
  messageId: string;
  personaId: string;
  messageExcerpt: string;
  reason: string;
  createdAt: number;
}

export interface CoinTransaction {
  id: string;
  title: string;
  amountText: string;
  type: 'earn' | 'spend' | 'purchase';
  timestamp: number;
}

export interface MonetizationState {
  plan: SubscriptionPlan;
  dailyMessagesUsed: number;
  lastResetDate: string;
  coinBalance: number;
  rewardedBonusMessages: number;
  unlockedBundles: PersonaBundleGroup[];
  adUnlockedPersonaIds: string[];
  unlockedActionPlanPersonaIds: string[];
  // Cashloop v3.0 & SnapReels v1.1.9 Gamification & Retention state
  streakDay: number;
  lastStreakClaimDate: string | null;
  xpPoints: number;
  claimedQuestIds: string[];
  referralClaimed: boolean;
  likedThreadIds: string[];
  transactions: CoinTransaction[];
  // Live API Usage, Cost Meter & Budget Protection
  totalMessagesSent: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalEstimatedApiCostUsd: number;
  totalEstimatedRevenueUsd: number;
  monthlyBudgetCapUsd: number;
  customGeminiApiKey: string;
}


