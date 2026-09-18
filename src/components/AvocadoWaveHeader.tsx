import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Rect, Path, Ellipse, Circle, Defs, ClipPath, RadialGradient, Stop, G } from 'react-native-svg';
import { colors } from '../theme';

// Sfondo per gli header di sezione ispirato a una fetta di avocado: l'area
// colorata scende ben oltre il titolo, con un bordo inferiore a onda morbida
// e ampia (non un semplice angolo arrotondato) — un'unica valle dolce che
// attraversa tutta la larghezza, come tracciato a mano dall'utente.
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
  'M0 0 L 400 0 L 400 165 C 350 185, 250 195, 190 193 C 130 191, 70 175, 0 150 Z';

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
        <RadialGradient id="avocadoPitGradient" cx="35%" cy="32%" r="72%">
          <Stop offset="0%" stopColor="#E8CBA0" />
          <Stop offset="100%" stopColor={colors.wavePit} />
        </RadialGradient>
      </Defs>
      <G clipPath="url(#avocadoWaveClip)">
        {/* Buccia: verde scuro, resta visibile come un bordo lungo tutto il perimetro */}
        <Rect x={0} y={0} width={400} height={220} fill={colors.waveSkin} />
        {/* Polpa: un'ellisse morbida, come la sezione interna di un avocado */}
        <Ellipse cx={200} cy={110} rx={215} ry={135} fill={colors.waveFlesh} />
        {/* Nocciolo: un cerchio con una leggera sfumatura, come in un avocado vero */}
        <Circle cx={310} cy={68} r={48} fill="url(#avocadoPitGradient)" />
      </G>
    </Svg>
  );
}
