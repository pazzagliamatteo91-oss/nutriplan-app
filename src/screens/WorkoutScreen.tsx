import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, radii, spacing } from '../theme';
import { Card } from '../components/Card';
import { Chip } from '../components/Chip';
import { Icon, IconName } from '../components/Icon';
import { Button } from '../components/Button';
import { useApp } from '../context/AppContext';
import { MAIN_SPORTS, EXTENDED_SPORTS, DEVICE_TYPES, WEEKDAYS } from '../data/constants';
import { WORKOUT_LEVELS, SPORT_ICONS, LEVEL_WEEKLY_GOAL, specificoLabel, supportoLabel, generateWeekPlan, getSessionExercises } from '../data/workouts';
import { WorkoutLevel } from '../data/types';
import { sportDisplayName } from '../data/constants';
import { pick } from '../i18n';
import { ActivityGrid, computeStreak, computeWeeklyComparison } from '../components/ActivityGrid';
import { ConsistencyRing } from '../components/ConsistencyRing';
import { HealthSyncConfirmModal } from '../components/HealthSyncConfirmModal';
import { useHealthWorkoutSync } from '../hooks/useHealthWorkoutSync';

type SessionKind = 'specifico' | 'supporto';

const HEADER_HEIGHT = 52;

export function WorkoutScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = insets.top + HEADER_HEIGHT;
  const { profile, updateProfile, workoutSelection, setWorkoutSelection, workoutLog, lastWorkoutLog, logWorkoutToday, t, locale, language } = useApp();
  const weekdayInitials = useMemo(() => WEEKDAYS.map((d) => (locale.weekdays[d] ?? d).charAt(0).toUpperCase()), [locale]);
  const sportLabel = (sportId: string) => pick(sportDisplayName(sportId), language);
  const [extendedOpen, setExtendedOpen] = useState(false);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [dayTab, setDayTab] = useState<Record<string, SessionKind>>({});
  const { sportId, livello } = workoutSelection;

  // Costanza calcolata sullo sport attualmente selezionato: cambiando sport
  // l'anello e la serie di giorni consecutivi si aggiornano di conseguenza.
  const sportDates = useMemo(() => workoutLog.filter((e) => e.sportId === sportId).map((e) => e.data), [workoutLog, sportId]);
  const streak = useMemo(() => computeStreak(sportDates), [sportDates]);
  const { thisWeek, lastWeek } = useMemo(() => computeWeeklyComparison(sportDates), [sportDates]);
  const weeklyGoal = LEVEL_WEEKLY_GOAL[livello];
  const outerRingPercent = weeklyGoal > 0 ? (thisWeek / weeklyGoal) * 100 : 0;
  const innerRingPercent = weeklyGoal > 0 ? (lastWeek / weeklyGoal) * 100 : 0;
  const trendLabel = useMemo(() => {
    if (lastWeek === 0 && thisWeek === 0) return t('workout.vsLastWeekNone');
    if (lastWeek === 0) return t('workout.vsLastWeekNew');
    const delta = Math.round(((thisWeek - lastWeek) / lastWeek) * 100);
    if (delta > 0) return t('workout.vsLastWeekUp', { n: delta });
    if (delta < 0) return t('workout.vsLastWeekDown', { n: delta });
    return t('workout.vsLastWeekSame');
  }, [thisWeek, lastWeek, t]);
  const trendColor = thisWeek > lastWeek ? colors.highlight : thisWeek < lastWeek ? colors.warning : colors.textMuted;

  const weekPlan = useMemo(() => generateWeekPlan(sportId, livello), [sportId, livello]);
  const specificoEsercizi = useMemo(() => getSessionExercises(sportId, livello, 'Specifico'), [sportId, livello]);
  const supportoEsercizi = useMemo(() => getSessionExercises(sportId, livello, 'Supporto'), [sportId, livello]);
  const icon: IconName = SPORT_ICONS[sportId] ?? 'workout';

  // Sincronizzazione passiva con lo smartwatch (premium): non fa nulla finché
  // i pacchetti nativi HealthKit/Health Connect non sono installati in una
  // dev build (vedi src/data/healthSync.ts) — sicuro da tenere attivo anche
  // su Expo Go, dove isHealthSyncAvailable() è sempre false.
  const { pendingWorkout, dismissPendingWorkout } = useHealthWorkoutSync(lastWorkoutLog);
  const confirmDetectedWorkout = () => {
    if (!pendingWorkout) return;
    logWorkoutToday(pendingWorkout.sportId);
    dismissPendingWorkout();
  };

  const setSport = (id: string) => setWorkoutSelection({ sportId: id, livello });
  const setLevel = (l: WorkoutLevel) => setWorkoutSelection({ sportId, livello: l });

  const anyDeviceConnected = Object.values(profile.dispositivi).some(Boolean);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: headerHeight + spacing.lg }]} showsVerticalScrollIndicator={false}>
        <Card style={styles.consistencyCard}>
          <View style={styles.consistencyHeader}>
            <Text style={styles.consistencyTitle}>{t('workout.consistencyTitle')}</Text>
            {streak > 0 && (
              <View style={styles.streakPill}>
                <Icon name="flame" size={13} color={colors.highlight} />
                <Text style={styles.streakLabel}>{t(streak === 1 ? 'workout.streakLabelOne' : 'workout.streakLabel', { n: streak })}</Text>
              </View>
            )}
          </View>
          <View style={styles.consistencyBody}>
            <ConsistencyRing
              outerPercent={outerRingPercent}
              innerPercent={innerRingPercent}
              centerLabel={`${thisWeek}/${weeklyGoal}`}
              centerSubLabel={t('workout.thisWeekLabel')}
            />
            <View style={styles.consistencyInfo}>
              <Text style={[styles.trendLabel, { color: trendColor }]}>{trendLabel}</Text>
              <View style={styles.ringLegendRow}>
                <View style={styles.ringLegendItem}>
                  <View style={[styles.ringLegendDot, { backgroundColor: colors.waveSkin }]} />
                  <Text style={styles.ringLegendLabel}>{t('workout.legendThisWeek', { n: thisWeek })}</Text>
                </View>
                <View style={styles.ringLegendItem}>
                  <View style={[styles.ringLegendDot, { backgroundColor: colors.wavePit }]} />
                  <Text style={styles.ringLegendLabel}>{t('workout.legendLastWeek', { n: lastWeek })}</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.weekStripWrap}>
            <ActivityGrid dates={sportDates} weekdayInitials={weekdayInitials} />
          </View>
        </Card>

        <Text style={styles.label}>{t('workout.sport')}</Text>
        <View style={styles.sportGrid}>
          {MAIN_SPORTS.map((s) => {
            const active = sportId === s.id;
            return (
              <Pressable key={s.id} style={[styles.sportChip, active && styles.sportChipActive]} onPress={() => setSport(s.id)}>
                <Icon name={SPORT_ICONS[s.id]} size={20} color={active ? colors.accentText : colors.text} />
                <Text style={[styles.sportLabel, active && styles.sportLabelActive]} numberOfLines={1}>
                  {locale.mainSports[s.id] ?? s.label}
                </Text>
              </Pressable>
            );
          })}
          <Pressable style={styles.sportChip} onPress={() => setExtendedOpen(true)}>
            <Icon name="moreDots" size={20} color={colors.text} />
            <Text style={styles.sportLabel} numberOfLines={1}>{t('workout.other')}</Text>
          </Pressable>
        </View>
        {!MAIN_SPORTS.some((s) => s.id === sportId) && (
          <Text style={styles.currentExtended}>{t('workout.selectedDiscipline', { sport: sportLabel(sportId) })}</Text>
        )}

        <Text style={styles.label}>{t('workout.level')}</Text>
        <View style={styles.levelRow}>
          {WORKOUT_LEVELS.map((l) => (
            <Chip key={l} label={locale.workoutLevels[l] ?? l} selected={livello === l} onPress={() => setLevel(l)} />
          ))}
        </View>

        <View style={styles.sessionRow}>
          <View style={styles.heroCard}>
            <LinearGradient
              colors={[colors.highlight, '#26381F']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.heroOverlay} />
            <View style={styles.heroIconBadge}>
              <Icon name={icon} size={18} color={colors.white} />
            </View>
            <View style={styles.heroTextWrap}>
              <Text style={styles.heroCount}>{t('workout.exerciseCount', { n: specificoEsercizi.length })}</Text>
              <Text style={styles.heroTitle}>{t('workout.specific')}</Text>
              <Text style={styles.heroSubtitle} numberOfLines={1}>{pick(specificoLabel(sportId), language)}</Text>
            </View>
          </View>
          <View style={styles.heroCard}>
            <LinearGradient
              colors={[colors.wavePit, '#4A331F']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.heroOverlay} />
            <View style={styles.heroIconBadge}>
              <Icon name="gym" size={18} color={colors.white} />
            </View>
            <View style={styles.heroTextWrap}>
              <Text style={styles.heroCount}>{t('workout.exerciseCount', { n: supportoEsercizi.length })}</Text>
              <Text style={styles.heroTitle}>{t('workout.support')}</Text>
              <Text style={styles.heroSubtitle} numberOfLines={1}>{pick(supportoLabel(sportId), language)}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>{t('workout.weekPlanTitle', { sport: sportLabel(sportId), level: locale.workoutLevels[livello] ?? livello })}</Text>
        <Text style={styles.sectionSubtitle}>{t('workout.weekPlanSubtitle')}</Text>
        <Card style={styles.weekCard}>
          {weekPlan.map((day, idx) => {
            const isExpanded = expandedDay === day.giorno;
            const activeTab = dayTab[day.giorno] ?? 'specifico';
            const session = activeTab === 'specifico' ? day.specifico : day.supporto;
            return (
              <View key={day.giorno} style={[styles.dayBlock, idx === weekPlan.length - 1 && { borderBottomWidth: 0 }]}>
                <Pressable
                  style={styles.dayRow}
                  disabled={day.isRiposo}
                  onPress={() => setExpandedDay((prev) => (prev === day.giorno ? null : day.giorno))}
                >
                  <Text style={styles.dayName}>{locale.weekdays[day.giorno] ?? day.giorno}</Text>
                  {day.isRiposo ? (
                    <View style={styles.dayInfo}>
                      <Text style={[styles.dayType, { color: colors.textFaint }]}>{t('workout.rest')}</Text>
                      <Text style={styles.dayDesc}>{t('workout.restDescription')}</Text>
                    </View>
                  ) : (
                    <View style={styles.dayContent}>
                      <View style={styles.dayToggle}>
                        <Pressable
                          style={[styles.dayToggleBtn, activeTab === 'specifico' && styles.dayToggleBtnActive]}
                          onPress={() => setDayTab((prev) => ({ ...prev, [day.giorno]: 'specifico' }))}
                        >
                          <Text style={[styles.dayToggleLabel, activeTab === 'specifico' && styles.dayToggleLabelActive]}>{t('workout.specific')}</Text>
                        </Pressable>
                        <Pressable
                          style={[styles.dayToggleBtn, activeTab === 'supporto' && styles.dayToggleBtnActive]}
                          onPress={() => setDayTab((prev) => ({ ...prev, [day.giorno]: 'supporto' }))}
                        >
                          <Text style={[styles.dayToggleLabel, activeTab === 'supporto' && styles.dayToggleLabelActive]}>{t('workout.support')}</Text>
                        </Pressable>
                      </View>
                      <View style={styles.dayContentRight}>
                        <Text style={styles.dayDuration}>{session.durataMinuti} min</Text>
                        <Icon name={isExpanded ? 'chevronDown' : 'chevronRight'} size={16} color={colors.textFaint} />
                      </View>
                    </View>
                  )}
                </Pressable>
                {isExpanded && !day.isRiposo && (
                  <View style={styles.dayExercises}>
                    {session.esercizi.map((ex, idx) => (
                      <View key={idx} style={styles.exerciseRow}>
                        <Text style={styles.exerciseName}>{pick(ex.nome, language)}</Text>
                        <Text style={styles.exerciseDettaglio}>{pick(ex.dettaglio, language)}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </Card>

        <Button
          label={lastWorkoutLog ? t('workout.logAnother') : t('workout.logToday')}
          variant="secondary"
          onPress={() => logWorkoutToday(sportId)}
          style={{ marginBottom: spacing.lg }}
        />

        <Text style={styles.label}>{t('workout.connectedDevices')}</Text>
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
                  {connected ? t('workout.connected') : t('workout.notConnected')}
                </Text>
              </Pressable>
            );
          })}
        </Card>

        {anyDeviceConnected && (
          <Card variant="panelAlt" style={styles.suggestionCard}>
            <Icon name="flame" size={18} color={colors.highlight} />
            <View style={{ flex: 1 }}>
              <Text style={styles.suggestionTitle}>{t('workout.suggestionTitle')}</Text>
              <Text style={styles.suggestionText}>{t('workout.suggestionBody')}</Text>
            </View>
          </Card>
        )}
      </ScrollView>

      <View style={[styles.header, { height: headerHeight }]}>
        <View style={[styles.headerRow, { marginTop: insets.top }]}>
          <Text style={styles.headerTitle}>{t('workout.title')}</Text>
        </View>
      </View>

      <Modal visible={extendedOpen} transparent animationType="slide" onRequestClose={() => setExtendedOpen(false)}>
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setExtendedOpen(false)} />
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>{t('workout.otherDisciplinesTitle')}</Text>
            <ScrollView style={{ maxHeight: 420 }}>
              <View style={styles.extendedGrid}>
                {EXTENDED_SPORTS.map((s) => (
                  <Pressable
                    key={s.id}
                    style={[styles.extendedChip, sportId === s.id && styles.extendedChipActive]}
                    onPress={() => {
                      setSport(s.id);
                      setExtendedOpen(false);
                    }}
                  >
                    <Text style={[styles.extendedLabel, sportId === s.id && styles.extendedLabelActive]}>
                      {language === 'it' ? s.it : s.en}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <HealthSyncConfirmModal
        workout={pendingWorkout}
        sportIcon={pendingWorkout ? SPORT_ICONS[pendingWorkout.sportId] ?? 'workout' : 'workout'}
        sportLabel={pendingWorkout ? sportLabel(pendingWorkout.sportId) : ''}
        title={t('workout.healthSyncTitle')}
        body={pendingWorkout ? t('workout.healthSyncBody', { minutes: pendingWorkout.durationMinutes }) : ''}
        confirmLabel={t('workout.healthSyncConfirm')}
        dismissLabel={t('workout.healthSyncDismiss')}
        onConfirm={confirmDetectedWorkout}
        onDismiss={dismissPendingWorkout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    zIndex: 10,
  },
  headerRow: { paddingHorizontal: spacing.lg, justifyContent: 'center', flex: 1 },
  headerTitle: { fontFamily: fonts.headingBold, fontSize: 22, color: colors.text },
  label: { fontFamily: fonts.bodySemiBold, fontSize: 12, color: colors.textMuted, textTransform: 'uppercase', marginBottom: spacing.sm },
  consistencyCard: { marginBottom: spacing.lg },
  consistencyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  consistencyTitle: { fontFamily: fonts.heading, fontSize: 15, color: colors.text },
  streakPill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.panelAlt, paddingVertical: 4, paddingHorizontal: 10, borderRadius: radii.pill },
  streakLabel: { fontFamily: fonts.bodySemiBold, fontSize: 11.5, color: colors.highlight },
  consistencyBody: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  consistencyInfo: { flex: 1, gap: spacing.sm },
  weekStripWrap: { marginTop: spacing.lg, alignItems: 'center' },
  trendLabel: { fontFamily: fonts.bodySemiBold, fontSize: 12.5 },
  ringLegendRow: { flexDirection: 'row', gap: spacing.md },
  ringLegendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  ringLegendDot: { width: 8, height: 8, borderRadius: 4 },
  ringLegendLabel: { fontFamily: fonts.body, fontSize: 11.5, color: colors.textMuted },
  sportGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  sportChip: {
    width: '31%',
    height: 78,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 4,
    borderRadius: radii.md,
    backgroundColor: colors.panel,
  },
  sportChipActive: { backgroundColor: colors.accent },
  sportLabel: { fontFamily: fonts.bodyMedium, fontSize: 12.5, color: colors.text, textAlign: 'center' },
  sportLabelActive: { color: colors.accentText, fontFamily: fonts.bodySemiBold },
  currentExtended: { fontFamily: fonts.body, fontSize: 12, color: colors.highlight, marginBottom: spacing.md },
  levelRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.lg },
  sessionRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  heroCard: {
    flex: 1,
    height: 168,
    borderRadius: radii.lg,
    overflow: 'hidden',
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  heroOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)' },
  heroIconBadge: {
    width: 34, height: 34, borderRadius: radii.sm,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  heroTextWrap: { gap: 2 },
  heroCount: { fontFamily: fonts.bodySemiBold, fontSize: 11, color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', letterSpacing: 0.3 },
  heroTitle: { fontFamily: fonts.headingBold, fontSize: 19, color: colors.white },
  heroSubtitle: { fontFamily: fonts.body, fontSize: 12.5, color: 'rgba(255,255,255,0.8)' },
  sectionTitle: { fontFamily: fonts.heading, fontSize: 16, color: colors.text, marginBottom: 2 },
  sectionSubtitle: { fontFamily: fonts.body, fontSize: 12, color: colors.textFaint, marginBottom: spacing.sm },
  weekCard: { marginBottom: spacing.lg, paddingVertical: 4 },
  dayBlock: {
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border,
  },
  dayRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: spacing.sm,
  },
  dayName: { width: 70, fontFamily: fonts.bodySemiBold, fontSize: 13, color: colors.text },
  dayInfo: { flex: 1 },
  dayType: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.highlight },
  dayDesc: { fontFamily: fonts.body, fontSize: 12, color: colors.textMuted },
  dayContent: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  dayToggle: { flexDirection: 'row', backgroundColor: colors.background, borderRadius: radii.pill, padding: 2 },
  dayToggleBtn: { paddingVertical: 5, paddingHorizontal: 9, borderRadius: radii.pill },
  dayToggleBtnActive: { backgroundColor: colors.accent },
  dayToggleLabel: { fontFamily: fonts.bodyMedium, fontSize: 11, color: colors.textMuted },
  dayToggleLabelActive: { color: colors.accentText },
  dayContentRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dayDuration: { fontFamily: fonts.body, fontSize: 12, color: colors.textFaint },
  dayExercises: { paddingBottom: spacing.sm, paddingLeft: 70 + spacing.sm },
  exerciseRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4,
  },
  exerciseName: { flex: 1, fontFamily: fonts.body, fontSize: 12, color: colors.text, marginRight: spacing.sm },
  exerciseDettaglio: { fontFamily: fonts.bodySemiBold, fontSize: 12, color: colors.highlight },
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
