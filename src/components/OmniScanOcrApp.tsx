import React, { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  DEFAULT_M3_PRESET,
  MATERIAL_3_PRESETS,
  Material3PresetId,
} from '../constants/materialTheme';

interface OcrSampleDoc {
  id: string;
  title: string;
  type: 'PDF' | 'IMAGE' | 'TIFF' | 'DOCX';
  sizeLabel: string;
  pages: number;
  confidence: number;
  script: string;
  extractedText: string;
}

const INITIAL_DOCS: OcrSampleDoc[] = [
  {
    id: 'doc-1',
    title: 'Engineering_Handbook_2026_Scan.pdf',
    type: 'PDF',
    sizeLabel: '482.4 MB',
    pages: 312,
    confidence: 99.1,
    script: 'Latin + Technical Math (ML Kit + Tesseract 5)',
    extractedText:
      'SECTION 4.2 — ON-DEVICE STREAMING OCR ARCHITECTURE\n\nAll PDF pages are rendered one page at a time via Android PdfRenderer over a seekable ParcelFileDescriptor. Peak RAM remains below 45 MB even on 1 GB+ scanned archives.\n\n• Zero cloud uploads — 100% offline processing\n• Multi-script neural + LSTM recognition\n• Instant export to Searchable PDF (.pdf), Word (.docx), and Plain Text (.txt)',
  },
  {
    id: 'doc-2',
    title: '50MP_Contract_Invoice_Camera.jpg',
    type: 'IMAGE',
    sizeLabel: '28.6 MB',
    pages: 1,
    confidence: 98.7,
    script: 'Latin + Devanagari',
    extractedText:
      'INVOICE #INV-2026-8841\nDate: October 20, 2026\nVendor: Wakjira Offline Systems GmbH\n\nLine Items:\n1. Enterprise On-Device OCR Engine License — $0.00 (Included Offline)\n2. Large-File Streaming Module (1GB+ PDF / Multi-Page TIFF) — Active\n\nStatus: PAID IN FULL',
  },
  {
    id: 'doc-3',
    title: 'Medical_Archive_MultiPage_Scan.tiff',
    type: 'TIFF',
    sizeLabel: '164.0 MB',
    pages: 48,
    confidence: 97.9,
    script: 'Latin + CJK',
    extractedText:
      'ARCHIVE RECORD #TIFF-48-B\nDecoded via zero-copy RandomAccessFile IFD directory parser + Leptonica adaptive thresholding.\nAll 48 pages indexed in local SQLite FTS table for sub-10ms full-text search.',
  },
];

interface Props {
  onSwitchToPortfolio?: () => void;
  showPortfolioSwitcher?: boolean;
}

export function OmniScanOcrApp({
  onSwitchToPortfolio,
  showPortfolioSwitcher = false,
}: Props) {
  const [m3PresetId, setM3PresetId] =
    useState<Material3PresetId>(DEFAULT_M3_PRESET);
  const m3 = MATERIAL_3_PRESETS[m3PresetId];

  const [freeDailyRemaining, setFreeDailyRemaining] = useState<number>(1);
  const [ocrCoins, setOcrCoins] = useState<number>(5);
  const [isProUnlimited, setIsProUnlimited] = useState<boolean>(false);
  const [streakDays, setStreakDays] = useState<number>(3);
  const [xpPoints, setXpPoints] = useState<number>(140);
  const [activeTab, setActiveTab] = useState<'scanner' | 'vault' | 'rewards'>(
    'scanner'
  );
  const [selectedDocId, setSelectedDocId] = useState<string>(INITIAL_DOCS[0].id);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [docs, setDocs] = useState<OcrSampleDoc[]>(INITIAL_DOCS);
  const [selectedScript, setSelectedScript] = useState<string>('Auto (Latin + Multi-Script)');

  const selectedDoc = useMemo(
    () => docs.find((d) => d.id === selectedDocId) || docs[0],
    [docs, selectedDocId]
  );

  const filteredDocs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return docs;
    return docs.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.extractedText.toLowerCase().includes(q)
    );
  }, [docs, searchQuery]);

  const handleScanPages = (pageCount: number, label: string) => {
    if (isProUnlimited) {
      addScannedDoc(pageCount, label);
      return;
    }
    const totalAvailable = freeDailyRemaining + ocrCoins;
    if (totalAvailable < pageCount) {
      Alert.alert(
        'Quota Reached (1 Free Page/Day)',
        `This job requires ${pageCount} page(s), and you have ${freeDailyRemaining} free page + ${ocrCoins} OCR Coins (${totalAvailable} total).\n\nWatch a Rewarded Ad for +3 Coins or unlock Monthly/Lifetime Pro!`,
        [
          {
            text: 'Watch Ad (+3 Coins)',
            onPress: () => {
              setOcrCoins((c) => c + 3);
              setXpPoints((x) => x + 15);
            },
          },
          {
            text: 'Unlock Pro ($3.99 Lifetime)',
            onPress: () => setIsProUnlimited(true),
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
      return;
    }

    let rem = pageCount;
    if (freeDailyRemaining > 0) {
      const usedFree = Math.min(freeDailyRemaining, rem);
      setFreeDailyRemaining((f) => f - usedFree);
      rem -= usedFree;
    }
    if (rem > 0) {
      setOcrCoins((c) => Math.max(0, c - rem));
    }
    addScannedDoc(pageCount, label);
  };

  const addScannedDoc = (pageCount: number, label: string) => {
    const newDoc: OcrSampleDoc = {
      id: `doc-${Date.now()}`,
      title: `${label}_${pageCount}p_Offline.pdf`,
      type: pageCount > 1 ? 'PDF' : 'IMAGE',
      sizeLabel: pageCount > 20 ? '318.2 MB' : '14.8 MB',
      pages: pageCount,
      confidence: 99.2,
      script: selectedScript,
      extractedText: `OFFLINE DUAL-ENGINE OCR OUTPUT (${pageCount} Page${
        pageCount > 1 ? 's' : ''
      })\nEngine: Google ML Kit v2 + Tesseract 5 LSTM\nScript: ${selectedScript}\n\nAll ${pageCount} page(s) were processed 100% on-device using chunked BitmapRegionDecoder & PdfRenderer streaming with zero network activity.`,
    };
    setDocs((prev) => [newDoc, ...prev]);
    setSelectedDocId(newDoc.id);
    setXpPoints((x) => x + pageCount * 10);
  };

  return (
    <View style={[styles.container, { backgroundColor: m3.background }]}>
      {/* Top Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: m3.surface, borderBottomColor: m3.outline },
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: m3.textPrimary }]}>
            OmniScan: Offline PDF OCR Pro
          </Text>
          <Text style={[styles.subtitle, { color: m3.textSecondary }]}>
            100% On-Device • 1GB+ PDF & 50MP Tiling • Dual ML Kit + Tesseract 5
          </Text>
        </View>
        {showPortfolioSwitcher && onSwitchToPortfolio ? (
          <Pressable
            onPress={onSwitchToPortfolio}
            style={[
              styles.switchBtn,
              { backgroundColor: m3.primaryContainer, borderColor: m3.primary },
            ]}
          >
            <Text style={[styles.switchBtnText, { color: m3.onPrimaryContainer }]}>
              Switch App
            </Text>
          </Pressable>
        ) : null}
      </View>

      {/* Quota & Coins Bar */}
      <View
        style={[
          styles.quotaBar,
          { backgroundColor: m3.surfaceElevated, borderColor: m3.outline },
        ]}
      >
        <View style={styles.quotaPill}>
          <Text style={[styles.quotaLabel, { color: m3.textSecondary }]}>
            FREE TODAY
          </Text>
          <Text style={[styles.quotaVal, { color: m3.primary }]}>
            {isProUnlimited ? '∞ PRO' : `${freeDailyRemaining}/1 Page`}
          </Text>
        </View>
        <View style={styles.quotaPill}>
          <Text style={[styles.quotaLabel, { color: m3.textSecondary }]}>
            OCR COINS
          </Text>
          <Text style={[styles.quotaVal, { color: '#F59E0B' }]}>
            🪙 {ocrCoins}
          </Text>
        </View>
        <View style={styles.quotaPill}>
          <Text style={[styles.quotaLabel, { color: m3.textSecondary }]}>
            STREAK / XP
          </Text>
          <Text style={[styles.quotaVal, { color: '#10B981' }]}>
            🔥 {streakDays}d • {xpPoints} XP
          </Text>
        </View>
        <Pressable
          onPress={() => {
            setOcrCoins((c) => c + 3);
            setXpPoints((x) => x + 15);
          }}
          style={[styles.adButton, { backgroundColor: m3.primary }]}
        >
          <Text style={[styles.adButtonText, { color: m3.onPrimary }]}>
            🎬 +3 Coins
          </Text>
        </Pressable>
      </View>

      {/* Material You Theme Bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.themeScroll}
        contentContainerStyle={styles.themeRow}
      >
        {(Object.keys(MATERIAL_3_PRESETS) as Material3PresetId[]).map((id) => {
          const p = MATERIAL_3_PRESETS[id];
          const active = id === m3PresetId;
          return (
            <Pressable
              key={id}
              onPress={() => setM3PresetId(id)}
              style={[
                styles.themeChip,
                {
                  backgroundColor: active ? p.primaryContainer : m3.surface,
                  borderColor: active ? p.primary : m3.outline,
                },
              ]}
            >
              <Text
                style={{
                  color: active ? p.onPrimaryContainer : m3.textSecondary,
                  fontSize: 11,
                  fontWeight: '700',
                }}
              >
                {p.emoji} {p.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === 'scanner' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: m3.textPrimary }]}>
              Offline On-Device OCR Scanner
            </Text>
            <View style={styles.scriptRow}>
              {[
                'Auto (Latin + Multi-Script)',
                'Chinese / Japanese / Korean',
                'Devanagari / Hindi',
                'Tesseract 5 High-Density Book',
              ].map((s) => (
                <Pressable
                  key={s}
                  onPress={() => setSelectedScript(s)}
                  style={[
                    styles.scriptChip,
                    {
                      backgroundColor:
                        selectedScript === s ? m3.primaryContainer : m3.surface,
                      borderColor:
                        selectedScript === s ? m3.primary : m3.outline,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color:
                        selectedScript === s
                          ? m3.onPrimaryContainer
                          : m3.textSecondary,
                      fontSize: 11,
                      fontWeight: '600',
                    }}
                  >
                    {s}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.actionGrid}>
              <Pressable
                onPress={() => handleScanPages(1, 'Camera_50MP_Photo')}
                style={[
                  styles.actionCard,
                  { backgroundColor: m3.surface, borderColor: m3.primary },
                ]}
              >
                <Text style={styles.actionEmoji}>📷</Text>
                <Text style={[styles.actionTitle, { color: m3.textPrimary }]}>
                  Scan 1 Photo / Page
                </Text>
                <Text style={[styles.actionSub, { color: m3.textSecondary }]}>
                  Uses 1 Free Daily Page or 1 Coin • 50MP Region Tiling
                </Text>
              </Pressable>

              <Pressable
                onPress={() => handleScanPages(5, 'MultiPage_Contract')}
                style={[
                  styles.actionCard,
                  { backgroundColor: m3.surface, borderColor: m3.outline },
                ]}
              >
                <Text style={styles.actionEmoji}>📄</Text>
                <Text style={[styles.actionTitle, { color: m3.textPrimary }]}>
                  Stream 5-Page PDF
                </Text>
                <Text style={[styles.actionSub, { color: m3.textSecondary }]}>
                  Uses Free Page + Coins • 1-Page-at-a-Time PdfRenderer
                </Text>
              </Pressable>

              <Pressable
                onPress={() => handleScanPages(50, 'Massive_Archive_500MB')}
                style={[
                  styles.actionCard,
                  { backgroundColor: m3.surface, borderColor: m3.outline },
                ]}
              >
                <Text style={styles.actionEmoji}>📚</Text>
                <Text style={[styles.actionTitle, { color: m3.textPrimary }]}>
                  Stream 500MB+ Book (50p)
                </Text>
                <Text style={[styles.actionSub, { color: m3.textSecondary }]}>
                  Zero OOM Streaming • Foreground Service + WakeLock
                </Text>
              </Pressable>
            </View>

            {/* Active Document Output */}
            <View
              style={[
                styles.previewBox,
                { backgroundColor: m3.surface, borderColor: m3.outline },
              ]}
            >
              <Text style={[styles.previewHeader, { color: m3.primary }]}>
                {selectedDoc.title} ({selectedDoc.sizeLabel} • {selectedDoc.pages}{' '}
                pages • {selectedDoc.confidence}% conf)
              </Text>
              <Text style={[styles.previewScript, { color: m3.textSecondary }]}>
                Engine: {selectedDoc.script}
              </Text>
              <Text style={[styles.previewBody, { color: m3.textPrimary }]}>
                {selectedDoc.extractedText}
              </Text>
              <View style={styles.exportRow}>
                {['Export Searchable .PDF', 'Export .DOCX', 'Export .TXT'].map(
                  (btn) => (
                    <Pressable
                      key={btn}
                      onPress={() =>
                        Alert.alert(
                          'Offline Export Complete',
                          `${selectedDoc.title} exported via streaming writer with zero cloud calls.`
                        )
                      }
                      style={[
                        styles.exportBtn,
                        {
                          backgroundColor: m3.primaryContainer,
                          borderColor: m3.primary,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          color: m3.onPrimaryContainer,
                          fontSize: 11,
                          fontWeight: '700',
                        }}
                      >
                        {btn}
                      </Text>
                    </Pressable>
                  )
                )}
              </View>
            </View>
          </View>
        )}

        {activeTab === 'vault' && (
          <View style={styles.section}>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search inside all scanned PDFs & OCR text..."
              placeholderTextColor={m3.textMuted}
              style={[
                styles.searchInput,
                {
                  backgroundColor: m3.surface,
                  color: m3.textPrimary,
                  borderColor: m3.outline,
                },
              ]}
            />
            {filteredDocs.map((d) => (
              <Pressable
                key={d.id}
                onPress={() => {
                  setSelectedDocId(d.id);
                  setActiveTab('scanner');
                }}
                style={[
                  styles.docRow,
                  { backgroundColor: m3.surface, borderColor: m3.outline },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.docTitle, { color: m3.textPrimary }]}>
                    {d.title}
                  </Text>
                  <Text style={[styles.docMeta, { color: m3.textSecondary }]}>
                    {d.type} • {d.sizeLabel} • {d.pages} pages • {d.confidence}%
                  </Text>
                </View>
                <Text style={{ color: m3.primary, fontWeight: '700' }}>
                  Open →
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {activeTab === 'rewards' && (
          <View style={styles.section}>
            <View
              style={[
                styles.rewardCard,
                { backgroundColor: m3.surface, borderColor: m3.primary },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: m3.textPrimary }]}>
                7-Day OCR Streak & Coin Quests
              </Text>
              <Text style={[styles.actionSub, { color: m3.textSecondary }]}>
                1 Free Page resets every day at midnight. Watch rewarded ads for
                +3 Coins (3 pages) or subscribe for unlimited 1GB+ PDF batch OCR!
              </Text>
              <View style={styles.exportRow}>
                <Pressable
                  onPress={() => {
                    setStreakDays((s) => Math.min(7, s + 1));
                    setOcrCoins((c) => c + 2);
                  }}
                  style={[
                    styles.exportBtn,
                    { backgroundColor: m3.primary, borderColor: m3.primary },
                  ]}
                >
                  <Text style={{ color: m3.onPrimary, fontWeight: '700', fontSize: 12 }}>
                    🔥 Claim Daily Streak (+2 Coins)
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setIsProUnlimited(true)}
                  style={[
                    styles.exportBtn,
                    {
                      backgroundColor: m3.primaryContainer,
                      borderColor: m3.primary,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: m3.onPrimaryContainer,
                      fontWeight: '700',
                      fontSize: 12,
                    }}
                  >
                    👑 Go Pro ($4.99/mo or $3.99 Lifetime)
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}

        {/* Copyright, Offline User Content Disclaimer & Open-Source Licenses */}
        <View
          style={[
            styles.previewBox,
            {
              backgroundColor: m3.surface,
              borderColor: m3.outline,
              marginTop: 14,
            },
          ]}
        >
          <Text style={[styles.previewHeader, { color: m3.textPrimary }]}>
            ⚖️ Copyright, Offline Privacy & Open-Source Notices
          </Text>
          <Text style={[styles.actionSub, { color: m3.textSecondary }]}>
            © 2026 Wakjira Shewangzaw Dabi. All rights reserved. Proprietary and
            confidential.
          </Text>
          <Text style={[styles.actionSub, { color: m3.textSecondary }]}>
            • 100% On-Device Processing: All OCR, PDF rendering, and exports run
            locally on your phone. No user documents are ever uploaded to any
            server. Users are solely responsible for ensuring they have the
            legal right to scan and extract text from their documents.
          </Text>
          <Text style={[styles.actionSub, { color: m3.textSecondary }]}>
            • Open-Source Attributions: Includes components licensed under
            Apache 2.0 & MIT (Google ML Kit Text Recognition, Tesseract4Android,
            Apache POI, AndroidX Jetpack, React Native, Expo, Lucide Icons).
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View
        style={[
          styles.bottomNav,
          { backgroundColor: m3.surface, borderTopColor: m3.outline },
        ]}
      >
        {(
          [
            { id: 'scanner', label: '📷 Offline Scanner' },
            { id: 'vault', label: `🗂️ Vault (${docs.length})` },
            { id: 'rewards', label: '🪙 Coins & Pro' },
          ] as const
        ).map((tab) => {
          const active = activeTab === tab.id;
          return (
            <Pressable
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={[
                styles.navBtn,
                active && { backgroundColor: m3.primaryContainer },
              ]}
            >
              <Text
                style={{
                  color: active ? m3.onPrimaryContainer : m3.textSecondary,
                  fontWeight: '700',
                  fontSize: 12,
                }}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  title: { fontSize: 17, fontWeight: '800' },
  subtitle: { fontSize: 11, marginTop: 2 },
  switchBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  switchBtnText: { fontSize: 11, fontWeight: '700' },
  quotaBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 12,
    marginTop: 10,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  quotaPill: { alignItems: 'center' },
  quotaLabel: { fontSize: 9, fontWeight: '700' },
  quotaVal: { fontSize: 13, fontWeight: '800', marginTop: 2 },
  adButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  adButtonText: { fontSize: 11, fontWeight: '800' },
  themeScroll: { maxHeight: 42, marginTop: 8 },
  themeRow: { paddingHorizontal: 12, gap: 8, alignItems: 'center' },
  themeChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  scrollContent: { padding: 12, paddingBottom: 32 },
  section: { gap: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '800' },
  scriptRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  scriptChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  actionGrid: { gap: 10 },
  actionCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  actionEmoji: { fontSize: 22 },
  actionTitle: { fontSize: 14, fontWeight: '800', marginTop: 4 },
  actionSub: { fontSize: 11, marginTop: 2 },
  previewBox: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },
  previewHeader: { fontSize: 13, fontWeight: '800' },
  previewScript: { fontSize: 11, fontWeight: '600' },
  previewBody: { fontSize: 12, lineHeight: 18, marginTop: 4 },
  exportRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  exportBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  searchInput: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 13,
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  docTitle: { fontSize: 13, fontWeight: '700' },
  docMeta: { fontSize: 11, marginTop: 2 },
  rewardCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    padding: 8,
    gap: 8,
  },
  navBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
});
