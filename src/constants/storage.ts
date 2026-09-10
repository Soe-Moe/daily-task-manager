export const StorageKeys = {
  APP_THEME: '@starter_app_theme',
  APP_STORAGE: 'app-storage',
  TODO_STORAGE: 'todo-storage',
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];
