import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Telescope, TrendingUp, FlaskConical, Cpu, Flag, Globe2, BookOpen } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import KickerBadge from './KickerBadge';
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
// Duración de las animaciones de salida/entrada (ver cardWhooshIn/Out
// en global.css) — la salida es más corta que la entrada a propósito:
// se siente como que el par se "va" rápido y lo nuevo "llega" con más
// presencia/estela, no como un intercambio parejo de ida y vuelta.
const EXIT_MS = 480;
const ENTER_MS = 850;

/**
 * "Formación" de Docencia (antes "Misión" en el menú — Yocxany pidió
 * fusionar ahí el contenido de "Formación con Visión de Futuro", que
 * antes vivía en la sección "Visión". Esa sección se terminó eliminando
 * del todo del menú — era sólo un placeholder pendiente, nunca tuvo
 * contenido real — así que DocenciaVision.jsx quedó sin usarse).
 *
 * Las 7 capacidades rotan solas de a 2. A diferencia de un simple
 * cambio de `key` (que sólo anima la ENTRADA — la salida es un corte
 * seco porque React desmonta el par viejo de una), acá se maneja una
 * máquina de estados de 3 fases para que la salida hacia arriba
 * también se vea, con su propia animación (cardWhooshOut), antes de
 * que entre el par siguiente (cardWhooshIn):
 *
 *   idle (HOLD_MS quieto) -> exit (EXIT_MS, el par actual sube y se
 *   disuelve) -> se cambia el índice -> enter (ENTER_MS, el par nuevo
 *   sube desde abajo con estela) -> vuelve a idle.
 *
 * Con el texto de contexto de la página "Formación" (cardsIntro) justo
 * encima de las cards, esta salida hacia arriba pasaba POR ENCIMA del
 * texto y lo tapaba un instante. Yocxany aclaró que no quería cambiar
 * la dirección de la animación (se probó que bajara en vez de subir,
 * pero no era eso lo que pedía) sino que la tarjeta se escondiera
 * DETRÁS del texto al cruzarlo — así que el párrafo cardsIntro.text
 * (más abajo) lleva `relative z-10` para quedar siempre por encima de
 * las cards en el eje de profundidad, sin importar hacia dónde se
 * mueva la tarjeta.
 *
 * Los puntitos de abajo permiten saltar directo a cualquier par —
 * deshabilitados mientras hay una transición en curso, para no pisar
 * una animación a mitad de camino. El scroll (rueda/trackpad o swipe
 * táctil) sobre el bloque de cards hace lo mismo que un clic en el
 * puntito siguiente/anterior — ver el useEffect de wheelZoneRef.
 *
 * `showCards` / `showIntro`: el texto (kicker+título+subtítulo) y el
 * carrusel de cards terminaron viviendo en dos lugares distintos, no
 * juntos en los dos: debajo del Hero en Inicio va sólo el texto
 * ("Conocimiento para anticipar, liderar y transformar…"), y en la
 * página dedicada "Formación" del menú va sólo el carrusel — ya que el
 * texto ya se vio arriba, en Inicio, no hace falta repetirlo ahí.
 * Por eso Propuesta1 renderiza esta misma sección dos veces con props
 * distintas: showCards={false} justo después del Hero, y
 * showIntro={false} en la página dedicada de "Formación".
 *
 * El caso showCards={false} (Inicio) YA NO se dibuja acá — Yocxany
 * pidió rehacerlo como su propio momento de dos columnas con scroll,
 * inspirado en white-desert.com, así que ese caso retorna temprano
 * hacia FormacionVisionHero.jsx (ver el `if` justo antes del `return`
 * principal, más abajo). El caso showIntro={false} (cards de la
 * página "Formación") sigue exactamente igual que siempre.
 */

/**
 * KickerBadge (píldora + puntito) ahora vive en su propio archivo
 * compartido — ver KickerBadge.jsx — porque Yocxany pidió el mismo
 * "marco" para el kicker de DocenciaImpacto. Sigue sin llevar su
 * propio `mb-3`: en esta página "Formación" el espaciado entre
 * kicker/texto/cards lo reparte justify-evenly en el contenedor padre
 * (ver más abajo), y ese `mb-3` extra hacía que ese espacio quedara
 * más grande que los demás. El margen para separarlo del <h2> en la
 * página de Inicio (showIntro) vive en el wrapper de esa sección.
 */

/**
 * Ícono de cada card de "Formación", ahora circular (antes un
 * cuadrado redondeado) con el marco de puntitos animado alrededor —
 * acá el círculo rota de verdad (orbitSpin, ya definido en
 * global.css para el logo del Hero) sin el problema de deformación
 * que tenía en el badge de arriba.
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

  // Fase 'enter': tras ENTER_MS pasa a 'idle' (el par ya está quieto y
  // legible en pantalla). Sin cards (showCards=false) no hay nada que
  // animar ni rotar, así que estos tres efectos no arrancan timers.
  useEffect(() => {
    if (!showCards || phase !== 'enter') return undefined;
    const id = setTimeout(() => setPhase('idle'), ENTER_MS);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCards, phase, groupIndex]);

  // Fase 'idle': tras HOLD_MS (si no está en pausa) arranca la salida.
  useEffect(() => {
    if (!showCards || phase !== 'idle' || paused) return undefined;
    const id = setTimeout(() => setPhase('exit'), HOLD_MS);
    return () => clearTimeout(id);
  }, [showCards, phase, paused, groupIndex]);

  // Fase 'exit': tras EXIT_MS (el par ya terminó de irse) se cambia el
  // índice — al siguiente en el ciclo automático, o al que haya pedido
  // un clic en los puntitos / un scroll — y arranca la entrada del
  // nuevo par. El destino se calcula ACÁ afuera, no dentro de un
  // updater de setGroupIndex(i => ...): React (en StrictMode, en dev)
  // invoca esos updaters dos veces para detectar mutaciones impuras, y
  // leer-y-limpiar pendingIndexRef ahí adentro hacía que la segunda
  // pasada ya lo encontrara en null y cayera siempre al avance
  // automático (+1), ignorando el destino elegido por clic/scroll.
  // Mismo motivo que directionRef en SectionsStrip.jsx.
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
    setPhase('exit');
  };

  // Scroll para cambiar de par: bajar avanza, subir retrocede — igual
  // que un clic en los puntitos, pero disparado por el scroll en vez
  // del mouse. En los extremos (primer/último par) da la vuelta (del
  // último vuelve al primero, y viceversa) en lugar de dejar pasar el
  // scroll a la página — esta sección llena toda la pantalla, así que
  // "dejarlo pasar" no hacía nada visible y el scroll se sentía
  // pegado/trabado en el último par.
  useEffect(() => {
    if (!showCards) return undefined;
    const el = wheelZoneRef.current;
    if (!el) return undefined;

    const tryAdvance = (goingDown) => {
      const now = Date.now();
      if (phase !== 'idle' || now - lastWheelRef.current < 700) return false;
      lastWheelRef.current = now;
      pendingIndexRef.current = goingDown ? (groupIndex + 1) % groups.length : (groupIndex - 1 + groups.length) % groups.length;
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

  // Uso en Inicio de Docencia (showCards=false, showIntro=true por
  // default): antes esto era un simple kicker+título+párrafo
  // centrado, acá mismo (ver el historial más abajo en git si hace
  // falta). Yocxany pidió rehacerlo como su propio momento de dos
  // columnas con scroll — ver FormacionVisionHero.jsx para todo el
  // detalle de cómo funciona. Retorna ACÁ, antes que nada, porque ese
  // nuevo diseño es plancha completa (dos paneles a lo ancho) y no
  // encaja dentro del `max-w-4xl` centrado que usa el resto de este
  // componente para la página dedicada "Formación" (showIntro=false)
  // — son dos layouts demasiado distintos para compartir el mismo
  // <section> envolvente.
  //
  // OJO: NO se le pasa `c.kicker` ("Formación con Visión de Futuro")
  // — ese texto es el nombre de la página dedicada "Formación" del
  // menú (es el mismo string que `c.cardsIntro.kicker`, ver arriba),
  // no pertenece acá en el Inicio. Yocxany lo notó y pidió quitarlo:
  // en Inicio va SOLO el título grande (`c.title`).
  if (showIntro && !showCards) {
    return <FormacionVisionHero title={c.title} text={c.subtitle} closing={c.closing} />;
  }

  return (
    <section
      className={`px-4 sm:px-6 ${
        !showIntro && showCards ? 'pt-0 pb-10 sm:pb-16' : 'py-10 sm:py-16'
      } bg-[#D6E9F7] dark:bg-[#001F3D] relative flex flex-col overflow-hidden ${
        showCards ? 'min-h-[85vh] sm:min-h-[88vh]' : ''
      }`}
    >
      <div
        className={`max-w-4xl mx-auto w-full flex flex-col ${showCards ? 'flex-1' : ''} ${
          !showIntro && showCards ? 'justify-evenly' : ''
        }`}
      >
        {/* En la página dedicada "Formación" (showIntro=false, showCards=
            true) no va el kicker/título/subtítulo de arriba — sólo el
            kicker propio + el texto de contexto (cardsIntro) + las
            cards, como TRES puntos repartidos con la misma distancia
            entre cada uno. Yocxany fue bien específica: quiere que la
            separación entre el menú de arriba y el título, entre el
            título y el texto, y entre el texto y las cards sea
            exactamente la misma — no cada bloque centrado por su
            cuenta en su propia mitad (eso daba espacios distintos).
            La forma correcta de lograr esto en CSS es justify-evenly
            en el contenedor padre (ver el className del div de más
            arriba): reparte el espacio sobrante en partes IGUALES
            antes del primer hijo, entre cada par de hijos, y después
            del último — con exactamente 3 hijos acá (kicker, texto,
            cards) eso da 4 espacios iguales: menú→título,
            título→texto, texto→cards, y cards→fin de sección. Por eso
            cada bloque ahora es shrink-0 (tamaño natural) en vez de
            flex-1/centrado — el que reparte el espacio es el padre,
            no cada uno por separado.

            Ojo: la <section> de más abajo también le quita su propio
            padding-top fijo (py-10/16) en este caso — si se dejaba,
            el espacio "menú→título" salía más grande que los otros
            tres porque sumaba ese padding fijo ADEMÁS del espacio que
            reparte justify-evenly. Sin ese padding, el primer espacio
            de justify-evenly queda como el único responsable de la
            distancia menú→título, igual que los demás. */}
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
          /* El bloque de cards es el tercer (y último) punto de la
             distribución pareja de arriba — ver el comentario sobre
             justify-evenly más arriba. Esto sólo aplica en la página
             dedicada "Formación" — debajo del Hero (showCards=false)
             no hay carrusel, sólo el texto. */
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
                    {/* Capa fantasma: puramente decorativa (aria-hidden,
                        pointer-events-none) — lleva el blur de la estela
                        de siempre. Al estar exactamente detrás y con el
                        mismo movimiento que la capa real, sólo se nota
                        como un leve resplandor difuso mientras entra o
                        sale; nunca es lo que se lee. */}
                    <div
                      aria-hidden="true"
                      className={`absolute inset-0 p-7 sm:p-9 flex flex-col gap-4 pointer-events-none ${
                        isExiting ? 'animate-card-whoosh-out' : 'animate-card-whoosh-in'
                      }`}
                    >
                      <CardIcon Icon={Icon} />
                      <div className="text-center">
                        <h3 className="font-heading font-bold text-lg sm:text-xl text-[#003366] dark:text-[#9FC6E8] mb-1.5">
                          {itemT.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {itemT.description}
                        </p>
                      </div>
                    </div>

                    {/* Capa real: el ícono y el texto que se leen de
                        verdad — mismo movimiento (translateY + scale +
                        opacity) que la fantasma, pero SIN blur, así el
                        desenfoque de la estela nunca los afecta. */}
                    <div
                      className={`relative p-7 sm:p-9 flex flex-col gap-4 ${
                        isExiting ? 'animate-card-content-out' : 'animate-card-content-in'
                      }`}
                    >
                      <CardIcon Icon={Icon} />
                      <div className="text-center">
                        <h3 className="font-heading font-bold text-lg sm:text-xl text-[#003366] dark:text-[#9FC6E8] mb-1.5">
                          {itemT.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
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
