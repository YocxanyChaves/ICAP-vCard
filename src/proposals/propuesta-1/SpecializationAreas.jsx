import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Stethoscope, BadgeCheck, ClipboardCheck, Cog, Users, Leaf, Scale, CheckCircle2, ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import KickerBadge from './KickerBadge';
import icapEscudoWhite from '../../assets/icap-escudo-white.svg';

// Antes esta sección abría el detalle de cada área en un modal/bottom
// sheet aparte (había que tocar la tarjeta para leer la descripción y
// las líneas de trabajo). Después pasó a un grid de 2 columnas con todo
// el contenido a la vista. Ahora, a pedido de Yocxany (inspirado en
// brand.squarespace.com — el menú numerado de tarjetas que se recorre
// con scroll/flechitas), es un carrusel horizontal a todo el ancho de
// pantalla: se "pasea" entre las 6 áreas deslizando o con las flechas/
// puntitos, en vez de leerlas todas apiladas en una columna.
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

// Rotación de "shuffle" de entrada por tarjeta — no es una rotación
// pareja tipo abanico (como el mazo de DocenciaImpacto), es más
// desprolija a propósito, alternando de lado y de tamaño, para que se
// sienta como una baraja recién repartida y no como un patrón
// geométrico perfecto. Sólo 6 valores porque son 6 áreas siempre.
const SHUFFLE_ROTATE = [-16, 12, -20, 15, -12, 19];

// Textitos de la UI del carrusel (flechas, puntos, botón de repetir) —
// viven acá, no en translations.js, porque son sólo aria-label/title
// (nunca texto visible en pantalla) y así no hay que tocar el
// diccionario grande por un cambio tan chiquito.
const UI = {
  es: {
    prev: 'Área anterior',
    next: 'Área siguiente',
    goTo: (name) => `Ir a ${name}`,
    replay: 'Volver al inicio y repetir la animación'
  },
  en: {
    prev: 'Previous area',
    next: 'Next area',
    goTo: (name) => `Go to ${name}`,
    replay: 'Back to start and replay the animation'
  }
};

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

export default function SpecializationAreas() {
  const { t, lang } = useLanguage();
  const ui = UI[lang] || UI.es;

  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const cardRefs = useRef({});
  const [activeIndex, setActiveIndex] = useState(0);

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
  const scrollToIndex = useCallback((idx, behavior = 'smooth') => {
    const track = trackRef.current;
    const area = AREAS[idx];
    const cardEl = area && cardRefs.current[area.id];
    if (!track || !cardEl) return;
    const target = cardEl.offsetLeft - (track.clientWidth - cardEl.clientWidth) / 2;
    track.scrollTo({ left: target, behavior });
  }, []);

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
    // importar el breakpoint (w-[80vw] en mobile, 360px fijo desde sm),
    // sin necesidad de duplicar esa cuenta acá.
    const firstEl = cardRefs.current[AREAS[0].id];
    const secondEl = cardRefs.current[AREAS[1].id];
    let step = firstEl ? firstEl.getBoundingClientRect().width + 24 : 300;
    if (firstEl && secondEl) {
      const a = firstEl.getBoundingClientRect();
      const b = secondEl.getBoundingClientRect();
      step = b.left + b.width / 2 - (a.left + a.width / 2) || step;
    }

    let closestIdx = 0;
    let closestDist = Infinity;

    AREAS.forEach((area, idx) => {
      const cardEl = cardRefs.current[area.id];
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

    setActiveIndex((prev) => (prev === closestIdx ? prev : closestIdx));
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
    };
  }, [updateCoverflow]);

  // En cuanto el reparto termina de asentarse (`settled` pasa a true):
  // 1) se centra la PRIMERA tarjeta de una — con el padding lateral del
  //    carril (px-[14vw]), a scrollLeft:0 ninguna tarjeta queda
  //    perfectamente centrada, así que sin este paso la "principal" de
  //    entrada sería la que haya quedado más cerca por azar (según el
  //    ancho de pantalla), no necesariamente la primera. `instant` a
  //    propósito: un scroll 'smooth' acá se sentiría como un
  //    deslizamiento de más, pegado a la cola de la animación de
  //    reparto que recién terminó.
  // 2) recién ahí se aplica el coverflow — si no, las tarjetas se
  //    quedarían "planas parejas" (el estado final de la animación de
  //    reparto) hasta que la persona empiece a scrollear.
  useEffect(() => {
    if (!settled) return undefined;
    scrollToIndex(0, 'instant');
    const rafId = requestAnimationFrame(updateCoverflow);
    return () => cancelAnimationFrame(rafId);
  }, [settled, updateCoverflow, scrollToIndex]);

  const scrollByStep = useCallback(
    (dir) => {
      const nextIdx = Math.min(AREAS.length - 1, Math.max(0, activeIndex + dir));
      scrollToIndex(nextIdx);
    },
    [activeIndex, scrollToIndex]
  );

  // El botoncito de "reiniciar": vuelve el carril a la primera tarjeta
  // Y repite la animación de reparto completa (pasa por 'hidden' un
  // frame antes de 'stacked' para que el efecto se vea desde cero,
  // igual que la primera vez que se entra a la sección).
  const replay = useCallback(() => {
    scrollToIndex(0);
    setPhase('hidden');
    requestAnimationFrame(() => {
      setPhase('stacked');
      setTimeout(() => setPhase('dealt'), 420);
    });
  }, [scrollToIndex]);

  return (
    <section ref={sectionRef} className="py-10 sm:py-16 bg-[#D6E9F7] dark:bg-[#001F3D] relative overflow-hidden">
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
          {/* Género no es una 7ma tarjeta: es el eje transversal que
              atraviesa las 6 áreas (igual que en la rueda del brochure
              oficial), así que se muestra como una nota/badge aparte. */}
          <div className="inline-flex items-center gap-2 mt-4 px-3.5 py-2 rounded-full bg-[#D86DCB]/10 border border-[#D86DCB]/25 text-[11px] sm:text-xs text-[#0B1F3D] dark:text-white font-medium">
            <Scale className="w-3.5 h-3.5 text-[#D86DCB] shrink-0" />
            <span>{t.specializationAreas.generoNote}</span>
          </div>
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
      <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen mt-8 sm:mt-10">
        <div className="relative">
          {/* Degradés en los bordes para que las tarjetas no corten en
              seco contra la orilla de la pantalla — se "disuelven" en
              el color de fondo de la sección, en vez de un corte recto. */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-r from-[#D6E9F7] dark:from-[#001F3D] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-l from-[#D6E9F7] dark:from-[#001F3D] to-transparent z-10" />

          {/* El padding lateral NO es un vw fijo cualquiera — es
              exactamente la mitad del espacio que sobra entre el ancho
              de la tarjeta y el ancho del carril: calc((100% -
              min(80vw,360px)) / 2). min(80vw,360px) es a propósito el
              MISMO ancho que terminan teniendo las tarjetas de abajo
              (w-[80vw] max-w-[360px]) en cualquier tamaño de pantalla,
              así el padding siempre "atina" sin necesitar un sm: aparte.
              Con eso, a scrollLeft:0 la PRIMERA tarjeta ya queda
              perfectamente centrada sola (y la ÚLTIMA lo mismo al otro
              extremo) — un padding fijo (ej. 14vw) dejaba a la primera/
              última tarjeta más pegada al borde que centrada, así que
              nunca se podía "parar" en ellas bien centradas por más que
              se intentara. */}
          <div
            ref={trackRef}
            className="flex items-stretch gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory px-[calc((100%-min(80vw,360px))/2)] pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {AREAS.map((area, idx) => {
              const Icon = area.icon;
              const areaT = t.specializationAreas.items[area.id];
              const rotateStart = SHUFFLE_ROTATE[idx % SHUFFLE_ROTATE.length];

              return (
                <div
                  key={area.id}
                  ref={(el) => {
                    cardRefs.current[area.id] = el;
                  }}
                  className="self-stretch shrink-0 snap-center w-[80vw] max-w-[360px] sm:w-[360px]"
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
                          transitionDelay: phase === 'dealt' ? `${idx * 70}ms` : '0ms'
                        }
                  }
                >
                  <article
                    className="area-card group relative rounded-[28px] p-6 sm:p-7 overflow-hidden flex flex-col items-center text-center text-white h-full"
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
                    <img
                      src={icapEscudoWhite}
                      alt=""
                      aria-hidden="true"
                      draggable={false}
                      className="absolute left-1/2 top-[58%] w-[95%] -translate-x-1/2 -translate-y-1/2 rotate-[-6deg] opacity-[0.12] pointer-events-none select-none"
                    />

                    {/* Hairline superior, apenas insinuada — el toque de
                        "borde pulido" en vez del acento de color de antes. */}
                    <span
                      aria-hidden="true"
                      className="absolute top-0 left-7 right-7 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
                    />

                    {/* Logito en círculo (antes cuadrado redondeado),
                        con un halo celeste detrás — reusa
                        .kicker-glow-halo (la misma respiración celeste
                        del kicker de AT) para que el ícono también
                        lleve "el toque de luz distintivo de AT". */}
                    <div className="relative mb-4">
                      <span
                        aria-hidden="true"
                        className="absolute -inset-2.5 rounded-full bg-[#BFE6FF]/35 blur-md kicker-glow-halo pointer-events-none"
                      />
                      <div className="relative w-16 h-16 rounded-full bg-white/15 border border-white/25 flex items-center justify-center shrink-0">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                    </div>

                    <h3 className="relative font-heading font-extrabold text-lg sm:text-xl text-white leading-tight">
                      {areaT.title}
                    </h3>
                    <p className="relative text-[11px] sm:text-xs text-white/70 mt-1">{areaT.tag}</p>

                    {/* w-full + flex justify-center a propósito: el
                        <article> es un flex-col con items-center (para
                        centrar el ícono/título), así que sin un ancho
                        explícito este div se encoge a su contenido — y
                        como CardLightStreak sólo tiene hijos absolutos
                        (0px de intrínseco), la rayita quedaba con
                        width:0 y desaparecía del todo. */}
                    <div className="relative mt-3 mb-4 w-full flex justify-center">
                      <CardLightStreak />
                    </div>

                    {/* Descripción corta (3 renglones, redactada a partir
                        de los puntos oficiales de la oferta institucional)
                        + los 3 puntos principales de esa misma lista, en
                        vez del listado completo — vista resumida de la
                        tarjeta. Queda alineada a la izquierda (a
                        diferencia del encabezado, que se centró): un
                        párrafo largo centrado es más difícil de leer. */}
                    <p className="relative text-xs sm:text-sm text-white/85 leading-relaxed mb-5 text-left">
                      {areaT.shortDesc}
                    </p>

                    <div className="relative space-y-2 mt-auto pt-1 w-full text-left">
                      {areaT.highlights.map((pt, i) => (
                        <div
                          key={i}
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

        {/* Controles del carrusel: flechas para ir de a una, puntitos
            para saltar directo a cualquier área (el "menú" que pidió
            Yocxany) y el botón de reiniciar — todo centrado bajo el
            carril, dentro del ancho normal del contenido (no hace
            falta que ESTO también sea 100vw). */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-center gap-3 sm:gap-4 mt-5 sm:mt-6">
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
              const areaT = t.specializationAreas.items[area.id];
              const isActive = idx === activeIndex;
              return (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => scrollToIndex(idx)}
                  aria-label={ui.goTo(areaT.title)}
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

          <button
            type="button"
            onClick={replay}
            aria-label={ui.replay}
            title={ui.replay}
            className="ml-1 sm:ml-2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0077C8]/10 dark:bg-white/10 border border-[#4FB2F2]/45 text-[#0077C8] dark:text-[#9FC6E8] flex items-center justify-center shrink-0 hover:bg-[#0077C8]/20 dark:hover:bg-white/20 transition-colors"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
