import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, fonts, radii, spacing } from '../theme';
import { WheelPicker } from './WheelPicker';

type Props<T> = {
  visible: boolean;
  title: string;
  data: T[];
  selectedIndex: number;
  labelExtractor: (item: T) => string;
  onCancel: () => void;
  onConfirm: (index: number) => void;
  cancelLabel?: string;
  confirmLabel?: string;
};

export function WheelPickerModal<T>({
  visible,
  title,
  data,
  selectedIndex,
  labelExtractor,
  onCancel,
  onConfirm,
  cancelLabel = 'Annulla',
  confirmLabel = 'Conferma',
}: Props<T>) {
  const [pendingIndex, setPendingIndex] = useState(selectedIndex);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />
        <View style={styles.sheet}>
          <View style={styles.headerRow}>
            <Pressable onPress={onCancel} hitSlop={8}>
              <Text style={styles.cancel}>{cancelLabel}</Text>
            </Pressable>
            <Text style={styles.title}>{title}</Text>
            <Pressable onPress={() => onConfirm(pendingIndex)} hitSlop={8}>
              <Text style={styles.confirm}>{confirmLabel}</Text>
            </Pressable>
          </View>
          <WheelPicker
            data={data}
            selectedIndex={selectedIndex}
            onChange={setPendingIndex}
            labelExtractor={labelExtractor}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.overlay,
  },
  sheet: {
    backgroundColor: colors.panel,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    paddingBottom: spacing.xl,
    paddingTop: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  title: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: colors.text,
  },
  cancel: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textMuted,
  },
  confirm: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: colors.highlight,
  },
});
