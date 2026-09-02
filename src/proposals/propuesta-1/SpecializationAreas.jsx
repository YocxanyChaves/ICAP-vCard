import React, { useState } from 'react';
import { Scale, HeartPulse, BarChart3, Leaf, Lightbulb, GraduationCap, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import BottomSheet from '../../components/BottomSheet';

export default function SpecializationAreas() {
  const [selectedArea, setSelectedArea] = useState(null);

  const areas = [
    {
      id: 'gobernanza',
      title: 'Gobernanza y regulación',
      tag: 'Políticas públicas y marcos regulatorios',
      longDesc: 'Fortalecimiento de los marcos jurídicos, transparencia institucional, modernización del Estado y diseño de políticas públicas orientadas al impacto social y la rendición de cuentas.',
      icon: Scale,
      color: 'bg-[#EAF3FB] text-[#0077C8]',
      points: [
        'Diseño y evaluación de políticas públicas sectoriales.',
        'Marcos regulatorios y simplificación de trámites gubernamentales.',
        'Gobernanza multinivel y descentralización administrativa.'
      ]
    },
    {
      id: 'salud',
      title: 'Gerencia de la salud',
      tag: 'Dirección en salud y seguridad social',
      longDesc: 'Programas y consultorías especializadas en gestión de servicios de salud, optimización de recursos hospitalarios y sostenibilidad de los sistemas de seguridad social en la región.',
      icon: HeartPulse,
      color: 'bg-[#FBE6D2] text-[#E8791E]',
      points: [
        'Gestión estratégica de servicios hospitalarios y redes de salud.',
        'Sostenibilidad financiera en seguridad social.',
        'Políticas públicas para la equidad y cobertura sanitaria.'
      ]
    },
    {
      id: 'proyectos',
      title: 'Gerencia de proyectos',
      tag: 'Planificación estratégica y dirección institucional',
      longDesc: 'Metodologías ágiles y tradicionales para la formulación, evaluación, financiamiento y ejecución exitosa de proyectos de desarrollo nacional e internacional.',
      icon: BarChart3,
      color: 'bg-[#EAF3FB] text-[#0077C8]',
      points: [
        'Formulación y evaluación ex-ante y ex-post de proyectos de inversión.',
        'Gestión de riesgos, cronogramas y presupuestos públicos.',
        'Cooperación técnica y vinculación con organismos multilaterales.'
      ]
    },
    {
      id: 'ambiente',
      title: 'Ambiente y energía',
      tag: 'Transición energética y gestión ambiental',
      longDesc: 'Acompañamiento a ministerios e instituciones en transición energética justa, mitigación del cambio climático y gestión sostenible de los recursos naturales.',
      icon: Leaf,
      color: 'bg-[#FBE6D2] text-[#E8791E]',
      points: [
        'Políticas de descarbonización y energías renovables.',
        'Gobernanza hídrica y gestión de cuencas compartidas.',
        'Mecanismos de financiamiento climático regional.'
      ]
    },
    {
      id: 'innovacion',
      title: 'Innovación pública',
      tag: 'Transformación digital y liderazgo adaptativo',
      longDesc: 'Laboratorios de innovación ciudadana, digitalización de servicios públicos, uso ético de inteligencia artificial y nuevas tecnologías aplicadas a la gestión pública.',
      icon: Lightbulb,
      color: 'bg-[#EAF3FB] text-[#0077C8]',
      points: [
        'Transformación digital del gobierno y servicios ciudadanos.',
        'Laboratorios de innovación y co-creación pública.',
        'Cultura organizacional ágil y liderazgo adaptativo.'
      ]
    },
    {
      id: 'formacion',
      title: 'Formación institucional',
      tag: 'Posgrados, maestrías y desarrollo del talento humano',
      longDesc: 'Oferta académica de posgrado (maestrías y doctorados) y programas de formación a la medida para cuadros directivos y técnicos del sector público.',
      icon: GraduationCap,
      color: 'bg-[#FBE6D2] text-[#E8791E]',
      points: [
        'Maestrías y doctorados especializados en administración pública.',
        'Cursos y diplomados ejecutivos virtuales y presenciales.',
        'Planes de carrera y competencias para el servidor público.'
      ]
    }
  ];

  return (
    <section className="px-4 sm:px-6 py-10 sm:py-16 bg-slate-50 relative">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 sm:mb-8 text-center sm:text-left">
          <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-[#E8791E] block mb-1 font-mono-code">
            Expertise y Oferta
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0B2A4A] tracking-tight">
            Áreas de Especialización
          </h2>
          <p className="text-xs text-slate-500 mt-1 sm:hidden">
            Toca cualquier área para explorar sus programas y líneas de trabajo.
          </p>
        </div>

        {/* Clean, Mobile-Native List / Grid Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {areas.map((area) => {
            const Icon = area.icon;
            return (
              <div
                key={area.id}
                onClick={() => setSelectedArea(area)}
                className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all cursor-pointer flex items-center justify-between gap-3 group active:scale-[0.98]"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-11 h-11 min-w-11 rounded-2xl ${area.color} flex items-center justify-center group-hover:scale-105 transition-transform shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-heading font-bold text-sm sm:text-base text-[#0B2A4A] group-hover:text-[#0077C8] transition-colors truncate">
                      {area.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {area.tag}
                    </p>
                  </div>
                </div>

                <div className="w-7 h-7 rounded-full bg-slate-50 group-hover:bg-[#E8791E] text-slate-400 group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Sheet for Mobile & Modal for Desktop */}
      <BottomSheet
        isOpen={Boolean(selectedArea)}
        onClose={() => setSelectedArea(null)}
        title={selectedArea?.title}
        subtitle="Área de Especialización ICAP"
        icon={
          selectedArea ? (
            <div className={`w-10 h-10 rounded-xl ${selectedArea.color} flex items-center justify-center`}>
              {React.createElement(selectedArea.icon, { className: 'w-5 h-5' })}
            </div>
          ) : null
        }
      >
        {selectedArea && (
          <div className="space-y-4 text-slate-700">
            {/* Description Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {selectedArea.longDesc}
              </p>
            </div>

            {/* Bullet Points */}
            <div className="space-y-2.5 pt-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono-code">
                Líneas de Trabajo y Proyectos
              </span>
              {selectedArea.points.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 text-xs text-slate-700 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-[#E8791E] shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedArea(null)}
              className="mt-6 w-full py-3.5 rounded-2xl bg-[#0B2A4A] hover:bg-[#092647] text-white font-heading font-bold text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer"
            >
              Cerrar Detalle
            </button>
          </div>
        )}
      </BottomSheet>
    </section>
  );
}
