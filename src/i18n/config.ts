import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import pt from './locales/pt.json';
import en from './locales/en.json';
import es from './locales/es.json';

const SUPPORTED = ['pt', 'en', 'es'] as const;

// Idioma padrão absoluto: pt-BR. Nunca deduzimos do navegador, header ou IP.
const readStoredLanguage = () => {
  try {
    if (typeof window === 'undefined') return 'pt';
    const stored = window.localStorage.getItem('btf_lang');
    window.localStorage.removeItem('i18nextLng');
    const base = stored?.split('-')[0];
    return SUPPORTED.includes(base as (typeof SUPPORTED)[number]) ? (base as string) : 'pt';
  } catch {
    return 'pt';
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      pt: { translation: pt },
      en: { translation: en },
      es: { translation: es },
    },
    lng: readStoredLanguage(),
    fallbackLng: 'pt',
    supportedLngs: SUPPORTED as unknown as string[],
    load: 'languageOnly',
    interpolation: {
      escapeValue: false,
    },
  });


// Mapeamento de idioma base para tag regional usada no <html lang>.
export const HTML_LANG: Record<string, string> = {
  pt: 'pt-BR',
  en: 'en-US',
  es: 'es-ES',
};

export default i18n;

