import React from 'react';
import { Newspaper, NotebookText, BookMarked, Archive } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

// Mismos ids que t.docenciaPublicaciones.items en translations.js.
const ITEMS = [
  { id: 'rcap', icon: Newspaper },
  { id: 'cuadernos', icon: NotebookText },
  { id: 'editorial', icon: BookMarked },
  { id: 'yaxche', icon: Archive }
];

/**
 * "Publicaciones" de Docencia — bloque 5 del brochure ("Ecosistemas
 * regionales del conocimiento desde alianzas interactivas"): la RCAP,
 * Cuadernos Centroamericanos, Editorial ICAP y el Repositorio Yaxché.
 * Grid de 4 tarjetas (menos apretado que Visión/Impacto porque cada
 * descripción es más larga), más la frase destacada de cierre.
 */
export default function DocenciaPublicaciones() {
  const { t } = useLanguage();
  const c = t.docenciaPublicaciones;

  return (
    <section className="px-4 sm:px-6 py-10 sm:py-16 bg-[#D6E9F7] dark:bg-[#001F3D] relative">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 sm:mb-10 text-center">
          <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-[#0077C8] block mb-1 font-mono-code">
            {c.kicker}
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#003366] dark:text-[#9FC6E8] tracking-tight">
            {c.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1.5 max-w-xl mx-auto leading-relaxed">
            {c.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 mb-8 sm:mb-10">
          {ITEMS.map((item) => {
            const Icon = item.icon;
            const itemT = c.items[item.id];
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-[#003366] rounded-3xl p-5 sm:p-6 border border-slate-100 dark:border-white/10 shadow-sm flex flex-col gap-3"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-[#EAF3FB] dark:bg-white/10 text-[#0077C8] dark:text-[#4FB2F2] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-sm sm:text-base text-[#003366] dark:text-[#9FC6E8] pt-1.5 leading-tight">
                    {itemT.name}
                  </h3>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {itemT.description}
                </p>
              </div>
            );
          })}
        </div>

        <p className="text-center font-heading font-bold text-xs sm:text-sm text-[#003366] dark:text-[#9FC6E8] tracking-wide px-4">
          {c.tagline}
        </p>
      </div>
    </section>
  );
}
