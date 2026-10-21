import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
import { useLanguage } from '../../i18n/LanguageContext';
import KickerBadge from './KickerBadge';
import EscudoICAP from '../../components/EscudoICAP';

// El texto de cada pilar/reverso vive en el diccionario de traducciones
// (t.missionVision.mission.pilares / .reverso, mismo para vision) — acá
// sólo quedan los íconos del reverso, en el mismo orden que su texto
// traducido, porque el ícono no cambia según el idioma.
const MISION_REVERSO_ICONS = [GraduationCap, Users, BookOpen, Globe2];
const VISION_REVERSO_ICONS = [Target, Handshake, Leaf, Sparkles];

/**
 * Sello institucional del ICAP como marca de agua, muy tenue, apenas
 * insinuada — en navy sobre el card claro (antes usaba el celeste, muy
 * parecido al blanco de fondo, y casi no se notaba) y en blanco sobre
 * el card oscuro.
 */
function SealWatermark({ tono, className = '' }) {
  return <EscudoICAP tono={tono} plano className={`pointer-events-none absolute ${className}`} />;
}

/**
 * Botón "voltear" compartido por las 4 caras (frente/reverso de Misión
 * y Visión) — mismo gesto visual (ícono que gira 180° al pasar el
 * mouse) para que se sienta como una sola interacción consistente.
 */
function FlipButton({ onClick, icon: Icon, label, tone = 'light' }) {
  const toneClasses =
    tone === 'light'
      ? 'text-[#0077C8] hover:text-[#005A96] dark:text-[#9FC6E8] dark:hover:text-white'
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
function NumberTile({ tone, index, eq, children }) {
  const isDark = tone === 'dark';
  return (
    <div
      data-eq={eq}
      className={
        isDark
          ? 'flex items-start gap-3 p-3 sm:p-3.5 rounded-2xl bg-white/[0.06] border border-white/5 text-xs sm:text-sm leading-relaxed text-[#C9D9E8]'
          : 'flex items-start gap-3 p-3 sm:p-3.5 rounded-2xl bg-[#0077C8]/[0.04] dark:bg-white/[0.06] dark:border dark:border-white/5 text-xs sm:text-sm leading-relaxed text-slate-900 dark:text-[#C9D9E8]'
      }
    >
      <span
        className={
          isDark
            ? 'w-5 h-5 sm:w-[22px] sm:h-[22px] rounded-full bg-white/15 text-[#4FB2F2] text-[9px] sm:text-[10px] font-bold font-mono-code flex items-center justify-center shrink-0 mt-0.5 border border-white/10'
            : 'w-5 h-5 sm:w-[22px] sm:h-[22px] rounded-full bg-[#0077C8] dark:bg-white/15 text-white dark:text-[#4FB2F2] text-[9px] sm:text-[10px] font-bold font-mono-code flex items-center justify-center shrink-0 mt-0.5 dark:border dark:border-white/10'
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
          : 'flex items-start gap-3 p-3 sm:p-3.5 rounded-2xl bg-[#0077C8]/[0.04] dark:bg-white/[0.06] dark:border dark:border-white/5 text-xs sm:text-sm leading-relaxed text-slate-900 dark:text-[#C9D9E8]'
      }
    >
      <span
        className={
          isDark
            ? 'w-8 h-8 rounded-xl bg-white/10 text-[#4FB2F2] flex items-center justify-center shrink-0 border border-white/10'
            : 'w-8 h-8 rounded-xl bg-[#EAF3FB] dark:bg-white/10 text-[#0077C8] dark:text-[#4FB2F2] flex items-center justify-center shrink-0 dark:border dark:border-white/10'
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
  const { t, lang } = useLanguage();
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

  // Las 3 filas numeradas de Misión y Visión quedan al MISMO nivel (a
  // pedido de Yocxany): cuando las fichas están lado a lado (sm+), cada
  // par de piezas con el mismo `data-eq` (la frase y cada fila) toma el
  // alto de la más alta de las dos. Así la lista arranca a la misma
  // altura en ambas y cada fila queda alineada con su pareja aunque los
  // textos sean de largo distinto. En móvil (apiladas) no se toca nada.
  useLayoutEffect(() => {
    const el = sectionRef.current;
    const view = el?.ownerDocument?.defaultView;
    if (!el || !view) return undefined;
    const equalize = () => {
      const nodes = Array.from(el.querySelectorAll('[data-eq]'));
      nodes.forEach((node) => {
        node.style.minHeight = '';
      });
      if (!view.matchMedia('(min-width: 640px)').matches) return;
      const groups = {};
      nodes.forEach((node) => {
        (groups[node.dataset.eq] ||= []).push(node);
      });
      Object.values(groups).forEach((group) => {
        const max = Math.max(...group.map((node) => node.getBoundingClientRect().height));
        group.forEach((node) => {
          node.style.minHeight = `${max}px`;
        });
      });
    };
    equalize();
    view.addEventListener('resize', equalize);
    el.ownerDocument.fonts?.ready.then(equalize);
    return () => view.removeEventListener('resize', equalize);
  }, [lang]);

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
    <section ref={sectionRef} className="px-4 sm:px-6 pt-[var(--docencia-gap)] pb-10 sm:pb-20 bg-[#D6E9F7] dark:bg-[#001F3D] relative overflow-hidden">
      {/* Resplandores ambientales de fondo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#0077C8]/[0.06] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-16 w-80 h-80 rounded-full bg-[#003366]/[0.05] dark:bg-[#0077C8]/[0.08] blur-3xl"
      />

      <div className="max-w-5xl mx-auto relative">
        {/* Section Title — kicker en variant="glow" (halo + barrita de
            luz celeste en vez del puntito) porque esta es una sección
            de Asistencia Técnica: mismo "marco" que el kicker de
            Docencia, pero con su propio distintivo — ver KickerBadge.jsx. */}
        <div className="mb-8 sm:mb-12 text-center">
          <div className="mb-1.5 sm:mb-2">
            <KickerBadge variant="glow">{t.missionVision.kicker}</KickerBadge>
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#003366] dark:text-[#9FC6E8] tracking-tight">
            {t.missionVision.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
            {t.missionVision.subtitle}
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
              <article className="relative bg-white dark:bg-[#003366] rounded-[28px] sm:rounded-r-none p-6 sm:p-9 border border-slate-100 dark:border-white/10 overflow-hidden h-full flex flex-col mv-card-light">
                <span
                  aria-hidden="true"
                  className="absolute top-0 left-6 right-6 sm:right-auto sm:left-9 sm:w-16 h-[3px] rounded-full bg-gradient-to-r from-[#0077C8] to-[#4FB2F2]"
                />
                <SealWatermark
                  tono="navy"
                  className="w-56 sm:w-72 -right-12 -bottom-16 opacity-[0.08] dark:opacity-[0.05] rotate-[9deg] dark:hidden"
                />
                <SealWatermark
                  tono="white"
                  className="w-56 sm:w-72 -right-12 -bottom-16 opacity-0 dark:opacity-[0.06] rotate-[9deg] hidden dark:block"
                />

                <div className="relative flex flex-col h-full">
                  <div className="flex items-center gap-3.5 mb-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#EAF3FB] dark:bg-white/10 flex items-center justify-center text-[#0077C8] dark:text-[#4FB2F2] shrink-0">
                      <Compass className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono-code uppercase font-bold text-[#0077C8] dark:text-[#4FB2F2] tracking-wider block">
                        {t.missionVision.mission.badge}
                      </span>
                      <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#003366] dark:text-[#9FC6E8] leading-tight">
                        {t.missionVision.mission.heading}
                      </h3>
                    </div>
                  </div>

                  <blockquote data-eq="quote" className="border-l-[3px] border-[#0077C8]/30 dark:border-white/20 pl-4 sm:pl-5 mb-7">
                    <p className="font-heading text-base sm:text-xl font-semibold text-[#003366] dark:text-[#EAF3FB] leading-snug">
                      {t.missionVision.mission.quote}
                    </p>
                  </blockquote>

                  <div className="space-y-2 sm:space-y-2.5">
                    {t.missionVision.mission.pilares.map((item, i) => (
                      <NumberTile key={i} tone="light" index={i} eq={`pilar-${i}`}>
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
                      label={t.missionVision.mission.flipLabel}
                      tone="light"
                    />
                  </div>
                </div>
              </article>
            }
            back={
              <article className="relative bg-white dark:bg-[#003366] rounded-[28px] sm:rounded-r-none p-6 sm:p-9 border border-slate-100 dark:border-white/10 overflow-hidden h-full flex flex-col mv-card-light">
                <SealWatermark
                  tono="navy"
                  className="w-52 sm:w-64 -right-12 -top-14 opacity-[0.07] dark:opacity-0 rotate-[11deg]"
                />
                <SealWatermark
                  tono="white"
                  className="w-52 sm:w-64 -right-12 -top-14 opacity-0 dark:opacity-[0.05] rotate-[11deg]"
                />

                <div className="relative flex flex-col h-full">
                  <span className="text-[10px] font-mono-code uppercase font-bold text-[#0077C8] dark:text-[#4FB2F2] tracking-wider block mb-1.5">
                    {t.missionVision.mission.backBadge}
                  </span>
                  <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#003366] dark:text-[#9FC6E8] leading-tight mb-6">
                    {t.missionVision.mission.backHeading}
                  </h3>

                  <div className="space-y-2 sm:space-y-2.5 flex-1">
                    {MISION_REVERSO_ICONS.map((Icon, i) => (
                      <IconTile key={i} tone="light" icon={Icon}>
                        {t.missionVision.mission.reverso[i]}
                      </IconTile>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 dark:text-slate-300 font-mono-code">{t.missionVision.mission.footerNote}</span>
                    <FlipButton
                      onClick={() => toggleMision(false)}
                      icon={RotateCcw}
                      label={t.missionVision.mission.backLabel}
                      tone="light"
                    />
                  </div>
                </div>
              </article>
            }
          />

          {/* Eje central: línea + escudo, horizontal en móvil, vertical desde sm */}
          <div className="flex sm:flex-col items-center justify-center gap-3 py-1.5 sm:py-0 sm:px-1">
            <span className="h-px sm:h-auto sm:w-px flex-1 bg-gradient-to-r sm:bg-gradient-to-b from-transparent via-slate-300 dark:via-white/20 to-transparent" />
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-[#0B2340] border border-slate-200 dark:border-white/15 shadow-md flex items-center justify-center shrink-0 z-10">
              <EscudoICAP tono="celeste" plano className="w-7 h-7 sm:w-8 sm:h-8 opacity-90" />
            </div>
            <span className="h-px sm:h-auto sm:w-px flex-1 bg-gradient-to-r sm:bg-gradient-to-b from-transparent via-slate-300 dark:via-white/20 to-transparent" />
          </div>

          {/* Visión */}
          <FlipCard
            flipped={visionFlipped}
            hint={visionHint}
            tone="light"
            front={
              <article className="relative bg-white dark:bg-[#003366] rounded-[28px] sm:rounded-l-none p-6 sm:p-9 border border-slate-100 dark:border-white/10 overflow-hidden h-full flex flex-col mv-card-light">
                <span
                  aria-hidden="true"
                  className="absolute top-0 left-6 right-6 sm:left-auto sm:right-9 sm:w-16 h-[3px] rounded-full bg-gradient-to-r from-[#4FB2F2] to-[#0077C8]"
                />
                <SealWatermark
                  tono="navy"
                  className="w-56 sm:w-72 -right-12 -bottom-16 opacity-[0.08] dark:opacity-0 rotate-[9deg]"
                />
                <SealWatermark
                  tono="white"
                  className="w-56 sm:w-72 -right-12 -bottom-16 opacity-0 dark:opacity-[0.08] rotate-[9deg]"
                />

                <div className="relative flex flex-col h-full">
                  <div className="flex items-center gap-3.5 mb-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#EAF3FB] dark:bg-white/10 flex items-center justify-center text-[#0077C8] dark:text-[#4FB2F2] shrink-0">
                      <Eye className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono-code uppercase font-bold text-[#0077C8] dark:text-[#4FB2F2] tracking-wider block">
                        {t.missionVision.vision.badge}
                      </span>
                      <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#003366] dark:text-[#9FC6E8] leading-tight">
                        {t.missionVision.vision.heading}
                      </h3>
                    </div>
                  </div>

                  <blockquote data-eq="quote" className="border-l-[3px] border-[#0077C8]/30 dark:border-white/20 pl-4 sm:pl-5 mb-7">
                    <p className="font-heading text-base sm:text-xl font-semibold text-[#003366] dark:text-[#EAF3FB] leading-snug">
                      {t.missionVision.vision.quote}
                    </p>
                  </blockquote>

                  <div className="space-y-2 sm:space-y-2.5">
                    {t.missionVision.vision.pilares.map((item, i) => (
                      <NumberTile key={i} tone="light" index={i} eq={`pilar-${i}`}>
                        {item}
                      </NumberTile>
                    ))}
                  </div>

                  <div className="flex-1" />

                  <div className="mt-6 pt-1">
                    <FlipButton
                      onClick={() => toggleVision(true)}
                      icon={RotateCw}
                      label={t.missionVision.vision.flipLabel}
                      tone="light"
                    />
                  </div>
                </div>
              </article>
            }
            back={
              <article className="relative bg-white dark:bg-[#003366] rounded-[28px] sm:rounded-l-none p-6 sm:p-9 border border-slate-100 dark:border-white/10 overflow-hidden h-full flex flex-col mv-card-light">
                <SealWatermark
                  tono="navy"
                  className="w-52 sm:w-64 -right-12 -top-14 opacity-[0.07] dark:opacity-0 rotate-[11deg]"
                />
                <SealWatermark
                  tono="white"
                  className="w-52 sm:w-64 -right-12 -top-14 opacity-0 dark:opacity-[0.07] rotate-[11deg]"
                />

                <div className="relative flex flex-col h-full">
                  <span className="text-[10px] font-mono-code uppercase font-bold text-[#0077C8] dark:text-[#4FB2F2] tracking-wider block mb-1.5">
                    {t.missionVision.vision.backBadge}
                  </span>
                  <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#003366] dark:text-[#9FC6E8] leading-tight mb-6">
                    {t.missionVision.vision.backHeading}
                  </h3>

                  <div className="space-y-2 sm:space-y-2.5 flex-1">
                    {VISION_REVERSO_ICONS.map((Icon, i) => (
                      <IconTile key={i} tone="light" icon={Icon}>
                        {t.missionVision.vision.reverso[i]}
                      </IconTile>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 dark:text-[#6E8AA8] font-mono-code">{t.missionVision.vision.footerNote}</span>
                    <FlipButton
                      onClick={() => toggleVision(false)}
                      icon={RotateCcw}
                      label={t.missionVision.vision.backLabel}
                      tone="light"
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
