import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import icapEscudoNavy from '../../assets/icap-escudo-navy.svg';
import icapEscudoWhite from '../../assets/icap-escudo-white.svg';

/**
 * Carrusel de campos de interés de Investigación
 * (DocenciaInvestigacion.jsx). Cuarta pasada sobre esta pieza, cada
 * una por pedido explícito de Yocxany:
 *
 *   1. FieldsWorld.jsx — anillos orbitando ("quitemos los anillos").
 *   2. FieldsCarousel.jsx v2 — carrusel de scroll infinito con efecto
 *      "coverflow" simulado. Funcionaba, pero Yocxany subió su propio
 *      componente (CarruselCilindrico.jsx) con un tambor 3D real y
 *      preguntó si se podía adaptar.
 *   3. FieldsCarousel.jsx v3 — adaptación de ese tambor: `rotateY` +
 *      `translateZ` por tarjeta alrededor de un cilindro imaginario,
 *      colores lisos alternados (blanco/celeste en claro, navy/celeste
 *      en oscuro) y una marca de agua grande centrada detrás de todo
 *      el tambor. Funcionalmente quedó bien (giro, arrastre, clic para
 *      traer una tarjeta al frente, auto-avance), pero visualmente
 *      "parecía trabajo de la u" — plano, sin elegancia.
 *   4. ESTA versión — mismo tambor y misma interacción, pulido visual:
 *      - La marca de agua grande de fondo se QUITÓ (Yocxany: "el fondo
 *        de todo va vacío"); en su lugar cada tarjeta lleva su propio
 *        escudo pequeño en una esquina, como ya hacen las demás cards
 *        con marca de agua del sitio (MissionVision.jsx,
 *        DocenciaPublicaciones, la card navy de acá arriba).
 *      - Fondo de cada tarjeta pasó de color liso a degradado sutil
 *        (más profundidad, menos "bloque de color plano").
 *      - Línea de brillo arriba de cada tarjeta (mismo recurso que las
 *        tarjetas de cristal de la versión de scroll anterior) para
 *        una terminación más pulida/premium.
 *      - La tarjeta que queda de frente ahora también CRECE un poco
 *        (antes sólo se aclaraba de opacidad/brillo) — el escalado se
 *        calcula en el mismo loop de animación que ya oscurecía las de
 *        atrás, así que se sigue escribiendo el transform DIRECTO al
 *        DOM en cada frame (no por React state).
 *      - Sombra de "piso" debajo del tambor — un óvalo difuminado que
 *        ancla visualmente el cilindro, como si flotara sobre una
 *        superficie en vez de quedar pegado a la nada.
 *      - Bordes del contenedor con degradado hacia el fondo de la
 *        sección, para que el corte de las tarjetas laterales (el
 *        tambor es más ancho que su ventana visible) se sienta suave
 *        en vez de un corte duro.
 */

// Tamaño de las tarjetas (ancho en px) — se ajusta un poco en pantallas
// angostas via el listener de resize de abajo. La altura sale de una
// proporción fija sobre el ancho (más alta que ancha sería raro para
// una sola palabra/frase corta; esta relación deja espacio para que
// "Integración centroamericana", la más larga de las 12, quepa en 2-3
// líneas sin desbordar la tarjeta).
const ANCHO_MAX = 180;
const ANCHO_MIN = 128;
const PROPORCION_ALTO = 1.6;

// Grados por frame cuando el tambor gira solo (~60fps ⇒ una tarjeta de
// las 12 tarda unos 5-6s en pasar por el frente, de sobra para leerla
// antes de que siga girando, como pidió Yocxany).
const VELOCIDAD = 0.1;

export default function FieldsCarousel({ fields }) {
  const n = fields.length;
  const paso = 360 / n;

  const [ancho, setAncho] = useState(ANCHO_MAX);
  useEffect(() => {
    const ajustar = () => setAncho(Math.max(ANCHO_MIN, Math.min(ANCHO_MAX, window.innerWidth * 0.42)));
    ajustar();
    window.addEventListener('resize', ajustar);
    return () => window.removeEventListener('resize', ajustar);
  }, []);
  const alto = Math.round(ancho / PROPORCION_ALTO);

  // Radio del cilindro: el que hace que las `n` tarjetas, paradas una
  // al lado de la otra en su borde, cierren el círculo exactamente.
  const radio = Math.round(ancho / 2 / Math.tan(Math.PI / n)) + 34;

  const drumRef = useRef(null);
  const cardRefs = useRef([]);
  const angleRef = useRef(0);
  const targetRef = useRef(null);
  const pausedRef = useRef(false);
  const dragRef = useRef(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let rafId;

    const draw = () => {
      if (drumRef.current) {
        drumRef.current.style.transform = `translateZ(${-radio}px) rotateY(${angleRef.current}deg)`;
      }
      // Las tarjetas que van quedando de canto/atrás se apagan y
      // oscurecen, y la que queda de frente crece un poco — así se
      // siente el volumen del cilindro (y cuál tarjeta es "la
      // activa") en vez de verse 12 tarjetas planas superpuestas.
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const a = (((i * paso + angleRef.current) % 360) + 540) % 360 - 180;
        const facing = (Math.cos((a * Math.PI) / 180) + 1) / 2; // 1 = de frente, 0 = de espaldas
        const scale = 0.92 + facing * 0.16;
        el.style.opacity = String(0.15 + facing * 0.85);
        el.style.filter = `brightness(${0.55 + facing * 0.45})`;
        el.style.pointerEvents = facing > 0.5 ? 'auto' : 'none';
        el.style.transform = `rotateY(${i * paso}deg) translateZ(${radio}px) scale(${scale})`;
      });
    };

    const tick = () => {
      if (targetRef.current !== null) {
        angleRef.current += (targetRef.current - angleRef.current) * 0.1;
        if (Math.abs(targetRef.current - angleRef.current) < 0.05) {
          angleRef.current = targetRef.current;
          targetRef.current = null;
        }
      } else if (!pausedRef.current && !dragRef.current && !reducedMotion) {
        angleRef.current -= VELOCIDAD;
      }
      draw();
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [radio, paso]);

  // Gira el tambor para dejar la tarjeta `i` al frente, siempre por el
  // camino más corto (nunca da una vuelta de más solo por llegar al
  // mismo resultado en módulo 360).
  const goToIndex = useCallback(
    (i) => {
      const current = targetRef.current ?? angleRef.current;
      const raw = -i * paso;
      const diff = raw - current;
      const shortest = diff - Math.round(diff / 360) * 360;
      targetRef.current = current + shortest;
    },
    [paso]
  );

  const step = useCallback(
    (dir) => {
      const base = targetRef.current ?? angleRef.current;
      targetRef.current = Math.round(base / paso) * paso - dir * paso;
    },
    [paso]
  );

  // Arrastrar con mouse o dedo para girar el tambor a mano.
  const onPointerDown = (e) => {
    dragRef.current = { x: e.clientX, start: angleRef.current };
    targetRef.current = null;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragRef.current) return;
    angleRef.current = dragRef.current.start + (e.clientX - dragRef.current.x) * 0.35;
  };
  const onPointerUp = () => {
    if (!dragRef.current) return;
    dragRef.current = null;
    // Imán a la tarjeta más cercana.
    targetRef.current = Math.round(angleRef.current / paso) * paso;
  };

  return (
    <div className="relative">
      <div
        className="relative w-full overflow-hidden select-none"
        style={{ height: alto + 140 }}
        onMouseEnter={() => {
          pausedRef.current = true;
        }}
        onMouseLeave={() => {
          pausedRef.current = false;
        }}
      >
        {/* Sombra de "piso" — ancla el tambor a una superficie en vez
            de dejarlo flotando sobre nada. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-7 w-[62%] h-5 rounded-full bg-[#003366]/15 dark:bg-black/50 blur-xl"
        />

        <div
          className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y"
          style={{ perspective: '1100px' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div
            ref={drumRef}
            className="relative"
            style={{ width: ancho, height: alto, transformStyle: 'preserve-3d' }}
          >
            {fields.map((field, i) => (
              <div
                key={`${i}-${field}`}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                onClick={() => goToIndex(i)}
                className={`absolute inset-0 rounded-[20px] flex items-center justify-center text-center px-3 border cursor-pointer will-change-transform overflow-hidden ${
                  i % 2 === 0
                    ? 'bg-gradient-to-br from-white to-[#EAF3FB] dark:from-[#013A63] dark:to-[#001F3D] border-slate-100 dark:border-white/10 shadow-[0_16px_32px_-14px_rgba(0,51,102,0.45)] dark:shadow-[0_16px_32px_-14px_rgba(0,0,0,0.6)]'
                    : 'bg-gradient-to-br from-[#CFE9FA] to-[#8FC9EA] dark:from-[#0077C8] dark:to-[#0068AE] border-white/70 dark:border-white/10 shadow-[0_16px_32px_-14px_rgba(0,51,102,0.5)] dark:shadow-[0_16px_32px_-14px_rgba(0,0,0,0.6)]'
                }`}
              >
                {/* Línea de brillo arriba — el mismo toque "de cristal"
                    que llevaban las tarjetas de la versión de scroll
                    anterior, para que no se sientan bloques de color
                    lisos. */}
                <span
                  aria-hidden="true"
                  className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/40 to-transparent"
                />
                {/* Marca de agua propia de la tarjeta, no del fondo
                    entero — navy en tema claro, blanca en oscuro. */}
                <img
                  src={icapEscudoNavy}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  className="absolute -right-3 -bottom-3 w-12 sm:w-14 opacity-[0.14] rotate-[8deg] pointer-events-none select-none dark:hidden"
                />
                <img
                  src={icapEscudoWhite}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  className="hidden absolute -right-3 -bottom-3 w-12 sm:w-14 opacity-[0.16] rotate-[8deg] pointer-events-none select-none dark:block"
                />
                <span className="relative text-xs sm:text-sm font-semibold text-[#003366] dark:text-white leading-snug">
                  {field}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Degradado hacia el fondo de la sección en los bordes — para
            que el corte de las tarjetas laterales (el tambor es más
            ancho que esta ventana) se sienta suave. */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 sm:w-16 bg-gradient-to-r from-[#D6E9F7] dark:from-[#001F3D] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 sm:w-16 bg-gradient-to-l from-[#D6E9F7] dark:from-[#001F3D] to-transparent" />
      </div>

      <div className="flex items-center justify-center gap-3 mt-4">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Anterior"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/70 dark:bg-white/10 border border-[#0077C8]/25 dark:border-white/15 text-[#0077C8] dark:text-[#9FC6E8] flex items-center justify-center shrink-0 shadow-sm hover:bg-white dark:hover:bg-white/20 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Siguiente"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/70 dark:bg-white/10 border border-[#0077C8]/25 dark:border-white/15 text-[#0077C8] dark:text-[#9FC6E8] flex items-center justify-center shrink-0 shadow-sm hover:bg-white dark:hover:bg-white/20 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
