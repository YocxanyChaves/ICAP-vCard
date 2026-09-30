import React, { memo, useEffect, useId, useRef, useState } from 'react';
import KickerBadge from './KickerBadge';
import icapLogoMark from '../../assets/icap-logo-mark.png';

/**
 * Pirámide holográfica de las 7 palabras de Publicaciones ("Investigar –
 * Publicar – … – Transformar"), adaptada del componente que pasó
 * Yocxany (src/components/PiramideHolograma.jsx, que queda intacto).
 * Yocxany eligió "7 pisos + punta ICAP": cada palabra es un piso (la
 * primera abajo, la última arriba) y la punta brillante lleva "ICAP".
 *
 * Cambios respecto al original:
 * - El scroll que se escucha es el del `<main>` de Propuesta1.jsx, no
 *   el de `window` (en este brochure el que scrollea es <main>), y el
 *   bloque sticky mide el alto VISIBLE de ese <main> (no 100vh, que
 *   incluye el header y el menú de abajo).
 * - Cada piso lleva su PALABRA escrita en las 4 caras (en vez del
 *   número), con el tamaño ajustado al ancho del piso.
 * - La escena va dentro de un panel navy redondeado (como el panel del
 *   mapa de Presencia): holograma oscuro en los dos temas.
 * - Recorrido de scroll: 48vh por pieza (el original usaba 55vh; se
 *   probó 35vh y Yocxany lo sintió muy rápido).
 * - Indicación sutil de "deslizá" (mouse con ruedita animada) que se
 *   apaga apenas se empieza a construir.
 * - El LOGO del ICAP (isotipo de icap-logo-mark.png, el de la figura con
 *   los brazos abiertos — no el escudo de las marcas de agua) flota
 *   ADENTRO de la pirámide como un holograma (ver <LogoHolograma>),
 *   pedido de Yocxany: mismo celeste, líneas de escaneo, resplandor y
 *   un parpadeo leve. Empieza a materializarse cuando cae la SEGUNDA
 *   base y está completo un par de pisos después.
 */

const mezcla = (color, pct) => `color-mix(in srgb, ${color} ${pct}%, transparent)`;
const limitar = (v) => Math.min(1, Math.max(0, v));

// memo: sólo se vuelve a dibujar el piso cuyas props cambiaron (el que
// está cayendo o brillando), no los 8 en cada frame del scroll.
const Franja = memo(function Franja({ y0, y1, base, altoTotal, color, avance, brillo, palabra, esPunta, avanceSiguiente }) {
  const id = useId().replace(/:/g, '');
  const mitad = (y) => (base / 2) * (1 - y / altoTotal);
  const m0 = mitad(y0);
  const m1 = mitad(y1);
  const W = m0 * 2;
  const angulo = Math.atan(base / 2 / altoTotal);
  const cos = Math.cos(angulo);
  const H = (y1 - y0) / cos + 0.6;
  const rx = m0 - m1;
  const g = brillo;

  const desde = H + y0 / cos;
  const hasta = desde - altoTotal / cos;

  const puntos = `${rx},0 ${W - rx},0 ${W},${H} 0,${H}`;
  const aristas = [[0, H, rx, 0], [W, H, W - rx, 0], ...(y0 === 0 ? [[0, H, W, H]] : [])];
  const luzCara = [1, 0.6, 0.8, 1.2];

  // Tamaño de la palabra según el ancho del piso (el de arriba es mucho
  // más angosto que la base).
  const anchoUtil = (m0 + m1) * 0.82;
  const fontSize = palabra ? Math.max(7, Math.min(13, anchoUtil / (palabra.length * 0.72))) : 11;

  return (
    <div
      style={{
        position: 'absolute',
        transformStyle: 'preserve-3d',
        transform: `translateY(${(1 - avance) * -420}px)`,
        visibility: avance > 0 ? 'visible' : 'hidden'
      }}
    >
      {[0, 90, 180, 270].map((giro, k) => (
        <svg
          key={giro}
          width={W}
          height={H}
          style={{
            position: 'absolute',
            left: -W / 2,
            top: -H,
            overflow: 'visible',
            transformOrigin: '50% 100%',
            transform: `translateY(${-y0}px) rotateY(${giro}deg) translateZ(${m0}px) rotateX(${(angulo * 180) / Math.PI}deg)`,
            opacity: avance
          }}
        >
          <defs>
            <clipPath id={`c${id}${k}`}>
              <polygon points={puntos} />
            </clipPath>
            <filter id={`f${id}${k}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation={5} />
            </filter>
            <linearGradient id={`g${id}${k}`} gradientUnits="userSpaceOnUse" x1="0" y1={desde} x2="0" y2={hasta}>
              {esPunta ? (
                <>
                  <stop offset="0.75" stopColor={color} stopOpacity="0.6" />
                  <stop offset="1" stopColor="white" stopOpacity="0.95" />
                </>
              ) : (
                <>
                  <stop offset="0" stopColor={color} stopOpacity={(0.04 + g * 0.15) * luzCara[k]} />
                  <stop offset="1" stopColor={color} stopOpacity={(0.2 + g * 0.2) * luzCara[k]} />
                </>
              )}
            </linearGradient>
          </defs>

          <polygon points={puntos} fill={`url(#g${id}${k})`} />

          <g clipPath={`url(#c${id}${k})`}>
            {aristas.map(([x1, ya, x2, yb], j) => (
              <line
                key={j}
                x1={x1}
                y1={ya}
                x2={x2}
                y2={yb}
                stroke={esPunta ? 'white' : color}
                strokeWidth="14"
                strokeOpacity={0.35 + g * 0.4}
                filter={`url(#f${id}${k})`}
              />
            ))}
          </g>

          {aristas.map(([x1, ya, x2, yb], j) => (
            <g key={j}>
              <line
                x1={x1}
                y1={ya}
                x2={x2}
                y2={yb}
                stroke={esPunta ? 'white' : color}
                strokeWidth="4"
                strokeOpacity={0.5 + g * 0.5}
                filter={`url(#f${id}${k})`}
              />
              <line x1={x1} y1={ya} x2={x2} y2={yb} stroke={esPunta ? 'white' : color} strokeWidth="1" strokeOpacity={0.9} />
            </g>
          ))}

          {esPunta ? (
            // "ICAP" en la parte baja de cada cara de la punta, donde el
            // triángulo todavía es lo bastante ancho.
            <text
              x={W / 2}
              y={H * 0.74}
              dominantBaseline="middle"
              textAnchor="middle"
              fill="white"
              fontSize="11"
              fontWeight="800"
              letterSpacing="1.5"
              fontFamily="Raleway, sans-serif"
              style={{ filter: `drop-shadow(0 0 5px ${color})` }}
            >
              ICAP
            </text>
          ) : (
            <text
              x={W / 2}
              y={H / 2}
              dominantBaseline="middle"
              textAnchor="middle"
              fill="white"
              fillOpacity={0.75 + g * 0.25}
              fontSize={fontSize}
              fontWeight="700"
              letterSpacing="1.2"
              fontFamily="'IBM Plex Mono', monospace"
              style={{ filter: `drop-shadow(0 0 4px ${color})`, textTransform: 'uppercase' }}
            >
              {palabra}
            </text>
          )}
        </svg>
      ))}

      {!esPunta && (
        <div
          style={{
            position: 'absolute',
            width: m1 * 2,
            height: m1 * 2,
            left: -m1,
            top: -m1,
            transform: `translateY(${-y1}px) rotateX(90deg)`,
            background: `radial-gradient(circle, ${mezcla(color, 25 + g * 30)}, ${mezcla(color, 6)})`,
            border: `1px solid ${mezcla(color, 55 + g * 45)}`,
            boxShadow: `0 0 ${6 + g * 28}px ${mezcla(color, 35 + g * 50)}, inset 0 0 ${12 + g * 24}px ${mezcla(color, 18 + g * 40)}`,
            opacity: avance * (1 - avanceSiguiente)
          }}
        />
      )}
    </div>
  );
});

// Logo (isotipo) del ICAP flotando dentro de la pirámide, con look de
// holograma. Es un plano "cartel" (billboard): contra-rota el giro de la
// escena (rotateY(-giro)) para quedar siempre de frente a la cámara
// aunque la pirámide gire, y se ve a través de las caras translúcidas.
// - La silueta sale del PNG del logo (tiene fondo transparente) usado
//   como mask-image — por eso pierde sus dos tonos y queda toda del
//   color del holograma —, pintada
//   con un degradado del color de la pirámide + líneas de escaneo que
//   se desplazan (holoScan en global.css).
// - El resplandor va en un wrapper APARTE con drop-shadow: el filtro de
//   un elemento se aplica antes que su propia máscara, así que en el
//   mismo elemento la máscara se "comería" el brillo.
// - Aparece de a poco (`visible`, 0→1, desde la segunda base) y flota/parpadea
//   levemente (holoFloat / holoFlicker).
function LogoHolograma({ y, ancho, color, visible }) {
  const alto = ancho * (456 / 413); // proporción del PNG del logo
  const mascara = {
    maskImage: `url("${icapLogoMark}")`,
    WebkitMaskImage: `url("${icapLogoMark}")`,
    maskSize: 'contain',
    WebkitMaskSize: 'contain',
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
    maskPosition: 'center',
    WebkitMaskPosition: 'center'
  };
  return (
    <div
      style={{
        position: 'absolute',
        width: ancho,
        height: alto,
        left: -ancho / 2,
        top: -alto / 2,
        transform: `translateY(${-y}px)`,
        opacity: visible,
        visibility: visible > 0 ? 'visible' : 'hidden'
      }}
    >
      <div className="animate-holo-float" style={{ width: '100%', height: '100%' }}>
        <div
          className="animate-holo-flicker"
          style={{
            width: '100%',
            height: '100%',
            filter: `drop-shadow(0 0 4px ${color}) drop-shadow(0 0 14px ${mezcla(color, 70)})`
          }}
        >
          <div
            className="animate-holo-scan"
            style={{
              ...mascara,
              width: '100%',
              height: '100%',
              backgroundImage: `repeating-linear-gradient(0deg, rgba(255,255,255,0.35) 0px, rgba(255,255,255,0.35) 1px, transparent 1px, transparent 4px), linear-gradient(180deg, ${mezcla('white', 85)}, ${mezcla(color, 80)} 45%, ${mezcla(color, 30)})`,
              backgroundSize: '100% 8px, 100% 100%'
            }}
          />
        </div>
      </div>
    </div>
  );
}

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

  const base = 300;
  const altoFranja = 38;
  const altoPunta = 80;
  const altoTotal = n * altoFranja + altoPunta;

  // Fluidez: antes cada evento de scroll escribía el progreso directo
  // (la ruedita del mouse avanza "a saltos", así que la pirámide también
  // saltaba) y además re-medía escala/alto en cada frame. Ahora:
  // - el scroll sólo actualiza un OBJETIVO (ref, sin render);
  // - un loop de requestAnimationFrame acerca el progreso mostrado a ese
  //   objetivo con suavizado (lerp), así los saltos de la ruedita se
  //   convierten en un movimiento continuo;
  // - escala y alto visible se miden sólo al montar y en resize;
  // - el progreso se redondea (1/2000) para no re-renderizar por
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
    const paso = () => {
      const objetivo = objetivoRef.current;
      const actual = mostradoRef.current;
      const diff = objetivo - actual;
      const siguiente = Math.abs(diff) < 0.0005 ? objetivo : actual + diff * 0.14;
      mostradoRef.current = siguiente;
      setProgreso(Math.round(siguiente * 2000) / 2000);
      rafId = siguiente === objetivo ? null : requestAnimationFrame(paso);
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
  const redondear = (v) => Math.round(v * 200) / 200;
  const avance = (i) => redondear(limitar(pos - i));
  const brillo = (i) => (avance(i) < 1 ? 0 : redondear(limitar(1 - (pos - i - 1) * 1.5)));
  const activo = Math.min(n - 1, Math.floor(pos));
  const giro = -40 + armado * 120;
  const mostrarPista = progreso < 0.04;

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
          <div
            ref={escenaRef}
            aria-hidden="true"
            className="relative w-full max-w-[460px] h-[38vh] md:h-[520px] md:max-h-[80%] flex items-center justify-center shrink-0"
            style={{ perspective: '1400px' }}
          >
            <div
              style={{
                position: 'relative',
                width: 0,
                height: 0,
                transformStyle: 'preserve-3d',
                willChange: 'transform',
                transform: `translateY(${(altoTotal / 2) * escala}px) scale(${escala}) rotateX(-18deg) rotateY(${giro}deg)`
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
                <Franja
                  key={i}
                  palabra={palabra}
                  y0={i * altoFranja}
                  y1={(i + 1) * altoFranja}
                  base={base}
                  altoTotal={altoTotal}
                  color={color}
                  avance={avance(i)}
                  avanceSiguiente={avance(i + 1)}
                  brillo={brillo(i)}
                />
              ))}

              <Franja
                esPunta
                y0={n * altoFranja}
                y1={altoTotal}
                base={base}
                altoTotal={altoTotal}
                color={color}
                avance={avance(n)}
                avanceSiguiente={0}
                brillo={0}
              />

              {/* Billboard: contra-rota el giro de la escena para quedar
                  siempre de frente. Centro a ~1/3 de la altura, donde la
                  pirámide todavía es ancha y el escudo entra holgado. */}
              <div style={{ position: 'absolute', transformStyle: 'preserve-3d', transform: `rotateY(${-giro}deg)` }}>
                <LogoHolograma
                  y={altoTotal * 0.34}
                  ancho={base * 0.38}
                  color={color}
                  // pos = pisos caídos; 1 → empieza a caer la 2ª base,
                  // 3 → ya cayeron tres pisos y el logo está completo.
                  visible={redondear(limitar((pos - 1) / 2))}
                />
              </div>

              <Haz y={-altoTotal} color={color} avance={avance(n + 1)} />
            </div>
          </div>

          {/* Lista de las 7 palabras, de la base (01) a la cima (07) —
              se enciende a medida que cae cada piso. */}
          <ol className="w-full max-w-xs md:max-w-sm">
            {palabras.map((palabra, i) => {
              const visible = avance(i) > 0.5;
              const esActivo = i === activo && armado < 1;
              return (
                <li
                  key={i}
                  className="flex items-baseline gap-3 sm:gap-4 py-1 sm:py-1.5 pl-4 border-l transition-all duration-300"
                  style={{
                    opacity: visible ? (esActivo ? 1 : 0.55) : 0.12,
                    borderColor: esActivo ? color : 'rgba(255,255,255,.12)',
                    boxShadow: esActivo ? `-6px 0 14px -8px ${color}` : 'none'
                  }}
                >
                  <span className="text-xs sm:text-sm tabular-nums font-mono-code" style={{ color }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={`font-heading text-sm sm:text-base ${esActivo ? 'font-extrabold' : 'font-semibold'}`}>
                    {palabra}
                  </span>
                </li>
              );
            })}
            {objetivo && (
              <li
                className="mt-3 sm:mt-4 pl-4 font-heading text-base sm:text-lg font-extrabold transition-opacity duration-500"
                style={{
                  opacity: avance(n) > 0.5 ? 1 : 0.12,
                  textShadow: avance(n) > 0.5 ? `0 0 18px ${color}` : 'none'
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
