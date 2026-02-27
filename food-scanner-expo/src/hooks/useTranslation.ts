import { useTranslation as useI18nTranslation } from 'react-i18next';
import { saveLanguage } from '@/lib/storage/storage';

/**
 * Custom hook for translations
 * Wrapper around react-i18next's useTranslation
 */
export function useTranslation() {
  const { t, i18n } = useI18nTranslation();

  const changeLanguage = async (lang: string) => {
    // Await so the app finishes re-rendering with new language before we persist/navigate (avoids Android crash when options update during transition)
    await i18n.changeLanguage(lang);
    await saveLanguage(lang);
  };

  return {
    t,
    currentLanguage: i18n.language,
    changeLanguage,
  };
}
