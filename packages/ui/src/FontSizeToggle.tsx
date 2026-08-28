import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from './ThemeProvider';

export interface FontSizeToggleLabels {
  decrease: string;
  increase: string;
}

const DEFAULT_LABELS: FontSizeToggleLabels = {
  decrease: 'Decrease font size',
  increase: 'Increase font size',
};

export interface FontSizeToggleProps {
  onDecrease: () => void;
  onIncrease: () => void;
  labels?: Partial<FontSizeToggleLabels>;
  disabledDecrease?: boolean;
  disabledIncrease?: boolean;
}

export default function FontSizeToggle({
  onDecrease,
  onIncrease,
  labels,
  disabledDecrease,
  disabledIncrease,
}: FontSizeToggleProps) {
  const { colors } = useTheme();
  const resolvedLabels = { ...DEFAULT_LABELS, ...labels };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <TouchableOpacity
        accessibilityLabel={resolvedLabels.decrease}
        onPress={onDecrease}
        disabled={disabledDecrease}
        style={[styles.button, disabledDecrease && styles.buttonDisabled]}
      >
        <Text style={[styles.label, { fontSize: 13, color: colors.text }]}>A-</Text>
      </TouchableOpacity>
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      <TouchableOpacity
        accessibilityLabel={resolvedLabels.increase}
        onPress={onIncrease}
        disabled={disabledIncrease}
        style={[styles.button, disabledIncrease && styles.buttonDisabled]}
      >
        <Text style={[styles.label, { fontSize: 17, color: colors.text }]}>A+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    padding: 2,
  },
  button: {
    minWidth: 36,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  divider: {
    width: 1,
    height: 18,
    marginHorizontal: 2,
  },
  label: {
    fontWeight: '900',
  },
});
