import React from 'react';
import { User, Info } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import KickerBadge from './KickerBadge';

/**
 * Placeholder de autoridades / equipo directivo.
 *
 * Aún no se definió quiénes van a salir aquí, así que esta sección se deja
 * lista con espacios vacíos (avatar, nombre y cargo) para completar más
 * adelante. Nada de lo que se ve es un dato real — no inventar nombres
 * ni cargos mientras esto siga así.
 */
const AUTHORITIES = [
  { id: 1, name: '', title: '' },
  { id: 2, name: '', title: '' },
  { id: 3, name: '', title: '' },
  { id: 4, name: '', title: '' },
  { id: 5, name: '', title: '' },
  { id: 6, name: '', title: '' }
];

// Autoridades es una sección COMPARTIDA entre los dos departamentos
// (mismo componente, mismo contenido — ver el comentario en
// Propuesta1.jsx) — pero Yocxany pidió que el kicker sí lleve la
// identidad visual del departamento donde se está viendo: el brillo
// celeste "glow" de Asistencia Técnica, o el puntito "dot" de
// Docencia, según `dept`. El texto (kicker/título/subtítulo) se queda
// igual en los dos — es la MISMA info institucional, sólo cambia el
// marco visual de la píldora.
export default function AuthoritiesSection({ dept = 'at' }) {
  const { t } = useLanguage();
  return (
    <section className="px-4 sm:px-6 py-10 sm:py-16 bg-[#D6E9F7] dark:bg-[#001F3D] relative">
      <div className="max-w-4xl mx-auto">
        <div className="mb-5 sm:mb-6 text-center">
          <div className="mb-1.5 sm:mb-2 flex justify-center">
            <KickerBadge variant={dept === 'docencia' ? 'dot' : 'glow'}>{t.authorities.kicker}</KickerBadge>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#003366] dark:text-[#9FC6E8] tracking-tight">
            {t.authorities.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1.5 max-w-xl mx-auto leading-relaxed">
            {t.authorities.subtitle}
          </p>
        </div>

        {/* Pending-data notice */}
        <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#EAF3FB] dark:bg-white/5 border border-[#0077C8]/20 dark:border-white/10 mb-6 sm:mb-8">
          <Info className="w-4 h-4 text-[#0077C8] shrink-0 mt-0.5" />
          <p className="text-[11px] sm:text-xs text-[#003366] dark:text-[#9FC6E8] leading-relaxed">
            {t.authorities.notice}
          </p>
        </div>

        {/* Placeholder grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {AUTHORITIES.map((person) => (
            <div
              key={person.id}
              className="bg-white dark:bg-white/5 rounded-3xl p-4 sm:p-5 border border-dashed border-slate-300 dark:border-white/20 flex flex-col items-center text-center gap-2.5"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-50 dark:bg-white/5 border border-dashed border-slate-300 dark:border-white/20 flex items-center justify-center text-slate-300 dark:text-white/30">
                <User className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>

              <div className="min-w-0 w-full">
                <p className="font-heading font-bold text-xs sm:text-sm text-slate-400 dark:text-slate-400 italic truncate">
                  {t.authorities.namePending}
                </p>
                <p className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 italic truncate mt-0.5">
                  {t.authorities.titlePending}
                </p>
              </div>

              <span className="text-[8px] font-mono-code font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-slate-300">
                {t.authorities.tbd}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
