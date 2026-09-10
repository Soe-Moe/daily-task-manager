import { ColorTokens } from '@/constants/colors';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Theme {
  mode: ThemeMode;
  isDark: boolean;
  colors: ColorTokens;
}
