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

// Altezza totale dell'header (safe-area inclusa): usata dagli schermi per dare
// alla loro ScrollView/FlatList un paddingTop che parte subito sotto il titolo,
// cosi' il contenuto scorre dietro l'header invece di lasciare uno spazio vuoto.
export function useScreenHeaderHeight() {
  const insets = useSafeAreaInsets();
  return insets.top + HEADER_HEIGHT;
}

// Header superiore "a fetta di avocado": l'area colorata scende ben oltre il
// titolo, con un bordo inferiore a onda (non un semplice angolo arrotondato).
// E' un overlay assoluto sopra il contenuto: durante lo scroll le card passano
// dietro l'header (che resta fermo e opaco) invece di lasciare una linea di
// demarcazione visibile.
export function ScreenHeader({ title, right }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { height: insets.top + HEADER_HEIGHT }]}>
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 10,
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
