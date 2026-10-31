import { ChevronDown, Handshake, GraduationCap } from 'lucide-react';
import icapLogoMark from '../assets/icap-logo-mark.png';
import SectionsStrip from '../components/SectionsStrip';
import { useLanguage } from '../i18n/LanguageContext';

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

/**
 * Pastilla del departamento activo, arriba del logo. Más grande y
 * luminosa que el resto de badges para que se note dónde está uno.
 */
function DeptBadge({ dept, label }) {
  const isAT = dept !== 'docencia';
  const Icon = isAT ? Handshake : GraduationCap;
  return (
    <div
      className="relative inline-flex items-center gap-2 sm:gap-2.5 pl-1 pr-4 sm:pr-5 py-1 rounded-full bg-[#002a52]/70 border border-[#7dd3fc]/50 text-white text-[13px] sm:text-base font-heading font-extrabold tracking-wide shadow-[0_0_22px_-8px_rgba(125,211,252,0.7)] mb-[var(--hero-gap)] animate-hero-rise"
      style={{ animationDelay: '90ms' }}
    >
      <span className="relative shrink-0 w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center">
        {!isAT && (
          // Docencia: aro que late alrededor del ícono.
          <span aria-hidden="true" className="absolute inset-0 rounded-full bg-[#7dd3fc]/60 animate-ping" />
        )}
        <span
          className={`relative w-full h-full rounded-full flex items-center justify-center ${
            isAT
              ? // AT: ícono de neón — trazo celeste encendido sobre navy,
                // con un resplandor que se enciende y baja (.hero-neon).
                'bg-[#001F3D] border-2 border-[#7dd3fc] text-[#bfe6ff] hero-neon'
              : 'bg-gradient-to-br from-white to-[#D6E9F7] text-[#0077C8] shadow-md'
          }`}
        >
          <Icon className={`w-3.5 h-3.5 sm:w-[18px] sm:h-[18px] ${isAT ? 'hero-neon-icon' : ''}`} strokeWidth={2.2} />
        </span>
      </span>

      <span className="relative">{label}</span>
    </div>
  );
}

export default function Hero({ onNavigate, pages, dept = 'at' }) {
  const { t } = useLanguage();
  return (
    <section className="hero-screen relative min-h-[max(var(--main-h,100dvh),540px)] bg-gradient-to-br from-[#003366] via-[#0B5A96] to-[#0077C8] text-white px-4 sm:px-6 pt-4 sm:pt-6 pb-5 sm:pb-7 flex flex-col items-center text-center overflow-hidden">
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

        {/* Onda inferior: misma dirección, velocidad y compás que la de arriba,
            para que las dos avancen juntas. */}
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

      {/* Accesos rápidos embebidos en el Hero, para que compartan su fondo. Van
          fuera de la columna angosta del texto para tener más ancho. */}
      <div className="relative z-10 w-full max-w-3xl sm:max-w-4xl mx-auto animate-hero-rise" style={{ animationDelay: '0ms' }}>
        <SectionsStrip onNavigate={onNavigate} pages={pages} />
      </div>

      {/* Bloque central: ocupa todo el alto que sobra y se centra; el
          espaciado entre elementos crece con la pantalla (--hero-gap). */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full py-[var(--hero-gap)]">
        {/* Departamento donde está ubicado el usuario: arriba y con
            protagonismo. AT lleva el ícono brillando y la rayita de luz de
            los títulos (kicker-light-sweep); Docencia, el punto pulsante y
            el ícono con un aro que late. */}
        <DeptBadge key={dept} dept={dept} label={t.hero.dept[dept]} />

        {/* Emblem: isotipo real del ICAP con halo pulsante y un anillo punteado que gira lentamente */}
        <div className="relative w-20 h-20 sm:w-28 sm:h-28 mb-[var(--hero-gap)] shrink-0 animate-hero-rise" style={{ animationDelay: '170ms' }}>
          <div className="absolute inset-0 rounded-full bg-white/25 blur-md animate-pulse-slow" aria-hidden="true" />
          <div
            className="absolute -inset-2.5 sm:-inset-3.5 rounded-full border border-dashed border-white/30 pointer-events-none"
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
          className="font-heading font-extrabold text-5xl sm:text-8xl tracking-tight text-white mb-3 sm:mb-4 drop-shadow-sm animate-hero-rise"
          style={{ animationDelay: '240ms' }}
        >
          {t.hero.title}
        </h1>
        <h2
          className="font-semibold text-lg sm:text-3xl text-[#EAF3FB] max-w-xl leading-snug mb-4 sm:mb-5 animate-hero-rise"
          style={{ animationDelay: '310ms' }}
        >
          {t.hero.subtitle}
        </h2>

        {/* Badge institucional, ahora debajo del subtítulo */}
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-[#9FC6E8] text-[11px] sm:text-xs font-semibold tracking-widest uppercase shadow-sm animate-hero-rise"
          style={{ animationDelay: '380ms' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#7dd3fc]" />
          {t.hero.badge}
        </div>
      </div>

      {/* Scroll indicator, pegado abajo del Hero: el scroll es del <main>
          de Brochure.jsx (no de la ventana) y baja justo una pantalla. */}
        <div
          className="relative z-10 flex flex-col items-center gap-1.5 cursor-pointer animate-hero-rise"
          style={{ animationDelay: '450ms' }}
          onClick={(e) => {
            const main = e.currentTarget.closest('main');
            main?.scrollBy({ top: main.clientHeight, behavior: 'smooth' });
          }}
        >
          <span className="text-[10px] tracking-widest text-[#9FC6E8] uppercase font-bold font-mono-code">
            {t.hero.scrollHint}
          </span>
          <ChevronDown className="w-4 h-4 text-[#9FC6E8] animate-bounce" />
        </div>
    </section>
  );
}
