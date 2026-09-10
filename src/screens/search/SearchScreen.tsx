import React, { useMemo, useState } from 'react';
import { Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '@/components/glass/Screen';
import { SearchField } from '@/components/todo/SearchField';
import { TaskRow } from '@/components/todo/TaskRow';
import { EmptyState } from '@/components/todo/EmptyState';
import { useTheme } from '@/utils/useTheme';
import { Typography } from '@/constants/typography';
import { useTodoStore } from '@/store/useTodoStore';
import { RootStackParamList } from '@/types/navigation';
import { Screens } from '@/constants/screens';

export const SearchScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [query, setQuery] = useState('');

  const todos = useTodoStore((state) => state.todos);
  const toggleComplete = useTodoStore((state) => state.toggleComplete);
  const archiveTodo = useTodoStore((state) => state.archiveTodo);
  const restoreTodo = useTodoStore((state) => state.restoreTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];
    return todos.filter(
      (todo) =>
        todo.title.toLowerCase().includes(trimmed) ||
        (todo.notes ?? '').toLowerCase().includes(trimmed)
    );
  }, [todos, query]);

  return (
    <Screen scrollable bottomInset={74}>
      <Text style={[Typography.largeTitle, { color: colors.text, marginBottom: 16 }]}>
        Search
      </Text>

      <SearchField value={query} onChangeText={setQuery} placeholder="Search tasks and notes" />

      {query.trim().length === 0 ? (
        <EmptyState icon="search" title="Find a task" message="Search by title or notes." />
      ) : results.length === 0 ? (
        <EmptyState icon="search" title="No results" message={`Nothing matches "${query}"`} />
      ) : (
        results.map((todo) => (
          <TaskRow
            key={todo.id}
            todo={todo}
            onToggle={toggleComplete}
            onPress={(t) => navigation.navigate(Screens.ADD_TASK, { taskId: t.id })}
            trailing={todo.archived ? 'restore' : 'archive'}
            onTrailingPress={todo.archived ? restoreTodo : archiveTodo}
            onDelete={todo.archived ? deleteTodo : undefined}
          />
        ))
      )}
    </Screen>
  );
};

export default SearchScreen;
