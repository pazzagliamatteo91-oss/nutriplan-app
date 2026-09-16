import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, fonts, radii, spacing } from '../theme';
import { ScreenHeader } from '../components/ScreenHeader';
import { Chip } from '../components/Chip';
import { OptionGroup } from '../components/OptionGroup';
import { RecipeCard } from '../components/RecipeCard';
import { Icon } from '../components/Icon';
import { useApp } from '../context/AppContext';
import { RECIPES } from '../data/recipes';
import { visibleRecipes, intoleranceWarnings } from '../data/recipeFilters';
import { CUISINES, MEAL_TYPES } from '../data/constants';
import type { RecipesStackParamList } from '../navigation/types';
import type { MealType } from '../data/types';

type Props = NativeStackScreenProps<RecipesStackParamList, 'RecipesList'>;

export function RecipesListScreen({ navigation, route }: Props) {
  const { profile } = useApp();
  const [mealType, setMealType] = useState<MealType>((route.params?.mealType as MealType) ?? 'colazione');
  const [cuisineFilter, setCuisineFilter] = useState<string | null>(route.params?.cuisineId ?? null);

  const recipes = useMemo(
    () => visibleRecipes(RECIPES, profile, { mealType, cuisineId: cuisineFilter ?? undefined }),
    [profile, mealType, cuisineFilter]
  );

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Ricette" />
      <View style={styles.mealTabs}>
        {MEAL_TYPES.map((m) => {
          const active = mealType === m.id;
          return (
            <Pressable key={m.id} style={[styles.mealTab, active && styles.mealTabActive]} onPress={() => setMealType(m.id as MealType)}>
              <Icon name={m.icon} size={16} color={active ? colors.accentText : colors.textMuted} />
              <Text style={[styles.mealTabLabel, active && styles.mealTabLabelActive]}>{m.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Filtra per cucina</Text>
            <View style={styles.quickChips}>
              <Chip label="Tutte" selected={cuisineFilter === null} onPress={() => setCuisineFilter(null)} />
              <Chip label="Varie" selected={cuisineFilter === 'varie'} onPress={() => setCuisineFilter('varie')} />
            </View>
            <OptionGroup
              options={CUISINES}
              visibleCount={6}
              selected={cuisineFilter ? [cuisineFilter] : []}
              onToggle={(id) => setCuisineFilter((prev) => (prev === id ? null : id))}
            />
          </View>
        }
        renderItem={({ item }) => (
          <RecipeCard
            recipe={item}
            warnings={intoleranceWarnings(item, profile)}
            onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Nessuna ricetta disponibile per questa combinazione di filtri.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  mealTabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  mealTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radii.pill,
    backgroundColor: colors.panel,
  },
  mealTabActive: { backgroundColor: colors.accent },
  mealTabLabel: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.textMuted },
  mealTabLabelActive: { color: colors.accentText },
  list: { padding: spacing.lg, paddingBottom: spacing.xxl },
  filterSection: { marginBottom: spacing.md },
  filterLabel: { fontFamily: fonts.bodySemiBold, fontSize: 12, color: colors.textMuted, marginBottom: spacing.sm, textTransform: 'uppercase' },
  quickChips: { flexDirection: 'row', marginBottom: spacing.xs },
  empty: { paddingVertical: spacing.xxl, alignItems: 'center' },
  emptyText: { fontFamily: fonts.body, fontSize: 14, color: colors.textMuted, textAlign: 'center' },
});
