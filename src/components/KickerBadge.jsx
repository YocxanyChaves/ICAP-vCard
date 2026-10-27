
/**
 * Píldora del kicker (el título chico sobre cada sección). No lleva
 * margen propio: el espaciado lo define quien la usa.
 *
 * `variant`:
 * - "dot" (default): puntito celeste parpadeante — Docencia.
 * - "glow": una luz celeste que recorre la píldora por abajo — Asistencia
 *   Técnica. Es un wrapper `kicker-light-sweep` con dos hijos que viajan
 *   juntos: una estela difuminada y una rayita fina con puntas de flecha
 *   (clip-path). La píldora tiene overflow-hidden para que la luz quede
 *   adentro. El celeste cambia un poco por tema para contrastar con el
 *   fondo de la píldora.
 *
 * `onDark`: para secciones con fondo siempre oscuro (p. ej.
 * AlliesMarquee), fuerza los colores del tema oscuro sin depender de
 * `dark:`.
 */
export default function KickerBadge({ children, variant = 'dot', onDark = false }) {
  if (variant === 'glow') {
    return (
      <div className="relative inline-flex">
        <div
          className={`relative inline-flex items-center justify-center px-5 py-1.5 sm:px-6 sm:py-2 rounded-full border text-[11px] sm:text-xs font-bold tracking-wide uppercase font-mono-code overflow-hidden ${
            onDark
              ? 'bg-white/10 border-[#4FB2F2]/45 text-[#9FC6E8]'
              : 'bg-[#0077C8]/10 dark:bg-white/10 border-[#4FB2F2]/45 text-[#0077C8] dark:text-[#9FC6E8]'
          }`}
        >
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

  // `onDark` también aplica acá: para secciones que SIEMPRE van sobre
  // fondo oscuro sin importar el tema (p. ej. el banner degradado de
  // DocenciaComunidad), donde el celeste del tema claro no contrasta.
  return (
    <div
      className={`relative inline-flex items-center justify-center px-5 py-1.5 sm:px-6 sm:py-2 rounded-full border text-[11px] sm:text-xs font-bold tracking-wide uppercase font-mono-code ${
        onDark
          ? 'bg-white/10 border-white/25 text-[#D6E9F7]'
          : 'bg-[#0077C8]/10 dark:bg-white/10 border-[#0077C8]/25 dark:border-white/15 text-[#0077C8] dark:text-[#9FC6E8]'
      }`}
    >
      <span
        className={`absolute left-2 sm:left-2.5 top-1/2 -translate-y-1/2 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full animate-ping ${
          onDark ? 'bg-[#7dd3fc]' : 'bg-[#0077C8] dark:bg-[#4FB2F2]'
        }`}
      />
      {children}
    </div>
  );
}
