import { colors } from './colors';

// Fraunces per i titoli (serif), Inter per il corpo testo/UI.
export const fonts = {
  heading: 'Fraunces_600SemiBold',
  headingBold: 'Fraunces_700Bold',
  headingItalic: 'Fraunces_500Medium_Italic',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
} as const;

export const type = {
  h1: { fontFamily: fonts.headingBold, fontSize: 30, color: colors.text, letterSpacing: -0.3 },
  h2: { fontFamily: fonts.heading, fontSize: 24, color: colors.text, letterSpacing: -0.2 },
  h3: { fontFamily: fonts.heading, fontSize: 19, color: colors.text },
  body: { fontFamily: fonts.body, fontSize: 15, color: colors.text },
  bodyMuted: { fontFamily: fonts.body, fontSize: 14, color: colors.textMuted },
  label: { fontFamily: fonts.bodySemiBold, fontSize: 12, color: colors.textMuted, letterSpacing: 0.4 },
  caption: { fontFamily: fonts.body, fontSize: 12, color: colors.textFaint },
  button: { fontFamily: fonts.bodySemiBold, fontSize: 15, color: colors.accentText },
} as const;
