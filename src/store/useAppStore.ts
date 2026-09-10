import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from './storage';
import { StorageKeys } from '@/constants/storage';
import { ThemeMode } from '@/types/theme';

export interface ThemeSlice {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

export type AppState = ThemeSlice;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // --- Theme Slice ---
      themeMode: 'system',
      setThemeMode: (mode: ThemeMode) => set({ themeMode: mode }),
      toggleTheme: () => {
        const current = get().themeMode;
        const next: ThemeMode = current === 'dark' ? 'light' : 'dark';
        set({ themeMode: next });
      },
    }),
    {
      name: StorageKeys.APP_STORAGE,
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        themeMode: state.themeMode,
      }),
    }
  )
);

// Convenient selector hooks
export const useThemeState = () =>
  useAppStore((state) => ({
    themeMode: state.themeMode,
    setThemeMode: state.setThemeMode,
    toggleTheme: state.toggleTheme,
  }));
