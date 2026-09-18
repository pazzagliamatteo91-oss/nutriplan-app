import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Rect, Path, Ellipse, Circle, Defs, ClipPath, G } from 'react-native-svg';
import { colors } from '../theme';

// Sfondo per gli header di sezione ispirato a una fetta di avocado vera: un
//'unica curva morbida e continua (non più "a onde" con piccole increspature)
// disegna il bordo, come il profilo arrotondato di una fetta tagliata; dentro,
// buccia/polpa/nocciolo sono un'ellisse e un cerchio pieni — le stesse forme
// morbide e concentriche che si vedono tagliando un avocado vero — invece di
// bande diagonali ad angoli vivi.
//
// L'header è un overlay sopra lo ScrollView: sotto la curva non deve essere
// disegnato nulla, cosi' il contenuto che scorre resta visibile fino a quel
// limite esatto e sparisce solo dove ci sono i pixel colorati. Per garantirlo
// in modo affidabile su tutte le piattaforme si usa un vero ClipPath SVG
// (non un fill trasparente sopra un rettangolo pieno, che lascerebbe il
// rettangolo di base visibile come un blocco squadrato): buccia/polpa/nocciolo
// vengono disegnati alla loro estensione naturale ma "ritagliati" dentro la
// sagoma della curva, quindi fuori da essa non c'e' letteralmente nulla da vedere.
const AVOCADO_SILHOUETTE =
  'M0 0 L 400 0 L 400 90 C 400 150, 320 196, 220 196 C 120 196, 45 165, 0 105 Z';

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
          <Path d={AVOCADO_SILHOUETTE} />
        </ClipPath>
      </Defs>
      <G clipPath="url(#avocadoWaveClip)">
        {/* Buccia: verde scuro, resta visibile come un bordo lungo tutto il perimetro */}
        <Rect x={0} y={0} width={400} height={220} fill={colors.waveSkin} />
        {/* Polpa: un'ellisse morbida arretrata dal bordo, come la sezione interna di un avocado */}
        <Ellipse cx={185} cy={65} rx={205} ry={108} fill={colors.waveFlesh} />
        {/* Nocciolo: un cerchio pieno spostato dal centro, come in un avocado vero */}
        <Circle cx={300} cy={45} r={46} fill={colors.wavePit} />
      </G>
    </Svg>
  );
}
