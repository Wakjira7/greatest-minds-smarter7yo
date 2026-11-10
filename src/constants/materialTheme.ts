// Google Material Design 3 (Material You) Tonal Color & Shape System
// Change DEFAULT_M3_PRESET below or tap the in-app "🎨 Material You" bar to switch themes live!

export type Material3PresetId =
  | 'm3_gold_dark'
  | 'm3_violet_dark'
  | 'm3_emerald_dark'
  | 'm3_ocean_dark'
  | 'm3_ghibli_light';

export interface Material3Theme {
  id: Material3PresetId;
  name: string;
  badgeEmoji: string;
  emoji: string;
  isDark: boolean;
  // M3 Core Tonal Surfaces
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
  // M3 Primary & Secondary Tonal Containers
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  // M3 Text & Outlines
  onSurface: string;
  onSurfaceVariant: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  outline: string;
  outlineVariant: string;
  // M3 Shape Tokens (Corner Radii)
  shapeExtraLarge: number; // 28dp (Hero stage & Bottom sheets)
  shapeLarge: number; // 20dp (Advisor cards)
  shapeMedium: number; // 12dp (Inner boxes & inputs)
  shapeFilterChip: number; // 8dp (Official M3 Filter Chip corner radius)
  shapeFullPill: number; // 999dp (M3 Navigation indicator pill & Segmented buttons)
}

export const MATERIAL_3_PRESETS: Record<Material3PresetId, Material3Theme> = {
  m3_gold_dark: {
    id: 'm3_gold_dark',
    name: 'M3 Gold Dark',
    badgeEmoji: '✨',
    emoji: '✨',
    isDark: true,
    background: '#0F131A',
    surface: '#131822',
    surfaceElevated: '#232C3D',
    surfaceContainerLow: '#171D29',
    surfaceContainer: '#1B2230',
    surfaceContainerHigh: '#232C3D',
    surfaceContainerHighest: '#2C374B',
    primary: '#F59E0B',
    onPrimary: '#261900',
    primaryContainer: '#5C3900',
    onPrimaryContainer: '#FFDEA6',
    secondaryContainer: '#334155',
    onSecondaryContainer: '#F8FAFC',
    onSurface: '#F1F5F9',
    onSurfaceVariant: '#94A3B8',
    textPrimary: '#F1F5F9',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    outline: '#475569',
    outlineVariant: 'rgba(148, 163, 184, 0.22)',
    shapeExtraLarge: 28,
    shapeLarge: 22,
    shapeMedium: 14,
    shapeFilterChip: 8,
    shapeFullPill: 999,
  },
  m3_violet_dark: {
    id: 'm3_violet_dark',
    name: 'M3 Dynamic Violet',
    badgeEmoji: '🔮',
    emoji: '🔮',
    isDark: true,
    background: '#12101B',
    surface: '#161324',
    surfaceElevated: '#2A2444',
    surfaceContainerLow: '#1C182D',
    surfaceContainer: '#211C36',
    surfaceContainerHigh: '#2A2444',
    surfaceContainerHighest: '#352E54',
    primary: '#C084FC',
    onPrimary: '#2E1065',
    primaryContainer: '#4C1D95',
    onPrimaryContainer: '#F3E8FF',
    secondaryContainer: '#3B2F63',
    onSecondaryContainer: '#EDE9FE',
    onSurface: '#F5F3FF',
    onSurfaceVariant: '#A78BFA',
    textPrimary: '#F5F3FF',
    textSecondary: '#A78BFA',
    textMuted: '#7C3AED',
    outline: '#5B21B6',
    outlineVariant: 'rgba(192, 132, 252, 0.24)',
    shapeExtraLarge: 28,
    shapeLarge: 22,
    shapeMedium: 14,
    shapeFilterChip: 8,
    shapeFullPill: 999,
  },
  m3_emerald_dark: {
    id: 'm3_emerald_dark',
    name: 'M3 Ghibli Forest',
    badgeEmoji: '🌿',
    emoji: '🌿',
    isDark: true,
    background: '#0C1613',
    surface: '#101E1A',
    surfaceElevated: '#203A33',
    surfaceContainerLow: '#142621',
    surfaceContainer: '#192E28',
    surfaceContainerHigh: '#203A33',
    surfaceContainerHighest: '#28473F',
    primary: '#34D399',
    onPrimary: '#022C22',
    primaryContainer: '#065F46',
    onPrimaryContainer: '#D1FAE5',
    secondaryContainer: '#1E463B',
    onSecondaryContainer: '#ECFDF5',
    onSurface: '#ECFDF5',
    onSurfaceVariant: '#6EE7B7',
    textPrimary: '#ECFDF5',
    textSecondary: '#6EE7B7',
    textMuted: '#34D399',
    outline: '#047857',
    outlineVariant: 'rgba(52, 211, 153, 0.24)',
    shapeExtraLarge: 28,
    shapeLarge: 22,
    shapeMedium: 14,
    shapeFilterChip: 8,
    shapeFullPill: 999,
  },
  m3_ocean_dark: {
    id: 'm3_ocean_dark',
    name: 'M3 Cyber Ocean',
    badgeEmoji: '🌊',
    emoji: '🌊',
    isDark: true,
    background: '#0A141F',
    surface: '#0E1B2A',
    surfaceElevated: '#1F3652',
    surfaceContainerLow: '#132336',
    surfaceContainer: '#182B42',
    surfaceContainerHigh: '#1F3652',
    surfaceContainerHighest: '#274263',
    primary: '#38BDF8',
    onPrimary: '#082F49',
    primaryContainer: '#0369A1',
    onPrimaryContainer: '#E0F2FE',
    secondaryContainer: '#1E3A5F',
    onSecondaryContainer: '#E0F2FE',
    onSurface: '#F0F9FF',
    onSurfaceVariant: '#7DD3FC',
    textPrimary: '#F0F9FF',
    textSecondary: '#7DD3FC',
    textMuted: '#38BDF8',
    outline: '#0284C7',
    outlineVariant: 'rgba(56, 189, 248, 0.24)',
    shapeExtraLarge: 28,
    shapeLarge: 22,
    shapeMedium: 14,
    shapeFilterChip: 8,
    shapeFullPill: 999,
  },
  m3_ghibli_light: {
    id: 'm3_ghibli_light',
    name: 'M3 Daylight Cream',
    badgeEmoji: '☀️',
    emoji: '☀️',
    isDark: false,
    background: '#FAF8F5',
    surface: '#F3EFEA',
    surfaceElevated: '#EAE3DC',
    surfaceContainerLow: '#EDE7E0',
    surfaceContainer: '#FFFFFF',
    surfaceContainerHigh: '#EAE3DC',
    surfaceContainerHighest: '#E2D9D0',
    primary: '#D97706',
    onPrimary: '#FFFFFF',
    primaryContainer: '#FEF3C7',
    onPrimaryContainer: '#78350F',
    secondaryContainer: '#FDE68A',
    onSecondaryContainer: '#78350F',
    onSurface: '#1C1917',
    onSurfaceVariant: '#57534E',
    textPrimary: '#1C1917',
    textSecondary: '#57534E',
    textMuted: '#78716C',
    outline: '#A8A29E',
    outlineVariant: 'rgba(120, 113, 108, 0.25)',
    shapeExtraLarge: 28,
    shapeLarge: 22,
    shapeMedium: 14,
    shapeFilterChip: 8,
    shapeFullPill: 999,
  },
};

export const DEFAULT_M3_PRESET: Material3PresetId = 'm3_gold_dark';
