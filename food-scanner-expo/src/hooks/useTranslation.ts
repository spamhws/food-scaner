import { useTranslation as useI18nTranslation } from 'react-i18next';

/**
 * Custom hook for translations
 * Wrapper around react-i18next's useTranslation
 */
export function useTranslation() {
  const { t, i18n } = useI18nTranslation();

  const changeLanguage = (lang: 'en' | 'uk') => {
    i18n.changeLanguage(lang);
  };

  return {
    t,
    currentLanguage: i18n.language as 'en' | 'uk',
    changeLanguage,
  };
}

