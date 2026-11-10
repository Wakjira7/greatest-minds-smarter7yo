import { useColorScheme } from 'react-native';

export interface Palette {
  dark: boolean;
  bg: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textDim: string;
  textFaint: string;
  primary: string;
  primarySoft: string;
  onPrimary: string;
  accent: string;
  danger: string;
  success: string;
  gold: string;
  heroFrom: string;
  heroTo: string;
}

const light: Palette = {
  dark: false,
  bg: '#F4F5FB',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF0F8',
  border: '#E3E6F0',
  text: '#121528',
  textDim: '#4A5070',
  textFaint: '#8A90AD',
  primary: '#4F46E5',
  primarySoft: '#E8E7FF',
  onPrimary: '#FFFFFF',
  accent: '#06B6D4',
  danger: '#E5484D',
  success: '#12A150',
  gold: '#F5A524',
  heroFrom: '#4F46E5',
  heroTo: '#7C3AED',
};

const dark: Palette = {
  dark: true,
  bg: '#0B0D17',
  surface: '#151829',
  surfaceAlt: '#1D2136',
  border: '#272B44',
  text: '#F3F4FA',
  textDim: '#B4B8D2',
  textFaint: '#767B99',
  primary: '#7C74FF',
  primarySoft: '#25234A',
  onPrimary: '#FFFFFF',
  accent: '#22D3EE',
  danger: '#FF6369',
  success: '#3DD68C',
  gold: '#FFB224',
  heroFrom: '#4F46E5',
  heroTo: '#9333EA',
};

export function usePalette(): Palette {
  return useColorScheme() === 'dark' ? dark : light;
}
