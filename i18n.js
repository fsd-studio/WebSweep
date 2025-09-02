import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

// Use correct relative paths
import deCommon from './locales/de/common.json';
import deNav from './locales/de/nav.json';
import enCommon from './locales/en/common.json';
import enNav from './locales/en/nav.json';
import huCommon from './locales/hu/common.json';
import huNav from './locales/hu/nav.json';

console.log('EN Common:', enCommon);
console.log('HU Common:', huCommon);
console.log('DE Common:', deNav);

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
    resources,
    supportedLngs: ['en', 'de', 'hu'],
    fallbackLng: 'en',
    debug: true, // Set to true temporarily to see error messages
    interpolation: {
      escapeValue: false,
    },
    ns: ['common', 'nav'],
    defaultNS: 'common'
  });

export default i18n;