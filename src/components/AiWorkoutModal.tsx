import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput, ActivityIndicator, Switch } from 'react-native';
import { colors, fonts, radii, spacing } from '../theme';
import { Card } from './Card';
import { Chip } from './Chip';
import { Icon } from './Icon';
import { Button } from './Button';
import { useApp } from '../context/AppContext';
import {
  AiWorkoutObiettivo,
  AiWorkoutPlan,
  AiWorkoutRequestParams,
  AiWorkoutSport,
  MetricheSmartwatch,
  WorkoutLevel,
  WorkoutSessionType,
} from '../data/types';
import { generateAiWorkoutPlan, AiWorkoutError, AiWorkoutErrorCode, hasAiApiKeyConfigured } from '../data/aiWorkoutClient';

type Props = {
  visible: boolean;
  onClose: () => void;
  sportId: AiWorkoutSport;
  sportLabel: string;
  livello: WorkoutLevel;
  livelloLabel: string;
  initialTipoSessione: WorkoutSessionType;
};

const OVERLOAD_SPORTS: AiWorkoutSport[] = ['palestra', 'functional-training', 'hyrox'];

const OBJECTIVES: { value: AiWorkoutObiettivo; labelKey: string }[] = [
  { value: 'Forza', labelKey: 'aiObjectiveForza' },
  { value: 'Ipertrofia', labelKey: 'aiObjectiveIpertrofia' },
  { value: 'Resistenza Lattacida', labelKey: 'aiObjectiveResistenza' },
  { value: 'Prevenzione Infortuni', labelKey: 'aiObjectivePrevenzione' },
];

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

export function AiWorkoutModal({ visible, onClose, sportId, sportLabel, livello, livelloLabel, initialTipoSessione }: Props) {
  const { profile, updateProfile, t } = useApp();
  const objectives = useMemo(
    () => (sportId === 'hyrox' ? [{ value: 'Performance Hyrox' as AiWorkoutObiettivo, labelKey: 'aiObjectivePerformanceHyrox' }, ...OBJECTIVES] : OBJECTIVES),
    [sportId]
  );

  const [tipoSessione, setTipoSessione] = useState<WorkoutSessionType>(initialTipoSessione);
  const [obiettivo, setObiettivo] = useState<AiWorkoutObiettivo>(sportId === 'hyrox' ? 'Performance Hyrox' : 'Forza');
  const [numeroScheda, setNumeroScheda] = useState(1);
  const [tempoMinuti, setTempoMinuti] = useState('45');
  const [attrezzatura, setAttrezzatura] = useState('');
  const [corpoLibero, setCorpoLibero] = useState(profile.carichiRiferimento.corpoLibero);
  const [squatKg, setSquatKg] = useState(profile.carichiRiferimento.squatKg != null ? String(profile.carichiRiferimento.squatKg) : '');
  const [pancaKg, setPancaKg] = useState(profile.carichiRiferimento.panca_kg != null ? String(profile.carichiRiferimento.panca_kg) : '');
  const [staccoKg, setStaccoKg] = useState(profile.carichiRiferimento.stacco_kg != null ? String(profile.carichiRiferimento.stacco_kg) : '');
  const [hrMedia, setHrMedia] = useState('');
  const [hrPicco, setHrPicco] = useState('');
  const [hrv, setHrv] = useState('');
  const [calorie, setCalorie] = useState('');
  const [rpe, setRpe] = useState('');
  const [recuperoInsufficiente, setRecuperoInsufficiente] = useState(false);
  const [limitazioni, setLimitazioni] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorCode, setErrorCode] = useState<AiWorkoutErrorCode | null>(null);
  const [result, setResult] = useState<AiWorkoutPlan | null>(null);

  const showLoads = OVERLOAD_SPORTS.includes(sportId);
  const apiKeyConfigured = hasAiApiKeyConfigured();

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

    const carichiIniziali = {
      squatKg: corpoLibero ? null : parseNum(squatKg),
      panca_kg: corpoLibero ? null : parseNum(pancaKg),
      stacco_kg: corpoLibero ? null : parseNum(staccoKg),
      corpoLibero,
    };

    const hasSmartwatchData = hrMedia || hrPicco || hrv || calorie || rpe || recuperoInsufficiente;
    const metricheSmartwatch: MetricheSmartwatch | null = hasSmartwatchData
      ? {
          data: new Date().toISOString().slice(0, 10),
          hrMediaBpm: parseNum(hrMedia),
          hrPiccoBpm: parseNum(hrPicco),
          hrv: parseNum(hrv),
          calorie: parseNum(calorie),
          rpePercepito: parseNum(rpe),
          recuperoInsufficiente,
        }
      : null;

    updateProfile({ carichiRiferimento: carichiIniziali, ...(metricheSmartwatch ? { ultimaSessioneSmartwatch: metricheSmartwatch } : {}) });

    const params: AiWorkoutRequestParams = {
      sport: sportId,
      livello,
      obiettivo,
      tipoSessione,
      numeroScheda,
      tempoMinuti: parseNum(tempoMinuti) ?? 45,
      attrezzatura,
      carichiIniziali,
      metricheSmartwatch,
      limitazioni,
    };

    try {
      const plan = await generateAiWorkoutPlan(params);
      setResult(plan);
    } catch (err) {
      if (err instanceof AiWorkoutError) {
        setErrorCode(err.code);
      } else {
        setErrorCode('http_error');
      }
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
              <Text style={styles.sheetTitle}>{t('workout.aiModalTitle')}</Text>
            </View>
            <Pressable onPress={handleClose} hitSlop={10}>
              <Icon name="close" size={20} color={colors.textMuted} />
            </Pressable>
          </View>
          <Text style={styles.sheetSubtitle}>{sportLabel} · {livelloLabel}</Text>

          <ScrollView style={{ maxHeight: 520 }} showsVerticalScrollIndicator={false}>
            {result ? (
              <View style={styles.resultWrap}>
                <View style={styles.resultBadgeRow}>
                  <View style={styles.resultCyclePill}>
                    <Text style={styles.resultCycleLabel}>{t('workout.aiResultCycle', { n: result.numeroSchedaAttuale, total: result.totaleSchedeCiclo })}</Text>
                  </View>
                </View>
                {!!result.focusFaseAttuale && (
                  <Card style={styles.resultInfoCard}>
                    <Text style={styles.resultInfoLabel}>{t('workout.aiResultFocus')}</Text>
                    <Text style={styles.resultInfoText}>{result.focusFaseAttuale}</Text>
                  </Card>
                )}
                {!!result.adattamentoCaricoSmartwatch && (
                  <Card variant="panelAlt" style={styles.resultInfoCard}>
                    <Text style={styles.resultInfoLabel}>{t('workout.aiResultSmartwatchNote')}</Text>
                    <Text style={styles.resultInfoText}>{result.adattamentoCaricoSmartwatch}</Text>
                  </Card>
                )}

                <View style={styles.resultPhaseHeader}>
                  <Icon name="flame" size={14} color={colors.textMuted} />
                  <Text style={styles.resultPhaseTitle}>{t('workout.phaseWarmup')}</Text>
                </View>
                {result.riscaldamento.map((r, idx) => (
                  <View key={idx} style={styles.resultRow}>
                    <Text style={styles.resultExerciseName}>{r.esercizio}</Text>
                    <Text style={styles.resultExerciseMeta}>{r.durataORip}</Text>
                    {!!r.focusTecnico && <Text style={styles.resultExerciseNote}>{r.focusTecnico}</Text>}
                  </View>
                ))}

                <View style={styles.resultPhaseHeader}>
                  <Icon name="workout" size={14} color={colors.textMuted} />
                  <Text style={styles.resultPhaseTitle}>{t('workout.phaseMain')}</Text>
                </View>
                {result.bloccoPrincipale.map((e, idx) => (
                  <Card key={idx} style={styles.exerciseCard}>
                    <Text style={styles.exerciseCardTitle}>{e.nomeEsercizio}</Text>
                    <Text style={styles.exerciseCardMeta}>
                      {e.serie} × {e.ripetizioni} · {t('workout.aiResultRecovery', { n: e.recuperoSecondi })} · {t('workout.aiResultRpeTarget', { n: e.rpeTarget })}
                    </Text>
                    {!!e.suggerimentoCarico && <Text style={styles.exerciseCardLoad}>{e.suggerimentoCarico}</Text>}
                    {!!e.tempoEsecutivo && <Text style={styles.exerciseCardNote}>{t('workout.aiResultTempo', { tempo: e.tempoEsecutivo })}</Text>}
                    {!!e.motivoBiomeccanico && <Text style={styles.exerciseCardNote}>{e.motivoBiomeccanico}</Text>}
                    {!!e.noteEsecuzione && <Text style={styles.exerciseCardNote}>{e.noteEsecuzione}</Text>}
                    {!!e.progressioneProssimaSessione && (
                      <Text style={styles.exerciseCardProgression}>{t('workout.aiResultProgression', { text: e.progressioneProssimaSessione })}</Text>
                    )}
                  </Card>
                ))}

                <View style={styles.resultPhaseHeader}>
                  <Icon name="leaf" size={14} color={colors.textMuted} />
                  <Text style={styles.resultPhaseTitle}>{t('workout.phaseCooldown')}</Text>
                </View>
                {result.defaticamentoMobilita.map((d, idx) => (
                  <View key={idx} style={styles.resultRow}>
                    <Text style={styles.resultExerciseName}>{d.esercizio}</Text>
                    <Text style={styles.resultExerciseMeta}>{d.durata}</Text>
                  </View>
                ))}

                <Button label={t('workout.aiResultNewGeneration')} variant="secondary" onPress={resetToForm} style={{ marginTop: spacing.lg }} />
                <Button label={t('workout.aiResultClose')} variant="ghost" onPress={handleClose} style={{ marginTop: spacing.sm, marginBottom: spacing.md }} />
              </View>
            ) : (
              <View style={styles.formWrap}>
                {!apiKeyConfigured && (
                  <Card variant="panelAlt" style={styles.warningCard}>
                    <Icon name="warningTriangle" size={16} color={colors.warning} />
                    <Text style={styles.warningText}>{t('workout.aiErrorMissingKey')}</Text>
                  </Card>
                )}

                <Text style={styles.formLabel}>{t('workout.aiSessionType')}</Text>
                <View style={styles.chipsRow}>
                  <Chip label={t('workout.specific')} selected={tipoSessione === 'Specifico'} onPress={() => setTipoSessione('Specifico')} />
                  <Chip label={t('workout.support')} selected={tipoSessione === 'Supporto'} onPress={() => setTipoSessione('Supporto')} />
                </View>

                <Text style={styles.formLabel}>{t('workout.aiObjective')}</Text>
                <View style={styles.chipsRow}>
                  {objectives.map((o) => (
                    <Chip key={o.value} label={t(`workout.${o.labelKey}` as any)} selected={obiettivo === o.value} onPress={() => setObiettivo(o.value)} />
                  ))}
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

                <Text style={styles.formLabel}>{t('workout.aiTimeAvailable')}</Text>
                <TextInput
                  style={styles.textInput}
                  value={tempoMinuti}
                  onChangeText={setTempoMinuti}
                  keyboardType="numeric"
                  placeholder="45"
                  placeholderTextColor={colors.textFaint}
                />

                <Text style={styles.formLabel}>{t('workout.aiEquipment')}</Text>
                <TextInput
                  style={styles.textInput}
                  value={attrezzatura}
                  onChangeText={setAttrezzatura}
                  placeholder={t('workout.aiEquipmentPlaceholder')}
                  placeholderTextColor={colors.textFaint}
                />

                {showLoads && (
                  <>
                    <Text style={styles.formLabel}>{t('workout.aiLoads')}</Text>
                    <View style={styles.switchRow}>
                      <Text style={styles.switchLabel}>{t('workout.aiLoadsBodyweight')}</Text>
                      <Switch value={corpoLibero} onValueChange={setCorpoLibero} trackColor={{ true: colors.highlight, false: colors.border }} />
                    </View>
                    {!corpoLibero && (
                      <View style={styles.loadsGrid}>
                        <View style={styles.loadField}>
                          <Text style={styles.loadFieldLabel}>{t('workout.aiLoadSquat')}</Text>
                          <TextInput style={styles.textInput} value={squatKg} onChangeText={setSquatKg} keyboardType="numeric" placeholderTextColor={colors.textFaint} />
                        </View>
                        <View style={styles.loadField}>
                          <Text style={styles.loadFieldLabel}>{t('workout.aiLoadBench')}</Text>
                          <TextInput style={styles.textInput} value={pancaKg} onChangeText={setPancaKg} keyboardType="numeric" placeholderTextColor={colors.textFaint} />
                        </View>
                        <View style={styles.loadField}>
                          <Text style={styles.loadFieldLabel}>{t('workout.aiLoadDeadlift')}</Text>
                          <TextInput style={styles.textInput} value={staccoKg} onChangeText={setStaccoKg} keyboardType="numeric" placeholderTextColor={colors.textFaint} />
                        </View>
                      </View>
                    )}
                  </>
                )}

                <Text style={styles.formLabel}>{t('workout.aiSmartwatch')}</Text>
                <View style={styles.loadsGrid}>
                  <View style={styles.loadField}>
                    <Text style={styles.loadFieldLabel}>{t('workout.aiHrAvg')}</Text>
                    <TextInput style={styles.textInput} value={hrMedia} onChangeText={setHrMedia} keyboardType="numeric" placeholderTextColor={colors.textFaint} />
                  </View>
                  <View style={styles.loadField}>
                    <Text style={styles.loadFieldLabel}>{t('workout.aiHrPeak')}</Text>
                    <TextInput style={styles.textInput} value={hrPicco} onChangeText={setHrPicco} keyboardType="numeric" placeholderTextColor={colors.textFaint} />
                  </View>
                  <View style={styles.loadField}>
                    <Text style={styles.loadFieldLabel}>{t('workout.aiHrv')}</Text>
                    <TextInput style={styles.textInput} value={hrv} onChangeText={setHrv} keyboardType="numeric" placeholderTextColor={colors.textFaint} />
                  </View>
                  <View style={styles.loadField}>
                    <Text style={styles.loadFieldLabel}>{t('workout.aiCalories')}</Text>
                    <TextInput style={styles.textInput} value={calorie} onChangeText={setCalorie} keyboardType="numeric" placeholderTextColor={colors.textFaint} />
                  </View>
                  <View style={styles.loadField}>
                    <Text style={styles.loadFieldLabel}>{t('workout.aiRpe')}</Text>
                    <TextInput style={styles.textInput} value={rpe} onChangeText={setRpe} keyboardType="numeric" placeholderTextColor={colors.textFaint} />
                  </View>
                </View>
                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>{t('workout.aiPoorRecovery')}</Text>
                  <Switch value={recuperoInsufficiente} onValueChange={setRecuperoInsufficiente} trackColor={{ true: colors.warning, false: colors.border }} />
                </View>

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
                      <Text style={styles.generateBtnLabel}>{t('workout.aiGenerating')}</Text>
                    </>
                  ) : (
                    <>
                      <Icon name="sparkle" size={16} color={colors.accentText} />
                      <Text style={styles.generateBtnLabel}>{t('workout.aiGenerateButton')}</Text>
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
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sheetHeaderTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sheetTitle: { fontFamily: fonts.heading, fontSize: 17, color: colors.text },
  sheetSubtitle: { fontFamily: fonts.body, fontSize: 12.5, color: colors.textMuted, marginTop: 2, marginBottom: spacing.md },
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
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm },
  switchLabel: { fontFamily: fonts.body, fontSize: 13.5, color: colors.text, flex: 1, marginRight: spacing.sm },
  loadsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  loadField: { width: '31%', gap: 4 },
  loadFieldLabel: { fontFamily: fonts.body, fontSize: 11, color: colors.textFaint },
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
  resultBadgeRow: { flexDirection: 'row', marginBottom: spacing.sm },
  resultCyclePill: { backgroundColor: colors.panelAlt, borderRadius: radii.pill, paddingVertical: 5, paddingHorizontal: 12 },
  resultCycleLabel: { fontFamily: fonts.bodySemiBold, fontSize: 12, color: colors.highlight },
  resultInfoCard: { marginBottom: spacing.sm },
  resultInfoLabel: { fontFamily: fonts.bodySemiBold, fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', marginBottom: 4 },
  resultInfoText: { fontFamily: fonts.body, fontSize: 13, color: colors.text, lineHeight: 18 },
  resultPhaseHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.md, marginBottom: 4 },
  resultPhaseTitle: { fontFamily: fonts.bodySemiBold, fontSize: 11.5, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.3 },
  resultRow: { paddingVertical: 5 },
  resultExerciseName: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.text },
  resultExerciseMeta: { fontFamily: fonts.body, fontSize: 12, color: colors.highlight },
  resultExerciseNote: { fontFamily: fonts.body, fontSize: 11.5, color: colors.textFaint },
  exerciseCard: { marginBottom: spacing.sm, gap: 3 },
  exerciseCardTitle: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: colors.text },
  exerciseCardMeta: { fontFamily: fonts.body, fontSize: 12, color: colors.textMuted },
  exerciseCardLoad: { fontFamily: fonts.bodyMedium, fontSize: 12.5, color: colors.highlight },
  exerciseCardNote: { fontFamily: fonts.body, fontSize: 11.5, color: colors.textFaint, lineHeight: 15 },
  exerciseCardProgression: { fontFamily: fonts.bodyMedium, fontSize: 11.5, color: colors.wavePit, marginTop: 2 },
});
