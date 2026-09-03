import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Renderiza `children` dentro de un <iframe> real en vez de un simple <div>.
 *
 * Por qué: Tailwind evalúa sus prefijos "sm:" / "md:" contra el ancho REAL
 * de la ventana del navegador, no contra el ancho de un div. Si el "modo
 * móvil" del selector fuera solo un div angosto flotando en una pantalla
 * de escritorio, esas clases seguirían activas y el diseño se vería
 * distinto (y peor) que en un celular real o en el inspector angostado.
 * Un <iframe> en cambio tiene su propio viewport independiente, así que
 * las media queries de Tailwind se evalúan correctamente contra su ancho
 * real — el mismo comportamiento que ver la página angostando la ventana
 * del navegador de verdad.
 */
export default function DeviceFrame({ width = 390, height = '100%', children }) {
  const iframeRef = useRef(null);
  const [mountNode, setMountNode] = useState(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return undefined;

    let observer;

    const syncStyles = () => {
      const doc = iframe.contentDocument;
      if (!doc || !doc.head) return;

      // Reemplaza por completo los estilos copiados en cada sincronización
      // (en vez de intentar "diffear" nodo por nodo) para no quedar con
      // una copia vieja cuando Vite actualiza un <style> existente en
      // caliente durante `npm run dev`.
      doc.head.querySelectorAll('[data-synced-style]').forEach((node) => node.remove());
      document
        .querySelectorAll('head link[rel="stylesheet"], head style')
        .forEach((node) => {
          const clone = node.cloneNode(true);
          clone.setAttribute('data-synced-style', '');
          doc.head.appendChild(clone);
        });
    };

    const setup = () => {
      const doc = iframe.contentDocument;
      if (!doc || !doc.body) return;

      doc.documentElement.style.margin = '0';
      doc.body.style.margin = '0';
      doc.body.style.background = '#ffffff';

      syncStyles();
      setMountNode(doc.body);

      // Mantiene el iframe al día si Tailwind/Vite agrega o reescribe
      // estilos mientras estás desarrollando (Hot Module Replacement).
      observer = new MutationObserver(syncStyles);
      observer.observe(document.head, {
        childList: true,
        subtree: true,
        characterData: true
      });
    };

    // Un iframe en blanco (sin `src`) ya suele tener `contentDocument`
    // disponible de inmediato, pero igual escuchamos `load` como respaldo.
    setup();
    iframe.addEventListener('load', setup);

    return () => {
      iframe.removeEventListener('load', setup);
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <iframe
      ref={iframeRef}
      title="Vista previa móvil"
      style={{ width, height, border: 'none', display: 'block' }}
    >
      {mountNode ? createPortal(children, mountNode) : null}
    </iframe>
  );
}
