import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getDeviceLanguage } from './utils/language';
import { translations, SUPPORTED_LANGS, AppLanguage } from '../translations';
import { getSavedLanguage } from './storage/storage';

function normalize(lang: string) {
  return lang.split('-')[0].toLowerCase();
}

function getAppLanguage(deviceLang: string): AppLanguage {
  const lang = normalize(deviceLang);

  if (SUPPORTED_LANGS.includes(lang as AppLanguage)) {
    return lang as AppLanguage;
  }

  return 'en';
}

async function getInitialLanguage(): Promise<AppLanguage> {
  // First, try to load saved language preference
  const savedLanguage = await getSavedLanguage();
  if (savedLanguage && SUPPORTED_LANGS.includes(savedLanguage as AppLanguage)) {
    return savedLanguage as AppLanguage;
  }

  // If no saved preference, use device language
  const deviceLang = getDeviceLanguage();
  return getAppLanguage(deviceLang);
}

// Build resources for i18next
const resources = Object.fromEntries(
  Object.entries(translations).map(([code, translation]) => [code, { translation }])
);

// Initialize with default language (will be updated after loading saved preference)
const deviceLang = getDeviceLanguage();
const defaultLanguage = getAppLanguage(deviceLang);

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources,
  lng: defaultLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

// Load saved language preference and update i18n if different
getInitialLanguage().then((language) => {
  if (language !== i18n.language) {
    i18n.changeLanguage(language);
  }
});

export default i18n;
