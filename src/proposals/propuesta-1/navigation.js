import {
  Home,
  Compass,
  Sparkles,
  Users,
  LayoutGrid,
  MapPinned,
  Phone,
  Lightbulb,
  FlaskConical,
  BookMarked,
  Orbit,
  GraduationCap
} from 'lucide-react';

// Única fuente de verdad para las secciones del brochure — id, nombre e
// ícono. La usan tanto el menú inferior (Propuesta1.jsx) como el nuevo
// panel de accesos rápidos del Hero, para que ambos siempre muestren
// exactamente las mismas secciones, en el mismo orden, sin tener que
// mantener dos listas iguales por separado.
// Autoridades y Contacto quedan juntas al final (a la derecha en el
// menú) — Yocxany pidió que las dos secciones compartidas entre
// departamentos queden agrupadas ahí, igual que ya estaban en
// DOCENCIA_PAGES más abajo (antes acá "Autoridades" iba en medio,
// separada de "Contacto" por Áreas y Presencia).
export const PAGES = [
  { id: 'inicio', label: 'Inicio', icon: Home },
  { id: 'mision', label: 'Misión', icon: Compass },
  { id: 'valores', label: 'Valores', icon: Sparkles },
  { id: 'areas', label: 'Áreas', icon: LayoutGrid },
  { id: 'presencia', label: 'Presencia', icon: MapPinned },
  { id: 'autoridades', label: 'Autoridades', icon: Users },
  { id: 'contacto', label: 'Contacto', icon: Phone }
];

// Segundo "departamento" del brochure: Docencia. Comparte con Asistencia
// Técnica el Hero ("inicio") y las secciones de Autoridades y Contacto
// (mismos ids => mismo componente, mismo contenido — hasta nuevo aviso,
// ver comentario en Propuesta1.jsx); las demás son subsecciones propias
// de Docencia, con ids con prefijo "docencia" para que nunca choquen con
// las de Asistencia Técnica ni con sus componentes/switch en Propuesta1.
//
// "Visión" se eliminó del todo (era un placeholder pendiente, nunca
// llegó a tener contenido real). "Comunidad" también se sacó de acá —
// su contenido se fusionó dentro de la página de "Áreas" en vez de
// tener su propia entrada en el menú (ver DocenciaAreasWheel.jsx).
export const DOCENCIA_PAGES = [
  { id: 'inicio', label: 'Inicio', icon: Home },
  { id: 'docenciaMision', label: 'Formación', icon: GraduationCap },
  { id: 'docenciaImpacto', label: 'Impacto', icon: Lightbulb },
  { id: 'docenciaInvestigacion', label: 'Investigación', icon: FlaskConical },
  { id: 'docenciaPublicaciones', label: 'Publicaciones', icon: BookMarked },
  { id: 'docenciaAreas', label: 'Áreas', icon: Orbit },
  { id: 'autoridades', label: 'Autoridades', icon: Users },
  { id: 'contacto', label: 'Contacto', icon: Phone }
];
