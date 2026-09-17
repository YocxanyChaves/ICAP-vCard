import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Info, X } from 'lucide-react';
import BottomSheet from '../../components/BottomSheet';
import { getAreaMeta } from './areaMeta';
import { useLanguage } from '../../i18n/LanguageContext';
import sicaLogo from '../../assets/allies/sica.png';
import opsOmsLogo from '../../assets/allies/ops-oms.png';
import bidLogo from '../../assets/allies/bid.png';
import flacsoLogo from '../../assets/allies/flacso.png';
import bcieLogo from '../../assets/allies/bcie.png';
import cepalLogo from '../../assets/allies/cepal.png';
import aecidLogo from '../../assets/allies/aecid.png';
import oeaLogo from '../../assets/allies/oea.png';

/**
 * Organismos aliados del ICAP. Cada uno trae ya su logo real (import de
 * src/assets/allies/*.png, optimizados para verse nítidos a tamaño de
 * placa/badge). Si algún día falta un logo, `logo: null` sigue
 * funcionando como fallback: AllyIconBadge muestra las siglas en vez de
 * romper el layout.
 *
 * `projectAreas` / `description` sólo están rellenos para las alianzas
 * que sí tienen un proyecto conjunto documentado en el brochure (OPS/OMS
 * y BID, ambos vía República Dominicana — ver COUNTRIES en
 * RegionalMap.jsx). Para el resto no se inventó nada: se deja vacío y
 * la ficha lo muestra como "sin registro" en vez de rellenarlo con
 * texto genérico.
 */
const ALLIES = [
  {
    id: 'sica',
    name: 'SICA',
    label: 'Sistema de la Integración Centroamericana',
    logo: sicaLogo,
    projectAreas: [],
    description: null,
    countryNote: null
  },
  {
    id: 'ops-oms',
    name: 'OPS / OMS',
    label: 'Organización Panamericana de la Salud',
    logo: opsOmsLogo,
    projectAreas: ['Transformación Organizacional'],
    description: 'Diplomado en gestión de recursos humanos en salud, desarrollado en conjunto con República Dominicana.',
    countryNote: 'República Dominicana'
  },
  {
    id: 'bid',
    name: 'BID',
    label: 'Banco Interamericano de Desarrollo',
    logo: bidLogo,
    projectAreas: ['Ambiente'],
    description: 'Proyectos de adaptación al cambio climático y blindaje climático, junto con CEPREDENAC, en República Dominicana.',
    countryNote: 'República Dominicana'
  },
  {
    id: 'flacso',
    name: 'FLACSO',
    label: 'Facultad Latinoamericana de Ciencias Sociales',
    logo: flacsoLogo,
    projectAreas: [],
    description: null,
    countryNote: null
  },
  {
    id: 'bcie',
    name: 'BCIE',
    label: 'Banco Centroamericano de Integración Económica',
    logo: bcieLogo,
    projectAreas: [],
    description: null,
    countryNote: null
  },
  {
    id: 'cepal',
    name: 'CEPAL',
    label: 'Comisión Económica para América Latina',
    logo: cepalLogo,
    projectAreas: [],
    description: null,
    countryNote: null
  },
  {
    id: 'aecid',
    name: 'AECID',
    label: 'Agencia Española de Cooperación',
    logo: aecidLogo,
    projectAreas: [],
    description: null,
    countryNote: null
  },
  {
    id: 'oea',
    name: 'OEA',
    label: 'Organización de los Estados Americanos',
    logo: oeaLogo,
    projectAreas: [],
    description: null,
    countryNote: null
  }
];

function AllyIconBadge({ ally, size = 'w-8 h-8', textSize = 'text-xs' }) {
  if (ally.logo) {
    return (
      <div className={`${size} rounded-lg bg-white flex items-center justify-center overflow-hidden shrink-0`}>
        <img src={ally.logo} alt={ally.name} className="w-full h-full object-contain p-1" />
      </div>
    );
  }
  return (
    <div className={`${size} rounded-lg bg-[#003366] text-[#0077C8] flex items-center justify-center font-heading font-extrabold ${textSize} shrink-0`}>
      {ally.name.split(' ')[0]}
    </div>
  );
}

function AllyDetailBody({ ally }) {
  const { t } = useLanguage();
  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-900 dark:text-slate-100 leading-relaxed">
        {ally.description || t.allies.noProjectRecord}
      </p>

      {ally.countryNote && (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-[#0077C8] shrink-0" />
          {ally.countryNote}
        </div>
      )}

      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2">
          {t.allies.projectAreasLabel}
        </span>
        {ally.projectAreas.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {ally.projectAreas.map((a, i) => {
              const meta = getAreaMeta(a);
              const AreaIcon = meta.icon;
              return (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold leading-relaxed shadow-sm"
                  style={{ backgroundColor: meta.color, color: meta.text }}
                >
                  <AreaIcon className="w-3.5 h-3.5 shrink-0" style={{ color: meta.text }} />
                  {t.areaLabels[a] || a}
                </span>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-400 dark:text-slate-500">{t.allies.noAreaRecord}</p>
        )}
      </div>
    </div>
  );
}

export default function AlliesMarquee() {
  const { t } = useLanguage();
  // Mismos datos (id, logo, projectAreas — llaves de areaMeta.js, no
  // texto visible) con el nombre/etiqueta/descripción traducidos según
  // el idioma activo, tomados de translations.js por id.
  const alliesT = ALLIES.map((a) => ({ ...a, ...t.allies.items[a.id] }));
  const sectionRef = useRef(null);
  const isDesktopRef = useRef(false);
  const [selected, setSelected] = useState(null);
  const [bubblePos, setBubblePos] = useState(null);
  const [viewportH, setViewportH] = useState(0);

  // Mismo patrón que RegionalMap.jsx: medir el ancho contra el documento
  // dueño de la sección (no contra `window` global), para que funcione
  // igual dentro del iframe de "Vista Móvil".
  useEffect(() => {
    const el = sectionRef.current;
    const doc = el?.ownerDocument;
    if (!doc) return undefined;

    const checkWidth = () => {
      isDesktopRef.current = doc.documentElement.clientWidth >= 1024; // breakpoint `lg` de Tailwind
      setViewportH(doc.documentElement.clientHeight);
    };
    checkWidth();

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(checkWidth);
      ro.observe(doc.documentElement);
      return () => ro.disconnect();
    }
    const view = doc.defaultView;
    view?.addEventListener('resize', checkWidth);
    return () => view?.removeEventListener('resize', checkWidth);
  }, []);

  // Cerrar con Escape
  useEffect(() => {
    if (!selected) return undefined;
    const doc = sectionRef.current?.ownerDocument;
    if (!doc) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') closeDetail();
    };
    doc.addEventListener('keydown', onKey);
    return () => doc.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const handleSelect = (ally, event) => {
    if (isDesktopRef.current) {
      const rect = event.currentTarget.getBoundingClientRect();
      const doc = sectionRef.current?.ownerDocument;
      const vw = doc?.documentElement.clientWidth || rect.right;
      const vh = doc?.documentElement.clientHeight || rect.bottom;
      const BUBBLE_WIDTH = 340;
      const PADDING = 16;
      let left = rect.left + rect.width / 2 - BUBBLE_WIDTH / 2;
      left = Math.max(PADDING, Math.min(left, vw - BUBBLE_WIDTH - PADDING));
      const spaceBelow = vh - rect.bottom;
      const openUpward = spaceBelow < 300;
      const top = openUpward ? rect.top - 12 : rect.bottom + 12;
      setBubblePos({ left, top, openUpward, width: BUBBLE_WIDTH });
    } else {
      setBubblePos(null);
    }
    setSelected(ally);
  };

  const closeDetail = () => {
    setSelected(null);
    setBubblePos(null);
  };

  const showBubble = Boolean(selected && isDesktopRef.current && bubblePos);
  const showSheet = Boolean(selected && !isDesktopRef.current);

  return (
    <section ref={sectionRef} className="py-12 bg-gradient-to-br from-[#003366] via-[#0B5A96] to-[#0077C8] text-white overflow-hidden border-y border-white/5 relative">
      <div className="max-w-4xl mx-auto px-6 mb-8 text-center">
        <span className="text-xs font-bold tracking-widest uppercase text-[#EAF3FB] block mb-1 font-mono-code">
          {t.allies.kicker}
        </span>
        <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-white tracking-tight">
          {t.allies.title}
        </h2>
        <p className="text-[11px] sm:text-xs text-[#D6E9F7] mt-1.5">
          {t.allies.subtitle}
        </p>
      </div>

      {/* Infinite scrolling track */}
      <div className="relative w-full overflow-hidden flex items-center py-2">
        {/* Gradient fades at borders */}
        <div className="absolute left-0 inset-y-0 w-16 bg-gradient-to-r from-[#003366] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-16 bg-gradient-to-l from-[#0077C8] to-transparent z-10 pointer-events-none" />

        <div
          className="animate-marquee flex items-center"
          style={selected ? { animationPlayState: 'paused' } : undefined}
        >
          {[...alliesT, ...alliesT].map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => handleSelect(item, e)}
              className="flex items-center gap-3 px-6 py-3.5 mr-4 rounded-2xl bg-white/10 border border-white/20 hover:border-white/50 hover:bg-white/20 transition-all min-w-[200px] sm:min-w-[240px] shrink-0 group text-left cursor-pointer"
            >
              <AllyIconBadge ally={item} size="w-9 h-9" textSize="text-xs" />
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-heading font-bold text-sm text-white group-hover:text-white transition-colors">
                  {item.name}
                </span>
                <span className="text-[11px] text-[#D6E9F7]/80 line-clamp-1 leading-snug">
                  {item.label}
                </span>
              </div>
              <Info className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-colors shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Ficha en bottom sheet: celular y tablet */}
      <BottomSheet
        isOpen={showSheet}
        onClose={closeDetail}
        title={selected?.name}
        subtitle={t.allies.modalSubtitle}
        icon={selected && <AllyIconBadge ally={selected} size="w-8 h-8" textSize="text-xs" />}
      >
        {selected && <AllyDetailBody ally={selected} />}
      </BottomSheet>

      {/* Ficha en burbuja anclada a la tarjeta: escritorio */}
      {showBubble && (
        <>
          <div className="fixed inset-0 z-40" onClick={closeDetail} aria-hidden="true" />
          <div
            className="fixed z-50 bg-white dark:bg-[#0B2340] text-slate-800 dark:text-slate-100 rounded-2xl shadow-2xl border border-slate-100 dark:border-white/10 animate-fade-in"
            style={{
              left: bubblePos.left,
              width: bubblePos.width,
              ...(bubblePos.openUpward
                ? { bottom: viewportH - bubblePos.top }
                : { top: bubblePos.top })
            }}
          >
            <div className="flex items-start justify-between gap-3 p-4 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center shrink-0">
                  <AllyIconBadge ally={selected} size="w-8 h-8" textSize="text-xs" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-[#0077C8] block">
                    {t.allies.modalSubtitle}
                  </span>
                  <h4 className="font-heading font-extrabold text-base text-[#003366] dark:text-[#9FC6E8] leading-tight truncate">
                    {selected.name}
                  </h4>
                </div>
              </div>
              <button
                onClick={closeDetail}
                className="p-1.5 -mr-1 -mt-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors shrink-0"
                title={t.common.close}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto overscroll-contain">
              <AllyDetailBody ally={selected} />
            </div>
          </div>
        </>
      )}
    </section>
  );
}
