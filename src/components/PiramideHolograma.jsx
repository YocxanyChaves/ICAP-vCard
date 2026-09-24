import { useEffect, useId, useRef, useState } from "react";

// Cambiá estos datos por tus 7 pasos y tu objetivo
const PASOS_EJEMPLO = [
  { titulo: "Diagnóstico", texto: "Identificar la situación actual y las necesidades." },
  { titulo: "Planificación", texto: "Definir metas, recursos y plazos." },
  { titulo: "Diseño", texto: "Construir la propuesta y sus componentes." },
  { titulo: "Validación", texto: "Revisar la propuesta con las partes involucradas." },
  { titulo: "Implementación", texto: "Poner en marcha lo planificado." },
  { titulo: "Seguimiento", texto: "Medir avances y corregir a tiempo." },
  { titulo: "Evaluación", texto: "Valorar resultados y documentar aprendizajes." },
];

const t = (color, pct) => `color-mix(in srgb, ${color} ${pct}%, transparent)`;
const limitar = (v) => Math.min(1, Math.max(0, v));

// Una franja de la pirámide dibujada en SVG. Todas comparten la misma inclinación,
// así que juntas forman una sola pirámide lisa. El SVG permite el brillo interno
// y externo en las aristas inclinadas, igual que el efecto holograma de los bloques.
function Franja({ y0, y1, base, altoTotal, color, avance, brillo, numero, esPunta, avanceSiguiente }) {
  const id = useId().replace(/:/g, "");
  const mitad = (y) => (base / 2) * (1 - y / altoTotal);
  const m0 = mitad(y0);
  const m1 = mitad(y1);
  const W = m0 * 2;
  const angulo = Math.atan(base / 2 / altoTotal);
  const cos = Math.cos(angulo);
  const H = (y1 - y0) / cos + 0.6; // +0.6 evita rayitas entre franjas
  const rx = m0 - m1;
  const g = brillo;

  // Posición de esta franja dentro de la pirámide completa, para que el degradado sea continuo
  const desde = H + y0 / cos;              // base de la pirámide en coordenadas locales
  const hasta = desde - altoTotal / cos;   // punta de la pirámide en coordenadas locales

  const puntos = `${rx},0 ${W - rx},0 ${W},${H} 0,${H}`;
  const aristas = [
    [0, H, rx, 0],
    [W, H, W - rx, 0],
    ...(y0 === 0 ? [[0, H, W, H]] : []), // la base también brilla
  ];
  const luzCara = [1, 0.6, 0.8, 1.2];

  return (
    <div
      style={{
        position: "absolute",
        transformStyle: "preserve-3d",
        transform: `translateY(${(1 - avance) * -420}px)`,
        visibility: avance > 0 ? "visible" : "hidden",
      }}
    >
      {[0, 90, 180, 270].map((giro, k) => (
        <svg
          key={giro}
          width={W}
          height={H}
          style={{
            position: "absolute",
            left: -W / 2,
            top: -H,
            overflow: "visible",
            transformOrigin: "50% 100%",
            transform: `translateY(${-y0}px) rotateY(${giro}deg) translateZ(${m0}px) rotateX(${(angulo * 180) / Math.PI}deg)`,
            opacity: avance,
          }}
        >
          <defs>
            <clipPath id={`c${id}${k}`}>
              <polygon points={puntos} />
            </clipPath>
            <filter id={`f${id}${k}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation={3 + g * 4} />
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

          {/* Vidrio */}
          <polygon points={puntos} fill={`url(#g${id}${k})`} />

          {/* Brillo interno pegado a las aristas */}
          <g clipPath={`url(#c${id}${k})`}>
            {aristas.map(([x1, ya, x2, yb], j) => (
              <line key={j} x1={x1} y1={ya} x2={x2} y2={yb}
                stroke={esPunta ? "white" : color} strokeWidth="14"
                strokeOpacity={0.35 + g * 0.4} filter={`url(#f${id}${k})`} />
            ))}
          </g>

          {/* Resplandor externo + línea fina */}
          {aristas.map(([x1, ya, x2, yb], j) => (
            <g key={j}>
              <line x1={x1} y1={ya} x2={x2} y2={yb} stroke={esPunta ? "white" : color}
                strokeWidth="4" strokeOpacity={0.5 + g * 0.5} filter={`url(#f${id}${k})`} />
              <line x1={x1} y1={ya} x2={x2} y2={yb} stroke={esPunta ? "white" : color}
                strokeWidth="1" strokeOpacity={0.9} />
            </g>
          ))}

          {!esPunta && (
            <text x={W / 2} y={H / 2} dominantBaseline="middle" textAnchor="middle"
              fill="white" fillOpacity="0.8" fontSize="11" letterSpacing="2"
              style={{ filter: `drop-shadow(0 0 4px ${color})` }}>
              {String(numero).padStart(2, "0")}
            </text>
          )}
        </svg>
      ))}

      {/* Tapa: solo se ve mientras esta franja es la de más arriba */}
      {!esPunta && (
        <div
          style={{
            position: "absolute",
            width: m1 * 2,
            height: m1 * 2,
            left: -m1,
            top: -m1,
            transform: `translateY(${-y1}px) rotateX(90deg)`,
            background: `radial-gradient(circle, ${t(color, 25 + g * 30)}, ${t(color, 6)})`,
            border: `1px solid ${t(color, 55 + g * 45)}`,
            boxShadow: `0 0 ${6 + g * 28}px ${t(color, 35 + g * 50)}, inset 0 0 ${12 + g * 24}px ${t(color, 18 + g * 40)}`,
            opacity: avance * (1 - avanceSiguiente),
          }}
        />
      )}
    </div>
  );
}

function Haz({ y, color, avance }) {
  return (
    <div style={{ position: "absolute", transformStyle: "preserve-3d" }}>
      {[0, 90].map((g) => (
        <div
          key={g}
          style={{
            position: "absolute",
            width: 60,
            height: 520,
            left: -30,
            top: -520,
            transform: `translateY(${y}px) rotateY(${g}deg)`,
            transformOrigin: "50% 100%",
            scale: `1 ${avance}`,
            background: `radial-gradient(ellipse 30% 100% at 50% 100%, ${t(color, 70)}, transparent 70%)`,
            opacity: avance,
          }}
        />
      ))}
    </div>
  );
}

export default function PiramideHolograma({
  pasos = PASOS_EJEMPLO,
  objetivo = "Objetivo alcanzado",
  color = "#3fa9ff",
  fondo = "#06101f",
}) {
  const seccionRef = useRef(null);
  const escenaRef = useRef(null);
  const [progreso, setProgreso] = useState(0);
  const [escala, setEscala] = useState(1);
  const n = pasos.length;
  const piezas = n + 2; // franjas + punta + haz

  const base = 300;
  const altoFranja = 38;
  const altoPunta = 80;
  const altoTotal = n * altoFranja + altoPunta;

  useEffect(() => {
    const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const actualizar = () => {
      setEscala(Math.min(1, (escenaRef.current?.offsetWidth ?? 460) / 460));
      if (sinMovimiento) return setProgreso(1);
      const r = seccionRef.current.getBoundingClientRect();
      setProgreso(limitar(-r.top / (r.height - window.innerHeight)));
    };
    actualizar();
    window.addEventListener("scroll", actualizar, { passive: true });
    window.addEventListener("resize", actualizar);
    return () => {
      window.removeEventListener("scroll", actualizar);
      window.removeEventListener("resize", actualizar);
    };
  }, []);

  const pos = progreso * piezas;
  const avance = (i) => limitar(pos - i);
  const brillo = (i) => (avance(i) < 1 ? 0 : limitar(1 - (pos - i - 1) * 1.5));
  const activo = Math.min(n - 1, Math.floor(pos));
  const giro = -40 + progreso * 120;

  return (
    <section
      ref={seccionRef}
      style={{ height: `${(piezas + 1) * 55}vh`, background: fondo }}
      className="relative text-white"
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col md:flex-row items-center justify-center gap-6 md:gap-20 px-6">

        <div
          ref={escenaRef}
          aria-hidden="true"
          className="relative w-full max-w-[460px] h-[46vh] md:h-[560px] flex items-center justify-center"
          style={{ perspective: "1400px" }}
        >
          <div
            style={{
              position: "relative",
              width: 0,
              height: 0,
              transformStyle: "preserve-3d",
              transform: `translateY(${(altoTotal / 2) * escala}px) scale(${escala}) rotateX(-18deg) rotateY(${giro}deg)`,
            }}
          >
            {/* Piso de cuadrícula */}
            <div
              style={{
                position: "absolute",
                width: 760,
                height: 760,
                left: -380,
                top: -380,
                transform: "rotateX(90deg)",
                backgroundImage: `linear-gradient(${t(color, 30)} 1px, transparent 1px), linear-gradient(90deg, ${t(color, 30)} 1px, transparent 1px)`,
                backgroundSize: "38px 38px",
                backgroundPosition: "center",
                maskImage: "radial-gradient(circle, black 20%, transparent 65%)",
                WebkitMaskImage: "radial-gradient(circle, black 20%, transparent 65%)",
                opacity: 0.4 + progreso * 0.6,
              }}
            />

            {pasos.map((_, i) => (
              <Franja
                key={i}
                numero={i + 1}
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

            <Haz y={-altoTotal} color={color} avance={avance(n + 1)} />
          </div>
        </div>

        <ol className="w-full max-w-md">
          {pasos.map((p, i) => {
            const visible = avance(i) > 0.5;
            const esActivo = i === activo && progreso < 1;
            return (
              <li
                key={i}
                className="flex gap-4 py-2 pl-4 border-l transition-all duration-300"
                style={{
                  opacity: visible ? (esActivo ? 1 : 0.5) : 0.12,
                  borderColor: esActivo ? color : "rgba(255,255,255,.12)",
                  boxShadow: esActivo ? `-6px 0 14px -8px ${color}` : "none",
                }}
              >
                <span className="text-sm tabular-nums pt-0.5" style={{ color }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className={esActivo ? "font-semibold" : ""}>{p.titulo}</p>
                  {esActivo && <p className="text-sm text-white/60 mt-0.5">{p.texto}</p>}
                </div>
              </li>
            );
          })}
          <li
            className="mt-4 pl-4 text-lg font-semibold transition-opacity duration-500"
            style={{
              opacity: avance(n) > 0.5 ? 1 : 0.12,
              textShadow: avance(n) > 0.5 ? `0 0 18px ${color}` : "none",
            }}
          >
            {objetivo}
          </li>
        </ol>
      </div>
    </section>
  );
}
