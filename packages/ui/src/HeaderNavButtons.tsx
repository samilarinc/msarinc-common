import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft, Home } from 'lucide-react-native';
import { useTheme } from './ThemeProvider';

export interface HeaderNavButtonsLabels {
  back: string;
  home: string;
}

const DEFAULT_LABELS: HeaderNavButtonsLabels = {
  back: 'Back',
  home: 'Home',
};

export interface HeaderNavButtonsProps {
  showBack?: boolean;
  onBackPress?: () => void;
  showHome?: boolean;
  onHomePress?: () => void;
  labels?: Partial<HeaderNavButtonsLabels>;
}

export default function HeaderNavButtons({
  showBack,
  onBackPress,
  showHome,
  onHomePress,
  labels,
}: HeaderNavButtonsProps) {
  const { colors } = useTheme();
  const resolvedLabels = { ...DEFAULT_LABELS, ...labels };

  if (!(showBack && onBackPress) && !(showHome && onHomePress)) return null;

  return (
    <View style={styles.row}>
      {showBack && onBackPress && (
        <TouchableOpacity
          accessibilityLabel={resolvedLabels.back}
          onPress={onBackPress}
          style={[styles.button, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <ArrowLeft size={18} color={colors.primary} />
        </TouchableOpacity>
      )}
      {showHome && onHomePress && (
        <TouchableOpacity
          accessibilityLabel={resolvedLabels.home}
          onPress={onHomePress}
          style={[styles.button, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Home size={18} color={colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
