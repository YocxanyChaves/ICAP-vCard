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
import icapEscudoCeleste from '../../assets/icap-escudo-celeste.png';
import icapEscudoWhite from '../../assets/icap-escudo-white.png';

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
 * Sello institucional del ICAP como marca de agua — la "base" sobre la
 * que se apoya cada ficha, como el timbre de un documento oficial.
 * Grande, ladeado como un sello real, muy tenue para no interferir con
 * la lectura del contenido que va encima.
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
 * Doblez de esquina (dog-ear) sutil arriba a la derecha — el detalle
 * que ayuda a leer cada ficha como una hoja de papel física, con su
 * propio reverso, en vez de una tarjeta plana.
 */
function PageCorner({ tone = 'light' }) {
  return (
    <div
      aria-hidden="true"
      className="absolute top-0 right-0 w-7 h-7 sm:w-9 sm:h-9 pointer-events-none"
      style={{
        background:
          tone === 'light'
            ? 'linear-gradient(135deg, transparent 50%, rgba(0,51,102,0.08) 50%)'
            : 'linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.12) 50%)'
      }}
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

// Grosor de la ficha (mitad de la distancia entre frente y reverso) y
// ángulo de inclinación estático que hace que TODA la composición se
// vea como una tablilla vista un poco desde arriba, apoyada sobre su
// base — en vez de una tarjeta plana de frente. Ver SlabBase.
const CARD_DEPTH = 9;
const TILT_DEG = 6;

/**
 * La "laja de piedra / tabla" sobre la que descansa cada ficha: una
 * plancha sólida, del tono del respectivo card, que vive DETRÁS y un
 * poco más abajo — no gira con el volteo (es la base, no la página),
 * así que ancla visualmente a la ficha como un objeto apoyado sobre
 * una superficie en vez de flotando. `translateZ` negativo la hunde
 * en el espacio 3D compartido con la ficha (mismo `perspective` del
 * padre) y el canto de abajo, inclinado con su propia bisagra,
 * dibuja el grosor real de la base.
 */
function SlabBase({ tone }) {
  const isDark = tone === 'dark';
  const faceGradient = isDark
    ? 'linear-gradient(160deg, #123255 0%, #071b30 55%, #020a15 100%)'
    : 'linear-gradient(160deg, #e4ebf2 0%, #c2d0de 55%, #9fb1c6 100%)';
  const edgeGradient = isDark ? 'linear-gradient(#04101f, #000000)' : 'linear-gradient(#8ea0b6, #62748a)';

  return (
    <div
      aria-hidden="true"
      className="absolute inset-x-1.5 top-2.5 bottom-[-16px] sm:bottom-[-20px] pointer-events-none"
      style={{ transformStyle: 'preserve-3d', transform: `translateZ(-${CARD_DEPTH * 2}px)` }}
    >
      {/* Cara de la base: lo que se asoma detrás/debajo de la ficha */}
      <div
        className="absolute inset-0 rounded-[26px] sm:rounded-[30px] shadow-[0_24px_38px_-16px_rgba(0,10,25,0.5)]"
        style={{ background: faceGradient }}
      />
      {/* Canto frontal de la base: el "grosor" de la laja, con bisagra
          en su propio borde inferior — por eso no hace falta saber el
          ancho real de la ficha para que quede bien. */}
      <div
        className="absolute left-0 right-0 bottom-0 rounded-b-[26px] sm:rounded-b-[30px]"
        style={{
          height: 18,
          background: edgeGradient,
          transformOrigin: '50% 100%',
          transform: 'rotateX(-58deg)'
        }}
      />
    </div>
  );
}

/**
 * Ficha volteable: el "flipper" interno gira en 3D (rotateY) sobre un
 * contenedor con `perspective`; frente y reverso son la MISMA celda de
 * grid (gridArea 1/1) para que ambas caras compartan alto sin tener
 * que calcularlo a mano — el alto real de la ficha es el de la cara
 * más alta de las dos. Cada cara tiene `backfaceVisibility: hidden`
 * para que sólo se vea la que está mirando hacia el usuario en cada
 * momento, como una hoja real, y un `translateZ` propio que las separa
 * un poco en el espacio (el grosor de la hoja).
 *
 * Todo vive dentro de un envoltorio con una inclinación ESTÁTICA
 * (`TILT_DEG`, nunca anima) — ese es el efecto "3D, como que está
 * sobre una laja de piedra": se ve la ficha un poco desde arriba, con
 * su base asomando detrás, en vez de una tarjeta mirando de frente.
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
    <div className="relative" style={{ perspective: '2000px' }}>
      <div className="relative" style={{ transformStyle: 'preserve-3d', transform: `rotateX(${TILT_DEG}deg)` }}>
        <SlabBase tone={tone} />
        <div
          className={`relative w-full grid ${hint ? 'animate-flip-hint' : ''}`}
          style={{
            transformStyle: 'preserve-3d',
            transition: 'transform 0.85s cubic-bezier(0.4, 0.12, 0.16, 1)',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          <div
            style={{
              gridArea: '1 / 1',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: `translateZ(${CARD_DEPTH}px)`
            }}
          >
            {front}
          </div>
          <div
            style={{
              gridArea: '1 / 1',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: `rotateY(180deg) translateZ(${CARD_DEPTH}px)`
            }}
          >
            {back}
          </div>
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
            unidas por un mismo eje central con el escudo del ICAP. */}
        <div className="grid sm:grid-cols-[1fr_auto_1fr] items-stretch">
          {/* Misión */}
          <FlipCard
            flipped={misionFlipped}
            hint={misionHint}
            tone="light"
            front={
              <article className="relative bg-white rounded-[28px] sm:rounded-r-none p-6 sm:p-9 shadow-[0_10px_34px_-14px_rgba(0,51,102,0.22)] border border-slate-100 overflow-hidden h-full">
                <PageCorner tone="light" />
                <span
                  aria-hidden="true"
                  className="absolute top-0 left-6 right-6 sm:right-auto sm:left-9 sm:w-16 h-[3px] rounded-full bg-gradient-to-r from-[#0077C8] to-[#4FB2F2]"
                />
                {/* Sello ICAP como base de la ficha, ladeado como un timbre */}
                <SealWatermark
                  src={icapEscudoCeleste}
                  className="w-56 sm:w-72 -right-12 -bottom-16 opacity-[0.07] rotate-[9deg]"
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
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3 sm:p-3.5 rounded-2xl bg-slate-50/90 text-xs sm:text-sm leading-relaxed text-slate-600"
                      >
                        <span className="w-5 h-5 sm:w-[22px] sm:h-[22px] rounded-full bg-[#0077C8] text-white text-[9px] sm:text-[10px] font-bold font-mono-code flex items-center justify-center shrink-0 mt-0.5">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

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
              <article className="relative bg-white rounded-[28px] sm:rounded-r-none p-6 sm:p-9 shadow-[0_10px_34px_-14px_rgba(0,51,102,0.22)] border border-slate-100 overflow-hidden h-full flex flex-col">
                <SealWatermark
                  src={icapEscudoCeleste}
                  className="w-52 sm:w-64 -left-12 -top-14 opacity-[0.06] -rotate-[11deg]"
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
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3 sm:p-3.5 rounded-2xl bg-slate-50/90 text-xs sm:text-sm leading-relaxed text-slate-600"
                      >
                        <span className="w-8 h-8 rounded-xl bg-[#EAF3FB] text-[#0077C8] flex items-center justify-center shrink-0">
                          <item.icon className="w-4 h-4" />
                        </span>
                        <span className="pt-1">{item.text}</span>
                      </div>
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
              <article className="relative bg-[#003366] text-white rounded-[28px] sm:rounded-l-none p-6 sm:p-9 shadow-[0_10px_34px_-14px_rgba(0,15,35,0.45)] border border-white/5 overflow-hidden h-full">
                <PageCorner tone="dark" />
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
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3 sm:p-3.5 rounded-2xl bg-white/[0.06] border border-white/5 text-xs sm:text-sm leading-relaxed text-[#C9D9E8]"
                      >
                        <span className="w-5 h-5 sm:w-[22px] sm:h-[22px] rounded-full bg-white/15 text-[#4FB2F2] text-[9px] sm:text-[10px] font-bold font-mono-code flex items-center justify-center shrink-0 mt-0.5 border border-white/10">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

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
              <article className="relative bg-[#003366] text-white rounded-[28px] sm:rounded-l-none p-6 sm:p-9 shadow-[0_10px_34px_-14px_rgba(0,15,35,0.45)] border border-white/5 overflow-hidden h-full flex flex-col">
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
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3 sm:p-3.5 rounded-2xl bg-white/[0.06] border border-white/5 text-xs sm:text-sm leading-relaxed text-[#C9D9E8]"
                      >
                        <span className="w-8 h-8 rounded-xl bg-white/10 text-[#4FB2F2] flex items-center justify-center shrink-0 border border-white/10">
                          <item.icon className="w-4 h-4" />
                        </span>
                        <span className="pt-1">{item.text}</span>
                      </div>
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
