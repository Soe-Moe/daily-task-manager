import React, { useMemo, useState } from 'react';
import { Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '@/components/glass/Screen';
import { SegmentedControl } from '@/components/todo/SegmentedControl';
import { TaskRow } from '@/components/todo/TaskRow';
import { EmptyState } from '@/components/todo/EmptyState';
import { AddTaskFAB } from '@/components/todo/AddTaskFAB';
import { useTheme } from '@/utils/useTheme';
import { Typography } from '@/constants/typography';
import { useTodoStore } from '@/store/useTodoStore';
import { RootStackParamList } from '@/types/navigation';
import { Screens } from '@/constants/screens';

type Filter = 'all' | 'active' | 'completed';

export const TasksScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [filter, setFilter] = useState<Filter>('active');

  const todos = useTodoStore((state) => state.todos);
  const toggleComplete = useTodoStore((state) => state.toggleComplete);
  const archiveTodo = useTodoStore((state) => state.archiveTodo);

  const filtered = useMemo(() => {
    const list = todos.filter((todo) => {
      if (todo.archived) return false;
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    });
    return [...list].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }, [todos, filter]);

  return (
    <Screen
      scrollable
      bottomInset={74}
      floatingAction={<AddTaskFAB onPress={() => navigation.navigate(Screens.ADD_TASK)} />}
    >
      <Text style={[Typography.largeTitle, { color: colors.text, marginBottom: 16 }]}>Tasks</Text>

      <SegmentedControl
        value={filter}
        onChange={setFilter}
        options={[
          { value: 'active', label: 'Active' },
          { value: 'all', label: 'All' },
          { value: 'completed', label: 'Completed' },
        ]}
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon="checkmark-done-outline"
          title="Nothing here"
          message="Tasks you add will show up in this list."
        />
      ) : (
        filtered.map((todo) => (
          <TaskRow
            key={todo.id}
            todo={todo}
            onToggle={toggleComplete}
            onPress={(t) => navigation.navigate(Screens.ADD_TASK, { taskId: t.id })}
            trailing="archive"
            onTrailingPress={archiveTodo}
          />
        ))
      )}
    </Screen>
  );
};

export default TasksScreen;
