import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii } from '../theme';
import { Icon, IconName } from './Icon';
import { DietTag } from '../data/types';

const DIET_ICON: Record<DietTag, IconName> = {
  Carne: 'meat',
  Pesce: 'fish',
  Vegetariano: 'leaf',
  Vegano: 'leaf',
};

type Props = { tagDietetico: DietTag };

// Illustrazione decorativa del piatto: gradiente + icona SVG personalizzata al posto
// di una foto stock, coerente con l'identità visiva "niente emoji di sistema".
export function RecipeHero({ tagDietetico }: Props) {
  return (
    <LinearGradient colors={[colors.panelAlt, colors.accent]} style={styles.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <View style={styles.iconWrap}>
        <Icon name={DIET_ICON[tagDietetico]} size={56} color={colors.accentText} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  hero: {
    height: 180,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(245,241,228,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
