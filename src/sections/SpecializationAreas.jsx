import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import KickerBadge from '../components/KickerBadge';
import { ETIQUETAS, getEtiqueta } from '../data/etiquetas';
import { PROYECTOS_AT } from '../data/proyectosData';
import EscudoICAP from '../components/EscudoICAP';

// Carrusel horizontal a todo el ancho con una tarjeta por cada una de las
// 14 etiquetas de etiquetas.js (las mismas con que se clasifican los
// proyectos). Se recorre deslizando o con flechas/puntitos. El contenido
// de cada tarjeta sale de los proyectos con esa etiqueta (cantidad,
// clientes, los más recientes y con qué otras etiquetas suele
// combinarse) — ver resumirEtiqueta.
const AREAS = ETIQUETAS;

const mesActual = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

function resumirEtiqueta(id, ahora) {
  const proyectos = PROYECTOS_AT.filter((p) => p.etiquetas.includes(id)).sort((a, b) =>
    b.desde.localeCompare(a.desde)
  );
  const vecinas = {};
  proyectos.forEach((p) =>
    p.etiquetas.forEach((otra) => {
      if (otra !== id) vecinas[otra] = (vecinas[otra] || 0) + 1;
    })
  );
  return {
    total: proyectos.length,
    clientes: new Set(proyectos.map((p) => p.cliente)).size,
    activos: proyectos.filter((p) => p.hasta >= ahora).length,
    recientes: proyectos.slice(0, 3),
    combina: Object.entries(vecinas)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([otra]) => otra)
  };
}

// La tarjeta que queda armada en el centro al entrar (la "principal").
const DEFAULT_AREA_ID = 'politica';
const DEFAULT_AREA_INDEX = Math.max(0, AREAS.findIndex((a) => a.id === DEFAULT_AREA_ID));

// Carrusel "infinito": el arreglo se repite 3 veces (copia anterior +
// real + siguiente) y el carril arranca en la copia del MEDIO. Cuando el
// scroll se queda quieto y la tarjeta activa cayó en una copia de los
// extremos, se salta en silencio (las copias son idénticas) de vuelta a
// la del medio, así siempre hay margen para girar a los dos lados.
const LOOPS = 3;

// Mismo celeste institucional para todas: degradado + brillo radial
// arriba-izquierda. Junto con el box-shadow de .area-card (global.css) da
// la ilusión 3D sin transforms.
const CARD_BACKGROUND =
  'radial-gradient(65% 70% at 14% -8%, rgba(255,255,255,0.4), transparent 42%), ' +
  'linear-gradient(160deg, #0090DD 0%, #0068AE 48%, #013A63 100%)';

// Rotación de entrada por tarjeta, desprolija a propósito (alterna lado
// y tamaño), como una baraja recién repartida. Se reparte en ciclo
// (índice % 6).
const SHUFFLE_ROTATE = [-16, 12, -20, 15, -12, 19];

// Textos de la UI del carrusel (flechas, puntos): sólo aria-label, por
// eso viven acá y no en translations.js.
const UI = {
  es: {
    prev: 'Área anterior',
    next: 'Área siguiente',
    goTo: (name) => `Ir a ${name}`
  },
  en: {
    prev: 'Previous area',
    next: 'Next area',
    goTo: (name) => `Go to ${name}`
  }
};

// Centra una tarjeta en el carril sin animación (corrección de entrada,
// antes de mostrar nada). No usa `scrollToIndex` porque el
// IntersectionObserver puede disparar antes de que React corra el efecto
// que lo deja accesible; pasando `track`/`cardEl` directo se evita esa
// carrera.
function centerCardInstant(track, cardEl) {
  if (!track || !cardEl) return;
  const target = cardEl.offsetLeft - (track.clientWidth - cardEl.clientWidth) / 2;
  track.scrollTo({ left: target, behavior: 'instant' });
}

/**
 * Rayita de luz celeste con puntas de flecha + estela difuminada: la
 * misma técnica que KickerBadge variant="glow", bajo el título de cada
 * tarjeta.
 */
function CardLightStreak() {
  return (
    <span aria-hidden="true" className="relative block h-[8px] w-[58%] kicker-light-sweep pointer-events-none">
      <span className="absolute inset-0 blur-[3px] opacity-80 bg-[linear-gradient(90deg,transparent,rgba(79,178,242,0.55)_18%,#5cc9ff_40%,#7dd3fc_50%,#5cc9ff_60%,rgba(79,178,242,0.55)_82%,transparent)]" />
      <span className="absolute left-[8%] right-[8%] top-1/2 -translate-y-1/2 h-[2px] bg-[linear-gradient(90deg,#4FB2F2,#7dd3fc_42%,#ffffff_50%,#7dd3fc_58%,#4FB2F2)] [clip-path:polygon(0%_50%,16%_0%,84%_0%,100%_50%,84%_100%,16%_100%)]" />
    </span>
  );
}

export default function SpecializationAreas({ onNavigate }) {
  const { t, lang } = useLanguage();
  const ui = UI[lang] || UI.es;
  const tA = t.specializationAreas;
  const nombre = (e) => e[lang === 'en' ? 'en' : 'es'];
  const resumenes = useMemo(() => {
    const ahora = mesActual();
    return Object.fromEntries(AREAS.map((e) => [e.id, resumirEtiqueta(e.id, ahora)]));
  }, []);

  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  // La llave es `renderKey` (única por tarjeta física): el mismo id de
  // área se repite en las 3 copias (ver RENDER_AREAS).
  const cardRefs = useRef({});
  // `activeIndex` es el índice del área real (para el puntito). La copia
  // física donde está el carril vive aparte, en closestRenderIndexRef.
  const [activeIndex, setActiveIndex] = useState(DEFAULT_AREA_INDEX);

  // Las 18 tarjetas físicas (3 copias de las 6 áreas) — se arma una
  // sola vez, nunca cambia entre renders.
  const RENDER_AREAS = useMemo(
    () =>
      Array.from({ length: LOOPS * AREAS.length }, (_, i) => {
        const baseIndex = i % AREAS.length;
        return {
          ...AREAS[baseIndex],
          baseIndex,
          renderIndex: i,
          renderKey: `copy${Math.floor(i / AREAS.length)}-${AREAS[baseIndex].id}`
        };
      }),
    []
  );
  // Índice (dentro de RENDER_AREAS) de la tarjeta física más cercana al
  // centro: lo escribe updateCoverflow en cada frame de scroll y lo leen
  // scrollByStep/scrollToBaseIndex/el recentrado, sin re-render.
  const closestRenderIndexRef = useRef(AREAS.length + DEFAULT_AREA_INDEX);
  // Distancia (en px) entre el centro de dos tarjetas consecutivas, medida
  // en vivo por updateCoverflow; se usa para el salto de recentrado
  // (exactamente AREAS.length pasos).
  const stepRef = useRef(300);
  const recenterTimeoutRef = useRef(null);

  // Fase de entrada:
  //  'hidden'  — fuera de pantalla: invisible, chiquita y rotada
  //              (SHUFFLE_ROTATE).
  //  'stacked' — aparecen todas de golpe, todavía giradas/achicadas.
  //  'dealt'   — cada una gira a 0°, crece y se asienta, una detrás de otra
  //              (delay escalonado por índice).
  // Nunca se hace unobserve: si la sección sale de pantalla vuelve a
  // 'hidden' y la entrada se repite.
  const [phase, setPhase] = useState('hidden');

  // `settled`: true cuando el reparto ('dealt') terminó. Desde ahí el
  // coverflow controla transform/opacity de cada tarjeta escribiendo
  // directo al DOM, y React deja de fijar esas propiedades (si no, pisaría
  // lo que escribe el scroll). `settledRef` es la misma bandera, legible
  // desde el listener de scroll.
  const [settled, setSettled] = useState(false);
  const settledRef = useRef(false);

  useEffect(() => {
    settledRef.current = settled;
  }, [settled]);

  useEffect(() => {
    if (phase !== 'dealt') {
      setSettled(false);
      return undefined;
    }
    // La última tarjeta en llegar es la de índice más alto (delay =
    // (n-1)*70ms) y tarda 650ms más; recién ahí se le entrega el control al
    // scroll.
    const settleMs = (AREAS.length - 1) * 70 + 650 + 80;
    const id = setTimeout(() => setSettled(true), settleMs);
    return () => clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;

    // El IntersectionObserver sale del window dueño del documento (no del
    // global) para que funcione también dentro del iframe de "Vista Móvil".
    const view = el.ownerDocument?.defaultView;
    const IO = view?.IntersectionObserver;
    let dealTimeoutId;

    if (!IO) {
      setPhase('dealt');
      return undefined;
    }

    const observer = new IO(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Antes de mostrar nada (fase 'hidden', opacidad 0) el carril se centra
            // de una en la tarjeta por defecto, en la copia del medio, para que el
            // reparto ocurra ya en su lugar.
            {
              const targetArea = RENDER_AREAS[AREAS.length + DEFAULT_AREA_INDEX];
              centerCardInstant(trackRef.current, targetArea && cardRefs.current[targetArea.renderKey]);
            }
            setPhase('stacked');
            dealTimeoutId = setTimeout(() => setPhase('dealt'), 420);
          } else {
            if (dealTimeoutId) clearTimeout(dealTimeoutId);
            setPhase('hidden');
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (dealTimeoutId) clearTimeout(dealTimeoutId);
    };
  }, []);

  // `behavior: 'instant'` para la corrección de entrada; 'smooth' (default)
  // para flechas y puntitos. `idx` es un índice dentro de RENDER_AREAS
  // (una de las 3 copias) — para ir a un área por su id, scrollToBaseIndex.
  const scrollToIndex = useCallback(
    (idx, behavior = 'smooth') => {
      const track = trackRef.current;
      const clamped = Math.max(0, Math.min(RENDER_AREAS.length - 1, idx));
      const area = RENDER_AREAS[clamped];
      const cardEl = area && cardRefs.current[area.renderKey];
      if (!track || !cardEl) return;
      const target = cardEl.offsetLeft - (track.clientWidth - cardEl.clientWidth) / 2;
      track.scrollTo({ left: target, behavior });
    },
    [RENDER_AREAS]
  );

  // Ir a un área por su id (puntitos): elige, de las 3 copias, la más
  // cercana a donde está el carril, para que el salto sea corto.
  const scrollToBaseIndex = useCallback(
    (baseIdx, behavior = 'smooth') => {
      const n = AREAS.length;
      const cur = closestRenderIndexRef.current ?? n + baseIdx;
      let best = baseIdx;
      let bestDist = Infinity;
      for (let copy = 0; copy < LOOPS; copy++) {
        const candidate = copy * n + baseIdx;
        const dist = Math.abs(candidate - cur);
        if (dist < bestDist) {
          bestDist = dist;
          best = candidate;
        }
      }
      scrollToIndex(best, behavior);
    },
    [scrollToIndex]
  );

  // Efecto "coverflow": cada tarjeta se gira en 3D según su distancia a la
  // del centro. La del centro queda plana y un poco más grande; las de los
  // costados se inclinan hacia el centro, achicadas y más transparentes. Al
  // soltar, `snap-center` centra la más cercana y queda plana sola.
  //
  // Corre en cada frame de scroll (un solo rAF pendiente a la vez) y
  // escribe el transform directo en el DOM vía refs; React sólo
  // re-renderiza cuando cambia el índice activo.
  const updateCoverflow = useCallback(() => {
    if (!settledRef.current) return;
    const track = trackRef.current;
    if (!track) return;

    const trackRect = track.getBoundingClientRect();
    const centerX = trackRect.left + trackRect.width / 2;

    // Distancia entre el centro de dos tarjetas consecutivas, medida en vivo
    // para que sirva en cualquier breakpoint. Se guarda en stepRef para el
    // recentrado.
    const firstEl = cardRefs.current[RENDER_AREAS[0].renderKey];
    const secondEl = cardRefs.current[RENDER_AREAS[1].renderKey];
    let step = firstEl ? firstEl.getBoundingClientRect().width + 24 : 300;
    if (firstEl && secondEl) {
      const a = firstEl.getBoundingClientRect();
      const b = secondEl.getBoundingClientRect();
      step = b.left + b.width / 2 - (a.left + a.width / 2) || step;
    }
    stepRef.current = step;

    let closestIdx = 0;
    let closestDist = Infinity;

    RENDER_AREAS.forEach((area, idx) => {
      const cardEl = cardRefs.current[area.renderKey];
      if (!cardEl) return;
      const r = cardEl.getBoundingClientRect();
      const cardCenter = r.left + r.width / 2;
      const dist = Math.abs(cardCenter - centerX);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = idx;
      }

      const d = (cardCenter - centerX) / step;
      const clamped = Math.max(-2.2, Math.min(2.2, d));
      const absClamped = Math.min(Math.abs(clamped), 1);
      const isMain = Math.abs(clamped) < 0.12;
      const rotateY = clamped * -28;
      const scale = isMain ? 1.045 : 1 - absClamped * 0.16;
      const opacity = 1 - Math.min(Math.abs(clamped), 1.6) * 0.3;

      cardEl.style.transform = `perspective(1300px) rotateY(${rotateY}deg) scale(${scale})`;
      cardEl.style.opacity = String(Math.max(0.32, opacity));
      cardEl.style.zIndex = String(Math.round(200 - Math.abs(d) * 20));
    });

    closestRenderIndexRef.current = closestIdx;
    const baseIdx = closestIdx % AREAS.length;
    setActiveIndex((prev) => (prev === baseIdx ? prev : baseIdx));
  }, [RENDER_AREAS]);

  // Auto-recentrado del carrusel infinito: cuando el scroll se queda quieto
  // (debounce), si la tarjeta activa cayó en la copia de un extremo se
  // salta EN SILENCIO (scrollLeft directo, sin transición) a la copia del
  // medio.
  const recenterIfNeeded = useCallback(() => {
    const track = trackRef.current;
    if (!track || !settledRef.current) return;
    const n = AREAS.length;
    const idx = closestRenderIndexRef.current;
    if (idx < n) {
      track.scrollLeft += n * stepRef.current;
      closestRenderIndexRef.current = idx + n;
    } else if (idx >= n * 2) {
      track.scrollLeft -= n * stepRef.current;
      closestRenderIndexRef.current = idx - n;
    }
  }, []);

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

    // Recalcular también al cambiar el tamaño (ResizeObserver sobre el
    // documento dueño de la sección, así funciona en el iframe de "Vista
    // Móvil").
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

  // Cuando el reparto termina (`settled`) el coverflow toma el control. El
  // carril ya estaba centrado desde antes del reparto, así que sólo falta
  // el primer cálculo. Ese primer cuadro lleva una transición CSS corta
  // para que el paso de plana a inclinada no sea brusco; se quita enseguida
  // porque, mientras se scrollea, el coverflow tiene que responder pixel a
  // pixel.
  useEffect(() => {
    if (!settled) return undefined;
    RENDER_AREAS.forEach((area) => {
      const el = cardRefs.current[area.renderKey];
      if (el) {
        el.style.transition =
          'transform 560ms cubic-bezier(0.16,1,0.3,1), opacity 560ms cubic-bezier(0.16,1,0.3,1)';
      }
    });
    const rafId = requestAnimationFrame(updateCoverflow);
    const clearId = setTimeout(() => {
      RENDER_AREAS.forEach((area) => {
        const el = cardRefs.current[area.renderKey];
        if (el) el.style.transition = '';
      });
    }, 580);
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(clearId);
    };
  }, [settled, updateCoverflow, RENDER_AREAS]);

  // Las flechas avanzan/retroceden un paso desde donde está el carril
  // (closestRenderIndexRef). Con el carril infinito no hay extremos.
  const scrollByStep = useCallback(
    (dir) => {
      const cur = closestRenderIndexRef.current ?? AREAS.length + DEFAULT_AREA_INDEX;
      scrollToIndex(cur + dir);
    },
    [scrollToIndex]
  );

  // Rueda del mouse sobre el carril: un contenedor con `overflow-x-auto` no
  // se mueve con el scroll vertical, así que ese gesto se traduce a
  // siguiente/anterior (`scrollByStep`). Un gesto ya horizontal (deltaX
  // manda sobre deltaY) se deja pasar al scroll nativo.
  const lastWheelRef = useRef(0);
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    const handleWheel = (e) => {
      if (!settledRef.current) return;
      const absY = Math.abs(e.deltaY);
      const absX = Math.abs(e.deltaX);
      if (absX > absY || absY < 12) return;
      e.preventDefault();
      // Throttle: un solo paso por gesto (una ruedita dispara varios eventos
      // por cada clic físico).
      const now = Date.now();
      if (now - lastWheelRef.current < 550) return;
      lastWheelRef.current = now;
      scrollByStep(e.deltaY > 0 ? 1 : -1);
    };

    track.addEventListener('wheel', handleWheel, { passive: false });
    return () => track.removeEventListener('wheel', handleWheel);
  }, [scrollByStep]);

  return (
    <section ref={sectionRef} className="pt-[var(--docencia-gap)] pb-10 sm:pb-16 bg-[#D6E9F7] dark:bg-[#001F3D] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-8 sm:mb-10 text-center">
          <div className="mb-1 sm:mb-1.5">
            <KickerBadge variant="glow">{t.specializationAreas.kicker}</KickerBadge>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#003366] dark:text-[#9FC6E8] tracking-tight">
            {t.specializationAreas.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1.5 max-w-md mx-auto">
            {t.specializationAreas.subtitle}
          </p>
        </div>
      </div>

      {/* Breakout a 100vw: el encabezado queda en el contenedor centrado
          (max-w-5xl) y el carrusel ocupa todo el ancho. `body` tiene
          overflow-x:hidden (global.css), así el -mx-[50vw] nunca genera scroll
          horizontal. */}
      <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen mt-2 sm:mt-4">
        <div className="relative">
          {/* Degradés en los bordes para que las tarjetas no corten en
              seco contra la orilla de la pantalla — se "disuelven" en
              el color de fondo de la sección, en vez de un corte recto. */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-r from-[#D6E9F7] dark:from-[#001F3D] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-l from-[#D6E9F7] dark:from-[#001F3D] to-transparent z-10" />

          {/* Padding lateral = mitad del espacio que sobra entre el carril y la
              tarjeta: calc((100% - min(88vw,460px)) / 2), el mismo ancho que tienen
              las tarjetas (w-[88vw] max-w-[460px]). Así la primera y la última
              también pueden quedar perfectamente centradas. */}
          <div
            ref={trackRef}
            className="flex items-stretch gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory px-[calc((100%-min(88vw,460px))/2)] py-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {RENDER_AREAS.map((area) => {
              const Icon = area.icon;
              const resumen = resumenes[area.id];
              // El ángulo de entrada va por baseIndex (no por posición en
              // RENDER_AREAS) para que la misma área se vea igual en sus 3 copias.
              const rotateStart = SHUFFLE_ROTATE[area.baseIndex % SHUFFLE_ROTATE.length];

              return (
                <div
                  key={area.renderKey}
                  ref={(el) => {
                    cardRefs.current[area.renderKey] = el;
                  }}
                  // Tocar una tarjeta de los costados la trae al centro (en mobile el swipe
                  // horizontal se puede confundir con el scroll de la página). Se ignora
                  // en la tarjeta ya centrada y mientras el reparto de entrada no terminó
                  // (`settledRef`).
                  onClick={() => {
                    if (!settledRef.current) return;
                    if (area.renderIndex === closestRenderIndexRef.current) return;
                    scrollToIndex(area.renderIndex);
                  }}
                  className={`self-stretch shrink-0 snap-center w-[88vw] max-w-[460px] sm:w-[460px] ${
                    settled && area.baseIndex !== activeIndex ? 'cursor-pointer' : ''
                  }`}
                  style={
                    settled
                      ? // A partir de acá el coverflow (updateCoverflow,
                        // más arriba) es dueño absoluto de transform/
                        // opacity/zIndex — si React siguiera fijando un
                        // valor acá en cada render (por ejemplo cuando
                        // cambia `activeIndex`), pisaría lo que el
                        // scroll recién escribió directo en el DOM.
                        undefined
                      : {
                          opacity: phase === 'hidden' ? 0 : 1,
                          zIndex: 'auto',
                          transform:
                            phase === 'hidden'
                              ? `rotate(${rotateStart}deg) scale(0.8) translateY(22px)`
                              : phase === 'stacked'
                                ? `rotate(${rotateStart * 0.55}deg) scale(0.88) translateY(6px)`
                                : 'rotate(0deg) scale(1) translateY(0)',
                          transitionProperty: 'opacity, transform',
                          transitionDuration: phase === 'dealt' ? '650ms' : '380ms',
                          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                          transitionDelay: phase === 'dealt' ? `${area.baseIndex * 70}ms` : '0ms'
                        }
                  }
                >
                  <article
                    className="area-card group relative rounded-[28px] p-5 sm:p-6 overflow-hidden flex flex-col items-center text-center text-white h-full"
                    style={{ background: CARD_BACKGROUND }}
                  >
                    {/* Marca de agua: el escudo siempre blanco (el fondo de la tarjeta es
                        celeste en los dos temas y el navy no contrastaría), con opacidad baja
                        para no competir con el texto. */}
                    <EscudoICAP
                      tono="white"
                      className="absolute left-1/2 top-[58%] w-[95%] -translate-x-1/2 -translate-y-1/2 rotate-[-6deg] opacity-[0.12] pointer-events-none"
                    />

                    {/* Hairline superior, apenas insinuada — el toque de
                        "borde pulido" en vez del acento de color de antes. */}
                    <span
                      aria-hidden="true"
                      className="absolute top-0 left-7 right-7 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
                    />

                    {/* Encabezado en fila (ícono a la izquierda, nombre y
                        conteo a la derecha) para que la tarjeta sea más
                        ancha que alta. El círculo va relleno con el color
                        de la etiqueta, con el halo celeste de AT detrás. */}
                    <div className="relative w-full flex items-center gap-4 text-left">
                      <div className="relative shrink-0">
                        <span
                          aria-hidden="true"
                          className="absolute -inset-2 rounded-full bg-[#BFE6FF]/35 blur-md kicker-glow-halo pointer-events-none"
                        />
                        <div
                          className="relative w-14 h-14 rounded-full border-2 border-white/60 flex items-center justify-center shadow-lg"
                          style={{ backgroundColor: area.color, color: area.text }}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-heading font-extrabold text-lg sm:text-xl text-white leading-tight">
                          {nombre(area)}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-white/70 mt-0.5">{tA.projectsSuffix(resumen.total)}</p>
                      </div>
                    </div>

                    {/* w-full + flex: CardLightStreak sólo tiene hijos
                        absolutos (0px de intrínseco), sin un ancho
                        explícito la rayita queda con width:0. */}
                    <div className="relative mt-3 mb-3 w-full flex justify-start">
                      <CardLightStreak />
                    </div>

                    <div className="relative grid grid-cols-3 gap-2 w-full mb-3">
                      {[
                        [resumen.total, tA.projects],
                        [resumen.clientes, tA.clients],
                        [resumen.activos, tA.ongoing]
                      ].map(([valor, etq]) => (
                        <div key={etq} className="rounded-2xl bg-white/10 border border-white/10 py-1.5">
                          <div className="font-heading font-extrabold text-xl leading-none">{valor}</div>
                          <div className="text-[10px] text-white/75 mt-1">{etq}</div>
                        </div>
                      ))}
                    </div>

                    <div className="relative w-full text-left mb-3">
                      <span className="block text-[10px] font-heading font-bold uppercase tracking-[0.12em] text-white/60 mb-1.5">
                        {tA.latest}
                      </span>
                      <ul className="space-y-1">
                        {resumen.recientes.map((p) => (
                          <li
                            key={p.id}
                            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/10 border border-white/10 text-[11px] sm:text-xs text-white/90 leading-snug"
                            title={p.titulo}
                          >
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: area.color }} />
                            <span className="truncate">{p.titulo}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {resumen.combina.length > 0 && (
                      <div className="relative w-full text-left mb-4">
                        <span className="block text-[10px] font-heading font-bold uppercase tracking-[0.12em] text-white/60 mb-1.5">
                          {tA.combines}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {resumen.combina.map((otra) => {
                            const e = getEtiqueta(otra);
                            return (
                              <span
                                key={otra}
                                className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] sm:text-[11px] text-white/90"
                              >
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: e.color }} />
                                {nombre(e)}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        onNavigate?.('proyectos', { etiqueta: area.id });
                      }}
                      className="relative mt-auto w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white text-[#003366] font-heading font-bold text-xs sm:text-sm shadow-lg hover:bg-[#EAF6FF] active:scale-[0.98] transition-all"
                    >
                      {tA.seeRelated}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </article>
                </div>
              );
            })}
          </div>
        </div>

        {/* Controles del carrusel: flechas para ir de a una y puntitos para
            saltar directo a cualquier área, centrados bajo el carril. */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-center gap-3 sm:gap-4 mt-1 sm:mt-2">
          <button
            type="button"
            onClick={() => scrollByStep(-1)}
            aria-label={ui.prev}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/70 dark:bg-white/10 border border-[#0077C8]/25 dark:border-white/15 text-[#0077C8] dark:text-[#9FC6E8] flex items-center justify-center shrink-0 hover:bg-white dark:hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="w-4.5 h-4.5" />
          </button>

          <div className="flex items-center gap-2">
            {AREAS.map((area, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => scrollToBaseIndex(idx)}
                  aria-label={ui.goTo(nombre(area))}
                  aria-current={isActive}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isActive ? 'w-6 bg-[#0077C8] dark:bg-[#4FB2F2]' : 'w-2 bg-[#0077C8]/25 dark:bg-white/25 hover:bg-[#0077C8]/50 dark:hover:bg-white/45'
                  }`}
                />
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => scrollByStep(1)}
            aria-label={ui.next}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/70 dark:bg-white/10 border border-[#0077C8]/25 dark:border-white/15 text-[#0077C8] dark:text-[#9FC6E8] flex items-center justify-center shrink-0 hover:bg-white dark:hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
