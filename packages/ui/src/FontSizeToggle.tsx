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
  /** Stack A+ over A- in one joined box instead of side by side. */
  vertical?: boolean;
}

export default function FontSizeToggle({
  onDecrease,
  onIncrease,
  labels,
  disabledDecrease,
  disabledIncrease,
  vertical = false,
}: FontSizeToggleProps) {
  const { colors } = useTheme();
  const resolvedLabels = { ...DEFAULT_LABELS, ...labels };

  const decrease = (
    <TouchableOpacity
      key="decrease"
      accessibilityLabel={resolvedLabels.decrease}
      onPress={onDecrease}
      disabled={disabledDecrease}
      style={[styles.button, disabledDecrease && styles.buttonDisabled]}
    >
      <Text style={[styles.label, { fontSize: 13, color: colors.text }]}>A-</Text>
    </TouchableOpacity>
  );
  const increase = (
    <TouchableOpacity
      key="increase"
      accessibilityLabel={resolvedLabels.increase}
      onPress={onIncrease}
      disabled={disabledIncrease}
      style={[styles.button, disabledIncrease && styles.buttonDisabled]}
    >
      <Text style={[styles.label, { fontSize: 17, color: colors.text }]}>A+</Text>
    </TouchableOpacity>
  );
  const divider = (
    <View key="divider" style={[vertical ? styles.dividerHorizontal : styles.divider, { backgroundColor: colors.border }]} />
  );

  return (
    <View
      style={[
        styles.container,
        vertical && styles.containerVertical,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      {vertical ? [increase, divider, decrease] : [decrease, divider, increase]}
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
  containerVertical: {
    flexDirection: 'column',
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
  dividerHorizontal: {
    height: 1,
    width: 18,
    marginVertical: 2,
  },
  label: {
    fontWeight: '900',
  },
});
