import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal } from 'react-native';
import { colors, fonts, radii, spacing } from '../theme';
import { ScreenHeader } from '../components/ScreenHeader';
import { Card } from '../components/Card';
import { Chip } from '../components/Chip';
import { Icon, IconName } from '../components/Icon';
import { Button } from '../components/Button';
import { useApp } from '../context/AppContext';
import { MAIN_SPORTS, EXTENDED_SPORTS, DEVICE_TYPES } from '../data/constants';
import { WORKOUT_LEVELS, SPORT_ICONS, specificoLabel, supportoLabel, generateWeekPlan } from '../data/workouts';
import { WorkoutLevel } from '../data/types';

function sportLabel(sportId: string) {
  return MAIN_SPORTS.find((s) => s.id === sportId)?.label ?? sportId;
}

export function WorkoutScreen() {
  const { profile, updateProfile, workoutSelection, setWorkoutSelection, lastWorkoutLog, logWorkoutToday } = useApp();
  const [extendedOpen, setExtendedOpen] = useState(false);
  const { sportId, livello } = workoutSelection;

  const weekPlan = useMemo(() => generateWeekPlan(sportId, livello), [sportId, livello]);
  const icon: IconName = SPORT_ICONS[sportId] ?? 'workout';

  const setSport = (id: string) => setWorkoutSelection({ sportId: id, livello });
  const setLevel = (l: WorkoutLevel) => setWorkoutSelection({ sportId, livello: l });

  const anyDeviceConnected = Object.values(profile.dispositivi).some(Boolean);

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Allenamento" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Sport</Text>
        <View style={styles.sportGrid}>
          {MAIN_SPORTS.map((s) => {
            const active = sportId === s.id;
            return (
              <Pressable key={s.id} style={[styles.sportChip, active && styles.sportChipActive]} onPress={() => setSport(s.id)}>
                <Icon name={SPORT_ICONS[s.id]} size={18} color={active ? colors.accentText : colors.text} />
                <Text style={[styles.sportLabel, active && styles.sportLabelActive]}>{s.label}</Text>
              </Pressable>
            );
          })}
          <Pressable style={styles.sportChip} onPress={() => setExtendedOpen(true)}>
            <Icon name="moreDots" size={18} color={colors.text} />
            <Text style={styles.sportLabel}>Altro</Text>
          </Pressable>
        </View>
        {!MAIN_SPORTS.some((s) => s.id === sportId) && (
          <Text style={styles.currentExtended}>Disciplina selezionata: {sportId}</Text>
        )}

        <Text style={styles.label}>Livello</Text>
        <View style={styles.levelRow}>
          {WORKOUT_LEVELS.map((l) => (
            <Chip key={l} label={l} selected={livello === l} onPress={() => setLevel(l)} />
          ))}
        </View>

        <View style={styles.sessionRow}>
          <Card style={styles.sessionCard}>
            <View style={styles.sessionIconWrap}>
              <Icon name={icon} size={20} color={colors.accentText} />
            </View>
            <Text style={styles.sessionTitle}>Specifico</Text>
            <Text style={styles.sessionDesc}>{specificoLabel(sportId)}</Text>
          </Card>
          <Card style={styles.sessionCard} variant="panelAlt">
            <View style={[styles.sessionIconWrap, { backgroundColor: colors.accent }]}>
              <Icon name="gym" size={20} color={colors.accentText} />
            </View>
            <Text style={styles.sessionTitle}>Supporto</Text>
            <Text style={styles.sessionDesc}>{supportoLabel(sportId)}</Text>
          </Card>
        </View>

        <Text style={styles.sectionTitle}>Scheda della settimana — {sportLabel(sportId)} · {livello}</Text>
        <Text style={styles.sectionSubtitle}>Sincronizzata da una libreria di allenamenti online</Text>
        <Card style={styles.weekCard}>
          {weekPlan.map((day, idx) => (
            <View key={day.giorno} style={[styles.dayRow, idx === weekPlan.length - 1 && { borderBottomWidth: 0 }]}>
              <Text style={styles.dayName}>{day.giorno}</Text>
              <View style={styles.dayInfo}>
                <Text style={[styles.dayType, day.tipo === 'Riposo' && { color: colors.textFaint }]}>{day.tipo}</Text>
                <Text style={styles.dayDesc} numberOfLines={1}>{day.descrizione}</Text>
              </View>
              {day.durataMinuti > 0 && <Text style={styles.dayDuration}>{day.durataMinuti} min</Text>}
            </View>
          ))}
        </Card>

        <Button
          label={lastWorkoutLog ? 'Segna un altro allenamento come completato' : 'Segna allenamento di oggi come completato'}
          variant="secondary"
          onPress={logWorkoutToday}
          style={{ marginBottom: spacing.lg }}
        />

        <Text style={styles.label}>Dispositivi collegati</Text>
        <Card style={styles.devicesCard}>
          {DEVICE_TYPES.map((d, idx) => {
            const connected = !!profile.dispositivi[d.id];
            return (
              <Pressable
                key={d.id}
                style={[styles.deviceRow, idx === DEVICE_TYPES.length - 1 && { borderBottomWidth: 0 }]}
                onPress={() => updateProfile({ dispositivi: { ...profile.dispositivi, [d.id]: !connected } })}
              >
                <Icon name="watch" size={18} color={connected ? colors.accent : colors.textMuted} />
                <Text style={styles.deviceLabel}>{d.label}</Text>
                <View style={[styles.statusDot, { backgroundColor: connected ? colors.accent : colors.textFaint }]} />
                <Text style={[styles.deviceStatus, { color: connected ? colors.accent : colors.textFaint }]}>
                  {connected ? 'Connesso' : 'Non connesso'}
                </Text>
              </Pressable>
            );
          })}
        </Card>

        {anyDeviceConnected && (
          <Card variant="panelAlt" style={styles.suggestionCard}>
            <Icon name="flame" size={18} color={colors.accent} />
            <View style={{ flex: 1 }}>
              <Text style={styles.suggestionTitle}>Variante proposta</Text>
              <Text style={styles.suggestionText}>
                In base all'attività rilevata dai tuoi dispositivi, potresti aggiungere una sessione di recupero leggero questa settimana.
              </Text>
            </View>
          </Card>
        )}
      </ScrollView>

      <Modal visible={extendedOpen} transparent animationType="slide" onRequestClose={() => setExtendedOpen(false)}>
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setExtendedOpen(false)} />
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Altre discipline</Text>
            <ScrollView style={{ maxHeight: 420 }}>
              <View style={styles.extendedGrid}>
                {EXTENDED_SPORTS.map((name) => (
                  <Pressable
                    key={name}
                    style={[styles.extendedChip, sportId === name && styles.extendedChipActive]}
                    onPress={() => {
                      setSport(name);
                      setExtendedOpen(false);
                    }}
                  >
                    <Text style={[styles.extendedLabel, sportId === name && styles.extendedLabelActive]}>{name}</Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  label: { fontFamily: fonts.bodySemiBold, fontSize: 12, color: colors.textMuted, textTransform: 'uppercase', marginBottom: spacing.sm },
  sportGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xs },
  sportChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 9, paddingHorizontal: 12,
    borderRadius: radii.pill, backgroundColor: colors.panel,
  },
  sportChipActive: { backgroundColor: colors.accent },
  sportLabel: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.text },
  sportLabelActive: { color: colors.accentText },
  currentExtended: { fontFamily: fonts.body, fontSize: 12, color: colors.accent, marginBottom: spacing.md },
  levelRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.lg },
  sessionRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  sessionCard: { flex: 1 },
  sessionIconWrap: {
    width: 38, height: 38, borderRadius: radii.md, backgroundColor: colors.background,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm,
  },
  sessionTitle: { fontFamily: fonts.heading, fontSize: 15, color: colors.text, marginBottom: 4 },
  sessionDesc: { fontFamily: fonts.body, fontSize: 12, color: colors.textMuted },
  sectionTitle: { fontFamily: fonts.heading, fontSize: 16, color: colors.text, marginBottom: 2 },
  sectionSubtitle: { fontFamily: fonts.body, fontSize: 12, color: colors.textFaint, marginBottom: spacing.sm },
  weekCard: { marginBottom: spacing.lg, paddingVertical: 4 },
  dayRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border, gap: spacing.sm,
  },
  dayName: { width: 78, fontFamily: fonts.bodySemiBold, fontSize: 13, color: colors.text },
  dayInfo: { flex: 1 },
  dayType: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.accent },
  dayDesc: { fontFamily: fonts.body, fontSize: 12, color: colors.textMuted },
  dayDuration: { fontFamily: fonts.body, fontSize: 12, color: colors.textFaint },
  devicesCard: { marginBottom: spacing.lg, paddingVertical: 4 },
  deviceRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border,
  },
  deviceLabel: { flex: 1, fontFamily: fonts.body, fontSize: 14, color: colors.text },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  deviceStatus: { fontFamily: fonts.bodyMedium, fontSize: 12 },
  suggestionCard: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  suggestionTitle: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: colors.text, marginBottom: 4 },
  suggestionText: { fontFamily: fonts.body, fontSize: 12, color: colors.textMuted, lineHeight: 17 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: colors.overlay },
  modalSheet: { backgroundColor: colors.panel, borderTopLeftRadius: radii.xl, borderTopRightRadius: radii.xl, padding: spacing.lg, paddingBottom: spacing.xxl },
  modalTitle: { fontFamily: fonts.heading, fontSize: 17, color: colors.text, marginBottom: spacing.md },
  extendedGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  extendedChip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: radii.pill, backgroundColor: colors.panelAlt },
  extendedChipActive: { backgroundColor: colors.accent },
  extendedLabel: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.text },
  extendedLabelActive: { color: colors.accentText },
});
