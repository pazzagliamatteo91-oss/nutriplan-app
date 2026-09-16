import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
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

type Props = { tagDietetico: DietTag; imageUri?: string };

// Immagine del piatto per invogliare l'utente; se non disponibile (o non ancora
// generata per questa cucina) usa un fallback decorativo: gradiente + icona SVG
// personalizzata, coerente con l'identità visiva "niente emoji di sistema".
export function RecipeHero({ tagDietetico, imageUri }: Props) {
  if (imageUri) {
    return (
      <View style={styles.hero}>
        <Image source={{ uri: imageUri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
      </View>
    );
  }

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
    overflow: 'hidden',
    backgroundColor: colors.panel,
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
