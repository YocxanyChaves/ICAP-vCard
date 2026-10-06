import React, { useEffect, useRef, useState } from 'react';
import {
  MessageCircle,
  Mail,
  Calendar,
  ExternalLink,
  BadgeCheck,
  MapPin,
  Navigation,
  Phone,
  Globe,
  Handshake,
  GraduationCap
} from 'lucide-react';
import { LinkedinIcon } from '../../components/Icons';
import VCardDownload, { defaultContact, whatsappDigits } from '../../components/VCardDownload';
import BottomSheet from '../../components/BottomSheet';
import KickerBadge from './KickerBadge';
import { useLanguage } from '../../i18n/LanguageContext';
import icapEscudoNavy from '../../assets/icap-escudo-navy.png';
import icapEscudoWhite from '../../assets/icap-escudo-white.png';
import icapLogoMark from '../../assets/icap-logo-mark.png';

// Mismo degradado celeste (con su brillo radial arriba-izquierda) que
// las fichas de "Áreas de Especialización" — se reutiliza tal cual acá
// para la franja del perfil, así la Ficha de Contacto se siente parte
// de la misma familia visual en vez de una pieza aparte al final del
// recorrido.
const PROFILE_BACKGROUND =
  'radial-gradient(65% 70% at 14% -8%, rgba(255,255,255,0.4), transparent 42%), ' +
  'linear-gradient(160deg, #0090DD 0%, #0068AE 48%, #013A63 100%)';

const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent('Instituto Centroamericano de Administración Pública ICAP, Curridabat, San José, Costa Rica');

// Mismo caso que AuthoritiesSection: Contacto es compartido entre AT y
// Docencia (mismo componente), con el kicker en el estilo del
// departamento activo (glow de AT / dot de Docencia) vía `dept`.
// Yocxany pidió que la ficha fuera de la INSTITUCIÓN y no de una
// persona, así que `dept` además define el tema de la consulta: se
// muestra en la ficha y viaja prellenado en los mensajes de WhatsApp y
// correo, para que el ICAP sepa de entrada a qué departamento derivar.
export default function ContactSection({ contact = defaultContact, id = 'contacto', dept = 'at' }) {
  const { t } = useLanguage();
  const [scheduleModal, setScheduleModal] = useState(false);
  const topic = dept === 'docencia' ? t.header.deptDocencia : t.header.deptAT;
  const DeptIcon = dept === 'docencia' ? GraduationCap : Handshake;

  // Tarjeta .vcf de la institución (no de una persona): mismos teléfono,
  // correo, sitio y dirección del contacto, con el ICAP como nombre.
  const institutionalCard = {
    firstName: 'ICAP',
    lastName: '',
    fullName: 'ICAP',
    title: t.contact.orgName,
    org: 'Instituto Centroamericano de Administración Pública (ICAP)',
    phone: contact.phone,
    cellPhone: contact.cellPhone,
    email: contact.email,
    url: contact.url,
    address: contact.address,
    notes: t.vcard.notes,
    fileName: 'ICAP.vcf'
  };

  // Misma entrada suave que ya usan Cifras y la ficha de Valores
  // (fundido + alzado, con la animación que ya vive en global.css) —
  // nada nuevo que mantener, sólo el mismo gesto de "esta sección
  // apareció" que el resto del brochure.
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;

    const view = el.ownerDocument?.defaultView;
    const IO = view?.IntersectionObserver;

    if (!IO) {
      setVisible(true);
      return undefined;
    }

    const observer = new IO(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id={id} className="px-4 sm:px-6 pt-[var(--docencia-gap)] pb-14 sm:pb-24 bg-[#D6E9F7] dark:bg-[#001F3D] relative overflow-hidden">
      {/* Escudo grande y apenas insinuado de fondo, como el que ya
          "marca de agua" a Misión — el mismo gesto para cerrar el
          brochure con esa firma institucional. */}
      <img
        src={icapEscudoNavy}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="pointer-events-none select-none absolute w-72 sm:w-96 -right-16 -top-10 opacity-[0.05] rotate-[8deg]"
      />

      <div ref={sectionRef} className="max-w-xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-1.5 sm:mb-2 flex justify-center">
            <KickerBadge variant={dept === 'docencia' ? 'dot' : 'glow'}>{t.contact.kicker}</KickerBadge>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-[#003366] dark:text-[#9FC6E8] tracking-tight">
            {t.contact.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-900 dark:text-slate-300 mt-2 max-w-sm mx-auto leading-relaxed">
            {t.contact.subtitle}
          </p>
        </div>

        {/* Institutional Card */}
        <div className={visible ? 'animate-value-card-in' : 'opacity-0'}>
          <div className="mv-card-light bg-white dark:bg-[#003366] rounded-[28px] overflow-hidden">
            {/* Franja de perfil en el mismo celeste 3D de Áreas. Ya no es
                la ficha de una persona sino la del ICAP como institución:
                isotipo en vez de avatar, nombre oficial y, abajo, el tema
                de la consulta según el departamento que se está viendo. */}
            <div className="relative px-5 pt-6 pb-6 sm:px-8 sm:pt-8 sm:pb-7 overflow-hidden" style={{ background: PROFILE_BACKGROUND }}>
              <span
                aria-hidden="true"
                className="absolute top-0 left-7 right-7 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
              />
              <img
                src={icapEscudoWhite}
                alt=""
                aria-hidden="true"
                draggable={false}
                className="pointer-events-none select-none absolute w-40 sm:w-48 -right-8 -bottom-10 opacity-[0.12] rotate-[9deg]"
              />

              <div className="relative flex items-center gap-3.5 sm:gap-5">
                <div className="relative shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white flex items-center justify-center shadow-lg ring-4 ring-white/20">
                    <img src={icapLogoMark} alt="ICAP" draggable={false} className="w-[70%] h-[70%] object-contain" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#0077C8] text-white border-2 border-white flex items-center justify-center shadow-sm">
                    <BadgeCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="inline-block px-2.5 py-0.5 rounded-md bg-white/15 border border-white/20 text-white text-[9px] sm:text-[10px] font-mono-code font-bold tracking-wider uppercase mb-1">
                    {t.contact.institutionTag}
                  </div>
                  <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-white tracking-wider leading-none">ICAP</h3>
                  <p className="text-xs sm:text-sm text-white/90 font-medium leading-snug mt-1">{t.contact.orgName}</p>
                  <p className="text-[10px] sm:text-[11px] text-white/65 font-mono-code mt-0.5 truncate">{t.contact.hqLine}</p>
                </div>
              </div>

              <div className="relative mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/20 border border-white/15 text-[10px] sm:text-[11px] font-heading font-semibold text-white/85">
                <DeptIcon className="w-3.5 h-3.5 text-[#bfe6ff]" />
                <span>
                  {t.contact.topicLabel} <span className="font-extrabold text-white">{topic}</span>
                </span>
              </div>
            </div>

            {/* Cuerpo: datos de la sede + acciones rápidas + guardar contacto */}
            <div className="p-5 sm:p-8 flex flex-col gap-5 sm:gap-6">
              {/* Datos institucionales */}
              <div className="rounded-2xl border border-slate-100 dark:border-white/10 divide-y divide-slate-100 dark:divide-white/10 overflow-hidden">
                <div className="flex items-start gap-3 p-3.5">
                  <MapPin className="w-4 h-4 text-[#0077C8] dark:text-[#4FB2F2] shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {t.contact.infoAddress}
                    </p>
                    <p className="text-xs text-slate-800 dark:text-slate-100 leading-relaxed">{contact.address}</p>
                    <a
                      href={MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-1 text-[11px] font-heading font-bold text-[#0077C8] dark:text-[#4FB2F2] hover:underline"
                    >
                      <Navigation className="w-3 h-3" />
                      {t.contact.directions}
                    </a>
                  </div>
                </div>
                <div className="grid grid-cols-2 divide-x divide-slate-100 dark:divide-white/10">
                  <a
                    href={`tel:+${whatsappDigits(contact.phone)}`}
                    className="flex items-start gap-3 p-3.5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors min-w-0"
                  >
                    <Phone className="w-4 h-4 text-[#0077C8] dark:text-[#4FB2F2] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {t.contact.infoPhone}
                      </p>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">{contact.phone}</p>
                    </div>
                  </a>
                  <a
                    href={contact.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3.5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors min-w-0"
                  >
                    <Globe className="w-4 h-4 text-[#0077C8] dark:text-[#4FB2F2] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {t.contact.infoWeb}
                      </p>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">icap.ac.cr</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex flex-col gap-2.5">
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${whatsappDigits(contact.cellPhone)}?text=${encodeURIComponent(t.contact.whatsappMessage(topic))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between h-13 px-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-heading font-bold text-xs tracking-wider uppercase border border-emerald-200/60 dark:border-emerald-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] active:translate-y-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <span className="truncate">{t.contact.whatsapp}</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 ml-2" />
                </a>

                {/* Email */}
                <a
                  href={`mailto:${contact.email}?subject=${encodeURIComponent(t.contact.emailSubject(topic))}`}
                  className="flex items-center justify-between h-13 px-4 rounded-2xl bg-[#EAF3FB] dark:bg-white/5 hover:bg-[#D5E9F8] dark:hover:bg-white/10 text-[#003366] dark:text-white font-heading font-bold text-xs tracking-wider uppercase border border-[#0077C8]/20 dark:border-white/10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] active:translate-y-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-[#0077C8] text-white flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span className="truncate">{t.contact.email}</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[#0077C8] dark:text-[#4FB2F2] shrink-0 ml-2" />
                </a>

                {/* LinkedIn */}
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between h-13 px-4 rounded-2xl bg-[#EAF3FB] dark:bg-white/5 hover:bg-[#D5E9F8] dark:hover:bg-white/10 text-[#003366] dark:text-white font-heading font-bold text-xs tracking-wider uppercase border border-[#0077C8]/20 dark:border-white/10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] active:translate-y-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-[#003366] text-white flex items-center justify-center shrink-0">
                      <LinkedinIcon className="w-4 h-4" />
                    </div>
                    <span className="truncate">{t.contact.linkedin}</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[#003366] dark:text-[#9FC6E8] shrink-0 ml-2" />
                </a>

                {/* Schedule Meeting */}
                <button
                  onClick={() => setScheduleModal(true)}
                  className="flex items-center justify-between h-13 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-slate-100 font-heading font-bold text-xs tracking-wider uppercase border border-slate-200 dark:border-white/10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] active:translate-y-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-slate-800 dark:bg-white/15 text-white flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <span className="truncate">{t.contact.schedule}</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0 ml-2" />
                </button>
              </div>

              {/* Primary Action: Guardar Contacto (.vcf institucional) */}
              <div className="pt-2 border-t border-slate-100 dark:border-white/10">
                <VCardDownload
                  contact={institutionalCard}
                  className="w-full text-white hover:brightness-110"
                  style={{ background: 'linear-gradient(135deg, #0090DD 0%, #0068AE 55%, #013A63 100%)' }}
                />
                <p className="text-[11px] text-center text-slate-500 dark:text-slate-300 mt-2">
                  {t.contact.saveHint}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center mt-8 text-xs text-slate-700 dark:text-slate-300 space-y-1">
          <div className="font-heading font-semibold text-slate-700 dark:text-slate-200">
            {t.contact.footerLine}
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
        title={t.contact.scheduleModalTitle}
        subtitle={t.contact.scheduleModalSubtitle}
        icon={<Calendar className="w-5 h-5 text-[#0077C8]" />}
      >
        <div className="space-y-4 text-center sm:text-left">
          <p className="text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-relaxed">
            {t.contact.scheduleModalText}
          </p>

          <div className="flex flex-col gap-2.5 pt-2">
            <a
              href={`https://wa.me/${whatsappDigits(contact.cellPhone)}?text=${encodeURIComponent(t.contact.scheduleWhatsappMessage(topic))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs uppercase tracking-wider transition-colors block text-center shadow-md"
            >
              {t.contact.viaWhatsapp}
            </a>
            <a
              href={`mailto:${contact.email}?subject=${encodeURIComponent(t.contact.scheduleEmailSubject(topic))}`}
              className="py-3.5 px-4 rounded-2xl bg-[#0077C8] hover:bg-[#005A96] text-white font-heading font-bold text-xs uppercase tracking-wider transition-colors block text-center shadow-md"
            >
              {t.contact.viaEmail}
            </a>
            <button
              onClick={() => setScheduleModal(false)}
              className="py-3.5 px-4 rounded-2xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 font-heading font-bold text-xs uppercase tracking-wider transition-colors"
            >
              {t.common.close}
            </button>
          </div>
        </div>
      </BottomSheet>
    </section>
  );
}
