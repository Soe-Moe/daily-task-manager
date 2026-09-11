export const StorageKeys = {
  TODO_STORAGE: 'todo-storage',
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];
