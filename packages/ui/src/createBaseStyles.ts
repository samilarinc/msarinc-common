import { Platform, StyleSheet, ViewStyle } from 'react-native';
import { FONT_SIZES, RADIUS, SPACING, type Palette } from '@msarinc/theme-core';

// Deliberately minimal so each app can map its own theme shape onto it.
export interface BaseStyleColors {
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  primary: string;
  onPrimary: string;
  border: string;
}

export const paletteToBaseStyleColors = (palette: Palette): BaseStyleColors => ({
  background: palette.background,
  surface: palette.surface,
  text: palette.text,
  textMuted: palette.textMuted,
  primary: palette.primary,
  onPrimary: palette.white,
  border: palette.border,
});

// react-native-web renders Modal children inline, so overlays must pin themselves to the viewport.
const webFixedFill = Platform.select<ViewStyle>({
  web: { position: 'fixed' as ViewStyle['position'], top: 0, left: 0, right: 0, bottom: 0 },
  default: {},
});

export const SHADOW = {
  sm: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  md: {
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
} as const;

export const createBaseStyles = (c: BaseStyleColors) => StyleSheet.create({
  // Layout
  flex1: { flex: 1 },
  container: { flex: 1, backgroundColor: c.background },
  center: { justifyContent: 'center', alignItems: 'center' },
  centerFill: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowGap: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  content: { flex: 1, padding: SPACING.md },
  contentLarge: { flex: 1, padding: SPACING.lg },
  listContent: { padding: SPACING.lg },
  rowFill: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs },
  offscreen: { position: 'absolute', left: -9999, top: 0, opacity: 0 },

  // Spacing atoms, combined in style arrays: [common.centerFill, common.gapMd]
  gapXs: { gap: SPACING.xs },
  gapSm: { gap: SPACING.sm },
  gapMd: { gap: SPACING.md },
  gapLg: { gap: SPACING.lg },
  mb0: { marginBottom: 0 },
  mbXs: { marginBottom: SPACING.xs },
  mbSm: { marginBottom: SPACING.sm },
  mbMd: { marginBottom: SPACING.md },
  mbLg: { marginBottom: SPACING.lg },
  mbXl: { marginBottom: SPACING.xl },
  mtSm: { marginTop: SPACING.sm },
  mtMd: { marginTop: SPACING.md },
  pMd: { padding: SPACING.md },
  pLg: { padding: SPACING.lg },
  phLg: { paddingHorizontal: SPACING.lg },
  pbXl: { paddingBottom: SPACING.xl },
  mhMd: { marginHorizontal: SPACING.md },
  textCenter: { textAlign: 'center' },

  // Surfaces
  card: {
    backgroundColor: c.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOW.sm,
  },
  sectionCard: {
    backgroundColor: c.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: c.border,
  },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: c.border },
  // Bordered row card for list entries (checklists, pickers, settings)
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: c.surface,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },

  // Typography
  title: { fontSize: FONT_SIZES.large, fontWeight: 'bold', color: c.text, marginBottom: SPACING.xs },
  titleLarge: { fontSize: FONT_SIZES.xlarge, fontWeight: 'bold', color: c.text, marginBottom: SPACING.xs },
  subtitle: { fontSize: FONT_SIZES.medium, color: c.textMuted },
  textLarge: { fontSize: FONT_SIZES.large, color: c.text },
  text: { fontSize: FONT_SIZES.medium, color: c.text },
  textStrong: { fontSize: FONT_SIZES.medium, fontWeight: '600', color: c.text },
  textAccent: { fontSize: FONT_SIZES.medium, fontWeight: '600', color: c.primary },
  smallText: { fontSize: FONT_SIZES.small, color: c.textMuted },
  sectionLabel: { fontSize: FONT_SIZES.small, fontWeight: '600', color: c.textMuted, letterSpacing: 0.5 },
  footerText: { fontSize: FONT_SIZES.small, color: c.textMuted, fontStyle: 'italic', textAlign: 'center' },
  note: { color: c.textMuted, textAlign: 'center', marginVertical: SPACING.md },
  checkedText: { textDecorationLine: 'line-through', opacity: 0.6 },
  disabled: { opacity: 0.5 },

  // Forms
  input: {
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    backgroundColor: c.surface,
    color: c.text,
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: SPACING.xs,
    marginTop: SPACING.sm,
    color: c.text,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingVertical: SPACING.xs,
  },

  // Buttons & selection
  button: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: { backgroundColor: c.primary },
  buttonOutline: { borderWidth: 1.5, borderColor: c.primary },
  buttonMuted: { backgroundColor: c.border },
  buttonTextPrimary: { color: c.onPrimary, fontWeight: '600' },
  buttonTextOutline: { color: c.primary, fontWeight: '600' },
  selected: { backgroundColor: c.primary, borderColor: c.primary },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: c.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: { color: c.onPrimary, fontSize: 14, fontWeight: 'bold' },
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.md,
    alignSelf: 'flex-start',
  },
  badgeText: { fontSize: FONT_SIZES.small, fontWeight: '600' },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
    ...webFixedFill,
  },
  modalOverlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    ...webFixedFill,
  },
  modalContent: {
    backgroundColor: c.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 500,
    ...SHADOW.md,
  },
  modalTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: '700',
    marginBottom: SPACING.lg,
    textAlign: 'center',
    color: c.text,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: c.border,
  },
  modalHeaderTitle: { fontSize: FONT_SIZES.large, fontWeight: '600', color: c.text },
  modalCloseButton: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  modalCloseButtonText: { fontSize: 20, fontWeight: '600', color: c.textMuted },
  modalButtonsRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: SPACING.sm, gap: SPACING.md },

  // Empty states
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  emptyStateText: {
    fontSize: FONT_SIZES.medium,
    color: c.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export type BaseStyles = ReturnType<typeof createBaseStyles>;
