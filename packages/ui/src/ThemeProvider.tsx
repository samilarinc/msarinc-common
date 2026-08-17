import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PALETTES, ThemeName, createThemeStore, type Palette, type ThemeStorageAdapter } from '@msarinc/theme-core';

const STORAGE_KEY = 'theme';

const asyncStorageAdapter: ThemeStorageAdapter = {
  get: () => AsyncStorage.getItem(STORAGE_KEY) as Promise<ThemeName | null>,
  set: (theme) => AsyncStorage.setItem(STORAGE_KEY, theme),
};

type ThemeContextType = {
  theme: ThemeName;
  colors: Palette;
  setTheme: (theme: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeName;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, defaultTheme = 'light' }) => {
  const [theme, setThemeState] = useState<ThemeName>(defaultTheme);

  const store = useMemo(
    () =>
      createThemeStore({
        storage: asyncStorageAdapter,
        defaultTheme,
        onChange: (next) => setThemeState(next),
      }),
    [],
  );

  useEffect(() => {
    store.hydrate();
  }, [store]);

  const setTheme = (next: ThemeName) => {
    store.setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, colors: PALETTES[theme], setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
};
