import { getLocales } from 'expo-localization';

/**
 * Get device language code (e.g., 'en', 'uk', 'fr', 'de')
 * Returns 2-letter ISO 639-1 language code
 * Uses expo-localization to get the actual device language preference
 */
export function getDeviceLanguage(): string {
  try {
    // Use expo-localization to get device language preferences
    // This returns locales in order of user preference
    const locales = getLocales();

    if (locales && locales.length > 0) {
      const primaryLocale = locales[0];
      // languageCode is the 2-letter code (e.g., 'uk', 'en')
      const langCode =
        primaryLocale.languageCode?.toLowerCase() ||
        primaryLocale.languageTag?.split('-')[0].toLowerCase() ||
        'en';
      return langCode;
    }
  } catch (error) {
    // Fallback to Intl API if expo-localization fails
  }

  // Fallback to Intl API (returns region locale, not language preference)
  const locale = Intl.DateTimeFormat().resolvedOptions().locale || 'en';

  // Extract 2-letter language code (e.g., 'en-US' -> 'en', 'uk-UA' -> 'uk')
  const langCode = locale.split('-')[0].toLowerCase();

  return langCode;
}

/**
 * Get OpenFoodFacts language code
 * Maps device language to OpenFoodFacts language parameter
 */
export function getOpenFoodFactsLanguage(): string {
  return getDeviceLanguage();
}
