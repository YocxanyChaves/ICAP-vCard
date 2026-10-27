import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Renderiza `children` dentro de un <iframe> real: así los breakpoints de
 * Tailwind (sm:, md:) se evalúan contra el ancho del iframe y no contra
 * el de la ventana, igual que en un celular de verdad.
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
