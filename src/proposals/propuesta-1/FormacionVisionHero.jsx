import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import icapEscudoWhite from '../../assets/icap-escudo-white.svg';
import icapEscudoNavy from '../../assets/icap-escudo-navy.svg';
import { useSerpienteDeColor } from './serpienteDeColor';

/**
 * "Formación con Visión de Futuro" — el bloque que va debajo del Hero
 * en el Inicio de Docencia. Antes era un simple kicker+título+párrafo
 * centrado (ver el `showIntro` de DocenciaMision.jsx, de donde salió
 * este componente). Yocxany pidió rehacerlo como un momento propio,
 * en dos partes, inspirado en la sección "our camps" de
 * white-desert.com: a la izquierda el título, GRANDE y ESTÁTICO,
 * ocupando su panel de la forma más limpia posible; a la derecha el
 * párrafo, alineado a la izquierda igual que el título, con el efecto
 * de ir "cayendo" desde arriba y acomodándose conforme se scrollea —
 * y, abajo a la derecha de ese mismo panel, la frase de cierre
 * (`closing`) destacada, grande, en el mismo navy del panel
 * izquierdo, como remate de la sección.
 *
 * NO lleva kicker/badge — ese texto ("Formación con Visión de
 * Futuro") es el nombre de la página dedicada "Formación" del menú
 * (ver `cardsIntro.kicker` en translations.js), no de este bloque de
 * Inicio; Yocxany lo notó y pidió quitarlo. Acá sólo va el título
 * grande que sí es del Inicio ("Conocimiento para Anticipar, Liderar
 * y Transformar").
 *
 * HISTORIAL (para no repetir vueltas ni reintroducir bugs ya
 * resueltos):
 * 1) Primera versión: título cayendo con el scroll, párrafo
 *    asentándose con blur, los dos centrados, sección de una
 *    pantalla completa, con `position: sticky` + wrapper alto (ver
 *    más abajo por qué ese truco ya NO se usa).
 * 2) Yocxany pidió invertirlo: título GRANDE y ESTÁTICO, párrafo el
 *    que cae (sin blur) — implementado.
 * 3) Pidió además: sección más pequeña (bajar las alturas), la caída
 *    más fluida (no rígida) y el párrafo alineado a la izquierda en
 *    vez de centrado — implementado con un suavizado tipo "lerp" (ver
 *    `useSmoothedValue`) y alineación izquierda.
 * 4) Con la sección ya más chica, apareció un bug feo: "un pedazo de
 *    color celeste al final". Causa raíz: el truco de `position:
 *    sticky` + wrapper-más-alto-que-una-pantalla que se usaba hasta
 *    acá SÓLO funciona sin dejar espacio vacío de sobra si el panel
 *    pegado mide, como mínimo, lo mismo que el alto visible de
 *    `<main>` — porque esta sección es la ÚLTIMA de la página, y con
 *    un panel más bajo que esa altura, `main` se queda sin scroll
 *    disponible ANTES de que el panel llegue a despegarse del todo,
 *    dejando ver, al fondo, el color de fondo del wrapper alto sin
 *    nada adentro (el "pedazo feo"). Como ahora la sección es a
 *    propósito más chica que una pantalla, ese truco ya no aplica —
 *    se cambió por un efecto de "aparece al entrar en pantalla" (ver
 *    `useRevealProgress` más abajo), que no necesita ningún wrapper
 *    alto artificial: la sección mide exactamente lo que su
 *    contenido necesita, sin espacio de sobra posible. De paso esto
 *    permitió volver a un solo árbol responsive (antes había una
 *    variante para escritorio y otra para mobile, sólo por culpa del
 *    truco del sticky — ya no hace falta).
 *
 * CÓMO FUNCIONA EL EFECTO AHORA: en vez de atar el progreso a "cuánto
 * falta para que la página ya no pueda scrollear más", se mide
 * directamente en qué posición de la pantalla está el párrafo
 * mientras se scrollea — 0% quiere decir "el párrafo recién está
 * asomando por abajo de la pantalla", 100% quiere decir "el párrafo
 * ya subió lo suficiente como para estar cómodo para leer". Ver
 * `useRevealProgress`. Ese progreso "crudo" pasa por un suavizado
 * (`useSmoothedValue`, un lerp cuadro a cuadro) para que la caída se
 * sienta fluida y con inercia en vez de rígidamente pegada al pixel
 * exacto del scroll — esa combinación es lo que expone
 * `useScrollSettleProgress`, que es lo que realmente usa el
 * componente.
 *
 * 5) Pidió que se notara más — "que si se tenga que scrollear
 *    bastante" — así que se subió el `min-h` del panel (más recorrido
 *    real = más recorrido para la caída, sin volver a ningún truco de
 *    wrapper artificial, así que el bug del "pedazo celeste" sigue
 *    sin poder pasar). Y de yapa pidió una animación de entrada para
 *    el título "del lado izquierdo" — resulta que YA la tenía
 *    (`animate-breeze-in` incluye un `translateX` desde la
 *    izquierda), pero como esa animación se dispara al MONTAR la
 *    página (no al hacer scroll hasta acá), para cuando Yocxany
 *    llegaba scrolleando ya había terminado hace rato, fuera de
 *    pantalla — nunca se veía. Se cambió por `useEnterOnceVisible`
 *    (IntersectionObserver), que la dispara recién cuando el panel
 *    del título aparece de verdad en pantalla, con un recorrido más
 *    largo para que se note.
 * 6) Pidió quitar la marca de agua del panel derecho (el del
 *    izquierdo se queda — ese no lo mencionó) y separar la última
 *    oración del párrafo ("Prepárese para liderar los desafíos del
 *    futuro.") como cierre propio de la sección: no centrado (se
 *    vería "desorganizado" cruzando los dos paneles, palabras
 *    textuales de Yocxany), sino grande, abajo a la derecha del panel
 *    derecho, con las letras del mismo navy (#003366, fijo, sin
 *    variante para modo oscuro) que el fondo del panel izquierdo. Esa
 *    frase ahora es su propio dato (`closing`, ver
 *    `docenciaMision.closing` en translations.js) en vez de ir pegada
 *    al final de `subtitle`.
 * 7) Ajuste sobre el 6: pidió que el cierre fuera a lo ANCHO de toda
 *    la sección del panel derecho y centrado ahí abajo (esto NO
 *    contradice el "no centrado" del punto 6 — aquello era centrado
 *    cruzando los DOS paneles, esto es centrado sólo dentro del panel
 *    derecho, que es angosto de sobra para no verse "desorganizado"),
 *    en vez de metido en una caja angosta a la derecha que lo partía
 *    en renglones cortos y chocantes. También pidió un hover (acá:
 *    `hover:scale-105`) y un pequeño "boop" cuando el scroll de la
 *    sección termina de acomodarse — reutiliza `animate-stat-pop` de
 *    global.css (el mismo rebote de los contadores de "ICAP en
 *    Cifras"), disparado por `useBoopOnSettle` cuando `progress` llega
 *    a su tope, no en cada frame.
 * 8) Dio la vuelta otra vez sobre el 6/7, esta vez SÍ pidiendo que el
 *    cierre cruce por la mitad de la pantalla (de `md:` en adelante) —
 *    lo que en el punto 6 se descartó por verse "desorganizado" ahora
 *    lo resuelve con la mitad que cae sobre el panel izquierdo en
 *    blanco (como el título) y la mitad que cae sobre el panel derecho
 *    en el navy de siempre, "así al otro lado" (palabras de Yocxany):
 *    cada mitad legible sobre SU fondo en vez de un solo color plano
 *    cruzando ambos. Ver el bloque `hidden md:block` después del panel
 *    derecho para el truco de las dos copias superpuestas + clip-path.
 *    También pidió subirlo un poco (ya no pegado al borde de abajo,
 *    `bottom-16 lg:bottom-20` en vez de `bottom-10/12`) y un boop "más
 *    sutil" — de ahí `animate-closing-boop`, un keyframe propio con
 *    mucha menos amplitud que `animate-stat-pop` (ver global.css). La
 *    versión de mobile (`md:hidden`, apilada, un solo color) se queda
 *    igual que en el punto 7 — no hay dos paneles lado a lado que
 *    cruzar cuando está todo apilado.
 * 9) Probó el 8 y no le gustó ("se ve fatal") — VOLVIÓ al criterio del
 *    6/7: todo el cierre del lado del panel derecho, centrado ahí (no
 *    cruzando los dos paneles — NO reintroducir el truco de las dos
 *    copias + `clip-path` del punto 8 sin que lo vuelva a pedir
 *    explícitamente). Lo que sí se queda del punto 8: la posición más
 *    arriba (`bottom-16 lg:bottom-20`) y el boop sutil
 *    (`animate-closing-boop`) — eso no lo criticó, sólo el cruce entre
 *    paneles.
 * 10) La sección se sentía "muy simple para el inicio de una página tan
 *    pichuda" (Yocxany). Ahora TODO el texto del panel derecho (párrafo
 *    + frase de cierre) baja JUNTO, como un solo bloque, desde arriba
 *    del borde de la sección, despacito y pegado al scroll, hasta su
 *    lugar. Como el panel recorta lo que queda arriba de su borde, los
 *    renglones se van ASOMANDO de a uno a medida que el bloque baja (el
 *    de más abajo primero) — ver `useBajada`. Se probaron antes dos
 *    variantes que NO eran (no volver a ellas): cada renglón saliendo
 *    por su cuenta desde su propio borde, y cada renglón bajando por
 *    separado desde arriba ("se pega una carrera", palabras de
 *    Yocxany) — la idea es UN bloque que baja lento.
 * 11) Más pedidos sobre el 10:
 *    - Renglones del párrafo todos del MISMO largo: texto justificado
 *      (con guiones automáticos para que no queden huecos grandes) y
 *      el último renglón centrado; y el bloque CENTRADO en su panel.
 *    - Marca de agua del escudo de vuelta en el panel derecho (en el
 *      punto 6 se había quitado), centrada y muy tenue.
 *    - La frase de cierre ya NO baja con el párrafo: SALE DEL TÍTULO —
 *      se desliza desde el borde que comparte con el panel del título
 *      (el panel la recorta, así que parece salir de ahí) en el último
 *      tramo del scroll, y al llegar hace su boop. Ver `useSalidaCierre`.
 *    - Título "más entretenido y super elegante": cada palabra sube
 *      desde una ranura propia, una detrás de otra, al aparecer; debajo
 *      se dibuja una línea celeste; y detrás flota una luz celeste muy
 *      difuminada que se mueve lento (aurora, ver `animate-aurora` en
 *      global.css).
 * 12) Animación constante en el título: ahora aprovecha TODO su panel —
 *    va en renglones (las palabras cortas como "para"/"y" se pegan a la
 *    siguiente, ver `renglonesTitulo`) y el tamaño de letra se ajusta
 *    solo para que el renglón más largo llene el ancho — y cada
 *    CAMBIO_MS se "reacomoda": los renglones se deslizan a otra
 *    composición (izquierda, escalera, alternado, centrado, escalera
 *    inversa — ver COMPOSICIONES), uno detrás de otro. Ver
 *    `useTituloQueSeAcomoda`.
 * 13) Reparto 35% título / 65% texto (antes ~40/60). El celeste ya no
 *    se pasa de renglón en renglón: una ONDA/GOTA de color celeste
 *    atraviesa el título de forma fluida, en loop — es una copia
 *    celeste del título encima del blanco, que sólo se ve dentro de
 *    una mancha difuminada que viaja de izquierda a derecha (máscara
 *    animada). Frase de cierre CENTRADA en su panel y el párrafo un
 *    toque más grande.
 * 14) Después de varias pruebas (serpiente con forma de cápsula, de
 *    célula, en "S" por todo el bloque, letras desordenadas, renglones
 *    que se reacomodaban), Yocxany definió el efecto final del título:
 *    una SERPIENTE INVISIBLE que recorre las letras renglón por renglón
 *    (al principio en zigzag; después pidió que cada renglón vaya
 *    siempre de izquierda a derecha, con un salto sin pintar), ondulando
 *    arriba/abajo dentro de cada renglón; al terminar espera y vuelve a
 *    empezar. Lo ÚNICO que cambia es el COLOR de las letras (blanco →
 *    celeste rápido donde pasa, y vuelve a blanco despacio, dejando
 *    estela). La serpiente no mueve ni agranda las letras: sólo las
 *    pinta. (Se probó quitar el desorden de entrada y el reacomodo de
 *    renglones para que el título quedara quieto, pero Yocxany pidió
 *    conservarlos — conviven con la serpiente, que recalcula el camino
 *    en cada frame para seguir a las letras donde estén.) Ver
 *    `useSerpienteDeColor`, `estiloLetra` y `useAjusteTitulo`. (Hubo
 *    también una estela de color con el mouse y una línea celeste
 *    debajo del título con un "fuash" en cada reacomodo — Yocxany pidió
 *    quitar las dos: en el título quedan sólo la serpiente y el
 *    acomodo de letras.)
 *
 * OJO: el scroll que se escucha acá NO es el de `window` — en este
 * brochure el que scrollea de verdad es el `<main
 * className="overflow-y-auto">` de Propuesta1.jsx (el layout completo
 * vive dentro de un `h-screen` con overflow-hidden en la raíz). Por
 * eso el listener se engancha al `closest('main')` del propio
 * elemento en vez de a `window` — así funciona igual tanto en la vista
 * normal como adentro del iframe de "Vista Móvil" (DeviceFrame.jsx),
 * que tiene su PROPIO `<main>` con su propio scroll.
 */

// Progreso "crudo" (0→1) de la caída del párrafo, atado al SCROLL
// (`scrollTop`/`scrollHeight` de `main`, valores nativos del
// navegador) y no directamente a la posición pintada del elemento.
// OJO: `elRef` tiene que apuntar a un elemento SIN el `transform`
// animado (ver más abajo, el <p> real va adentro, envuelto en un div
// aparte con este ref) — si se midiera `getBoundingClientRect()`
// sobre el propio elemento que se está moviendo, la medición quedaría
// "contaminada" por su propia animación (un lazo de realimentación:
// el elemento se mueve porque el progreso cambia, y el progreso
// cambiaría por cómo se movió el elemento). Por eso, además, la
// cuenta usa un ancla invariante al scroll:
// `topAtZeroScroll` = dónde estaría el borde de arriba del párrafo si
// `scrollTop` fuera 0 — como el elemento se desplaza 1:1 al revés del
// scroll, esa cantidad no cambia aunque cambie el scroll (mientras no
// se reacomode el layout), así que de ahí se puede despejar en qué
// `scrollTop` exacto ocurre cada posición, sin depender del transform
// actual.
//
// 0% = el párrafo recién asoma por el borde de abajo de la pantalla.
// 100% = exactamente el `scrollTop` máximo físico de `main` — que,
// como esta sección es lo ÚLTIMO de la página, es también "ya no se
// puede scrollear más". Usar el scroll máximo REAL como meta (en vez
// de un % fijo de la pantalla) es lo que garantiza que el recorrido
// completo SIEMPRE es alcanzable — usa TODO el scroll que queda
// disponible, sin importar cuánto mida el contenido de arriba ni en
// qué breakpoint estemos (a diferencia de pedir un % fijo, que puede
// quedar corto y dejar el progreso pegado antes de 1 — el mismo tipo
// de bug que ya pasó una vez con el truco de `sticky`).
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

// Suaviza un valor 0→1 que cambia "a saltos" (como el progreso crudo
// de scroll, que se recalcula evento a evento) persiguiéndolo con una
// pequeña inercia — el típico "lerp" cuadro a cuadro:
// display += (target - display) * factor. Con factor bajo (acá 0.16)
// el valor mostrado nunca salta de golpe al valor real, sino que lo
// va alcanzando de forma fluida en un puñado de cuadros — es lo que
// hace que la caída del párrafo se sienta fluida y animada en vez de
// rígidamente pegada al pixel exacto del scroll (que era la queja de
// Yocxany). Sigue corriendo unos cuadros más después de soltar el
// scroll hasta alcanzar el valor real — por eso el bucle vive en su
// propio requestAnimationFrame en vez de depender del evento scroll.
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

// Dispara una vez (no vuelve a `false` si se sale de pantalla) cuando
// el elemento entra en el viewport de scroll — el mismo patrón de
// IntersectionObserver que ya se usa en el resto del sitio (AT,
// DocenciaImpacto, etc). Se usa para la entrada del título: antes
// llevaba `animate-breeze-in`, una animación de CSS que se dispara al
// MONTAR el componente — como esta sección está debajo del Hero, esa
// animación ya había terminado (fuera de pantalla) mucho antes de que
// Yocxany llegara scrolleando hasta acá, así que en la práctica nunca
// se veía. Con IntersectionObserver, en cambio, recién se dispara
// cuando el panel realmente aparece en pantalla — ahí sí se nota.
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

// Bajada del bloque de texto: mide cuánto tiene que subir el bloque
// para quedar ENTERO arriba del borde superior del panel (escondido,
// el panel tiene overflow-hidden) — o sea, desde el borde de arriba del
// panel hasta el final del párrafo — y devuelve el `transform` para un
// progreso dado: con 0 el bloque está todo arriba, escondido; con 1,
// en su lugar. offsetTop/offsetHeight no los afectan los transform
// animados, así que la medición no se contamina con el movimiento.
// La bajada es casi lineal con el scroll (sólo frena un poquito al
// final) para que se sienta lenta y pareja, no un tirón.
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

// El "boop" de la frase de cierre: un rebotecito de escala cuando el
// scroll de la sección TERMINA (el `progress` suavizado llega a su
// tope), como un pequeño "aterrizaje" — reutiliza la misma animación
// `animate-stat-pop` que ya existe en global.css para el rebote de
// los contadores de "ICAP en Cifras", en vez de inventar un keyframe
// nuevo para el mismo efecto. Dispara una sola vez por cada vez que
// se llega al final (no en cada frame mientras el valor suavizado
// ronda cerca de 1: `settledRef` evita repetirlo), y se puede volver
// a disparar si el usuario sube y vuelve a bajar (el `resetThreshold`
// separado del `threshold` evita que un pequeño rebote del propio
// suavizado alrededor de 1 dispare el boop varias veces seguidas).
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

/** Un solo árbol responsive (stack en mobile vía `flex-col`, lado a
 * lado en escritorio vía `md:flex-row`) — ya no hace falta separarlo
 * en variantes, esa separación era sólo por el truco de `sticky` que
 * ya no se usa (ver el historial arriba). La sección mide lo que su
 * contenido necesita, nada más — sin wrapper alto artificial no hay
 * forma de que quede espacio vacío de sobra. */
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
      {/* Panel izquierdo — SIEMPRE navy, sin importar el tema del
          sitio (mismo criterio que AlliesMarquee: es un panel de
          fondo fijo, no una tarjeta que deba seguir el toggle
          claro/oscuro), para que se note el "tono distinto" que pidió
          Yocxany frente al panel de la derecha (que sí sigue el
          tema). El título entra deslizándose desde la izquierda al
          aparecer en pantalla (`titleStyle`, ver arriba) y después
          queda ESTÁTICO — no sigue el scroll. `min-h` en el
          contenedor de arriba (no acá, ni con `sticky` de por medio)
          es lo que agranda la sección para que el scroll de la caída
          se note más — es un min-height normal y corriente, sin
          ningún wrapper alto artificial detrás, así que no
          reintroduce el bug del "pedazo celeste feo" (ver el
          historial arriba). */}
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
        <img
          src={icapEscudoWhite}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="absolute -right-[20%] top-1/2 -translate-y-1/2 w-[80%] max-w-none opacity-[0.06] pointer-events-none select-none"
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

      {/* Panel derecho — sigue el tema del sitio como el resto del
          brochure. Sin marca de agua (Yocxany pidió quitarla — "no
          hace falta"). El párrafo, alineado a la izquierda igual que
          el título, con renglones parejos (`[text-wrap:balance]`) y
          el efecto de caída desde arriba al entrar en pantalla; y,
          abajo, la frase de cierre — a lo ANCHO de todo este panel
          (no cruzando los dos, ver historial punto 9) y centrada,
          bastante arriba del borde de abajo, con hover y un boop bien
          sutil. */}
      <div className="flex-1 relative flex flex-col justify-center px-6 sm:px-10 md:px-10 lg:px-12 py-14 md:py-20 overflow-hidden">
        {/* Marca de agua del escudo, centrada y muy tenue — navy en
            tema claro, blanca en oscuro. */}
        <img
          src={icapEscudoNavy}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[70%] w-auto max-w-none opacity-[0.05] pointer-events-none select-none dark:hidden"
        />
        <img
          src={icapEscudoWhite}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="hidden dark:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[70%] w-auto max-w-none opacity-[0.06] pointer-events-none select-none"
        />
        {/* El `ref` para medir el scroll va en este div envolvente,
            SIN transform — no en el <p> de adentro, que es el que se
            anima. Si se midiera directo sobre el elemento animado, la
            medición quedaría contaminada por su propio movimiento
            (ver el comentario grande de `useRevealProgress`). */}
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

        {/* Frase de cierre: en mobile (`flex-col`) va en el flujo
            normal después del párrafo, con su propio margen — mismo
            criterio que siempre (ver historial punto 7: un `absolute`
            pegado al fondo del contenedor quedaba montado encima del
            párrafo cuando el texto era largo). De `md:` en adelante
            pasa a `absolute`, a lo ancho de este panel (con el mismo
            `left`/`right` que su padding) y bastante más arriba del
            borde de abajo que antes (`bottom-16 lg:bottom-20` — pidió
            subirla). El hover va en un <span> aparte adentro del <p>
            para no depender de cómo Tailwind 4 componga `scale` con el
            `transform` en línea de la salida desde el título
            (`estiloCierre`) —
            probado con Playwright, funciona así. El boop usa
            `animate-closing-boop` (keyframe propio en global.css, más
            sutil que `animate-stat-pop`). */}
        {/* 10) Alineada a la IZQUIERDA, pegada al mismo borde que el
            párrafo de arriba (mismo left que el padding del panel y
            max-w que el texto) — Yocxany: "era lo que había pedido
            originalmente". Después pidió que quedara "a lo largo, no
            por renglones": de md en adelante va en UNA sola línea
            (whitespace-nowrap), con el tamaño atado al ancho de la
            pantalla (1.8vw, tope 2.25rem) para que siempre quepa en el
            panel derecho sin salirse. En mobile (apilado, angosto) sí
            se parte en renglones — en una línea no cabría a un tamaño
            legible. `origin-left` en el <p> (boop) y en
            el <span> (hover) para que al crecer no se despegue de ese
            borde. */}
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
