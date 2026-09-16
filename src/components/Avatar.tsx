import React from 'react';
import { View, Image, StyleSheet, Pressable } from 'react-native';
import { colors } from '../theme';
import { Icon, IconName } from './Icon';

type Props = {
  uri?: string | null;
  iconName?: IconName | null;
  size?: number;
  onPress?: () => void;
  editable?: boolean;
};

export function Avatar({ uri, iconName, size = 48, onPress, editable }: Props) {
  const dim = { width: size, height: size, borderRadius: size / 2 };
  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <View style={[styles.circle, dim]}>
        {uri ? (
          <Image source={{ uri }} style={dim} />
        ) : (
          <Icon name={iconName ?? 'avatarPlaceholder'} size={size * 0.6} color={colors.text} />
        )}
      </View>
      {editable && (
        <View style={styles.editBadge}>
          <Icon name="camera" size={12} color={colors.accentText} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: colors.panelAlt,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  editBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    backgroundColor: colors.accent,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
});
