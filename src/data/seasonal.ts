// Tag stagionali calcolati localmente dal mese corrente, senza alcun server:
// stesso risultato percepito ("l'app sembra sempre aggiornata") di una regola
// lato Cloud Function, ma zero infrastruttura da pagare o mantenere, e
// funziona anche offline.

import { Bilingual, Recipe } from './types';
import { bi } from './types';

export type Season = 'inverno' | 'primavera' | 'estate' | 'autunno';

const SEASON_BY_MONTH: Season[] = [
  'inverno', 'inverno', 'primavera', 'primavera', 'primavera', 'estate',
  'estate', 'estate', 'autunno', 'autunno', 'autunno', 'inverno',
];

export function currentSeason(date: Date = new Date()): Season {
  return SEASON_BY_MONTH[date.getMonth()];
}

export const SEASON_LABEL: Record<Season, Bilingual> = {
  inverno: bi('Inverno', 'Winter'),
  primavera: bi('Primavera', 'Spring'),
  estate: bi('Estate', 'Summer'),
  autunno: bi('Autunno', 'Fall'),
};

const SEASON_KEYWORDS: Record<Season, string[]> = {
  inverno: ['zucca', 'cavol', 'aranci', 'vellutata', 'minestrone', 'radicchio', 'castagn', 'agrum', 'porro'],
  primavera: ['asparag', 'piselli', 'fragol', 'carciof', 'fave', 'ravanell', 'fava'],
  estate: ['pomodor', 'zucchin', 'insalata', 'anguria', 'basilico', 'melanzan', 'peperon', 'bowl fredd', 'gazpacho'],
  autunno: ['zucca', 'fung', 'castagn', 'melograno', 'cavolfiore', 'porcini', 'uva'],
};

// Controllo per parole chiave sul nome, la cucina e gli ingredienti della
// ricetta: nessuna chiamata IA, nessun dato aggiuntivo da mantenere a mano.
export function isSeasonalRecipe(recipe: Recipe, season: Season): boolean {
  const haystack = [recipe.nome.it, recipe.cucina, ...recipe.ingredienti.map((i) => i.nome.it)]
    .join(' ')
    .toLowerCase();
  return SEASON_KEYWORDS[season].some((k) => haystack.includes(k));
}
