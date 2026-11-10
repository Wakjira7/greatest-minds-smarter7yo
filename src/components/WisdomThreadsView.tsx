import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { PERSONAS } from '../constants/personas';
import { PersonaChatSummary } from '../services/storage';
import { MonetizationState, Persona } from '../types/chat';
import { Avatar3D } from './Avatar3D';

interface WisdomThreadsViewProps {
  state: MonetizationState;
  summaries: Record<string, PersonaChatSummary>;
  isPersonaUnlockedFn: (persona: Persona) => boolean;
  onSelectPersona: (persona: Persona) => void;
  onToggleLikeThread: (threadId: string) => void;
}

interface WisdomPost {
  id: string;
  personaId: string;
  topicTag: string;
  headline: string;
  body: string;
  catchphrase: string;
  baseLikes: number;
  postedAgo: string;
}

// Ported from DTPocketFM v1.6 pages/threads.dart & Astroway v6.1 Daily Horoscope/Wisdom Feed
const DAILY_WISDOM_THREADS: WisdomPost[] = [
  {
    id: 'thread-marcus-1',
    personaId: 'marcus-aurelius',
    topicTag: 'STOIC MINDSET • ANXIETY',
    headline: 'Why 90% of Your Stress Is Self-Inflicted Imagination',
    body: 'When someone disrespects you or a project fails, the event itself cannot wound your character—only your judgment about the event can. Strip away the dramatic story you tell yourself and deal strictly with the raw fact in front of you.',
    catchphrase: 'Confine yourself to the present.',
    baseLikes: 428,
    postedAgo: '2h ago',
  },
  {
    id: 'thread-blaze-1',
    personaId: 'chef-ramsey',
    topicTag: 'TOUGH LOVE • PROCRASTINATION',
    headline: 'Your Half-Baked Excuses Are Ruining Your Ambition!',
    body: 'You say you want to launch a business or get in shape, yet you have 14 open tabs and zero finished work today. Shut down the distractions, clean your station, and ship one finished task in the next 45 minutes!',
    catchphrase: 'Your excuses are RAW! Wake up!',
    baseLikes: 619,
    postedAgo: '3h ago',
  },
  {
    id: 'thread-cleopatra-1',
    personaId: 'cleopatra',
    topicTag: 'NEGOTIATION • SELF-WORTH',
    headline: 'Never Beg for a Seat at a Table You Can Command',
    body: 'When someone pulls back their attention or undervalues your work, chasing them only lowers your leverage. Invest that energy into sharpening your own alliances and skills until your absence becomes their loss.',
    catchphrase: 'Never kneel where you were born to reign.',
    baseLikes: 512,
    postedAgo: '5h ago',
  },
  {
    id: 'thread-nova-1',
    personaId: 'elon-nova',
    topicTag: 'FIRST PRINCIPLES • CAREER',
    headline: 'Delete the Dumb Requirements Before You Optimize',
    body: 'Most people spend years optimizing a career path or routine that should not exist in the first place. Question every constraint you were handed, delete the unnecessary steps, and accelerate your iteration speed by 10x.',
    catchphrase: 'Delete the part, delete the step—accelerate to orbit!',
    baseLikes: 384,
    postedAgo: '6h ago',
  },
  {
    id: 'thread-socrates-1',
    personaId: 'socrates',
    topicTag: 'CLARITY • OVERTHINKING',
    headline: 'Test the Belief That Is Making You Afraid',
    body: 'Before you panic about failing, ask yourself: what exact definition of success are you borrowing from strangers? When you examine your assumptions under honest questioning, false fears dissolve on their own.',
    catchphrase: 'Question the premise before you fear the outcome.',
    baseLikes: 295,
    postedAgo: '8h ago',
  },
  {
    id: 'thread-suntzu-1',
    personaId: 'sun-tzu',
    topicTag: 'STRATEGY • COMPETITION',
    headline: 'Win the Negotiation Before You Enter the Room',
    body: 'Do not walk into a salary review, pitch, or conflict hoping for luck. Map the other side’s incentives, prepare your numbers in silence, and position yourself where agreeing with you is their easiest path.',
    catchphrase: 'Every battle is won before it is ever fought.',
    baseLikes: 471,
    postedAgo: '11h ago',
  },
];

export const WisdomThreadsView: React.FC<WisdomThreadsViewProps> = ({
  state,
  summaries,
  isPersonaUnlockedFn,
  onSelectPersona,
  onToggleLikeThread,
}) => {
  const [speakingThreadId, setSpeakingThreadId] = useState<string | null>(null);

  const handleSpeakThread = (post: WisdomPost, personaName: string) => {
    if (speakingThreadId === post.id) {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setSpeakingThreadId(null);
      return;
    }

    setSpeakingThreadId(post.id);
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        `${personaName} says: ${post.headline}. ${post.body} Remember: ${post.catchphrase}`
      );
      utterance.rate = 1.02;
      utterance.onend = () => setSpeakingThreadId(null);
      utterance.onerror = () => setSpeakingThreadId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setSpeakingThreadId(null), 4000);
    }
  };

  const activeConsultations = PERSONAS.filter(
    (p) => (summaries[p.id]?.messageCount ?? 0) > 0
  );

  return (
    <View style={styles.container}>
      {/* 1. ASTROWAY v6.1 Active Consultations History ("My Chats") */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>
              🔒 ASTROWAY CONSULTATION LOG (100% CONFIDENTIAL)
            </Text>
            <Text style={styles.sectionTitle}>
              Your Active Advisor Sessions ({activeConsultations.length})
            </Text>
          </View>
        </View>

        {activeConsultations.length === 0 ? (
          <View style={styles.emptyHistoryBox}>
            <Text style={styles.emptyHistoryText}>
              You haven’t sent a message yet. Tap any 3D Advisor below or on the 3D Stage to start your confidential consultation!
            </Text>
          </View>
        ) : (
          activeConsultations.map((persona) => {
            const summary = summaries[persona.id];
            return (
              <Pressable
                key={persona.id}
                onPress={() => onSelectPersona(persona)}
                style={styles.consultationRow}
              >
                <View
                  style={[
                    styles.consultAvatarBox,
                    {
                      backgroundColor: persona.accentBg,
                      borderColor: persona.accentBorder,
                    },
                  ]}
                >
                  <Avatar3D
                    personaId={persona.id}
                    accentColor={persona.accentColor}
                    size={46}
                    animated={false}
                  />
                </View>

                <View style={styles.consultMain}>
                  <View style={styles.consultTitleRow}>
                    <Text style={styles.consultName}>{persona.name}</Text>
                    <View style={styles.consultCountBadge}>
                      <Text style={styles.consultCountText}>
                        {summary.messageCount} turns
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.consultPreview} numberOfLines={1}>
                    {summary.lastMessageText ?? persona.greeting}
                  </Text>
                </View>

                <View
                  style={[
                    styles.resumeBtn,
                    { backgroundColor: persona.accentColor },
                  ]}
                >
                  <Text style={styles.resumeBtnText}>Resume →</Text>
                </View>
              </Pressable>
            );
          })
        )}
      </View>

      {/* 2. DTPOCKETFM v1.6 pages/threads.dart — Daily 3D Advisor Wisdom Wall */}
      <View style={styles.threadsHeaderBox}>
        <Text style={styles.sectionEyebrow}>
          🎙️ DTPOCKETFM WISDOM THREADS & AUDIO FEED (threads.dart)
        </Text>
        <Text style={styles.sectionTitle}>Daily Catchphrase & Advice Wall</Text>
        <Text style={styles.sectionSubtitle}>
          Listen to daily insights aloud with 🔊 Voice TTS, bookmark your favorite catchphrases, or jump straight into a 1-on-1 session.
        </Text>
      </View>

      {DAILY_WISDOM_THREADS.map((post) => {
        const persona =
          PERSONAS.find((p) => p.id === post.personaId) ?? PERSONAS[0];
        const isLiked = state.likedThreadIds.includes(post.id);
        const isSpeaking = speakingThreadId === post.id;
        const unlocked = isPersonaUnlockedFn(persona);

        return (
          <View
            key={post.id}
            style={[
              styles.threadCard,
              { borderColor: persona.accentBorder },
            ]}
          >
            {/* Author Row */}
            <View style={styles.threadAuthorRow}>
              <View
                style={[
                  styles.threadAvatarWrap,
                  {
                    backgroundColor: persona.accentBg,
                    borderColor: persona.accentBorder,
                  },
                ]}
              >
                <Avatar3D
                  personaId={persona.id}
                  accentColor={persona.accentColor}
                  size={44}
                  animated={false}
                />
              </View>

              <View style={styles.threadAuthorTextCol}>
                <View style={styles.threadNameRow}>
                  <Text style={styles.threadPersonaName}>{persona.name}</Text>
                  <Text style={styles.threadPostedAgo}>• {post.postedAgo}</Text>
                </View>
                <Text
                  style={[
                    styles.threadTopicTag,
                    { color: persona.accentColor },
                  ]}
                >
                  {post.topicTag}
                </Text>
              </View>

              {/* DTPocketFM Audio Listen Button */}
              <Pressable
                onPress={() => handleSpeakThread(post, persona.name)}
                style={[
                  styles.audioListenBtn,
                  isSpeaking && {
                    backgroundColor: persona.accentColor,
                    borderColor: persona.accentColor,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.audioListenBtnText,
                    isSpeaking && { color: '#090D16' },
                  ]}
                >
                  {isSpeaking ? '⏹ Stop Audio' : '🔊 Listen'}
                </Text>
              </Pressable>
            </View>

            {/* Headline & Body */}
            <Text style={styles.threadHeadline}>{post.headline}</Text>
            <Text style={styles.threadBody}>{post.body}</Text>

            {/* Signature Catchphrase Callout */}
            <View
              style={[
                styles.threadCatchphraseBox,
                {
                  backgroundColor: persona.accentBg,
                  borderColor: persona.accentBorder,
                },
              ]}
            >
              <Text
                style={[
                  styles.threadCatchphraseText,
                  { color: persona.accentColor },
                ]}
              >
                ✨ Signature Catchphrase: “{post.catchphrase}”
              </Text>
            </View>

            {/* Thread Footer Actions */}
            <View style={styles.threadFooterRow}>
              <Pressable
                onPress={() => onToggleLikeThread(post.id)}
                style={[
                  styles.likeBtn,
                  isLiked && styles.likeBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.likeBtnText,
                    isLiked && styles.likeBtnTextActive,
                  ]}
                >
                  {isLiked ? '❤️' : '🤍'} {post.baseLikes + (isLiked ? 1 : 0)}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => onSelectPersona(persona)}
                style={[
                  styles.askAdvisorBtn,
                  { backgroundColor: persona.accentColor },
                ]}
              >
                <Text style={styles.askAdvisorBtnText}>
                  {unlocked
                    ? `💬 Ask ${persona.name.split(' ')[0]} About This →`
                    : `🔒 Unlock ${persona.name.split(' ')[0]} →`}
                </Text>
              </Pressable>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 14,
    marginBottom: 16,
  },
  sectionCard: {
    backgroundColor: '#111827',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.22)',
    padding: 16,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionEyebrow: {
    color: '#FBBF24',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.7,
    marginBottom: 3,
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: '#94A3B8',
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: 3,
  },
  emptyHistoryBox: {
    backgroundColor: '#090D16',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.16)',
  },
  emptyHistoryText: {
    color: '#94A3B8',
    fontSize: 12.5,
    lineHeight: 18,
  },
  consultationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#090D16',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.18)',
    padding: 10,
    marginBottom: 8,
    gap: 12,
  },
  consultAvatarBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  consultMain: {
    flex: 1,
  },
  consultTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 3,
  },
  consultName: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '800',
  },
  consultCountBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.14)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
  },
  consultCountText: {
    color: '#7DD3FC',
    fontSize: 10,
    fontWeight: '800',
  },
  consultPreview: {
    color: '#94A3B8',
    fontSize: 12,
  },
  resumeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  resumeBtnText: {
    color: '#090D16',
    fontSize: 11.5,
    fontWeight: '900',
  },
  threadsHeaderBox: {
    paddingHorizontal: 4,
    marginTop: 4,
  },
  threadCard: {
    backgroundColor: '#111827',
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  threadAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  threadAvatarWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  threadAuthorTextCol: {
    flex: 1,
  },
  threadNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  threadPersonaName: {
    color: '#F8FAFC',
    fontSize: 14.5,
    fontWeight: '800',
  },
  threadPostedAgo: {
    color: '#64748B',
    fontSize: 11.5,
    fontWeight: '600',
  },
  threadTopicTag: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  audioListenBtn: {
    backgroundColor: '#090D16',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 999,
  },
  audioListenBtnText: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '800',
  },
  threadHeadline: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
    lineHeight: 22,
  },
  threadBody: {
    color: '#CBD5E1',
    fontSize: 13.5,
    lineHeight: 20,
    marginBottom: 12,
  },
  threadCatchphraseBox: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  threadCatchphraseText: {
    fontSize: 12,
    fontWeight: '800',
    fontStyle: 'italic',
  },
  threadFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  likeBtn: {
    backgroundColor: '#090D16',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  likeBtnActive: {
    backgroundColor: 'rgba(244, 36, 82, 0.16)',
    borderColor: 'rgba(244, 36, 82, 0.45)',
  },
  likeBtnText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '800',
  },
  likeBtnTextActive: {
    color: '#FB7185',
  },
  askAdvisorBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  askAdvisorBtnText: {
    color: '#090D16',
    fontSize: 12,
    fontWeight: '900',
  },
});
