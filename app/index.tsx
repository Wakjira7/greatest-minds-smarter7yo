import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApiCostDashboardModal } from '../src/components/ApiCostDashboardModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AdBannerSlot, AdConsentGate } from '../src/components/AdComponents';
import { AskOrb } from '../src/components/AskOrb';
import { GHIBLI_3D_PORTRAITS } from '../src/components/Avatar3D';
import { StoriesRing, StoryItem } from '../src/components/StoriesRing';
import { DisclaimerBanner } from '../src/components/DisclaimerBanner';
import { MindOdysseyPath } from '../src/components/MindOdysseyPath';
import { PaywallModal } from '../src/components/PaywallModal';
import { Persona3DCarousel } from '../src/components/Persona3DCarousel';
import { PersonaCard } from '../src/components/PersonaCard';
import { PlayStoreStrategyModal } from '../src/components/PlayStoreStrategyModal';
import { QuestsAndStreakView } from '../src/components/QuestsAndStreakView';
import { SmarterThan7YoApp } from '../src/components/SmarterThan7YoApp';
import { OmniScanOcrApp } from '../src/components/OmniScanOcrApp';
import { WisdomThreadsView } from '../src/components/WisdomThreadsView';
import {
  DEFAULT_M3_PRESET,
  MATERIAL_3_PRESETS,
  Material3PresetId,
} from '../src/constants/materialTheme';
import {
  BUILD_APP_VARIANT,
  IS_STORE_PRODUCTION_BUILD,
} from '../src/constants/releaseConfig';
import { MIND_REALMS, PERSONAS } from '../src/constants/personas';
import { exportGreatestMindsData } from '../src/services/dataExport';
import { getApiConnectionStatus } from '../src/services/chatService';
import { showRewardedAd } from '../src/services/adsManager';
import {
  activateSubscriptionPlan,
  addPersonaCoins,
  claimQuestReward,
  claimReferralReward,
  claimSevenDayStreakReward,
  getDailyAllowanceLimit,
  getDefaultMonetizationState,
  getRemainingDailyQuota,
  getTotalAvailableReplies,
  getUserWisdomLevel,
  grantRewardedVideoAdReward,
  isPersonaUnlocked,
  isProSubscriber,
  loadMonetizationState,
  purchaseVipBundle,
  resetMonetizationToFree,
  toggleLikeWisdomThread,
  updateApiSettings,
} from '../src/services/monetization';
import { loadAllPersonaSummaries, PersonaChatSummary } from '../src/services/storage';
import {
  MindRealm,
  MonetizationState,
  Persona,
  PersonaBundleGroup,
  SubscriptionPlan,
} from '../src/types/chat';

type FilterType = 'All' | 'FreeStarters' | 'Historical' | 'Parody' | MindRealm;
type DisplayMode = '3d_slider' | 'odyssey_path' | 'grid';
type MainNavTab = 'advisors' | 'threads' | 'quests';

// Astroway RandomStringPicker equivalent — each prompt routes to the best-fit mind.
const ASK_PROMPTS: Array<{ prompt: string; personaId: string }> = [
  { prompt: 'How do I stop overthinking everything?', personaId: 'marcus-aurelius' },
  { prompt: 'My boss keeps piling on work. What do I do?', personaId: 'chef-ramsey' },
  { prompt: 'I keep procrastinating. Give me a plan.', personaId: 'marcus-aurelius' },
  { prompt: 'How can I think more creatively?', personaId: 'albert-einstein' },
  { prompt: 'How do I win an argument without a fight?', personaId: 'sun-tzu' },
  { prompt: 'Help me set boundaries with a friend.', personaId: 'chef-ramsey' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [activePortfolioApp, setActivePortfolioApp] = useState<
    'smarter_7yo' | 'greatest_minds' | 'offline_ocr'
  >(
    BUILD_APP_VARIANT === 'minds'
      ? 'greatest_minds'
      : BUILD_APP_VARIANT === 'ocr'
        ? 'offline_ocr'
        : 'smarter_7yo'
  );
  const [storeReviewMode, setStoreReviewMode] = useState<boolean>(
    IS_STORE_PRODUCTION_BUILD
  );
  const [m3PresetId, setM3PresetId] =
    useState<Material3PresetId>(DEFAULT_M3_PRESET);
  const m3 = MATERIAL_3_PRESETS[m3PresetId];

  const [activeNavTab, setActiveNavTab] = useState<MainNavTab>('advisors');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('All');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('3d_slider');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleGridCount, setVisibleGridCount] = useState(24);
  const [summaries, setSummaries] = useState<Record<string, PersonaChatSummary>>({});
  const [monetization, setMonetization] = useState<MonetizationState>(
    getDefaultMonetizationState()
  );
  const [paywallVisible, setPaywallVisible] = useState(false);
  const [apiDashboardVisible, setApiDashboardVisible] = useState(false);
  const [playStrategyVisible, setPlayStrategyVisible] = useState(false);
  const [lockedTargetPersona, setLockedTargetPersona] = useState<Persona | null>(
    null
  );
  const [paywallReason, setPaywallReason] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      loadAllPersonaSummaries(PERSONAS.map((p) => p.id)).then((data) => {
        if (mounted) setSummaries(data);
      });
      loadMonetizationState().then((state) => {
        if (mounted) setMonetization(state);
      });
      return () => {
        mounted = false;
      };
    }, [])
  );

  // Daily Wisdom Stories (Astroway story_view): minds with 3D portraits share quotes.
  const [seenStoryIds, setSeenStoryIds] = useState<string[]>([]);
  const storyKey = `@minds_seen_stories_${new Date().toISOString().slice(0, 10)}`;
  useEffect(() => {
    AsyncStorage.getItem(storyKey)
      .then((raw) => setSeenStoryIds(raw ? JSON.parse(raw) : []))
      .catch(() => {});
  }, [storyKey]);
  const markStorySeen = (id: string) => {
    setSeenStoryIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      AsyncStorage.setItem(storyKey, JSON.stringify(next)).catch(() => {});
      return next;
    });
  };
  const wisdomStories: StoryItem[] = useMemo(
    () =>
      PERSONAS.filter((p) => GHIBLI_3D_PORTRAITS[p.id])
        .slice(0, 10)
        .map((p) => ({
          id: p.id,
          name: p.name.split(' ')[0],
          accentColor: p.accentColor,
          image: GHIBLI_3D_PORTRAITS[p.id],
          emoji: p.avatarEmoji,
          slides: [
            { text: p.catchphrases[0], caption: `${p.name} • ${p.title}` },
            { text: p.shortBio, caption: 'Who am I?' },
            { text: p.catchphrases[1], caption: 'Wisdom of the day' },
          ],
        })),
    []
  );

  const filteredPersonas = useMemo(() => {
    return PERSONAS.filter((persona) => {
      const matchesFilter =
        selectedFilter === 'All'
          ? true
          : selectedFilter === 'FreeStarters'
          ? persona.isFreeStarter
          : selectedFilter === 'Historical' || selectedFilter === 'Parody'
          ? persona.category === selectedFilter
          : persona.realm === selectedFilter;

      if (!matchesFilter) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return (
        persona.name.toLowerCase().includes(q) ||
        persona.title.toLowerCase().includes(q) ||
        persona.specialtyBadge.toLowerCase().includes(q) ||
        (persona.realm && persona.realm.toLowerCase().includes(q)) ||
        persona.shortBio.toLowerCase().includes(q) ||
        persona.catchphrases.some((cp) => cp.toLowerCase().includes(q))
      );
    });
  }, [selectedFilter, searchQuery]);

  const handleSelectPersona = (persona: Persona) => {
    const unlocked = isPersonaUnlocked(monetization, persona);
    if (!unlocked) {
      setLockedTargetPersona(persona);
      setPaywallReason(
        `${persona.name} is a VIP Mind! Watch 1 short video ad to unlock ${persona.name} + 5 free replies today, or upgrade to Pro ($6.99/mo) for all 200 Greatest Minds.`
      );
      setPaywallVisible(true);
      return;
    }
    router.push(`/chat/${persona.id}`);
  };

  const handleClaimStreak = async (forceNextDayDemo = false) => {
    const res = await claimSevenDayStreakReward(monetization, forceNextDayDemo);
    setMonetization(res.updatedState);
  };

  const handleClaimQuest = async (
    questId: string,
    questTitle: string,
    rewardCoins: number,
    rewardXp: number
  ) => {
    const next = await claimQuestReward(
      monetization,
      questId,
      questTitle,
      rewardCoins,
      rewardXp
    );
    setMonetization(next);
  };

  const handleClaimReferral = async () => {
    const next = await claimReferralReward(monetization);
    setMonetization(next);
  };

  const handleToggleLikeThread = async (threadId: string) => {
    const next = await toggleLikeWisdomThread(monetization, threadId);
    setMonetization(next);
  };

  const handleSelectSubscription = async (plan: SubscriptionPlan) => {
    const next = await activateSubscriptionPlan(monetization, plan);
    setMonetization(next);
    setPaywallVisible(false);
    if (lockedTargetPersona) {
      const targetId = lockedTargetPersona.id;
      setLockedTargetPersona(null);
      router.push(`/chat/${targetId}`);
    }
  };

  const handlePurchaseCoins = async (coins: number) => {
    const next = await addPersonaCoins(
      monetization,
      coins,
      `Coin Pack Purchase (${coins} Coins)`
    );
    setMonetization(next);
    setPaywallVisible(false);
    if (lockedTargetPersona) {
      const targetId = lockedTargetPersona.id;
      setLockedTargetPersona(null);
      router.push(`/chat/${targetId}`);
    }
  };

  const handleWatchRewardedAd = async (unlockPersonaId?: string) => {
    const ad = await showRewardedAd();
    if (!ad.rewarded) {
      setPaywallReason(
        ad.reason === 'daily_limit'
          ? "You've used today's 10 free video unlocks. Come back tomorrow, grab a Coin Pack, or go Pro!"
          : 'Please answer the privacy prompt first to unlock video rewards.'
      );
      return;
    }
    const next = await grantRewardedVideoAdReward(monetization, unlockPersonaId);
    setMonetization(next);
    setPaywallVisible(false);
    if (lockedTargetPersona) {
      const targetId = lockedTargetPersona.id;
      setLockedTargetPersona(null);
      router.push(`/chat/${targetId}`);
    }
  };

  const handlePurchaseBundle = async (bundle: PersonaBundleGroup) => {
    const next = await purchaseVipBundle(monetization, bundle);
    setMonetization(next);
    setPaywallVisible(false);
    if (lockedTargetPersona && lockedTargetPersona.bundleGroup === bundle) {
      const targetId = lockedTargetPersona.id;
      setLockedTargetPersona(null);
      router.push(`/chat/${targetId}`);
    }
  };

  const handleResetToFree = async () => {
    const next = await resetMonetizationToFree();
    setMonetization(next);
    setPaywallVisible(false);
  };

  const isPro = isProSubscriber(monetization);
  const dailyLimit = getDailyAllowanceLimit(monetization);
  const dailyLeft = getRemainingDailyQuota(monetization);
  const totalReplies = getTotalAvailableReplies(monetization);
  const wisdomLevel = getUserWisdomLevel(monetization.xpPoints);
  const today = new Date().toISOString().slice(0, 10);
  const streakClaimedToday = monetization.lastStreakClaimDate === today;

  const freeStartersCount = useMemo(
    () => PERSONAS.filter((p) => p.isFreeStarter).length,
    []
  );

  if (activePortfolioApp === 'offline_ocr') {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: '#0A0E17' }]}>
        <OmniScanOcrApp
          showPortfolioSwitcher={BUILD_APP_VARIANT !== 'ocr' && !storeReviewMode}
          onSwitchToPortfolio={() => setActivePortfolioApp('greatest_minds')}
        />
      </SafeAreaView>
    );
  }

  if (activePortfolioApp === 'smarter_7yo') {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: '#070B19' }]}>
        <SmarterThan7YoApp
          onSwitchToGreatestMinds={
            BUILD_APP_VARIANT === 'smarter7yo' || storeReviewMode
              ? undefined
              : () => setActivePortfolioApp('greatest_minds')
          }
          storeReviewMode={storeReviewMode}
          onToggleStoreReviewMode={
            IS_STORE_PRODUCTION_BUILD
              ? undefined
              : () => setStoreReviewMode((prev) => !prev)
          }
          onOpenPrivacyPolicy={() => router.push('/privacy')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: m3.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.maxWidthContainer}>
          {/* GOOGLE MATERIAL DESIGN 3 ("Material You") Dynamic Color Switcher Bar */}
          <View
            style={[
              styles.m3ThemeBar,
              {
                backgroundColor: m3.surfaceContainerLow,
                borderColor: m3.outlineVariant,
              },
            ]}
          >
            {BUILD_APP_VARIANT !== 'minds' && !storeReviewMode && (
              <Pressable
                onPress={() => setActivePortfolioApp('smarter_7yo')}
                style={{
                  backgroundColor: '#F59E0B',
                  paddingHorizontal: 11,
                  paddingVertical: 6,
                  borderRadius: 999,
                  marginRight: 6,
                }}
              >
                <Text
                  style={{
                    color: '#090D16',
                    fontSize: 11,
                    fontWeight: '900',
                  }}
                >
                  🎒 Play App #2: Smarter Than a 7-Year-Old?
                </Text>
              </Pressable>
            )}

            {!IS_STORE_PRODUCTION_BUILD && (
              <Pressable
                onPress={() => setStoreReviewMode((prev) => !prev)}
                style={{
                  backgroundColor: storeReviewMode
                    ? 'rgba(16, 185, 129, 0.2)'
                    : 'rgba(148, 163, 184, 0.16)',
                  borderWidth: 1,
                  borderColor: storeReviewMode ? '#10B981' : '#64748B',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 999,
                  marginRight: 6,
                }}
              >
                <Text
                  style={{
                    color: storeReviewMode ? '#34D399' : '#CBD5E1',
                    fontSize: 10.5,
                    fontWeight: '800',
                  }}
                >
                  {storeReviewMode
                    ? '🛡️ Store Review Mode: ON (Clean UI)'
                    : '🛠️ Dev Studio Mode (Tap for Store UI)'}
                </Text>
              </Pressable>
            )}

            <Text style={[styles.m3ThemeLabel, { color: m3.onSurfaceVariant }]}>
              🎨 MATERIAL YOU (M3):
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.m3ThemeChipsRow}
            >
              {(Object.keys(MATERIAL_3_PRESETS) as Material3PresetId[]).map(
                (presetKey) => {
                  const preset = MATERIAL_3_PRESETS[presetKey];
                  const active = m3PresetId === presetKey;
                  return (
                    <Pressable
                      key={presetKey}
                      onPress={() => setM3PresetId(presetKey)}
                      style={[
                        styles.m3PresetChip,
                        {
                          backgroundColor: active
                            ? preset.primaryContainer
                            : m3.surfaceContainer,
                          borderColor: active ? preset.primary : m3.outlineVariant,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.m3PresetChipText,
                          {
                            color: active
                              ? preset.onPrimaryContainer
                              : m3.onSurfaceVariant,
                          },
                        ]}
                      >
                        {active ? '✓ ' : ''}
                        {preset.badgeEmoji} {preset.name}
                      </Text>
                    </Pressable>
                  );
                }
              )}
            </ScrollView>
          </View>

          {/* Material 3 Elevated Surface Card — Duolingo-like Streak, XP, & Coin Bar */}
          <View
            style={[
              styles.walletBar,
              {
                backgroundColor: m3.surfaceContainer,
                borderColor: m3.outlineVariant,
                borderRadius: m3.shapeLarge,
              },
            ]}
          >
            <View style={styles.walletLeft}>
              <View
                style={[
                  styles.planBadge,
                  {
                    backgroundColor: isPro
                      ? m3.primaryContainer
                      : m3.secondaryContainer,
                    borderColor: m3.primary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.planBadgeText,
                    {
                      color: isPro
                        ? m3.onPrimaryContainer
                        : m3.onSecondaryContainer,
                    },
                  ]}
                >
                  {isPro ? '💎 PRO VIP' : 'FREE TIER'}
                </Text>
              </View>

              <Pressable
                onPress={() => setActiveNavTab('quests')}
                style={[
                  styles.levelChip,
                  {
                    backgroundColor: m3.primaryContainer,
                    borderColor: m3.primary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.levelChipText,
                    { color: m3.onPrimaryContainer },
                  ]}
                >
                  {wisdomLevel.badgeEmoji} Lv.{wisdomLevel.level} ({wisdomLevel.currentXp} XP)
                </Text>
              </Pressable>

              <Text style={[styles.quotaSummaryText, { color: m3.onSurface }]}>
                🔥 Day {monetization.streakDay} • 🪙 {monetization.coinBalance} Coins ({totalReplies} replies)
              </Text>
            </View>

            <View style={styles.walletRightActions}>
              {storeReviewMode ? (
                <>
                  <Pressable
                    onPress={() => exportGreatestMindsData('csv')}
                    style={[
                      styles.watchAdChip,
                      {
                        backgroundColor: 'rgba(56, 189, 248, 0.16)',
                        borderColor: '#38BDF8',
                      },
                    ]}
                  >
                    <Text style={[styles.watchAdChipText, { color: '#7DD3FC' }]}>
                      📄 Export CSV
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => router.push('/privacy')}
                    style={[
                      styles.watchAdChip,
                      {
                        backgroundColor: 'rgba(148, 163, 184, 0.16)',
                        borderColor: '#64748B',
                      },
                    ]}
                  >
                    <Text style={[styles.watchAdChipText, { color: '#CBD5E1' }]}>
                      🔒 Privacy
                    </Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <Pressable
                    onPress={() => setApiDashboardVisible(true)}
                    style={[
                      styles.watchAdChip,
                      {
                        backgroundColor: getApiConnectionStatus(
                          monetization.customGeminiApiKey
                        ).connected
                          ? 'rgba(16, 185, 129, 0.16)'
                          : 'rgba(56, 189, 248, 0.16)',
                        borderColor: getApiConnectionStatus(
                          monetization.customGeminiApiKey
                        ).connected
                          ? '#10B981'
                          : '#38BDF8',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.watchAdChipText,
                        {
                          color: getApiConnectionStatus(
                            monetization.customGeminiApiKey
                          ).connected
                            ? '#34D399'
                            : '#7DD3FC',
                        },
                      ]}
                    >
                      {getApiConnectionStatus(monetization.customGeminiApiKey).connected
                        ? '🟢 Live API'
                        : '🛡️ $0 API'}{' '}
                      (${(monetization.totalEstimatedApiCostUsd || 0).toFixed(3)})
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setPlayStrategyVisible(true)}
                    style={[
                      styles.watchAdChip,
                      {
                        backgroundColor: 'rgba(251, 191, 36, 0.16)',
                        borderColor: '#FBBF24',
                      },
                    ]}
                  >
                    <Text style={[styles.watchAdChipText, { color: '#FBBF24' }]}>
                      🚀 Play 2026 & Export
                    </Text>
                  </Pressable>
                </>
              )}

              <Pressable
                onPress={() => {
                  if (streakClaimedToday) {
                    setActiveNavTab('quests');
                  } else {
                    handleClaimStreak(false);
                  }
                }}
                style={[
                  styles.streakChip,
                  streakClaimedToday && styles.streakChipClaimed,
                ]}
              >
                <Text style={styles.streakChipText}>
                  {streakClaimedToday
                    ? `🔥 Day ${monetization.streakDay} Quests`
                    : `🎁 Claim Day ${monetization.streakDay} Coins`}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setLockedTargetPersona(null);
                  setPaywallReason(null);
                  setPaywallVisible(true);
                }}
                style={styles.watchAdChip}
              >
                <Text style={styles.watchAdChipText}>🎬 +5 Free (Ad)</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setLockedTargetPersona(null);
                  setPaywallReason(null);
                  setPaywallVisible(true);
                }}
                style={[
                  styles.upgradeStoreBtn,
                  { backgroundColor: m3.primary },
                ]}
              >
                <Text
                  style={[
                    styles.upgradeStoreBtnText,
                    { color: m3.onPrimary },
                  ]}
                >
                  {isPro ? '🪙 Coin Store' : '💎 Go Pro ($6.99)'}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* TAB 1: TALK TO THE GREATEST MINDS (200 Minds • 3D Motion Stage + Odyssey Path + Vault) */}
          {activeNavTab === 'advisors' && (
            <>
              {/* Astroway-style daily stories from the featured minds */}
              <StoriesRing
                title="📖 Daily Wisdom Stories"
                items={wisdomStories}
                seenIds={seenStoryIds}
                onSeen={markStorySeen}
                onStoryCta={(id) => {
                  const p = PERSONAS.find((x) => x.id === id);
                  if (p) handleSelectPersona(p);
                }}
                ctaLabel="Talk to this mind →"
                textColor={m3.onSurface}
              />

              {/* Astroway rippleAnimation-style AI orb with rotating prompts */}
              <AskOrb
                title="Ask the Greatest Minds"
                subtitle="Tap a question — a free mind answers instantly"
                prompts={ASK_PROMPTS.map((p) => p.prompt)}
                accentColor={m3.primary}
                orbImage={GHIBLI_3D_PORTRAITS['socrates']}
                surfaceColor={m3.surfaceContainer}
                textColor={m3.onSurface}
                mutedColor={m3.onSurfaceVariant}
                onAsk={(prompt) => {
                  const match = ASK_PROMPTS.find((p) => p.prompt === prompt) ?? ASK_PROMPTS[0];
                  const persona = PERSONAS.find((x) => x.id === match.personaId) ?? PERSONAS[0];
                  if (!isPersonaUnlocked(monetization, persona)) {
                    handleSelectPersona(persona);
                    return;
                  }
                  router.push({ pathname: '/chat/[id]', params: { id: persona.id, q: prompt } });
                }}
              />

              <View style={styles.heroHeaderRow}>
                <View style={styles.heroTextCol}>
                  <View style={styles.brandEyebrowRow}>
                    <Text style={[styles.brandEyebrow, { color: m3.primary }]}>
                      ✨ 200 LIVING 3D PERSONALITIES • 10 MASTERY REALMS
                    </Text>
                  </View>
                  <Text style={[styles.heroTitle, { color: m3.onSurface }]}>
                    Talk to the Greatest Minds
                  </Text>
                  <Text
                    style={[
                      styles.heroSubtitle,
                      { color: m3.onSurfaceVariant },
                    ]}
                  >
                    Touch any 3D Studio Ghibli avatar to awaken a{' '}
                    <Text
                      style={[styles.inlineHighlight, { color: m3.primary }]}
                    >
                      live 3D motion & voice animation
                    </Text>
                    , or progress through the 200-Mind Odyssey Path!
                  </Text>
                </View>

                {/* Official Material Design 3 Outlined Segmented Button (3 Modes) */}
                <View
                  style={[
                    styles.m3SegmentedGroup,
                    {
                      borderColor: m3.outline,
                      backgroundColor: m3.surfaceContainerLow,
                    },
                  ]}
                >
                  <Pressable
                    onPress={() => setDisplayMode('3d_slider')}
                    style={[
                      styles.m3SegmentBtn,
                      styles.m3SegmentBorderRight,
                      { borderRightColor: m3.outline },
                      displayMode === '3d_slider' && {
                        backgroundColor: m3.secondaryContainer,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.m3SegmentText,
                        {
                          color:
                            displayMode === '3d_slider'
                              ? m3.onSecondaryContainer
                              : m3.onSurfaceVariant,
                        },
                      ]}
                    >
                      {displayMode === '3d_slider' ? '✓ ' : ''}🎠 3D Stage
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setDisplayMode('odyssey_path')}
                    style={[
                      styles.m3SegmentBtn,
                      styles.m3SegmentBorderRight,
                      { borderRightColor: m3.outline },
                      displayMode === 'odyssey_path' && {
                        backgroundColor: m3.secondaryContainer,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.m3SegmentText,
                        {
                          color:
                            displayMode === 'odyssey_path'
                              ? m3.onSecondaryContainer
                              : m3.onSurfaceVariant,
                        },
                      ]}
                    >
                      {displayMode === 'odyssey_path' ? '✓ ' : ''}🌌 Odyssey Path
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setDisplayMode('grid')}
                    style={[
                      styles.m3SegmentBtn,
                      displayMode === 'grid' && {
                        backgroundColor: m3.secondaryContainer,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.m3SegmentText,
                        {
                          color:
                            displayMode === 'grid'
                              ? m3.onSecondaryContainer
                              : m3.onSurfaceVariant,
                        },
                      ]}
                    >
                      {displayMode === 'grid' ? '✓ ' : ''}📱 200 Vault
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Store Compliance AI Parody Disclaimer Banner */}
              <DisclaimerBanner />

              {/* Official Material Design 3 Filter Chips (All 200 + 10 Mastery Realms) */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterRow}
              >
                {(
                  [
                    { key: 'All', label: `All Greatest Minds (${PERSONAS.length})` },
                    {
                      key: 'FreeStarters',
                      label: `🟢 Free Starters (${freeStartersCount})`,
                    },
                    ...MIND_REALMS.map((r) => ({
                      key: r.id,
                      label: `${r.emoji} ${r.id} (20)`,
                    })),
                  ] as Array<{ key: FilterType; label: string }>
                ).map((tab) => {
                  const active = selectedFilter === tab.key;
                  return (
                    <Pressable
                      key={tab.key}
                      onPress={() => {
                        setSelectedFilter(tab.key);
                        setVisibleGridCount(24);
                      }}
                      style={[
                        styles.m3FilterChip,
                        {
                          borderRadius: m3.shapeFilterChip,
                          backgroundColor: active
                            ? m3.secondaryContainer
                            : m3.surfaceContainerLow,
                          borderColor: active ? m3.primary : m3.outlineVariant,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.m3FilterChipText,
                          {
                            color: active
                              ? m3.onSecondaryContainer
                              : m3.onSurfaceVariant,
                          },
                        ]}
                      >
                        {active ? '✓ ' : ''}
                        {tab.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              {/* MODE 1: INTERACTIVE 3D MOTION STAGE SLIDER */}
              {displayMode === '3d_slider' && (
                <Persona3DCarousel
                  personas={filteredPersonas}
                  summaries={summaries}
                  isPersonaUnlockedFn={(p) => isPersonaUnlocked(monetization, p)}
                  onSelectPersona={handleSelectPersona}
                />
              )}

              {/* MODE 2: DUOLINGO-INSPIRED (REIMAGINED 3D CITADEL) ODYSSEY PATH */}
              {displayMode === 'odyssey_path' && (
                <MindOdysseyPath
                  personas={PERSONAS}
                  summaries={summaries}
                  isPersonaUnlockedFn={(p) => isPersonaUnlocked(monetization, p)}
                  onSelectPersona={handleSelectPersona}
                />
              )}

              {/* Official Material Design 3 Stadium Search Bar */}
              <View
                style={[
                  styles.m3SearchBar,
                  {
                    backgroundColor: m3.surfaceContainerHigh,
                    borderColor: m3.outlineVariant,
                  },
                ]}
              >
                <Text style={styles.searchIcon}>🔎</Text>
                <TextInput
                  value={searchQuery}
                  onChangeText={(txt) => {
                    setSearchQuery(txt);
                    setVisibleGridCount(24);
                  }}
                  placeholder="Search all 200 Greatest Minds by name, realm, era, or catchphrase..."
                  placeholderTextColor={m3.onSurfaceVariant}
                  style={[styles.searchInput, { color: m3.onSurface }]}
                />
                {searchQuery.length > 0 && (
                  <Pressable
                    onPress={() => setSearchQuery('')}
                    style={styles.clearSearchBtn}
                  >
                    <Text
                      style={[
                        styles.clearSearchText,
                        { color: m3.onSurfaceVariant },
                      ]}
                    >
                      ✕
                    </Text>
                  </Pressable>
                )}
              </View>

              {/* Full 200-Mind Directory Vault */}
              <View style={styles.vaultHeaderRow}>
                <Text
                  style={[
                    styles.directorySectionTitle,
                    { color: m3.onSurfaceVariant },
                  ]}
                >
                  GREATEST MINDS VAULT (SHOWING{' '}
                  {Math.min(visibleGridCount, filteredPersonas.length)} OF{' '}
                  {filteredPersonas.length})
                </Text>
              </View>

              <View style={styles.gridContainer}>
                {filteredPersonas.slice(0, visibleGridCount).map((persona) => (
                  <View key={persona.id} style={styles.gridItem}>
                    <PersonaCard
                      persona={persona}
                      summary={summaries[persona.id]}
                      isUnlocked={isPersonaUnlocked(monetization, persona)}
                      onPress={handleSelectPersona}
                    />
                  </View>
                ))}
              </View>

              {visibleGridCount < filteredPersonas.length && (
                <Pressable
                  onPress={() =>
                    setVisibleGridCount((prev) =>
                      Math.min(filteredPersonas.length, prev + 40)
                    )
                  }
                  style={[
                    styles.loadMoreBtn,
                    {
                      backgroundColor: m3.surfaceContainerHigh,
                      borderColor: m3.primary,
                    },
                  ]}
                >
                  <Text style={[styles.loadMoreBtnText, { color: m3.primary }]}>
                    ⚡ Show More Greatest Minds (+
                    {Math.min(40, filteredPersonas.length - visibleGridCount)} of{' '}
                    {filteredPersonas.length - visibleGridCount} remaining)
                  </Text>
                </Pressable>
              )}
            </>
          )}

          {/* TAB 2: THREADS & ACTIVE CHATS (Astroway History + DTPocketFM Wisdom Wall) */}
          {activeNavTab === 'threads' && (
            <WisdomThreadsView
              state={monetization}
              summaries={summaries}
              isPersonaUnlockedFn={(p) => isPersonaUnlocked(monetization, p)}
              onSelectPersona={handleSelectPersona}
              onToggleLikeThread={handleToggleLikeThread}
            />
          )}

          {/* TAB 3: QUESTS, 7-DAY STREAK & COIN LEDGER (Cashloop v3.0 + SnapReels v1.1.9) */}
          {activeNavTab === 'quests' && (
            <QuestsAndStreakView
              state={monetization}
              summaries={summaries}
              onClaimStreak={handleClaimStreak}
              onClaimQuest={handleClaimQuest}
              onClaimReferral={handleClaimReferral}
              onWatchRewardedAd={() => handleWatchRewardedAd()}
              onOpenStore={() => {
                setLockedTargetPersona(null);
                setPaywallReason(null);
                setPaywallVisible(true);
              }}
            />
          )}

          {/* Shared AdMob adaptive banner (Free Tier only — hidden for Pro) */}
          <View style={{ borderRadius: 14, overflow: 'hidden', marginTop: 12 }}>
            <AdBannerSlot
              hidden={isPro}
              onRemoveAds={() => setPaywallVisible(true)}
              surfaceColor={m3.surfaceContainer}
            />
          </View>
        </View>
      </ScrollView>

      {/* OFFICIAL GOOGLE MATERIAL DESIGN 3 NAVIGATION BAR (With 64x32dp Active Pill Indicator) */}
      <View
        style={[
          styles.m3NavBarSurface,
          {
            backgroundColor: m3.surfaceContainer,
            borderTopColor: m3.outlineVariant,
          },
        ]}
      >
        <View style={styles.m3NavBarInner}>
          <Pressable
            onPress={() => {
              setActiveNavTab('advisors');
              setDisplayMode('3d_slider');
            }}
            style={styles.m3NavItem}
          >
            <View
              style={[
                styles.m3NavIndicatorPill,
                activeNavTab === 'advisors' &&
                  displayMode !== 'odyssey_path' && {
                    backgroundColor: m3.primaryContainer,
                  },
              ]}
            >
              <Text style={styles.m3NavIcon}>🎠</Text>
            </View>
            <Text
              style={[
                styles.m3NavLabel,
                {
                  color:
                    activeNavTab === 'advisors' && displayMode !== 'odyssey_path'
                      ? m3.onSurface
                      : m3.onSurfaceVariant,
                  fontWeight:
                    activeNavTab === 'advisors' && displayMode !== 'odyssey_path'
                      ? '800'
                      : '600',
                },
              ]}
            >
              200 Minds
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setActiveNavTab('advisors');
              setDisplayMode('odyssey_path');
            }}
            style={styles.m3NavItem}
          >
            <View
              style={[
                styles.m3NavIndicatorPill,
                activeNavTab === 'advisors' &&
                  displayMode === 'odyssey_path' && {
                    backgroundColor: m3.primaryContainer,
                  },
              ]}
            >
              <Text style={styles.m3NavIcon}>🌌</Text>
            </View>
            <Text
              style={[
                styles.m3NavLabel,
                {
                  color:
                    activeNavTab === 'advisors' && displayMode === 'odyssey_path'
                      ? m3.onSurface
                      : m3.onSurfaceVariant,
                  fontWeight:
                    activeNavTab === 'advisors' && displayMode === 'odyssey_path'
                      ? '800'
                      : '600',
                },
              ]}
            >
              Odyssey Path
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveNavTab('threads')}
            style={styles.m3NavItem}
          >
            <View
              style={[
                styles.m3NavIndicatorPill,
                activeNavTab === 'threads' && {
                  backgroundColor: m3.primaryContainer,
                },
              ]}
            >
              <Text style={styles.m3NavIcon}>🎙️</Text>
            </View>
            <Text
              style={[
                styles.m3NavLabel,
                {
                  color:
                    activeNavTab === 'threads'
                      ? m3.onSurface
                      : m3.onSurfaceVariant,
                  fontWeight: activeNavTab === 'threads' ? '800' : '600',
                },
              ]}
            >
              Threads
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveNavTab('quests')}
            style={styles.m3NavItem}
          >
            <View
              style={[
                styles.m3NavIndicatorPill,
                activeNavTab === 'quests' && {
                  backgroundColor: m3.primaryContainer,
                },
              ]}
            >
              <Text style={styles.m3NavIcon}>🎯</Text>
            </View>
            <Text
              style={[
                styles.m3NavLabel,
                {
                  color:
                    activeNavTab === 'quests'
                      ? m3.onSurface
                      : m3.onSurfaceVariant,
                  fontWeight: activeNavTab === 'quests' ? '800' : '600',
                },
              ]}
            >
              Quests
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setLockedTargetPersona(null);
              setPaywallReason(null);
              setPaywallVisible(true);
            }}
            style={styles.m3NavItem}
          >
            <View style={styles.m3NavIndicatorPill}>
              <Text style={styles.m3NavIcon}>💎</Text>
            </View>
            <Text style={[styles.m3NavLabel, { color: m3.primary }]}>
              VIP Store
            </Text>
          </Pressable>
        </View>
      </View>

      <PaywallModal
        visible={paywallVisible}
        state={monetization}
        targetPersona={lockedTargetPersona}
        reasonBanner={paywallReason}
        onClose={() => {
          setPaywallVisible(false);
          setLockedTargetPersona(null);
          setPaywallReason(null);
        }}
        onSelectSubscription={handleSelectSubscription}
        onPurchaseCoins={handlePurchaseCoins}
        onWatchRewardedAd={handleWatchRewardedAd}
        onPurchaseBundle={handlePurchaseBundle}
        onResetToFree={handleResetToFree}
      />

      <AdConsentGate appName="Talk to the Greatest Minds" accentColor={m3.primary} />

      <ApiCostDashboardModal
        visible={apiDashboardVisible}
        onClose={() => setApiDashboardVisible(false)}
        monetization={monetization}
        onSaveSettings={async (settings) => {
          const next = await updateApiSettings(monetization, settings);
          setMonetization(next);
        }}
      />

      <PlayStoreStrategyModal
        visible={playStrategyVisible}
        onClose={() => setPlayStrategyVisible(false)}
        activeApp="minds"
        isAdFree={isPro}
        onTriggerPaywall={() => setPaywallVisible(true)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 108,
  },
  maxWidthContainer: {
    width: '100%',
    maxWidth: 960,
    alignSelf: 'center',
  },
  m3ThemeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    gap: 8,
  },
  m3ThemeLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  m3ThemeChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  m3PresetChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  m3PresetChipText: {
    fontSize: 11,
    fontWeight: '800',
  },
  walletBar: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  walletLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  planBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  planBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  levelChip: {
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  levelChipText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  quotaSummaryText: {
    fontSize: 12,
    fontWeight: '700',
  },
  walletRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  streakChip: {
    backgroundColor: 'rgba(168, 85, 247, 0.16)',
    borderColor: 'rgba(168, 85, 247, 0.45)',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  streakChipClaimed: {
    backgroundColor: 'rgba(56, 189, 248, 0.14)',
    borderColor: 'rgba(56, 189, 248, 0.35)',
  },
  streakChipText: {
    color: '#D8B4FE',
    fontSize: 11,
    fontWeight: '800',
  },
  watchAdChip: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.40)',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  watchAdChipText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '800',
  },
  upgradeStoreBtn: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 999,
  },
  upgradeStoreBtnText: {
    fontSize: 11,
    fontWeight: '900',
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  heroTextCol: {
    flex: 1,
    minWidth: 240,
  },
  brandEyebrowRow: {
    marginBottom: 2,
  },
  brandEyebrow: {
    fontSize: 10.5,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontSize: 27,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13.5,
    lineHeight: 19,
  },
  inlineHighlight: {
    fontWeight: '800',
  },
  m3SegmentedGroup: {
    flexDirection: 'row',
    borderRadius: 999,
    borderWidth: 1,
    overflow: 'hidden',
  },
  m3SegmentBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  m3SegmentBorderRight: {
    borderRightWidth: 1,
  },
  m3SegmentText: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 12,
  },
  m3FilterChip: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderWidth: 1,
  },
  m3FilterChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  m3SearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    paddingVertical: 11,
  },
  clearSearchBtn: {
    padding: 6,
  },
  clearSearchText: {
    fontSize: 13,
    fontWeight: '700',
  },
  vaultHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  directorySectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  gridContainer: {
    width: '100%',
  },
  gridItem: {
    width: '100%',
  },
  loadMoreBtn: {
    borderRadius: 16,
    borderWidth: 1.5,
    borderBottomWidth: 5,
    paddingVertical: 13,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 14,
  },
  loadMoreBtnText: {
    fontSize: 13,
    fontWeight: '900',
  },
  admobBannerSlot: {
    marginTop: 10,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  admobBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  admobBadgeText: {
    color: '#FBBF24',
    fontSize: 9.5,
    fontWeight: '800',
  },
  admobText: {
    flex: 1,
    fontSize: 11.5,
  },
  admobRemoveBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  admobRemoveBtnText: {
    fontSize: 11,
    fontWeight: '800',
  },
  m3NavBarSurface: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  m3NavBarInner: {
    maxWidth: 740,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  m3NavItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  m3NavIndicatorPill: {
    width: 58,
    height: 30,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  m3NavIcon: {
    fontSize: 15,
  },
  m3NavLabel: {
    fontSize: 10.5,
  },
});
