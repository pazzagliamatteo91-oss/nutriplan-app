import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radii } from '../theme';
import { toDateKey } from '../data/mealPlan';

type Props = {
  dates: string[]; // 'YYYY-MM-DD' dei giorni con allenamento registrato
  days?: number; // quanti giorni mostrare, terminando oggi
};

const CELL = 12;
const GAP = 4;

// Griglia stile "contribution graph": una cella per ciascuno degli ultimi `days`
// giorni, colorata se quel giorno è presente in `dates`. Le colonne sono settimane
// (7 righe), lette da sinistra (più vecchia) a destra (più recente).
export function ActivityGrid({ dates, days = 28 }: Props) {
  const set = new Set(dates);
  const cells: { key: string; active: boolean }[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = toDateKey(d);
    cells.push({ key, active: set.has(key) });
  }

  const columns: { key: string; active: boolean }[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    columns.push(cells.slice(i, i + 7));
  }

  return (
    <View style={styles.row}>
      {columns.map((col, ci) => (
        <View key={ci} style={styles.column}>
          {col.map((cell) => (
            <View key={cell.key} style={[styles.cell, cell.active && styles.cellActive]} />
          ))}
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
  column: { gap: GAP },
  cell: { width: CELL, height: CELL, borderRadius: radii.sm / 3, backgroundColor: colors.panelAlt },
  cellActive: { backgroundColor: colors.accent },
});
