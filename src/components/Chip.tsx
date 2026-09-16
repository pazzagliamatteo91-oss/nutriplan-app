import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { colors, radii, spacing, fonts } from '../theme';
import { Icon } from './Icon';

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  onRemove?: () => void;
  tone?: 'default' | 'warning';
};

export function Chip({ label, selected, onPress, onRemove, tone = 'default' }: Props) {
  const isWarning = tone === 'warning';
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        selected && styles.chipSelected,
        isWarning && styles.chipWarning,
      ]}
    >
      <Text
        style={[
          styles.label,
          selected && styles.labelSelected,
          isWarning && styles.labelWarning,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
      {onRemove && (
        <Pressable onPress={onRemove} hitSlop={8} style={styles.removeBtn}>
          <Icon name="close" size={12} color={selected ? colors.accentText : colors.textMuted} />
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    backgroundColor: colors.panelAlt,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    gap: 6,
  },
  chipSelected: {
    backgroundColor: colors.accent,
  },
  chipWarning: {
    backgroundColor: colors.berrySoft,
  },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.text,
  },
  labelSelected: {
    color: colors.accentText,
  },
  labelWarning: {
    color: colors.berry,
  },
  removeBtn: {
    marginLeft: 2,
  },
});
