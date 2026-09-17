import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

/**
 * "Investigación" de Docencia — bloque 4 del brochure ("Investigación
 * para comprender el presente y construir futuro"): dos párrafos +
 * los campos de interés (como chips, no como grid de tarjetas, porque
 * acá son sólo nombres sueltos sin descripción propia) + cierre + frase
 * destacada.
 */
export default function DocenciaInvestigacion() {
  const { t } = useLanguage();
  const c = t.docenciaInvestigacion;

  return (
    <section className="px-4 sm:px-6 py-10 sm:py-16 bg-[#D6E9F7] dark:bg-[#001F3D] relative">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 sm:mb-8 text-center">
          <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-[#0077C8] block mb-1 font-mono-code">
            {c.kicker}
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#003366] dark:text-[#9FC6E8] tracking-tight">
            {c.title}
          </h2>
        </div>

        <div className="bg-white dark:bg-[#003366] rounded-[28px] p-6 sm:p-8 border border-slate-100 dark:border-white/10 shadow-sm space-y-4">
          {c.paragraphs.map((p, i) => (
            <p key={i} className="text-xs sm:text-sm text-slate-700 dark:text-[#EAF3FB] leading-relaxed">
              {p}
            </p>
          ))}

          <div>
            <span className="block text-[10px] font-mono-code font-bold uppercase tracking-wider text-[#0077C8] dark:text-[#9FC6E8]/70 mb-2">
              {c.fieldsLabel}
            </span>
            <div className="flex flex-wrap gap-2">
              {c.fields.map((field) => (
                <span
                  key={field}
                  className="px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold bg-[#EAF3FB] dark:bg-white/10 text-[#003366] dark:text-[#9FC6E8] border border-[#0077C8]/15 dark:border-white/10"
                >
                  {field}
                </span>
              ))}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-[#EAF3FB] leading-relaxed">{c.closing}</p>
        </div>

        <p className="mt-6 sm:mt-8 text-center font-heading font-bold text-sm sm:text-base text-[#003366] dark:text-[#9FC6E8] tracking-tight px-4">
          {c.tagline}
        </p>
      </div>
    </section>
  );
}
