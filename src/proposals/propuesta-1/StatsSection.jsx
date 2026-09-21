import React, { useEffect, useRef, useState } from 'react';
import { Briefcase, Building2, Globe2 } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../theme/ThemeContext';
import KickerBadge from './KickerBadge';

/**
 * Cuenta de 0 hasta `value` con una curva ease-out (arranca rápido, frena
 * suave al llegar al total) y expone además el progreso 0-1 de esa misma
 * animación, para poder sincronizar el anillo de progreso del ícono con
 * el número sin manejar dos relojes distintos.
 */
function useCountUp(value, start, duration) {
  const [display, setDisplay] = useState(0);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!start) return undefined;

    const startTime = performance.now();

    const tick = (now) => {
      const p = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setDisplay(Math.round(value * eased));
      setProgress(eased);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [start, value, duration]);

  return { display, progress };
}

const RING_RADIUS = 17;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

// Misma duración de conteo para las 3 tarjetas: así el "pop" final de
// los 3 números aterriza exacto al mismo tiempo.
const STAT_COUNT_DURATION = 2900;

// Tendencia de ejemplo (5 barras ascendentes) para el mini gráfico de cada
// tarjeta: no son datos reales, es solo el gesto visual de "va en aumento".
const CHART_BAR_HEIGHTS = [34, 50, 64, 80, 100];

function MiniGrowthChart({ start, hex, duration }) {
  // Reparte el gráfico entre las 5 barras, una después de otra, pero
  // termina medio segundo antes que el conteo del número: si las dos
  // animaciones aterrizan en el mismo instante (incluido el "pop" del
  // número) se siente forzado/casual; adelantarlo un poco hace que se
  // lean como dos animaciones relacionadas pero no calcadas.
  const chartDuration = Math.max(duration - 500, 600);
  const segment = chartDuration / CHART_BAR_HEIGHTS.length;

  return (
    <div className="flex items-end justify-center gap-[3px] h-6 mt-2.5" aria-hidden="true">
      {CHART_BAR_HEIGHTS.map((h, i) => (
        <div
          key={i}
          className="w-[5px] rounded-full transition-[height]"
          style={{
            height: start ? `${h}%` : '10%',
            backgroundColor: hex,
            opacity: 0.3 + (h / 100) * 0.55,
            transitionDuration: `${segment}ms`,
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            transitionDelay: start ? `${i * segment}ms` : '0ms'
          }}
        />
      ))}
    </div>
  );
}

function StatCard({ icon: Icon, value, label, sublabel, color, hex, visible, start, duration, enterDelay, popTick }) {
  const { display, progress } = useCountUp(value, start, duration);
  const dashOffset = RING_CIRCUMFERENCE * (1 - progress);

  return (
    <div
      className={`bg-slate-50 dark:bg-white/5 sm:bg-transparent dark:sm:bg-transparent rounded-2xl sm:rounded-none p-3 sm:p-4 flex flex-col items-center border border-slate-100/80 dark:border-white/10 sm:border-0 transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: visible ? `${enterDelay}ms` : '0ms' }}
    >
      {/* Ícono con anillo de progreso: se llena en sincronía con el conteo */}
      <div className="relative w-10 h-10 mb-2">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 40 40" aria-hidden="true">
          <circle cx="20" cy="20" r={RING_RADIUS} fill="none" strokeWidth="3" className="stroke-slate-100 dark:stroke-white/10" />
          <circle
            cx="20"
            cy="20"
            r={RING_RADIUS}
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            stroke="currentColor"
            className={color}
            style={{ strokeDasharray: RING_CIRCUMFERENCE, strokeDashoffset: dashOffset }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-slate-400 dark:text-slate-300">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {/* La primera vez cuenta completo de 0 al total (el "pop" espera a
          que termine el conteo). De ahí en adelante, en vez de repetir
          todo el conteo cada vez que la sección vuelve a aparecer, el
          número ya se muestra en su valor final y solo repite el
          "boop" — se ve más limpio que reiniciar toda la animación. El
          `key={popTick}` fuerza que el navegador vuelva a reproducir
          esa animación en cada reaparición (cambiar solo la clase no
          la reinicia si ya estaba puesta). */}
      <div
        key={popTick}
        className={`font-heading font-extrabold text-3xl sm:text-5xl ${color} leading-none mb-1 tracking-tight tabular-nums ${
          start ? 'animate-stat-pop' : ''
        }`}
        style={start ? { animationDelay: popTick === 0 ? `${duration}ms` : '0ms' } : undefined}
      >
        {display}
      </div>
      <div className="font-heading font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-tight">{label}</div>
      <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-300 mt-0.5">{sublabel}</div>

      {/* Mini gráfico de barras: crece apenas arranca la animación, como
          adelanto visual antes de que el número empiece a subir. */}
      <MiniGrowthChart start={start} hex={hex} duration={duration} />
    </div>
  );
}

export default function StatsSection() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  // El anillo de progreso y el mini gráfico de barras se pintan con
  // `hex` directo en un `style` inline (SVG stroke / backgroundColor),
  // así que no reaccionan solos a las clases `dark:` de Tailwind — acá
  // se elige a mano un celeste más claro para el navy (#003366), que en
  // fondo oscuro casi no se distingue.
  const navyHex = theme === 'dark' ? '#4FB2F2' : '#003366';
  const stats = [
    {
      id: 'proyectos',
      value: 124,
      color: 'text-[#003366] dark:text-white',
      hex: navyHex,
      icon: Briefcase
    },
    {
      id: 'clientes',
      value: 47,
      color: 'text-[#0077C8]',
      hex: '#0077C8',
      icon: Building2
    },
    {
      id: 'paises',
      value: 18,
      color: 'text-[#003366] dark:text-white',
      hex: navyHex,
      icon: Globe2
    }
  ];

  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false); // aparece la tarjeta (fade + subida), cada vez
  const [started, setStarted] = useState(false); // arranca el conteo — solo la primera vez, nunca se resetea
  const [popTick, setPopTick] = useState(0); // de la segunda vez en adelante, solo repite el "boop" final
  const hasCountedRef = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;

    // El IntersectionObserver hay que sacarlo del `window` real dueño del
    // documento donde vive `el` (no del `window` global del módulo): si
    // esta sección se renderiza dentro del iframe de "Vista Móvil" (ver
    // DeviceFrame.jsx), el observer del window de afuera no puede
    // observar un nodo que vive en el documento de adentro. Mismo patrón
    // que el fix del bottom sheet en RegionalMap.jsx.
    const view = el.ownerDocument?.defaultView;
    const IO = view?.IntersectionObserver;
    let delayId;

    if (!IO) {
      // Sin soporte disponible: arrancamos directo en vez de dejar los
      // números en 0 para siempre.
      setVisible(true);
      setStarted(true);
      hasCountedRef.current = true;
      return undefined;
    }

    const observer = new IO(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (!hasCountedRef.current) {
              // Primera vez que se ve la sección: conteo completo de 0
              // al total, con su medio segundo de respiro antes de
              // arrancar, para que la sección aparezca primero y el
              // número no se sienta como que ya viene corriendo desde
              // antes de verse.
              delayId = setTimeout(() => {
                setStarted(true);
                hasCountedRef.current = true;
              }, 500);
            } else {
              // Ya contó una vez: no repite el conteo ni el llenado del
              // anillo/gráfico, solo el "boop" final del número — se ve
              // más limpio que reiniciar toda la animación cada vez que
              // se vuelve a esta sección.
              setPopTick((n) => n + 1);
            }
          } else {
            // Sale de pantalla: la tarjeta se resetea (fade + subida) y
            // vuelve a aparecer así cada vez, pero el conteo ya hecho
            // no se toca — solo se repite su "boop", nunca todo el
            // conteo de nuevo.
            if (delayId) clearTimeout(delayId);
            setVisible(false);
          }
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (delayId) clearTimeout(delayId);
    };
  }, []);

  return (
    <section ref={sectionRef} className="px-4 sm:px-6 py-10 sm:py-16 bg-[#D6E9F7] dark:bg-[#001F3D] border-y border-slate-100 dark:border-white/10">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-1 sm:mb-1.5">
          <KickerBadge variant="glow">{t.stats.kicker}</KickerBadge>
        </div>
        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#003366] dark:text-[#9FC6E8] tracking-tight mb-2">
          {t.stats.title}
        </h2>
        <div className="inline-block px-2.5 py-0.5 rounded-md bg-[#EAF3FB] dark:bg-white/10 text-[#003366] dark:text-[#9FC6E8] text-[9px] sm:text-[10px] font-mono-code font-bold tracking-wider uppercase mb-8">
          {t.stats.badge}
        </div>

        {/* 3-Column Mobile & Desktop Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-6 max-w-lg sm:max-w-3xl mx-auto">
          {stats.map((item, idx) => (
            <StatCard
              key={idx}
              icon={item.icon}
              value={item.value}
              label={t.stats.items[item.id].label}
              sublabel={t.stats.items[item.id].sublabel}
              color={item.color}
              hex={item.hex}
              visible={visible}
              start={started}
              popTick={popTick}
              // Misma duración para las 3 tarjetas a propósito: así el
              // "pop" final de los 3 números (y sus anillos/gráficos,
              // que se derivan de esta misma duración) aterriza exacto
              // al mismo tiempo, en vez de uno por uno. Sólo la entrada
              // (enterDelay) queda escalonada.
              duration={STAT_COUNT_DURATION}
              enterDelay={idx * 120}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
