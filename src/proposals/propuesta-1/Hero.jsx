import React from 'react';
import { ChevronDown, ArrowRight, Sparkles } from 'lucide-react';
import icapLogoMark from '../../assets/icap-logo-mark.png';

export default function Hero({ onOpenAbout, onScrollToContact }) {
  return (
    <section className="relative min-h-[560px] sm:min-h-[640px] bg-gradient-to-br from-[#003366] via-[#0B5A96] to-[#0077C8] text-white px-4 sm:px-6 py-12 sm:py-20 flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Background radial glow & curves */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.18),rgba(0,119,200,0)_65%)] pointer-events-none" />

      {/* Ondas de fondo animadas: cada svg mide el doble del ancho real y
          contiene el mismo trazo repetido a los 800 unidades de viewBox
          (misma forma, controles desplazados +800 en x), así que al
          trasladar -50% termina exactamente donde empezó y el loop no
          se nota. Van a velocidades y direcciones distintas para que el
          movimiento se sienta orgánico y no como un GIF repetido. */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10" aria-hidden="true">
        <svg
          className="absolute top-0 left-0 w-[200%] h-full animate-wave-drift"
          viewBox="0 0 1600 600"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120 C 200 90, 600 150, 800 110 C 1000 90, 1400 150, 1600 110"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
        <svg
          className="absolute top-0 left-0 w-[200%] h-full animate-wave-drift-reverse"
          viewBox="0 0 1600 600"
          preserveAspectRatio="none"
        >
          <path
            d="M0 480 C 250 520, 550 450, 800 500 C 1050 520, 1350 450, 1600 500"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-xl mx-auto w-full">
        {/* Kicker badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-[#9FC6E8] text-[11px] sm:text-xs font-semibold tracking-widest uppercase mb-5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0077C8] animate-ping" />
          ICAP &middot; Fundado en 1954
        </div>

        {/* Emblem: real ICAP logo mark on a light seal */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white flex items-center justify-center mb-5 shadow-lg shadow-black/20 ring-4 ring-white/25 shrink-0">
          <img
            src={icapLogoMark}
            alt="Isotipo ICAP"
            className="w-[68%] h-[68%] object-contain"
            draggable={false}
          />
        </div>

        {/* Title */}
        <h1 className="font-heading font-extrabold text-4xl sm:text-7xl tracking-tight text-white mb-2.5 drop-shadow-sm">
          ICAP
        </h1>
        <h2 className="font-semibold text-base sm:text-2xl text-[#EAF3FB] max-w-md leading-snug mb-3.5">
          Instituto Centroamericano de Administración Pública
        </h2>

        {/* Description */}
        <p className="text-xs sm:text-base text-[#9FC6E8] max-w-lg leading-relaxed mb-7 px-2">
          Organismo regional del SICA especializado en la modernización institucional, gestión de políticas públicas y formación del talento humano.
        </p>

        {/* CTAs: Explicit padding, no cutting off */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full max-w-md px-2">
          <button
            onClick={onOpenAbout}
            className="w-full sm:w-1/2 flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl font-heading font-bold text-xs sm:text-sm tracking-wider uppercase border-2 border-white/40 hover:border-white hover:bg-white/10 text-white transition-all active:scale-[0.98] shadow-sm cursor-pointer"
          >
            <span>CONOCÉ EL ICAP</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
          <button
            onClick={onScrollToContact}
            className="w-full sm:w-1/2 flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl font-heading font-bold text-xs sm:text-sm tracking-wider uppercase bg-[#0077C8] hover:bg-[#005A96] text-white shadow-lg shadow-[#0077C8]/30 transition-all active:scale-[0.98] cursor-pointer"
          >
            <span>CONTACTANOS</span>
          </button>
        </div>

        {/* Scroll indicator */}
        <div
          className="mt-10 flex flex-col items-center gap-1.5 opacity-80 cursor-pointer"
          onClick={() => window.scrollBy({ top: 380, behavior: 'smooth' })}
        >
          <span className="text-[10px] tracking-widest text-[#9FC6E8] uppercase font-bold font-mono-code">
            Descubrí más
          </span>
          <ChevronDown className="w-4 h-4 text-[#9FC6E8] animate-bounce" />
        </div>
      </div>
    </section>
  );
}
