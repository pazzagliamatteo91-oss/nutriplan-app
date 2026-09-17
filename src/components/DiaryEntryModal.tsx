import React, { useMemo, useState } from 'react';
import { Modal, View, Text, StyleSheet, Pressable, FlatList, TextInput } from 'react-native';
import { colors, fonts, radii, spacing } from '../theme';
import { Icon } from './Icon';
import { useApp } from '../context/AppContext';
import { RECIPES } from '../data/recipes';
import { diaryEntryFromRecipe } from '../data/diary';
import { toDateKey } from '../data/mealPlan';
import { MEAL_TYPES } from '../data/constants';
import { MealType, bi } from '../data/types';
import { pick } from '../i18n';

type Props = {
  visible: boolean;
  onClose: () => void;
};

function guessMealType(): MealType {
  const h = new Date().getHours();
  if (h < 11) return 'colazione';
  if (h < 15) return 'pranzo';
  if (h < 18) return 'spuntino';
  return 'cena';
}

export function DiaryEntryModal({ visible, onClose }: Props) {
  const { t, locale, language, addDiaryEntry } = useApp();
  const [pasto, setPasto] = useState<MealType>(guessMealType());
  const [mode, setMode] = useState<'ricetta' | 'manuale'>('ricetta');
  const [nome, setNome] = useState('');
  const [kcal, setKcal] = useState('');
  const [proteine, setProteine] = useState('');

  const recipes = useMemo(() => RECIPES.filter((r) => r.tipoPasto === pasto), [pasto]);

  const reset = () => {
    setMode('ricetta');
    setNome('');
    setKcal('');
    setProteine('');
  };

  const close = () => {
    reset();
    onClose();
  };

  const addFromRecipe = (recipeId: string) => {
    const recipe = recipes.find((r) => r.id === recipeId);
    if (!recipe) return;
    addDiaryEntry(diaryEntryFromRecipe(recipe, toDateKey(new Date()), pasto));
    close();
  };

  const addManual = () => {
    const kcalNum = parseFloat(kcal.replace(',', '.'));
    if (!nome.trim() || !Number.isFinite(kcalNum) || kcalNum <= 0) return;
    const proteineNum = parseFloat(proteine.replace(',', '.'));
    addDiaryEntry({
      data: toDateKey(new Date()),
      pasto,
      nome: bi(nome.trim(), nome.trim()),
      kcal: Math.round(kcalNum),
      proteine: Number.isFinite(proteineNum) ? Math.round(proteineNum) : 0,
      recipeId: null,
    });
    close();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={close} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('diary.addEntry')}</Text>
            <Pressable onPress={close} hitSlop={8}>
              <Icon name="close" size={18} color={colors.textMuted} />
            </Pressable>
          </View>

          <View style={styles.mealRow}>
            {MEAL_TYPES.map((m) => {
              const active = pasto === m.id;
              return (
                <Pressable key={m.id} style={[styles.mealChip, active && styles.mealChipActive]} onPress={() => setPasto(m.id as MealType)}>
                  <Icon name={m.icon} size={15} color={active ? colors.accentText : colors.textMuted} />
                  <Text style={[styles.mealChipLabel, active && styles.mealChipLabelActive]}>{locale.mealTypes[m.id] ?? m.label}</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.toggleRow}>
            <Pressable style={[styles.toggleBtn, mode === 'ricetta' && styles.toggleBtnActive]} onPress={() => setMode('ricetta')}>
              <Text style={[styles.toggleLabel, mode === 'ricetta' && styles.toggleLabelActive]}>{t('diary.fromRecipe')}</Text>
            </Pressable>
            <Pressable style={[styles.toggleBtn, mode === 'manuale' && styles.toggleBtnActive]} onPress={() => setMode('manuale')}>
              <Text style={[styles.toggleLabel, mode === 'manuale' && styles.toggleLabelActive]}>{t('diary.manual')}</Text>
            </Pressable>
          </View>

          {mode === 'ricetta' ? (
            <FlatList
              data={recipes}
              keyExtractor={(r) => r.id}
              style={{ maxHeight: 340 }}
              ListEmptyComponent={<Text style={styles.empty}>{t('diary.noRecipesForMeal')}</Text>}
              renderItem={({ item }) => (
                <Pressable style={styles.recipeRow} onPress={() => addFromRecipe(item.id)}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.recipeName} numberOfLines={1}>{pick(item.nome, language)}</Text>
                    <Text style={styles.recipeMeta}>{item.kcal} kcal</Text>
                  </View>
                  <Icon name="plus" size={16} color={colors.highlight} />
                </Pressable>
              )}
            />
          ) : (
            <View>
              <TextInput
                value={nome}
                onChangeText={setNome}
                style={styles.input}
                placeholder={t('diary.entryNamePlaceholder')}
                placeholderTextColor={colors.textFaint}
              />
              <View style={styles.manualRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>{t('diary.kcalLabel')}</Text>
                  <TextInput value={kcal} onChangeText={setKcal} keyboardType="decimal-pad" style={styles.input} placeholder="0" placeholderTextColor={colors.textFaint} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>{t('diary.proteinLabel')}</Text>
                  <TextInput value={proteine} onChangeText={setProteine} keyboardType="decimal-pad" style={styles.input} placeholder="0" placeholderTextColor={colors.textFaint} />
                </View>
              </View>
              <Pressable style={styles.addBtn} onPress={addManual}>
                <Text style={styles.addBtnLabel}>{t('diary.addEntry')}</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: colors.overlay },
  sheet: { backgroundColor: colors.panel, borderTopLeftRadius: radii.xl, borderTopRightRadius: radii.xl, padding: spacing.lg, paddingBottom: spacing.xxl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  title: { fontFamily: fonts.heading, fontSize: 17, color: colors.text },
  mealRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  mealChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 12, borderRadius: radii.pill, backgroundColor: colors.panelAlt },
  mealChipActive: { backgroundColor: colors.accent },
  mealChipLabel: { fontFamily: fonts.bodyMedium, fontSize: 12.5, color: colors.textMuted },
  mealChipLabelActive: { color: colors.accentText, fontFamily: fonts.bodySemiBold },
  toggleRow: { flexDirection: 'row', backgroundColor: colors.background, borderRadius: radii.pill, padding: 3, marginBottom: spacing.md },
  toggleBtn: { flex: 1, paddingVertical: 8, borderRadius: radii.pill, alignItems: 'center' },
  toggleBtnActive: { backgroundColor: colors.accent },
  toggleLabel: { fontFamily: fonts.bodyMedium, fontSize: 12.5, color: colors.textMuted },
  toggleLabelActive: { color: colors.accentText, fontFamily: fonts.bodySemiBold },
  recipeRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 11, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  recipeName: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.text, marginBottom: 2 },
  recipeMeta: { fontFamily: fonts.body, fontSize: 12, color: colors.textMuted },
  empty: { fontFamily: fonts.body, fontSize: 13, color: colors.textMuted, textAlign: 'center', paddingVertical: spacing.lg },
  inputLabel: { fontFamily: fonts.bodySemiBold, fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', marginBottom: 6 },
  input: { backgroundColor: colors.panelAlt, borderRadius: radii.md, paddingHorizontal: spacing.md, paddingVertical: 11, color: colors.text, fontFamily: fonts.body, fontSize: 14, marginBottom: spacing.md },
  manualRow: { flexDirection: 'row', gap: spacing.md },
  addBtn: { backgroundColor: colors.accent, borderRadius: radii.pill, paddingVertical: 13, alignItems: 'center' },
  addBtnLabel: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: colors.accentText },
});
