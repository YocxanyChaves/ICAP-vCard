import React from 'react';
import { PAGES } from './navigation';

// Mismas secciones que el menú inferior (misma lista compartida, ver
// navigation.js), menos "Inicio" — ya estamos ahí, no tiene sentido
// ofrecerlo como atajo.
const SECTIONS = PAGES.filter((p) => p.id !== 'inicio');

/**
 * Franja de accesos rápidos, aparte del Hero (entre el Hero y Cifras) —
 * no un bloque metido dentro del Hero. Fondo claro a propósito: marca
 * el quiebre visual con el celeste oscuro del Hero, se siente como la
 * barra de navegación de un dashboard justo debajo del encabezado, en
 * vez de un elemento más flotando sobre las olas del Hero.
 */
export default function SectionsStrip({ onNavigate }) {
  return (
    <div className="bg-white border-b border-slate-100 px-4 sm:px-6 py-3 sm:py-3.5">
      <div className="max-w-4xl mx-auto flex items-center gap-1 sm:gap-1.5 overflow-x-auto sm:overflow-visible sm:flex-wrap sm:justify-center scrollbar-none">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => onNavigate?.(section.id)}
              className="flex items-center gap-1.5 shrink-0 px-3 sm:px-3.5 py-1.5 rounded-lg text-[#003366] hover:bg-[#EAF3FB] hover:text-[#0077C8] transition-colors duration-200 cursor-pointer"
            >
              <Icon className="w-3.5 h-3.5 text-[#0077C8]" />
              <span className="text-[11px] sm:text-xs font-heading font-bold tracking-wide whitespace-nowrap">
                {section.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
