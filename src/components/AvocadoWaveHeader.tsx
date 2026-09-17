import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Rect, Path } from 'react-native-svg';
import { colors } from '../theme';

// Sfondo per gli header di sezione ispirato a una fetta di avocado: la buccia
// verde occupa la parte sinistra/bassa, la polpa gialla la fascia centrale e
// il nocciolo (marrone chiaro) affiora solo nell'angolo in alto a destra.
// Il bordo inferiore non è un semplice angolo arrotondato: è un'onda che
// resta più corta vicino al contenuto a sinistra e scende più in basso verso
// destra. Il ritaglio sotto l'onda è TRASPARENTE (non del colore di sfondo):
// l'header è un overlay sopra lo ScrollView, quindi solo i pixel colorati
// restano fissi in cima, mentre il contenuto sottostante è visibile ovunque
// la forma non sia colorata — il bordo dello scroll segue quindi esattamente
// la curva verde/gialla, non un rettangolo.
export function AvocadoWaveHeader() {
  return (
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 400 220"
      preserveAspectRatio="none"
      style={StyleSheet.absoluteFill}
    >
      <Rect x={0} y={0} width={400} height={220} fill={colors.waveSkin} />
      <Path
        d="M210 0 C 260 38.5, 175 77, 235 121 C 275 148.5, 250 181.5, 290 220 L 400 220 L 400 0 Z"
        fill={colors.waveFlesh}
      />
      <Path
        d="M320 0 C 355 19.8, 300 44, 345 71.5 C 365 85.8, 358 99, 400 104.5 L 400 0 Z"
        fill={colors.wavePit}
      />
      <Path
        d="M0 85 C 70 95, 130 120, 190 130 C 260 142, 320 160, 380 172 C 390 174, 395 175, 400 176 L 400 220 L 0 220 Z"
        fill="transparent"
      />
    </Svg>
  );
}
