import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Rect, Path } from 'react-native-svg';
import { colors } from '../theme';

// Sfondo per gli header di sezione ispirato a una fetta di avocado: la buccia
// verde occupa la parte sinistra/bassa, la polpa gialla la fascia centrale e
// il nocciolo (marrone chiaro) affiora solo nell'angolo in alto a destra.
// Le due divisioni sono curve (bezier), non linee rette, e scendono da
// sinistra verso il basso a destra.
export function AvocadoWaveHeader() {
  return (
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 400 140"
      preserveAspectRatio="xMidYMid slice"
      style={StyleSheet.absoluteFill}
    >
      <Rect x={0} y={0} width={400} height={140} fill={colors.waveSkin} />
      <Path
        d="M210 0 C 260 24.5, 175 49, 235 77 C 275 94.5, 250 115.5, 290 140 L 400 140 L 400 0 Z"
        fill={colors.waveFlesh}
      />
      <Path
        d="M320 0 C 355 12.6, 300 28, 345 45.5 C 365 54.6, 358 63, 400 66.5 L 400 0 Z"
        fill={colors.wavePit}
      />
    </Svg>
  );
}
