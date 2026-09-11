import React from 'react';
import { Text } from 'react-native';
import { Screen } from '@/components/glass/Screen';
import { EmptyState } from '@/components/todo/EmptyState';
import { useTheme } from '@/utils/useTheme';
import { Typography } from '@/constants/typography';

export const EventsScreen: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Screen scrollable>
      <Text style={[Typography.largeTitle, { color: colors.text, marginBottom: 16 }]}>
        Events
      </Text>

      <EmptyState
        icon="calendar-outline"
        title="No events yet"
        message="Events you schedule will show up here."
      />
    </Screen>
  );
};

export default EventsScreen;
