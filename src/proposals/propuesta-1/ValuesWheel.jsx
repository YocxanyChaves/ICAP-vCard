import React, { useState } from 'react';
import { Shield, Star, Users, Heart, Award, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ValuesWheel() {
  const [selectedValue, setSelectedValue] = useState(0);

  const values = [
    {
      id: 'integridad',
      name: 'Integridad',
      icon: Shield,
      description: 'Actuamos con ética, honestidad y apego irrestricto a los principios del servicio público y la transparencia.',
      pos: 'top-[0%] left-[50%] -translate-x-1/2'
    },
    {
      id: 'excelencia',
      name: 'Excelencia',
      icon: Star,
      description: 'Buscamos los más altos estándares de calidad técnica, rigor académico e innovación en cada proyecto regional.',
      pos: 'top-[22%] right-[2%]'
    },
    {
      id: 'equipo',
      name: 'Trabajo en equipo',
      icon: Users,
      description: 'Fomentamos la colaboración multidisciplinaria e interinstitucional para alcanzar metas regionales conjuntas.',
      pos: 'bottom-[22%] right-[2%]'
    },
    {
      id: 'compromiso',
      name: 'Compromiso',
      icon: Heart,
      description: 'Dedicación total con el desarrollo, bienestar e integración de los pueblos centroamericanos.',
      pos: 'bottom-[0%] left-[50%] -translate-x-1/2'
    },
    {
      id: 'respeto',
      name: 'Respeto',
      icon: Award,
      description: 'Reconocemos y valoramos la diversidad cultural, institucional y humana de nuestra región.',
      pos: 'bottom-[22%] left-[2%]'
    },
    {
      id: 'transparencia',
      name: 'Transparencia',
      icon: Sparkles,
      description: 'Rendición de cuentas clara, acceso a la información y gestión abierta hacia la ciudadanía y socios.',
      pos: 'top-[22%] left-[2%]'
    }
  ];

  const current = values[selectedValue];

  return (
    <section className="px-4 sm:px-6 py-14 sm:py-24 bg-[#092647] text-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Header */}
        <span className="text-[11px] sm:text-xs font-bold tracking-widest uppercase text-[#E8791E] block mb-1.5 font-mono-code">
          Nuestra cultura
        </span>
        <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-white tracking-tight mb-2.5">
          Valores Institucionales
        </h2>
        <p className="text-xs sm:text-sm text-[#9FC6E8] max-w-md mb-8 sm:mb-12 leading-relaxed">
          Los pilares éticos y profesionales que orientan cada una de nuestras acciones y proyectos en Centroamérica.
        </p>

        {/* Mobile Quick Selector Chips (Horizontally scrollable for mobile ease) */}
        <div className="flex sm:hidden items-center gap-1.5 overflow-x-auto w-full pb-3 mb-4 scrollbar-none px-1">
          {values.map((v, i) => {
            const isSelected = selectedValue === i;
            return (
              <button
                key={v.id}
                onClick={() => setSelectedValue(i)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-heading font-bold shrink-0 transition-all ${
                  isSelected
                    ? 'bg-[#E8791E] text-white shadow-md'
                    : 'bg-[#0B2A4A] text-slate-300 border border-white/10'
                }`}
              >
                <span>{v.name}</span>
              </button>
            );
          })}
        </div>

        {/* Circular Orbital Layout */}
        <div className="relative w-[280px] h-[280px] sm:w-96 sm:h-96 my-2 sm:my-4">
          {/* Circular dotted guide */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
            <circle
              cx="200"
              cy="200"
              r="145"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1.5"
              strokeDasharray="4 8"
              fill="none"
            />
          </svg>

          {/* Central Logo Node */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-[#0B2A4A] border-2 border-[#E8791E] shadow-xl flex flex-col items-center justify-center p-1.5 z-10">
            <span className="font-heading font-extrabold text-white text-base sm:text-xl tracking-wider">
              ICAP
            </span>
            <span className="text-[8px] sm:text-[9px] font-mono-code text-[#E8791E] uppercase font-bold">
              Valores
            </span>
          </div>

          {/* Value Nodes */}
          {values.map((v, i) => {
            const Icon = v.icon;
            const isSelected = selectedValue === i;
            return (
              <button
                key={v.id}
                onClick={() => setSelectedValue(i)}
                className={`absolute ${v.pos} flex flex-col items-center gap-1 w-20 sm:w-28 group transition-transform active:scale-95 focus:outline-none z-20`}
              >
                <div
                  className={`w-9 h-9 sm:w-13 sm:h-13 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
                    isSelected
                      ? 'bg-[#E8791E] text-white scale-110 shadow-lg shadow-[#E8791E]/40 border-2 border-white ring-4 ring-[#E8791E]/30'
                      : 'bg-[#0B2A4A] text-[#E8791E] border border-white/20 hover:border-[#E8791E] hover:bg-[#0B2A4A]/90'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>
                <span
                  className={`text-[10px] sm:text-xs font-semibold leading-tight transition-colors line-clamp-2 ${
                    isSelected ? 'text-[#E8791E] font-bold' : 'text-[#EAF3FB] group-hover:text-white'
                  }`}
                >
                  {v.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Value Detail Card */}
        <div className="mt-6 sm:mt-8 max-w-md w-full bg-[#0B2A4A]/90 border border-white/15 rounded-3xl p-5 sm:p-6 backdrop-blur-sm shadow-xl text-left transition-all">
          <div className="flex items-center gap-3 mb-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E8791E]/20 border border-[#E8791E]/40 flex items-center justify-center text-[#E8791E]">
              {React.createElement(current.icon, { className: 'w-4 h-4' })}
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] font-mono-code text-[#9FC6E8] uppercase tracking-wider block">
                Pilar Institucional
              </span>
              <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                {current.name}
              </h3>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-[#C9D9E8] leading-relaxed">
            {current.description}
          </p>
        </div>

        <p className="text-[10px] sm:text-[11px] text-[#6E8AA8] mt-4 max-w-xs">
          Toca cualquier valor para conocer su significado en nuestra gestión pública.
        </p>
      </div>
    </section>
  );
}
