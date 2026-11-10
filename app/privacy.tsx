import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Privacy Policy & Data Safety</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.badge}>DEVELOPER: WAKJIRA • EFFECTIVE DATE: OCTOBER 2026</Text>
          <Text style={styles.title}>
            Privacy Policy — Smarter Than a 7-Year-Old? & Talk to the Greatest Minds
          </Text>
          <Text style={styles.body}>
            Published by Wakjira (`com.wakjira.smarter7yo` & `com.wakjira.greatestminds`). We built
            our applications on an Offline-First, Privacy-By-Design architecture. No user account,
            email address, phone number, or cloud sign-in is required to use any core feature of
            this app.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>1. Local On-Device Data Storage</Text>
          <Text style={styles.body}>
            • All game progress, report cards, badges, daily streaks, coin balances, and chat
            transcripts are stored locally on your device using encrypted/sandboxed local storage
            (AsyncStorage).{'\n'}• You can export your data anytime to CSV, JSON, or HTML using the
            in-app Offline Export tool, or permanently delete all local history with a single tap
            ("Clear All History").
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>2. Advertising & EU/GDPR Consent (Google UMP)</Text>
          <Text style={styles.body}>
            • Free-tier sessions are supported by non-intrusive ads served via Google AdMob (and
            mediation partners).{'\n'}• Before any ad request is initialized, our Google UMP-style
            consent gate asks whether you prefer Personalized Ads or Contextual (Non-Personalized)
            Ads.{'\n'}• Users who purchase the one-time Pro Unlock ($3.99) or VIP Pass have all
            advertising permanently disabled.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>3. AI Mentor Consultations & Safety Reporting</Text>
          <Text style={styles.body}>
            • In "Talk to the Greatest Minds", mentor responses are generated for educational,
            philosophical, and entertainment purposes only (not professional medical, legal, or
            financial advice).{'\n'}• Every AI message includes a 1-tap "Report / Flag AI Response"
            button per Google Play 2026 Generative AI safety guidelines.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>4. Children’s Privacy & Family Compliance</Text>
          <Text style={styles.body}>
            • We do not knowingly collect personal identifiable information (PII) from children or
            adults. No account creation, location tracking, contact list access, or microphone
            recording is used.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>5. Contact & Data Deletion Requests</Text>
          <Text style={styles.body}>
            Because all progress is stored locally on your device, uninstalling the app or tapping
            "Clear All History" immediately erases 100% of your data. For support inquiries,
            contact Developer Wakjira at: support@wakjira.dev
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#090D16' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  backBtn: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  backText: { color: '#F8FAFC', fontSize: 13, fontWeight: '800' },
  headerTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: '900' },
  content: { padding: 16, paddingBottom: 40, maxWidth: 760, alignSelf: 'center', width: '100%' },
  card: {
    backgroundColor: '#131C2E',
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  badge: { color: '#34D399', fontSize: 10.5, fontWeight: '900', marginBottom: 6 },
  title: { color: '#F8FAFC', fontSize: 18, fontWeight: '900', marginBottom: 8 },
  sectionTitle: { color: '#FBBF24', fontSize: 15, fontWeight: '900', marginBottom: 6 },
  body: { color: '#CBD5E1', fontSize: 13, lineHeight: 20 },
});
