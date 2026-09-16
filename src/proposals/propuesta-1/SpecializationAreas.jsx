import React, { useEffect, useRef, useState } from 'react';
import { Stethoscope, BadgeCheck, ClipboardCheck, Cog, Users, Leaf, Scale, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

// Antes esta sección abría el detalle de cada área en un modal/bottom
// sheet aparte (había que tocar la tarjeta para leer la descripción y
// las líneas de trabajo) — se sentía como el directorio de servicios
// de un hospital. Ahora cada tarjeta va con todo su contenido a la
// vista de una vez, en celeste institucional con letras blancas: más
// elegante, sin esconder información detrás de un clic.
// El título, tag, descripción larga y puntos de cada área viven en el
// diccionario de traducciones (t.specializationAreas.items[id]) — acá
// sólo queda el "id" (llave de esa traducción) y el ícono, que no
// cambia según el idioma. Las 6 áreas y sus íconos son las mismas 6
// que usan areaMeta.js/RegionalMap/AlliesMarquee, para que el ícono de
// cada área se vea igual en todo el sitio.
const AREAS = [
  { id: 'salud', icon: Stethoscope },
  { id: 'calidad', icon: BadgeCheck },
  { id: 'proyectos', icon: ClipboardCheck },
  { id: 'gobernanza', icon: Cog },
  { id: 'transformacion', icon: Users },
  { id: 'ambiente', icon: Leaf }
];

// Mismo celeste institucional para las 6 — un degradado (no un color
// plano) más un brillo radial arriba-izquierda, como si la superficie
// fuera ligeramente curva/pulida. Esa combinación es la que da la
// "ilusión 3D" (ver también el box-shadow de .area-card en
// global.css), sin usar ningún transform real ni animación.
const CARD_BACKGROUND =
  'radial-gradient(65% 70% at 14% -8%, rgba(255,255,255,0.4), transparent 42%), ' +
  'linear-gradient(160deg, #0090DD 0%, #0068AE 48%, #013A63 100%)';

export default function SpecializationAreas() {
  const { t } = useLanguage();
  // Cada tarjeta aparece deslizándose desde su propio lado al entrar en
  // pantalla (columna izquierda ← izquierda, columna derecha ←
  // derecha), en vez de todas a la vez — un observer por tarjeta, no
  // uno solo para toda la sección. Y no es de una sola vez: si la
  // tarjeta sale de la pantalla (para cualquier lado, subiendo o
  // bajando) se vuelve a marcar como oculta, así que la próxima vez que
  // entre en pantalla se repite la animación — nunca se hace
  // `unobserve`, se sigue vigilando todo el tiempo que la sección esté
  // montada.
  const cardRefs = useRef({});
  const [visibleIds, setVisibleIds] = useState(() => new Set());

  useEffect(() => {
    const els = Object.values(cardRefs.current).filter(Boolean);
    if (els.length === 0) return undefined;

    // Mismo patrón que StatsSection/MissionVision: el IntersectionObserver
    // hay que sacarlo del `window` real dueño del documento donde viven
    // las tarjetas (no del `window` global del módulo), para que también
    // funcione dentro del iframe de "Vista Móvil".
    const view = els[0].ownerDocument?.defaultView;
    const IO = view?.IntersectionObserver;

    if (!IO) {
      // Sin soporte disponible: mostramos todo directo en vez de dejar
      // las tarjetas invisibles para siempre.
      setVisibleIds(new Set(AREAS.map((a) => a.id)));
      return undefined;
    }

    const observer = new IO(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.dataset.areaId;
          setVisibleIds((prev) => {
            const has = prev.has(id);
            if (entry.isIntersecting === has) return prev;
            const next = new Set(prev);
            if (entry.isIntersecting) next.add(id);
            else next.delete(id);
            return next;
          });
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -60px 0px' }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="px-4 sm:px-6 py-10 sm:py-16 bg-slate-50 dark:bg-[#001428] relative">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 sm:mb-10 text-center">
          <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-[#0077C8] block mb-1 font-mono-code">
            {t.specializationAreas.kicker}
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#003366] dark:text-white tracking-tight">
            {t.specializationAreas.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-md mx-auto">
            {t.specializationAreas.subtitle}
          </p>
          {/* Género no es una 7ma tarjeta: es el eje transversal que
              atraviesa las 6 áreas (igual que en la rueda del brochure
              oficial), así que se muestra como una nota/badge aparte. */}
          <div className="inline-flex items-center gap-2 mt-4 px-3.5 py-2 rounded-full bg-[#D86DCB]/10 border border-[#D86DCB]/25 text-[11px] sm:text-xs text-[#0B1F3D] dark:text-white font-medium">
            <Scale className="w-3.5 h-3.5 text-[#D86DCB] shrink-0" />
            <span>{t.specializationAreas.generoNote}</span>
          </div>
        </div>

        {/* Fichas ya expandidas, con todo su contenido a la vista —
            dos columnas desde tablet, una en móvil. */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {AREAS.map((area, idx) => {
            const Icon = area.icon;
            const areaT = t.specializationAreas.items[area.id];
            const fromRight = idx % 2 === 1;
            // Con un número impar de áreas, la última queda sola en su
            // propia fila — en vez de dejarla pegada a la izquierda
            // (como si le faltara la pareja), esa fila ocupa las dos
            // columnas y la tarjeta se centra adentro, del mismo ancho
            // que una tarjeta normal.
            const isLastOdd = idx === AREAS.length - 1 && AREAS.length % 2 === 1;
            return (
              <div
                key={area.id}
                ref={(el) => {
                  cardRefs.current[area.id] = el;
                }}
                data-area-id={area.id}
                className={`h-full area-card-reveal ${fromRight ? 'area-card-reveal-right' : ''} ${
                  visibleIds.has(area.id) ? 'is-visible' : ''
                } ${isLastOdd ? 'lg:col-span-2 lg:flex lg:justify-center' : ''}`}
                style={{ transitionDelay: fromRight ? '120ms' : '0ms' }}
              >
              <article
                className={`area-card group relative rounded-[28px] p-6 sm:p-7 overflow-hidden flex flex-col text-white h-full ${
                  isLastOdd ? 'lg:w-full lg:max-w-[calc((100%-1.25rem)/2)]' : ''
                }`}
                style={{ background: CARD_BACKGROUND }}
              >
                {/* Hairline superior, apenas insinuada — el toque de
                    "borde pulido" en vez del acento de color de antes. */}
                <span
                  aria-hidden="true"
                  className="absolute top-0 left-7 right-7 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
                />

                <div className="relative flex items-start gap-4 mb-5">
                  <div className="w-14 h-14 min-w-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <h3 className="font-heading font-extrabold text-lg sm:text-xl text-white leading-tight">
                      {areaT.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-white/70 mt-1">{areaT.tag}</p>
                  </div>
                </div>

                {/* Descripción corta (3 renglones, redactada a partir de
                    los puntos oficiales de la oferta institucional) +
                    los 3 puntos principales de esa misma lista, en vez del
                    listado completo — vista resumida de la tarjeta. */}
                <p className="relative text-xs sm:text-sm text-white/85 leading-relaxed mb-5">
                  {areaT.shortDesc}
                </p>

                <div className="relative space-y-2 mt-auto pt-1">
                  {areaT.highlights.map((pt, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/10 border border-white/10 text-xs sm:text-[13px] text-white/90 leading-relaxed"
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-white" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
