import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput, ActivityIndicator } from 'react-native';
import { colors, fonts, radii, spacing } from '../theme';
import { Card } from './Card';
import { Chip } from './Chip';
import { Icon } from './Icon';
import { useApp } from '../context/AppContext';
import { AI_WORKOUT_SPORTS, AiWorkoutSport, WellnessEcosistema, WellnessSyncInput, WorkoutLevel, WorkoutSessionType } from '../data/types';
import { generateWellnessSync, AiWorkoutError, AiWorkoutErrorCode, hasAiApiKeyConfigured } from '../data/wellnessEngineClient';
import { pick } from '../i18n';
import { sportDisplayName } from '../data/constants';
import { WORKOUT_LEVELS } from '../data/workouts';

type Props = {
  visible: boolean;
  onClose: () => void;
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

export function WellnessSyncModal({ visible, onClose }: Props) {
  const { profile, analysisValues, workoutSelection, language, t } = useApp();

  const defaultSport: AiWorkoutSport = (AI_WORKOUT_SPORTS as readonly string[]).includes(workoutSelection.sportId)
    ? (workoutSelection.sportId as AiWorkoutSport)
    : 'corsa';

  const [sportId, setSportId] = useState<AiWorkoutSport>(defaultSport);
  const [livello, setLivello] = useState<WorkoutLevel>(workoutSelection.livello);
  const [tipoSessione, setTipoSessione] = useState<WorkoutSessionType>('Specifico');
  const [numeroScheda, setNumeroScheda] = useState(1);
  const [attrezzatura, setAttrezzatura] = useState('');
  const [limitazioni, setLimitazioni] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorCode, setErrorCode] = useState<AiWorkoutErrorCode | null>(null);
  const [result, setResult] = useState<WellnessEcosistema | null>(null);

  const apiKeyConfigured = hasAiApiKeyConfigured();

  const anomalie = useMemo(
    () =>
      analysisValues
        .filter((a) => a.valore !== null && (a.stato === 'alto' || a.stato === 'basso'))
        .map((a) => ({
          parametro: pick(a.parametro, language),
          valore: a.valore as number,
          unita: a.unita,
          rangeMin: a.rangeMin,
          rangeMax: a.rangeMax,
          stato: a.stato,
        })),
    [analysisValues, language]
  );

  const resetToForm = () => {
    setResult(null);
    setErrorCode(null);
  };

  const handleClose = () => {
    resetToForm();
    onClose();
  };

  const handleGenerate = async () => {
    setLoading(true);
    setErrorCode(null);

    const input: WellnessSyncInput = {
      sport: sportId,
      livello,
      tipoSessione,
      numeroScheda,
      attrezzatura,
      limitazioni,
      lingua: language,
      profilo: {
        nome: profile.nome,
        eta: profile.eta,
        pesoKg: profile.pesoKg,
        altezzaCm: profile.altezzaCm,
        stileVita: profile.stileVita,
        obiettivo: profile.obiettivo,
      },
      intolleranzeAllergie: [...profile.intolleranze, ...profile.allergie],
      baselineNutrizionale: { kcal: profile.kcalGiorno, proteineG: profile.proteineGiorno },
      analisiEmaticheRecenti: anomalie,
      metricheSmartwatch: profile.ultimaSessioneSmartwatch,
      carichiIniziali: profile.carichiRiferimento,
    };

    try {
      const eco = await generateWellnessSync(input);
      setResult(eco);
    } catch (err) {
      setErrorCode(err instanceof AiWorkoutError ? err.code : 'http_error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <View style={styles.sheetHeaderTitleRow}>
              <Icon name="sparkle" size={18} color={colors.highlight} />
              <Text style={styles.sheetTitle}>{t('wellness.modalTitle')}</Text>
            </View>
            <Pressable onPress={handleClose} hitSlop={10}>
              <Icon name="close" size={20} color={colors.textMuted} />
            </Pressable>
          </View>

          <ScrollView style={{ maxHeight: 560 }} showsVerticalScrollIndicator={false}>
            {result ? (
              <View style={styles.resultWrap}>
                <View style={styles.sectionHeaderRow}>
                  <Icon name="workout" size={15} color={colors.textMuted} />
                  <Text style={styles.sectionTitle}>{t('wellness.sectionAllenamento')}</Text>
                </View>
                <Card style={styles.card}>
                  {!!result.allenamento.focusTecnico && <Text style={styles.cardHighlight}>{result.allenamento.focusTecnico}</Text>}
                  {!!result.allenamento.adattamentoSmartwatchApplicato && (
                    <Text style={styles.cardMuted}>{result.allenamento.adattamentoSmartwatchApplicato}</Text>
                  )}
                  {result.allenamento.bloccoPrincipale.map((e, idx) => (
                    <View key={idx} style={styles.exerciseRow}>
                      <Text style={styles.exerciseName}>{e.nomeEsercizio}</Text>
                      <Text style={styles.exerciseMeta}>
                        {e.serie} × {e.ripetizioni} · RPE {e.rpeTarget} · {e.recuperoSecondi}s
                      </Text>
                      {!!e.caricoSuggerito && <Text style={styles.exerciseLoad}>{e.caricoSuggerito}</Text>}
                    </View>
                  ))}
                </Card>

                <View style={styles.sectionHeaderRow}>
                  <Icon name="apple" size={15} color={colors.textMuted} />
                  <Text style={styles.sectionTitle}>{t('wellness.sectionNutrizione')}</Text>
                </View>
                <Card style={styles.card}>
                  <Text style={styles.cardHighlight}>{t('wellness.kcalBaselineLabel', { n: result.profiloAggiornato.fabbisognoKcalBaseline })}</Text>
                  <Text style={styles.cardHighlight}>{t('wellness.kcalTodayLabel', { n: result.profiloAggiornato.fabbisognoKcalOggi })}</Text>
                  {!!result.profiloAggiornato.aggiustamentoKcalApplicato && (
                    <Text style={styles.cardMuted}>{result.profiloAggiornato.aggiustamentoKcalApplicato}</Text>
                  )}
                  <Text style={styles.cardMuted}>
                    {t('wellness.macroTargetLabel', {
                      p: result.profiloAggiornato.proteineTargetG,
                      c: result.profiloAggiornato.carboidratiTargetG,
                      g: result.profiloAggiornato.grassiTargetG,
                    })}
                  </Text>
                  {!!result.profiloAggiornato.insightAiGiornaliero && (
                    <Text style={[styles.cardMuted, { marginTop: spacing.sm }]}>{result.profiloAggiornato.insightAiGiornaliero}</Text>
                  )}
                  {result.pianoNutrizionaleOggi.map((p, idx) => (
                    <View key={idx} style={styles.mealRow}>
                      <Text style={styles.mealPasto}>{p.pasto}</Text>
                      <Text style={styles.exerciseName}>{p.nomeRicetta}</Text>
                      <Text style={styles.exerciseMeta}>{t('wellness.mealMeta', { min: p.tempoPreparazioneMin, kcal: p.kcal })}</Text>
                      {!p.compatibileIntolleranze && (
                        <Text style={[styles.exerciseMeta, { color: colors.berry }]}>⚠ {t('wellness.mealIntoleranceWarning')}</Text>
                      )}
                    </View>
                  ))}
                </Card>

                <View style={styles.sectionHeaderRow}>
                  <Icon name="cart" size={15} color={colors.textMuted} />
                  <Text style={styles.sectionTitle}>{t('wellness.sectionSpesa')}</Text>
                </View>
                <Card style={styles.card}>
                  <Text style={styles.cardMuted}>
                    {result.listaSpesa.copertura === 'settimana_completa' ? t('wellness.shoppingCoverageWeek') : t('wellness.shoppingCoverageToday')}
                  </Text>
                  {result.listaSpesa.categorie.map((cat, idx) => (
                    <View key={idx} style={{ marginTop: spacing.sm }}>
                      <Text style={styles.categoriaLabel}>{cat.categoria}</Text>
                      {cat.elementi.map((el, i2) => (
                        <View key={i2} style={styles.shoppingRow}>
                          <Text style={styles.exerciseName}>{el.ingrediente}</Text>
                          <Text style={styles.exerciseMeta}>{el.quantitaTotale}</Text>
                        </View>
                      ))}
                    </View>
                  ))}
                </Card>

                <View style={styles.sectionHeaderRow}>
                  <Icon name="drop" size={15} color={colors.textMuted} />
                  <Text style={styles.sectionTitle}>{t('wellness.sectionAnalisi')}</Text>
                </View>
                <Card variant="panelAlt" style={styles.card}>
                  <Text style={styles.disclaimer}>{result.analisiEmaticheReport.disclaimer}</Text>
                  <Text style={styles.cardHighlight}>{result.analisiEmaticheReport.statoGenerale}</Text>
                  {result.analisiEmaticheReport.anomalieRilevate.length === 0 ? (
                    <Text style={styles.cardMuted}>{t('wellness.noAnomalies')}</Text>
                  ) : (
                    result.analisiEmaticheReport.anomalieRilevate.map((a, idx) => (
                      <View key={idx} style={{ marginTop: spacing.sm }}>
                        <Text style={styles.exerciseName}>{a.parametro} — {a.valoreRilevato}</Text>
                        <Text style={styles.cardMuted}>{a.spuntoDaDiscuterreColMedico}</Text>
                      </View>
                    ))
                  )}
                </Card>

                <Pressable style={styles.secondaryBtn} onPress={resetToForm}>
                  <Text style={styles.secondaryBtnLabel}>{t('wellness.resultSyncAgain')}</Text>
                </Pressable>
                <Pressable style={styles.ghostBtn} onPress={handleClose}>
                  <Text style={styles.ghostBtnLabel}>{t('workout.aiResultClose')}</Text>
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

                <Text style={styles.formLabel}>{t('workout.sport')}</Text>
                <View style={styles.chipsRow}>
                  {AI_WORKOUT_SPORTS.map((s) => (
                    <Chip key={s} label={pick(sportDisplayName(s), language)} selected={sportId === s} onPress={() => setSportId(s)} />
                  ))}
                </View>

                <Text style={styles.formLabel}>{t('workout.level')}</Text>
                <View style={styles.chipsRow}>
                  {WORKOUT_LEVELS.map((l) => (
                    <Chip key={l} label={l} selected={livello === l} onPress={() => setLivello(l)} />
                  ))}
                </View>

                <Text style={styles.formLabel}>{t('workout.aiSessionType')}</Text>
                <View style={styles.chipsRow}>
                  <Chip label={t('workout.specific')} selected={tipoSessione === 'Specifico'} onPress={() => setTipoSessione('Specifico')} />
                  <Chip label={t('workout.support')} selected={tipoSessione === 'Supporto'} onPress={() => setTipoSessione('Supporto')} />
                </View>

                <Text style={styles.formLabel}>{t('workout.aiSchedaNumber')}</Text>
                <View style={styles.stepperRow}>
                  <Pressable style={styles.stepperBtn} onPress={() => setNumeroScheda((n) => Math.max(1, n - 1))}>
                    <Text style={styles.stepperBtnLabel}>−</Text>
                  </Pressable>
                  <Text style={styles.stepperValue}>{numeroScheda}</Text>
                  <Pressable style={styles.stepperBtn} onPress={() => setNumeroScheda((n) => Math.min(10, n + 1))}>
                    <Text style={styles.stepperBtnLabel}>+</Text>
                  </Pressable>
                </View>

                <Text style={styles.formLabel}>{t('workout.aiEquipment')}</Text>
                <TextInput
                  style={styles.textInput}
                  value={attrezzatura}
                  onChangeText={setAttrezzatura}
                  placeholder={t('workout.aiEquipmentPlaceholder')}
                  placeholderTextColor={colors.textFaint}
                />

                <Text style={styles.formLabel}>{t('workout.aiLimitations')}</Text>
                <TextInput
                  style={styles.textInput}
                  value={limitazioni}
                  onChangeText={setLimitazioni}
                  placeholder={t('workout.aiLimitationsPlaceholder')}
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
                      <Text style={styles.generateBtnLabel}>{t('wellness.generating')}</Text>
                    </>
                  ) : (
                    <>
                      <Icon name="sparkle" size={16} color={colors.accentText} />
                      <Text style={styles.generateBtnLabel}>{t('wellness.generateButton')}</Text>
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
  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  stepperBtn: { width: 36, height: 36, borderRadius: radii.sm, backgroundColor: colors.panelAlt, alignItems: 'center', justifyContent: 'center' },
  stepperBtnLabel: { fontFamily: fonts.headingBold, fontSize: 18, color: colors.text },
  stepperValue: { fontFamily: fonts.bodySemiBold, fontSize: 16, color: colors.text, minWidth: 24, textAlign: 'center' },
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
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.md, marginBottom: spacing.sm },
  sectionTitle: { fontFamily: fonts.bodySemiBold, fontSize: 12.5, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.3 },
  card: { gap: 4 },
  cardHighlight: { fontFamily: fonts.bodySemiBold, fontSize: 13.5, color: colors.highlight },
  cardMuted: { fontFamily: fonts.body, fontSize: 12.5, color: colors.textMuted, lineHeight: 17 },
  exerciseRow: { paddingVertical: 6, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border, marginTop: 4 },
  exerciseName: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.text },
  exerciseMeta: { fontFamily: fonts.body, fontSize: 12, color: colors.textMuted },
  exerciseLoad: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.highlight },
  mealRow: { paddingVertical: 6, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border, marginTop: 4 },
  mealPasto: { fontFamily: fonts.bodySemiBold, fontSize: 11, color: colors.textFaint, textTransform: 'uppercase' },
  categoriaLabel: { fontFamily: fonts.bodySemiBold, fontSize: 12.5, color: colors.text, marginBottom: 2 },
  shoppingRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  disclaimer: { fontFamily: fonts.body, fontSize: 11, color: colors.textFaint, fontStyle: 'italic', marginBottom: 4 },
  secondaryBtn: { backgroundColor: colors.panelAlt, borderRadius: radii.pill, paddingVertical: 14, alignItems: 'center', marginTop: spacing.lg },
  secondaryBtnLabel: { fontFamily: fonts.bodySemiBold, fontSize: 15, color: colors.text },
  ghostBtn: { alignItems: 'center', paddingVertical: 12, marginTop: spacing.sm, marginBottom: spacing.md },
  ghostBtnLabel: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: colors.textMuted },
});
