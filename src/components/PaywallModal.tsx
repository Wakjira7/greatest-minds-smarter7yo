import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  getTotalAvailableReplies,
  isProSubscriber,
  PRICING_TIERS,
} from '../services/monetization';
import {
  MonetizationState,
  Persona,
  PersonaBundleGroup,
  SubscriptionPlan,
} from '../types/chat';

interface PaywallModalProps {
  visible: boolean;
  state: MonetizationState;
  targetPersona?: Persona | null;
  reasonBanner?: string | null;
  onClose: () => void;
  onSelectSubscription: (plan: SubscriptionPlan) => void;
  onPurchaseCoins: (coins: number) => void;
  onWatchRewardedAd: (unlockPersonaId?: string) => void;
  onPurchaseBundle: (bundle: PersonaBundleGroup) => void;
  onResetToFree: () => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  visible,
  state,
  targetPersona,
  reasonBanner,
  onClose,
  onSelectSubscription,
  onPurchaseCoins,
  onWatchRewardedAd,
  onPurchaseBundle,
  onResetToFree,
}) => {
  const [adPlayingSeconds, setAdPlayingSeconds] = useState<number | null>(null);
  const isPro = isProSubscriber(state);
  const totalReplies = getTotalAvailableReplies(state);

  useEffect(() => {
    if (adPlayingSeconds === null) return;
    if (adPlayingSeconds <= 0) {
      setAdPlayingSeconds(null);
      onWatchRewardedAd(targetPersona?.id);
      return;
    }
    const timer = setTimeout(() => {
      setAdPlayingSeconds((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearTimeout(timer);
  }, [adPlayingSeconds, onWatchRewardedAd, targetPersona]);

  const startRewardedVideoAd = () => {
    setAdPlayingSeconds(5); // 5-second interactive preview of a 30s AdMob Rewarded Video
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          {/* Top Bar */}
          <View style={styles.topRow}>
            <View>
              <Text style={styles.headerBadge}>
                💎 PERSONA ADVISOR VIP & STORE
              </Text>
              <Text style={styles.headerTitle}>
                {targetPersona
                  ? `Unlock ${targetPersona.name}`
                  : 'Unlock Unlimited Wisdom & Coins'}
              </Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Current Status Summary */}
            <View style={styles.walletSummary}>
              <Text style={styles.walletText}>
                Plan:{' '}
                <Text style={styles.walletHighlight}>
                  {state.plan === 'pro_lifetime_399'
                    ? 'PRO Unlock One-Time ($3.99 • Ad-Free + Export)'
                    : state.plan === 'pro_monthly'
                    ? 'PRO Monthly ($6.99/mo)'
                    : state.plan === 'pro_weekly'
                    ? 'PRO Weekly ($2.99/wk)'
                    : 'Free Starter (3 msgs/day • Flash-Lite)'}
                </Text>
              </Text>
              <Text style={styles.walletText}>
                Available Replies:{' '}
                <Text style={styles.walletHighlight}>{totalReplies}</Text> •
                Coins:{' '}
                <Text style={styles.walletHighlight}>
                  🪙 {state.coinBalance}
                </Text>
              </Text>
            </View>

            {reasonBanner && (
              <View style={styles.reasonAlert}>
                <Text style={styles.reasonAlertText}>{reasonBanner}</Text>
              </View>
            )}

            {/* WAY 3: Google AdMob Rewarded Video Ad (Watch 1 Ad -> Unlock 5 Replies) */}
            <View style={styles.sectionCardAd}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTagAd}>
                  FREE OPTION • ADMOB REWARDED VIDEO
                </Text>
                <Text style={styles.eCpmNote}>+5 Replies Instant</Text>
              </View>
              <Text style={styles.cardTitle}>
                🎬 Watch a 30-Second Video to Unlock 5 Replies
              </Text>
              <Text style={styles.cardSubtitle}>
                {targetPersona
                  ? `Unlocks ${targetPersona.name} (${targetPersona.avatarEmoji}) for today + adds 5 bonus replies immediately.`
                  : 'Out of daily messages? Watch one short sponsor video to unlock 5 extra AI replies for free.'}
              </Text>

              <Pressable
                disabled={adPlayingSeconds !== null}
                onPress={startRewardedVideoAd}
                style={[
                  styles.adButton,
                  adPlayingSeconds !== null && styles.adButtonPlaying,
                ]}
              >
                <Text style={styles.adButtonText}>
                  {adPlayingSeconds !== null
                    ? `📺 Playing AdMob Rewarded Video... (${adPlayingSeconds}s)`
                    : `▶ Watch Video Ad → Get +5 Replies${
                        targetPersona ? ` & Unlock ${targetPersona.name}` : ''
                      }`}
                </Text>
              </Pressable>
            </View>

            {/* WAY 1: Hybrid One-Time Unlock ($3.99) + Freemium Pro Subscriptions ($6.99/mo & $2.99/wk) */}
            <Text style={styles.sectionHeading}>
              1. ONE-TIME PRO UNLOCK ($3.99) OR VIP SUBSCRIPTIONS
            </Text>

            <View style={styles.subGrid}>
              {/* One-Time $3.99 Pro Unlock (2026 Hybrid Monetization Sweet Spot) */}
              <Pressable
                onPress={() => onSelectSubscription('pro_lifetime_399')}
                style={[
                  styles.subCard,
                  styles.subCardFeatured,
                  state.plan === 'pro_lifetime_399' && styles.subCardActive,
                ]}
              >
                <View style={styles.badgeRow}>
                  <Text style={styles.popularBadge}>
                    {PRICING_TIERS.proLifetime399.badge}
                  </Text>
                  <Text style={styles.priceText}>
                    {PRICING_TIERS.proLifetime399.price}
                  </Text>
                </View>
                <Text style={styles.subTitle}>
                  🛡️ {PRICING_TIERS.proLifetime399.title}
                </Text>
                <Text style={styles.subDesc}>
                  {PRICING_TIERS.proLifetime399.subtitle}
                </Text>
                <View style={styles.ctaGold}>
                  <Text style={styles.ctaGoldText}>
                    {state.plan === 'pro_lifetime_399'
                      ? '✓ Ad-Free + Export Unlocked Forever'
                      : 'Unlock Forever ($3.99 One-Time • +30 🪙)'}
                  </Text>
                </View>
              </Pressable>

              {/* Monthly $6.99 */}
              <Pressable
                onPress={() => onSelectSubscription('pro_monthly')}
                style={[
                  styles.subCard,
                  state.plan === 'pro_monthly' && styles.subCardActive,
                ]}
              >
                <View style={styles.badgeRow}>
                  <Text style={styles.popularBadge}>
                    {PRICING_TIERS.proMonthly.badge}
                  </Text>
                  <Text style={styles.priceText}>
                    {PRICING_TIERS.proMonthly.price}
                  </Text>
                </View>
                <Text style={styles.subTitle}>
                  {PRICING_TIERS.proMonthly.title}
                </Text>
                <Text style={styles.subDesc}>
                  {PRICING_TIERS.proMonthly.subtitle}
                </Text>
                <View style={styles.ctaOutline}>
                  <Text style={styles.ctaOutlineText}>
                    {state.plan === 'pro_monthly'
                      ? '✓ Active Plan'
                      : 'Start Pro Monthly ($6.99/mo)'}
                  </Text>
                </View>
              </Pressable>

              {/* Weekly $2.99 */}
              <Pressable
                onPress={() => onSelectSubscription('pro_weekly')}
                style={[
                  styles.subCard,
                  state.plan === 'pro_weekly' && styles.subCardActive,
                ]}
              >
                <View style={styles.badgeRow}>
                  <Text style={styles.flexibleBadge}>
                    {PRICING_TIERS.proWeekly.badge}
                  </Text>
                  <Text style={styles.priceText}>
                    {PRICING_TIERS.proWeekly.price}
                  </Text>
                </View>
                <Text style={styles.subTitle}>
                  {PRICING_TIERS.proWeekly.title}
                </Text>
                <Text style={styles.subDesc}>
                  {PRICING_TIERS.proWeekly.subtitle}
                </Text>
                <View style={styles.ctaOutline}>
                  <Text style={styles.ctaOutlineText}>
                    {state.plan === 'pro_weekly'
                      ? '✓ Active Plan'
                      : 'Start Weekly Pass ($2.99/wk)'}
                  </Text>
                </View>
              </Pressable>
            </View>

            {/* WAY 2: Consumable Persona Coin Message Packs */}
            <Text style={styles.sectionHeading}>
              2. CONSUMABLE “PERSONA COIN” MESSAGE PACKS (NO EXPIRATION)
            </Text>

            <View style={styles.coinRow}>
              <Pressable
                onPress={() => onPurchaseCoins(100)}
                style={styles.coinCard}
              >
                <Text style={styles.coinEmoji}>🪙 100 Replies</Text>
                <Text style={styles.coinTitle}>Starter Pack</Text>
                <Text style={styles.coinDesc}>
                  Unlocks all 10 personas + Gemini 4 Argon deep replies
                </Text>
                <View style={styles.coinBuyBtn}>
                  <Text style={styles.coinBuyText}>Buy for $2.99</Text>
                </View>
              </Pressable>

              <Pressable
                onPress={() => onPurchaseCoins(500)}
                style={[styles.coinCard, styles.coinCardBest]}
              >
                <Text style={styles.coinEmoji}>💰 500 Replies</Text>
                <Text style={styles.coinTitle}>Problem-Solver Pack</Text>
                <Text style={styles.coinDesc}>
                  Best value • 500 Gemini 4 Argon replies across all advisors
                </Text>
                <View style={[styles.coinBuyBtn, styles.coinBuyBtnBest]}>
                  <Text style={styles.coinBuyTextBest}>Buy for $9.99</Text>
                </View>
              </Pressable>
            </View>

            {/* WAY 4: One-Time VIP Persona Bundles ($9.99) */}
            <Text style={styles.sectionHeading}>
              3. ONE-TIME “VIP PERSONA BUNDLES” ($9.99 + 25 BONUS COINS)
            </Text>

            {(
              [
                {
                  group: 'Ancient Philosophers Pack' as PersonaBundleGroup,
                  emoji: '🏛️',
                  members:
                    'Marcus Aurelius, Cleopatra VII, Socrates, Sun Tzu, Monk Kaito Zen',
                },
                {
                  group:
                    'Billionaire & Genius Mentors Pack' as PersonaBundleGroup,
                  emoji: '🚀',
                  members:
                    'Chef Gordon Blaze, Albert Einstein, Nikola Tesla, Elon Nova, Detective Vance',
                },
              ] as const
            ).map((b) => {
              const owned = state.unlockedBundles.includes(b.group);
              return (
                <View key={b.group} style={styles.bundleCard}>
                  <View style={styles.bundleInfo}>
                    <Text style={styles.bundleTitle}>
                      {b.emoji} {b.group}
                    </Text>
                    <Text style={styles.bundleMembers}>{b.members}</Text>
                  </View>
                  <Pressable
                    disabled={owned}
                    onPress={() => onPurchaseBundle(b.group)}
                    style={[
                      styles.bundleBtn,
                      owned && styles.bundleBtnOwned,
                    ]}
                  >
                    <Text style={styles.bundleBtnText}>
                      {owned ? '✓ Unlocked' : 'Unlock $9.99'}
                    </Text>
                  </Pressable>
                </View>
              );
            })}

            {/* Developer / Sandbox Reset Toggle */}
            {(isPro ||
              state.coinBalance > 0 ||
              state.rewardedBonusMessages > 0 ||
              state.unlockedBundles.length > 0) && (
              <Pressable onPress={onResetToFree} style={styles.resetSandboxBtn}>
                <Text style={styles.resetSandboxText}>
                  🔄 Reset to Free Starter Tier (Test Sandbox)
                </Text>
              </Pressable>
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
    backgroundColor: 'rgba(2, 6, 23, 0.84)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#0B1120',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.25)',
    maxHeight: '90%',
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.15)',
  },
  headerBadge: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.7,
    marginBottom: 2,
  },
  headerTitle: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '800',
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(148, 163, 184, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: '#E2E8F0',
    fontSize: 15,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 34,
  },
  walletSummary: {
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.18)',
    marginBottom: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 6,
  },
  walletText: {
    color: '#94A3B8',
    fontSize: 12.5,
  },
  walletHighlight: {
    color: '#F8FAFC',
    fontWeight: '700',
  },
  reasonAlert: {
    backgroundColor: 'rgba(245, 158, 11, 0.14)',
    borderColor: 'rgba(245, 158, 11, 0.40)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  reasonAlertText: {
    color: '#FDE68A',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  sectionCardAd: {
    backgroundColor: 'rgba(16, 185, 129, 0.10)',
    borderColor: 'rgba(16, 185, 129, 0.40)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 15,
    marginBottom: 18,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionTagAd: {
    color: '#34D399',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  eCpmNote: {
    color: '#A7F3D0',
    fontSize: 11,
    fontWeight: '700',
  },
  cardTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  cardSubtitle: {
    color: '#CBD5E1',
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 12,
  },
  adButton: {
    backgroundColor: '#10B981',
    borderRadius: 11,
    paddingVertical: 11,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  adButtonPlaying: {
    backgroundColor: '#059669',
  },
  adButtonText: {
    color: '#090D16',
    fontSize: 13.5,
    fontWeight: '800',
  },
  sectionHeading: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.7,
    marginBottom: 10,
    marginTop: 4,
  },
  subGrid: {
    gap: 12,
    marginBottom: 18,
  },
  subCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.22)',
    padding: 15,
  },
  subCardFeatured: {
    borderColor: '#F59E0B',
    backgroundColor: 'rgba(245, 158, 11, 0.07)',
  },
  subCardActive: {
    borderColor: '#10B981',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  popularBadge: {
    backgroundColor: '#F59E0B',
    color: '#090D16',
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  flexibleBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.16)',
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  priceText: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '800',
  },
  subTitle: {
    color: '#F8FAFC',
    fontSize: 15.5,
    fontWeight: '700',
    marginBottom: 4,
  },
  subDesc: {
    color: '#94A3B8',
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 12,
  },
  ctaGold: {
    backgroundColor: '#F59E0B',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  ctaGoldText: {
    color: '#090D16',
    fontSize: 13.5,
    fontWeight: '800',
  },
  ctaOutline: {
    backgroundColor: 'rgba(56, 189, 248, 0.14)',
    borderColor: 'rgba(56, 189, 248, 0.4)',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  ctaOutlineText: {
    color: '#7DD3FC',
    fontSize: 13.5,
    fontWeight: '800',
  },
  coinRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  coinCard: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.22)',
    padding: 13,
    justifyContent: 'space-between',
  },
  coinCardBest: {
    borderColor: '#A855F7',
    backgroundColor: 'rgba(168, 85, 247, 0.08)',
  },
  coinEmoji: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  coinTitle: {
    color: '#E2E8F0',
    fontSize: 13.5,
    fontWeight: '700',
    marginBottom: 4,
  },
  coinDesc: {
    color: '#94A3B8',
    fontSize: 11.5,
    lineHeight: 16,
    marginBottom: 12,
  },
  coinBuyBtn: {
    backgroundColor: 'rgba(148, 163, 184, 0.18)',
    borderRadius: 9,
    paddingVertical: 8,
    alignItems: 'center',
  },
  coinBuyBtnBest: {
    backgroundColor: '#A855F7',
  },
  coinBuyText: {
    color: '#F8FAFC',
    fontSize: 12.5,
    fontWeight: '700',
  },
  coinBuyTextBest: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  bundleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111827',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.20)',
    padding: 13,
    marginBottom: 10,
    gap: 10,
  },
  bundleInfo: {
    flex: 1,
  },
  bundleTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 3,
  },
  bundleMembers: {
    color: '#94A3B8',
    fontSize: 11.5,
    lineHeight: 16,
  },
  bundleBtn: {
    backgroundColor: '#38BDF8',
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 10,
  },
  bundleBtnOwned: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  bundleBtnText: {
    color: '#090D16',
    fontSize: 12,
    fontWeight: '800',
  },
  resetSandboxBtn: {
    marginTop: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  resetSandboxText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
  },
});
