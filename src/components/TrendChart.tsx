import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Path, Circle, Line } from 'react-native-svg';
import { colors, fonts } from '../theme';

export type TrendPoint = { data: string; valore: number };

type Props = {
  points: TrendPoint[]; // ordine cronologico crescente
  rangeMin: number;
  rangeMax: number;
  endpointColor: string;
  compact?: boolean;
  width?: number;
  unit?: string;
  dateFormatter?: (iso: string) => string;
};

const BAND_FILL = 'rgba(143, 174, 104, 0.18)';
const LINE_COLOR = 'rgba(74, 90, 67, 0.55)';

// Grafico di andamento leggero (nessuna libreria esterna): una linea che collega
// le letture storiche, una banda che evidenzia il range di normalità e un punto
// finale colorato secondo lo stato corrente (basso/normale/alto).
export function TrendChart({ points, rangeMin, rangeMax, endpointColor, compact = false, width, unit, dateFormatter }: Props) {
  const chartWidth = width ?? (compact ? 68 : 280);
  const chartHeight = compact ? 28 : 108;
  const padX = compact ? 3 : 6;
  const padY = compact ? 3 : 8;

  const values = points.map((p) => p.valore);
  let yMin = values.length ? Math.min(rangeMin, ...values) : rangeMin;
  let yMax = values.length ? Math.max(rangeMax, ...values) : rangeMax;
  const span = yMax - yMin || 1;
  yMin -= span * 0.12;
  yMax += span * 0.12;

  const scaleX = (index: number) => {
    if (points.length <= 1) return chartWidth / 2;
    return padX + (index / (points.length - 1)) * (chartWidth - padX * 2);
  };
  const scaleY = (value: number) => padY + (1 - (value - yMin) / (yMax - yMin || 1)) * (chartHeight - padY * 2);

  const bandY1 = scaleY(rangeMax);
  const bandY2 = scaleY(rangeMin);
  const linePath = points.length >= 2 ? points.map((p, i) => `${i === 0 ? 'M' : 'L'}${scaleX(i)},${scaleY(p.valore)}`).join(' ') : null;
  const last = points[points.length - 1];

  const chart = (
    <Svg width={chartWidth} height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
      <Rect x={0} y={bandY1} width={chartWidth} height={Math.max(1, bandY2 - bandY1)} fill={BAND_FILL} />
      {points.length === 0 && (
        <Line x1={padX} y1={chartHeight / 2} x2={chartWidth - padX} y2={chartHeight / 2} stroke={colors.textFaint} strokeWidth={1.5} strokeDasharray="3,4" />
      )}
      {linePath && <Path d={linePath} stroke={LINE_COLOR} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />}
      {last && <Circle cx={scaleX(points.length - 1)} cy={scaleY(last.valore)} r={compact ? 3 : 4.5} fill={endpointColor} stroke={colors.background} strokeWidth={2} />}
    </Svg>
  );

  if (compact) return chart;

  const fmtDate = dateFormatter ?? ((d: string) => d);

  return (
    <View>
      <View style={styles.row}>
        <View style={styles.yLabels}>
          <Text style={styles.yLabel}>{formatValue(yMax)}{unit ? ` ${unit}` : ''}</Text>
          <Text style={styles.yLabel}>{formatValue(yMin)}{unit ? ` ${unit}` : ''}</Text>
        </View>
        <View style={{ flex: 1 }}>{chart}</View>
      </View>
      {points.length > 0 && (
        <View style={[styles.row, { justifyContent: 'space-between', paddingLeft: 0 }]}>
          <Text style={styles.xLabel}>{fmtDate(points[0].data)}</Text>
          <Text style={styles.xLabel}>{fmtDate(points[points.length - 1].data)}</Text>
        </View>
      )}
    </View>
  );
}

function formatValue(v: number): string {
  return Math.round(v * 10) / 10 + '';
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'stretch' },
  yLabels: { justifyContent: 'space-between', marginRight: 8, width: 52 },
  yLabel: { fontFamily: fonts.body, fontSize: 10, color: colors.textFaint, textAlign: 'right' },
  xLabel: { fontFamily: fonts.body, fontSize: 10, color: colors.textFaint, marginTop: 4 },
});
