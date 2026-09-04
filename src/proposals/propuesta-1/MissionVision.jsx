import React from 'react';
import { Compass, Eye } from 'lucide-react';
import icapEscudoCeleste from '../../assets/icap-escudo-celeste.png';

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
    <section className="px-4 sm:px-6 py-10 sm:py-20 bg-slate-50 relative overflow-hidden">
      {/* Resplandores ambientales de fondo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#0077C8]/[0.06] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-16 w-80 h-80 rounded-full bg-[#003366]/[0.05] blur-3xl"
      />

      <div className="max-w-5xl mx-auto relative">
        {/* Section Title */}
        <div className="mb-8 sm:mb-12 text-center">
          <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-[#0077C8] block mb-1.5 font-mono-code">
            Quiénes somos
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#003366] tracking-tight">
            Misión y Visión
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
            Los dos pilares que orientan cada proyecto, alianza y programa del ICAP en la región centroamericana.
          </p>
        </div>

        {/* Díptico Misión / Visión — apiladas en móvil, a la par desde tablet/escritorio,
            unidas por un mismo eje central con el escudo del ICAP. */}
        <div className="grid sm:grid-cols-[1fr_auto_1fr] items-stretch">
          {/* Misión */}
          <article className="relative bg-white rounded-[28px] sm:rounded-r-none p-6 sm:p-9 shadow-[0_10px_34px_-14px_rgba(0,51,102,0.22)] border border-slate-100 overflow-hidden">
            <span
              aria-hidden="true"
              className="absolute top-0 left-6 right-6 sm:right-auto sm:left-9 sm:w-16 h-[3px] rounded-full bg-gradient-to-r from-[#0077C8] to-[#4FB2F2]"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none select-none absolute -right-4 -bottom-10 font-heading font-black text-[120px] sm:text-[150px] leading-none text-[#0077C8]/[0.05]"
            >
              01
            </span>

            <div className="relative">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#EAF3FB] flex items-center justify-center text-[#0077C8] shrink-0">
                  <Compass className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div>
                  <span className="text-[10px] font-mono-code uppercase font-bold text-[#0077C8] tracking-wider block">
                    Propósito &middot; 01
                  </span>
                  <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#003366] leading-tight">
                    Misión
                  </h3>
                </div>
              </div>

              <blockquote className="border-l-[3px] border-[#0077C8]/30 pl-4 sm:pl-5 mb-7">
                <p className="font-heading text-base sm:text-xl font-semibold text-[#003366] leading-snug">
                  Fortalecer las competencias y capacidades de los Estados y las instituciones por medio de su recurso humano, la modernización de las entidades públicas y el apoyo a la integración centroamericana.
                </p>
              </blockquote>

              <div className="space-y-2 sm:space-y-2.5">
                {MISION_PILARES.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 sm:p-3.5 rounded-2xl bg-slate-50/90 text-xs sm:text-sm leading-relaxed text-slate-600"
                  >
                    <span className="w-5 h-5 sm:w-[22px] sm:h-[22px] rounded-full bg-[#0077C8] text-white text-[9px] sm:text-[10px] font-bold font-mono-code flex items-center justify-center shrink-0 mt-0.5">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>

          {/* Eje central: línea + escudo, horizontal en móvil, vertical desde sm */}
          <div className="flex sm:flex-col items-center justify-center gap-3 py-1.5 sm:py-0 sm:px-1">
            <span className="h-px sm:h-auto sm:w-px flex-1 bg-gradient-to-r sm:bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center shrink-0 z-10">
              <img src={icapEscudoCeleste} alt="" aria-hidden="true" className="w-7 h-7 sm:w-8 sm:h-8 opacity-90" />
            </div>
            <span className="h-px sm:h-auto sm:w-px flex-1 bg-gradient-to-r sm:bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
          </div>

          {/* Visión */}
          <article className="relative bg-[#003366] text-white rounded-[28px] sm:rounded-l-none p-6 sm:p-9 shadow-[0_10px_34px_-14px_rgba(0,15,35,0.45)] border border-white/5 overflow-hidden">
            <span
              aria-hidden="true"
              className="absolute top-0 left-6 right-6 sm:left-auto sm:right-9 sm:w-16 h-[3px] rounded-full bg-gradient-to-r from-[#4FB2F2] to-[#0077C8]"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none select-none absolute -left-4 -bottom-10 font-heading font-black text-[120px] sm:text-[150px] leading-none text-white/[0.045]"
            >
              02
            </span>

            <div className="relative">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 flex items-center justify-center text-[#4FB2F2] shrink-0">
                  <Eye className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div>
                  <span className="text-[10px] font-mono-code uppercase font-bold text-[#4FB2F2] tracking-wider block">
                    Horizonte &middot; 02
                  </span>
                  <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-white leading-tight">
                    Visión
                  </h3>
                </div>
              </div>

              <blockquote className="border-l-[3px] border-white/20 pl-4 sm:pl-5 mb-7">
                <p className="font-heading text-base sm:text-xl font-semibold text-[#EAF3FB] leading-snug">
                  Ser la institución del Sistema de la Integración Centroamericana especializada en la gestión pública, que genera conocimiento para las organizaciones y fortalece la gerencia de las políticas públicas a nivel local, nacional y regional, para avanzar hacia el desarrollo sostenible.
                </p>
              </blockquote>

              <div className="space-y-2 sm:space-y-2.5">
                {VISION_PILARES.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 sm:p-3.5 rounded-2xl bg-white/[0.06] border border-white/5 text-xs sm:text-sm leading-relaxed text-[#C9D9E8]"
                  >
                    <span className="w-5 h-5 sm:w-[22px] sm:h-[22px] rounded-full bg-white/15 text-[#4FB2F2] text-[9px] sm:text-[10px] font-bold font-mono-code flex items-center justify-center shrink-0 mt-0.5 border border-white/10">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
