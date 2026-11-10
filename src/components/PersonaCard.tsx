import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PersonaChatSummary } from '../services/storage';
import { Persona } from '../types/chat';
import { Avatar3D } from './Avatar3D';

interface PersonaCardProps {
  persona: Persona;
  summary?: PersonaChatSummary;
  isUnlocked?: boolean;
  onPress: (persona: Persona) => void;
}

export const PersonaCard: React.FC<PersonaCardProps> = ({
  persona,
  summary,
  isUnlocked = true,
  onPress,
}) => {
  const hasHistory = (summary?.messageCount ?? 0) > 0;

  return (
    <Pressable
      onPress={() => onPress(persona)}
      accessibilityRole="button"
      accessibilityLabel={`Chat with ${persona.name}, ${persona.title}, specialty ${persona.specialtyBadge}`}
      style={({ pressed }) => [
        styles.card,
        {
          borderColor: pressed
            ? persona.accentColor
            : isUnlocked
            ? 'rgba(148, 163, 184, 0.20)'
            : 'rgba(245, 158, 11, 0.25)',
        },
        pressed && styles.cardPressed,
      ]}
    >
      {/* Top Row: 3D Avatar + Name/Title + Access Tag */}
      <View style={styles.headerRow}>
        <View
          style={[
            styles.avatarBox,
            {
              backgroundColor: persona.accentBg,
              borderColor: persona.accentBorder,
            },
          ]}
        >
          <Avatar3D
            personaId={persona.id}
            accentColor={persona.accentColor}
            size={54}
            animated={false}
          />
        </View>

        <View style={styles.titleColumn}>
          <View style={styles.nameRow}>
            <Text style={styles.nameText} numberOfLines={1}>
              {persona.name}
            </Text>

            <View style={styles.rightTagsRow}>
              {persona.isFreeStarter ? (
                <View style={styles.freeStarterBadge}>
                  <Text style={styles.freeStarterText}>FREE STARTER</Text>
                </View>
              ) : isUnlocked ? (
                <View style={styles.unlockedVipBadge}>
                  <Text style={styles.unlockedVipText}>💎 VIP UNLOCKED</Text>
                </View>
              ) : (
                <View style={styles.lockedVipBadge}>
                  <Text style={styles.lockedVipText}>🔒 VIP</Text>
                </View>
              )}

              <View
                style={[
                  styles.categoryTag,
                  persona.category === 'Historical'
                    ? styles.historicalTag
                    : styles.parodyTag,
                ]}
              >
                <Text
                  style={[
                    styles.categoryTagText,
                    persona.category === 'Historical'
                      ? styles.historicalTagText
                      : styles.parodyTagText,
                  ]}
                >
                  {persona.category}
                </Text>
              </View>
            </View>
          </View>
          <Text style={styles.subtitleText} numberOfLines={1}>
            {persona.title} • {persona.bundleGroup}
          </Text>
        </View>
      </View>

      {/* Specialty Badge & Active Chat Pill */}
      <View style={styles.badgeRow}>
        <View
          style={[
            styles.specialtyBadge,
            {
              backgroundColor: persona.accentBg,
              borderColor: persona.accentBorder,
            },
          ]}
        >
          <View
            style={[
              styles.specialtyDot,
              { backgroundColor: persona.accentColor },
            ]}
          />
          <Text style={[styles.specialtyText, { color: persona.accentColor }]}>
            {persona.specialtyBadge}
          </Text>
        </View>

        {hasHistory && (
          <View style={styles.historyBadge}>
            <Text style={styles.historyBadgeText}>
              💬 {summary?.messageCount}{' '}
              {summary?.messageCount === 1 ? 'msg' : 'msgs'}
            </Text>
          </View>
        )}
      </View>

      {/* Bio */}
      <Text style={styles.bioText} numberOfLines={2}>
        {persona.shortBio}
      </Text>

      {/* Signature Catchphrase Preview */}
      <View
        style={[
          styles.catchphraseBox,
          {
            borderLeftColor: persona.accentColor,
          },
        ]}
      >
        <Text style={styles.catchphraseLabel}>SIGNATURE CATCHPHRASE</Text>
        <Text style={styles.catchphraseText} numberOfLines={2}>
          “{persona.catchphrases[0]}”
        </Text>
      </View>

      {/* CTA Footer */}
      <View style={styles.footerRow}>
        <Text style={styles.catchphraseCountText}>
          {isUnlocked
            ? '3 signature catchphrases'
            : 'Watch 1 Ad or Go Pro to unlock'}
        </Text>
        <View
          style={[
            styles.ctaButton,
            {
              backgroundColor: isUnlocked ? persona.accentColor : '#1E293B',
              borderWidth: isUnlocked ? 0 : 1,
              borderColor: persona.accentColor,
            },
          ]}
        >
          <Text
            style={[
              styles.ctaButtonText,
              !isUnlocked && { color: persona.accentColor },
            ]}
          >
            {!isUnlocked
              ? '🔒 Unlock (Ad / Pro) →'
              : hasHistory
              ? 'Continue Chat →'
              : 'Ask Advice →'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111827',
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.992 }],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  avatarBox: {
    width: 52,
    height: 52,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 26,
  },
  titleColumn: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 3,
  },
  nameText: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '700',
    flexShrink: 1,
  },
  rightTagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  freeStarterBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.14)',
    borderColor: 'rgba(16, 185, 129, 0.40)',
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
  },
  freeStarterText: {
    color: '#34D399',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  unlockedVipBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.16)',
    borderColor: 'rgba(245, 158, 11, 0.45)',
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
  },
  unlockedVipText: {
    color: '#FBBF24',
    fontSize: 9.5,
    fontWeight: '800',
  },
  lockedVipBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.35)',
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
  },
  lockedVipText: {
    color: '#FDE68A',
    fontSize: 9.5,
    fontWeight: '800',
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
  },
  historicalTag: {
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderColor: 'rgba(56, 189, 248, 0.35)',
  },
  parodyTag: {
    backgroundColor: 'rgba(168, 85, 247, 0.12)',
    borderColor: 'rgba(168, 85, 247, 0.35)',
  },
  categoryTagText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  historicalTagText: {
    color: '#7DD3FC',
  },
  parodyTagText: {
    color: '#D8B4FE',
  },
  subtitleText: {
    color: '#94A3B8',
    fontSize: 12.5,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  specialtyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    gap: 6,
  },
  specialtyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  specialtyText: {
    fontSize: 12,
    fontWeight: '700',
  },
  historyBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.14)',
    borderColor: 'rgba(16, 185, 129, 0.35)',
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
  },
  historyBadgeText: {
    color: '#6EE7B7',
    fontSize: 11,
    fontWeight: '600',
  },
  bioText: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },
  catchphraseBox: {
    backgroundColor: '#0B1120',
    borderLeftWidth: 3,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: 14,
  },
  catchphraseLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.7,
    marginBottom: 3,
  },
  catchphraseText: {
    color: '#E2E8F0',
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  catchphraseCountText: {
    color: '#64748B',
    fontSize: 11.5,
    fontWeight: '500',
  },
  ctaButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
  },
  ctaButtonText: {
    color: '#090D16',
    fontSize: 12.5,
    fontWeight: '800',
  },
});
