import {
  Cog,
  Users,
  Leaf,
  Stethoscope,
  BadgeCheck,
  ClipboardCheck,
  Scale,
  ShieldCheck,
  GraduationCap,
  Wrench,
  Tag
} from 'lucide-react';

/**
 * Colores oficiales por Área de Proyecto, tomados directamente de la
 * columna "Área" del brochure original (páginas 10-16 · una franja de
 * color sólido por categoría). El ícono no viene en el brochure — se
 * escogió uno acorde al tema de cada área, tomando como referencia los
 * íconos de la rueda "Áreas de Especialización" (página 7) donde coinciden.
 *
 * Fuente única compartida por RegionalMap.jsx y AlliesMarquee.jsx: así
 * cualquier etiqueta de área (en el mapa o en los aliados) usa siempre
 * exactamente el mismo color/ícono.
 */
export const AREA_META = {
  Gobernanza: { color: '#3ECC58', text: '#FFFFFF', icon: Cog },
  'Proyectos de Inversión': { color: '#F0A879', text: '#0B1F3D', icon: ClipboardCheck },
  'Formación Continua': { color: '#E8BA12', text: '#0B1F3D', icon: GraduationCap },
  'Transformación Organizacional': { color: '#16337A', text: '#FFFFFF', icon: Users },
  Ambiente: { color: '#8DD873', text: '#0B1F3D', icon: Leaf },
  Salud: { color: '#5FC9F3', text: '#0B1F3D', icon: Stethoscope },
  Género: { color: '#D86DCB', text: '#0B1F3D', icon: Scale },
  Seguridad: { color: '#EED878', text: '#0B1F3D', icon: ShieldCheck },
  Calidad: { color: '#0F5D78', text: '#FFFFFF', icon: BadgeCheck },
  'Asistencia Técnica': { color: '#0070C0', text: '#FFFFFF', icon: Wrench }
};

export const getAreaMeta = (area) => AREA_META[area] || { color: '#64748B', text: '#FFFFFF', icon: Tag };
