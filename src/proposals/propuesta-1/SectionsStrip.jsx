import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

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
 *
 * `pages` es la lista completa del departamento activo (misma forma que
 * PAGES/DOCENCIA_PAGES en navigation.js, con "Inicio" incluido) — la
 * pasa Hero, que a su vez la recibe de Propuesta1.jsx. Así, al cambiar
 * de departamento, esta tira siempre muestra las subsecciones que
 * corresponden (nunca las del otro departamento).
 */
export default function SectionsStrip({ onNavigate, pages }) {
  const { t } = useLanguage();
  // Mismas secciones que el menú inferior del departamento activo, menos
  // "Inicio" — ya estamos ahí, no tiene sentido ofrecerlo como atajo.
  const SECTIONS = useMemo(() => pages.filter((p) => p.id !== 'inicio'), [pages]);
  const navRef = useRef(null);
  const itemRefs = useRef({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [orb, setOrb] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const [orbReady, setOrbReady] = useState(false);
  const pausedRef = useRef(false);
  // Sentido del recorrido automático: 1 = avanzando, -1 = de vuelta. Al
  // llegar a una punta se invierte en vez de saltar directo de Contacto
  // a Misión (eso se sentía como un salto brusco cruzando toda la
  // barra) — así la esfera siempre se mueve de a una burbuja, sea de
  // ida o de vuelta, nunca de golpe. Se calcula todo por fuera del
  // updater de useState (en vez de mutar esta ref ADENTRO de un
  // `setActiveIndex(i => ...)`) porque React puede invocar ese updater
  // más de una vez por tick (p. ej. en StrictMode), y ahí la mutación
  // del sentido se duplicaba y el rebote se desincronizaba.
  const directionRef = useRef(1);
  const activeIndexRef = useRef(0);

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

  // Al cambiar de departamento (pages cambia de PAGES a DOCENCIA_PAGES o
  // viceversa) arrancamos de nuevo desde la primera sección — si no, el
  // índice viejo podía quedar apuntando a una sección que ya no existe
  // en la lista nueva.
  useEffect(() => {
    activeIndexRef.current = 0;
    directionRef.current = 1;
    setActiveIndex(0);
  }, [SECTIONS]);

  // El recorrido automático de la esfera: va y vuelve (ping-pong) en
  // vez de dar toda la vuelta — al llegar a la última sección se
  // devuelve hacia la primera pasando de a una sección a la vez, igual
  // que a la ida. Depende de SECTIONS para reiniciar el intervalo (con
  // el largo correcto) apenas cambia el departamento activo.
  useEffect(() => {
    const id = setInterval(() => {
      if (pausedRef.current) return;
      let next = activeIndexRef.current + directionRef.current;
      if (next >= SECTIONS.length - 1) {
        next = SECTIONS.length - 1;
        directionRef.current = -1;
      } else if (next <= 0) {
        next = 0;
        directionRef.current = 1;
      }
      activeIndexRef.current = next;
      setActiveIndex(next);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, [SECTIONS]);

  const handleEnter = (index) => {
    pausedRef.current = true;
    activeIndexRef.current = index;
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
