import { useCallback, useEffect, useRef, useState } from 'react';
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

/**
 * Carrusel de los campos de interés de Investigación
 * (DocenciaInvestigacion.jsx): un tambor 3D (rotateY + translateZ por
 * tarjeta) que gira solo, se puede arrastrar y trae al frente la tarjeta
 * que se toca.
 *
 * - Cada tarjeta es el ícono del campo (FIELD_ICONS) + su nombre.
 * - La del frente crece y brilla; las de atrás se apagan. Se calcula en
 *   el loop de animación y se escribe directo al DOM, no por estado.
 * - Sombra de "piso" debajo del tambor y bordes desvanecidos.
 * - Abajo: flechas, el nombre del campo activo y un puntito por campo
 *   para saltar directo.
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

// Ancho de las tarjetas en px (se achica en pantallas angostas, ver el
// resize de abajo). El alto sale de una proporción fija que deja entrar
// el nombre más largo en 2-3 líneas.
const ANCHO_MAX = 212;
const ANCHO_MIN = 148;
// Más alta que antes (era 1.6) para que entren ícono + nombre.
const PROPORCION_ALTO = 1.3;

// Grados por frame del giro automático (~5-6 s por tarjeta en el frente
// a 60 fps).
const VELOCIDAD = 0.1;

// Bordes desvanecidos con mask-image (transparencia real) en vez de
// degradados pintados: no tapan lo que haya detrás y no dependen del
// color del fondo.
const BORDE_MASK = 'linear-gradient(to right, transparent, #000 56px, #000 calc(100% - 56px), transparent)';

// `navyLg`: en lg+ el carrusel va sobre el panel NAVY del bloque de
// Investigación (mismo fondo que el texto), así que ahí todo pasa a
// colores claros — nombre blanco, ícono/flechas/puntitos en celeste
// claro sobre blanco translúcido. En pantallas chicas no hay panel y
// se ve como siempre sobre el fondo claro de la sección.
export default function FieldsCarousel({ fields, navyLg = false }) {
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

  // Radio del cilindro para que las `n` tarjetas cierren el círculo, más
  // un poco de aire entre ellas.
  const radio = Math.round(ancho / 2 / Math.tan(Math.PI / n)) + 64;

  const drumRef = useRef(null);
  const cardRefs = useRef([]);
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
        style={{ height: alto + 160, maskImage: BORDE_MASK, WebkitMaskImage: BORDE_MASK }}
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
          className={`pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-7 w-[62%] h-5 rounded-full bg-[#003366]/15 dark:bg-black/50 blur-xl ${navyLg ? 'lg:bg-black/40' : ''}`}
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
                // Sin fondo ni borde: sólo ícono y nombre. backface-visibility:hidden
                // oculta las tarjetas de atrás del tambor, que si no se verían al revés
                // a través de las de adelante.
                className="absolute inset-0 rounded-[22px] flex items-center justify-center text-center px-4 cursor-pointer will-change-transform overflow-hidden [backface-visibility:hidden]"
              >
                <div className="relative z-10 flex flex-col items-center gap-3">
                  {/* Ícono con el aro punteado que gira alrededor — mismo
                      recurso que los íconos de Formación e Impacto
                      (orbitSpin en global.css). */}
                  <span className="relative w-10 h-10 sm:w-12 sm:h-12 shrink-0">
                    <span
                      aria-hidden="true"
                      className={`absolute -inset-1.5 rounded-full border border-dashed border-[#0077C8]/45 dark:border-white/25 pointer-events-none ${navyLg ? 'lg:border-white/30' : ''}`}
                      style={{ animation: 'orbitSpin 9s linear infinite' }}
                    />
                    <span className={`relative w-full h-full rounded-full bg-white/80 dark:bg-white/10 border border-[#0077C8]/20 dark:border-white/15 shadow-sm flex items-center justify-center text-[#0077C8] dark:text-[#4FB2F2] ${navyLg ? 'lg:bg-white/10 lg:border-white/15 lg:text-[#4FB2F2] lg:shadow-none' : ''}`}>
                      <Icon className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
                    </span>
                  </span>
                  <span className={`text-sm sm:text-base font-semibold text-[#003366] dark:text-white leading-snug ${navyLg ? 'lg:text-white' : ''}`}>
                    {field}
                  </span>
                </div>
              </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Indicador del campo activo entre las flechas + puntitos, uno
          por campo, para saltar directo a cualquiera. */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 mt-2">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Anterior"
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/70 dark:bg-white/10 border border-[#0077C8]/25 dark:border-white/15 text-[#0077C8] dark:text-[#9FC6E8] flex items-center justify-center shrink-0 shadow-sm hover:bg-white hover:scale-105 dark:hover:bg-white/20 transition ${
            navyLg ? 'lg:bg-white/10 lg:border-white/15 lg:text-[#9FC6E8] lg:shadow-none lg:hover:bg-white/20' : ''
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="min-w-0 w-44 sm:w-56 text-center" aria-live="polite">
          <div key={activeIndex} className={`font-heading font-bold text-sm sm:text-base text-[#003366] dark:text-[#9FC6E8] truncate animate-breeze-in ${navyLg ? 'lg:text-[#9FC6E8]' : ''}`}>
            {fields[activeIndex]}
          </div>
        </div>

        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Siguiente"
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/70 dark:bg-white/10 border border-[#0077C8]/25 dark:border-white/15 text-[#0077C8] dark:text-[#9FC6E8] flex items-center justify-center shrink-0 shadow-sm hover:bg-white hover:scale-105 dark:hover:bg-white/20 transition ${
            navyLg ? 'lg:bg-white/10 lg:border-white/15 lg:text-[#9FC6E8] lg:shadow-none lg:hover:bg-white/20' : ''
          }`}
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
              i === activeIndex
                ? `w-6 bg-[#0077C8] dark:bg-[#4FB2F2] ${navyLg ? 'lg:bg-[#4FB2F2]' : ''}`
                : `w-1.5 bg-[#0077C8]/25 dark:bg-white/20 hover:bg-[#0077C8]/50 ${navyLg ? 'lg:bg-white/25 lg:hover:bg-white/45' : ''}`
            }`}
          />
        ))}
      </div>
    </div>
  );
}
