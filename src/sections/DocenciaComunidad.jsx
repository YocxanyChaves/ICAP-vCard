import { Fragment, useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import KickerBadge from '../components/KickerBadge';
import { useSerpienteDeColor } from '../hooks/serpienteDeColor';
import EscudoICAP from '../components/EscudoICAP';

/**
 * "Comunidad" de Docencia — bloque 7 del brochure ("Una comunidad
 * académica centroamericana"), el cierre de Docencia (va debajo del mazo
 * de Áreas). Es un banner con el degradado de marca del Hero.
 *
 * - Kicker KickerBadge con `onDark` (el banner es oscuro en los dos temas)
 *   y distancias de --docencia-gap.
 * - El título entra palabra por palabra, subiendo desde un blur, cada vez
 *   que la sección aparece. Además lleva la serpiente de color
 *   (serpienteDeColor.js) en celeste clarito #7dd3fc.
 * - Los párrafos se "encienden" palabra por palabra ATADOS AL SCROLL
 *   (si se sube, se apagan). Lo que va después de los dos puntos del
 *   último párrafo se enciende en celeste brillante, como remate.
 * - Marca de agua grande del escudo a la derecha que gira/sube un poco
 *   con el mismo progreso del scroll.
 * - Con prefers-reduced-motion todo aparece encendido de una.
 *
 * OJO: el scroll que se escucha es el del `<main>` de Brochure.jsx, no
 * el de `window` (igual que en FormacionVisionHero.jsx).
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

  // Letras del título (para la serpiente pintora), por palabra.
  const letraRefs = useRef([]);
  let contadorLetras = 0;
  const palabrasTitulo = c.title.split(' ').map((word) => Array.from(word).map((ch) => ({ ch, j: contadorLetras++ })));
  // Arranca cuando ya terminó de entrar el título la primera vez (palabra
  // por palabra); corre mientras el título está en pantalla.
  const [serpienteLista, setSerpienteLista] = useState(false);
  useEffect(() => {
    if (!titleIn || prefersReducedMotion()) return undefined;
    const id = setTimeout(() => setSerpienteLista(true), palabrasTitulo.length * 90 + 700);
    return () => clearTimeout(id);
  }, [titleIn, palabrasTitulo.length]);
  useSerpienteDeColor(titleRef, letraRefs, contadorLetras, c.title, titleIn && serpienteLista, { serpiente: [125, 211, 252] });

  const paragraphs = toWords(c.paragraphs);
  const total = paragraphs.reduce((n, words) => n + words.length, 0);
  // Cuántas palabras van encendidas. Se estira un poco (×1.08) para que
  // la última se encienda un toque antes del tope del recorrido.
  const lit = Math.round(Math.min(1, progress * 1.08) * total);

  return (
    <section className="px-4 sm:px-6 py-[var(--docencia-gap)] bg-gradient-to-br from-[#003366] via-[#0B5A96] to-[#0077C8] text-white relative overflow-hidden">
      {/* Marca de agua — a la derecha, bien presente. Más tenue en
          mobile, donde queda detrás del texto centrado. */}
      <EscudoICAP
        tono="white"
        className="absolute top-1/2 -right-[22%] sm:-right-[8%] lg:right-[2%] h-[85%] sm:h-[95%] w-auto max-w-none opacity-[0.1] sm:opacity-[0.17] pointer-events-none will-change-transform"
        style={{
          transform: `translateY(calc(-50% + ${(1 - progress) * 40}px)) rotate(${(1 - progress) * -10 + 4}deg)`,
          transition: 'transform 0.3s ease-out'
        }}
      />

      <div className="max-w-2xl mx-auto text-center relative flex flex-col items-center gap-[var(--docencia-gap)]">
        <KickerBadge onDark>{c.kicker}</KickerBadge>

        <h2 ref={titleRef} aria-label={c.title} className="relative font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
          {palabrasTitulo.map((letras, i) => (
            <Fragment key={i}>
            <span
              aria-hidden="true"
              className="inline-block transition-[opacity,transform,filter] duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
              style={{
                opacity: titleIn ? 1 : 0,
                transform: titleIn ? 'translateY(0) scale(1)' : 'translateY(0.6em) scale(0.96)',
                filter: titleIn ? 'blur(0)' : 'blur(8px)',
                transitionDelay: titleIn ? `${i * 90}ms` : '0ms'
              }}
            >
              {letras.map(({ ch, j }) => (
                <span
                  key={j}
                  ref={(el) => {
                    letraRefs.current[j] = el;
                  }}
                >
                  {ch}
                </span>
              ))}
            </span>{' '}
            </Fragment>
          ))}
        </h2>

        <div ref={textRef} className="space-y-4 sm:space-y-5">
          {paragraphs.map((words, pi) => (
            <p key={pi} className="text-sm sm:text-base leading-relaxed">
              {words.map(({ w, i, accent }) => {
                const on = i < lit;
                return (
                  <Fragment key={i}>
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
                  </Fragment>
                );
              })}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
