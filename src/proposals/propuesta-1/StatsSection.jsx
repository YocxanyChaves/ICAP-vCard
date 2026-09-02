import React from 'react';
import { Briefcase, Building2, Globe2 } from 'lucide-react';

export default function StatsSection() {
  const stats = [
    {
      value: '124',
      label: 'Proyectos',
      sublabel: 'ejecutados',
      color: 'text-[#E8791E]',
      icon: Briefcase
    },
    {
      value: '47',
      label: 'Clientes',
      sublabel: 'institucionales',
      color: 'text-[#0077C8]',
      icon: Building2
    },
    {
      value: '18',
      label: 'Países',
      sublabel: 'atendidos',
      color: 'text-[#0B2A4A]',
      icon: Globe2
    }
  ];

  return (
    <section className="px-4 sm:px-6 py-10 sm:py-16 bg-white border-y border-slate-100">
      <div className="max-w-4xl mx-auto text-center">
        <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-[#E8791E] block mb-1 font-mono-code">
          Trayectoria e Impacto
        </span>
        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0B2A4A] tracking-tight mb-2">
          ICAP en Cifras
        </h2>
        <div className="inline-block px-2.5 py-0.5 rounded-md bg-[#FBE6D2] text-[#B8802E] text-[9px] sm:text-[10px] font-mono-code font-bold tracking-wider uppercase mb-8">
          Cifras de ejemplo &middot; a confirmar
        </div>

        {/* 3-Column Mobile & Desktop Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-6 max-w-lg sm:max-w-3xl mx-auto">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50 sm:bg-transparent rounded-2xl sm:rounded-none p-3 sm:p-4 flex flex-col items-center border border-slate-100/80 sm:border-0"
              >
                <div className="w-8 h-8 rounded-xl bg-white sm:bg-slate-100 flex items-center justify-center text-slate-400 mb-2 shadow-xs">
                  <Icon className="w-4 h-4" />
                </div>
                <div className={`font-heading font-extrabold text-3xl sm:text-5xl ${item.color} leading-none mb-1 tracking-tight`}>
                  {item.value}
                </div>
                <div className="font-heading font-bold text-xs sm:text-sm text-slate-800 leading-tight">
                  {item.label}
                </div>
                <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
                  {item.sublabel}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
