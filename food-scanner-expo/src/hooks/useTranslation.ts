import { useTranslation as useI18nTranslation } from 'react-i18next';
import { saveLanguage } from '@/lib/storage/storage';

/**
 * Custom hook for translations
 * Wrapper around react-i18next's useTranslation
 */
export function useTranslation() {
  const { t, i18n } = useI18nTranslation();

  const changeLanguage = async (lang: string) => {
    i18n.changeLanguage(lang);
    // Persist language preference to AsyncStorage
    await saveLanguage(lang);
  };

  return {
    t,
    currentLanguage: i18n.language,
    changeLanguage,
  };
}
