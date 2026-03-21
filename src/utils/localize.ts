import * as en from '../locales/en.json';

const translations: Record<string, Record<string, Record<string, string>>> = {
  en: en as Record<string, Record<string, string>>,
};

let loadedLanguages: Set<string> = new Set(['en']);

async function loadLanguage(lang: string): Promise<void> {
  if (loadedLanguages.has(lang)) return;

  try {
    const module = await import(`../locales/${lang}.json`);
    translations[lang] = module.default || module;
    loadedLanguages.add(lang);
  } catch {
    // Language not available, fall back to English
  }
}

export function localize(key: string, lang: string = 'en'): string {
  // Try to load language async (will be available on next render)
  if (!loadedLanguages.has(lang)) {
    loadLanguage(lang);
  }

  const parts = key.split('.');
  if (parts.length !== 2) return key;

  const [section, field] = parts;

  // Try requested language first, then fall back to English
  const langTranslations = translations[lang];
  if (langTranslations?.[section]?.[field]) {
    return langTranslations[section][field];
  }

  const enTranslations = translations.en;
  if (enTranslations?.[section]?.[field]) {
    return enTranslations[section][field];
  }

  return key;
}
