import React, { useState } from 'react';
import { Compass, Eye, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import BottomSheet from '../../components/BottomSheet';

export default function MissionVision() {
  const [activeModal, setActiveModal] = useState(null); // 'mision' | 'vision' | null

  return (
    <section className="px-4 sm:px-6 py-10 sm:py-16 bg-slate-50 relative">
      <div className="max-w-4xl mx-auto">
        {/* Section Title */}
        <div className="mb-6 sm:mb-8 text-center sm:text-left">
          <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-[#E8791E] block mb-1 font-mono-code">
            Quiénes somos
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0B2A4A] tracking-tight">
            Misión y Visión
          </h2>
          <p className="text-xs text-slate-500 mt-1 sm:hidden">
            Toca una tarjeta para ver los compromisos institucionales.
          </p>
        </div>

        {/* Compact, Ultra-Clean Mobile Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-6">
          {/* Card Misión - Compact & Clickable */}
          <div
            onClick={() => setActiveModal('mision')}
            className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm hover:shadow-md border border-slate-100 flex items-center justify-between gap-4 cursor-pointer transition-all active:scale-[0.98] group"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF3FB] flex items-center justify-center text-[#0077C8] group-hover:scale-105 transition-transform shrink-0">
                <Compass className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono-code uppercase font-bold text-[#0077C8] tracking-wider block">
                  Propósito
                </span>
                <h3 className="font-heading font-extrabold text-lg text-[#0B2A4A] leading-tight">
                  Misión
                </h3>
                <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                  Fortalecimiento institucional y modernización del Estado
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-[#E8791E] text-slate-400 group-hover:text-white flex items-center justify-center transition-colors shrink-0">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card Visión - Compact & Clickable */}
          <div
            onClick={() => setActiveModal('vision')}
            className="bg-[#0B2A4A] text-white rounded-3xl p-5 sm:p-7 shadow-sm hover:shadow-md flex items-center justify-between gap-4 cursor-pointer transition-all active:scale-[0.98] group border border-white/5"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#E8791E] group-hover:scale-105 transition-transform shrink-0">
                <Eye className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono-code uppercase font-bold text-[#E8791E] tracking-wider block">
                  Horizonte
                </span>
                <h3 className="font-heading font-extrabold text-lg text-white leading-tight">
                  Visión
                </h3>
                <p className="text-xs text-[#C9D9E8] line-clamp-1 mt-0.5">
                  Institución referente en gestión y políticas públicas
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#E8791E] text-slate-300 group-hover:text-white flex items-center justify-center transition-colors shrink-0">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sheet Modal with Full Text & Strategic Pillars */}
      <BottomSheet
        isOpen={Boolean(activeModal)}
        onClose={() => setActiveModal(null)}
        title={activeModal === 'mision' ? 'Misión Institucional' : 'Visión Estratégica'}
        subtitle={activeModal === 'mision' ? 'Compromiso Regional' : 'Liderazgo hacia el Futuro'}
        icon={
          activeModal === 'mision' ? (
            <Compass className="w-5 h-5 text-[#0077C8]" />
          ) : (
            <Eye className="w-5 h-5 text-[#E8791E]" />
          )
        }
      >
        {activeModal === 'mision' ? (
          <div className="space-y-4 text-slate-700">
            {/* Mission Statement Box */}
            <div className="p-4 rounded-2xl bg-[#EAF3FB] border border-[#0077C8]/20">
              <p className="text-xs sm:text-sm font-medium text-[#0B2A4A] leading-relaxed italic">
                “Fortalecer las competencias y capacidades de los Estados y las instituciones por medio de su recurso humano, la modernización de las entidades públicas y el apoyo a la integración centroamericana.”
              </p>
            </div>

            {/* Strategic Pillars */}
            <div className="space-y-2.5 pt-2">
              <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-slate-400 block">
                Ejes de Trabajo
              </span>
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 text-xs leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-[#0077C8] shrink-0 mt-0.5" />
                <span>Desarrollo y formación de competencias directivas en el servicio público.</span>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 text-xs leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-[#0077C8] shrink-0 mt-0.5" />
                <span>Modernización e innovación constante en la gestión gubernamental de Centroamérica.</span>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 text-xs leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-[#0077C8] shrink-0 mt-0.5" />
                <span>Apoyo activo a la integración y cohesión regional de los países del SICA.</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-slate-700">
            {/* Vision Statement Box */}
            <div className="p-4 rounded-2xl bg-[#FBE6D2] border border-[#E8791E]/20">
              <p className="text-xs sm:text-sm font-medium text-[#0B2A4A] leading-relaxed italic">
                “Ser la institución del Sistema de la Integración Centroamericana especializada en la gestión pública, generadora de conocimiento para las organizaciones, que fortalece la gestión de las políticas públicas en el ámbito local, nacional y regional.”
              </p>
            </div>

            {/* Strategic Pillars */}
            <div className="space-y-2.5 pt-2">
              <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-slate-400 block">
                Ejes de Futuro
              </span>
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 text-xs leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-[#E8791E] shrink-0 mt-0.5" />
                <span>Referente regional e internacional en diseño e implementación de políticas públicas.</span>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 text-xs leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-[#E8791E] shrink-0 mt-0.5" />
                <span>Plataforma generadora de investigación, prospectiva y evidencia científica aplicada.</span>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 text-xs leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-[#E8791E] shrink-0 mt-0.5" />
                <span>Impacto directo en la eficiencia institucional y bienestar de la ciudadanía.</span>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setActiveModal(null)}
          className="mt-6 w-full py-3.5 rounded-2xl bg-[#0B2A4A] hover:bg-[#092647] text-white font-heading font-bold text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer"
        >
          Cerrar
        </button>
      </BottomSheet>
    </section>
  );
}
