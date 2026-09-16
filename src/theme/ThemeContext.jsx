import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext(null);

const STORAGE_KEY = 'icap-vcard-theme';

/**
 * Lee la preferencia guardada en localStorage, si existe. Nunca revienta
 * si el storage no está disponible (modo privado, SSR, etc.) — en ese
 * caso simplemente arranca en 'light'.
 */
function getInitialTheme() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // localStorage no disponible: seguimos con el valor por defecto.
  }
  return 'light';
}

/**
 * Proveedor del tema activo (light/dark) para todo el brochure — mismo
 * patrón que LanguageProvider: se monta una sola vez envolviendo el
 * árbol en App.jsx, y como React Context sigue funcionando a través de
 * un `createPortal` (ver DeviceFrame.jsx, usado por la "Vista Móvil"),
 * un único Provider alcanza tanto para la vista completa como para la
 * previsualización dentro del iframe.
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Si no se puede persistir, el tema simplemente vuelve a 'light'
      // en la próxima visita — no es un error que deba interrumpir nada.
    }
  }, [theme]);

  const value = useMemo(() => {
    const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    return { theme, setTheme, toggleTheme };
  }, [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Hook de acceso: `const { theme, toggleTheme } = useTheme();`
 * Si por lo que sea se usa fuera del Provider, cae de vuelta a 'light'
 * en vez de tronar.
 */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return { theme: 'light', setTheme: () => {}, toggleTheme: () => {} };
  }
  return ctx;
}
