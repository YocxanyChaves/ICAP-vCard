import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Shield, Star, Users, Heart, Award, Sparkles } from 'lucide-react';
import icapLogoMark from '../assets/icap-logo-mark.png';
import { useLanguage } from '../i18n/LanguageContext';
import KickerBadge from '../components/KickerBadge';

// El nombre y la descripción de cada valor viven en
// t.valuesWheel.items[id]; acá sólo el id y el ícono. El componente
// también acepta otros `items`/`content` por prop.
const DEFAULT_VALUES = [
  { id: 'integridad', icon: Shield },
  { id: 'excelencia', icon: Star },
  { id: 'equipo', icon: Users },
  { id: 'compromiso', icon: Heart },
  { id: 'respeto', icon: Award },
  { id: 'transparencia', icon: Sparkles }
];

// Misma duración yendo al centro que volviendo a la órbita, pero distinta
// curva: ATTRACT_EASE es un ease-out marcado (el logo "jala" al valor) y
// RELEASE_EASE un ease-in-out, para que al volver se separe con calma en
// vez de salir disparada.
const ATTRACT_S = 1.1;
const RELEASE_S = ATTRACT_S;
const ATTRACT_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
const RELEASE_EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';

const ATTRACT_MS = ATTRACT_S * 1000;
const HOLD_MS = 1900;
// Colchón sobre RELEASE_S: que la esfera termine de asentarse de vuelta
// en su órbita antes de que el ciclo empiece a jalar la siguiente.
const RELEASE_MS = RELEASE_S * 1000 + 100;
const GAP_MS = 450;

const STARS = Array.from({ length: 26 }, (_, i) => {
  const seed = i * 137.5;
  return {
    top: (Math.sin(seed) * 0.5 + 0.5) * 100,
    left: (Math.cos(seed * 1.7) * 0.5 + 0.5) * 100,
    size: 1 + ((i * 7) % 3),
    delay: (i % 6) * 0.4
  };
});

/* Cada valor tiene un slot FIJO en el círculo (i/N de vuelta). Todas las
   esferas comparten la misma velocidad base y sólo tienen un vaivén
   angular pequeño y acotado (un seno) alrededor de su slot, así nunca se
   superponen. Semillas fijas (no Math.random) para que el layout no salte
   entre renders. Es función de `items` para servir a cualquier set de
   esferas. */
function buildOrbitConfig(items) {
  const n = items.length;
  return items.map((v, i) => {
    const seed = i * 91.7;
    const r1 = Math.sin(seed) * 0.5 + 0.5;
    const r2 = Math.sin(seed * 1.9 + 3.1) * 0.5 + 0.5;
    const r3 = Math.sin(seed * 2.7 + 1.3) * 0.5 + 0.5;
    return {
      radiusFactor: 0.92 + r1 * 0.16, // 0.92–1.08 × radio base
      phaseOffset: (i / n) * 2 * Math.PI, // slot fijo: nunca cambia el orden circular
      angleWobbleAmp: 0.05 + r2 * 0.05, // ±0.05–0.10 rad (~3°–6°): vaivén, no deriva
      angleWobbleSpeed: 0.005 + r2 * 0.003,
      wobbleAmp: 3 + r1 * 4, // vaivén del radio (px)
      wobbleSpeed: 0.004 + r2 * 0.003,
      wobblePhase: r3 * Math.PI * 2
    };
  });
}

/**
 * Posición orbital de un valor para una rotación y un tamaño de
 * contenedor dados. También se usa para PREDECIR dónde estará el slot un
 * poco más adelante (ver `releaseTargetRef`), que es lo que hace fluida
 * la vuelta a la órbita.
 */
function computeOrbitPos(orbitConfig, index, rot, containerSize) {
  const cfg = orbitConfig[index];
  const rad = containerSize * 0.35;
  const cx = containerSize / 2;
  const cy = containerSize / 2;
  const angleWobble = Math.sin(rot * cfg.angleWobbleSpeed + cfg.wobblePhase) * cfg.angleWobbleAmp;
  const angle = cfg.phaseOffset + (rot * Math.PI) / 180 + angleWobble;
  const wobble = Math.sin(rot * cfg.wobbleSpeed + cfg.wobblePhase) * cfg.wobbleAmp;
  const orbitRadius = rad * cfg.radiusFactor + wobble;
  return { x: cx + Math.cos(angle) * orbitRadius, y: cy + Math.sin(angle) * orbitRadius };
}

/**
 * `items`: lista de `{ id, icon }` (por defecto, los 6 Valores de
 * Asistencia Técnica). `content`: el namespace de traducciones
 * correspondiente (kicker/title/subtitle/pilarLabel/footerHint/
 * items[id].name|description); por defecto `t.valuesWheel`.
 */
export default function ValuesWheel({ items = DEFAULT_VALUES, content }) {
  const { t } = useLanguage();
  const wheelT = content || t.valuesWheel;
  const N = items.length;
  const orbitConfig = useMemo(() => buildOrbitConfig(items), [items]);
  const containerRef = useRef(null);
  const [size, setSize] = useState(280);
  const [rotation, setRotation] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [phase, setPhase] = useState('orbit'); // 'orbit' | 'attract' | 'hold' | 'release'
  const [pulse, setPulse] = useState(false);
  // Se incrementa justo cuando un valor "aterriza" en el centro; se usa
  // como key del anillo de luz para forzar que su animación reinicie
  // desde cero en cada llegada (0 = todavía no ha llegado ninguno).
  const [flashSeq, setFlashSeq] = useState(0);
  // Igual que flashSeq, pero para el pequeño "acomodo" del valor que
  // acaba de volver a su lugar (una esfera distinta cada vez, según
  // cuál esté activa en ese instante).
  const [settleSeq, setSettleSeq] = useState(0);
  const timeoutsRef = useRef([]);
  const rafRef = useRef(null);
  const activeBtnRef = useRef(null);
  const arrivedRef = useRef(false);
  // Copias "en vivo" de rotation/size que sí se pueden leer desde
  // dentro de handleArrival sin que quede desactualizada: rotation
  // cambia en cada frame y handleArrival no puede depender de ese
  // estado (se recrearía sin parar), así que la lee de aquí en el
  // instante exacto en que la esfera empieza a volver a su órbita.
  const rotationRef = useRef(0);
  const sizeRef = useRef(280);
  // Destino "congelado" del valor que está volviendo a su órbita — ver
  // el comentario largo más abajo, junto a donde se calcula.
  const releaseTargetRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        if (w > 0) {
          setSize(w);
          sizeRef.current = w;
        }
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let last = performance.now();
    const tick = (now) => {
      const dt = now - last;
      last = now;
      setRotation((r) => {
        const next = r + dt * 0.012;
        rotationRef.current = next;
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const clearTimers = useCallback(() => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
  }, []);

  // Desde acá el valor YA está en el centro (lo llama el efecto de abajo
  // cuando la esfera toca el centro de verdad).
  const handleArrival = useCallback(
    (idx) => {
      setPhase('hold');
      setPulse(true);
      setFlashSeq((s) => s + 1);

      const t1 = setTimeout(() => setPulse(false), 380);
      timeoutsRef.current.push(t1);

      const t2 = setTimeout(() => {
        // El slot de cada valor depende de `rotation`, que avanza en cada frame:
        // si el destino se recalculara durante el viaje, la transición CSS se
        // reiniciaría en cada frame y la esfera quedaría pegada. Por eso se
        // CONGELA una sola vez, al empezar a salir, la posición que tendrá su
        // slot al terminar el viaje (predicha con la duración de la transición).
        const predictedRotation = rotationRef.current + 0.012 * RELEASE_S * 1000;
        releaseTargetRef.current = {
          index: idx,
          ...computeOrbitPos(orbitConfig, idx, predictedRotation, sizeRef.current)
        };
        setPhase('release');

        const t3 = setTimeout(() => {
          setPhase('orbit');
          // Un pequeño "acomodo" al volver a su lugar (animate-stat-pop, como los
          // números de ICAP en Cifras).
          setSettleSeq((s) => s + 1);

          // Sólo hasta aquí, con la esfera ya de vuelta en su órbita,
          // se suelta la siguiente — nunca antes.
          const t4 = setTimeout(() => {
            setActiveIndex((idx + 1) % N);
            setPhase('attract');
          }, GAP_MS);
          timeoutsRef.current.push(t4);
        }, RELEASE_MS);
        timeoutsRef.current.push(t3);
      }, HOLD_MS);
      timeoutsRef.current.push(t2);
    },
    [N, orbitConfig]
  );

  const runCycle = useCallback(
    (startIndex) => {
      clearTimers();
      setActiveIndex(startIndex);
      setPhase('attract');
    },
    [clearTimers]
  );

  useEffect(() => {
    runCycle(0);
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mide en cada frame la distancia de la esfera activa al centro real y
  // dispara el aterrizaje (pulso + rayo de luz) apenas lo toca, no cuando
  // la transición CSS termina oficialmente (con ease-out se ve quieta
  // bastante antes). El timeout de respaldo cubre el caso raro en que nunca
  // se detecte.
  useEffect(() => {
    if (phase !== 'attract') return undefined;
    arrivedRef.current = false;

    const TOUCH_THRESHOLD_PX = 3;
    let rafId;

    const finish = () => {
      if (arrivedRef.current) return;
      arrivedRef.current = true;
      handleArrival(activeIndex);
    };

    const check = () => {
      const btn = activeBtnRef.current;
      const container = containerRef.current;
      if (btn && container) {
        const r = btn.getBoundingClientRect();
        const c = container.getBoundingClientRect();
        const dx = r.left + r.width / 2 - (c.left + c.width / 2);
        const dy = r.top + r.height / 2 - (c.top + c.height / 2);
        if (Math.hypot(dx, dy) < TOUCH_THRESHOLD_PX) {
          finish();
          return;
        }
      }
      rafId = requestAnimationFrame(check);
    };
    rafId = requestAnimationFrame(check);

    const fallback = setTimeout(finish, ATTRACT_MS + 400);
    timeoutsRef.current.push(fallback);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      clearTimeout(fallback);
    };
  }, [phase, activeIndex, handleArrival]);

  const activate = (index) => {
    runCycle(index);
  };

  const planetR = size < 320 ? 18 : 26;
  const current = items[activeIndex];
  const currentT = wheelT.items[current.id];
  const attracted = phase === 'attract' || phase === 'hold';
  const centerX = size / 2;
  const centerY = size / 2;

  return (
    <section className="px-4 sm:px-6 pt-[var(--docencia-gap)] pb-14 sm:pb-24 bg-[#D6E9F7] dark:bg-[#001F3D] text-slate-900 dark:text-white relative overflow-hidden">
      {/* Starfield */}
      <div className="absolute inset-0 pointer-events-none">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-[#003366]/40 dark:bg-white/70 animate-pulse"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animationDelay: `${s.delay}s`,
              animationDuration: '3.5s'
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl lg:max-w-5xl mx-auto flex flex-col items-center text-center relative">
        {/* Header */}
        <div className="mb-1.5 sm:mb-2">
          <KickerBadge variant="glow">{wheelT.kicker}</KickerBadge>
        </div>
        <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-[#003366] dark:text-[#9FC6E8] tracking-tight mb-2.5">
          {wheelT.title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-[#9FC6E8] max-w-md mb-8 sm:mb-12 leading-relaxed">
          {wheelT.subtitle}
        </p>

        {/* Mobile Quick Selector Chips */}
        <div className="flex sm:hidden items-center gap-1.5 overflow-x-auto w-full pb-3 mb-4 scrollbar-none px-1">
          {items.map((v, i) => {
            const isSelected = activeIndex === i;
            return (
              <button
                key={v.id}
                onClick={() => activate(i)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-heading font-bold shrink-0 transition-all ${
                  isSelected
                    ? 'bg-[#0077C8] text-white shadow-md'
                    : 'bg-[#003366] text-slate-300 border border-white/10'
                }`}
              >
                <span>{wheelT.items[v.id].name}</span>
              </button>
            );
          })}
        </div>

        {/* Galaxia orbital + ficha del valor activo: lado a lado en lg+ (como el
            mapa y la ficha de Presencia Regional), apiladas debajo. El ancho real
            de la galaxia lo sigue midiendo el ResizeObserver. */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 lg:gap-8 lg:items-center">
        {/* Orbital Galaxy */}
        <div className="lg:col-span-7 flex justify-center">
        <div ref={containerRef} className="relative w-[280px] h-[280px] sm:w-96 sm:h-96 my-2 sm:my-4">
          {/* Central Logo Node */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
            style={{ width: size < 320 ? 64 : 96, height: size < 320 ? 64 : 96 }}
          >
            <div
              className="absolute inset-[-14px] rounded-full bg-[#0077C8] blur-xl transition-opacity duration-300"
              style={{ opacity: pulse ? 0.55 : 0.18 }}
            />
            <div
              className="relative w-full h-full rounded-full bg-white shadow-xl flex items-center justify-center p-2 transition-transform duration-300 ring-4 ring-[#0077C8]/30"
              style={{ transform: pulse ? 'scale(1.08)' : 'scale(1)' }}
            >
              <img
                src={icapLogoMark}
                alt="Isotipo ICAP"
                className="w-[70%] h-[70%] object-contain"
                draggable={false}
              />
            </div>

            {/* Rayito de luz que recorre el borde del logo cuando un
                valor llega al centro. La key cambia en cada llegada
                para forzar que la animación reinicie desde cero. */}
            {flashSeq > 0 && (
              <div
                key={flashSeq}
                className="absolute inset-[-10px] sm:inset-[-14px] rounded-full pointer-events-none value-light-ring"
                aria-hidden="true"
              />
            )}
          </div>

          {/* Orbiting / Attracted Value Nodes */}
          {items.map((v, i) => {
            const Icon = v.icon;
            const isActive = activeIndex === i;
            const { x: orbitX, y: orbitY } = computeOrbitPos(orbitConfig, i, rotation, size);
            const isFlyingToCenter = isActive && attracted;
            // Mientras vuelve a su órbita usa el destino CONGELADO (ver
            // handleArrival); ya en fase 'orbit' vuelve a la posición en vivo, que
            // para entonces coincide casi exacto.
            const releaseTarget =
              isActive && phase === 'release' && releaseTargetRef.current?.index === i
                ? releaseTargetRef.current
                : null;
            const x = isFlyingToCenter ? centerX : releaseTarget ? releaseTarget.x : orbitX;
            const y = isFlyingToCenter ? centerY : releaseTarget ? releaseTarget.y : orbitY;
            // Yendo al centro: ease-out suave, sin rebote. Volviendo: un poco más
            // rápido, igual de suave.
            const isReturning = phase === 'release' || phase === 'orbit';
            const travelS = isReturning ? RELEASE_S : ATTRACT_S;
            const travelEase = isReturning ? RELEASE_EASE : ATTRACT_EASE;
            const positionTransition = !isActive ? 'none' : `left ${travelS}s ${travelEase}, top ${travelS}s ${travelEase}`;
            // El tamaño del ícono y la etiqueta duran lo mismo que el viaje, para
            // que se lea como una sola animación continua.
            const formTransition = isActive ? `${travelS}s ${travelEase}` : '0.3s ease';

            return (
              <button
                key={v.id}
                ref={isActive ? activeBtnRef : undefined}
                onClick={() => activate(i)}
                className="absolute flex flex-col items-center gap-1 focus:outline-none z-20"
                style={{
                  left: x,
                  top: y,
                  transform: 'translate(-50%, -50%)',
                  transition: positionTransition
                }}
              >
                <div
                  key={isActive && phase === 'orbit' ? `settle-${settleSeq}` : v.id}
                  className={`rounded-full flex items-center justify-center shadow-md ${
                    isActive
                      ? 'bg-[#003366] dark:bg-[#0077C8] text-[#9FC6E8] dark:text-white shadow-lg shadow-[#003366]/40 dark:shadow-[#0077C8]/40 border-2 border-white'
                      : 'bg-[#0077C8] dark:bg-[#003366] text-white dark:text-[#0077C8] border border-white/30 dark:border-white/20'
                  } ${isActive && phase === 'orbit' ? 'animate-stat-pop' : ''}`}
                  style={{
                    width: isFlyingToCenter ? planetR * 1.55 : planetR * 1.3,
                    height: isFlyingToCenter ? planetR * 1.55 : planetR * 1.3,
                    transition: `width ${formTransition}, height ${formTransition}, background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease`
                  }}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span
                  className="text-[10px] sm:text-xs font-semibold leading-tight text-[#003366] dark:text-[#EAF3FB] whitespace-nowrap"
                  style={{ opacity: isFlyingToCenter ? 0 : 1, transition: `opacity ${formTransition}` }}
                >
                  {wheelT.items[v.id].name}
                </span>
              </button>
            );
          })}
        </div>
        </div>

        {/* Active Value Detail Card */}
        <div className="lg:col-span-5 flex justify-center">
        <div
          key={current.id}
          className="animate-value-card-in mt-6 sm:mt-8 lg:mt-0 max-w-md w-full bg-[#0077C8]/90 dark:bg-[#003366]/90 border border-white/15 rounded-3xl p-5 sm:p-6 backdrop-blur-sm shadow-xl text-left"
        >
          <div className="flex items-center gap-3 mb-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 dark:bg-[#0077C8]/20 border border-white/30 dark:border-[#0077C8]/40 flex items-center justify-center text-white dark:text-[#0077C8]">
              {React.createElement(current.icon, { className: 'w-4 h-4' })}
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] font-mono-code text-white/80 dark:text-[#9FC6E8] uppercase tracking-wider block">
                {wheelT.pilarLabel}
              </span>
              <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                {currentT.name}
              </h3>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-white/90 dark:text-[#C9D9E8] leading-relaxed">
            {currentT.description}
          </p>
        </div>
        </div>
        </div>

        <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-[#6E8AA8] mt-4 max-w-xs">
          {wheelT.footerHint}
        </p>
      </div>
    </section>
  );
}
