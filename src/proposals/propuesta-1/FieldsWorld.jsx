import React, { useCallback, useRef, useState } from 'react';

/**
 * "Mundo" interactivo de campos de interés de Investigación
 * (DocenciaInvestigacion.jsx). Yocxany pidió, textual: "como una
 * lluvia de ideas que anden por ahí sin que choquen entre ellas, pero
 * que formen un tipo de mundo donde van como girando, pero que si se
 * pueda interactuar con dicho mundo" — en vez de los chips estáticos
 * en fila que había antes.
 *
 * Diseño:
 * - Los campos se reparten en 3 anillos concéntricos (según
 *   `index % 3`, para que queden intercalados en vez de los primeros
 *   3 en un anillo y los últimos en otro). Cada anillo tiene su
 *   propio radio (vía `inset` — ver abajo), duración y sentido de
 *   giro (anillos alternos van en sentidos opuestos, como un
 *   pequeño sistema orbital) — así, aunque técnicamente es un plano
 *   2D y no una esfera de verdad, en la práctica casi nunca se
 *   "chocan": los de un mismo anillo guardan SIEMPRE la misma
 *   distancia entre sí (misma velocidad angular, arrancan parejos), y
 *   los de anillos distintos viven a radios distintos.
 * - El truco de dos capas por chip (`.field-orbit` +
 *   `.field-orbit-counter`, keyframes en global.css) hace que cada
 *   uno viaje en círculo SIN que su texto quede girando de cabeza —
 *   ver el comentario grande en global.css.
 * - "Interactuar con el mundo": se puede arrastrar (mouse o touch)
 *   para girarlo, como si fuera un globo — se trackea el ángulo del
 *   puntero respecto al centro y ese delta se acumula en `spin`
 *   (grados). OJO: `spin` NO se aplica como un `rotate` aparte por
 *   fuera de todo — eso fue la primera versión y quedó mal: al
 *   arrastrar, el texto de los chips terminaba de lado/ilegible,
 *   porque ese `rotate` extra vivía en un wrapper que el
 *   counter-rotate de cada chip no conocía, así que no lo cancelaba.
 *   La solución fue sumar `spin` directamente al `startAngle` de cada
 *   chip (mismo ángulo que ya usan tanto `.field-orbit` como
 *   `.field-orbit-counter` — ver el `map` de abajo), para que quede
 *   adentro de la misma cuenta que ya se cancela sola: arrastrar de
 *   verdad CORRE los chips por su anillo (cambia dónde están) en vez
 *   de sólo inclinar visualmente el conjunto, y el texto se queda
 *   derecho siempre. Aparte, cada chip tiene su propio hover (se
 *   agranda un toque) para que se sienta que responde al mouse
 *   también sin necesidad de arrastrar.
 */

// Mismo criterio que otros datos "fijos" del brochure (ver ITEMS en
// DocenciaMision.jsx): acá sólo vive la geometría/timing de cada
// anillo, no el texto — el texto (`fields`) llega por props desde
// translations.js, así funciona igual en español e inglés.
//
// `insetPercent` deja bastante margen (sobre todo el anillo 3, el de
// afuera) porque el punto de anclaje del chip está SOBRE el borde del
// anillo, pero el chip mismo (la píldora con el texto) es más ancho
// que ese punto — con nombres largos ("Integración centroamericana")
// el chip se corre bastante más allá del anillo. Con poco margen eso
// se salía del contenedor del "mundo" Y de la pantalla en mobile
// (medido con Playwright: 46px de scroll horizontal de más). Estos
// valores dejan colchón de sobra para que ni el más largo se pase.
const RINGS = [
  { insetPercent: 36, duration: 26, direction: 'normal', phase: 0 },
  { insetPercent: 24, duration: 34, direction: 'reverse', phase: 45 },
  { insetPercent: 14, duration: 44, direction: 'normal', phase: 22 }
];

function angleFromCenter(clientX, clientY, rect) {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  return (Math.atan2(clientY - cy, clientX - cx) * 180) / Math.PI;
}

export default function FieldsWorld({ fields }) {
  const worldRef = useRef(null);
  const [spin, setSpin] = useState(0);
  const dragState = useRef(null);

  const handlePointerDown = useCallback((event) => {
    const world = worldRef.current;
    if (!world) return;
    const rect = world.getBoundingClientRect();
    dragState.current = { rect, lastAngle: angleFromCenter(event.clientX, event.clientY, rect) };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }, []);

  const handlePointerMove = useCallback((event) => {
    if (!dragState.current) return;
    const { rect, lastAngle } = dragState.current;
    const angle = angleFromCenter(event.clientX, event.clientY, rect);
    // Diferencia normalizada a [-180, 180] para que no "salte" cuando
    // el ángulo cruza de 180 a -180 (el punto donde atan2 da la vuelta).
    let delta = angle - lastAngle;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    dragState.current.lastAngle = angle;
    setSpin((prev) => prev + delta);
  }, []);

  const stopDragging = useCallback(() => {
    dragState.current = null;
  }, []);

  return (
    <div
      ref={worldRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDragging}
      onPointerLeave={stopDragging}
      onPointerCancel={stopDragging}
      className="relative mx-auto w-full max-w-[19rem] sm:max-w-[24rem] md:max-w-[28rem] aspect-square rounded-full cursor-grab active:cursor-grabbing touch-none select-none bg-[radial-gradient(circle_at_center,#EAF3FB_0%,#D6E9F7_65%,#c3ddf0_100%)] dark:bg-[radial-gradient(circle_at_center,#00294d_0%,#001F3D_65%,#001830_100%)] border border-[#0077C8]/15 dark:border-white/10 shadow-inner"
    >
      {/* Anillos-guía apenas visibles, sólo decorativos (marcan las
          "órbitas" para que se lea como un mundo/sistema, no como
          chips sueltos flotando sin lógica). */}
      {RINGS.map((ring, i) => (
        <div
          key={`guide-${i}`}
          aria-hidden="true"
          className="absolute rounded-full border border-[#0077C8]/10 dark:border-white/10 pointer-events-none"
          style={{ inset: `${ring.insetPercent}%` }}
        />
      ))}

      {fields.map((field, index) => {
        const ring = RINGS[index % RINGS.length];
        const posInRing = Math.floor(index / RINGS.length);
        const itemsInRing = Math.ceil(fields.length / RINGS.length);
        // El arrastre (`spin`) se SUMA acá, adentro del mismo ángulo que
        // ya cancela `.field-orbit-counter` (ver global.css) — así el
        // chip de verdad se corre por el anillo al arrastrar (no sólo
        // "parece" que gira) y el texto se queda derecho de todos
        // modos. La primera versión aplicaba `spin` como un `rotate`
        // aparte en un wrapper por fuera de todo esto, que NINGÚN
        // counter-rotate conocía — resultado: al arrastrar, las
        // etiquetas quedaban giradas de lado, ilegibles (visto en
        // captura). Sumarlo acá, en el mismo ángulo que ya se cancela,
        // resuelve eso de raíz en vez de intentar compensarlo aparte.
        const startAngle = ring.phase + (360 / itemsInRing) * posInRing + spin;

        return (
          <div
            key={field}
            className="field-orbit absolute pointer-events-none"
            style={{
              inset: `${ring.insetPercent}%`,
              '--start-angle': startAngle,
              animationDuration: `${ring.duration}s`,
              animationDirection: ring.direction
            }}
          >
            {/* Punto de anclaje en el borde del anillo (arriba-centro);
                al rotar `.field-orbit` alrededor de su propio centro,
                este punto barre el círculo. */}
            <div className="absolute top-0 left-1/2" style={{ translate: '-50% -50%' }}>
              <div
                className="field-orbit-counter"
                style={{ '--start-angle': startAngle, animationDuration: `${ring.duration}s`, animationDirection: ring.direction }}
              >
                <span
                  className="pointer-events-auto inline-block whitespace-nowrap px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-white/90 dark:bg-white/10 text-[#003366] dark:text-[#9FC6E8] border border-[#0077C8]/20 dark:border-white/15 shadow-sm transition-transform duration-200 ease-out hover:scale-110 hover:shadow-md hover:z-20 hover:border-[#0077C8]/50 cursor-default"
                >
                  {field}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
