import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import KickerBadge from './KickerBadge';
import FieldsCarousel from './FieldsCarousel';
import ClosingPhrase from './ClosingPhrase';
import icapEscudoWhite from '../../assets/icap-escudo-white.svg';
import icapEscudoNavy from '../../assets/icap-escudo-navy.svg';

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
 * 4) En desktop (lg+) el texto y el carrusel ahora son UN SOLO BLOQUE
 *    (pedido de Yocxany): una tarjeta redondeada partida en dos (60/40,
 *    el texto con más espacio que el carrusel) — a la
 *    izquierda el panel navy con el texto, a la derecha un panel claro
 *    con "Campos de interés" + el carrusel. En mobile/tablet sigue todo
 *    apilado como antes (card navy, título, carrusel), porque en dos
 *    columnas no entraría. Por eso el contenedor pasa de max-w-3xl a
 *    max-w-6xl en lg, y el carrusel recibe `fadeClass` para que sus
 *    degradados de borde se fundan con el panel claro en vez de con el
 *    fondo de la sección.
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
    <section className="px-4 sm:px-6 py-[var(--docencia-gap)] bg-[#D6E9F7] dark:bg-[#001F3D] relative">
      {/* Misma distancia (--docencia-gap, global.css) del menú al
          primer elemento y entre cada elemento, igual que Formación e
          Impacto. */}
      <div className="max-w-3xl lg:max-w-6xl mx-auto flex flex-col gap-[var(--docencia-gap)]">
        <div className="text-center">
          <KickerBadge>{c.kicker}</KickerBadge>
        </div>
        <h2 className="text-center font-heading font-extrabold text-2xl sm:text-3xl text-[#003366] dark:text-[#9FC6E8] tracking-tight">
          {c.title}
        </h2>

        {/* Bloque texto + carrusel. En lg+ es una sola tarjeta de dos
            columnas (ver punto 4 arriba); en pantallas chicas los dos
            hijos se apilan con el mismo gap de siempre. El "marquito"
            que une todo (pedido de Yocxany) es el propio contenedor en
            lg+: padding + fondo navy #003366 (el MISMO del panel del
            texto, fijo en los dos temas — Yocxany lo pidió de ese color)
            alrededor de los dos paneles — por eso los
            paneles llevan esquinas propias (rounded-l / rounded-r). */}
        <div className="flex flex-col gap-[var(--docencia-gap)] lg:grid lg:grid-cols-[60fr_40fr] lg:gap-0 lg:rounded-[30px] lg:overflow-hidden lg:p-2.5 lg:bg-[#003366] lg:shadow-[0_24px_48px_-24px_rgba(0,31,61,0.45)] lg:border lg:border-[#003366]">
        {/* Card del texto — SIEMPRE navy (no sigue el tema, igual que
            el panel izquierdo de FormacionVisionHero), con el escudo
            como marca de agua apenas visible y letras blancas. */}
        <div className="relative bg-[#003366] rounded-[28px] lg:rounded-r-none lg:rounded-l-[22px] p-6 sm:p-8 lg:p-12 shadow-sm lg:shadow-none space-y-4 overflow-hidden lg:flex lg:flex-col lg:justify-center">
          <img
            src={icapEscudoWhite}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[65%] max-w-none opacity-[0.07] pointer-events-none select-none"
          />
          {c.paragraphs.map((p, i) => (
            <p key={i} className="relative text-sm sm:text-base text-white/90 leading-relaxed">
              {p}
            </p>
          ))}
          <p className="relative text-sm sm:text-base text-white/90 leading-relaxed">{c.closing}</p>
        </div>

        {/* Panel del carrusel — en lg+ es la mitad derecha del bloque,
            con fondo claro propio; en pantallas chicas no tiene fondo y
            se ve igual que antes. */}
        <div className="flex flex-col gap-[var(--docencia-gap)] lg:gap-4 lg:justify-center lg:py-10 lg:px-2 lg:rounded-r-[22px] lg:bg-[#EAF3FB] dark:lg:bg-[#012A50] relative lg:overflow-hidden">
          {/* Marca de agua MUY sutil del escudo detrás del panel de
              "Campos de interés" — sólo en lg+, donde el panel tiene
              fondo propio. Navy en claro, blanca en oscuro. IGUAL a la
              del panel del texto (pedido de Yocxany): las dos CENTRADAS
              en su panel, misma opacidad y mismo tamaño en px — por eso
              los anchos en % son distintos (97% de un panel del 40% ≈
              65% de uno del 60%). */}
          <img
            src={icapEscudoNavy}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="hidden lg:block dark:lg:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[97%] max-w-none opacity-[0.07] pointer-events-none select-none"
          />
          <img
            src={icapEscudoWhite}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="hidden dark:lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[97%] max-w-none opacity-[0.07] pointer-events-none select-none"
          />
          {/* Mismo estilo que el título de arriba de la sección (un
              poco más chico en desktop, dentro del panel). */}
          <h3 className="relative text-center font-heading font-extrabold text-2xl sm:text-3xl lg:text-2xl text-[#003366] dark:text-[#9FC6E8] tracking-tight">
            {c.fieldsLabel}
          </h3>

          <FieldsCarousel
            fields={c.fields}
            fadeClass="from-[#D6E9F7] dark:from-[#001F3D] lg:from-[#EAF3FB] dark:lg:from-[#012A50]"
          />
        </div>
        </div>

        <ClosingPhrase>{c.tagline}</ClosingPhrase>
      </div>
    </section>
  );
}
