import React, { useState } from 'react';
import { User, MessageSquare, Mail, Calendar, Download, ExternalLink, Globe, Sparkles } from 'lucide-react';
import { LinkedinIcon } from '../../components/Icons';
import { downloadVCard, defaultContact, whatsappDigits } from '../../components/VCardDownload';
import BottomSheet from '../../components/BottomSheet';

export default function Propuesta2({ contact = defaultContact }) {
  const [scheduleModal, setScheduleModal] = useState(false);

  const handleDownload = () => {
    downloadVCard(contact);
  };

  return (
    <div className="min-h-screen bg-[#0B2A4A] text-white flex flex-col items-center justify-center p-3.5 sm:p-6 pb-28 relative overflow-hidden selection:bg-[#E8791E] selection:text-white">
      {/* Background ambient topo wave lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
        viewBox="0 0 400 900"
        preserveAspectRatio="none"
      >
        <path d="M0 80 C 120 50, 280 110, 400 70" stroke="#FFFFFF" strokeWidth="1.2" fill="none" />
        <path d="M0 820 C 130 850, 260 800, 400 840" stroke="#FFFFFF" strokeWidth="1.2" fill="none" />
      </svg>

      {/* Main vCard Container */}
      <div className="w-full max-w-sm sm:max-w-md bg-[#0B2A4A] border border-white/15 rounded-3xl p-5 sm:p-8 shadow-2xl relative z-10 flex flex-col">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-white/10">
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
        <div className="mt-5 sm:mt-6 text-[10px] sm:text-[11px] font-mono-code font-bold text-[#E8791E] uppercase tracking-wider">
          ICAP &middot; Ficha de contacto
        </div>

        {/* Profile Info Header */}
        <div className="mt-3 sm:mt-4 flex items-start justify-between gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="font-heading font-extrabold text-xl sm:text-3xl text-white leading-tight truncate">
              {contact.fullName}
            </h1>
            <div className="text-xs sm:text-sm font-semibold text-[#C9D9E8] mt-1 truncate">
              {contact.title}
            </div>
            {contact.isSample && (
              <div className="inline-block mt-1.5 px-2.5 py-0.5 rounded-md bg-[#FBE6D2] text-[#B8802E] text-[9px] sm:text-[10px] font-mono-code font-bold tracking-wider uppercase">
                Dato de ejemplo
              </div>
            )}
            <p className="text-[11px] sm:text-xs text-[#9FC6E8] leading-relaxed mt-2 line-clamp-3">
              Punto de contacto oficial para consultas institucionales, posgrados y cooperación técnica.
            </p>
          </div>

          {/* Avatar box */}
          <div className="w-16 h-16 sm:w-18 sm:h-18 min-w-16 rounded-2xl bg-[#12365C] border border-white/20 flex items-center justify-center text-white shadow-inner shrink-0">
            <User className="w-8 h-8 sm:w-9 sm:h-9 text-[#9FC6E8]" />
          </div>
        </div>

        {/* Pill Action Buttons */}
        <div className="flex flex-col gap-2.5 mt-6 sm:mt-8">
          {/* WhatsApp */}
          <a
            href={`https://wa.me/${whatsappDigits(contact.cellPhone)}?text=Hola%20${encodeURIComponent(contact.fullName)},%20te%20contacto%20desde%20tu%20vCard%20ICAP.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 h-13 sm:h-14 rounded-full px-4 sm:px-5 bg-[#E8791E] hover:bg-[#D06815] text-[#0B2A4A] font-bold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98]"
          >
            <span className="font-mono-code text-[11px] sm:text-xs px-2 py-0.5 rounded bg-black/15 font-extrabold shrink-0">
              WA
            </span>
            <span className="flex-1 text-left truncate">WhatsApp con {contact.firstName || 'Contacto'}</span>
            <ExternalLink className="w-4 h-4 opacity-70 shrink-0" />
          </a>

          {/* Email */}
          <a
            href={`mailto:${contact.email}?subject=Contacto%20Institucional%20ICAP`}
            className="flex items-center gap-3 h-13 sm:h-14 rounded-full px-4 sm:px-5 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs sm:text-sm border border-white/25 transition-all active:scale-[0.98]"
          >
            <span className="font-mono-code text-[11px] sm:text-xs px-2 py-0.5 rounded bg-white/10 text-[#9FC6E8] font-bold shrink-0">
              MAIL
            </span>
            <span className="flex-1 text-left truncate">Escribir un correo</span>
            <ExternalLink className="w-4 h-4 opacity-70 shrink-0" />
          </a>

          {/* LinkedIn */}
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 h-13 sm:h-14 rounded-full px-4 sm:px-5 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs sm:text-sm border border-white/25 transition-all active:scale-[0.98]"
          >
            <span className="font-mono-code text-[11px] sm:text-xs px-2 py-0.5 rounded bg-white/10 text-[#9FC6E8] font-bold shrink-0">
              IN
            </span>
            <span className="flex-1 text-left truncate">Ver LinkedIn</span>
            <ExternalLink className="w-4 h-4 opacity-70 shrink-0" />
          </a>

          {/* Schedule Meeting */}
          <button
            onClick={() => setScheduleModal(true)}
            className="flex items-center gap-3 h-13 sm:h-14 rounded-full px-4 sm:px-5 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs sm:text-sm border border-white/25 transition-all active:scale-[0.98]"
          >
            <span className="font-mono-code text-[11px] sm:text-xs px-2 py-0.5 rounded bg-white/10 text-[#9FC6E8] font-bold shrink-0">
              CITA
            </span>
            <span className="flex-1 text-left truncate">Agendar una cita</span>
            <Calendar className="w-4 h-4 opacity-70 shrink-0" />
          </button>

          {/* Save Contact (vCard .vcf) */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-3 h-13 sm:h-14 rounded-full px-4 sm:px-5 bg-[#F6F8FA] hover:bg-white text-[#0B2A4A] font-heading font-bold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98] mt-1"
          >
            <span className="font-mono-code text-[11px] sm:text-xs px-2 py-0.5 rounded bg-black/10 text-[#0B2A4A] font-extrabold shrink-0">
              VCF
            </span>
            <span className="flex-1 text-left font-bold uppercase tracking-wide truncate">
              Guardar contacto
            </span>
            <Download className="w-4 h-4 text-[#0B2A4A] shrink-0" />
          </button>
        </div>

        {/* Secondary Info Link */}
        <div className="flex items-center justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <a
              href="https://icap.ac.cr"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 border border-white/20 hover:border-[#E8791E] hover:text-[#E8791E] flex items-center justify-center transition-colors"
              title="Portal Web ICAP"
            >
              <Globe className="w-4 h-4" />
            </a>
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 border border-white/20 hover:border-[#E8791E] hover:text-[#E8791E] flex items-center justify-center transition-colors"
              title="LinkedIn ICAP"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
          </div>

          <a
            href="https://icap.ac.cr"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono-code text-[10px] sm:text-[11px] text-[#9FC6E8] hover:text-[#E8791E] transition-colors flex items-center gap-1"
          >
            <span>Conocé el ICAP</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Footer */}
        <div className="mt-6 sm:mt-8 text-center font-mono-code text-[9px] sm:text-[10px] text-slate-400/80 space-y-0.5">
          <div>ICAP &middot; COSTA RICA</div>
          <div className="text-[8px] sm:text-[9px] text-slate-500">
            SISTEMA DE LA INTEGRACIÓN CENTROAMERICANA
          </div>
        </div>
      </div>

      {/* Bottom Sheet for Agendar Cita */}
      <BottomSheet
        isOpen={scheduleModal}
        onClose={() => setScheduleModal(false)}
        title="Agendar Reunión"
        subtitle="Coordinación Institucional"
        icon={<Calendar className="w-5 h-5 text-[#E8791E]" />}
      >
        <div className="space-y-4 text-center sm:text-left">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Selecciona el canal para coordinar tu cita o videollamada con el representante institucional de ICAP.
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
