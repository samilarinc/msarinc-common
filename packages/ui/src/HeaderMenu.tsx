import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Pressable,
  Modal,
  Animated,
  Platform,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { createPortal } from 'react-dom';
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
    Animated.timing(slide, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [anchor, slide]);

  const open = () => {
    triggerRef.current?.measureInWindow((x, y, width) => {
      setAnchor({ top: y, right: windowWidth - (x + width) });
    });
  };
  const close = () => setAnchor(null);
  const tongueRef = useRef<View>(null);
  const isWeb = Platform.OS === 'web';

  // On web the menu is a plain fixed panel (no Modal), so the page keeps scrolling; any press outside it closes it.
  // It is portaled to <body>: react-native-web gives every View its own stacking context, so inside the header
  // it would sit under anything rendered after the header (floating buttons, bars).
  useEffect(() => {
    if (!isWeb || !anchor) return;
    type DomNode = { contains(other: unknown): boolean };
    const doc = (
      globalThis as unknown as {
        document: {
          addEventListener(type: string, fn: (e: { target: unknown }) => void): void;
          removeEventListener(type: string, fn: (e: { target: unknown }) => void): void;
        };
      }
    ).document;
    const onPointerDown = (e: { target: unknown }) => {
      const node = tongueRef.current as unknown as DomNode | null;
      const trigger = triggerRef.current as unknown as DomNode | null;
      if (node?.contains(e.target) || trigger?.contains(e.target)) return;
      setAnchor(null);
    };
    doc.addEventListener('pointerdown', onPointerDown);
    return () => doc.removeEventListener('pointerdown', onPointerDown);
  }, [isWeb, anchor]);

  const triggerStyle = [styles.trigger, { backgroundColor: colors.surface, borderColor: colors.border }];

  const renderTongue = (position?: 'fixed') => (
    <View
      ref={tongueRef}
      style={[
        styles.tongue,
        {
          top: anchor!.top,
          right: anchor!.right,
          backgroundColor: colors.primary,
        },
        position && ({ position, zIndex: 2147483647 } as object),
      ]}
    >
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
            transform: [
              {
                translateY: slide.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-TRIGGER_SIZE, 0],
                }),
              },
            ],
          },
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );

  return (
    <>
      <TouchableOpacity ref={triggerRef} accessibilityLabel={accessibilityLabel} onPress={open} style={triggerStyle}>
        <Icon size={18} color={colors.primary} />
      </TouchableOpacity>

      {isWeb ? (
        anchor && createPortal(renderTongue('fixed'), (globalThis as unknown as { document: { body: Element } }).document.body)
      ) : (
        <Modal visible={!!anchor} transparent animationType="none" onRequestClose={close} statusBarTranslucent>
          <Pressable style={StyleSheet.absoluteFill} onPress={close} />
          {anchor && renderTongue()}
        </Modal>
      )}
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
