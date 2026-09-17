import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, spacing } from '../theme';
import { AvocadoWaveHeader } from './AvocadoWaveHeader';

type Props = {
  title: string;
  right?: React.ReactNode;
};

const HEADER_HEIGHT = 132;

// Header superiore "a fetta di avocado": l'area colorata scende ben oltre il
// titolo, con un bordo inferiore a onda (non un semplice angolo arrotondato).
export function ScreenHeader({ title, right }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { minHeight: insets.top + HEADER_HEIGHT }]}>
      <AvocadoWaveHeader />
      <View style={[styles.row, { marginTop: insets.top + spacing.sm }]}>
        <Text style={styles.title}>{title}</Text>
        {right}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontFamily: fonts.headingBold,
    fontSize: 24,
    color: colors.accentText,
  },
});
