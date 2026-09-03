import React, { useEffect, useRef, useState } from 'react';
import Hero from './Hero';
import MissionVision from './MissionVision';
import ValuesWheel from './ValuesWheel';
import StatsSection from './StatsSection';
import SpecializationAreas from './SpecializationAreas';
import RegionalMap from './RegionalMap';
import AlliesMarquee from './AlliesMarquee';
import ContactSection from './ContactSection';
import BottomSheet from '../../components/BottomSheet';
import {
  Globe2,
  Award,
  History,
  Building2,
  ExternalLink,
  Home,
  Compass,
  Sparkles,
  LayoutGrid,
  MapPinned,
  Phone
} from 'lucide-react';
import { defaultContact } from '../../components/VCardDownload';

const PAGES = [
  { id: 'inicio', label: 'Inicio', icon: Home },
  { id: 'mision', label: 'Misión', icon: Compass },
  { id: 'valores', label: 'Valores', icon: Sparkles },
  { id: 'areas', label: 'Áreas', icon: LayoutGrid },
  { id: 'presencia', label: 'Presencia', icon: MapPinned },
  { id: 'contacto', label: 'Contacto', icon: Phone }
];

export default function Propuesta1({ contact = defaultContact }) {
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [activePage, setActivePage] = useState('inicio');
  const mainRef = useRef(null);

  const goToPage = (id) => {
    setActivePage(id);
  };

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'instant' in document.documentElement.style ? 'instant' : 'auto' });
    }
  }, [activePage]);

  const renderPage = () => {
    switch (activePage) {
      case 'inicio':
        return (
          <>
            <Hero
              onOpenAbout={() => setAboutModalOpen(true)}
              onScrollToContact={() => goToPage('contacto')}
            />
            <StatsSection />
            <AlliesMarquee />
          </>
        );
      case 'mision':
        return <MissionVision />;
      case 'valores':
        return <ValuesWheel />;
      case 'areas':
        return <SpecializationAreas />;
      case 'presencia':
        return <RegionalMap />;
      case 'contacto':
        return <ContactSection id="propuesta1-contact" contact={contact} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-screen bg-slate-50 text-slate-800 font-sans relative flex flex-col overflow-hidden">
      {/* Sticky Utility Navbar */}
      <header className="shrink-0 z-40 bg-[#003366]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full border border-[#0077C8] flex items-center justify-center bg-[#003366] shrink-0">
            <div className="w-2 h-2 rounded-full bg-[#0077C8]" />
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
            onClick={() => goToPage('contacto')}
            className="h-8 px-3.5 sm:px-4 rounded-xl bg-[#0077C8] hover:bg-[#005A96] text-white font-heading font-bold text-xs tracking-wider uppercase shadow transition-all active:scale-95 shrink-0"
          >
            Contactanos
          </button>
        </div>
      </header>

      {/* Active Page */}
      <main ref={mainRef} className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
        <div key={activePage} className="animate-page-in">
          {renderPage()}
        </div>
      </main>

      {/* Bottom App Navigation */}
      <nav className="shrink-0 z-30 bg-white border-t border-slate-200 shadow-[0_-4px_16px_rgba(0,51,102,0.08)] px-1 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] flex items-stretch justify-between">
        {PAGES.map((page) => {
          const Icon = page.icon;
          const active = activePage === page.id;
          return (
            <button
              key={page.id}
              onClick={() => goToPage(page.id)}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-xl transition-colors relative"
            >
              {active && (
                <span className="absolute -top-1.5 w-8 h-1 rounded-full bg-[#0077C8]" />
              )}
              <Icon
                className={`w-[19px] h-[19px] transition-all ${
                  active ? 'text-[#0077C8] scale-110' : 'text-slate-400'
                }`}
                strokeWidth={active ? 2.4 : 2}
              />
              <span
                className={`text-[9px] font-heading tracking-wide transition-colors ${
                  active ? 'text-[#003366] font-bold' : 'text-slate-400 font-semibold'
                }`}
              >
                {page.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* About ICAP Bottom Sheet for Mobile & Modal for Desktop */}
      <BottomSheet
        isOpen={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
        title="Acerca del ICAP"
        subtitle="Organismo Internacional del SICA"
        icon={
          <div className="w-8 h-8 rounded-lg bg-[#003366] text-[#0077C8] flex items-center justify-center font-heading font-extrabold text-xs">
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
              <Award className="w-5 h-5 text-[#0077C8] shrink-0 mt-0.5" />
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
              <Building2 className="w-5 h-5 text-[#0077C8] shrink-0 mt-0.5" />
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
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0077C8] hover:text-[#0077C8] transition-colors uppercase font-heading"
            >
              <span>Visitar portal web oficial ICAP</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={() => setAboutModalOpen(false)}
              className="w-full sm:w-auto py-2.5 px-6 rounded-2xl bg-[#003366] hover:bg-[#001F3D] text-white font-heading font-bold text-xs uppercase tracking-wider transition-colors shadow"
            >
              Cerrar
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
