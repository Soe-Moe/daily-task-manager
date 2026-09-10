import React from 'react';
import { View, StyleSheet, ViewStyle, Platform, StyleProp } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { LiquidGlassView, isLiquidGlassSupported } from '@callstack/liquid-glass';
import { useTheme } from '@/utils/useTheme';

export type GlassVariant = 'card' | 'bar' | 'sheet' | 'pill';

type GlassBlurType =
  | 'ultraThinMaterialLight'
  | 'ultraThinMaterialDark'
  | 'chromeMaterialLight'
  | 'chromeMaterialDark'
  | 'thickMaterialLight'
  | 'thickMaterialDark'
  | 'materialLight'
  | 'materialDark';

export interface GlassSurfaceProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: GlassVariant;
  radius?: number;
  bordered?: boolean;
  elevated?: boolean;
  padded?: boolean;
  /** Grows and shimmers on touch. Use for tappable glass surfaces (only affects real native glass). */
  interactive?: boolean;
}

const VARIANT_BLUR: Record<GlassVariant, { light: GlassBlurType; dark: GlassBlurType; amount: number }> = {
  card: { light: 'ultraThinMaterialLight', dark: 'ultraThinMaterialDark', amount: 16 },
  bar: { light: 'chromeMaterialLight', dark: 'chromeMaterialDark', amount: 24 },
  sheet: { light: 'thickMaterialLight', dark: 'thickMaterialDark', amount: 28 },
  pill: { light: 'materialLight', dark: 'materialDark', amount: 20 },
};

const shadowStyle = (shadowColor: string): ViewStyle => ({
  shadowColor,
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 1,
  shadowRadius: 24,
  elevation: 8,
});

export const GlassSurface: React.FC<GlassSurfaceProps> = ({
  children,
  style,
  variant = 'card',
  radius = 22,
  bordered = true,
  elevated = true,
  padded = true,
  interactive = false,
}) => {
  const { isDark, colors } = useTheme();

  const border = bordered ? (
    <View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        {
          borderRadius: radius,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.glassBorder,
        },
      ]}
    />
  ) : null;

  const content = <View style={padded ? styles.content : styles.contentBare}>{children}</View>;

  if (isLiquidGlassSupported) {
    return (
      <View
        style={[{ borderRadius: radius }, elevated && shadowStyle(colors.glassShadow), style]}
      >
        <LiquidGlassView
          style={[styles.clip, { borderRadius: radius }]}
          effect="regular"
          interactive={interactive}
          tintColor={colors.glassTint}
          colorScheme={isDark ? 'dark' : 'light'}
        >
          {border}
          {content}
        </LiquidGlassView>
      </View>
    );
  }

  const blurConfig = VARIANT_BLUR[variant];

  return (
    <View
      style={[{ borderRadius: radius }, elevated && shadowStyle(colors.glassShadow), style]}
    >
      <View style={[styles.clip, { borderRadius: radius }]}>
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType={isDark ? blurConfig.dark : blurConfig.light}
          blurAmount={blurConfig.amount}
          reducedTransparencyFallbackColor={colors.card}
          {...(Platform.OS === 'android' ? { overlayColor: colors.card } : {})}
        />
        <View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { backgroundColor: colors.glassTint }]}
        />
        {border}
        <View
          pointerEvents="none"
          style={[styles.highlight, { backgroundColor: colors.glassHighlight }]}
        />
        {content}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  clip: {
    overflow: 'hidden',
    flex: 1,
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    height: StyleSheet.hairlineWidth,
    opacity: 0.6,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  contentBare: {
    flex: 1,
  },
});
