import { translations } from '../translations';

export function getAvailableLanguages() {
  return Object.entries(translations)
    .filter(([_, data]) => data._meta) // Only include languages with metadata
    .map(([code, data]) => ({
      code,
      name: data._meta.name,
      flag: data._meta.flag,
    }))
    .sort((a, b) => (a.code === 'en' ? -1 : b.code === 'en' ? 1 : a.name.localeCompare(b.name)));
}
