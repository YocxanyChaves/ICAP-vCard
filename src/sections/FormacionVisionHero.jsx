import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSerpienteDeColor } from '../hooks/serpienteDeColor';
import EscudoICAP from '../components/EscudoICAP';

/**
 * "Formación con Visión de Futuro" — el bloque debajo del Hero en el
 * Inicio de Docencia. Dos paneles (apilados en mobile, lado a lado desde
 * `md:`, 35% / 65%):
 *
 * - Izquierdo, navy fijo: el título grande ("Conocimiento para Anticipar,
 *   Liderar y Transformar"), sin kicker. Va en renglones (las palabras
 *   cortas se pegan a la siguiente, ver `renglonesTitulo`) con el tamaño
 *   ajustado para que el renglón más largo llene el ancho, y cada
 *   CAMBIO_MS se reacomoda en otra composición (COMPOSICIONES). Las letras
 *   entran desordenadas y se acomodan con el scroll (`estiloLetra`), y la
 *   serpiente de color (serpienteDeColor.js) las va pintando de celeste.
 *   Detrás flota una luz celeste difuminada (aurora).
 * - Derecho, sigue el tema: el párrafo justificado baja como un solo
 *   bloque desde arriba del borde del panel, pegado al scroll, y los
 *   renglones van asomando de a uno (`useBajada`). Al final, la frase de
 *   cierre (`closing`) sale desde el borde que comparte con el título
 *   (`useSalidaCierre`) y hace un boop sutil (`animate-closing-boop`) al
 *   terminar el scroll. Marca de agua del escudo, muy tenue.
 *
 * La sección mide lo que su contenido necesita (sin wrapper alto ni
 * `sticky`): al ser la última de la página, un truco de sticky dejaba un
 * hueco vacío al final.
 *
 * OJO: el scroll que se escucha NO es el de `window`: el que scrollea es
 * el `<main className="overflow-y-auto">` de Brochure.jsx. Por eso el
 * listener se engancha al `closest('main')` del elemento, que funciona
 * igual en la vista normal y dentro del iframe de "Vista Móvil".
 */

// Progreso "crudo" (0→1) de la caída del párrafo, atado al scroll de
// `main`.
//
// OJO: `elRef` tiene que apuntar a un elemento SIN el transform animado
// (el <p> real va adentro): medir el elemento que se mueve crearía un
// lazo de realimentación. Además se usa un ancla invariante al scroll,
// `topAtZeroScroll` (dónde estaría el borde de arriba si `scrollTop`
// fuera 0).
//
// 0% = el párrafo recién asoma por abajo de la pantalla.
// 100% = el `scrollTop` máximo real de `main` (esta sección es la última
// de la página), así el recorrido completo siempre es alcanzable.
function useRevealProgress(elRef) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return undefined;

    const scrollParent = el.closest('main');
    if (!scrollParent) return undefined;

    let rafId = null;

    const measure = () => {
      rafId = null;
      const rect = el.getBoundingClientRect();
      const parentRect = scrollParent.getBoundingClientRect();
      const viewportHeight = parentRect.height;
      const scrollTop = scrollParent.scrollTop;
      const maxScroll = scrollParent.scrollHeight - scrollParent.clientHeight;

      const topNow = rect.top - parentRect.top;
      const topAtZeroScroll = topNow + scrollTop;
      const startScrollTop = topAtZeroScroll - viewportHeight;
      const endScrollTop = maxScroll;
      const span = endScrollTop - startScrollTop;
      if (span <= 0) {
        setProgress(1);
        return;
      }
      const p = Math.min(1, Math.max(0, (scrollTop - startScrollTop) / span));
      setProgress(p);
    };

    const onScrollOrResize = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(measure);
    };

    measure();
    scrollParent.addEventListener('scroll', onScrollOrResize, { passive: true });
    const view = el.ownerDocument?.defaultView;
    view?.addEventListener('resize', onScrollOrResize);

    return () => {
      scrollParent.removeEventListener('scroll', onScrollOrResize);
      view?.removeEventListener('resize', onScrollOrResize);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [elRef]);

  return progress;
}

// Suaviza un valor 0→1 que cambia a saltos persiguiéndolo cuadro a
// cuadro (lerp: display += (target - display) * factor), así la caída se
// siente fluida en vez de pegada al pixel del scroll. Corre en su propio
// requestAnimationFrame para seguir unos cuadros después de soltar.
function useSmoothedValue(target, factor = 0.16) {
  const [display, setDisplay] = useState(target);
  const displayRef = useRef(target);
  const rafRef = useRef(null);

  useEffect(() => {
    const step = () => {
      const diff = target - displayRef.current;
      if (Math.abs(diff) < 0.001) {
        displayRef.current = target;
        setDisplay(target);
        rafRef.current = null;
        return;
      }
      displayRef.current += diff * factor;
      setDisplay(displayRef.current);
      rafRef.current = requestAnimationFrame(step);
    };
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(step);
    }
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [target, factor]);

  return display;
}

function useScrollSettleProgress(elRef) {
  const raw = useRevealProgress(elRef);
  return useSmoothedValue(raw);
}

// Se dispara una sola vez cuando el elemento entra en pantalla
// (IntersectionObserver). Se usa para la entrada del título, que con una
// animación al montar ya habría terminado antes de llegar acá.
function useEnterOnceVisible(elRef, threshold = 0.35) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return undefined;
    const view = el.ownerDocument?.defaultView;
    const Observer = view?.IntersectionObserver;
    if (!Observer) {
      setVisible(true);
      return undefined;
    }
    const observer = new Observer(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [elRef, threshold]);

  return visible;
}

// Bajada del bloque de texto: mide cuánto tiene que subir el bloque para
// quedar entero escondido arriba del borde del panel (overflow-hidden) y
// devuelve el `transform` para un progreso dado (0 = escondido, 1 = en su
// lugar). offsetTop/offsetHeight no los afectan los transform animados.
// La bajada es casi lineal, sólo frena un poco al final.
const MARGEN_ARRIBA = 24;
const frenarSuave = (t) => 1 - Math.pow(1 - t, 2);
function useBajada(textRef) {
  const [distancia, setDistancia] = useState(0);

  useLayoutEffect(() => {
    const medir = () => {
      const fin = textRef.current;
      if (!fin) return;
      const d = fin.offsetTop + fin.offsetHeight + MARGEN_ARRIBA;
      setDistancia((prev) => (prev === d ? prev : d));
    };
    medir();
    const panel = textRef.current?.parentElement;
    if (!panel || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(medir);
    ro.observe(panel);
    panel.ownerDocument?.fonts?.ready?.then(medir);
    return () => ro.disconnect();
  }, [textRef]);

  return (progress) => ({
    transform: `translateY(${-(1 - frenarSuave(progress)) * distancia}px)`
  });
}

// Salida de la frase de cierre "desde el título": arranca corrida hacia
// la izquierda lo justo para quedar entera detrás del borde que el panel
// derecho comparte con el del título (el panel la recorta), y se desliza
// hasta su lugar en el último tramo del scroll [DESDE_CIERRE, 1] — o sea
// después de que el párrafo ya bajó casi todo.
const DESDE_CIERRE = 0.55;
const frenar = (t) => 1 - Math.pow(1 - t, 3);
function useSalidaCierre(closingRef) {
  const [distancia, setDistancia] = useState(0);

  useLayoutEffect(() => {
    const el = closingRef.current;
    if (!el) return undefined;
    const medir = () => {
      const d = el.offsetLeft + el.offsetWidth + 40;
      setDistancia((prev) => (prev === d ? prev : d));
    };
    medir();
    const panel = el.parentElement;
    if (!panel || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(medir);
    ro.observe(panel);
    return () => ro.disconnect();
  }, [closingRef]);

  return (progress) => {
    const t = frenar(Math.min(1, Math.max(0, (progress - DESDE_CIERRE) / (1 - DESDE_CIERRE))));
    return {
      transform: `translateX(${-(1 - t) * distancia}px)`,
      opacity: 0.2 + t * 0.8
    };
  };
}

// El "boop" de la frase de cierre cuando el progreso suavizado llega a su
// tope. `settledRef` evita repetirlo mientras ronda cerca de 1, y
// `resetThreshold` lo rearma si el usuario sube y vuelve a bajar.
function useBoopOnSettle(progress, threshold = 0.99, resetThreshold = 0.9) {
  const [booping, setBooping] = useState(false);
  const settledRef = useRef(false);

  useEffect(() => {
    if (!settledRef.current && progress >= threshold) {
      settledRef.current = true;
      setBooping(true);
    } else if (settledRef.current && progress < resetThreshold) {
      settledRef.current = false;
    }
  }, [progress, threshold, resetThreshold]);

  return [booping, () => setBooping(false)];
}

// Arma los renglones del título: cada palabra en su renglón, pero las
// cortas (≤ 4 letras, tipo "para", "y", "to", "and") se pegan a la
// palabra siguiente para que no quede un renglón con una sola palabrita.
function renglonesTitulo(titulo) {
  const out = [];
  let pendiente = '';
  titulo.split(' ').forEach((w) => {
    if (w.replace(/[^\p{L}]/gu, '').length <= 4) {
      pendiente = pendiente ? `${pendiente} ${w}` : w;
    } else {
      out.push(pendiente ? `${pendiente} ${w}` : w);
      pendiente = '';
    }
  });
  if (pendiente) {
    if (out.length) out[out.length - 1] = `${out[out.length - 1]} ${pendiente}`;
    else out.push(pendiente);
  }
  return out;
}

// Composiciones por las que va pasando el título cada CAMBIO_MS. Cada
// una dice, para el renglón k de n, en qué fracción del espacio libre
// de su renglón queda (0 = pegado a la izquierda, 1 = a la derecha).
const COMPOSICIONES = [
  () => 0, // alineado a la izquierda
  (k, n) => (n > 1 ? k / (n - 1) : 0), // escalera
  (k) => (k % 2 === 0 ? 0 : 1), // alternado
  () => 0.5, // centrado
  (k, n) => (n > 1 ? 1 - k / (n - 1) : 0) // escalera inversa
];
const CAMBIO_MS = 5200;

// Ajusta el tamaño de letra para que el renglón más largo llene el ancho
// del título, mide cuánto espacio libre le queda a cada renglón, y va
// cambiando de composición cada CAMBIO_MS (cuando `activo` es true).
function useAjusteTitulo(cantidad, activo) {
  const tituloRef = useRef(null);
  const renglonRefs = useRef([]);
  const [fontPx, setFontPx] = useState(null);
  const [libres, setLibres] = useState([]);
  const [composicion, setComposicion] = useState(0);

  useLayoutEffect(() => {
    const h2 = tituloRef.current;
    if (!h2) return undefined;
    const medir = () => {
      const disponible = h2.clientWidth;
      const anchos = renglonRefs.current.slice(0, cantidad).map((el) => el?.offsetWidth ?? 0);
      const maximo = Math.max(...anchos, 1);
      const actual = parseFloat(h2.ownerDocument.defaultView.getComputedStyle(h2).fontSize);
      const ideal = Math.min(120, Math.max(30, (actual * disponible * 0.97) / maximo));
      if (Math.abs(ideal - actual) > 0.5) {
        setFontPx(ideal);
        return; // se vuelve a medir con la letra nueva
      }
      const igual = (a, b) => a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) < 1);
      const nuevos = anchos.map((w) => Math.max(0, disponible - w));
      setLibres((prev) => (igual(prev, nuevos) ? prev : nuevos));
    };
    medir();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(medir);
    ro.observe(h2);
    h2.ownerDocument?.fonts?.ready?.then(medir);
    return () => ro.disconnect();
  }, [cantidad, fontPx]);

  useEffect(() => {
    if (!activo) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const id = setInterval(() => setComposicion((c) => c + 1), CAMBIO_MS);
    return () => clearInterval(id);
  }, [activo]);

  const componer = COMPOSICIONES[composicion % COMPOSICIONES.length];
  const desplazamiento = (k) => (libres[k] ?? 0) * componer(k, cantidad);
  return { tituloRef, renglonRefs, fontPx, desplazamiento };
}

// Número "al azar" pero fijo para cada letra (siempre el mismo para el
// mismo índice), para que el desorden de las letras no cambie en cada
// render.
const azar = (j, semilla) => {
  const x = Math.sin(j * 12.9898 + semilla * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

// Entrada: letras desordenadas que se acomodan con el scroll. Cada letra
// tiene su propio desorden (corrimiento en em — así escala con la letra
// —, giro y transparencia) y su propio momento para acomodarse dentro
// del tramo del scroll, así no llegan todas juntas.
const ORDEN_HASTA = 0.7; // progreso de scroll en que ya están todas en su lugar
function estiloLetra(j, progress, conMovimiento) {
  if (!conMovimiento) return undefined;
  const armado = Math.min(1, progress / ORDEN_HASTA);
  const propio = Math.min(1, Math.max(0, armado * 1.5 - azar(j, 4) * 0.5));
  const t = 1 - Math.pow(1 - propio, 3);
  const d = 1 - t;
  const dx = (azar(j, 1) * 2 - 1) * 1.2 * d;
  const dy = (azar(j, 2) * 2 - 1) * 1.6 * d;
  const giro = (azar(j, 3) * 2 - 1) * 40 * d;
  return {
    transform: `translate(${dx.toFixed(3)}em, ${dy.toFixed(3)}em) rotate(${giro.toFixed(2)}deg)`,
    opacity: 0.25 + 0.75 * t
  };
}

/**
 * Un solo árbol responsive: apilado en mobile (`flex-col`), lado a lado
 * desde `md:flex-row`.
 */
export default function FormacionVisionHero({ title, text, closing }) {
  const textRef = useRef(null);
  const progress = useScrollSettleProgress(textRef);
  const [booping, stopBoop] = useBoopOnSettle(progress);

  // El párrafo baja como un bloque (useBajada); la frase de cierre sale
  // por su cuenta desde el lado del título (useSalidaCierre).
  const estiloBajada = useBajada(textRef);
  const textStyle = estiloBajada(progress);
  const closingRef = useRef(null);
  const estiloCierre = useSalidaCierre(closingRef)(progress);

  const titlePanelRef = useRef(null);
  const titleVisible = useEnterOnceVisible(titlePanelRef);
  // Título en renglones, con el tamaño ajustado al ancho del panel y
  // reacomodándose cada CAMBIO_MS (useAjusteTitulo); letras que entran
  // desordenadas y se acomodan con el scroll (estiloLetra); y cada letra
  // en su propio <span> para que la serpiente de color pueda pintarlas
  // (useSerpienteDeColor).
  const renglones = renglonesTitulo(title);
  const finTituloMs = renglones.length * 120 + 500;
  const [tituloListo, setTituloListo] = useState(false);
  useEffect(() => {
    if (!titleVisible) return undefined;
    const id = setTimeout(() => setTituloListo(true), finTituloMs + 1200);
    return () => clearTimeout(id);
  }, [titleVisible, finTituloMs]);
  const { tituloRef, renglonRefs, fontPx, desplazamiento } = useAjusteTitulo(renglones.length, tituloListo);
  const conMovimiento = typeof window === 'undefined' || !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const letraRefs = useRef([]);
  let contador = 0;
  const letrasPorRenglon = renglones.map((renglon) => Array.from(renglon).map((ch) => ({ ch, j: contador++ })));
  const totalLetras = contador;
  useSerpienteDeColor(tituloRef, letraRefs, totalLetras, fontPx, titleVisible && conMovimiento);

  return (
    <div className="relative flex flex-col md:flex-row min-h-[70vh] md:min-h-[100vh] bg-[#D6E9F7] dark:bg-[#001F3D]">
      {/* Panel izquierdo: siempre navy, sin importar el tema. El título entra
          desde la izquierda al aparecer en pantalla (`titleStyle`) y después
          queda fijo. El `min-h` del contenedor de arriba da el recorrido de
          scroll para la caída. */}
      <div
        ref={titlePanelRef}
        className="md:w-[35%] shrink-0 bg-[#003366] flex flex-col justify-center px-6 sm:px-10 md:px-10 lg:px-14 py-14 md:py-20 relative overflow-hidden"
      >
        {/* Aurora: luz celeste muy difuminada que flota lento detrás
            del título (animate-aurora en global.css). */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[-10%] top-[20%] w-[80%] h-[55%] rounded-full bg-[#4FB2F2]/25 blur-3xl animate-aurora"
        />
        <EscudoICAP
          tono="white"
          className="absolute -right-[20%] top-1/2 -translate-y-1/2 w-[80%] max-w-none opacity-[0.06] pointer-events-none"
        />
        <h2
          ref={tituloRef}
          aria-label={title}
          className="relative w-full font-heading font-extrabold text-white text-4xl sm:text-5xl md:text-4xl lg:text-5xl xl:text-6xl leading-[1.02] tracking-tight"
          style={fontPx ? { fontSize: `${fontPx}px` } : undefined}
        >
          {letrasPorRenglon.map((letras, k) => (
            // Renglón: se desliza en horizontal a su lugar en la
            // composición actual (uno detrás de otro).
            <span
              key={k}
              aria-hidden="true"
              className="block whitespace-nowrap will-change-transform"
              style={{
                transform: `translateX(${desplazamiento(k)}px)`,
                transition: `transform 1300ms cubic-bezier(0.65, 0, 0.35, 1) ${k * 90}ms`
              }}
            >
              {/* Caja del renglón — la mide useAjusteTitulo. */}
              <span
                ref={(el) => {
                  renglonRefs.current[k] = el;
                }}
                className="inline-block"
              >
                {letras.map(({ ch, j }) => (
                  <span
                    key={j}
                    ref={(el) => {
                      letraRefs.current[j] = el;
                    }}
                    className="inline-block will-change-transform"
                    style={estiloLetra(j, progress, conMovimiento)}
                  >
                    {ch === ' ' ? '\u00A0' : ch}
                  </span>
                ))}
              </span>
            </span>
          ))}
        </h2>
      </div>

      {/* Panel derecho: sigue el tema. Marca de agua, el párrafo que baja con
          el scroll y la frase de cierre. */}
      <div className="flex-1 relative flex flex-col justify-center px-6 sm:px-10 md:px-10 lg:px-12 py-14 md:py-20 overflow-hidden">
        {/* Marca de agua del escudo, centrada y muy tenue — navy en
            tema claro, blanca en oscuro. */}
        <EscudoICAP
          tono="navy"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[70%] w-auto max-w-none opacity-[0.05] pointer-events-none dark:hidden"
        />
        <EscudoICAP
          tono="white"
          className="hidden dark:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[70%] w-auto max-w-none opacity-[0.06] pointer-events-none"
        />
        {/* El `ref` para medir el scroll va en este div SIN transform, no en el
            <p> que se anima (ver `useRevealProgress`). */}
        {/* Centrado en el panel, justificado (todos los renglones del
            mismo largo, con guiones automáticos) y el último renglón
            centrado. */}
        <div ref={textRef} className="relative z-10 w-full max-w-lg md:max-w-xl lg:max-w-3xl mx-auto">
          <p
            className="font-heading text-[#003366] dark:text-[#9FC6E8] text-[17px] md:text-xl lg:text-[1.375rem] leading-relaxed text-justify [text-align-last:center] hyphens-auto will-change-transform"
            style={textStyle}
          >
            {text}
          </p>
        </div>

        {/* Frase de cierre: en mobile va en el flujo después del párrafo; desde
            `md:` es `absolute`, a lo ancho del panel y centrada, a
            `bottom-16 lg:bottom-20`. El hover va en un <span> aparte para no
            mezclar `scale` con el `transform` en línea de `estiloCierre`. */}
        {/* Desde md va en UNA sola línea (whitespace-nowrap) con el tamaño atado
            al ancho de la pantalla (1.8vw, tope 2.25rem) para que quepa en el
            panel. En mobile se parte en renglones. */}
        {closing && (
          <p
            ref={closingRef}
            className={
              'relative w-full md:w-auto mt-8 md:mt-0 md:absolute md:left-10 md:right-10 lg:left-12 lg:right-12 md:bottom-16 lg:bottom-20 z-10 text-center origin-center font-heading font-extrabold text-[#003366] text-2xl sm:text-3xl md:text-[min(1.8vw,2.25rem)] md:whitespace-nowrap leading-tight will-change-transform' +
              (booping ? ' animate-closing-boop' : '')
            }
            style={estiloCierre}
            onAnimationEnd={stopBoop}
          >
            <span className="inline-block origin-center transition-transform duration-300 ease-out hover:scale-105 cursor-default">
              {closing}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
