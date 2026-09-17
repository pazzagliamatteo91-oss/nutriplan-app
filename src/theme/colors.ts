// Palette "avocado" chiara — sfondo bianco caldo, testi nei toni del verde che
// prima era lo sfondo, superfici cliccabili nel giallo della polpa di avocado.
export const colors = {
  background: '#FBF8EF', // sfondo bianco caldo
  panel: '#F1EDDC', // pannelli
  panelAlt: '#E7E1C9', // pannelli alternativi / hover
  text: '#4A5A43', // testo principale: il verde che era lo sfondo
  textMuted: '#71806A', // testo secondario: stessa famiglia, più chiaro
  textFaint: '#9CA894', // testo terziario/placeholder: ancora più chiaro
  accent: '#E2C94E', // giallo polpa d'avocado: superfici cliccabili/pillole/cerchi
  accentText: '#3A4734', // verde scuro: testo/icone sopra le superfici accento
  highlight: '#4C7A34', // verde vivo: link e stati attivi direttamente sullo sfondo
  berry: '#B14A3D', // avvisi
  berrySoft: 'rgba(177, 74, 61, 0.12)',
  border: 'rgba(74, 90, 67, 0.16)',
  overlay: 'rgba(24, 30, 18, 0.5)',
  white: '#FFFFFF',
  success: '#5C9C4A',
  warning: '#C97A2E',
  // Bande dell'header "sezione di avocado": buccia verde, polpa gialla, nocciolo.
  waveSkin: '#8FAE68',
  waveFlesh: '#E2C94E',
  wavePit: '#AD8A5E',
} as const;

export type ColorToken = keyof typeof colors;
