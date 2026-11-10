import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

/**
 * "Ask the Minds" AI orb.
 * Re-implemented from Astroway's `home_widget/rippleAnimation.dart`:
 *  - One 2-second controller on repeat drives three concentric ripples
 *    (size 50 -> 250 scaled by ripple index, opacity 0.4 -> 0, easeOut).
 *  - A central avatar orb sits on top.
 *  - `RandomStringPicker` + `AnimatedHintTextField`: rotating suggested prompts
 *    shown as a typewriter hint in a fake input that opens the chat on tap.
 */

interface AskOrbProps {
  prompts: string[];
  accentColor: string;
  orbImage?: ImageSourcePropType;
  orbEmoji?: string;
  title: string;
  subtitle?: string;
  onAsk: (prompt: string) => void;
  surfaceColor?: string;
  textColor?: string;
  mutedColor?: string;
}

const RIPPLE_COUNT = 3;
const BASE_SIZE = 50;
const END_SIZE = 110; // scaled down from Astroway's 250 for a card layout

export const AskOrb: React.FC<AskOrbProps> = ({
  prompts,
  accentColor,
  orbImage,
  orbEmoji = '🔮',
  title,
  subtitle,
  onAsk,
  surfaceColor = '#111827',
  textColor = '#F8FAFC',
  mutedColor = '#94A3B8',
}) => {
  const controller = useRef(new Animated.Value(0)).current;
  const [promptIdx, setPromptIdx] = useState(0);
  const [typed, setTyped] = useState('');

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(controller, {
        toValue: 1,
        duration: 2000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [controller]);

  // Typewriter hint, then hold, then pick the next prompt.
  useEffect(() => {
    if (prompts.length === 0) return;
    const full = prompts[promptIdx % prompts.length];
    let i = 0;
    setTyped('');
    const typer = setInterval(() => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i >= full.length) clearInterval(typer);
    }, 38);
    const next = setTimeout(() => {
      // Random but never the same prompt twice in a row.
      let n = Math.floor(Math.random() * prompts.length);
      if (n === promptIdx % prompts.length) n = (n + 1) % prompts.length;
      setPromptIdx(n);
    }, full.length * 38 + 2200);
    return () => {
      clearInterval(typer);
      clearTimeout(next);
    };
  }, [promptIdx, prompts]);

  const currentPrompt = prompts[promptIdx % Math.max(1, prompts.length)] ?? '';

  return (
    <View style={[styles.card, { backgroundColor: surfaceColor, borderColor: accentColor + '55' }]}>
      <View style={styles.orbStage}>
        {Array.from({ length: RIPPLE_COUNT }, (_, k) => RIPPLE_COUNT - k).map((i) => {
          const scale = controller.interpolate({
            inputRange: [0, 1],
            outputRange: [(BASE_SIZE * i) / END_SIZE / RIPPLE_COUNT, i / RIPPLE_COUNT],
          });
          const opacity = controller.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0] });
          return (
            <Animated.View
              key={i}
              pointerEvents="none"
              style={[
                styles.ripple,
                {
                  backgroundColor: accentColor,
                  opacity,
                  transform: [{ scale }],
                },
              ]}
            />
          );
        })}
        <View style={[styles.orb, { borderColor: accentColor }]}>
          {orbImage ? (
            <Image source={orbImage} style={styles.orbImage} />
          ) : (
            <Text style={styles.orbEmoji}>{orbEmoji}</Text>
          )}
        </View>
      </View>

      <View style={styles.textCol}>
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        {subtitle ? <Text style={[styles.subtitle, { color: mutedColor }]}>{subtitle}</Text> : null}
        <Pressable
          onPress={() => onAsk(currentPrompt)}
          style={[styles.fakeInput, { borderColor: accentColor + '66' }]}
          accessibilityRole="button"
          accessibilityLabel={`Ask: ${currentPrompt}`}
        >
          <Text style={[styles.fakeInputText, { color: textColor }]} numberOfLines={2}>
            {typed}
            <Text style={{ color: accentColor }}>▍</Text>
          </Text>
          <View style={[styles.askBtn, { backgroundColor: accentColor }]}>
            <Text style={styles.askBtnText}>Ask ↑</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 22,
    borderWidth: 1,
    padding: 14,
    gap: 14,
    marginBottom: 14,
    overflow: 'hidden',
  },
  orbStage: { width: END_SIZE, height: END_SIZE, alignItems: 'center', justifyContent: 'center' },
  ripple: { position: 'absolute', width: END_SIZE, height: END_SIZE, borderRadius: END_SIZE / 2 },
  orb: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 2,
    overflow: 'hidden',
    backgroundColor: '#0B1021',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbImage: { width: '100%', height: '100%' },
  orbEmoji: { fontSize: 30 },
  textCol: { flex: 1 },
  title: { fontSize: 16, fontWeight: '900' },
  subtitle: { fontSize: 11.5, marginTop: 2, marginBottom: 8, fontWeight: '600' },
  fakeInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingLeft: 12,
    paddingVertical: 6,
    paddingRight: 6,
    backgroundColor: 'rgba(0,0,0,0.25)',
    gap: 8,
  },
  fakeInputText: { flex: 1, fontSize: 12.5, fontWeight: '700', minHeight: 34, textAlignVertical: 'center' },
  askBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  askBtnText: { color: '#090D16', fontSize: 12, fontWeight: '900' },
});
