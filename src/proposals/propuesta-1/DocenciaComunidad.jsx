import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import KickerBadge from './KickerBadge';
import icapEscudoWhite from '../../assets/icap-escudo-white.svg';

/**
 * "Comunidad" de Docencia — bloque 7 del brochure ("Una comunidad
 * académica centroamericana"), el cierre de las subsecciones propias
 * de Docencia (va debajo del mazo de Áreas, ver DocenciaAreasWheel).
 * Se deja como un banner con el mismo degradado de marca del Hero en
 * vez de la tarjeta blanca de Misión/Investigación — sin listas ni
 * items, un cierre de texto se siente más a tono como banner que como
 * ficha.
 *
 * Segunda pasada, a pedido de Yocxany:
 * - Kicker con la píldora y el puntito pulsante (KickerBadge, variante
 *   `onDark` porque este banner es oscuro en los dos temas).
 * - Misma distancia entre elementos que las demás subsecciones de
 *   Docencia (--docencia-gap en global.css).
 * - Animación del texto al scrollear, "notoria pero elegante" al ser
 *   una sección que es sólo texto:
 *     · El título entra palabra por palabra, subiendo desde un blur,
 *       escalonado, cada vez que la sección aparece en pantalla.
 *     · Los párrafos se "encienden" palabra por palabra ATADOS AL
 *       SCROLL: arrancan apagados (tenues y un poco desenfocados) y a
 *       medida que se baja se van iluminando en orden de lectura — si
 *       se sube, se vuelven a apagar. La frase después de los dos
 *       puntos del último párrafo ("comprender lo nacional, dialogar
 *       con lo regional…") se enciende además en celeste brillante,
 *       como remate.
 *   Con prefers-reduced-motion todo aparece encendido de una.
 * - Marca de agua grande del escudo a la derecha, en blanco con
 *   bastante opacidad para que contraste con el degradado (pidió que
 *   "se note mucho"); gira/sube un poco con el mismo progreso del
 *   scroll para que acompañe la lectura.
 *
 * OJO: el scroll que se escucha es el del `<main>` de Propuesta1.jsx,
 * no el de `window` (mismo motivo que en FormacionVisionHero.jsx).
 */

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Progreso 0→1 del bloque de párrafos atado al scroll del <main>:
// 0 cuando el bloque asoma por abajo (su borde de arriba al 90% de la
// altura visible), 1 cuando su borde de abajo sube al 55% — o cuando ya
// no se puede bajar más, porque esta sección es la última de la página
// y si no el final del texto nunca llegaría a encenderse.
function useScrollProgress(ref) {
  const [progress, setProgress] = useState(() => (prefersReducedMotion() ? 1 : 0));

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const el = ref.current;
    const main = el?.closest('main');
    if (!el || !main) return undefined;

    let rafId = null;
    const measure = () => {
      rafId = null;
      const H = main.clientHeight;
      const top = main.scrollTop;
      const mainTop = main.getBoundingClientRect().top;
      const rect = el.getBoundingClientRect();
      const start = top + (rect.top - mainTop) - 0.9 * H;
      const end = Math.min(top + (rect.bottom - mainTop) - 0.55 * H, main.scrollHeight - H);
      const p = end <= start ? (top >= end ? 1 : 0) : (top - start) / (end - start);
      setProgress(Math.max(0, Math.min(1, p)));
    };
    const onScroll = () => {
      if (rafId === null) rafId = requestAnimationFrame(measure);
    };

    measure();
    main.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      main.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [ref]);

  return progress;
}

// true mientras el elemento está en pantalla (se vuelve a false al
// salir, para que la entrada del título se repita al volver).
function useInView(ref) {
  const [inView, setInView] = useState(() => prefersReducedMotion());

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const el = ref.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      root: el.closest('main'),
      threshold: 0.6
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return inView;
}

// Parte los párrafos en palabras con un índice global (orden de
// lectura) y marca como "acento" lo que va después de los dos puntos
// del último párrafo.
function toWords(paragraphs) {
  let index = 0;
  return paragraphs.map((p, pi) => {
    const colon = pi === paragraphs.length - 1 ? p.indexOf(':') : -1;
    const head = colon === -1 ? p : p.slice(0, colon + 1);
    const tail = colon === -1 ? '' : p.slice(colon + 1);
    const words = [];
    head.split(/\s+/).filter(Boolean).forEach((w) => words.push({ w, i: index++, accent: false }));
    tail.split(/\s+/).filter(Boolean).forEach((w) => words.push({ w, i: index++, accent: true }));
    return words;
  });
}

export default function DocenciaComunidad() {
  const { t } = useLanguage();
  const c = t.docenciaComunidad;

  const titleRef = useRef(null);
  const textRef = useRef(null);
  const titleIn = useInView(titleRef);
  const progress = useScrollProgress(textRef);

  const paragraphs = toWords(c.paragraphs);
  const total = paragraphs.reduce((n, words) => n + words.length, 0);
  // Cuántas palabras van encendidas. Se estira un poco (×1.08) para que
  // la última se encienda un toque antes del tope del recorrido.
  const lit = Math.round(Math.min(1, progress * 1.08) * total);

  return (
    <section className="px-4 sm:px-6 py-[var(--docencia-gap)] bg-gradient-to-br from-[#003366] via-[#0B5A96] to-[#0077C8] text-white relative overflow-hidden">
      {/* Marca de agua — a la derecha, bien presente. Más tenue en
          mobile, donde queda detrás del texto centrado. */}
      <img
        src={icapEscudoWhite}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="absolute top-1/2 -right-[22%] sm:-right-[8%] lg:right-[2%] h-[85%] sm:h-[95%] w-auto max-w-none opacity-[0.1] sm:opacity-[0.17] pointer-events-none select-none will-change-transform"
        style={{
          transform: `translateY(calc(-50% + ${(1 - progress) * 40}px)) rotate(${(1 - progress) * -10 + 4}deg)`,
          transition: 'transform 0.3s ease-out'
        }}
      />

      <div className="max-w-2xl mx-auto text-center relative flex flex-col items-center gap-[var(--docencia-gap)]">
        <KickerBadge onDark>{c.kicker}</KickerBadge>

        <h2 ref={titleRef} className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
          {c.title.split(' ').map((word, i) => (
            <React.Fragment key={i}>
            <span
              className="inline-block transition-[opacity,transform,filter] duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
              style={{
                opacity: titleIn ? 1 : 0,
                transform: titleIn ? 'translateY(0) scale(1)' : 'translateY(0.6em) scale(0.96)',
                filter: titleIn ? 'blur(0)' : 'blur(8px)',
                transitionDelay: titleIn ? `${i * 90}ms` : '0ms'
              }}
            >
              {word}
            </span>{' '}
            </React.Fragment>
          ))}
        </h2>

        <div ref={textRef} className="space-y-4 sm:space-y-5">
          {paragraphs.map((words, pi) => (
            <p key={pi} className="text-sm sm:text-base leading-relaxed">
              {words.map(({ w, i, accent }) => {
                const on = i < lit;
                return (
                  <React.Fragment key={i}>
                  <span
                    className={`inline-block transition-[opacity,transform,filter,color] duration-500 ease-out ${
                      accent && on ? 'text-[#7dd3fc] font-semibold' : 'text-[#D6E9F7]'
                    }`}
                    style={{
                      opacity: on ? 1 : 0.18,
                      transform: on ? 'translateY(0)' : 'translateY(4px)',
                      filter: on ? 'blur(0)' : 'blur(1.5px)',
                      textShadow: accent && on ? '0 0 18px rgba(125,211,252,0.55)' : 'none'
                    }}
                  >
                    {w}
                  </span>{' '}
                  </React.Fragment>
                );
              })}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
