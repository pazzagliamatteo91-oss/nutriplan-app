import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, radii } from '../theme';
import { toDateKey } from '../data/mealPlan';

type Props = {
  dates: string[]; // 'YYYY-MM-DD' dei giorni con allenamento registrato
  weekdayInitials: string[]; // 7 iniziali, da lunedì a domenica, nella lingua corrente
};

const CELL = 26;
const GAP = 6;

// Striscia compatta della settimana corrente (lunedì -> domenica, oggi incluso):
// una cella per giorno con l'iniziale sopra, piena se quel giorno ha un
// allenamento registrato, altrimenti appena visibile per non fare rumore
// visivo (invece della griglia "contribution graph" a 4 settimane, troppo
// grande e per lo più vuota).
export function ActivityGrid({ dates, weekdayInitials }: Props) {
  const set = new Set(dates);
  const today = new Date();
  const mondayOffset = (today.getDay() + 6) % 7; // 0 = lunedì
  const monday = new Date(today);
  monday.setDate(monday.getDate() - mondayOffset);

  const cells = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    const key = toDateKey(d);
    return { key, active: set.has(key), isToday: key === toDateKey(today), isFuture: d > today };
  });

  return (
    <View style={styles.row}>
      {cells.map((cell, i) => (
        <View key={cell.key} style={styles.dayColumn}>
          <Text style={[styles.dayInitial, cell.isToday && styles.dayInitialToday]}>{weekdayInitials[i]}</Text>
          <View
            style={[
              styles.cell,
              cell.active && styles.cellActive,
              cell.isToday && !cell.active && styles.cellToday,
              cell.isFuture && styles.cellFuture,
            ]}
          />
        </View>
      ))}
    </View>
  );
}

// Giorni consecutivi (fino a oggi o ieri) con un allenamento registrato.
export function computeStreak(dates: string[]): number {
  const set = new Set(dates);
  const today = new Date();
  let streak = 0;
  let cursor = new Date(today);
  // Se oggi non è ancora stato registrato, la serie parte comunque da ieri.
  if (!set.has(toDateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (set.has(toDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

// Conta le sessioni negli ultimi 7 giorni (oggi incluso) e nei 7 giorni precedenti,
// per confrontare la settimana corrente con quella passata (usato dall'anello di costanza).
export function computeWeeklyComparison(dates: string[]): { thisWeek: number; lastWeek: number } {
  const set = new Set(dates);
  const today = new Date();
  let thisWeek = 0;
  let lastWeek = 0;
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (!set.has(toDateKey(d))) continue;
    if (i < 7) thisWeek += 1;
    else lastWeek += 1;
  }
  return { thisWeek, lastWeek };
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: GAP },
  dayColumn: { alignItems: 'center', gap: 5 },
  dayInitial: { fontFamily: fonts.bodyMedium, fontSize: 10, color: colors.textFaint },
  dayInitialToday: { color: colors.highlight, fontFamily: fonts.bodySemiBold },
  cell: {
    width: CELL,
    height: CELL,
    borderRadius: radii.sm / 1.5,
    backgroundColor: colors.panelAlt,
    opacity: 0.5,
  },
  cellActive: { backgroundColor: colors.waveSkin, opacity: 1 },
  cellToday: { opacity: 0.5, borderWidth: 1.5, borderColor: colors.highlight },
  cellFuture: { opacity: 0.25 },
});
