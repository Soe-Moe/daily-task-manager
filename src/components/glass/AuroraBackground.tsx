import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { useTheme } from '@/utils/useTheme';

const { width } = Dimensions.get('window');

export const AuroraBackground: React.FC = () => {
  const { isDark, colors } = useTheme();

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={[styles.base, { backgroundColor: colors.background }]} />
      <View
        style={[
          styles.blob,
          {
            backgroundColor: colors.auroraOne,
            width: width * 1.1,
            height: width * 1.1,
            borderRadius: width * 0.55,
            top: -width * 0.55,
            left: -width * 0.35,
            opacity: isDark ? 0.55 : 0.75,
          },
        ]}
      />
      <View
        style={[
          styles.blob,
          {
            backgroundColor: colors.auroraTwo,
            width: width * 0.9,
            height: width * 0.9,
            borderRadius: width * 0.45,
            top: width * 0.15,
            right: -width * 0.45,
            opacity: isDark ? 0.45 : 0.65,
          },
        ]}
      />
      <View
        style={[
          styles.blob,
          {
            backgroundColor: colors.auroraThree,
            width: width * 1.2,
            height: width * 1.2,
            borderRadius: width * 0.6,
            bottom: -width * 0.75,
            left: -width * 0.2,
            opacity: isDark ? 0.4 : 0.6,
          },
        ]}
      />
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType={isDark ? 'dark' : 'xlight'}
        blurAmount={70}
        reducedTransparencyFallbackColor={colors.background}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    ...StyleSheet.absoluteFillObject,
  },
  blob: {
    position: 'absolute',
  },
});
