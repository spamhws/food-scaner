// translations/index.ts

import en from './en/translations.json';
import uk from './uk/translations.json';
import es from './es/translations.json';
import zh from './zh/translations.json';
import hi from './hi/translations.json';
import ar from './ar/translations.json';
import fr from './fr/translations.json';
import de from './de/translations.json';
import pt from './pt/translations.json';
import id from './id/translations.json';
import ja from './ja/translations.json';
import ko from './ko/translations.json';
import it from './it/translations.json';
import pl from './pl/translations.json';
import nl from './nl/translations.json';
import tr from './tr/translations.json';
import ro from './ro/translations.json';
import sv from './sv/translations.json';
import da from './da/translations.json';
import cs from './cs/translations.json';

export const translations = {
  en,
  uk,
  es,
  zh,
  hi,
  ar,
  fr,
  de,
  pt,
  id,
  ja,
  ko,
  it,
  pl,
  nl,
  tr,
  ro,
  sv,
  da,
  cs,
} as const;

export type AppLanguage = keyof typeof translations;

export const SUPPORTED_LANGS = Object.keys(translations) as AppLanguage[];
