import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Hero from './Hero';
import MissionVision from './MissionVision';
import ValuesWheel from './ValuesWheel';
import StatsSection from './StatsSection';
import SpecializationAreas from './SpecializationAreas';
import AuthoritiesSection from './AuthoritiesSection';
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
  Smartphone,
  Monitor,
  Globe,
  Sun,
  Moon
} from 'lucide-react';
import { defaultContact } from '../../components/VCardDownload';
import { PAGES } from './navigation';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../theme/ThemeContext';
import icapLogoMark from '../../assets/icap-logo-mark.png';

export default function Propuesta1({
  contact = defaultContact,
  viewMode = 'full',
  onSetViewMode = () => {}
}) {
  const { lang, toggleLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
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

  // --- Esfera animada del menú inferior --------------------------------
  // Un solo "blob" que se mide contra el botón activo y se traslada con
  // una curva de rebote (spring) hacia esa posición, en vez de redibujar
  // un indicador distinto por botón. Así el movimiento entre secciones
  // (p. ej. Autoridades -> Contacto) se ve como una esfera que fluye por
  // el menú en lugar de saltar de golpe.
  const navRef = useRef(null);
  const itemRefs = useRef({});
  const [orb, setOrb] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const [orbReady, setOrbReady] = useState(false);

  const measureOrb = () => {
    const nav = navRef.current;
    const btn = itemRefs.current[activePage];
    if (!nav || !btn) return;
    const navRect = nav.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    setOrb({
      left: btnRect.left - navRect.left,
      top: btnRect.top - navRect.top,
      width: btnRect.width,
      height: btnRect.height
    });
  };

  useLayoutEffect(() => {
    measureOrb();
    if (!orbReady) {
      // Coloca la esfera de una vez en su sitio antes de activar la
      // transición, para que no "viaje" desde la esquina en el montaje.
      const id = requestAnimationFrame(() => setOrbReady(true));
      return () => cancelAnimationFrame(id);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage]);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(() => measureOrb());
    ro.observe(nav);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case 'inicio':
        return (
          <>
            <Hero
              onOpenAbout={() => setAboutModalOpen(true)}
              onScrollToContact={() => goToPage('contacto')}
              onNavigate={goToPage}
            />
            <StatsSection />
            <AlliesMarquee />
          </>
        );
      case 'mision':
        return <MissionVision />;
      case 'valores':
        return <ValuesWheel />;
      case 'autoridades':
        return <AuthoritiesSection />;
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
    <div
      className={`w-full h-screen bg-slate-50 dark:bg-[#001428] text-slate-800 dark:text-slate-100 font-sans relative flex flex-col overflow-hidden ${
        theme === 'dark' ? 'dark' : ''
      }`}
    >
      {/* Sticky Utility Navbar */}
      <header className="shrink-0 z-40 bg-[#003366]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm">
        <button
          onClick={() => goToPage('inicio')}
          className="flex items-center gap-2 cursor-pointer group"
          title={t.header.home}
        >
          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0 ring-1 ring-white/40 shadow-sm transition-transform group-hover:scale-105">
            <img
              src={icapLogoMark}
              alt="Isotipo ICAP"
              className="w-[68%] h-[68%] object-contain"
              draggable={false}
            />
          </div>
          <span className="font-heading font-extrabold text-white text-sm sm:text-base tracking-wider">
            ICAP
          </span>
          <span className="hidden sm:inline-block text-[11px] font-mono-code text-[#9FC6E8] border-l border-white/20 pl-2 ml-1">
            {t.header.subtitle}
          </span>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Viewport preview toggle: real / mobile-frame (390px vía iframe) */}
          <div className="flex items-center bg-black/30 p-0.5 rounded-lg border border-white/10 shrink-0">
            <button
              onClick={() => onSetViewMode('full')}
              title={t.header.fullView}
              aria-pressed={viewMode === 'full'}
              className={`flex items-center justify-center w-7 h-7 rounded-md transition-all ${
                viewMode === 'full'
                  ? 'bg-[#0077C8] text-white shadow'
                  : 'text-[#9FC6E8] hover:text-white hover:bg-white/10'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onSetViewMode('mobile')}
              title={t.header.mobileView}
              aria-pressed={viewMode === 'mobile'}
              className={`flex items-center justify-center w-7 h-7 rounded-md transition-all ${
                viewMode === 'mobile'
                  ? 'bg-[#0077C8] text-white shadow'
                  : 'text-[#9FC6E8] hover:text-white hover:bg-white/10'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Selector de idioma: a la par del toggle de vista, mismo
              lenguaje visual (icono de mundo + código de 2 letras) que
              cualquier switch ES/EN reconocible al toque. */}
          <button
            onClick={toggleLang}
            title={t.header.language}
            className="flex items-center gap-1.5 bg-black/30 hover:bg-white/10 p-0.5 pr-2.5 rounded-lg border border-white/10 shrink-0 text-[#9FC6E8] hover:text-white transition-all cursor-pointer"
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-[#0077C8] text-white shadow shrink-0">
              <Globe className="w-3.5 h-3.5" />
            </span>
            <span className="text-[10px] font-heading font-bold tracking-wider uppercase">
              {lang === 'es' ? 'EN' : 'ES'}
            </span>
          </button>

          {/* Switch de tema claro/oscuro: mismo lenguaje visual que el de
              idioma (ícono + fondo oscuro), a la par. Muestra el sol
              cuando el sitio está en oscuro (click para pasar a claro) y
              la luna cuando está en claro (click para pasar a oscuro) —
              siempre el ícono del modo AL QUE se va a cambiar. */}
          <button
            onClick={toggleTheme}
            title={t.header.theme}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-black/30 hover:bg-white/10 border border-white/10 shrink-0 text-[#9FC6E8] hover:text-white transition-all cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setAboutModalOpen(true)}
            className="text-xs font-heading font-semibold text-[#EAF3FB] hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            {t.header.about}
          </button>
          <button
            onClick={() => goToPage('contacto')}
            className="h-8 px-3.5 sm:px-4 rounded-xl bg-[#0077C8] hover:bg-[#005A96] text-white font-heading font-bold text-xs tracking-wider uppercase shadow transition-all active:scale-95 shrink-0"
          >
            {t.header.contact}
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
      <nav
        ref={navRef}
        className="shrink-0 z-30 bg-white dark:bg-[#00152B] border-t border-slate-200 dark:border-white/10 shadow-[0_-4px_16px_rgba(0,51,102,0.08)] dark:shadow-[0_-4px_16px_rgba(0,0,0,0.4)] px-1 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] flex items-stretch justify-between relative"
      >
        {/* Esfera animada del menú: un wrapper de posición (transición de
            traslado) que envuelve el halo pulsante y la esfera principal,
            para que ambos viajen juntos hacia el botón activo. */}
        <div
          aria-hidden="true"
          className="absolute pointer-events-none z-0"
          style={{
            left: 0,
            top: 0,
            width: orb.width,
            height: orb.height,
            transform: `translate(${orb.left}px, ${orb.top}px)`,
            transition: orbReady
              ? 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease'
              : 'none'
          }}
        >
          {/* Halo suave, le da profundidad y un ligero pulso */}
          <div
            className="absolute inset-0 rounded-full blur-md animate-pulse-slow"
            style={{ background: 'radial-gradient(circle, #0077C8 0%, rgba(0,119,200,0) 72%)' }}
          />
          {/* Esfera principal */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle at 35% 28%, #4FB2F2 0%, #0077C8 55%, #003366 100%)',
              boxShadow: '0 8px 18px -3px rgba(0,51,102,0.5), inset 0 1px 3px rgba(255,255,255,0.4)'
            }}
          />
        </div>
        {PAGES.map((page) => {
          const Icon = page.icon;
          const active = activePage === page.id;
          return (
            <button
              key={page.id}
              ref={(el) => {
                itemRefs.current[page.id] = el;
              }}
              onClick={() => goToPage(page.id)}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-xl transition-colors relative z-10"
            >
              <Icon
                className={`w-[19px] h-[19px] transition-all duration-300 ${
                  active ? 'text-white scale-110' : 'text-slate-400'
                }`}
                strokeWidth={active ? 2.4 : 2}
              />
              <span
                className={`text-[9px] font-heading tracking-wide transition-colors duration-300 ${
                  active ? 'text-white font-bold' : 'text-slate-400 font-semibold'
                }`}
              >
                {t.nav[page.id]}
              </span>
            </button>
          );
        })}
      </nav>

      {/* About ICAP Bottom Sheet for Mobile & Modal for Desktop */}
      <BottomSheet
        isOpen={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
        title={t.aboutModal.title}
        subtitle={t.aboutModal.subtitle}
        icon={
          <div className="w-8 h-8 rounded-lg bg-[#003366] text-[#0077C8] flex items-center justify-center font-heading font-extrabold text-xs">
            SICA
          </div>
        }
        maxWidth="max-w-xl"
      >
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            {t.aboutModal.intro}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 my-4">
            {[History, Award, Globe2, Building2].map((Icon, i) => {
              const card = t.aboutModal.cards[i];
              return (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-start gap-3">
                  <Icon className="w-5 h-5 text-[#0077C8] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-heading font-bold text-xs uppercase text-slate-800 dark:text-white mb-0.5">
                      {card.title}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                      {card.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <p>
            {t.aboutModal.outro}
          </p>

          <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <a
              href="https://icap.ac.cr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0077C8] hover:text-[#0077C8] transition-colors uppercase font-heading"
            >
              <span>{t.aboutModal.visitLink}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={() => setAboutModalOpen(false)}
              className="w-full sm:w-auto py-2.5 px-6 rounded-2xl bg-[#003366] hover:bg-[#001F3D] text-white font-heading font-bold text-xs uppercase tracking-wider transition-colors shadow"
            >
              {t.aboutModal.close}
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
