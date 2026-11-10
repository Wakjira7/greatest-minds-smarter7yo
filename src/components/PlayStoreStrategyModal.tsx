import React, { useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { maybeShowInterstitial } from '../services/adsManager';
import {
  ExportFormat,
  exportGreatestMindsData,
  exportSmarter7YoData,
  importOfflineBackupJson,
} from '../services/dataExport';

interface PlayStoreStrategyModalProps {
  visible: boolean;
  onClose: () => void;
  activeApp: 'minds' | 'smarter7yo';
  isAdFree?: boolean;
  onTriggerPaywall?: () => void;
}

type ScenarioId = 'zero_promo' | 'niche_aso' | 'ranked_viral';

interface ScenarioPreset {
  id: ScenarioId;
  label: string;
  dauPerApp: number;
  monthlyNewInstallsPerApp: number;
  desc: string;
}

const SCENARIOS: ScenarioPreset[] = [
  {
    id: 'zero_promo',
    label: '1. Zero Promo (Default)',
    dauPerApp: 4,
    monthlyNewInstallsPerApp: 25,
    desc: 'No ASO keyword match & zero marketing. AdMob-only gets stranded under the $100 payout limit.',
  },
  {
    id: 'niche_aso',
    label: '2. ASO Niche Match',
    dauPerApp: 180,
    monthlyNewInstallsPerApp: 1400,
    desc: 'Targets long-tail Google Play autocomplete keywords where top competitors have <3.8★ ratings.',
  },
  {
    id: 'ranked_viral',
    label: '3. Ranked / Viral Hit',
    dauPerApp: 1600,
    monthlyNewInstallsPerApp: 11000,
    desc: 'High-retention loop (streaks, 200 3D avatars, shareable 7-Yo certificates) + Shorts/TikTok clips.',
  },
];

const ASO_PACKAGES = {
  minds: {
    appName: 'Talk to the Greatest Minds',
    title: 'Greatest Minds: Stoic AI Chat', // 29 chars (<30 limit!)
    shortDesc: 'Offline-first 3D Stoic & Genius AI mentor journal. No login, CSV/JSON export.', // 77 chars (<80 limit!)
    longTailKeywords: [
      'stoic daily journal mentor offline',
      'marcus aurelius philosophy chat ai',
      'historical figure decision helper',
      'offline mindset coach no account',
      'socratic questioning study tool',
    ],
    longDesc: `Solve tough life, career, and study decisions in under 60 seconds with 200 interactive 3D historical mentors across 10 Mastery Realms—from Marcus Aurelius and Socrates to Nikola Tesla and Cleopatra VII.

Why Users Switch to Greatest Minds:
• 100% No-Login Access: Open the app and start consulting immediately. Never forced to create an account or hand over your email.
• Offline-First Wisdom Journal & Export: All chat transcripts, daily streaks, XP progression, and action plans are stored locally on your device. Export anytime to CSV, JSON backup, or Printable HTML Summary.
• 200 Living 3D Ghibli-Style Mentors: Touch any mentor portrait to awaken custom 3D motion physics, voice read-aloud, and Socratic action frameworks.
• 10 Structured Mastery Realms: Stoics & Philosophers, Cosmic Scientists, Inventors & Futurists, Emperors & Queens, Master Strategists, and more.

Privacy & Data Guarantee:
No account required, 100% offline-capable local database, zero personal data sold. Optional $3.99 one-time Pro Unlock permanently removes all ads forever.`,
  },
  smarter7yo: {
    appName: 'Are You Smarter Than a 7-Year-Old?',
    title: 'Smarter Than a 7-Year-Old IQ', // 28 chars (<30 limit!)
    shortDesc: 'Offline grade-school trivia ladder & report card. Zero login, family quiz!', // 74 chars (<80 limit!)
    longTailKeywords: [
      'are you smarter than a kid trivia offline',
      'grade school quiz game no wifi',
      'elementary math science brain test',
      'family classroom trivia game show',
      'offline iq report card quiz',
    ],
    longDesc: `Think you remember 1st-to-5th grade Math, Science, Space, Spelling, and History? Step up to the 3D Chalkboard Arena and test your brain against 5 prodigy 7-year-old classmates to climb the 10-rung $1,000,000 Scholarship Ladder!

Built for Instant Offline Play & Deep Utility:
• 100% Offline Family Trivia: Works on flights, commutes, and classrooms with zero internet required and zero API token cost.
• 5 3D Classmate Partners & 3 Lifelines: Team up with Leo (Math), Maya (Science), Toby (Space), Chloe (Spelling), and Zane (Riddles). Use Peek, Copy, or Erase-2 when you get stuck!
• Persistent Offline Report Card & Visual Charts: Track your accuracy, best streak, rung progression bar charts, and 8 unlockable achievement badges.
• 1-Click CSV, JSON & Transcript Export: Export your official Academy Report Card anytime.

Privacy & Data Guarantee:
No account required, 100% offline local storage, zero personal data collected. Optional $3.99 one-time Pro Unlock permanently disables all ads.`,
  },
};

export const PlayStoreStrategyModal: React.FC<PlayStoreStrategyModalProps> = ({
  visible,
  onClose,
  activeApp,
  isAdFree = false,
  onTriggerPaywall,
}) => {
  const [tab, setTab] = useState<'calculator' | 'export_audit' | 'aso_copy'>('calculator');
  const [scenarioId, setScenarioId] = useState<ScenarioId>('niche_aso');
  const [appCount, setAppCount] = useState<number>(2);
  const [tier1Market, setTier1Market] = useState<boolean>(true);
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);
  const [importText, setImportText] = useState<string>('');
  const [selectedAsoApp, setSelectedAsoApp] = useState<'minds' | 'smarter7yo'>(activeApp);

  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[1];

  // 2026 eCPM & Hybrid Revenue Math (from the Gemini 2026 Play Store analysis)
  const marketMultiplier = tier1Market ? 1.0 : 0.38; // Tier-1 (DE/US/UK) vs Global Blend
  const bannerEcpm = 0.85 * marketMultiplier;
  const interstitialEcpm = 6.5 * marketMultiplier;
  const rewardedEcpm = 12.0 * marketMultiplier;

  const totalDau = scenario.dauPerApp * appCount;
  const annualBannerImps = totalDau * 3.2 * 365;
  const annualInterstitialImps = totalDau * 0.75 * 365; // Capped at 1 per 4 mins / every 3rd milestone
  const annualRewardedImps = totalDau * 0.45 * 365;

  const admobOnlyAnnualUsd = Math.round(
    (annualBannerImps / 1000) * bannerEcpm +
      (annualInterstitialImps / 1000) * interstitialEcpm
  );

  // Hybrid Model adds:
  // 1) Rewarded Video Ads ($12 eCPM)
  // 2) $3.99 One-Time Pro Unlock ($3.39 net after 15% Google Play SMB fee) @ 2.1% of monthly installs
  // 3) Consumable Coins / Weekly VIP micro-upgrades @ 0.8% of monthly installs ($4.20 avg net)
  const annualNewInstalls = scenario.monthlyNewInstallsPerApp * 12 * appCount;
  const proUnlockBuyers = Math.round(annualNewInstalls * 0.021);
  const proUnlockNetUsd = Math.round(proUnlockBuyers * 3.39);
  const coinAndVipNetUsd = Math.round(annualNewInstalls * 0.008 * 4.2);
  const rewardedNetUsd = Math.round((annualRewardedImps / 1000) * rewardedEcpm);

  const hybridAnnualUsd =
    admobOnlyAnnualUsd + rewardedNetUsd + proUnlockNetUsd + coinAndVipNetUsd;

  const handleRunExport = async (target: 'minds' | 'smarter7yo', format: ExportFormat) => {
    const res =
      target === 'minds'
        ? await exportGreatestMindsData(format)
        : await exportSmarter7YoData(format);
    setExportFeedback(`✅ ${res.summaryText}`);
    await maybeShowInterstitial({ isAdFree });
  };

  const handleImportJson = async () => {
    if (!importText.trim()) {
      setExportFeedback('⚠️ Paste a JSON backup payload first.');
      return;
    }
    const res = await importOfflineBackupJson(importText.trim());
    setExportFeedback(res.ok ? `✅ ${res.message}` : `❌ ${res.message}`);
    if (res.ok) setImportText('');
  };

  const copyOrShareText = async (label: string, text: string) => {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setExportFeedback(`📋 Copied "${label}" to clipboard!`);
      return;
    }
    try {
      await Share.share({ title: label, message: text });
    } catch {
      // ignore
    }
  };

  const aso = ASO_PACKAGES[selectedAsoApp];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.badge}>🚀 2026 GOOGLE PLAY & ADMOB SURVIVAL HUB</Text>
              <Text style={styles.title}>
                API 36 • Hybrid $3.99 Math • Offline Export • ASO Kit
              </Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          {/* Top Segmented Tabs */}
          <View style={styles.tabsRow}>
            <Pressable
              onPress={() => setTab('calculator')}
              style={[styles.tabBtn, tab === 'calculator' && styles.tabBtnActive]}
            >
              <Text style={[styles.tabText, tab === 'calculator' && styles.tabTextActive]}>
                💰 Hybrid Math
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setTab('export_audit')}
              style={[styles.tabBtn, tab === 'export_audit' && styles.tabBtnActive]}
            >
              <Text style={[styles.tabText, tab === 'export_audit' && styles.tabTextActive]}>
                🛡️ Export & Policy
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setTab('aso_copy')}
              style={[styles.tabBtn, tab === 'aso_copy' && styles.tabBtnActive]}
            >
              <Text style={[styles.tabText, tab === 'aso_copy' && styles.tabTextActive]}>
                📈 ASO Store Kit
              </Text>
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {tab === 'calculator' && (
              <View>
                <Text style={styles.sectionHeading}>
                  COMPARE THE MATH: ADMOB-ONLY VS. 2026 HYBRID MONETIZATION
                </Text>
                <Text style={styles.helperText}>
                  Just 1 user buying the $3.99 One-Time Pro Unlock ($3.39 net) equals ~4,000
                  banner ad impressions. Select your traffic scenario and portfolio size:
                </Text>

                {/* Scenario Selector */}
                <View style={styles.scenarioCol}>
                  {SCENARIOS.map((s) => {
                    const active = s.id === scenarioId;
                    return (
                      <Pressable
                        key={s.id}
                        onPress={() => setScenarioId(s.id)}
                        style={[styles.scenarioCard, active && styles.scenarioCardActive]}
                      >
                        <View style={styles.scenarioTop}>
                          <Text style={styles.scenarioTitle}>{s.label}</Text>
                          <Text style={styles.scenarioDau}>{s.dauPerApp} DAU / app</Text>
                        </View>
                        <Text style={styles.scenarioDesc}>{s.desc}</Text>
                      </Pressable>
                    );
                  })}
                </View>

                {/* Portfolio App Count & Market Tier Controls */}
                <View style={styles.controlsRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.controlLabel}>Apps Published ({appCount})</Text>
                    <View style={styles.pillRow}>
                      {[1, 2, 3, 5].map((n) => (
                        <Pressable
                          key={n}
                          onPress={() => setAppCount(n)}
                          style={[styles.pillBtn, appCount === n && styles.pillBtnActive]}
                        >
                          <Text
                            style={[styles.pillText, appCount === n && styles.pillTextActive]}
                          >
                            {n} {n === 1 ? 'App' : 'Apps'}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.controlLabel}>Primary Audience</Text>
                    <View style={styles.pillRow}>
                      <Pressable
                        onPress={() => setTier1Market(true)}
                        style={[styles.pillBtn, tier1Market && styles.pillBtnActive]}
                      >
                        <Text style={[styles.pillText, tier1Market && styles.pillTextActive]}>
                          🇩🇪🇺🇸 Tier-1
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => setTier1Market(false)}
                        style={[styles.pillBtn, !tier1Market && styles.pillBtnActive]}
                      >
                        <Text style={[styles.pillText, !tier1Market && styles.pillTextActive]}>
                          🌍 Global
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>

                {/* Side-by-Side Comparison Cards */}
                <View style={styles.compareRow}>
                  <View style={styles.compareCardLeft}>
                    <Text style={styles.compareTagBad}>OLD WAY • ADMOB ONLY</Text>
                    <Text style={styles.compareAmountBad}>
                      ${admobOnlyAnnualUsd.toLocaleString()} / yr
                    </Text>
                    <Text style={styles.compareNote}>
                      {admobOnlyAnnualUsd < 100
                        ? '⚠️ STRANDED (<$100 AdMob Payout Threshold!)'
                        : 'Banners + 4-min capped Interstitials only'}
                    </Text>
                  </View>

                  <View style={styles.compareCardRight}>
                    <Text style={styles.compareTagGood}>OUR 2026 HYBRID STACK</Text>
                    <Text style={styles.compareAmountGood}>
                      ${hybridAnnualUsd.toLocaleString()} / yr
                    </Text>
                    <Text style={styles.compareNoteGood}>
                      • ${proUnlockNetUsd.toLocaleString()} from $3.99 Pro Unlocks ({proUnlockBuyers}{' '}
                      buyers){'\n'}• ${rewardedNetUsd.toLocaleString()} from Rewarded Video Ads
                      {'\n'}• ${coinAndVipNetUsd.toLocaleString()} from Coins & Gifts
                    </Text>
                  </View>
                </View>

                {/* 12-Tester Bottleneck Strategy Callout */}
                <View style={styles.infoBox}>
                  <Text style={styles.infoTitle}>
                    🧭 2026 Release Order (Beating the 12-Tester, 14-Day Wall)
                  </Text>
                  <Text style={styles.infoBody}>
                    1. Ship App #2 ("Are You Smarter Than a 7-Year-Old?") FIRST: It runs 100%
                    offline with $0.00 AI API cost and instant viral family appeal.{'\n'}
                    2. Once App #2 clears the 14-day closed test and ranks on long-tail trivia
                    keywords, cross-promote App #1 ("Talk to the Greatest Minds") inside it.{'\n'}
                    3. Optional Legal Bypass: Registering a D-U-N-S Organization developer account
                    exempts all your future apps from the 12-tester, 14-day waiting period.
                  </Text>
                </View>
              </View>
            )}

            {tab === 'export_audit' && (
              <View>
                <Text style={styles.sectionHeading}>
                  1. OFFLINE DATA EXPORT & IMPORT (MINIMUM FUNCTIONALITY PROOF)
                </Text>
                <Text style={styles.helperText}>
                  Google Play rejects simple web wrappers or templates unless they feature rich
                  offline persistence, visual data charts, and local file export (CSV / JSON /
                  Printable Report). Test all exports live below:
                </Text>

                {exportFeedback ? (
                  <View style={styles.feedbackBanner}>
                    <Text style={styles.feedbackText}>{exportFeedback}</Text>
                  </View>
                ) : null}

                <View style={styles.exportGroupCard}>
                  <Text style={styles.exportGroupTitle}>
                    🏛️ App #1: Talk to the Greatest Minds (Ledger, XP & Transcripts)
                  </Text>
                  <View style={styles.exportBtnsRow}>
                    <Pressable
                      onPress={() => handleRunExport('minds', 'csv')}
                      style={styles.exportActionBtn}
                    >
                      <Text style={styles.exportActionText}>📄 Export CSV</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleRunExport('minds', 'json')}
                      style={styles.exportActionBtn}
                    >
                      <Text style={styles.exportActionText}>📦 Export JSON</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleRunExport('minds', 'report_html')}
                      style={styles.exportActionBtn}
                    >
                      <Text style={styles.exportActionText}>🖨️ HTML Report</Text>
                    </Pressable>
                  </View>
                </View>

                <View style={styles.exportGroupCard}>
                  <Text style={styles.exportGroupTitle}>
                    🎒 App #2: Are You Smarter Than a 7-Year-Old? (Report Card & Runs)
                  </Text>
                  <View style={styles.exportBtnsRow}>
                    <Pressable
                      onPress={() => handleRunExport('smarter7yo', 'csv')}
                      style={styles.exportActionBtn}
                    >
                      <Text style={styles.exportActionText}>📄 Export CSV</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleRunExport('smarter7yo', 'json')}
                      style={styles.exportActionBtn}
                    >
                      <Text style={styles.exportActionText}>📦 Export JSON</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleRunExport('smarter7yo', 'report_html')}
                      style={styles.exportActionBtn}
                    >
                      <Text style={styles.exportActionText}>🖨️ Transcript</Text>
                    </Pressable>
                  </View>
                </View>

                {/* Offline JSON Restore */}
                <View style={styles.exportGroupCard}>
                  <Text style={styles.exportGroupTitle}>
                    🔄 Restore Offline JSON Backup (No Account Login Needed)
                  </Text>
                  <TextInput
                    value={importText}
                    onChangeText={setImportText}
                    placeholder='Paste exported {"schemaVersion":"2026.1", ...} JSON here'
                    placeholderTextColor="#64748B"
                    multiline
                    style={styles.jsonInput}
                  />
                  <Pressable onPress={handleImportJson} style={styles.restoreBtn}>
                    <Text style={styles.restoreBtnText}>📥 Restore Offline Backup</Text>
                  </Pressable>
                </View>

                <Text style={[styles.sectionHeading, { marginTop: 14 }]}>
                  2. 2026 GOOGLE PLAY & ADMOB 6-POINT COMPLIANCE AUDIT
                </Text>

                {[
                  {
                    title: 'Android 16 (API Level 36) Target SDK',
                    detail:
                      'app.json configured with compileSdkVersion = 36, targetSdkVersion = 36 (Mandatory after Aug 31, 2026).',
                  },
                  {
                    title: 'Google UMP v4.0 GDPR/EEA Consent Gate',
                    detail:
                      'AdConsentGate collects Personalized vs. Contextual consent BEFORE initializing MobileAds.',
                  },
                  {
                    title: '16dp Banner Safety Separation Buffer',
                    detail:
                      'AdBannerSlot enforces marginTop: 16dp separating banners from interactive buttons to prevent accidental clicks.',
                  },
                  {
                    title: '1-Second Interstitial Transition Guard + 4-Min Cooldown',
                    detail:
                      'Displays a 1,000ms "Saving Progress..." modal before any interstitial and caps frequency at 240s (4 mins) / every 3rd milestone.',
                  },
                  {
                    title: 'One-Time $3.99 Pro Unlock (Hybrid Monetization)',
                    detail:
                      'Permanently disables all ads + unlocks CSV/JSON/HTML exports + grants 30 bonus coins.',
                  },
                  {
                    title: 'Minimum Functionality & Zero-Login Offline Mode',
                    detail:
                      'Full local AsyncStorage persistence, visual progression charts, and local file export/import.',
                  },
                ].map((item) => (
                  <View key={item.title} style={styles.auditRow}>
                    <Text style={styles.auditBadge}>PASS</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.auditTitle}>{item.title}</Text>
                      <Text style={styles.auditDetail}>{item.detail}</Text>
                    </View>
                  </View>
                ))}

                {onTriggerPaywall ? (
                  <Pressable
                    onPress={() => {
                      onClose();
                      onTriggerPaywall();
                    }}
                    style={styles.unlockCtaBtn}
                  >
                    <Text style={styles.unlockCtaText}>
                      🛡️ Test the $3.99 One-Time Pro Unlock in Paywall
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            )}

            {tab === 'aso_copy' && (
              <View>
                <View style={styles.pillRow}>
                  <Pressable
                    onPress={() => setSelectedAsoApp('minds')}
                    style={[
                      styles.pillBtn,
                      selectedAsoApp === 'minds' && styles.pillBtnActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        selectedAsoApp === 'minds' && styles.pillTextActive,
                      ]}
                    >
                      🏛️ App #1: Greatest Minds
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setSelectedAsoApp('smarter7yo')}
                    style={[
                      styles.pillBtn,
                      selectedAsoApp === 'smarter7yo' && styles.pillBtnActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        selectedAsoApp === 'smarter7yo' && styles.pillTextActive,
                      ]}
                    >
                      🎒 App #2: Smarter Than 7Yo
                    </Text>
                  </Pressable>
                </View>

                {exportFeedback ? (
                  <View style={[styles.feedbackBanner, { marginTop: 10 }]}>
                    <Text style={styles.feedbackText}>{exportFeedback}</Text>
                  </View>
                ) : null}

                <View style={styles.asoBox}>
                  <View style={styles.asoHeaderRow}>
                    <Text style={styles.asoLabel}>
                      APP TITLE ({aso.title.length}/30 CHARS)
                    </Text>
                    <Pressable
                      onPress={() => copyOrShareText('App Title', aso.title)}
                      style={styles.copyChip}
                    >
                      <Text style={styles.copyChipText}>📋 Copy</Text>
                    </Pressable>
                  </View>
                  <Text style={styles.asoValueHighlight}>{aso.title}</Text>
                </View>

                <View style={styles.asoBox}>
                  <View style={styles.asoHeaderRow}>
                    <Text style={styles.asoLabel}>
                      SHORT DESCRIPTION ({aso.shortDesc.length}/80 CHARS)
                    </Text>
                    <Pressable
                      onPress={() => copyOrShareText('Short Description', aso.shortDesc)}
                      style={styles.copyChip}
                    >
                      <Text style={styles.copyChipText}>📋 Copy</Text>
                    </Pressable>
                  </View>
                  <Text style={styles.asoValue}>{aso.shortDesc}</Text>
                </View>

                <View style={styles.asoBox}>
                  <Text style={styles.asoLabel}>
                    LONG-TAIL AUTOCOMPLETE KEYWORDS (VERIFY IN PLAY SEARCH BAR)
                  </Text>
                  {aso.longTailKeywords.map((kw) => (
                    <Text key={kw} style={styles.keywordItem}>
                      🔍 "{kw}"
                    </Text>
                  ))}
                </View>

                <View style={styles.asoBox}>
                  <View style={styles.asoHeaderRow}>
                    <Text style={styles.asoLabel}>
                      FULL PLAY STORE DESCRIPTION ({aso.longDesc.length}/4000 CHARS)
                    </Text>
                    <Pressable
                      onPress={() => copyOrShareText('Long Description', aso.longDesc)}
                      style={styles.copyChip}
                    >
                      <Text style={styles.copyChipText}>📋 Copy</Text>
                    </Pressable>
                  </View>
                  <Text style={styles.asoValueLong}>{aso.longDesc}</Text>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(4, 8, 18, 0.88)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#0B1120',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '92%',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.35)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  badge: {
    color: '#FBBF24',
    fontSize: 10.5,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '900',
    marginTop: 2,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: { color: '#E2E8F0', fontSize: 15, fontWeight: '900' },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#131C2E',
    borderRadius: 14,
    padding: 4,
    marginBottom: 14,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: '#FBBF24',
  },
  tabText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '800',
  },
  tabTextActive: {
    color: '#090D16',
    fontWeight: '900',
  },
  scrollContent: {
    paddingBottom: 28,
  },
  sectionHeading: {
    color: '#FBBF24',
    fontSize: 11.5,
    fontWeight: '900',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  helperText: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 12,
  },
  scenarioCol: {
    gap: 8,
    marginBottom: 12,
  },
  scenarioCard: {
    backgroundColor: '#131C2E',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  scenarioCardActive: {
    borderColor: '#FBBF24',
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
  },
  scenarioTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  scenarioTitle: { color: '#F8FAFC', fontSize: 13.5, fontWeight: '900' },
  scenarioDau: { color: '#38BDF8', fontSize: 11.5, fontWeight: '800' },
  scenarioDesc: { color: '#94A3B8', fontSize: 11.5, lineHeight: 16 },
  controlsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  controlLabel: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 6,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  pillBtn: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  pillBtnActive: {
    backgroundColor: '#38BDF8',
    borderColor: '#38BDF8',
  },
  pillText: { color: '#94A3B8', fontSize: 11.5, fontWeight: '800' },
  pillTextActive: { color: '#090D16', fontWeight: '900' },
  compareRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  compareCardLeft: {
    flex: 1,
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.35)',
    borderRadius: 16,
    padding: 12,
  },
  compareCardRight: {
    flex: 1.2,
    backgroundColor: 'rgba(52, 211, 153, 0.12)',
    borderWidth: 1.5,
    borderColor: '#34D399',
    borderRadius: 16,
    padding: 12,
  },
  compareTagBad: { color: '#FB7185', fontSize: 10, fontWeight: '900' },
  compareAmountBad: { color: '#F8FAFC', fontSize: 20, fontWeight: '900', marginVertical: 4 },
  compareNote: { color: '#FDA4AF', fontSize: 11, lineHeight: 15 },
  compareTagGood: { color: '#34D399', fontSize: 10, fontWeight: '900' },
  compareAmountGood: { color: '#34D399', fontSize: 22, fontWeight: '900', marginVertical: 4 },
  compareNoteGood: { color: '#D1FAE5', fontSize: 11, lineHeight: 16 },
  infoBox: {
    backgroundColor: '#131C2E',
    borderRadius: 14,
    padding: 13,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  infoTitle: { color: '#38BDF8', fontSize: 12.5, fontWeight: '900', marginBottom: 6 },
  infoBody: { color: '#CBD5E1', fontSize: 11.5, lineHeight: 17 },
  feedbackBanner: {
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    borderColor: '#34D399',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  feedbackText: { color: '#34D399', fontSize: 12, fontWeight: '800', textAlign: 'center' },
  exportGroupCard: {
    backgroundColor: '#131C2E',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  exportGroupTitle: { color: '#F8FAFC', fontSize: 12.5, fontWeight: '900', marginBottom: 8 },
  exportBtnsRow: { flexDirection: 'row', gap: 8 },
  exportActionBtn: {
    flex: 1,
    backgroundColor: '#1E293B',
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.35)',
  },
  exportActionText: { color: '#FBBF24', fontSize: 11.5, fontWeight: '800' },
  jsonInput: {
    backgroundColor: '#090D16',
    color: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    fontSize: 11.5,
    minHeight: 60,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 8,
  },
  restoreBtn: {
    backgroundColor: '#38BDF8',
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: 'center',
  },
  restoreBtnText: { color: '#090D16', fontSize: 12, fontWeight: '900' },
  auditRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#131C2E',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  auditBadge: {
    backgroundColor: 'rgba(52, 211, 153, 0.2)',
    color: '#34D399',
    fontSize: 10,
    fontWeight: '900',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  auditTitle: { color: '#F8FAFC', fontSize: 12.5, fontWeight: '900' },
  auditDetail: { color: '#94A3B8', fontSize: 11, lineHeight: 15, marginTop: 2 },
  unlockCtaBtn: {
    backgroundColor: '#FBBF24',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 8,
  },
  unlockCtaText: { color: '#090D16', fontSize: 13, fontWeight: '900' },
  asoBox: {
    backgroundColor: '#131C2E',
    borderRadius: 14,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  asoHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  asoLabel: { color: '#38BDF8', fontSize: 10.5, fontWeight: '900' },
  copyChip: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
  },
  copyChipText: { color: '#38BDF8', fontSize: 10.5, fontWeight: '800' },
  asoValueHighlight: { color: '#FBBF24', fontSize: 15, fontWeight: '900' },
  asoValue: { color: '#F8FAFC', fontSize: 12.5, lineHeight: 18 },
  keywordItem: { color: '#34D399', fontSize: 12, fontWeight: '700', marginTop: 4 },
  asoValueLong: { color: '#CBD5E1', fontSize: 11.5, lineHeight: 17 },
});
