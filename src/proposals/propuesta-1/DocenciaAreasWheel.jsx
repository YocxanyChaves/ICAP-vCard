import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { useLanguage } from '../../i18n/LanguageContext';
import KickerBadge from './KickerBadge';
import icapEscudoWhite from '../../assets/icap-escudo-white.svg';

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

// Mismo celeste institucional que usa el carrusel de Áreas de AT
// (SpecializationAreas.jsx) — un degradado + brillo radial arriba-
// izquierda para que la tarjeta se sienta una superficie "de foto"
// pulida, no un color plano. A propósito es EL MISMO fondo para las
// 12 (no un color distinto por área): con opacidad decreciente según
// qué tan atrás quede en la pila, esa repetición es justo lo que hace
// que se lea como "varias fotos del mismo mazo", no como tarjetas
// sueltas de colores random.
const CARD_BACKGROUND =
  'radial-gradient(60% 65% at 18% -6%, rgba(255,255,255,0.35), transparent 45%), ' +
  'linear-gradient(165deg, #0090DD 0%, #0068AE 46%, #013A63 100%)';

// Cuántas tarjetas se alcanzan a "espiar" detrás de la de adelante
// (distancia 1, 2 y 3, ver stackTransform) antes de quedar invisibles
// — de ahí para atrás (distancia 4 en adelante) las 8 tarjetas
// restantes quedan todas superpuestas en el mismo punto, al fondo del
// mazo, esperando su turno. No importa que sean 8 en el mismo lugar:
// están en opacity 0, así que se turnan sin que se note el
// amontonamiento. Antes esto era 3 (sólo 2 espiando) — Yocxany probó
// esa versión y pidió que se alcanzaran a ver "por lo menos dos o tres
// cartas" atrás, no sólo una asomando, así que ahora son tres.
const STACK_PEEK = 4;

// Textitos de la UI del mazo (aria-label de los puntitos) — viven acá,
// no en translations.js, porque son sólo accesibilidad (nunca texto
// visible en pantalla), mismo criterio que UI en SpecializationAreas.jsx.
const UI = {
  es: { goTo: (name) => `Ir a ${name}`, next: (name) => `Siguiente: ${name}` },
  en: { goTo: (name) => `Go to ${name}`, next: (name) => `Next: ${name}` }
};

// Primera vuelta de esto (apilado prolijo, un solo escalón fijo de
// corrimiento/rotación por distancia) le pareció a Yocxany demasiado
// parecido al abanico de DocenciaImpacto — "una mano de cartas". La
// diferencia real con la referencia de Miu Miu es que ahí las fotos de
// atrás NO progresan en línea recta: están tiradas medio al desgaire,
// cada una para un lado distinto. Acá se logra lo mismo dándole a cada
// ÁREA (no a cada posición en la pila) su propio "desorden" fijo —
// rotación y corrimiento extra en px, siempre el mismo sin importar en
// qué lugar del mazo caiga esa área — así, a medida que se va pasando
// de tarjeta en tarjeta, las que asoman detrás nunca se ven en el
// mismo ángulo dos veces seguidas, en vez del progreso prolijo y
// creciente de antes. La de ADELANTE nunca lleva desorden (tiene que
// leerse derecha); ver el `d === 0 ? 0 : ...` en stackTransform.
// Magnitudes más grandes y bien despa­rejas entre sí (antes eran todas
// parecidas, ±4 a ±9) — con sólo 2 tarjetas espiando el desorden ya se
// notaba poco; ahora que se ven 3 (ver STACK_PEEK) hace falta más
// variedad de verdad entre ellas para que ninguna se sienta "la
// continuación prolija" de la anterior.
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
// que está "de frente" (0 = la de adelante, 1 y 2 = las que espían
// detrás, 3+ = fuera de vista), más el desorden fijo de esa área en
// particular (ver JITTER arriba). `translate` arranca en -50%/-50%
// (centrado sobre el punto medio del contenedor) y a partir de ahí se
// suma el corrimiento en píxeles — así una sola tarjeta puede estar
// centrada Y desplazada al mismo tiempo sin tener que envolverla en un
// wrapper aparte sólo para el centrado.
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
// adelante — en vez de saltar directo a su lugar normal al fondo del
// mazo (que la dejaría tapada al instante detrás de las demás), se le
// da una pose propia, más lejos y más rotada, y de paso un z-index
// más alto que todas (ver stackZIndex) mientras dura la transición.
// El resultado es la sensación de "esta foto se corre a un lado y se
// va" en vez de "esta foto desaparece" — el "se van pasando las
// fotos" que pidió Yocxany.
const EXIT_TRANSFORM = {
  transform: 'translate(calc(-50% + 58px), calc(-50% + 84px)) rotate(12deg) scale(0.78)',
  opacity: 0
};

// Pose de ARRANQUE de la animación de entrada — Yocxany pidió que, al
// entrar a esta subsección, las tarjetas "vayan cayendo desde arriba"
// y que ESO sea justo lo que explique el desorden (en vez de que el
// desorden sea sólo un detalle aparte de JITTER). Por eso acá no se
// inventa una pose nueva de caída: se reusa el MISMO jitter.rotate/dx
// de cada área (exagerado ×1.6/×1.5), como si cada tarjeta cayera
// "torcida" desde bien arriba y aterrizara justo en su lugar
// desordenado de siempre — el mismo desorden de reposo, sólo que
// ahora se ve cómo llegó ahí.
function fallStartTransform(jitter) {
  return {
    transform: `translate(calc(-50% + ${jitter.dx * 1.5}px), calc(-50% - 420px)) rotate(${jitter.rotate * 1.6}deg) scale(0.9)`,
    opacity: 0
  };
}

// Cuánto se atrasa cada tarjeta al entrar, según su distancia a la de
// adelante (0 = cae primera, así el nombre/ícono principal se lee de
// una; las que espían detrás van cayendo justo atrás, una tras otra).
// Primera vuelta de esto (55ms/680ms) le pareció a Yocxany "muy
// rápido" — le faltaba sentirse fluida/animada. Se subieron los dos
// números (más separación entre tarjeta y tarjeta, más recorrido por
// tarjeta) sin pasarse para el otro lado ("sin llegar a ser súper
// lento"), y de paso la caída ahora usa su PROPIA curva de easing
// (ver transitionTimingFunction más abajo, en vez de la plana que
// comparte con los clics): un reboteo sutil al aterrizar, la misma
// familia de curva que ya usa el "boop" de hover de DocenciaImpacto,
// para que se sienta viva y no sólo "cae y para en seco".
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
 * Ícono de cada tarjeta del mazo — círculo con un aro punteado
 * girando alrededor, MISMO patrón que CardIcon en DocenciaMision.jsx
 * ("Formación"): Yocxany pidió que el ícono fuera redondo y llevara
 * ese mismo aro de puntitos animado (orbitSpin, definido en
 * global.css), en vez del cuadrado redondeado que tenía antes.
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
 * Una tarjeta del mazo. Mismo lenguaje visual que ya usan las cartas
 * de DocenciaImpacto (fondo con degradado celeste institucional +
 * escudo del ICAP como marca de agua de fondo), pero en formato
 * "foto" vertical en vez de la carta blanca/navy con vuelta 3D — acá
 * no hay reverso: toda la info (ícono, nombre, descripción) va de
 * una, como en una ficha, porque lo que se anima es el PASO entre
 * tarjetas, no un volteo. Más CUADRADA que la primera versión —
 * Yocxany pidió bajarle lo alargado — y con el ícono circular de
 * AreaIcon en vez del cuadrado redondeado de antes (ver arriba).
 */
function AreaStackCard({ item, itemT, index, total, isFront, ui, tapHint, onSelect }) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={onSelect}
      // Sólo la de adelante y las dos que espían son de verdad
      // clickeables — las que están al fondo del mazo (opacity 0)
      // quedan `disabled`, así de una se sacan del tab order Y dejan
      // de capturar clics/toques en esa zona (aunque sean invisibles,
      // siguen ocupando el mismo rectángulo que las de adelante).
      disabled={isFront === null}
      aria-hidden={isFront === null}
      aria-label={isFront === 0 ? ui.next(itemT.name) : ui.goTo(itemT.name)}
      className="absolute inset-0 w-full h-full rounded-[2rem] shadow-xl shadow-slate-900/25 dark:shadow-black/50 overflow-hidden flex flex-col items-center text-center p-6 sm:p-8 cursor-pointer disabled:cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4FB2F2] focus-visible:ring-offset-2"
      style={{ background: CARD_BACKGROUND }}
    >
      <img
        src={icapEscudoWhite}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="absolute left-1/2 top-[55%] w-[80%] -translate-x-1/2 -translate-y-1/2 rotate-[-6deg] opacity-[0.14] pointer-events-none select-none"
      />

      <span className="relative font-mono-code text-[10px] sm:text-xs font-bold tracking-widest text-white/60 mt-1">
        {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>

      <div className="relative flex-1 flex flex-col items-center justify-center gap-3 sm:gap-4">
        <AreaIcon Icon={Icon} />
        <h3 className="font-heading font-extrabold text-lg sm:text-2xl text-white leading-tight px-1">{itemT.name}</h3>
        <p className="text-[11px] sm:text-sm text-white/85 leading-relaxed px-1">{itemT.description}</p>
      </div>

      {/* "Tocá para explorar" — el mismo tipo de señal que Miu Miu pone
          abajo de su primera foto (flechita + texto) para avisar que
          la tarjeta se puede tocar. Sólo tiene sentido mostrarlo en la
          de adelante: las que espían detrás no se leen completas, así
          que el aviso ahí sería ruido. */}
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
 * "Áreas" de Docencia — bloque 6 del brochure ("Áreas para los
 * desafíos del presente y del futuro").
 *
 * Historial: primero fue la rueda orbital de ValuesWheel (reciclada
 * de "Valores" de AT) — con 12 áreas los nombres se amontonaban.
 * Después pasó a un grid estático de 12 tarjetas (mismo patrón que
 * Impacto/Investigación/Publicaciones). Ahora Yocxany pidió el cambio
 * que había quedado anotado en IDEAS-PENDIENTES.md: un MAZO de
 * tarjetas apiladas, inspirado en el sitio de Miu Miu
 * (immersivebags.miumiu.com) — la de adelante a la vista completa,
 * un par espiando detrás, y cada clic "pasa" a la siguiente,
 * exactamente como pasar fotos de una pila una por una. El componente
 * sigue llamándose "AreasWheel" sólo por el nombre del archivo
 * (Propuesta1.jsx lo importa así) — nunca tuvo rueda ni mazo hasta
 * ahora.
 *
 * Cómo quedó definido (dos preguntas que ella misma contestó):
 *  1. No hay fotos reales todavía para las 12 áreas — en vez de dejar
 *     el mazo a medio hacer esperando fotografía, cada "foto" es una
 *     ficha con el mismo fondo celeste institucional del carrusel de
 *     AT, ícono grande, nombre y descripción — se puede reemplazar
 *     ese fondo por una imagen real por tarjeta el día que existan,
 *     sin tocar la mecánica del mazo.
 *  2. A diferencia de Miu Miu (que sólo deja "pasar" de una en una,
 *     sin saltar), acá si SE puede saltar directo a cualquiera de las
 *     12: hay puntitos abajo del mazo (mismo patrón que los del
 *     carrusel de AT) para ir directo a un área en particular, además
 *     de poder ir "pasando" tocando la tarjeta de adelante.
 *
 * Mecánica del apilado (ver stackTransform/stackZIndex arriba): NO es
 * una animación con fases tipo la del carrusel de AT o el abanico de
 * Impacto — acá alcanza con calcular, para cada una de las 12
 * tarjetas, qué tan lejos está (en pasos, circular) de la que está
 * "activa" ahora mismo, y aplicarle el transform/opacity que le toca
 * según esa distancia. Al cambiar de tarjeta activa, las 12 distancias
 * cambian de golpe y React vuelve a pintar sus estilos — como cada
 * tarjeta tiene `transition` en CSS, el navegador anima solo el paso
 * de un estado al otro, sin que haga falta escribir el "vuelo" a
 * mano. La única excepción es la tarjeta que ACABA de dejar de ser la
 * de adelante (ver `exitingIndex`): en vez de saltar directo a su
 * lugar en el fondo del mazo (quedaría tapada al instante), se le da
 * una pose de salida propia por unos milisegundos, para que se sienta
 * como que esa foto se corre a un lado en vez de desaparecer.
 *
 * El banner de cierre de "Comunidad" (DocenciaComunidad.jsx, sin
 * cambios) sigue fusionado acá debajo, como una segunda sección
 * dentro de esta misma página de "Áreas".
 *
 * SEGUNDA VUELTA — Yocxany vio esta primera versión y pidió tres
 * ajustes puntuales (le gustó la idea, pero se veía "muy parecido a
 * lo de Impacto, como si fuera una mano de cartas"):
 *  1. Tarjetas más cuadradas (antes muy alargadas verticales, más
 *     parecidas a una foto de producto que a una ficha).
 *  2. Ícono circular con el aro de puntitos animado, igual al de las
 *     cards de "Formación" (ver AreaIcon arriba) — antes era un
 *     cuadrado redondeado sin animación, muy parecido al ícono de
 *     Impacto.
 *  3. Que las tarjetas de atrás se vean "desordenadas" como en la
 *     referencia de Miu Miu, no en fila prolija — ver JITTER arriba:
 *     ese desorden fijo por ÁREA (no por posición en la pila) es lo
 *     que rompe la sensación de abanico/mano de cartas de Impacto,
 *     porque el ángulo de las que espían cambia de forma impredecible
 *     según cuáles dos áreas les toque estar ahí en cada momento, en
 *     vez de crecer siempre parejo como en un abanico de verdad.
 */
export default function DocenciaAreasWheel() {
  const { t, lang } = useLanguage();
  const c = t.docenciaAreas;
  const ui = UI[lang] || UI.es;
  const total = DOCENCIA_AREAS.length;

  const sectionRef = useRef(null);
  // Fase de entrada de TODO el mazo (no de una tarjeta en particular):
  //  'hidden'   — todavía no se entró a la sección: cada tarjeta está
  //               en su pose de "arranque" (ver fallStartTransform),
  //               arriba de todo e invisible.
  //  'falling'  — recién se entró: cada tarjeta anima desde esa pose
  //               de arranque hasta su lugar normal en la pila
  //               (stackTransform), con un poco de atraso según qué
  //               tan atrás le toque quedar (ver FALL_STAGGER_MS) —
  //               así van "cayendo" una detrás de otra, rápido.
  //  'settled'  — la caída ya terminó: de acá en adelante las
  //               tarjetas vuelven a animarse con la duración/delay
  //               normales de "pasar" tarjeta al hacer clic, sin el
  //               atraso escalonado de la entrada.
  // Igual que el resto de entradas del brochure (carrusel de AT,
  // abanico de Impacto): nunca se hace unobserve, así que si la
  // sección sale de pantalla vuelve a 'hidden' y la próxima vez se
  // repite completa la caída.
  const [phase, setPhase] = useState('hidden');
  const visible = phase !== 'hidden';
  const [activeIndex, setActiveIndex] = useState(0);
  // Índice de la tarjeta que ACABA de dejar de ser la de adelante —
  // sólo se usa para darle, por un ratito, una pose/():z-index de
  // salida distinta (ver EXIT_TRANSFORM/stackZIndex). Se limpia solo
  // con un setTimeout una vez que la transición ya terminó.
  const [exitingIndex, setExitingIndex] = useState(null);
  const exitTimeoutRef = useRef(null);
  const fallTimeoutRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;

    // Mismo motivo que en StatsSection/DocenciaImpacto: el
    // IntersectionObserver hay que sacarlo del window dueño del
    // documento donde vive la sección, no del window global del
    // módulo, para que también funcione dentro del iframe de "Vista
    // Móvil".
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

          {/* El mazo — contenedor relativo del tamaño de una tarjeta;
              las que espían detrás (y, mientras cae, cualquiera de las
              12) se salen un poco de esa caja hacia arriba/derecha/
              abajo a propósito (nada alrededor tiene overflow-hidden,
              así que no se recortan). El mb- extra compensa ese
              excedente (~45px hacia abajo), para que la distancia que
              SE VE hasta los puntitos sea la misma --docencia-gap que
              entre los demás elementos. Ya NO lleva su
              propio fade/slide de entrada (antes sí): con cada
              tarjeta cayendo por su cuenta (ver fallStartTransform),
              ese fundido aparte quedaba doble/redundante encima de la
              caída. */}
          <div className="relative w-64 h-80 sm:w-80 sm:h-96 mb-12">
            {DOCENCIA_AREAS.map((item, i) => {
              const itemT = c.items[item.id];
              const dist = distances[i];
              const isExiting = exitingIndex === i;
              const falling = phase === 'falling' && !isExiting;
              const pose = isExiting ? EXIT_TRANSFORM : phase === 'hidden' ? fallStartTransform(JITTER[i]) : stackTransform(dist, JITTER[i]);
              // Estrictamente MENOR a STACK_PEEK (0,1,2) — a esa
              // distancia exacta (3) stackTransform ya devuelve
              // opacity 0, así que no tiene sentido dejarla clickeable
              // ni en el tab order si no se ve nada.
              const withinPeek = dist < STACK_PEEK && !isExiting;
              const nextIndex = (activeIndex + 1) % total;

              return (
                <div
                  key={item.id}
                  // w/h explícitos acá (no sólo en el <button> de adentro)
                  // a propósito: sin esto, este div queda con tamaño 0×0
                  // (su único hijo es un absolute con inset-0, que no
                  // cuenta para el "shrink-to-fit" de un padre sin ancho
                  // fijo) y el translate(-50%, -50%) de más abajo termina
                  // calculando el "centrado" sobre una caja de 0px — la
                  // tarjeta se ve, pero anclada por su esquina arriba-
                  // izquierda en el centro del mazo, no centrada de verdad.
                  className="absolute left-1/2 top-1/2 w-64 h-80 sm:w-80 sm:h-96 transition-[transform,opacity]"
                  style={{
                    ...pose,
                    zIndex: stackZIndex(dist, isExiting),
                    // Mientras cae (fase 'falling'): duración más
                    // larga (FALL_DURATION_MS, el recorrido es mucho
                    // más largo que un simple "pasar" tarjeta) y un
                    // atraso según qué tan atrás le toque quedar, para
                    // que se vean cayendo una detrás de otra en vez de
                    // todas de un solo golpe. Asentada la caída (o
                    // mientras se sale, `isExiting`) vuelve a la
                    // duración/delay/curva normales de los clics.
                    transitionDuration: falling ? `${FALL_DURATION_MS}ms` : '520ms',
                    transitionDelay: falling ? `${Math.min(dist, STACK_PEEK) * FALL_STAGGER_MS}ms` : '0ms',
                    // La caída usa una curva con reboteo sutil al
                    // llegar (misma familia que el "boop" de hover de
                    // DocenciaImpacto) para que se sienta fluida y
                    // animada, no sólo "cae y para en seco" — los
                    // clics normales se quedan con la curva plana de
                    // siempre (sin rebote, se siente más directa).
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

          {/* Puntitos para saltar directo a cualquiera de las 12 áreas
              — mismo patrón visual que los del carrusel de Áreas de
              AT (SpecializationAreas.jsx), a pedido de Yocxany, como
              alternativa a ir "pasando" de a una tocando la tarjeta. */}
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
