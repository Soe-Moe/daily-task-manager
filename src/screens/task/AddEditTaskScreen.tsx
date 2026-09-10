import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Screen } from '@/components/glass/Screen';
import { GlassSurface } from '@/components/glass/GlassSurface';
import { GlassTextField } from '@/components/glass/GlassTextField';
import { useTheme } from '@/utils/useTheme';
import { Typography } from '@/constants/typography';
import { RootStackScreenProps } from '@/types/navigation';
import { Screens } from '@/constants/screens';
import { Priority } from '@/types/todo';
import { useTodoStore, selectTodoById } from '@/store/useTodoStore';
import { resolveDueDate, formatDueLabel, isSameDueDate } from '@/utils/date';

type Props = RootStackScreenProps<typeof Screens.ADD_TASK>;

const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

interface DueChip {
  key: string;
  label: string;
  date: string | null;
}

export const AddEditTaskScreen: React.FC<Props> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const taskId = route.params?.taskId;
  const existing = useTodoStore((state) => (taskId ? selectTodoById(state, taskId) : undefined));
  const addTodo = useTodoStore((state) => state.addTodo);
  const updateTodo = useTodoStore((state) => state.updateTodo);

  const [title, setTitle] = useState(existing?.title ?? '');
  const [notes, setNotes] = useState(existing?.notes ?? '');
  const [priority, setPriority] = useState<Priority>(existing?.priority ?? 'medium');
  const [dueDate, setDueDate] = useState<string | null>(existing?.dueDate ?? null);

  const dueChips = useMemo<DueChip[]>(() => {
    const base: DueChip[] = [
      { key: 'none', label: 'None', date: null },
      { key: 'today', label: 'Today', date: resolveDueDate('today') },
      { key: 'tomorrow', label: 'Tomorrow', date: resolveDueDate('tomorrow') },
      { key: 'weekend', label: 'Weekend', date: resolveDueDate('weekend') },
      { key: 'next_week', label: 'Next week', date: resolveDueDate('next_week') },
    ];
    const matchesAny = base.some((chip) => isSameDueDate(chip.date, dueDate));
    if (dueDate && !matchesAny) {
      base.push({ key: 'custom', label: formatDueLabel(dueDate) ?? 'Custom', date: dueDate });
    }
    return base;
  }, [dueDate]);

  const canSave = title.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    const input = { title, notes, priority, dueDate };
    if (existing) {
      updateTodo(existing.id, input);
    } else {
      addTodo(input);
    }
    navigation.goBack();
  };

  return (
    <Screen scrollable>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={10}>
            <Text style={[Typography.bodyLarge, { color: colors.textMuted }]}>Cancel</Text>
          </TouchableOpacity>
          <Text style={[Typography.titleMedium, { color: colors.text }]}>
            {existing ? 'Edit Task' : 'New Task'}
          </Text>
          <TouchableOpacity onPress={handleSave} disabled={!canSave} hitSlop={10}>
            <Text
              style={[
                Typography.bodyLarge,
                { color: canSave ? colors.primary : colors.textMuted, fontWeight: '700' },
              ]}
            >
              Save
            </Text>
          </TouchableOpacity>
        </View>

        <GlassTextField
          label="Title"
          placeholder="What needs to be done?"
          value={title}
          onChangeText={setTitle}
          autoFocus
          returnKeyType="next"
        />

        <GlassTextField
          label="Notes"
          placeholder="Add details (optional)"
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        <Text style={[Typography.labelMedium, { color: colors.textMuted, marginBottom: 8 }]}>
          Priority
        </Text>
        <View style={styles.chipRow}>
          {PRIORITY_OPTIONS.map((option) => {
            const active = priority === option.value;
            const accent =
              option.value === 'high'
                ? colors.priorityHigh
                : option.value === 'medium'
                ? colors.priorityMedium
                : colors.priorityLow;
            return (
              <TouchableOpacity key={option.value} onPress={() => setPriority(option.value)}>
                <GlassSurface
                  variant="pill"
                  radius={14}
                  padded={false}
                  elevated={false}
                  interactive
                  style={active && { backgroundColor: `${accent}2A` }}
                >
                  <View style={[styles.chipContent, styles.chip]}>
                    <View style={[styles.dot, { backgroundColor: accent }]} />
                    <Text
                      style={[
                        Typography.labelMedium,
                        { color: active ? colors.text : colors.textMuted },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </View>
                </GlassSurface>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[Typography.labelMedium, { color: colors.textMuted, marginTop: 20, marginBottom: 8 }]}>
          Due date
        </Text>
        <View style={styles.chipRow}>
          {dueChips.map((chip) => {
            const active = isSameDueDate(chip.date, dueDate);
            return (
              <TouchableOpacity key={chip.key} onPress={() => setDueDate(chip.date)}>
                <GlassSurface
                  variant="pill"
                  radius={14}
                  padded={false}
                  elevated={false}
                  interactive
                  style={active && { backgroundColor: `${colors.primary}26` }}
                >
                  <View style={[styles.chipContent, styles.chip]}>
                    <Text
                      style={[
                        Typography.labelMedium,
                        { color: active ? colors.primary : colors.textMuted },
                      ]}
                    >
                      {chip.label}
                    </Text>
                  </View>
                </GlassSurface>
              </TouchableOpacity>
            );
          })}
        </View>
      </KeyboardAvoidingView>
    </Screen>
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
    marginBottom: 24,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  chipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
});

export default AddEditTaskScreen;
