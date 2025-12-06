// translations/index.ts

import en from './en.json';
import uk from './uk.json';
import es from './es.json';
import zh from './zh.json';
import hi from './hi.json';
import ar from './ar.json';
import fr from './fr.json';
import de from './de.json';
import pt from './pt.json';
import id from './id.json';
import ja from './ja.json';
import ko from './ko.json';
import it from './it.json';
import pl from './pl.json';
import nl from './nl.json';
import tr from './tr.json';
import ro from './ro.json';
import sv from './sv.json';
import da from './da.json';
import cs from './cs.json';

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
