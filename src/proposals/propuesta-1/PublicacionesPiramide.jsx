import React, { memo, useEffect, useId, useRef, useState } from 'react';
import KickerBadge from './KickerBadge';
import { LOGO_W, LOGO_H, TRIANGULO, IZQUIERDA, DERECHA, PUNTOS } from './icapLogoFormas';

/**
 * LOGO holográfico del ICAP que se arma con el scroll, pieza por pieza,
 * para las 7 palabras de Publicaciones ("Investigar – Publicar – … –
 * Transformar"). (El archivo se sigue llamando "Piramide" porque antes
 * era una pirámide de 7 pisos + punta, adaptada del componente que pasó
 * Yocxany — src/components/PiramideHolograma.jsx, que queda intacto.
 * Yocxany preguntó si en vez de la pirámide se podía formar el logo, y
 * así quedó. La versión pirámide está en el historial de git.)
 *
 * - El logo se divide en 8 piezas (formas trazadas del PNG en
 *   icapLogoFormas.js). Cada una de las 7 palabras es una pieza, de
 *   abajo hacia arriba: triángulo del centro, pierna+brazo izquierdo,
 *   pierna+brazo derecho, y los puntos de afuera hacia adentro. La 8ª
 *   pieza — el punto grande del centro — es la "punta": cierra el logo
 *   (brilla en blanco, como la punta de la pirámide) junto con el
 *   `objetivo`, y después sale el rayo de luz (Haz).
 * - Cada pieza CAE desde arriba a su lugar con el scroll y al llegar
 *   brilla un momento, igual que los pisos de la pirámide.
 * - Look de holograma como la pirámide: relleno celeste translúcido con
 *   líneas de escaneo, bordes con resplandor, y "volumen" hecho con 3
 *   capas de la misma pieza separadas en profundidad (translateZ) —
 *   por eso al girar se ve como un objeto 3D de luz y no una lámina.
 * - La escena gira un poco con el scroll (de -40° a 0°) y termina de
 *   frente, para que el logo armado se lea bien.
 * - Las PALABRAS tienen protagonismo (pedido de Yocxany): debajo del
 *   logo aparece en grande, como holograma, la palabra del nivel que
 *   está cayendo (con su "03 / 07"), y al terminar el `objetivo`; y en
 *   la lista de al lado la palabra activa crece, brilla y se resalta
 *   con una franja de luz.
 * - El scroll que se escucha es el del `<main>` de Propuesta1.jsx, no
 *   el de `window`, y el bloque sticky mide el alto VISIBLE de ese
 *   <main>. Recorrido: 48vh por pieza. Pista de "deslizá" (mouse con
 *   ruedita) que se apaga apenas se empieza a construir.
 */

const mezcla = (color, pct) => `color-mix(in srgb, ${color} ${pct}%, transparent)`;
const limitar = (v) => Math.min(1, Math.max(0, v));

// Alto del logo armado en la escena (px, antes de la escala responsive).
const ALTO_LOGO = 360;
const ESCALA_LOGO = ALTO_LOGO / LOGO_H;
const ANCHO_LOGO = LOGO_W * ESCALA_LOGO;

// Orden en que se arma: una pieza por palabra (de abajo hacia arriba) y
// al final el punto grande del centro, que es la "punta".
const PIEZAS = [
  { tipo: 'path', d: TRIANGULO },
  { tipo: 'path', d: IZQUIERDA },
  { tipo: 'path', d: DERECHA },
  { tipo: 'circle', ...PUNTOS[0] },
  { tipo: 'circle', ...PUNTOS[4] },
  { tipo: 'circle', ...PUNTOS[1] },
  { tipo: 'circle', ...PUNTOS[3] }
];
const PUNTA = { tipo: 'circle', ...PUNTOS[2] };

// Curva de la caída: rápida al principio y frena suave al aterrizar.
const frenar = (t) => 1 - Math.pow(1 - t, 3);
// Aparición suave (sin arranque ni final bruscos).
const suave = (t) => t * t * (3 - 2 * t);

// memo: sólo se vuelve a renderizar la pieza cuyas props cambiaron (la
// que está cayendo o brillando), no las 8 en cada frame del scroll.
//
// Fluidez: el CONTENIDO de los SVG es fijo — nunca cambia con el scroll.
// Antes el "brillo" al aterrizar se hacía cambiando opacidades DENTRO del
// SVG (degradado, escaneo, resplandor con blur), lo que obligaba al
// navegador a volver a pintar el desenfoque en cada frame. Ahora el
// brillo es una capa aparte (más clara, con resplandor fuerte) a la que
// sólo se le cambia la `opacity`, y la caída es sólo `transform` — las
// dos cosas las resuelve la GPU sin repintar.
//
// 3 capas por pieza, separadas en profundidad (translateZ) para que al
// girar se vea con volumen: atrás sólo el contorno tenue; adelante la
// pieza (relleno + escaneo + resplandor suave) y, encima, la capa de
// brillo.
const PiezaLogo = memo(function PiezaLogo({ forma, color, avance, brillo, esPunta }) {
  const id = useId().replace(/:/g, '');
  const trazo = esPunta ? 'white' : color;
  const dibujar = (props) =>
    forma.tipo === 'path' ? <path d={forma.d} {...props} /> : <circle cx={forma.cx} cy={forma.cy} r={forma.r} {...props} />;

  const caida = frenar(avance);
  const aparicion = suave(avance);
  const capa = (z, opacidad, contenido) => (
    <svg
      width={ANCHO_LOGO}
      height={ALTO_LOGO}
      viewBox={`0 0 ${LOGO_W} ${LOGO_H}`}
      style={{
        position: 'absolute',
        left: -ANCHO_LOGO / 2,
        top: -ALTO_LOGO,
        overflow: 'visible',
        transform: `translateZ(${z}px)`,
        opacity: opacidad
      }}
    >
      {contenido}
    </svg>
  );

  return (
    <div
      style={{
        position: 'absolute',
        transformStyle: 'preserve-3d',
        transform: `translateY(${(1 - caida) * -420}px)`,
        visibility: avance > 0 ? 'visible' : 'hidden'
      }}
    >
      {capa(-14, aparicion * 0.35, dibujar({ fill: 'none', stroke: trazo, strokeWidth: 1.6, strokeOpacity: 0.9 }))}

      {capa(
        14,
        aparicion,
        <>
          <defs>
            <linearGradient id={`g${id}`} x1="0" y1="0" x2="0" y2="1">
              {esPunta ? (
                <>
                  <stop offset="0" stopColor="white" stopOpacity="0.95" />
                  <stop offset="1" stopColor={color} stopOpacity="0.7" />
                </>
              ) : (
                <>
                  <stop offset="0" stopColor={color} stopOpacity="0.4" />
                  <stop offset="1" stopColor={color} stopOpacity="0.12" />
                </>
              )}
            </linearGradient>
            {/* Líneas de escaneo horizontales, como la imagen de un
                proyector. */}
            <pattern id={`p${id}`} width="5" height="5" patternUnits="userSpaceOnUse">
              <rect width="5" height="1.2" fill="white" fillOpacity="0.16" />
            </pattern>
            <filter id={`f${id}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation={6} />
            </filter>
          </defs>
          {dibujar({ fill: `url(#g${id})` })}
          {dibujar({ fill: `url(#p${id})` })}
          {/* Resplandor: el mismo contorno, grueso y difuminado. */}
          {dibujar({ fill: 'none', stroke: trazo, strokeWidth: 12, strokeOpacity: 0.3, filter: `url(#f${id})` })}
          {dibujar({ fill: 'none', stroke: trazo, strokeWidth: 2.2, strokeOpacity: 0.9 })}
        </>
      )}

      {!esPunta &&
        capa(
          14.5,
          aparicion * brillo,
          <>
            <defs>
              <filter id={`b${id}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation={7} />
              </filter>
            </defs>
            {dibujar({ fill: color, fillOpacity: 0.3 })}
            {dibujar({ fill: 'none', stroke: color, strokeWidth: 14, strokeOpacity: 0.55, filter: `url(#b${id})` })}
          </>
        )}
    </div>
  );
});

// Rayo original (dos planos cruzados con degradado). Se probó un
// "huso" de luz en punta y a Yocxany no le gustó — no volver a eso.
function Haz({ y, color, avance }) {
  return (
    <div style={{ position: 'absolute', transformStyle: 'preserve-3d' }}>
      {[0, 90].map((g) => (
        <div
          key={g}
          style={{
            position: 'absolute',
            width: 60,
            height: 520,
            left: -30,
            top: -520,
            transform: `translateY(${y}px) rotateY(${g}deg)`,
            transformOrigin: '50% 100%',
            scale: `1 ${avance}`,
            background: `radial-gradient(ellipse 30% 100% at 50% 100%, ${mezcla(color, 70)}, transparent 70%)`,
            opacity: avance
          }}
        />
      ))}
    </div>
  );
}

export default function PublicacionesPiramide({ titulo, palabras, objetivo, pista, color = '#4FB2F2' }) {
  const seccionRef = useRef(null);
  const escenaRef = useRef(null);
  const [progreso, setProgreso] = useState(0);
  const [escala, setEscala] = useState(1);
  const [altoVisible, setAltoVisible] = useState(null);
  const n = palabras.length;
  const piezas = n + 2; // pisos + punta + haz

  // `palabras` trae 7: una pieza del logo por palabra (ver PIEZAS).
  const altoTotal = ALTO_LOGO;

  // Fluidez: antes cada evento de scroll escribía el progreso directo
  // (la ruedita del mouse avanza "a saltos", así que la pirámide también
  // saltaba) y además re-medía escala/alto en cada frame. Ahora:
  // - el scroll sólo actualiza un OBJETIVO (ref, sin render);
  // - un loop de requestAnimationFrame acerca el progreso mostrado a ese
  //   objetivo con suavizado (lerp), así los saltos de la ruedita se
  //   convierten en un movimiento continuo;
  // - escala y alto visible se miden sólo al montar y en resize;
  // - el progreso se redondea (1/5000) para no re-renderizar por
  //   cambios imperceptibles, y el loop se detiene solo cuando llega.
  const objetivoRef = useRef(0);
  const mostradoRef = useRef(0);

  useEffect(() => {
    const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const seccion = seccionRef.current;
    const main = seccion?.closest('main');
    if (!seccion) return undefined;

    let rafId = null;
    const medirTamanos = () => {
      setEscala(Math.min(1, (escenaRef.current?.offsetWidth ?? 460) / 460));
      setAltoVisible(main ? main.clientHeight : window.innerHeight);
    };
    const leerObjetivo = () => {
      const H = main ? main.clientHeight : window.innerHeight;
      const topVisible = main ? main.getBoundingClientRect().top : 0;
      const r = seccion.getBoundingClientRect();
      objetivoRef.current = limitar(-(r.top - topVisible) / (r.height - H));
    };
    // Suavizado según el TIEMPO real entre frames (no un % fijo por
    // frame): así se siente igual de fluido en pantallas de 60, 120 o
    // 144 Hz. SUAVIZADO_MS es cuánto tarda en recorrer ~63% de la
    // distancia al objetivo — más alto = más "manteca", más bajo = más
    // pegado al dedo/ruedita.
    const SUAVIZADO_MS = 140;
    let ultimoT = null;
    const paso = (t) => {
      const dt = ultimoT === null ? 16 : Math.min(64, t - ultimoT);
      ultimoT = t;
      const objetivo = objetivoRef.current;
      const actual = mostradoRef.current;
      const diff = objetivo - actual;
      const k = 1 - Math.exp(-dt / SUAVIZADO_MS);
      const siguiente = Math.abs(diff) < 0.0002 ? objetivo : actual + diff * k;
      mostradoRef.current = siguiente;
      setProgreso(Math.round(siguiente * 5000) / 5000);
      if (siguiente === objetivo) {
        rafId = null;
        ultimoT = null;
      } else {
        rafId = requestAnimationFrame(paso);
      }
    };
    const alMover = () => {
      leerObjetivo();
      if (rafId === null) rafId = requestAnimationFrame(paso);
    };
    const alRedimensionar = () => {
      medirTamanos();
      alMover();
    };

    // Primera medición en el siguiente frame (no sincrónica dentro del
    // efecto).
    const inicioId = requestAnimationFrame(() => {
      medirTamanos();
      if (sinMovimiento) {
        setProgreso(1);
        return;
      }
      leerObjetivo();
      mostradoRef.current = objetivoRef.current;
      setProgreso(objetivoRef.current);
    });

    const fuente = main || window;
    if (!sinMovimiento) fuente.addEventListener('scroll', alMover, { passive: true });
    window.addEventListener('resize', sinMovimiento ? medirTamanos : alRedimensionar);
    return () => {
      cancelAnimationFrame(inicioId);
      fuente.removeEventListener('scroll', alMover);
      window.removeEventListener('resize', sinMovimiento ? medirTamanos : alRedimensionar);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // La construcción completa (pisos + punta + rayo) termina al 82% del
  // recorrido; el último tramo es un descanso con la pirámide ya
  // armada, así el rayo alcanza a salir entero antes de que la
  // sección se suelte (con el suavizado, antes se quedaba a medias).
  const armado = limitar(progreso / 0.82);
  const pos = armado * piezas;
  const redondear = (v) => Math.round(v * 1000) / 1000;
  const avance = (i) => redondear(limitar(pos - i));
  const brillo = (i) => (avance(i) < 1 ? 0 : redondear(limitar(1 - (pos - i - 1) * 1.5)));
  // Las palabras se sincronizan con la LLEGADA de cada pieza, no con
  // el momento en que empieza a caer: cada pieza tarda ~2 gestos de
  // scroll en acomodarse, y antes la palabra cambiaba apenas arrancaba
  // la caída (a mitad de camino del gesto), así que iba desfasada.
  // Ahora la palabra `i` se resalta cuando la pieza `i` ya recorrió
  // LLEGADA de su caída y queda resaltada hasta que llega la siguiente
  // — cambia UNA vez por pieza. Mismo umbral para la lista, el rótulo
  // grande y el objetivo final.
  const LLEGADA = 0.75;
  const llego = (i) => avance(i) >= LLEGADA;
  const activo = Math.max(0, Math.min(n - 1, Math.floor(pos - LLEGADA)));
  // Gira de -40° a 0°: termina DE FRENTE, con el logo legible.
  const giro = -40 + armado * 40;
  const mostrarPista = progreso < 0.04;
  // Rótulo grande debajo del logo: la palabra del nivel que está
  // cayendo y, cuando ya cayó la punta, el objetivo final.
  const completo = llego(n);
  const rotulo = completo ? objetivo : palabras[activo];
  const mostrarRotulo = llego(0) && Boolean(rotulo);

  return (
    // Sección completa de borde a borde (ya no un panel redondeado
    // "encerrado" dentro de Publicaciones): fondo azul oscuro en toda la
    // pantalla — navy institucional #003366 en tema claro y el
    // #001F3D del sitio en tema oscuro — con un resplandor celeste suave
    // detrás de la pirámide. Arriba, el título en su píldora, a la
    // misma distancia del borde que los títulos de las demás
    // subsecciones (--docencia-gap).
    <div ref={seccionRef} className="relative bg-[#003366] dark:bg-[#001F3D]" style={{ height: `${(piezas + 2) * 48}vh` }}>
      <div
        className="sticky top-0 flex flex-col text-white overflow-hidden bg-[radial-gradient(ellipse_at_50%_60%,rgba(79,178,242,0.16),transparent_62%)] dark:bg-[radial-gradient(ellipse_at_50%_60%,rgba(79,178,242,0.12),transparent_62%)]"
        style={{ height: altoVisible ?? '100vh' }}
      >
        {titulo && (
          <div className="shrink-0 pt-[var(--docencia-gap)] px-4 flex justify-center text-center">
            <KickerBadge onDark>{titulo}</KickerBadge>
          </div>
        )}
        <div className="relative flex-1 min-h-0 w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 md:gap-16 px-5 sm:px-8">
          <div className="w-full max-w-[460px] shrink-0 flex flex-col items-center md:max-h-full">
          <div
            ref={escenaRef}
            aria-hidden="true"
            className="relative w-full h-[34vh] md:h-[440px] md:max-h-[70vh] flex items-center justify-center shrink-0"
            style={{ perspective: '1400px' }}
          >
            <div
              style={{
                position: 'relative',
                width: 0,
                height: 0,
                transformStyle: 'preserve-3d',
                willChange: 'transform',
                transform: `translateY(${(altoTotal / 2) * escala}px) scale(${escala}) rotateX(-12deg) rotateY(${giro}deg)`
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: 760,
                  height: 760,
                  left: -380,
                  top: -380,
                  transform: 'rotateX(90deg)',
                  backgroundImage: `linear-gradient(${mezcla(color, 30)} 1px, transparent 1px), linear-gradient(90deg, ${mezcla(color, 30)} 1px, transparent 1px)`,
                  backgroundSize: '38px 38px',
                  backgroundPosition: 'center',
                  maskImage: 'radial-gradient(circle, black 20%, transparent 65%)',
                  WebkitMaskImage: 'radial-gradient(circle, black 20%, transparent 65%)',
                  opacity: 0.4 + armado * 0.6
                }}
              />

              {palabras.map((palabra, i) => (
                <PiezaLogo
                  key={i}
                  forma={PIEZAS[Math.min(i, PIEZAS.length - 1)]}
                  color={color}
                  avance={avance(i)}
                  brillo={brillo(i)}
                />
              ))}

              <PiezaLogo esPunta forma={PUNTA} color={color} avance={avance(n)} brillo={0} />

              {/* El rayo sale desde arriba del punto grande del centro. */}
              <Haz y={-(ALTO_LOGO - (PUNTA.cy - PUNTA.r) * ESCALA_LOGO)} color={color} avance={avance(n + 1)} />
            </div>
          </div>

          {/* Rótulo holográfico de la palabra del nivel actual. `key`
              cambia con cada palabra para que la animación de entrada
              (holoWordIn en global.css) se repita en cada nivel. */}
          <div className="h-16 sm:h-20 flex flex-col items-center justify-center text-center transition-opacity duration-500" style={{ opacity: mostrarRotulo ? 1 : 0 }}>
            <span
              key={completo ? 'objetivo' : activo}
              className="animate-holo-word flex flex-col items-center"
            >
              {!completo && (
                <span className="font-mono-code text-[10px] sm:text-xs tracking-[0.3em]" style={{ color }}>
                  {String(activo + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
                </span>
              )}
              <span
                className="font-heading font-extrabold uppercase tracking-[0.12em] text-2xl sm:text-3xl md:text-4xl text-white leading-tight"
                style={{ textShadow: `0 0 6px ${color}, 0 0 22px ${color}, 0 0 44px ${mezcla(color, 60)}` }}
              >
                {rotulo}
              </span>
            </span>
          </div>
          </div>

          {/* Lista de las 7 palabras, de la base (01) a la cima (07) —
              se enciende a medida que cae cada pieza del logo. */}
          {/* La palabra activa crece, brilla y lleva una franja de luz
              detrás; las que ya cayeron quedan encendidas a media luz y
              las que faltan, casi apagadas. */}
          <ol className="w-full max-w-xs md:max-w-sm">
            {palabras.map((palabra, i) => {
              const visible = llego(i);
              const esActivo = i === activo && !completo;
              return (
                <li
                  key={i}
                  className="flex items-center gap-3 sm:gap-4 py-0.5 sm:py-1 md:py-1.5 pl-4 pr-3 border-l-2 rounded-r-lg transition-all duration-500"
                  style={{
                    opacity: visible ? (esActivo ? 1 : 0.6) : 0.15,
                    borderColor: esActivo ? color : visible ? mezcla(color, 35) : 'rgba(255,255,255,.12)',
                    background: esActivo ? `linear-gradient(90deg, ${mezcla(color, 22)}, transparent)` : 'transparent',
                    boxShadow: esActivo ? `-8px 0 18px -8px ${color}` : 'none',
                    transform: esActivo ? 'translateX(6px)' : 'none'
                  }}
                >
                  <span
                    className={`tabular-nums font-mono-code transition-all duration-500 ${esActivo ? 'text-sm sm:text-base font-bold' : 'text-xs sm:text-sm'}`}
                    style={{ color }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={`font-heading transition-all duration-500 ${
                      esActivo ? 'text-lg sm:text-xl md:text-2xl font-extrabold' : 'text-sm sm:text-base md:text-lg font-semibold'
                    }`}
                    style={{ textShadow: esActivo ? `0 0 4px ${color}, 0 0 16px ${color}` : 'none' }}
                  >
                    {palabra}
                  </span>
                </li>
              );
            })}
            {objetivo && (
              <li
                className="mt-3 sm:mt-4 pl-4 font-heading text-base sm:text-lg md:text-xl font-extrabold transition-opacity duration-500"
                style={{
                  opacity: completo ? 1 : 0.15,
                  textShadow: completo ? `0 0 18px ${color}` : 'none'
                }}
              >
                {objetivo}
              </li>
            )}
          </ol>

          {/* Pista de "deslizá": mouse con ruedita que baja, muy tenue,
              que se apaga apenas empieza a armarse la pirámide. */}
          <div
            aria-hidden={!mostrarPista}
            className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 transition-opacity duration-500"
            style={{ opacity: mostrarPista ? 0.75 : 0 }}
          >
            <span className="w-5 h-8 rounded-full border-2 border-[#9FC6E8]/60 flex justify-center pt-1.5">
              <span className="w-1 h-1.5 rounded-full bg-[#9FC6E8] animate-scroll-wheel" />
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono-code uppercase tracking-widest text-[#9FC6E8]">{pista}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
