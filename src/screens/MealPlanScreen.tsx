import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { colors, fonts, radii, spacing } from '../theme';
import { Icon, IconName } from '../components/Icon';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { RecipePickerModal } from '../components/RecipePickerModal';
import { useApp } from '../context/AppContext';
import { RECIPES } from '../data/recipes';
import { visibleRecipes } from '../data/recipeFilters';
import { MEAL_TYPES } from '../data/constants';
import { datesForScale, formatDateLabel, PlanScale } from '../data/mealPlan';
import type { RecipesStackParamList } from '../navigation/types';
import type { RootTabParamList } from '../navigation/types';
import type { MealType } from '../data/types';

type Props = NativeStackScreenProps<RecipesStackParamList, 'MealPlan'>;

const SCALE_OPTIONS: { id: PlanScale; label: string; icon: IconName }[] = [
  { id: 'giorno', label: 'Giorno', icon: 'calendarDay' },
  { id: 'settimana', label: 'Settimana', icon: 'calendarWeek' },
  { id: 'mese', label: 'Mese', icon: 'calendarMonth' },
];

export function MealPlanScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { profile, mealPlan, setMealPlanEntry, generateShoppingListFromPlan } = useApp();
  const [scale, setScale] = useState<PlanScale>('settimana');
  const [picker, setPicker] = useState<{ data: string; pasto: MealType } | null>(null);

  const dates = useMemo(() => datesForScale(scale), [scale]);
  const recipesById = useMemo(() => new Map(RECIPES.map((r) => [r.id, r])), []);
  const planMap = useMemo(() => {
    const map = new Map<string, string>();
    mealPlan.forEach((e) => map.set(`${e.data}|${e.pasto}`, e.recipeId));
    return map;
  }, [mealPlan]);

  const pickerRecipes = useMemo(() => {
    if (!picker) return [];
    return visibleRecipes(RECIPES, profile, { mealType: picker.pasto });
  }, [picker, profile]);

  const filledSlots = dates.reduce((acc, d) => acc + MEAL_TYPES.filter((m) => planMap.has(`${d}|${m.id}`)).length, 0);
  const totalSlots = dates.length * MEAL_TYPES.length;

  const handleGenerate = () => {
    const count = generateShoppingListFromPlan(dates, scale);
    if (count === 0) {
      Alert.alert('Nessuna ricetta pianificata', 'Assegna almeno una ricetta a un pasto prima di generare la lista della spesa.');
      return;
    }
    Alert.alert(
      'Lista della spesa aggiornata',
      `${count} articoli aggiunti alla lista, calcolati dalle ricette pianificate. Riceverai un promemoria nel giorno di spesa scelto nel profilo.`,
      [
        { text: 'Resta qui', style: 'cancel' },
        {
          text: 'Vai a Spesa',
          onPress: () => navigation.getParent<BottomTabNavigationProp<RootTabParamList>>()?.navigate('SpesaTab'),
        },
      ]
    );
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.topBar, { paddingTop: insets.top + spacing.xs }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={10}>
          <Icon name="chevronLeft" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.topTitle}>Pianifica pasti</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Intervallo</Text>
        <View style={styles.scaleRow}>
          {SCALE_OPTIONS.map((opt) => {
            const active = scale === opt.id;
            return (
              <Pressable key={opt.id} style={[styles.scaleBtn, active && styles.scaleBtnActive]} onPress={() => setScale(opt.id)}>
                <Icon name={opt.icon} size={16} color={active ? colors.accentText : colors.textMuted} />
                <Text style={[styles.scaleLabel, active && styles.scaleLabelActive]}>{opt.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.progressRow}>
          <Icon name="check" size={14} color={colors.accent} />
          <Text style={styles.progressText}>{filledSlots}/{totalSlots} pasti pianificati in questo periodo</Text>
        </View>

        {dates.map((date) => (
          <View key={date} style={styles.dayGroup}>
            <Text style={styles.dayTitle}>{formatDateLabel(date)}</Text>
            <Card style={styles.dayCard}>
              {MEAL_TYPES.map((meal, idx) => {
                const recipeId = planMap.get(`${date}|${meal.id}`);
                const recipe = recipeId ? recipesById.get(recipeId) : undefined;
                return (
                  <Pressable
                    key={meal.id}
                    style={[styles.mealRow, idx === MEAL_TYPES.length - 1 && { borderBottomWidth: 0 }]}
                    onPress={() => setPicker({ data: date, pasto: meal.id as MealType })}
                  >
                    <Icon name={meal.icon} size={16} color={colors.accent} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.mealLabel}>{meal.label}</Text>
                      <Text style={styles.mealValue} numberOfLines={1}>
                        {recipe ? recipe.nome : 'Nessuna ricetta — tocca per aggiungere'}
                      </Text>
                    </View>
                    {recipe ? (
                      <Pressable
                        hitSlop={8}
                        onPress={(e) => {
                          e.stopPropagation();
                          setMealPlanEntry(date, meal.id as MealType, null);
                        }}
                      >
                        <Icon name="close" size={16} color={colors.textFaint} />
                      </Pressable>
                    ) : (
                      <Icon name="plus" size={16} color={colors.textFaint} />
                    )}
                  </Pressable>
                );
              })}
            </Card>
          </View>
        ))}

        <Button
          label="Genera lista della spesa"
          onPress={handleGenerate}
          style={{ marginTop: spacing.md, marginBottom: spacing.xxl }}
        />
      </ScrollView>

      {picker && (
        <RecipePickerModal
          visible={!!picker}
          mealType={picker.pasto}
          recipes={pickerRecipes}
          onClose={() => setPicker(null)}
          onSelect={(recipeId) => {
            setMealPlanEntry(picker.data, picker.pasto, recipeId);
            setPicker(null);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.panel, alignItems: 'center', justifyContent: 'center' },
  topTitle: { fontFamily: fonts.heading, fontSize: 17, color: colors.text },
  content: { paddingHorizontal: spacing.lg },
  label: { fontFamily: fonts.bodySemiBold, fontSize: 12, color: colors.textMuted, textTransform: 'uppercase', marginBottom: spacing.sm },
  scaleRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  scaleBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 10, borderRadius: radii.md, backgroundColor: colors.panel,
  },
  scaleBtnActive: { backgroundColor: colors.accent },
  scaleLabel: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.textMuted },
  scaleLabelActive: { color: colors.accentText },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.lg },
  progressText: { fontFamily: fonts.body, fontSize: 12, color: colors.textMuted },
  dayGroup: { marginBottom: spacing.md },
  dayTitle: { fontFamily: fonts.heading, fontSize: 15, color: colors.text, marginBottom: spacing.sm },
  dayCard: { paddingVertical: 4 },
  mealRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border,
  },
  mealLabel: { fontFamily: fonts.bodySemiBold, fontSize: 12, color: colors.textMuted },
  mealValue: { fontFamily: fonts.body, fontSize: 13, color: colors.text },
});
