import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { Appearance, Platform, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  PALETTES,
  ThemeName,
  ThemePreference,
  createThemeStore,
  resolveTheme,
  type Palette,
  type ThemeStorageAdapter,
} from '@msarinc/theme-core';

const STORAGE_KEY = 'theme';

const asyncStorageAdapter: ThemeStorageAdapter = {
  get: () => AsyncStorage.getItem(STORAGE_KEY) as Promise<ThemePreference | null>,
  set: (preference) => AsyncStorage.setItem(STORAGE_KEY, preference),
};

type ThemeContextType = {
  /** The theme actually in effect; 'system' is already resolved to light or dark. */
  theme: ThemeName;
  /** What the user picked, including 'system'. */
  preference: ThemePreference;
  colors: Palette;
  setTheme: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export interface ThemeProviderProps {
  children: ReactNode;
  /** Used until a saved preference is found. Default: 'light'. */
  defaultTheme?: ThemePreference;
  /** The app's own brand palettes. Default: PALETTES from @msarinc/theme-core. */
  palettes?: Record<ThemeName, Palette>;
  /** Render nothing until the saved preference is read, so a saved dark theme never flashes light. */
  waitUntilHydrated?: boolean;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'light',
  palettes = PALETTES,
  waitUntilHydrated = false,
}) => {
  const [preference, setPreference] = useState<ThemePreference>(defaultTheme);
  const [ready, setReady] = useState(false);
  const systemScheme = useColorScheme();

  const store = useMemo(
    () =>
      createThemeStore({
        storage: asyncStorageAdapter,
        defaultPreference: defaultTheme,
        onChange: setPreference,
      }),
    [],
  );

  useEffect(() => {
    Promise.resolve()
      .then(() => store.hydrate())
      .catch(() => {})
      .finally(() => setReady(true));
  }, [store]);

  const theme = resolveTheme(preference, systemScheme);
  const colors = palettes[theme];

  // Keyboards, date pickers and system dialogs follow the app theme. With 'system' the override
  // is cleared so the device setting stays readable. 'unspecified' is missing from the RN 0.76
  // typings this package builds against, but the apps run newer RN versions that accept it.
  useEffect(() => {
    if (Platform.OS === 'web') return;
    Appearance.setColorScheme(
      preference === 'system' ? ('unspecified' as never) : theme === 'light' ? 'light' : 'dark',
    );
  }, [preference, theme]);

  useEffect(() => {
    // This package is built without the DOM lib.
    const doc = (globalThis as { document?: any }).document;
    if (Platform.OS !== 'web' || !doc) return;
    doc.querySelector('meta[name="theme-color"]')?.setAttribute('content', colors.background);
    doc.body.style.backgroundColor = colors.background;
    doc.documentElement.style.colorScheme = theme === 'light' ? 'light' : 'dark';
  }, [colors.background, theme]);

  const setTheme = (next: ThemePreference) => {
    store.setPreference(next);
  };

  if (waitUntilHydrated && !ready) return null;

  return <ThemeContext.Provider value={{ theme, preference, colors, setTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
};
