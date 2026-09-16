import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { colors, fonts, radii, spacing } from '../theme';
import { ScreenHeader } from '../components/ScreenHeader';
import { Card } from '../components/Card';
import { Icon } from '../components/Icon';
import { Button } from '../components/Button';
import { useApp } from '../context/AppContext';
import { generateMockAnalysis } from '../data/analysisParams';
import { AnalysisValue, AnalysisStatus } from '../data/types';

function statusColor(stato: AnalysisStatus) {
  if (stato === 'alto') return colors.berry;
  if (stato === 'basso') return colors.warning;
  if (stato === 'manuale') return colors.textFaint;
  return colors.accent;
}

export function AnalysisScreen() {
  const { analysisValues, updateAnalysisValue, t } = useApp();
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<AnalysisValue | null>(null);
  const [draft, setDraft] = useState('');

  const STATUS_LABEL: Record<AnalysisStatus, string> = {
    basso: t('analysis.statusLow'),
    normale: t('analysis.statusNormal'),
    alto: t('analysis.statusHigh'),
    manuale: t('analysis.statusManual'),
  };

  const handleUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
      if (result.canceled) return;
      setUploading(true);
      // Estrazione OCR simulata: in produzione da collegare a un servizio reale.
      setTimeout(() => {
        const extracted = generateMockAnalysis();
        extracted.forEach((v) => updateAnalysisValue(v.id, v.valore));
        setUploading(false);
        Alert.alert(t('analysis.processedTitle'), t('analysis.processedBody'));
      }, 1200);
    } catch {
      setUploading(false);
    }
  };

  const openEdit = (item: AnalysisValue) => {
    setEditing(item);
    setDraft(item.valore !== null ? String(item.valore) : '');
  };

  const confirmEdit = () => {
    if (!editing) return;
    const parsed = parseFloat(draft.replace(',', '.'));
    updateAnalysisValue(editing.id, Number.isFinite(parsed) ? parsed : null);
    setEditing(null);
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t('analysis.title')} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.uploadCard} onPress={handleUpload}>
          <View style={styles.uploadIcon}>
            <Icon name="upload" size={20} color={colors.accentText} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.uploadTitle}>{uploading ? t('analysis.uploadProcessing') : t('analysis.uploadTitle')}</Text>
            <Text style={styles.uploadSubtitle}>{t('analysis.uploadSubtitle')}</Text>
          </View>
        </Card>

        <Text style={styles.sectionLabel}>{t('analysis.paramsSectionTitle')}</Text>
        {analysisValues.map((item) => (
          <Pressable key={item.id} onPress={() => openEdit(item)}>
            <Card style={styles.paramCard}>
              <View style={styles.paramTopRow}>
                <Text style={styles.paramName}>{item.parametro}</Text>
                <View style={[styles.statusPill, { backgroundColor: statusColor(item.stato) + '33' }]}>
                  <Text style={[styles.statusText, { color: statusColor(item.stato) }]}>{STATUS_LABEL[item.stato]}</Text>
                </View>
              </View>
              <View style={styles.paramBottomRow}>
                <Text style={styles.paramValue}>
                  {item.valore !== null ? `${item.valore} ${item.unita}` : t('analysis.notInserted')}
                </Text>
                <Text style={styles.paramRange}>
                  {t('analysis.range', { min: item.rangeMin, max: item.rangeMax })} {item.unita}
                </Text>
              </View>
              {item.nota ? (
                <View style={styles.noteRow}>
                  <Icon name="leaf" size={13} color={colors.accent} />
                  <Text style={styles.noteText}>{item.nota}</Text>
                </View>
              ) : null}
            </Card>
          </Pressable>
        ))}
      </ScrollView>

      <Modal visible={!!editing} transparent animationType="fade" onRequestClose={() => setEditing(null)}>
        <View style={styles.editOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setEditing(null)} />
          <View style={styles.editCard}>
            <Text style={styles.editTitle}>{editing?.parametro}</Text>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              keyboardType="decimal-pad"
              style={styles.editInput}
              placeholder={editing?.unita ?? ''}
              placeholderTextColor={colors.textFaint}
              autoFocus
            />
            <View style={styles.editButtons}>
              <Pressable onPress={() => setEditing(null)} style={styles.editCancel}>
                <Text style={styles.editCancelLabel}>{t('common.cancel')}</Text>
              </Pressable>
              <Pressable onPress={confirmEdit} style={styles.editConfirm}>
                <Text style={styles.editConfirmLabel}>{t('common.save')}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  uploadCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg },
  uploadIcon: { width: 40, height: 40, borderRadius: radii.md, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  uploadTitle: { fontFamily: fonts.bodySemiBold, fontSize: 15, color: colors.text },
  uploadSubtitle: { fontFamily: fonts.body, fontSize: 12, color: colors.textMuted, marginTop: 2 },
  sectionLabel: { fontFamily: fonts.bodySemiBold, fontSize: 12, color: colors.textMuted, textTransform: 'uppercase', marginBottom: spacing.sm },
  paramCard: { marginBottom: spacing.sm },
  paramTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  paramName: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: colors.text, flexShrink: 1 },
  statusPill: { paddingVertical: 3, paddingHorizontal: 8, borderRadius: radii.pill },
  statusText: { fontFamily: fonts.bodySemiBold, fontSize: 11 },
  paramBottomRow: { flexDirection: 'row', justifyContent: 'space-between' },
  paramValue: { fontFamily: fonts.body, fontSize: 13, color: colors.text },
  paramRange: { fontFamily: fonts.body, fontSize: 12, color: colors.textFaint },
  noteRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginTop: 8 },
  noteText: { flex: 1, fontFamily: fonts.body, fontSize: 12, color: colors.textMuted, lineHeight: 17 },
  editOverlay: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.overlay, padding: spacing.lg },
  editCard: { width: '100%', backgroundColor: colors.panel, borderRadius: radii.lg, padding: spacing.lg },
  editTitle: { fontFamily: fonts.heading, fontSize: 17, color: colors.text, marginBottom: spacing.md },
  editInput: { backgroundColor: colors.panelAlt, borderRadius: radii.md, paddingHorizontal: spacing.md, paddingVertical: 12, color: colors.text, fontFamily: fonts.body, fontSize: 15, marginBottom: spacing.md },
  editButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.md },
  editCancel: { paddingVertical: 8, paddingHorizontal: 12 },
  editCancelLabel: { fontFamily: fonts.body, color: colors.textMuted, fontSize: 14 },
  editConfirm: { paddingVertical: 8, paddingHorizontal: 16, backgroundColor: colors.accent, borderRadius: radii.pill },
  editConfirmLabel: { fontFamily: fonts.bodySemiBold, color: colors.accentText, fontSize: 14 },
});
