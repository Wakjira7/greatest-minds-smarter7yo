import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  ImageSourcePropType,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { getPersonaById } from '../constants/personas';

interface Avatar3DProps {
  personaId: string;
  accentColor: string;
  size?: number;
  animated?: boolean;
  interactiveTouch?: boolean;
  onAwakenComplete?: () => void;
}

// Studio Ghibli meets 3D Cinematic Anime Portraits
export const GHIBLI_3D_PORTRAITS: Record<string, ImageSourcePropType> = {
  'marcus-aurelius': require('../../assets/personas/marcus-aurelius.jpg'),
  'chef-ramsey': require('../../assets/personas/gordon-blaze.jpg'),
  'gordon-blaze': require('../../assets/personas/gordon-blaze.jpg'),
  'albert-einstein': require('../../assets/personas/albert-einstein.jpg'),
  cleopatra: require('../../assets/personas/cleopatra-vii.jpg'),
  'cleopatra-vii': require('../../assets/personas/cleopatra-vii.jpg'),
  'nikola-tesla': require('../../assets/personas/nikola-tesla.jpg'),
  'elon-nova': require('../../assets/personas/elon-nova.jpg'),
  socrates: require('../../assets/personas/socrates.jpg'),
  'sherlock-vance': require('../../assets/personas/detective-vance.jpg'),
  'detective-vance': require('../../assets/personas/detective-vance.jpg'),
  'sun-tzu': require('../../assets/personas/sun-tzu.jpg'),
  'master-zen': require('../../assets/personas/monk-kaito.jpg'),
  'monk-kaito': require('../../assets/personas/monk-kaito.jpg'),
};

export const Avatar3D: React.FC<Avatar3DProps> = ({
  personaId,
  accentColor,
  size = 150,
  animated = true,
  interactiveTouch = false,
  onAwakenComplete,
}) => {
  const persona = getPersonaById(personaId);
  const resolvedKey = persona?.portraitKey ?? personaId;

  const floatAnim = useRef(new Animated.Value(0)).current;
  const breatheAnim = useRef(new Animated.Value(1)).current;
  const swayAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0.88)).current;
  const particleAnim = useRef(new Animated.Value(0)).current;

  // Touch-to-Awaken 3D Burst Animations
  const touchScaleAnim = useRef(new Animated.Value(1)).current;
  const touchSpinAnim = useRef(new Animated.Value(0)).current;
  const shockwaveScale = useRef(new Animated.Value(0.6)).current;
  const shockwaveOpacity = useRef(new Animated.Value(0)).current;
  const voiceBarAnim = useRef(new Animated.Value(0.3)).current;

  const [isAwakened, setIsAwakened] = useState(false);
  const [spokenPhrase, setSpokenPhrase] = useState<string | null>(null);

  useEffect(() => {
    if (!animated) return;

    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 1900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    const breatheLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1.035,
          duration: 1600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 0.985,
          duration: 1600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    const swayLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(swayAnim, {
          toValue: 1,
          duration: 2400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(swayAnim, {
          toValue: -1,
          duration: 2400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.86,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    const particleLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(particleAnim, {
          toValue: 1,
          duration: 2200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(particleAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    floatLoop.start();
    breatheLoop.start();
    swayLoop.start();
    pulseLoop.start();
    particleLoop.start();

    return () => {
      floatLoop.stop();
      breatheLoop.stop();
      swayLoop.stop();
      pulseLoop.stop();
      particleLoop.stop();
    };
  }, [animated, floatAnim, breatheAnim, swayAnim, pulseAnim, particleAnim]);

  const trigger3DAwakenAnimation = () => {
    const phrase =
      persona?.catchphrases[
        Math.floor(Math.random() * (persona?.catchphrases.length ?? 1))
      ] ?? 'Seek wisdom and act boldly!';

    setIsAwakened(true);
    setSpokenPhrase(phrase);

    // Speak the catchphrase aloud in character
    if (
      Platform.OS === 'web' &&
      typeof window !== 'undefined' &&
      'speechSynthesis' in window
    ) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        `${persona?.name ?? 'Advisor'} says: ${phrase}`
      );
      utterance.rate = 1.04;
      window.speechSynthesis.speak(utterance);
    }

    // Reset shockwave values
    shockwaveScale.setValue(0.65);
    shockwaveOpacity.setValue(0.95);
    touchSpinAnim.setValue(0);

    Animated.parallel([
      // 1. 3D Elastic Jump & Pop
      Animated.sequence([
        Animated.timing(touchScaleAnim, {
          toValue: 1.18,
          duration: 180,
          easing: Easing.out(Easing.back(2)),
          useNativeDriver: true,
        }),
        Animated.spring(touchScaleAnim, {
          toValue: 1.06,
          friction: 3,
          tension: 120,
          useNativeDriver: true,
        }),
        Animated.timing(touchScaleAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]),
      // 2. 3D Tilt & Head Nod Wobble
      Animated.sequence([
        Animated.timing(touchSpinAnim, {
          toValue: 1,
          duration: 160,
          useNativeDriver: true,
        }),
        Animated.timing(touchSpinAnim, {
          toValue: -1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.spring(touchSpinAnim, {
          toValue: 0,
          friction: 4,
          useNativeDriver: true,
        }),
      ]),
      // 3. Expanding 3D Holographic Shockwave Ring
      Animated.timing(shockwaveScale, {
        toValue: 1.48,
        duration: 750,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(shockwaveOpacity, {
        toValue: 0,
        duration: 750,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      // 4. Voice Wave Equalizer Bounce
      Animated.loop(
        Animated.sequence([
          Animated.timing(voiceBarAnim, {
            toValue: 1,
            duration: 220,
            useNativeDriver: true,
          }),
          Animated.timing(voiceBarAnim, {
            toValue: 0.3,
            duration: 220,
            useNativeDriver: true,
          }),
        ]),
        { iterations: 6 }
      ),
    ]).start(() => {
      setTimeout(() => {
        setIsAwakened(false);
        setSpokenPhrase(null);
        onAwakenComplete?.();
      }, 1400);
    });
  };

  const portraitSource =
    GHIBLI_3D_PORTRAITS[resolvedKey] ??
    GHIBLI_3D_PORTRAITS[personaId] ??
    GHIBLI_3D_PORTRAITS['marcus-aurelius'];

  const isHeroStage = size >= 90;
  const portraitDiameter = isHeroStage ? Math.round(size * 0.86) : size;
  const borderRadius = isHeroStage
    ? Math.round(portraitDiameter * 0.28)
    : Math.round(portraitDiameter * 0.32);

  const rotateZ = swayAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-2.2deg', '2.2deg'],
  });

  const awakenRotateZ = touchSpinAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-8deg', '0deg', '8deg'],
  });

  const particleTranslateY = particleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [10, -28],
  });

  const particleOpacity = particleAnim.interpolate({
    inputRange: [0, 0.3, 0.8, 1],
    outputRange: [0, 0.9, 0.8, 0],
  });

  const combinedScale = Animated.multiply(breatheAnim, touchScaleAnim);

  const coreContent = (
    <View
      style={[
        styles.outerWrapper,
        {
          width: size,
          height: size,
        },
      ]}
    >
      {/* Touch-Awakened Floating 3D Speech Bubble & Live Voice Wave */}
      {isHeroStage && isAwakened && spokenPhrase && (
        <View
          style={[
            styles.awakenBubble,
            {
              borderColor: accentColor,
              shadowColor: accentColor,
            },
          ]}
        >
          <View style={styles.awakenHeaderRow}>
            <Text style={[styles.awakenLiveTag, { color: accentColor }]}>
              🔊 3D MIND AWAKENED • +5 XP
            </Text>
            <View style={styles.voiceBarsRow}>
              {[0, 1, 2, 3].map((b) => (
                <Animated.View
                  key={b}
                  style={[
                    styles.voiceBar,
                    {
                      backgroundColor: accentColor,
                      transform: [{ scaleY: voiceBarAnim }],
                    },
                  ]}
                />
              ))}
            </View>
          </View>
          <Text style={styles.awakenQuoteText} numberOfLines={2}>
            “{spokenPhrase}”
          </Text>
        </View>
      )}

      {/* Expanding 3D Touch Shockwave Halo */}
      {isHeroStage && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.shockwaveRing,
            {
              width: portraitDiameter,
              height: portraitDiameter,
              borderRadius,
              borderColor: accentColor,
              opacity: shockwaveOpacity,
              transform: [{ scale: shockwaveScale }],
            },
          ]}
        />
      )}

      {/* Floating Elemental 3D Particles (Hero Stage) */}
      {isHeroStage && animated && (
        <>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.floatingParticleLeft,
              {
                opacity: particleOpacity,
                transform: [{ translateY: particleTranslateY }],
              },
            ]}
          >
            <Text style={styles.particleEmoji}>
              {persona?.avatarEmoji ?? '✨'}
            </Text>
          </Animated.View>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.floatingParticleRight,
              {
                opacity: particleOpacity,
                transform: [{ translateY: particleTranslateY }],
              },
            ]}
          >
            <Text style={styles.particleEmoji}>✨</Text>
          </Animated.View>
        </>
      )}

      {/* 3D Holographic Pedestal Base */}
      {isHeroStage && (
        <View
          style={[
            styles.pedestalContainer,
            {
              bottom: Math.round(size * 0.01),
              width: Math.round(size * 0.84),
            },
          ]}
        >
          <Animated.View
            style={[
              styles.pedestalGlowRing,
              {
                borderColor: accentColor,
                backgroundColor: `${accentColor}28`,
                height: Math.max(15, Math.round(size * 0.125)),
                transform: [{ scaleX: pulseAnim }],
              },
            ]}
          />
          <View
            style={[
              styles.pedestalCoreDisk,
              {
                borderColor: accentColor,
                width: Math.round(size * 0.58),
                height: Math.max(7, Math.round(size * 0.055)),
              },
            ]}
          />
        </View>
      )}

      {/* Living 3D Studio Ghibli Character Frame */}
      <Animated.View
        style={[
          styles.floatingFrame,
          {
            width: portraitDiameter,
            height: portraitDiameter,
            borderRadius,
            borderColor: accentColor,
            borderWidth: isHeroStage ? 3 : 1.5,
            borderBottomWidth: isHeroStage ? 6 : 2.5, // Duolingo-style 3D tactile depth lip
            shadowColor: accentColor,
            transform: animated
              ? [
                  { translateY: floatAnim },
                  { scale: combinedScale },
                  { rotateZ: isAwakened ? awakenRotateZ : rotateZ },
                ]
              : [{ scale: touchScaleAnim }],
          },
        ]}
      >
        <Image
          source={portraitSource}
          style={[
            styles.portraitImage,
            {
              width: '100%',
              height: '100%',
              borderRadius: Math.max(4, borderRadius - 2),
            },
          ]}
          resizeMode="cover"
        />

        {/* Custom Realm Aura Tint Overlay for Extended 200 Minds */}
        {persona && persona.portraitKey !== persona.id && (
          <View
            pointerEvents="none"
            style={[
              styles.archetypeAuraTint,
              { backgroundColor: `${accentColor}18` },
            ]}
          />
        )}

        {/* Top 3D Glass Specular Rim Highlight */}
        <View
          pointerEvents="none"
          style={[
            styles.specularRim,
            {
              borderTopLeftRadius: Math.max(4, borderRadius - 2),
              borderTopRightRadius: Math.max(4, borderRadius - 2),
            },
          ]}
        />

        {/* Character Emblem Crest Badge (distinguishes all 200 Minds visually) */}
        {persona && (
          <View
            pointerEvents="none"
            style={[
              styles.emblemBadge,
              isHeroStage ? styles.emblemBadgeHero : styles.emblemBadgeSmall,
              {
                backgroundColor: '#090D16E6',
                borderColor: accentColor,
              },
            ]}
          >
            <Text
              style={
                isHeroStage ? styles.emblemEmojiHero : styles.emblemEmojiSmall
              }
            >
              {persona.avatarEmoji}
            </Text>
          </View>
        )}

        {/* Interactive "Touch to Awaken 3D" Micro-Prompt on Hero Stage */}
        {isHeroStage && interactiveTouch && !isAwakened && (
          <View pointerEvents="none" style={styles.touchPromptPill}>
            <Text style={styles.touchPromptText}>👆 Tap to Awaken 3D</Text>
          </View>
        )}
      </Animated.View>
    </View>
  );

  if (interactiveTouch) {
    return (
      <Pressable
        onPress={trigger3DAwakenAnimation}
        accessibilityRole="button"
        accessibilityLabel={`Awaken 3D animation for ${persona?.name ?? 'Advisor'}`}
      >
        {coreContent}
      </Pressable>
    );
  }

  return coreContent;
};

const styles = StyleSheet.create({
  outerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  floatingFrame: {
    overflow: 'hidden',
    backgroundColor: '#0B1120',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.55,
    shadowRadius: 18,
    elevation: 12,
    zIndex: 2,
  },
  portraitImage: {
    width: '100%',
    height: '100%',
  },
  archetypeAuraTint: {
    ...StyleSheet.absoluteFillObject,
  },
  specularRim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '20%',
    backgroundColor: 'rgba(255, 255, 255, 0.11)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.42)',
  },
  emblemBadge: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  emblemBadgeHero: {
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 10,
  },
  emblemBadgeSmall: {
    bottom: 2,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 6,
  },
  emblemEmojiHero: {
    fontSize: 16,
  },
  emblemEmojiSmall: {
    fontSize: 10,
  },
  touchPromptPill: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(9, 13, 22, 0.85)',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  touchPromptText: {
    color: '#F8FAFC',
    fontSize: 9.5,
    fontWeight: '800',
  },
  shockwaveRing: {
    position: 'absolute',
    borderWidth: 3,
    zIndex: 1,
  },
  floatingParticleLeft: {
    position: 'absolute',
    left: 4,
    top: '28%',
    zIndex: 4,
  },
  floatingParticleRight: {
    position: 'absolute',
    right: 4,
    top: '22%',
    zIndex: 4,
  },
  particleEmoji: {
    fontSize: 18,
  },
  awakenBubble: {
    position: 'absolute',
    top: -18,
    zIndex: 10,
    backgroundColor: 'rgba(9, 13, 22, 0.96)',
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 210,
    maxWidth: 260,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 10,
  },
  awakenHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  awakenLiveTag: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  voiceBarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    height: 12,
  },
  voiceBar: {
    width: 3,
    height: 11,
    borderRadius: 2,
  },
  awakenQuoteText: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '700',
    fontStyle: 'italic',
    lineHeight: 15,
  },
  pedestalContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  pedestalGlowRing: {
    width: '100%',
    borderRadius: 999,
    borderWidth: 1.5,
  },
  pedestalCoreDisk: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
  },
});
