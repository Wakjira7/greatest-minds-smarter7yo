import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  StyleSheet,
} from 'react-native';
import { MonetizationState } from '../types/chat';
import { getApiConnectionStatus } from '../services/chatService';

interface ApiCostDashboardModalProps {
  visible: boolean;
  onClose: () => void;
  monetization: MonetizationState;
  onSaveSettings: (settings: {
    monthlyBudgetCapUsd?: number;
    customGeminiApiKey?: string;
  }) => Promise<void>;
}

const SIMULATOR_PRESETS = [
  { label: '100 Users', users: 100 },
  { label: '500 Users', users: 500 },
  { label: '2,500 Users', users: 2500 },
  { label: '10,000 Users', users: 10000 },
];

export const ApiCostDashboardModal: React.FC<ApiCostDashboardModalProps> = ({
  visible,
  onClose,
  monetization,
  onSaveSettings,
}) => {
  const [apiKeyInput, setApiKeyInput] = useState(monetization.customGeminiApiKey || '');
  const [budgetCapInput, setBudgetCapInput] = useState(
    String(monetization.monthlyBudgetCapUsd || 25)
  );
  const [simUsers, setSimUsers] = useState(100);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    if (visible) {
      setApiKeyInput(monetization.customGeminiApiKey || '');
      setBudgetCapInput(String(monetization.monthlyBudgetCapUsd || 25));
      setSavedNotice(false);
    }
  }, [visible, monetization.customGeminiApiKey, monetization.monthlyBudgetCapUsd]);

  const connectionStatus = getApiConnectionStatus(monetization.customGeminiApiKey);

  const totalTokens =
    (monetization.totalInputTokens || 0) + (monetization.totalOutputTokens || 0);
  const totalCost = monetization.totalEstimatedApiCostUsd || 0;
  const totalRevenue = monetization.totalEstimatedRevenueUsd || 0;
  const netProfit = totalRevenue - totalCost;
  const budgetCap = monetization.monthlyBudgetCapUsd || 25;
  const budgetProgressPct = Math.min(100, (totalCost / Math.max(0.01, budgetCap)) * 100);

  // Simulator math based on 20% Pro ($6.99/mo -> $5.94 net) + 80% Free (Rewarded Ads + Flash-Lite)
  const simProUsers = Math.round(simUsers * 0.2);
  const simFreeUsers = simUsers - simProUsers;
  const simGrossRevenue = simProUsers * 6.99 + simFreeUsers * 0.18; // Pro subs + AdMob rewarded video ads
  const simStoreNetRevenue = simProUsers * 5.94 + simFreeUsers * 0.18;
  const simApiCostFlashLite = simFreeUsers * 0.02; // 3 msgs/day on Flash-Lite
  const simApiCostPro = simProUsers * 0.92; // Pro users on Flash / Argon
  const simTotalApiCost = simApiCostFlashLite + simApiCostPro;
  const simNetProfit = simStoreNetRevenue - simTotalApiCost;

  const handleSave = async () => {
    const parsedCap = parseFloat(budgetCapInput);
    await onSaveSettings({
      monthlyBudgetCapUsd: Number.isFinite(parsedCap) && parsedCap > 0 ? parsedCap : 25,
      customGeminiApiKey: apiKeyInput.trim(),
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <View style={styles.headerBadgeRow}>
                <Text style={styles.headerBadge}>ADMIN TELEMETRY & BILLING</Text>
                <View
                  style={[
                    styles.statusPill,
                    {
                      backgroundColor: connectionStatus.connected
                        ? 'rgba(16,185,129,0.18)'
                        : 'rgba(56,189,248,0.18)',
                      borderColor: connectionStatus.connected ? '#10B981' : '#38BDF8',
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.statusDot,
                      {
                        backgroundColor: connectionStatus.connected
                          ? '#10B981'
                          : '#38BDF8',
                      },
                    ]}
                  />
                  <Text
                    style={[
                      styles.statusPillText,
                      {
                        color: connectionStatus.connected ? '#34D399' : '#7DD3FC',
                      },
                    ]}
                  >
                    {connectionStatus.connected ? 'LIVE API CONNECTED' : 'ZERO-COST PREVIEW'}
                  </Text>
                </View>
              </View>
              <Text style={styles.title}>⚡ API Usage, Cost & Profit Meter</Text>
              <Text style={styles.subtitle}>{connectionStatus.label}</Text>
            </View>

            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 18, paddingBottom: 36 }}
            showsVerticalScrollIndicator={false}
          >
            {/* 1. Connection & Cost Protection Banner */}
            <View
              style={[
                styles.connectionCard,
                {
                  borderColor: connectionStatus.connected
                    ? 'rgba(16,185,129,0.4)'
                    : 'rgba(56,189,248,0.4)',
                },
              ]}
            >
              <Text style={styles.sectionTitle}>
                {connectionStatus.connected
                  ? '🟢 Your Live Gemini API is Active'
                  : '🛡️ Currently in Zero-Cost Preview Mode ($0.00 Billed)'}
              </Text>
              <Text style={styles.connectionDesc}>
                {connectionStatus.connected
                  ? 'Every chat message uses real Gemini tokens and is metered below in real time. Your 8-message sliding context window and Monthly Spend Cap automatically protect you from heavy users.'
                  : 'Right now, no external API key is billed—you are paying $0.00 while testing all 200 Greatest Minds! Even in Preview Mode, our telemetry engine calculates the exact tokens and USD cost you WOULD pay in production.'}
              </Text>
            </View>

            {/* 2. Live Token & Cost Telemetry Grid */}
            <Text style={styles.groupHeading}>📊 REAL-TIME DEVICE USAGE & PROFIT</Text>
            <View style={styles.metricsGrid}>
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>Messages Sent</Text>
                <Text style={styles.metricValue}>
                  {monetization.totalMessagesSent || 0}
                </Text>
                <Text style={styles.metricSub}>8-msg context cap active</Text>
              </View>

              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>Total Tokens Used</Text>
                <Text style={styles.metricValue}>{totalTokens.toLocaleString()}</Text>
                <Text style={styles.metricSub}>
                  In: {monetization.totalInputTokens || 0} • Out:{' '}
                  {monetization.totalOutputTokens || 0}
                </Text>
              </View>

              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>Est. Gemini API Cost</Text>
                <Text style={[styles.metricValue, { color: '#FBBF24' }]}>
                  ${totalCost.toFixed(4)}
                </Text>
                <Text style={styles.metricSub}>
                  ~${((totalCost / Math.max(1, monetization.totalMessagesSent || 1))).toFixed(5)} / msg
                </Text>
              </View>

              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>Net Profit (Rev - Cost)</Text>
                <Text
                  style={[
                    styles.metricValue,
                    { color: netProfit >= 0 ? '#34D399' : '#F87171' },
                  ]}
                >
                  {netProfit >= 0 ? '+' : ''}${netProfit.toFixed(2)}
                </Text>
                <Text style={styles.metricSub}>
                  Net Rev: ${totalRevenue.toFixed(2)}
                </Text>
              </View>
            </View>

            {/* 3. Hard Monthly Spend Cap Bar */}
            <View style={styles.budgetCard}>
              <View style={styles.budgetHeaderRow}>
                <Text style={styles.budgetTitle}>🔒 Monthly API Spend Guardrail</Text>
                <Text style={styles.budgetAmount}>
                  ${totalCost.toFixed(4)} / ${budgetCap.toFixed(2)} cap
                </Text>
              </View>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${ Math.max(2, budgetProgressPct) }%`,
                      backgroundColor:
                        budgetProgressPct > 85 ? '#EF4444' : '#10B981',
                    },
                  ]}
                />
              </View>
              <Text style={styles.budgetHint}>
                If monthly API usage ever reaches your ${budgetCap.toFixed(2)} cap, the app
                automatically switches all users from Gemini 4 Argon ($0.0014/msg) down to
                ultra-cheap Gemini 3.1 Flash-Lite ($0.0003/msg) so you never lose money.
              </Text>
            </View>

            {/* 4. Exact Cost Per Message Reference Table */}
            <Text style={styles.groupHeading}>💡 HOW MUCH EACH AI MESSAGE COSTS YOU</Text>
            <View style={styles.tableCard}>
              <View style={styles.tableRowHeader}>
                <Text style={[styles.tableCellHeader, { flex: 1.5 }]}>Model Tier</Text>
                <Text style={styles.tableCellHeader}>1 Message</Text>
                <Text style={styles.tableCellHeader}>1,000 Msgs</Text>
              </View>
              <View style={styles.tableRow}>
                <View style={{ flex: 1.5 }}>
                  <Text style={styles.modelName}>⚡ Gemini 3.1 Flash-Lite</Text>
                  <Text style={styles.modelRole}>Free Users & Coin Packs</Text>
                </View>
                <Text style={styles.tableCell}>$0.00036</Text>
                <Text style={[styles.tableCell, { color: '#34D399' }]}>$0.36</Text>
              </View>
              <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
                <View style={{ flex: 1.5 }}>
                  <Text style={styles.modelName}>🧠 Gemini 4 Argon (Pro)</Text>
                  <Text style={styles.modelRole}>Paid $6.99/mo VIP Subscribers</Text>
                </View>
                <Text style={styles.tableCell}>$0.00142</Text>
                <Text style={[styles.tableCell, { color: '#FBBF24' }]}>$1.42</Text>
              </View>
            </View>

            {/* 5. Interactive User Scale Profit Simulator */}
            <Text style={styles.groupHeading}>🚀 MONTHLY BILL & PROFIT FORECASTER</Text>
            <View style={styles.simulatorCard}>
              <View style={styles.simPresetRow}>
                {SIMULATOR_PRESETS.map((preset) => {
                  const active = simUsers === preset.users;
                  return (
                    <Pressable
                      key={preset.users}
                      onPress={() => setSimUsers(preset.users)}
                      style={[
                        styles.simPresetBtn,
                        active && styles.simPresetBtnActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.simPresetText,
                          active && styles.simPresetTextActive,
                        ]}
                      >
                        {preset.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <View style={styles.simResultRow}>
                <View style={styles.simCol}>
                  <Text style={styles.simLabel}>Your Google API Bill</Text>
                  <Text style={[styles.simValue, { color: '#FBBF24' }]}>
                    -${simTotalApiCost.toFixed(2)}/mo
                  </Text>
                  <Text style={styles.simSub}>
                    {simFreeUsers} Free + {simProUsers} Pro
                  </Text>
                </View>
                <View style={styles.simCol}>
                  <Text style={styles.simLabel}>Net Store + Ad Revenue</Text>
                  <Text style={[styles.simValue, { color: '#38BDF8' }]}>
                    +${simStoreNetRevenue.toFixed(2)}/mo
                  </Text>
                  <Text style={styles.simSub}>After 15% Google Play cut</Text>
                </View>
                <View style={styles.simCol}>
                  <Text style={styles.simLabel}>Your Pure Profit</Text>
                  <Text style={[styles.simValue, { color: '#34D399' }]}>
                    +${simNetProfit.toFixed(2)}/mo
                  </Text>
                  <Text style={styles.simSub}>
                    +${(simNetProfit * 12).toFixed(0)} / year
                  </Text>
                </View>
              </View>
            </View>

            {/* 6. Connect API Key & Set Spend Cap */}
            <Text style={styles.groupHeading}>🔑 CONNECT YOUR GEMINI API & SET BUDGET CAP</Text>
            <View style={styles.settingsCard}>
              <Text style={styles.inputLabel}>
                1. Direct Gemini API Key (Optional — from aistudio.google.com/apikey)
              </Text>
              <TextInput
                value={apiKeyInput}
                onChangeText={setApiKeyInput}
                placeholder="AIzaSy... (Leave empty for $0.00 Preview Mode)"
                placeholderTextColor="#64748B"
                secureTextEntry
                style={styles.textInput}
              />
              <Text style={styles.inputHelper}>
                • For testing on your phone/PC: paste your key above to talk to live Gemini immediately.{'\n'}
                • For public Google Play release: keep your key inside Supabase Edge Functions (`supabase secrets set GEMINI_API_KEY=...`) so users can never inspect it.
              </Text>

              <Text style={[styles.inputLabel, { marginTop: 14 }]}>
                2. Hard Monthly Budget Cap ($ USD)
              </Text>
              <TextInput
                value={budgetCapInput}
                onChangeText={setBudgetCapInput}
                placeholder="25.00"
                placeholderTextColor="#64748B"
                keyboardType="numeric"
                style={styles.textInput}
              />

              <Pressable onPress={handleSave} style={styles.saveBtn}>
                <Text style={styles.saveBtnText}>
                  {savedNotice ? '✓ Settings Saved & Applied!' : 'Save API & Budget Settings'}
                </Text>
              </Pressable>
            </View>

            {/* 7. Where to Check Official Google Billing */}
            <View style={styles.whereToCheckCard}>
              <Text style={styles.whereTitle}>
                🌐 Where to Check Your Official Google Bill & Usage
              </Text>
              <Text style={styles.whereItem}>
                1. <Text style={styles.whereBold}>Google AI Studio Usage Dashboard</Text>:{' '}
                Go to <Text style={styles.codeInline}>aistudio.google.com/usage</Text> to see
                your live requests per minute, daily token graphs, and exact dollar spend.
              </Text>
              <Text style={styles.whereItem}>
                2. <Text style={styles.whereBold}>Google Cloud Billing Budget Alerts</Text>:{' '}
                In <Text style={styles.codeInline}>console.cloud.google.com/billing</Text>,
                set an email alert at $5, $15, and $25 so Google emails you immediately.
              </Text>
              <Text style={styles.whereItem}>
                3. <Text style={styles.whereBold}>Inside This App (Real-Time)</Text>: Every
                chat bubble now displays its exact token count and cost (e.g.,{' '}
                <Text style={styles.codeInline}>312 tok • $0.0003</Text>).
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(4, 7, 20, 0.85)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#0B1021',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    height: '90%',
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  headerBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  headerBadge: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 19,
    fontWeight: '900',
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: '#E2E8F0',
    fontSize: 15,
    fontWeight: '800',
  },
  connectionCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderRadius: 18,
    padding: 15,
    borderWidth: 1,
    marginBottom: 18,
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 6,
  },
  connectionDesc: {
    color: '#CBD5E1',
    fontSize: 12,
    lineHeight: 18,
  },
  groupHeading: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.1,
    marginBottom: 10,
    marginTop: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  metricBox: {
    width: '48%',
    backgroundColor: '#131C33',
    borderRadius: 16,
    padding: 13,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  metricLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
  },
  metricValue: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '900',
    marginVertical: 4,
  },
  metricSub: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '600',
  },
  budgetCard: {
    backgroundColor: '#131C33',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 18,
  },
  budgetHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  budgetTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '800',
  },
  budgetAmount: {
    color: '#34D399',
    fontSize: 12,
    fontWeight: '800',
  },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  budgetHint: {
    color: '#94A3B8',
    fontSize: 11,
    lineHeight: 16,
  },
  tableCard: {
    backgroundColor: '#131C33',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 18,
  },
  tableRowHeader: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  tableCellHeader: {
    flex: 1,
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  modelName: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '800',
  },
  modelRole: {
    color: '#64748B',
    fontSize: 10,
    marginTop: 2,
  },
  tableCell: {
    flex: 1,
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '800',
  },
  simulatorCard: {
    backgroundColor: '#131C33',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 18,
  },
  simPresetRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  simPresetBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  simPresetBtnActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    borderColor: '#38BDF8',
  },
  simPresetText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
  },
  simPresetTextActive: {
    color: '#F8FAFC',
    fontWeight: '900',
  },
  simResultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  simCol: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    padding: 10,
    borderRadius: 12,
  },
  simLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
  },
  simValue: {
    fontSize: 15,
    fontWeight: '900',
    marginVertical: 4,
  },
  simSub: {
    color: '#64748B',
    fontSize: 9,
  },
  settingsCard: {
    backgroundColor: '#131C33',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 18,
  },
  inputLabel: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#090D1A',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#F8FAFC',
    fontSize: 13,
  },
  inputHelper: {
    color: '#94A3B8',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 6,
  },
  saveBtn: {
    marginTop: 14,
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#04130D',
    fontSize: 13,
    fontWeight: '900',
  },
  whereToCheckCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  whereTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
  },
  whereItem: {
    color: '#CBD5E1',
    fontSize: 11,
    lineHeight: 17,
    marginBottom: 6,
  },
  whereBold: {
    color: '#F8FAFC',
    fontWeight: '800',
  },
  codeInline: {
    color: '#38BDF8',
    fontWeight: '700',
  },
});
