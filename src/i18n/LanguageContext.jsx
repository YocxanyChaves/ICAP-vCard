import React, { createContext, useContext, useMemo, useState } from 'react';
import { translations } from './translations';

const LanguageContext = createContext(null);

/**
 * Proveedor del idioma activo (es/en) para todo el brochure. Se monta
 * una sola vez, envolviendo el árbol en App.jsx — como el contexto de
 * React sigue funcionando a través de un `createPortal` (ver
 * DeviceFrame.jsx, usado por la "Vista Móvil"), esto alcanza tanto a
 * la vista completa como a la previsualización dentro del iframe, sin
 * necesidad de un segundo Provider.
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
