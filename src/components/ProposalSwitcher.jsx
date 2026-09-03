import React, { useState } from 'react';
import { Smartphone, Monitor, Layers, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';

export default function ProposalSwitcher({
  currentProposal,
  setCurrentProposal,
  viewMode,
  setViewMode
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  const proposals = [
    {
      id: 1,
      title: 'Propuesta 1',
      subtitle: 'Brochure Institucional + vCard',
      badge: 'Completo',
      color: 'border-[#0077C8] text-[#0077C8]'
    },
    {
      id: 2,
      title: 'Propuesta 2',
      subtitle: 'vCard Minimalista',
      badge: 'Tarjeta Rápida',
      color: 'border-[#0077C8] text-[#0077C8]'
    },
    {
      id: 3,
      title: 'Propuesta 3',
      subtitle: 'Versión Híbrida',
      badge: 'Dual Flow',
      color: 'border-emerald-500 text-emerald-400'
    }
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-2xl transition-all duration-300">
      <div className="bg-[#003366]/90 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl p-3 text-white">
        {/* Header bar */}
        <div className="flex items-center justify-between gap-3 pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#0077C8] flex items-center justify-center font-heading font-extrabold text-[10px] text-white">
              ICAP
            </div>
            <span className="font-heading font-bold text-xs tracking-wider uppercase text-slate-200">
              Selector de Propuestas
            </span>
            <span className="hidden sm:inline-flex text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-[#9FC6E8]">
              Proyecto vCard & Brochure
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Viewport switch: Mobile frame vs Full responsive */}
            <div className="flex items-center bg-black/30 p-0.5 rounded-lg border border-white/10 text-xs">
              <button
                onClick={() => setViewMode('mobile')}
                title="Vista Móvil (390px)"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                  viewMode === 'mobile'
                    ? 'bg-[#0077C8] text-white font-semibold shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-xs">Móvil</span>
              </button>
              <button
                onClick={() => setViewMode('full')}
                title="Vista Completa / Escritorio"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                  viewMode === 'full'
                    ? 'bg-[#0077C8] text-white font-semibold shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-xs">Completa</span>
              </button>
            </div>

            {/* Minimize / Expand button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              title={isExpanded ? 'Minimizar' : 'Expandir'}
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Proposals Selector Grid */}
        {isExpanded && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 pt-1">
            {proposals.map((p) => {
              const active = currentProposal === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setCurrentProposal(p.id)}
                  className={`relative flex flex-col items-start p-2.5 rounded-xl border transition-all text-left group ${
                    active
                      ? 'bg-white/15 border-white/40 shadow-inner'
                      : 'bg-black/20 border-white/10 hover:bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span
                      className={`font-heading font-extrabold text-xs tracking-wide ${
                        active ? 'text-white' : 'text-slate-300 group-hover:text-white'
                      }`}
                    >
                      {p.title}
                    </span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${p.color} bg-black/40`}>
                      {p.badge}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-300/80 line-clamp-1">
                    {p.subtitle}
                  </span>

                  {active && (
                    <div className="absolute bottom-1 right-2 flex items-center gap-1 text-[10px] text-[#0077C8] font-bold">
                      <Sparkles className="w-3 h-3" />
                      <span>Activa</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
