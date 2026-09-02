import React from 'react';
import { ChevronDown, ArrowRight, Sparkles } from 'lucide-react';

export default function Hero({ onOpenAbout, onScrollToContact }) {
  return (
    <section className="relative min-h-[560px] sm:min-h-[640px] bg-[#0B2A4A] text-white px-4 sm:px-6 py-12 sm:py-20 flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Background radial glow & curves */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(0,119,200,0.35),rgba(11,42,74,0)_65%)] pointer-events-none" />
      <svg
        className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
        viewBox="0 0 800 600"
        preserveAspectRatio="none"
      >
        <path d="M0 120 C 200 90, 600 150, 800 110" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
        <path d="M0 480 C 250 520, 550 450, 800 500" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
      </svg>

      <div className="relative z-10 flex flex-col items-center max-w-xl mx-auto w-full">
        {/* Kicker badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-[#9FC6E8] text-[11px] sm:text-xs font-semibold tracking-widest uppercase mb-5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E8791E] animate-ping" />
          SICA &middot; Fundado en 1954
        </div>

        {/* Emblem solar mark */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#E8791E] flex items-center justify-center mb-5 shadow-lg shadow-[#E8791E]/20 bg-[#0B2A4A]/60 shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#E8791E]" />
          <svg className="absolute inset-0 w-full h-full p-1" viewBox="0 0 64 64">
            <g stroke="#E8791E" strokeWidth="1.6" strokeLinecap="round">
              <line x1="32" y1="2" x2="32" y2="10" />
              <line x1="32" y1="54" x2="32" y2="62" />
              <line x1="2" y1="32" x2="10" y2="32" />
              <line x1="54" y1="32" x2="62" y2="32" />
              <line x1="10.7" y1="10.7" x2="16.2" y2="16.2" />
              <line x1="47.8" y1="47.8" x2="53.3" y2="53.3" />
              <line x1="10.7" y1="53.3" x2="16.2" y2="47.8" />
              <line x1="47.8" y1="16.2" x2="53.3" y2="10.7" />
            </g>
          </svg>
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
            className="w-full sm:w-1/2 flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl font-heading font-bold text-xs sm:text-sm tracking-wider uppercase bg-[#E8791E] hover:bg-[#D06815] text-white shadow-lg shadow-[#E8791E]/30 transition-all active:scale-[0.98] cursor-pointer"
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
