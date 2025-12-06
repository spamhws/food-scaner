import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getDeviceLanguage } from './utils/language';
import { translations, SUPPORTED_LANGS, AppLanguage } from '../translations';

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

const deviceLang = getDeviceLanguage();
const appLanguage = getAppLanguage(deviceLang);

// Build resources for i18next
const resources = Object.fromEntries(
  Object.entries(translations).map(([code, translation]) => [
    code,
    { translation },
  ]),
);

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources,
  lng: appLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;