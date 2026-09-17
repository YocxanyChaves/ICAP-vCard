import React from 'react';
import { Info, Telescope } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

/**
 * ARCHIVO SIN USAR — Yocxany pidió eliminar del todo la sección
 * "Visión" de Docencia (era este placeholder de "en construcción",
 * nunca llegó a tener contenido real). Ya no tiene entrada en el menú
 * (navigation.js), no se importa en Propuesta1.jsx, y t.docenciaVision
 * ya no existe en translations.js — este componente queda huérfano en
 * el proyecto. Se puede borrar el archivo con confianza; no se borró
 * automáticamente porque este flujo no tiene forma de eliminar
 * archivos en tu carpeta, sólo de escribir/reemplazar.
 */
export default function DocenciaVision() {
  const { t } = useLanguage();
  const c = t.docenciaVision;

  return (
    <section className="px-4 sm:px-6 py-10 sm:py-16 bg-[#D6E9F7] dark:bg-[#001F3D] relative">
      <div className="max-w-2xl mx-auto text-center">
        <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-[#0077C8] block mb-1 font-mono-code">
          {c.kicker}
        </span>
        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#003366] dark:text-[#9FC6E8] tracking-tight mb-6 sm:mb-8">
          {c.title}
        </h2>

        <div className="flex flex-col items-center gap-4 py-8 sm:py-10 px-6 rounded-[28px] bg-white dark:bg-white/5 border border-dashed border-slate-300 dark:border-white/20">
          <div className="w-14 h-14 rounded-full bg-slate-50 dark:bg-white/5 border border-dashed border-slate-300 dark:border-white/20 flex items-center justify-center text-slate-300 dark:text-white/30">
            <Telescope className="w-6 h-6" />
          </div>
          <div className="flex items-start gap-2.5 text-left max-w-sm">
            <Info className="w-4 h-4 text-[#0077C8] shrink-0 mt-0.5" />
            <p className="text-[11px] sm:text-xs text-[#003366] dark:text-[#9FC6E8] leading-relaxed">
              {c.notice}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
