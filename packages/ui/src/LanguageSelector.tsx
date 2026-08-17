import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { useTheme } from './ThemeProvider';

export interface LanguageOption {
  code: string;
  label: string;
}

export interface LanguageSelectorProps {
  value: string;
  languages: LanguageOption[];
  onChange: (code: string) => void;
  /** Belirtilmezse genişliğe göre otomatik seçilir (bkz. breakpoint). */
  compact?: boolean;
  /** compact otomatik seçilirken kullanılan genişlik eşiği (px). Varsayılan: 640. */
  breakpoint?: number;
}

export default function LanguageSelector({
  value,
  languages,
  onChange,
  compact,
  breakpoint = 640,
}: LanguageSelectorProps) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isCompact = compact ?? width < breakpoint;

  if (isCompact) {
    const currentIndex = Math.max(
      languages.findIndex((l) => l.code === value),
      0,
    );
    const current = languages[currentIndex];
    const next = languages[(currentIndex + 1) % languages.length];

    return (
      <TouchableOpacity
        accessibilityLabel={`Language: ${current.label}. Tap to switch to ${next.label}`}
        onPress={() => onChange(next.code)}
        style={[styles.compactButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        <Text style={[styles.code, { color: colors.text }]}>{current.code.toUpperCase()}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {languages.map((lang) => {
        const active = lang.code === value;
        return (
          <TouchableOpacity
            key={lang.code}
            accessibilityLabel={lang.label}
            onPress={() => onChange(lang.code)}
            style={[styles.button, active && { backgroundColor: colors.background, shadowColor: '#000' }]}
          >
            <Text style={[styles.code, { color: active ? colors.primary : colors.textMuted }]}>
              {lang.code.toUpperCase()}
            </Text>
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
    minWidth: 32,
    height: 32,
    paddingHorizontal: 8,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  compactButton: {
    minWidth: 36,
    height: 36,
    paddingHorizontal: 8,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  code: { fontWeight: '600', fontSize: 12 },
});
