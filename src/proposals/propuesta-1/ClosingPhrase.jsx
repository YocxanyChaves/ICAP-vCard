import React, { useEffect, useRef, useState } from 'react';

/**
 * Frase de conclusión de las subsecciones de Docencia (Impacto,
 * Investigación) — Yocxany pidió que quedaran IGUALES a la del Hero de
 * Formación ("Prepárese para liderar los desafíos del futuro.", ver
 * FormacionVisionHero.jsx): mismo tamaño, mismo peso, mismo hover y el
 * mismo boop sutil (`animate-closing-boop` de global.css) al final.
 *
 * Diferencias con la del Hero, a propósito:
 * - Allá el boop se dispara cuando termina el efecto de caída ligado al
 *   scroll; acá no hay ese efecto, así que se dispara cuando la frase
 *   entra completa en pantalla (IntersectionObserver contra el `<main>`
 *   que scrollea de verdad — mismo motivo que el OJO de
 *   FormacionVisionHero). Se puede repetir si sale y vuelve a entrar.
 * - Allá el color es navy fijo (el panel siempre es claro); acá el
 *   fondo sigue el tema, así que lleva su variante `dark:`.
 *
 * `boopDelay` sirve para esperar a que termine una animación de entrada
 * propia de la sección (p. ej. el fade de Impacto) antes del boop.
 */
export default function ClosingPhrase({ children, className = '', style, boopDelay = 0 }) {
  const ref = useRef(null);
  const [booping, setBooping] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let timeoutId;
    const observer = new IntersectionObserver(
      ([entry]) => {
        clearTimeout(timeoutId);
        if (entry.isIntersecting) {
          timeoutId = setTimeout(() => setBooping(true), boopDelay);
        }
      },
      { root: el.closest('main'), threshold: 0.95 }
    );
    observer.observe(el);
    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [boopDelay]);

  return (
    <p
      ref={ref}
      className={`text-center font-heading font-extrabold text-[#003366] dark:text-[#9FC6E8] text-2xl sm:text-3xl md:text-3xl lg:text-4xl leading-tight px-4 will-change-transform${
        booping ? ' animate-closing-boop' : ''
      } ${className}`}
      style={style}
      onAnimationEnd={() => setBooping(false)}
    >
      <span className="inline-block transition-transform duration-300 ease-out hover:scale-105 cursor-default">
        {children}
      </span>
    </p>
  );
}
