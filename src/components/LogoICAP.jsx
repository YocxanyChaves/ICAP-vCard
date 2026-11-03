import { LOGO_W, LOGO_H, TRIANGULO, IZQUIERDA, DERECHA, PUNTOS } from '../data/icapLogoFormas';

/**
 * Isotipo del ICAP (la figura con los brazos abiertos y los cinco puntos)
 * en un solo color, para usarlo como marca de agua. Se pinta con
 * `currentColor`, así que el tono y la opacidad se dan desde `className`
 * (p. ej. `text-[#0077C8] opacity-[0.07]`).
 */
export default function LogoICAP({ className = '', style }) {
  return (
    <svg
      viewBox={`0 0 ${LOGO_W} ${LOGO_H}`}
      aria-hidden="true"
      focusable="false"
      fill="currentColor"
      className={`select-none ${className}`}
      style={style}
    >
      <path d={IZQUIERDA} />
      <path d={DERECHA} />
      <path d={TRIANGULO} />
      {PUNTOS.map((p, i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r={p.r} />
      ))}
    </svg>
  );
}
