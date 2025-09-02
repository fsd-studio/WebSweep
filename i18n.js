import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import deCommon from './public/locales/de/common.json';
import deNav from './public/locales/de/nav.json';
import enCommon from './public/locales/en/common.json';
import enNav from './public/locales/en/nav.json';
import huCommon from './public/locales/hu/common.json';
import huNav from './public/locales/hu/nav.json';

const resources = {
  en: {
    common: enCommon,
    nav: enNav,
  },
  de: {
    common: deCommon,
    nav: deNav,
  },
  hu: {
    common: huCommon,
    nav: huNav,
  }
};

i18n
  .use(LanguageDetector) 
  .use(initReactI18next) 
  .init({
    resources, // Use bundled resources instead of backend
    supportedLngs: ['en', 'de', 'hu'], // Supported languages
    fallbackLng: 'en',                 // Fallback language
    debug: false,
    interpolation: {
      escapeValue: false, 
    },

    ns: ['common', 'nav'],
    defaultNS: 'common' // default namespace
  });

export default i18n;