import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { colors, radii, spacing } from '../theme';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  onPress?: () => void;
  variant?: 'panel' | 'panelAlt' | 'accent';
};

export function Card({ children, style, onPress, variant = 'panel' }: Props) {
  const bg =
    variant === 'accent' ? colors.accent : variant === 'panelAlt' ? colors.panelAlt : colors.panel;
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.base, { backgroundColor: bg, opacity: pressed ? 0.85 : 1 }, style]}
      >
        {children}
      </Pressable>
    );
  }
  return <View style={[styles.base, { backgroundColor: bg }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.lg,
    padding: spacing.md,
  },
});
