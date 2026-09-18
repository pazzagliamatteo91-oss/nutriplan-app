import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, spacing } from '../theme';
import { ColorIcon } from './ColorIcon';

type Props = {
  title: string;
  right?: React.ReactNode;
};

const HEADER_HEIGHT = 110;

// Altezza totale dell'header (safe-area inclusa): usata dagli schermi per dare
// alla loro ScrollView/FlatList un paddingTop che parte subito sotto il titolo,
// cosi' il contenuto scorre dietro l'header invece di lasciare uno spazio vuoto.
export function useScreenHeaderHeight() {
  const insets = useSafeAreaInsets();
  return insets.top + HEADER_HEIGHT;
}

// Header superiore piatto (sfondo uguale al resto dell'app, senza fascia
// colorata): solo il titolo a sinistra e una grande icona avocado decorativa
// in alto a destra, la stessa usata per la tab Profilo ma più grande.
export function ScreenHeader({ title, right }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { height: insets.top + HEADER_HEIGHT }]}>
      <View style={[styles.avocadoBadge, { top: insets.top - 6 }]}>
        <ColorIcon name="avocado" size={76} />
      </View>
      <View style={[styles.row, { marginTop: insets.top + spacing.md }]}>
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
    backgroundColor: colors.background,
    zIndex: 10,
  },
  avocadoBadge: {
    position: 'absolute',
    right: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: spacing.lg,
    // Lascia spazio all'icona avocado assoluta in alto a destra, cosi' un
    // eventuale elemento "right" (es. il pulsante "Pianifica" in Ricette)
    // non ci finisce sotto.
    paddingRight: spacing.lg + 76 + spacing.sm,
  },
  title: {
    fontFamily: fonts.headingBold,
    fontSize: 24,
    color: colors.text,
  },
});
