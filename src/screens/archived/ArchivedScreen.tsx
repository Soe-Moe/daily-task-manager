import React, { useMemo } from 'react';
import { Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '@/components/glass/Screen';
import { TaskRow } from '@/components/todo/TaskRow';
import { EmptyState } from '@/components/todo/EmptyState';
import { useTheme } from '@/utils/useTheme';
import { Typography } from '@/constants/typography';
import { useTodoStore } from '@/store/useTodoStore';
import { RootStackParamList } from '@/types/navigation';
import { Screens } from '@/constants/screens';

export const ArchivedScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const todos = useTodoStore((state) => state.todos);
  const toggleComplete = useTodoStore((state) => state.toggleComplete);
  const restoreTodo = useTodoStore((state) => state.restoreTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);

  const sorted = useMemo(
    () =>
      todos
        .filter((todo) => todo.archived)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [todos]
  );

  return (
    <Screen scrollable bottomInset={74}>
      <Text style={[Typography.largeTitle, { color: colors.text, marginBottom: 16 }]}>
        Archived
      </Text>

      {sorted.length === 0 ? (
        <EmptyState
          icon="archive-outline"
          title="Nothing archived"
          message="Tasks you archive will be kept here."
        />
      ) : (
        sorted.map((todo) => (
          <TaskRow
            key={todo.id}
            todo={todo}
            onToggle={toggleComplete}
            onPress={(t) => navigation.navigate(Screens.ADD_TASK, { taskId: t.id })}
            trailing="restore"
            onTrailingPress={restoreTodo}
            onDelete={deleteTodo}
          />
        ))
      )}
    </Screen>
  );
};

export default ArchivedScreen;
