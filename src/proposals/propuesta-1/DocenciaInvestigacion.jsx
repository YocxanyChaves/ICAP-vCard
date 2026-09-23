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
 * 3) Los campos de interés pasaron por DOS diseños: primero un "mundo"
 *    de anillos orbitando (FieldsWorld.jsx) — Yocxany lo probó y pidió
 *    cambiarlo ("quitemos los anillos") por un carrusel infinito estilo
 *    el de Áreas de Asistencia Técnica, con tarjetas de cristal
 *    rectangulares, efecto "cilindro" 3D y auto-avance pausado. Quedó
 *    en FieldsCarousel.jsx (FieldsWorld.jsx ya no se usa en ningún
 *    lado).
 *
 * OJO con la estructura de acá abajo: el kicker/título y la card de
 * texto SÍ van dentro del `max-w-3xl mx-auto` de siempre, pero
 * `<FieldsCarousel>` va AFUERA de ese wrapper, como hijo directo de
 * `<section>` — FieldsCarousel hace su propio "breakout" a 100vw por
 * dentro (mismo truco que el carrusel de Áreas de AT, ver
 * SpecializationAreas.jsx), y ese truco calcula el ancho relativo al
 * contenedor MÁS CERCANO sin límite de ancho propio. Si quedara
 * anidado adentro del `max-w-3xl`, el "100vw" terminaría midiéndose
 * relativo a esos 768px en vez del viewport real, y el carrusel
 * saldría mal alineado/cortado.
 */
export default function DocenciaInvestigacion() {
  const { t } = useLanguage();
  const c = t.docenciaInvestigacion;

  return (
    // `overflow-x-hidden`: red de seguridad — tanto para el breakout a
    // 100vw de FieldsCarousel (mismo motivo que en
    // SpecializationAreas: nunca debe generar scroll horizontal de la
    // página) como remanente útil de cuando los campos de interés eran
    // el "mundo" de anillos.
    <section className="px-4 sm:px-6 py-10 sm:py-16 bg-[#D6E9F7] dark:bg-[#001F3D] relative overflow-x-hidden">
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
      </div>

      {/* Ver el comentario grande de arriba: a propósito FUERA del
          `max-w-3xl` de arriba/abajo. */}
      <FieldsCarousel fields={c.fields} />

      <div className="max-w-3xl mx-auto">
        <p className="mt-6 sm:mt-8 text-center font-heading font-bold text-sm sm:text-base text-[#003366] dark:text-[#9FC6E8] tracking-tight px-4">
          {c.tagline}
        </p>
      </div>
    </section>
  );
}
