import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import KickerBadge from './KickerBadge';
import FieldsCarousel from './FieldsCarousel';
import ClosingPhrase from './ClosingPhrase';
import EscudoICAP from '../../components/EscudoICAP';

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
 *    izquierda el texto, a la derecha "Campos de interés" + el
 *    carrusel, todo sobre el mismo navy. En mobile/tablet sigue todo
 *    apilado como antes (card navy, título, carrusel), porque en dos
 *    columnas no entraría. Por eso el contenedor pasa de max-w-3xl a
 *    max-w-6xl en lg. El carrusel desvanece sus bordes con mask-image,
 *    así que se funde con cualquier fondo sin tener que pasarle colores.
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
            alrededor de los dos paneles. En lg+ los paneles son
            TRANSPARENTES (el navy lo pone este contenedor) y sin línea
            divisoria — se lee como una sola pieza — y la marca de agua
            es UNA sola, centrada en todo el bloque (la img de abajo), en
            vez de una por panel. Se dimensiona por ALTO (h-[82%]) y no
            por ancho: el escudo es más alto que ancho y por ancho se
            salía por arriba y abajo del bloque (se veía cortado). */}
        <div className="relative flex flex-col gap-[var(--docencia-gap)] lg:grid lg:grid-cols-[60fr_40fr] lg:gap-0 lg:rounded-[30px] lg:overflow-hidden lg:p-2.5 lg:bg-[#003366] lg:shadow-[0_24px_48px_-24px_rgba(0,31,61,0.45)] lg:border lg:border-[#003366]">
        <EscudoICAP
          tono="white"
          className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[82%] w-auto max-w-none opacity-[0.07] pointer-events-none"
        />
        {/* Card del texto — SIEMPRE navy (no sigue el tema, igual que
            el panel izquierdo de FormacionVisionHero), con el escudo
            como marca de agua apenas visible y letras blancas. */}
        <div className="relative bg-[#003366] lg:bg-transparent rounded-[28px] lg:rounded-none p-6 sm:p-8 lg:p-12 shadow-sm lg:shadow-none space-y-4 overflow-hidden lg:flex lg:flex-col lg:justify-center">
          <EscudoICAP
            tono="white"
            className="lg:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[65%] max-w-none opacity-[0.07] pointer-events-none"
          />
          {c.paragraphs.map((p, i) => (
            <p key={i} className="relative text-sm sm:text-base text-white/90 leading-relaxed">
              {p}
            </p>
          ))}
          <p className="relative text-sm sm:text-base text-white/90 leading-relaxed">{c.closing}</p>
        </div>

        {/* Panel del carrusel — en lg+ es la mitad derecha del bloque,
            sobre el mismo navy que el texto (Yocxany pidió el mismo color
            en las dos mitades, sin línea que las divida; antes era
            celeste clarito); en pantallas chicas no tiene fondo y se ve
            igual que antes. */}
        <div className="flex flex-col gap-[var(--docencia-gap)] lg:gap-4 lg:justify-center lg:py-10 lg:px-2 relative lg:overflow-hidden">
          {/* Mismo estilo que el título de arriba de la sección (un
              poco más chico en desktop, dentro del panel). */}
          <h3 className="relative text-center font-heading font-extrabold text-2xl sm:text-3xl lg:text-2xl text-[#003366] dark:text-[#9FC6E8] lg:text-white tracking-tight">
            {c.fieldsLabel}
          </h3>

          <FieldsCarousel
            fields={c.fields}
            navyLg
          />
        </div>
        </div>

        <ClosingPhrase>{c.tagline}</ClosingPhrase>
      </div>
    </section>
  );
}
