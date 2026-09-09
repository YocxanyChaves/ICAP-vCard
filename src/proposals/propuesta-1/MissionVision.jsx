import React, { useEffect, useRef, useState } from 'react';
import {
  Compass,
  Eye,
  RotateCw,
  RotateCcw,
  GraduationCap,
  Users,
  BookOpen,
  Globe2,
  Target,
  Handshake,
  Leaf,
  Sparkles
} from 'lucide-react';
import icapEscudoNavy from '../../assets/icap-escudo-navy.png';
import icapEscudoWhite from '../../assets/icap-escudo-white.png';
import icapEscudoCeleste from '../../assets/icap-escudo-celeste.png';

const MISION_PILARES = [
  'Desarrollo y formación de competencias directivas en el servicio público.',
  'Modernización e innovación constante en la gestión gubernamental de Centroamérica.',
  'Apoyo activo a la integración y cohesión regional de los países del SICA.'
];

const VISION_PILARES = [
  'Referente regional e internacional en diseño e implementación de políticas públicas.',
  'Generación de conocimiento aplicado para el fortalecimiento de la gerencia pública.',
  'Impulso al desarrollo sostenible desde lo local, nacional y regional.'
];

// Contenido del "reverso" de cada ficha — no repite lo de adelante:
// mientras el frente dice QUÉ persigue el ICAP, el reverso cuenta CÓMO
// lo lleva a la práctica. Ejemplo/redacción propia a partir de las
// líneas de trabajo ya descritas en el resto del sitio (Áreas de
// Especialización, Presencia Regional) — a confirmar con ICAP.
const MISION_REVERSO = [
  { icon: GraduationCap, text: 'Capacitación ejecutiva y formación continua para el servidor público.' },
  { icon: Users, text: 'Asesoría técnica especializada a gobiernos e instituciones.' },
  { icon: BookOpen, text: 'Investigación aplicada a la gestión pública regional.' },
  { icon: Globe2, text: 'Cooperación técnica regional e internacional.' }
];

const VISION_REVERSO = [
  { icon: Target, text: 'Liderazgo regional en el diseño de políticas públicas innovadoras.' },
  { icon: Handshake, text: 'Alianzas estratégicas dentro del Sistema de la Integración Centroamericana (SICA).' },
  { icon: Leaf, text: 'Contribución activa a los Objetivos de Desarrollo Sostenible (ODS).' },
  { icon: Sparkles, text: 'Generación de conocimiento aplicado, referente para la región.' }
];

/**
 * Sello institucional del ICAP como marca de agua, muy tenue, apenas
 * insinuada — en navy sobre el card claro (antes usaba el celeste, muy
 * parecido al blanco de fondo, y casi no se notaba) y en blanco sobre
 * el card oscuro.
 */
function SealWatermark({ src, className = '' }) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={`pointer-events-none select-none absolute ${className}`}
    />
  );
}

/**
 * Botón "voltear" compartido por las 4 caras (frente/reverso de Misión
 * y Visión) — mismo gesto visual (ícono que gira 180° al pasar el
 * mouse) para que se sienta como una sola interacción consistente.
 */
function FlipButton({ onClick, icon: Icon, label, tone = 'light' }) {
  const toneClasses =
    tone === 'light'
      ? 'text-[#0077C8] hover:text-[#005A96]'
      : 'text-[#9FC6E8] hover:text-white';
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 text-[11px] sm:text-xs font-heading font-bold uppercase tracking-wider transition-colors group cursor-pointer ${toneClasses}`}
    >
      <Icon className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
      {label}
    </button>
  );
}

/** Fila numerada (frente). */
function NumberTile({ tone, index, children }) {
  const isDark = tone === 'dark';
  return (
    <div
      className={
        isDark
          ? 'flex items-start gap-3 p-3 sm:p-3.5 rounded-2xl bg-white/[0.06] border border-white/5 text-xs sm:text-sm leading-relaxed text-[#C9D9E8]'
          : 'flex items-start gap-3 p-3 sm:p-3.5 rounded-2xl bg-slate-50/90 text-xs sm:text-sm leading-relaxed text-slate-600'
      }
    >
      <span
        className={
          isDark
            ? 'w-5 h-5 sm:w-[22px] sm:h-[22px] rounded-full bg-white/15 text-[#4FB2F2] text-[9px] sm:text-[10px] font-bold font-mono-code flex items-center justify-center shrink-0 mt-0.5 border border-white/10'
            : 'w-5 h-5 sm:w-[22px] sm:h-[22px] rounded-full bg-[#0077C8] text-white text-[9px] sm:text-[10px] font-bold font-mono-code flex items-center justify-center shrink-0 mt-0.5'
        }
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <span>{children}</span>
    </div>
  );
}

/** Fila con ícono (reverso). */
function IconTile({ tone, icon: Icon, children }) {
  const isDark = tone === 'dark';
  return (
    <div
      className={
        isDark
          ? 'flex items-start gap-3 p-3 sm:p-3.5 rounded-2xl bg-white/[0.06] border border-white/5 text-xs sm:text-sm leading-relaxed text-[#C9D9E8]'
          : 'flex items-start gap-3 p-3 sm:p-3.5 rounded-2xl bg-slate-50/90 text-xs sm:text-sm leading-relaxed text-slate-600'
      }
    >
      <span
        className={
          isDark
            ? 'w-8 h-8 rounded-xl bg-white/10 text-[#4FB2F2] flex items-center justify-center shrink-0 border border-white/10'
            : 'w-8 h-8 rounded-xl bg-[#EAF3FB] text-[#0077C8] flex items-center justify-center shrink-0'
        }
      >
        <Icon className="w-4 h-4" />
      </span>
      <span className="pt-1">{children}</span>
    </div>
  );
}

/**
 * Ficha volteable: el "flipper" gira en 3D (rotateY) sobre un
 * contenedor con `perspective`; frente y reverso son la MISMA celda de
 * grid (gridArea 1/1) para que ambas caras compartan alto sin tener
 * que calcularlo a mano. Cada cara tiene `backfaceVisibility: hidden`
 * para que sólo se vea la que está mirando hacia el usuario en cada
 * momento, como una hoja real.
 *
 * `h-full` en cada nivel (este wrapper, el flipper, y el `h-full` que
 * ya traen los <article> de frente/reverso) es lo que hace que las
 * DOS fichas (Misión/Visión) terminen del mismo alto: el grid del
 * díptico (`items-stretch`, más abajo) ya estira ambas columnas a la
 * altura de la más alta de las dos — este `h-full` es lo que deja que
 * esa altura le llegue de verdad hasta la tarjeta visible, en vez de
 * quedarse a medio camino en un div sin alto propio.
 *
 * `hint`: un vistazo breve (gira un poco y regresa, sin llegar a
 * voltearse) al entrar a la sección, para insinuar que la ficha es
 * interactiva. Es una animación de CSS (.animate-flip-hint) sobre el
 * mismo `transform` que controla el volteo real — mientras está
 * activa manda por encima del `transform` inline de abajo (así no
 * hace falta tocar `flipped`), y como termina en rotateY(0deg) — el
 * mismo valor en reposo — no se nota el relevo cuando se apaga.
 */
function FlipCard({ flipped, hint, tone = 'light', front, back }) {
  return (
    <div className="relative h-full" style={{ perspective: '1800px' }}>
      <div
        className={`relative w-full h-full grid ${hint ? 'animate-flip-hint' : ''}`}
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.85s cubic-bezier(0.4, 0.12, 0.16, 1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        <div style={{ gridArea: '1 / 1', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
          {front}
        </div>
        <div
          style={{
            gridArea: '1 / 1',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          {back}
        </div>
      </div>
    </div>
  );
}

export default function MissionVision() {
  const [misionFlipped, setMisionFlipped] = useState(false);
  const [visionFlipped, setVisionFlipped] = useState(false);
  const [misionHint, setMisionHint] = useState(false);
  const [visionHint, setVisionHint] = useState(false);
  // Espejo en ref del volteo real de cada ficha: el observer de abajo
  // sólo corre UNA vez al montar, así que sus timeouts no pueden leer
  // el `useState` (quedaría con el valor viejo de ese primer render).
  // Se consulta justo antes de lanzar cada asomo, por si el usuario ya
  // volteó la ficha a mano antes de que le tocara el turno.
  const misionFlippedRef = useRef(false);
  const visionFlippedRef = useRef(false);
  const sectionRef = useRef(null);

  const toggleMision = (value) => {
    misionFlippedRef.current = value;
    setMisionFlipped(value);
  };
  const toggleVision = (value) => {
    visionFlippedRef.current = value;
    setVisionFlipped(value);
  };

  // Al entrar la sección a la vista: un asomo breve en las DOS fichas
  // a la vez — mismo patrón de IntersectionObserver "vía
  // ownerDocument" que StatsSection/RegionalMap, para que funcione
  // igual dentro del iframe de "Vista Móvil".
  useEffect(() => {
    const el = sectionRef.current;
    const doc = el?.ownerDocument;
    if (!doc) return undefined;
    const view = doc.defaultView;
    const IO = view?.IntersectionObserver;
    if (!IO) return undefined;

    const timeouts = [];
    const HINT_MS = 1200;

    const observer = new IO(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          timeouts.push(
            setTimeout(() => {
              if (!misionFlippedRef.current) {
                setMisionHint(true);
                timeouts.push(setTimeout(() => setMisionHint(false), HINT_MS));
              }
              if (!visionFlippedRef.current) {
                setVisionHint(true);
                timeouts.push(setTimeout(() => setVisionHint(false), HINT_MS));
              }
            }, 650)
          );
          observer.disconnect();
        });
      },
      { threshold: 0.35 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <section ref={sectionRef} className="px-4 sm:px-6 py-10 sm:py-20 bg-slate-50 relative overflow-hidden">
      {/* Resplandores ambientales de fondo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#0077C8]/[0.06] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-16 w-80 h-80 rounded-full bg-[#003366]/[0.05] blur-3xl"
      />

      <div className="max-w-5xl mx-auto relative">
        {/* Section Title */}
        <div className="mb-8 sm:mb-12 text-center">
          <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-[#0077C8] block mb-1.5 font-mono-code">
            Quiénes somos
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#003366] tracking-tight">
            Misión y Visión
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
            Los dos pilares que orientan cada proyecto, alianza y programa del ICAP en la región centroamericana. Tocá cada ficha para ver cómo se llevan a la práctica.
          </p>
        </div>

        {/* Díptico Misión / Visión — apiladas en móvil, a la par desde tablet/escritorio,
            unidas por un mismo eje central con el escudo del ICAP. `items-stretch`
            es lo que hace que ambas columnas midan el alto de la más alta de las dos. */}
        <div className="grid sm:grid-cols-[1fr_auto_1fr] items-stretch">
          {/* Misión */}
          <FlipCard
            flipped={misionFlipped}
            hint={misionHint}
            tone="light"
            front={
              <article className="relative bg-white rounded-[28px] sm:rounded-r-none p-6 sm:p-9 border border-slate-100 overflow-hidden h-full flex flex-col mv-card-light">
                <span
                  aria-hidden="true"
                  className="absolute top-0 left-6 right-6 sm:right-auto sm:left-9 sm:w-16 h-[3px] rounded-full bg-gradient-to-r from-[#0077C8] to-[#4FB2F2]"
                />
                <SealWatermark
                  src={icapEscudoNavy}
                  className="w-56 sm:w-72 -right-12 -bottom-16 opacity-[0.08] rotate-[9deg]"
                />

                <div className="relative flex flex-col h-full">
                  <div className="flex items-center gap-3.5 mb-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#EAF3FB] flex items-center justify-center text-[#0077C8] shrink-0">
                      <Compass className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono-code uppercase font-bold text-[#0077C8] tracking-wider block">
                        Propósito &middot; 01
                      </span>
                      <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#003366] leading-tight">
                        Misión
                      </h3>
                    </div>
                  </div>

                  <blockquote className="border-l-[3px] border-[#0077C8]/30 pl-4 sm:pl-5 mb-7">
                    <p className="font-heading text-base sm:text-xl font-semibold text-[#003366] leading-snug">
                      Fortalecer las competencias y capacidades de los Estados y las instituciones por medio de su recurso humano, la modernización de las entidades públicas y el apoyo a la integración centroamericana.
                    </p>
                  </blockquote>

                  <div className="space-y-2 sm:space-y-2.5">
                    {MISION_PILARES.map((item, i) => (
                      <NumberTile key={i} tone="light" index={i}>
                        {item}
                      </NumberTile>
                    ))}
                  </div>

                  {/* Empuja el botón hasta abajo cuando esta ficha queda
                      más baja que su pareja (Visión) y el grid la estira. */}
                  <div className="flex-1" />

                  <div className="mt-6 pt-1">
                    <FlipButton
                      onClick={() => toggleMision(true)}
                      icon={RotateCw}
                      label="Cómo lo cumplimos"
                      tone="light"
                    />
                  </div>
                </div>
              </article>
            }
            back={
              <article className="relative bg-white rounded-[28px] sm:rounded-r-none p-6 sm:p-9 border border-slate-100 overflow-hidden h-full flex flex-col mv-card-light">
                <SealWatermark
                  src={icapEscudoNavy}
                  className="w-52 sm:w-64 -left-12 -top-14 opacity-[0.07] -rotate-[11deg]"
                />

                <div className="relative flex flex-col h-full">
                  <span className="text-[10px] font-mono-code uppercase font-bold text-[#0077C8] tracking-wider block mb-1.5">
                    Cómo lo cumplimos
                  </span>
                  <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#003366] leading-tight mb-6">
                    En la práctica
                  </h3>

                  <div className="space-y-2 sm:space-y-2.5 flex-1">
                    {MISION_REVERSO.map((item, i) => (
                      <IconTile key={i} tone="light" icon={item.icon}>
                        {item.text}
                      </IconTile>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono-code">ICAP &middot; Fundado en 1954</span>
                    <FlipButton
                      onClick={() => toggleMision(false)}
                      icon={RotateCcw}
                      label="Volver"
                      tone="light"
                    />
                  </div>
                </div>
              </article>
            }
          />

          {/* Eje central: línea + escudo, horizontal en móvil, vertical desde sm */}
          <div className="flex sm:flex-col items-center justify-center gap-3 py-1.5 sm:py-0 sm:px-1">
            <span className="h-px sm:h-auto sm:w-px flex-1 bg-gradient-to-r sm:bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center shrink-0 z-10">
              <img src={icapEscudoCeleste} alt="" aria-hidden="true" className="w-7 h-7 sm:w-8 sm:h-8 opacity-90" />
            </div>
            <span className="h-px sm:h-auto sm:w-px flex-1 bg-gradient-to-r sm:bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
          </div>

          {/* Visión */}
          <FlipCard
            flipped={visionFlipped}
            hint={visionHint}
            tone="dark"
            front={
              <article className="relative bg-[#003366] text-white rounded-[28px] sm:rounded-l-none p-6 sm:p-9 border border-white/5 overflow-hidden h-full flex flex-col mv-card-dark">
                <span
                  aria-hidden="true"
                  className="absolute top-0 left-6 right-6 sm:left-auto sm:right-9 sm:w-16 h-[3px] rounded-full bg-gradient-to-r from-[#4FB2F2] to-[#0077C8]"
                />
                <SealWatermark
                  src={icapEscudoWhite}
                  className="w-56 sm:w-72 -left-12 -bottom-16 opacity-[0.08] -rotate-[9deg]"
                />

                <div className="relative flex flex-col h-full">
                  <div className="flex items-center gap-3.5 mb-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 flex items-center justify-center text-[#4FB2F2] shrink-0">
                      <Eye className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono-code uppercase font-bold text-[#4FB2F2] tracking-wider block">
                        Horizonte &middot; 02
                      </span>
                      <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-white leading-tight">
                        Visión
                      </h3>
                    </div>
                  </div>

                  <blockquote className="border-l-[3px] border-white/20 pl-4 sm:pl-5 mb-7">
                    <p className="font-heading text-base sm:text-xl font-semibold text-[#EAF3FB] leading-snug">
                      Ser la institución del Sistema de la Integración Centroamericana especializada en la gestión pública, que genera conocimiento para las organizaciones y fortalece la gerencia de las políticas públicas a nivel local, nacional y regional, para avanzar hacia el desarrollo sostenible.
                    </p>
                  </blockquote>

                  <div className="space-y-2 sm:space-y-2.5">
                    {VISION_PILARES.map((item, i) => (
                      <NumberTile key={i} tone="dark" index={i}>
                        {item}
                      </NumberTile>
                    ))}
                  </div>

                  <div className="flex-1" />

                  <div className="mt-6 pt-1">
                    <FlipButton
                      onClick={() => toggleVision(true)}
                      icon={RotateCw}
                      label="Compromisos estratégicos"
                      tone="dark"
                    />
                  </div>
                </div>
              </article>
            }
            back={
              <article className="relative bg-[#003366] text-white rounded-[28px] sm:rounded-l-none p-6 sm:p-9 border border-white/5 overflow-hidden h-full flex flex-col mv-card-dark">
                <SealWatermark
                  src={icapEscudoWhite}
                  className="w-52 sm:w-64 -right-12 -top-14 opacity-[0.07] rotate-[11deg]"
                />

                <div className="relative flex flex-col h-full">
                  <span className="text-[10px] font-mono-code uppercase font-bold text-[#4FB2F2] tracking-wider block mb-1.5">
                    Compromisos estratégicos
                  </span>
                  <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-white leading-tight mb-6">
                    Hacia dónde vamos
                  </h3>

                  <div className="space-y-2 sm:space-y-2.5 flex-1">
                    {VISION_REVERSO.map((item, i) => (
                      <IconTile key={i} tone="dark" icon={item.icon}>
                        {item.text}
                      </IconTile>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] text-[#6E8AA8] font-mono-code">ICAP &middot; SICA</span>
                    <FlipButton
                      onClick={() => toggleVision(false)}
                      icon={RotateCcw}
                      label="Volver"
                      tone="dark"
                    />
                  </div>
                </div>
              </article>
            }
          />
        </div>
      </div>
    </section>
  );
}
