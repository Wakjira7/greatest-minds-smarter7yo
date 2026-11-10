import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  ImageSourcePropType,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

/**
 * Instagram-style Stories ring + full-screen viewer.
 * Re-implemented from Astroway's `views/stories/viewStories.dart` (story_view package):
 * segmented progress bars, auto-advance per slide, tap left/right to navigate,
 * and automatic hand-off to the next person's story when one finishes.
 */

export interface StorySlide {
  text: string;
  caption?: string;
  durationMs?: number;
}

export interface StoryItem {
  id: string;
  name: string;
  accentColor: string;
  image?: ImageSourcePropType;
  emoji?: string;
  slides: StorySlide[];
}

interface StoriesRingProps {
  items: StoryItem[];
  seenIds: string[];
  onSeen?: (id: string) => void;
  onStoryCta?: (id: string) => void;
  ctaLabel?: string;
  title?: string;
  textColor?: string;
}

const DEFAULT_SLIDE_MS = 5000;

export const StoriesRing: React.FC<StoriesRingProps> = ({
  items,
  seenIds,
  onSeen,
  onStoryCta,
  ctaLabel,
  title,
  textColor = '#F8FAFC',
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Unseen stories first, like Instagram / Astroway home.
  const ordered = [...items].sort(
    (a, b) => Number(seenIds.includes(a.id)) - Number(seenIds.includes(b.id))
  );

  return (
    <View style={styles.ringWrap}>
      {title ? <Text style={[styles.ringTitle, { color: textColor }]}>{title}</Text> : null}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.ringRow}
      >
        {ordered.map((item, idx) => {
          const seen = seenIds.includes(item.id);
          return (
            <Pressable
              key={item.id}
              onPress={() => setOpenIndex(idx)}
              style={styles.ringItem}
              accessibilityRole="button"
              accessibilityLabel={`Open ${item.name} story`}
            >
              <View
                style={[
                  styles.ringOuter,
                  { borderColor: seen ? 'rgba(148,163,184,0.35)' : item.accentColor },
                ]}
              >
                <View style={styles.ringInner}>
                  {item.image ? (
                    <Image source={item.image} style={styles.ringImage} />
                  ) : (
                    <Text style={styles.ringEmoji}>{item.emoji ?? '✨'}</Text>
                  )}
                </View>
              </View>
              <Text style={[styles.ringName, { color: textColor }]} numberOfLines={1}>
                {item.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <StoryViewerModal
        items={ordered}
        startIndex={openIndex}
        onClose={() => setOpenIndex(null)}
        onSeen={onSeen}
        onCta={onStoryCta}
        ctaLabel={ctaLabel}
      />
    </View>
  );
};

interface StoryViewerModalProps {
  items: StoryItem[];
  startIndex: number | null;
  onClose: () => void;
  onSeen?: (id: string) => void;
  onCta?: (id: string) => void;
  ctaLabel?: string;
}

const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  items,
  startIndex,
  onClose,
  onSeen,
  onCta,
  ctaLabel,
}) => {
  const [personIdx, setPersonIdx] = useState(0);
  const [slideIdx, setSlideIdx] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;
  const animRef = useRef<Animated.CompositeAnimation | null>(null);

  const visible = startIndex !== null;
  const person = items[personIdx];
  const slide = person?.slides[slideIdx];

  useEffect(() => {
    if (startIndex !== null) {
      setPersonIdx(startIndex);
      setSlideIdx(0);
    }
  }, [startIndex]);

  const goNext = useCallback(() => {
    if (!person) return;
    if (slideIdx < person.slides.length - 1) {
      setSlideIdx((s) => s + 1);
      return;
    }
    onSeen?.(person.id);
    if (personIdx < items.length - 1) {
      setPersonIdx((p) => p + 1);
      setSlideIdx(0);
    } else {
      onClose();
    }
  }, [person, slideIdx, personIdx, items.length, onSeen, onClose]);

  const goPrev = () => {
    if (slideIdx > 0) {
      setSlideIdx((s) => s - 1);
    } else if (personIdx > 0) {
      setPersonIdx((p) => p - 1);
      setSlideIdx(0);
    }
  };

  useEffect(() => {
    if (!visible || !slide) return;
    progress.setValue(0);
    animRef.current?.stop();
    animRef.current = Animated.timing(progress, {
      toValue: 1,
      duration: slide.durationMs ?? DEFAULT_SLIDE_MS,
      easing: Easing.linear,
      useNativeDriver: false,
    });
    animRef.current.start(({ finished }) => {
      if (finished) goNext();
    });
    return () => animRef.current?.stop();
  }, [visible, personIdx, slideIdx, slide, progress, goNext]);

  if (!visible || !person || !slide) return null;

  return (
    <Modal visible transparent={false} animationType="fade" onRequestClose={onClose}>
      <View style={[styles.viewerRoot, { backgroundColor: '#05070F' }]}>
        {person.image ? (
          <Image source={person.image} style={styles.viewerBgImage} blurRadius={2} />
        ) : null}
        <View style={styles.viewerScrim} />

        {/* Segmented progress bars */}
        <View style={styles.progressRow}>
          {person.slides.map((_, i) => (
            <View key={i} style={styles.progressTrack}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: person.accentColor,
                    width:
                      i < slideIdx
                        ? '100%'
                        : i === slideIdx
                        ? progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%'],
                          })
                        : '0%',
                  },
                ]}
              />
            </View>
          ))}
        </View>

        <View style={styles.viewerHeader}>
          <View style={[styles.viewerAvatar, { borderColor: person.accentColor }]}>
            {person.image ? (
              <Image source={person.image} style={styles.ringImage} />
            ) : (
              <Text style={{ fontSize: 18 }}>{person.emoji ?? '✨'}</Text>
            )}
          </View>
          <Text style={styles.viewerName}>{person.name}</Text>
          <Pressable onPress={onClose} style={styles.viewerClose} accessibilityLabel="Close story">
            <Text style={styles.viewerCloseText}>✕</Text>
          </Pressable>
        </View>

        {/* Tap zones: left 35% = previous, right 65% = next */}
        <View style={styles.tapZones}>
          <Pressable style={{ flex: 35 }} onPress={goPrev} />
          <Pressable style={{ flex: 65 }} onPress={goNext} />
        </View>

        <View style={styles.slideCard} pointerEvents="box-none">
          <Text style={[styles.slideQuoteMark, { color: person.accentColor }]}>“</Text>
          <Text style={styles.slideText}>{slide.text}</Text>
          {slide.caption ? <Text style={styles.slideCaption}>{slide.caption}</Text> : null}
          {onCta && ctaLabel ? (
            <Pressable
              onPress={() => {
                onClose();
                onCta(person.id);
              }}
              style={[styles.ctaBtn, { backgroundColor: person.accentColor }]}
            >
              <Text style={styles.ctaText}>{ctaLabel}</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  ringWrap: { marginBottom: 12 },
  ringTitle: { fontSize: 13, fontWeight: '900', marginBottom: 8, letterSpacing: 0.3 },
  ringRow: { gap: 12, paddingRight: 8 },
  ringItem: { alignItems: 'center', width: 70 },
  ringOuter: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 2.5,
    padding: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringInner: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#131C33',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringImage: { width: '100%', height: '100%' },
  ringEmoji: { fontSize: 28 },
  ringName: { fontSize: 11, fontWeight: '700', marginTop: 5 },
  viewerRoot: { flex: 1 },
  viewerBgImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%', opacity: 0.55 },
  viewerScrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(5,7,15,0.45)' },
  progressRow: { flexDirection: 'row', gap: 4, paddingHorizontal: 10, paddingTop: 14 },
  progressTrack: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.28)',
    overflow: 'hidden',
  },
  progressFill: { height: '100%' },
  viewerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 12,
    gap: 10,
  },
  viewerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#131C33',
  },
  viewerName: { color: '#FFF', fontSize: 14, fontWeight: '900', flex: 1 },
  viewerClose: { padding: 8 },
  viewerCloseText: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  tapZones: { ...StyleSheet.absoluteFillObject, top: 80, flexDirection: 'row' },
  slideCard: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 60,
    backgroundColor: 'rgba(9,13,22,0.82)',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  slideQuoteMark: { fontSize: 46, fontWeight: '900', lineHeight: 46 },
  slideText: { color: '#F8FAFC', fontSize: 19, fontWeight: '800', lineHeight: 27 },
  slideCaption: { color: '#94A3B8', fontSize: 12, marginTop: 10, fontWeight: '600' },
  ctaBtn: { marginTop: 16, paddingVertical: 12, borderRadius: 14, alignItems: 'center' },
  ctaText: { color: '#090D16', fontSize: 14, fontWeight: '900' },
});
