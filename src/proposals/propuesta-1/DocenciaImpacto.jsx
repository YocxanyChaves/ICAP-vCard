import React from 'react';
import { GraduationCap, Wrench, Search, Network, Lightbulb } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

// Mismos ids que t.docenciaImpacto.items en translations.js.
const ITEMS = [
  { id: 'conocimientoEspecializado', icon: GraduationCap },
  { id: 'aplicacionPractica', icon: Wrench },
  { id: 'investigacion', icon: Search },
  { id: 'redesRegionales', icon: Network },
  { id: 'innovacion', icon: Lightbulb }
];

/**
 * "Impacto" de Docencia — bloque 3 del brochure ("Formación para
 * generar impacto"), los 5 pilares a-e más la frase destacada de
 * cierre. Mismo patrón de grid que DocenciaVision.
 */
export default function DocenciaImpacto() {
  const { t } = useLanguage();
  const c = t.docenciaImpacto;

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 mb-8 sm:mb-10">
          {ITEMS.map((item) => {
            const Icon = item.icon;
            const itemT = c.items[item.id];
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-[#003366] rounded-3xl p-4 sm:p-5 border border-slate-100 dark:border-white/10 shadow-sm flex flex-col gap-3"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#EAF3FB] dark:bg-white/10 text-[#0077C8] dark:text-[#4FB2F2] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm sm:text-base text-[#003366] dark:text-[#9FC6E8] mb-1">
                    {itemT.name}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {itemT.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center font-heading font-bold text-sm sm:text-base text-[#003366] dark:text-[#9FC6E8] tracking-tight px-4">
          {c.tagline}
        </p>
      </div>
    </section>
  );
}
