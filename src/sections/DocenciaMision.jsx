import { useEffect, useMemo, useRef, useState } from 'react';
import { Telescope, TrendingUp, FlaskConical, Cpu, Flag, Globe2, BookOpen } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import KickerBadge from '../components/KickerBadge';
import FormacionVisionHero from './FormacionVisionHero';

// Mismos ids que t.docenciaMision.items en translations.js — nombre y
// descripción de cada capacidad viven ahí; acá sólo quedan el id y el
// ícono, que no cambian según el idioma.
const ITEMS = [
  { id: 'prospectiva', icon: Telescope },
  { id: 'pensamientoEstrategico', icon: TrendingUp },
  { id: 'investigacionAplicada', icon: FlaskConical },
  { id: 'innovacionDigital', icon: Cpu },
  { id: 'liderazgo', icon: Flag },
  { id: 'visionRegional', icon: Globe2 },
  { id: 'aprendizajeAplicado', icon: BookOpen }
];

const GROUP_SIZE = 2;
// Cuánto queda cada par quieto en pantalla antes de irse.
const HOLD_MS = 4200;
// Duración de las animaciones de salida/entrada (cardWhooshIn/Out en
// global.css): la salida es más corta, así lo viejo se "va" rápido y lo
// nuevo "llega" con más presencia.
const EXIT_MS = 480;
const ENTER_MS = 850;

/**
 * "Formación" de Docencia: las 7 capacidades rotan solas de a 2.
 *
 * Para que también se vea la SALIDA (no sólo la entrada, como pasaría con
 * un simple cambio de `key`) hay una máquina de 3 fases:
 *
 *   idle (HOLD_MS quieto) -> exit (EXIT_MS, el par actual sube y se
 *   disuelve, cardWhooshOut) -> se cambia el índice -> enter (ENTER_MS, el
 *   par nuevo sube desde abajo con estela, cardWhooshIn) -> idle.
 *
 * Al ir hacia ATRÁS el movimiento se invierte (ver `direction`). El
 * párrafo cardsIntro.text lleva `relative z-10` para que las cards pasen
 * por DETRÁS de él al salir hacia arriba.
 *
 * Los puntitos saltan directo a cualquier par (deshabilitados durante una
 * transición), y el scroll/swipe sobre el bloque hace lo mismo que el
 * puntito siguiente/anterior (ver wheelZoneRef).
 *
 * `showCards` / `showIntro`: Brochure renderiza esta sección dos veces.
 * Debajo del Hero de Inicio va sólo el texto (showCards={false}), que se
 * delega a FormacionVisionHero.jsx; en la página "Formación" del menú va
 * sólo el carrusel (showIntro={false}).
 */

/**
 * KickerBadge (KickerBadge.jsx) no lleva margen propio: acá el espaciado
 * lo da --docencia-gap en el contenedor padre.
 */

/**
 * Ícono de cada card: círculo con un marco de puntitos que gira
 * alrededor (orbitSpin en global.css).
 */
function CardIcon({ Icon }) {
  return (
    <div className="relative w-16 h-16 mx-auto shrink-0">
      <div
        className="absolute -inset-1.5 rounded-full border border-dashed border-[#0077C8]/45 dark:border-white/25 pointer-events-none"
        style={{ animation: 'orbitSpin 9s linear infinite' }}
        aria-hidden="true"
      />
      <div className="relative w-full h-full rounded-full bg-[#EAF3FB] dark:bg-white/10 text-[#0077C8] dark:text-[#4FB2F2] flex items-center justify-center">
        <Icon className="w-7 h-7" />
      </div>
    </div>
  );
}

export default function DocenciaMision({ showCards = true, showIntro = true }) {
  const { t } = useLanguage();
  const c = t.docenciaMision;

  const groups = useMemo(() => {
    const out = [];
    for (let i = 0; i < ITEMS.length; i += GROUP_SIZE) {
      out.push(ITEMS.slice(i, i + GROUP_SIZE));
    }
    return out;
  }, []);

  const [groupIndex, setGroupIndex] = useState(0);
  const [phase, setPhase] = useState('enter'); // 'enter' | 'idle' | 'exit'
  const [paused, setPaused] = useState(false);
  // Dirección del cambio en curso: 'forward' (avance automático, scroll
  // hacia abajo, puntito posterior) — el par se va hacia arriba y el nuevo
  // sube desde abajo. 'back' usa las animaciones *-back de global.css: el
  // par se va hacia abajo y el anterior baja desde arriba. Es estado
  // porque decide qué clase se renderiza, y se mantiene durante 'exit' y
  // 'enter'.
  const [direction, setDirection] = useState('forward');
  // Grupo destino cuando el cambio lo pide un clic en los puntitos, en
  // vez del avance automático (+1) — se lee recién al final de la fase
  // 'exit', así que vive en un ref y no en un dependency array.
  const pendingIndexRef = useRef(null);
  // Contenedor de cards+puntitos — acá se engancha el scroll (rueda del
  // mouse / trackpad y swipe táctil) para cambiar de par.
  const wheelZoneRef = useRef(null);
  // Throttle del scroll: cada gesto de rueda/trackpad dispara muchos
  // eventos seguidos — sin esto, un solo "scroll" saltaría varios pares
  // de una.
  const lastWheelRef = useRef(0);
  const touchStartYRef = useRef(null);

  // Fase 'enter': tras ENTER_MS pasa a 'idle'. Sin cards (showCards=false)
  // estos tres efectos no arrancan timers.
  useEffect(() => {
    if (!showCards || phase !== 'enter') return undefined;
    const id = setTimeout(() => setPhase('idle'), ENTER_MS);
    return () => clearTimeout(id);
  }, [showCards, phase, groupIndex]);

  // Fase 'idle': tras HOLD_MS (si no está en pausa) arranca la salida.
  useEffect(() => {
    if (!showCards || phase !== 'idle' || paused) return undefined;
    const id = setTimeout(() => {
      setDirection('forward');
      setPhase('exit');
    }, HOLD_MS);
    return () => clearTimeout(id);
  }, [showCards, phase, paused, groupIndex]);

  // Fase 'exit': tras EXIT_MS se cambia el índice (al siguiente, o al que
  // pidió un clic/scroll) y arranca la entrada del nuevo par. El destino se
  // calcula fuera del updater de setGroupIndex porque React en StrictMode
  // llama los updaters dos veces y pendingIndexRef ya estaría en null en la
  // segunda.
  useEffect(() => {
    if (!showCards || phase !== 'exit') return undefined;
    const id = setTimeout(() => {
      const next = pendingIndexRef.current !== null ? pendingIndexRef.current : (groupIndex + 1) % groups.length;
      pendingIndexRef.current = null;
      setGroupIndex(next);
      setPhase('enter');
    }, EXIT_MS);
    return () => clearTimeout(id);
  }, [showCards, phase, groupIndex, groups.length]);

  const handleDotClick = (targetIndex) => {
    if (phase !== 'idle' || targetIndex === groupIndex) return;
    pendingIndexRef.current = targetIndex;
    setDirection(targetIndex < groupIndex ? 'back' : 'forward');
    setPhase('exit');
  };

  // Scroll para cambiar de par: bajar avanza, subir retrocede. En los
  // extremos da la vuelta en vez de dejar pasar el scroll (la sección llena
  // la pantalla, así que no haría nada visible).
  useEffect(() => {
    if (!showCards) return undefined;
    const el = wheelZoneRef.current;
    if (!el) return undefined;

    const tryAdvance = (goingDown) => {
      const now = Date.now();
      if (phase !== 'idle' || now - lastWheelRef.current < 700) return false;
      lastWheelRef.current = now;
      pendingIndexRef.current = goingDown ? (groupIndex + 1) % groups.length : (groupIndex - 1 + groups.length) % groups.length;
      // La dirección sigue al gesto, no al índice: al dar la vuelta
      // (del último al primero bajando) sigue siendo "avanzar".
      setDirection(goingDown ? 'forward' : 'back');
      setPhase('exit');
      return true;
    };

    const handleWheel = (e) => {
      const goingDown = e.deltaY > 12;
      const goingUp = e.deltaY < -12;
      if (!goingDown && !goingUp) return;
      e.preventDefault();
      tryAdvance(goingDown);
    };

    const handleTouchStart = (e) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (touchStartYRef.current === null) return;
      const dy = touchStartYRef.current - e.touches[0].clientY; // positivo = dedo sube = quiere el siguiente
      const goingDown = dy > 30;
      const goingUp = dy < -30;
      if (!goingDown && !goingUp) return;
      e.preventDefault();
      tryAdvance(goingDown);
    };

    // passive: false para poder frenar el scroll de la página
    // (preventDefault) y manejar nosotros el cambio de par.
    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
    };
  }, [showCards, groupIndex, phase, groups.length]);

  const activeGroup = groups[groupIndex];
  const isExiting = phase === 'exit';
  const back = direction === 'back' ? '-back' : '';
  const ghostAnim = `animate-card-whoosh-${isExiting ? 'out' : 'in'}${back}`;
  const contentAnim = `animate-card-content-${isExiting ? 'out' : 'in'}${back}`;

  // En Inicio de Docencia (showCards=false) este bloque es
  // FormacionVisionHero.jsx, que tiene su propio layout de pantalla
  // completa. Sólo lleva el título (`c.title`): `c.kicker` es el nombre de
  // la página "Formación" del menú y no va acá.
  if (showIntro && !showCards) {
    return <FormacionVisionHero title={c.title} text={c.subtitle} closing={c.closing} />;
  }

  return (
    <section
      className={`px-4 sm:px-6 ${
        !showIntro && showCards ? 'py-[var(--docencia-gap)]' : 'py-10 sm:py-16'
      } bg-[#D6E9F7] dark:bg-[#001F3D] relative flex flex-col overflow-hidden ${
        showIntro && showCards ? 'min-h-[85vh] sm:min-h-[88vh]' : ''
      }`}
    >
      <div
        className={`max-w-4xl mx-auto w-full flex flex-col ${showCards ? 'flex-1' : ''} ${
          !showIntro && showCards ? 'gap-[var(--docencia-gap)]' : ''
        }`}
      >
        {/* Página "Formación" (showIntro=false): kicker + texto de contexto
            (cardsIntro) + cards, con la misma distancia fija (--docencia-gap en
            global.css) entre el menú y el primer elemento y entre cada bloque,
            igual que en Impacto e Investigación. */}
        {!showIntro && showCards && (
          <div className="shrink-0 animate-breeze-in text-center" style={{ animationDelay: '0ms' }}>
            <KickerBadge>{c.cardsIntro.kicker}</KickerBadge>
          </div>
        )}

        {!showIntro && showCards && (
          <p
            className="shrink-0 relative z-10 text-sm sm:text-base text-slate-700 dark:text-slate-300 max-w-xl mx-auto leading-relaxed text-center animate-breeze-in"
            style={{ animationDelay: '180ms' }}
          >
            {c.cardsIntro.text}
          </p>
        )}

        {showCards && (
          /* Bloque de cards (sólo en la página "Formación"). */
          <div ref={wheelZoneRef} className="shrink-0">
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-7"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              {activeGroup.map((item) => {
                const Icon = item.icon;
                const itemT = c.items[item.id];
                const soloCard = activeGroup.length === 1;
                return (
                  <div
                    key={`${groupIndex}-${item.id}`}
                    className={`relative rounded-[28px] min-h-[220px] sm:min-h-[240px] ${
                      soloCard ? 'sm:col-span-2 sm:max-w-md sm:mx-auto sm:w-full' : ''
                    }`}
                  >
                    {/* Capa fantasma decorativa (aria-hidden): lleva el blur de la estela y
                        se mueve igual que la capa real, así sólo se nota como un resplandor
                        mientras entra o sale. */}
                    <div
                      aria-hidden="true"
                      className={`absolute inset-0 p-7 sm:p-9 flex flex-col gap-4 pointer-events-none ${ghostAnim}`}
                    >
                      <CardIcon Icon={Icon} />
                      <div className="text-center">
                        <h3 className="font-heading font-bold text-lg sm:text-xl text-[#003366] dark:text-[#9FC6E8] mb-1.5">
                          {itemT.name}
                        </h3>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                          {itemT.description}
                        </p>
                      </div>
                    </div>

                    {/* Capa real: ícono y texto, con el mismo movimiento que la fantasma pero
                        sin blur. */}
                    <div
                      className={`relative p-7 sm:p-9 flex flex-col gap-4 ${contentAnim}`}
                    >
                      <CardIcon Icon={Icon} />
                      <div className="text-center">
                        <h3 className="font-heading font-bold text-lg sm:text-xl text-[#003366] dark:text-[#9FC6E8] mb-1.5">
                          {itemT.name}
                        </h3>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                          {itemT.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Puntitos de progreso: además de marcar en qué par vamos,
                dejan saltar directo a cualquiera con un clic. */}
            <div className="flex items-center justify-center gap-1.5 mt-8 sm:mt-10">
              {groups.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleDotClick(i)}
                  aria-label={`${i + 1}/${groups.length}`}
                  aria-pressed={i === groupIndex}
                  className={`h-1.5 rounded-full transition-all ${
                    i === groupIndex ? 'w-6 bg-[#0077C8]' : 'w-1.5 bg-[#0077C8]/30 hover:bg-[#0077C8]/50'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
