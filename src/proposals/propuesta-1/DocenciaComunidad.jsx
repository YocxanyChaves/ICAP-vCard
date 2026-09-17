import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

/**
 * "Comunidad" de Docencia — bloque 7 del brochure ("Una comunidad
 * académica centroamericana"), el cierre de las subsecciones propias
 * de Docencia. Se deja como un banner con el mismo degradado de marca
 * del Hero (ver AlliesMarquee/header, ronda anterior de esta sesión)
 * en vez de la tarjeta blanca de Misión/Investigación — sin listas ni
 * items, un cierre de texto se siente más a tono como banner que como
 * ficha.
 */
export default function DocenciaComunidad() {
  const { t } = useLanguage();
  const c = t.docenciaComunidad;

  return (
    <section className="px-4 sm:px-6 py-12 sm:py-20 bg-gradient-to-br from-[#003366] via-[#0B5A96] to-[#0077C8] text-white relative overflow-hidden">
      <div className="max-w-2xl mx-auto text-center relative">
        <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-[#EAF3FB] block mb-1.5 font-mono-code">
          {c.kicker}
        </span>
        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight mb-5 sm:mb-6">
          {c.title}
        </h2>

        <div className="space-y-4">
          {c.paragraphs.map((p, i) => (
            <p key={i} className="text-xs sm:text-sm text-[#D6E9F7] leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
