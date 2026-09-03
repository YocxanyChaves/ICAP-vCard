import React from 'react';
import { Building2, ShieldCheck } from 'lucide-react';

export default function AlliesMarquee() {
  const allies = [
    { name: 'SICA', label: 'Sistema de la Integración Centroamericana' },
    { name: 'OPS / OMS', label: 'Organización Panamericana de la Salud' },
    { name: 'BID', label: 'Banco Interamericano de Desarrollo' },
    { name: 'FLACSO', label: 'Facultad Latinoamericana de Ciencias Sociales' },
    { name: 'BCIE', label: 'Banco Centroamericano de Integración Económica' },
    { name: 'CEPAL', label: 'Comisión Económica para América Latina' },
    { name: 'AECID', label: 'Agencia Española de Cooperación' },
    { name: 'OEA', label: 'Organización de los Estados Americanos' }
  ];

  return (
    <section className="py-12 bg-[#001F3D] text-white overflow-hidden border-y border-white/5">
      <div className="max-w-4xl mx-auto px-6 mb-8 text-center">
        <span className="text-xs font-bold tracking-widest uppercase text-[#0077C8] block mb-1 font-mono-code">
          Red Institucional
        </span>
        <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-white tracking-tight">
          Organismos y Socios de Cooperación
        </h2>
      </div>

      {/* Infinite scrolling track */}
      <div className="relative w-full overflow-hidden flex items-center py-2">
        {/* Gradient fades at borders */}
        <div className="absolute left-0 inset-y-0 w-16 bg-gradient-to-r from-[#001F3D] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-16 bg-gradient-to-l from-[#001F3D] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee flex items-center gap-4">
          {[...allies, ...allies].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#0077C8]/50 hover:bg-white/[0.08] transition-all min-w-[200px] sm:min-w-[240px] shrink-0 group cursor-default"
            >
              <div className="w-9 h-9 rounded-xl bg-[#003366] border border-white/15 flex items-center justify-center font-heading font-extrabold text-xs text-[#0077C8] group-hover:scale-105 transition-transform shrink-0">
                {item.name.split(' ')[0]}
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-sm text-slate-100 group-hover:text-white transition-colors">
                  {item.name}
                </span>
                <span className="text-[11px] text-slate-400 line-clamp-1 leading-snug">
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
