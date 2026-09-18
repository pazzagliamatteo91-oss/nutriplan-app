import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Rect, Path, Circle, Defs, ClipPath, RadialGradient, Stop, G } from 'react-native-svg';
import { colors } from '../theme';

// Sfondo per gli header di sezione ispirato a una fetta di avocado: la buccia
// verde occupa la parte sinistra/bassa, la polpa gialla la fascia centrale e
// il nocciolo (marrone chiaro) affiora solo nell'angolo in alto a destra.
// Il bordo inferiore non è un semplice angolo arrotondato: è un'onda morbida
// che resta più corta vicino al contenuto a sinistra e scende più in basso
// verso destra.
//
// La buccia non è una forma indipendente: la polpa è lo stesso identico
// profilo dell'onda esterna, semplicemente rimpicciolito e riposizionato
// (scale + translate) per stare arretrato di un margine costante. Essendo
// la stessa curva, ha garantito lo stesso identico "ritmo" del bordo —
// non un'approssimazione — come la buccia vera di un avocado che segue
// il profilo della polpa sottostante restando più sottile.
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
        <RadialGradient id="avocadoPitGradient" cx="35%" cy="32%" r="72%">
          <Stop offset="0%" stopColor="#E8CBA0" />
          <Stop offset="100%" stopColor={colors.wavePit} />
        </RadialGradient>
      </Defs>
      <G clipPath="url(#avocadoWaveClip)">
        {/* Buccia: verde scuro, resta visibile come un bordo lungo tutto il perimetro */}
        <Rect x={0} y={0} width={400} height={220} fill={colors.waveSkin} />
        {/* Polpa: stessa curva dell'onda esterna, rimpicciolita e arretrata di un
            margine costante — stessa sinuosità, garantita perché è la stessa forma */}
        <Path d={WAVE_SILHOUETTE} fill={colors.waveFlesh} transform="translate(24,24) scale(0.88,0.7273)" />
        {/* Nocciolo: un cerchio con una leggera sfumatura, come in un avocado vero */}
        <Circle cx={325} cy={60} r={46} fill="url(#avocadoPitGradient)" />
      </G>
    </Svg>
  );
}
