import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Carrusel de campos de interés de Investigación
 * (DocenciaInvestigacion.jsx). Reemplaza al "mundo" de anillos
 * orbitando (FieldsWorld.jsx, ya eliminado) — Yocxany lo probó y pidió
 * cambiarlo por esto, textual: "un carrusel bien bonito, que sea como
 * el de areas de AT (infinito, y con scroll integrado)... tarjetas con
 * fondo como si fueran tarjetas de cristal... rectangulares... una
 * animación como muy realista de que están en un carrusel de un
 * cilindro... si uno no scrollea se vayan pasando automáticamente...
 * que dé chance de leer la palabra".
 *
 * "El de áreas de AT" es SpecializationAreas.jsx — el carrusel de las
 * 6 áreas de Asistencia Técnica. Acá se reusa la MISMA técnica
 * (probada, sin reinventar) para el scroll horizontal nativo +
 * infinito + el efecto "cilindro" 3D, adaptada a tarjetas mucho más
 * simples (una palabra, no una card con ícono/párrafo/lista) y con dos
 * cosas que AT no tiene: auto-avance cuando nadie toca el carrusel, y
 * cristal (glassmorphism) en vez del fondo celeste sólido de AT.
 *
 * Lo que se REUSA tal cual de SpecializationAreas (mismos nombres de
 * variable/comentarios recortados, para quien compare los dos
 * archivos):
 * - El truco del carrusel "infinito": las 12 palabras se repiten 3
 *   veces seguidas (LOOPS), el carril arranca en la copia del medio, y
 *   cuando el scroll se queda quieto y la tarjeta activa cayó en una
 *   copia de los extremos, se salta en silencio de vuelta al medio
 *   (recenterIfNeeded) — nunca se nota el salto porque las 3 copias
 *   son pixel-idénticas.
 * - El efecto "cilindro" (updateCoverflow): en cada frame de scroll,
 *   cada tarjeta se rota en 3D (`perspective(...) rotateY(...)
 *   scale(...)`) según qué tan lejos quede del centro del carril —
 *   la del centro queda plana y grande, las de los costados se
 *   inclinan como si la superficie fuera curva, más achicadas/
 *   transparentes cuanto más lejos. Es matemática pura sobre
 *   posiciones reales del DOM (getBoundingClientRect), no depende de
 *   ninguna librería — corre en cada frame de scroll y escribe el
 *   transform DIRECTO en el DOM (no por React/setState) para que
 *   responda pixel a pixel sin re-renderizar 36 tarjetas por scroll.
 * - Wheel del mouse traducido a "paso siguiente/anterior" (un
 *   `overflow-x-auto` no reacciona a la ruedita vertical de toda la
 *   vida) y snap nativo (`snap-x snap-mandatory`) para el "scroll
 *   integrado" que pidió.
 *
 * Lo NUEVO acá (no existe en SpecializationAreas):
 * - Auto-avance: si nadie tocó el carril (pointerdown/wheel/touch) en
 *   los últimos `IDLE_BEFORE_AUTOPLAY_MS`, y el mouse no está encima,
 *   pasa sola a la palabra siguiente cada `AUTOPLAY_INTERVAL_MS` — ese
 *   intervalo es a propósito pausado (no un carrusel "veloz"), para
 *   que alcance a leerse la palabra antes de que cambie, como pidió.
 *   Se pausa por completo con el mouse encima.
 * - Tarjetas de cristal: fondo blanco muy transparente + blur (no el
 *   degradé celeste sólido de AT) — se apoya en LO QUE HAY DETRÁS
 *   (la card navy del texto, el fondo celeste/navy de la sección) para
 *   dar el efecto vidrio, así que a propósito NO llevan su propio
 *   fondo opaco.
 * - Sin el "reparto tipo mazo de cartas" de entrada que sí tiene AT
 *   (fase hidden/stacked/dealt): acá son 12 tarjetas chiquitas de una
 *   sola palabra, ese despliegue coreografiado no aporta nada y sólo
 *   suma complejidad — el coverflow queda activo desde que se monta.
 */

const LOOPS = 3;
const AUTOPLAY_INTERVAL_MS = 2600;
const IDLE_BEFORE_AUTOPLAY_MS = 2200;

// Centra una tarjeta en el carril sin animación — se usa sólo para el
// centrado inicial (antes de que se vea nada moverse).
function centerCardInstant(track, cardEl) {
  if (!track || !cardEl) return;
  const target = cardEl.offsetLeft - (track.clientWidth - cardEl.clientWidth) / 2;
  track.scrollTo({ left: target, behavior: 'instant' });
}

export default function FieldsCarousel({ fields }) {
  const trackRef = useRef(null);
  const cardRefs = useRef({});
  const closestRenderIndexRef = useRef(fields.length);
  const stepRef = useRef(160);
  const recenterTimeoutRef = useRef(null);
  const lastInteractionRef = useRef(0);
  const hoveringRef = useRef(false);

  const RENDER_FIELDS = useMemo(
    () =>
      Array.from({ length: LOOPS * fields.length }, (_, i) => {
        const baseIndex = i % fields.length;
        return {
          field: fields[baseIndex],
          baseIndex,
          renderIndex: i,
          renderKey: `copy${Math.floor(i / fields.length)}-${baseIndex}`
        };
      }),
    [fields]
  );

  const scrollToIndex = useCallback(
    (idx, behavior = 'smooth') => {
      const track = trackRef.current;
      const clamped = Math.max(0, Math.min(RENDER_FIELDS.length - 1, idx));
      const item = RENDER_FIELDS[clamped];
      const cardEl = item && cardRefs.current[item.renderKey];
      if (!track || !cardEl) return;
      const target = cardEl.offsetLeft - (track.clientWidth - cardEl.clientWidth) / 2;
      track.scrollTo({ left: target, behavior });
    },
    [RENDER_FIELDS]
  );

  const updateCoverflow = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const trackRect = track.getBoundingClientRect();
    const centerX = trackRect.left + trackRect.width / 2;

    const firstEl = cardRefs.current[RENDER_FIELDS[0].renderKey];
    const secondItem = RENDER_FIELDS[1];
    const secondEl = secondItem && cardRefs.current[secondItem.renderKey];
    let step = firstEl ? firstEl.getBoundingClientRect().width + 20 : stepRef.current;
    if (firstEl && secondEl) {
      const a = firstEl.getBoundingClientRect();
      const b = secondEl.getBoundingClientRect();
      step = b.left + b.width / 2 - (a.left + a.width / 2) || step;
    }
    stepRef.current = step;

    let closestIdx = 0;
    let closestDist = Infinity;

    RENDER_FIELDS.forEach((item, idx) => {
      const cardEl = cardRefs.current[item.renderKey];
      if (!cardEl) return;
      const r = cardEl.getBoundingClientRect();
      const cardCenter = r.left + r.width / 2;
      const dist = Math.abs(cardCenter - centerX);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = idx;
      }

      const d = (cardCenter - centerX) / step;
      const clamped = Math.max(-2.4, Math.min(2.4, d));
      const absClamped = Math.min(Math.abs(clamped), 1.3);
      const isMain = Math.abs(clamped) < 0.12;
      // Más marcado que el de AT (28deg): son tarjetitas de una sola
      // palabra, aguantan un ángulo mayor sin volverse ilegibles, y
      // así se nota más el efecto "cilindro" que pidió.
      const rotateY = clamped * -42;
      const scale = isMain ? 1.08 : 1 - absClamped * 0.22;
      const opacity = 1 - Math.min(Math.abs(clamped), 1.8) * 0.32;

      cardEl.style.transform = `perspective(900px) rotateY(${rotateY}deg) scale(${scale})`;
      cardEl.style.opacity = String(Math.max(0.25, opacity));
      cardEl.style.zIndex = String(Math.round(200 - Math.abs(d) * 20));
    });

    closestRenderIndexRef.current = closestIdx;
  }, [RENDER_FIELDS]);

  const recenterIfNeeded = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const n = fields.length;
    const idx = closestRenderIndexRef.current;
    if (idx < n) {
      track.scrollLeft += n * stepRef.current;
      closestRenderIndexRef.current = idx + n;
    } else if (idx >= n * 2) {
      track.scrollLeft -= n * stepRef.current;
      closestRenderIndexRef.current = idx - n;
    }
  }, [fields.length]);

  // Centrado inicial (copia del medio, primera palabra) + primer
  // cálculo del coverflow, ya con las 36 tarjetas en el DOM con su
  // tamaño real.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const target = RENDER_FIELDS[fields.length];
      centerCardInstant(trackRef.current, target && cardRefs.current[target.renderKey]);
      updateCoverflow();
    });
    return () => cancelAnimationFrame(id);
  }, [RENDER_FIELDS, fields.length, updateCoverflow]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    let rafId = null;
    const onScroll = () => {
      if (rafId != null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        updateCoverflow();
      });
      if (recenterTimeoutRef.current) clearTimeout(recenterTimeoutRef.current);
      recenterTimeoutRef.current = setTimeout(recenterIfNeeded, 140);
    };
    track.addEventListener('scroll', onScroll, { passive: true });

    const doc = track.ownerDocument;
    const view = doc?.defaultView;
    let ro;
    if (typeof ResizeObserver !== 'undefined' && doc) {
      ro = new ResizeObserver(onScroll);
      ro.observe(doc.documentElement);
    } else {
      view?.addEventListener('resize', onScroll);
    }

    return () => {
      track.removeEventListener('scroll', onScroll);
      if (ro) ro.disconnect();
      else view?.removeEventListener('resize', onScroll);
      if (rafId != null) cancelAnimationFrame(rafId);
      if (recenterTimeoutRef.current) clearTimeout(recenterTimeoutRef.current);
    };
  }, [updateCoverflow, recenterIfNeeded]);

  const scrollByStep = useCallback(
    (dir) => {
      const cur = closestRenderIndexRef.current ?? fields.length;
      scrollToIndex(cur + dir);
    },
    [scrollToIndex, fields.length]
  );

  const markInteraction = useCallback(() => {
    lastInteractionRef.current = Date.now();
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    const events = ['pointerdown', 'wheel', 'touchstart'];
    events.forEach((ev) => track.addEventListener(ev, markInteraction, { passive: true }));
    return () => events.forEach((ev) => track.removeEventListener(ev, markInteraction));
  }, [markInteraction]);

  // Wheel vertical -> paso horizontal (mismo motivo que en
  // SpecializationAreas: `overflow-x-auto` no reacciona solo a la
  // ruedita vertical de siempre).
  const lastWheelRef = useRef(0);
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    const handleWheel = (e) => {
      const absY = Math.abs(e.deltaY);
      const absX = Math.abs(e.deltaX);
      if (absX > absY || absY < 12) return;
      e.preventDefault();
      const now = Date.now();
      if (now - lastWheelRef.current < 450) return;
      lastWheelRef.current = now;
      scrollByStep(e.deltaY > 0 ? 1 : -1);
    };
    track.addEventListener('wheel', handleWheel, { passive: false });
    return () => track.removeEventListener('wheel', handleWheel);
  }, [scrollByStep]);

  // Auto-avance — pausado con el mouse encima o si hubo actividad
  // reciente del usuario, para no pelearse con quien está scrolleando/
  // arrastrando a mano.
  useEffect(() => {
    const id = setInterval(() => {
      if (hoveringRef.current) return;
      if (Date.now() - lastInteractionRef.current < IDLE_BEFORE_AUTOPLAY_MS) return;
      scrollByStep(1);
    }, AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(id);
  }, [scrollByStep]);

  return (
    <div className="relative">
      {/* Breakout a 100vw, mismo truco que el carrusel de Áreas de AT
          (ver SpecializationAreas.jsx) — se sale del ancho normal del
          contenido para sentirse como su propia vitrina. La sección
          que lo contiene (DocenciaInvestigacion.jsx) ya tiene
          `overflow-x-hidden` como red de seguridad. */}
      <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
        <div className="relative">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 sm:w-24 bg-gradient-to-r from-[#D6E9F7] dark:from-[#001F3D] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 sm:w-24 bg-gradient-to-l from-[#D6E9F7] dark:from-[#001F3D] to-transparent z-10" />

          <div
            ref={trackRef}
            onMouseEnter={() => {
              hoveringRef.current = true;
            }}
            onMouseLeave={() => {
              hoveringRef.current = false;
            }}
            className="flex items-center gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory select-none px-[calc((100%-9rem)/2)] sm:px-[calc((100%-11rem)/2)] py-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {RENDER_FIELDS.map((item) => (
              <div
                key={item.renderKey}
                ref={(el) => {
                  cardRefs.current[item.renderKey] = el;
                }}
                onClick={() => {
                  markInteraction();
                  if (item.renderIndex === closestRenderIndexRef.current) return;
                  scrollToIndex(item.renderIndex);
                }}
                className="shrink-0 snap-center w-36 h-20 sm:w-44 sm:h-24 cursor-pointer will-change-transform"
              >
                {/* Tarjeta de "cristal": fondo blanco casi transparente +
                    blur, sin color propio — se apoya en lo que hay
                    detrás (la card navy de arriba, el fondo de la
                    sección) para el efecto vidrio esmerilado. */}
                <div className="relative w-full h-full rounded-2xl flex items-center justify-center text-center px-3 bg-white/30 dark:bg-white/10 backdrop-blur-md border border-white/60 dark:border-white/15 shadow-[0_10px_28px_-10px_rgba(0,51,102,0.4)]">
                  <span
                    aria-hidden="true"
                    className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/40 to-transparent"
                  />
                  <span className="relative text-xs sm:text-sm font-semibold text-[#003366] dark:text-white leading-snug">
                    {item.field}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 mt-4">
        <button
          type="button"
          onClick={() => {
            markInteraction();
            scrollByStep(-1);
          }}
          aria-label="Anterior"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/70 dark:bg-white/10 border border-[#0077C8]/25 dark:border-white/15 text-[#0077C8] dark:text-[#9FC6E8] flex items-center justify-center shrink-0 hover:bg-white dark:hover:bg-white/20 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            markInteraction();
            scrollByStep(1);
          }}
          aria-label="Siguiente"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/70 dark:bg-white/10 border border-[#0077C8]/25 dark:border-white/15 text-[#0077C8] dark:text-[#9FC6E8] flex items-center justify-center shrink-0 hover:bg-white dark:hover:bg-white/20 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
