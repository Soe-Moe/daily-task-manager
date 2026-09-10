import { MMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';

export const appStorage = new MMKV({
  id: 'app-storage',
});

/**
 * MMKV wrapper conforming to Zustand's StateStorage interface
 * for synchronous, high-performance persistence.
 */
export const mmkvStorage: StateStorage = {
  setItem: (name: string, value: string): void => {
    appStorage.set(name, value);
  },
  getItem: (name: string): string | null => {
    const value = appStorage.getString(name);
    return value ?? null;
  },
  removeItem: (name: string): void => {
    appStorage.delete(name);
  },
};
