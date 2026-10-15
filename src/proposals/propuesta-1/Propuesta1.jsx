import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Hero from './Hero';
import MissionVision from './MissionVision';
import ValuesWheel from './ValuesWheel';
import StatsSection from './StatsSection';
import SpecializationAreas from './SpecializationAreas';
import AuthoritiesSection from './AuthoritiesSection';
import RegionalMap from './RegionalMap';
import ProyectosAT from './ProyectosAT';
import AlliesMarquee from './AlliesMarquee';
import ContactSection from './ContactSection';
import DocenciaMision from './DocenciaMision';
import DocenciaImpacto from './DocenciaImpacto';
import DocenciaInvestigacion from './DocenciaInvestigacion';
import DocenciaPublicaciones from './DocenciaPublicaciones';
import DocenciaAreasWheel from './DocenciaAreasWheel';
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
  Moon,
  Settings
} from 'lucide-react';
import { defaultContact } from '../../components/VCardDownload';
import { PAGES, DOCENCIA_PAGES } from './navigation';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../theme/ThemeContext';
import icapLogoMark from '../../assets/icap-logo-mark.png';

export default function Propuesta1({
  contact = defaultContact,
  viewMode = 'full',
  onSetViewMode = () => {}
}) {
  const { lang, setLang, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [activePage, setActivePage] = useState('inicio');
  const mainRef = useRef(null);

  // --- Departamento activo: Asistencia Técnica / Docencia --------------
  // Los dos comparten el mismo Hero, el mismo tema/idioma/vista (todo
  // eso vive arriba, fuera de este componente) y, por ahora, también
  // Autoridades y Contacto (mismos ids en PAGES/DOCENCIA_PAGES => mismo
  // componente, mismo contenido — puede que más adelante Autoridades
  // termine variando por departamento, pero eso se decide después). El
  // resto de subsecciones son propias de cada uno.
  const [activeDept, setActiveDept] = useState('at');
  const activePages = activeDept === 'at' ? PAGES : DOCENCIA_PAGES;

  // Cambiar de departamento aterriza en el Hero compartido, salvo que
  // ya se esté en Autoridades o Contacto — esas dos son las únicas
  // subsecciones compartidas entre los dos departamentos (mismo
  // componente/contenido, sólo cambia el color del kicker — ver
  // AuthoritiesSection.jsx/ContactSection.jsx), así que ahí sí tiene
  // sentido quedarse viéndolas en vez de mandar de vuelta al Hero.
  // Para cualquier otra subsección (propia de un solo departamento,
  // como "Valores" de AT o "Impacto" de Docencia) sí hay que volver,
  // porque esa subsección no existe del otro lado.
  const switchDept = (dept) => {
    setActiveDept(dept);
    if (activePage !== 'autoridades' && activePage !== 'contacto') {
      setActivePage('inicio');
    }
  };

  // --- Menú de configuración (engranaje) --------------------------------
  // Agrupa vista/idioma/tema en un solo dropdown en vez de tres controles
  // sueltos en el header, que ya competían por espacio con "Sobre ICAP" y
  // "Contactanos" en pantallas angostas.
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef(null);

  useEffect(() => {
    if (!settingsOpen) return undefined;
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [settingsOpen]);

  // `filtro` sólo lo usa Proyectos: las secciones de Áreas, Presencia y
  // Socios mandan ahí con la etiqueta, el país o el socio ya elegido (ver
  // ProyectosAT.jsx). Navegar desde el menú lo deja vacío.
  const [filtroProyectos, setFiltroProyectos] = useState(null);
  const goToPage = (id, filtro = null) => {
    setFiltroProyectos(filtro);
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
  }, [activePage, activePages]);

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
              pages={activePages}
            />
            {/* Debajo del Hero, cada departamento sigue con lo suyo: AT
                mantiene "ICAP en Cifras" y "Organismos y Socios" (así
                estaba antes de Docencia), mientras que en Docencia el
                Hero va solo — al bajar entra directo al texto de
                Formación, sin el carrusel de cards (eso queda sólo en
                la página dedicada "Formación" del menú — ver el prop
                showCards en DocenciaMision.jsx). */}
            {activeDept === 'at' ? (
              <>
                <StatsSection />
                <AlliesMarquee onNavigate={goToPage} />
              </>
            ) : (
              <DocenciaMision showCards={false} />
            )}
          </>
        );
      case 'mision':
        return <MissionVision />;
      case 'valores':
        return <ValuesWheel />;
      case 'autoridades':
        return <AuthoritiesSection dept={activeDept} />;
      case 'areas':
        return <SpecializationAreas onNavigate={goToPage} />;
      case 'presencia':
        return <RegionalMap onNavigate={goToPage} />;
      case 'proyectos':
        return <ProyectosAT filtroInicial={filtroProyectos} />;
      case 'contacto':
        return <ContactSection id="propuesta1-contact" contact={contact} dept={activeDept} />;
      // --- Subsecciones propias de Docencia ---------------------------
      // "Formación" en el menú va sólo con el carrusel de cards — el
      // texto de introducción ya se muestra debajo del Hero en Inicio,
      // así que acá no se repite (ver showIntro en DocenciaMision.jsx).
      case 'docenciaMision':
        return <DocenciaMision showIntro={false} />;
      case 'docenciaImpacto':
        return <DocenciaImpacto />;
      case 'docenciaInvestigacion':
        return <DocenciaInvestigacion />;
      case 'docenciaPublicaciones':
        return <DocenciaPublicaciones />;
      // "Áreas" ahora incluye también el cierre de "Comunidad" — se
      // fusionaron en una sola página, ya no tiene entrada propia en el
      // menú (ver DocenciaAreasWheel.jsx).
      case 'docenciaAreas':
        return <DocenciaAreasWheel />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`w-full h-screen bg-[#D6E9F7] dark:bg-[#001F3D] text-slate-900 dark:text-white font-sans relative flex flex-col overflow-hidden ${
        theme === 'dark' ? 'dark' : ''
      }`}
    >
      {/* Sticky Utility Navbar */}
      <header className="shrink-0 z-40 bg-gradient-to-br from-[#003366]/95 via-[#0B5A96]/95 to-[#0077C8]/95 dark:bg-none dark:bg-[#003366]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3 flex items-center gap-2 shadow-sm">
        <button
          onClick={() => goToPage('inicio')}
          className="flex items-center gap-2 cursor-pointer group shrink-0"
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

        {/* Selector de departamento: Asistencia Técnica / Docencia — sólo
            en desktop (md+), centrado entre el logo y los controles de
            la derecha. En móvil este mismo selector vive en su propia
            fila, justo debajo del header (ver más abajo), para no
            competir por espacio con "Sobre ICAP" / "Contactanos". */}
        <div className="hidden md:flex flex-1 justify-center px-2">
          <div className="flex items-center bg-black/30 p-0.5 rounded-xl border border-white/10">
            <button
              onClick={() => switchDept('at')}
              aria-pressed={activeDept === 'at'}
              className={`px-4 py-1.5 rounded-lg text-xs font-heading font-bold tracking-wide whitespace-nowrap transition-all ${
                activeDept === 'at'
                  ? 'bg-[#0077C8] text-white shadow'
                  : 'text-[#9FC6E8] hover:text-white hover:bg-white/10'
              }`}
            >
              {t.header.deptAT}
            </button>
            <button
              onClick={() => switchDept('docencia')}
              aria-pressed={activeDept === 'docencia'}
              className={`px-4 py-1.5 rounded-lg text-xs font-heading font-bold tracking-wide whitespace-nowrap transition-all ${
                activeDept === 'docencia'
                  ? 'bg-[#0077C8] text-white shadow'
                  : 'text-[#9FC6E8] hover:text-white hover:bg-white/10'
              }`}
            >
              {t.header.deptDocencia}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => setAboutModalOpen(true)}
            className="text-xs font-heading font-semibold text-[#EAF3FB] hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            {t.header.about}
          </button>
          <button
            onClick={() => goToPage('contacto')}
            className="h-8 px-3.5 sm:px-4 rounded-xl bg-black/30 hover:bg-white/10 border border-white/10 text-white font-heading font-bold text-xs tracking-wider uppercase shadow transition-all active:scale-95 shrink-0"
          >
            {t.header.contact}
          </button>

          {/* Menú de configuración: agrupa vista / idioma / tema detrás de
              un engranaje en vez de tres controles sueltos — evita que el
              header se sienta saturado en pantallas angostas. Va al final
              del todo (extremo derecho) para que quede como el último
              control, separado de los accesos principales. */}
          <div className="relative shrink-0" ref={settingsRef}>
            <button
              onClick={() => setSettingsOpen((prev) => !prev)}
              title={t.header.settings}
              aria-expanded={settingsOpen}
              className={`flex items-center justify-center w-8 h-8 rounded-lg border border-white/10 shrink-0 transition-all cursor-pointer ${
                settingsOpen
                  ? 'bg-[#0077C8] text-white'
                  : 'bg-black/30 hover:bg-white/10 text-[#9FC6E8] hover:text-white'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
            </button>

            {settingsOpen && (
              <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-60 rounded-xl bg-[#00203E] border border-white/10 shadow-2xl p-3 animate-fade-in">
                {/* Vista */}
                <div className="mb-3">
                  <span className="block text-[10px] font-mono-code font-bold uppercase tracking-wider text-[#9FC6E8]/70 mb-1.5">
                    {t.header.settingsView}
                  </span>
                  <div className="flex items-center bg-black/30 p-0.5 rounded-lg border border-white/10">
                    <button
                      onClick={() => onSetViewMode('full')}
                      aria-pressed={viewMode === 'full'}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-heading font-semibold transition-all ${
                        viewMode === 'full'
                          ? 'bg-[#0077C8] text-white shadow'
                          : 'text-[#9FC6E8] hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      {t.header.viewFullShort}
                    </button>
                    <button
                      onClick={() => onSetViewMode('mobile')}
                      aria-pressed={viewMode === 'mobile'}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-heading font-semibold transition-all ${
                        viewMode === 'mobile'
                          ? 'bg-[#0077C8] text-white shadow'
                          : 'text-[#9FC6E8] hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      {t.header.viewMobileShort}
                    </button>
                  </div>
                </div>

                {/* Idioma */}
                <div className="mb-3">
                  <span className="block text-[10px] font-mono-code font-bold uppercase tracking-wider text-[#9FC6E8]/70 mb-1.5">
                    {t.header.settingsLanguage}
                  </span>
                  <div className="flex items-center bg-black/30 p-0.5 rounded-lg border border-white/10">
                    <button
                      onClick={() => setLang('es')}
                      aria-pressed={lang === 'es'}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-heading font-semibold transition-all ${
                        lang === 'es'
                          ? 'bg-[#0077C8] text-white shadow'
                          : 'text-[#9FC6E8] hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      ES
                    </button>
                    <button
                      onClick={() => setLang('en')}
                      aria-pressed={lang === 'en'}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-heading font-semibold transition-all ${
                        lang === 'en'
                          ? 'bg-[#0077C8] text-white shadow'
                          : 'text-[#9FC6E8] hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      EN
                    </button>
                  </div>
                </div>

                {/* Tema */}
                <div>
                  <span className="block text-[10px] font-mono-code font-bold uppercase tracking-wider text-[#9FC6E8]/70 mb-1.5">
                    {t.header.settingsTheme}
                  </span>
                  <div className="flex items-center bg-black/30 p-0.5 rounded-lg border border-white/10">
                    <button
                      onClick={() => setTheme('light')}
                      aria-pressed={theme === 'light'}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-heading font-semibold transition-all ${
                        theme === 'light'
                          ? 'bg-[#0077C8] text-white shadow'
                          : 'text-[#9FC6E8] hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5" />
                      {t.header.themeLight}
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      aria-pressed={theme === 'dark'}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-heading font-semibold transition-all ${
                        theme === 'dark'
                          ? 'bg-[#0077C8] text-white shadow'
                          : 'text-[#9FC6E8] hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Moon className="w-3.5 h-3.5" />
                      {t.header.themeDark}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Selector de departamento en móvil: su propia fila, justo debajo
          del header y arriba de lo que sea que venga en el main (en
          "Inicio" eso es el Hero, con su tira de "Navegación Rápida" ya
          adentro) — mismo degradado que el header, para que se sienta
          una extensión de él y no una barra suelta aparte. */}
      <div className="md:hidden shrink-0 z-30 bg-gradient-to-br from-[#003366]/95 via-[#0B5A96]/95 to-[#0077C8]/95 dark:bg-none dark:bg-[#003366]/95 border-b border-white/10 px-3 py-2">
        <div className="flex items-center bg-black/30 p-0.5 rounded-xl border border-white/10 w-full">
          <button
            onClick={() => switchDept('at')}
            aria-pressed={activeDept === 'at'}
            className={`flex-1 py-1.5 rounded-lg text-[11px] sm:text-xs font-heading font-bold tracking-wide transition-all ${
              activeDept === 'at'
                ? 'bg-[#0077C8] text-white shadow'
                : 'text-[#9FC6E8] hover:text-white hover:bg-white/10'
            }`}
          >
            {t.header.deptAT}
          </button>
          <button
            onClick={() => switchDept('docencia')}
            aria-pressed={activeDept === 'docencia'}
            className={`flex-1 py-1.5 rounded-lg text-[11px] sm:text-xs font-heading font-bold tracking-wide transition-all ${
              activeDept === 'docencia'
                ? 'bg-[#0077C8] text-white shadow'
                : 'text-[#9FC6E8] hover:text-white hover:bg-white/10'
            }`}
          >
            {t.header.deptDocencia}
          </button>
        </div>
      </div>

      {/* Active Page */}
      <main ref={mainRef} className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
        <div key={activePage} className="animate-page-in">
          {renderPage()}
        </div>
      </main>

      {/* Bottom App Navigation */}
      <nav
        ref={navRef}
        className="shrink-0 z-30 bg-white dark:bg-[#003366]/95 backdrop-blur-md border-t border-slate-200 dark:border-white/10 shadow-[0_-4px_16px_rgba(0,51,102,0.08)] dark:shadow-[0_-4px_16px_rgba(0,0,0,0.4)] px-1 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] flex items-stretch justify-between relative"
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
        {activePages.map((page) => {
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
        <div className="space-y-4 text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-relaxed">
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
                    <h4 className="font-heading font-bold text-xs uppercase text-slate-800 dark:text-[#9FC6E8] mb-0.5">
                      {card.title}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-slate-700 dark:text-slate-300">
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
