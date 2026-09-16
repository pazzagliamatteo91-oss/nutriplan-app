import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { colors, fonts, radii, spacing } from '../theme';
import { Avatar } from '../components/Avatar';
import { Card } from '../components/Card';
import { Icon, IconName } from '../components/Icon';
import { useApp } from '../context/AppContext';
import { RECIPES } from '../data/recipes';
import { visibleRecipes } from '../data/recipeFilters';
import type { RootTabParamList } from '../navigation/types';

function formatToday() {
  const label = new Intl.DateTimeFormat('it-IT', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
  return label.charAt(0).toUpperCase() + label.slice(1);
}

type Tile = {
  key: keyof RootTabParamList;
  title: string;
  icon: IconName;
  stat: string;
};

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const { profile, shoppingItems, analysisValues, lastWorkoutLog } = useApp();

  const recipeCount = useMemo(() => visibleRecipes(RECIPES, profile, {}).length, [profile]);
  const shoppingRemaining = shoppingItems.filter((i) => !i.spuntato).length;
  const analysisFilled = analysisValues.filter((a) => a.valore !== null).length;
  const lastWorkoutLabel = lastWorkoutLog
    ? new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short' }).format(new Date(lastWorkoutLog))
    : 'Nessuna';

  const tiles: Tile[] = [
    { key: 'RicetteTab', title: 'Ricette', icon: 'recipes', stat: `${recipeCount} disponibili` },
    { key: 'SpesaTab', title: 'Spesa', icon: 'shopping', stat: `${shoppingRemaining} articoli in lista` },
    { key: 'AnalisiTab', title: 'Analisi', icon: 'analysis', stat: `${analysisFilled}/${analysisValues.length} valori inseriti` },
    { key: 'AllenamentoTab', title: 'Allenamento', icon: 'workout', stat: `Ultima: ${lastWorkoutLabel}` },
  ];

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.headerRow}>
          <Avatar uri={profile.avatarUri} iconName={profile.avatarIcon as any} size={52} />
          <View style={styles.headerText}>
            <Text style={styles.name}>{profile.nome}</Text>
            <Text style={styles.date}>{formatToday()}</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card variant="panelAlt" style={styles.notificationCard}>
          <View style={styles.notificationIcon}>
            <Icon name="bell" size={20} color={colors.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.notificationTitle}>Promemoria spesa</Text>
            <Text style={styles.notificationBody}>
              Hai impostato {profile.giornoSpesa} come giorno per fare la spesa.
            </Text>
          </View>
        </Card>

        <View style={styles.grid}>
          {tiles.map((tile) => (
            <Card key={tile.key} style={styles.tile} onPress={() => navigation.navigate(tile.key)}>
              <View style={styles.tileIcon}>
                <Icon name={tile.icon} size={22} color={colors.accent} />
              </View>
              <Text style={styles.tileTitle}>{tile.title}</Text>
              <Text style={styles.tileStat}>{tile.stat}</Text>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
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
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
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
