import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { colors, fonts, radii, spacing } from '../theme';
import { Icon } from './Icon';
import { Recipe, MealType } from '../data/types';
import { useApp } from '../context/AppContext';
import { pick } from '../i18n';

type Props = {
  visible: boolean;
  mealType: MealType;
  recipes: Recipe[];
  onSelect: (recipeId: string) => void;
  onClose: () => void;
};

export function RecipePickerModal({ visible, mealType, recipes, onSelect, onClose }: Props) {
  const { t, locale, language } = useApp();
  const mealLabel = locale.mealTypes[mealType] ?? mealType;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('recipes.pickForMeal', { meal: mealLabel.toLowerCase() })}</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Icon name="close" size={18} color={colors.textMuted} />
            </Pressable>
          </View>
          <FlatList
            data={recipes}
            keyExtractor={(r) => r.id}
            style={{ maxHeight: 420 }}
            ListEmptyComponent={
              <Text style={styles.empty}>{t('recipes.noRecipesForMeal')}</Text>
            }
            renderItem={({ item }) => (
              <Pressable style={styles.row} onPress={() => onSelect(item.id)}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name} numberOfLines={1}>{pick(item.nome, language)}</Text>
                  <Text style={styles.meta}>{item.tempoMinuti} min · {item.kcal} kcal</Text>
                </View>
                <Icon name="chevronRight" size={16} color={colors.textFaint} />
              </Pressable>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: colors.overlay },
  sheet: { backgroundColor: colors.panel, borderTopLeftRadius: radii.xl, borderTopRightRadius: radii.xl, padding: spacing.lg, paddingBottom: spacing.xxl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  title: { fontFamily: fonts.heading, fontSize: 17, color: colors.text },
  row: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border,
  },
  name: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.text, marginBottom: 2 },
  meta: { fontFamily: fonts.body, fontSize: 12, color: colors.textMuted },
  empty: { fontFamily: fonts.body, fontSize: 13, color: colors.textMuted, textAlign: 'center', paddingVertical: spacing.lg },
});
