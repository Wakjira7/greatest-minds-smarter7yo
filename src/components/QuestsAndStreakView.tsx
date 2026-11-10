import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  getUserWisdomLevel,
  STREAK_LADDER_REWARDS,
} from '../services/monetization';
import { PersonaChatSummary } from '../services/storage';
import { MonetizationState } from '../types/chat';

interface QuestsAndStreakViewProps {
  state: MonetizationState;
  summaries: Record<string, PersonaChatSummary>;
  onClaimStreak: (forceDemoNextDay?: boolean) => void;
  onClaimQuest: (
    questId: string,
    questTitle: string,
    rewardCoins: number,
    rewardXp: number
  ) => void;
  onClaimReferral: () => void;
  onWatchRewardedAd: () => void;
  onOpenStore: () => void;
}

export const QuestsAndStreakView: React.FC<QuestsAndStreakViewProps> = ({
  state,
  summaries,
  onClaimStreak,
  onClaimQuest,
  onClaimReferral,
  onWatchRewardedAd,
  onOpenStore,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const levelInfo = getUserWisdomLevel(state.xpPoints);
  const today = new Date().toISOString().slice(0, 10);
  const alreadyClaimedToday = state.lastStreakClaimDate === today;

  // Compute real progress for Cashloop Quests
  const activeAdvisorsChatted = Object.values(summaries).filter(
    (s) => s.messageCount > 0
  ).length;
  const totalUserMessagesSent = Object.values(summaries).reduce(
    (acc, s) => acc + s.messageCount,
    0
  );
  const adWatchesCount = state.transactions.filter((t) =>
    t.title.includes('AdMob Rewarded')
  ).length;
  const actionPlansCount = state.unlockedActionPlanPersonaIds.length;

  const quests = [
    {
      id: 'quest_first_consult',
      title: 'First Counsel Session',
      subtitle: 'Send at least 1 problem message to any 3D Advisor',
      current: Math.min(1, totalUserMessagesSent),
      target: 1,
      rewardCoins: 5,
      rewardXp: 40,
      badge: 'DAILY',
    },
    {
      id: 'quest_watch_video',
      title: 'Support via Rewarded Video',
      subtitle: 'Watch 1 short 30s AdMob video to earn bonus replies & coins',
      current: Math.min(1, adWatchesCount),
      target: 1,
      rewardCoins: 4,
      rewardXp: 35,
      badge: 'DAILY',
    },
    {
      id: 'quest_council_of_3',
      title: 'Council of 3 Minds',
      subtitle: 'Consult 3 different 3D Personalities about your goals',
      current: Math.min(3, activeAdvisorsChatted),
      target: 3,
      rewardCoins: 10,
      rewardXp: 80,
      badge: 'MILESTONE',
    },
    {
      id: 'quest_action_plan',
      title: 'Blueprint Architect',
      subtitle: 'Unlock or generate 1 Custom Life Action Plan in a chat',
      current: Math.min(1, actionPlansCount),
      target: 1,
      rewardCoins: 8,
      rewardXp: 60,
      badge: 'ONE-TIME',
    },
  ];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3200);
  };

  return (
    <View style={styles.container}>
      {toastMsg && (
        <View style={styles.toastBar}>
          <Text style={styles.toastText}>✨ {toastMsg}</Text>
        </View>
      )}

      {/* 1. CASHLOOP v3.0 FeedLevelCard.kt — Wisdom Level, XP Bar & Wallet Summary */}
      <View style={styles.levelCard}>
        <View style={styles.levelTopRow}>
          <View style={styles.levelBadgeBox}>
            <Text style={styles.levelEmoji}>{levelInfo.badgeEmoji}</Text>
            <View>
              <Text style={styles.levelSuper}>
                CASHLOOP PROGRESSION • LEVEL {levelInfo.level}
              </Text>
              <Text style={styles.levelTitle}>{levelInfo.title}</Text>
            </View>
          </View>

          <View style={styles.coinWalletPill}>
            <Text style={styles.coinWalletLabel}>BALANCE</Text>
            <Text style={styles.coinWalletValue}>🪙 {state.coinBalance} Coins</Text>
          </View>
        </View>

        {/* XP Progress Bar */}
        <View style={styles.xpBarHeader}>
          <Text style={styles.xpText}>
            Wisdom XP: {levelInfo.currentXp} / {levelInfo.nextLevelXp} XP
          </Text>
          <Text style={styles.xpPercentText}>{levelInfo.progressPercent}%</Text>
        </View>
        <View style={styles.xpTrack}>
          <View
            style={[
              styles.xpFill,
              { width: `${Math.max(6, levelInfo.progressPercent)}%` },
            ]}
          />
        </View>
      </View>

      {/* 2. SNAPREELS v1.1.9 RewardsScreen.kt & CASHLOOP StreakBoard — 7-Day Check-In Grid */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionEyebrow}>
              🔥 SNAPREELS & CASHLOOP 7-DAY STREAK LADDER
            </Text>
            <Text style={styles.sectionTitle}>Daily Check-In Coin Rewards</Text>
          </View>
          <View style={styles.streakDayBadge}>
            <Text style={styles.streakDayBadgeText}>
              Day {state.streakDay} / 7
            </Text>
          </View>
        </View>

        <View style={styles.streakGrid}>
          {STREAK_LADDER_REWARDS.map((rung) => {
            const isCurrent = rung.day === state.streakDay;
            const isPast = rung.day < state.streakDay;
            return (
              <View
                key={rung.day}
                style={[
                  styles.streakCell,
                  rung.isMilestone && styles.streakCellMilestone,
                  isCurrent && styles.streakCellCurrent,
                  isPast && styles.streakCellCompleted,
                ]}
              >
                <Text
                  style={[
                    styles.streakCellDay,
                    isCurrent && { color: '#FBBF24' },
                  ]}
                >
                  {rung.label}
                </Text>
                <Text style={styles.streakCellIcon}>
                  {isPast ? '✅' : rung.isMilestone ? '🎁' : '🪙'}
                </Text>
                <Text style={styles.streakCellCoins}>+{rung.coins} Coins</Text>
                <Text style={styles.streakCellXp}>+{rung.xp} XP</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.streakActionsRow}>
          <Pressable
            onPress={() => {
              onClaimStreak(false);
              showToast('Daily Streak Reward Claimed!');
            }}
            disabled={alreadyClaimedToday}
            style={[
              styles.claimStreakBtn,
              alreadyClaimedToday && styles.claimStreakBtnDisabled,
            ]}
          >
            <Text
              style={[
                styles.claimStreakBtnText,
                alreadyClaimedToday && { color: '#94A3B8' },
              ]}
            >
              {alreadyClaimedToday
                ? '✓ Today’s Check-In Claimed'
                : `🔥 Claim Day ${state.streakDay} Reward (+${
                    STREAK_LADDER_REWARDS[state.streakDay - 1]?.coins ?? 3
                  } Coins)`}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              onClaimStreak(true);
              showToast('Simulated Next Day Streak Check-In!');
            }}
            style={styles.simulateNextDayBtn}
          >
            <Text style={styles.simulateNextDayText}>⏩ Test Next Day</Text>
          </Pressable>
        </View>
      </View>

      {/* 3. CASHLOOP v3.0 QuestsScreen.kt — Interactive Quests Board */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionEyebrow}>
          🎯 CASHLOOP ENGAGEMENT ENGINE (QuestsScreen.kt)
        </Text>
        <Text style={styles.sectionTitle}>Daily & Milestone Quests</Text>
        <Text style={styles.sectionSubtitle}>
          Complete advisor tasks to earn free Persona Coins (Gemini 4 Argon replies) and level up your Wisdom rank.
        </Text>

        {quests.map((quest) => {
          const isClaimed = state.claimedQuestIds.includes(quest.id);
          const isCompleted = quest.current >= quest.target;
          const pct = Math.min(100, Math.round((quest.current / quest.target) * 100));

          return (
            <View key={quest.id} style={styles.questRow}>
              <View style={styles.questMain}>
                <View style={styles.questTitleRow}>
                  <View style={styles.questTypeBadge}>
                    <Text style={styles.questTypeBadgeText}>{quest.badge}</Text>
                  </View>
                  <Text style={styles.questTitle}>{quest.title}</Text>
                </View>
                <Text style={styles.questSubtitle}>{quest.subtitle}</Text>

                {/* Progress Bar */}
                <View style={styles.questProgressRow}>
                  <View style={styles.questTrack}>
                    <View
                      style={[styles.questFill, { width: `${Math.max(8, pct)}%` }]}
                    />
                  </View>
                  <Text style={styles.questProgressLabel}>
                    {quest.current}/{quest.target}
                  </Text>
                </View>
              </View>

              <View style={styles.questRightCol}>
                <Text style={styles.questRewardText}>
                  +{quest.rewardCoins} 🪙
                </Text>
                <Text style={styles.questXpText}>+{quest.rewardXp} XP</Text>

                {isClaimed ? (
                  <View style={styles.questClaimedChip}>
                    <Text style={styles.questClaimedText}>✓ Claimed</Text>
                  </View>
                ) : isCompleted ? (
                  <Pressable
                    onPress={() => {
                      onClaimQuest(
                        quest.id,
                        quest.title,
                        quest.rewardCoins,
                        quest.rewardXp
                      );
                      showToast(
                        `Claimed +${quest.rewardCoins} Coins & +${quest.rewardXp} XP!`
                      );
                    }}
                    style={styles.questClaimBtn}
                  >
                    <Text style={styles.questClaimBtnText}>Claim</Text>
                  </Pressable>
                ) : quest.id === 'quest_watch_video' ? (
                  <Pressable
                    onPress={onWatchRewardedAd}
                    style={styles.questGoBtn}
                  >
                    <Text style={styles.questGoBtnText}>🎬 Watch Ad</Text>
                  </Pressable>
                ) : (
                  <View style={styles.questLockedChip}>
                    <Text style={styles.questLockedText}>In Progress</Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </View>

      {/* 4. DTPOCKETFM v1.6 referandearn.dart & SNAPREELS Referral Card */}
      <View style={styles.referralCard}>
        <View style={styles.referralTopRow}>
          <View style={styles.referralTextCol}>
            <Text style={styles.referralEyebrow}>
              🤝 DTPOCKETFM REFER & EARN MODULE
            </Text>
            <Text style={styles.referralTitle}>
              Invite Friends • Get +10 Free Persona Coins
            </Text>
            <Text style={styles.referralSubtitle}>
              Share your VIP code with friends. When they consult their first 3D Advisor, you both get 10 Gemini 4 Argon replies free.
            </Text>
          </View>
        </View>

        <View style={styles.referralCodeBox}>
          <View>
            <Text style={styles.referralCodeLabel}>YOUR INVITE CODE</Text>
            <Text style={styles.referralCodeValue}>ADVISOR-VIP-2026</Text>
          </View>

          <Pressable
            onPress={() => {
              setCopiedCode(true);
              onClaimReferral();
              showToast(
                state.referralClaimed
                  ? 'Invite code copied to clipboard!'
                  : 'Invite code copied! +10 Referral Bonus Coins added!'
              );
            }}
            style={styles.referralClaimBtn}
          >
            <Text style={styles.referralClaimBtnText}>
              {state.referralClaimed
                ? copiedCode
                  ? '✓ Code Copied'
                  : '📋 Copy Code'
                : '🎁 Copy & Claim +10 🪙'}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* 5. SNAPREELS v1.1.9 TopUpScreen.kt — Coin & Reply Transaction History Ledger */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionEyebrow}>
              📜 SNAPREELS WALLET LEDGER (TopUpScreen.kt)
            </Text>
            <Text style={styles.sectionTitle}>Recent Coin & Quota Activity</Text>
          </View>
          <Pressable onPress={onOpenStore} style={styles.topUpShortcutBtn}>
            <Text style={styles.topUpShortcutText}>+ Top Up Coins</Text>
          </Pressable>
        </View>

        {state.transactions.slice(0, 8).map((tx) => {
          const isPositive = tx.type === 'earn' || tx.type === 'purchase';
          return (
            <View key={tx.id} style={styles.txRow}>
              <View style={styles.txLeft}>
                <Text style={styles.txIcon}>
                  {tx.type === 'purchase'
                    ? '💎'
                    : tx.type === 'earn'
                    ? '🎁'
                    : '💬'}
                </Text>
                <View>
                  <Text style={styles.txTitle}>{tx.title}</Text>
                  <Text style={styles.txTime}>
                    {new Date(tx.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.txAmount,
                  isPositive ? styles.txAmountPositive : styles.txAmountSpend,
                ]}
              >
                {tx.amountText}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 14,
    marginBottom: 16,
  },
  toastBar: {
    backgroundColor: 'rgba(16, 185, 129, 0.18)',
    borderColor: 'rgba(16, 185, 129, 0.45)',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  toastText: {
    color: '#6EE7B7',
    fontSize: 12.5,
    fontWeight: '800',
    textAlign: 'center',
  },
  levelCard: {
    backgroundColor: '#111827',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(245, 158, 11, 0.40)',
    padding: 16,
  },
  levelTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  levelBadgeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  levelEmoji: {
    fontSize: 32,
  },
  levelSuper: {
    color: '#FBBF24',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  levelTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '900',
  },
  coinWalletPill: {
    backgroundColor: 'rgba(245, 158, 11, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'flex-end',
  },
  coinWalletLabel: {
    color: '#FDE68A',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  coinWalletValue: {
    color: '#FBBF24',
    fontSize: 15,
    fontWeight: '900',
  },
  xpBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  xpText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '700',
  },
  xpPercentText: {
    color: '#FBBF24',
    fontSize: 12,
    fontWeight: '800',
  },
  xpTrack: {
    height: 9,
    backgroundColor: '#090D16',
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.18)',
  },
  xpFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 999,
  },
  sectionCard: {
    backgroundColor: '#111827',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.20)',
    padding: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  sectionEyebrow: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.7,
    marginBottom: 2,
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: '#94A3B8',
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: 4,
    marginBottom: 12,
  },
  streakDayBadge: {
    backgroundColor: 'rgba(244, 36, 82, 0.16)',
    borderColor: 'rgba(244, 36, 82, 0.45)',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  streakDayBadgeText: {
    color: '#FB7185',
    fontSize: 11,
    fontWeight: '800',
  },
  streakGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  streakCell: {
    flexGrow: 1,
    minWidth: 78,
    backgroundColor: '#090D16',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  streakCellMilestone: {
    minWidth: 130,
    backgroundColor: 'rgba(245, 158, 11, 0.10)',
    borderColor: 'rgba(245, 158, 11, 0.45)',
  },
  streakCellCurrent: {
    borderColor: '#F59E0B',
    borderWidth: 2,
    backgroundColor: 'rgba(245, 158, 11, 0.14)',
  },
  streakCellCompleted: {
    borderColor: 'rgba(16, 185, 129, 0.45)',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  streakCellDay: {
    color: '#94A3B8',
    fontSize: 10.5,
    fontWeight: '800',
    marginBottom: 4,
  },
  streakCellIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  streakCellCoins: {
    color: '#F8FAFC',
    fontSize: 11.5,
    fontWeight: '800',
  },
  streakCellXp: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '700',
  },
  streakActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  claimStreakBtn: {
    flex: 1,
    minWidth: 200,
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  claimStreakBtnDisabled: {
    backgroundColor: '#1E293B',
  },
  claimStreakBtnText: {
    color: '#090D16',
    fontSize: 13,
    fontWeight: '900',
  },
  simulateNextDayBtn: {
    backgroundColor: 'rgba(56, 189, 248, 0.14)',
    borderColor: 'rgba(56, 189, 248, 0.4)',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  simulateNextDayText: {
    color: '#7DD3FC',
    fontSize: 12,
    fontWeight: '800',
  },
  questRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#090D16',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.18)',
    padding: 12,
    marginBottom: 10,
    gap: 12,
  },
  questMain: {
    flex: 1,
  },
  questTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  questTypeBadge: {
    backgroundColor: 'rgba(168, 85, 247, 0.16)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  questTypeBadgeText: {
    color: '#D8B4FE',
    fontSize: 9,
    fontWeight: '800',
  },
  questTitle: {
    color: '#F8FAFC',
    fontSize: 13.5,
    fontWeight: '800',
  },
  questSubtitle: {
    color: '#94A3B8',
    fontSize: 11.5,
    lineHeight: 16,
    marginBottom: 8,
  },
  questProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  questTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#1E293B',
    borderRadius: 999,
    overflow: 'hidden',
  },
  questFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 999,
  },
  questProgressLabel: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '700',
  },
  questRightCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 86,
  },
  questRewardText: {
    color: '#FBBF24',
    fontSize: 13,
    fontWeight: '900',
  },
  questXpText: {
    color: '#64748B',
    fontSize: 10.5,
    fontWeight: '700',
    marginBottom: 6,
  },
  questClaimBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  questClaimBtnText: {
    color: '#090D16',
    fontSize: 11.5,
    fontWeight: '900',
  },
  questGoBtn: {
    backgroundColor: 'rgba(16, 185, 129, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.45)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  questGoBtnText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '800',
  },
  questClaimedChip: {
    backgroundColor: 'rgba(148, 163, 184, 0.12)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  questClaimedText: {
    color: '#94A3B8',
    fontSize: 10.5,
    fontWeight: '700',
  },
  questLockedChip: {
    backgroundColor: '#111827',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  questLockedText: {
    color: '#64748B',
    fontSize: 10.5,
    fontWeight: '700',
  },
  referralCard: {
    backgroundColor: 'rgba(168, 85, 247, 0.10)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.35)',
    padding: 16,
  },
  referralTopRow: {
    marginBottom: 12,
  },
  referralTextCol: {
    width: '100%',
  },
  referralEyebrow: {
    color: '#D8B4FE',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.7,
    marginBottom: 2,
  },
  referralTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  referralSubtitle: {
    color: '#CBD5E1',
    fontSize: 12,
    lineHeight: 17,
  },
  referralCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
    backgroundColor: '#090D16',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.4)',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  referralCodeLabel: {
    color: '#94A3B8',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  referralCodeValue: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
  },
  referralClaimBtn: {
    backgroundColor: '#A855F7',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  referralClaimBtnText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '800',
  },
  topUpShortcutBtn: {
    backgroundColor: 'rgba(245, 158, 11, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.45)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  topUpShortcutText: {
    color: '#FBBF24',
    fontSize: 11.5,
    fontWeight: '800',
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.12)',
  },
  txLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  txIcon: {
    fontSize: 18,
  },
  txTitle: {
    color: '#E2E8F0',
    fontSize: 12.5,
    fontWeight: '700',
  },
  txTime: {
    color: '#64748B',
    fontSize: 10.5,
  },
  txAmount: {
    fontSize: 12,
    fontWeight: '800',
  },
  txAmountPositive: {
    color: '#34D399',
  },
  txAmountSpend: {
    color: '#94A3B8',
  },
});
