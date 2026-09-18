import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput, ActivityIndicator } from 'react-native';
import { colors, fonts, radii, spacing } from '../theme';
import { Card } from './Card';
import { Icon } from './Icon';
import { useApp } from '../context/AppContext';
import { AiAnalysisReport } from '../data/types';
import { generateAiAnalysisReport, AiWorkoutError, AiWorkoutErrorCode, hasAiApiKeyConfigured } from '../data/aiAnalysisClient';
import { pick } from '../i18n';

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

export function AiAnalysisModal({ visible, onClose }: Props) {
  const { analysisValues, language, t } = useApp();

  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorCode, setErrorCode] = useState<AiWorkoutErrorCode | null>(null);
  const [result, setResult] = useState<AiAnalysisReport | null>(null);

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
    try {
      const report = await generateAiAnalysisReport(anomalie, { note, lingua: language });
      setResult(report);
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
              <Text style={styles.sheetTitle}>{t('analysis.aiModalTitle')}</Text>
            </View>
            <Pressable onPress={handleClose} hitSlop={10}>
              <Icon name="close" size={20} color={colors.textMuted} />
            </Pressable>
          </View>

          <ScrollView style={{ maxHeight: 520 }} showsVerticalScrollIndicator={false}>
            {result ? (
              <View style={styles.resultWrap}>
                <Text style={styles.disclaimer}>{result.disclaimer}</Text>
                <Text style={styles.statoGenerale}>{result.statoGenerale}</Text>
                {!!result.suggerimentoGenerale && <Text style={styles.suggerimento}>{result.suggerimentoGenerale}</Text>}

                {result.anomalieRilevate.length === 0 ? (
                  <Card variant="panelAlt" style={styles.card}>
                    <Text style={styles.cardMuted}>{t('analysis.aiNoAnomalies')}</Text>
                  </Card>
                ) : (
                  result.anomalieRilevate.map((a, idx) => (
                    <Card key={idx} style={styles.anomaliaCard}>
                      <Text style={styles.anomaliaParam}>{a.parametro} — {a.valoreRilevato}</Text>
                      <Text style={styles.cardMuted}>{a.spuntoDaDiscuterreColMedico}</Text>
                    </Card>
                  ))
                )}

                <Pressable style={styles.secondaryBtn} onPress={resetToForm}>
                  <Text style={styles.secondaryBtnLabel}>{t('analysis.aiResultNewAnalysis')}</Text>
                </Pressable>
                <Pressable style={styles.ghostBtn} onPress={handleClose}>
                  <Text style={styles.ghostBtnLabel}>{t('analysis.aiResultClose')}</Text>
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

                {anomalie.length === 0 && (
                  <Card variant="panelAlt" style={styles.warningCard}>
                    <Icon name="leaf" size={16} color={colors.highlight} />
                    <Text style={styles.warningText}>{t('analysis.aiNoAnomalies')}</Text>
                  </Card>
                )}

                <Text style={styles.formLabel}>{t('analysis.aiNotesLabel')}</Text>
                <TextInput
                  style={styles.textInput}
                  value={note}
                  onChangeText={setNote}
                  placeholder={t('analysis.aiNotesPlaceholder')}
                  placeholderTextColor={colors.textFaint}
                  multiline
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
                      <Text style={styles.generateBtnLabel}>{t('analysis.aiGenerating')}</Text>
                    </>
                  ) : (
                    <>
                      <Icon name="sparkle" size={16} color={colors.accentText} />
                      <Text style={styles.generateBtnLabel}>{t('analysis.aiGenerateButton')}</Text>
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
  textInput: {
    backgroundColor: colors.panelAlt,
    borderRadius: radii.sm,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.text,
    minHeight: 60,
    textAlignVertical: 'top',
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
  disclaimer: { fontFamily: fonts.body, fontSize: 11, color: colors.textFaint, fontStyle: 'italic', marginBottom: spacing.sm },
  statoGenerale: { fontFamily: fonts.bodySemiBold, fontSize: 15, color: colors.highlight, marginBottom: spacing.sm },
  suggerimento: { fontFamily: fonts.body, fontSize: 13, color: colors.textMuted, lineHeight: 18, marginBottom: spacing.md },
  card: { marginBottom: spacing.sm },
  cardMuted: { fontFamily: fonts.body, fontSize: 12.5, color: colors.textMuted, lineHeight: 17 },
  anomaliaCard: { marginBottom: spacing.sm, gap: 4 },
  anomaliaParam: { fontFamily: fonts.bodySemiBold, fontSize: 13.5, color: colors.text },
  secondaryBtn: { backgroundColor: colors.panelAlt, borderRadius: radii.pill, paddingVertical: 14, alignItems: 'center', marginTop: spacing.lg },
  secondaryBtnLabel: { fontFamily: fonts.bodySemiBold, fontSize: 15, color: colors.text },
  ghostBtn: { alignItems: 'center', paddingVertical: 12, marginTop: spacing.sm, marginBottom: spacing.md },
  ghostBtnLabel: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: colors.textMuted },
});
