import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radii, fonts } from '../theme';

type Props = {
  label: string;
  tone?: 'accent' | 'berry' | 'neutral';
};

export function Badge({ label, tone = 'accent' }: Props) {
  const bg = tone === 'berry' ? colors.berrySoft : tone === 'neutral' ? colors.panelAlt : colors.accent;
  const fg = tone === 'berry' ? colors.berry : tone === 'neutral' ? colors.text : colors.accentText;
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.label, { color: fg }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
    alignSelf: 'flex-start',
  },
  label: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 11,
    letterSpacing: 0.2,
  },
});
