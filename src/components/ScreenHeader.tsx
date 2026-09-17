import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, spacing } from '../theme';
import { AvocadoWaveHeader } from './AvocadoWaveHeader';

type Props = {
  title: string;
  right?: React.ReactNode;
};

// Header superiore "a fetta di avocado", dalla cima dello schermo fino al titolo.
export function ScreenHeader({ title, right }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      <AvocadoWaveHeader />
      <Text style={styles.title}>{title}</Text>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  title: {
    fontFamily: fonts.headingBold,
    fontSize: 24,
    color: colors.accentText,
  },
});
