export type ThemeName = 'light' | 'dark' | 'lights-out';

export const THEME_NAMES: ThemeName[] = ['light', 'dark', 'lights-out'];

/** What the user picked; 'system' follows the device's light/dark setting. */
export type ThemePreference = ThemeName | 'system';

export const THEME_PREFERENCES: ThemePreference[] = ['system', ...THEME_NAMES];

export type Palette = {
  background: string;
  text: string;
  textMuted: string;
  primary: string;
  primaryHover: string;
  surface: string;
  border: string;
  header: string;
  danger: string;
  white: string;
};

// The primary brand color is the same in every theme.
export const PALETTES: Record<ThemeName, Palette> = {
  light: {
    background: '#f8f9fa',
    text: '#2c3e50',
    textMuted: '#7f8c8d',
    primary: '#26a68a',
    primaryHover: '#1e866f',
    surface: '#ffffff',
    border: '#e9ecef',
    header: 'rgba(255, 255, 255, 0.9)',
    danger: '#d32f2f',
    white: '#ffffff',
  },
  dark: {
    background: '#1a1a2e',
    text: '#e6e6e6',
    textMuted: '#94a3b8',
    primary: '#26a68a',
    primaryHover: '#1e866f',
    surface: '#16213e',
    border: '#24344d',
    header: 'rgba(26, 26, 46, 0.9)',
    danger: '#ef5350',
    white: '#ffffff',
  },
  'lights-out': {
    background: '#000000',
    text: '#ffffff',
    textMuted: '#a1a1aa',
    primary: '#26a68a',
    primaryHover: '#1e866f',
    surface: '#0a0a0a',
    border: '#1a1a1a',
    header: 'rgba(0, 0, 0, 0.9)',
    danger: '#ef5350',
    white: '#ffffff',
  },
};

export function isThemeName(value: unknown): value is ThemeName {
  return value === 'light' || value === 'dark' || value === 'lights-out';
}

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'system' || isThemeName(value);
}

export function resolveTheme(preference: ThemePreference, systemScheme: string | null | undefined): ThemeName {
  if (preference !== 'system') return preference;
  return systemScheme === 'dark' ? 'dark' : 'light';
}
