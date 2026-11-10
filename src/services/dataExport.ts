import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Share } from 'react-native';
import { KID_CLASSMATES } from '../constants/smarter7yoData';
import { loadMonetizationState, saveMonetizationState } from './monetization';
import { loadSmarterProgress, SMARTER_BADGES, SmarterProgress } from './smarterProgress';

export type ExportFormat = 'csv' | 'json' | 'report_html';

export interface ExportResult {
  ok: boolean;
  filename: string;
  content: string;
  rowCount: number;
  summaryText: string;
}

function escapeCsvCell(val: unknown): string {
  const s = String(val ?? '');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/**
 * Triggers a local file download on Web or opens the native OS Share sheet on Android/iOS.
 */
export async function deliverExportFile(
  filename: string,
  content: string,
  mimeType: string
): Promise<void> {
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    try {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return;
    } catch {
      // Fall back to Share API
    }
  }
  try {
    await Share.share({
      title: filename,
      message: content,
    });
  } catch {
    // Non-fatal
  }
}

/**
 * Exports App #1 ("Talk to the Greatest Minds") offline wallet, XP ledger, and saved chat history.
 * Directly satisfies Google Play's 2026 "Minimum Functionality" offline export requirement.
 */
export async function exportGreatestMindsData(format: ExportFormat): Promise<ExportResult> {
  const state = await loadMonetizationState();
  const dateTag = new Date().toISOString().slice(0, 10);

  if (format === 'csv') {
    const header = ['Transaction ID', 'Timestamp ISO', 'Type', 'Title', 'Amount / Delta'];
    const rows = state.transactions.map((tx) => [
      escapeCsvCell(tx.id),
      escapeCsvCell(new Date(tx.timestamp).toISOString()),
      escapeCsvCell(tx.type),
      escapeCsvCell(tx.title),
      escapeCsvCell(tx.amountText),
    ]);
    const csv = [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const filename = `greatest-minds-ledger-${dateTag}.csv`;
    await deliverExportFile(filename, csv, 'text/csv;charset=utf-8');
    return {
      ok: true,
      filename,
      content: csv,
      rowCount: rows.length,
      summaryText: `Exported ${rows.length} ledger rows (${state.xpPoints} XP, ${state.coinBalance} coins) to ${filename}`,
    };
  }

  if (format === 'json') {
    const payload = {
      schemaVersion: '2026.1',
      app: 'Talk to the Greatest Minds',
      exportedAt: new Date().toISOString(),
      offlineFirst: true,
      monetizationState: state,
    };
    const json = JSON.stringify(payload, null, 2);
    const filename = `greatest-minds-backup-${dateTag}.json`;
    await deliverExportFile(filename, json, 'application/json;charset=utf-8');
    return {
      ok: true,
      filename,
      content: json,
      rowCount: state.transactions.length,
      summaryText: `Full offline JSON backup saved to ${filename}`,
    };
  }

  // Printable HTML Summary Report
  const txRowsHtml = state.transactions
    .map(
      (tx) =>
        `<tr><td>${new Date(tx.timestamp).toLocaleString()}</td><td>${tx.type.toUpperCase()}</td><td>${tx.title}</td><td><strong>${tx.amountText}</strong></td></tr>`
    )
    .join('');

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Talk to the Greatest Minds — Wisdom Portfolio Report</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #090D16; color: #F8FAFC; padding: 32px; }
    .card { background: #131C2E; border: 1px solid #334155; border-radius: 16px; padding: 24px; margin-bottom: 20px; }
    h1 { color: #FBBF24; margin-top: 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    th, td { border-bottom: 1px solid #1E293B; padding: 10px; text-align: left; font-size: 13px; }
    th { color: #94A3B8; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🏛️ Talk to the Greatest Minds — Offline Wisdom Report</h1>
    <p>Generated: ${new Date().toLocaleString()} • 100% Offline Local Storage • Zero Cloud Tracking</p>
    <p><strong>Plan:</strong> ${state.plan} | <strong>XP:</strong> ${state.xpPoints} | <strong>Streak:</strong> ${state.streakDay} days | <strong>Coin Balance:</strong> ${state.coinBalance} 🪙</p>
  </div>
  <div class="card">
    <h2>📒 Activity & Coin Ledger (${state.transactions.length} entries)</h2>
    <table>
      <thead><tr><th>Date</th><th>Type</th><th>Activity</th><th>Delta</th></tr></thead>
      <tbody>${txRowsHtml}</tbody>
    </table>
  </div>
</body>
</html>`;
  const filename = `greatest-minds-report-${dateTag}.html`;
  await deliverExportFile(filename, html, 'text/html;charset=utf-8');
  return {
    ok: true,
    filename,
    content: html,
    rowCount: state.transactions.length,
    summaryText: `Printable HTML Wisdom Report saved to ${filename}`,
  };
}

/**
 * Exports App #2 ("Are You Smarter Than a 7-Year-Old?") scholarship run history & earned badges.
 */
export async function exportSmarter7YoData(
  format: ExportFormat,
  progressArg?: SmarterProgress
): Promise<ExportResult> {
  const progress = progressArg ?? (await loadSmarterProgress());
  const dateTag = new Date().toISOString().slice(0, 10);
  const accuracy =
    progress.totalAnswered > 0
      ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100)
      : 0;

  if (format === 'csv') {
    const header = [
      'Run ID',
      'Date ISO',
      'Won $1M',
      'Rung Reached (1-10)',
      'Prize Earned',
      'IQ Score',
      'Classmate Partner',
    ];
    const rows = progress.history.map((run) => {
      const kid = KID_CLASSMATES.find((k) => k.id === run.classmateId);
      return [
        escapeCsvCell(run.id),
        escapeCsvCell(run.date),
        escapeCsvCell(run.won ? 'YES' : 'NO'),
        escapeCsvCell(run.rungReached),
        escapeCsvCell(run.prizeLabel),
        escapeCsvCell(run.iqScore),
        escapeCsvCell(kid?.name ?? run.classmateId),
      ];
    });
    const csv = [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const filename = `smarter-7yo-report-card-${dateTag}.csv`;
    await deliverExportFile(filename, csv, 'text/csv;charset=utf-8');
    return {
      ok: true,
      filename,
      content: csv,
      rowCount: rows.length,
      summaryText: `Exported ${rows.length} trivia runs (${accuracy}% accuracy) to ${filename}`,
    };
  }

  if (format === 'json') {
    const payload = {
      schemaVersion: '2026.1',
      app: 'Are You Smarter Than a 7-Year-Old?',
      exportedAt: new Date().toISOString(),
      offlineFirst: true,
      smarterProgress: progress,
    };
    const json = JSON.stringify(payload, null, 2);
    const filename = `smarter-7yo-backup-${dateTag}.json`;
    await deliverExportFile(filename, json, 'application/json;charset=utf-8');
    return {
      ok: true,
      filename,
      content: json,
      rowCount: progress.history.length,
      summaryText: `Full offline JSON report card saved to ${filename}`,
    };
  }

  const badgeNames = SMARTER_BADGES.filter((b) => progress.earnedBadgeIds.includes(b.id))
    .map((b) => `${b.emoji} ${b.title}`)
    .join(' • ');

  const runRowsHtml = progress.history
    .map((run) => {
      const kid = KID_CLASSMATES.find((k) => k.id === run.classmateId);
      return `<tr><td>${new Date(run.date).toLocaleDateString()}</td><td>Rung ${run.rungReached}/10</td><td><strong>${run.prizeLabel}</strong></td><td>${run.iqScore}</td><td>${kid?.name ?? run.classmateId}</td></tr>`;
    })
    .join('');

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Are You Smarter Than a 7-Year-Old? — Official Report Card</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #090D16; color: #F8FAFC; padding: 32px; }
    .card { background: #131C2E; border: 1px solid #334155; border-radius: 16px; padding: 24px; margin-bottom: 20px; }
    h1 { color: #FBBF24; margin-top: 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    th, td { border-bottom: 1px solid #1E293B; padding: 10px; text-align: left; font-size: 13px; }
    th { color: #94A3B8; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🎒 Official Academy Report Card — Are You Smarter Than a 7-Year-Old?</h1>
    <p>Generated: ${new Date().toLocaleString()} • 100% Offline Local Storage</p>
    <p><strong>Best Rung:</strong> #${progress.bestRung}/10 | <strong>Accuracy:</strong> ${accuracy}% | <strong>Best Streak:</strong> 🔥 ${progress.bestStreak} | <strong>Badges:</strong> ${progress.earnedBadgeIds.length}/${SMARTER_BADGES.length}</p>
    <p><strong>Unlocked Badges:</strong> ${badgeNames || 'None yet'}</p>
  </div>
  <div class="card">
    <h2>🕘 Scholarship Run History (${progress.history.length} runs)</h2>
    <table>
      <thead><tr><th>Date</th><th>Grade Rung</th><th>Scholarship</th><th>IQ Est.</th><th>7-Yo Partner</th></tr></thead>
      <tbody>${runRowsHtml}</tbody>
    </table>
  </div>
</body>
</html>`;
  const filename = `smarter-7yo-transcript-${dateTag}.html`;
  await deliverExportFile(filename, html, 'text/html;charset=utf-8');
  return {
    ok: true,
    filename,
    content: html,
    rowCount: progress.history.length,
    summaryText: `Printable HTML Report Card saved to ${filename}`,
  };
}

/**
 * Restores an offline JSON backup for either app without requiring an account login.
 */
export async function importOfflineBackupJson(rawJson: string): Promise<{
  ok: boolean;
  message: string;
}> {
  try {
    const parsed = JSON.parse(rawJson);
    if (parsed.monetizationState && typeof parsed.monetizationState === 'object') {
      await saveMonetizationState(parsed.monetizationState);
      return {
        ok: true,
        message: 'Restored "Talk to the Greatest Minds" wallet, XP, and offline progress!',
      };
    }
    if (parsed.smarterProgress && typeof parsed.smarterProgress === 'object') {
      await AsyncStorage.setItem(
        '@smarter_7yo_progress_v1',
        JSON.stringify(parsed.smarterProgress)
      );
      return {
        ok: true,
        message: 'Restored "Are You Smarter Than a 7-Year-Old?" Report Card & Badges!',
      };
    }
    return {
      ok: false,
      message: 'Unrecognized JSON schema. Expected a Greatest Minds or Smarter 7Yo backup file.',
    };
  } catch {
    return {
      ok: false,
      message: 'Invalid JSON text. Paste a valid exported backup payload.',
    };
  }
}
