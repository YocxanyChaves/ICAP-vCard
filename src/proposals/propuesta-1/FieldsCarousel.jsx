import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Landmark,
  ScrollText,
  Telescope,
  Lightbulb,
  Cpu,
  HeartPulse,
  Microscope,
  ClipboardList,
  BadgeCheck,
  Zap,
  Leaf,
  Globe2
} from 'lucide-react';
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
 *   5. Yocxany la seguía viendo "muy sencilla" (nada malo, sólo simple),
 *      así que se le sumó contenido visual sin tocar la mecánica:
 *      - Cada tarjeta lleva el ícono de su campo en un círculo (ver
 *        FIELD_ICONS) y su número (01–12) arriba a la izquierda, en vez
 *        de ser sólo una palabra.
 *      - La tarjeta que queda de frente se "enciende": un aro celeste
 *        con resplandor cuya opacidad se calcula en el mismo loop que
 *        ya escalaba/oscurecía las tarjetas (sólo se nota bien de
 *        frente, se apaga suave al girar).
 *      - Abajo, entre las flechas, un indicador del campo activo
 *        ("03 / 12" + nombre) y una fila de puntitos clickeables, uno
 *        por campo — ubica al usuario en el recorrido y deja saltar
 *        directo a cualquiera.
 */

// Ícono de cada campo, en el MISMO orden que
// t.docenciaInvestigacion.fields en translations.js (va por índice
// porque los nombres cambian según el idioma).
const FIELD_ICONS = [
  Landmark, // Gobernanza
  ScrollText, // Políticas públicas
  Telescope, // Prospectiva
  Lightbulb, // Innovación pública
  Cpu, // Transformación digital
  HeartPulse, // Salud
  Microscope, // Epidemiología
  ClipboardList, // Gestión de proyectos
  BadgeCheck, // Calidad institucional
  Zap, // Energía
  Leaf, // Desarrollo sostenible
  Globe2 // Integración centroamericana
];

// Tamaño de las tarjetas (ancho en px) — se ajusta un poco en pantallas
// angostas via el listener de resize de abajo. La altura sale de una
// proporción fija sobre el ancho (más alta que ancha sería raro para
// una sola palabra/frase corta; esta relación deja espacio para que
// "Integración centroamericana", la más larga de las 12, quepa en 2-3
// líneas sin desbordar la tarjeta).
const ANCHO_MAX = 212;
const ANCHO_MIN = 148;
// Más alta que antes (era 1.6) para que entren ícono + nombre.
const PROPORCION_ALTO = 1.3;

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
  // al lado de la otra en su borde, cierren el círculo exactamente. El
  // extra que se le suma es el aire entre tarjetas (Yocxany las pidió
  // "un poquito más separadas").
  const radio = Math.round(ancho / 2 / Math.tan(Math.PI / n)) + 64;

  const drumRef = useRef(null);
  const cardRefs = useRef([]);
  const glowRefs = useRef([]);
  // Índice de la tarjeta que está de frente — para el indicador de
  // abajo. Se calcula en el loop de animación pero sólo se pasa a React
  // cuando CAMBIA (no en cada frame).
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
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
        const glow = glowRefs.current[i];
        if (glow) glow.style.opacity = String(Math.pow(facing, 14));
      });

      const front = ((Math.round(-angleRef.current / paso) % n) + n) % n;
      if (front !== activeIndexRef.current) {
        activeIndexRef.current = front;
        setActiveIndex(front);
      }
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
  }, [radio, paso, n]);

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
        style={{ height: alto + 160 }}
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
            {fields.map((field, i) => {
              const Icon = FIELD_ICONS[i % FIELD_ICONS.length];
              return (
              <div
                key={`${i}-${field}`}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                onClick={() => goToIndex(i)}
                className={`absolute inset-0 rounded-[22px] flex items-center justify-center text-center px-4 border cursor-pointer will-change-transform overflow-hidden backdrop-blur-xl backdrop-saturate-150 ${
                  i % 2 === 0
                    ? 'bg-gradient-to-br from-white/85 via-white/60 to-[#EAF3FB]/55 dark:from-white/[0.14] dark:via-white/[0.07] dark:to-[#013A63]/60 border-white/80 dark:border-white/20'
                    : 'bg-gradient-to-br from-[#E4F3FD]/85 via-[#CFE9FA]/65 to-[#8FC9EA]/60 dark:from-[#0077C8]/60 dark:via-[#0068AE]/45 dark:to-[#003366]/55 border-white/75 dark:border-white/20'
                } shadow-[inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-1px_0_rgba(255,255,255,0.35),inset_0_0_24px_rgba(255,255,255,0.35),0_18px_36px_-14px_rgba(0,51,102,0.45)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-1px_0_rgba(255,255,255,0.08),inset_0_0_24px_rgba(255,255,255,0.06),0_18px_36px_-14px_rgba(0,0,0,0.65)]`}
              >
                {/* Línea de brillo arriba — el mismo toque "de cristal"
                    que llevaban las tarjetas de la versión de scroll
                    anterior, para que no se sientan bloques de color
                    lisos. */}
                <span
                  aria-hidden="true"
                  className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/40 to-transparent"
                />
                {/* Retoque "liquid glass": un reflejo especular suave
                    arriba a la izquierda (la luz pegándole al vidrio) y
                    una franja diagonal de brillo muy tenue cruzando la
                    tarjeta. Ambos detrás del texto. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-1/2 -left-1/4 w-[90%] h-[110%] rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.7),transparent)] dark:bg-[radial-gradient(closest-side,rgba(255,255,255,0.18),transparent)]"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_38%,rgba(255,255,255,0.35)_48%,transparent_58%)] dark:bg-[linear-gradient(115deg,transparent_38%,rgba(255,255,255,0.08)_48%,transparent_58%)]"
                />
                {/* Marca de agua propia de la tarjeta, no del fondo
                    entero — navy en tema claro, blanca en oscuro.
                    Centrada y grande (Yocxany la pidió "en el centro y
                    bien grandecito"), pero muy tenue y DETRÁS del texto
                    (z-0 vs. z-10) para no taparlo. */}
                <img
                  src={icapEscudoNavy}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  className="absolute z-0 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[88%] w-auto max-w-none opacity-[0.09] pointer-events-none select-none dark:hidden"
                />
                <img
                  src={icapEscudoWhite}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  className="hidden absolute z-0 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[88%] w-auto max-w-none opacity-[0.11] pointer-events-none select-none dark:block"
                />
                {/* Aro + resplandor de la tarjeta activa — opacidad
                    controlada por el loop de animación (glowRefs). */}
                <span
                  ref={(el) => {
                    glowRefs.current[i] = el;
                  }}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-20 rounded-[22px] ring-2 ring-inset ring-[#0077C8]/70 dark:ring-[#4FB2F2]/70 shadow-[inset_0_0_28px_rgba(0,119,200,0.25)] dark:shadow-[inset_0_0_28px_rgba(79,178,242,0.3)]"
                  style={{ opacity: 0 }}
                />
                <span className="absolute z-10 top-2.5 left-3.5 font-mono-code text-[10px] sm:text-[11px] font-bold text-[#0077C8]/80 dark:text-[#4FB2F2]/80">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <span className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/80 dark:bg-white/10 border border-[#0077C8]/20 dark:border-white/15 shadow-sm flex items-center justify-center text-[#0077C8] dark:text-[#4FB2F2]">
                    <Icon className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-[#003366] dark:text-white leading-snug">
                    {field}
                  </span>
                </div>
              </div>
              );
            })}
          </div>
        </div>

        {/* Degradado hacia el fondo de la sección en los bordes — para
            que el corte de las tarjetas laterales (el tambor es más
            ancho que esta ventana) se sienta suave. */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 sm:w-16 bg-gradient-to-r from-[#D6E9F7] dark:from-[#001F3D] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 sm:w-16 bg-gradient-to-l from-[#D6E9F7] dark:from-[#001F3D] to-transparent" />
      </div>

      {/* Indicador del campo activo entre las flechas + puntitos, uno
          por campo, para saltar directo a cualquiera. */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 mt-2">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Anterior"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/70 dark:bg-white/10 border border-[#0077C8]/25 dark:border-white/15 text-[#0077C8] dark:text-[#9FC6E8] flex items-center justify-center shrink-0 shadow-sm hover:bg-white hover:scale-105 dark:hover:bg-white/20 transition"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="min-w-0 w-44 sm:w-56 text-center" aria-live="polite">
          <div className="font-mono-code text-[11px] font-bold tracking-widest text-[#0077C8] dark:text-[#4FB2F2]">
            {String(activeIndex + 1).padStart(2, '0')}
            <span className="text-[#0077C8]/40 dark:text-[#4FB2F2]/40"> / {String(n).padStart(2, '0')}</span>
          </div>
          <div key={activeIndex} className="font-heading font-bold text-sm sm:text-base text-[#003366] dark:text-[#9FC6E8] truncate animate-breeze-in">
            {fields[activeIndex]}
          </div>
        </div>

        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Siguiente"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/70 dark:bg-white/10 border border-[#0077C8]/25 dark:border-white/15 text-[#0077C8] dark:text-[#9FC6E8] flex items-center justify-center shrink-0 shadow-sm hover:bg-white hover:scale-105 dark:hover:bg-white/20 transition"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-1.5 mt-4">
        {fields.map((field, i) => (
          <button
            key={`dot-${i}`}
            type="button"
            onClick={() => goToIndex(i)}
            aria-label={field}
            aria-current={i === activeIndex}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeIndex ? 'w-6 bg-[#0077C8] dark:bg-[#4FB2F2]' : 'w-1.5 bg-[#0077C8]/25 dark:bg-white/20 hover:bg-[#0077C8]/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
