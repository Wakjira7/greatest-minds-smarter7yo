import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  ImageSourcePropType,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  KID_CLASSMATES,
  KidClassmate,
  PRIZE_LADDER,
  SUBJECT_CATEGORIES,
  SubjectCategory,
  TRIVIA_QUESTIONS_7YO,
  TriviaQuestion7Yo,
} from '../constants/smarter7yoData';
import {
  AppLanguage,
  getLocalizedClassmates,
  getLocalizedLadder,
  getLocalizedQuestions,
  SUPPORTED_LANGUAGES,
  UI_STRINGS,
} from '../constants/smarter7yoI18n';
import { shuffleQuestions } from '../constants/smarter7yoLibrary2000';
import {
  playCorrectChimeSound,
  playLoserLaughSound,
  speakKidVoice,
} from '../services/soundEffects';
import { KidClassmate3D } from './KidClassmate3D';
import { AdBannerSlot, AdConsentGate } from './AdComponents';
import { OnboardingPager } from './OnboardingPager';
import { PlayStoreStrategyModal } from './PlayStoreStrategyModal';
import { ReportCardPanel } from './ReportCardPanel';
import { StoriesRing, StoryItem } from './StoriesRing';
import {
  getAdsStats,
  getRewardedRemainingToday,
  maybeShowInterstitial,
  preloadInterstitial,
  showRewardedAd,
} from '../services/adsManager';
import {
  IS_STORE_PRODUCTION_BUILD,
} from '../constants/releaseConfig';
import {
  addRunToHistory,
  DEFAULT_SMARTER_PROGRESS,
  loadSmarterProgress,
  saveSmarterProgress,
  SmarterBadge,
  SmarterProgress,
  syncBadges,
} from '../services/smarterProgress';

type StudioThemeId = 'tv_studio' | 'chalkboard' | 'cosmic_arcade';
type GameMode = 'million_ladder' | 'speed_blitz' | 'subject_practice';

interface StudioTheme {
  id: StudioThemeId;
  name: string;
  emoji: string;
  bg: string;
  stageBg: string;
  chalkboardBg: string;
  chalkboardBorder: string;
  primary: string;
  secondary: string;
  textMain: string;
  textMuted: string;
}

const STUDIO_THEMES: Record<StudioThemeId, StudioTheme> = {
  tv_studio: {
    id: 'tv_studio',
    name: 'Golden TV Studio',
    emoji: '🎬',
    bg: '#070B19',
    stageBg: '#101830',
    chalkboardBg: '#0B2922',
    chalkboardBorder: '#D97706',
    primary: '#F59E0B',
    secondary: '#38BDF8',
    textMain: '#F8FAFC',
    textMuted: '#94A3B8',
  },
  chalkboard: {
    id: 'chalkboard',
    name: '2nd Grade Classroom',
    emoji: '🏫',
    bg: '#091914',
    stageBg: '#112A22',
    chalkboardBg: '#14382C',
    chalkboardBorder: '#B45309',
    primary: '#FBBF24',
    secondary: '#34D399',
    textMain: '#F0FDF4',
    textMuted: '#A7F3D0',
  },
  cosmic_arcade: {
    id: 'cosmic_arcade',
    name: 'Cosmic Recess',
    emoji: '🚀',
    bg: '#0E0720',
    stageBg: '#1A103C',
    chalkboardBg: '#1E1145',
    chalkboardBorder: '#A855F7',
    primary: '#C084FC',
    secondary: '#22D3EE',
    textMain: '#FAF5FF',
    textMuted: '#C4B5FD',
  },
};

const DEFAULT_KID_PORTRAITS: Record<string, ImageSourcePropType> = {
  'leo-math': require('../../assets/personas/kid-leo.jpg'),
  'maya-science': require('../../assets/personas/kid-maya.jpg'),
  'toby-world': require('../../assets/personas/kid-toby.jpg'),
  'chloe-words': require('../../assets/personas/kid-chloe.jpg'),
  'zane-riddles': require('../../assets/personas/kid-zane.jpg'),
};

interface SmarterThan7YoAppProps {
  onSwitchToGreatestMinds?: () => void;
  kidPortraits?: Record<string, ImageSourcePropType>;
  storeReviewMode?: boolean;
  onToggleStoreReviewMode?: () => void;
  onOpenPrivacyPolicy?: () => void;
}

export const SmarterThan7YoApp: React.FC<SmarterThan7YoAppProps> = ({
  onSwitchToGreatestMinds,
  kidPortraits = DEFAULT_KID_PORTRAITS,
  storeReviewMode = IS_STORE_PRODUCTION_BUILD,
  onToggleStoreReviewMode,
  onOpenPrivacyPolicy,
}) => {
  const [themeId, setThemeId] = useState<StudioThemeId>('tv_studio');
  const theme = STUDIO_THEMES[themeId];

  const [language, setLanguage] = useState<AppLanguage>('en');
  // Always show the Language Selection Welcome Screen in front of the app when opened!
  const [languageWelcomeOpen, setLanguageWelcomeOpen] = useState(true);
  // Hide the Leo (Age 7) box by default so the question is seen fast at the top of the main screen;
  // expand it only when a classmate chip is selected or Peek is used.
  const [classmateBoxExpanded, setClassmateBoxExpanded] = useState(false);

  const ui = UI_STRINGS[language] || UI_STRINGS.en;
  const langInfo = useMemo(
    () => SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0],
    [language]
  );
  const localizedQuestions = useMemo(() => getLocalizedQuestions(language), [language]);
  const localizedLadder = useMemo(() => getLocalizedLadder(language), [language]);
  const localizedClassmates = useMemo(() => getLocalizedClassmates(language), [language]);

  const [gameMode, setGameMode] = useState<GameMode>('million_ladder');
  const [selectedSubject, setSelectedSubject] = useState<SubjectCategory | 'All'>('All');
  const [activeClassmateId, setActiveClassmateId] = useState<string>(KID_CLASSMATES[0].id);
  const activeClassmate = useMemo(
    () =>
      localizedClassmates.find((k) => k.id === activeClassmateId) ||
      localizedClassmates[0],
    [localizedClassmates, activeClassmateId]
  );

  // Game progression state
  const [currentRungIndex, setCurrentRungIndex] = useState(0); // 0..9 (Rung 1..10)
  const [questionIndexInPool, setQuestionIndexInPool] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);
  const [peekNoteVisible, setPeekNoteVisible] = useState(false);

  // Lifelines ("Cheat Off a 7-Year-Old")
  const [peekUsesLeft, setPeekUsesLeft] = useState(2);
  const [copyUsesLeft, setCopyUsesLeft] = useState(1);
  const [eraseUsesLeft, setEraseUsesLeft] = useState(2);

  // Player stats & monetization ($0 API cost -> 100% profit!)
  const [goldStars, setGoldStars] = useState(15);
  const [iqScore, setIqScore] = useState(105);
  const [streakCount, setStreakCount] = useState(0);
  const [isVipHonorRoll, setIsVipHonorRoll] = useState(false);
  const [simulatedAdRevenueUsd, setSimulatedAdRevenueUsd] = useState(0);

  // Blitz timer
  const [blitzSecondsLeft, setBlitzSecondsLeft] = useState(60);
  const [blitzScore, setBlitzScore] = useState(0);

  // Modals
  const [flunkModalVisible, setFlunkModalVisible] = useState(false);
  const [victoryModalVisible, setVictoryModalVisible] = useState(false);
  const [pledgeSigned, setPledgeSigned] = useState(false);
  const [copiedPledge, setCopiedPledge] = useState(false);
  const [storeModalVisible, setStoreModalVisible] = useState(false);
  const [ladderDrawerVisible, setLadderDrawerVisible] = useState(false);
  const [playStrategyVisible, setPlayStrategyVisible] = useState(false);

  // Chalkboard entrance animation
  const cardScaleAnim = useRef(new Animated.Value(0.95)).current;

  // Persistent progress (history, badges, onboarding, stories) — survives reloads.
  const [progress, setProgress] = useState<SmarterProgress>(DEFAULT_SMARTER_PROGRESS);
  const [hydrated, setHydrated] = useState(false);
  const [rewardedLeft, setRewardedLeft] = useState<number | null>(null);
  const [badgeToast, setBadgeToast] = useState<SmarterBadge | null>(null);
  const [adNotice, setAdNotice] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    preloadInterstitial(); // SnapReels: preload when the screen opens
    Promise.all([
      loadSmarterProgress().catch(() => DEFAULT_SMARTER_PROGRESS),
      getRewardedRemainingToday().catch(() => 10),
      getAdsStats().catch(() => ({ estRevenueUsd: 0, impressions: 0, rewardedCount: 0, interstitialCount: 0 })),
    ]).then(([p, left, stats]) => {
      if (!mounted) return;
      progressRef.current = p;
      setProgress(p);
      if (p.language) {
        setLanguage(p.language);
      }
      setGoldStars(p.goldStars);
      setIqScore(p.iqScore);
      setIsVipHonorRoll(p.isVipHonorRoll);
      setRewardedLeft(left);
      setSimulatedAdRevenueUsd(stats.estRevenueUsd);
      setHydrated(true);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Single place that mutates + persists progress and awards new badges.
  // A ref keeps the latest value so side effects (toast, storage) stay out of setState updaters.
  const progressRef = useRef<SmarterProgress>(DEFAULT_SMARTER_PROGRESS);
  const commitProgress = (updater: (p: SmarterProgress) => SmarterProgress) => {
    const { progress: synced, newlyEarned } = syncBadges(updater(progressRef.current));
    progressRef.current = synced;
    setProgress(synced);
    saveSmarterProgress(synced);
    if (newlyEarned.length > 0) {
      setBadgeToast(newlyEarned[0]);
      setTimeout(() => setBadgeToast(null), 3200);
    }
  };

  const handleConfirmLanguage = (chosenLang: AppLanguage) => {
    setLanguage(chosenLang);
    setLanguageWelcomeOpen(false);
    commitProgress((p) => ({
      ...p,
      language: chosenLang,
      languageChosen: true,
      onboardingDone: true,
    }));
  };

  // Mirror the headline stats into persistent progress.
  useEffect(() => {
    if (!hydrated) return;
    commitProgress((p) => ({ ...p, goldStars, iqScore, isVipHonorRoll }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goldStars, iqScore, isVipHonorRoll, hydrated]);

  // Daily classmate stories (Astroway story_view pattern): each kid shares 2 facts.
  const classmateStories: StoryItem[] = useMemo(
    () =>
      localizedClassmates.map((kid) => {
        const facts = localizedQuestions.filter((q) => q.subject === kid.favoriteSubject);
        return {
          id: kid.id,
          name: kid.name,
          accentColor: kid.accentColor,
          image: kidPortraits[kid.id],
          emoji: kid.avatarEmoji,
          slides: [
            { text: kid.greetingQuote, caption: `${kid.name}, ${ui.ageLabel} ${kid.age} • ${kid.grade}` },
            ...facts.slice(0, 2).map((q) => ({
              text: q.funFact,
              caption: `${kid.propEmoji} ${ui.subjects[kid.favoriteSubject]}`,
            })),
          ],
        };
      }),
    [kidPortraits, localizedClassmates, localizedQuestions, ui]
  );

  const handleStorySeen = (id: string) =>
    commitProgress((p) =>
      p.seenStoryIds.includes(id) ? p : { ...p, seenStoryIds: [...p.seenStoryIds, id] }
    );

  const handleStoryCta = (id: string) => {
    const kid = localizedClassmates.find((k) => k.id === id);
    if (kid) {
      setActiveClassmateId(kid.id);
      setClassmateBoxExpanded(true);
    }
  };

  const recordRun = (won: boolean) =>
    commitProgress((p) =>
      addRunToHistory(p, {
        mode: gameMode,
        rungReached: currentRungIndex + 1,
        prizeLabel: localizedLadder[Math.min(currentRungIndex, localizedLadder.length - 1)].prizeLabel,
        classmateId: activeClassmate.id,
        iqScore,
        won,
      })
    );

  /** Rewarded ad through the shared manager (daily cap + consent). */
  const runRewardedAd = async (): Promise<boolean> => {
    const res = await showRewardedAd();
    setRewardedLeft(res.remainingToday);
    if (!res.rewarded) {
      setAdNotice(
        res.reason === 'daily_limit'
          ? "You've watched today's 10 bonus videos. Come back tomorrow or go VIP!"
          : res.reason === 'needs_consent'
          ? 'Please answer the privacy prompt first to unlock video rewards.'
          : 'No video available right now — try again in a moment.'
      );
      setTimeout(() => setAdNotice(null), 3500);
      return false;
    }
    const stats = await getAdsStats();
    setSimulatedAdRevenueUsd(stats.estRevenueUsd);
    return true;
  };

  // Random shuffle seed so questions are completely random every game and every rung!
  const [shuffleSeed, setShuffleSeed] = useState(() =>
    Math.floor(Math.random() * 1_000_000)
  );

  // Shuffled question bank (~2,103 questions) randomized on every new game / shuffle
  const shuffledQuestions = useMemo(
    () => shuffleQuestions(localizedQuestions),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [localizedQuestions, shuffleSeed]
  );

  // Build filtered random question pool
  const activeQuestionPool = useMemo(() => {
    if (gameMode === 'million_ladder') {
      const targetRung = currentRungIndex + 1;
      const rungMatches = shuffledQuestions.filter(
        (q) => q.difficultyRung === targetRung
      );
      return rungMatches.length > 0 ? rungMatches : shuffledQuestions;
    }
    if (selectedSubject !== 'All') {
      const subjMatches = shuffledQuestions.filter(
        (q) => q.subject === selectedSubject
      );
      return subjMatches.length > 0 ? subjMatches : shuffledQuestions;
    }
    return shuffledQuestions;
  }, [gameMode, currentRungIndex, selectedSubject, shuffledQuestions]);

  const currentQuestion: TriviaQuestion7Yo =
    activeQuestionPool[questionIndexInPool % activeQuestionPool.length] ||
    shuffledQuestions[0] ||
    localizedQuestions[0];

  const currentLadderRung =
    localizedLadder[Math.min(currentRungIndex, localizedLadder.length - 1)];

  const currentSubjectMeta = useMemo(
    () =>
      SUBJECT_CATEGORIES.find((s) => s.id === currentQuestion.subject) ||
      SUBJECT_CATEGORIES[0],
    [currentQuestion.subject]
  );

  // Blitz countdown timer
  useEffect(() => {
    if (gameMode !== 'speed_blitz') return;
    if (blitzSecondsLeft <= 0) {
      playLoserLaughSound(activeClassmate.wrongRoasts[0], langInfo.ttsLang);
      setFlunkModalVisible(true);
      return;
    }
    const timer = setInterval(() => {
      setBlitzSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [gameMode, blitzSecondsLeft, activeClassmate.wrongRoasts, langInfo.ttsLang]);

  // Animate chalkboard question card on question change
  useEffect(() => {
    cardScaleAnim.setValue(0.94);
    Animated.spring(cardScaleAnim, {
      toValue: 1,
      friction: 6,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, [currentQuestion.id, cardScaleAnim]);

  // Determine classmate mood & speech bubble
  const classmateMood = useMemo(() => {
    if (!isAnswerLocked) {
      return peekNoteVisible ? 'hand_raised' : 'idle';
    }
    if (selectedOption === currentQuestion.correctIndex) {
      return 'excited';
    }
    return 'roasting';
  }, [isAnswerLocked, selectedOption, currentQuestion.correctIndex, peekNoteVisible]);

  const classmateSpeechText = useMemo(() => {
    if (!isAnswerLocked) {
      if (peekNoteVisible) {
        return `${ui.peekSpeechPrefix} "${currentQuestion.kidPeekNote}"`;
      }
      return ui.idleSpeechTemplate.replace(
        '{pct}',
        String(currentQuestion.adultFailRatePct)
      );
    }
    if (selectedOption === currentQuestion.correctIndex) {
      const cheers = activeClassmate.correctCheers;
      return cheers[currentRungIndex % cheers.length];
    }
    return currentQuestion.kidRoastOnMiss || activeClassmate.wrongRoasts[0];
  }, [
    isAnswerLocked,
    peekNoteVisible,
    selectedOption,
    currentQuestion,
    activeClassmate,
    currentRungIndex,
    ui,
  ]);

  const speakTextOutLoud = (text: string, pitch = 1.25) => {
    speakKidVoice(text, langInfo.ttsLang, pitch);
  };

  const handleSelectOption = (optionIndex: number) => {
    if (isAnswerLocked) return;
    setSelectedOption(optionIndex);
    setIsAnswerLocked(true);

    const isCorrect = optionIndex === currentQuestion.correctIndex;
    const nextStreak = isCorrect ? streakCount + 1 : 0;
    commitProgress((p) => ({
      ...p,
      totalAnswered: p.totalAnswered + 1,
      totalCorrect: p.totalCorrect + (isCorrect ? 1 : 0),
      bestStreak: Math.max(p.bestStreak, nextStreak),
    }));
    if (isCorrect) {
      setGoldStars((prev) => prev + 5);
      setIqScore((prev) => Math.min(180, prev + 3));
      setStreakCount(nextStreak);
      if (gameMode === 'speed_blitz') {
        setBlitzScore((prev) => prev + 100);
      }
      const cheers = activeClassmate.correctCheers;
      playCorrectChimeSound(
        cheers[currentRungIndex % cheers.length],
        langInfo.ttsLang
      );
    } else {
      setStreakCount(0);
      setIqScore((prev) => Math.max(75, prev - 4));
      // Play Loser Horn ("Wah-Wah-Wah-Waaaaah") + Cheeky Kid Laugh + Roast Voice!
      playLoserLaughSound(currentQuestion.kidRoastOnMiss, langInfo.ttsLang);
      if (gameMode === 'million_ladder') {
        setTimeout(() => {
          setFlunkModalVisible(true);
        }, 1200);
      }
    }
  };

  const handleNextQuestion = async () => {
    setSelectedOption(null);
    setIsAnswerLocked(false);
    setHiddenOptions([]);
    setPeekNoteVisible(false);
    setClassmateBoxExpanded(false);

    if (gameMode === 'million_ladder') {
      if (currentRungIndex >= localizedLadder.length - 1) {
        recordRun(true);
        setVictoryModalVisible(true);
        return;
      }
      const nextRung = currentRungIndex + 1;
      setCurrentRungIndex(nextRung);
      setQuestionIndexInPool(
        (prev) => prev + 1 + Math.floor(Math.random() * 7)
      );
      // Auto-rotate to the classmate whose favorite subject matches or next classmate
      const nextPartner =
        localizedClassmates[nextRung % localizedClassmates.length];
      setActiveClassmateId(nextPartner.id);
    } else {
      setQuestionIndexInPool(
        (prev) => prev + 1 + Math.floor(Math.random() * 5)
      );
      // Practice/blitz: frequency-capped interstitial between questions (never mid-ladder).
      const shown = await maybeShowInterstitial({ isAdFree: isVipHonorRoll });
      if (shown) {
        preloadInterstitial();
        const stats = await getAdsStats();
        setSimulatedAdRevenueUsd(stats.estRevenueUsd);
      }
    }
  };

  // LIFELINE 1: 👀 Peek at Classmate's Paper
  const handleUsePeek = () => {
    if (isAnswerLocked || peekNoteVisible) return;
    if (peekUsesLeft <= 0 && !isVipHonorRoll) {
      setStoreModalVisible(true);
      return;
    }
    if (!isVipHonorRoll) {
      setPeekUsesLeft((prev) => Math.max(0, prev - 1));
    }
    setPeekNoteVisible(true);
    setClassmateBoxExpanded(true);
    speakTextOutLoud(currentQuestion.kidPeekNote, 1.38);
  };

  // LIFELINE 2: 📋 Copy Classmate's Answer
  const handleUseCopy = () => {
    if (isAnswerLocked) return;
    if (copyUsesLeft <= 0 && !isVipHonorRoll) {
      setStoreModalVisible(true);
      return;
    }
    if (!isVipHonorRoll) {
      setCopyUsesLeft((prev) => Math.max(0, prev - 1));
    }
    setPeekNoteVisible(true);
    handleSelectOption(currentQuestion.correctIndex);
  };

  // LIFELINE 3: 🧽 Erase 2 Wrong Answers (50/50 Chalkboard Eraser)
  const handleUseEraseTwo = () => {
    if (isAnswerLocked || hiddenOptions.length > 0) return;
    if (eraseUsesLeft <= 0 && !isVipHonorRoll) {
      setStoreModalVisible(true);
      return;
    }
    if (!isVipHonorRoll) {
      setEraseUsesLeft((prev) => Math.max(0, prev - 1));
    }
    const wrongIndices = [0, 1, 2, 3].filter(
      (i) => i !== currentQuestion.correctIndex
    );
    const twoToHide = wrongIndices.slice(0, 2);
    setHiddenOptions(twoToHide);
  };

  // Watch AdMob Rewarded Video to Revive on Current Rung ("Second-Chance Recess Bell")
  const handleWatchAdToRevive = async () => {
    const ok = await runRewardedAd();
    if (!ok) return;
    setFlunkModalVisible(false);
    setPledgeSigned(false);
    setSelectedOption(null);
    setIsAnswerLocked(false);
    setHiddenOptions([]);
    setPeekNoteVisible(true); // Bonus: classmate gives you the hint on revive!
    setClassmateBoxExpanded(true);
    if (gameMode === 'speed_blitz') {
      setBlitzSecondsLeft(45);
    }
  };

  // Watch AdMob Rewarded Video to Refill All 3 Lifelines
  const handleWatchAdRefillLifelines = async () => {
    const ok = await runRewardedAd();
    if (!ok) return;
    setPeekUsesLeft((prev) => prev + 2);
    setCopyUsesLeft((prev) => prev + 1);
    setEraseUsesLeft((prev) => prev + 2);
    setGoldStars((prev) => prev + 10);
    setStoreModalVisible(false);
  };

  const handleRestartLadder = () => {
    if (flunkModalVisible) {
      recordRun(false);
    }
    setFlunkModalVisible(false);
    setVictoryModalVisible(false);
    setPledgeSigned(false);
    setCurrentRungIndex(0);
    setShuffleSeed((prev) => prev + 1);
    setQuestionIndexInPool((prev) => prev + 1 + Math.floor(Math.random() * 11));
    setSelectedOption(null);
    setIsAnswerLocked(false);
    setHiddenOptions([]);
    setPeekNoteVisible(false);
    setClassmateBoxExpanded(false);
    setPeekUsesLeft(2);
    setCopyUsesLeft(1);
    setEraseUsesLeft(2);
    if (gameMode === 'speed_blitz') {
      setBlitzSecondsLeft(60);
      setBlitzScore(0);
    }
  };

  const handleCopyHumilityPledge = () => {
    const pledgeText = `🎒 ${ui.pledgeQuotePrefix}${ui.pledgeQuoteHighlight.replace(
      '{name}',
      activeClassmate.name
    )}” • ${ui.playgroundIq}: ${iqScore}`;
    if (
      Platform.OS === 'web' &&
      typeof navigator !== 'undefined' &&
      navigator.clipboard
    ) {
      navigator.clipboard.writeText(pledgeText).catch(() => {});
    }
    setCopiedPledge(true);
    setTimeout(() => setCopiedPledge(false), 2500);
  };

  const optionLetters = ['A', 'B', 'C', 'D'];

  // 1) WELCOME SCREEN: Language Selection in front of the app when first opened (or when reopened from top bar)
  if (languageWelcomeOpen || !progress.languageChosen) {
    return (
      <View style={[styles.root, { backgroundColor: theme.bg }]}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[
            styles.scrollContent,
            { justifyContent: 'flex-start', paddingVertical: 18 },
          ]}
        >
          <View style={[styles.maxContainer, { maxWidth: 680 }]}>
            <View
              style={[
                styles.welcomeLangCard,
                {
                  backgroundColor: theme.stageBg,
                  borderColor: theme.primary,
                },
              ]}
            >
              <View style={styles.welcomeLangBadge}>
                <Text style={styles.welcomeLangBadgeText}>{ui.welcomeBadge}</Text>
              </View>

              <Text style={[styles.welcomeLangAppTitle, { color: theme.primary }]}>
                🎒 {langInfo.storeTitle}
              </Text>
              <Text style={[styles.welcomeLangTitle, { color: theme.textMain }]}>
                {ui.welcomeTitle}
              </Text>
              <Text style={[styles.welcomeLangSub, { color: theme.textMuted }]}>
                {ui.welcomeSubtitle}
              </Text>

              {/* Top Quick-Start Button in Selected Language */}
              <Pressable
                onPress={() => handleConfirmLanguage(language)}
                style={[
                  styles.welcomeLangContinueBtn,
                  { backgroundColor: theme.primary, marginBottom: 14, marginTop: 4 },
                ]}
              >
                <Text style={styles.welcomeLangContinueText}>
                  {langInfo.flag} {ui.continueInLang}
                </Text>
              </Pressable>

              <View style={styles.welcomeLangGrid}>
                {SUPPORTED_LANGUAGES.map((item) => {
                  const selected = item.code === language;
                  return (
                    <Pressable
                      key={item.code}
                      onPress={() => {
                        if (selected) {
                          handleConfirmLanguage(item.code);
                        } else {
                          setLanguage(item.code);
                        }
                      }}
                      style={[
                        styles.welcomeLangOption,
                        selected && {
                          backgroundColor: 'rgba(245, 158, 11, 0.22)',
                          borderColor: theme.primary,
                        },
                      ]}
                    >
                      <Text style={styles.welcomeLangFlag}>{item.flag}</Text>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            styles.welcomeLangNative,
                            selected && { color: '#FBBF24' },
                          ]}
                        >
                          {item.nativeName}
                        </Text>
                        <Text style={styles.welcomeLangRegion}>
                          {item.englishName} • {item.marketRegion}
                        </Text>
                        <Text style={styles.welcomeLangStoreTitle} numberOfLines={1}>
                          🏷️ {item.storeTitle}
                        </Text>
                      </View>
                      <Pressable
                        onPress={() => handleConfirmLanguage(item.code)}
                        style={[
                          styles.welcomeLangRadio,
                          {
                            width: 'auto',
                            paddingHorizontal: 10,
                            borderRadius: 999,
                            backgroundColor: selected
                              ? theme.primary
                              : 'rgba(56, 189, 248, 0.18)',
                            borderColor: selected ? theme.primary : '#38BDF8',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.welcomeLangRadioCheck,
                            { color: selected ? '#090D16' : '#7DD3FC', fontSize: 12 },
                          ]}
                        >
                          {selected ? '✓ PLAY' : '▶'}
                        </Text>
                      </Pressable>
                    </Pressable>
                  );
                })}
              </View>

              <Pressable
                onPress={() => handleConfirmLanguage(language)}
                style={[
                  styles.welcomeLangContinueBtn,
                  { backgroundColor: theme.primary },
                ]}
              >
                <Text style={styles.welcomeLangContinueText}>
                  {langInfo.flag} {ui.continueInLang}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.maxContainer}>
          {/* SLIM 1-LINE HEADER: LANGUAGE SWITCHER + CURRENT RUNG */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8,
              gap: 8,
            }}
          >
            <Pressable
              onPress={() => setLanguageWelcomeOpen(true)}
              style={[
                styles.zeroApiCostPill,
                {
                  backgroundColor: 'rgba(56, 189, 248, 0.22)',
                  borderColor: '#38BDF8',
                  borderWidth: 1.5,
                  paddingVertical: 7,
                  paddingHorizontal: 12,
                },
              ]}
            >
              <Text style={[styles.zeroApiCostText, { color: '#7DD3FC', fontSize: 13 }]}>
                {langInfo.flag} {langInfo.nativeName} • {ui.changeLanguageBtn}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setLadderDrawerVisible(true)}
              style={[
                styles.zeroApiCostPill,
                {
                  backgroundColor: 'rgba(245, 158, 11, 0.22)',
                  borderColor: theme.primary,
                  borderWidth: 1.5,
                  paddingVertical: 7,
                  paddingHorizontal: 12,
                },
              ]}
            >
              <Text style={[styles.zeroApiCostText, { color: '#FBBF24', fontSize: 13 }]}>
                {gameMode === 'speed_blitz'
                  ? `⏱️ ${blitzSecondsLeft}${ui.secondsLeft} • ${blitzScore} pts`
                  : `🏆 ${ui.rungLabel} ${currentRungIndex + 1}/10 • ${currentLadderRung.prizeLabel}`}
              </Text>
            </Pressable>
          </View>

          {/* ===================================================================== */}
          {/* 1) TODAY'S CLASSMATE STORIES (KIDS' FACES RING AT THE TOP)            */}
          {/* ===================================================================== */}
          <StoriesRing
            title={ui.todaysStories}
            items={classmateStories}
            seenIds={progress.seenStoryIds}
            onSeen={handleStorySeen}
            onStoryCta={handleStoryCta}
            ctaLabel={ui.makeDeskPartnerCta}
            textColor={theme.textMain}
          />

          {/* ===================================================================== */}
          {/* 2) FAST QUESTION-FIRST HERO: CHALKBOARD QUESTION + 4 ANSWERS AT TOP   */}
          {/* ===================================================================== */}
          <Animated.View
            style={[
              styles.chalkboardCard,
              {
                backgroundColor: theme.chalkboardBg,
                borderColor: theme.chalkboardBorder,
                transform: [{ scale: cardScaleAnim }],
                marginBottom: 10,
              },
            ]}
          >
            {/* Chalkboard Top Corner Category Tag + Random Shuffle + Fail Rate */}
            <View style={styles.chalkboardMetaRow}>
              <View
                style={[
                  styles.gradeLevelTag,
                  {
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    borderColor: currentSubjectMeta.color,
                    borderWidth: 1.8,
                    paddingHorizontal: 11,
                    paddingVertical: 6,
                    borderRadius: 999,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.gradeLevelTagText,
                    { color: currentSubjectMeta.color, fontSize: 12, fontWeight: '900' },
                  ]}
                >
                  {currentSubjectMeta.emoji}{' '}
                  {(ui.subjects[currentQuestion.subject] || currentQuestion.subject).toUpperCase()}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <Pressable
                  disabled={isAnswerLocked}
                  onPress={() => {
                    setShuffleSeed((prev) => prev + 1);
                    setQuestionIndexInPool(
                      (prev) => prev + 1 + Math.floor(Math.random() * 17)
                    );
                    setHiddenOptions([]);
                    setPeekNoteVisible(false);
                  }}
                  style={[
                    styles.gradeLevelTag,
                    {
                      backgroundColor: 'rgba(56, 189, 248, 0.16)',
                      borderColor: '#38BDF8',
                      borderWidth: 1,
                      paddingHorizontal: 9,
                      paddingVertical: 5,
                      borderRadius: 999,
                    },
                  ]}
                >
                  <Text style={[styles.gradeLevelTagText, { color: '#7DD3FC', fontSize: 11 }]}>
                    🎲 {localizedQuestions.length.toLocaleString()} Qs
                  </Text>
                </Pressable>

                <View style={styles.failRateBadge}>
                  <Text style={styles.failRateText}>
                    ⚠️ {currentQuestion.adultFailRatePct}{ui.adultsFailThis}
                  </Text>
                </View>
              </View>
            </View>

            {/* Question Text + Read Aloud */}
            <Pressable
              onPress={() => speakTextOutLoud(currentQuestion.question, 1.08)}
              style={styles.questionBox}
            >
              <Text style={styles.chalkQuestionText}>
                {currentQuestion.question}
              </Text>
              <Text style={styles.chalkListenSub}>
                {ui.tapChalkboardReadAloud}
              </Text>
            </Pressable>

            {/* 4 TACTILE 3D GAME-SHOW BUZZER ANSWER BUTTONS (RIGHT BELOW QUESTION!) */}
            <View style={styles.optionsGrid}>
              {currentQuestion.options.map((optionText, idx) => {
                const isErased = hiddenOptions.includes(idx);
                if (isErased) {
                  return (
                    <View key={idx} style={styles.optionErasedSlot}>
                      <Text style={styles.optionErasedText}>
                        🧽 {ui.erasedBy} {activeClassmate.name}!
                      </Text>
                    </View>
                  );
                }

                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQuestion.correctIndex;

                let btnBg = 'rgba(15, 23, 42, 0.85)';
                let btnBorder = 'rgba(255, 255, 255, 0.22)';
                let badgeBg = theme.primary;

                if (isAnswerLocked) {
                  if (isCorrect) {
                    btnBg = 'rgba(16, 185, 129, 0.28)';
                    btnBorder = '#10B981';
                    badgeBg = '#10B981';
                  } else if (isSelected && !isCorrect) {
                    btnBg = 'rgba(244, 63, 94, 0.28)';
                    btnBorder = '#F43F5E';
                    badgeBg = '#F43F5E';
                  }
                }

                return (
                  <Pressable
                    key={idx}
                    disabled={isAnswerLocked}
                    onPress={() => handleSelectOption(idx)}
                    style={({ pressed }) => [
                      styles.optionBuzzerBtn,
                      {
                        backgroundColor: btnBg,
                        borderColor: btnBorder,
                        transform: [{ translateY: pressed ? 3 : 0 }],
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.optionLetterCircle,
                        { backgroundColor: badgeBg },
                      ]}
                    >
                      <Text style={styles.optionLetterText}>
                        {optionLetters[idx]}
                      </Text>
                    </View>
                    <Text style={styles.optionAnswerText}>{optionText}</Text>
                    {isAnswerLocked && isCorrect && (
                      <Text style={styles.optionStatusIcon}>✅</Text>
                    )}
                    {isAnswerLocked && isSelected && !isCorrect && (
                      <Text style={styles.optionStatusIcon}>❌</Text>
                    )}
                  </Pressable>
                );
              })}
            </View>

            {/* 3 "CHEAT OFF A 7-YEAR-OLD" LIFELINES BAR */}
            <View style={[styles.lifelinesBar, { marginTop: 12, marginBottom: 0 }]}>
              <Pressable
                onPress={handleUsePeek}
                disabled={isAnswerLocked}
                style={[
                  styles.lifelineBtn,
                  peekNoteVisible && styles.lifelineBtnUsed,
                ]}
              >
                <Text style={styles.lifelineEmoji}>👀</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.lifelineTitle}>{ui.peekAtPaper}</Text>
                  <Text style={styles.lifelineCount}>
                    {isVipHonorRoll ? '∞ VIP' : `${peekUsesLeft} ${ui.leftCount}`}
                  </Text>
                </View>
              </Pressable>

              <Pressable
                onPress={handleUseCopy}
                disabled={isAnswerLocked}
                style={styles.lifelineBtn}
              >
                <Text style={styles.lifelineEmoji}>📋</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.lifelineTitle}>{ui.copyAnswer}</Text>
                  <Text style={styles.lifelineCount}>
                    {isVipHonorRoll ? '∞ VIP' : `${copyUsesLeft} ${ui.leftCount}`}
                  </Text>
                </View>
              </Pressable>

              <Pressable
                onPress={handleUseEraseTwo}
                disabled={isAnswerLocked || hiddenOptions.length > 0}
                style={[
                  styles.lifelineBtn,
                  hiddenOptions.length > 0 && styles.lifelineBtnUsed,
                ]}
              >
                <Text style={styles.lifelineEmoji}>🧽</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.lifelineTitle}>{ui.eraseTwo}</Text>
                  <Text style={styles.lifelineCount}>
                    {isVipHonorRoll ? '∞ VIP' : `${eraseUsesLeft} ${ui.leftCount}`}
                  </Text>
                </View>
              </Pressable>
            </View>

            {/* POST-ANSWER FUN FACT EXPLANATION & NEXT RUNG BUTTON */}
            {isAnswerLocked && (
              <View
                style={[
                  styles.explanationCard,
                  {
                    borderColor:
                      selectedOption === currentQuestion.correctIndex
                        ? '#10B981'
                        : '#F43F5E',
                  },
                ]}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 8,
                    marginBottom: 4,
                  }}
                >
                  <Text
                    style={[
                      styles.explanationHeadline,
                      {
                        color:
                          selectedOption === currentQuestion.correctIndex
                            ? '#34D399'
                            : '#FB7185',
                        marginBottom: 0,
                        flex: 1,
                      },
                    ]}
                  >
                    {selectedOption === currentQuestion.correctIndex
                      ? ui.correctHeadline.replace('{name}', activeClassmate.name)
                      : `${ui.wrongHeadline} 😂🎺`}
                  </Text>

                  {selectedOption !== currentQuestion.correctIndex && (
                    <Pressable
                      onPress={() =>
                        playLoserLaughSound(
                          currentQuestion.kidRoastOnMiss,
                          langInfo.ttsLang
                        )
                      }
                      style={{
                        backgroundColor: 'rgba(244, 63, 94, 0.25)',
                        borderColor: '#FB7185',
                        borderWidth: 1,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 999,
                      }}
                    >
                      <Text style={{ color: '#FFE4E6', fontSize: 11, fontWeight: '800' }}>
                        🔊😂 Ha-Ha!
                      </Text>
                    </Pressable>
                  )}
                </View>
                <Text style={styles.explanationFact}>
                  💡 <Text style={{ fontWeight: '800' }}>{ui.secondGradeSecret}</Text>{' '}
                  {currentQuestion.funFact}
                </Text>

                {selectedOption === currentQuestion.correctIndex ||
                gameMode !== 'million_ladder' ? (
                  <Pressable
                    onPress={handleNextQuestion}
                    style={[
                      styles.nextRungBtn,
                      { backgroundColor: theme.primary },
                    ]}
                  >
                    <Text style={styles.nextRungBtnText}>
                      {gameMode === 'million_ladder'
                        ? currentRungIndex >= localizedLadder.length - 1
                          ? ui.claimMillionDiploma
                          : ui.climbToRung
                              .replace('{rung}', String(currentRungIndex + 2))
                              .replace(
                                '{prize}',
                                localizedLadder[currentRungIndex + 1]?.prizeLabel || ''
                              )
                        : ui.nextPlaygroundQuestion}
                    </Text>
                  </Pressable>
                ) : (
                  <View style={styles.wrongActionRow}>
                    <Pressable
                      onPress={handleWatchAdToRevive}
                      style={styles.reviveAdBtn}
                    >
                      <Text style={styles.reviveAdBtnText}>
                        {ui.watchAdRevive}
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => setFlunkModalVisible(true)}
                      style={styles.acceptFlunkBtn}
                    >
                      <Text style={styles.acceptFlunkBtnText}>
                        {ui.signHumilityPledge}
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>
            )}
          </Animated.View>

          {/* ===================================================================== */}
          {/* EXPANDED 3D CLASSMATE BOX (ONLY VISIBLE WHEN SELECTED VIA STORIES/PEEK) */}
          {/* ===================================================================== */}
          {classmateBoxExpanded && (
            <View style={{ marginBottom: 12 }}>
              <View
                style={[
                  styles.classmateStageCard,
                  {
                    backgroundColor: theme.stageBg,
                    borderColor: activeClassmate.accentBorder,
                    marginTop: 2,
                    marginBottom: 0,
                  },
                ]}
              >
                <View style={styles.classmateTopRow}>
                  <KidClassmate3D
                    classmate={activeClassmate}
                    size={90}
                    mood={classmateMood}
                    speechBubbleText={classmateSpeechText}
                    imageSource={kidPortraits[activeClassmate.id]}
                  />

                  <View style={styles.classmateSpeechCol}>
                    <View
                      style={[
                        styles.classmateNameRow,
                        { justifyContent: 'space-between' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.classmateName,
                          { color: activeClassmate.accentColor },
                        ]}
                      >
                        {activeClassmate.name} ({ui.ageLabel} {activeClassmate.age})
                      </Text>

                      <Pressable
                        onPress={() => setClassmateBoxExpanded(false)}
                        style={[
                          styles.partnerMiniChip,
                          {
                            borderColor: '#F43F5E',
                            backgroundColor: 'rgba(244, 63, 94, 0.16)',
                            paddingVertical: 3,
                            paddingHorizontal: 8,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.partnerMiniChipText,
                            { color: '#FDA4AF', fontWeight: '900', fontSize: 11 },
                          ]}
                        >
                          {ui.hideClassmateBox}
                        </Text>
                      </Pressable>
                    </View>

                    {/* Speech Bubble */}
                    <Pressable
                      onPress={() => speakTextOutLoud(classmateSpeechText, 1.38)}
                      style={[
                        styles.speechBubble,
                        {
                          borderColor:
                            classmateMood === 'excited'
                              ? '#34D399'
                              : classmateMood === 'roasting'
                              ? '#F43F5E'
                              : activeClassmate.accentBorder,
                        },
                      ]}
                    >
                      <Text style={styles.speechBubbleText}>
                        {classmateSpeechText}
                      </Text>
                      <Text style={styles.tapToHearHint}>{ui.tapToHearVoice}</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* ===================================================================== */}
          {/* 3) BOTTOM SECTION: GAME SHOW ARENA, MODES, LADDER, THEMES & REPORT    */}
          {/* ===================================================================== */}
          <View
            style={[
              styles.scoreboardCard,
              {
                backgroundColor: theme.stageBg,
                borderColor: theme.primary,
              },
            ]}
          >
            <View style={styles.brandTitleWrap}>
              <View style={styles.tvLiveBadgeRow}>
                <View style={styles.tvLivePill}>
                  <Text style={styles.tvLivePillText}>{ui.gameShowArena}</Text>
                </View>
                <Text style={[styles.iqBadgeText, { color: theme.secondary }]}>
                  🧠 {ui.playgroundIq}: {iqScore} • 🔥 {streakCount} {ui.streak}
                </Text>
              </View>
              <Text style={[styles.appMainTitle, { color: theme.textMain }]}>
                {ui.appMainTitlePrefix}{' '}
                <Text style={{ color: theme.primary }}>
                  {ui.appMainTitleHighlight}
                </Text>
              </Text>
            </View>

            <View style={styles.scoreboardRight}>
              <Pressable
                onPress={() => setLadderDrawerVisible(true)}
                style={[
                  styles.prizeBadgeBtn,
                  {
                    backgroundColor: 'rgba(245, 158, 11, 0.16)',
                    borderColor: theme.primary,
                  },
                ]}
              >
                <Text style={styles.prizeBadgeLabel}>
                  {gameMode === 'speed_blitz'
                    ? `⏱️ ${blitzSecondsLeft}${ui.secondsLeft}`
                    : `${ui.rungLabel} ${currentRungIndex + 1}/10`}
                </Text>
                <Text style={[styles.prizeBadgeValue, { color: theme.primary }]}>
                  {gameMode === 'speed_blitz'
                    ? `${blitzScore} pts`
                    : currentLadderRung.prizeLabel}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setStoreModalVisible(true)}
                style={[
                  styles.vipPassBtn,
                  { backgroundColor: theme.primary },
                ]}
              >
                <Text style={styles.vipPassBtnText}>
                  {isVipHonorRoll ? ui.vipActive : ui.plusLifelines}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* GAME MODE TABS ($1M TV Ladder • 60s Recess Blitz • Subject Mastery) */}
          <View style={styles.modeTabsRow}>
            <Pressable
              onPress={() => {
                setGameMode('million_ladder');
                setSelectedOption(null);
                setIsAnswerLocked(false);
              }}
              style={[
                styles.modeTab,
                gameMode === 'million_ladder' && {
                  backgroundColor: theme.primary,
                  borderColor: theme.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.modeTabText,
                  gameMode === 'million_ladder' && styles.modeTabTextActive,
                ]}
              >
                {ui.modeMillionLadder}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setGameMode('speed_blitz');
                setBlitzSecondsLeft(60);
                setBlitzScore(0);
                setSelectedOption(null);
                setIsAnswerLocked(false);
              }}
              style={[
                styles.modeTab,
                gameMode === 'speed_blitz' && {
                  backgroundColor: theme.primary,
                  borderColor: theme.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.modeTabText,
                  gameMode === 'speed_blitz' && styles.modeTabTextActive,
                ]}
              >
                {ui.modeSpeedBlitz}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setGameMode('subject_practice');
                setSelectedOption(null);
                setIsAnswerLocked(false);
              }}
              style={[
                styles.modeTab,
                gameMode === 'subject_practice' && {
                  backgroundColor: theme.primary,
                  borderColor: theme.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.modeTabText,
                  gameMode === 'subject_practice' && styles.modeTabTextActive,
                ]}
              >
                {ui.modeSubjects}
              </Text>
            </Pressable>
          </View>

          {/* HORIZONTAL 10-RUNG PROGRESS STEPPER (When in $1M Show Ladder Mode) */}
          {gameMode === 'million_ladder' && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.ladderStrip}
            >
              {localizedLadder.map((item, idx) => {
                const isCurrent = idx === currentRungIndex;
                const isPassed = idx < currentRungIndex;
                return (
                  <Pressable
                    key={item.rung}
                    onPress={() => setLadderDrawerVisible(true)}
                    style={[
                      styles.ladderPill,
                      isPassed && styles.ladderPillPassed,
                      isCurrent && {
                        backgroundColor: theme.primary,
                        borderColor: '#FFF',
                        transform: [{ scale: 1.06 }],
                      },
                      item.isSafeHaven &&
                        !isCurrent && {
                          borderColor: '#38BDF8',
                        },
                    ]}
                  >
                    <Text
                      style={[
                        styles.ladderPillText,
                        isPassed && { color: '#34D399' },
                        isCurrent && { color: '#090D16', fontWeight: '900' },
                      ]}
                    >
                      {isPassed ? '✓ ' : `${item.badgeEmoji} `}
                      {item.prizeLabel}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}

          {/* SUBJECT FILTER CHIPS (When in Subject Mastery Mode) */}
          {gameMode === 'subject_practice' && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.ladderStrip}
            >
              <Pressable
                onPress={() => setSelectedSubject('All')}
                style={[
                  styles.ladderPill,
                  selectedSubject === 'All' && {
                    backgroundColor: theme.primary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.ladderPillText,
                    selectedSubject === 'All' && {
                      color: '#090D16',
                      fontWeight: '900',
                    },
                  ]}
                >
                  {ui.allSubjects}
                </Text>
              </Pressable>
              {SUBJECT_CATEGORIES.map((subj) => {
                const active = selectedSubject === subj.id;
                return (
                  <Pressable
                    key={subj.id}
                    onPress={() => {
                      setSelectedSubject(subj.id);
                      setSelectedOption(null);
                      setIsAnswerLocked(false);
                    }}
                    style={[
                      styles.ladderPill,
                      active && {
                        backgroundColor: subj.color,
                        borderColor: '#FFF',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.ladderPillText,
                        active && { color: '#090D16', fontWeight: '900' },
                      ]}
                    >
                      {subj.emoji} {ui.subjects[subj.id] || subj.id}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}

          {/* STUDIO THEME PILLS & STORE / PRIVACY CONTROLS AT BOTTOM */}
          <View
            style={[
              styles.topStudioBar,
              {
                backgroundColor: theme.stageBg,
                borderColor: 'rgba(255,255,255,0.12)',
                marginTop: 8,
                marginBottom: 12,
              },
            ]}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.themePillsRow}
            >
              {(Object.keys(STUDIO_THEMES) as StudioThemeId[]).map((tKey) => {
                const t = STUDIO_THEMES[tKey];
                const active = themeId === tKey;
                return (
                  <Pressable
                    key={tKey}
                    onPress={() => setThemeId(tKey)}
                    style={[
                      styles.themePill,
                      active && {
                        backgroundColor: theme.primary,
                        borderColor: theme.primary,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.themePillText,
                        active && { color: '#090D16', fontWeight: '900' },
                      ]}
                    >
                      {t.emoji} {ui.themes[tKey] || t.name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={styles.topStudioLeft}>
              <Pressable
                onPress={() => setStoreModalVisible(true)}
                style={[
                  styles.zeroApiCostPill,
                  {
                    backgroundColor: 'rgba(251, 191, 36, 0.18)',
                    borderColor: '#FBBF24',
                    borderWidth: 1,
                  },
                ]}
              >
                <Text style={[styles.zeroApiCostText, { color: '#FBBF24' }]}>
                  {isVipHonorRoll ? ui.honorRollActive : ui.removeAdsPrice}
                </Text>
              </Pressable>
              {onOpenPrivacyPolicy && (
                <Pressable
                  onPress={onOpenPrivacyPolicy}
                  style={[
                    styles.zeroApiCostPill,
                    {
                      backgroundColor: 'rgba(148, 163, 184, 0.16)',
                      borderColor: '#64748B',
                      borderWidth: 1,
                    },
                  ]}
                >
                  <Text style={[styles.zeroApiCostText, { color: '#CBD5E1' }]}>
                    {ui.privacyPolicy}
                  </Text>
                </Pressable>
              )}
              {onSwitchToGreatestMinds && !storeReviewMode && (
                <Pressable
                  onPress={onSwitchToGreatestMinds}
                  style={styles.switchAppBtn}
                >
                  <Text style={styles.switchAppBtnText}>
                    🏛️ Switch to App #1: 200 Greatest Minds
                  </Text>
                </Pressable>
              )}
            </View>
          </View>

          {/* MY REPORT CARD: persistent history + badges */}
          <ReportCardPanel
            progress={progress}
            accentColor={theme.primary}
            surfaceColor={theme.stageBg}
            onClearHistory={() => commitProgress((p) => ({ ...p, history: [] }))}
          />
        </View>
      </ScrollView>

      {/* MODAL 1: VIRAL "FLUNK OUT" HUMILITY PLEDGE OR REVIVE */}
      <Modal
        visible={flunkModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFlunkModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTopEmoji}>🎒😂</Text>
            <Text style={styles.modalTitle}>
              {ui.flunkedOutAt.replace('{prize}', currentLadderRung.prizeLabel)}
            </Text>
            <Text style={styles.modalSub}>
              {ui.flunkModalSub.replace('{name}', activeClassmate.name)}
            </Text>

            <View style={styles.pledgeCertificateBox}>
              <Text style={styles.pledgeHeader}>{ui.officialReportCard}</Text>
              <Text style={styles.pledgeQuote}>
                {ui.pledgeQuotePrefix}
                <Text style={{ color: '#FB7185', fontWeight: '900' }}>
                  {ui.pledgeQuoteHighlight.replace('{name}', activeClassmate.name)}
                </Text>
                !”
              </Text>
              <Pressable
                onPress={() => {
                  setPledgeSigned(true);
                  speakTextOutLoud(
                    `${ui.pledgeQuotePrefix}${ui.pledgeQuoteHighlight.replace(
                      '{name}',
                      activeClassmate.name
                    )}`,
                    1.0
                  );
                }}
                style={[
                  styles.signPledgeBtn,
                  pledgeSigned && { backgroundColor: '#10B981' },
                ]}
              >
                <Text style={styles.signPledgeBtnText}>
                  {pledgeSigned ? ui.signedAndConfessed : ui.tapToSignAndConfess}
                </Text>
              </Pressable>
            </View>

            <Pressable
              onPress={handleWatchAdToRevive}
              style={styles.modalRevivePrimaryBtn}
            >
              <Text style={styles.modalRevivePrimaryText}>
                {ui.watchVideoReviveAt.replace(
                  '{prize}',
                  currentLadderRung.prizeLabel
                )}
              </Text>
            </Pressable>

            <View style={styles.modalBottomRow}>
              <Pressable
                onPress={handleCopyHumilityPledge}
                style={styles.shareCertBtn}
              >
                <Text style={styles.shareCertBtnText}>
                  {copiedPledge ? ui.copiedScoreCard : ui.shareReportCard}
                </Text>
              </Pressable>

              <Pressable
                onPress={handleRestartLadder}
                style={styles.restartGameBtn}
              >
                <Text style={styles.restartGameBtnText}>{ui.newGameBtn}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: $1,000,000 SUPREME 7-YEAR-OLD GENIUS DIPLOMA */}
      <Modal
        visible={victoryModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setVictoryModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { borderColor: '#F59E0B' }]}>
            <Text style={styles.modalTopEmoji}>🎓👑🎉</Text>
            <Text style={[styles.modalTitle, { color: '#FBBF24' }]}>
              {ui.millionGraduateTitle}
            </Text>
            <Text style={styles.modalSub}>{ui.millionGraduateSub}</Text>

            <View
              style={[
                styles.pledgeCertificateBox,
                { borderColor: '#F59E0B', backgroundColor: 'rgba(245,158,11,0.12)' },
              ]}
            >
              <Text style={[styles.pledgeHeader, { color: '#FBBF24' }]}>
                {ui.goldenDiplomaHeader}
              </Text>
              <Text style={styles.pledgeQuote}>
                {ui.playgroundIq}: {iqScore} • {activeClassmate.name} ({ui.ageLabel}{' '}
                {activeClassmate.age})
              </Text>
            </View>

            <Pressable
              onPress={handleRestartLadder}
              style={styles.modalRevivePrimaryBtn}
            >
              <Text style={styles.modalRevivePrimaryText}>
                {ui.playAnotherMillionRun}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* MODAL 3: LIFELINES, ADMOB & HONOR ROLL VIP STORE ($0 API COST = 100% PROFIT) */}
      <Modal
        visible={storeModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setStoreModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTopEmoji}>🎒💎</Text>
            <Text style={styles.modalTitle}>{ui.schoolStoreTitle}</Text>
            <Text style={styles.modalSub}>{ui.schoolStoreSub}</Text>

            <Pressable
              onPress={handleWatchAdRefillLifelines}
              style={styles.modalRevivePrimaryBtn}
            >
              <Text style={styles.modalRevivePrimaryText}>
                {ui.watchAdRefillBtn}
                {rewardedLeft !== null ? ` • ${rewardedLeft}/10` : ''}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setIsVipHonorRoll(true);
                commitProgress((p) => ({ ...p, isVipHonorRoll: true }));
                setSimulatedAdRevenueUsd((prev) => Number((prev + 3.39).toFixed(4)));
                setStoreModalVisible(false);
              }}
              style={[
                styles.vipBundleOptionBtn,
                isVipHonorRoll && { borderColor: '#10B981' },
              ]}
            >
              <Text style={styles.vipBundleOptionTitle}>{ui.oneTimeProTitle}</Text>
              <Text style={styles.vipBundleOptionDesc}>{ui.oneTimeProDesc}</Text>
            </Pressable>

            <Pressable
              onPress={() => setStoreModalVisible(false)}
              style={[styles.restartGameBtn, { marginTop: 12, width: '100%' }]}
            >
              <Text style={styles.restartGameBtnText}>{ui.backToChalkboard}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* MODAL 4: 10-RUNG $1,000,000 LADDER OVERVIEW */}
      <Modal
        visible={ladderDrawerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setLadderDrawerVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{ui.scholarshipLadderTitle}</Text>
            <ScrollView style={{ maxHeight: 340, width: '100%', marginVertical: 10 }}>
              {[...localizedLadder].reverse().map((item) => {
                const idx = item.rung - 1;
                const isCurrent = idx === currentRungIndex;
                const isPassed = idx < currentRungIndex;
                return (
                  <View
                    key={item.rung}
                    style={[
                      styles.ladderModalRow,
                      isCurrent && {
                        backgroundColor: 'rgba(245, 158, 11, 0.25)',
                        borderColor: '#F59E0B',
                      },
                    ]}
                  >
                    <Text style={styles.ladderModalRungNum}>
                      #{item.rung} {item.badgeEmoji}
                    </Text>
                    <Text style={styles.ladderModalGrade}>{item.gradeTitle}</Text>
                    <Text
                      style={[
                        styles.ladderModalPrize,
                        isPassed && { color: '#34D399' },
                        isCurrent && { color: '#FBBF24' },
                      ]}
                    >
                      {item.prizeLabel}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
            <Pressable
              onPress={() => setLadderDrawerVisible(false)}
              style={[styles.restartGameBtn, { width: '100%' }]}
            >
              <Text style={styles.restartGameBtnText}>{ui.closeLadder}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Achievement / ad notices */}
      {badgeToast ? (
        <View pointerEvents="none" style={[styles.toast, { borderColor: theme.primary }]}>
          <Text style={styles.toastText}>
            {badgeToast.emoji} New badge: {badgeToast.title}!
          </Text>
        </View>
      ) : adNotice ? (
        <View pointerEvents="none" style={[styles.toast, { borderColor: '#FB7185' }]}>
          <Text style={styles.toastText}>{adNotice}</Text>
        </View>
      ) : null}

      {/* SnapReels placement: adaptive banner docked at the bottom with 16dp safety buffer, hidden for VIP */}
      <AdBannerSlot
        hidden={isVipHonorRoll}
        onRemoveAds={() => setStoreModalVisible(true)}
        surfaceColor={theme.stageBg}
      />

      <AdConsentGate appName="Smarter Than a 7-Year-Old?" accentColor={theme.primary} />

      <PlayStoreStrategyModal
        visible={playStrategyVisible}
        onClose={() => setPlayStrategyVisible(false)}
        activeApp="smarter7yo"
        isAdFree={isVipHonorRoll}
        onTriggerPaywall={() => setStoreModalVisible(true)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 18,
    alignSelf: 'center',
    maxWidth: 440,
    backgroundColor: 'rgba(15, 23, 42, 0.96)',
    borderWidth: 1.5,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  toastText: { color: '#F8FAFC', fontSize: 13, fontWeight: '900', textAlign: 'center' },
  root: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 60,
  },
  maxContainer: {
    width: '100%',
    maxWidth: 920,
    alignSelf: 'center',
  },
  topStudioBar: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 10,
    marginBottom: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  topStudioLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  switchAppBtn: {
    backgroundColor: 'rgba(99, 102, 241, 0.22)',
    borderColor: '#818CF8',
    borderWidth: 1,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 999,
  },
  switchAppBtnText: {
    color: '#E0E7FF',
    fontSize: 11,
    fontWeight: '800',
  },
  zeroApiCostPill: {
    backgroundColor: 'rgba(16, 185, 129, 0.16)',
    borderColor: '#10B981',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  zeroApiCostText: {
    color: '#34D399',
    fontSize: 10.5,
    fontWeight: '800',
  },
  themePillsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  themePill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  themePillText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '700',
  },
  scoreboardCard: {
    borderRadius: 22,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  brandTitleWrap: {
    flex: 1,
    minWidth: 230,
  },
  tvLiveBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  tvLivePill: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  tvLivePillText: {
    color: '#FFF',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  iqBadgeText: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  appMainTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  scoreboardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  prizeBadgeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  prizeBadgeLabel: {
    color: '#CBD5E1',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  prizeBadgeValue: {
    fontSize: 16,
    fontWeight: '900',
  },
  vipPassBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
  },
  vipPassBtnText: {
    color: '#090D16',
    fontSize: 12,
    fontWeight: '900',
  },
  modeTabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
  },
  modeTabText: {
    color: '#CBD5E1',
    fontSize: 11.5,
    fontWeight: '800',
    textAlign: 'center',
  },
  modeTabTextActive: {
    color: '#090D16',
    fontWeight: '900',
  },
  ladderStrip: {
    flexDirection: 'row',
    gap: 7,
    paddingVertical: 4,
    marginBottom: 12,
  },
  ladderPill: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  ladderPillPassed: {
    borderColor: 'rgba(16, 185, 129, 0.5)',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
  },
  ladderPillText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '800',
  },
  classmateStageCard: {
    borderRadius: 22,
    borderWidth: 1.5,
    padding: 14,
    marginBottom: 14,
  },
  classmateTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  classmateSpeechCol: {
    flex: 1,
  },
  classmateNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6,
  },
  classmateName: {
    fontSize: 16,
    fontWeight: '900',
  },
  classmateSubjectBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  classmateSubjectText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  speechBubble: {
    backgroundColor: 'rgba(9, 13, 22, 0.78)',
    borderRadius: 16,
    borderTopLeftRadius: 4,
    padding: 11,
    borderWidth: 1.5,
  },
  speechBubbleText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
  },
  tapToHearHint: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 5,
    fontWeight: '600',
  },
  partnerPickerRow: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  partnerPickerCompactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  welcomeLangCard: {
    borderRadius: 28,
    borderWidth: 2.5,
    padding: 22,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.5,
    shadowRadius: 22,
    elevation: 12,
  },
  welcomeLangBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.18)',
    borderColor: '#38BDF8',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 10,
  },
  welcomeLangBadgeText: {
    color: '#7DD3FC',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.7,
  },
  welcomeLangAppTitle: {
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 4,
  },
  welcomeLangTitle: {
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 6,
  },
  welcomeLangSub: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 16,
    maxWidth: 520,
  },
  welcomeLangGrid: {
    width: '100%',
    gap: 9,
    marginBottom: 18,
  },
  welcomeLangOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 16,
    paddingVertical: 11,
    paddingHorizontal: 14,
  },
  welcomeLangFlag: {
    fontSize: 26,
  },
  welcomeLangNative: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '900',
  },
  welcomeLangRegion: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 1,
  },
  welcomeLangStoreTitle: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  welcomeLangRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeLangRadioCheck: {
    color: '#090D16',
    fontSize: 13,
    fontWeight: '900',
  },
  welcomeLangContinueBtn: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
  },
  welcomeLangContinueText: {
    color: '#090D16',
    fontSize: 16,
    fontWeight: '900',
  },
  partnerPickerLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.7,
  },
  partnerMiniChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  partnerMiniChipText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '700',
  },
  chalkboardCard: {
    borderRadius: 26,
    borderWidth: 4,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 10,
  },
  chalkboardMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  gradeLevelTag: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  gradeLevelTagText: {
    color: '#FDE68A',
    fontSize: 10.5,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  failRateBadge: {
    backgroundColor: 'rgba(244, 63, 94, 0.22)',
    borderColor: '#FB7185',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  failRateText: {
    color: '#FDA4AF',
    fontSize: 10.5,
    fontWeight: '800',
  },
  questionBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.26)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  chalkQuestionText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 26,
  },
  chalkListenSub: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    marginTop: 8,
    fontWeight: '600',
  },
  lifelinesBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  lifelineBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(15, 23, 42, 0.78)',
    borderWidth: 1.5,
    borderColor: 'rgba(251, 191, 36, 0.45)',
    borderRadius: 14,
    paddingVertical: 9,
    paddingHorizontal: 10,
  },
  lifelineBtnUsed: {
    opacity: 0.5,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  lifelineEmoji: {
    fontSize: 18,
  },
  lifelineTitle: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '800',
  },
  lifelineCount: {
    color: '#FBBF24',
    fontSize: 9.5,
    fontWeight: '800',
  },
  optionsGrid: {
    gap: 10,
  },
  optionBuzzerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 2,
    paddingVertical: 13,
    paddingHorizontal: 14,
    gap: 12,
  },
  optionLetterCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLetterText: {
    color: '#090D16',
    fontSize: 14,
    fontWeight: '900',
  },
  optionAnswerText: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '800',
  },
  optionStatusIcon: {
    fontSize: 18,
  },
  optionErasedSlot: {
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  optionErasedText: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 12,
    fontWeight: '700',
    fontStyle: 'italic',
  },
  explanationCard: {
    marginTop: 16,
    backgroundColor: 'rgba(9, 13, 22, 0.9)',
    borderRadius: 18,
    padding: 15,
    borderWidth: 1.5,
  },
  explanationHeadline: {
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 6,
  },
  explanationFact: {
    color: '#E2E8F0',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
  },
  nextRungBtn: {
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
  },
  nextRungBtnText: {
    color: '#090D16',
    fontSize: 14,
    fontWeight: '900',
  },
  wrongActionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  reviveAdBtn: {
    flex: 2,
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  reviveAdBtnText: {
    color: '#04130D',
    fontSize: 12.5,
    fontWeight: '900',
  },
  acceptFlunkBtn: {
    flex: 1,
    backgroundColor: 'rgba(244, 63, 94, 0.2)',
    borderWidth: 1,
    borderColor: '#F43F5E',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  acceptFlunkBtnText: {
    color: '#FDA4AF',
    fontSize: 12,
    fontWeight: '800',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(4, 7, 20, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },
  modalCard: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#0F172A',
    borderRadius: 26,
    padding: 22,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
  },
  modalTopEmoji: {
    fontSize: 42,
    marginBottom: 8,
  },
  modalTitle: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 6,
  },
  modalSub: {
    color: '#CBD5E1',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 14,
  },
  pledgeCertificateBox: {
    width: '100%',
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 15,
    borderWidth: 1.5,
    borderColor: '#F43F5E',
    marginBottom: 14,
    alignItems: 'center',
  },
  pledgeHeader: {
    color: '#FDA4AF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 6,
  },
  pledgeQuote: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 12,
  },
  signPledgeBtn: {
    backgroundColor: '#F43F5E',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  signPledgeBtnText: {
    color: '#FFF',
    fontSize: 12.5,
    fontWeight: '900',
  },
  modalRevivePrimaryBtn: {
    width: '100%',
    backgroundColor: '#F59E0B',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  modalRevivePrimaryText: {
    color: '#090D16',
    fontSize: 13.5,
    fontWeight: '900',
  },
  modalBottomRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 8,
  },
  shareCertBtn: {
    flex: 1,
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    borderWidth: 1,
    borderColor: '#38BDF8',
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
  },
  shareCertBtnText: {
    color: '#7DD3FC',
    fontSize: 12,
    fontWeight: '800',
  },
  restartGameBtn: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
  },
  restartGameBtnText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '800',
  },
  vipBundleOptionBtn: {
    width: '100%',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#38BDF8',
  },
  vipBundleOptionTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 6,
  },
  vipBundleOptionDesc: {
    color: '#CBD5E1',
    fontSize: 12,
    lineHeight: 18,
  },
  ladderModalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: 4,
  },
  ladderModalRungNum: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '800',
    width: 55,
  },
  ladderModalGrade: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '700',
  },
  ladderModalPrize: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '900',
  },
});
