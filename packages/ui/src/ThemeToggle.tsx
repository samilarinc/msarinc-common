import React from 'react';
import { View, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { Sun, Moon, Zap, SunMoon, type LucideIcon } from 'lucide-react-native';
import { ThemePreference } from '@msarinc/theme-core';
import { useTheme } from './ThemeProvider';

const THEME_ICONS: { name: ThemePreference; Icon: LucideIcon }[] = [
  { name: 'system', Icon: SunMoon },
  { name: 'light', Icon: Sun },
  { name: 'dark', Icon: Moon },
  { name: 'lights-out', Icon: Zap },
];

export interface ThemeToggleLabels {
  system: string;
  light: string;
  dark: string;
  lightsOut: string;
  accessibilityLabel: (current: string, next: string) => string;
}

const DEFAULT_LABELS: ThemeToggleLabels = {
  system: 'System',
  light: 'Light',
  dark: 'Dark',
  lightsOut: 'Lights Out',
  accessibilityLabel: (current, next) => `Theme: ${current}. Tap to switch, next: ${next}`,
};

export interface ThemeToggleProps {
  /** Chosen from the window width when omitted (see breakpoint). */
  compact?: boolean;
  /** Width in px below which compact is used automatically. Default: 640. */
  breakpoint?: number;
  /** Adds a 'System' option that follows the device's light/dark setting. Default: false. */
  includeSystem?: boolean;
  labels?: Partial<ThemeToggleLabels>;
}

export default function ThemeToggle({ compact, breakpoint = 640, includeSystem = false, labels }: ThemeToggleProps) {
  const { preference, setTheme, colors } = useTheme();
  const { width } = useWindowDimensions();
  const isCompact = compact ?? width < breakpoint;
  const resolvedLabels = { ...DEFAULT_LABELS, ...labels };

  const LABEL_KEYS = { system: 'system', light: 'light', dark: 'dark', 'lights-out': 'lightsOut' } as const;
  const OPTIONS = THEME_ICONS.filter((o) => includeSystem || o.name !== 'system').map((o) => ({
    ...o,
    label: resolvedLabels[LABEL_KEYS[o.name]],
  }));

  if (isCompact) {
    const currentIndex = Math.max(0, OPTIONS.findIndex((o) => o.name === preference));
    const current = OPTIONS[currentIndex];
    const next = OPTIONS[(currentIndex + 1) % OPTIONS.length];

    return (
      <TouchableOpacity
        accessibilityLabel={resolvedLabels.accessibilityLabel(current.label, next.label)}
        onPress={() => setTheme(next.name)}
        style={[styles.compactButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        <current.Icon size={18} color={colors.primary} />
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {OPTIONS.map(({ name, Icon, label }) => {
        const active = preference === name;
        return (
          <TouchableOpacity
            key={name}
            accessibilityLabel={label}
            onPress={() => setTheme(name)}
            style={[styles.button, active && { backgroundColor: colors.background, shadowColor: '#000' }]}
          >
            <Icon size={18} color={active ? colors.primary : colors.textMuted} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 2,
    padding: 3,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  button: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  compactButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
