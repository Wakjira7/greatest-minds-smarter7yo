import React, { useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { PersonaChatSummary } from '../services/storage';
import { Persona } from '../types/chat';
import { Avatar3D } from './Avatar3D';

interface Persona3DCarouselProps {
  personas: Persona[];
  summaries: Record<string, PersonaChatSummary>;
  isPersonaUnlockedFn: (persona: Persona) => boolean;
  onSelectPersona: (persona: Persona) => void;
}

const ASTROWAY_RATINGS: Record<string, { rating: string; consults: string }> = {
  'marcus-aurelius': { rating: '5.0', consults: '4.2k' },
  'chef-ramsey': { rating: '4.9', consults: '3.8k' },
  'albert-einstein': { rating: '5.0', consults: '3.1k' },
  cleopatra: { rating: '4.9', consults: '2.9k' },
  'nikola-tesla': { rating: '4.9', consults: '2.6k' },
  'elon-nova': { rating: '4.8', consults: '3.5k' },
  socrates: { rating: '4.9', consults: '2.1k' },
  'sherlock-vance': { rating: '5.0', consults: '2.8k' },
  'sun-tzu': { rating: '4.9', consults: '3.0k' },
  'master-zen': { rating: '5.0', consults: '3.4k' },
};

export const Persona3DCarousel: React.FC<Persona3DCarouselProps> = ({
  personas,
  summaries,
  isPersonaUnlockedFn,
  onSelectPersona,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activePhraseIdx, setActivePhraseIdx] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

  if (personas.length === 0) return null;

  const safeIndex = activeIndex >= personas.length ? 0 : activeIndex;
  const activePersona = personas[safeIndex];
  const prevIndex = (safeIndex - 1 + personas.length) % personas.length;
  const nextIndex = (safeIndex + 1) % personas.length;
  const prevPersona = personas[prevIndex];
  const nextPersona = personas[nextIndex];

  const unlocked = isPersonaUnlockedFn(activePersona);
  const summary = summaries[activePersona.id];
  const socialProof = ASTROWAY_RATINGS[activePersona.id] ?? {
    rating: '4.9',
    consults: '2.0k',
  };

  const animateSlideTo = (newIndex: number, direction: 'left' | 'right') => {
    const startOffset = direction === 'right' ? 35 : -35;
    setActiveIndex(newIndex);
    setActivePhraseIdx(0);
    slideAnim.setValue(startOffset);
    Animated.spring(slideAnim, {
      toValue: 0,
      friction: 7,
      tension: 65,
      useNativeDriver: true,
    }).start();
  };

  const handlePrev = () => {
    animateSlideTo(prevIndex, 'left');
  };

  const handleNext = () => {
    animateSlideTo(nextIndex, 'right');
  };

  // Touch / Mouse Swipe gesture handler for sliding the 3D Stage
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 18 && Math.abs(gestureState.dy) < 30,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -35) {
          setActiveIndex((prev) => (prev + 1) % personas.length);
          setActivePhraseIdx(0);
        } else if (gestureState.dx > 35) {
          setActiveIndex(
            (prev) => (prev - 1 + personas.length) % personas.length
          );
          setActivePhraseIdx(0);
        }
      },
    })
  ).current;

  const storyWindowStart = Math.max(0, Math.min(safeIndex - 6, Math.max(0, personas.length - 24)));
  const visibleStoryPersonas = personas.slice(storyWindowStart, storyWindowStart + 24);

  return (
    <View style={styles.container}>
      {/* Astroway-Inspired Top Story Ring Slider (Windowed for 200 Greatest Minds) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storyRingsRow}
      >
        {visibleStoryPersonas.map((p, localIdx) => {
          const idx = storyWindowStart + localIdx;
          const isCurrent = idx === safeIndex;
          const isFreeOrUnlocked = isPersonaUnlockedFn(p);
          return (
            <Pressable
              key={p.id}
              onPress={() =>
                animateSlideTo(idx, idx > safeIndex ? 'right' : 'left')
              }
              style={styles.storyItem}
            >
              <View
                style={[
                  styles.storyRing,
                  {
                    borderColor: isCurrent
                      ? p.accentColor
                      : 'rgba(148, 163, 184, 0.25)',
                    backgroundColor: isCurrent ? p.accentBg : '#111827',
                  },
                ]}
              >
                <Avatar3D
                  personaId={p.id}
                  accentColor={p.accentColor}
                  size={44}
                  animated={false}
                />
                <View
                  style={[
                    styles.onlineDot,
                    {
                      backgroundColor: isFreeOrUnlocked ? '#10B981' : '#F59E0B',
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.storyLabel,
                  isCurrent && { color: p.accentColor, fontWeight: '800' },
                ]}
                numberOfLines={1}
              >
                {p.name.split(' ')[0]}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Main 3D Coverflow Stage */}
      <View {...panResponder.panHandlers} style={styles.stageContainer}>
        {/* Left Side 3D Preview Card */}
        {personas.length > 1 && (
          <Pressable
            onPress={handlePrev}
            accessibilityRole="button"
            accessibilityLabel={`Previous advisor ${prevPersona.name}`}
            style={[
              styles.sideCard,
              styles.leftSideCard,
              { borderColor: prevPersona.accentBorder },
            ]}
          >
            <Avatar3D
              personaId={prevPersona.id}
              accentColor={prevPersona.accentColor}
              size={82}
              animated={false}
            />
            <Text style={styles.sideCardName} numberOfLines={1}>
              {prevPersona.name.split(' ')[0]}
            </Text>
            <Text style={styles.sideSwipeHint}>◀ Slide</Text>
          </Pressable>
        )}

        {/* Center Active 3D Character Card */}
        <Animated.View
          style={[
            styles.centerStageCard,
            {
              borderColor: activePersona.accentColor,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          {/* Top Status Row (Astroway Online + Rating + VIP/Starter Tag) */}
          <View style={styles.stageTopBar}>
            <View style={styles.onlinePill}>
              <View style={styles.pulseDot} />
              <Text style={styles.onlinePillText}>
                🎨 3D LIVE MOTION • ⭐ {socialProof.rating} ({socialProof.consults})
              </Text>
            </View>

            <View
              style={[
                styles.accessPill,
                activePersona.isFreeStarter
                  ? styles.accessPillStarter
                  : unlocked
                  ? styles.accessPillUnlocked
                  : styles.accessPillLocked,
              ]}
            >
              <Text style={styles.accessPillText}>
                {activePersona.isFreeStarter
                  ? '🟢 FREE STARTER'
                  : unlocked
                  ? '💎 VIP UNLOCKED'
                  : '🔒 VIP ADVISOR'}
              </Text>
            </View>
          </View>

          {/* Touch-Interactive 3D Studio Ghibli Character Portrait */}
          <View style={styles.avatar3DStageBox}>
            <Avatar3D
              personaId={activePersona.id}
              accentColor={activePersona.accentColor}
              size={196}
              animated
              interactiveTouch
            />
          </View>

          {/* Slide Navigation Controls + Counter */}
          <View style={styles.sliderControlsRow}>
            <Pressable onPress={handlePrev} style={styles.arrowBtn}>
              <Text style={styles.arrowBtnText}>◀ Prev</Text>
            </Pressable>

            <View
              style={[
                styles.specialtyPill,
                {
                  backgroundColor: activePersona.accentBg,
                  borderColor: activePersona.accentBorder,
                },
              ]}
            >
              <Text
                style={[
                  styles.specialtyPillText,
                  { color: activePersona.accentColor },
                ]}
              >
                {activePersona.specialtyBadge} • #{safeIndex + 1} of{' '}
                {personas.length}
              </Text>
            </View>

            <Pressable onPress={handleNext} style={styles.arrowBtn}>
              <Text style={styles.arrowBtnText}>Next ▶</Text>
            </Pressable>
          </View>

          {/* Persona Name, Title & Bio */}
          <Text style={styles.personaName}>{activePersona.name}</Text>
          <Text style={styles.personaTitle}>
            {activePersona.title} • {activePersona.eraOrOrigin}
          </Text>
          <Text style={styles.personaBio} numberOfLines={2}>
            {activePersona.shortBio}
          </Text>

          {/* Interactive 3-Catchphrase Rotator Box */}
          <Pressable
            onPress={() =>
              setActivePhraseIdx(
                (prev) => (prev + 1) % activePersona.catchphrases.length
              )
            }
            style={[
              styles.catchphraseCarouselBox,
              { borderLeftColor: activePersona.accentColor },
            ]}
          >
            <View style={styles.catchphraseHeaderRow}>
              <Text style={styles.catchphraseHeaderLabel}>
                SIGNATURE CATCHPHRASE ({activePhraseIdx + 1}/3)
              </Text>
              <Text
                style={[
                  styles.tapNextPhraseText,
                  { color: activePersona.accentColor },
                ]}
              >
                Tap for next phrase ↻
              </Text>
            </View>
            <Text style={styles.catchphraseQuote}>
              “{activePersona.catchphrases[activePhraseIdx]}”
            </Text>
          </Pressable>

          {/* Primary Action Button (3D Tactile Depth Lip) */}
          <Pressable
            onPress={() => onSelectPersona(activePersona)}
            style={({ pressed }) => [
              styles.mainCtaButton,
              {
                backgroundColor: unlocked
                  ? activePersona.accentColor
                  : '#1E293B',
                borderColor: activePersona.accentColor,
                borderWidth: unlocked ? 0 : 1.5,
                borderBottomWidth: 5,
                borderBottomColor: 'rgba(0, 0, 0, 0.35)',
              },
              pressed && { transform: [{ translateY: 2 }], opacity: 0.92 },
            ]}
          >
            <Text
              style={[
                styles.mainCtaText,
                !unlocked && { color: activePersona.accentColor },
              ]}
            >
              {!unlocked
                ? `🔒 Unlock ${activePersona.name} (Watch 1 Ad or Pro)`
                : (summary?.messageCount ?? 0) > 0
                ? `💬 Continue Chat with ${activePersona.name} (${summary?.messageCount} turns) →`
                : `💬 Talk to ${activePersona.name} →`}
            </Text>
          </Pressable>
        </Animated.View>

        {/* Right Side 3D Preview Card */}
        {personas.length > 1 && (
          <Pressable
            onPress={handleNext}
            accessibilityRole="button"
            accessibilityLabel={`Next advisor ${nextPersona.name}`}
            style={[
              styles.sideCard,
              styles.rightSideCard,
              { borderColor: nextPersona.accentBorder },
            ]}
          >
            <Avatar3D
              personaId={nextPersona.id}
              accentColor={nextPersona.accentColor}
              size={82}
              animated={false}
            />
            <Text style={styles.sideCardName} numberOfLines={1}>
              {nextPersona.name.split(' ')[0]}
            </Text>
            <Text style={styles.sideSwipeHint}>Slide ▶</Text>
          </Pressable>
        )}
      </View>

      {/* Pagination Dots (Windowed up to 16 dots) */}
      <View style={styles.dotsRow}>
        {visibleStoryPersonas.slice(0, 16).map((p, localIdx) => {
          const idx = storyWindowStart + localIdx;
          const active = idx === safeIndex;
          return (
            <Pressable
              key={p.id}
              onPress={() =>
                animateSlideTo(idx, idx > safeIndex ? 'right' : 'left')
              }
              style={[
                styles.dot,
                active && {
                  width: 22,
                  backgroundColor: activePersona.accentColor,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  storyRingsRow: {
    paddingVertical: 6,
    gap: 12,
    marginBottom: 12,
  },
  storyItem: {
    alignItems: 'center',
    width: 64,
  },
  storyRing: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    position: 'relative',
  },
  storyEmoji: {
    fontSize: 24,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#090D16',
  },
  storyLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  stageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  sideCard: {
    width: 82,
    backgroundColor: 'rgba(17, 24, 39, 0.75)',
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    opacity: 0.72,
  },
  leftSideCard: {
    marginRight: -10,
    transform: [{ scale: 0.88 }],
    zIndex: 1,
  },
  rightSideCard: {
    marginLeft: -10,
    transform: [{ scale: 0.88 }],
    zIndex: 1,
  },
  sideCardName: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
  },
  sideSwipeHint: {
    color: '#64748B',
    fontSize: 9.5,
    fontWeight: '700',
    marginTop: 2,
  },
  centerStageCard: {
    flex: 1,
    maxWidth: 520,
    backgroundColor: '#111827',
    borderRadius: 24,
    borderWidth: 2,
    padding: 16,
    alignItems: 'center',
    zIndex: 5,
  },
  stageTopBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  onlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.35)',
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  onlinePillText: {
    color: '#A7F3D0',
    fontSize: 10.5,
    fontWeight: '800',
  },
  accessPill: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  accessPillStarter: {
    backgroundColor: 'rgba(16, 185, 129, 0.14)',
    borderColor: 'rgba(16, 185, 129, 0.40)',
  },
  accessPillUnlocked: {
    backgroundColor: 'rgba(245, 158, 11, 0.16)',
    borderColor: 'rgba(245, 158, 11, 0.45)',
  },
  accessPillLocked: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.35)',
  },
  accessPillText: {
    color: '#FDE68A',
    fontSize: 10,
    fontWeight: '800',
  },
  avatar3DStageBox: {
    marginVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderControlsRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 8,
  },
  arrowBtn: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.25)',
  },
  arrowBtnText: {
    color: '#E2E8F0',
    fontSize: 11.5,
    fontWeight: '700',
  },
  specialtyPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  specialtyPillText: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  personaName: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 2,
  },
  personaTitle: {
    color: '#94A3B8',
    fontSize: 12.5,
    textAlign: 'center',
    marginBottom: 8,
  },
  personaBio: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 12,
  },
  catchphraseCarouselBox: {
    width: '100%',
    backgroundColor: '#090D16',
    borderLeftWidth: 3.5,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
  },
  catchphraseHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  catchphraseHeaderLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  tapNextPhraseText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  catchphraseQuote: {
    color: '#F1F5F9',
    fontSize: 13.5,
    fontStyle: 'italic',
    fontWeight: '600',
    lineHeight: 19,
  },
  mainCtaButton: {
    width: '100%',
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainCtaText: {
    color: '#090D16',
    fontSize: 13.5,
    fontWeight: '800',
    textAlign: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#334155',
  },
});
