import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getDeviceLanguage } from './utils/language';
import { translations } from '../translations';

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

const resources = Object.entries(translations).reduce((acc, [code, translation]) => {
  acc[code] = { translation };
  return acc;
}, {} as Record<string, { translation: any }>);

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3', // For React Native
  resources,
  lng: appLanguage, // Default language based on device
  fallbackLng: 'en', // Fallback to English if translation missing
  interpolation: {
    escapeValue: false, // React already escapes values
  },
});

export default i18n;
