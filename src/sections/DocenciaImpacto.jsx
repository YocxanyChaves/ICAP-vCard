import { useEffect, useRef, useState } from 'react';
import { GraduationCap, Wrench, Search, Network, Lightbulb, RotateCw } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import KickerBadge from '../components/KickerBadge';
import ClosingPhrase from '../components/ClosingPhrase';
import EscudoICAP from '../components/EscudoICAP';
// Mismos ids que t.docenciaImpacto.items en translations.js.
const ITEMS = [
  { id: 'conocimientoEspecializado', icon: GraduationCap },
  { id: 'aplicacionPractica', icon: Wrench },
  { id: 'investigacion', icon: Search },
  { id: 'redesRegionales', icon: Network },
  { id: 'innovacion', icon: Lightbulb }
];

// Entrada tipo "cinta transportadora": al llegar a la sección las cartas
// entran deslizándose desde la izquierda (ENTRY_FROM, fuera de pantalla)
// y frenan suave en su lugar en ENTRY_DURATION ms. La de más a la DERECHA
// arranca primero y cada una de las siguientes sale ENTRY_STAGGER ms
// después, así viajan en fila.
const ENTRY_FROM = '-100vw';
const ENTRY_DURATION = 1100;
const ENTRY_STAGGER = 70;

// Volteo automático: una vez que las cartas llegaron, se van volteando
// solas de a una — primero la del CENTRO y después hacia la IZQUIERDA
// (al llegar a la primera sigue por la de la punta derecha, y vuelve a
// empezar). Cada una queda mostrando su descripción AUTO_FLIP_HOLD ms,
// se cierra, y AUTO_FLIP_GAP ms después se voltea la siguiente. Se
// pausa con el mouse encima de las cartas y se apaga del todo apenas
// el usuario toca una (a partir de ahí manda él).
const AUTO_FLIP_HOLD = 3200;
const AUTO_FLIP_GAP = 700;

// Nombres de 2 palabras (ej. "Redes Regionales") se parten siempre una
// palabra por línea: así el ancho de cada línea es previsible y nunca se
// recorta contra el borde de la carta, sin importar el breakpoint.
function nameLines(name) {
  return name.split(' ');
}

/**
 * Cara de ADELANTE de la carta: ícono arriba, nombre al centro, el
 * escudo del ICAP grande de fondo y un puntito que invita a voltearla.
 */
function ImpactCardFront({ Icon, name }) {
  return (
    <div className="absolute inset-0 [backface-visibility:hidden] rounded-2xl bg-white dark:bg-[#003366] border border-slate-100 dark:border-white/10 shadow-xl shadow-slate-900/15 dark:shadow-black/40 overflow-hidden flex flex-col p-3 sm:p-4">
      {/* Escudo de fondo: blanco sobre fondo oscuro, celeste sobre fondo claro.
          Esquina abajo-derecha, grande y recortado por el borde de la carta
          (abajo-izquierda queda para el puntito de "voltear"). */}
      <EscudoICAP
        tono="celeste"
        className="absolute -right-[20%] -bottom-[12%] w-[62%] rotate-[-12deg] opacity-100 dark:hidden pointer-events-none"
      />
      <EscudoICAP
        tono="white"
        className="absolute -right-[20%] -bottom-[12%] w-[62%] rotate-[-12deg] opacity-0 dark:opacity-100 pointer-events-none"
      />

      {/* Ícono del pilar arriba (círculo celeste con aro punteado que gira, como
          CardIcon en DocenciaMision.jsx) y el nombre centrado en el espacio que
          queda debajo. */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mt-3 sm:mt-4 shrink-0">
        <div
          className="absolute -inset-1.5 rounded-full border border-dashed border-[#0077C8]/45 dark:border-white/25 pointer-events-none"
          style={{ animation: 'orbitSpin 9s linear infinite' }}
          aria-hidden="true"
        />
        <div className="relative w-full h-full rounded-full bg-[#EAF3FB] dark:bg-white/10 text-[#0077C8] dark:text-[#4FB2F2] flex items-center justify-center">
          <Icon className="w-9 h-9 sm:w-11 sm:h-11" strokeWidth={1.7} />
        </div>
      </div>

      <div className="relative flex-1 flex items-center justify-center pb-14">
        <h3 className="text-center font-heading font-bold text-lg xl:text-xl text-[#003366] dark:text-[#9FC6E8] leading-[1.25]">
          {nameLines(name).map((line) => (
            <span key={line} className="block whitespace-nowrap">
              {line}
            </span>
          ))}
        </h3>
      </div>

      {/* Puntito que invita a tocar: la descripción completa está al voltear.
          Abajo-izquierda, para no competir con el ícono y el nombre. */}
      <div className="absolute bottom-2.5 left-2.5 sm:bottom-3.5 sm:left-3.5 flex items-center justify-center" aria-hidden="true">
        <span className="absolute inline-flex h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-[#0077C8]/20 dark:bg-[#4FB2F2]/20 animate-ping" />
        <RotateCw className="relative w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0077C8]/70 dark:text-[#4FB2F2]/70" />
      </div>
    </div>
  );
}

/**
 * Cara de ATRÁS: aparece al tocar la carta. Fondo celeste (navy en tema
 * oscuro), el nombre arriba y la descripción completa abajo.
 *
 * El escudo de fondo es siempre blanco: navy sobre celeste no hace
 * contraste. Su opacidad es más baja que en el frente (0.12) porque acá
 * compite con mucho más texto.
 */
function ImpactCardBack({ Icon, name, description }) {
  return (
    <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl bg-[#0077C8] dark:bg-[#001F3D] border border-[#0077C8] dark:border-white/15 shadow-xl shadow-slate-900/20 overflow-hidden flex flex-col items-center justify-center text-center p-4 sm:p-5 gap-2.5 sm:gap-3">
      <EscudoICAP
        tono="white"
        className="absolute left-1/2 top-1/2 w-[86%] -translate-x-1/2 -translate-y-1/2 rotate-[5deg] opacity-[0.12] pointer-events-none"
      />

      <Icon className="relative w-7 h-7 sm:w-8 sm:h-8 text-white/80 dark:text-[#4FB2F2] shrink-0" aria-hidden="true" />
      <h3 className="relative font-heading font-bold text-base sm:text-lg text-white dark:text-[#9FC6E8] leading-tight">
        {name}
      </h3>
      <p className="relative text-xs sm:text-sm text-white/90 dark:text-slate-300 leading-snug">{description}</p>
      <span className="relative font-mono-code text-[9px] sm:text-[10px] text-white/55 dark:text-white/30 mt-0.5">
        toca para cerrar
      </span>
    </div>
  );
}

/**
 * Las 5 cartas en fila. En mobile y tablet la fila se desliza en
 * horizontal (overflow-x-auto + scroll-snap) con cartas de 192×288px; el
 * padding lateral de calc(50vw − media carta) deja centrar hasta las de
 * las puntas, y al entrar se centra el scroll en la del medio. Desde
 * `lg:` es una grilla de 5 columnas (aspect 2/3), sin scroll. El py-6 es
 * para que el levante del hover/volteo no se recorte.
 *
 * Cada carta es un botón que se VOLTEA en 3D al tocarla. Tres capas de
 * transform, cada una en su propio elemento para que no se pisen:
 *   1) este wrapper — la entrada (según fanPhase) y el "levante" (sube,
 *      crece y pasa al frente con z-index 50) cuando está volteada.
 *   2) el <button> — el hover (un "boop" con rebote) y el achique al
 *      tocarla.
 *   3) el div interno con perspective+preserve-3d — el volteo (rotateY
 *      0↔180), con las dos caras superpuestas y backface-visibility:hidden.
 *
 * `fanPhase`:
 *   'hidden' — todavía no llegó: invisible, fuera de pantalla a la
 *              izquierda.
 *   'fanned' — cada carta se desliza a su lugar (ver ENTRY_*).
 */
function ImpactFan({ items, c, phase }) {
  const mid = (items.length - 1) / 2;
  const midIndex = Math.round(mid);
  const [flippedId, setFlippedId] = useState(null);
  // El z-index también sube en hover, para que el boop no quede tapado por
  // una carta vecina.
  const [hoveredId, setHoveredId] = useState(null);
  // "Boop" final: un rebotecito que pegan TODAS las cartas a la vez justo
  // después de que terminan de llegar (ver el useEffect de abajo y
  // .animate-card-boop en global.css, que explica por qué va sobre el
  // <button>).
  const [boop, setBoop] = useState(false);
  // Carta que el volteo automático tiene abierta ahora (ver
  // AUTO_FLIP_*). Separada de flippedId (la que eligió el usuario):
  // apenas el usuario toca una carta, autoStopped apaga el automático.
  const [autoFlipId, setAutoFlipId] = useState(null);
  const [autoStopped, setAutoStopped] = useState(false);
  const autoPausedRef = useRef(false);
  const scrollRef = useRef(null);
  const midCardRef = useRef(null);

  // En mobile, al entrar, el scroll horizontal se centra en la carta del
  // medio (instantáneo, `behavior: 'auto'`, para no competir con la
  // animación). En lg+ no hay overflow, así que no mueve nada.
  //
  // OJO: se mueve sólo el scroll del propio contenedor y no se usa
  // scrollIntoView, que también movería el <main> de la página.
  useEffect(() => {
    if (phase !== 'fanned') return;
    const box = scrollRef.current;
    const card = midCardRef.current;
    if (!box || !card) return;
    const boxRect = box.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    box.scrollLeft += cardRect.left + cardRect.width / 2 - (boxRect.left + boxRect.width / 2);
  }, [phase]);

  // La última carta en llegar es la de índice más alto
  // (transitionDelay = (items.length - 1) * 90ms) y tarda 750ms más en
  // asentarse; ahí dispara el boop sobre todas a la vez (+80ms de colchón).
  // Se apaga al salir de 'fanned' para que la próxima vez que la sección
  // sea visible el boop pueda repetirse.
  useEffect(() => {
    if (phase !== 'fanned') {
      setBoop(false);
      return undefined;
    }
    const settleMs = (items.length - 1) * ENTRY_STAGGER + ENTRY_DURATION + 80;
    const boopTimeoutId = setTimeout(() => setBoop(true), settleMs);
    return () => clearTimeout(boopTimeoutId);
  }, [phase, items.length]);

  // Volteo automático, en cadena de timeouts: espera a que las cartas
  // terminen de llegar (+ el boop), y después voltea una, la deja
  // AUTO_FLIP_HOLD, la cierra, espera AUTO_FLIP_GAP y sigue con la
  // próxima del orden centro → izquierda → (vuelta por la derecha).
  // Si el mouse está encima (autoPausedRef), no abre la siguiente
  // hasta que se vaya.
  useEffect(() => {
    if (phase !== 'fanned' || autoStopped) {
      setAutoFlipId(null);
      return undefined;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const n = items.length;
    const order = Array.from({ length: n }, (_, k) => (midIndex - k + n) % n);
    let k = 0;
    let timeoutId;

    const flipNext = () => {
      if (autoPausedRef.current) {
        timeoutId = setTimeout(flipNext, 400);
        return;
      }
      setAutoFlipId(items[order[k % n]].id);
      timeoutId = setTimeout(() => {
        setAutoFlipId(null);
        k += 1;
        timeoutId = setTimeout(flipNext, AUTO_FLIP_GAP);
      }, AUTO_FLIP_HOLD);
    };

    const startMs = (n - 1) * ENTRY_STAGGER + ENTRY_DURATION + 900;
    timeoutId = setTimeout(flipNext, startMs);
    return () => clearTimeout(timeoutId);
  }, [phase, autoStopped, items, midIndex]);

  return (
    <div
      ref={scrollRef}
      className="flex gap-4 overflow-x-auto -mx-4 sm:-mx-6 px-[calc(50vw-7rem)] py-6 snap-x snap-proximity lg:grid lg:grid-cols-5 lg:gap-5 lg:overflow-visible lg:mx-0 lg:px-0 lg:snap-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      role="list"
      onMouseEnter={() => {
        autoPausedRef.current = true;
      }}
      onMouseLeave={() => {
        autoPausedRef.current = false;
      }}
    >
      {items.map((item, i) => {
        const Icon = item.icon;
        const itemT = c.items[item.id];
        const offset = i - mid;
        const flipped = flippedId === item.id || (flippedId === null && autoFlipId === item.id);
        const revealed = phase !== 'hidden';

        return (
          <div
            key={item.id}
            ref={i === midIndex ? midCardRef : undefined}
            role="listitem"
            className="w-56 h-[21rem] shrink-0 snap-center lg:w-auto lg:h-auto lg:aspect-[2/3]"
            style={{
              zIndex: flipped ? 50 : hoveredId === item.id ? 40 : 10 - Math.abs(offset),
              pointerEvents: phase === 'fanned' ? 'auto' : 'none',
              // Entrada tipo cinta transportadora — ver ENTRY_*.
              transform:
                phase === 'hidden'
                  ? `translateX(${ENTRY_FROM})`
                  : flipped
                    ? 'translateX(0) translateY(-12px) scale(1.06)'
                    : 'translateX(0) translateY(0) scale(1)',
              opacity: revealed ? 1 : 0,
              transitionProperty: 'transform, opacity',
              // El fade es más corto que el viaje para que la carta ya
              // se vea entera mientras todavía se desliza.
              transitionDuration: `${ENTRY_DURATION}ms, 500ms`,
              // Arranca rápido y frena suave, como la cinta al detenerse.
              transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
              // La de más a la derecha primero, las demás detrás en fila.
              transitionDelay: revealed ? `${(items.length - 1 - i) * ENTRY_STAGGER}ms` : '0ms'
            }}
          >
            <button
              type="button"
              onClick={() => {
                setAutoStopped(true);
                setFlippedId(flipped ? null : item.id);
              }}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId((current) => (current === item.id ? null : current))}
              aria-pressed={flipped}
              aria-label={`${itemT.name}: ${itemT.description}`}
              className={`group relative block w-full h-full [perspective:1200px] cursor-pointer rounded-2xl transition-transform duration-[420ms] [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-3 hover:scale-[1.06] active:scale-95 active:duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0077C8] focus-visible:ring-offset-2 ${boop ? 'animate-card-boop' : ''}`}
            >
              <div
                className="relative w-full h-full [transform-style:preserve-3d] transition-transform duration-[650ms]"
                style={{
                  transform: `rotateY(${flipped ? 180 : 0}deg)`,
                  transitionTimingFunction: 'cubic-bezier(0.45, 0.05, 0.15, 1)'
                }}
              >
                <ImpactCardFront Icon={Icon} name={itemT.name} />
                <ImpactCardBack Icon={Icon} name={itemT.name} description={itemT.description} />
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
}

/**
 * "Impacto" de Docencia — bloque 3 del brochure ("Formación para generar
 * impacto").
 *
 * - Orden: kicker (KickerBadge) → texto → título ("La Experiencia ICAP
 *   Integra") → cartas → frase de cierre, con un `gap` fijo y parejo entre
 *   todo.
 * - Las cartas entran tipo cinta transportadora (ENTRY_*) y el resto del
 *   bloque con un fade+subida sutil al llegar (IntersectionObserver, como
 *   StatsSection.jsx).
 * - Cada carta se puede tocar y se VOLTEA en 3D para mostrar la
 *   descripción completa del pilar (ver ImpactFan). Si nadie las toca, se
 *   van volteando solas (AUTO_FLIP_*).
 */
export default function DocenciaImpacto() {
  const { t } = useLanguage();
  const c = t.docenciaImpacto;

  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  // Fase de las cartas: 'hidden' (esperando) -> 'fanned' (entran). Ver
  // el comentario grande en ImpactFan para el detalle por carta.
  const [fanPhase, setFanPhase] = useState('hidden');

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;

    // El IntersectionObserver sale del window dueño del documento (no del
    // global) para que funcione también dentro del iframe de "Vista Móvil".
    const view = el.ownerDocument?.defaultView;
    const IO = view?.IntersectionObserver;

    if (!IO) {
      setVisible(true);
      setFanPhase('fanned');
      return undefined;
    }

    const observer = new IO(
      (entries) => {
        entries.forEach((entry) => {
          setVisible(entry.isIntersecting);
          if (entry.isIntersecting) {
            setFanPhase('fanned');
          } else {
            setFanPhase('hidden');
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="px-4 sm:px-6 py-[var(--docencia-gap)] bg-[#D6E9F7] dark:bg-[#001F3D] relative overflow-hidden"
    >
      {/* Separación amplia y fija entre cada elemento (kicker, texto, título,
          cartas, cierre). */}
      {/* max-w-6xl/7xl (antes 5xl) para que la grilla de 5 cartas en
          desktop tenga más ancho y las cartas salgan más grandes — el
          párrafo ya tiene su propio max-w-xl, así que no se estira. */}
      <div className="max-w-6xl xl:max-w-7xl mx-auto flex flex-col items-center text-center gap-[var(--docencia-gap)]">
        <div
          className="transition-all duration-700 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)'
          }}
        >
          <KickerBadge>{c.kicker}</KickerBadge>
        </div>

        <p
          className="text-sm sm:text-base text-slate-700 dark:text-slate-300 max-w-xl mx-auto leading-relaxed transition-all duration-700 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transitionDelay: visible ? '90ms' : '0ms'
          }}
        >
          {c.subtitle}
        </p>

        <h2
          className="font-heading font-extrabold text-2xl sm:text-3xl text-[#003366] dark:text-[#9FC6E8] tracking-tight transition-all duration-700 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transitionDelay: visible ? '180ms' : '0ms'
          }}
        >
          {c.title}
        </h2>

        <div className="w-full py-2 sm:py-3">
          <ImpactFan items={ITEMS} c={c} phase={fanPhase} />
        </div>

        {/* Igual que la frase de cierre del Hero de Formación (ver
            ClosingPhrase.jsx). El boop espera a que termine el fade de
            entrada (450ms de delay + 700ms de duración). */}
        <ClosingPhrase
          className="transition-all duration-700 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transitionDelay: visible ? '450ms' : '0ms'
          }}
          boopDelay={1150}
        >
          {c.tagline}
        </ClosingPhrase>
      </div>
    </section>
  );
}
