import escudoSprite from '../assets/icap-escudo.svg?no-inline';

/**
 * Escudo del ICAP como marca de agua. Antes había seis archivos del mismo
 * dibujo (3 SVG de ~260 KB + 3 PNG de ~200 KB, uno por color); ahora es un
 * solo sprite liviano (assets/icap-escudo.svg) y el color se elige acá.
 *
 * El dibujo son 7 capas apiladas; cada una toma su tono de --e1..--e7.
 *  - tono: 'white' | 'navy' | 'celeste' — las paletas exactas de los SVG
 *    anteriores (icap-escudo-white/navy/celeste-vector.svg).
 *  - plano: imita a los PNG anteriores, que eran el escudo en un solo
 *    color con ~66% de opacidad horneada en el archivo. Se usa donde antes
 *    iba un .png, para que esas marcas de agua se vean igual que antes.
 *
 * `className` / `style` se pasan tal cual, como al <img> de antes: el
 * alto (o el ancho) sale solo de la proporción del viewBox.
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
