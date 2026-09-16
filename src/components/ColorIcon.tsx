import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path, Line, Rect } from 'react-native-svg';

export type ColorIconName = 'home' | 'recipes' | 'shopping' | 'analysis' | 'workout' | 'avocado';

// Icone "duotone" a colori fissi (badge pastello + glifo pieno), pensate per dare
// personalità alla tab bar e alle card Home, in stile coerente con la palette avocado
// ma più vivace delle icone di utilità (line-art monocromatiche in Icon.tsx).
const THEMES: Record<Exclude<ColorIconName, 'avocado'>, { bg: string; fg: string }> = {
  home: { bg: '#DCE8C2', fg: '#4E6A34' },
  recipes: { bg: '#F6D9C7', fg: '#C1552F' },
  shopping: { bg: '#F5E4A8', fg: '#A97A1B' },
  analysis: { bg: '#CFE6EF', fg: '#2E7490' },
  workout: { bg: '#F3CBC3', fg: '#BD4635' },
};

const AVOCADO = { skin: '#3F5233', flesh: '#C4D583', pit: '#8B5A3C' };

type Props = {
  name: ColorIconName;
  size?: number;
  focused?: boolean;
};

export function ColorIcon({ name, size = 24, focused = true }: Props) {
  const content = renderGlyph(name, size);
  return <View style={{ opacity: focused ? 1 : 0.45 }}>{content}</View>;
}

function renderGlyph(name: ColorIconName, size: number) {
  if (name === 'avocado') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d="M12 2c-4.5 0-7.5 4.6-7.5 10.2 0 5.1 3.3 9.3 7.5 9.3s7.5-4.2 7.5-9.3C19.5 6.6 16.5 2 12 2Z" fill={AVOCADO.skin} />
        <Path d="M12 4.3c-3.2 0-5.4 3.9-5.4 8.4 0 3.9 2.2 6.9 5.4 6.9s5.4-3 5.4-6.9c0-4.5-2.2-8.4-5.4-8.4Z" fill={AVOCADO.flesh} />
        <Circle cx="12" cy="13.6" r="3.3" fill={AVOCADO.pit} />
        <Path d="M10.6 12.3a2.2 2 0 0 1 2.6-0.4" stroke="#F3E6D4" strokeWidth={0.8} strokeLinecap="round" fill="none" opacity={0.6} />
      </Svg>
    );
  }

  const { bg, fg } = THEMES[name];

  switch (name) {
    case 'home':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx="12" cy="12" r="11" fill={bg} />
          <Path d="M6 12.5 12 7l6 5.5" stroke={fg} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M7.5 11.5V18a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-6.5" stroke={fg} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <Rect x="10.4" y="14.3" width="3.2" height="4.7" rx="0.6" fill={fg} />
        </Svg>
      );
    case 'recipes':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx="12" cy="12" r="11" fill={bg} />
          <Path d="M8.7 6v4.2a1.7 1.7 0 0 0 3.4 0V6" stroke={fg} strokeWidth={1.8} fill="none" strokeLinecap="round" />
          <Line x1="10.4" y1="6" x2="10.4" y2="18.5" stroke={fg} strokeWidth={1.8} strokeLinecap="round" />
          <Path d="M15.6 6c-1.3 1.1-1.9 2.5-1.9 4.3 0 1.7.8 3.1 1.9 3.9v4.3" stroke={fg} strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'shopping':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx="12" cy="12" r="11" fill={bg} />
          <Path d="M7.4 9h9.2l-.9 8.3a1.4 1.4 0 0 1-1.4 1.2H9.7a1.4 1.4 0 0 1-1.4-1.2L7.4 9Z" fill={fg} />
          <Path d="M9.3 9V7.4a2.7 2.7 0 0 1 5.4 0V9" stroke={fg} strokeWidth={1.8} fill="none" strokeLinecap="round" />
        </Svg>
      );
    case 'analysis':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx="12" cy="12" r="11" fill={bg} />
          <Path d="M7 17V8" stroke={fg} strokeWidth={1.8} strokeLinecap="round" />
          <Path d="M7 14.5 10 11l2.5 2.5L17.3 8.5" stroke={fg} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <Circle cx="17.3" cy="8.5" r="1.5" fill={fg} />
        </Svg>
      );
    case 'workout':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx="12" cy="12" r="11" fill={bg} />
          <Line x1="6.5" y1="12" x2="17.5" y2="12" stroke={fg} strokeWidth={2.2} strokeLinecap="round" />
          <Rect x="4.8" y="9.5" width="2.8" height="5" rx="0.9" fill={fg} />
          <Rect x="16.4" y="9.5" width="2.8" height="5" rx="0.9" fill={fg} />
        </Svg>
      );
  }
}
