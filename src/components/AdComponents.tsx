import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  AdNetwork,
  loadConsentStatus,
  pickNetwork,
  recordBannerImpression,
  setConsentStatus,
  subscribeInterstitialTransition,
} from '../services/adsManager';

/**
 * First-launch privacy consent (EEA/GDPR), preview of the Google UMP form,
 * PLUS the 2026 AdMob 1-second Interstitial Transition Guard overlay that prevents
 * accidental finger taps (and 30-day Invalid Traffic account freezes).
 */
export const AdConsentGate: React.FC<{ appName: string; accentColor?: string }> = ({
  appName,
  accentColor = '#F59E0B',
}) => {
  const [visible, setVisible] = useState(false);
  const [transitionState, setTransitionState] = useState<{
    active: boolean;
    network?: AdNetwork;
  }>({ active: false });

  useEffect(() => {
    let mounted = true;
    loadConsentStatus().then((s) => {
      if (mounted && s === 'unknown') setVisible(true);
    });
    const unsub = subscribeInterstitialTransition((next) => {
      if (mounted) setTransitionState(next);
    });
    return () => {
      mounted = false;
      unsub();
    };
  }, []);

  const choose = async (status: 'personalized' | 'non_personalized') => {
    await setConsentStatus(status);
    setVisible(false);
  };

  return (
    <>
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.backdrop}>
          <View style={styles.card}>
            <Text style={styles.icon}>🔐</Text>
            <Text style={styles.title}>{appName} asks for your consent</Text>
            <Text style={styles.body}>
              We and our partners (Google AdMob, AppLovin MAX, Meta) use device identifiers to
              show ads that keep this app free. Per EU/GDPR & Google UMP v4.0 policy, consent is
              collected before initializing the MobileAds SDK. You can choose personalised ads or
              contextual non-personalised ads anytime.
            </Text>
            <Pressable
              onPress={() => choose('personalized')}
              style={[styles.primary, { backgroundColor: accentColor }]}
            >
              <Text style={styles.primaryText}>Consent (Personalised Ads)</Text>
            </Pressable>
            <Pressable onPress={() => choose('non_personalized')} style={styles.secondary}>
              <Text style={styles.secondaryText}>Do not consent (Contextual Ads Only)</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* 2026 AdMob Anti-Invalid-Traffic 1-Second Transition Guard */}
      <Modal visible={transitionState.active} transparent animationType="fade">
        <View style={styles.transitionBackdrop}>
          <View style={styles.transitionCard}>
            <Text style={styles.transitionIcon}>⏳</Text>
            <Text style={styles.transitionTitle}>Saving Your Progress...</Text>
            <Text style={styles.transitionSub}>
              Preparing brief sponsor break ({(transitionState.network ?? 'admob').toUpperCase()})
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
};

/**
 * Adaptive banner slot, docked above the bottom navigation with an enforced
 * 16dp top safety buffer (prevents accidental clicks & AdMob layout policy violations).
 * Hidden for Pro / $3.99 One-Time Unlock users.
 */
export const AdBannerSlot: React.FC<{
  hidden?: boolean;
  onRemoveAds?: () => void;
  surfaceColor?: string;
}> = ({ hidden, onRemoveAds, surfaceColor = '#0F172A' }) => {
  const [network, setNetwork] = useState<AdNetwork>('admob');

  useEffect(() => {
    if (!hidden) {
      setNetwork(pickNetwork('banner'));
      recordBannerImpression();
    }
  }, [hidden]);

  if (hidden) return null;
  return (
    <View style={styles.bannerSafeZone}>
      <View style={[styles.banner, { backgroundColor: surfaceColor }]}>
        <View style={styles.adTag}>
          <Text style={styles.adTagText}>AD • {network.toUpperCase()}</Text>
        </View>
        <Text style={styles.bannerText} numberOfLines={1}>
          Enjoying the app? Go 100% Ad-Free Forever + Unlock Offline Exports
        </Text>
        {onRemoveAds ? (
          <Pressable onPress={onRemoveAds} style={styles.removeBtn}>
            <Text style={styles.removeText}>Remove Ads ($3.99)</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(4,7,20,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 22,
  },
  icon: { fontSize: 34, textAlign: 'center', marginBottom: 6 },
  title: { color: '#0F172A', fontSize: 18, fontWeight: '900', textAlign: 'center' },
  body: { color: '#334155', fontSize: 13, lineHeight: 19, marginTop: 10, marginBottom: 16 },
  primary: { paddingVertical: 13, borderRadius: 12, alignItems: 'center' },
  primaryText: { color: '#0F172A', fontSize: 14, fontWeight: '900' },
  secondary: { paddingVertical: 12, alignItems: 'center', marginTop: 6 },
  secondaryText: { color: '#2563EB', fontSize: 13, fontWeight: '700' },
  transitionBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(6, 10, 22, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  transitionCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    paddingVertical: 22,
    paddingHorizontal: 26,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.45)',
    maxWidth: 360,
  },
  transitionIcon: { fontSize: 32, marginBottom: 8 },
  transitionTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: '900' },
  transitionSub: {
    color: '#94A3B8',
    fontSize: 11.5,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 6,
  },
  /** Enforces the 2026 AdMob 16dp minimum separation from interactive UI controls above. */
  bannerSafeZone: {
    marginTop: 16,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    minHeight: 50,
  },
  adTag: { backgroundColor: '#FBBF24', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 },
  adTagText: { color: '#0F172A', fontSize: 9.5, fontWeight: '900' },
  bannerText: { flex: 1, color: '#94A3B8', fontSize: 11.5, fontWeight: '600' },
  removeBtn: {
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.6)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  removeText: { color: '#FBBF24', fontSize: 11, fontWeight: '800' },
});
