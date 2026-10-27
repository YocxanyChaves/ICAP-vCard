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
  GraduationCap,
  FolderKanban
} from 'lucide-react';

// Secciones del brochure (id, nombre, ícono): única fuente para el menú
// inferior (Brochure.jsx) y los accesos rápidos del Hero. Autoridades y
// Contacto van al final, igual que en DOCENCIA_PAGES.
export const PAGES = [
  { id: 'inicio', label: 'Inicio', icon: Home },
  { id: 'mision', label: 'Misión', icon: Compass },
  { id: 'valores', label: 'Valores', icon: Sparkles },
  { id: 'areas', label: 'Áreas', icon: LayoutGrid },
  { id: 'presencia', label: 'Presencia', icon: MapPinned },
  { id: 'proyectos', label: 'Proyectos', icon: FolderKanban },
  { id: 'autoridades', label: 'Autoridades', icon: Users },
  { id: 'contacto', label: 'Contacto', icon: Phone }
];

// Segundo departamento: Docencia. Comparte con Asistencia Técnica el Hero
// ("inicio"), Autoridades y Contacto (mismos ids => mismo componente). Sus
// subsecciones propias llevan el prefijo "docencia" para no chocar con
// las de AT. "Comunidad" va dentro de "Áreas" (DocenciaAreasWheel.jsx).
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
