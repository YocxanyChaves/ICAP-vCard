import { useLanguage } from '../i18n/LanguageContext';
import KickerBadge from '../components/KickerBadge';
import FieldsCarousel from '../components/FieldsCarousel';
import ClosingPhrase from '../components/ClosingPhrase';
import EscudoICAP from '../components/EscudoICAP';

/**
 * "Investigación" de Docencia — bloque 4 del brochure ("Investigación
 * para comprender el presente y construir futuro").
 *
 * - Kicker: KickerBadge (puntito).
 * - El texto (párrafos + cierre) va en una card navy fija #003366 (no
 *   sigue el tema) con el escudo como marca de agua y letras blancas.
 * - Campos de interés: el tambor 3D de FieldsCarousel.jsx.
 * - En desktop (lg+) texto y carrusel forman UN SOLO bloque de dos
 *   columnas (60/40) sobre el mismo navy; por eso el contenedor pasa de
 *   max-w-3xl a max-w-6xl. En mobile/tablet todo va apilado.
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

        {/* Bloque texto + carrusel. En lg+ es una sola tarjeta de dos columnas:
            el padding y el fondo navy #003366 los pone este contenedor, los
            paneles van transparentes y sin línea divisoria, y la marca de agua es
            una sola, centrada en todo el bloque. Se dimensiona por ALTO (h-[82%])
            porque el escudo es más alto que ancho. En pantallas chicas los dos
            hijos se apilan. */}
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

        {/* Panel del carrusel: en lg+ es la mitad derecha del bloque, sobre el
            mismo navy; en pantallas chicas no tiene fondo. */}
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
