import React from 'react';
import { View, StyleSheet, ViewStyle, Platform, StyleProp } from 'react-native';
import { BlurView } from '@react-native-community/blur';
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
}

const VARIANT_BLUR: Record<GlassVariant, { light: GlassBlurType; dark: GlassBlurType; amount: number }> = {
  card: { light: 'ultraThinMaterialLight', dark: 'ultraThinMaterialDark', amount: 16 },
  bar: { light: 'chromeMaterialLight', dark: 'chromeMaterialDark', amount: 24 },
  sheet: { light: 'thickMaterialLight', dark: 'thickMaterialDark', amount: 28 },
  pill: { light: 'materialLight', dark: 'materialDark', amount: 20 },
};

export const GlassSurface: React.FC<GlassSurfaceProps> = ({
  children,
  style,
  variant = 'card',
  radius = 22,
  bordered = true,
  elevated = true,
  padded = true,
}) => {
  const { isDark, colors } = useTheme();
  const blurConfig = VARIANT_BLUR[variant];

  return (
    <View
      style={[
        { borderRadius: radius },
        elevated && {
          shadowColor: colors.glassShadow,
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 1,
          shadowRadius: 24,
          elevation: 8,
        },
        style,
      ]}
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
        {bordered ? (
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
        ) : null}
        <View
          pointerEvents="none"
          style={[styles.highlight, { backgroundColor: colors.glassHighlight }]}
        />
        <View style={padded ? styles.content : styles.contentBare}>{children}</View>
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
