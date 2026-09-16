import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { PAGES } from './navigation';
import { useLanguage } from '../../i18n/LanguageContext';

// Mismas secciones que el menú inferior (misma lista compartida, ver
// navigation.js), menos "Inicio" — ya estamos ahí, no tiene sentido
// ofrecerlo como atajo.
const SECTIONS = PAGES.filter((p) => p.id !== 'inicio');

// Cada cuánto avanza sola la esfera a la siguiente sección.
const CYCLE_MS = 2200;

/**
 * Accesos rápidos EMBEBIDOS dentro del propio Hero (ver Hero.jsx) —
 * ya no es una sección aparte, sino parte del mismo bloque animado:
 * mismas olas de fondo, mismas partículas, mismo resplandor, sin
 * ninguna costura entre "menú" y "bienvenida". No trae su propio
 * fondo ni padding de sección; hereda todo eso del Hero que lo
 * envuelve. Reutiliza tal cual el lenguaje del menú inferior: la
 * misma esferita celeste (mismo degradado, mismo halo pulsante,
 * misma curva de resorte al moverse) que ahí marca la página activa.
 * Acá, en vez de responder al clic nada más, recorre sola las 6
 * secciones en bucle — como una pequeña demostración de todo lo que
 * hay — y se detiene apenas el mouse pasa por encima, para no
 * competirle a quien la está usando de verdad. Un clic navega al
 * toque, igual que abajo.
 */
export default function SectionsStrip({ onNavigate }) {
  const { t } = useLanguage();
  const navRef = useRef(null);
  const itemRefs = useRef({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [orb, setOrb] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const [orbReady, setOrbReady] = useState(false);
  const pausedRef = useRef(false);

  const measureOrb = (index) => {
    const nav = navRef.current;
    const btn = itemRefs.current[SECTIONS[index]?.id];
    if (!nav || !btn) return;
    const navRect = nav.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    setOrb({
      left: btnRect.left - navRect.left,
      top: btnRect.top - navRect.top,
      width: btnRect.width,
      height: btnRect.height
    });
  };

  useLayoutEffect(() => {
    measureOrb(activeIndex);
    if (!orbReady) {
      // Coloca la esfera de una vez en su sitio antes de activar la
      // transición, para que no "viaje" desde la esquina al montar.
      const id = requestAnimationFrame(() => setOrbReady(true));
      return () => cancelAnimationFrame(id);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(() => measureOrb(activeIndex));
    ro.observe(nav);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // El recorrido automático de la esfera.
  useEffect(() => {
    const id = setInterval(() => {
      if (pausedRef.current) return;
      setActiveIndex((i) => (i + 1) % SECTIONS.length);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  const handleEnter = (index) => {
    pausedRef.current = true;
    setActiveIndex(index);
  };
  const handleLeave = () => {
    pausedRef.current = false;
  };

  return (
    <div className="relative z-10 w-full">
      <span className="block text-center text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-[#9FC6E8]/85 mb-2.5 sm:mb-3 font-mono-code">
        {t.sectionsStrip.kicker}
      </span>

      <nav
        ref={navRef}
        onMouseLeave={handleLeave}
        className="flex items-stretch justify-between gap-0.5 sm:gap-2 relative"
      >
        {/* Esfera animada: mismo wrapper de posición + halo + esfera
            principal que el menú inferior, viajando con la misma
            curva de resorte. */}
        <div
          aria-hidden="true"
          className="absolute pointer-events-none z-0"
          style={{
            left: 0,
            top: 0,
            width: orb.width,
            height: orb.height,
            transform: `translate(${orb.left}px, ${orb.top}px)`,
            transition: orbReady
              ? 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease'
              : 'none'
          }}
        >
          <div
            className="absolute inset-0 rounded-full blur-md animate-pulse-slow"
            style={{ background: 'radial-gradient(circle, #0077C8 0%, rgba(0,119,200,0) 72%)' }}
          />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle at 35% 28%, #4FB2F2 0%, #0077C8 55%, #003366 100%)',
              boxShadow: '0 8px 18px -3px rgba(0,51,102,0.5), inset 0 1px 3px rgba(255,255,255,0.4)'
            }}
          />
        </div>

        {SECTIONS.map((section, idx) => {
          const Icon = section.icon;
          const active = idx === activeIndex;
          return (
            <button
              key={section.id}
              onMouseEnter={() => handleEnter(idx)}
              onClick={() => onNavigate?.(section.id)}
              className="flex-1 flex flex-col items-center justify-center gap-1.5 py-1.5 px-0.5 rounded-2xl transition-colors cursor-pointer"
            >
              <span
                ref={(el) => {
                  itemRefs.current[section.id] = el;
                }}
                className="relative z-10 w-9 h-9 sm:w-14 sm:h-14 rounded-full flex items-center justify-center"
                style={{
                  transform: active ? 'scale(1.32)' : 'scale(1)',
                  transition: 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              >
                <Icon
                  className={`w-4 h-4 sm:w-6 sm:h-6 transition-colors duration-300 ${
                    active ? 'text-white' : 'text-white/40'
                  }`}
                  strokeWidth={active ? 2.4 : 2}
                />
              </span>
              <span
                className={`text-[9px] sm:text-xs font-heading tracking-wide text-center leading-tight transition-colors duration-300 ${
                  active ? 'text-white font-bold' : 'text-white/50 font-semibold'
                }`}
              >
                {t.nav[section.id]}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
