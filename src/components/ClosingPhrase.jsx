import { useEffect, useRef, useState } from 'react';

/**
 * Frase de cierre de Impacto e Investigación, con el mismo estilo y boop
 * (`animate-closing-boop` de global.css) que la del Hero de Formación
 * (FormacionVisionHero.jsx).
 *
 * El boop se dispara cuando la frase entra completa en pantalla
 * (IntersectionObserver contra el `<main>`, que es el que scrollea) y
 * se repite si sale y vuelve a entrar. `boopDelay` espera a que termine
 * la animación de entrada propia de la sección.
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
