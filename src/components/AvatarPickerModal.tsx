import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors, fonts, radii, spacing } from '../theme';
import { Icon, IconName } from './Icon';

const PRESET_ICONS: IconName[] = ['leaf', 'flame', 'apple', 'fish', 'sun', 'moon'];

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelectIcon: (icon: IconName) => void;
  onSelectPhoto: (uri: string) => void;
};

export function AvatarPickerModal({ visible, onClose, onSelectIcon, onSelectPhoto }: Props) {
  const pickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      onSelectPhoto(result.assets[0].uri);
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <Text style={styles.title}>Scegli avatar</Text>
          <Pressable style={styles.photoRow} onPress={pickPhoto}>
            <View style={styles.photoIcon}>
              <Icon name="camera" size={20} color={colors.accentText} />
            </View>
            <Text style={styles.photoLabel}>Carica una foto</Text>
          </Pressable>
          <Text style={styles.subtitle}>Oppure scegli un'icona</Text>
          <View style={styles.iconGrid}>
            {PRESET_ICONS.map((icon) => (
              <Pressable
                key={icon}
                style={styles.iconOption}
                onPress={() => {
                  onSelectIcon(icon);
                  onClose();
                }}
              >
                <Icon name={icon} size={26} color={colors.text} />
              </Pressable>
            ))}
          </View>
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
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: colors.text,
    marginBottom: spacing.md,
  },
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.panelAlt,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  photoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.text,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  iconOption: {
    width: 52,
    height: 52,
    borderRadius: radii.md,
    backgroundColor: colors.panelAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
