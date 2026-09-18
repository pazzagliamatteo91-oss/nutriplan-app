import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, Pressable } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, fonts, radii, spacing } from '../theme';
import { ScreenHeader, useScreenHeaderHeight } from '../components/ScreenHeader';
import { Chip } from '../components/Chip';
import { OptionGroup } from '../components/OptionGroup';
import { RecipeCard } from '../components/RecipeCard';
import { Icon } from '../components/Icon';
import { AiRecipeModal } from '../components/AiRecipeModal';
import { useApp } from '../context/AppContext';
import { RECIPES } from '../data/recipes';
import { visibleRecipes, intoleranceWarnings } from '../data/recipeFilters';
import { CUISINES, MEAL_TYPES } from '../data/constants';
import type { RecipesStackParamList } from '../navigation/types';
import type { MealType } from '../data/types';

type Props = NativeStackScreenProps<RecipesStackParamList, 'RecipesList'>;

export function RecipesListScreen({ navigation, route }: Props) {
  const headerHeight = useScreenHeaderHeight();
  const { profile, t, locale } = useApp();
  const [mealType, setMealType] = useState<MealType>((route.params?.mealType as MealType) ?? 'colazione');
  const [cuisineFilter, setCuisineFilter] = useState<string[]>(route.params?.cuisineId ? [route.params.cuisineId] : []);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  const recipes = useMemo(
    () => visibleRecipes(RECIPES, profile, { mealType, cuisineIds: cuisineFilter }),
    [profile, mealType, cuisineFilter]
  );
  const cuisines = useMemo(() => CUISINES.map((o) => ({ ...o, label: locale.cuisines[o.id] ?? o.label })), [locale]);

  const toggleCuisine = (id: string) =>
    setCuisineFilter((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));

  return (
    <View style={styles.screen}>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingTop: headerHeight + spacing.md }]}
        ListHeaderComponent={
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.mealTabs}
            >
              {MEAL_TYPES.map((m) => {
                const active = mealType === m.id;
                return (
                  <Pressable key={m.id} style={[styles.mealTab, active && styles.mealTabActive]} onPress={() => setMealType(m.id as MealType)}>
                    <Icon name={m.icon} size={16} color={active ? colors.accentText : colors.textMuted} />
                    <Text style={[styles.mealTabLabel, active && styles.mealTabLabelActive]}>{locale.mealTypes[m.id] ?? m.label}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>{t('recipes.filterByCuisine')}</Text>
              <View style={styles.quickChips}>
                <Chip label={t('common.all')} selected={cuisineFilter.length === 0} onPress={() => setCuisineFilter([])} />
                <Chip label={t('recipes.misc')} selected={cuisineFilter.includes('varie')} onPress={() => toggleCuisine('varie')} />
              </View>
              <OptionGroup
                options={cuisines}
                visibleCount={6}
                selected={cuisineFilter}
                onToggle={toggleCuisine}
                otherLabel={t('common.other')}
                lessLabel={t('common.less')}
              />
            </View>

            <Pressable style={styles.aiCtaCard} onPress={() => setAiModalOpen(true)}>
              <View style={styles.aiCtaIconWrap}>
                <Icon name="sparkle" size={20} color={colors.highlight} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.aiCtaTitle}>{t('recipes.aiCtaTitle')}</Text>
                <Text style={styles.aiCtaSubtitle}>{t('recipes.aiCtaSubtitle')}</Text>
              </View>
              <Icon name="chevronRight" size={18} color={colors.textFaint} />
            </Pressable>
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
            <Text style={styles.emptyText}>{t('recipes.noRecipesFound')}</Text>
          </View>
        }
      />

      <ScreenHeader
        title={t('recipes.title')}
        right={
          <Pressable style={styles.planBtn} onPress={() => navigation.navigate('MealPlan')} hitSlop={8}>
            <Icon name="calendarWeek" size={15} color={colors.accentText} />
            <Text style={styles.planBtnLabel}>{t('recipes.planButton')}</Text>
          </Pressable>
        }
      />

      <AiRecipeModal visible={aiModalOpen} onClose={() => setAiModalOpen(false)} initialMealType={mealType} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  planBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(255,255,255,0.55)', paddingVertical: 8, paddingHorizontal: 12, borderRadius: radii.pill,
  },
  planBtnLabel: { fontFamily: fonts.bodySemiBold, fontSize: 12, color: colors.accentText },
  mealTabs: {
    flexDirection: 'row',
    paddingBottom: spacing.md,
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
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  filterSection: { marginBottom: spacing.md },
  filterLabel: { fontFamily: fonts.bodySemiBold, fontSize: 12, color: colors.textMuted, marginBottom: spacing.sm, textTransform: 'uppercase' },
  quickChips: { flexDirection: 'row', marginBottom: spacing.xs },
  aiCtaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.panel,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  aiCtaIconWrap: {
    width: 40, height: 40, borderRadius: radii.sm,
    backgroundColor: colors.panelAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  aiCtaTitle: { fontFamily: fonts.bodySemiBold, fontSize: 14.5, color: colors.text },
  aiCtaSubtitle: { fontFamily: fonts.body, fontSize: 12, color: colors.textMuted, marginTop: 1 },
  empty: { paddingVertical: spacing.xxl, alignItems: 'center' },
  emptyText: { fontFamily: fonts.body, fontSize: 14, color: colors.textMuted, textAlign: 'center' },
});
