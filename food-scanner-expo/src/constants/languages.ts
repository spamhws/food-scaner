import { translations } from '../translations';

// Language popularity order (most popular first)
const LANGUAGE_POPULARITY_ORDER = [
  'en', // English - most popular
  'es', // Spanish
  'zh', // Chinese
  'hi', // Hindi
  'ar', // Arabic
  'fr', // French
  'de', // German
  'pt', // Portuguese
  'id', // Indonesian
  'ja', // Japanese
  'ko', // Korean
  'it', // Italian
  'pl', // Polish
  'nl', // Dutch
  'tr', // Turkish
  'uk', // Ukrainian
  'ro', // Romanian
  'sv', // Swedish
  'da', // Danish
  'cs', // Czech
];

function getPopularityIndex(code: string): number {
  const index = LANGUAGE_POPULARITY_ORDER.indexOf(code);
  return index === -1 ? 999 : index; // Unknown languages go to the end
}

export function getAvailableLanguages() {
  return Object.entries(translations)
    .filter(([_, data]) => data._meta) // Only include languages with metadata
    .map(([code, data]) => ({
      code,
      name: data._meta.name,
      flag: data._meta.flag,
    }))
    .sort((a, b) => {
      const aIndex = getPopularityIndex(a.code);
      const bIndex = getPopularityIndex(b.code);
      if (aIndex !== bIndex) {
        return aIndex - bIndex;
      }
      // If same popularity, sort alphabetically by name
      return a.name.localeCompare(b.name);
    });
}

/**
 * Get the locale string for a given language code
 * Falls back to the language code itself if locale is not available
 */
export function getLocaleForLanguage(languageCode: string): string {
  const translation = translations[languageCode as keyof typeof translations];
  if (translation?._meta?.locale) {
    return translation._meta.locale;
  }
  // Fallback to language code if locale not found
  return languageCode;
}
