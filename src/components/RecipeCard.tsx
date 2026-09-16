import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing } from '../theme';
import { Card } from './Card';
import { Badge } from './Badge';
import { Icon } from './Icon';
import { Recipe } from '../data/types';
import { useApp } from '../context/AppContext';

type Props = {
  recipe: Recipe;
  warnings: string[];
  onPress: () => void;
};

export function RecipeCard({ recipe, warnings, onPress }: Props) {
  const { t, locale } = useApp();
  const cuisineName = locale.cuisines[recipe.cucina] ?? recipe.cucina;
  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.topRow}>
        <Badge label={cuisineName} tone="accent" />
        <Badge label={locale.dietTags[recipe.tagDietetico] ?? recipe.tagDietetico} tone="neutral" />
      </View>
      <Text style={styles.name}>{recipe.nome}</Text>
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Icon name="clock" size={14} color={colors.textMuted} />
          <Text style={styles.metaText}>{recipe.tempoMinuti} min</Text>
        </View>
        <View style={styles.metaItem}>
          <Icon name="flame" size={14} color={colors.textMuted} />
          <Text style={styles.metaText}>{recipe.kcal} kcal</Text>
        </View>
      </View>
      {(recipe.lattosio || warnings.length > 0) && (
        <View style={styles.warningRow}>
          <Icon name="warningTriangle" size={13} color={colors.berry} />
          <Text style={styles.warningText}>
            {warnings.length > 0 ? t('recipes.warning', { list: warnings.join(', ') }) : t('recipes.containsLactose')}
          </Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.md },
  topRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  name: { fontFamily: fonts.heading, fontSize: 17, color: colors.text, marginBottom: spacing.sm },
  metaRow: { flexDirection: 'row', gap: spacing.lg },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontFamily: fonts.body, fontSize: 12, color: colors.textMuted },
  warningRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.sm },
  warningText: { fontFamily: fonts.body, fontSize: 12, color: colors.berry, flexShrink: 1 },
});
