import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import type { OcrLine } from '../../modules/omniscan-engine';

/** Free plan: pages per day, and pages granted per rewarded video. */
export const FREE_PAGES_PER_DAY = 1;
export const PAGES_PER_VIDEO = 3;
/** If AdMob has no video to show, we still help the user this many times per day. */
export const NO_FILL_GIFTS_PER_DAY = 2;

const STATE_KEY = 'omniscan.state.v1';
const INDEX_KEY = 'omniscan.docs.v1';
const DOC_DIR = `${FileSystem.documentDirectory ?? ''}docs/`;

/**
 * Embedded Digital Copyright & Authorship Watermark.
 * Proves original ownership in DMCA / Google Play Legal proceedings if Hermes bytecode is copied.
 */
export const OMNISCAN_COPYRIGHT_FINGERPRINT =
  'Copyright (c) 2026 Wakjira Shewangzaw Dabi | com.wakjira.offlineocr | All Rights Reserved | SHA256:8f4e2b9c7d1a6e3f5b0c8a9d4e2f7b1c6a3d8e5f2b9c4a7d1e6f3b8a5c2d9e4f';

const WALLET_SECRET = 'WakjiraShewangzawDabi::com.wakjira.offlineocr::2026::8f4e2b9c7d1a6e3f';
const VALID_PRO_PRODUCTS = new Set(['omniscan_pro_monthly', 'omniscan_pro_lifetime']);

function computeWalletMac(canonical: string): string {
  const input = `${WALLET_SECRET}|${canonical}|${OMNISCAN_COPYRIGHT_FINGERPRINT.length}`;
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

function xorCipherHex(text: string): string {
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const k1 = WALLET_SECRET.charCodeAt(i % WALLET_SECRET.length);
    const k2 = ((i * 31 + 17) & 0xff) ^ (k1 & 0xff);
    const enc = (text.charCodeAt(i) & 0xff) ^ k2;
    out += enc.toString(16).padStart(2, '0');
  }
  return out;
}

function xorDecipherHex(hex: string): string {
  if (!hex || hex.length % 2 !== 0) return '';
  let out = '';
  for (let i = 0; i < hex.length; i += 2) {
    const byteIndex = i >> 1;
    const k1 = WALLET_SECRET.charCodeAt(byteIndex % WALLET_SECRET.length);
    const k2 = ((byteIndex * 31 + 17) & 0xff) ^ (k1 & 0xff);
    const byteVal = parseInt(hex.slice(i, i + 2), 16);
    if (Number.isNaN(byteVal)) return '';
    out += String.fromCharCode((byteVal ^ k2) & 0xff);
  }
  return out;
}

function canonicalWalletString(w: Wallet): string {
  return `${w.day}|${w.freeUsedToday}|${w.bonusPages}|${w.noFillGiftsToday}|${w.pro ? 1 : 0}|${w.proProduct ?? ''}|${w.totalPages}`;
}

function sanitizeWallet(w: Wallet): Wallet {
  const validPro = Boolean(w.pro && w.proProduct && VALID_PRO_PRODUCTS.has(w.proProduct));
  const safeBonus = Number.isFinite(w.bonusPages) ? Math.max(0, Math.min(500, Math.floor(w.bonusPages))) : 0;
  const safeFreeUsed = Number.isFinite(w.freeUsedToday) ? Math.max(0, Math.floor(w.freeUsedToday)) : 0;
  const safeGifts = Number.isFinite(w.noFillGiftsToday) ? Math.max(0, Math.floor(w.noFillGiftsToday)) : 0;
  const safeTotal = Number.isFinite(w.totalPages) ? Math.max(0, Math.floor(w.totalPages)) : 0;
  return {
    day: typeof w.day === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(w.day) ? w.day : today(),
    freeUsedToday: safeFreeUsed,
    bonusPages: safeBonus,
    noFillGiftsToday: safeGifts,
    pro: validPro,
    proProduct: validPro ? w.proProduct : undefined,
    totalPages: safeTotal,
  };
}

export interface Wallet {
  day: string;
  freeUsedToday: number;
  bonusPages: number;
  noFillGiftsToday: number;
  pro: boolean;
  proProduct?: string;
  totalPages: number;
}

export interface DocPage {
  w: number;
  h: number;
  text: string;
  lines: OcrLine[];
}

export interface DocMeta {
  id: string;
  title: string;
  kind: 'pdf' | 'photo' | 'camera';
  createdAt: number;
  pages: number;
  totalPages: number;
  preview: string;
  search: string;
  chars: number;
}

export interface DocBody {
  title: string;
  pages: DocPage[];
}

export function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export const freshWallet = (): Wallet => ({
  day: today(),
  freeUsedToday: 0,
  bonusPages: 0,
  noFillGiftsToday: 0,
  pro: false,
  totalPages: 0,
});

/** Applies the daily reset (free page + no-fill gift counter) whenever the calendar day changes. */
export function rollDay(w: Wallet): Wallet {
  const t = today();
  return w.day === t ? w : { ...w, day: t, freeUsedToday: 0, noFillGiftsToday: 0 };
}

export function pagesLeft(w: Wallet): number {
  if (w.pro) return Number.POSITIVE_INFINITY;
  return Math.max(0, FREE_PAGES_PER_DAY - w.freeUsedToday) + w.bonusPages;
}

/** Spends one page credit (free first, then bonus). Returns null if none left. */
export function spendPage(w: Wallet): Wallet | null {
  if (w.pro) return { ...w, totalPages: w.totalPages + 1 };
  if (w.freeUsedToday < FREE_PAGES_PER_DAY) {
    return { ...w, freeUsedToday: w.freeUsedToday + 1, totalPages: w.totalPages + 1 };
  }
  if (w.bonusPages > 0) return { ...w, bonusPages: w.bonusPages - 1, totalPages: w.totalPages + 1 };
  return null;
}

export async function loadWallet(): Promise<Wallet> {
  try {
    const raw = await AsyncStorage.getItem(STATE_KEY);
    if (!raw) return freshWallet();
    const parsed = JSON.parse(raw);
    if (parsed && parsed.v === 2 && typeof parsed.p === 'string' && typeof parsed.sig === 'string') {
      const jsonStr = xorDecipherHex(parsed.p);
      if (!jsonStr) return freshWallet();
      const candidate = sanitizeWallet({ ...freshWallet(), ...JSON.parse(jsonStr) });
      const expectedSig = computeWalletMac(canonicalWalletString(candidate));
      if (expectedSig !== parsed.sig) {
        // Tampered wallet detected — reset to fresh unprivileged state
        return freshWallet();
      }
      return rollDay(candidate);
    }
    // Smooth one-time migration from v1 (sanitizing against root edits)
    const migrated = sanitizeWallet({ ...freshWallet(), ...parsed, bonusPages: Math.min(30, Number(parsed?.bonusPages) || 0) });
    return rollDay(migrated);
  } catch {
    return freshWallet();
  }
}

export async function saveWallet(w: Wallet): Promise<void> {
  const clean = sanitizeWallet(w);
  const sig = computeWalletMac(canonicalWalletString(clean));
  const p = xorCipherHex(JSON.stringify(clean));
  await AsyncStorage.setItem(STATE_KEY, JSON.stringify({ v: 2, p, sig }));
}

// ------------------------------------------------------------------ Library

export async function loadIndex(): Promise<DocMeta[]> {
  try {
    const raw = await AsyncStorage.getItem(INDEX_KEY);
    return raw ? (JSON.parse(raw) as DocMeta[]) : [];
  } catch {
    return [];
  }
}

async function saveIndex(list: DocMeta[]): Promise<void> {
  await AsyncStorage.setItem(INDEX_KEY, JSON.stringify(list));
}

export function docPath(id: string): string {
  return `${DOC_DIR}${id}.json`;
}

async function ensureDir() {
  const info = await FileSystem.getInfoAsync(DOC_DIR);
  if (!info.exists) await FileSystem.makeDirectoryAsync(DOC_DIR, { intermediates: true });
}

export function buildMeta(id: string, kind: DocMeta['kind'], body: DocBody, totalPages: number, createdAt: number): DocMeta {
  const full = body.pages.map((p) => p.text).join('\n\n');
  return {
    id,
    title: body.title,
    kind,
    createdAt,
    pages: body.pages.length,
    totalPages,
    preview: full.replace(/\s+/g, ' ').trim().slice(0, 180),
    search: (body.title + ' ' + full).toLowerCase().slice(0, 6000),
    chars: full.length,
  };
}

/** Writes the document body to disk and upserts its index entry (used for checkpoints too). */
export async function saveDoc(meta: DocMeta, body: DocBody): Promise<DocMeta[]> {
  await ensureDir();
  await FileSystem.writeAsStringAsync(docPath(meta.id), JSON.stringify(body));
  const list = await loadIndex();
  const next = [meta, ...list.filter((d) => d.id !== meta.id)].sort((a, b) => b.createdAt - a.createdAt);
  await saveIndex(next);
  return next;
}

export async function readDoc(id: string): Promise<DocBody | null> {
  try {
    return JSON.parse(await FileSystem.readAsStringAsync(docPath(id))) as DocBody;
  } catch {
    return null;
  }
}

export async function deleteDoc(id: string): Promise<DocMeta[]> {
  await FileSystem.deleteAsync(docPath(id), { idempotent: true });
  const next = (await loadIndex()).filter((d) => d.id !== id);
  await saveIndex(next);
  return next;
}

export async function renameDoc(id: string, title: string): Promise<DocMeta[]> {
  const body = await readDoc(id);
  const list = await loadIndex();
  const meta = list.find((d) => d.id === id);
  if (!body || !meta) return list;
  body.title = title;
  return saveDoc({ ...meta, title, search: (title + ' ' + meta.search).slice(0, 6000) }, body);
}
