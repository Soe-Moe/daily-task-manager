import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '@/components/glass/Screen';
import { ProgressCard } from '@/components/todo/ProgressCard';
import { TaskRow } from '@/components/todo/TaskRow';
import { EmptyState } from '@/components/todo/EmptyState';
import { AddTaskFAB } from '@/components/todo/AddTaskFAB';
import { useTheme } from '@/utils/useTheme';
import { Typography } from '@/constants/typography';
import { useTodoStore } from '@/store/useTodoStore';
import { getGreeting, formatHeaderDate, isToday } from '@/utils/date';
import { RootStackParamList } from '@/types/navigation';
import { Screens } from '@/constants/screens';

export const HomeScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const todos = useTodoStore((state) => state.todos);
  const toggleComplete = useTodoStore((state) => state.toggleComplete);
  const archiveTodo = useTodoStore((state) => state.archiveTodo);

  const { todayTodos, upNext } = useMemo(() => {
    const activeTodos = todos.filter((todo) => !todo.archived);
    const today = activeTodos.filter((todo) => isToday(todo.dueDate));
    const upcoming = [...activeTodos]
      .filter((todo) => !todo.completed)
      .sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      })
      .slice(0, 5);
    return { todayTodos: today, upNext: upcoming };
  }, [todos]);

  const completedToday = todayTodos.filter((todo) => todo.completed).length;

  return (
    <Screen
      scrollable
      floatingAction={<AddTaskFAB onPress={() => navigation.navigate(Screens.ADD_TASK)} />}
    >
      <Text style={[Typography.bodyLarge, { color: colors.textMuted }]}>{getGreeting()}</Text>
      <Text style={[Typography.largeTitle, { color: colors.text, marginBottom: 4 }]}>
        {formatHeaderDate()}
      </Text>

      <View style={styles.spacer} />

      <ProgressCard
        completed={completedToday}
        total={todayTodos.length}
        dueToday={todayTodos.length - completedToday}
      />

      <Text style={[Typography.titleMedium, { color: colors.text, marginBottom: 12 }]}>
        Up next
      </Text>

      {upNext.length === 0 ? (
        <EmptyState
          icon="checkmark-done-outline"
          title="All clear"
          message="You have no upcoming tasks. Tap + to add one."
        />
      ) : (
        upNext.map((todo) => (
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
    </Screen>
  );
};

const styles = StyleSheet.create({
  spacer: {
    height: 20,
  },
});

export default HomeScreen;
