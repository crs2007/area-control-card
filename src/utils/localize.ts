import en from '../locales/en.json';
import he from '../locales/he.json';

type Translations = Record<string, Record<string, string>>;

// All locales are bundled statically: Rollup cannot resolve variable dynamic imports,
// and the files are tiny. To add a language, import it here and register it below.
export const translations: Record<string, Translations> = { en, he };

function resolveLanguage(lang: string): string {
  const normalized = (lang || 'en').toLowerCase().replace('_', '-');
  if (translations[normalized]) return normalized;
  const base = normalized.split('-')[0];
  return translations[base] ? base : 'en';
}

export function localize(key: string, lang = 'en'): string {
  const parts = key.split('.');
  if (parts.length !== 2) return key;
  const [section, field] = parts;

  return (
    translations[resolveLanguage(lang)]?.[section]?.[field] ??
    translations.en?.[section]?.[field] ??
    key
  );
}
