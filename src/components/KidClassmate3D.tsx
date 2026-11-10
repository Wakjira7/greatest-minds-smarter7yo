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
import { KidClassmate } from '../constants/smarter7yoData';

interface KidClassmate3DProps {
  classmate: KidClassmate;
  size?: number;
  mood?: 'idle' | 'excited' | 'roasting' | 'hand_raised';
  speechBubbleText?: string;
  imageSource?: ImageSourcePropType;
  onPress?: () => void;
}

export const KidClassmate3D: React.FC<KidClassmate3DProps> = ({
  classmate,
  size = 110,
  mood = 'idle',
  speechBubbleText,
  imageSource,
  onPress,
}) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const tiltAnim = useRef(new Animated.Value(0)).current;
  const jumpAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Continuous 3D classroom breathing & excited bobbing
  useEffect(() => {
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: mood === 'excited' ? 650 : 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: mood === 'excited' ? 650 : 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    const tiltLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(tiltAnim, {
          toValue: 1,
          duration: 2100,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(tiltAnim, {
          toValue: -1,
          duration: 2100,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    floatLoop.start();
    tiltLoop.start();
    return () => {
      floatLoop.stop();
      tiltLoop.stop();
    };
  }, [floatAnim, tiltAnim, mood]);

  // Trigger 3D celebratory jump whenever mood changes to excited or roasting
  useEffect(() => {
    if (mood === 'excited' || mood === 'roasting' || mood === 'hand_raised') {
      triggerJumpAnimation();
    }
  }, [mood]);

  const triggerJumpAnimation = () => {
    jumpAnim.setValue(0);
    pulseAnim.setValue(0);
    Animated.parallel([
      Animated.sequence([
        Animated.timing(jumpAnim, {
          toValue: 1,
          duration: 280,
          easing: Easing.out(Easing.back(1.8)),
          useNativeDriver: true,
        }),
        Animated.spring(jumpAnim, {
          toValue: 0,
          friction: 4,
          tension: 65,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 750,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const speakClassmateLine = (line: string) => {
    setIsSpeaking(true);
    if (
      Platform.OS === 'web' &&
      typeof window !== 'undefined' &&
      'speechSynthesis' in window
    ) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(line);
        utterance.pitch = 1.4; // Cheerful 7-year-old voice pitch!
        utterance.rate = 1.08;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        return;
      } catch {
        // Fallback timer
      }
    }
    setTimeout(() => setIsSpeaking(false), 2600);
  };

  const handleAvatarTap = () => {
    triggerJumpAnimation();
    const quoteToSay = speechBubbleText || classmate.greetingQuote;
    speakClassmateLine(quoteToSay);
    if (onPress) onPress();
  };

  const translateY = Animated.add(
    floatAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [2, -7],
    }),
    jumpAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -18],
    })
  );

  const scale = jumpAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });

  const rotateZ = tiltAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-4deg', '4deg'],
  });

  const ringScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1.55],
  });

  const ringOpacity = pulseAnim.interpolate({
    inputRange: [0, 0.25, 1],
    outputRange: [0, 0.8, 0],
  });

  return (
    <Pressable onPress={handleAvatarTap} style={styles.wrapper}>
      <View
        style={{
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Expanding 3D Shockwave Ring */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.shockwaveRing,
            {
              width: size * 0.96,
              height: size * 0.96,
              borderRadius: size * 0.48,
              borderColor: classmate.accentColor,
              opacity: ringOpacity,
              transform: [{ scale: ringScale }],
            },
          ]}
        />

        {/* 3D Pedestal Floor Shadow */}
        <View
          style={[
            styles.floorShadow,
            {
              width: size * 0.68,
              height: size * 0.16,
              borderRadius: size * 0.1,
              backgroundColor: classmate.accentColor,
            },
          ]}
        />

        {/* Main 3D Animated Kid Medallion */}
        <Animated.View
          style={[
            styles.medallion3D,
            {
              width: size * 0.88,
              height: size * 0.88,
              borderRadius: size * 0.44,
              borderColor:
                mood === 'excited'
                  ? '#34D399'
                  : mood === 'roasting'
                  ? '#F43F5E'
                  : classmate.accentColor,
              backgroundColor: '#131C33',
              transform: [{ translateY }, { scale }, { rotateZ }],
            },
          ]}
        >
          {imageSource ? (
            <Image
              source={imageSource}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: size * 0.44,
              }}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[
                styles.emojiFallbackStage,
                { backgroundColor: classmate.accentBg },
              ]}
            >
              <Text style={{ fontSize: size * 0.44 }}>{classmate.avatarEmoji}</Text>
            </View>
          )}

          {/* Top Specular Gloss Highlight */}
          <View
            pointerEvents="none"
            style={[
              styles.glossHighlight,
              {
                width: size * 0.54,
                height: size * 0.18,
                borderRadius: size * 0.12,
              },
            ]}
          />
        </Animated.View>

        {/* Floating 3D Hat / Subject Prop Badges */}
        <Animated.View
          style={[
            styles.topLeftBadge,
            {
              backgroundColor: '#0F172A',
              borderColor: classmate.accentColor,
              transform: [{ translateY }],
            },
          ]}
        >
          <Text style={{ fontSize: Math.max(13, size * 0.16) }}>
            {mood === 'hand_raised'
              ? '🙋‍♂️'
              : mood === 'excited'
              ? '🎉'
              : mood === 'roasting'
              ? '🤭'
              : classmate.hatEmoji}
          </Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.bottomRightBadge,
            {
              backgroundColor: classmate.accentColor,
              transform: [{ translateY }],
            },
          ]}
        >
          <Text style={styles.ageTagText}>
            {isSpeaking ? '🔊' : `AGE ${classmate.age}`}
          </Text>
        </Animated.View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shockwaveRing: {
    position: 'absolute',
    borderWidth: 3,
  },
  floorShadow: {
    position: 'absolute',
    bottom: 1,
    opacity: 0.32,
    transform: [{ scaleY: 0.45 }],
  },
  medallion3D: {
    borderWidth: 3.5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 10,
  },
  emojiFallbackStage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glossHighlight: {
    position: 'absolute',
    top: 5,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  topLeftBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomRightBadge: {
    position: 'absolute',
    bottom: 2,
    right: -2,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#090D16',
  },
  ageTagText: {
    color: '#090D16',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
});
