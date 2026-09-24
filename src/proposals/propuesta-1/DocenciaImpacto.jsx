import React, { useEffect, useRef, useState } from 'react';
import { GraduationCap, Wrench, Search, Network, Lightbulb, RotateCw } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import KickerBadge from './KickerBadge';
import ClosingPhrase from './ClosingPhrase';
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
import icapEscudoWhite from '../../assets/icap-escudo-white.svg';
import icapEscudoCeleste from '../../assets/icap-escudo-celeste-vector.svg';

// Mismos ids que t.docenciaImpacto.items en translations.js.
const ITEMS = [
  { id: 'conocimientoEspecializado', icon: GraduationCap },
  { id: 'aplicacionPractica', icon: Wrench },
  { id: 'investigacion', icon: Search },
  { id: 'redesRegionales', icon: Network },
  { id: 'innovacion', icon: Lightbulb }
];

// Cuántos grados rota cada tarjeta respecto a la de al medio (índice 2 de
// 5): -2,-1,0,1,2 pasos × este valor = -18°,-9°,0°,9°,18°. Mismo valor en
// mobile y desktop a propósito — es un ángulo, no un px, así que se ve
// bien en los dos tamaños sin tener que duplicar la lógica por breakpoint.
const FAN_ROTATE_STEP = 9;

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
 * Cara de ADELANTE de la carta — número+ícono arriba, nombre debajo, y
 * el escudo del ICAP bien grande y notorio de fondo (antes era el mismo
 * ícono del pilar, chiquito y casi invisible al 10% de opacidad — ahora
 * es el escudo oficial, mucho más presente, para que la carta se sienta
 * de verdad "de la empresa"). Puntito con RotateCw abajo-derecha que
 * invita a tocar la carta (antes no había ninguna señal de que las
 * cartas hacían algo).
 */
function ImpactCardFront({ Icon, index, name }) {
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
          zoom, porque ya no hay un PNG rotado que interpolar. */}
      <img
        src={icapEscudoCeleste}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="absolute left-1/2 top-[60%] w-[66%] -translate-x-1/2 -translate-y-1/2 rotate-[-6deg] opacity-100 dark:hidden pointer-events-none select-none"
      />
      <img
        src={icapEscudoWhite}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="absolute left-1/2 top-[60%] w-[66%] -translate-x-1/2 -translate-y-1/2 rotate-[-6deg] opacity-0 dark:opacity-100 pointer-events-none select-none"
      />

      {/* Índice arriba-DERECHA (ícono+número) y el nombre justo debajo —
          la zona que se sigue viendo completa aunque la carta vecina se
          monte encima un poco. Celeste/celeste-clarito a propósito
          (Yocxany probó cambiarlo a navy/blanco y prefirió este color
          original) — el que sí alterna navy/blanco con el tema es la
          marca de agua del escudo, no este índice.
          Antes había un segundo índice repetido abajo-izquierda (para
          simular el índice doble de un naipe real) — Yocxany pidió
          quitarlo porque saturaba la carta junto con el escudo y el
          puntito de "voltear"; ahora abajo sólo queda ese puntito
          (ver más abajo), sin competencia. */}
      <div className="relative flex items-center justify-end gap-1.5 text-[#0077C8] dark:text-[#4FB2F2]">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        <span className="font-mono-code text-xs sm:text-sm font-bold">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <h3 className="relative text-center font-heading font-bold text-base sm:text-xl text-[#003366] dark:text-[#9FC6E8] leading-[1.25] mt-2.5 sm:mt-3">
        {nameLines(name).map((line) => (
          <span key={line} className="block whitespace-nowrap">
            {line}
          </span>
        ))}
      </h3>

      {/* Puntito que invita a tocar — la descripción completa no entra
          en la carta, así que esto avisa que hay más al voltearla. El
          animate-ping de atrás es sutil (un solo puntito, opacidad
          baja) para que se note pero no distraiga del nombre. Abajo-
          IZQUIERDA a propósito, en diagonal opuesta al índice de
          arriba-derecha — así los dos elementos quedan balanceados en
          esquinas contrarias en vez de amontonados del mismo lado. */}
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
function ImpactCardBack({ Icon, index, name, description }) {
  return (
    <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl bg-[#0077C8] dark:bg-[#001F3D] border border-[#0077C8] dark:border-white/15 shadow-xl shadow-slate-900/20 overflow-hidden flex flex-col items-center justify-center text-center p-3.5 sm:p-5 gap-2 sm:gap-2.5">
      <img
        src={icapEscudoWhite}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="absolute left-1/2 top-1/2 w-[86%] -translate-x-1/2 -translate-y-1/2 rotate-[5deg] opacity-[0.12] pointer-events-none select-none"
      />

      <Icon className="relative w-6 h-6 sm:w-7 sm:h-7 text-white/80 dark:text-[#4FB2F2] shrink-0" aria-hidden="true" />
      <h3 className="relative font-heading font-bold text-sm sm:text-base text-white dark:text-[#9FC6E8] leading-tight">
        {name}
      </h3>
      <p className="relative text-[10.5px] sm:text-[13px] text-white/90 dark:text-slate-300 leading-snug">{description}</p>
      <span className="relative font-mono-code text-[8px] sm:text-[9.5px] text-white/55 dark:text-white/30 mt-0.5">
        {String(index + 1).padStart(2, '0')} · toca para cerrar
      </span>
    </div>
  );
}

/**
 * El "abanico" completo de 5 cartas. Se dibujan en fila (flex) con
 * márgenes negativos para que se superpongan, y cada una rota un poco
 * más que la anterior alrededor de su borde inferior (origin-bottom):
 * rotar así, en vez de mover manualmente cada carta en X/Y, es lo que
 * logra el efecto real de "mano de cartas" — al rotar sobre el punto
 * medio de abajo, las bases quedan casi alineadas y las puntas de
 * arriba se abren solas, sin tener que calcular esa curva a mano.
 *
 * La carta del medio queda más alta en z-index (como la carta "de
 * encima" en una mano real) y las de los costados progresivamente por
 * debajo, sin importar si ya se revelaron o todavía están juntas.
 *
 * Yocxany pidió las cartas mucho más grandes — en mobile ya no entran
 * las 5 completas de una en 390px de ancho sin quedar minúsculas, así
 * que ahí el abanico se puede desplazar horizontal (overflow-x-auto +
 * scroll-snap) en vez de achicar todo para que quepa. Como hay que
 * deslizar para ver las de los costados, apenas se abre el abanico se
 * centra el scroll en la carta del medio (ver el useEffect de
 * scrollIntoView más abajo) — así es la más visible de entrada, que es
 * justo lo que se pidió. Desde `sm:` el contenedor tiene espacio de
 * sobra y el abanico completo entra sin necesidad de scroll.
 *
 * Después Yocxany notó que en mobile la carta salía "cortada" — en
 * realidad no había clipping real (medido con el bounding box contra
 * el <section>), sino que la carta vecina la tapaba bastante por el
 * overlap del abanico, y de paso sobraba espacio vertical en la
 * pantalla para hacer la carta más grande. Se subió el tamaño mobile
 * de 160×240px a 192×288px (+20%, misma proporción que antes) y, para
 * que el abanico se siga viendo igual de "de mano de cartas" con la
 * carta más ancha, el overlap (-ml) y el --step (la distancia que
 * recorre cada carta en la fase 'stacked') se recalcularon a la misma
 * proporción de antes: --step = ancho de carta − overlap. El padding
 * lateral del scroll (px-20) también subió en la misma proporción para
 * que las cartas de la punta se sigan pudiendo centrar del todo.
 *
 * Yocxany notó que las cartas no hacían nada al tocarlas y que la
 * descripción de cada pilar no cabía en el frente — dos problemas, una
 * sola solución: cada carta ahora es un botón que se VOLTEA en 3D (como
 * una carta de verdad) al tocarla, mostrando la descripción completa
 * del otro lado. Tres capas de transform por carta, cada una en su
 * propio elemento para que no se pisen entre sí:
 *   1) este wrapper (abajo) — la posición en el abanico: rotate/
 *      translateY/scale según fanPhase, MÁS un "levante" (se endereza,
 *      sube y crece un poco, y pasa al frente de todas con z-index 50)
 *      cuando está volteada, para que se lea cómoda sin que la tape una
 *      vecina.
 *   2) el <button> — el hover/active: al pasar el mouse "boopea" (sube,
 *      crece y gira un poquito con una curva que rebota de más y
 *      vuelve, tipo resorte) y al tocar/clickear se achica un toque,
 *      feedback bien notorio de que es clickeable.
 *   3) el div interno con perspective+preserve-3d — el volteo en sí
 *      (rotateY 0↔180) con las dos caras (frente/atrás) superpuestas y
 *      backface-visibility:hidden para que cada una sólo se vea de su
 *      lado, como una carta de baraja real.
 *
 * `fanPhase` tiene 3 valores (ver el estado en DocenciaImpacto):
 *   'hidden'  — todavía no llegó, invisible.
 *   'stacked' — el mazo entero aparece YA, todo apilado en el mismo
 *               punto (el de la carta del medio) — el "todas salen del
 *               medio" que pidió Yocxany.
 *   'fanned'  — cada carta viaja desde ese punto central hasta su
 *               lugar en el abanico, girando mientras se mueve
 *               (transitionDelay escalonado sólo en esta fase, así que
 *               salen una después de otra, no todas a la vez).
 *
 * El "viaje desde el medio" se logra con un translateX que en la fase
 * 'stacked' cancela la posición natural de cada carta en el layout
 * (flex + márgenes negativos) para que quede exactamente encima de la
 * carta del medio, y en 'fanned' vuelve a 0 (su lugar natural). Esa
 * distancia depende del ancho real de la carta, que cambia entre mobile
 * y sm+ — por eso vive en la variable CSS --step (ver className del
 * wrapper), no como número fijo en JS: el navegador resuelve el valor
 * que le toca según el breakpoint activo, sin tener que duplicar la
 * cuenta acá.
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
  const scrollRef = useRef(null);
  const midCardRef = useRef(null);

  // En mobile hay que deslizar para ver las cartas de los costados —
  // Yocxany pidió que de entrada salgan centradas en la del medio (la
  // más visible), en vez de arrancar pegado al borde izquierdo. Se
  // dispara apenas aparece el mazo (fase 'stacked', que es justo donde
  // vive la carta del medio en su posición de layout real — el
  // translateX de abajo es sólo visual, no mueve el scroll) para que ya
  // esté centrado ANTES de que el abanico empiece a abrirse, sin
  // "saltos" a mitad de la animación. `behavior: 'auto'` (instantáneo)
  // a propósito: el protagonista del momento es el abanico abriéndose,
  // no un scroll de página compitiendo al mismo tiempo. En sm+ no hay
  // overflow real (el abanico completo entra), así que esto no mueve
  // nada ahí — inofensivo.
  //
  // OJO: antes era `scrollIntoView({ inline: 'center', block: 'nearest' })`,
  // pero scrollIntoView mueve TODOS los contenedores con scroll hacia
  // arriba, incluido el <main> de la página — si la carta del medio no
  // entraba completa en pantalla, la página abría scrolleada hasta la
  // mitad de las cartas en vez de arriba, en el título. Ahora sólo se
  // mueve el scroll horizontal del propio abanico.
  useEffect(() => {
    if (phase !== 'stacked') return;
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
    const settleMs = (items.length - 1) * 90 + 750 + 80;
    const boopTimeoutId = setTimeout(() => setBoop(true), settleMs);
    return () => clearTimeout(boopTimeoutId);
  }, [phase, items.length]);

  return (
    <div
      ref={scrollRef}
      className="flex items-end sm:justify-center overflow-x-auto sm:overflow-visible -mx-4 px-20 sm:mx-0 sm:px-0 pb-1 snap-x snap-proximity sm:snap-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      role="list"
    >
      {items.map((item, i) => {
        const Icon = item.icon;
        const itemT = c.items[item.id];
        const offset = i - mid;
        const rotate = offset * FAN_ROTATE_STEP;
        const flipped = flippedId === item.id;
        const revealed = phase !== 'hidden';

        return (
          <div
            key={item.id}
            ref={i === midIndex ? midCardRef : undefined}
            role="listitem"
            className={`w-48 h-72 sm:w-56 sm:h-80 shrink-0 origin-bottom snap-center [--step:136px] sm:[--step:160px] ${i !== 0 ? '-ml-14 sm:-ml-16' : ''}`}
            style={{
              zIndex: flipped ? 50 : hoveredId === item.id ? 40 : 10 - Math.abs(offset),
              pointerEvents: phase === 'fanned' ? 'auto' : 'none',
              transform:
                phase === 'hidden'
                  ? 'translateX(0) rotate(0deg) translateY(28px) scale(0.86)'
                  : phase === 'stacked'
                    ? `translateX(calc(var(--step) * ${mid - i})) rotate(0deg) translateY(0) scale(0.92)`
                    : flipped
                      ? 'translateX(0) rotate(0deg) translateY(-20px) scale(1.12)'
                      : `translateX(0) rotate(${rotate}deg) translateY(0) scale(1)`,
              opacity: revealed ? 1 : 0,
              transitionProperty: 'transform, opacity',
              transitionDuration: phase === 'stacked' ? '450ms' : '750ms',
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              // Al pasar a 'stacked' TODAS entran juntas (delay 0) — el
              // "salen juntas, del medio". Recién al pasar a 'fanned' se
              // escalona por carta — el "y luego se abren".
              transitionDelay: phase === 'fanned' ? `${i * 90}ms` : '0ms'
            }}
          >
            <button
              type="button"
              onClick={() => setFlippedId(flipped ? null : item.id)}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId((current) => (current === item.id ? null : current))}
              aria-pressed={flipped}
              aria-label={`${itemT.name}: ${itemT.description}`}
              className={`group relative block w-full h-full [perspective:1200px] cursor-pointer rounded-2xl transition-transform duration-[420ms] [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-4 hover:scale-[1.16] hover:rotate-[-2deg] active:scale-95 active:duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0077C8] focus-visible:ring-offset-2 ${boop ? 'animate-card-boop' : ''}`}
            >
              <div
                className="relative w-full h-full [transform-style:preserve-3d] transition-transform duration-[650ms]"
                style={{
                  transform: `rotateY(${flipped ? 180 : 0}deg)`,
                  transitionTimingFunction: 'cubic-bezier(0.45, 0.05, 0.15, 1)'
                }}
              >
                <ImpactCardFront Icon={Icon} index={i} name={itemT.name} />
                <ImpactCardBack Icon={Icon} index={i} name={itemT.name} description={itemT.description} />
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
 * 4. Las cards ahora son un "abanico" tipo naipe (ver ImpactFan arriba),
 *    inspirado en la sección "What's up on socials" de landonorris.com,
 *    que se revela con scroll: llegan juntas/quietas y se abren en
 *    abanico con una leve espera entre una y otra, como si se repartiera
 *    una mano de cartas. El resto del bloque (kicker/texto/título)
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
 * 6. El "abanico" ahora entra en DOS tiempos en vez de uno: primero el
 *    mazo entero aparece junto (fase 'stacked'), y recién después de
 *    una pausa corta se abre en abanico (fase 'fanned') — antes las dos
 *    cosas pasaban a la vez con un solo fade+rotate, así que el "llegan
 *    juntas" nunca se alcanzaba a ver. El hover también "boopea" mucho
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
  // Fase del abanico: 'hidden' (nada, esperando) -> 'stacked' (el mazo
  // completo aparece YA junto, como si alguien lo pusiera sobre la mesa)
  // -> 'fanned' (recién ahí se abre en abanico, una detrás de otra). Ver
  // el comentario grande en ImpactFan para el detalle de cómo cada fase
  // se traduce en transform por carta.
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
    let fanTimeoutId;

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
            // Primero el mazo entero, junto — recién después de una
            // pausa corta se abre. Si esto se dejara en manos de un solo
            // transform (fade + rotate al mismo tiempo, como antes) el
            // "junto" nunca se llegaba a ver porque coincidía con la
            // carta todavía invisible (opacity 0).
            setFanPhase('stacked');
            fanTimeoutId = setTimeout(() => setFanPhase('fanned'), 420);
          } else {
            if (fanTimeoutId) clearTimeout(fanTimeoutId);
            setFanPhase('hidden');
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (fanTimeoutId) clearTimeout(fanTimeoutId);
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
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center gap-[var(--docencia-gap)]">
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
