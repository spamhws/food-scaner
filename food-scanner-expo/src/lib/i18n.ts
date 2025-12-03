import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getDeviceLanguage } from './utils/language';
import enTranslations from '../translations/en.json';
import ukTranslations from '../translations/uk.json';

// Map device language to supported app languages
function getAppLanguage(deviceLang: string): 'en' | 'uk' {
  // If device is Ukrainian, use Ukrainian
  if (deviceLang === 'uk') {
    return 'uk';
  }
  // Default to English for all other languages
  return 'en';
}

const deviceLang = getDeviceLanguage();
const appLanguage = getAppLanguage(deviceLang);

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3', // For React Native
    resources: {
      en: {
        translation: enTranslations,
      },
      uk: {
        translation: ukTranslations,
      },
    },
    lng: appLanguage, // Default language based on device
    fallbackLng: 'en', // Fallback to English if translation missing
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;

