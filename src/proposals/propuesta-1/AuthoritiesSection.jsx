import React from 'react';
import { User, Info } from 'lucide-react';

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

export default function AuthoritiesSection() {
  return (
    <section className="px-4 sm:px-6 py-10 sm:py-16 bg-slate-50 relative">
      <div className="max-w-4xl mx-auto">
        <div className="mb-5 sm:mb-6 text-center sm:text-left">
          <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-[#0077C8] block mb-1 font-mono-code">
            Liderazgo Institucional
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#003366] tracking-tight">
            Autoridades
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-xl sm:mx-0 mx-auto leading-relaxed">
            Equipo directivo y autoridades del ICAP.
          </p>
        </div>

        {/* Pending-data notice */}
        <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#EAF3FB] border border-[#0077C8]/20 mb-6 sm:mb-8">
          <Info className="w-4 h-4 text-[#0077C8] shrink-0 mt-0.5" />
          <p className="text-[11px] sm:text-xs text-[#003366] leading-relaxed">
            Sección en construcción &middot; los espacios de abajo se completarán con nombres, cargos y fotografías oficiales una vez definidos.
          </p>
        </div>

        {/* Placeholder grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {AUTHORITIES.map((person) => (
            <div
              key={person.id}
              className="bg-white rounded-3xl p-4 sm:p-5 border border-dashed border-slate-300 flex flex-col items-center text-center gap-2.5"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-50 border border-dashed border-slate-300 flex items-center justify-center text-slate-300">
                <User className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>

              <div className="min-w-0 w-full">
                <p className="font-heading font-bold text-xs sm:text-sm text-slate-400 italic truncate">
                  Nombre pendiente
                </p>
                <p className="text-[10px] sm:text-[11px] text-slate-400 italic truncate mt-0.5">
                  Cargo pendiente
                </p>
              </div>

              <span className="text-[8px] font-mono-code font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-400">
                Por definir
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
