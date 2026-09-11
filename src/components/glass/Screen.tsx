import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView, ViewStyle, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarHeightContext } from 'react-native-bottom-tabs';
import { AuroraBackground } from './AuroraBackground';
import { useTheme } from '@/utils/useTheme';

export interface ScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  contentContainerStyle?: ViewStyle;
  /** Extra breathing room below the tab bar (or safe area, outside of tabs), in addition to its real height. */
  bottomInset?: number;
  floatingAction?: React.ReactNode;
  /** Fixed content rendered above the scrollable area (e.g. a modal's Cancel / Title / Save row) — never scrolls. */
  header?: React.ReactNode;
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  scrollable = false,
  contentContainerStyle,
  bottomInset = 16,
  floatingAction,
  header,
}) => {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  // Only set when this screen lives inside the native bottom tab navigator;
  // reflects the tab bar's real rendered height (it manages its own safe area).
  const tabBarHeight = useContext(BottomTabBarHeightContext);
  const bottomPad = (tabBarHeight ?? insets.bottom) + bottomInset;
  const topPad = header ? 12 : insets.top + 12;

  return (
    <View style={styles.root}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} translucent backgroundColor="transparent" />
      <AuroraBackground />
      {header ? (
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>{header}</View>
      ) : null}
      {scrollable ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            {
              paddingTop: topPad,
              paddingBottom: bottomPad + 24,
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
              paddingTop: topPad,
              paddingBottom: bottomPad,
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
          style={[styles.floating, { bottom: bottomPad + 14 }]}
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
  header: {
    paddingHorizontal: 20,
  },
  floating: {
    position: 'absolute',
    right: 20,
  },
});
