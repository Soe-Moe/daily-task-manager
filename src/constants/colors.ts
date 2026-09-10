export interface ColorTokens {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  secondary: string;
  background: string;
  card: string;
  surface: string;
  text: string;
  textMuted: string;
  textInverse: string;
  border: string;
  notification: string;
  success: string;
  warning: string;
  error: string;
  inputBackground: string;
  placeholder: string;

  // Liquid glass tokens
  glassTint: string;
  glassBorder: string;
  glassHighlight: string;
  glassShadow: string;
  scrim: string;

  // Aurora backdrop blobs
  auroraOne: string;
  auroraTwo: string;
  auroraThree: string;

  // Priority accents
  priorityLow: string;
  priorityMedium: string;
  priorityHigh: string;
}

export const lightColors: ColorTokens = {
  primary: '#0A84FF',
  primaryDark: '#0060DF',
  primaryLight: '#7CC0FF',
  secondary: '#5E5CE6',
  background: '#EEF2F8',
  card: '#FFFFFF',
  surface: '#F1F5F9',
  text: '#0B1220',
  textMuted: '#5B6472',
  textInverse: '#FFFFFF',
  border: '#E2E8F0',
  notification: '#FF453A',
  success: '#30D158',
  warning: '#FF9F0A',
  error: '#FF3B30',
  inputBackground: '#FFFFFF',
  placeholder: '#8E97A3',

  glassTint: 'rgba(255,255,255,0.55)',
  glassBorder: 'rgba(255,255,255,0.65)',
  glassHighlight: 'rgba(255,255,255,0.85)',
  glassShadow: 'rgba(30,41,59,0.18)',
  scrim: 'rgba(15,23,42,0.35)',

  auroraOne: '#9FC7FF',
  auroraTwo: '#FFC2E6',
  auroraThree: '#B7F3D8',

  priorityLow: '#30D158',
  priorityMedium: '#FF9F0A',
  priorityHigh: '#FF453A',
};

export const darkColors: ColorTokens = {
  primary: '#0A84FF',
  primaryDark: '#409CFF',
  primaryLight: '#64B5FF',
  secondary: '#7D7AFF',
  background: '#05060A',
  card: '#111318',
  surface: '#1C1F26',
  text: '#F5F7FA',
  textMuted: '#9AA3B2',
  textInverse: '#05060A',
  border: '#2A2E37',
  notification: '#FF453A',
  success: '#32D74B',
  warning: '#FFD60A',
  error: '#FF453A',
  inputBackground: '#1C1F26',
  placeholder: '#6B7280',

  glassTint: 'rgba(28,31,38,0.55)',
  glassBorder: 'rgba(255,255,255,0.14)',
  glassHighlight: 'rgba(255,255,255,0.22)',
  glassShadow: 'rgba(0,0,0,0.55)',
  scrim: 'rgba(0,0,0,0.5)',

  auroraOne: '#2A3E7A',
  auroraTwo: '#5A2A5E',
  auroraThree: '#1B4A46',

  priorityLow: '#32D74B',
  priorityMedium: '#FFD60A',
  priorityHigh: '#FF6961',
};

export const Colors = {
  light: lightColors,
  dark: darkColors,
};
