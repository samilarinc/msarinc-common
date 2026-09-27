import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, Pressable, Modal, Animated, StyleSheet, useWindowDimensions } from 'react-native';
import { SlidersHorizontal, X, type LucideIcon } from 'lucide-react-native';
import { SPACING } from '@msarinc/theme-core';
import { useTheme } from './ThemeProvider';
import { SHADOW } from './createBaseStyles';

export interface HeaderMenuProps {
  accessibilityLabel: string;
  children: React.ReactNode;
  /** Icon shown while closed. Default: SlidersHorizontal. */
  icon?: LucideIcon;
}

const TRIGGER_SIZE = 36;

/** A single header button that slides down into a tab stacking its children. Tapping outside closes it. */
export default function HeaderMenu({ accessibilityLabel, children, icon: Icon = SlidersHorizontal }: HeaderMenuProps) {
  const { colors } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const triggerRef = useRef<View>(null);
  const slide = useRef(new Animated.Value(0)).current;
  const [anchor, setAnchor] = useState<{ top: number; right: number } | null>(null);

  useEffect(() => {
    if (!anchor) return;
    slide.setValue(0);
    Animated.timing(slide, { toValue: 1, duration: 180, useNativeDriver: true }).start();
  }, [anchor, slide]);

  const open = () => {
    triggerRef.current?.measureInWindow((x, y, width) => {
      setAnchor({ top: y, right: windowWidth - (x + width) });
    });
  };
  const close = () => setAnchor(null);

  const triggerStyle = [styles.trigger, { backgroundColor: colors.surface, borderColor: colors.border }];

  return (
    <>
      <TouchableOpacity ref={triggerRef} accessibilityLabel={accessibilityLabel} onPress={open} style={triggerStyle}>
        <Icon size={18} color={colors.primary} />
      </TouchableOpacity>

      <Modal visible={!!anchor} transparent animationType="none" onRequestClose={close} statusBarTranslucent>
        <Pressable style={StyleSheet.absoluteFill} onPress={close} />
        {anchor && (
          <View style={[styles.tongue, { top: anchor.top, right: anchor.right, backgroundColor: colors.primary }]}>
            <TouchableOpacity
              accessibilityLabel={accessibilityLabel}
              accessibilityState={{ expanded: true }}
              onPress={close}
              style={triggerStyle}
            >
              <X size={18} color={colors.primary} />
            </TouchableOpacity>
            <Animated.View
              style={[
                styles.items,
                {
                  opacity: slide,
                  transform: [{ translateY: slide.interpolate({ inputRange: [0, 1], outputRange: [-TRIGGER_SIZE, 0] }) }],
                },
              ]}
            >
              {children}
            </Animated.View>
          </View>
        )}
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    width: TRIGGER_SIZE,
    height: TRIGGER_SIZE,
    borderRadius: TRIGGER_SIZE / 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tongue: {
    position: 'absolute',
    alignItems: 'center',
    borderRadius: TRIGGER_SIZE / 2 + SPACING.xs,
    padding: SPACING.xs,
    margin: -SPACING.xs,
    overflow: 'hidden',
    ...SHADOW.md,
  },
  items: {
    alignItems: 'center',
    gap: SPACING.sm,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xs,
  },
});
