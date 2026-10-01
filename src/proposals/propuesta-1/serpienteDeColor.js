import { useLayoutEffect } from 'react';

// ===================================================================
// SERPIENTE DE COLOR para títulos — se usa en el título de Formación
// (FormacionVisionHero.jsx) y en el de Alcance Regional
// (DocenciaComunidad.jsx).
//
// Una serpiente INVISIBLE recorre las letras renglón por renglón, cada
// renglón SIEMPRE de izquierda a derecha (como se lee — Yocxany lo pidió
// así; antes iba en zigzag, alternando el sentido). Al terminar un
// renglón "salta" rápido al comienzo del siguiente SIN pintar (como el
// salto de línea de una máquina de escribir), así no deja una diagonal
// pintada sobre las letras. Al terminar el último renglón espera
// SERPIENTE_PAUSA_MS y vuelve a empezar arriba. No va recta: ondula
// (onda seno) arriba/abajo dentro de cada renglón.
//
// La serpiente no se ve: lo único que cambia es el COLOR de cada letra.
// Se guardan las últimas SERPIENTE_TRAZO posiciones de la cabeza; cada
// letra toma un "nivel" (0→1) según qué tan cerca está de esas
// posiciones (la cabeza pesa más que la cola) y su color pasa de
// COLOR_LETRA a COLOR_SERPIENTE — rápido al subir y despacio al bajar,
// así queda una estela. La serpiente no mueve ni agranda las letras.
//
// Renglones: se detectan agrupando las letras por su posición vertical,
// así funciona aunque el título se parta en más renglones en celular.
// Como las letras se mueven (entran desordenadas y los renglones se
// reacomodan), posiciones y camino se recalculan en CADA frame: los
// renglones se agrupan por su posición de layout (offsetTop, que no
// cambia con los movimientos) y el ancho de cada renglón y el centro de
// cada letra salen de getBoundingClientRect (dónde se ven de verdad).
// También se recalcula al cambiar el tamaño y al cargar las fuentes.
// Con prefers-reduced-motion no corre: el título queda blanco.
//
// Valores para ajustar (en "em" = tamaño de la letra del título):
const SERPIENTE_VELOCIDAD_EM_S = 3.2; // velocidad de la cabeza
const SERPIENTE_ONDA_ALTO_EM = 0.18; // cuánto sube/baja la onda
const SERPIENTE_ONDA_ANCHO_EM = 1.7; // largo de cada ondulación
const SERPIENTE_RADIO_EM = 0.55; // hasta qué distancia "toca" una letra
const SERPIENTE_TRAZO = 40; // posiciones guardadas (largo de la serpiente)
const SERPIENTE_PASO_TRAZO_EM = 0.12; // distancia entre posiciones guardadas
const SERPIENTE_PAUSA_MS = 1400; // espera al terminar, antes de volver a empezar
const SERPIENTE_SALTO_EM = 1.2; // cuánto "tarda" el salto al renglón siguiente (en em de recorrido)
const SERPIENTE_SUBIDA = 0.35; // qué tan rápido se pinta de celeste (por frame)
const SERPIENTE_BAJADA = 0.03; // qué tan despacio vuelve a blanco (por frame)
// Colores por defecto (cada título puede pasar los suyos, ver `colores`):
const COLOR_LETRA = [255, 255, 255]; // blanco
const COLOR_SERPIENTE = [79, 178, 242]; // celeste #4FB2F2

// Camino a partir de los renglones detectados: cada renglón de izquierda
// a derecha, ondulando, y entre renglón y renglón un SALTO invisible
// (no pinta) que cuenta como SERPIENTE_SALTO_EM de recorrido, así el
// salto lleva un instante y no lo que mediría volver de verdad hasta la
// izquierda. Puntos (x, y) en px relativos al título, si el tramo es
// salto, y el recorrido acumulado.
function caminoRenglones(renglones, em) {
  const xs = [];
  const ys = [];
  const salto = [];
  const acum = [];
  const onda = (x, yBase) => yBase + Math.sin((x / (SERPIENTE_ONDA_ANCHO_EM * em)) * Math.PI * 2) * SERPIENTE_ONDA_ALTO_EM * em;
  const margen = 0.3 * em;
  const paso = Math.max(2, em * 0.04);
  let total = 0;
  renglones.forEach((r, i) => {
    const desde = r.izq - margen;
    const hasta = r.der + margen;
    const n = Math.max(2, Math.ceil((hasta - desde) / paso));
    for (let k = 0; k <= n; k += 1) {
      const x = desde + ((hasta - desde) * k) / n;
      const y = onda(x, r.y);
      if (xs.length) {
        // El primer punto de cada renglón (después del primero) cierra
        // el tramo de salto desde el final del renglón anterior.
        const esSalto = k === 0 && i > 0;
        total += esSalto ? SERPIENTE_SALTO_EM * em : Math.hypot(x - xs[xs.length - 1], y - ys[ys.length - 1]);
        salto.push(esSalto);
      } else {
        salto.push(false);
      }
      xs.push(x);
      ys.push(y);
      acum.push(total);
    }
  });
  // Punto del camino a un recorrido `d`: [x, y, enSalto].
  const punto = (d) => {
    if (d <= 0) return [xs[0], ys[0], false];
    if (d >= total) return [xs[xs.length - 1], ys[ys.length - 1], false];
    let lo = 0;
    let hi = acum.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (acum[mid] < d) lo = mid;
      else hi = mid;
    }
    const k = (d - acum[lo]) / (acum[hi] - acum[lo] || 1);
    return [xs[lo] + (xs[hi] - xs[lo]) * k, ys[lo] + (ys[hi] - ys[lo]) * k, salto[hi]];
  };
  return { total, punto };
}

// Distancia de layout desde el borde de arriba del título hasta `el`,
// sumando offsetTop por la cadena de offsetParent (no la afectan los
// transform animados).
function alturaLayout(el, hasta) {
  let y = 0;
  let n = el;
  while (n && n !== hasta) {
    y += n.offsetTop;
    n = n.offsetParent;
  }
  return y;
}

// `tituloRef`: el elemento del título (tiene que ser `position:
// relative`, para medir las letras respecto de él). `letraRefs`: refs a
// los <span> de cada letra, en orden de lectura. `medida`: cualquier
// valor que, si cambia, obliga a volver a armar todo (p. ej. el tamaño
// de letra). `activa`: si corre o no. `colores`: { letra, serpiente } en
// [r, g, b].
export function useSerpienteDeColor(tituloRef, letraRefs, total, medida, activa, colores = {}) {
  const colorLetra = colores.letra ?? COLOR_LETRA;
  const colorSerpiente = colores.serpiente ?? COLOR_SERPIENTE;
  const claveColores = `${colorLetra.join(',')}|${colorSerpiente.join(',')}`;
  useLayoutEffect(() => {
    if (!activa) return undefined;
    const h2 = tituloRef.current;
    const letras = letraRefs.current.slice(0, total);
    if (!h2 || !letras.length || letras.some((el) => !el)) return undefined;
    const vista = h2.ownerDocument.defaultView;

    let em = 40;
    let centros = []; // centro de cada letra, relativo al título
    let camino = null;
    const medir = () => {
      em = parseFloat(vista.getComputedStyle(h2).fontSize) || 40;
      const base = h2.getBoundingClientRect();
      centros = letras.map((el) => {
        const r = el.getBoundingClientRect();
        return {
          x: r.left - base.left + r.width / 2,
          y: r.top - base.top + r.height / 2,
          izq: r.left - base.left,
          der: r.right - base.left,
          // Altura de layout (sin los movimientos), para agrupar renglones.
          yLayout: alturaLayout(el, h2) + el.offsetHeight / 2,
          alto: el.offsetHeight
        };
      });
      // Renglones: letras agrupadas por su altura (de layout).
      const renglones = [];
      centros
        .filter((c) => c.der - c.izq > 0)
        .forEach((c) => {
          const r = renglones.find((g) => Math.abs(g.y - c.yLayout) < c.alto * 0.5);
          if (r) {
            r.izq = Math.min(r.izq, c.izq);
            r.der = Math.max(r.der, c.der);
          } else {
            renglones.push({ y: c.yLayout, izq: c.izq, der: c.der });
          }
        });
      renglones.sort((a, b) => a.y - b.y);
      camino = renglones.length ? caminoRenglones(renglones, em) : null;
    };
    medir();

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(medir) : null;
    ro?.observe(h2);
    vista.addEventListener('resize', medir);
    h2.ownerDocument.fonts?.ready?.then(medir);

    const nivel = letras.map(() => 0);
    const escrito = letras.map(() => -1);
    let trazo = []; // posiciones de la cabeza, la [0] es la más nueva
    let recorrido = 0;
    let pausaHasta = 0;
    let ultimoT = null;
    let rafId;

    const frame = (t) => {
      const dt = ultimoT === null ? 16.7 : Math.min(64, t - ultimoT);
      ultimoT = t;
      const frames = dt / 16.7;
      medir(); // las letras pueden estar moviéndose: posiciones al día

      // Avanza la cabeza; al llegar al final, espera y vuelve a empezar.
      if (camino) {
        if (t < pausaHasta) {
          // en pausa: la estela se sigue apagando sola
        } else if (recorrido > camino.total) {
          if (pausaHasta === 0) {
            pausaHasta = t + SERPIENTE_PAUSA_MS;
          } else {
            pausaHasta = 0;
            recorrido = 0;
            trazo = [];
          }
        } else {
          recorrido += SERPIENTE_VELOCIDAD_EM_S * em * (dt / 1000);
          const [x, y, enSalto] = camino.punto(recorrido);
          const ultimo = trazo[0];
          // Durante el salto al renglón siguiente no se pinta: no se
          // guardan posiciones (la estela del renglón anterior se sigue
          // apagando sola).
          if (!enSalto && (!ultimo || Math.hypot(x - ultimo[0], y - ultimo[1]) >= SERPIENTE_PASO_TRAZO_EM * em)) {
            trazo.unshift([x, y]);
            if (trazo.length > SERPIENTE_TRAZO) trazo.length = SERPIENTE_TRAZO;
          }
        }
      }

      const radio = SERPIENTE_RADIO_EM * em;
      const subida = 1 - Math.pow(1 - SERPIENTE_SUBIDA, frames);
      const bajada = 1 - Math.pow(1 - SERPIENTE_BAJADA, frames);
      letras.forEach((el, j) => {
        const c = centros[j];
        if (!c) return;
        // Qué tan cerca está de la serpiente: la cabeza (k = 0) pesa 1 y
        // la cola va pesando cada vez menos.
        let objetivo = 0;
        for (let k = 0; k < trazo.length; k += 1) {
          const cerca = 1 - Math.hypot(c.x - trazo[k][0], c.y - trazo[k][1]) / radio;
          if (cerca <= 0) continue;
          const peso = 1 - k / SERPIENTE_TRAZO;
          objetivo = Math.max(objetivo, cerca * peso);
        }
        objetivo = Math.min(1, objetivo * 1.5);
        nivel[j] += (objetivo - nivel[j]) * (objetivo > nivel[j] ? subida : bajada);
        const v = Math.round(nivel[j] * 200) / 200;
        if (v === escrito[j]) return;
        escrito[j] = v;
        const rgb = colorLetra.map((base, i) => Math.round(base + (colorSerpiente[i] - base) * v));
        el.style.color = v === 0 ? '' : `rgb(${rgb.join(',')})`;
      });
      rafId = requestAnimationFrame(frame);
    };
    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      ro?.disconnect();
      vista.removeEventListener('resize', medir);
      letras.forEach((el) => {
        el.style.color = '';
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- los colores entran por claveColores
  }, [tituloRef, letraRefs, total, medida, activa, claveColores]);
}
