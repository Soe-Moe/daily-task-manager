import { useColorScheme } from 'react-native';
import { Colors, ColorTokens } from '@/constants/colors';
import { Theme } from '@/types/theme';

export const useTheme = (): Theme => {
  const isDark = useColorScheme() === 'dark';
  const colors: ColorTokens = isDark ? Colors.dark : Colors.light;

  return { isDark, colors };
};
