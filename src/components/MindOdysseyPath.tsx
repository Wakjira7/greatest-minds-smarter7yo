import React, { useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MIND_REALMS } from '../constants/personas';
import { PersonaChatSummary } from '../services/storage';
import { MindRealm, Persona } from '../types/chat';
import { Avatar3D } from './Avatar3D';

interface MindOdysseyPathProps {
  personas: Persona[];
  summaries: Record<string, PersonaChatSummary>;
  isPersonaUnlockedFn: (persona: Persona) => boolean;
  onSelectPersona: (persona: Persona) => void;
}

// S-Curve Horizontal Offsets for the Winding 3D Constellation Path
const PATH_OFFSETS = [0, -64, -96, -52, 16, 74, 98, 48, -24, -78];

export const MindOdysseyPath: React.FC<MindOdysseyPathProps> = ({
  personas,
  summaries,
  isPersonaUnlockedFn,
  onSelectPersona,
}) => {
  const [selectedRealm, setSelectedRealm] = useState<MindRealm>(
    'Stoics & Philosophers'
  );
  const [awakenedPersonaId, setAwakenedPersonaId] = useState<string | null>(
    personas[0]?.id ?? null
  );

  const activeRealmMeta =
    MIND_REALMS.find((r) => r.id === selectedRealm) ?? MIND_REALMS[0];

  const realmMinds = useMemo(() => {
    const filtered = personas.filter((p) => p.realm === selectedRealm);
    return filtered.length > 0 ? filtered : personas.slice(0, 20);
  }, [personas, selectedRealm]);

  const completedInRealm = useMemo(() => {
    return realmMinds.filter((p) => (summaries[p.id]?.messageCount ?? 0) > 0)
      .length;
  }, [realmMinds, summaries]);

  const handleTouchMindOrb = (persona: Persona) => {
    setAwakenedPersonaId(persona.id);
    // Speak their signature catchphrase aloud when touched!
    if (
      Platform.OS === 'web' &&
      typeof window !== 'undefined' &&
      'speechSynthesis' in window
    ) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        `${persona.name}: ${persona.catchphrases[0]}`
      );
      utterance.rate = 1.04;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. 10-REALM CONSTELLATION CHAPTER SELECTOR (20 Minds per Realm = 200 Minds) */}
      <View style={styles.realmHeaderBox}>
        <View style={styles.realmHeaderTopRow}>
          <Text style={styles.realmSuperLabel}>
            🌌 ASTRAL ODYSSEY PATH • 10 REALMS × 20 MINDS = 200 GREATEST MINDS
          </Text>
          <Text style={styles.realmProgressBadge}>
            👑 {completedInRealm}/{realmMinds.length} Awakened in Realm
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.realmTabsRow}
        >
          {MIND_REALMS.map((realm, idx) => {
            const active = realm.id === selectedRealm;
            return (
              <Pressable
                key={realm.id}
                onPress={() => {
                  setSelectedRealm(realm.id);
                  const firstInRealm = personas.find(
                    (p) => p.realm === realm.id
                  );
                  if (firstInRealm) setAwakenedPersonaId(firstInRealm.id);
                }}
                style={[
                  styles.realmTabCard,
                  {
                    borderColor: active
                      ? realm.accentColor
                      : 'rgba(148, 163, 184, 0.22)',
                    backgroundColor: active
                      ? `${realm.accentColor}22`
                      : '#111827',
                  },
                ]}
              >
                <Text style={styles.realmTabEmoji}>{realm.emoji}</Text>
                <View>
                  <Text
                    style={[
                      styles.realmTabChapter,
                      { color: realm.accentColor },
                    ]}
                  >
                    REALM {idx + 1}
                  </Text>
                  <Text style={styles.realmTabTitle} numberOfLines={1}>
                    {realm.id}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* 2. ACTIVE REALM CITADEL BANNER (Tactile 3D Header) */}
      <View
        style={[
          styles.citadelBanner,
          {
            borderColor: activeRealmMeta.accentColor,
            backgroundColor: '#111827',
          },
        ]}
      >
        <View style={styles.citadelBannerLeft}>
          <Text style={styles.citadelBannerEmoji}>{activeRealmMeta.emoji}</Text>
          <View style={styles.citadelBannerTextCol}>
            <Text
              style={[
                styles.citadelEyebrow,
                { color: activeRealmMeta.accentColor },
              ]}
            >
              ACTIVE MASTERY CITADEL • TOUCH ANY 3D AVATAR TO AWAKEN
            </Text>
            <Text style={styles.citadelTitle}>{activeRealmMeta.title}</Text>
            <Text style={styles.citadelSubtitle}>
              {activeRealmMeta.subtitle}
            </Text>
          </View>
        </View>
      </View>

      {/* 3. WINDING 3D CONSTELLATION ODYSSEY PATH */}
      <View style={styles.odysseyStageCanvas}>
        {realmMinds.map((persona, index) => {
          const offsetX = PATH_OFFSETS[index % PATH_OFFSETS.length];
          const isAwakened = awakenedPersonaId === persona.id;
          const unlocked = isPersonaUnlockedFn(persona);
          const turns = summaries[persona.id]?.messageCount ?? 0;
          const crowns = Math.min(3, turns);

          return (
            <View key={persona.id} style={styles.nodeWrapper}>
              {/* Glowing Constellation Energy Conduit Line to Next Node */}
              {index > 0 && (
                <View
                  style={[
                    styles.conduitBridge,
                    {
                      backgroundColor:
                        turns > 0
                          ? persona.accentColor
                          : 'rgba(148, 163, 184, 0.24)',
                      transform: [{ translateX: Math.round(offsetX * 0.5) }],
                    },
                  ]}
                />
              )}

              {/* S-Curve Positioned 3D Tactile Mind Orb */}
              <View
                style={[
                  styles.orbColumn,
                  { transform: [{ translateX: offsetX }] },
                ]}
              >
                {/* Floating Speech Pill Above Active/First Node */}
                {(isAwakened || index === 0) && (
                  <View
                    style={[
                      styles.floatingSpeechTag,
                      {
                        borderColor: persona.accentColor,
                        backgroundColor: '#090D16',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.floatingSpeechText,
                        { color: persona.accentColor },
                      ]}
                      numberOfLines={1}
                    >
                      {isAwakened
                        ? `✨ “${persona.catchphrases[0]}”`
                        : '👆 Touch to Awaken 3D'}
                    </Text>
                  </View>
                )}

                {/* 3D Tactile Pedestal Node Button */}
                <Pressable
                  onPress={() => handleTouchMindOrb(persona)}
                  style={({ pressed }) => [
                    styles.tactileNodeOrb,
                    {
                      borderColor: isAwakened
                        ? persona.accentColor
                        : unlocked
                        ? 'rgba(248, 250, 252, 0.35)'
                        : 'rgba(148, 163, 184, 0.25)',
                      backgroundColor: isAwakened
                        ? persona.accentBg
                        : '#131C2E',
                      shadowColor: persona.accentColor,
                    },
                    isAwakened && styles.tactileNodeOrbActive,
                    pressed && styles.tactileNodeOrbPressed,
                  ]}
                >
                  <Avatar3D
                    personaId={persona.id}
                    accentColor={persona.accentColor}
                    size={isAwakened ? 92 : 72}
                    animated={isAwakened}
                  />

                  {/* Node Number & Lock Badge */}
                  <View
                    style={[
                      styles.nodeIndexBadge,
                      {
                        backgroundColor: unlocked
                          ? persona.accentColor
                          : '#334155',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.nodeIndexText,
                        { color: unlocked ? '#090D16' : '#CBD5E1' },
                      ]}
                    >
                      {unlocked ? `#${index + 1}` : '🔒'}
                    </Text>
                  </View>
                </Pressable>

                {/* Mastery Crowns (⭐⭐⭐) & Name Label */}
                <View style={styles.crownRow}>
                  {[1, 2, 3].map((star) => (
                    <Text
                      key={star}
                      style={[
                        styles.crownStar,
                        star <= crowns
                          ? styles.crownStarEarned
                          : styles.crownStarEmpty,
                      ]}
                    >
                      ★
                    </Text>
                  ))}
                </View>

                <Text
                  style={[
                    styles.nodeNameLabel,
                    isAwakened && {
                      color: persona.accentColor,
                      fontWeight: '900',
                    },
                  ]}
                >
                  {persona.name}
                </Text>
                <Text style={styles.nodeSpecialtyLabel}>
                  {persona.specialtyBadge}
                </Text>
              </View>

              {/* EXPANDED 3D HOLO-STAGE CARD WHEN TOUCHED / AWAKENED */}
              {isAwakened && (
                <View
                  style={[
                    styles.awakenedStageDrawer,
                    {
                      borderColor: persona.accentColor,
                      shadowColor: persona.accentColor,
                    },
                  ]}
                >
                  <View style={styles.awakenedTopRow}>
                    <Avatar3D
                      personaId={persona.id}
                      accentColor={persona.accentColor}
                      size={136}
                      animated
                      interactiveTouch
                    />

                    <View style={styles.awakenedInfoCol}>
                      <View style={styles.awakenedBadgesRow}>
                        <View
                          style={[
                            styles.awakenedRealmPill,
                            {
                              backgroundColor: persona.accentBg,
                              borderColor: persona.accentBorder,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.awakenedRealmPillText,
                              { color: persona.accentColor },
                            ]}
                          >
                            {persona.avatarEmoji} {persona.specialtyBadge}
                          </Text>
                        </View>
                        <Text style={styles.awakenedEraText}>
                          {persona.eraOrOrigin}
                        </Text>
                      </View>

                      <Text style={styles.awakenedName}>{persona.name}</Text>
                      <Text style={styles.awakenedTitle}>{persona.title}</Text>
                      <Text style={styles.awakenedBio} numberOfLines={2}>
                        {persona.shortBio}
                      </Text>

                      <View
                        style={[
                          styles.awakenedQuoteBox,
                          { borderLeftColor: persona.accentColor },
                        ]}
                      >
                        <Text style={styles.awakenedQuoteText}>
                          “{persona.catchphrases[0]}”
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.awakenedActionsRow}>
                    <Pressable
                      onPress={() => handleTouchMindOrb(persona)}
                      style={styles.replayVoiceBtn}
                    >
                      <Text style={styles.replayVoiceBtnText}>
                        🔊 Speak Catchphrase
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() => onSelectPersona(persona)}
                      style={({ pressed }) => [
                        styles.enterCounselBtn,
                        { backgroundColor: persona.accentColor },
                        pressed && { transform: [{ translateY: 2 }] },
                      ]}
                    >
                      <Text style={styles.enterCounselBtnText}>
                        {unlocked
                          ? `💬 Talk to ${persona.name} (+15 XP) →`
                          : `🔒 Unlock ${persona.name} →`}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )}
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
    marginBottom: 20,
  },
  realmHeaderBox: {
    marginBottom: 12,
  },
  realmHeaderTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  realmSuperLabel: {
    color: '#FBBF24',
    fontSize: 10.5,
    fontWeight: '900',
    letterSpacing: 0.7,
  },
  realmProgressBadge: {
    color: '#34D399',
    fontSize: 11.5,
    fontWeight: '800',
  },
  realmTabsRow: {
    gap: 8,
    paddingVertical: 4,
  },
  realmTabCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 14,
    borderWidth: 1.5,
    borderBottomWidth: 4,
  },
  realmTabEmoji: {
    fontSize: 20,
  },
  realmTabChapter: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  realmTabTitle: {
    color: '#F8FAFC',
    fontSize: 12.5,
    fontWeight: '800',
  },
  citadelBanner: {
    borderRadius: 20,
    borderWidth: 1.5,
    borderBottomWidth: 5,
    padding: 15,
    marginBottom: 16,
  },
  citadelBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  citadelBannerEmoji: {
    fontSize: 34,
  },
  citadelBannerTextCol: {
    flex: 1,
  },
  citadelEyebrow: {
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.7,
    marginBottom: 2,
  },
  citadelTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '900',
  },
  citadelSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  odysseyStageCanvas: {
    backgroundColor: '#0B101C',
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    paddingVertical: 24,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  nodeWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
  },
  conduitBridge: {
    width: 4,
    height: 32,
    borderRadius: 999,
    marginBottom: 6,
  },
  orbColumn: {
    alignItems: 'center',
  },
  floatingSpeechTag: {
    borderWidth: 1.5,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 8,
    maxWidth: 250,
  },
  floatingSpeechText: {
    fontSize: 11,
    fontWeight: '800',
  },
  tactileNodeOrb: {
    padding: 8,
    borderRadius: 32,
    borderWidth: 2.5,
    borderBottomWidth: 7,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  tactileNodeOrbActive: {
    borderWidth: 3,
    borderBottomWidth: 8,
    shadowOpacity: 0.65,
  },
  tactileNodeOrbPressed: {
    transform: [{ translateY: 3 }],
  },
  nodeIndexBadge: {
    position: 'absolute',
    top: -6,
    left: -6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
  },
  nodeIndexText: {
    fontSize: 10,
    fontWeight: '900',
  },
  crownRow: {
    flexDirection: 'row',
    gap: 3,
    marginTop: 5,
  },
  crownStar: {
    fontSize: 13,
  },
  crownStarEarned: {
    color: '#FBBF24',
  },
  crownStarEmpty: {
    color: '#334155',
  },
  nodeNameLabel: {
    color: '#F8FAFC',
    fontSize: 13.5,
    fontWeight: '800',
    marginTop: 2,
  },
  nodeSpecialtyLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '700',
  },
  awakenedStageDrawer: {
    width: '100%',
    maxWidth: 560,
    backgroundColor: '#111827',
    borderRadius: 22,
    borderWidth: 2,
    borderBottomWidth: 6,
    padding: 16,
    marginTop: 12,
    marginBottom: 10,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 12,
  },
  awakenedTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: 14,
  },
  awakenedInfoCol: {
    flex: 1,
    minWidth: 200,
  },
  awakenedBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6,
  },
  awakenedRealmPill: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  awakenedRealmPillText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  awakenedEraText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  awakenedName: {
    color: '#F8FAFC',
    fontSize: 19,
    fontWeight: '900',
  },
  awakenedTitle: {
    color: '#CBD5E1',
    fontSize: 12.5,
    fontWeight: '600',
    marginBottom: 4,
  },
  awakenedBio: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 8,
  },
  awakenedQuoteBox: {
    backgroundColor: '#090D16',
    borderLeftWidth: 3,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  awakenedQuoteText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontStyle: 'italic',
    fontWeight: '700',
  },
  awakenedActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  replayVoiceBtn: {
    backgroundColor: '#090D16',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.35)',
    borderBottomWidth: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  replayVoiceBtnText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '800',
  },
  enterCounselBtn: {
    flex: 1,
    minWidth: 180,
    borderBottomWidth: 5,
    borderBottomColor: 'rgba(0, 0, 0, 0.35)',
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
  },
  enterCounselBtnText: {
    color: '#090D16',
    fontSize: 13,
    fontWeight: '900',
  },
});
