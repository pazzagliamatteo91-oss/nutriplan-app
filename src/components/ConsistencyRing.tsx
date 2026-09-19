import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

export type RingDatum = {
  percent: number; // 0-100+, viene troncato internamente a 100
  color: string;
};

type Props = {
  rings: RingDatum[]; // dal più esterno al più interno
  size?: number;
  strokeWidth?: number;
  gap?: number;
};

// Activity Ring in stile app Salute di iPhone: anelli concentrici a tinta
// piena (non sfumati) e senza alcuna scritta sovrapposta al centro — i
// numeri stanno nella legenda accanto, come nell'originale Apple.
export function ConsistencyRing({ rings, size = 100, strokeWidth = 11, gap = 4 }: Props) {
  const center = size / 2;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {rings.map((ring, i) => {
          const radius = center - strokeWidth / 2 - i * (strokeWidth + gap);
          const circumference = 2 * Math.PI * radius;
          const clamped = Math.max(0, Math.min(100, ring.percent));
          const offset = circumference * (1 - clamped / 100);
          return (
            <React.Fragment key={i}>
              <Circle cx={center} cy={center} r={radius} stroke={`${ring.color}33`} strokeWidth={strokeWidth} fill="none" />
              <Circle
                cx={center}
                cy={center}
                r={radius}
                stroke={ring.color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={offset}
                rotation={-90}
                origin={`${center}, ${center}`}
              />
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}
