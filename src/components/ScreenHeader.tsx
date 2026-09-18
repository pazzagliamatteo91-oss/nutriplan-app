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

// Icona decorativa grande ma "a filigrana": la dimensione reale è molto
// maggiore dello spazio visibile, cosi' che l'offset negativo + l'overflow
// hidden del contenitore ne ritaglino solo un angolo, come una grafica
// stampata sullo sfondo e non un'icona isolata al centro dell'attenzione.
const AVOCADO_SIZE = 150;

// Altezza totale dell'header (safe-area inclusa): usata dagli schermi per dare
// alla loro ScrollView/FlatList un paddingTop che parte subito sotto il titolo,
// cosi' il contenuto scorre dietro l'header invece di lasciare uno spazio vuoto.
export function useScreenHeaderHeight() {
  const insets = useSafeAreaInsets();
  return insets.top + HEADER_HEIGHT;
}

// Header superiore piatto (sfondo uguale al resto dell'app, senza fascia
// colorata): solo il titolo a sinistra e una filigrana avocado in alto a
// destra, tagliata dal bordo del contenitore, sfumata in trasparenza per
// non competere con il testo.
export function ScreenHeader({ title, right }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { height: insets.top + HEADER_HEIGHT }]}>
      <View style={styles.avocadoBadge} pointerEvents="none">
        <ColorIcon name="avocado" size={AVOCADO_SIZE} />
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
    overflow: 'hidden',
    zIndex: 10,
  },
  avocadoBadge: {
    position: 'absolute',
    top: -36,
    right: -36,
    opacity: 0.22,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: spacing.lg,
    // Lascia respiro rispetto alla filigrana in alto a destra, cosi' un
    // eventuale elemento "right" (es. il pulsante "Pianifica" in Ricette)
    // resta leggibile e ben separato dal titolo.
    paddingRight: spacing.lg + 70,
  },
  title: {
    fontFamily: fonts.headingBold,
    fontSize: 24,
    color: colors.text,
  },
});
