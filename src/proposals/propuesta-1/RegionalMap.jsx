import React, { useState, useRef, useEffect } from 'react';
import {
  Building2,
  CheckCircle2,
  Navigation,
  Mail,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import BottomSheet from '../../components/BottomSheet';
import { getEtiqueta, nombreEtiqueta } from './etiquetas';
import { proyectosDePais, esRegional } from './proyectosData';
import { useLanguage } from '../../i18n/LanguageContext';
import KickerBadge from './KickerBadge';

/**
 * High-quality SVG Flag Components for all 10 countries
 */
export function FlagIcon({ countryCode, className = 'w-7 h-5' }) {
  switch (countryCode) {
    case 'CR': // Costa Rica
      return (
        <svg className={`${className} rounded-md shadow-xs border border-white/10 shrink-0`} viewBox="0 0 60 36">
          <rect width="60" height="36" fill="#002B7F" />
          <rect y="6" width="60" height="24" fill="#FFFFFF" />
          <rect y="12" width="60" height="12" fill="#CE1126" />
        </svg>
      );
    case 'GT': // Guatemala
      return (
        <svg className={`${className} rounded-md shadow-xs border border-white/10 shrink-0`} viewBox="0 0 60 36">
          <rect width="60" height="36" fill="#4997D0" />
          <rect x="20" width="20" height="36" fill="#FFFFFF" />
          <circle cx="30" cy="18" r="3" fill="#B38E32" opacity="0.8" />
        </svg>
      );
    case 'PA': // Panamá
      return (
        <svg className={`${className} rounded-md shadow-xs border border-white/10 shrink-0`} viewBox="0 0 60 36">
          <rect width="60" height="36" fill="#FFFFFF" />
          <rect x="30" width="30" height="18" fill="#DA121A" />
          <rect y="18" width="30" height="18" fill="#072357" />
          <polygon points="15,4 17,9 22,9 18,12 19,16 15,13 11,16 12,12 8,9 13,9" fill="#072357" />
          <polygon points="45,22 47,27 52,27 48,30 49,34 45,31 41,34 42,30 38,27 43,27" fill="#DA121A" />
        </svg>
      );
    case 'BZ': // Belice
      return (
        <svg className={`${className} rounded-md shadow-xs border border-white/10 shrink-0`} viewBox="0 0 60 36">
          <rect width="60" height="36" fill="#003F87" />
          <rect y="0" width="60" height="4" fill="#D91023" />
          <rect y="32" width="60" height="4" fill="#D91023" />
          <circle cx="30" cy="18" r="7" fill="#FFFFFF" />
          <circle cx="30" cy="18" r="5" fill="#507A38" opacity="0.9" />
        </svg>
      );
    case 'SV': // El Salvador
      return (
        <svg className={`${className} rounded-md shadow-xs border border-white/10 shrink-0`} viewBox="0 0 60 36">
          <rect width="60" height="36" fill="#0F47AF" />
          <rect y="12" width="60" height="12" fill="#FFFFFF" />
          <circle cx="30" cy="18" r="3.5" fill="#E6A100" />
        </svg>
      );
    case 'HN': // Honduras
      return (
        <svg className={`${className} rounded-md shadow-xs border border-white/10 shrink-0`} viewBox="0 0 60 36">
          <rect width="60" height="36" fill="#0073CF" />
          <rect y="12" width="60" height="12" fill="#FFFFFF" />
          <circle cx="30" cy="18" r="1.8" fill="#0073CF" />
          <circle cx="24" cy="15" r="1.4" fill="#0073CF" />
          <circle cx="36" cy="15" r="1.4" fill="#0073CF" />
          <circle cx="24" cy="21" r="1.4" fill="#0073CF" />
          <circle cx="36" cy="21" r="1.4" fill="#0073CF" />
        </svg>
      );
    case 'NI': // Nicaragua
      return (
        <svg className={`${className} rounded-md shadow-xs border border-white/10 shrink-0`} viewBox="0 0 60 36">
          <rect width="60" height="36" fill="#0067C6" />
          <rect y="12" width="60" height="12" fill="#FFFFFF" />
          <polygon points="30,13 25,23 35,23" fill="#D4AF37" opacity="0.9" />
        </svg>
      );
    case 'DO': // Rep. Dominicana
      return (
        <svg className={`${className} rounded-md shadow-xs border border-white/10 shrink-0`} viewBox="0 0 60 36">
          <rect width="30" height="18" fill="#002F6C" />
          <rect x="30" width="30" height="18" fill="#CE1126" />
          <rect y="18" width="30" height="18" fill="#CE1126" />
          <rect x="30" y="18" width="30" height="18" fill="#002F6C" />
          <rect x="26" width="8" height="36" fill="#FFFFFF" />
          <rect y="14" width="60" height="8" fill="#FFFFFF" />
        </svg>
      );
    case 'MX': // México
      return (
        <svg className={`${className} rounded-md shadow-xs border border-white/10 shrink-0`} viewBox="0 0 60 36">
          <rect width="20" height="36" fill="#006847" />
          <rect x="20" width="20" height="36" fill="#FFFFFF" />
          <rect x="40" width="20" height="36" fill="#CE1126" />
          <circle cx="30" cy="18" r="3.5" fill="#8B5A2B" opacity="0.9" />
        </svg>
      );
    case 'CO': // Colombia
      return (
        <svg className={`${className} rounded-md shadow-xs border border-white/10 shrink-0`} viewBox="0 0 60 36">
          <rect width="60" height="18" fill="#FCD116" />
          <rect y="18" width="60" height="9" fill="#003893" />
          <rect y="27" width="60" height="9" fill="#CE1126" />
        </svg>
      );
    default:
      return <div className={`${className} bg-slate-400 rounded-md`} />;
  }
}

const COUNTRIES = [
  {
    id: 'CR',
    name: 'Costa Rica',
    status: 'Sede Central',
    isHeadquarters: true,
    capital: 'San José',
    city: 'San José (Curridabat)',
    description: 'Sede central directiva del ICAP desde 1954, campus de posgrados internacionales, centro de innovación pública y coordinación regional de cooperación técnica.',
    highlight: 'Sede Central y Campus Académico Principal',
    officeEmail: 'sedecentral@icap.ac.cr',
  },
  {
    id: 'GT',
    name: 'Guatemala',
    status: 'Sede y Enlace País',
    isHeadquarters: false,
    capital: 'Guatemala',
    city: 'Ciudad de Guatemala',
    description: 'Oficina nacional de vinculación con ministerios, fortalecimiento institucional y acompañamiento a proyectos de modernización estatal.',
    highlight: 'Programas de Alta Dirección y Enlace Gubernamental',
    officeEmail: 'guatemala@icap.ac.cr',
  },
  {
    id: 'PA',
    name: 'Panamá',
    status: 'Centro Regional',
    isHeadquarters: false,
    capital: 'Panama',
    city: 'Ciudad de Panamá',
    description: 'Centro regional de capacitación técnica, formación ejecutiva y vinculación estratégica con organismos multilaterales de desarrollo.',
    highlight: 'Hub Regional de Capacitación y Cooperación',
    officeEmail: 'panama@icap.ac.cr',
  },
  {
    id: 'BZ',
    name: 'Belice',
    status: 'Estado Miembro SICA',
    isHeadquarters: false,
    capital: 'Belmopan',
    city: 'Belmopán',
    description: 'Programas de cooperación técnica bilingüe, gestión ambiental, resiliencia climática y formación de cuadros públicos.',
    highlight: 'Cooperación Técnica e Integración Regional',
    officeEmail: 'belice@icap.ac.cr',
  },
  {
    id: 'SV',
    name: 'El Salvador',
    status: 'Estado Miembro SICA',
    isHeadquarters: false,
    capital: 'San Salvador',
    city: 'San Salvador',
    description: 'Acompañamiento en transformación digital del gobierno, innovación ciudadana y optimización de proyectos de inversión estatal.',
    highlight: 'Transformación Digital y Servicios Ciudadanos',
    officeEmail: 'elsalvador@icap.ac.cr',
  },
  {
    id: 'HN',
    name: 'Honduras',
    status: 'Estado Miembro SICA',
    isHeadquarters: false,
    capital: 'Tegucigalpa',
    city: 'Tegucigalpa',
    description: 'Fortalecimiento de la gestión en salud pública, programas de posgrado y modernización de la administración territorial.',
    highlight: 'Gerencia en Salud y Políticas Públicas',
    officeEmail: 'honduras@icap.ac.cr',
  },
  {
    id: 'NI',
    name: 'Nicaragua',
    status: 'Estado Miembro SICA',
    isHeadquarters: false,
    capital: 'Managua',
    city: 'Managua',
    description: 'Capacitación en planificación estratégica, gestión por resultados y fortalecimiento de las capacidades del servidor público.',
    highlight: 'Formación y Planificación Estratégica',
    officeEmail: 'nicaragua@icap.ac.cr',
  },
  {
    id: 'DO',
    name: 'Rep. Dominicana',
    status: 'Estado Miembro SICA',
    isHeadquarters: false,
    capital: 'Santo Domingo',
    city: 'Santo Domingo',
    description: 'Convenios de formación académica superior, compras públicas sostenibles y vinculación caribeña-centroamericana.',
    highlight: 'Alianzas de Posgrado y Contratación Pública',
    officeEmail: 'repdominicana@icap.ac.cr',
  },
  {
    id: 'MX',
    name: 'México',
    status: 'Cooperación Regional',
    isHeadquarters: false,
    capital: 'Ciudad de México',
    city: 'Ciudad de México',
    description: 'Convenios de investigación aplicada, intercambio de expertos con instituciones académicas y proyectos mesoamericanos.',
    highlight: 'Alianzas Académicas Mesoamericanas',
    officeEmail: 'mexico@icap.ac.cr',
  },
  {
    id: 'CO',
    name: 'Colombia',
    status: 'Cooperación Regional',
    isHeadquarters: false,
    capital: 'Bogotá',
    city: 'Bogotá',
    description: 'Cooperación Sur-Sur en innovación pública, gestión de la seguridad social y transferencia de buenas prácticas.',
    highlight: 'Innovación Pública y Cooperación Sur-Sur',
    officeEmail: 'colombia@icap.ac.cr',
  }
];

/**
 * Shared content block rendered inside both the desktop sidebar
 * and the mobile bottom sheet, so a country's info stays consistent
 * wherever it's viewed.
 */
function CountryDetailBody({ country, tone = 'dark', onNavigate }) {
  const { t, lang } = useLanguage();
  const isDark = tone === 'dark';
  // El tono "light" es el que usa el modal móvil (BottomSheet) — como
  // ese modal ahora también tiene su propia variante oscura (ver
  // BottomSheet.jsx), estos colores "light" llevan además su `dark:`
  // para no quedar con texto oscuro sobre fondo oscuro cuando el sitio
  // está en modo oscuro.
  const mutedText = isDark ? 'text-[#C9D9E8]' : 'text-slate-900 dark:text-[#C9D9E8]';
  const labelText = isDark ? 'text-[#9FC6E8]' : 'text-slate-500 dark:text-[#9FC6E8]';
  const cardBg = isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100 dark:bg-white/5 dark:border-white/10';
  const chipBg = isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100 dark:bg-white/5 dark:border-white/10';
  const headingText = isDark ? 'text-white' : 'text-[#003366] dark:text-[#9FC6E8]';

  return (
    <div className="space-y-5">
      {/* Description */}
      <p className={`text-sm leading-relaxed ${mutedText}`}>
        {country.description}
      </p>

      {/* Institutional Focus */}
      <div className={`p-4 rounded-2xl border space-y-1.5 ${cardBg}`}>
        <span className={`text-[10px] font-mono-code uppercase font-bold tracking-wider block ${labelText}`}>
          {t.regionalMap.institutionalFocusLabel}
        </span>
        <div className={`flex items-center gap-2 text-xs font-semibold ${headingText}`}>
          <CheckCircle2 className="w-4 h-4 text-[#0077C8] shrink-0" />
          <span>{country.highlight}</span>
        </div>
      </div>

      {/* Proyectos: todo sale de la clasificación (proyectosData.js),
          ya no de números escritos a mano por país. */}
      {(() => {
        const proyectos = [...proyectosDePais(country.id)].sort((a, b) => b.desde.localeCompare(a.desde));
        const regionales = proyectos.filter(esRegional).length;
        const nacionales = proyectos.length - regionales;

        const conteo = {};
        proyectos.forEach((p) => p.etiquetas.forEach((id) => (conteo[id] = (conteo[id] || 0) + 1)));
        const etiquetas = Object.keys(conteo).sort((a, b) => conteo[b] - conteo[a]);

        // Clientes de los proyectos nacionales primero (son los propios
        // del país), luego los de los regionales.
        const clientes = [
          ...new Set([...proyectos.filter((p) => !esRegional(p)), ...proyectos.filter(esRegional)].map((p) => p.cliente))
        ];
        const MAX_CLIENTES = 6;

        return (
          <>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-mono-code uppercase font-bold tracking-wider ${labelText}`}>
                  {t.regionalMap.projectsLabel}
                </span>
                <span className={`text-[8px] font-mono-code font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${isDark ? 'bg-white/10 text-[#9FC6E8]' : 'bg-[#EAF3FB] text-[#003366] dark:bg-white/10 dark:text-[#9FC6E8]'}`}>
                  {t.regionalMap.projectsSource}
                </span>
              </div>
              {proyectos.length ? (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      [proyectos.length, t.regionalMap.totalLabel],
                      [nacionales, t.regionalMap.nationalLabel],
                      [regionales, t.regionalMap.regionalLabel]
                    ].map(([valor, etq]) => (
                      <div key={etq} className={`p-2.5 rounded-xl border text-center ${chipBg}`}>
                        <div className={`font-heading font-extrabold text-2xl leading-none ${isDark ? 'text-[#4FB2F2]' : 'text-[#003366] dark:text-[#4FB2F2]'}`}>
                          {valor}
                        </div>
                        <div className={`text-[10px] mt-1 ${mutedText}`}>{etq}</div>
                      </div>
                    ))}
                  </div>
                  {regionales > 0 && <p className={`text-[10px] leading-snug mt-1.5 ${mutedText}`}>{t.regionalMap.regionalNote}</p>}
                </>
              ) : (
                <p className={`text-xs italic ${mutedText}`}>{t.regionalMap.noProjects}</p>
              )}
            </div>

            {etiquetas.length > 0 && (
              <div>
                <span className={`text-[10px] font-mono-code uppercase font-bold tracking-wider block mb-2 ${labelText}`}>
                  {t.regionalMap.projectAreasLabel}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {etiquetas.map((id) => {
                    const e = getEtiqueta(id);
                    const Icon = e.icon;
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold shadow-sm"
                        style={{ backgroundColor: e.color, color: e.text }}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        {nombreEtiqueta(id, lang)}
                        <span className="opacity-75">{conteo[id]}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {proyectos.length > 0 && (
              <div>
                <span className={`text-[10px] font-mono-code uppercase font-bold tracking-wider block mb-2 ${labelText}`}>
                  {t.regionalMap.recentLabel}
                </span>
                <div className="space-y-1.5">
                  {proyectos.slice(0, 3).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => onNavigate?.('proyectos', { proyecto: p.id })}
                      className={`w-full text-left flex items-start gap-2.5 p-2.5 rounded-xl border text-xs leading-snug group ${chipBg} ${isDark ? 'text-white' : 'text-slate-700 dark:text-white'}`}
                    >
                      <span className="flex gap-0.5 mt-1 shrink-0">
                        {p.etiquetas.map((id) => (
                          <span key={id} className="w-2 h-2 rounded-full" style={{ backgroundColor: getEtiqueta(id).color }} />
                        ))}
                      </span>
                      <span className="flex-1 line-clamp-2">{p.titulo}</span>
                      <ChevronRight className="w-4 h-4 text-[#0077C8] opacity-60 group-hover:opacity-100 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {clientes.length > 0 && (
              <div>
                <span className={`text-[10px] font-mono-code uppercase font-bold tracking-wider block mb-2 ${labelText}`}>
                  {t.regionalMap.orgsLabel}
                </span>
                <div className="space-y-1.5">
                  {clientes.slice(0, MAX_CLIENTES).map((o) => (
                    <div
                      key={o}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs leading-relaxed ${chipBg} ${isDark ? 'text-white' : 'text-slate-700 dark:text-white'}`}
                    >
                      <Building2 className="w-4 h-4 text-[#0077C8] shrink-0 mt-0.5" />
                      <span>{o}</span>
                    </div>
                  ))}
                </div>
                {clientes.length > MAX_CLIENTES && (
                  <p className={`text-[11px] mt-1.5 ${mutedText}`}>{t.regionalMap.moreOrgs(clientes.length - MAX_CLIENTES)}</p>
                )}
              </div>
            )}

            {proyectos.length > 0 && (
              <button
                type="button"
                onClick={() => onNavigate?.('proyectos', { pais: country.id })}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#0077C8] text-white font-heading font-bold text-xs sm:text-sm shadow hover:bg-[#005FA3] transition-colors"
              >
                {t.regionalMap.seeProjects(proyectos.length)}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </>
        );
      })()}

      {/* Office Contact */}
      <div className={`flex items-center gap-2.5 p-3 rounded-xl border ${chipBg}`}>
        <div className="w-8 h-8 rounded-lg bg-[#0077C8]/20 border border-[#0077C8]/40 flex items-center justify-center text-[#0077C8] shrink-0">
          <Mail className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <span className={`text-[9px] font-mono-code uppercase font-bold tracking-wider block ${labelText}`}>
            {t.regionalMap.officeContactLabel}
          </span>
          <span className={`text-xs font-semibold truncate block ${isDark ? 'text-white' : 'text-[#003366]'}`}>
            {country.officeEmail}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function RegionalMap({ onNavigate }) {
  const { t } = useLanguage();
  const [selectedCountry, setSelectedCountry] = useState('CR');
  const [showDetailSheet, setShowDetailSheet] = useState(false);
  const sectionRef = useRef(null);
  // La ficha del país (columna derecha) debe verse SIEMPRE del mismo
  // tamaño que el mapa (columna izquierda), sin importar cuánto texto
  // tenga el país elegido — si no cabe, que scrollee adentro de su
  // propio marco en vez de estirar la tarjeta y romper el orden visual
  // de las dos columnas. Como el mapa no tiene una altura fija (depende
  // del ancho responsivo del SVG), se mide su alto real con
  // ResizeObserver y ese valor es el que se le impone a la ficha.
  const mapPanelRef = useRef(null);
  const [mapHeight, setMapHeight] = useState(null);
  // Empieza en `false` (celular) y se corrige apenas monta: así, si por lo
  // que sea nunca llega a medir el ancho real (entorno raro / sin DOM),
  // el país seleccionado igual se ve en la hoja inferior en vez de quedar
  // sin mostrarse en ningún lado.
  const isDesktopRef = useRef(false);

  // No usamos `window.innerWidth` aquí: cuando este componente se previsualiza
  // dentro del iframe del selector "Vista Móvil" del header, el código sigue
  // corriendo en el mismo contexto de JS de la ventana de escritorio, así que
  // `window` seguiría siendo la ventana grande aunque se vea angosto en pantalla.
  // Medir el propio documento del elemento (vía `ownerDocument`) sí refleja el
  // ancho real donde de verdad se renderizó, sea la página normal o el iframe.
  useEffect(() => {
    const el = sectionRef.current;
    const doc = el?.ownerDocument;
    if (!doc) return undefined;

    const checkWidth = () => {
      isDesktopRef.current = doc.documentElement.clientWidth >= 1024; // breakpoint `lg` de Tailwind
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

  // Vuelve a medir el alto real del mapa (offsetHeight, con todo y
  // padding/borde) cada vez que cambia — por el resize de la ventana o
  // porque el SVG responsivo cambió de tamaño al cruzar un breakpoint.
  // `offsetHeight` en vez del `contentRect` del observer porque este
  // último NO incluye el padding/borde del panel, y necesitamos el alto
  // "de verdad" para que la ficha calce exacto.
  useEffect(() => {
    const el = mapPanelRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;

    const ro = new ResizeObserver(() => {
      setMapHeight(el.offsetHeight);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Mismos datos (id, coordenadas del SVG del mapa) con nombre/estatus/
  // descripción/etc. traducidos según el idioma activo, tomados de
  // translations.js por id.
  const countriesT = COUNTRIES.map((c) => ({ ...c, ...t.regionalMap.countries[c.id] }));
  const current = countriesT.find((c) => c.id === selectedCountry) || countriesT[0];

  const handleSelectCountry = (id) => {
    setSelectedCountry(id);
    if (!isDesktopRef.current) {
      setShowDetailSheet(true);
    }
  };

  // Colores de cada país. Tema OSCURO: como siempre — países en tonos
  // navy y, al pasar el mouse, se aclaran (#2D6798). Tema CLARO:
  // invertido a pedido de Yocxany — países en celestes claros (los
  // mismos de la paleta del sitio) y, al pasar el mouse, se oscurecen
  // al navy institucional. El seleccionado queda en el celeste ICAP en
  // los dos temas. Van como clases (no como atributo `fill`) para que
  // el `dark:` de Tailwind decida según el tema; las clases están
  // escritas completas para que Tailwind las encuentre al compilar.
  const COUNTRY_CLASSES = {
    GT: 'fill-[#CFE9FA] hover:fill-[#003366] dark:fill-[#163E66] dark:hover:fill-[#2D6798]',
    BZ: 'fill-[#D6E9F7] hover:fill-[#003366] dark:fill-[#1C4A78] dark:hover:fill-[#2D6798]',
    SV: 'fill-[#BFE6FF] hover:fill-[#003366] dark:fill-[#14385C] dark:hover:fill-[#2D6798]',
    HN: 'fill-[#D6E9F7] hover:fill-[#003366] dark:fill-[#1A4570] dark:hover:fill-[#2D6798]',
    NI: 'fill-[#CFE9FA] hover:fill-[#003366] dark:fill-[#153D63] dark:hover:fill-[#2D6798]',
    CR: 'fill-[#BFE6FF] hover:fill-[#003366] dark:fill-[#184470] dark:hover:fill-[#2D6798]',
    PA: 'fill-[#EAF3FB] hover:fill-[#003366] dark:fill-[#1D4E80] dark:hover:fill-[#2D6798]',
    MX: 'fill-[#D6E9F7] hover:fill-[#003366] dark:fill-[#1B4873] dark:hover:fill-[#2D6798]',
    CO: 'fill-[#CFE9FA] hover:fill-[#003366] dark:fill-[#173F68] dark:hover:fill-[#2D6798]',
    DO: 'fill-[#BFE6FF] hover:fill-[#003366] dark:fill-[#1A4570] dark:hover:fill-[#2D6798]'
  };

  const countryClass = (id) =>
    `transition-all ${selectedCountry === id ? 'fill-[#0077C8]' : COUNTRY_CLASSES[id] || COUNTRY_CLASSES.GT}`;

  // Nombre del país sobre el mapa: navy sobre los celestes del tema
  // claro (blanco al oscurecerse con el hover), y el blanco de siempre
  // en tema oscuro / en el seleccionado.
  const textClass = (id) =>
    `pointer-events-none transition-all ${
      selectedCountry === id ? 'fill-white' : 'fill-[#003366] group-hover:fill-white dark:fill-[#EAF3FB]'
    }`;

  return (
    <section ref={sectionRef} className="px-4 sm:px-6 pt-[var(--docencia-gap)] pb-12 sm:pb-20 bg-[#D6E9F7] dark:bg-[#001F3D] text-slate-900 dark:text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0077C8]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#0077C8]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="mb-6 sm:mb-8 text-center">
          <div className="mb-1 sm:mb-1.5">
            <KickerBadge variant="glow">{t.regionalMap.kicker}</KickerBadge>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-[#003366] dark:text-[#9FC6E8] tracking-tight">
            {t.regionalMap.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-[#9FC6E8] mt-1.5 max-w-xl mx-auto leading-relaxed">
            {t.regionalMap.subtitle}
          </p>
        </div>

        {/* Map & Desktop Detail Card Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          {/* Institutional Dark Geographic Map Canvas */}
          <div
            ref={mapPanelRef}
            className="lg:col-span-7 bg-[#001F3D]/90 backdrop-blur-md border border-white/15 rounded-3xl p-4 sm:p-7 flex flex-col justify-between shadow-2xl relative overflow-hidden min-h-[420px] sm:min-h-[520px] lg:sticky lg:top-4"
          >
            {/* Ocean & Ambient Text Markers — "Mar Caribe" arriba a la
                derecha (debajo del título) y "Océano Pacífico" en la
                esquina opuesta, abajo a la izquierda (justo encima del
                pie de instrucciones), con el mismo estilo y tamaño. El
                Pacífico antes iba arriba a la izquierda y la parte de
                arriba de México lo tapaba. Los dos van por encima del
                mapa (z-20). */}
            <span className="absolute left-6 bottom-14 sm:bottom-20 text-[10px] sm:text-xs text-[#9FC6E8]/40 font-mono-code uppercase tracking-widest select-none pointer-events-none z-20">
              {t.regionalMap.pacificOcean}
            </span>

            <div className="absolute top-4 right-6 text-right select-none pointer-events-none z-20">
              <h3 className="font-heading font-extrabold text-lg sm:text-xl text-white/90 tracking-wide">
                {t.regionalMap.mapTitle}
              </h3>
              <span className="text-[10px] sm:text-xs text-[#9FC6E8]/40 font-mono-code uppercase tracking-widest block mt-3">
                {t.regionalMap.caribbeanSea}
              </span>
            </div>

            {/* High-Fidelity Geographically Accurate SVG Map — real projected boundaries for all 10 countries (Mesoamérica, Caribe y norte de Suramérica) */}
            <div className="my-auto py-3 relative flex items-center justify-center z-10">
              <svg
                className="w-full max-w-[720px] h-auto drop-shadow-2xl select-none"
                viewBox="0 0 900 703.1"
              >
                <defs>
                  {/* Glowing effect for selected country */}
                  <filter id="active-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#0077C8" floodOpacity="0.9" />
                  </filter>
                  <filter id="country-depth" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
                  </filter>
                </defs>

                <g
                  className="group cursor-pointer transition-transform duration-200 active:scale-[0.99]"
                  onClick={() => handleSelectCountry('MX')}
                >
                  <path
                    d="M 366.2 155.3 L 359.8 170.1 L 357.0 182.2 L 355.8 204.8 L 354.2 213.0 L 357.0 222.2 L 362.1 230.4 L 365.4 243.4 L 376.2 256.0 L 380.0 265.6 L 386.4 273.9 L 403.7 278.3 L 410.5 285.4 L 424.8 280.7 L 437.2 279.0 L 449.4 275.9 L 459.7 273.0 L 470.1 266.2 L 474.0 256.4 L 475.3 242.2 L 478.1 237.3 L 489.2 232.9 L 506.4 229.0 L 520.9 229.6 L 530.8 228.1 L 534.7 231.7 L 534.1 239.8 L 525.4 249.8 L 521.5 260.1 L 524.5 263.0 L 518.0 283.4 L 513.8 279.1 L 507.3 279.6 L 501.5 289.8 L 498.5 287.8 L 496.5 288.5 L 496.7 291.0 L 466.3 290.9 L 466.3 300.3 L 458.9 300.4 L 465.0 306.0 L 471.1 309.9 L 472.9 313.5 L 475.5 314.6 L 475.1 320.3 L 454.1 320.3 L 446.3 334.1 L 448.6 337.2 L 446.7 341.2 L 446.3 346.1 L 427.8 327.9 L 419.4 322.5 L 406.1 318.1 L 397.0 319.3 L 383.9 325.6 L 375.7 327.3 L 364.1 322.9 L 351.9 319.7 L 336.7 311.9 L 324.4 309.6 L 306.0 301.8 L 292.3 293.7 L 288.2 289.2 L 279.1 288.2 L 262.4 282.9 L 255.6 275.2 L 238.0 265.6 L 229.9 255.0 L 226.0 246.8 L 231.4 245.2 L 229.7 240.4 L 233.5 236.0 L 233.6 230.2 L 228.1 222.6 L 226.6 215.9 L 221.1 207.4 L 206.7 190.7 L 190.3 177.6 L 182.4 167.1 L 168.4 160.2 L 165.4 156.1 L 167.9 145.7 L 159.6 141.8 L 149.9 133.6 L 145.9 121.8 L 137.1 120.5 L 127.6 111.6 L 120.0 103.4 L 119.2 98.1 L 110.5 85.4 L 104.7 72.6 L 104.9 66.1 L 93.1 59.4 L 87.7 60.1 L 78.4 55.5 L 75.8 62.3 L 78.5 70.4 L 80.0 83.1 L 85.6 90.0 L 97.7 101.6 L 100.4 105.6 L 102.9 106.8 L 105.1 112.5 L 108.0 112.3 L 111.2 123.2 L 116.2 127.4 L 119.7 133.4 L 129.9 142.0 L 135.3 157.6 L 140.2 165.0 L 144.7 172.9 L 145.6 181.8 L 153.5 182.3 L 160.0 190.0 L 166.0 197.5 L 165.6 200.5 L 158.7 206.7 L 155.8 206.6 L 151.5 196.4 L 140.8 186.8 L 129.1 178.6 L 120.7 174.4 L 121.2 162.1 L 118.8 152.9 L 99.8 140.2 L 97.6 142.4 L 93.5 138.0 L 83.4 133.9 L 73.8 124.1 L 75.0 122.9 L 81.7 123.8 L 87.8 117.5 L 88.4 109.9 L 75.8 97.9 L 66.3 93.3 L 46.6 58.3 L 40.0 43.1 L 58.5 41.8 L 79.3 40.0 L 77.7 43.3 L 102.4 51.5 L 139.6 63.3 L 185.0 63.2 L 185.0 56.3 L 213.3 56.3 L 219.3 62.2 L 227.6 67.6 L 237.3 75.0 L 242.7 83.8 L 246.8 93.0 L 255.2 98.1 L 268.7 103.1 L 279.0 89.8 L 292.4 89.5 L 303.9 96.2 L 312.1 107.7 L 317.7 117.6 L 327.3 127.2 L 330.9 139.0 L 335.5 146.9 L 348.2 152.1 L 359.8 155.8 L 366.2 155.3 Z"
                    
                    stroke={selectedCountry === 'MX' ? '#FFFFFF' : 'rgba(255,255,255,0.22)'}
                    strokeWidth={selectedCountry === 'MX' ? '2.5' : '1'}
                    filter={selectedCountry === 'MX' ? 'url(#active-glow)' : 'url(#country-depth)'}
                    className={countryClass('MX')}
                  />
                  <text x="280" y="195"  fontSize="20" fontWeight="800" fontFamily="Raleway, sans-serif" textAnchor="middle" className={textClass('MX')}>
                    {t.regionalMap.mapLabels.MX}
                  </text>
                </g>

                <g
                  className="group cursor-pointer transition-transform duration-200 active:scale-[0.99]"
                  onClick={() => handleSelectCountry('GT')}
                >
                  <path
                    d="M 481.1 359.6 L 472.7 356.6 L 462.6 356.3 L 455.1 353.0 L 446.3 346.1 L 446.7 341.2 L 448.6 337.2 L 446.3 334.1 L 454.1 320.3 L 475.1 320.3 L 475.5 314.6 L 472.9 313.5 L 471.1 309.9 L 465.0 306.0 L 458.9 300.4 L 466.3 300.3 L 466.3 290.9 L 496.7 291.0 L 496.5 304.4 L 495.2 323.4 L 500.1 323.4 L 505.4 326.4 L 506.8 323.9 L 511.6 326.0 L 504.2 332.5 L 496.5 337.2 L 495.3 340.4 L 496.6 343.7 L 493.2 348.0 L 489.4 349.0 L 490.3 351.0 L 487.2 352.9 L 481.6 357.1 L 481.1 359.6 Z"
                    
                    stroke={selectedCountry === 'GT' ? '#FFFFFF' : 'rgba(255,255,255,0.22)'}
                    strokeWidth={selectedCountry === 'GT' ? '2.5' : '1'}
                    filter={selectedCountry === 'GT' ? 'url(#active-glow)' : 'url(#country-depth)'}
                    className={countryClass('GT')}
                  />
                  <text x="470" y="330"  fontSize="11" fontWeight="800" fontFamily="Raleway, sans-serif" textAnchor="middle" className={textClass('GT')}>
                    {t.regionalMap.mapLabels.GT}
                  </text>
                </g>

                <g
                  className="group cursor-pointer transition-transform duration-200 active:scale-[0.99]"
                  onClick={() => handleSelectCountry('BZ')}
                >
                  <path
                    d="M 496.5 304.4 L 496.5 288.5 L 498.5 287.8 L 501.5 289.8 L 507.3 279.6 L 510.4 279.4 L 510.5 281.9 L 513.6 281.9 L 513.3 286.5 L 510.6 293.8 L 512.1 296.4 L 510.4 302.4 L 511.4 304.0 L 509.5 312.5 L 506.3 317.0 L 503.4 317.5 L 500.1 323.4 L 495.2 323.4 L 496.5 304.4 Z"
                    
                    stroke={selectedCountry === 'BZ' ? '#FFFFFF' : 'rgba(255,255,255,0.22)'}
                    strokeWidth={selectedCountry === 'BZ' ? '2.5' : '1'}
                    filter={selectedCountry === 'BZ' ? 'url(#active-glow)' : 'url(#country-depth)'}
                    className={countryClass('BZ')}
                  />
                  <text x="505" y="272"  fontSize="10" fontWeight="800" fontFamily="Raleway, sans-serif" textAnchor="middle" className={textClass('BZ')}>
                    {t.regionalMap.mapLabels.BZ}
                  </text>
                </g>

                <g
                  className="group cursor-pointer transition-transform duration-200 active:scale-[0.99]"
                  onClick={() => handleSelectCountry('SV')}
                >
                  <path
                    d="M 518.7 365.5 L 516.9 369.5 L 507.4 369.2 L 501.5 367.6 L 494.8 364.2 L 485.7 363.2 L 481.1 359.6 L 481.6 357.1 L 487.2 352.9 L 490.3 351.0 L 489.4 349.0 L 493.2 348.0 L 498.0 349.4 L 501.5 352.8 L 506.5 355.5 L 507.1 357.7 L 514.2 355.7 L 517.6 356.9 L 519.8 358.7 L 518.7 365.5 Z"
                    
                    stroke={selectedCountry === 'SV' ? '#FFFFFF' : 'rgba(255,255,255,0.22)'}
                    strokeWidth={selectedCountry === 'SV' ? '2.5' : '1'}
                    filter={selectedCountry === 'SV' ? 'url(#active-glow)' : 'url(#country-depth)'}
                    className={countryClass('SV')}
                  />
                  <text x="487" y="383"  fontSize="10" fontWeight="800" fontFamily="Raleway, sans-serif" textAnchor="middle" className={textClass('SV')}>
                    {t.regionalMap.mapLabels.SV}
                  </text>
                </g>

                <g
                  className="group cursor-pointer transition-transform duration-200 active:scale-[0.99]"
                  onClick={() => handleSelectCountry('HN')}
                >
                  <path
                    d="M 526.5 372.2 L 523.6 367.0 L 518.7 365.5 L 519.8 358.7 L 517.6 356.9 L 514.2 355.7 L 507.1 357.7 L 506.5 355.5 L 501.5 352.8 L 498.0 349.4 L 493.2 348.0 L 496.6 343.7 L 495.3 340.4 L 496.5 337.2 L 504.2 332.5 L 511.6 326.0 L 513.3 326.7 L 516.9 323.7 L 521.6 323.5 L 523.1 324.9 L 525.6 324.0 L 533.2 325.6 L 540.7 325.1 L 546.0 323.3 L 547.9 321.4 L 553.1 322.2 L 557.0 323.4 L 561.3 323.0 L 564.5 321.5 L 572.0 323.9 L 574.6 324.2 L 579.5 327.4 L 584.3 331.2 L 590.2 333.7 L 594.5 338.4 L 588.9 338.0 L 586.6 340.3 L 581.0 342.5 L 576.9 342.5 L 573.2 344.7 L 570.0 343.9 L 567.2 341.3 L 565.5 341.8 L 563.4 345.8 L 561.8 345.7 L 561.6 349.2 L 555.9 353.8 L 552.9 355.8 L 551.2 357.9 L 546.4 354.5 L 542.8 359.0 L 539.4 358.9 L 535.6 359.3 L 536.0 367.5 L 533.6 367.7 L 531.5 371.5 L 526.5 372.2 Z"
                    
                    stroke={selectedCountry === 'HN' ? '#FFFFFF' : 'rgba(255,255,255,0.22)'}
                    strokeWidth={selectedCountry === 'HN' ? '2.5' : '1'}
                    filter={selectedCountry === 'HN' ? 'url(#active-glow)' : 'url(#country-depth)'}
                    className={countryClass('HN')}
                  />
                  <text x="560" y="330"  fontSize="11" fontWeight="800" fontFamily="Raleway, sans-serif" textAnchor="middle" className={textClass('HN')}>
                    {t.regionalMap.mapLabels.HN}
                  </text>
                </g>

                <g
                  className="group cursor-pointer transition-transform duration-200 active:scale-[0.99]"
                  onClick={() => handleSelectCountry('NI')}
                >
                  <path
                    d="M 552.6 404.1 L 539.4 392.0 L 535.8 386.4 L 528.9 381.1 L 520.7 373.5 L 522.5 370.9 L 525.2 373.4 L 526.5 372.2 L 531.5 371.5 L 533.6 367.7 L 536.0 367.5 L 535.6 359.3 L 539.4 358.9 L 542.8 359.0 L 546.4 354.5 L 551.2 357.9 L 552.9 355.8 L 555.9 353.8 L 561.6 349.2 L 561.8 345.7 L 563.4 345.8 L 565.5 341.8 L 567.2 341.3 L 570.0 343.9 L 573.2 344.7 L 576.9 342.5 L 581.0 342.5 L 586.6 340.3 L 588.9 338.0 L 594.5 338.4 L 593.1 340.0 L 592.3 343.7 L 593.9 349.9 L 590.2 355.6 L 588.4 362.4 L 587.9 369.8 L 588.8 374.2 L 589.2 381.7 L 586.7 383.4 L 585.2 390.6 L 586.3 395.0 L 582.9 399.3 L 583.7 403.9 L 586.2 406.7 L 582.3 410.2 L 577.5 409.1 L 574.8 405.6 L 569.6 404.2 L 565.8 406.4 L 555.1 402.0 L 552.6 404.1 Z"
                    
                    stroke={selectedCountry === 'NI' ? '#FFFFFF' : 'rgba(255,255,255,0.22)'}
                    strokeWidth={selectedCountry === 'NI' ? '2.5' : '1'}
                    filter={selectedCountry === 'NI' ? 'url(#active-glow)' : 'url(#country-depth)'}
                    className={countryClass('NI')}
                  />
                  <text x="562" y="393"  fontSize="11" fontWeight="800" fontFamily="Raleway, sans-serif" textAnchor="middle" className={textClass('NI')}>
                    {t.regionalMap.mapLabels.NI}
                  </text>
                </g>

                <g
                  className="group cursor-pointer transition-transform duration-200 active:scale-[0.99]"
                  onClick={() => handleSelectCountry('CR')}
                >
                  <path
                    d="M 597.5 452.3 L 588.6 448.6 L 585.3 445.1 L 587.2 442.1 L 586.6 438.4 L 582.0 434.4 L 575.6 431.1 L 570.0 428.9 L 568.9 424.0 L 564.7 421.0 L 565.7 425.9 L 562.4 429.9 L 558.7 425.2 L 553.5 423.6 L 551.2 420.2 L 551.3 415.1 L 553.5 409.8 L 548.9 407.4 L 555.1 402.0 L 565.8 406.4 L 569.6 404.2 L 574.8 405.6 L 577.5 409.1 L 582.3 410.2 L 586.2 406.7 L 590.3 415.8 L 596.6 422.6 L 604.3 429.8 L 598.0 431.3 L 598.1 438.0 L 601.5 440.5 L 599.0 442.5 L 599.7 445.6 L 598.3 449.0 L 597.5 452.3 Z"
                    
                    stroke={selectedCountry === 'CR' ? '#FFFFFF' : 'rgba(255,255,255,0.22)'}
                    strokeWidth={selectedCountry === 'CR' ? '2.5' : '1'}
                    filter={selectedCountry === 'CR' ? 'url(#active-glow)' : 'url(#country-depth)'}
                    className={countryClass('CR')}
                  />
                  <circle cx="579.1" cy="423.7" r="4.5" fill="#003366" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="579.1" cy="423.7" r="4.5" stroke="#0077C8" strokeWidth="2" fill="none" className="animate-svg-ping" />
                  <text x="579" y="442"  fontSize="11" fontWeight="800" fontFamily="Raleway, sans-serif" textAnchor="middle" className={textClass('CR')}>
                    {t.regionalMap.mapLabels.CR}
                  </text>
                </g>

                <g
                  className="group cursor-pointer transition-transform duration-200 active:scale-[0.99]"
                  onClick={() => handleSelectCountry('PA')}
                >
                  <path
                    d="M 680.4 469.2 L 675.0 464.3 L 671.5 455.3 L 675.5 450.8 L 671.4 449.6 L 668.3 444.0 L 660.2 439.4 L 653.1 440.4 L 649.8 446.3 L 643.2 450.5 L 639.6 451.1 L 638.0 454.6 L 645.8 463.7 L 641.3 465.9 L 639.0 468.4 L 631.4 469.2 L 628.6 459.2 L 626.4 462.1 L 621.1 461.1 L 617.8 454.3 L 611.1 453.2 L 606.8 451.2 L 599.8 451.2 L 599.3 454.9 L 597.5 452.3 L 598.3 449.0 L 599.7 445.6 L 599.0 442.5 L 601.5 440.5 L 598.1 438.0 L 598.0 431.3 L 604.3 429.8 L 610.2 435.8 L 609.8 439.4 L 616.3 440.1 L 617.9 438.8 L 622.4 442.9 L 630.4 441.7 L 637.3 437.4 L 647.2 434.0 L 652.8 429.0 L 661.8 430.0 L 661.2 431.6 L 670.3 432.2 L 677.6 435.1 L 682.9 440.2 L 689.0 444.8 L 687.1 447.3 L 690.8 457.2 L 687.8 462.2 L 682.5 461.0 L 680.4 469.2 Z"
                    
                    stroke={selectedCountry === 'PA' ? '#FFFFFF' : 'rgba(255,255,255,0.22)'}
                    strokeWidth={selectedCountry === 'PA' ? '2.5' : '1'}
                    filter={selectedCountry === 'PA' ? 'url(#active-glow)' : 'url(#country-depth)'}
                    className={countryClass('PA')}
                  />
                  <text x="645" y="465"  fontSize="13" fontWeight="800" fontFamily="Raleway, sans-serif" textAnchor="middle" className={textClass('PA')}>
                    {t.regionalMap.mapLabels.PA}
                  </text>
                </g>

                <g
                  className="group cursor-pointer transition-transform duration-200 active:scale-[0.99]"
                  onClick={() => handleSelectCountry('DO')}
                >
                  <path
                    d="M 781.1 258.9 L 783.1 256.1 L 795.9 256.1 L 805.5 260.5 L 809.8 260.1 L 812.8 266.0 L 821.7 265.7 L 821.2 270.7 L 828.5 271.3 L 836.5 277.5 L 830.4 284.3 L 822.7 280.7 L 815.2 281.4 L 809.8 280.6 L 806.9 283.7 L 800.6 284.7 L 798.1 280.6 L 792.7 283.0 L 786.2 294.6 L 782.0 291.9 L 781.2 287.0 L 781.5 282.5 L 777.3 277.4 L 781.3 274.6 L 782.5 268.1 L 781.1 258.9 Z"
                    
                    stroke={selectedCountry === 'DO' ? '#FFFFFF' : 'rgba(255,255,255,0.22)'}
                    strokeWidth={selectedCountry === 'DO' ? '2.5' : '1'}
                    filter={selectedCountry === 'DO' ? 'url(#active-glow)' : 'url(#country-depth)'}
                    className={countryClass('DO')}
                  />
                  <text x="807" y="250"  fontSize="11" fontWeight="800" fontFamily="Raleway, sans-serif" textAnchor="middle" className={textClass('DO')}>
                    {t.regionalMap.mapLabels.DO}
                  </text>
                </g>

                <g
                  className="group cursor-pointer transition-transform duration-200 active:scale-[0.99]"
                  onClick={() => handleSelectCountry('CO')}
                >
                  <path
                    d="M 721.3 593.4 L 714.4 589.4 L 706.4 583.8 L 701.7 586.5 L 687.9 584.1 L 683.9 576.9 L 680.8 577.2 L 664.5 567.5 L 662.3 562.3 L 668.4 561.1 L 667.7 552.6 L 671.5 546.5 L 679.6 545.4 L 686.5 534.8 L 692.7 526.0 L 686.7 522.0 L 689.8 512.2 L 686.1 496.8 L 689.6 492.4 L 687.0 478.2 L 680.4 469.2 L 682.5 461.0 L 687.8 462.2 L 690.8 457.2 L 687.1 447.3 L 689.0 444.8 L 697.5 445.4 L 709.7 433.6 L 716.4 431.8 L 716.6 426.3 L 719.6 412.0 L 729.0 404.2 L 739.2 403.9 L 740.5 400.4 L 753.3 401.8 L 766.1 393.3 L 772.5 389.5 L 780.4 381.4 L 786.2 382.5 L 790.5 386.9 L 787.3 392.6 L 776.8 395.4 L 772.7 403.8 L 766.4 408.6 L 761.6 414.9 L 759.6 426.9 L 755.1 436.7 L 763.5 437.9 L 765.6 445.6 L 769.2 449.3 L 770.5 456.1 L 768.6 462.3 L 769.1 465.8 L 773.2 467.2 L 777.0 473.1 L 798.0 471.5 L 807.5 473.6 L 819.0 488.1 L 825.6 486.3 L 837.3 487.2 L 846.6 485.3 L 852.4 488.2 L 849.5 497.3 L 845.8 502.9 L 844.6 515.0 L 847.8 526.2 L 852.5 531.2 L 853.0 534.9 L 844.8 543.3 L 850.7 547.0 L 855.0 552.9 L 860.0 569.7 L 856.9 571.8 L 853.7 561.8 L 849.2 556.5 L 843.8 562.3 L 812.0 561.9 L 812.2 572.5 L 821.8 574.2 L 821.2 580.6 L 818.0 578.9 L 808.8 581.7 L 808.7 593.9 L 815.9 600.1 L 818.5 609.7 L 818.1 617.0 L 810.8 663.1 L 802.6 654.2 L 797.7 653.8 L 808.2 636.7 L 795.8 628.8 L 786.0 630.2 L 780.1 627.3 L 771.1 631.8 L 758.9 629.7 L 749.3 612.0 L 741.8 607.7 L 736.6 599.7 L 725.7 591.8 L 721.3 593.4 Z"
                    
                    stroke={selectedCountry === 'CO' ? '#FFFFFF' : 'rgba(255,255,255,0.22)'}
                    strokeWidth={selectedCountry === 'CO' ? '2.5' : '1'}
                    filter={selectedCountry === 'CO' ? 'url(#active-glow)' : 'url(#country-depth)'}
                    className={countryClass('CO')}
                  />
                  <text x="768" y="528"  fontSize="18" fontWeight="800" fontFamily="Raleway, sans-serif" textAnchor="middle" className={textClass('CO')}>
                    {t.regionalMap.mapLabels.CO}
                  </text>
                </g>

              </svg>
            </div>

            {/* Instruction Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px] text-[#9FC6E8] z-10">
              <span className="flex items-center gap-1.5 font-medium">
                <Navigation className="w-3.5 h-3.5 text-[#0077C8]" />
                {t.regionalMap.mapHint}
              </span>
              <span className="font-mono-code text-[10px] text-[#9FC6E8]/70 hidden sm:inline">
                {t.regionalMap.mapFooterTag}
              </span>
            </div>
          </div>

          {/* Country Detail Card (Desktop Sidebar) */}
          <div
            className="lg:col-span-5 hidden lg:flex flex-col bg-[#003366] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-xl max-h-[calc(100vh-8rem)] overflow-y-auto"
            style={mapHeight ? { height: mapHeight, maxHeight: mapHeight } : undefined}
          >
            {/* Country Header */}
            <div className="flex items-center gap-3.5 mb-4">
              <FlagIcon countryCode={current.id} className="w-10 h-7 shadow-md" />
              <div>
                <h3 className="font-heading font-extrabold text-2xl text-white">
                  {current.name}
                </h3>
                <span className="text-xs text-[#0077C8] font-semibold font-mono-code block">
                  {current.city}
                </span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#0077C8]/20 border border-[#0077C8]/50 text-[#9FC6E8] text-xs font-bold mb-4 font-mono-code w-fit">
              <Building2 className="w-3.5 h-3.5 text-[#0077C8]" />
              <span>{current.status}</span>
            </div>
            <CountryDetailBody country={current} tone="dark" onNavigate={onNavigate} />

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#9FC6E8] shrink-0">
              <span>{t.regionalMap.sidebarFooterLabel}</span>
              <span className="font-mono-code font-bold text-white">{current.id}</span>
            </div>
          </div>
        </div>

        {/* 10 Countries Interactive Grid with Flags */}
        <div className="mt-6 sm:mt-8">
          <div className="flex items-center justify-between mb-3.5">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-700 dark:text-slate-300 font-mono-code">
              {t.regionalMap.countryListLabel}
            </span>
            <span className="text-[11px] text-slate-600 dark:text-[#9FC6E8] hidden sm:block">
              {t.regionalMap.countryListHint}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {countriesT.map((c) => {
              const isSelected = selectedCountry === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => handleSelectCountry(c.id)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-2xl border transition-all duration-200 text-left group active:scale-[0.98] cursor-pointer ${
                    isSelected
                      ? 'bg-[#0077C8] border-white text-white shadow-lg scale-[1.02] ring-2 ring-[#0077C8]/50'
                      : 'bg-[#003366] border-white/10 text-slate-200 hover:bg-[#0B5A96] hover:border-white/25 hover:text-white dark:hover:bg-white/10'
                  }`}
                >
                  <FlagIcon countryCode={c.id} className="w-6 h-4 shrink-0 shadow-xs" />
                  <div className="min-w-0 flex-1">
                    <span className="font-heading font-bold text-xs block truncate">
                      {c.name}
                    </span>
                    <span
                      className={`text-[9px] font-mono-code block truncate ${
                        isSelected ? 'text-white/90' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    >
                      {c.status.split(' ')[0]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Sheet for Country Details */}
      <BottomSheet
        isOpen={showDetailSheet}
        onClose={() => setShowDetailSheet(false)}
        title={current.name}
        subtitle={current.status}
        icon={<FlagIcon countryCode={current.id} className="w-8 h-6" />}
      >
        <CountryDetailBody country={current} tone="light" onNavigate={onNavigate} />

        <button
          onClick={() => setShowDetailSheet(false)}
          className="mt-5 w-full py-3.5 rounded-2xl bg-[#003366] hover:bg-[#001F3D] text-white font-heading font-bold text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer"
        >
          {t.common.close}
        </button>
      </BottomSheet>
    </section>
  );
}
