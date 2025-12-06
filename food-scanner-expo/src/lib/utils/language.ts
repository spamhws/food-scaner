/**
 * Get device language code (e.g., 'en', 'uk', 'fr', 'de')
 * Returns 2-letter ISO 639-1 language code
 * Uses Intl API which is available in React Native
 */
export function getDeviceLanguage(): string {
  // Get device locale using Intl API (works in React Native)
  const locale = Intl.DateTimeFormat().resolvedOptions().locale || 'en';

  // Extract 2-letter language code (e.g., 'en-US' -> 'en', 'uk-UA' -> 'uk')
  const langCode = locale.split('-')[0].toLowerCase();

  // OpenFoodFacts supports many languages
  // Common ones: en, fr, de, es, it, pt, nl, pl, uk, ru, cs, sk, hu, ro, bg, etc.
  // If language not explicitly supported, OpenFoodFacts will fallback to English
  // So we can return any valid ISO 639-1 code and let the API handle it
  return langCode;
}

/**
 * Get OpenFoodFacts language code
 * Maps device language to OpenFoodFacts language parameter
 */
export function getOpenFoodFactsLanguage(): string {
  return getDeviceLanguage();
}
