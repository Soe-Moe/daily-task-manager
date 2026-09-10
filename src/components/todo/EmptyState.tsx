import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@/utils/useTheme';
import { Typography } from '@/constants/typography';

export interface EmptyStateProps {
  icon: string;
  title: string;
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.iconWrap, { backgroundColor: `${colors.primary}18` }]}>
        <Ionicons name={icon} size={30} color={colors.primary} />
      </View>
      <Text style={[Typography.titleMedium, { color: colors.text, marginTop: 14 }]}>
        {title}
      </Text>
      {message ? (
        <Text
          style={[
            Typography.bodyMedium,
            { color: colors.textMuted, marginTop: 6, textAlign: 'center' },
          ]}
        >
          {message}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 56,
    paddingHorizontal: 32,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
