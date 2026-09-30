import { ThemePreference, isThemePreference } from './palettes';

export interface ThemeStorageAdapter {
  get(): ThemePreference | null | Promise<ThemePreference | null>;
  set(preference: ThemePreference): void | Promise<void>;
}

export interface ThemeStoreOptions {
  storage: ThemeStorageAdapter;
  defaultPreference?: ThemePreference;
  onChange: (preference: ThemePreference) => void;
}

export interface ThemeStore {
  getPreference(): ThemePreference;
  setPreference(preference: ThemePreference): void | Promise<void>;
  hydrate(): void | Promise<void>;
}

// The store only knows the preference: turning 'system' into a concrete theme needs the
// device's color scheme, which is the UI layer's job (see resolveTheme).
export function createThemeStore(options: ThemeStoreOptions): ThemeStore {
  const { storage, onChange } = options;
  let current: ThemePreference = options.defaultPreference ?? 'light';

  const apply = (saved: unknown) => {
    if (isThemePreference(saved)) {
      current = saved;
      onChange(current);
    }
  };

  const setPreference = (preference: ThemePreference) => {
    current = preference;
    onChange(current);
    return storage.set(preference);
  };

  const hydrate = () => {
    const result = storage.get();
    if (result instanceof Promise) return result.then(apply);
    apply(result);
  };

  return { getPreference: () => current, setPreference, hydrate };
}
