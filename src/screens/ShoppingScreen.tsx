import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { colors, fonts, radii, spacing } from '../theme';
import { ScreenHeader } from '../components/ScreenHeader';
import { Card } from '../components/Card';
import { Icon, IconName } from '../components/Icon';
import { Button } from '../components/Button';
import { PartnerSheet } from '../components/PartnerSheet';
import { useApp } from '../context/AppContext';
import { SHOPPING_CATEGORIES, WEEKDAYS } from '../data/constants';
import { ShoppingScale } from '../data/shopping';

const SCALE_OPTIONS: { id: ShoppingScale; label: string; icon: IconName }[] = [
  { id: 'giorno', label: 'Giorno', icon: 'calendarDay' },
  { id: 'settimana', label: 'Settimana', icon: 'calendarWeek' },
  { id: 'mese', label: 'Mese', icon: 'calendarMonth' },
];

export function ShoppingScreen() {
  const { profile, updateProfile, shoppingScale, setShoppingScale, shoppingItems, toggleShoppingItem } = useApp();
  const [partnerSheetOpen, setPartnerSheetOpen] = useState(false);

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Spesa" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Intervallo</Text>
        <View style={styles.scaleRow}>
          {SCALE_OPTIONS.map((opt) => {
            const active = shoppingScale === opt.id;
            return (
              <Pressable key={opt.id} style={[styles.scaleBtn, active && styles.scaleBtnActive]} onPress={() => setShoppingScale(opt.id)}>
                <Icon name={opt.icon} size={16} color={active ? colors.accentText : colors.textMuted} />
                <Text style={[styles.scaleLabel, active && styles.scaleLabelActive]}>{opt.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Giorno spesa e promemoria</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysScroll}>
          {WEEKDAYS.map((day) => {
            const active = profile.giornoSpesa === day;
            return (
              <Pressable key={day} style={[styles.dayChip, active && styles.dayChipActive]} onPress={() => updateProfile({ giornoSpesa: day })}>
                <Text style={[styles.dayLabel, active && styles.dayLabelActive]}>{day}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
        <View style={styles.reminderNote}>
          <Icon name="bell" size={14} color={colors.accent} />
          <Text style={styles.reminderText}>Promemoria attivo per {profile.giornoSpesa}</Text>
        </View>

        {SHOPPING_CATEGORIES.map((cat) => {
          const items = shoppingItems.filter((i) => i.categoria === cat.id);
          if (items.length === 0) return null;
          return (
            <View key={cat.id} style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                <Icon name={cat.icon} size={18} color={colors.accent} />
                <Text style={styles.categoryTitle}>{cat.label}</Text>
              </View>
              <Card style={styles.categoryCard}>
                {items.map((item, idx) => (
                  <Pressable
                    key={item.id}
                    onPress={() => toggleShoppingItem(item.id)}
                    style={[styles.itemRow, idx === items.length - 1 && { borderBottomWidth: 0 }]}
                  >
                    <View style={[styles.checkbox, item.spuntato && styles.checkboxChecked]}>
                      {item.spuntato && <Icon name="check" size={12} color={colors.accentText} />}
                    </View>
                    <Text style={[styles.itemName, item.spuntato && styles.itemNameChecked]}>{item.nome}</Text>
                    <Text style={styles.itemQty}>{item.quantita}</Text>
                  </Pressable>
                ))}
              </Card>
            </View>
          );
        })}

        <Button
          label="Salva lista"
          variant="secondary"
          onPress={() => Alert.alert('Lista salvata', 'La tua lista della spesa è stata salvata.')}
          style={{ marginBottom: spacing.md }}
        />
        <Button label="Esporta lista intera al supermercato" onPress={() => setPartnerSheetOpen(true)} style={{ marginBottom: spacing.xxl }} />
      </ScrollView>

      <PartnerSheet visible={partnerSheetOpen} title="Esporta lista su" onClose={() => setPartnerSheetOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  label: { fontFamily: fonts.bodySemiBold, fontSize: 12, color: colors.textMuted, textTransform: 'uppercase', marginBottom: spacing.sm },
  scaleRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  scaleBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 10, borderRadius: radii.md, backgroundColor: colors.panel,
  },
  scaleBtnActive: { backgroundColor: colors.accent },
  scaleLabel: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.textMuted },
  scaleLabelActive: { color: colors.accentText },
  daysScroll: { marginBottom: spacing.sm },
  dayChip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: radii.pill, backgroundColor: colors.panel, marginRight: spacing.sm },
  dayChipActive: { backgroundColor: colors.accent },
  dayLabel: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.textMuted },
  dayLabelActive: { color: colors.accentText },
  reminderNote: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.lg },
  reminderText: { fontFamily: fonts.body, fontSize: 12, color: colors.textMuted },
  categorySection: { marginBottom: spacing.lg },
  categoryHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  categoryTitle: { fontFamily: fonts.heading, fontSize: 16, color: colors.text },
  categoryCard: { paddingVertical: 4 },
  itemRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border,
  },
  checkbox: {
    width: 20, height: 20, borderRadius: 6, borderWidth: 1.5, borderColor: colors.textMuted,
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: colors.accent, borderColor: colors.accent },
  itemName: { flex: 1, fontFamily: fonts.body, fontSize: 14, color: colors.text },
  itemNameChecked: { color: colors.textFaint, textDecorationLine: 'line-through' },
  itemQty: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.textMuted },
});
