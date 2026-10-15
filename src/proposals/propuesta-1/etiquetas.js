import {
  Store,
  Building2,
  TrendingUp,
  Landmark,
  Scale,
  Zap,
  Users,
  Leaf,
  Bus,
  Wheat,
  Stethoscope,
  Cpu,
  HeartHandshake,
  Globe,
  Tag
} from 'lucide-react';

/**
 * Las 14 etiquetas temáticas con que se clasifican los proyectos de
 * Asistencia Técnica (docs/Clasificacion_proyectos_ICAP.pdf, a partir del
 * Brochure Institucional 2026). Son también las Áreas de Especialización
 * (SpecializationAreas.jsx), así que esta es la fuente única de nombre,
 * color e ícono para Proyectos, Áreas, Presencia y Socios.
 *
 * El orden es el de la matriz del PDF. `text` es el color de texto que se
 * lee bien encima de `color` (para las cápsulas activas).
 */
export const ETIQUETAS = [
  { id: 'mipymes', color: '#F59E0B', text: '#2B1A00', icon: Store, es: 'MiPYMES', en: 'MSMEs' },
  { id: 'infraestructura', color: '#EA7A3B', text: '#FFFFFF', icon: Building2, es: 'Infraestructura', en: 'Infrastructure' },
  { id: 'economia', color: '#0E8C8A', text: '#FFFFFF', icon: TrendingUp, es: 'Economía y comercio', en: 'Economy and trade' },
  { id: 'politica', color: '#2563EB', text: '#FFFFFF', icon: Landmark, es: 'Política pública', en: 'Public policy' },
  { id: 'genero', color: '#C64FB8', text: '#FFFFFF', icon: Scale, es: 'Equidad de género', en: 'Gender equity' },
  { id: 'energia', color: '#EAB308', text: '#2B2000', icon: Zap, es: 'Energía', en: 'Energy' },
  { id: 'transformacion', color: '#16337A', text: '#FFFFFF', icon: Users, es: 'Transformación organizacional', en: 'Organizational transformation' },
  { id: 'ambiente', color: '#2FA84F', text: '#FFFFFF', icon: Leaf, es: 'Ambiente y cambio climático', en: 'Environment and climate change' },
  { id: 'transporte', color: '#7C3AED', text: '#FFFFFF', icon: Bus, es: 'Transporte y movilidad', en: 'Transport and mobility' },
  { id: 'alimentaria', color: '#A0612A', text: '#FFFFFF', icon: Wheat, es: 'Seguridad alimentaria y nutricional', en: 'Food and nutrition security' },
  { id: 'salud', color: '#0EA5E9', text: '#FFFFFF', icon: Stethoscope, es: 'Salud', en: 'Health' },
  { id: 'tecnologia', color: '#0F5D78', text: '#FFFFFF', icon: Cpu, es: 'Tecnología', en: 'Technology' },
  { id: 'derechos', color: '#E11D48', text: '#FFFFFF', icon: HeartHandshake, es: 'Derechos humanos', en: 'Human rights' },
  { id: 'cooperacion', color: '#0070C0', text: '#FFFFFF', icon: Globe, es: 'Cooperación internacional', en: 'International cooperation' }
];

const POR_ID = Object.fromEntries(ETIQUETAS.map((e) => [e.id, e]));

export const getEtiqueta = (id) =>
  POR_ID[id] || { id, color: '#64748B', text: '#FFFFFF', icon: Tag, es: id, en: id };

export const nombreEtiqueta = (id, lang) => getEtiqueta(id)[lang === 'en' ? 'en' : 'es'];
