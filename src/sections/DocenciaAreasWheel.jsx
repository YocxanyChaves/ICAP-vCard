import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Globe2,
  Landmark,
  LineChart,
  ClipboardList,
  Cpu,
  Lightbulb,
  BadgeCheck,
  HeartPulse,
  Activity,
  Zap,
  FlaskConical,
  Building2,
  MousePointerClick
} from 'lucide-react';
import DocenciaComunidad from './DocenciaComunidad';
import { useLanguage } from '../i18n/LanguageContext';
import KickerBadge from '../components/KickerBadge';
import EscudoICAP from '../components/EscudoICAP';

// Mismos ids que t.docenciaAreas.items en translations.js — nombre y
// descripción de cada área viven ahí; acá sólo quedan el id y el
// ícono, que no cambian según el idioma.
const DOCENCIA_AREAS = [
  { id: 'integracionRegional', icon: Globe2 },
  { id: 'politicasPublicas', icon: Landmark },
  { id: 'gestionPredictiva', icon: LineChart },
  { id: 'gerenciaProyectos', icon: ClipboardList },
  { id: 'transformacionDigital', icon: Cpu },
  { id: 'innovacionInstitucional', icon: Lightbulb },
  { id: 'calidad', icon: BadgeCheck },
  { id: 'saludPublica', icon: HeartPulse },
  { id: 'epidemiologia', icon: Activity },
  { id: 'regulacionEnergia', icon: Zap },
  { id: 'investigacionAplicada', icon: FlaskConical },
  { id: 'modernizacionOrganizacional', icon: Building2 }
];

// Mismo celeste institucional que el carrusel de Áreas de AT
// (SpecializationAreas.jsx): degradado + brillo radial. Es el mismo
// fondo para las 12 tarjetas, así se leen como fotos de un mismo mazo.
const CARD_BACKGROUND =
  'radial-gradient(60% 65% at 18% -6%, rgba(255,255,255,0.35), transparent 45%), ' +
  'linear-gradient(165deg, #0090DD 0%, #0068AE 46%, #013A63 100%)';

// Cuántas tarjetas se alcanzan a ver detrás de la de adelante
// (distancias 1, 2 y 3, ver stackTransform). De ahí para atrás quedan
// todas superpuestas al fondo del mazo con opacity 0, esperando su turno.
const STACK_PEEK = 4;

// Textitos de la UI del mazo (aria-label de los puntitos) — viven acá,
// no en translations.js, porque son sólo accesibilidad (nunca texto
// visible en pantalla), mismo criterio que UI en SpecializationAreas.jsx.
const UI = {
  es: { goTo: (name) => `Ir a ${name}`, next: (name) => `Siguiente: ${name}` },
  en: { goTo: (name) => `Go to ${name}`, next: (name) => `Next: ${name}` }
};

// "Desorden" fijo de cada ÁREA (no de cada posición en la pila):
// rotación y corrimiento extra en px. Así las tarjetas que asoman detrás
// nunca se ven con el mismo ángulo dos veces seguidas y el mazo parece
// una pila de fotos tiradas, no una mano de cartas. La de adelante nunca
// lleva desorden (ver `d === 0 ? 0 : ...` en stackTransform).
const JITTER = [
  { rotate: -11, dx: -7, dy: 4 },
  { rotate: 6, dx: 8, dy: -5 },
  { rotate: -15, dx: -5, dy: 8 },
  { rotate: 10, dx: 6, dy: -7 },
  { rotate: -5, dx: -9, dy: 3 },
  { rotate: 13, dx: 4, dy: 7 },
  { rotate: -8, dx: -6, dy: -6 },
  { rotate: 4, dx: 9, dy: 4 },
  { rotate: -13, dx: -4, dy: -7 },
  { rotate: 9, dx: 7, dy: 6 },
  { rotate: -6, dx: -8, dy: -3 },
  { rotate: 14, dx: 5, dy: -8 }
];

// Transform + opacidad de una tarjeta según su distancia circular a la
// de adelante (0 = adelante, 1-2 = espían detrás, 3+ = fuera de vista),
// más el desorden fijo de su área (JITTER). `translate` arranca en
// -50%/-50% (centrado) y a eso se le suma el corrimiento en px.
function stackTransform(dist, jitter) {
  const d = Math.min(dist, STACK_PEEK);
  const opacity = d === 0 ? 1 : d === 1 ? 0.96 : d === 2 ? 0.85 : d === 3 ? 0.7 : 0;
  const jr = d === 0 ? 0 : jitter.rotate;
  const jx = d === 0 ? 0 : jitter.dx;
  const jy = d === 0 ? 0 : jitter.dy;
  return {
    transform: `translate(calc(-50% + ${d * 13 + jx}px), calc(-50% + ${d * 17 + jy}px)) rotate(${d * 2.5 + jr}deg) scale(${1 - d * 0.05})`,
    opacity
  };
}

// Pose de "salida" de la tarjeta que acaba de dejar de ser la de
// adelante: más lejos y más rotada, y con z-index por encima de todas
// (ver stackZIndex) mientras dura la transición, para que se vea correrse
// a un lado en vez de desaparecer tapada.
const EXIT_TRANSFORM = {
  transform: 'translate(calc(-50% + 58px), calc(-50% + 84px)) rotate(12deg) scale(0.78)',
  opacity: 0
};

// Pose de ARRANQUE de la caída de entrada: el mismo desorden de cada área
// (JITTER) exagerado ×1.6/×1.5 y bien arriba, así cada tarjeta cae
// "torcida" hasta su lugar de reposo.
function fallStartTransform(jitter) {
  return {
    transform: `translate(calc(-50% + ${jitter.dx * 1.5}px), calc(-50% - 420px)) rotate(${jitter.rotate * 1.6}deg) scale(0.9)`,
    opacity: 0
  };
}

// Atraso de cada tarjeta al entrar, según su distancia a la de adelante
// (0 cae primera, las de atrás van detrás). La caída usa su propia curva
// con un rebote sutil al aterrizar (ver transitionTimingFunction más
// abajo).
const FALL_STAGGER_MS = 90;
const FALL_DURATION_MS = 950;
// Tiempo total hasta que la ÚLTIMA tarjeta en caer (dist STACK_PEEK,
// con el mayor delay) termina de asentarse — recién ahí la fase pasa
// a 'settled' y las tarjetas vuelven a animarse con la duración/delay
// normales de los clics, no con las de la caída.
const FALL_SETTLE_MS = STACK_PEEK * FALL_STAGGER_MS + FALL_DURATION_MS + 100;

function stackZIndex(dist, isExiting) {
  if (isExiting) return 50;
  const d = Math.min(dist, STACK_PEEK);
  return 40 - d * 8;
}

/**
 * Ícono de cada tarjeta: círculo con un aro punteado girando alrededor
 * (orbitSpin en global.css), igual que CardIcon en DocenciaMision.jsx.
 */
function AreaIcon({ Icon }) {
  return (
    <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto shrink-0">
      <div
        className="absolute -inset-1.5 rounded-full border border-dashed border-white/45 pointer-events-none"
        style={{ animation: 'orbitSpin 9s linear infinite' }}
        aria-hidden="true"
      />
      <div className="relative w-full h-full rounded-full bg-white/15 border border-white/25 text-white flex items-center justify-center">
        <Icon className="w-8 h-8 sm:w-10 sm:h-10" />
      </div>
    </div>
  );
}

/**
 * Una tarjeta del mazo: degradado celeste institucional + escudo como
 * marca de agua, formato casi cuadrado. No tiene reverso: ícono, nombre y
 * descripción van de una; lo que se anima es el paso entre tarjetas.
 */
function AreaStackCard({ item, itemT, index, total, isFront, ui, tapHint, onSelect }) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={onSelect}
      // Sólo la de adelante y las que espían son clickeables; las del fondo
      // (opacity 0) quedan `disabled` para salir del tab order y no capturar
      // clics en ese rectángulo.
      disabled={isFront === null}
      aria-hidden={isFront === null}
      aria-label={isFront === 0 ? ui.next(itemT.name) : ui.goTo(itemT.name)}
      className="absolute inset-0 w-full h-full rounded-[2rem] shadow-xl shadow-slate-900/25 dark:shadow-black/50 overflow-hidden flex flex-col items-center text-center p-6 sm:p-8 cursor-pointer disabled:cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4FB2F2] focus-visible:ring-offset-2"
      style={{ background: CARD_BACKGROUND }}
    >
      <EscudoICAP
        tono="white"
        className="absolute left-1/2 top-[55%] w-[80%] -translate-x-1/2 -translate-y-1/2 rotate-[-6deg] opacity-[0.14] pointer-events-none"
      />

      <span className="relative font-mono-code text-[10px] sm:text-xs font-bold tracking-widest text-white/60 mt-1">
        {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>

      <div className="relative flex-1 flex flex-col items-center justify-center gap-3 sm:gap-4">
        <AreaIcon Icon={Icon} />
        <h3 className="font-heading font-extrabold text-lg sm:text-2xl text-white leading-tight px-1">{itemT.name}</h3>
        <p className="text-[11px] sm:text-sm text-white/85 leading-relaxed px-1">{itemT.description}</p>
      </div>

      {/* "Tocá para explorar": sólo en la tarjeta de adelante. */}
      {isFront === 0 && (
        <span className="relative flex items-center gap-1.5 text-[10px] sm:text-xs font-bold tracking-wide uppercase text-white/80 mb-1" aria-hidden="true">
          <span className="relative flex items-center justify-center shrink-0">
            <span className="absolute inline-flex h-5 w-5 rounded-full bg-white/25 animate-ping" />
            <MousePointerClick className="relative w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </span>
          {tapHint}
        </span>
      )}
    </button>
  );
}

/**
 * "Áreas" de Docencia — bloque 6 del brochure ("Áreas para los desafíos
 * del presente y del futuro"). Un MAZO de tarjetas apiladas: la de
 * adelante a la vista completa, tres espiando detrás, y cada toque "pasa"
 * a la siguiente, como pasar fotos de una pila. Los puntitos de abajo
 * permiten saltar directo a cualquiera de las 12 áreas.
 *
 * Mecánica: para cada tarjeta se calcula su distancia (circular) a la
 * activa y se le aplica el transform/opacity que le toca (stackTransform).
 * Al cambiar la activa, cambian todas las distancias y la `transition`
 * de CSS anima el paso solo. La excepción es la tarjeta que acaba de
 * salir (`exitingIndex`), que por un momento lleva una pose de salida
 * propia.
 *
 * Cada "foto" hoy es una ficha con fondo celeste; ese fondo se puede
 * cambiar por una imagen real por tarjeta sin tocar la mecánica.
 *
 * Debajo va el banner de cierre de "Comunidad" (DocenciaComunidad.jsx),
 * como segunda sección de esta misma página.
 */
export default function DocenciaAreasWheel() {
  const { t, lang } = useLanguage();
  const c = t.docenciaAreas;
  const ui = UI[lang] || UI.es;
  const total = DOCENCIA_AREAS.length;

  const sectionRef = useRef(null);
  // Fase de entrada de TODO el mazo:
  //  'hidden'   — fuera de vista: cada tarjeta en su pose de arranque
  //               (fallStartTransform), arriba e invisible.
  //  'falling'  — al entrar: cada tarjeta cae a su lugar en la pila, con
  //               un atraso según su distancia (FALL_STAGGER_MS).
  //  'settled'  — caída terminada: vuelven la duración/curva normales de
  //               los clics.
  // Nunca se hace unobserve: si la sección sale de pantalla vuelve a
  // 'hidden' y la caída se repite la próxima vez.
  const [phase, setPhase] = useState('hidden');
  const visible = phase !== 'hidden';
  const [activeIndex, setActiveIndex] = useState(0);
  // Índice de la tarjeta que ACABA de dejar de ser la de adelante: lleva
  // por un momento la pose/z-index de salida (EXIT_TRANSFORM/stackZIndex).
  // Se limpia con un setTimeout cuando termina la transición.
  const [exitingIndex, setExitingIndex] = useState(null);
  const exitTimeoutRef = useRef(null);
  const fallTimeoutRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;

    // El IntersectionObserver sale del window dueño del documento (no del
    // global) para que funcione también dentro del iframe de "Vista Móvil".
    const view = el.ownerDocument?.defaultView;
    const IO = view?.IntersectionObserver;

    if (!IO) {
      setPhase('settled');
      return undefined;
    }

    const observer = new IO(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setPhase('falling');
            fallTimeoutRef.current = setTimeout(() => setPhase('settled'), FALL_SETTLE_MS);
          } else {
            clearTimeout(fallTimeoutRef.current);
            setPhase('hidden');
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(fallTimeoutRef.current);
    };
  }, []);

  useEffect(() => () => clearTimeout(exitTimeoutRef.current), []);

  const goTo = (nextIndex) => {
    if (nextIndex === activeIndex) return;
    setExitingIndex(activeIndex);
    setActiveIndex(nextIndex);
    clearTimeout(exitTimeoutRef.current);
    exitTimeoutRef.current = setTimeout(() => setExitingIndex(null), 560);
  };

  // Distancia circular de cada tarjeta a la activa — útil también
  // fuera del render (memoizada) porque se recalcula con cada clic.
  const distances = useMemo(
    () => DOCENCIA_AREAS.map((_, i) => (i - activeIndex + total) % total),
    [activeIndex, total]
  );

  return (
    <>
      <section ref={sectionRef} className="px-4 sm:px-6 py-[var(--docencia-gap)] bg-[#D6E9F7] dark:bg-[#001F3D] relative">
        {/* Misma distancia (--docencia-gap, global.css) del menú al
            primer elemento y entre cada elemento que las demás
            subsecciones de Docencia. */}
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-[var(--docencia-gap)]">
          <div
            className="flex flex-col items-center gap-[var(--docencia-gap)] text-center transition-all duration-700 ease-out"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)' }}
          >
            <div className="flex justify-center">
              <KickerBadge variant="dot">{c.kicker}</KickerBadge>
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#003366] dark:text-[#9FC6E8] tracking-tight">{c.title}</h2>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">{c.subtitle}</p>
          </div>

          {/* El mazo: contenedor del tamaño de una tarjeta. Las que espían (y las
              que caen) se salen un poco de la caja a propósito; el mb- extra
              compensa ese excedente (~45px) para que la distancia visible hasta los
              puntitos sea --docencia-gap. */}
          <div className="relative w-64 h-80 sm:w-80 sm:h-96 mb-12">
            {DOCENCIA_AREAS.map((item, i) => {
              const itemT = c.items[item.id];
              const dist = distances[i];
              const isExiting = exitingIndex === i;
              const falling = phase === 'falling' && !isExiting;
              const pose = isExiting ? EXIT_TRANSFORM : phase === 'hidden' ? fallStartTransform(JITTER[i]) : stackTransform(dist, JITTER[i]);
              // Estrictamente MENOR a STACK_PEEK: a esa distancia stackTransform ya
              // devuelve opacity 0.
              const withinPeek = dist < STACK_PEEK && !isExiting;
              const nextIndex = (activeIndex + 1) % total;

              return (
                <div
                  key={item.id}
                  // w/h explícitos también acá: sin esto el div queda de 0×0 (su único
                  // hijo es absolute) y el translate(-50%, -50%) centraría sobre una caja
                  // vacía, dejando la tarjeta anclada por su esquina.
                  className="absolute left-1/2 top-1/2 w-64 h-80 sm:w-80 sm:h-96 transition-[transform,opacity]"
                  style={{
                    ...pose,
                    zIndex: stackZIndex(dist, isExiting),
                    // Mientras cae: duración más larga (FALL_DURATION_MS) y un atraso según
                    // la distancia. Asentada (o mientras sale, `isExiting`) vuelve a la
                    // duración/delay/curva normales de los clics.
                    transitionDuration: falling ? `${FALL_DURATION_MS}ms` : '520ms',
                    transitionDelay: falling ? `${Math.min(dist, STACK_PEEK) * FALL_STAGGER_MS}ms` : '0ms',
                    // La caída rebota un poco al llegar; los clics usan la curva plana.
                    transitionTimingFunction: falling ? 'cubic-bezier(0.32, 1.3, 0.62, 1)' : 'cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  <AreaStackCard
                    item={item}
                    itemT={itemT}
                    index={i}
                    total={total}
                    isFront={withinPeek ? dist : null}
                    ui={ui}
                    tapHint={c.tapHint}
                    onSelect={() => goTo(dist === 0 ? nextIndex : i)}
                  />
                </div>
              );
            })}
          </div>

          {/* Puntitos para saltar directo a cualquiera de las 12 áreas (mismo
              patrón que el carrusel de Áreas de AT). */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-xs sm:max-w-sm">
            {DOCENCIA_AREAS.map((item, i) => {
              const itemT = c.items[item.id];
              const isActive = i === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={ui.goTo(itemT.name)}
                  aria-current={isActive}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isActive ? 'w-6 bg-[#0077C8] dark:bg-[#4FB2F2]' : 'w-2 bg-[#0077C8]/25 dark:bg-white/25 hover:bg-[#0077C8]/50 dark:hover:bg-white/45'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </section>

      <DocenciaComunidad />
    </>
  );
}
