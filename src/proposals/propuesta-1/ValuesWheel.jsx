import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Shield, Star, Users, Heart, Award, Sparkles } from 'lucide-react';
import icapLogoMark from '../../assets/icap-logo-mark.png';
import { useLanguage } from '../../i18n/LanguageContext';

// El nombre y la descripción de cada valor viven en el diccionario de
// traducciones (t.valuesWheel.items[id]) — acá sólo quedan el id y el
// ícono, que no cambian según el idioma.
const VALUES = [
  { id: 'integridad', icon: Shield },
  { id: 'excelencia', icon: Star },
  { id: 'equipo', icon: Users },
  { id: 'compromiso', icon: Heart },
  { id: 'respeto', icon: Award },
  { id: 'transparencia', icon: Sparkles }
];

const N = VALUES.length;
// Misma duración yendo al centro que volviendo a la órbita, para que el
// "recorrido" se vea igual de claro en los dos sentidos. Pero la CURVA
// sí es distinta a propósito: ATTRACT_EASE arranca rapidísimo (es un
// ease-out bien marcado, se siente como que el logo "jala" al valor) y
// esa misma arrancada brusca, aplicada a la SALIDA, hacía que la esfera
// saliera disparada del logo de golpe — ahí es donde se sentía poco
// fluido. RELEASE_EASE en cambio es un ease-in-out (arranca despacio,
// toma velocidad, frena suave): se separa del logo con calma, como
// soltarse, en vez de salir disparada.
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

/* Cada valor tiene un slot FIJO en el círculo (i/N de vuelta, siempre en
   ese orden) — es lo que evita que con el tiempo dos esferas terminen
   superpuestas: antes cada una giraba a su propia velocidad y, tarde o
   temprano, una más rápida le pasaba por encima a una más lenta. Ahora
   las 6 comparten exactamente la misma velocidad base (nunca se
   adelantan entre sí) y sólo tienen un vaivén angular pequeño y
   ACOTADO (un seno, no una deriva) alrededor de su propio slot — se
   sigue sintiendo que cada una tiene vida propia, pero jamás cruza a
   su vecina. Semillas fijas (no Math.random) para que el layout no
   "salte" entre renders. */
const ORBIT_CONFIG = VALUES.map((v, i) => {
  const seed = i * 91.7;
  const r1 = Math.sin(seed) * 0.5 + 0.5;
  const r2 = Math.sin(seed * 1.9 + 3.1) * 0.5 + 0.5;
  const r3 = Math.sin(seed * 2.7 + 1.3) * 0.5 + 0.5;
  return {
    radiusFactor: 0.92 + r1 * 0.16, // 0.92–1.08 × radio base
    phaseOffset: (i / N) * 2 * Math.PI, // slot fijo: nunca cambia el orden circular
    angleWobbleAmp: 0.05 + r2 * 0.05, // ±0.05–0.10 rad (~3°–6°): vaivén, no deriva
    angleWobbleSpeed: 0.005 + r2 * 0.003,
    wobbleAmp: 3 + r1 * 4, // vaivén del radio (px)
    wobbleSpeed: 0.004 + r2 * 0.003,
    wobblePhase: r3 * Math.PI * 2
  };
});

/**
 * Posición orbital de un valor para una rotación y un tamaño de
 * contenedor dados — la misma fórmula que antes vivía repetida inline
 * en el render, ahora factorizada para poder usarla también para
 * PREDECIR dónde va a estar el slot un poco más adelante en el tiempo
 * (ver `releaseTargetRef` más abajo: es la pieza que arregla que la
 * esfera se viera "trabada" al volver a su órbita).
 */
function computeOrbitPos(index, rot, containerSize) {
  const cfg = ORBIT_CONFIG[index];
  const rad = containerSize * 0.35;
  const cx = containerSize / 2;
  const cy = containerSize / 2;
  const angleWobble = Math.sin(rot * cfg.angleWobbleSpeed + cfg.wobblePhase) * cfg.angleWobbleAmp;
  const angle = cfg.phaseOffset + (rot * Math.PI) / 180 + angleWobble;
  const wobble = Math.sin(rot * cfg.wobbleSpeed + cfg.wobblePhase) * cfg.wobbleAmp;
  const orbitRadius = rad * cfg.radiusFactor + wobble;
  return { x: cx + Math.cos(angle) * orbitRadius, y: cy + Math.sin(angle) * orbitRadius };
}

export default function ValuesWheel() {
  const { t } = useLanguage();
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

  // A partir de aquí el valor YA está en el centro (lo llama el efecto
  // de abajo, disparado por el fin real de la transición CSS — no por
  // un timer aparte que podía desincronizarse del rayo de luz).
  const handleArrival = useCallback(
    (idx) => {
      setPhase('hold');
      setPulse(true);
      setFlashSeq((s) => s + 1);

      const t1 = setTimeout(() => setPulse(false), 380);
      timeoutsRef.current.push(t1);

      const t2 = setTimeout(() => {
        // El slot orbital de cada valor depende de `rotation`, que
        // avanza en CADA frame — si dejamos que la posición de destino
        // se siga recalculando mientras la esfera viaja, el navegador
        // reinicia la transición CSS en cada frame (siempre persiguiendo
        // un blanco que se movió apenas un pelito) y la esfera nunca
        // llega a recorrer la distancia real: se queda como pegada,
        // arrastrándose. Por eso acá se "congela" UNA sola vez, apenas
        // empieza a salir, la posición donde va a estar su slot cuando
        // termine el viaje (se predice con la duración de la
        // transición), y esa es la que se usa como destino fijo
        // mientras dura el regreso — así la transición corre entera y
        // sin interrupciones, tan fluida como la ida.
        const predictedRotation = rotationRef.current + 0.012 * RELEASE_S * 1000;
        releaseTargetRef.current = { index: idx, ...computeOrbitPos(idx, predictedRotation, sizeRef.current) };
        setPhase('release');

        const t3 = setTimeout(() => {
          setPhase('orbit');
          // Un pequeño "acomodo" al llegar de vuelta a su lugar — un
          // toque de vida al final del viaje, igual que el de los
          // números de ICAP en Cifras (misma clase, animate-stat-pop).
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
    []
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

  // Mide en cada frame qué tan lejos está la esfera activa del centro
  // real (en píxeles) mientras viaja hacia allá, y dispara el
  // aterrizaje (pulso + rayo de luz) apenas la toca — no cuando la
  // transición CSS "termina" oficialmente: con una curva ease-out la
  // esfera ya se ve quieta bastante antes de que la transición
  // declarada llegue a su fin, así que esperar ese fin exacto hacía
  // sentir el rayo atrasado. El timeout de respaldo sólo cubre el caso
  // raro en que, por lo que sea, nunca se detecte el toque.
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

  const radius = size * 0.35;
  const planetR = size < 320 ? 18 : 26;
  const current = VALUES[activeIndex];
  const currentT = t.valuesWheel.items[current.id];
  const attracted = phase === 'attract' || phase === 'hold';
  const centerX = size / 2;
  const centerY = size / 2;

  return (
    <section className="px-4 sm:px-6 py-14 sm:py-24 bg-[#001F3D] text-white relative overflow-hidden">
      {/* Starfield */}
      <div className="absolute inset-0 pointer-events-none">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white/70 animate-pulse"
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
        <span className="text-[11px] sm:text-xs font-bold tracking-widest uppercase text-[#0077C8] block mb-1.5 font-mono-code">
          {t.valuesWheel.kicker}
        </span>
        <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-white tracking-tight mb-2.5">
          {t.valuesWheel.title}
        </h2>
        <p className="text-xs sm:text-sm text-[#9FC6E8] max-w-md mb-8 sm:mb-12 leading-relaxed">
          {t.valuesWheel.subtitle}
        </p>

        {/* Mobile Quick Selector Chips */}
        <div className="flex sm:hidden items-center gap-1.5 overflow-x-auto w-full pb-3 mb-4 scrollbar-none px-1">
          {VALUES.map((v, i) => {
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
                <span>{t.valuesWheel.items[v.id].name}</span>
              </button>
            );
          })}
        </div>

        {/* Galaxia orbital + ficha del valor activo: en escritorio (lg+)
            van una a la par de la otra, igual que el mapa y la ficha de
            país en "Presencia Regional" — abajo de `lg` el grid queda
            en una sola columna y las dos piezas se apilan en el mismo
            orden de siempre, tal cual se ve en celular hoy. La galaxia
            en sí (containerRef) no cambia de tamaño ni de posición por
            este wrapper: su ancho real lo sigue midiendo el
            ResizeObserver de más arriba, así que la animación queda
            intacta. */}
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
          {VALUES.map((v, i) => {
            const Icon = v.icon;
            const isActive = activeIndex === i;
            const { x: orbitX, y: orbitY } = computeOrbitPos(i, rotation, size);
            const isFlyingToCenter = isActive && attracted;
            // Mientras vuelve a su órbita usa el destino CONGELADO (ver
            // handleArrival) en vez del recalculado en vivo, para que
            // la transición corra entera sin que el blanco se le mueva
            // a cada frame. Ya en fase 'orbit' (recién asentada, antes
            // de que el ciclo suelte la siguiente) usa de nuevo la
            // posición en vivo — para entonces coinciden casi exacto.
            const releaseTarget =
              isActive && phase === 'release' && releaseTargetRef.current?.index === i
                ? releaseTargetRef.current
                : null;
            const x = isFlyingToCenter ? centerX : releaseTarget ? releaseTarget.x : orbitX;
            const y = isFlyingToCenter ? centerY : releaseTarget ? releaseTarget.y : orbitY;
            // Yendo al centro: ease-out suave, sin rebote, más chill que
            // antes. Volviendo a su órbita (release/orbit): un poco más
            // rápido pero igual de suave, para que se sienta como que
            // "se ordena" antes de que el ciclo vaya por el siguiente.
            const isReturning = phase === 'release' || phase === 'orbit';
            const travelS = isReturning ? RELEASE_S : ATTRACT_S;
            const travelEase = isReturning ? RELEASE_EASE : ATTRACT_EASE;
            const positionTransition = !isActive ? 'none' : `left ${travelS}s ${travelEase}, top ${travelS}s ${travelEase}`;
            // El tamaño del ícono y la etiqueta van a la MISMA duración
            // que el viaje (no un duration-300/200 fijo y corto): si no,
            // la esfera "se ve" ya asentada (tamaño final, etiqueta
            // visible) mucho antes de terminar de moverse, y el resto
            // del trayecto se lee como que ya llegó y sólo se desliza
            // de más — en vez de una sola animación fluida y continua.
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
                      ? 'bg-[#0077C8] text-white shadow-lg shadow-[#0077C8]/40 border-2 border-white'
                      : 'bg-[#003366] text-[#0077C8] border border-white/20'
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
                  className="text-[10px] sm:text-xs font-semibold leading-tight text-[#EAF3FB] whitespace-nowrap"
                  style={{ opacity: isFlyingToCenter ? 0 : 1, transition: `opacity ${formTransition}` }}
                >
                  {t.valuesWheel.items[v.id].name}
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
          className="animate-value-card-in mt-6 sm:mt-8 lg:mt-0 max-w-md w-full bg-[#003366]/90 border border-white/15 rounded-3xl p-5 sm:p-6 backdrop-blur-sm shadow-xl text-left"
        >
          <div className="flex items-center gap-3 mb-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0077C8]/20 border border-[#0077C8]/40 flex items-center justify-center text-[#0077C8]">
              {React.createElement(current.icon, { className: 'w-4 h-4' })}
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] font-mono-code text-[#9FC6E8] uppercase tracking-wider block">
                {t.valuesWheel.pilarLabel}
              </span>
              <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                {currentT.name}
              </h3>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-[#C9D9E8] leading-relaxed">
            {currentT.description}
          </p>
        </div>
        </div>
        </div>

        <p className="text-[10px] sm:text-[11px] text-[#6E8AA8] mt-4 max-w-xs">
          {t.valuesWheel.footerHint}
        </p>
      </div>
    </section>
  );
}
