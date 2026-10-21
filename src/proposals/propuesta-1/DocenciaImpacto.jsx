import React, { useEffect, useRef, useState } from 'react';
import { GraduationCap, Wrench, Search, Network, Lightbulb, RotateCw } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import KickerBadge from './KickerBadge';
import ClosingPhrase from './ClosingPhrase';
import EscudoICAP from '../../components/EscudoICAP';
// SVG vectorizado por Yocxany a partir del PNG original (Logo celeste.svg)
// — reemplaza los .png de abajo porque soluciona de raíz el borroneo al
// hacer zoom que preguntaba antes: un PNG rotado con CSS necesita
// interpolar píxeles, un SVG no, se ve nítido a cualquier tamaño. Ya no
// tiene el techo de opacidad ~66% que traían los PNG (ver comentario de
// ImpactCardFront más abajo) porque el fondo del sello viene sin pintar
// (transparente) en el archivo, no por opacidad.
//
// icapEscudoCeleste acá es el MISMO svg que subió Yocxany (Logo
// celeste.svg), sólo con el disco de fondo destintado para que funcione
// como marca de agua — es el que va en el frente de la carta en tema
// claro, a pedido de ella (probamos navy antes, pero quiere el celeste
// original). icap-escudo-navy.svg queda disponible en assets/ por si se
// necesita en otro lado más adelante, aunque ya no se usa en este archivo.

// Mismos ids que t.docenciaImpacto.items en translations.js.
const ITEMS = [
  { id: 'conocimientoEspecializado', icon: GraduationCap },
  { id: 'aplicacionPractica', icon: Wrench },
  { id: 'investigacion', icon: Search },
  { id: 'redesRegionales', icon: Network },
  { id: 'innovacion', icon: Lightbulb }
];

// Entrada tipo "cinta transportadora": al llegar a la sección las cartas
// entran deslizándose desde la izquierda (desde ENTRY_FROM, fuera de la
// pantalla) y frenan suave en su lugar, durante ENTRY_DURATION ms. La de
// más a la DERECHA arranca primero (es la que más lejos viaja) y cada
// una de las que siguen sale ENTRY_STAGGER ms después — así viajan en
// fila, casi pegadas, como sobre una cinta. Antes era un mazo apilado en
// el medio que se repartía en abanico (demasiado "baraja de naipes") y
// después un fade+subida desde abajo.
const ENTRY_FROM = '-100vw';
const ENTRY_DURATION = 1100;
const ENTRY_STAGGER = 70;

// Volteo automático: una vez que las cartas llegaron, se van volteando
// solas de a una — primero la del CENTRO y después hacia la IZQUIERDA
// (al llegar a la primera sigue por la de la punta derecha, y vuelve a
// empezar). Cada una queda mostrando su descripción AUTO_FLIP_HOLD ms,
// se cierra, y AUTO_FLIP_GAP ms después se voltea la siguiente. Se
// pausa con el mouse encima de las cartas y se apaga del todo apenas
// el usuario toca una (a partir de ahí manda él).
const AUTO_FLIP_HOLD = 3200;
const AUTO_FLIP_GAP = 700;

// Nombres de 2 palabras (ej. "Redes Regionales") se parten SIEMPRE una
// palabra por línea, en vez de dejar que el navegador decida dónde
// envolver el texto: a este tamaño de letra, según el ancho exacto que
// le toque a cada carta, el mismo texto a veces entraba en 1 línea (y
// se recortaba contra el borde) y a veces en 2 — partirlo a mano hace
// que el ancho de cada línea sea siempre previsible (nunca más largo
// que la palabra más larga) sin importar breakpoint ni redondeos.
function nameLines(name) {
  return name.split(' ');
}

/**
 * Cara de ADELANTE de la carta — ícono grande al centro, nombre debajo, y
 * el escudo del ICAP bien grande y notorio de fondo (antes era el mismo
 * ícono del pilar, chiquito y casi invisible al 10% de opacidad — ahora
 * es el escudo oficial, mucho más presente, para que la carta se sienta
 * de verdad "de la empresa"). Puntito con RotateCw abajo-derecha que
 * invita a tocar la carta (antes no había ninguna señal de que las
 * cartas hacían algo).
 */
function ImpactCardFront({ Icon, name }) {
  return (
    <div className="absolute inset-0 [backface-visibility:hidden] rounded-2xl bg-white dark:bg-[#003366] border border-slate-100 dark:border-white/10 shadow-xl shadow-slate-900/15 dark:shadow-black/40 overflow-hidden flex flex-col p-3 sm:p-4">
      {/* Regla fija del escudo: fondo oscuro → escudo blanco, fondo
          claro → escudo celeste (el mismo Logo celeste.svg que subió
          Yocxany, tal cual — probamos navy antes por contraste, pero
          ella prefiere el celeste original ahí). Antes esto eran los
          .png (icap-escudo-*.png), que traían un techo de opacidad real
          ≈66% ya horneado en el archivo — por eso nunca se veía tan
          notorio como pedía Yocxany sin importar cuánto subiera la
          opacidad en CSS. Ahora son los .svg (ver el comentario del
          import arriba): sin ese techo, así que opacity-100 acá sí es
          100% de verdad — y de paso se arregla el borroneo al hacer
          zoom, porque ya no hay un PNG rotado que interpolar.
          Posición: esquina abajo-DERECHA, grande y recortado por el
          borde de la carta — antes iba al centro, pero ahora el centro
          es del ícono del pilar y chocaban (pedido de Yocxany). Abajo-
          izquierda queda libre para el puntito de "voltear". */}
      <EscudoICAP
        tono="celeste"
        className="absolute -right-[20%] -bottom-[12%] w-[62%] rotate-[-12deg] opacity-100 dark:hidden pointer-events-none"
      />
      <EscudoICAP
        tono="white"
        className="absolute -right-[20%] -bottom-[12%] w-[62%] rotate-[-12deg] opacity-0 dark:opacity-100 pointer-events-none"
      />

      {/* Ícono del pilar ARRIBA de la carta (centrado a lo ancho), con
          el mismo estilo que el ícono de las tarjetas de Formación
          (CardIcon en DocenciaMision.jsx): círculo celeste clarito con
          un aro punteado que gira. El nombre queda centrado en el
          espacio que sobra debajo. Historial: antes iba chiquito
          arriba-derecha junto al número (01–05) como índice de naipe;
          después se quitó el número y se probó el ícono al centro con
          el nombre pegado debajo; Yocxany lo pidió así, arriba y con el
          nombre centrado aparte. */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mt-3 sm:mt-4 shrink-0">
        <div
          className="absolute -inset-1.5 rounded-full border border-dashed border-[#0077C8]/45 dark:border-white/25 pointer-events-none"
          style={{ animation: 'orbitSpin 9s linear infinite' }}
          aria-hidden="true"
        />
        <div className="relative w-full h-full rounded-full bg-[#EAF3FB] dark:bg-white/10 text-[#0077C8] dark:text-[#4FB2F2] flex items-center justify-center">
          <Icon className="w-9 h-9 sm:w-11 sm:h-11" strokeWidth={1.7} />
        </div>
      </div>

      <div className="relative flex-1 flex items-center justify-center pb-14">
        <h3 className="text-center font-heading font-bold text-lg xl:text-xl text-[#003366] dark:text-[#9FC6E8] leading-[1.25]">
          {nameLines(name).map((line) => (
            <span key={line} className="block whitespace-nowrap">
              {line}
            </span>
          ))}
        </h3>
      </div>

      {/* Puntito que invita a tocar — la descripción completa no entra
          en la carta, así que esto avisa que hay más al voltearla. El
          animate-ping de atrás es sutil (un solo puntito, opacidad
          baja) para que se note pero no distraiga del nombre. Abajo-
          IZQUIERDA, en la esquina, para no competir con el ícono y el
          nombre del centro. */}
      <div className="absolute bottom-2.5 left-2.5 sm:bottom-3.5 sm:left-3.5 flex items-center justify-center" aria-hidden="true">
        <span className="absolute inline-flex h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-[#0077C8]/20 dark:bg-[#4FB2F2]/20 animate-ping" />
        <RotateCw className="relative w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0077C8]/70 dark:text-[#4FB2F2]/70" />
      </div>
    </div>
  );
}

/**
 * Cara de ATRÁS — aparece al tocar la carta. Fondo celeste (en vez de
 * blanco/navy como el frente) para que se note clarísimo que es "el
 * otro lado", el nombre arriba y la descripción completa abajo — la
 * misma que no entraba en el frente.
 *
 * El escudo de fondo aquí es SIEMPRE blanco, sin alternar con el tema
 * (a diferencia del frente): se probó alternar navy/blanco igual que
 * el frente, pero en el fondo celeste de esta cara el navy nunca hace
 * contraste real — celeste y navy son los dos tonos de azul del
 * mismo color, así que un navy encima de celeste se ve casi del mismo
 * tono sin importar cuánto suba la opacidad (es matemático, no un
 * tema de gusto). Blanco sí contrasta bien contra los dos fondos que
 * puede tener esta cara (celeste de día, navy de noche), así que se
 * queda fijo en blanco en los dos temas.
 *
 * Ojo con la opacidad acá — a diferencia del frente (que sólo tiene el
 * nombre encima), esta cara tiene el nombre Y la descripción completa
 * Y el pie de "toca para cerrar", mucho más texto compitiendo con el
 * escudo por el mismo espacio. Subirla a 0.32 (como el frente) se veía
 * "enredado" con esas letras — Yocxany pidió bajarla harto acá
 * específicamente, así que queda más baja que en el frente e incluso
 * que el valor original (0.12 vs 0.16 de antes): sigue ahí, se nota
 * como motivo, pero no le compite al texto que sí importa que se lea
 * fácil.
 */
function ImpactCardBack({ Icon, name, description }) {
  return (
    <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl bg-[#0077C8] dark:bg-[#001F3D] border border-[#0077C8] dark:border-white/15 shadow-xl shadow-slate-900/20 overflow-hidden flex flex-col items-center justify-center text-center p-4 sm:p-5 gap-2.5 sm:gap-3">
      <EscudoICAP
        tono="white"
        className="absolute left-1/2 top-1/2 w-[86%] -translate-x-1/2 -translate-y-1/2 rotate-[5deg] opacity-[0.12] pointer-events-none"
      />

      <Icon className="relative w-7 h-7 sm:w-8 sm:h-8 text-white/80 dark:text-[#4FB2F2] shrink-0" aria-hidden="true" />
      <h3 className="relative font-heading font-bold text-base sm:text-lg text-white dark:text-[#9FC6E8] leading-tight">
        {name}
      </h3>
      <p className="relative text-xs sm:text-sm text-white/90 dark:text-slate-300 leading-snug">{description}</p>
      <span className="relative font-mono-code text-[9px] sm:text-[10px] text-white/55 dark:text-white/30 mt-0.5">
        toca para cerrar
      </span>
    </div>
  );
}

/**
 * Las 5 cartas, DERECHAS y SEPARADAS en fila, como tarjetas normales.
 * Antes eran un "abanico" de naipes (encimadas con márgenes negativos y
 * rotadas alrededor de su borde inferior), pero no gustó que pareciera
 * una baraja — se quitaron la rotación y el overlap.
 *
 * Layout: en mobile y tablet la fila se desliza horizontal
 * (overflow-x-auto + scroll-snap) con cartas de 192×288px; el padding
 * lateral de calc(50vw − media carta) deja que hasta las de las puntas
 * se puedan centrar. Apenas entran se centra el scroll en la del medio
 * (ver el useEffect más abajo). Desde `lg:` hay espacio de sobra y pasa
 * a una grilla de 5 columnas fluidas (aspect 2/3), sin scroll. El py-6
 * es para que el levante del hover/volteo no se recorte contra el
 * overflow del scroll.
 *
 * Yocxany notó que las cartas no hacían nada al tocarlas y que la
 * descripción de cada pilar no cabía en el frente — dos problemas, una
 * sola solución: cada carta ahora es un botón que se VOLTEA en 3D (como
 * una carta de verdad) al tocarla, mostrando la descripción completa
 * del otro lado. Tres capas de transform por carta, cada una en su
 * propio elemento para que no se pisen entre sí:
 *   1) este wrapper (abajo) — la entrada (translateY/scale según
 *      fanPhase), MÁS un "levante" (sube y crece un poco, y pasa al
 *      frente de todas con z-index 50)
 *      cuando está volteada, para que se lea cómoda sin que la tape una
 *      vecina.
 *   2) el <button> — el hover/active: al pasar el mouse "boopea" (sube
 *      y crece un poquito con una curva que rebota de más y
 *      vuelve, tipo resorte) y al tocar/clickear se achica un toque,
 *      feedback bien notorio de que es clickeable.
 *   3) el div interno con perspective+preserve-3d — el volteo en sí
 *      (rotateY 0↔180) con las dos caras (frente/atrás) superpuestas y
 *      backface-visibility:hidden para que cada una sólo se vea de su
 *      lado, como una carta de baraja real.
 *
 * `fanPhase` tiene 2 valores (ver el estado en DocenciaImpacto):
 *   'hidden' — todavía no llegó: invisible, fuera de pantalla a la
 *              izquierda.
 *   'fanned' — cada carta se desliza a su lugar tipo cinta
 *              transportadora (ver ENTRY_* arriba).
 * Antes había una fase intermedia 'stacked' (mazo apilado en el medio
 * que después se repartía en abanico), pero se sentía demasiado "baraja
 * de naipes" y se quitó — ahora entran como tarjetas normales.
 */
function ImpactFan({ items, c, phase }) {
  const mid = (items.length - 1) / 2;
  const midIndex = Math.round(mid);
  const [flippedId, setFlippedId] = useState(null);
  // Con el "boop" de hover tan grande (sube, crece y gira), si a la
  // carta le tocaba estar detrás de una vecina (las de los costados del
  // abanico), el boop quedaba tapado por esa vecina — se nota mucho más
  // que antes justamente porque ahora el boop es grande. Por eso el
  // z-index también sube en hover, para que la carta bajo el mouse
  // siempre pase completa al frente mientras dura el boop.
  const [hoveredId, setHoveredId] = useState(null);
  // "Boop" final sincronizado: un rebotecito chiquito que pegan TODAS
  // las cartas a la vez, justo después de que termina de abrirse el
  // abanico (a diferencia del boop de hover, que es por carta y sólo
  // al pasar el mouse). Ver el useEffect de abajo para el cálculo del
  // momento exacto en que dispara, y .animate-card-boop en global.css
  // para el porqué de aplicarlo sobre el <button> y no sobre este
  // wrapper.
  const [boop, setBoop] = useState(false);
  // Carta que el volteo automático tiene abierta ahora (ver
  // AUTO_FLIP_*). Separada de flippedId (la que eligió el usuario):
  // apenas el usuario toca una carta, autoStopped apaga el automático.
  const [autoFlipId, setAutoFlipId] = useState(null);
  const [autoStopped, setAutoStopped] = useState(false);
  const autoPausedRef = useRef(false);
  const scrollRef = useRef(null);
  const midCardRef = useRef(null);

  // En mobile hay que deslizar para ver las cartas de los costados —
  // Yocxany pidió que de entrada salgan centradas en la del medio (la
  // más visible), en vez de arrancar pegado al borde izquierdo. Se
  // dispara apenas empiezan a entrar las cartas (los transforms son sólo
  // visuales, no mueven el scroll) para que ya esté centrado desde el
  // primer frame, sin "saltos" a mitad de la animación. `behavior:
  // 'auto'` (instantáneo) a propósito: el protagonista del momento son
  // las cartas entrando, no un scroll de página compitiendo al mismo
  // tiempo. En lg+ no hay overflow real (la grilla entra), así que esto no mueve
  // nada ahí — inofensivo.
  //
  // OJO: antes era `scrollIntoView({ inline: 'center', block: 'nearest' })`,
  // pero scrollIntoView mueve TODOS los contenedores con scroll hacia
  // arriba, incluido el <main> de la página — si la carta del medio no
  // entraba completa en pantalla, la página abría scrolleada hasta la
  // mitad de las cartas en vez de arriba, en el título. Ahora sólo se
  // mueve el scroll horizontal del propio abanico.
  useEffect(() => {
    if (phase !== 'fanned') return;
    const box = scrollRef.current;
    const card = midCardRef.current;
    if (!box || !card) return;
    const boxRect = box.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    box.scrollLeft += cardRect.left + cardRect.width / 2 - (boxRect.left + boxRect.width / 2);
  }, [phase]);

  // La última carta en llegar a su lugar es la del índice más alto
  // (transitionDelay = (items.length - 1) * 90ms) y tarda 750ms más en
  // asentarse — recién ahí, con el abanico entero quieto, dispara el
  // boop sobre TODAS a la vez (sin escalonar, a diferencia de cómo se
  // abrieron). +80ms de colchón para no pisar la cola de esa última
  // transición. Se apaga (setBoop(false)) apenas se sale de 'fanned'
  // para que la próxima vez que la sección vuelva a ser visible, la
  // animación se pueda disparar de nuevo (si la clase nunca se quita,
  // React no la vuelve a "montar" y el boop no se repite).
  useEffect(() => {
    if (phase !== 'fanned') {
      setBoop(false);
      return undefined;
    }
    const settleMs = (items.length - 1) * ENTRY_STAGGER + ENTRY_DURATION + 80;
    const boopTimeoutId = setTimeout(() => setBoop(true), settleMs);
    return () => clearTimeout(boopTimeoutId);
  }, [phase, items.length]);

  // Volteo automático, en cadena de timeouts: espera a que las cartas
  // terminen de llegar (+ el boop), y después voltea una, la deja
  // AUTO_FLIP_HOLD, la cierra, espera AUTO_FLIP_GAP y sigue con la
  // próxima del orden centro → izquierda → (vuelta por la derecha).
  // Si el mouse está encima (autoPausedRef), no abre la siguiente
  // hasta que se vaya.
  useEffect(() => {
    if (phase !== 'fanned' || autoStopped) {
      setAutoFlipId(null);
      return undefined;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const n = items.length;
    const order = Array.from({ length: n }, (_, k) => (midIndex - k + n) % n);
    let k = 0;
    let timeoutId;

    const flipNext = () => {
      if (autoPausedRef.current) {
        timeoutId = setTimeout(flipNext, 400);
        return;
      }
      setAutoFlipId(items[order[k % n]].id);
      timeoutId = setTimeout(() => {
        setAutoFlipId(null);
        k += 1;
        timeoutId = setTimeout(flipNext, AUTO_FLIP_GAP);
      }, AUTO_FLIP_HOLD);
    };

    const startMs = (n - 1) * ENTRY_STAGGER + ENTRY_DURATION + 900;
    timeoutId = setTimeout(flipNext, startMs);
    return () => clearTimeout(timeoutId);
  }, [phase, autoStopped, items, midIndex]);

  return (
    <div
      ref={scrollRef}
      className="flex gap-4 overflow-x-auto -mx-4 sm:-mx-6 px-[calc(50vw-7rem)] py-6 snap-x snap-proximity lg:grid lg:grid-cols-5 lg:gap-5 lg:overflow-visible lg:mx-0 lg:px-0 lg:snap-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      role="list"
      onMouseEnter={() => {
        autoPausedRef.current = true;
      }}
      onMouseLeave={() => {
        autoPausedRef.current = false;
      }}
    >
      {items.map((item, i) => {
        const Icon = item.icon;
        const itemT = c.items[item.id];
        const offset = i - mid;
        const flipped = flippedId === item.id || (flippedId === null && autoFlipId === item.id);
        const revealed = phase !== 'hidden';

        return (
          <div
            key={item.id}
            ref={i === midIndex ? midCardRef : undefined}
            role="listitem"
            className="w-56 h-[21rem] shrink-0 snap-center lg:w-auto lg:h-auto lg:aspect-[2/3]"
            style={{
              zIndex: flipped ? 50 : hoveredId === item.id ? 40 : 10 - Math.abs(offset),
              pointerEvents: phase === 'fanned' ? 'auto' : 'none',
              // Entrada tipo cinta transportadora — ver ENTRY_*.
              transform:
                phase === 'hidden'
                  ? `translateX(${ENTRY_FROM})`
                  : flipped
                    ? 'translateX(0) translateY(-12px) scale(1.06)'
                    : 'translateX(0) translateY(0) scale(1)',
              opacity: revealed ? 1 : 0,
              transitionProperty: 'transform, opacity',
              // El fade es más corto que el viaje para que la carta ya
              // se vea entera mientras todavía se desliza.
              transitionDuration: `${ENTRY_DURATION}ms, 500ms`,
              // Arranca rápido y frena suave, como la cinta al detenerse.
              transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
              // La de más a la derecha primero, las demás detrás en fila.
              transitionDelay: revealed ? `${(items.length - 1 - i) * ENTRY_STAGGER}ms` : '0ms'
            }}
          >
            <button
              type="button"
              onClick={() => {
                setAutoStopped(true);
                setFlippedId(flipped ? null : item.id);
              }}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId((current) => (current === item.id ? null : current))}
              aria-pressed={flipped}
              aria-label={`${itemT.name}: ${itemT.description}`}
              className={`group relative block w-full h-full [perspective:1200px] cursor-pointer rounded-2xl transition-transform duration-[420ms] [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-3 hover:scale-[1.06] active:scale-95 active:duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0077C8] focus-visible:ring-offset-2 ${boop ? 'animate-card-boop' : ''}`}
            >
              <div
                className="relative w-full h-full [transform-style:preserve-3d] transition-transform duration-[650ms]"
                style={{
                  transform: `rotateY(${flipped ? 180 : 0}deg)`,
                  transitionTimingFunction: 'cubic-bezier(0.45, 0.05, 0.15, 1)'
                }}
              >
                <ImpactCardFront Icon={Icon} name={itemT.name} />
                <ImpactCardBack Icon={Icon} name={itemT.name} description={itemT.description} />
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
}

/**
 * "Impacto" de Docencia — bloque 3 del brochure ("Formación para generar
 * impacto"). Yocxany pidió tres cambios sobre la versión anterior (grid
 * simple de 5 tarjetas cuadradas, kicker chiquito, orden kicker→título→
 * texto→cards):
 *
 * 1. El kicker ahora usa el mismo KickerBadge (píldora + puntito) que la
 *    página "Formación" de DocenciaMision — ver ese componente.
 * 2. Orden nuevo: kicker → texto (subtitle) → título ("La Experiencia
 *    ICAP Integra") → cards → frase de cierre. Antes el título iba
 *    primero; ahora va después del texto y justo antes de las cartas.
 * 3. Espaciado parejo entre las 5 piezas (kicker/texto/título/cards/
 *    frase): a diferencia de la página dedicada "Formación" (que es de
 *    pantalla completa, con el menú de arriba como límite), esta sección
 *    es un bloque más dentro del scroll normal de la página, sin ese
 *    límite fijo arriba — así que acá "los mismos márgenes entre las
 *    partes" se logra con un simple `gap` parejo en el contenedor flex,
 *    en vez del truco de justify-evenly (que sólo tiene sentido cuando
 *    hay una altura fija que repartir).
 * 4. Las cards son tarjetas derechas en fila (ver ImpactFan arriba) que
 *    se revelan con scroll: entran deslizándose desde la izquierda como
 *    sobre una cinta transportadora (ver ENTRY_*). (Antes eran un abanico tipo naipe inspirado en
 *    landonorris.com, pero no gustó.) El resto del bloque (kicker/texto/título)
 *    también entra con un fade+subida sutil al llegar a la sección — el
 *    mismo patrón de IntersectionObserver que ya usa StatsSection.jsx —
 *    para que toda la sección se sienta como un solo momento de entrada,
 *    no sólo las cartas.
 * 5. Cada carta se puede TOCAR y se VOLTEA en 3D (como una carta real)
 *    para mostrar la descripción completa del pilar del otro lado — no
 *    entraba en el frente sin verse apretada. Antes de esto las cartas
 *    no tenían ningún indicio de ser interactivas; ahora llevan un
 *    puntito con ícono de "voltear" (abajo-derecha) que lo avisa, más
 *    un levante/crecida sutil al tocarlas (ver ImpactFan).
 * 6. La entrada de las cartas ya NO es "repartir una mano de naipes"
 *    (mazo apilado que se abre): no gustó, así que ahora cada carta sube
 *    a su lugar deslizándose desde la izquierda, tipo cinta
 *    transportadora (ver ENTRY_* arriba). El hover también "boopea" mucho
 *    más (sube, crece y gira un poco con una curva que rebota) y las
 *    cartas son más grandes todavía — en mobile, como hay que
 *    deslizarlas, apenas se abren se centra el scroll en la del medio
 *    para que sea la más visible de entrada (ver el useEffect de
 *    scrollIntoView en ImpactFan).
 */
export default function DocenciaImpacto() {
  const { t } = useLanguage();
  const c = t.docenciaImpacto;

  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  // Fase de las cartas: 'hidden' (esperando) -> 'fanned' (entran). Ver
  // el comentario grande en ImpactFan para el detalle por carta.
  const [fanPhase, setFanPhase] = useState('hidden');

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;

    // Mismo motivo que en StatsSection.jsx: si esta sección se renderiza
    // adentro del iframe de "Vista Móvil" (ver DeviceFrame.jsx), el
    // IntersectionObserver hay que sacarlo del window dueño de ese
    // documento, no del window global del módulo.
    const view = el.ownerDocument?.defaultView;
    const IO = view?.IntersectionObserver;

    if (!IO) {
      setVisible(true);
      setFanPhase('fanned');
      return undefined;
    }

    const observer = new IO(
      (entries) => {
        entries.forEach((entry) => {
          setVisible(entry.isIntersecting);
          if (entry.isIntersecting) {
            setFanPhase('fanned');
          } else {
            setFanPhase('hidden');
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="px-4 sm:px-6 py-[var(--docencia-gap)] bg-[#D6E9F7] dark:bg-[#001F3D] relative overflow-hidden"
    >
      {/* Separación amplia y FIJA entre cada elemento (kicker, texto,
          título, abanico, conclusión), igual arriba y abajo — para que
          cada uno tenga su propio espacio como en Formación. Se probó
          copiar el justify-evenly de Formación, pero acá el contenido
          (sobre todo el abanico) ya ocupa casi toda la pantalla, así
          que no sobraba espacio para repartir y todo seguía "apelotado"
          (palabras de Yocxany). Un gap fijo no depende de eso. */}
      {/* max-w-6xl/7xl (antes 5xl) para que la grilla de 5 cartas en
          desktop tenga más ancho y las cartas salgan más grandes — el
          párrafo ya tiene su propio max-w-xl, así que no se estira. */}
      <div className="max-w-6xl xl:max-w-7xl mx-auto flex flex-col items-center text-center gap-[var(--docencia-gap)]">
        <div
          className="transition-all duration-700 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)'
          }}
        >
          <KickerBadge>{c.kicker}</KickerBadge>
        </div>

        <p
          className="text-sm sm:text-base text-slate-700 dark:text-slate-300 max-w-xl mx-auto leading-relaxed transition-all duration-700 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transitionDelay: visible ? '90ms' : '0ms'
          }}
        >
          {c.subtitle}
        </p>

        <h2
          className="font-heading font-extrabold text-2xl sm:text-3xl text-[#003366] dark:text-[#9FC6E8] tracking-tight transition-all duration-700 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transitionDelay: visible ? '180ms' : '0ms'
          }}
        >
          {c.title}
        </h2>

        <div className="w-full py-2 sm:py-3">
          <ImpactFan items={ITEMS} c={c} phase={fanPhase} />
        </div>

        {/* Igual que la frase de cierre del Hero de Formación (ver
            ClosingPhrase.jsx). El boop espera a que termine el fade de
            entrada (450ms de delay + 700ms de duración). */}
        <ClosingPhrase
          className="transition-all duration-700 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transitionDelay: visible ? '450ms' : '0ms'
          }}
          boopDelay={1150}
        >
          {c.tagline}
        </ClosingPhrase>
      </div>
    </section>
  );
}
