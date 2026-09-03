import React from 'react';
import { Compass, Eye, CheckCircle2, Quote } from 'lucide-react';
import icapEscudoCeleste from '../../assets/icap-escudo-celeste.png';
import icapEscudoWhite from '../../assets/icap-escudo-white.png';

const MISION_PILARES = [
  'Desarrollo y formación de competencias directivas en el servicio público.',
  'Modernización e innovación constante en la gestión gubernamental de Centroamérica.',
  'Apoyo activo a la integración y cohesión regional de los países del SICA.'
];

const VISION_PILARES = [
  'Referente regional e internacional en diseño e implementación de políticas públicas.',
  'Generación de conocimiento aplicado para el fortalecimiento de la gerencia pública.',
  'Impulso al desarrollo sostenible desde lo local, nacional y regional.'
];

export default function MissionVision() {
  return (
    <section className="px-4 sm:px-6 py-10 sm:py-16 bg-slate-50 relative">
      <div className="max-w-4xl mx-auto">
        {/* Section Title */}
        <div className="mb-7 sm:mb-10 text-center sm:text-left">
          <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-[#0077C8] block mb-1.5 font-mono-code">
            Quiénes somos
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#003366] tracking-tight">
            Misión y Visión
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto sm:mx-0">
            Los dos pilares que orientan cada proyecto, alianza y programa del ICAP en la región centroamericana.
          </p>
        </div>

        {/* Misión — light card */}
        <div className="relative bg-white rounded-[28px] p-6 sm:p-9 shadow-sm border border-slate-100 overflow-hidden mb-6">
          <img
            src={icapEscudoCeleste}
            alt=""
            aria-hidden="true"
            className="pointer-events-none select-none absolute -right-10 -bottom-14 w-56 sm:w-64 opacity-[0.07]"
          />
          <div className="relative">
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#EAF3FB] flex items-center justify-center text-[#0077C8] shrink-0">
                <Compass className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div>
                <span className="text-[10px] font-mono-code uppercase font-bold text-[#0077C8] tracking-wider block">
                  Propósito
                </span>
                <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#003366] leading-tight">
                  Misión
                </h3>
              </div>
            </div>

            <div className="relative pl-5 sm:pl-7 mb-6">
              <Quote className="absolute -left-0.5 -top-1 w-5 h-5 sm:w-6 sm:h-6 text-[#0077C8]/25 rotate-180" fill="currentColor" />
              <p className="text-sm sm:text-lg font-medium text-[#003366] leading-relaxed">
                Fortalecer las competencias y capacidades de los Estados y las instituciones por medio de su recurso humano, la modernización de las entidades públicas y el apoyo a la integración centroamericana.
              </p>
            </div>

            <div className="space-y-2 sm:space-y-2.5">
              {MISION_PILARES.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 sm:p-3.5 rounded-2xl bg-slate-50 text-xs sm:text-sm leading-relaxed text-slate-600"
                >
                  <CheckCircle2 className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-[#0077C8] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider seal */}
        <div className="flex items-center justify-center gap-3 my-1 sm:my-2">
          <span className="h-px flex-1 bg-slate-200" />
          <div className="w-9 h-9 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0">
            <img src={icapEscudoCeleste} alt="" aria-hidden="true" className="w-6 h-6 opacity-80" />
          </div>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Visión — dark card */}
        <div className="relative bg-[#003366] text-white rounded-[28px] p-6 sm:p-9 shadow-sm border border-white/5 overflow-hidden mt-6">
          <img
            src={icapEscudoWhite}
            alt=""
            aria-hidden="true"
            className="pointer-events-none select-none absolute -right-12 -top-14 w-56 sm:w-64 opacity-[0.08]"
          />
          <div className="relative">
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 flex items-center justify-center text-[#0077C8] shrink-0">
                <Eye className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div>
                <span className="text-[10px] font-mono-code uppercase font-bold text-[#0077C8] tracking-wider block">
                  Horizonte
                </span>
                <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-white leading-tight">
                  Visión
                </h3>
              </div>
            </div>

            <div className="relative pl-5 sm:pl-7 mb-6">
              <Quote className="absolute -left-0.5 -top-1 w-5 h-5 sm:w-6 sm:h-6 text-white/20 rotate-180" fill="currentColor" />
              <p className="text-sm sm:text-lg font-medium text-[#EAF3FB] leading-relaxed">
                Ser la institución del Sistema de la Integración Centroamericana especializada en la gestión pública, que genera conocimiento para las organizaciones y fortalece la gerencia de las políticas públicas a nivel local, nacional y regional, para avanzar hacia el desarrollo sostenible.
              </p>
            </div>

            <div className="space-y-2 sm:space-y-2.5">
              {VISION_PILARES.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 sm:p-3.5 rounded-2xl bg-white/[0.06] border border-white/5 text-xs sm:text-sm leading-relaxed text-[#C9D9E8]"
                >
                  <CheckCircle2 className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-[#0077C8] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
