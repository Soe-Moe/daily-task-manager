import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { GlassSurface } from '@/components/glass/GlassSurface';
import { useTheme } from '@/utils/useTheme';
import { Typography } from '@/constants/typography';
import { Screens } from '@/constants/screens';

const TAB_CONFIG: Record<string, { label: string; active: string; inactive: string }> = {
  [Screens.HOME]: { label: 'Home', active: 'home', inactive: 'home-outline' },
  [Screens.TASKS]: { label: 'Tasks', active: 'checkmark-done', inactive: 'checkmark-done-outline' },
  [Screens.ARCHIVED]: { label: 'Archived', active: 'archive', inactive: 'archive-outline' },
  [Screens.SEARCH]: { label: 'Search', active: 'search', inactive: 'search-outline' },
};

export const GlassTabBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View
      style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 14) }]}
      pointerEvents="box-none"
    >
      <GlassSurface variant="bar" radius={30} padded={false} style={styles.bar}>
        <View style={styles.row}>
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const config = TAB_CONFIG[route.name];
            if (!config) return null;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={styles.tabItem}
                activeOpacity={0.7}
              >
                {isFocused ? (
                  <View style={[styles.activePill, { backgroundColor: `${colors.primary}24` }]} />
                ) : null}
                <Ionicons
                  name={isFocused ? config.active : config.inactive}
                  size={22}
                  color={isFocused ? colors.primary : colors.textMuted}
                />
                <Text
                  style={[
                    Typography.caption,
                    styles.label,
                    { color: isFocused ? colors.primary : colors.textMuted },
                  ]}
                  numberOfLines={1}
                >
                  {config.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </GlassSurface>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 0,
    alignItems: 'center',
  },
  bar: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  activePill: {
    position: 'absolute',
    top: 0,
    width: 52,
    height: 52,
    borderRadius: 18,
  },
  label: {
    marginTop: 3,
    fontWeight: '600',
  },
});
