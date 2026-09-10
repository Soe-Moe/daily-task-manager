import { useColorScheme } from 'react-native';
import { Colors, ColorTokens } from '@/constants/colors';
import { useAppStore } from '@/store/useAppStore';
import { Theme } from '@/types/theme';

export const useTheme = (): Theme => {
  const systemColorScheme = useColorScheme();
  const themeMode = useAppStore((state) => state.themeMode);

  const isDark =
    themeMode === 'dark' || (themeMode === 'system' && systemColorScheme === 'dark');

  const colors: ColorTokens = isDark ? Colors.dark : Colors.light;

  return {
    mode: themeMode,
    isDark,
    colors,
  };
};
