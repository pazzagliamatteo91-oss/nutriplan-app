import { LanguageCode, Locale, OptionDict, Bilingual } from './types';
import { it } from './locales/it';
import { en } from './locales/en';

export const LOCALES: Record<LanguageCode, Locale> = { it, en };

export const LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: 'it', label: 'Italiano' },
  { code: 'en', label: 'English' },
];

export const DEFAULT_LANGUAGE: LanguageCode = 'it';

// Locale BCP-47 usato da Intl.DateTimeFormat per formattare date/orari nella lingua scelta.
export const INTL_LOCALE: Record<LanguageCode, string> = {
  it: 'it-IT', en: 'en-US',
};

function getPath(obj: any, path: string): unknown {
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) => (key in vars ? String(vars[key]) : `{${key}}`));
}

// t('recipes.title') oppure t('home.recipesAvailable', { count: 12 })
export function createTranslator(language: LanguageCode) {
  const locale = LOCALES[language] ?? LOCALES[DEFAULT_LANGUAGE];
  return function t(key: string, vars?: Record<string, string | number>): string {
    const value = getPath(locale, key);
    if (typeof value !== 'string') return key;
    return interpolate(value, vars);
  };
}

// Traduce la label di una voce di un elenco predefinito (cucine, allergie, ecc.)
// a partire dal suo id; se manca una traduzione ricade sull'id stesso.
export function translateOption(dict: OptionDict, id: string): string {
  return dict[id] ?? id;
}

// Estrae la stringa nella lingua corrente da un campo di contenuto bilingue.
export function pick(value: Bilingual, language: LanguageCode): string {
  return value[language] ?? value.it;
}

export type { LanguageCode, Locale, OptionDict, Bilingual };
