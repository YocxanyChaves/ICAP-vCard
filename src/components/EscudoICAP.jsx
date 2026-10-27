import escudoSprite from '../assets/icap-escudo.svg?no-inline';

/**
 * Escudo del ICAP como marca de agua: un solo sprite SVG
 * (assets/icap-escudo.svg) de 7 capas, cada una con su tono en --e1..--e7.
 *  - tono: 'white' | 'navy' | 'celeste'.
 *  - plano: el escudo en un solo color con ~66% de opacidad.
 *
 * `className` / `style` van directo al elemento; el alto (o el ancho)
 * sale de la proporción del viewBox.
 */
const TONOS = {
  white: ['#f7fafc', '#eff5f9', '#e2ecf5', '#d6e4f1', '#cfe0ef', '#c2d7ea', '#bbd3e8'],
  navy: ['#006dda', '#0063c6', '#0055aa', '#00478e', '#004080', '#003162', '#002952'],
  celeste: ['#e2eff8', '#cfe4f3', '#b2d5ed', '#95c5e7', '#86bde4', '#67addd', '#56a4da']
};

const PLANOS = { white: '#FFFFFF', navy: '#003367', celeste: '#0077C9' };

export default function EscudoICAP({ tono = 'white', plano = false, className = '', style }) {
  const colores = plano ? Array(7).fill(PLANOS[tono]) : TONOS[tono];
  const vars = Object.fromEntries(colores.map((c, i) => [`--e${i + 1}`, c]));
  if (plano) vars['--eo'] = 169 / 255;

  return (
    <svg
      viewBox="0 0 517.52502 560.91669"
      aria-hidden="true"
      focusable="false"
      className={`select-none ${className}`}
      style={{ ...vars, ...style }}
    >
      <use href={`${escudoSprite}#escudo`} />
    </svg>
  );
}
