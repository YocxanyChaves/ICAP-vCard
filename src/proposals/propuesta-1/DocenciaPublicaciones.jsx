import React from 'react';
import { Newspaper, NotebookText, BookMarked, Archive } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import KickerBadge from './KickerBadge';
import PublicationsShelf from './PublicationsShelf';
import PublicacionesPiramide from './PublicacionesPiramide';

// Mismos ids que t.docenciaPublicaciones.items en translations.js.
// `accent`: color del lomo de cada libro en el estante (todos de la
// paleta del sitio, lo bastante oscuros para que el nombre en blanco se
// lea bien).
const ITEMS = [
  { id: 'rcap', icon: Newspaper, accent: '#0077C8' },
  { id: 'cuadernos', icon: NotebookText, accent: '#0B5A96' },
  { id: 'editorial', icon: BookMarked, accent: '#003366' },
  { id: 'yaxche', icon: Archive, accent: '#2D6798' }
];

/**
 * "Publicaciones" de Docencia — bloque 5 del brochure ("Ecosistemas
 * regionales del conocimiento desde alianzas interactivas"): la RCAP,
 * Cuadernos Centroamericanos, Editorial ICAP y el Repositorio Yaxché.
 * Las 4 publicaciones como libros en un estante (PublicationsShelf.jsx) y,
 * de cierre, la pirámide holográfica de las 7 palabras
 * (PublicacionesPiramide.jsx), que se arma al scrollear.
 */
export default function DocenciaPublicaciones() {
  const { t } = useLanguage();
  const c = t.docenciaPublicaciones;

  return (
    <>
    <section className="px-4 sm:px-6 py-[var(--docencia-gap)] bg-[#D6E9F7] dark:bg-[#001F3D] relative">
      {/* Misma distancia (--docencia-gap, global.css) del menú al
          primer elemento y entre cada elemento que Formación, Impacto,
          Investigación y Áreas. */}
      <div className="max-w-5xl mx-auto flex flex-col gap-[var(--docencia-gap)]">
        <div className="text-center">
          {/* "Ecosistemas Regionales del Conocimiento" pasó a ser el
              título de la sección de la pirámide; acá arriba va el
              nombre de la subsección para no repetir la misma píldora. */}
          <KickerBadge>{t.nav.docenciaPublicaciones}</KickerBadge>
        </div>
        <h2 className="text-center font-heading font-extrabold text-2xl sm:text-3xl text-[#003366] dark:text-[#9FC6E8] tracking-tight">
          {c.title}
        </h2>
        <p className="text-center text-xs sm:text-sm text-slate-700 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
          {c.subtitle}
        </p>

        <PublicationsShelf items={ITEMS.map((item) => ({ ...item, ...c.items[item.id] }))} />
      </div>
    </section>

    {/* Las 7 palabras del cierre ("Investigar – … – Transformar") se
        arman como pirámide holográfica al scrollear, en su PROPIA
        sección de pantalla completa (fondo azul oscuro de borde a
        borde), con "Ecosistemas Regionales del Conocimiento" como
        título en su píldora — ver PublicacionesPiramide.jsx. */}
    <PublicacionesPiramide
      titulo={c.kicker}
      palabras={c.tagline.split(/\s+[–-]\s+/)}
      pista={c.pyramidHint}
    />
    </>
  );
}
