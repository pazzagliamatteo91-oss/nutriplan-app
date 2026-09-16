import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { colors, fonts, radii, spacing } from '../theme';
import { Icon } from './Icon';
import { SUPERMARKET_PARTNERS } from '../data/constants';
import { useApp } from '../context/AppContext';

type Props = {
  visible: boolean;
  title: string;
  onClose: () => void;
};

// L'export verso i partner è simulato: in produzione da collegare alle rispettive API
// (Esselunga a Casa, Carrefour, Amazon Fresh).
export function PartnerSheet({ visible, title, onClose }: Props) {
  const { t } = useApp();
  const handleSelect = (label: string) => {
    onClose();
    Alert.alert(t('partnerSheet.exportedTitle'), t('partnerSheet.exportedBody', { label }));
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <Text style={styles.title}>{title}</Text>
          {SUPERMARKET_PARTNERS.map((p) => (
            <Pressable key={p.id} style={styles.row} onPress={() => handleSelect(p.label)}>
              <View style={styles.iconWrap}>
                <Icon name="cart" size={18} color={colors.accentText} />
              </View>
              <Text style={styles.label}>{p.label}</Text>
              <Icon name="chevronRight" size={16} color={colors.textMuted} />
            </Pressable>
          ))}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: colors.overlay },
  sheet: { backgroundColor: colors.panel, borderTopLeftRadius: radii.xl, borderTopRightRadius: radii.xl, padding: spacing.lg, paddingBottom: spacing.xxl },
  title: { fontFamily: fonts.heading, fontSize: 17, color: colors.text, marginBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: 12 },
  iconWrap: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  label: { flex: 1, fontFamily: fonts.bodyMedium, fontSize: 15, color: colors.text },
});
