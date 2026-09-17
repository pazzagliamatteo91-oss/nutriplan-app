import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radii } from '../theme';

type Props = {
  value: number;
  max: number;
  color?: string;
  height?: number;
};

export function ProgressBar({ value, max, color = colors.accent, height = 8 }: Props) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }]}>
      <View style={[styles.fill, { width: `${pct}%`, height, borderRadius: height / 2, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { backgroundColor: colors.panelAlt, overflow: 'hidden', width: '100%' },
  fill: {},
});
