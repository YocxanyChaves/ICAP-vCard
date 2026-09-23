import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import KickerBadge from './KickerBadge';
import FieldsCarousel from './FieldsCarousel';
import icapEscudoWhite from '../../assets/icap-escudo-white.svg';

/**
 * "Investigación" de Docencia — bloque 4 del brochure ("Investigación
 * para comprender el presente y construir futuro").
 *
 * Rediseño pedido por Yocxany sobre la versión anterior (kicker de
 * texto plano + una sola card blanca con párrafos, chips de campos de
 * interés en fila y cierre, todo junto):
 *
 * 1) El kicker pasó a ser la misma píldora con puntito pulsante que ya
 *    se usa en Formación/Impacto (`<KickerBadge>`, variant="dot" por
 *    default) — antes era sólo texto suelto, sin marco.
 * 2) El texto (los párrafos + el cierre) salió de la card blanca
 *    genérica y ahora tiene su PROPIA card: fondo azul oscuro fijo
 *    (#003366, igual que el panel de Formación — no sigue el toggle
 *    claro/oscuro, es un color de marca fijo) con la marca de agua del
 *    escudo del ICAP y letras blancas, en vez de la card blanca share
 *    de antes.
 * 3) Los campos de interés pasaron por TRES diseños: primero un
 *    "mundo" de anillos orbitando (FieldsWorld.jsx) — Yocxany lo probó
 *    y pidió cambiarlo ("quitemos los anillos") por un carrusel
 *    infinito estilo el de Áreas de Asistencia Técnica (scroll nativo +
 *    efecto "coverflow" simulado). Ese funcionaba bien, pero Yocxany
 *    subió su propio componente de referencia (un tambor 3D real que
 *    gira solo, no por scroll) y preguntó si se podía implementar algo
 *    así — quedó en la versión actual de FieldsCarousel.jsx: mismo
 *    contenido, técnica nueva (ver el comentario grande al inicio de
 *    ese archivo para el detalle). FieldsWorld.jsx ya no se usa en
 *    ningún lado.
 *
 * `<FieldsCarousel>` vive adentro del `max-w-3xl mx-auto` de siempre —
 * a diferencia de la versión de scroll infinito anterior, el tambor 3D
 * gira sobre sí mismo (no hace scroll horizontal), así que ya no
 * necesita el "breakout" a 100vw ni ser hijo directo de `<section>`.
 */
export default function DocenciaInvestigacion() {
  const { t } = useLanguage();
  const c = t.docenciaInvestigacion;

  return (
    <section className="px-4 sm:px-6 py-10 sm:py-16 bg-[#D6E9F7] dark:bg-[#001F3D] relative">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 sm:mb-8 text-center">
          <div className="mb-3 inline-block">
            <KickerBadge>{c.kicker}</KickerBadge>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#003366] dark:text-[#9FC6E8] tracking-tight">
            {c.title}
          </h2>
        </div>

        {/* Card del texto — SIEMPRE navy (no sigue el tema, igual que
            el panel izquierdo de FormacionVisionHero), con el escudo
            como marca de agua apenas visible y letras blancas. */}
        <div className="relative bg-[#003366] rounded-[28px] p-6 sm:p-8 shadow-sm space-y-4 overflow-hidden">
          <img
            src={icapEscudoWhite}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="absolute -right-[10%] -top-[15%] w-[65%] max-w-none opacity-[0.07] pointer-events-none select-none"
          />
          {c.paragraphs.map((p, i) => (
            <p key={i} className="relative text-xs sm:text-sm text-white/90 leading-relaxed">
              {p}
            </p>
          ))}
          <p className="relative text-xs sm:text-sm text-white/90 leading-relaxed">{c.closing}</p>
        </div>

        <span className="block text-center text-[10px] font-mono-code font-bold uppercase tracking-wider text-[#0077C8] dark:text-[#9FC6E8]/70 mt-8 sm:mt-10 mb-4">
          {c.fieldsLabel}
        </span>

        <FieldsCarousel fields={c.fields} />

        <p className="mt-6 sm:mt-8 text-center font-heading font-bold text-sm sm:text-base text-[#003366] dark:text-[#9FC6E8] tracking-tight px-4">
          {c.tagline}
        </p>
      </div>
    </section>
  );
}
