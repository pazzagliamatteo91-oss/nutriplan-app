import React from 'react';
import { View, Text, StyleSheet, Pressable, Linking, Platform } from 'react-native';
import { colors, fonts, radii, spacing } from '../theme';
import { Icon } from './Icon';
import { useApp } from '../context/AppContext';

type Props = { query: string };

// Sezione video: incorpora i risultati di ricerca YouTube per il nome della ricetta
// (nessuna API key richiesta, tramite l'endpoint embed di ricerca), più un link che apre
// la vera ricerca YouTube ordinata per numero di visualizzazioni.
export function RecipeVideoSection({ query }: Props) {
  const { t } = useApp();
  const searchQuery = encodeURIComponent(`${query} ricetta`);
  const embedUrl = `https://www.youtube.com/embed?listType=search&list=${searchQuery}`;
  // sp=CAMSAhAB corrisponde al filtro "Numero di visualizzazioni" di YouTube.
  const mostViewedUrl = `https://www.youtube.com/results?search_query=${searchQuery}&sp=CAMSAhAB`;

  return (
    <View>
      <View style={styles.videoWrap}>
        {Platform.OS === 'web' ? (
          <View style={styles.webFallback}>
            <Icon name="search" size={20} color={colors.textMuted} />
            <Text style={styles.webFallbackText}>{t('recipes.videoWebFallback')}</Text>
          </View>
        ) : (
          <LazyWebView uri={embedUrl} />
        )}
      </View>
      <Pressable style={styles.linkRow} onPress={() => Linking.openURL(mostViewedUrl)}>
        <Icon name="search" size={16} color={colors.accent} />
        <Text style={styles.linkText}>{t('recipes.mostViewedOnYoutube')}</Text>
        <Icon name="chevronRight" size={16} color={colors.textFaint} />
      </Pressable>
    </View>
  );
}

// Import differito: react-native-webview non ha una build web, evitiamo di
// caricarla quando la piattaforma è 'web' (gestita sopra col fallback).
function LazyWebView({ uri }: { uri: string }) {
  const { WebView } = require('react-native-webview');
  return <WebView style={styles.webview} source={{ uri }} allowsFullscreenVideo />;
}

const styles = StyleSheet.create({
  videoWrap: {
    height: 200,
    borderRadius: radii.lg,
    overflow: 'hidden',
    backgroundColor: colors.panel,
    marginBottom: spacing.sm,
  },
  webview: { flex: 1 },
  webFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  webFallbackText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 6,
  },
  linkText: {
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.accent,
  },
});
