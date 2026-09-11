import React, { useMemo, useRef, useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '@/components/glass/Screen';
import { SegmentedControl, SegmentOption } from '@/components/todo/SegmentedControl';
import { TaskRow } from '@/components/todo/TaskRow';
import { EmptyState } from '@/components/todo/EmptyState';
import { AddTaskFAB } from '@/components/todo/AddTaskFAB';
import { useTheme } from '@/utils/useTheme';
import { Typography } from '@/constants/typography';
import { useTodoStore } from '@/store/useTodoStore';
import { Todo } from '@/types/todo';
import { isOverdue } from '@/utils/date';
import { RootStackParamList } from '@/types/navigation';
import { Screens } from '@/constants/screens';

type Filter = 'all' | 'active' | 'completed' | 'overdue';

const FILTERS: SegmentOption<Filter>[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'overdue', label: 'Over Due' },
];

const matchesFilter = (todo: Todo, filter: Filter): boolean => {
  if (todo.archived) return false;
  if (filter === 'active') return !todo.completed;
  if (filter === 'completed') return todo.completed;
  if (filter === 'overdue') return isOverdue(todo.dueDate, todo.completed);
  return true;
};

const sortTodos = (list: Todo[]): Todo[] =>
  [...list].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

export const TasksScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  // Must match FILTERS[0] — the pager's horizontal ScrollView always starts at page index 0.
  const [filter, setFilter] = useState<Filter>(FILTERS[0].value);
  const pagerRef = useRef<ScrollView>(null);
  const { width } = useWindowDimensions();

  const todos = useTodoStore((state) => state.todos);
  const toggleComplete = useTodoStore((state) => state.toggleComplete);
  const archiveTodo = useTodoStore((state) => state.archiveTodo);

  const pages = useMemo(
    () => FILTERS.map((f) => sortTodos(todos.filter((todo) => matchesFilter(todo, f.value)))),
    [todos]
  );

  const goToFilter = (value: Filter) => {
    setFilter(value);
    const index = FILTERS.findIndex((f) => f.value === value);
    pagerRef.current?.scrollTo({ x: index * width, animated: true });
  };

  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    const next = FILTERS[index]?.value;
    if (next && next !== filter) setFilter(next);
  };

  return (
    <Screen
      floatingAction={<AddTaskFAB onPress={() => navigation.navigate(Screens.ADD_TASK)} />}
    >
      <Text style={[Typography.largeTitle, { color: colors.text, marginBottom: 16 }]}>Tasks</Text>

      <SegmentedControl value={filter} onChange={goToFilter} options={FILTERS} />

      <ScrollView
        ref={pagerRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumEnd}
        style={styles.pager}
      >
        {FILTERS.map((f, index) => (
          <View key={f.value} style={{ width }}>
            <ScrollView
              contentContainerStyle={styles.pageContent}
              showsVerticalScrollIndicator={false}
            >
              {pages[index].length === 0 ? (
                <EmptyState
                  icon="checkmark-done-outline"
                  title="Nothing here"
                  message="Tasks you add will show up in this list."
                />
              ) : (
                pages[index].map((todo) => (
                  <TaskRow
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleComplete}
                    onPress={(t) => navigation.navigate(Screens.TASK_DETAIL, { taskId: t.id })}
                    trailing="archive"
                    onTrailingPress={archiveTodo}
                  />
                ))
              )}
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  pager: {
    flex: 1,
    marginHorizontal: -20,
  },
  pageContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
});

export default TasksScreen;
