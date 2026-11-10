import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { KID_CLASSMATES } from '../constants/smarter7yoData';
import { maybeShowInterstitial } from '../services/adsManager';
import { ExportFormat, exportSmarter7YoData } from '../services/dataExport';
import { SMARTER_BADGES, SmarterProgress } from '../services/smarterProgress';

/**
 * "My Report Card" panel.
 * Combines:
 *  - SnapReels My List segmented control (History | Visual Charts | Badges) + Clear All History
 *  - Astroway's "N badges earned" achievement grid
 *  - 2026 Google Play "Minimum Functionality" Compliance:
 *      1. Offline local persistence (no account required)
 *      2. Visual charts of saved local data (Rung Progression Bar Chart & Grade Tier Breakdown)
 *      3. Local file export (CSV, JSON backup, Printable HTML Transcript) with 1s interstitial transition guard
 */

interface ReportCardPanelProps {
  progress: SmarterProgress;
  accentColor: string;
  surfaceColor: string;
  onClearHistory: () => void;
  isAdFree?: boolean;
}

export const ReportCardPanel: React.FC<ReportCardPanelProps> = ({
  progress,
  accentColor,
  surfaceColor,
  onClearHistory,
  isAdFree = false,
}) => {
  const [tab, setTab] = useState<'history' | 'charts' | 'badges'>('history');
  const [exportStatus, setExportStatus] = useState<string | null>(null);

  const earned = progress.earnedBadgeIds.length;
  const accuracy =
    progress.totalAnswered > 0
      ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100)
      : 0;

  const handleExport = async (format: ExportFormat) => {
    const res = await exportSmarter7YoData(format, progress);
    setExportStatus(`✅ ${res.summaryText}`);
    // 2026 AdMob Policy: trigger preloaded interstitial (with 1s transition guard) only after milestone actions
    await maybeShowInterstitial({ isAdFree });
  };

  // Compute visual chart metrics from saved local runs
  const recentRuns = [...progress.history].slice(0, 8).reverse();
  const elementaryCount = progress.history.filter((r) => r.rungReached <= 3).length;
  const middleCount = progress.history.filter((r) => r.rungReached >= 4 && r.rungReached <= 7).length;
  const honorsCount = progress.history.filter((r) => r.rungReached >= 8).length;
  const totalRuns = Math.max(1, progress.history.length);

  return (
    <View style={[styles.card, { backgroundColor: surfaceColor }]}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>📒 My Offline Report Card</Text>
        <Text style={styles.offlineTag}>100% OFFLINE • ZERO LOGIN</Text>
      </View>

      <View style={styles.statsRow}>
        <Stat label="Best Rung" value={progress.bestRung ? `#${progress.bestRung}` : '—'} />
        <Stat label="Accuracy" value={`${accuracy}%`} />
        <Stat label="Best Streak" value={`🔥 ${progress.bestStreak}`} />
        <Stat label="Badges" value={`${earned}/${SMARTER_BADGES.length}`} />
      </View>

      {/* 2026 Minimum Functionality: Offline Export Action Bar (CSV / JSON / Printable Report) */}
      <View style={styles.exportRow}>
        <Pressable
          onPress={() => handleExport('csv')}
          style={[styles.exportBtn, { borderColor: accentColor + '66' }]}
        >
          <Text style={[styles.exportBtnText, { color: accentColor }]}>📄 Export CSV</Text>
        </Pressable>
        <Pressable
          onPress={() => handleExport('json')}
          style={[styles.exportBtn, { borderColor: '#38BDF866' }]}
        >
          <Text style={[styles.exportBtnText, { color: '#38BDF8' }]}>📦 JSON Backup</Text>
        </Pressable>
        <Pressable
          onPress={() => handleExport('report_html')}
          style={[styles.exportBtn, { borderColor: '#A78BFA66' }]}
        >
          <Text style={[styles.exportBtnText, { color: '#A78BFA' }]}>🖨️ Transcript</Text>
        </Pressable>
      </View>

      {exportStatus ? <Text style={styles.exportNotice}>{exportStatus}</Text> : null}

      <View style={styles.segment}>
        {(['history', 'charts', 'badges'] as const).map((t) => {
          const active = tab === t;
          return (
            <Pressable
              key={t}
              onPress={() => setTab(t)}
              style={[styles.segmentBtn, active && { backgroundColor: accentColor }]}
            >
              <Text style={[styles.segmentText, active && { color: '#090D16' }]}>
                {t === 'history' ? '🕘 History' : t === 'charts' ? '📊 Charts' : '🏅 Badges'}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {tab === 'history' ? (
        <View>
          {progress.history.length === 0 ? (
            <Text style={styles.empty}>
              No runs yet — climb the ladder to fill your offline report card!
            </Text>
          ) : (
            <>
              <Pressable onPress={onClearHistory} style={styles.clearBtn}>
                <Text style={styles.clearText}>🗑️ Clear All History</Text>
              </Pressable>
              {progress.history.slice(0, 8).map((run) => {
                const kid = KID_CLASSMATES.find((k) => k.id === run.classmateId);
                return (
                  <View key={run.id} style={styles.runRow}>
                    <View
                      style={[
                        styles.runArt,
                        { backgroundColor: (kid?.accentColor ?? accentColor) + '33' },
                      ]}
                    >
                      <Text style={{ fontSize: 22 }}>
                        {run.won ? '👑' : kid?.avatarEmoji ?? '🎒'}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.runTitle}>
                        {run.won ? 'Won $1,000,000!' : `Reached ${run.prizeLabel}`}
                      </Text>
                      <Text style={[styles.runSub, { color: accentColor }]}>
                        Rung {run.rungReached}/10 • IQ {run.iqScore} • with{' '}
                        {kid?.name ?? 'classmate'}
                      </Text>
                    </View>
                    <Text style={styles.runDate}>
                      {new Date(run.date).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Text>
                  </View>
                );
              })}
            </>
          )}
        </View>
      ) : tab === 'charts' ? (
        <View style={styles.chartsContainer}>
          <Text style={styles.chartTitle}>📈 Recent Rung Climb Progression (Out of 10)</Text>
          {recentRuns.length === 0 ? (
            <Text style={styles.empty}>Play at least 1 game to unlock visual performance charts!</Text>
          ) : (
            <View style={styles.barChartBox}>
              {recentRuns.map((r, idx) => {
                const heightPct = Math.max(12, Math.round((r.rungReached / 10) * 100));
                return (
                  <View key={r.id} style={styles.barCol}>
                    <Text style={styles.barTopLabel}>#{r.rungReached}</Text>
                    <View style={styles.barTrack}>
                      <View
                        style={[
                          styles.barFill,
                          {
                            height: `${heightPct}%`,
                            backgroundColor: r.won ? '#34D399' : accentColor,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.barBottomLabel}>G{idx + 1}</Text>
                  </View>
                );
              })}
            </View>
          )}

          <Text style={[styles.chartTitle, { marginTop: 14 }]}>
            🎯 Grade Tier Reach Distribution ({progress.history.length} Total Runs)
          </Text>
          <View style={styles.distBox}>
            <DistRow
              label="Grades 1–3 (Rungs 1–3)"
              count={elementaryCount}
              pct={Math.round((elementaryCount / totalRuns) * 100)}
              color="#38BDF8"
            />
            <DistRow
              label="Grades 4–5 (Rungs 4–7)"
              count={middleCount}
              pct={Math.round((middleCount / totalRuns) * 100)}
              color="#FBBF24"
            />
            <DistRow
              label="Honors & $1M (Rungs 8–10)"
              count={honorsCount}
              pct={Math.round((honorsCount / totalRuns) * 100)}
              color="#34D399"
            />
          </View>
        </View>
      ) : (
        <View style={styles.badgeGrid}>
          {SMARTER_BADGES.map((b) => {
            const has = progress.earnedBadgeIds.includes(b.id);
            return (
              <View
                key={b.id}
                style={[
                  styles.badgeCell,
                  has && { borderColor: accentColor, backgroundColor: accentColor + '1A' },
                ]}
              >
                <Text style={[styles.badgeEmoji, !has && { opacity: 0.25 }]}>{b.emoji}</Text>
                <Text style={[styles.badgeTitle, !has && { color: '#64748B' }]}>{b.title}</Text>
                <Text style={styles.badgeDesc}>{b.desc}</Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.stat}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const DistRow: React.FC<{ label: string; count: number; pct: number; color: string }> = ({
  label,
  count,
  pct,
  color,
}) => (
  <View style={{ marginBottom: 8 }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
      <Text style={{ color: '#CBD5E1', fontSize: 11.5, fontWeight: '700' }}>{label}</Text>
      <Text style={{ color, fontSize: 11.5, fontWeight: '900' }}>
        {count} ({pct}%)
      </Text>
    </View>
    <View style={styles.horizTrack}>
      <View style={[styles.horizFill, { width: `${Math.max(4, pct)}%`, backgroundColor: color }]} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    padding: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  heading: { color: '#F8FAFC', fontSize: 16, fontWeight: '900' },
  offlineTag: {
    color: '#34D399',
    fontSize: 9.5,
    fontWeight: '900',
    backgroundColor: 'rgba(52,211,153,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  stat: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 12,
    paddingVertical: 9,
    alignItems: 'center',
  },
  statValue: { color: '#F8FAFC', fontSize: 15, fontWeight: '900' },
  statLabel: { color: '#94A3B8', fontSize: 10, fontWeight: '700', marginTop: 2 },
  exportRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  exportBtn: {
    flex: 1,
    borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.28)',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  exportBtnText: { fontSize: 11, fontWeight: '800' },
  exportNotice: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 14,
    padding: 4,
    marginBottom: 12,
  },
  segmentBtn: { flex: 1, paddingVertical: 10, borderRadius: 11, alignItems: 'center' },
  segmentText: { color: '#94A3B8', fontSize: 12.5, fontWeight: '900' },
  empty: { color: '#94A3B8', fontSize: 13, textAlign: 'center', paddingVertical: 16 },
  clearBtn: { alignSelf: 'flex-start', marginBottom: 8, paddingVertical: 4 },
  clearText: { color: '#FB7185', fontSize: 12, fontWeight: '800' },
  runRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(0,0,0,0.22)',
    borderRadius: 14,
    padding: 10,
    marginBottom: 8,
  },
  runArt: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  runTitle: { color: '#F8FAFC', fontSize: 14, fontWeight: '900' },
  runSub: { fontSize: 11.5, fontWeight: '800', marginTop: 2 },
  runDate: { color: '#64748B', fontSize: 11, fontWeight: '700' },
  chartsContainer: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 14,
    padding: 12,
  },
  chartTitle: { color: '#E2E8F0', fontSize: 12.5, fontWeight: '800', marginBottom: 8 },
  barChartBox: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 110,
    paddingTop: 14,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingBottom: 6,
  },
  barCol: { alignItems: 'center', flex: 1 },
  barTopLabel: { color: '#94A3B8', fontSize: 9.5, fontWeight: '800', marginBottom: 3 },
  barTrack: {
    width: 16,
    height: 68,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: { width: '100%', borderRadius: 6 },
  barBottomLabel: { color: '#64748B', fontSize: 9.5, fontWeight: '700', marginTop: 3 },
  distBox: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 12,
    padding: 10,
  },
  horizTrack: {
    height: 7,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  horizFill: { height: '100%', borderRadius: 4 },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  badgeCell: {
    width: '48%',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 10,
    alignItems: 'center',
  },
  badgeEmoji: { fontSize: 28 },
  badgeTitle: { color: '#F8FAFC', fontSize: 12.5, fontWeight: '900', marginTop: 4 },
  badgeDesc: { color: '#94A3B8', fontSize: 10.5, textAlign: 'center', marginTop: 2 },
});
