import React from 'react';
import {
  ActivityIndicator,
  ActivityIndicatorProps,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { useTheme } from '@/utils/useTheme';
import { Typography } from '@/constants/typography';

export interface LoadingIndicatorProps extends ActivityIndicatorProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message,
  fullScreen = false,
  size = 'large',
  color,
  ...props
}) => {
  const { colors } = useTheme();
  const indicatorColor = color || colors.primary;

  const content = (
    <View style={styles.contentContainer}>
      <ActivityIndicator size={size} color={indicatorColor} {...props} />
      {message ? (
        <Text style={[styles.message, Typography.bodyMedium, { color: colors.textMuted }]}>
          {message}
        </Text>
      ) : null}
    </View>
  );

  if (fullScreen) {
    return (
      <View
        style={[
          styles.fullScreenContainer,
          { backgroundColor: colors.background },
        ]}
      >
        {content}
      </View>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  contentContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    marginTop: 12,
    textAlign: 'center',
  },
});
