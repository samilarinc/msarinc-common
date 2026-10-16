import { Platform, ViewStyle } from 'react-native';

export interface ShadowOptions {
  /** Hex (#rgb / #rrggbb) colors get the opacity applied on web; other formats are used as they are */
  color?: string;
  opacity?: number;
  radius: number;
  offset?: { width: number; height: number };
  /** Android only */
  elevation?: number;
}

const withOpacity = (color: string, opacity: number) => {
  const hex = color.replace('#', '');
  if (!/^([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) return color;
  const full = hex.length === 3 ? hex.split('').map(ch => ch + ch).join('') : hex;
  const n = parseInt(full, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${opacity})`;
};

/**
 * Drop shadow that works everywhere: `boxShadow` on web (react-native-web deprecated the
 * `shadow*` props there and warns about them), `shadow*` + `elevation` on iOS/Android.
 */
export const shadow = ({ color = '#000', opacity = 1, radius, offset = { width: 0, height: 0 }, elevation }: ShadowOptions): ViewStyle =>
  Platform.OS === 'web'
    ? { boxShadow: `${offset.width}px ${offset.height}px ${radius}px ${withOpacity(color, opacity)}` }
    : {
      shadowColor: color,
      shadowOpacity: opacity,
      shadowRadius: radius,
      shadowOffset: offset,
      ...(elevation !== undefined ? { elevation } : {}),
    };
