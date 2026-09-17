import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { colors, fonts, radii, spacing } from '../theme';
import { Avatar } from '../components/Avatar';
import { Card } from '../components/Card';
import { Icon, IconName } from '../components/Icon';
import { ColorIcon, ColorIconName } from '../components/ColorIcon';
import { ProgressBar } from '../components/ProgressBar';
import { DiaryEntryModal } from '../components/DiaryEntryModal';
import { AvocadoWaveHeader } from '../components/AvocadoWaveHeader';
import { useApp } from '../context/AppContext';
import { RECIPES } from '../data/recipes';
import { visibleRecipes } from '../data/recipeFilters';
import { MEAL_TYPES } from '../data/constants';
import { toDateKey } from '../data/mealPlan';
import { INTL_LOCALE, pick } from '../i18n';
import type { RootTabParamList } from '../navigation/types';

function formatToday(locale: string) {
  const label = new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
  return label.charAt(0).toUpperCase() + label.slice(1);
}

type Tile = {
  key: keyof RootTabParamList;
  title: string;
  icon: ColorIconName;
  stat: string;
};

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const { profile, shoppingItems, analysisValues, lastWorkoutLog, diaryEntries, removeDiaryEntry, language, t, locale } = useApp();
  const intlLocale = INTL_LOCALE[language] ?? 'it-IT';
  const [diaryModalOpen, setDiaryModalOpen] = useState(false);

  const today = toDateKey(new Date());
  const todayEntries = useMemo(() => diaryEntries.filter((e) => e.data === today), [diaryEntries, today]);
  const kcalToday = todayEntries.reduce((sum, e) => sum + e.kcal, 0);
  const proteinToday = todayEntries.reduce((sum, e) => sum + e.proteine, 0);

  const recipeCount = useMemo(() => visibleRecipes(RECIPES, profile, {}).length, [profile]);
  const shoppingRemaining = shoppingItems.filter((i) => !i.spuntato).length;
  const analysisFilled = analysisValues.filter((a) => a.valore !== null).length;
  const lastWorkoutLabel = lastWorkoutLog
    ? new Intl.DateTimeFormat(intlLocale, { day: 'numeric', month: 'short' }).format(new Date(lastWorkoutLog))
    : t('home.never');

  const tiles: Tile[] = [
    { key: 'RicetteTab', title: t('nav.recipes'), icon: 'recipes', stat: t('home.recipesAvailable', { count: recipeCount }) },
    { key: 'SpesaTab', title: t('nav.shopping'), icon: 'shopping', stat: t('home.itemsInList', { count: shoppingRemaining }) },
    { key: 'AnalisiTab', title: t('nav.analysis'), icon: 'analysis', stat: t('home.valuesEntered', { filled: analysisFilled, total: analysisValues.length }) },
    { key: 'AllenamentoTab', title: t('nav.workout'), icon: 'workout', stat: t('home.lastWorkout', { date: lastWorkoutLabel }) },
  ];

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <AvocadoWaveHeader />
        <View style={styles.headerRow}>
          <Avatar uri={profile.avatarUri} iconName={profile.avatarIcon as any} size={52} />
          <View style={styles.headerText}>
            <Text style={styles.name}>{profile.nome}</Text>
            <Text style={styles.date}>{formatToday(intlLocale)}</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card variant="panelAlt" style={styles.notificationCard}>
          <View style={styles.notificationIcon}>
            <Icon name="bell" size={20} color={colors.highlight} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.notificationTitle}>{t('home.shoppingReminderTitle')}</Text>
            <Text style={styles.notificationBody}>
              {t('home.shoppingReminderBody', { day: locale.weekdays[profile.giornoSpesa] ?? profile.giornoSpesa })}
            </Text>
          </View>
        </Card>

        <Card style={styles.diaryCard}>
          <View style={styles.diaryHeader}>
            <Text style={styles.diaryTitle}>{t('diary.title')}</Text>
            <Pressable style={styles.diaryAddBtn} onPress={() => setDiaryModalOpen(true)} hitSlop={8}>
              <Icon name="plus" size={16} color={colors.accentText} />
            </Pressable>
          </View>

          <View style={styles.diaryStatRow}>
            <Text style={styles.diaryStatLabel}>{t('diary.kcalLabel')}</Text>
            <Text style={styles.diaryStatValue}>{t('diary.ofGoal', { value: kcalToday, goal: profile.kcalGiorno })}</Text>
          </View>
          <ProgressBar value={kcalToday} max={profile.kcalGiorno} color={colors.highlight} />

          <View style={[styles.diaryStatRow, { marginTop: spacing.md }]}>
            <Text style={styles.diaryStatLabel}>{t('diary.proteinLabel')}</Text>
            <Text style={styles.diaryStatValue}>{t('diary.ofGoalGrams', { value: proteinToday, goal: profile.proteineGiorno })}</Text>
          </View>
          <ProgressBar value={proteinToday} max={profile.proteineGiorno} color={colors.success} />

          {todayEntries.length === 0 ? (
            <Text style={styles.diaryEmpty}>{t('diary.emptyToday')}</Text>
          ) : (
            <View style={styles.diaryList}>
              {todayEntries.map((entry) => {
                const icon: IconName = (MEAL_TYPES.find((m) => m.id === entry.pasto)?.icon as IconName) ?? 'leaf';
                return (
                  <View key={entry.id} style={styles.diaryRow}>
                    <Icon name={icon} size={15} color={colors.textMuted} />
                    <Text style={styles.diaryRowName} numberOfLines={1}>{pick(entry.nome, language)}</Text>
                    <Text style={styles.diaryRowKcal}>{entry.kcal} kcal</Text>
                    <Pressable onPress={() => removeDiaryEntry(entry.id)} hitSlop={8}>
                      <Icon name="close" size={14} color={colors.textFaint} />
                    </Pressable>
                  </View>
                );
              })}
            </View>
          )}
        </Card>

        <View style={styles.grid}>
          {tiles.map((tile) => (
            <Card key={tile.key} style={styles.tile} onPress={() => navigation.navigate(tile.key)}>
              <View style={styles.tileIcon}>
                <ColorIcon name={tile.icon} size={34} />
              </View>
              <Text style={styles.tileTitle}>{tile.title}</Text>
              <Text style={styles.tileStat}>{tile.stat}</Text>
            </Card>
          ))}
        </View>
      </ScrollView>

      <DiaryEntryModal visible={diaryModalOpen} onClose={() => setDiaryModalOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontFamily: fonts.headingBold,
    fontSize: 22,
    color: colors.accentText,
  },
  date: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.accentText,
    opacity: 0.75,
    marginTop: 2,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: colors.text,
    marginBottom: 2,
  },
  notificationBody: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
  },
  diaryCard: { marginBottom: spacing.lg },
  diaryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  diaryTitle: { fontFamily: fonts.heading, fontSize: 16, color: colors.text },
  diaryAddBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  diaryStatRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  diaryStatLabel: { fontFamily: fonts.bodyMedium, fontSize: 12.5, color: colors.textMuted },
  diaryStatValue: { fontFamily: fonts.bodySemiBold, fontSize: 12.5, color: colors.text },
  diaryEmpty: { fontFamily: fonts.body, fontSize: 12.5, color: colors.textFaint, marginTop: spacing.md, textAlign: 'center' },
  diaryList: { marginTop: spacing.md, gap: 2 },
  diaryRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border,
  },
  diaryRowName: { flex: 1, fontFamily: fonts.body, fontSize: 13, color: colors.text },
  diaryRowKcal: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.textMuted },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tile: {
    width: '48%',
    marginBottom: spacing.md,
    minHeight: 120,
  },
  tileIcon: {
    marginBottom: spacing.sm,
  },
  tileTitle: {
    fontFamily: fonts.heading,
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
  tileStat: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
  },
});
