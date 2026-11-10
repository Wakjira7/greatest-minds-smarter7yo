import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActionPlanModal } from '../../src/components/ActionPlanModal';
import { ApiCostDashboardModal } from '../../src/components/ApiCostDashboardModal';
import { Avatar3D } from '../../src/components/Avatar3D';
import { ChatBubble } from '../../src/components/ChatBubble';
import { DisclaimerBanner } from '../../src/components/DisclaimerBanner';
import { PaywallModal } from '../../src/components/PaywallModal';
import { ReportModal } from '../../src/components/ReportModal';
import { getPersonaById, PERSONAS } from '../../src/constants/personas';
import { GiftBottomSheet, GiftOption } from '../../src/components/GiftBottomSheet';
import {
  maybeShowInterstitial,
  preloadInterstitial,
  showRewardedAd,
} from '../../src/services/adsManager';
import {
  getApiConnectionStatus,
  sendPersonaChatMessage,
} from '../../src/services/chatService';
import {
  activateSubscriptionPlan,
  addPersonaCoins,
  consumeOneReplyAllowance,
  getActiveModelTierForState,
  getDefaultMonetizationState,
  getTotalAvailableReplies,
  grantRewardedVideoAdReward,
  loadMonetizationState,
  purchaseVipBundle,
  recordApiCallTelemetry,
  resetMonetizationToFree,
  unlockCustomActionPlan,
  sendGiftToPersona,
  updateApiSettings,
} from '../../src/services/monetization';
import {
  clearPersonaChatHistory,
  loadPersonaChatHistory,
  savePersonaChatHistory,
  submitMessageReport,
} from '../../src/services/storage';
import {
  ChatMessage,
  MonetizationState,
  PersonaBundleGroup,
  SubscriptionPlan,
} from '../../src/types/chat';

export default function ChatScreen() {
  const { id, q } = useLocalSearchParams<{ id: string; q?: string }>();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  const persona = getPersonaById(id ?? '') ?? PERSONAS[0];

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState(typeof q === 'string' ? q : '');
  const [isTyping, setIsTyping] = useState(false);
  const [showCatchphrases, setShowCatchphrases] = useState(false);
  const [reportingMessage, setReportingMessage] = useState<ChatMessage | null>(
    null
  );
  const [reportBannerText, setReportBannerText] = useState<string | null>(null);

  const [monetization, setMonetization] = useState<MonetizationState>(
    getDefaultMonetizationState()
  );
  const [paywallVisible, setPaywallVisible] = useState(false);
  const [paywallReason, setPaywallReason] = useState<string | null>(null);
  const [actionPlanVisible, setActionPlanVisible] = useState(false);
  const [apiDashboardVisible, setApiDashboardVisible] = useState(false);
  const [giftSheetVisible, setGiftSheetVisible] = useState(false);

  useEffect(() => {
    let active = true;
    preloadInterstitial(); // SnapReels VideoPlayerScreen: load on open, show on exit
    loadPersonaChatHistory(persona.id).then((loaded) => {
      if (active) setMessages(loaded);
    });
    loadMonetizationState().then((state) => {
      if (active) setMonetization(state);
    });
    return () => {
      active = false;
    };
  }, [persona.id]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 80);
  };

  /** SnapReels triggerBackWithAd: show a (frequency-capped) interstitial, then leave. */
  const handleBackWithAd = async () => {
    await maybeShowInterstitial({ isAdFree: monetization.plan !== 'free' });
    router.back();
  };

  /** Astroway gift flow: deduct coins, then the persona thanks you in-character. */
  const handleSendGift = async (gift: GiftOption): Promise<boolean> => {
    const res = await sendGiftToPersona(monetization, persona.name, gift.label, gift.coins);
    if (!res.ok) return false;
    setMonetization(res.updatedState);
    const thanks: ChatMessage = {
      id: `gift-${Date.now()}`,
      personaId: persona.id,
      role: 'assistant',
      content: `${gift.emoji} ${gift.reaction} **${persona.catchphrases[0]}**`,
      timestamp: Date.now(),
      isMock: true,
    };
    const updated = [...messages, thanks];
    setMessages(updated);
    await savePersonaChatHistory(persona.id, updated);
    scrollToBottom();
    return true;
  };

  const handleSendMessage = async (customText?: string) => {
    const trimmed = (customText ?? inputText).trim();
    if (!trimmed || isTyping) return;

    // Check daily message quota / rewarded ad bonus / Persona Coin balance
    const consumption = await consumeOneReplyAllowance(
      monetization,
      persona.name
    );
    if (!consumption.allowed) {
      setPaywallReason(
        'You have used all 3 free daily messages! Watch a 30-second video ad to unlock +5 replies immediately, buy a Persona Coin Pack, or upgrade to Pro ($6.99/mo).'
      );
      setPaywallVisible(true);
      return;
    }

    setMonetization(consumption.updatedState);

    if (!customText) {
      setInputText('');
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      personaId: persona.id,
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    };

    const updatedWithUser = [...messages, userMsg];
    setMessages(updatedWithUser);
    await savePersonaChatHistory(persona.id, updatedWithUser);
    scrollToBottom();

    setIsTyping(true);
    try {
      const modelTier = getActiveModelTierForState(consumption.updatedState);
      const response = await sendPersonaChatMessage(
        persona.id,
        trimmed,
        updatedWithUser,
        modelTier,
        consumption.updatedState.customGeminiApiKey
      );

      const inTok = response.inputTokens ?? 400;
      const outTok = response.outputTokens ?? 180;
      const msgCost = response.costUsd ?? 0.00036;

      const stateWithTelemetry = await recordApiCallTelemetry(
        consumption.updatedState,
        inTok,
        outTok,
        msgCost
      );
      setMonetization(stateWithTelemetry);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        personaId: persona.id,
        role: 'assistant',
        content: response.reply,
        timestamp: Date.now(),
        catchphraseUsed: response.catchphraseUsed,
        modelUsed: response.model,
        isMock: response.isMock,
        tokensUsed: inTok + outTok,
        costUsd: msgCost,
      };

      const finalMessages = [...updatedWithUser, aiMsg];
      setMessages(finalMessages);
      await savePersonaChatHistory(persona.id, finalMessages);
      scrollToBottom();
    } catch (err) {
      console.warn('Error generating persona response:', err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = async () => {
    const reset = await clearPersonaChatHistory(persona.id);
    setMessages(reset);
  };

  const handleReportSubmit = async (message: ChatMessage, reason: string) => {
    await submitMessageReport(message, reason);
    const updated = messages.map((m) =>
      m.id === message.id ? { ...m, reported: true, reportReason: reason } : m
    );
    setMessages(updated);
    await savePersonaChatHistory(persona.id, updated);
    setReportingMessage(null);
    setReportBannerText(
      'Thank you. This AI message has been flagged for safety review.'
    );
    setTimeout(() => setReportBannerText(null), 4000);
  };

  const handleSelectSubscription = async (plan: SubscriptionPlan) => {
    const next = await activateSubscriptionPlan(monetization, plan);
    setMonetization(next);
    setPaywallVisible(false);
  };

  const handlePurchaseCoins = async (coins: number) => {
    const next = await addPersonaCoins(monetization, coins);
    setMonetization(next);
    setPaywallVisible(false);
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
  };

  const handlePurchaseBundle = async (bundle: PersonaBundleGroup) => {
    const next = await purchaseVipBundle(monetization, bundle);
    setMonetization(next);
    setPaywallVisible(false);
  };

  const handleResetToFree = async () => {
    const next = await resetMonetizationToFree();
    setMonetization(next);
    setPaywallVisible(false);
  };

  const handleUnlockActionPlan = async () => {
    const next = await unlockCustomActionPlan(monetization, persona.id);
    setMonetization(next);
  };

  const totalRepliesRemaining = getTotalAvailableReplies(monetization);
  const activeTier = getActiveModelTierForState(monetization);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flexOne}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.maxWidthWrapper}>
          {/* Top Navigation & Persona Header */}
          <View style={styles.header}>
            <Pressable
              onPress={handleBackWithAd}
              accessibilityRole="button"
              accessibilityLabel="Back to Advisors"
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>← Advisors</Text>
            </Pressable>

            <View style={styles.personaHeaderCenter}>
              <View
                style={[
                  styles.headerAvatar,
                  {
                    backgroundColor: persona.accentBg,
                    borderColor: persona.accentBorder,
                  },
                ]}
              >
                <Avatar3D
                  personaId={persona.id}
                  accentColor={persona.accentColor}
                  size={34}
                  animated={false}
                />
              </View>
              <View style={styles.headerTextCol}>
                <Text style={styles.headerName} numberOfLines={1}>
                  {persona.name}
                </Text>
                <Text
                  style={[styles.headerSpecialty, { color: persona.accentColor }]}
                  numberOfLines={1}
                >
                  {activeTier === 'pro'
                    ? '💎 Gemini 4 Argon'
                    : '⚡ Gemini 3.1 Flash-Lite'}{' '}
                  • {totalRepliesRemaining} replies left
                </Text>
              </View>
            </View>

            <View style={styles.headerRightActions}>
              <Pressable
                onPress={() => setActionPlanVisible(true)}
                style={styles.actionPlanBtn}
              >
                <Text style={styles.actionPlanBtnText}>📄 Plan ($0.99)</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setPaywallReason(null);
                  setPaywallVisible(true);
                }}
                style={styles.coinsBtn}
              >
                <Text style={styles.coinsBtnText}>
                  🪙 {monetization.coinBalance}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setGiftSheetVisible(true)}
                accessibilityRole="button"
                accessibilityLabel={`Send a gift to ${persona.name}`}
                style={styles.phrasesToggleBtn}
              >
                <Text style={styles.phrasesToggleText}>🎁</Text>
              </Pressable>

              <Pressable
                onPress={() => setShowCatchphrases((prev) => !prev)}
                style={[
                  styles.phrasesToggleBtn,
                  showCatchphrases && {
                    borderColor: persona.accentColor,
                    backgroundColor: persona.accentBg,
                  },
                ]}
              >
                <Text style={styles.phrasesToggleText}>💬</Text>
              </Pressable>

              <Pressable
                onPress={handleClearChat}
                accessibilityRole="button"
                accessibilityLabel="Reset Conversation"
                style={styles.resetButton}
              >
                <Text style={styles.resetButtonText}>Reset</Text>
              </Pressable>
            </View>
          </View>

          {/* Astroway v6.1 Confidential Consultation & Live API Cost Meter Strip */}
          <View style={styles.confidentialStrip}>
            <Text style={styles.confidentialPillText}>
              🔒 100% Confidential
            </Text>
            <Text style={styles.confidentialDot}>•</Text>
            <Text style={styles.confidentialPillText}>
              🔊 Voice TTS Ready
            </Text>
            <Text style={styles.confidentialDot}>•</Text>
            <Pressable onPress={() => setApiDashboardVisible(true)}>
              <Text style={styles.confidentialXpText}>
                {getApiConnectionStatus(monetization.customGeminiApiKey).connected
                  ? '🟢 Live API'
                  : '🛡️ $0.00 Preview'}{' '}
                • Est. Cost: ${(monetization.totalEstimatedApiCostUsd || 0).toFixed(4)} (Tap)
              </Text>
            </Pressable>
          </View>

          {/* Compact Store Compliance Banner */}
          <DisclaimerBanner compact />

          {/* Expandable Signature Catchphrases Drawer */}
          {showCatchphrases && (
            <View
              style={[
                styles.catchphrasesDrawer,
                { borderColor: persona.accentBorder },
              ]}
            >
              <Text style={styles.drawerTitle}>
                {persona.name}’s 3 Signature Catchphrases:
              </Text>
              {persona.catchphrases.map((phrase, idx) => (
                <Text key={idx} style={styles.drawerPhraseItem}>
                  {idx + 1}. “{phrase}”
                </Text>
              ))}
            </View>
          )}

          {/* Report Confirmation Toast */}
          {reportBannerText && (
            <View style={styles.reportToast}>
              <Text style={styles.reportToastText}>✅ {reportBannerText}</Text>
            </View>
          )}

          {/* Chat Messages Scroll Area */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesScroll}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                message={message}
                persona={persona}
                onReportPress={(msg) => setReportingMessage(msg)}
              />
            ))}

            {/* Animated Typing Indicator */}
            {isTyping && (
              <View style={styles.typingRow}>
                <View
                  style={[
                    styles.typingAvatar,
                    {
                      backgroundColor: persona.accentBg,
                      borderColor: persona.accentBorder,
                    },
                  ]}
                >
                  <Text style={styles.typingEmoji}>{persona.avatarEmoji}</Text>
                </View>
                <View style={styles.typingBubble}>
                  <Text
                    style={[styles.typingText, { color: persona.accentColor }]}
                  >
                    {persona.name} is crafting advice...
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Out-of-Messages Quick AdMob Bar */}
          {totalRepliesRemaining === 0 && (
            <View style={styles.outOfRepliesBar}>
              <Text style={styles.outOfRepliesText}>
                0 daily replies left. Watch 1 video ad for +5 replies or Go Pro!
              </Text>
              <Pressable
                onPress={() => {
                  setPaywallReason(
                    'Out of daily messages! Watch a 30s video to unlock +5 replies or upgrade to Pro.'
                  );
                  setPaywallVisible(true);
                }}
                style={styles.outOfRepliesBtn}
              >
                <Text style={styles.outOfRepliesBtnText}>
                  🎬 Unlock +5 Replies
                </Text>
              </Pressable>
            </View>
          )}

          {/* Quick-Problem Starter Buttons */}
          <View style={styles.startersSection}>
            <Text style={styles.startersLabel}>QUICK-PROBLEM STARTERS:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.startersRow}
            >
              {persona.quickStarters.map((starter) => (
                <Pressable
                  key={starter}
                  disabled={isTyping}
                  onPress={() => handleSendMessage(starter)}
                  style={({ pressed }) => [
                    styles.starterChip,
                    { borderColor: persona.accentBorder },
                    pressed && { backgroundColor: persona.accentBg },
                  ]}
                >
                  <Text style={styles.starterChipText}>{starter}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Message Input Bar */}
          <View style={styles.inputBar}>
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder={`Tell ${persona.name} what problem you're facing...`}
              placeholderTextColor="#64748B"
              style={styles.textInput}
              multiline
              maxLength={600}
              onSubmitEditing={() => handleSendMessage()}
            />
            <Pressable
              disabled={!inputText.trim() || isTyping}
              onPress={() => handleSendMessage()}
              accessibilityRole="button"
              accessibilityLabel="Send Message"
              style={[
                styles.sendButton,
                {
                  backgroundColor:
                    inputText.trim() && !isTyping
                      ? persona.accentColor
                      : '#1E293B',
                },
              ]}
            >
              <Text
                style={[
                  styles.sendButtonText,
                  {
                    color:
                      inputText.trim() && !isTyping ? '#090D16' : '#64748B',
                  },
                ]}
              >
                Send ↑
              </Text>
            </Pressable>
          </View>
        </View>

        <ReportModal
          visible={Boolean(reportingMessage)}
          message={reportingMessage}
          onClose={() => setReportingMessage(null)}
          onSubmitReport={handleReportSubmit}
        />

        <PaywallModal
          visible={paywallVisible}
          state={monetization}
          targetPersona={persona}
          reasonBanner={paywallReason}
          onClose={() => {
            setPaywallVisible(false);
            setPaywallReason(null);
          }}
          onSelectSubscription={handleSelectSubscription}
          onPurchaseCoins={handlePurchaseCoins}
          onWatchRewardedAd={handleWatchRewardedAd}
          onPurchaseBundle={handlePurchaseBundle}
          onResetToFree={handleResetToFree}
        />

        <ActionPlanModal
          visible={actionPlanVisible}
          persona={persona}
          messages={messages}
          monetizationState={monetization}
          onClose={() => setActionPlanVisible(false)}
          onUnlockActionPlan={handleUnlockActionPlan}
        />

        <GiftBottomSheet
          visible={giftSheetVisible}
          personaName={persona.name}
          accentColor={persona.accentColor}
          coinBalance={monetization.coinBalance}
          onClose={() => setGiftSheetVisible(false)}
          onRecharge={() => {
            setGiftSheetVisible(false);
            setPaywallReason(null);
            setPaywallVisible(true);
          }}
          onSend={handleSendGift}
        />

        <ApiCostDashboardModal
          visible={apiDashboardVisible}
          onClose={() => setApiDashboardVisible(false)}
          monetization={monetization}
          onSaveSettings={async (settings) => {
            const next = await updateApiSettings(monetization, settings);
            setMonetization(next);
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  flexOne: {
    flex: 1,
  },
  maxWidthWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.16)',
    gap: 8,
  },
  backButton: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(148, 163, 184, 0.12)',
  },
  backButtonText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '700',
  },
  personaHeaderCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  confidentialStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    backgroundColor: '#0D1424',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(56, 189, 248, 0.20)',
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  confidentialPillText: {
    color: '#94A3B8',
    fontSize: 10.5,
    fontWeight: '700',
  },
  confidentialDot: {
    color: '#475569',
    fontSize: 10,
  },
  confidentialXpText: {
    color: '#FBBF24',
    fontSize: 10.5,
    fontWeight: '800',
  },
  headerTextCol: {
    flex: 1,
  },
  headerName: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '800',
  },
  headerSpecialty: {
    fontSize: 11,
    fontWeight: '600',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  actionPlanBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(168, 85, 247, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.40)',
  },
  actionPlanBtnText: {
    color: '#D8B4FE',
    fontSize: 11,
    fontWeight: '700',
  },
  coinsBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.40)',
  },
  coinsBtnText: {
    color: '#FDE68A',
    fontSize: 11,
    fontWeight: '800',
  },
  phrasesToggleBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.25)',
    backgroundColor: '#0B1120',
  },
  phrasesToggleText: {
    color: '#E2E8F0',
    fontSize: 11.5,
    fontWeight: '600',
  },
  resetButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.14)',
  },
  resetButtonText: {
    color: '#FCA5A5',
    fontSize: 11,
    fontWeight: '700',
  },
  catchphrasesDrawer: {
    backgroundColor: '#0B1120',
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  drawerTitle: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  drawerPhraseItem: {
    color: '#F1F5F9',
    fontSize: 12.5,
    fontStyle: 'italic',
    lineHeight: 19,
  },
  reportToast: {
    backgroundColor: 'rgba(16, 185, 129, 0.16)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(16, 185, 129, 0.35)',
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  reportToastText: {
    color: '#6EE7B7',
    fontSize: 12,
    fontWeight: '600',
  },
  messagesScroll: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 20,
  },
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  typingAvatar: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typingEmoji: {
    fontSize: 16,
  },
  typingBubble: {
    backgroundColor: '#111827',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.18)',
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  typingText: {
    fontSize: 12.5,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  outOfRepliesBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(245, 158, 11, 0.14)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(245, 158, 11, 0.35)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 10,
  },
  outOfRepliesText: {
    flex: 1,
    color: '#FDE68A',
    fontSize: 12,
    fontWeight: '600',
  },
  outOfRepliesBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 8,
  },
  outOfRepliesBtnText: {
    color: '#090D16',
    fontSize: 11.5,
    fontWeight: '800',
  },
  startersSection: {
    backgroundColor: '#0D1322',
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.14)',
    paddingTop: 8,
    paddingBottom: 8,
  },
  startersLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    paddingHorizontal: 14,
    marginBottom: 6,
  },
  startersRow: {
    paddingHorizontal: 14,
    gap: 8,
  },
  starterChip: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 7,
  },
  starterChipText: {
    color: '#E2E8F0',
    fontSize: 12.5,
    fontWeight: '600',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#111827',
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.18)',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#090D16',
    color: '#F8FAFC',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.24)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 110,
  },
  sendButton: {
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    fontSize: 13.5,
    fontWeight: '800',
  },
});
