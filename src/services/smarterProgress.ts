import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppLanguage } from '../constants/smarter7yoI18n';

/**
 * Persistent progress for "Are You Smarter Than a 7-Year-Old?".
 * Protected by a v2 stream-cipher envelope (xorCipherHex / xorDecipherHex) and
 * a 64-bit keyed MAC signature (computeProgressMac) + embedded copyright watermark.
 */

export interface RunRecord {
  id: string;
  date: number;
  mode: 'million_ladder' | 'speed_blitz' | 'subject_practice';
  rungReached: number; // 1..10
  prizeLabel: string;
  classmateId: string;
  iqScore: number;
  won: boolean;
}

export interface SmarterProgress {
  language?: AppLanguage;
  languageChosen?: boolean;
  onboardingDone: boolean;
  goldStars: number;
  iqScore: number;
  bestStreak: number;
  isVipHonorRoll: boolean;
  bestRung: number;
  totalCorrect: number;
  totalAnswered: number;
  seenStoryIds: string[];
  seenStoryDate: string;
  history: RunRecord[];
  earnedBadgeIds: string[];
}

const KEY = '@smarter7yo_progress_v1';
const MAX_HISTORY = 30;

/**
 * Embedded Digital Copyright & Authorship Watermark.
 * Proves original ownership in DMCA / Google Play Legal proceedings if Hermes bytecode is copied.
 */
export const SMARTER7YO_COPYRIGHT_WATERMARK =
  'Copyright (c) 2026 Wakjira Shewangzaw Dabi | com.wakjira.smarter7yo | All Rights Reserved | SHA256:4a9c7e2b8f1d5a3c6e0b9f4d2a7c1e8b3d6f5a9c2e4b7d1f8a3c6e5b0d9f2a4c';

export const SMARTER7YO_WATERMARK_BLOCKS = [
  0x57616b6a, // "Wakj"
  0x69726153, // "iraS"
  0x68657761, // "hewa"
  0x6e677a61, // "ngza"
  0x77446162, // "wDab"
  0x69323032, // "i202"
  0x36536d61, // "6Sma"
  0x72746572, // "rter"
] as const;

const PROGRESS_SECRET = 'WakjiraShewangzawDabi::com.wakjira.smarter7yo::2026::4a9c7e2b8f1d5a3c';

export function verifySmarter7YoRuntimeIntegrity(): boolean {
  let acc = 0;
  for (let i = 0; i < SMARTER7YO_WATERMARK_BLOCKS.length; i++) {
    acc = (acc ^ SMARTER7YO_WATERMARK_BLOCKS[i]) >>> 0;
  }
  return (
    acc !== 0 &&
    SMARTER7YO_COPYRIGHT_WATERMARK.startsWith('Copyright (c) 2026 Wakjira Shewangzaw Dabi')
  );
}

export function canonicalProgressString(p: SmarterProgress): string {
  return `${p.goldStars}|${p.iqScore}|${p.bestStreak}|${p.isVipHonorRoll ? 1 : 0}|${p.bestRung}|${p.totalCorrect}|${p.totalAnswered}`;
}

export function computeProgressMac(p: SmarterProgress): string {
  const canonical = canonicalProgressString(p);
  const input = `${PROGRESS_SECRET}|${canonical}|${SMARTER7YO_COPYRIGHT_WATERMARK.length}`;
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

export function xorCipherHex(text: string): string {
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const k1 = PROGRESS_SECRET.charCodeAt(i % PROGRESS_SECRET.length);
    const k2 = ((i * 31 + 17) & 0xff) ^ (k1 & 0xff);
    const enc = (text.charCodeAt(i) & 0xff) ^ k2;
    out += enc.toString(16).padStart(2, '0');
  }
  return out;
}

export function xorDecipherHex(hex: string): string {
  if (!hex || hex.length % 2 !== 0) return '';
  let out = '';
  for (let i = 0; i < hex.length; i += 2) {
    const byteIndex = i >> 1;
    const k1 = PROGRESS_SECRET.charCodeAt(byteIndex % PROGRESS_SECRET.length);
    const k2 = ((byteIndex * 31 + 17) & 0xff) ^ (k1 & 0xff);
    const byteVal = parseInt(hex.slice(i, i + 2), 16);
    if (Number.isNaN(byteVal)) return '';
    out += String.fromCharCode((byteVal ^ k2) & 0xff);
  }
  return out;
}

export const DEFAULT_SMARTER_PROGRESS: SmarterProgress = {
  language: 'en',
  languageChosen: false,
  onboardingDone: false,
  goldStars: 15,
  iqScore: 105,
  bestStreak: 0,
  isVipHonorRoll: false,
  bestRung: 0,
  totalCorrect: 0,
  totalAnswered: 0,
  seenStoryIds: [],
  seenStoryDate: '',
  history: [],
  earnedBadgeIds: [],
};

function sanitizeSmarterProgress(p: Partial<SmarterProgress>): SmarterProgress {
  const merged: SmarterProgress = {
    ...DEFAULT_SMARTER_PROGRESS,
    ...p,
    goldStars: Number.isFinite(p.goldStars)
      ? Math.max(0, Math.min(5000, Math.floor(p.goldStars as number)))
      : DEFAULT_SMARTER_PROGRESS.goldStars,
    iqScore: Number.isFinite(p.iqScore)
      ? Math.max(70, Math.min(200, Math.floor(p.iqScore as number)))
      : DEFAULT_SMARTER_PROGRESS.iqScore,
    bestStreak: Number.isFinite(p.bestStreak)
      ? Math.max(0, Math.floor(p.bestStreak as number))
      : 0,
    isVipHonorRoll: Boolean(p.isVipHonorRoll),
    bestRung: Number.isFinite(p.bestRung)
      ? Math.max(0, Math.min(10, Math.floor(p.bestRung as number)))
      : 0,
    totalCorrect: Number.isFinite(p.totalCorrect)
      ? Math.max(0, Math.floor(p.totalCorrect as number))
      : 0,
    totalAnswered: Number.isFinite(p.totalAnswered)
      ? Math.max(0, Math.floor(p.totalAnswered as number))
      : 0,
    seenStoryIds: Array.isArray(p.seenStoryIds) ? p.seenStoryIds : [],
    seenStoryDate: typeof p.seenStoryDate === 'string' ? p.seenStoryDate : '',
    history: Array.isArray(p.history) ? p.history.slice(0, MAX_HISTORY) : [],
    earnedBadgeIds: Array.isArray(p.earnedBadgeIds) ? p.earnedBadgeIds : [],
  };
  return merged;
}

export async function loadSmarterProgress(): Promise<SmarterProgress> {
  try {
    if (!verifySmarter7YoRuntimeIntegrity()) {
      return { ...DEFAULT_SMARTER_PROGRESS };
    }
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_SMARTER_PROGRESS };
    const parsed = JSON.parse(raw);

    let merged: SmarterProgress;
    if (parsed && parsed.v === 2 && typeof parsed.p === 'string' && typeof parsed.sig === 'string') {
      const jsonStr = xorDecipherHex(parsed.p);
      if (!jsonStr) return { ...DEFAULT_SMARTER_PROGRESS };
      const candidate = sanitizeSmarterProgress(JSON.parse(jsonStr));
      const expectedSig = computeProgressMac(candidate);
      if (expectedSig !== parsed.sig) {
        // Tampered v2 envelope detected — reset privileged counters
        merged = {
          ...candidate,
          goldStars: DEFAULT_SMARTER_PROGRESS.goldStars,
          isVipHonorRoll: false,
        };
      } else {
        merged = candidate;
      }
    } else {
      // Smooth one-time migration from v1 plain-text JSON (verifying _sig if present)
      merged = sanitizeSmarterProgress(parsed);
      if (parsed && typeof parsed._sig === 'string') {
        const expected = computeProgressMac(merged);
        if (expected !== parsed._sig) {
          merged.goldStars = DEFAULT_SMARTER_PROGRESS.goldStars;
          merged.isVipHonorRoll = false;
        }
      } else {
        merged.goldStars = Math.min(50, merged.goldStars);
        merged.isVipHonorRoll = false;
      }
    }

    // Stories reset daily so there is always something new to tap.
    const today = new Date().toISOString().slice(0, 10);
    if (merged.seenStoryDate !== today) {
      merged.seenStoryIds = [];
      merged.seenStoryDate = today;
    }
    return merged;
  } catch {
    return { ...DEFAULT_SMARTER_PROGRESS };
  }
}

export async function saveSmarterProgress(p: SmarterProgress): Promise<SmarterProgress> {
  const clean = sanitizeSmarterProgress(p);
  try {
    const sig = computeProgressMac(clean);
    const encPayload = xorCipherHex(JSON.stringify(clean));
    await AsyncStorage.setItem(KEY, JSON.stringify({ v: 2, p: encPayload, sig }));
  } catch {
    // Non-fatal
  }
  return clean;
}

export function addRunToHistory(p: SmarterProgress, run: Omit<RunRecord, 'id' | 'date'>): SmarterProgress {
  const record: RunRecord = { ...run, id: `run-${Date.now()}`, date: Date.now() };
  return {
    ...p,
    bestRung: Math.max(p.bestRung, run.rungReached),
    history: [record, ...p.history].slice(0, MAX_HISTORY),
  };
}

/** Achievement badges (Astroway badgeAchievement.dart "N badges earned" pattern). */
export interface SmarterBadge {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  isEarned: (p: SmarterProgress) => boolean;
}

export const SMARTER_BADGES: SmarterBadge[] = [
  { id: 'first-correct', emoji: '⭐', title: 'Gold Star', desc: 'Answer your first question right', isEarned: (p) => p.totalCorrect >= 1 },
  { id: 'streak-5', emoji: '🔥', title: 'On Fire', desc: '5 correct in a row', isEarned: (p) => p.bestStreak >= 5 },
  { id: 'safe-haven', emoji: '🛡️', title: 'Safe Haven', desc: 'Reach the $25,000 rung', isEarned: (p) => p.bestRung >= 5 },
  { id: 'rung-8', emoji: '🏅', title: 'Honor Roll', desc: 'Reach the $250,000 rung', isEarned: (p) => p.bestRung >= 8 },
  { id: 'millionaire', emoji: '👑', title: 'Supreme Genius', desc: 'Win the $1,000,000', isEarned: (p) => p.history.some((r) => r.won) },
  { id: 'scholar-50', emoji: '📚', title: 'Bookworm', desc: 'Answer 50 questions', isEarned: (p) => p.totalAnswered >= 50 },
  { id: 'iq-130', emoji: '🧠', title: 'Big Brain', desc: 'Reach Playground IQ 130', isEarned: (p) => p.iqScore >= 130 },
  { id: 'stories-all', emoji: '📖', title: 'Story Time', desc: "Watch all 5 classmates' stories today", isEarned: (p) => p.seenStoryIds.length >= 5 },
];

/** Returns ids newly earned since last check, and the updated progress. */
export function syncBadges(p: SmarterProgress): { progress: SmarterProgress; newlyEarned: SmarterBadge[] } {
  const newlyEarned = SMARTER_BADGES.filter((b) => !p.earnedBadgeIds.includes(b.id) && b.isEarned(p));
  if (newlyEarned.length === 0) return { progress: p, newlyEarned };
  return {
    progress: { ...p, earnedBadgeIds: [...p.earnedBadgeIds, ...newlyEarned.map((b) => b.id)] },
    newlyEarned,
  };
}
