import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, fonts } from '../theme';

type Props = {
  percent: number; // 0-100+, percentuale di riempimento dell'anello (capped a 100)
  ringColor: string;
  size?: number;
  strokeWidth?: number;
  centerLabel: string;
  centerSubLabel?: string;
};

// Anello di progresso circolare in stile "Activity Ring" (app Salute di iPhone):
// usato per mostrare quanto ci si e' avvicinati all'obiettivo settimanale per
// lo sport selezionato.
export function ConsistencyRing({ percent, ringColor, size = 84, strokeWidth = 9, centerLabel, centerSubLabel }: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, percent));
  const dashOffset = circumference * (1 - clamped / 100);

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.panelAlt}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dashOffset}
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.center} pointerEvents="none">
        <Text style={styles.centerLabel}>{centerLabel}</Text>
        {centerSubLabel ? <Text style={styles.centerSubLabel}>{centerSubLabel}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  centerLabel: { fontFamily: fonts.headingBold, fontSize: 16, color: colors.text },
  centerSubLabel: { fontFamily: fonts.body, fontSize: 10, color: colors.textMuted },
});
