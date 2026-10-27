import { createContext, useContext, useMemo, useState } from 'react';
import { translations } from './translations';

const LanguageContext = createContext(null);

/**
 * Idioma activo (es/en). Se monta una sola vez en App.jsx y también
 * llega al iframe de "Vista Móvil" a través del createPortal de
 * DeviceFrame.
 */
export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('es');

  const value = useMemo(() => {
    const toggleLang = () => setLang((prev) => (prev === 'es' ? 'en' : 'es'));
    return {
      lang,
      setLang,
      toggleLang,
      t: translations[lang]
    };
  }, [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

/**
 * Hook de acceso: `const { lang, toggleLang, t } = useLanguage();`
 * Si por lo que sea se usa fuera del Provider (no debería pasar en
 * este proyecto), cae de vuelta al español en vez de tronar.
 */
export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    return { lang: 'es', setLang: () => {}, toggleLang: () => {}, t: translations.es };
  }
  return ctx;
}
