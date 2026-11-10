import React, { useRef, useState } from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

/**
 * First-run onboarding pager.
 * Re-implemented from SnapReels `OnboardingScreen.kt`: a HorizontalPager of
 * FeaturePage(title, description, icon) slides, dot indicator, a Next button that
 * animates to the next page, and a Skip/Get Started finish.
 */

export interface OnboardingPage {
  emoji: string;
  title: string;
  description: string;
  accentColor: string;
}

interface OnboardingPagerProps {
  pages: OnboardingPage[];
  onFinish: () => void;
  backgroundColor?: string;
  finishLabel?: string;
}

export const OnboardingPager: React.FC<OnboardingPagerProps> = ({
  pages,
  onFinish,
  backgroundColor = '#070B19',
  finishLabel = 'Get Started',
}) => {
  const scrollRef = useRef<ScrollView>(null);
  const [page, setPage] = useState(0);
  const [width, setWidth] = useState(Math.min(Dimensions.get('window').width, 920));

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const p = Math.round(e.nativeEvent.contentOffset.x / width);
    if (p !== page) setPage(p);
  };

  const goNext = () => {
    if (page >= pages.length - 1) {
      onFinish();
      return;
    }
    scrollRef.current?.scrollTo({ x: (page + 1) * width, animated: true });
    setPage(page + 1);
  };

  const accent = pages[page]?.accentColor ?? '#F59E0B';

  return (
    <View
      style={[styles.root, { backgroundColor }]}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      <Pressable onPress={onFinish} style={styles.skip}>
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        onScroll={onScroll}
        scrollEventThrottle={32}
      >
        {pages.map((p, i) => (
          <View key={i} style={[styles.page, { width }]}>
            <View style={[styles.iconHalo, { borderColor: p.accentColor, backgroundColor: p.accentColor + '1F' }]}>
              <Text style={styles.icon}>{p.emoji}</Text>
            </View>
            <Text style={styles.title}>{p.title}</Text>
            <Text style={styles.desc}>{p.description}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {pages.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === page ? { width: 24, backgroundColor: accent } : null,
              ]}
            />
          ))}
        </View>
        <Pressable onPress={goNext} style={[styles.nextBtn, { backgroundColor: accent }]}>
          <Text style={styles.nextText}>
            {page >= pages.length - 1 ? finishLabel : 'Next →'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, width: '100%', maxWidth: 920, alignSelf: 'center' },
  skip: { position: 'absolute', top: 16, right: 18, zIndex: 2, padding: 8 },
  skipText: { color: '#94A3B8', fontSize: 14, fontWeight: '800' },
  page: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  iconHalo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  icon: { fontSize: 68 },
  title: { color: '#F8FAFC', fontSize: 26, fontWeight: '900', textAlign: 'center' },
  desc: {
    color: '#CBD5E1',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 12,
    maxWidth: 420,
  },
  footer: { paddingHorizontal: 24, paddingBottom: 34, gap: 18 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.25)' },
  nextBtn: { paddingVertical: 15, borderRadius: 16, alignItems: 'center' },
  nextText: { color: '#090D16', fontSize: 16, fontWeight: '900' },
});
