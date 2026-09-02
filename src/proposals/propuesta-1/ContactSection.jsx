import React, { useState } from 'react';
import { User, MessageCircle, Mail, Calendar, MapPin, Globe, Check, ExternalLink, Sparkles } from 'lucide-react';
import { LinkedinIcon } from '../../components/Icons';
import VCardDownload, { defaultContact, whatsappDigits } from '../../components/VCardDownload';
import BottomSheet from '../../components/BottomSheet';

export default function ContactSection({ contact = defaultContact, id = 'contacto' }) {
  const [scheduleModal, setScheduleModal] = useState(false);

  return (
    <section id={id} className="px-4 sm:px-6 py-14 sm:py-24 bg-slate-50 relative">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-[11px] sm:text-xs font-bold tracking-widest uppercase text-[#E8791E] block mb-1.5 font-mono-code">
            Hablemos
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-[#0B2A4A] tracking-tight">
            Ficha de Contacto
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
            Punto de contacto oficial para proyectos, posgrados y cooperación institucional.
          </p>
        </div>

        {/* Executive Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl border border-slate-100 flex flex-col gap-5 sm:gap-6 relative overflow-hidden">
          {/* Top accent strip */}
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#0B2A4A] via-[#0077C8] to-[#E8791E]" />

          {/* Profile Header */}
          <div className="flex items-center gap-3.5 sm:gap-5">
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#0B2A4A] flex items-center justify-center text-white border-2 border-slate-100 shadow-md">
                <User className="w-8 h-8 sm:w-10 sm:h-10 text-[#9FC6E8]" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#E8791E] border-2 border-white flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="inline-block px-2.5 py-0.5 rounded-md bg-[#FBE6D2] text-[#B8802E] text-[9px] sm:text-[10px] font-mono-code font-bold tracking-wider uppercase mb-1">
                {contact.isSample ? 'Dato de ejemplo' : 'Representante ICAP'}
              </div>
              <h3 className="font-heading font-extrabold text-base sm:text-xl text-[#0B2A4A] truncate">
                {contact.fullName}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium truncate">
                {contact.title}
              </p>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono-code mt-0.5 truncate">
                ICAP &middot; Sede Central
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col gap-2.5">
            {/* WhatsApp */}
            <a
              href={`https://wa.me/${whatsappDigits(contact.cellPhone)}?text=Hola%20${encodeURIComponent(contact.fullName)},%20te%20contacto%20desde%20el%20brochure%20ICAP.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between h-13 px-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-heading font-bold text-xs tracking-wider uppercase border border-emerald-200/60 transition-all active:scale-[0.99]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span className="truncate">WhatsApp Directo</span>
              </div>
              <ExternalLink className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
            </a>

            {/* Email */}
            <a
              href={`mailto:${contact.email}?subject=Contacto%20Institucional%20ICAP`}
              className="flex items-center justify-between h-13 px-4 rounded-2xl bg-[#EAF3FB] hover:bg-[#D5E9F8] text-[#0B5EA8] font-heading font-bold text-xs tracking-wider uppercase border border-[#0077C8]/20 transition-all active:scale-[0.99]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#0077C8] text-white flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="truncate">Enviar Correo</span>
              </div>
              <ExternalLink className="w-4 h-4 text-[#0077C8] shrink-0 ml-2" />
            </a>

            {/* LinkedIn */}
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between h-13 px-4 rounded-2xl bg-[#EAF3FB] hover:bg-[#D5E9F8] text-[#0B5EA8] font-heading font-bold text-xs tracking-wider uppercase border border-[#0077C8]/20 transition-all active:scale-[0.99]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#0B2A4A] text-white flex items-center justify-center shrink-0">
                  <LinkedinIcon className="w-4 h-4" />
                </div>
                <span className="truncate">Perfil LinkedIn</span>
              </div>
              <ExternalLink className="w-4 h-4 text-[#0B2A4A] shrink-0 ml-2" />
            </a>

            {/* Schedule Meeting */}
            <button
              onClick={() => setScheduleModal(true)}
              className="flex items-center justify-between h-13 px-4 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-heading font-bold text-xs tracking-wider uppercase border border-slate-200 transition-all active:scale-[0.99]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <span className="truncate">Agendar una Cita</span>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
            </button>
          </div>

          {/* Primary Action: Guardar Contacto (.vcf download) */}
          <div className="pt-2 border-t border-slate-100">
            <VCardDownload contact={contact} />
            <p className="text-[11px] text-center text-slate-400 mt-2">
              Descarga la tarjeta digital (.vcf) directamente en tu agenda de contactos.
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center mt-8 text-xs text-slate-500 space-y-1">
          <div className="font-heading font-semibold text-slate-700">
            ICAP &middot; San José, Costa Rica &middot; SICA
          </div>
          <a
            href="https://icap.ac.cr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0077C8] hover:underline font-mono-code inline-block"
          >
            www.icap.ac.cr
          </a>
        </div>
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
            Selecciona el canal que prefieras para coordinar una sesión presencial o virtual con el representante de ICAP.
          </p>

          <div className="flex flex-col gap-2.5 pt-2">
            <a
              href={`https://wa.me/${whatsappDigits(contact.cellPhone)}?text=Hola,%20me%20gustaría%20agendar%20una%20reunión%20con%20el%20ICAP.`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs uppercase tracking-wider transition-colors block text-center shadow-md"
            >
              Coordinar vía WhatsApp
            </a>
            <a
              href={`mailto:${contact.email}?subject=Solicitud%20de%20Reunión%20con%20ICAP`}
              className="py-3.5 px-4 rounded-2xl bg-[#0077C8] hover:bg-[#0060A0] text-white font-heading font-bold text-xs uppercase tracking-wider transition-colors block text-center shadow-md"
            >
              Solicitar por Correo Electrónico
            </a>
            <button
              onClick={() => setScheduleModal(false)}
              className="py-3.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-heading font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </BottomSheet>
    </section>
  );
}
