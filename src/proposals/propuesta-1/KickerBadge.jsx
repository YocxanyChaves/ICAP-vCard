import React from 'react';

/**
 * Píldora del kicker — nació en DocenciaMision.jsx (Formación) y ahora
 * Yocxany pidió el mismo "marco" para el kicker de DocenciaImpacto, así
 * que se saca a un componente compartido en vez de duplicar el markup:
 * cualquier ajuste futuro de estilo (tamaño, color, puntito) queda en un
 * solo lugar y las dos secciones se mantienen visualmente idénticas.
 *
 * No lleva margen propio (ni mb ni mt): el espaciado respecto a lo que
 * va antes/después lo define quien lo usa (gap del contenedor padre o
 * un div envolvente con su propio mb — ver DocenciaMision.jsx), para
 * poder reusarlo en layouts distintos sin que un margen fijo se sume
 * de más.
 *
 * Letra bajada DOS escalones a pedido de Yocxany (primero text-sm/base
 * → text-xs/sm, y después un poco más porque seguía sintiéndose
 * grande para ser sólo un kicker): text-[11px]/xs.
 *
 * `variant`:
 * - "dot" (default): la píldora original, con el puntito celeste
 *   parpadeante — usada en Docencia (DocenciaMision/DocenciaImpacto).
 * - "glow": sin puntito; en su lugar un halo celeste difuminado
 *   alrededor + una barrita de luz celeste que recorre la píldora de
 *   vez en cuando — Yocxany la pidió para los títulos de Asistencia
 *   Técnica, como un distintivo propio de ese departamento (vs. el
 *   puntito de Docencia) que igual se sienta de la misma marca ICAP
 *   porque usa los mismos colores/mismo "marco" (misma píldora, mismo
 *   tamaño de letra). El halo vive en un wrapper aparte SIN
 *   overflow-hidden (para que pueda difuminarse hacia afuera) y la
 *   barrita de luz vive adentro de la píldora, que sí tiene
 *   overflow-hidden, para que quede recortada a su forma en vez de
 *   salirse del marco.
 *   La barrita va PEGADA ABAJO (no de alto completo) y en celeste, no
 *   blanco — Yocxany probó blanco primero y "no se nota" sobre el
 *   fondo clarito de la píldora, y además de alto completo tapaba el
 *   texto al pasarle por encima; ahora es más una rayita/subrayado que
 *   recorre por debajo de la frase, como una barra de luz, sin pisar
 *   las letras. El celeste cambia un poco por tema (más oscuro/
 *   saturado en claro, más clarito en oscuro) porque la píldora de
 *   fondo cambia de clara a oscura entre temas — un solo celeste no
 *   hace contraste bueno en los dos a la vez.
 *   El halo pasó por varios colores/intensidades en tema claro (celeste
 *   institucional #0077C8 → "muy oscuro"; turquesa #00D9C6 → "me pasé";
 *   #4FB2F2 a opacidad alta → "muy oscuro, más tenue"; #9FC6E8 → "no se
 *   ve nada", porque ese celeste clarito es casi del mismo tono que el
 *   fondo de la página y se pierde sin importar la opacidad — ahí el
 *   problema no era la intensidad sino que ese color específico no
 *   hace contraste; #4FB2F2 a opacidad muy baja → "va bien el color
 *   pero muy tenue, casi ni se nota"; celeste→blanco→celeste sin
 *   suficiente brillo → "se ve raro, le falta sensación neón"). Yocxany
 *   pidió que la barrita fuera "como el mismo [rayo] del logo de
 *   valores" — la paleta de .value-light-ring en global.css:
 *   rgba(143,211,255,·) → #bfe6ff → #ffffff → #8fd3ff, la misma que usa
 *   el destello que recorre el logo del ICAP en Valores Institucionales
 *   (ValuesWheel.jsx) — así los dos "rayos de luz" del sitio se sienten
 *   de la misma familia. Se probó con DOS capas (glow difuminado +
 *   filamento nítido encima, truco de "tubo de neón"), pero Yocxany
 *   vio las dos por separado — "el rayo" (filamento) y "una estela de
 *   luz" (el glow) — y le gustó más la estela sola: se quitó el
 *   filamento y quedó sólo la capa difuminada, más ancha/larga
 *   (w-1/2 → w-[85%]) y con más "calor" (opacity-90 → 100, alfa de los
 *   stops subida, blur más fuerte, h-[7px] → h-[8px]). Pero en tema
 *   oscuro esa versión "se ve toda grande y feo" — el blanco del centro
 *   del degradé, a esa opacidad/ancho/blur, se leía como un borrón
 *   blanco en vez de una lucecita. Yocxany pidió volver a tener DOS
 *   elementos pero distintos a los del "tubo de neón" original: una
 *   "rayita" con las puntas en forma de flecha (no filamento recto) +
 *   una estela brillosa detrás, y un celeste más claro/brilloso/bonito
 *   pero SIN volverse blanco ni turquesa (ya se probó blanco→"no se
 *   nota"/"se ve toda grande" y turquesa→"me pasé").
 *
 *   Implementación actual: un solo wrapper (`kicker-light-sweep`, así
 *   los dos hijos viajan pegados como una sola unidad en vez de
 *   desincronizarse si tuvieran anchos distintos con la misma
 *   animación) que contiene (1) la estela — una capa ancha, difuminada
 *   (blur), en degradé celeste (sin blanco puro, el pico es un celeste
 *   clarito #7dd3fc) y (2) la rayita — una línea fina encima, sin
 *   blur, recortada con `clip-path` en forma de rombo/flecha (angosta
 *   en las puntas, ancha al centro) para que las orillas se vean como
 *   flechitas en vez de un corte recto, con un celeste vivo (#4FB2F2 →
 *   #7dd3fc con un toque de blanco sólo en el pixel central, como un
 *   destello puntual, no un bloque blanco).
 */
export default function KickerBadge({ children, variant = 'dot' }) {
  if (variant === 'glow') {
    return (
      <div className="relative inline-flex">
        <span
          aria-hidden="true"
          className="absolute -inset-2.5 rounded-full bg-[#4FB2F2]/32 blur-md kicker-glow-halo pointer-events-none"
        />
        <span
          aria-hidden="true"
          className="absolute -inset-1 rounded-full bg-[#4FB2F2]/42 blur-sm kicker-glow-halo pointer-events-none"
        />
        <div className="relative inline-flex items-center justify-center px-5 py-1.5 sm:px-6 sm:py-2 rounded-full bg-[#0077C8]/10 dark:bg-white/10 border border-[#4FB2F2]/45 text-[#0077C8] dark:text-[#9FC6E8] text-[11px] sm:text-xs font-bold tracking-wide uppercase font-mono-code overflow-hidden">
          {/* Wrapper que viaja como una sola unidad (rayita + estela pegadas,
              nunca se desincronizan aunque tengan anchos distintos). */}
          <span
            aria-hidden="true"
            className="absolute bottom-0.5 left-0 h-[8px] w-[62%] kicker-light-sweep pointer-events-none"
          >
            {/* Estela brillosa — difuminada, en celeste (sin blanco puro
                en el pico, para no verse como un borrón blanco). */}
            <span className="absolute inset-0 blur-[3px] opacity-80 bg-[linear-gradient(90deg,transparent,rgba(79,178,242,0.55)_18%,#5cc9ff_40%,#7dd3fc_50%,#5cc9ff_60%,rgba(79,178,242,0.55)_82%,transparent)]" />
            {/* Rayita nítida encima — puntas en forma de flecha vía
                clip-path (rombo alargado), celeste vivo con un destello
                blanco puntual sólo en el centro. */}
            <span className="absolute left-[8%] right-[8%] top-1/2 -translate-y-1/2 h-[2px] bg-[linear-gradient(90deg,#4FB2F2,#7dd3fc_42%,#ffffff_50%,#7dd3fc_58%,#4FB2F2)] [clip-path:polygon(0%_50%,16%_0%,84%_0%,100%_50%,84%_100%,16%_100%)]" />
          </span>
          <span className="relative">{children}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative inline-flex items-center justify-center px-5 py-1.5 sm:px-6 sm:py-2 rounded-full bg-[#0077C8]/10 dark:bg-white/10 border border-[#0077C8]/25 dark:border-white/15 text-[#0077C8] dark:text-[#9FC6E8] text-[11px] sm:text-xs font-bold tracking-wide uppercase font-mono-code">
      <span className="absolute left-2 sm:left-2.5 top-1/2 -translate-y-1/2 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#0077C8] dark:bg-[#4FB2F2] animate-ping" />
      {children}
    </div>
  );
}
