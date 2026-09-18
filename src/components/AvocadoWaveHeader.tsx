import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Rect, Path, Ellipse, Circle, Defs, ClipPath, G } from 'react-native-svg';
import { colors } from '../theme';

// Sfondo per gli header di sezione ispirato a una fetta di avocado: la buccia
// verde occupa la parte sinistra/bassa, la polpa gialla la fascia centrale e
// il nocciolo (marrone chiaro) affiora solo nell'angolo in alto a destra.
// Il bordo inferiore non è un semplice angolo arrotondato: è un'onda morbida
// che resta più corta vicino al contenuto a sinistra e scende più in basso
// verso destra. Buccia/polpa/nocciolo sono un'ellisse e un cerchio pieni —
// le forme tonde e concentriche di un vero avocado tagliato — invece di
// bande diagonali ad angoli vivi.
//
// L'header è un overlay sopra lo ScrollView: sotto la curva non deve essere
// disegnato nulla, cosi' il contenuto che scorre resta visibile fino a quel
// limite esatto e sparisce solo dove ci sono i pixel colorati. Per garantirlo
// in modo affidabile su tutte le piattaforme si usa un vero ClipPath SVG
// (non un fill trasparente sopra un rettangolo pieno, che lascerebbe il
// rettangolo di base visibile come un blocco squadrato): buccia/polpa/nocciolo
// vengono disegnati alla loro estensione naturale ma "ritagliati" dentro la
// sagoma dell'onda, quindi fuori da essa non c'e' letteralmente nulla da vedere.
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
        {/* Buccia: verde scuro, resta visibile come un bordo lungo tutto il perimetro */}
        <Rect x={0} y={0} width={400} height={220} fill={colors.waveSkin} />
        {/* Polpa: un'ellisse morbida, come la sezione interna di un avocado */}
        <Ellipse cx={270} cy={90} rx={150} ry={130} fill={colors.waveFlesh} />
        {/* Nocciolo: un cerchio pieno spostato dal centro, come in un avocado vero */}
        <Circle cx={345} cy={55} r={48} fill={colors.wavePit} />
      </G>
    </Svg>
  );
}
