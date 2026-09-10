import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { GlassSurface } from '@/components/glass/GlassSurface';
import { useTheme } from '@/utils/useTheme';
import { Typography } from '@/constants/typography';
import { Todo } from '@/types/todo';
import { formatDueLabel, isOverdue } from '@/utils/date';

export interface TaskRowProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onPress: (todo: Todo) => void;
  trailing: 'archive' | 'restore';
  onTrailingPress: (id: string) => void;
  onDelete?: (id: string) => void;
}

const PRIORITY_LABEL: Record<Todo['priority'], string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export const TaskRow: React.FC<TaskRowProps> = ({
  todo,
  onToggle,
  onPress,
  trailing,
  onTrailingPress,
  onDelete,
}) => {
  const { colors } = useTheme();
  const dueLabel = formatDueLabel(todo.dueDate);
  const overdue = isOverdue(todo.dueDate, todo.completed);
  const priorityColor =
    todo.priority === 'high'
      ? colors.priorityHigh
      : todo.priority === 'medium'
      ? colors.priorityMedium
      : colors.priorityLow;

  return (
    <GlassSurface variant="card" radius={18} padded={false} style={styles.surface}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onPress(todo)}
        style={styles.row}
      >
        <TouchableOpacity
          onPress={() => onToggle(todo.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.checkbox}
        >
          <Ionicons
            name={todo.completed ? 'checkmark-circle' : 'ellipse-outline'}
            size={26}
            color={todo.completed ? colors.success : colors.textMuted}
          />
        </TouchableOpacity>

        <View style={styles.body}>
          <Text
            style={[
              Typography.bodyLarge,
              styles.title,
              {
                color: todo.completed ? colors.textMuted : colors.text,
                textDecorationLine: todo.completed ? 'line-through' : 'none',
              },
            ]}
            numberOfLines={1}
          >
            {todo.title}
          </Text>

          {todo.notes ? (
            <Text
              style={[Typography.bodyMedium, { color: colors.textMuted }]}
              numberOfLines={1}
            >
              {todo.notes}
            </Text>
          ) : null}

          <View style={styles.metaRow}>
            <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
            <Text style={[Typography.caption, { color: colors.textMuted }]}>
              {PRIORITY_LABEL[todo.priority]}
            </Text>
            {dueLabel ? (
              <>
                <Text style={[Typography.caption, { color: colors.textMuted }]}> · </Text>
                <Text
                  style={[
                    Typography.caption,
                    { color: overdue ? colors.error : colors.textMuted, fontWeight: '600' },
                  ]}
                >
                  {dueLabel}
                </Text>
              </>
            ) : null}
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => onTrailingPress(todo.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.actionButton}
          >
            <Ionicons
              name={trailing === 'archive' ? 'archive-outline' : 'arrow-undo-outline'}
              size={19}
              color={colors.textMuted}
            />
          </TouchableOpacity>
          {onDelete ? (
            <TouchableOpacity
              onPress={() => onDelete(todo.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.actionButton}
            >
              <Ionicons name="trash-outline" size={19} color={colors.error} />
            </TouchableOpacity>
          ) : null}
        </View>
      </TouchableOpacity>
    </GlassSurface>
  );
};

const styles = StyleSheet.create({
  surface: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  checkbox: {
    marginRight: 12,
  },
  body: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  priorityDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 5,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    padding: 2,
  },
});
