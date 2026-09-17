import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors, fonts } from '../theme';

type Props = {
  outerPercent: number; // settimana corrente vs obiettivo (0-100+, capped a 100)
  innerPercent: number; // settimana scorsa vs obiettivo, per il confronto (0-100+, capped a 100)
  size?: number;
  centerLabel: string;
  centerSubLabel?: string;
};

const OUTER_STROKE = 12;
const INNER_STROKE = 10;
const RING_GAP = 5;

// Anello "Activity Ring" in stile app Salute di iPhone, con i colori
// dell'avocado: due cerchi concentrici con sfumatura verde->giallo (buccia
// verso polpa) per la settimana corrente e marrone->giallo (nocciolo verso
// polpa) per quella precedente, cosi' il confronto tra le due e' leggibile
// a colpo d'occhio come nelle vere Activity Rings, senza usare il rosso/
// verde/blu di Apple.
export function ConsistencyRing({ outerPercent, innerPercent, size = 100, centerLabel, centerSubLabel }: Props) {
  const outerRadius = (size - OUTER_STROKE) / 2;
  const innerRadius = outerRadius - OUTER_STROKE / 2 - RING_GAP - INNER_STROKE / 2;

  const outerCircumference = 2 * Math.PI * outerRadius;
  const innerCircumference = 2 * Math.PI * innerRadius;
  const outerClamped = Math.max(0, Math.min(100, outerPercent));
  const innerClamped = Math.max(0, Math.min(100, innerPercent));
  const outerOffset = outerCircumference * (1 - outerClamped / 100);
  const innerOffset = innerCircumference * (1 - innerClamped / 100);
  const center = size / 2;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <LinearGradient id="ringOuterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={colors.waveSkin} />
            <Stop offset="100%" stopColor={colors.waveFlesh} />
          </LinearGradient>
          <LinearGradient id="ringInnerGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={colors.wavePit} />
            <Stop offset="100%" stopColor={colors.waveFlesh} />
          </LinearGradient>
        </Defs>

        {/* Binari: tinta della stessa famiglia di colore invece del grigio neutro, come nelle Activity Ring reali. */}
        <Circle cx={center} cy={center} r={outerRadius} stroke={`${colors.waveSkin}33`} strokeWidth={OUTER_STROKE} fill="none" />
        <Circle cx={center} cy={center} r={innerRadius} stroke={`${colors.wavePit}33`} strokeWidth={INNER_STROKE} fill="none" />

        {/* Anello esterno: settimana corrente vs obiettivo. */}
        <Circle
          cx={center}
          cy={center}
          r={outerRadius}
          stroke="url(#ringOuterGradient)"
          strokeWidth={OUTER_STROKE}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${outerCircumference} ${outerCircumference}`}
          strokeDashoffset={outerOffset}
          rotation={-90}
          origin={`${center}, ${center}`}
        />
        {/* Anello interno: settimana precedente, per il confronto. */}
        <Circle
          cx={center}
          cy={center}
          r={innerRadius}
          stroke="url(#ringInnerGradient)"
          strokeWidth={INNER_STROKE}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${innerCircumference} ${innerCircumference}`}
          strokeDashoffset={innerOffset}
          rotation={-90}
          origin={`${center}, ${center}`}
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
  centerLabel: { fontFamily: fonts.headingBold, fontSize: 17, color: colors.text },
  centerSubLabel: { fontFamily: fonts.body, fontSize: 9.5, color: colors.textMuted },
});
