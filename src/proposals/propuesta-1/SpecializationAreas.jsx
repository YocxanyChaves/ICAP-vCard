import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import KickerBadge from './KickerBadge';
import { ETIQUETAS, getEtiqueta } from './etiquetas';
import { PROYECTOS_AT } from './proyectosData';
import EscudoICAP from '../../components/EscudoICAP';

// Antes esta sección abría el detalle de cada área en un modal/bottom
// sheet aparte (había que tocar la tarjeta para leer la descripción y
// las líneas de trabajo). Después pasó a un grid de 2 columnas con todo
// el contenido a la vista. Ahora, a pedido de Yocxany (inspirado en
// brand.squarespace.com — el menú numerado de tarjetas que se recorre
// con scroll/flechitas), es un carrusel horizontal a todo el ancho de
// pantalla: se "pasea" entre las 6 áreas deslizando o con las flechas/
// puntitos, en vez de leerlas todas apiladas en una columna.
// Las tarjetas son las 14 etiquetas de etiquetas.js (las mismas con que
// se clasifican los proyectos). El contenido de cada una no es texto
// redactado aparte: sale de los proyectos que llevan esa etiqueta
// (cantidad, clientes, los más recientes y con qué otras etiquetas
// suele combinarse) — ver resumirEtiqueta más abajo.
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
// Antes era "Proyectos" de las 6 áreas originales; con las 14 etiquetas
// arranca en Política pública — acá queda como constante para que
// cambiarla el día de mañana sea de una sola línea.
const DEFAULT_AREA_ID = 'politica';
const DEFAULT_AREA_INDEX = Math.max(0, AREAS.findIndex((a) => a.id === DEFAULT_AREA_ID));

// Carrusel "infinito": en vez de renderizar las 6 tarjetas una sola
// vez (una tira con principio y fin), se repite el arreglo 3 veces
// seguidas (copia anterior + copia real + copia siguiente) y el
// carril arranca parado en la copia del MEDIO. Así siempre hay
// tarjetas de sobra a los dos lados para seguir girando en cualquier
// dirección — cuando el scroll se queda quieto (ver el debounce de
// "recenter" más abajo) y la tarjeta activa cayó en una copia de los
// extremos, se salta en silencio (sin animación, ni un pixel distinto
// en pantalla porque las copias son pixel-idénticas) de vuelta a la
// copia del medio, dejando otra vez margen de sobra de los dos lados.
// Es la misma técnica que usan los carruseles "infinitos" de
// librerías tipo Swiper, sólo que a mano.
const LOOPS = 3;

// Mismo celeste institucional para las 6 — un degradado (no un color
// plano) más un brillo radial arriba-izquierda, como si la superficie
// fuera ligeramente curva/pulida. Esa combinación es la que da la
// "ilusión 3D" (ver también el box-shadow de .area-card en
// global.css), sin usar ningún transform real ni animación.
const CARD_BACKGROUND =
  'radial-gradient(65% 70% at 14% -8%, rgba(255,255,255,0.4), transparent 42%), ' +
  'linear-gradient(160deg, #0090DD 0%, #0068AE 48%, #013A63 100%)';

// Rotación de "shuffle" de entrada por tarjeta — no es una rotación
// pareja tipo abanico (como el mazo de DocenciaImpacto), es más
// desprolija a propósito, alternando de lado y de tamaño, para que se
// sienta como una baraja recién repartida y no como un patrón
// geométrico perfecto. Se reparten en ciclo (índice % 6) entre las 14.
const SHUFFLE_ROTATE = [-16, 12, -20, 15, -12, 19];

// Textitos de la UI del carrusel (flechas, puntos) — viven acá, no en
// translations.js, porque son sólo aria-label (nunca texto visible en
// pantalla) y así no hay que tocar el diccionario grande por un cambio
// tan chiquito.
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

// Centra una tarjeta en el carril, sin animación de scroll (se usa
// sólo para la corrección instantánea de entrada, antes de mostrar
// nada). Vive fuera del componente — a propósito NO usa el callback
// `scrollToIndex` de más abajo: ese depende de un useEffect para
// quedar accesible desde el IntersectionObserver (mismo patrón que
// settledRef), y el IntersectionObserver puede disparar su primer
// callback ANTES de que React llegue a correr ese efecto (es una
// tarea del navegador, no de React, así que no hay garantía de orden
// entre los dos) — pasando `track`/`cardEl` directo se evita esa
// carrera del todo.
function centerCardInstant(track, cardEl) {
  if (!track || !cardEl) return;
  const target = cardEl.offsetLeft - (track.clientWidth - cardEl.clientWidth) / 2;
  track.scrollTo({ left: target, behavior: 'instant' });
}

/**
 * Rayita de luz celeste con puntas de flecha + estela difuminada detrás
 * — el "toque de luz distintivo de AT" que Yocxany pidió reusar acá
 * (es exactamente la misma técnica de KickerBadge variant="glow": ver
 * ese componente para toda la historia de cómo se llegó a esta forma/
 * color). Se repite tal cual bajo el título de cada tarjeta para que
 * las 6 áreas se sientan "de la misma familia" que los kickers de AT.
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
  // Antes cardRefs iba llave por `area.id` (6 llaves únicas). Con el
  // carrusel infinito el mismo id se repite 3 veces (una por copia),
  // así que ahora la llave es `renderKey` (única por tarjeta física
  // en pantalla, no por área) — ver RENDER_AREAS más abajo.
  const cardRefs = useRef({});
  // `activeIndex` sigue siendo 0-5 (para resaltar el puntito correcto,
  // que sólo representa las 6 áreas reales, no cada copia). La copia
  // física donde está parado el carril en cada momento vive aparte, en
  // closestRenderIndexRef.
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
  // Índice (dentro de RENDER_AREAS, 0-17) de la tarjeta física más
  // cercana al centro ahora mismo — lo escribe updateCoverflow en cada
  // frame de scroll y lo leen scrollByStep/scrollToBaseIndex/el
  // recentrado, sin depender de un re-render.
  const closestRenderIndexRef = useRef(AREAS.length + DEFAULT_AREA_INDEX);
  // Distancia (en px) entre el centro de dos tarjetas consecutivas,
  // medida en vivo por updateCoverflow — se reusa acá para calcular
  // el salto de "recentrado" (exactamente AREAS.length pasos).
  const stepRef = useRef(300);
  const recenterTimeoutRef = useRef(null);

  // Fase de entrada — mismo espíritu de "llegan juntas y después se
  // acomodan" que el abanico de DocenciaImpacto, pero acá NO hay que
  // cancelar la posición de layout con un translateX calculado (esta
  // fila sí es scrolleable de verdad, a diferencia del abanico fijo de
  // Docencia) — alcanza con rotar/achicar cada tarjeta en su propio
  // lugar y soltarla:
  //  'hidden'  — todavía no llegó a pantalla: invisible, chiquita y
  //              rotada (el ángulo de SHUFFLE_ROTATE que le toca).
  //  'stacked' — aparecen TODAS de golpe (sin escalonar), ya visibles
  //              pero todavía giradas/achicadas — el "mazo recién
  //              tirado sobre la mesa, antes de acomodarse".
  //  'dealt'   — cada una gira a 0°, crece a su tamaño real y se
  //              asienta, una detrás de otra (delay escalonado por
  //              índice) — el "dan vueltas mientras se acomodan" que
  //              pidió Yocxany, sin dejarlas rotadas en reposo (serían
  //              ilegibles con todo el texto que llevan).
  // Nunca se hace unobserve: si la sección sale de pantalla se vuelve a
  // 'hidden', así que la próxima vez que se entre se repite completa.
  const [phase, setPhase] = useState('hidden');

  // `settled`: true recién cuando el reparto (fase 'dealt') terminó de
  // asentarse del todo — a partir de ahí el "coverflow" de abajo toma
  // control TOTAL del transform/opacity de cada tarjeta (ver el style
  // condicional del wrapper más abajo: mientras `settled` es false, ese
  // style lo maneja React con la animación de reparto; en cuanto es
  // true, React deja de tocar esas dos propiedades — si las siguiera
  // fijando en cada render, pisaría a cada rato lo que el scroll acaba
  // de escribir directo en el DOM). `settledRef` es la misma bandera
  // pero legible desde dentro del listener de scroll (que se registra
  // una sola vez, sin volver a suscribirse en cada cambio de fase).
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
    // Mismo cálculo que el "boop" de DocenciaImpacto: la última tarjeta
    // en llegar es la de índice más alto (delay = (n-1)*70ms) y tarda
    // 650ms más en terminar su transición — recién ahí es seguro
    // entregarle el control a las tarjetas al scroll, sin pisar la
    // animación de reparto a mitad de camino.
    const settleMs = (AREAS.length - 1) * 70 + 650 + 80;
    const id = setTimeout(() => setSettled(true), settleMs);
    return () => clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;

    // Mismo motivo que en StatsSection/DocenciaImpacto: el
    // IntersectionObserver hay que sacarlo del window dueño del
    // documento donde vive la sección, no del window global del
    // módulo, para que también funcione dentro del iframe de "Vista
    // Móvil".
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
            // Antes de mostrar nada (fase 'hidden' todavía, opacidad 0)
            // se para el carril de una, sin animación, ya centrado en
            // la tarjeta por defecto ("Proyectos", en la copia del
            // medio) — así el reparto de las cards sucede directo en
            // el lugar correcto, sin el salto que había antes cuando
            // el reparto pasaba en scrollLeft:0 y recién después se
            // corregía la posición.
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

  // `behavior: 'instant'` para la corrección de "recién asentado, ya
  // centrado" (ver el useEffect de `settled` más abajo — ahí un scroll
  // 'smooth' se vería como un deslizamiento de más, encima de la
  // animación de reparto que recién terminó); 'smooth' es el default
  // para cuando la persona toca las flechas/puntitos.
  // Ahora `idx` es un índice dentro de RENDER_AREAS (0-17, una de las
  // 3 copias), no dentro de AREAS (0-5) — ver scrollToBaseIndex más
  // abajo para ir a un área por su id sin importar en qué copia caiga.
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

  // Ir a un área por su id (lo que usan los puntitos de abajo) en vez
  // de por índice de copia: busca, de las 3 copias, cuál queda más
  // cerca de donde está parado el carril ahora mismo, para que el
  // salto sea siempre cortito — a Yocxany no le importa en qué copia
  // física caiga cada tarjeta, sólo que el movimiento se sienta sutil.
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

  // El efecto "coverflow": mientras se desliza el carril, cada tarjeta
  // se va girando en 3D según qué tan lejos quede de la tarjeta central
  // — la del centro queda plana y un poco más grande (la "principal"),
  // las de los costados se inclinan como si giraran alejándose, hacia
  // el centro (izquierda gira su borde derecho hacia el frente,
  // derecha al revés), achicadas y algo más transparentes. Al soltar
  // el scroll, el snap (`snap-center`) deja la tarjeta más cercana
  // perfectamente centrada, y con ella en `d≈0` el cálculo de abajo ya
  // la deja plana/grande sola — no hace falta ningún ajuste aparte para
  // "cuando uno para, esa quede bien centrada y como la principal".
  //
  // Corre en cada frame de scroll (con un solo rAF pendiente a la vez)
  // pero NO usa React para escribir el transform — escribe directo en
  // el DOM vía las refs. Si pasara por setState, cada pixel de scroll
  // dispararía un re-render de las 6 tarjetas; así sólo re-renderiza
  // React cuando cambia el índice "activo" (para el puntito del menú),
  // que es mucho menos seguido.
  const updateCoverflow = useCallback(() => {
    if (!settledRef.current) return;
    const track = trackRef.current;
    if (!track) return;

    const trackRect = track.getBoundingClientRect();
    const centerX = trackRect.left + trackRect.width / 2;

    // Distancia entre el centro de dos tarjetas consecutivas, medida
    // en vivo (en vez de una constante): así sigue siendo correcta sin
    // importar el breakpoint (w-[88vw] en mobile, 460px fijo desde sm),
    // sin necesidad de duplicar esa cuenta acá. Se guarda en stepRef
    // porque también la usa el recentrado del scroll infinito.
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

  // Auto-recentrado del carrusel "infinito": cuando el scroll se queda
  // quieto (nadie lo sigue arrastrando/soltando — por eso el debounce),
  // si la tarjeta activa cayó en la copia de la izquierda o la derecha
  // se salta EN SILENCIO (asignando scrollLeft directo, sin scrollTo
  // ni transición: como las 3 copias son pixel-idénticas, no se nota
  // ni un parpadeo) de vuelta a la copia del medio — así siempre queda
  // una copia entera de margen para seguir girando para cualquier lado
  // sin toparse nunca con el final real de la tira.
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

    // También hay que recalcular si la ventana cambia de tamaño (una
    // rotación de pantalla, o el breakpoint mobile/desktop cambiando el
    // ancho de tarjeta) — mismo patrón de AlliesMarquee/RegionalMap:
    // ResizeObserver sobre el documento dueño de la sección, para que
    // funcione también dentro del iframe de "Vista Móvil".
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

  // En cuanto el reparto termina de asentarse (`settled` pasa a true)
  // el coverflow toma control del transform/opacity de cada tarjeta.
  // El carril ya está centrado en la tarjeta por defecto desde ANTES
  // de que arrancara el reparto (ver el IntersectionObserver más
  // arriba), así que acá ya no hace falta corregir el scroll — sólo
  // falta el primer cálculo de coverflow. Pasar de "plana" (estado
  // final del reparto) a "inclinada en 3D" de un jalón, en un solo
  // frame sin transición, era justo lo que Yocxany sentía como
  // brusco/"de ladito" — por eso se le da una transición CSS corta
  // SOLO para este primer cuadro (se saca enseguida después: el
  // coverflow normal, mientras la persona scrollea, necesita responder
  // pixel a pixel sin ningún easing de por medio, si no se siente
  // pegajoso/atrasado).
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

  // Ya no hay "última tarjeta": con el carril infinito, las flechas
  // simplemente avanzan/retroceden un paso desde donde esté parado el
  // carril ahora mismo (closestRenderIndexRef, actualizado en cada
  // frame de scroll) — sin clamp entre 0 y AREAS.length-1 como antes.
  const scrollByStep = useCallback(
    (dir) => {
      const cur = closestRenderIndexRef.current ?? AREAS.length + DEFAULT_AREA_INDEX;
      scrollToIndex(cur + dir);
    },
    [scrollToIndex]
  );

  // Navegar las tarjetas con la rueda del mouse/trackpad, estando arriba
  // del carril — Yocxany lo pidió porque el scroll VERTICAL de toda la
  // vida (la rueda del mouse, sin nada especial) no mueve un contenedor
  // que sólo scrollea en horizontal (`overflow-x-auto`): el navegador lo
  // deja pasar de largo y scrollea la PÁGINA en su lugar. Acá se
  // intercepta ese gesto vertical y se traduce en "siguiente/anterior"
  // (mismo `scrollByStep` de las flechas). Un gesto YA horizontal
  // (trackpad deslizando de lado, deltaX manda sobre deltaY) se deja
  // pasar tal cual — el scroll nativo del carril ya lo resuelve solo,
  // no hay que pisarlo con esto.
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
      // Throttle: un solo "paso" por gesto — sin esto, una rueda de
      // mouse típica dispara varios eventos wheel seguidos por cada
      // "click" físico de la ruedita, y saltaría varias tarjetas de una.
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

      {/* Breakout a 100vw: el header de arriba se queda en el
          contenedor centrado normal (max-w-5xl), pero el carrusel se
          sale de ese ancho para sentirse como su propia vitrina —
          técnica controlada (nada se sale de la pantalla: sigue
          midiendo exactamente 100vw, ni un pixel más) que sólo afecta
          a ESTE bloque. `body` ya tiene overflow-x:hidden (ver
          global.css), así que el -mx-[50vw] nunca genera scroll
          horizontal de la página. Los menús de navegación (arriba y
          el de abajo en mobile) viven fuera de esta sección por
          completo, así que no los toca para nada. */}
      <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen mt-2 sm:mt-4">
        <div className="relative">
          {/* Degradés en los bordes para que las tarjetas no corten en
              seco contra la orilla de la pantalla — se "disuelven" en
              el color de fondo de la sección, en vez de un corte recto. */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-r from-[#D6E9F7] dark:from-[#001F3D] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-l from-[#D6E9F7] dark:from-[#001F3D] to-transparent z-10" />

          {/* El padding lateral NO es un vw fijo cualquiera — es
              exactamente la mitad del espacio que sobra entre el ancho
              de la tarjeta y el ancho del carril: calc((100% -
              min(88vw,460px)) / 2). min(88vw,460px) es a propósito el
              MISMO ancho que terminan teniendo las tarjetas de abajo
              (w-[88vw] max-w-[460px]) en cualquier tamaño de pantalla,
              así el padding siempre "atina" sin necesitar un sm: aparte.
              Con eso, a scrollLeft:0 la PRIMERA tarjeta ya queda
              perfectamente centrada sola (y la ÚLTIMA lo mismo al otro
              extremo) — un padding fijo (ej. 14vw) dejaba a la primera/
              última tarjeta más pegada al borde que centrada, así que
              nunca se podía "parar" en ellas bien centradas por más que
              se intentara. */}
          <div
            ref={trackRef}
            className="flex items-stretch gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory px-[calc((100%-min(88vw,460px))/2)] py-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {RENDER_AREAS.map((area) => {
              const Icon = area.icon;
              const resumen = resumenes[area.id];
              // El ángulo de entrada se repite por baseIndex (no por
              // posición en RENDER_AREAS) para que la misma área se
              // vea idéntica en sus 3 copias.
              const rotateStart = SHUFFLE_ROTATE[area.baseIndex % SHUFFLE_ROTATE.length];

              return (
                <div
                  key={area.renderKey}
                  ref={(el) => {
                    cardRefs.current[area.renderKey] = el;
                  }}
                  // Yocxany pidió poder tocar directo la tarjeta de un
                  // lado (la que queda inclinada por el coverflow) para
                  // que pase al centro, en vez de depender sólo del
                  // scroll/swipe horizontal — en mobile eso se puede
                  // confundir con el scroll VERTICAL de la página (uno
                  // "baja" para seguir viendo el resto del sitio, y ese
                  // gesto puede pisar el swipe horizontal). Se ignora en
                  // la tarjeta ya centrada (no tendría nada que hacer) y
                  // mientras el reparto de entrada todavía no terminó de
                  // asentarse (`settledRef`), para no interrumpir esa
                  // animación a mitad de camino.
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
                    {/* Marca de agua — el mismo escudo blanco vectorizado
                        que usan las cartas de Docencia (ver
                        DocenciaImpacto.jsx). Siempre blanco, sin
                        alternar con el tema: el fondo de esta tarjeta ya
                        es celeste institucional en los dos temas (no
                        cambia claro/oscuro), y un escudo navy encima de
                        celeste casi no contrasta — son el mismo azul en
                        dos tonos. Opacidad baja a propósito, para que
                        quede como motivo de fondo sin competir con el
                        texto. */}
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

        {/* Controles del carrusel: flechas para ir de a una y puntitos
            para saltar directo a cualquier área (el "menú" que pidió
            Yocxany) — todo centrado bajo el carril, dentro del ancho
            normal del contenido (no hace falta que ESTO también sea
            100vw). Antes también iba acá un botón de "reiniciar la
            animación" — Yocxany pidió sacarlo. */}
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
