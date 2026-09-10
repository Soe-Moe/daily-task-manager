import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from './storage';
import { StorageKeys } from '@/constants/storage';
import { Priority, Todo } from '@/types/todo';
import { resolveDueDate } from '@/utils/date';

const uid = (): string => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export interface TodoInput {
  title: string;
  notes?: string;
  priority: Priority;
  dueDate: string | null;
}

export interface TodoState {
  todos: Todo[];
  addTodo: (input: TodoInput) => void;
  updateTodo: (id: string, input: TodoInput) => void;
  toggleComplete: (id: string) => void;
  archiveTodo: (id: string) => void;
  restoreTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
}

const now = () => new Date().toISOString();

const seedTodos = (): Todo[] => [
  {
    id: uid(),
    title: 'Review the Q3 product roadmap',
    notes: 'Focus on the mobile workstream timeline',
    priority: 'high',
    dueDate: resolveDueDate('today'),
    completed: false,
    archived: false,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: uid(),
    title: 'Book flight for the design offsite',
    priority: 'medium',
    dueDate: resolveDueDate('tomorrow'),
    completed: false,
    archived: false,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: uid(),
    title: 'Refill the water filter cartridge',
    priority: 'low',
    dueDate: resolveDueDate('weekend'),
    completed: false,
    archived: false,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: uid(),
    title: 'Send onboarding notes to the new hire',
    priority: 'medium',
    dueDate: null,
    completed: true,
    archived: false,
    createdAt: now(),
    updatedAt: now(),
  },
];

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      todos: seedTodos(),

      addTodo: (input) =>
        set((state) => ({
          todos: [
            {
              id: uid(),
              title: input.title.trim(),
              notes: input.notes?.trim() || undefined,
              priority: input.priority,
              dueDate: input.dueDate,
              completed: false,
              archived: false,
              createdAt: now(),
              updatedAt: now(),
            },
            ...state.todos,
          ],
        })),

      updateTodo: (id, input) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? {
                  ...todo,
                  title: input.title.trim(),
                  notes: input.notes?.trim() || undefined,
                  priority: input.priority,
                  dueDate: input.dueDate,
                  updatedAt: now(),
                }
              : todo
          ),
        })),

      toggleComplete: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? { ...todo, completed: !todo.completed, updatedAt: now() }
              : todo
          ),
        })),

      archiveTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, archived: true, updatedAt: now() } : todo
          ),
        })),

      restoreTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, archived: false, updatedAt: now() } : todo
          ),
        })),

      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),
    }),
    {
      name: StorageKeys.TODO_STORAGE,
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);

// --- Selectors ---
// Note: these return new array references on every call, so they must only be
// used inside a `useMemo`, never passed directly as a zustand selector hook
// (that causes an infinite update loop with useSyncExternalStore).
export const selectActiveTodos = (state: TodoState): Todo[] =>
  state.todos.filter((todo) => !todo.archived);

export const selectArchivedTodos = (state: TodoState): Todo[] =>
  state.todos.filter((todo) => todo.archived);

export const selectTodoById = (state: TodoState, id: string): Todo | undefined =>
  state.todos.find((todo) => todo.id === id);
