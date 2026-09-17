import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, fonts, radii, spacing } from '../theme';
import { Icon, IconName } from './Icon';
import { DetectedWorkout } from '../data/healthSync';

type Props = {
  workout: DetectedWorkout | null;
  sportIcon: IconName;
  sportLabel: string;
  onConfirm: () => void;
  onDismiss: () => void;
  title: string;
  body: string; // template già interpolato da chi chiama (sport + minuti)
  confirmLabel: string;
  dismissLabel: string;
};

// Pop-up di conferma per la sincronizzazione passiva con lo smartwatch:
// "Abbiamo rilevato un allenamento di {sport} di {X} minuti. Vuoi associarlo
// alla tua scheda?" — mostrato quando useHealthWorkoutSync rileva una nuova
// sessione più recente dell'ultima già salvata.
export function HealthSyncConfirmModal({ workout, sportIcon, sportLabel, onConfirm, onDismiss, title, body, confirmLabel, dismissLabel }: Props) {
  return (
    <Modal visible={!!workout} transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onDismiss} />
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <Icon name={sportIcon} size={24} color={colors.accentText} />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{body}</Text>
          <Text style={styles.sportLabel}>{sportLabel}</Text>
          <View style={styles.buttons}>
            <Pressable onPress={onDismiss} style={styles.dismissBtn}>
              <Text style={styles.dismissLabel}>{dismissLabel}</Text>
            </Pressable>
            <Pressable onPress={onConfirm} style={styles.confirmBtn}>
              <Text style={styles.confirmLabel}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.overlay, padding: spacing.lg },
  card: { width: '100%', backgroundColor: colors.panel, borderRadius: radii.lg, padding: spacing.lg, alignItems: 'center' },
  iconWrap: {
    width: 48, height: 48, borderRadius: radii.md, backgroundColor: colors.accent,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md,
  },
  title: { fontFamily: fonts.heading, fontSize: 17, color: colors.text, textAlign: 'center', marginBottom: 6 },
  body: { fontFamily: fonts.body, fontSize: 13.5, color: colors.textMuted, textAlign: 'center', lineHeight: 19 },
  sportLabel: { fontFamily: fonts.bodySemiBold, fontSize: 13, color: colors.highlight, marginTop: spacing.sm },
  buttons: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg, width: '100%' },
  dismissBtn: { flex: 1, paddingVertical: 12, borderRadius: radii.pill, alignItems: 'center', backgroundColor: colors.panelAlt },
  dismissLabel: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: colors.textMuted },
  confirmBtn: { flex: 1, paddingVertical: 12, borderRadius: radii.pill, alignItems: 'center', backgroundColor: colors.accent },
  confirmLabel: { fontFamily: fonts.bodySemiBold, fontSize: 14, color: colors.accentText },
});
