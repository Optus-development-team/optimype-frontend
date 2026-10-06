import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import esTranslations from './locales/es.json';
import enTranslations from './locales/en.json';

export const SUPPORTED_LANGUAGES = ['es', 'en'];

const resources = {
  es: {
    translation: esTranslations
  },
  en: {
    translation: enTranslations
  }
};

i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources,
    fallbackLng: 'es', // Spanish as default language
    supportedLngs: SUPPORTED_LANGUAGES,
    // 'en-US' -> 'en', 'es-BO' -> 'es'
    load: 'languageOnly',
    nonExplicitSupportedLngs: true,
    debug: false, // Set to true during development for debugging

    detection: {
      // The saved choice wins; on a first visit, the browser language decides
      order: ['localStorage', 'navigator', 'htmlTag'],
      // Cache user language on localStorage
      caches: ['localStorage']
    },

    interpolation: {
      escapeValue: false // React already escapes by default
    },

    // React i18next options
    react: {
      useSuspense: false
    }
  });

// Keep <html lang>, the tab title and the meta description in the active language
const syncDocument = () => {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = i18n.resolvedLanguage || 'es';
  document.title = i18n.t('seo.title');
  const description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute('content', i18n.t('seo.description'));
};

i18n.on('languageChanged', syncDocument);
i18n.on('initialized', syncDocument);
if (i18n.isInitialized) syncDocument();

export default i18n;
