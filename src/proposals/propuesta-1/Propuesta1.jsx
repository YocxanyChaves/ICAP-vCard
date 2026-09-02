import React, { useState } from 'react';
import Hero from './Hero';
import MissionVision from './MissionVision';
import ValuesWheel from './ValuesWheel';
import StatsSection from './StatsSection';
import SpecializationAreas from './SpecializationAreas';
import RegionalMap from './RegionalMap';
import AlliesMarquee from './AlliesMarquee';
import ContactSection from './ContactSection';
import BottomSheet from '../../components/BottomSheet';
import { Globe2, Award, History, Building2, ExternalLink } from 'lucide-react';
import { defaultContact } from '../../components/VCardDownload';

export default function Propuesta1({ contact = defaultContact }) {
  const [aboutModalOpen, setAboutModalOpen] = useState(false);

  const scrollToContact = () => {
    const el = document.getElementById('propuesta1-contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-slate-50 text-slate-800 font-sans relative pb-28">
      {/* Sticky Utility Navbar */}
      <header className="sticky top-0 z-40 bg-[#0B2A4A]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full border border-[#E8791E] flex items-center justify-center bg-[#0B2A4A] shrink-0">
            <div className="w-2 h-2 rounded-full bg-[#E8791E]" />
          </div>
          <span className="font-heading font-extrabold text-white text-sm sm:text-base tracking-wider">
            ICAP
          </span>
          <span className="hidden sm:inline-block text-[11px] font-mono-code text-[#9FC6E8] border-l border-white/20 pl-2 ml-1">
            Brochure Institucional
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setAboutModalOpen(true)}
            className="text-xs font-heading font-semibold text-[#EAF3FB] hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            Sobre ICAP
          </button>
          <button
            onClick={scrollToContact}
            className="h-8 px-3.5 sm:px-4 rounded-xl bg-[#E8791E] hover:bg-[#D06815] text-white font-heading font-bold text-xs tracking-wider uppercase shadow transition-all active:scale-95 shrink-0"
          >
            Contactanos
          </button>
        </div>
      </header>

      {/* Main Sections */}
      <main>
        <Hero
          onOpenAbout={() => setAboutModalOpen(true)}
          onScrollToContact={scrollToContact}
        />
        <MissionVision />
        <ValuesWheel />
        <StatsSection />
        <SpecializationAreas />
        <RegionalMap />
        <AlliesMarquee />
        <ContactSection id="propuesta1-contact" contact={contact} />
      </main>

      {/* About ICAP Bottom Sheet for Mobile & Modal for Desktop */}
      <BottomSheet
        isOpen={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
        title="Acerca del ICAP"
        subtitle="Organismo Internacional del SICA"
        icon={
          <div className="w-8 h-8 rounded-lg bg-[#0B2A4A] text-[#E8791E] flex items-center justify-center font-heading font-extrabold text-xs">
            SICA
          </div>
        }
        maxWidth="max-w-xl"
      >
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            El <strong>Instituto Centroamericano de Administración Pública (ICAP)</strong> fue fundado en 1954 como organismo especializado del Sistema de la Integración Centroamericana (SICA), con el mandato de profesionalizar la función pública y fortalecer los Estados de la región.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 my-4">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <History className="w-5 h-5 text-[#0077C8] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-heading font-bold text-xs uppercase text-slate-800 mb-0.5">
                  70+ Años de Historia
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-500">
                  Pioneros en formación y modernización estatal en Centroamérica.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <Award className="w-5 h-5 text-[#E8791E] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-heading font-bold text-xs uppercase text-slate-800 mb-0.5">
                  Acreditación de Posgrados
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-500">
                  Maestrías y doctorados con validez internacional.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <Globe2 className="w-5 h-5 text-[#0077C8] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-heading font-bold text-xs uppercase text-slate-800 mb-0.5">
                  Cooperación Multilateral
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-500">
                  Alianzas estratégicas con organismos globales (BID, ONU, OMS).
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <Building2 className="w-5 h-5 text-[#E8791E] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-heading font-bold text-xs uppercase text-slate-800 mb-0.5">
                  Sede Central en Costa Rica
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-500">
                  Presencia física y centros regionales en países del SICA.
                </p>
              </div>
            </div>
          </div>

          <p>
            A través de la investigación aplicada, el acompañamiento en reformas y la formación de alta dirección, el ICAP contribuye al desarrollo sostenible y democrático.
          </p>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <a
              href="https://icap.ac.cr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0077C8] hover:text-[#E8791E] transition-colors uppercase font-heading"
            >
              <span>Visitar portal web oficial ICAP</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={() => setAboutModalOpen(false)}
              className="w-full sm:w-auto py-2.5 px-6 rounded-2xl bg-[#0B2A4A] hover:bg-[#092647] text-white font-heading font-bold text-xs uppercase tracking-wider transition-colors shadow"
            >
              Cerrar
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
