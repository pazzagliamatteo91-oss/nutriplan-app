import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, fonts, radii, spacing } from '../theme';
import { Icon } from '../components/Icon';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { RecipeHero } from '../components/RecipeHero';
import { RecipeVideoSection } from '../components/RecipeVideoSection';
import { PartnerSheet } from '../components/PartnerSheet';
import { useApp } from '../context/AppContext';
import { RECIPES } from '../data/recipes';
import { intoleranceWarnings } from '../data/recipeFilters';
import { CUISINE_HERO_IMAGES } from '../data/recipeImages';
import type { RecipesStackParamList } from '../navigation/types';
import { pick } from '../i18n';

type Props = NativeStackScreenProps<RecipesStackParamList, 'RecipeDetail'>;

export function RecipeDetailScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { profile, t, locale, language } = useApp();
  const [detailed, setDetailed] = useState(false);
  const [partnerSheetOpen, setPartnerSheetOpen] = useState(false);

  const recipe = useMemo(() => RECIPES.find((r) => r.id === route.params.recipeId)!, [route.params.recipeId]);
  const warnings = useMemo(() => {
    const ids = intoleranceWarnings(recipe, profile);
    const labels = ids.map((id) => locale.intolerances[id] ?? id);
    if (recipe.lattosio && !ids.includes('lattosio')) labels.push(t('recipes.containsLactose'));
    return labels;
  }, [recipe, profile, locale, t]);

  const steps = detailed ? recipe.passaggiDettagliati : recipe.passaggiSintetici;

  return (
    <View style={styles.screen}>
      <View style={[styles.topBar, { paddingTop: insets.top + spacing.xs }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={10}>
          <Icon name="chevronLeft" size={22} color={colors.text} />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <RecipeHero tagDietetico={recipe.tagDietetico} imageUri={CUISINE_HERO_IMAGES[recipe.cucina] || undefined} />

        <View style={styles.badgeRow}>
          <Badge label={locale.cuisines[recipe.cucina] ?? recipe.cucina} tone="accent" />
          <Badge label={locale.dietTags[recipe.tagDietetico] ?? recipe.tagDietetico} tone="neutral" />
        </View>

        <Text style={styles.title}>{pick(recipe.nome, language)}</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Icon name="clock" size={15} color={colors.textMuted} />
            <Text style={styles.metaText}>{recipe.tempoMinuti} min</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="flame" size={15} color={colors.textMuted} />
            <Text style={styles.metaText}>{recipe.kcal} kcal</Text>
          </View>
        </View>

        {warnings.length > 0 && (
          <Card variant="panelAlt" style={styles.warningCard}>
            <Icon name="warningTriangle" size={16} color={colors.berry} />
            <Text style={styles.warningText}>{t('recipes.warning', { list: warnings.join(', ') })}</Text>
          </Card>
        )}

        <Text style={styles.sectionTitle}>{t('recipes.ingredientsFor2')}</Text>
        <Card style={styles.ingredientsCard}>
          {recipe.ingredienti.map((ing, idx) => (
            <View key={idx} style={[styles.ingredientRow, idx === recipe.ingredienti.length - 1 && { borderBottomWidth: 0 }]}>
              <Text style={styles.ingredientName}>{pick(ing.nome, language)}</Text>
              <Text style={styles.ingredientQty}>{pick(ing.quantita, language)}</Text>
            </View>
          ))}
        </Card>

        <View style={styles.stepsHeader}>
          <Text style={styles.sectionTitle}>{t('recipes.preparation')}</Text>
          <View style={styles.toggleRow}>
            <Pressable onPress={() => setDetailed(false)} style={[styles.toggleBtn, !detailed && styles.toggleBtnActive]}>
              <Text style={[styles.toggleLabel, !detailed && styles.toggleLabelActive]}>{t('recipes.synthetic')}</Text>
            </Pressable>
            <Pressable onPress={() => setDetailed(true)} style={[styles.toggleBtn, detailed && styles.toggleBtnActive]}>
              <Text style={[styles.toggleLabel, detailed && styles.toggleLabelActive]}>{t('recipes.detailed')}</Text>
            </Pressable>
          </View>
        </View>
        <Card style={styles.stepsCard}>
          {steps.map((s, idx) => (
            <View key={idx} style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{idx + 1}</Text>
              </View>
              <Text style={styles.stepText}>{pick(s, language)}</Text>
            </View>
          ))}
        </Card>

        <Text style={styles.sectionTitle}>{t('recipes.videoTitle')}</Text>
        <RecipeVideoSection query={pick(recipe.nome, language)} />

        <Button
          label={t('recipes.buyIngredientsOn')}
          onPress={() => setPartnerSheetOpen(true)}
          style={{ marginTop: spacing.lg, marginBottom: spacing.xxl }}
        />
      </ScrollView>

      <PartnerSheet visible={partnerSheetOpen} title={t('recipes.buyOn')} onClose={() => setPartnerSheetOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  topBar: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xs },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.panel, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: spacing.lg },
  badgeRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  title: { fontFamily: fonts.headingBold, fontSize: 24, color: colors.text, marginBottom: spacing.sm },
  metaRow: { flexDirection: 'row', gap: spacing.lg, marginBottom: spacing.md },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontFamily: fonts.body, fontSize: 13, color: colors.textMuted },
  warningCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  warningText: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.berry, flexShrink: 1 },
  sectionTitle: { fontFamily: fonts.heading, fontSize: 17, color: colors.text, marginBottom: spacing.sm },
  ingredientsCard: { marginBottom: spacing.lg, paddingVertical: 4 },
  ingredientRow: {
    flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border,
  },
  ingredientName: { fontFamily: fonts.body, fontSize: 14, color: colors.text },
  ingredientQty: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.textMuted },
  stepsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  toggleRow: { flexDirection: 'row', backgroundColor: colors.panel, borderRadius: radii.pill, padding: 3 },
  toggleBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: radii.pill },
  toggleBtnActive: { backgroundColor: colors.accent },
  toggleLabel: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.textMuted },
  toggleLabelActive: { color: colors.accentText },
  stepsCard: { gap: spacing.md },
  stepRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm, alignItems: 'flex-start' },
  stepNumber: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  stepNumberText: { fontFamily: fonts.bodySemiBold, fontSize: 11, color: colors.accentText },
  stepText: { flex: 1, fontFamily: fonts.body, fontSize: 14, color: colors.text, lineHeight: 20 },
});
