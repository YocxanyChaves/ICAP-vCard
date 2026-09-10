import React from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import icapLogoMark from '../../assets/icap-logo-mark.png';

// Puntos flotantes decorativos del fondo del Hero. Posiciones y tiempos
// fijos (no aleatorios en cada render) para que la animación sea estable.
const PARTICLES = [
  { left: '8%', size: 6, duration: '9s', delay: '-1s' },
  { left: '22%', size: 4, duration: '12s', delay: '-4.5s' },
  { left: '38%', size: 5, duration: '10.5s', delay: '-7s' },
  { left: '58%', size: 7, duration: '13s', delay: '-2.5s' },
  { left: '74%', size: 4, duration: '9.5s', delay: '-8s' },
  { left: '88%', size: 6, duration: '11.5s', delay: '-3.5s' }
];

export default function Hero({ onOpenAbout, onScrollToContact }) {
  return (
    <section className="relative min-h-[560px] sm:min-h-[640px] bg-gradient-to-br from-[#003366] via-[#0B5A96] to-[#0077C8] text-white px-4 sm:px-6 py-12 sm:py-20 flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Resplandor radial de fondo, con una deriva muy lenta para que respire */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.18),rgba(0,119,200,0)_65%)] pointer-events-none animate-glow-drift" />

      {/* Ondas de fondo: 3 capas con distinta velocidad, amplitud y dirección
          para que el movimiento se sienta orgánico (parallax), más el
          "respiro" vertical de cada capa. Cada svg mide 200% de ancho con
          el mismo trazo repetido cada 800 unidades de viewBox (mismo Y de
          entrada y salida en cada tramo), así que trasladar -50% cierra el
          loop sin costura visible. */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Onda superior — la más visible, marca el ritmo del movimiento. */}
        <div className="absolute inset-0 animate-wave-bob-fast">
          <svg
            className="absolute top-0 left-0 w-[200%] h-full animate-wave-drift-fast"
            viewBox="0 0 1600 600"
            preserveAspectRatio="none"
          >
            <path
              d="M0 130 C 200 55, 600 205, 800 130 C 1000 55, 1400 205, 1600 130"
              stroke="#FFFFFF"
              strokeWidth="1.8"
              fill="none"
              style={{ opacity: 0.24 }}
            />
          </svg>
        </div>

        {/* Onda inferior — misma dirección, misma velocidad y mismo
            compás que la de arriba (mismas clases de drift/bob, sin
            delay propio), para que las dos avancen exactamente juntas:
            no es parallax caótico, es una sola cadencia repetida en dos
            alturas — control y paciencia, no ruido. */}
        <div className="absolute inset-0 animate-wave-bob-fast">
          <svg
            className="absolute top-0 left-0 w-[200%] h-full animate-wave-drift-fast"
            viewBox="0 0 1600 600"
            preserveAspectRatio="none"
          >
            <path
              d="M0 480 C 220 545, 580 415, 800 480 C 1020 545, 1380 415, 1600 480"
              stroke="#FFFFFF"
              strokeWidth="1.6"
              fill="none"
              style={{ opacity: 0.18 }}
            />
          </svg>
        </div>

        {/* Onda central — muy tenue y al doble de duración exacto (9s
            contra 4.5s), así también vuelve a alinearse con las otras
            dos cada dos ciclos en vez de derivar sin patrón. */}
        <div className="absolute inset-0 animate-wave-bob-slow" style={{ opacity: 0.09 }}>
          <svg
            className="absolute top-0 left-0 w-[200%] h-full animate-wave-drift"
            viewBox="0 0 1600 600"
            preserveAspectRatio="none"
          >
            <path
              d="M0 300 C 250 260, 550 340, 800 300 C 1050 260, 1350 340, 1600 300"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              fill="none"
            />
          </svg>
        </div>

        {/* Partículas flotantes: puntitos que suben desde abajo y se desvanecen */}
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="absolute bottom-0 rounded-full bg-white animate-float-particle"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              animationDuration: p.duration,
              animationDelay: p.delay
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-xl mx-auto w-full">
        {/* Kicker badge */}
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-[#9FC6E8] text-[11px] sm:text-xs font-semibold tracking-widest uppercase mb-5 shadow-sm animate-hero-rise"
          style={{ animationDelay: '0ms' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#0077C8] animate-ping" />
          ICAP &middot; Fundado en 1954
        </div>

        {/* Emblem: isotipo real del ICAP con halo pulsante y un anillo punteado que gira lentamente */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-5 shrink-0 animate-hero-rise" style={{ animationDelay: '80ms' }}>
          <div className="absolute inset-0 rounded-full bg-white/25 blur-md animate-pulse-slow" aria-hidden="true" />
          <div
            className="absolute -inset-2 sm:-inset-2.5 rounded-full border border-dashed border-white/30 pointer-events-none"
            style={{ animation: 'orbitSpin 16s linear infinite' }}
            aria-hidden="true"
          />
          <div className="relative w-full h-full rounded-full bg-white flex items-center justify-center shadow-lg shadow-black/20 ring-4 ring-white/25">
            <img
              src={icapLogoMark}
              alt="Isotipo ICAP"
              className="w-[68%] h-[68%] object-contain"
              draggable={false}
            />
          </div>
        </div>

        {/* Title */}
        <h1
          className="font-heading font-extrabold text-4xl sm:text-7xl tracking-tight text-white mb-2.5 drop-shadow-sm animate-hero-rise"
          style={{ animationDelay: '150ms' }}
        >
          ICAP
        </h1>
        <h2
          className="font-semibold text-base sm:text-2xl text-[#EAF3FB] max-w-md leading-snug mb-3.5 animate-hero-rise"
          style={{ animationDelay: '220ms' }}
        >
          Instituto Centroamericano de Administración Pública
        </h2>

        {/* Description */}
        <p
          className="text-xs sm:text-base text-[#9FC6E8] max-w-lg leading-relaxed mb-7 px-2 animate-hero-rise"
          style={{ animationDelay: '290ms' }}
        >
          Organismo regional del SICA especializado en la modernización institucional, gestión de políticas públicas y formación del talento humano.
        </p>

        {/* CTAs: Explicit padding, no cutting off */}
        <div
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full max-w-md px-2 animate-hero-rise"
          style={{ animationDelay: '360ms' }}
        >
          <button
            onClick={onOpenAbout}
            className="w-full sm:w-1/2 flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl font-heading font-bold text-xs sm:text-sm tracking-wider uppercase border-2 border-white/40 hover:border-white hover:bg-white/10 text-white transition-all active:scale-[0.98] shadow-sm cursor-pointer"
          >
            <span>CONOCÉ EL ICAP</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
          <button
            onClick={onScrollToContact}
            className="w-full sm:w-1/2 flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl font-heading font-bold text-xs sm:text-sm tracking-wider uppercase bg-[#0077C8] hover:bg-[#005A96] text-white shadow-lg shadow-[#0077C8]/30 transition-all active:scale-[0.98] cursor-pointer"
          >
            <span>CONTACTANOS</span>
          </button>
        </div>

        {/* Scroll indicator */}
        <div
          className="mt-10 flex flex-col items-center gap-1.5 cursor-pointer animate-hero-rise"
          style={{ animationDelay: '430ms' }}
          onClick={() => window.scrollBy({ top: 380, behavior: 'smooth' })}
        >
          <span className="text-[10px] tracking-widest text-[#9FC6E8] uppercase font-bold font-mono-code">
            Descubrí más
          </span>
          <ChevronDown className="w-4 h-4 text-[#9FC6E8] animate-bounce" />
        </div>
      </div>
    </section>
  );
}
