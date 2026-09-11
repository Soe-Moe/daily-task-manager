import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BottomSheet, BottomSheetHandle } from '@/components/glass/BottomSheet';
import { GlassSurface } from '@/components/glass/GlassSurface';
import { useTheme } from '@/utils/useTheme';
import { Typography } from '@/constants/typography';
import { RootStackScreenProps } from '@/types/navigation';
import { Screens } from '@/constants/screens';
import { useTodoStore, selectTodoById } from '@/store/useTodoStore';
import { formatDueLabel, isOverdue } from '@/utils/date';

type Props = RootStackScreenProps<typeof Screens.TASK_DETAIL>;

const PRIORITY_LABEL: Record<string, string> = {
  low: 'Low priority',
  medium: 'Medium priority',
  high: 'High priority',
};

export const TaskDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const sheetRef = useRef<BottomSheetHandle>(null);
  const editRequested = useRef(false);
  const { taskId } = route.params;

  const todo = useTodoStore((state) => selectTodoById(state, taskId));
  const toggleComplete = useTodoStore((state) => state.toggleComplete);
  const archiveTodo = useTodoStore((state) => state.archiveTodo);
  const restoreTodo = useTodoStore((state) => state.restoreTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);

  const handleClosed = () => {
    if (editRequested.current) {
      navigation.replace(Screens.ADD_TASK, { taskId });
    } else {
      navigation.goBack();
    }
  };

  const handleClose = () => sheetRef.current?.dismiss();
  const handleEdit = () => {
    editRequested.current = true;
    sheetRef.current?.dismiss();
  };

  const handleDelete = () => {
    Alert.alert('Delete task?', 'This can\'t be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteTodo(taskId);
          sheetRef.current?.dismiss();
        },
      },
    ]);
  };

  if (!todo) {
    return (
      <BottomSheet ref={sheetRef} onClose={handleClosed} heightRatio={0.35}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={handleClose} hitSlop={10}>
            <Text style={[Typography.bodyLarge, { color: colors.primary }]}>Close</Text>
          </TouchableOpacity>
          <Text style={[Typography.titleMedium, { color: colors.text }]}>Task</Text>
          <View style={styles.topBarSpacer} />
        </View>
        <View style={styles.notFound}>
          <Text style={[Typography.bodyLarge, { color: colors.textMuted }]}>
            This task no longer exists.
          </Text>
        </View>
      </BottomSheet>
    );
  }

  const overdue = isOverdue(todo.dueDate, todo.completed);
  const dueLabel = formatDueLabel(todo.dueDate);
  const priorityColor =
    todo.priority === 'high'
      ? colors.priorityHigh
      : todo.priority === 'medium'
      ? colors.priorityMedium
      : colors.priorityLow;

  return (
    <BottomSheet ref={sheetRef} onClose={handleClosed} heightRatio={0.66}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleClose} hitSlop={10}>
          <Text style={[Typography.bodyLarge, { color: colors.textMuted }]}>Close</Text>
        </TouchableOpacity>
        <Text style={[Typography.titleMedium, { color: colors.text }]}>Task</Text>
        <TouchableOpacity onPress={handleEdit} hitSlop={10}>
          <Text style={[Typography.bodyLarge, { color: colors.primary, fontWeight: '700' }]}>
            Edit
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.statusRow}
          onPress={() => toggleComplete(todo.id)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={todo.completed ? 'checkmark-circle' : 'ellipse-outline'}
            size={28}
            color={todo.completed ? colors.success : colors.textMuted}
          />
          <Text
            style={[
              Typography.displayMedium,
              styles.title,
              {
                color: todo.completed ? colors.textMuted : colors.text,
                textDecorationLine: todo.completed ? 'line-through' : 'none',
              },
            ]}
          >
            {todo.title}
          </Text>
        </TouchableOpacity>

        <View style={styles.metaRow}>
          <View style={[styles.dot, { backgroundColor: priorityColor }]} />
          <Text style={[Typography.bodyMedium, { color: colors.textMuted }]}>
            {PRIORITY_LABEL[todo.priority]}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Ionicons
            name="calendar-outline"
            size={16}
            color={overdue ? colors.error : colors.textMuted}
          />
          <Text
            style={[
              Typography.bodyMedium,
              { color: overdue ? colors.error : colors.textMuted, fontWeight: overdue ? '700' : '400' },
            ]}
          >
            {dueLabel ? `Due ${dueLabel}` : 'No due date'}
          </Text>
        </View>

        {todo.notes ? (
          <GlassSurface variant="card" radius={18} style={styles.notesCard}>
            <Text style={[Typography.labelMedium, { color: colors.textMuted, marginBottom: 6 }]}>
              Notes
            </Text>
            <Text style={[Typography.bodyLarge, { color: colors.text }]}>{todo.notes}</Text>
          </GlassSurface>
        ) : null}

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => (todo.archived ? restoreTodo(todo.id) : archiveTodo(todo.id))}
          >
            <Ionicons
              name={todo.archived ? 'arrow-undo-outline' : 'archive-outline'}
              size={20}
              color={colors.text}
            />
            <Text style={[Typography.bodyLarge, { color: colors.text }]}>
              {todo.archived ? 'Restore' : 'Archive'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionRow} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={20} color={colors.error} />
            <Text style={[Typography.bodyLarge, { color: colors.error }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  topBarSpacer: {
    width: 44,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  title: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  notesCard: {
    marginTop: 12,
    marginBottom: 8,
  },
  actions: {
    marginTop: 20,
    gap: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
});

export default TaskDetailScreen;
