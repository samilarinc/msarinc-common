import { PALETTES, Palette, ThemeName, isThemeName } from './palettes';

export interface ThemeStorageAdapter {
  get(): ThemeName | null | Promise<ThemeName | null>;
  set(theme: ThemeName): void | Promise<void>;
}

export interface ThemeStoreOptions {
  storage: ThemeStorageAdapter;
  defaultTheme?: ThemeName;
  onChange: (theme: ThemeName, colors: Palette) => void;
}

export interface ThemeStore {
  getTheme(): ThemeName;
  setTheme(theme: ThemeName): void | Promise<void>;
  getColors(): Palette;
  /** Kaydedilmiş temayı storage'dan okuyup onChange'i tetikler (async storage'lar için). */
  hydrate(): void | Promise<void>;
}

/**
 * Web (localStorage, senkron) ve native (AsyncStorage, asenkron) ThemeProvider'ların
 * ortak temelini oluşturan framework-agnostic tema state mantığı.
 */
export function createThemeStore(options: ThemeStoreOptions): ThemeStore {
  const { storage, onChange } = options;
  let current: ThemeName = options.defaultTheme ?? 'light';

  const setTheme = (theme: ThemeName) => {
    current = theme;
    onChange(current, PALETTES[current]);
    return storage.set(theme);
  };

  const hydrate = () => {
    const result = storage.get();
    if (result instanceof Promise) {
      return result.then((saved) => {
        if (isThemeName(saved)) {
          current = saved;
          onChange(current, PALETTES[current]);
        }
      });
    }
    if (isThemeName(result)) {
      current = result;
      onChange(current, PALETTES[current]);
    }
  };

  return {
    getTheme: () => current,
    setTheme,
    getColors: () => PALETTES[current],
    hydrate,
  };
}
