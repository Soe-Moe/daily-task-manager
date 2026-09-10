import React from 'react';
import { View, StyleSheet, ScrollView, ViewStyle, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuroraBackground } from './AuroraBackground';
import { useTheme } from '@/utils/useTheme';

export interface ScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  contentContainerStyle?: ViewStyle;
  bottomInset?: number;
  floatingAction?: React.ReactNode;
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  scrollable = false,
  contentContainerStyle,
  bottomInset = 0,
  floatingAction,
}) => {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} translucent backgroundColor="transparent" />
      <AuroraBackground />
      {scrollable ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            {
              paddingTop: insets.top + 12,
              paddingBottom: insets.bottom + bottomInset + 24,
              paddingHorizontal: 20,
            },
            contentContainerStyle,
          ]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View
          style={[
            styles.flex,
            {
              paddingTop: insets.top + 12,
              paddingBottom: insets.bottom + bottomInset,
              paddingHorizontal: 20,
            },
            contentContainerStyle,
          ]}
        >
          {children}
        </View>
      )}
      {floatingAction ? (
        <View
          style={[styles.floating, { bottom: insets.bottom + bottomInset + 14 }]}
          pointerEvents="box-none"
        >
          {floatingAction}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  floating: {
    position: 'absolute',
    right: 20,
  },
});
