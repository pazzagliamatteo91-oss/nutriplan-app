import React from 'react';
import Svg, { Circle, Path, Line, Rect, Ellipse, Polyline } from 'react-native-svg';
import { colors } from '../theme';

export type IconName =
  | 'home'
  | 'recipes'
  | 'shopping'
  | 'analysis'
  | 'workout'
  | 'profile'
  | 'bell'
  | 'chevronRight'
  | 'chevronDown'
  | 'chevronLeft'
  | 'close'
  | 'check'
  | 'plus'
  | 'camera'
  | 'avatarPlaceholder'
  | 'clock'
  | 'flame'
  | 'leaf'
  | 'meat'
  | 'fish'
  | 'drop'
  | 'warningTriangle'
  | 'cart'
  | 'basketVegetable'
  | 'grain'
  | 'protein'
  | 'pantry'
  | 'upload'
  | 'edit'
  | 'calendarDay'
  | 'calendarWeek'
  | 'calendarMonth'
  | 'running'
  | 'cycling'
  | 'swimming'
  | 'tennis'
  | 'gym'
  | 'yoga'
  | 'soccer'
  | 'kettlebell'
  | 'pilatesRing'
  | 'moreDots'
  | 'watch'
  | 'sunrise'
  | 'sun'
  | 'apple'
  | 'moon'
  | 'search'
  | 'sparkle';

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export function Icon({ name, size = 22, color = colors.text, strokeWidth = 1.8 }: Props) {
  const common = {
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none' as const,
  };

  switch (name) {
    case 'home':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M4 11.5 12 4l8 7.5" {...common} />
          <Path d="M6 10v9a1 1 0 0 0 1 1h3v-6h4v6h3a1 1 0 0 0 1-1v-9" {...common} />
        </Svg>
      );
    case 'recipes':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M6 3v7a3 3 0 0 0 6 0V3" {...common} />
          <Line x1="9" y1="3" x2="9" y2="21" {...common} />
          <Path d="M17 3c-1.7 1.3-2.5 3-2.5 5.5S15.3 13 17 14v7" {...common} />
        </Svg>
      );
    case 'shopping':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M4 8h16l-1.3 10.4a2 2 0 0 1-2 1.6H7.3a2 2 0 0 1-2-1.6L4 8Z" {...common} />
          <Path d="M8 8V6a4 4 0 0 1 8 0v2" {...common} />
        </Svg>
      );
    case 'analysis':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M4 19V5" {...common} />
          <Path d="M4 15l4-4 3 3 5-6 4 4" {...common} />
        </Svg>
      );
    case 'workout':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Line x1="3" y1="12" x2="8" y2="12" {...common} />
          <Line x1="16" y1="12" x2="21" y2="12" {...common} />
          <Rect x="6" y="9" width="2.5" height="6" rx="0.6" {...common} />
          <Rect x="15.5" y="9" width="2.5" height="6" rx="0.6" {...common} />
          <Line x1="8.5" y1="12" x2="15.5" y2="12" {...common} />
        </Svg>
      );
    case 'profile':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx="12" cy="8" r="3.5" {...common} />
          <Path d="M5 20c1.2-3.8 4-5.5 7-5.5s5.8 1.7 7 5.5" {...common} />
        </Svg>
      );
    case 'bell':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M6 10a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 14 6 10Z" {...common} />
          <Path d="M10 18.5a2 2 0 0 0 4 0" {...common} />
        </Svg>
      );
    case 'chevronRight':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Polyline points="9 5 16 12 9 19" {...common} />
        </Svg>
      );
    case 'chevronLeft':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Polyline points="15 5 8 12 15 19" {...common} />
        </Svg>
      );
    case 'chevronDown':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Polyline points="5 9 12 16 19 9" {...common} />
        </Svg>
      );
    case 'close':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Line x1="6" y1="6" x2="18" y2="18" {...common} />
          <Line x1="18" y1="6" x2="6" y2="18" {...common} />
        </Svg>
      );
    case 'check':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Polyline points="5 12.5 10 17 19 7" {...common} />
        </Svg>
      );
    case 'plus':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Line x1="12" y1="5" x2="12" y2="19" {...common} />
          <Line x1="5" y1="12" x2="19" y2="12" {...common} />
        </Svg>
      );
    case 'camera':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" {...common} />
          <Circle cx="12" cy="13.5" r="3.2" {...common} />
        </Svg>
      );
    case 'avatarPlaceholder':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={strokeWidth} fill="none" />
          <Circle cx="12" cy="9.5" r="3.2" {...common} />
          <Path d="M5.5 19c1.3-3.2 3.7-4.8 6.5-4.8s5.2 1.6 6.5 4.8" {...common} />
        </Svg>
      );
    case 'clock':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx="12" cy="12" r="8.5" {...common} />
          <Path d="M12 7.5V12l3 2" {...common} />
        </Svg>
      );
    case 'flame':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M12 3s4 3.5 4 7.5a4 4 0 1 1-8 0c0-1 .4-1.8.9-2.5.3.9 1 1.4 1.6 1.1-.4-2 .5-4 1.5-6.1Z" {...common} />
        </Svg>
      );
    case 'leaf':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M5 19C4 11 9 5 19 4c1 10-5 15-13 14Z" {...common} />
          <Path d="M6 18c3-4 6-6.5 11-11" {...common} />
        </Svg>
      );
    case 'meat':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M9 4c4-1.5 8 1 8.5 5.5.4 3.5-2 5-4.5 5-1 1.7-2.5 3-4.5 3.5-2 .4-3.5-1-3-3 .5-2 2-3 4-3.5-2.5-1-3.5-4-1.5-6.5Z" {...common} />
        </Svg>
      );
    case 'fish':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M3 12c3-3.5 7-5 11-5 3 0 5.5 2 6.5 5-1 3-3.5 5-6.5 5-4 0-8-1.5-11-5Z" {...common} />
          <Path d="M20.5 12 22 9.5m-1.5 2.5L22 14.5" {...common} />
          <Circle cx="8" cy="11" r="0.6" fill={color} />
        </Svg>
      );
    case 'drop':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M12 3c3.5 4.5 6 8 6 11a6 6 0 0 1-12 0c0-3 2.5-6.5 6-11Z" {...common} />
        </Svg>
      );
    case 'warningTriangle':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M12 4 21.5 20H2.5L12 4Z" {...common} />
          <Line x1="12" y1="10.5" x2="12" y2="14.5" {...common} />
          <Circle cx="12" cy="17" r="0.6" fill={color} />
        </Svg>
      );
    case 'cart':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L20.5 8H6" {...common} />
          <Circle cx="9.5" cy="20" r="1.1" fill={color} />
          <Circle cx="17" cy="20" r="1.1" fill={color} />
        </Svg>
      );
    case 'basketVegetable':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M4 10h16l-1.8 8.5a2 2 0 0 1-2 1.5H7.8a2 2 0 0 1-2-1.5L4 10Z" {...common} />
          <Path d="M8 10 9.5 5M16 10 14.5 5M12 10V4" {...common} />
        </Svg>
      );
    case 'grain':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Line x1="12" y1="2.5" x2="12" y2="21" {...common} />
          <Path d="M12 5 9 3M12 5l3-2M12 9 9 7M12 9l3-2M12 13 9 11M12 13l3-2M12 17 9 15M12 17l3-2" {...common} />
        </Svg>
      );
    case 'protein':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M4.5 14c-1-3.2 1-6.5 4.2-6.8.8-2.7 3.7-4 6.1-2.5 2.8-.3 5.2 1.8 5.2 4.6.8 3-1.3 6.2-4.5 6.7-3.5.5-9.9.5-11-2Z" {...common} />
          <Circle cx="13.5" cy="11.5" r="2.6" fill={color} stroke="none" />
        </Svg>
      );
    case 'pantry':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Rect x="5" y="3.5" width="14" height="17" rx="2" {...common} />
          <Line x1="5" y1="10" x2="19" y2="10" {...common} />
          <Line x1="5" y1="15" x2="19" y2="15" {...common} />
        </Svg>
      );
    case 'upload':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M12 15V4M8 8l4-4 4 4" {...common} />
          <Path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" {...common} />
        </Svg>
      );
    case 'edit':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M4 20l1-4.5L16 4.5a1.5 1.5 0 0 1 2 0l1.5 1.5a1.5 1.5 0 0 1 0 2L8.5 19 4 20Z" {...common} />
        </Svg>
      );
    case 'calendarDay':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Rect x="4" y="5" width="16" height="15" rx="2" {...common} />
          <Line x1="4" y1="10" x2="20" y2="10" {...common} />
          <Rect x="10" y="13" width="4" height="4" rx="0.6" fill={color} stroke="none" />
        </Svg>
      );
    case 'calendarWeek':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Rect x="4" y="5" width="16" height="15" rx="2" {...common} />
          <Line x1="4" y1="10" x2="20" y2="10" {...common} />
          <Rect x="6.5" y="13" width="3" height="4" rx="0.6" fill={color} stroke="none" />
          <Rect x="10.5" y="13" width="3" height="4" rx="0.6" fill={color} stroke="none" />
          <Rect x="14.5" y="13" width="3" height="4" rx="0.6" fill={color} stroke="none" />
        </Svg>
      );
    case 'calendarMonth':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Rect x="4" y="5" width="16" height="15" rx="2" {...common} />
          <Line x1="4" y1="9" x2="20" y2="9" {...common} />
          <Line x1="8" y1="3" x2="8" y2="7" {...common} />
          <Line x1="16" y1="3" x2="16" y2="7" {...common} />
        </Svg>
      );
    case 'running':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx="15" cy="5" r="1.6" fill={color} stroke="none" />
          <Path d="M6 20l3.5-4 2-2.5-1-4L7 11M11.5 13.5 15 11l3 2.5-1.5 3.5M9 9.5l4-1.5 2.5 3H19" {...common} />
        </Svg>
      );
    case 'cycling':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx="6" cy="17" r="3" {...common} />
          <Circle cx="18" cy="17" r="3" {...common} />
          <Path d="M6 17l4-8h4l4 8M10 9h3M9 17h6l-2.5-5" {...common} />
        </Svg>
      );
    case 'swimming':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx="18" cy="5.5" r="1.6" fill={color} stroke="none" />
          <Path d="M4 12.5 9 8l3 2.5-2.5 3M12 10.5l4-3 2.5 2" {...common} />
          <Path d="M3 17c1.5 1.3 3 1.3 4.5 0s3-1.3 4.5 0 3 1.3 4.5 0 3-1.3 4.5 0" {...common} />
          <Path d="M3 20c1.5 1.3 3 1.3 4.5 0s3-1.3 4.5 0 3 1.3 4.5 0 3-1.3 4.5 0" {...common} />
        </Svg>
      );
    case 'tennis':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Ellipse cx="10" cy="9" rx="5.5" ry="6.5" {...common} />
          <Line x1="10" y1="2.5" x2="10" y2="15.5" {...common} />
          <Line x1="4.5" y1="9" x2="15.5" y2="9" {...common} />
          <Path d="M8 15 5 21" {...common} />
          <Circle cx="19" cy="5" r="1.6" fill={color} stroke="none" />
        </Svg>
      );
    case 'gym':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Line x1="2" y1="12" x2="22" y2="12" {...common} />
          <Line x1="6" y1="8" x2="6" y2="16" {...common} />
          <Line x1="18" y1="8" x2="18" y2="16" {...common} />
          <Line x1="3" y1="10" x2="3" y2="14" {...common} />
          <Line x1="21" y1="10" x2="21" y2="14" {...common} />
        </Svg>
      );
    case 'yoga':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx="12" cy="5" r="1.7" fill={color} stroke="none" />
          <Path d="M12 8v4M12 12l-6 6M12 12l6 6M6 15h12" {...common} />
        </Svg>
      );
    case 'soccer':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx="12" cy="12" r="8.5" {...common} />
          <Path d="M12 8.5 15.5 11l-1.3 4H9.8L8.5 11Z" {...common} />
          <Path d="M12 8.5V5.5M15.5 11l3-1M13.7 15l1.2 3M10.3 15l-1.2 3M8.5 11l-3-1" {...common} />
        </Svg>
      );
    case 'kettlebell':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" {...common} />
          <Circle cx="12" cy="15" r="6.3" {...common} />
        </Svg>
      );
    case 'pilatesRing':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx="12" cy="12" r="8" {...common} />
          <Path d="M3.6 9.5h1.8M3.6 14.5h1.8M18.6 9.5h1.8M18.6 14.5h1.8" {...common} />
        </Svg>
      );
    case 'moreDots':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx="6" cy="12" r="1.4" fill={color} stroke="none" />
          <Circle cx="12" cy="12" r="1.4" fill={color} stroke="none" />
          <Circle cx="18" cy="12" r="1.4" fill={color} stroke="none" />
        </Svg>
      );
    case 'watch':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Rect x="7" y="7" width="10" height="10" rx="3" {...common} />
          <Path d="M9 7 9.5 4h5L15 7M9 17l.5 3h5l.5-3" {...common} />
          <Path d="M12 10v2.3l1.6 1" {...common} />
        </Svg>
      );
    case 'sunrise':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M4 17h16" {...common} />
          <Path d="M6.5 17a5.5 5.5 0 0 1 11 0" {...common} />
          <Path d="M12 8V5M6 9l1.8 1.8M18 9l-1.8 1.8" {...common} />
        </Svg>
      );
    case 'sun':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx="12" cy="12" r="4" {...common} />
          <Line x1="12" y1="3" x2="12" y2="5.5" {...common} />
          <Line x1="12" y1="18.5" x2="12" y2="21" {...common} />
          <Line x1="3" y1="12" x2="5.5" y2="12" {...common} />
          <Line x1="18.5" y1="12" x2="21" y2="12" {...common} />
        </Svg>
      );
    case 'apple':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M12 9c-3-2.5-7-1-7 3.5S8 20 12 20s7-3 7-7.5S15 6.5 12 9Z" {...common} />
          <Path d="M12 9c0-2 .8-3.5 2.5-4.5" {...common} />
        </Svg>
      );
    case 'moon':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M19 14.5A8 8 0 1 1 9.5 5a6.5 6.5 0 0 0 9.5 9.5Z" {...common} />
        </Svg>
      );
    case 'search':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx="11" cy="11" r="6.5" {...common} />
          <Line x1="20" y1="20" x2="15.8" y2="15.8" {...common} />
        </Svg>
      );
    case 'sparkle':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M12 3.5 13.6 9.3 19.5 11 13.6 12.7 12 18.5 10.4 12.7 4.5 11 10.4 9.3Z" {...common} />
          <Path d="M19 15.5 19.7 17.8 22 18.5 19.7 19.2 19 21.5 18.3 19.2 16 18.5 18.3 17.8Z" fill={color} stroke="none" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx="12" cy="12" r="8" {...common} />
        </Svg>
      );
  }
}
