import React from 'react';
import {
  Globe2,
  Landmark,
  LineChart,
  ClipboardList,
  Cpu,
  Lightbulb,
  BadgeCheck,
  HeartPulse,
  Activity,
  Zap,
  FlaskConical,
  Building2
} from 'lucide-react';
import ValuesWheel from './ValuesWheel';
import DocenciaComunidad from './DocenciaComunidad';
import { useLanguage } from '../../i18n/LanguageContext';

// Mismos ids que t.docenciaAreas.items en translations.js — nombre y
// descripción de cada área viven ahí; acá sólo quedan el id y el
// ícono, que no cambian según el idioma.
const DOCENCIA_AREAS = [
  { id: 'integracionRegional', icon: Globe2 },
  { id: 'politicasPublicas', icon: Landmark },
  { id: 'gestionPredictiva', icon: LineChart },
  { id: 'gerenciaProyectos', icon: ClipboardList },
  { id: 'transformacionDigital', icon: Cpu },
  { id: 'innovacionInstitucional', icon: Lightbulb },
  { id: 'calidad', icon: BadgeCheck },
  { id: 'saludPublica', icon: HeartPulse },
  { id: 'epidemiologia', icon: Activity },
  { id: 'regulacionEnergia', icon: Zap },
  { id: 'investigacionAplicada', icon: FlaskConical },
  { id: 'modernizacionOrganizacional', icon: Building2 }
];

/**
 * "Áreas" de Docencia — bloque 6 del brochure ("Áreas para los
 * desafíos del presente y del futuro"), la sección que Yocxany marcó
 * como "esto sería el círculo". Reutiliza tal cual el componente de la
 * rueda orbital de Valores (ValuesWheel — ver el comentario de
 * `buildOrbitConfig` ahí, generalizado esta misma sesión justo para
 * esto), pasándole las 12 áreas de Docencia y su propio namespace de
 * traducciones en vez de los 6 Valores de Asistencia Técnica. Misma
 * física, mismos colores, mismas animaciones — nada duplicado.
 *
 * Yocxany pidió fusionar acá "Comunidad" (que tenía su propia entrada
 * en el menú) en vez de mantenerlo aparte, y sacar esa opción del
 * menú — el banner de cierre de Comunidad (DocenciaComunidad.jsx, sin
 * cambios) va apilado justo debajo de la rueda, como una segunda
 * sección dentro de esta misma página de "Áreas" (mismo patrón que
 * Hero + DocenciaMision en Inicio).
 */
export default function DocenciaAreasWheel() {
  const { t } = useLanguage();
  return (
    <>
      <ValuesWheel items={DOCENCIA_AREAS} content={t.docenciaAreas} />
      <DocenciaComunidad />
    </>
  );
}
