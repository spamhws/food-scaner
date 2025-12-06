// Static imports for all FAQ files
import enFAQ from '@/translations/en/faq.json';
import ukFAQ from '@/translations/uk/faq.json';
import esFAQ from '@/translations/es/faq.json';
import zhFAQ from '@/translations/zh/faq.json';
import hiFAQ from '@/translations/hi/faq.json';
import arFAQ from '@/translations/ar/faq.json';
import frFAQ from '@/translations/fr/faq.json';
import deFAQ from '@/translations/de/faq.json';
import ptFAQ from '@/translations/pt/faq.json';
import idFAQ from '@/translations/id/faq.json';
import jaFAQ from '@/translations/ja/faq.json';
import koFAQ from '@/translations/ko/faq.json';
import itFAQ from '@/translations/it/faq.json';
import plFAQ from '@/translations/pl/faq.json';
import nlFAQ from '@/translations/nl/faq.json';
import trFAQ from '@/translations/tr/faq.json';
import roFAQ from '@/translations/ro/faq.json';
import svFAQ from '@/translations/sv/faq.json';
import daFAQ from '@/translations/da/faq.json';
import csFAQ from '@/translations/cs/faq.json';

// Static imports for all User Agreement files
import enUA from '@/translations/en/userAgreement.json';
import ukUA from '@/translations/uk/userAgreement.json';
import esUA from '@/translations/es/userAgreement.json';
import zhUA from '@/translations/zh/userAgreement.json';
import hiUA from '@/translations/hi/userAgreement.json';
import arUA from '@/translations/ar/userAgreement.json';
import frUA from '@/translations/fr/userAgreement.json';
import deUA from '@/translations/de/userAgreement.json';
import ptUA from '@/translations/pt/userAgreement.json';
import idUA from '@/translations/id/userAgreement.json';
import jaUA from '@/translations/ja/userAgreement.json';
import koUA from '@/translations/ko/userAgreement.json';
import itUA from '@/translations/it/userAgreement.json';
import plUA from '@/translations/pl/userAgreement.json';
import nlUA from '@/translations/nl/userAgreement.json';
import trUA from '@/translations/tr/userAgreement.json';
import roUA from '@/translations/ro/userAgreement.json';
import svUA from '@/translations/sv/userAgreement.json';
import daUA from '@/translations/da/userAgreement.json';
import csUA from '@/translations/cs/userAgreement.json';

// Static imports for all Privacy Policy files
import enPP from '@/translations/en/privacyPolicy.json';
import ukPP from '@/translations/uk/privacyPolicy.json';
import esPP from '@/translations/es/privacyPolicy.json';
import zhPP from '@/translations/zh/privacyPolicy.json';
import hiPP from '@/translations/hi/privacyPolicy.json';
import arPP from '@/translations/ar/privacyPolicy.json';
import frPP from '@/translations/fr/privacyPolicy.json';
import dePP from '@/translations/de/privacyPolicy.json';
import ptPP from '@/translations/pt/privacyPolicy.json';
import idPP from '@/translations/id/privacyPolicy.json';
import jaPP from '@/translations/ja/privacyPolicy.json';
import koPP from '@/translations/ko/privacyPolicy.json';
import itPP from '@/translations/it/privacyPolicy.json';
import plPP from '@/translations/pl/privacyPolicy.json';
import nlPP from '@/translations/nl/privacyPolicy.json';
import trPP from '@/translations/tr/privacyPolicy.json';
import roPP from '@/translations/ro/privacyPolicy.json';
import svPP from '@/translations/sv/privacyPolicy.json';
import daPP from '@/translations/da/privacyPolicy.json';
import csPP from '@/translations/cs/privacyPolicy.json';

// FAQ data mapping
export const faqDataMap: Record<string, typeof enFAQ> = {
  en: enFAQ,
  uk: ukFAQ,
  es: esFAQ,
  zh: zhFAQ,
  hi: hiFAQ,
  ar: arFAQ,
  fr: frFAQ,
  de: deFAQ,
  pt: ptFAQ,
  id: idFAQ,
  ja: jaFAQ,
  ko: koFAQ,
  it: itFAQ,
  pl: plFAQ,
  nl: nlFAQ,
  tr: trFAQ,
  ro: roFAQ,
  sv: svFAQ,
  da: daFAQ,
  cs: csFAQ,
};

// User Agreement data mapping
export const userAgreementDataMap: Record<string, typeof enUA> = {
  en: enUA,
  uk: ukUA,
  es: esUA,
  zh: zhUA,
  hi: hiUA,
  ar: arUA,
  fr: frUA,
  de: deUA,
  pt: ptUA,
  id: idUA,
  ja: jaUA,
  ko: koUA,
  it: itUA,
  pl: plUA,
  nl: nlUA,
  tr: trUA,
  ro: roUA,
  sv: svUA,
  da: daUA,
  cs: csUA,
};

// Privacy Policy data mapping
export const privacyPolicyDataMap: Record<string, typeof enPP> = {
  en: enPP,
  uk: ukPP,
  es: esPP,
  zh: zhPP,
  hi: hiPP,
  ar: arPP,
  fr: frPP,
  de: dePP,
  pt: ptPP,
  id: idPP,
  ja: jaPP,
  ko: koPP,
  it: itPP,
  pl: plPP,
  nl: nlPP,
  tr: trPP,
  ro: roPP,
  sv: svPP,
  da: daPP,
  cs: csPP,
};

// Helper functions to get data with fallback
export const getFAQData = (language: string) => {
  return faqDataMap[language] || faqDataMap.en;
};

export const getUserAgreementData = (language: string) => {
  return userAgreementDataMap[language] || userAgreementDataMap.en;
};

export const getPrivacyPolicyData = (language: string) => {
  return privacyPolicyDataMap[language] || privacyPolicyDataMap.en;
};
