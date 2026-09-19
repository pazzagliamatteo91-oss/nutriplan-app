import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { colors, fonts, radii, spacing } from '../theme';
import { Icon } from './Icon';
import { useApp } from '../context/AppContext';
import { SetEntry, WorkoutSessionType } from '../data/types';

type Props = {
  sportId: string;
  tipoSessione: WorkoutSessionType;
  esercizio: string; // nome dell'esercizio in italiano, usato come chiave stabile
  dettaglio: string; // testo target es. "4x8", usato solo per suggerire il numero di serie
};

type Row = { peso: string; reps: string };

// Prova a leggere il numero di serie previste dal testo del target (es. "4x8"
// -> 4, "3x30s" -> 3): se il formato non è riconosciuto usa 3 come default
// ragionevole, dato che i pool di esercizi non espongono questo dato in forma
// strutturata (sono stringhe già formattate per la sola visualizzazione).
function guessSetCount(dettaglio: string): number {
  const match = dettaglio.match(/^(\d+)\s*[x×]/i);
  const n = match ? Number(match[1]) : 3;
  return Math.min(Math.max(n, 1), 8);
}

function setsToRows(sets: SetEntry[] | null, fallbackCount: number): Row[] {
  if (sets && sets.length) {
    return sets.map((s) => ({ peso: s.peso != null ? String(s.peso) : '', reps: s.ripetizioni != null ? String(s.ripetizioni) : '' }));
  }
  return Array.from({ length: fallbackCount }, () => ({ peso: '', reps: '' }));
}

function formatSetsSummary(sets: SetEntry[]): string {
  return sets
    .filter((s) => s.peso != null || s.ripetizioni != null)
    .map((s) => {
      const peso = s.peso != null ? `${s.peso}kg` : '';
      const reps = s.ripetizioni != null ? `×${s.ripetizioni}` : '';
      return `${peso}${reps}`;
    })
    .join(', ');
}

export function SetLogger({ sportId, tipoSessione, esercizio, dettaglio }: Props) {
  const { logExerciseSets, getTodayExerciseSets, getLastExerciseSets, t } = useApp();
  const [expanded, setExpanded] = useState(false);

  const todaySets = getTodayExerciseSets(sportId, tipoSessione, esercizio);
  const lastSets = getLastExerciseSets(sportId, tipoSessione, esercizio);
  const fallbackCount = useMemo(() => guessSetCount(dettaglio), [dettaglio]);

  const [rows, setRows] = useState<Row[]>(() => setsToRows(todaySets ?? lastSets, fallbackCount));

  const openEditor = () => {
    if (!expanded) setRows(setsToRows(todaySets ?? lastSets, fallbackCount));
    setExpanded((v) => !v);
  };

  const updateRow = (idx: number, patch: Partial<Row>) => {
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  };

  const addRow = () => setRows((prev) => [...prev, { peso: '', reps: '' }]);
  const removeRow = (idx: number) => setRows((prev) => prev.filter((_, i) => i !== idx));

  const save = () => {
    const serie: SetEntry[] = rows.map((r) => ({
      peso: r.peso.trim() ? Number(r.peso.replace(',', '.')) : null,
      ripetizioni: r.reps.trim() ? parseInt(r.reps, 10) : null,
    }));
    logExerciseSets(sportId, tipoSessione, esercizio, serie);
    setExpanded(false);
  };

  return (
    <View style={styles.wrap}>
      <Pressable style={styles.toggleRow} onPress={openEditor} hitSlop={6}>
        {todaySets ? (
          <View style={styles.doneBadge}>
            <Icon name="check" size={11} color={colors.success} />
            <Text style={styles.doneLabel}>{t('workout.logSetsDone')}</Text>
          </View>
        ) : (
          <Text style={styles.toggleLabel}>{t('workout.logSetsButton')}</Text>
        )}
        <Icon name={expanded ? 'chevronDown' : 'chevronRight'} size={13} color={colors.textFaint} />
      </Pressable>

      {expanded && (
        <View style={styles.editor}>
          {lastSets && lastSets.length > 0 && (
            <Text style={styles.lastTime}>{t('workout.logSetsLastTime', { sets: formatSetsSummary(lastSets) })}</Text>
          )}
          <View style={styles.headerRow}>
            <Text style={[styles.colLabel, styles.colWeight]}>{t('workout.logSetsWeightLabel')}</Text>
            <Text style={[styles.colLabel, styles.colReps]}>{t('workout.logSetsRepsLabel')}</Text>
          </View>
          {rows.map((row, idx) => (
            <View key={idx} style={styles.setRow}>
              <Text style={styles.setIndex}>{idx + 1}</Text>
              <TextInput
                style={[styles.input, styles.colWeight]}
                keyboardType="decimal-pad"
                value={row.peso}
                onChangeText={(v) => updateRow(idx, { peso: v })}
                placeholder="—"
                placeholderTextColor={colors.textFaint}
              />
              <TextInput
                style={[styles.input, styles.colReps]}
                keyboardType="number-pad"
                value={row.reps}
                onChangeText={(v) => updateRow(idx, { reps: v })}
                placeholder="—"
                placeholderTextColor={colors.textFaint}
              />
              <Pressable onPress={() => removeRow(idx)} hitSlop={8} style={styles.removeRowBtn}>
                <Icon name="close" size={13} color={colors.textFaint} />
              </Pressable>
            </View>
          ))}
          <View style={styles.editorFooter}>
            <Pressable onPress={addRow} hitSlop={6}>
              <Text style={styles.addSetLabel}>{t('workout.logSetsAddSet')}</Text>
            </Pressable>
            <Pressable style={styles.saveBtn} onPress={save}>
              <Text style={styles.saveLabel}>{t('workout.logSetsSave')}</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 6 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 2 },
  toggleLabel: { fontFamily: fonts.bodyMedium, fontSize: 11.5, color: colors.highlight },
  doneBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  doneLabel: { fontFamily: fonts.bodyMedium, fontSize: 11.5, color: colors.success },
  editor: {
    marginTop: 6,
    backgroundColor: colors.background,
    borderRadius: radii.sm,
    padding: spacing.sm,
    gap: 6,
  },
  lastTime: { fontFamily: fonts.body, fontSize: 11, color: colors.textMuted, marginBottom: 2 },
  headerRow: { flexDirection: 'row', gap: spacing.sm, paddingLeft: 20 },
  colLabel: { fontFamily: fonts.bodySemiBold, fontSize: 10.5, color: colors.textFaint, textTransform: 'uppercase' },
  colWeight: { width: 64 },
  colReps: { width: 56 },
  setRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  setIndex: { width: 14, fontFamily: fonts.bodyMedium, fontSize: 11, color: colors.textFaint },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.text,
  },
  removeRowBtn: { padding: 4 },
  editorFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  addSetLabel: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.highlight },
  saveBtn: { backgroundColor: colors.accent, borderRadius: radii.pill, paddingVertical: 6, paddingHorizontal: 16 },
  saveLabel: { fontFamily: fonts.bodySemiBold, fontSize: 12.5, color: colors.accentText },
});
