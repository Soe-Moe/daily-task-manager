import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassSurface } from '@/components/glass/GlassSurface';
import { useTheme } from '@/utils/useTheme';
import { Typography } from '@/constants/typography';

export interface ProgressCardProps {
  completed: number;
  total: number;
  dueToday: number;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({ completed, total, dueToday }) => {
  const { colors } = useTheme();
  const ratio = total > 0 ? completed / total : 0;

  return (
    <GlassSurface variant="card" radius={24} style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={[Typography.titleMedium, { color: colors.text }]}>Today's progress</Text>
        <Text style={[Typography.titleMedium, { color: colors.primary }]}>
          {completed}/{total}
        </Text>
      </View>

      <View style={[styles.track, { backgroundColor: colors.surface }]}>
        <View
          style={[
            styles.fill,
            { width: `${Math.round(ratio * 100)}%`, backgroundColor: colors.primary },
          ]}
        />
      </View>

      <Text style={[Typography.bodyMedium, { color: colors.textMuted, marginTop: 12 }]}>
        {dueToday > 0
          ? `${dueToday} task${dueToday === 1 ? '' : 's'} due today`
          : 'Nothing due today'}
      </Text>
    </GlassSurface>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});
