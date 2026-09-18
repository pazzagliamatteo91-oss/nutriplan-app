import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput, ActivityIndicator } from 'react-native';
import { colors, fonts, radii, spacing } from '../theme';
import { Card } from './Card';
import { Chip } from './Chip';
import { Icon } from './Icon';
import { useApp } from '../context/AppContext';
import { AiRecipeResult, MealType, bi } from '../data/types';
import { generateAiRecipe, AiWorkoutError, AiWorkoutErrorCode, hasAiApiKeyConfigured } from '../data/aiRecipeClient';
import { toDateKey } from '../data/mealPlan';
import { MEAL_TYPES, CUISINES } from '../data/constants';

type Props = {
  visible: boolean;
  onClose: () => void;
  initialMealType: MealType;
};

const ERROR_KEYS: Record<AiWorkoutErrorCode, string> = {
  missing_api_key: 'workout.aiErrorMissingKey',
  invalid_api_key: 'workout.aiErrorInvalidKey',
  rate_limit: 'workout.aiErrorRateLimit',
  timeout: 'workout.aiErrorTimeout',
  network: 'workout.aiErrorNetwork',
  empty_response: 'workout.aiErrorGeneric',
  invalid_json: 'workout.aiErrorGeneric',
  invalid_schema: 'workout.aiErrorGeneric',
  http_error: 'workout.aiErrorGeneric',
};

function parseNum(s: string): number | null {
  const trimmed = s.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

export function AiRecipeModal({ visible, onClose, initialMealType }: Props) {
  const { profile, language, t, locale, addDiaryEntry } = useApp();

  const [tipoPasto, setTipoPasto] = useState<MealType>(initialMealType);
  const [cucina, setCucina] = useState('');
  const [tempoMassimo, setTempoMassimo] = useState('30');
  const [kcalTarget, setKcalTarget] = useState('');
  const [note, setNote] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorCode, setErrorCode] = useState<AiWorkoutErrorCode | null>(null);
  const [result, setResult] = useState<AiRecipeResult | null>(null);
  const [addedToDiary, setAddedToDiary] = useState(false);

  const apiKeyConfigured = hasAiApiKeyConfigured();
  const cuisines = CUISINES.map((o) => ({ ...o, label: locale.cuisines[o.id] ?? o.label }));

  const resetToForm = () => {
    setResult(null);
    setErrorCode(null);
    setAddedToDiary(false);
  };

  const handleClose = () => {
    resetToForm();
    onClose();
  };

  const handleGenerate = async () => {
    setLoading(true);
    setErrorCode(null);
    try {
      const recipe = await generateAiRecipe({
        tipoPasto,
        cucina,
        tempoMassimoMin: parseNum(tempoMassimo) ?? 30,
        kcalTarget: parseNum(kcalTarget),
        note,
        lingua: language,
        intolleranzeAllergie: [...profile.intolleranze, ...profile.allergie],
      });
      setResult(recipe);
      setAddedToDiary(false);
    } catch (err) {
      setErrorCode(err instanceof AiWorkoutError ? err.code : 'http_error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToDiary = () => {
    if (!result) return;
    addDiaryEntry({
      data: toDateKey(new Date()),
      pasto: tipoPasto,
      nome: bi(result.nome, result.nome),
      kcal: result.kcal,
      proteine: result.proteineG,
      recipeId: null,
    });
    setAddedToDiary(true);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <View style={styles.sheetHeaderTitleRow}>
              <Icon name="sparkle" size={18} color={colors.highlight} />
              <Text style={styles.sheetTitle}>{t('recipes.aiModalTitle')}</Text>
            </View>
            <Pressable onPress={handleClose} hitSlop={10}>
              <Icon name="close" size={20} color={colors.textMuted} />
            </Pressable>
          </View>

          <ScrollView style={{ maxHeight: 540 }} showsVerticalScrollIndicator={false}>
            {result ? (
              <View style={styles.resultWrap}>
                <Text style={styles.resultName}>{result.nome}</Text>
                <View style={styles.badgeRow}>
                  {!!result.cucina && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeLabel}>{result.cucina}</Text>
                    </View>
                  )}
                  {!!result.tagDietetico && (
                    <View style={[styles.badge, styles.badgeAlt]}>
                      <Text style={[styles.badgeLabel, styles.badgeLabelAlt]}>{result.tagDietetico}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.metaRow}>
                  <Icon name="clock" size={14} color={colors.textFaint} />
                  <Text style={styles.metaText}>{t('recipes.aiResultTime', { min: result.tempoMinuti })}</Text>
                  <Icon name="flame" size={14} color={colors.textFaint} />
                  <Text style={styles.metaText}>{t('recipes.aiResultKcal', { kcal: result.kcal, p: result.proteineG })}</Text>
                </View>
                {!result.compatibileIntolleranze && (
                  <Card variant="panelAlt" style={styles.warningCard}>
                    <Icon name="warningTriangle" size={16} color={colors.berry} />
                    <Text style={[styles.warningText, { color: colors.berry }]}>{t('wellness.mealIntoleranceWarning')}</Text>
                  </Card>
                )}

                <Text style={styles.sectionTitle}>{t('recipes.aiResultIngredients')}</Text>
                <Card style={styles.card}>
                  {result.ingredienti.map((ing, idx) => (
                    <View key={idx} style={styles.ingredientRow}>
                      <Text style={styles.ingredientName}>{ing.nome}</Text>
                      <Text style={styles.ingredientQty}>{ing.quantita}</Text>
                    </View>
                  ))}
                </Card>

                <Text style={styles.sectionTitle}>{t('recipes.aiResultSteps')}</Text>
                <Card style={styles.card}>
                  {result.passaggi.map((s, idx) => (
                    <View key={idx} style={styles.stepRow}>
                      <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>{idx + 1}</Text>
                      </View>
                      <Text style={styles.stepText}>{s}</Text>
                    </View>
                  ))}
                </Card>

                <Pressable style={styles.secondaryBtn} onPress={handleAddToDiary} disabled={addedToDiary}>
                  <Text style={styles.secondaryBtnLabel}>
                    {addedToDiary ? t('recipes.aiResultAddedToDiary') : t('recipes.aiResultAddToDiary')}
                  </Text>
                </Pressable>
                <Pressable style={styles.secondaryBtnGhost} onPress={resetToForm}>
                  <Text style={styles.secondaryBtnGhostLabel}>{t('recipes.aiResultNewRecipe')}</Text>
                </Pressable>
                <Pressable style={styles.ghostBtn} onPress={handleClose}>
                  <Text style={styles.ghostBtnLabel}>{t('recipes.aiResultClose')}</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.formWrap}>
                {!apiKeyConfigured && (
                  <Card variant="panelAlt" style={styles.warningCard}>
                    <Icon name="warningTriangle" size={16} color={colors.warning} />
                    <Text style={styles.warningText}>{t('workout.aiErrorMissingKey')}</Text>
                  </Card>
                )}

                <Text style={styles.formLabel}>{t('recipes.aiMealType')}</Text>
                <View style={styles.chipsRow}>
                  {MEAL_TYPES.map((m) => (
                    <Chip
                      key={m.id}
                      label={locale.mealTypes[m.id] ?? m.label}
                      selected={tipoPasto === m.id}
                      onPress={() => setTipoPasto(m.id as MealType)}
                    />
                  ))}
                </View>

                <Text style={styles.formLabel}>{t('recipes.aiCuisine')}</Text>
                <View style={styles.chipsRow}>
                  <Chip label={t('common.all')} selected={cucina === ''} onPress={() => setCucina('')} />
                  {cuisines.map((c) => (
                    <Chip key={c.id} label={c.label} selected={cucina === c.id} onPress={() => setCucina(c.id)} />
                  ))}
                </View>

                <Text style={styles.formLabel}>{t('recipes.aiMaxTime')}</Text>
                <TextInput
                  style={styles.textInput}
                  value={tempoMassimo}
                  onChangeText={setTempoMassimo}
                  keyboardType="numeric"
                  placeholderTextColor={colors.textFaint}
                />

                <Text style={styles.formLabel}>{t('recipes.aiKcalTarget')}</Text>
                <TextInput
                  style={styles.textInput}
                  value={kcalTarget}
                  onChangeText={setKcalTarget}
                  keyboardType="numeric"
                  placeholder="—"
                  placeholderTextColor={colors.textFaint}
                />

                <Text style={styles.formLabel}>{t('recipes.aiNotes')}</Text>
                <TextInput
                  style={styles.textInput}
                  value={note}
                  onChangeText={setNote}
                  placeholder={t('recipes.aiNotesPlaceholder')}
                  placeholderTextColor={colors.textFaint}
                />

                {errorCode && (
                  <Card variant="panelAlt" style={styles.warningCard}>
                    <Icon name="warningTriangle" size={16} color={colors.berry} />
                    <Text style={[styles.warningText, { color: colors.berry }]}>{t(ERROR_KEYS[errorCode] as any)}</Text>
                  </Card>
                )}

                <Pressable
                  style={[styles.generateBtn, (loading || !apiKeyConfigured) && { opacity: 0.6 }]}
                  onPress={loading || !apiKeyConfigured ? undefined : handleGenerate}
                >
                  {loading ? (
                    <>
                      <ActivityIndicator color={colors.accentText} />
                      <Text style={styles.generateBtnLabel}>{t('recipes.aiGenerating')}</Text>
                    </>
                  ) : (
                    <>
                      <Icon name="sparkle" size={16} color={colors.accentText} />
                      <Text style={styles.generateBtnLabel}>{t('recipes.aiGenerateButton')}</Text>
                    </>
                  )}
                </Pressable>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: colors.overlay },
  sheet: { backgroundColor: colors.panel, borderTopLeftRadius: radii.xl, borderTopRightRadius: radii.xl, padding: spacing.lg, paddingBottom: spacing.xl },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  sheetHeaderTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sheetTitle: { fontFamily: fonts.heading, fontSize: 17, color: colors.text },
  formWrap: { paddingBottom: spacing.md },
  formLabel: { fontFamily: fonts.bodySemiBold, fontSize: 12, color: colors.textMuted, textTransform: 'uppercase', marginTop: spacing.md, marginBottom: spacing.sm },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap' },
  textInput: {
    backgroundColor: colors.panelAlt,
    borderRadius: radii.sm,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.text,
  },
  warningCard: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start', marginTop: spacing.md },
  warningText: { flex: 1, fontFamily: fonts.body, fontSize: 12.5, color: colors.text, lineHeight: 17 },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
    paddingVertical: 14,
    marginTop: spacing.lg,
  },
  generateBtnLabel: { fontFamily: fonts.bodySemiBold, fontSize: 15, color: colors.accentText },
  resultWrap: { paddingBottom: spacing.md },
  resultName: { fontFamily: fonts.headingBold, fontSize: 19, color: colors.text, marginBottom: spacing.sm },
  badgeRow: { flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.sm },
  badge: { backgroundColor: colors.accent, borderRadius: radii.pill, paddingVertical: 4, paddingHorizontal: 10 },
  badgeAlt: { backgroundColor: colors.panelAlt },
  badgeLabel: { fontFamily: fonts.bodySemiBold, fontSize: 11.5, color: colors.accentText },
  badgeLabelAlt: { color: colors.text },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: spacing.md },
  metaText: { fontFamily: fonts.body, fontSize: 12.5, color: colors.textMuted, marginRight: spacing.sm },
  sectionTitle: { fontFamily: fonts.bodySemiBold, fontSize: 12.5, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.3, marginTop: spacing.md, marginBottom: spacing.sm },
  card: { gap: 2 },
  ingredientRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  ingredientName: { fontFamily: fonts.body, fontSize: 13.5, color: colors.text },
  ingredientQty: { fontFamily: fonts.bodySemiBold, fontSize: 13, color: colors.highlight },
  stepRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm, alignItems: 'flex-start' },
  stepNumber: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  stepNumberText: { fontFamily: fonts.bodySemiBold, fontSize: 11, color: colors.accentText },
  stepText: { flex: 1, fontFamily: fonts.body, fontSize: 13.5, color: colors.text, lineHeight: 19 },
  secondaryBtn: { backgroundColor: colors.accent, borderRadius: radii.pill, paddingVertical: 14, alignItems: 'center', marginTop: spacing.lg },
  secondaryBtnLabel: { fontFamily: fonts.bodySemiBold, fontSize: 15, color: colors.accentText },
  secondaryBtnGhost: { backgroundColor: colors.panelAlt, borderRadius: radii.pill, paddingVertical: 14, alignItems: 'center', marginTop: spacing.sm },
  secondaryBtnGhostLabel: { fontFamily: fonts.bodySemiBold, fontSize: 15, color: colors.text },
  ghostBtn: { alignItems: 'center', paddingVertical: 12, marginTop: spacing.sm, marginBottom: spacing.md },
  ghostBtnLabel: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: colors.textMuted },
});
