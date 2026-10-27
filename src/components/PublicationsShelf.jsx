import { useEffect, useRef, useState } from 'react';
import EscudoICAP from './EscudoICAP';

/**
 * Estante de libros de Publicaciones (RCAP, Cuadernos, Editorial, Yaxché).
 *
 * - Cada publicación es un LOMO parado en el estante; siempre hay uno
 *   abierto, con su portada (nombre y descripción) desplegada al lado.
 * - Se abre otro tocando su lomo (no con hover: al cambiar los anchos el
 *   mouse terminaría abriendo otro sin querer).
 * - Sin interacción, cada 7s se abre el siguiente; se pausa con el mouse
 *   encima y se detiene tras la primera elección del usuario.
 * - Cada libro tiene `width` explícito en px: lo que uno gana el otro lo
 *   pierde en el mismo frame, así la fila no tiembla.
 * - Todos los libros llevan una copia invisible del contenido, así el
 *   estante toma siempre el alto del más largo y no salta.
 * - Las tapas se cruzan al cambiar y el contenido aparece en cascada (ver
 *   .animate-book-content en global.css).
 * - Con prefers-reduced-motion no hay auto-avance ni animaciones de ancho.
 */

const AUTO_MS = 7000;
// Duración y curva del cambio de ancho — la misma curva "lenta al
// empezar y al terminar" para el libro que abre y el que cierra.
const ANCHO_MS = 750;
const ANCHO_EASE = 'cubic-bezier(0.76, 0, 0.24, 1)';

export default function PublicationsShelf({ items }) {
  const [abierto, setAbierto] = useState(0);
  const pausadoRef = useRef(false);
  const eligioRef = useRef(false);
  const filaRef = useRef(null);
  const [anchoPortada, setAnchoPortada] = useState(null);
  const [anchoLomo, setAnchoLomo] = useState(null);
  const [sinMovimiento, setSinMovimiento] = useState(false);

  // Ancho final de la portada abierta = ancho de la fila − los lomos
  // cerrados (y sus separaciones) − el lomo del propio libro abierto,
  // con el tope de 560px del libro. Mismos valores que las clases de
  // abajo (lomo w-11/sm:w-16, gap-1.5/sm:gap-2.5, px-1/sm:px-4).
  useEffect(() => {
    const fila = filaRef.current;
    if (!fila || typeof ResizeObserver === 'undefined') return undefined;
    const medir = () => {
      const sm = window.matchMedia('(min-width: 640px)').matches;
      const lomo = sm ? 64 : 44;
      const gap = sm ? 10 : 6;
      const padding = sm ? 32 : 8;
      const disponible = fila.clientWidth - padding - (items.length - 1) * (lomo + gap);
      setAnchoPortada(Math.max(0, Math.min(560, disponible) - lomo));
      setAnchoLomo(lomo);
      setSinMovimiento(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    };
    const ro = new ResizeObserver(medir);
    ro.observe(fila);
    return () => ro.disconnect();
  }, [items.length]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const id = setInterval(() => {
      if (pausadoRef.current || eligioRef.current) return;
      setAbierto((i) => (i + 1) % items.length);
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [items.length]);

  const elegir = (i) => {
    eligioRef.current = true;
    setAbierto(i);
  };

  return (
    <div
      className="w-full"
      onMouseEnter={() => {
        pausadoRef.current = true;
      }}
      onMouseLeave={() => {
        pausadoRef.current = false;
      }}
    >
      <div ref={filaRef} className="flex items-stretch justify-center gap-1.5 sm:gap-2.5 px-1 sm:px-4">
        {items.map((item, i) => {
          const Icon = item.icon;
          const esAbierto = i === abierto;
          const medido = anchoPortada !== null && anchoLomo !== null;
          const contenido = (animado) => (
          <div className={`relative h-full flex flex-col px-4 sm:px-7 py-5 sm:py-7 ${animado ? 'animate-book-content' : ''}`}>
            <div className="flex items-center justify-between pb-2.5 border-b border-[#003366]/15 dark:border-white/15 font-mono-code text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#0077C8] dark:text-[#9FC6E8]">
              <span>ICAP</span>
              <span>Nº {String(i + 1).padStart(2, '0')}</span>
            </div>
            <Icon className="mt-5 w-9 h-9 sm:w-11 sm:h-11 shrink-0 text-[#0077C8] dark:text-[#4FB2F2]" strokeWidth={1.6} />
            <h3 className="mt-3 font-heading font-extrabold text-lg sm:text-2xl text-[#003366] dark:text-white leading-tight">
              {item.name}
            </h3>
            <span aria-hidden="true" className="mt-3 block w-12 h-[3px] rounded-full" style={{ background: item.accent }} />
            <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{item.description}</p>
          </div>
          );
          return (
            <div
              key={item.id}
              className={`relative flex min-h-[420px] sm:min-h-[400px] rounded-t-md rounded-b-sm ${
                medido ? 'flex-none' : esAbierto ? 'flex-1 max-w-[560px]' : 'flex-none w-11 sm:w-16'
              } ${
                esAbierto
                  ? '-translate-y-2 shadow-[0_26px_44px_-20px_rgba(0,31,61,0.6)]'
                  : 'hover:-translate-y-3 shadow-[0_14px_26px_-16px_rgba(0,31,61,0.55)]'
              }`}
              style={{
                width: medido ? (esAbierto ? anchoLomo + anchoPortada : anchoLomo) : undefined,
                transition: sinMovimiento
                  ? 'none'
                  : `width ${ANCHO_MS}ms ${ANCHO_EASE}, transform 500ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow ${ANCHO_MS}ms ease`
              }}
            >
              {/* LOMO */}
              <button
                type="button"
                onClick={() => elegir(i)}
                aria-expanded={esAbierto}
                aria-label={item.name}
                className="relative shrink-0 w-11 sm:w-16 h-auto rounded-l-md rounded-r-sm overflow-hidden cursor-pointer text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4FB2F2] focus-visible:ring-offset-2"
                style={{ background: `linear-gradient(90deg, ${item.accent} 0%, color-mix(in srgb, ${item.accent} 80%, #001F3D) 100%)` }}
              >
                {/* Relieve del lomo: luz a la izquierda, sombra a la derecha */}
                <span aria-hidden="true" className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-white/25 to-transparent" />
                <span aria-hidden="true" className="absolute inset-y-0 right-0 w-1.5 bg-gradient-to-l from-black/25 to-transparent" />
                {/* Bandas de arriba y abajo, como en los lomos de colección */}
                <span aria-hidden="true" className="absolute left-0 right-0 top-9 sm:top-11 h-px bg-white/45" />
                <span aria-hidden="true" className="absolute left-0 right-0 top-10 sm:top-12 h-px bg-white/25" />
                <span aria-hidden="true" className="absolute left-0 right-0 bottom-9 sm:bottom-11 h-px bg-white/45" />
                <span aria-hidden="true" className="absolute left-0 right-0 bottom-10 sm:bottom-12 h-px bg-white/25" />

                <Icon className="absolute top-2.5 sm:top-3 left-1/2 -translate-x-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/90" strokeWidth={1.8} />
                <span className="absolute inset-x-0 top-12 sm:top-14 bottom-12 sm:bottom-14 flex items-center justify-center overflow-hidden">
                  <span className="[writing-mode:vertical-rl] rotate-180 font-heading font-bold text-[11px] sm:text-[13px] tracking-wide leading-tight max-h-full text-center">
                    {item.name}
                  </span>
                </span>
                <span className="absolute bottom-3 sm:bottom-3.5 left-1/2 -translate-x-1/2 font-mono-code text-[8px] sm:text-[9px] font-bold tracking-widest text-white/80">
                  ICAP
                </span>
              </button>

              {/* PORTADA: gira desde el lomo como una tapa (rotateY de -80° a 0).
                  El contenido tiene ancho fijo (el de la portada abierta) para que el
                  texto no se reacomode mientras se abre. */}
              <div
                className="relative flex-1 min-w-0 overflow-hidden rounded-r-md"
                style={{ perspective: '1400px' }}
                aria-hidden={!esAbierto}
              >
                {/* Copia invisible del contenido, en flujo: da el alto al estante (la
                    portada animada es `absolute`). Va en todos los libros para que el
                    alto sea siempre el del más largo. */}
                <div aria-hidden="true" className="invisible" style={{ width: anchoPortada ?? '100%' }}>
                  {contenido(false)}
                </div>
                <div
                  className={`absolute inset-y-0 left-0 overflow-hidden rounded-r-md border-y border-r border-white/80 dark:border-white/15 bg-gradient-to-br from-white/90 via-white/70 to-[#EAF3FB]/70 dark:from-white/[0.12] dark:via-white/[0.06] dark:to-[#013A63]/60 backdrop-blur-xl ${
                    esAbierto ? '' : 'pointer-events-none'
                  }`}
                  style={{
                    width: anchoPortada ?? '100%',
                    transformOrigin: 'left center',
                    transform: esAbierto ? 'rotateY(0deg)' : 'rotateY(-80deg)',
                    opacity: esAbierto ? 1 : 0,
                    transition: sinMovimiento
                      ? 'none'
                      : esAbierto
                        ? 'transform 1000ms cubic-bezier(0.22, 1, 0.36, 1) 220ms, opacity 500ms ease-out 220ms'
                        : 'transform 550ms cubic-bezier(0.45, 0, 0.55, 1), opacity 400ms ease-in-out 100ms'
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/90 dark:via-white/40 to-transparent"
                  />
                  {/* Sombra del pliegue junto al lomo */}
                  <span aria-hidden="true" className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-[#003366]/15 dark:from-black/30 to-transparent" />
                  <EscudoICAP
                    tono="navy"
                    className="pointer-events-none absolute -right-10 -bottom-12 w-48 sm:w-60 opacity-[0.07] rotate-[8deg] dark:hidden"
                  />
                  <EscudoICAP
                    tono="white"
                    className="pointer-events-none absolute -right-10 -bottom-12 w-48 sm:w-60 opacity-[0.08] rotate-[8deg] hidden dark:block"
                  />
                  {contenido(esAbierto && !sinMovimiento)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* El estante */}
      <div aria-hidden="true" className="relative mx-auto max-w-[760px]">
        <div className="h-3 sm:h-3.5 rounded-sm bg-gradient-to-b from-[#0B5A96] to-[#003366] dark:from-white/25 dark:to-white/10 shadow-[0_10px_18px_-8px_rgba(0,31,61,0.6)]" />
        <div className="mx-3 h-2 rounded-b-md bg-[#003366]/25 dark:bg-black/30 blur-[2px]" />
      </div>

      {/* Puntitos: cuál está abierto + saltar directo */}
      <div className="flex items-center justify-center gap-1.5 mt-5">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => elegir(i)}
            aria-label={item.name}
            aria-current={i === abierto}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === abierto ? 'w-6 bg-[#0077C8] dark:bg-[#4FB2F2]' : 'w-2 bg-[#0077C8]/25 dark:bg-white/25 hover:bg-[#0077C8]/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
