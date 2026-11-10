import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { isProSubscriber } from '../services/monetization';
import { ChatMessage, MonetizationState, Persona } from '../types/chat';

interface ActionPlanModalProps {
  visible: boolean;
  persona: Persona;
  messages: ChatMessage[];
  monetizationState: MonetizationState;
  onClose: () => void;
  onUnlockActionPlan: () => void;
}

export const ActionPlanModal: React.FC<ActionPlanModalProps> = ({
  visible,
  persona,
  messages,
  monetizationState,
  onClose,
  onUnlockActionPlan,
}) => {
  const isUnlocked =
    isProSubscriber(monetizationState) ||
    monetizationState.unlockedActionPlanPersonaIds.includes(persona.id);

  const userMessages = messages.filter((m) => m.role === 'user');
  const latestProblem =
    userMessages[userMessages.length - 1]?.content ??
    'Mastering daily focus, emotional resilience, and high-value boundaries';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.topRow}>
            <Text style={[styles.badge, { color: persona.accentColor }]}>
              📄 CUSTOM LIFE ACTION PLAN • {persona.specialtyBadge.toUpperCase()}
            </Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
          </View>

          <Text style={styles.title}>
            {persona.avatarEmoji} {persona.name}’s Blueprint For You
          </Text>
          <Text style={styles.subtitle}>
            Tailored to your session: “{latestProblem.slice(0, 80)}”
          </Text>

          {!isUnlocked ? (
            <View style={styles.lockedBox}>
              <Text style={styles.lockedEmoji}>🔒</Text>
              <Text style={styles.lockedTitle}>
                Unlock Your 1-Page Custom Action Plan ($0.99)
              </Text>
              <Text style={styles.lockedDesc}>
                Get a structured, step-by-step daily execution blueprint written in{' '}
                {persona.name}’s voice—including all 3 signature catchphrases, a
                morning mindset shift, and a 7-day habit tracker. (Included FREE
                with Pro Monthly/Weekly).
              </Text>
              <Pressable
                onPress={onUnlockActionPlan}
                style={[
                  styles.unlockBtn,
                  { backgroundColor: persona.accentColor },
                ]}
              >
                <Text style={styles.unlockBtnText}>
                  Unlock Action Plan Now ($0.99)
                </Text>
              </Pressable>
            </View>
          ) : (
            <ScrollView
              style={styles.planScroll}
              showsVerticalScrollIndicator={false}
            >
              <View
                style={[
                  styles.sectionBox,
                  { borderLeftColor: persona.accentColor },
                ]}
              >
                <Text style={styles.sectionLabel}>1. CORE MINDSET SHIFT</Text>
                <Text style={styles.sectionBody}>
                  “{persona.catchphrases[0]}” — Stop measuring your worth by
                  external noise. Channel 100% of your energy into the single
                  lever you control today.
                </Text>
              </View>

              <View
                style={[
                  styles.sectionBox,
                  { borderLeftColor: persona.accentColor },
                ]}
              >
                <Text style={styles.sectionLabel}>
                  2. {persona.name.toUpperCase()}’S 3-STEP EXECUTION CHECKLIST
                </Text>
                <Text style={styles.stepItem}>
                  ✅ <Text style={styles.stepBold}>Morning Audit (5 mins):</Text>{' '}
                  Write down the #1 obstacle in front of you and eliminate two
                  low-value distractions before checking messages.
                </Text>
                <Text style={styles.stepItem}>
                  ✅ <Text style={styles.stepBold}>Midday Boundary:</Text> Remember:{' '}
                  “{persona.catchphrases[1]}” Protect a 45-minute uninterrupted
                  block for your highest-priority move.
                </Text>
                <Text style={styles.stepItem}>
                  ✅ <Text style={styles.stepBold}>Evening Reflection:</Text>{' '}
                  Acknowledge one courageous action you completed today and
                  release tomorrow’s worries.
                </Text>
              </View>

              <View
                style={[
                  styles.sectionBox,
                  { borderLeftColor: persona.accentColor },
                ]}
              >
                <Text style={styles.sectionLabel}>3. DAILY ANCHOR MANTRA</Text>
                <Text
                  style={[styles.mantraText, { color: persona.accentColor }]}
                >
                  “{persona.catchphrases[2]}”
                </Text>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },
  card: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '85%',
    backgroundColor: '#111827',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.25)',
    padding: 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  badge: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(148, 163, 184, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '700',
  },
  title: {
    color: '#F8FAFC',
    fontSize: 19,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 12.5,
    marginBottom: 16,
  },
  lockedBox: {
    backgroundColor: '#090D16',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.18)',
  },
  lockedEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  lockedTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
  },
  lockedDesc: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginBottom: 16,
  },
  unlockBtn: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  unlockBtnText: {
    color: '#090D16',
    fontSize: 14,
    fontWeight: '800',
  },
  planScroll: {
    maxHeight: 380,
  },
  sectionBox: {
    backgroundColor: '#090D16',
    borderLeftWidth: 3,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  sectionLabel: {
    color: '#64748B',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  sectionBody: {
    color: '#E2E8F0',
    fontSize: 13.5,
    lineHeight: 20,
  },
  stepItem: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 8,
  },
  stepBold: {
    color: '#F8FAFC',
    fontWeight: '700',
  },
  mantraText: {
    fontSize: 14.5,
    fontWeight: '800',
    fontStyle: 'italic',
    lineHeight: 21,
  },
});
