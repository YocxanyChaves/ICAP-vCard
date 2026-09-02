import React, { useState } from 'react';
import {
  User,
  MessageCircle,
  Mail,
  Calendar,
  Download,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Globe2
} from 'lucide-react';
import { downloadVCard, defaultContact, whatsappDigits } from '../../components/VCardDownload';
import { LinkedinIcon } from '../../components/Icons';
import BottomSheet from '../../components/BottomSheet';
import MissionVision from '../propuesta-1/MissionVision';
import ValuesWheel from '../propuesta-1/ValuesWheel';
import StatsSection from '../propuesta-1/StatsSection';
import SpecializationAreas from '../propuesta-1/SpecializationAreas';
import RegionalMap from '../propuesta-1/RegionalMap';
import AlliesMarquee from '../propuesta-1/AlliesMarquee';

export default function Propuesta3({ contact = defaultContact }) {
  const [scheduleModal, setScheduleModal] = useState(false);

  const handleDownload = () => {
    downloadVCard(contact);
  };

  const scrollToBrochure = () => {
    const el = document.getElementById('propuesta3-brochure');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-slate-50 text-slate-800 font-sans relative pb-28">
      {/* ============ 1. TOP HERO: EXECUTIVE VCARD ============ */}
      <section className="relative bg-[#0B2A4A] text-white px-4 sm:px-6 py-8 sm:py-14 flex flex-col items-center justify-center overflow-hidden border-b border-white/10">
        {/* Ambient Topo Lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
          viewBox="0 0 800 600"
          preserveAspectRatio="none"
        >
          <path d="M0 60 C 200 30, 600 90, 800 50" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
          <path d="M0 540 C 250 570, 550 510, 800 550" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
        </svg>

        <div className="max-w-md w-full relative z-10 flex flex-col">
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full border border-[#E8791E] flex items-center justify-center bg-[#0B2A4A]">
                <div className="w-2 h-2 rounded-full bg-[#E8791E]" />
              </div>
              <span className="font-heading font-extrabold text-base tracking-wider text-white">
                ICAP
              </span>
            </div>
            <a
              href="https://icap.ac.cr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[10px] font-mono-code text-[#EAF3FB] border border-white/20 hover:border-[#E8791E] hover:text-[#E8791E] rounded-full px-3 py-1 transition-colors uppercase"
            >
              <span>icap.ac.cr</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Eyebrow */}
          <div className="mt-4 sm:mt-5 text-[10px] sm:text-[11px] font-mono-code font-bold text-[#E8791E] uppercase tracking-wider">
            ICAP &middot; Ficha ejecutiva de contacto
          </div>

          {/* Profile Header */}
          <div className="mt-3 flex items-start justify-between gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="font-heading font-extrabold text-xl sm:text-3xl text-white leading-tight truncate">
                {contact.fullName}
              </h1>
              <div className="text-xs sm:text-sm font-semibold text-[#C9D9E8] mt-1 truncate">
                {contact.title}
              </div>
              <div className="inline-block mt-1.5 px-2.5 py-0.5 rounded-md bg-[#FBE6D2] text-[#B8802E] text-[9px] sm:text-[10px] font-mono-code font-bold tracking-wider uppercase">
                {contact.isSample ? 'Dato de ejemplo' : 'Representante Institucional'}
              </div>
            </div>

            {/* Avatar */}
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-[#12365C] border border-white/20 flex items-center justify-center text-white shadow-inner shrink-0">
              <User className="w-8 h-8 sm:w-9 sm:h-9 text-[#9FC6E8]" />
            </div>
          </div>

          {/* Action Buttons (Pill Format) */}
          <div className="flex flex-col gap-2.5 mt-5 sm:mt-6">
            <a
              href={`https://wa.me/${whatsappDigits(contact.cellPhone)}?text=Hola%20${encodeURIComponent(contact.fullName)},%20te%20contacto%20desde%20tu%20vCard%20ICAP.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 h-13 rounded-full px-4 sm:px-5 bg-[#E8791E] hover:bg-[#D06815] text-[#0B2A4A] font-bold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98]"
            >
              <span className="font-mono-code text-[11px] sm:text-xs px-2 py-0.5 rounded bg-black/15 font-extrabold shrink-0">
                WA
              </span>
              <span className="flex-1 text-left truncate">WhatsApp con {contact.firstName || 'Contacto'}</span>
              <ExternalLink className="w-4 h-4 opacity-70 shrink-0" />
            </a>

            <a
              href={`mailto:${contact.email}?subject=Contacto%20Institucional%20ICAP`}
              className="flex items-center gap-3 h-13 rounded-full px-4 sm:px-5 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs sm:text-sm border border-white/25 transition-all active:scale-[0.98]"
            >
              <span className="font-mono-code text-[11px] sm:text-xs px-2 py-0.5 rounded bg-white/10 text-[#9FC6E8] font-bold shrink-0">
                MAIL
              </span>
              <span className="flex-1 text-left truncate">Escribir un correo</span>
              <ExternalLink className="w-4 h-4 opacity-70 shrink-0" />
            </a>

            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 h-13 rounded-full px-4 sm:px-5 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs sm:text-sm border border-white/25 transition-all active:scale-[0.98]"
            >
              <span className="font-mono-code text-[11px] sm:text-xs px-2 py-0.5 rounded bg-white/10 text-[#9FC6E8] font-bold shrink-0">
                IN
              </span>
              <span className="flex-1 text-left truncate">Ver LinkedIn</span>
              <ExternalLink className="w-4 h-4 opacity-70 shrink-0" />
            </a>

            <button
              onClick={() => setScheduleModal(true)}
              className="flex items-center gap-3 h-13 rounded-full px-4 sm:px-5 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs sm:text-sm border border-white/25 transition-all active:scale-[0.98]"
            >
              <span className="font-mono-code text-[11px] sm:text-xs px-2 py-0.5 rounded bg-white/10 text-[#9FC6E8] font-bold shrink-0">
                CITA
              </span>
              <span className="flex-1 text-left truncate">Agendar una cita</span>
              <Calendar className="w-4 h-4 opacity-70 shrink-0" />
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-3 h-13 rounded-full px-4 sm:px-5 bg-[#F6F8FA] hover:bg-white text-[#0B2A4A] font-heading font-bold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98]"
            >
              <span className="font-mono-code text-[11px] sm:text-xs px-2 py-0.5 rounded bg-black/10 text-[#0B2A4A] font-extrabold shrink-0">
                VCF
              </span>
              <span className="flex-1 text-left font-bold uppercase tracking-wide truncate">
                Guardar contacto en teléfono
              </span>
              <Download className="w-4 h-4 text-[#0B2A4A] shrink-0" />
            </button>
          </div>

          {/* Bridge indicator towards brochure */}
          <div
            onClick={scrollToBrochure}
            className="mt-6 pt-4 border-t border-white/10 flex flex-col items-center gap-1 text-[#9FC6E8] hover:text-white cursor-pointer transition-colors"
          >
            <span className="text-[10px] sm:text-[11px] font-mono-code font-bold uppercase tracking-widest text-center">
              Conocé el ICAP &middot; Brochure Digital
            </span>
            <ChevronDown className="w-4 h-4 animate-bounce text-[#E8791E]" />
          </div>
        </div>
      </section>

      {/* ============ 2. BROCHURE INSTITUCIONAL SECTIONS ============ */}
      <div id="propuesta3-brochure">
        <MissionVision />
        <ValuesWheel />
        <StatsSection />
        <SpecializationAreas />
        <RegionalMap />
        <AlliesMarquee />

        {/* Quick Footer */}
        <footer className="py-10 bg-slate-100 text-center border-t border-slate-200">
          <div className="max-w-md mx-auto px-6 space-y-2">
            <div className="w-7 h-7 rounded-full border border-[#E8791E] flex items-center justify-center bg-[#0B2A4A] mx-auto mb-2">
              <div className="w-2 h-2 rounded-full bg-[#E8791E]" />
            </div>
            <div className="font-heading font-extrabold text-xs sm:text-sm text-[#0B2A4A]">
              Instituto Centroamericano de Administración Pública (ICAP)
            </div>
            <div className="text-[11px] sm:text-xs text-slate-500">
              San Pedro, Montes de Oca, San José, Costa Rica
            </div>
            <a
              href="https://icap.ac.cr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0077C8] font-mono-code text-xs hover:underline block pt-1"
            >
              www.icap.ac.cr
            </a>
          </div>
        </footer>
      </div>

      {/* Schedule Meeting Bottom Sheet */}
      <BottomSheet
        isOpen={scheduleModal}
        onClose={() => setScheduleModal(false)}
        title="Agendar Reunión"
        subtitle="Coordinación Institucional"
        icon={<Calendar className="w-5 h-5 text-[#E8791E]" />}
      >
        <div className="space-y-4 text-center sm:text-left">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Selecciona el canal para coordinar tu cita con el representante institucional de ICAP.
          </p>
          <div className="space-y-2.5 pt-2">
            <a
              href={`https://wa.me/${whatsappDigits(contact.cellPhone)}?text=Hola,%20quisiera%20agendar%20una%20reunión.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs uppercase tracking-wider block text-center shadow-md transition-colors"
            >
              Vía WhatsApp
            </a>
            <a
              href={`mailto:${contact.email}?subject=Solicitud%20de%20Reunión`}
              className="w-full py-3.5 rounded-2xl bg-[#0077C8] hover:bg-[#0060A0] text-white font-heading font-bold text-xs uppercase tracking-wider block text-center shadow-md transition-colors"
            >
              Vía Correo Electrónico
            </a>
            <button
              onClick={() => setScheduleModal(false)}
              className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-heading font-bold text-xs uppercase transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
