import { LanguageCode, Locale, OptionDict } from './types';
import { it } from './locales/it';
import { en } from './locales/en';
import { es } from './locales/es';
import { fr } from './locales/fr';
import { ru } from './locales/ru';
import { zh } from './locales/zh';
import { ja } from './locales/ja';

export const LOCALES: Record<LanguageCode, Locale> = { it, en, es, fr, ru, zh, ja };

export const LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: 'it', label: 'Italiano' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'ru', label: 'Русский' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
];

export const DEFAULT_LANGUAGE: LanguageCode = 'it';

// Locale BCP-47 usato da Intl.DateTimeFormat per formattare date/orari nella lingua scelta.
export const INTL_LOCALE: Record<LanguageCode, string> = {
  it: 'it-IT', en: 'en-US', es: 'es-ES', fr: 'fr-FR', ru: 'ru-RU', zh: 'zh-CN', ja: 'ja-JP',
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

export type { LanguageCode, Locale, OptionDict };
