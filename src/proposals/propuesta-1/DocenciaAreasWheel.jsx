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
 * desafíos del presente y del futuro").
 *
 * Antes era la rueda orbital de ValuesWheel (reutilizada de "Valores"
 * de Asistencia Técnica), pero con 12 áreas los nombres se amontonaban
 * unos sobre otros — Yocxany pidió sacarla de acá porque "eso no va
 * ahí". Se cambió por el mismo patrón de grid de tarjetas que ya usan
 * Impacto/Investigación/Publicaciones — sin física orbital, cada área
 * con su ícono, nombre y descripción, en una grilla que se acomoda
 * sola según el ancho de pantalla. El componente sigue llamándose
 * "AreasWheel" sólo por el nombre del archivo (Propuesta1.jsx lo
 * importa así) — ya no tiene rueda ninguna.
 *
 * El banner de cierre de "Comunidad" (DocenciaComunidad.jsx, sin
 * cambios) se fusionó acá — Yocxany pidió sacarlo del menú y dejarlo
 * apilado justo debajo, como una segunda sección dentro de esta misma
 * página de "Áreas" (mismo patrón que Hero + DocenciaMision en Inicio).
 *
 * IDEA PENDIENTE (sólo anotada, todavía sin programar — ver
 * IDEAS-PENDIENTES.md en la raíz del proyecto): Yocxany quiere una
 * animación de transición tipo "pasar fotos" al hacer clic entre las
 * 12 áreas, inspirada en el sitio de Miu Miu (Awwwards), en vez de
 * este grid estático.
 */
export default function DocenciaAreasWheel() {
  const { t } = useLanguage();
  const c = t.docenciaAreas;

  return (
    <>
      <section className="px-4 sm:px-6 py-10 sm:py-16 bg-[#D6E9F7] dark:bg-[#001F3D] relative">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 sm:mb-10 text-center">
            <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-[#0077C8] block mb-1 font-mono-code">
              {c.kicker}
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#003366] dark:text-[#9FC6E8] tracking-tight">
              {c.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1.5 max-w-xl mx-auto leading-relaxed">
              {c.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {DOCENCIA_AREAS.map((item) => {
              const Icon = item.icon;
              const itemT = c.items[item.id];
              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-[#003366] rounded-3xl p-4 sm:p-5 border border-slate-100 dark:border-white/10 shadow-sm flex flex-col gap-3"
                >
                  <div className="w-10 h-10 rounded-2xl bg-[#EAF3FB] dark:bg-white/10 text-[#0077C8] dark:text-[#4FB2F2] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm sm:text-base text-[#003366] dark:text-[#9FC6E8] mb-1">
                      {itemT.name}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {itemT.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <DocenciaComunidad />
    </>
  );
}
