// Palette "avocado" — toni smorzati, non accesi.
export const colors = {
  background: '#4A5A43', // sfondo verde scuro
  panel: '#57684E', // pannelli
  panelAlt: '#63755A', // pannelli alternativi / hover
  text: '#F5F1E4', // testo crema
  textMuted: 'rgba(245, 241, 228, 0.68)',
  textFaint: 'rgba(245, 241, 228, 0.45)',
  accent: '#9DB56C', // verde avocado
  accentText: '#26311A', // testo scuro su accento
  berry: '#BD5B4F', // avvisi
  berrySoft: 'rgba(189, 91, 79, 0.18)',
  border: 'rgba(245, 241, 228, 0.12)',
  overlay: 'rgba(20, 26, 16, 0.55)',
  white: '#FFFFFF',
  success: '#7FA65A',
  warning: '#D9A441',
} as const;

export type ColorToken = keyof typeof colors;
