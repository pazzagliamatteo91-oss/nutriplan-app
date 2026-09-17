import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Rect, Path, Defs, ClipPath, G } from 'react-native-svg';
import { colors } from '../theme';

// Sfondo per gli header di sezione ispirato a una fetta di avocado: la buccia
// verde occupa la parte sinistra/bassa, la polpa gialla la fascia centrale e
// il nocciolo (marrone chiaro) affiora solo nell'angolo in alto a destra.
// Il bordo inferiore non è un semplice angolo arrotondato: è un'onda morbida
// che resta più corta vicino al contenuto a sinistra e scende più in basso
// verso destra.
//
// L'header è un overlay sopra lo ScrollView: sotto la curva non deve essere
// disegnato nulla, cosi' il contenuto che scorre resta visibile fino a quel
// limite esatto e sparisce solo dove ci sono i pixel colorati. Per garantirlo
// in modo affidabile su tutte le piattaforme si usa un vero ClipPath SVG
// (non un fill trasparente sopra un rettangolo pieno, che lascerebbe il
// rettangolo di base visibile come un blocco squadrato): il verde/giallo/
// marrone vengono disegnati alla loro estensione naturale ma "ritagliati"
// dentro la sagoma dell'onda, quindi fuori da essa non c'e' letteralmente
// nulla da vedere.
const WAVE_SILHOUETTE =
  'M0 0 L 400 0 L 400 176 C 395 175, 390 174, 380 172 C 320 160, 260 142, 190 130 C 130 120, 70 95, 0 85 Z';

export function AvocadoWaveHeader() {
  return (
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 400 220"
      preserveAspectRatio="none"
      style={StyleSheet.absoluteFill}
    >
      <Defs>
        <ClipPath id="avocadoWaveClip">
          <Path d={WAVE_SILHOUETTE} />
        </ClipPath>
      </Defs>
      <G clipPath="url(#avocadoWaveClip)">
        <Rect x={0} y={0} width={400} height={220} fill={colors.waveSkin} />
        <Path
          d="M210 0 C 260 38.5, 175 77, 235 121 C 275 148.5, 250 181.5, 290 220 L 400 220 L 400 0 Z"
          fill={colors.waveFlesh}
        />
        <Path
          d="M320 0 C 355 19.8, 300 44, 345 71.5 C 365 85.8, 358 99, 400 104.5 L 400 0 Z"
          fill={colors.wavePit}
        />
      </G>
    </Svg>
  );
}
