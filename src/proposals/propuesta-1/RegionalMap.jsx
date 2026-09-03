import React, { useState } from 'react';
import { MapPin, Building2, Globe2, ExternalLink, Sparkles, CheckCircle2, ChevronRight, Navigation, Layers } from 'lucide-react';
import BottomSheet from '../../components/BottomSheet';

/**
 * High-quality SVG Flag Components for all 12 countries
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
    case 'EC': // Ecuador
      return (
        <svg className={`${className} rounded-md shadow-xs border border-white/10 shrink-0`} viewBox="0 0 60 36">
          <rect width="60" height="18" fill="#FFDD00" />
          <rect y="18" width="60" height="9" fill="#034EA2" />
          <rect y="27" width="60" height="9" fill="#ED1C24" />
          <circle cx="30" cy="18" r="3.2" fill="#B38E32" opacity="0.9" />
        </svg>
      );
    case 'BR': // Brasil
      return (
        <svg className={`${className} rounded-md shadow-xs border border-white/10 shrink-0`} viewBox="0 0 60 36">
          <rect width="60" height="36" fill="#009739" />
          <polygon points="30,4 54,18 30,32 6,18" fill="#FEDD00" />
          <circle cx="30" cy="18" r="7" fill="#012169" />
        </svg>
      );
    default:
      return <div className={`${className} bg-slate-400 rounded-md`} />;
  }
}

export default function RegionalMap() {
  const [selectedCountry, setSelectedCountry] = useState('CR');
  const [showDetailSheet, setShowDetailSheet] = useState(false);

  const countries = [
    {
      id: 'CR',
      name: 'Costa Rica',
      status: 'Sede Central',
      isHeadquarters: true,
      capital: 'San José',
      city: 'San José (Curridabat)',
      description: 'Sede central directiva del ICAP desde 1954, campus de posgrados internacionales, centro de innovación pública y coordinación regional de cooperación técnica.',
      highlight: 'Sede Central y Campus Académico Principal',
      inIsthmus: true
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
      inIsthmus: true
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
      inIsthmus: true
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
      inIsthmus: true
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
      inIsthmus: true
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
      inIsthmus: true
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
      inIsthmus: true
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
      inIsthmus: false
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
      inIsthmus: false
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
      inIsthmus: false
    },
    {
      id: 'EC',
      name: 'Ecuador',
      status: 'Cooperación Regional',
      isHeadquarters: false,
      capital: 'Quito',
      city: 'Quito',
      description: 'Formación de cuadros técnicos en regulación energética, evaluación de impacto y diseño de políticas sectoriales.',
      highlight: 'Asistencia Técnica Especializada',
      inIsthmus: false
    },
    {
      id: 'BR',
      name: 'Brasil',
      status: 'Cooperación Regional',
      isHeadquarters: false,
      capital: 'Brasilia',
      city: 'Brasilia / São Paulo',
      description: 'Vínculos de cooperación técnica con escuelas de gobierno, investigación comparada y programas interamericanos.',
      highlight: 'Intercambio con Escuelas de Gobierno',
      inIsthmus: false
    }
  ];

  const current = countries.find((c) => c.id === selectedCountry) || countries[0];

  const handleSelectCountry = (id) => {
    setSelectedCountry(id);
    if (window.innerWidth < 768) {
      setShowDetailSheet(true);
    }
  };

  // Institutional dark palette matching the website theme
  const getCountryFill = (id) => {
    if (selectedCountry === id) {
      return '#0077C8'; // Celeste ICAP activo
    }
    // Harmonious, elegant dark shades for unselected countries
    const shades = {
      GT: '#163E66',
      BZ: '#1C4A78',
      SV: '#14385C',
      HN: '#1A4570',
      NI: '#153D63',
      CR: '#184470',
      PA: '#1D4E80'
    };
    return shades[id] || '#163E66';
  };

  const getTextColor = (id) => {
    if (selectedCountry === id) return '#FFFFFF';
    return '#EAF3FB';
  };

  return (
    <section className="px-4 sm:px-6 py-12 sm:py-20 bg-[#001F3D] text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0077C8]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#0077C8]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="mb-6 sm:mb-8 text-center sm:text-left">
          <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-[#0077C8] block mb-1 font-mono-code">
            Alcance y Territorio
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
            Presencia Regional
          </h2>
          <p className="text-xs sm:text-sm text-[#9FC6E8] mt-1.5 max-w-xl leading-relaxed">
            Mapa geográfico del Istmo Centroamericano con sedes, oficinas nacionales y cobertura del ICAP.
          </p>
        </div>

        {/* Map & Desktop Detail Card Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          {/* Institutional Dark Geographic Map Canvas */}
          <div className="lg:col-span-7 bg-[#001F3D]/90 backdrop-blur-md border border-white/15 rounded-3xl p-4 sm:p-7 flex flex-col justify-between shadow-2xl relative overflow-hidden min-h-[380px] sm:min-h-[460px]">
            {/* Ocean & Ambient Text Markers */}
            <div className="absolute top-4 right-6 text-right select-none pointer-events-none z-0">
              <h3 className="font-heading font-extrabold text-lg sm:text-xl text-white/90 tracking-wide">
                Central America
              </h3>
              <span className="text-[10px] sm:text-xs text-[#9FC6E8]/40 font-mono-code uppercase tracking-widest block mt-3">
                Mar Caribe
              </span>
            </div>

            <div className="absolute bottom-6 left-6 text-left select-none pointer-events-none z-0">
              <span className="text-[10px] sm:text-xs text-[#9FC6E8]/40 font-mono-code uppercase tracking-widest">
                Océano Pacífico
              </span>
            </div>

            {/* High-Fidelity Geographically Accurate SVG Map */}
            <div className="my-auto py-3 relative flex items-center justify-center z-10">
              <svg
                className="w-full max-w-[560px] h-auto drop-shadow-2xl select-none"
                viewBox="0 0 880 580"
              >
                <defs>
                  {/* Glowing effect for selected country */}
                  <filter id="active-glow-orange" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#0077C8" floodOpacity="0.9" />
                  </filter>
                  <filter id="country-depth" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
                  </filter>
                </defs>

                {/* ============ 1. GUATEMALA ============ */}
                <g
                  className="cursor-pointer transition-transform duration-200 active:scale-[0.99] group"
                  onClick={() => handleSelectCountry('GT')}
                >
                  <path
                    d="M 135,70 
                       L 255,70 
                       L 255,160 
                       C 260,165 285,160 300,185 
                       C 290,215 270,240 250,250 
                       C 225,270 205,280 185,280 
                       C 145,265 110,245 95,200 
                       C 95,160 120,135 135,70 Z"
                    fill={getCountryFill('GT')}
                    stroke={selectedCountry === 'GT' ? '#FFFFFF' : 'rgba(255,255,255,0.25)'}
                    strokeWidth={selectedCountry === 'GT' ? '2.5' : '1.3'}
                    filter={selectedCountry === 'GT' ? 'url(#active-glow-orange)' : 'url(#country-depth)'}
                    className="hover:fill-[#1E578F] transition-all"
                  />
                  {/* Capital Dot */}
                  <circle cx="175" cy="225" r="4.5" fill="#003366" stroke="#FFFFFF" strokeWidth="1.5" />
                  <text x="175" y="175" fill={getTextColor('GT')} fontSize="13" fontWeight="800" fontFamily="Raleway, sans-serif" textAnchor="middle">
                    GUATEMALA
                  </text>
                  <text x="175" y="200" fill={selectedCountry === 'GT' ? '#FFFFFF' : '#9FC6E8'} fontSize="10" fontWeight="600" textAnchor="middle">
                    Guatemala
                  </text>
                </g>

                {/* ============ 2. BELICE ============ */}
                <g
                  className="cursor-pointer transition-transform duration-200 active:scale-[0.99] group"
                  onClick={() => handleSelectCountry('BZ')}
                >
                  <path
                    d="M 255,40 
                       C 285,35 300,55 305,95 
                       C 305,135 295,165 285,185 
                       C 275,185 260,175 255,160 
                       L 255,40 Z"
                    fill={getCountryFill('BZ')}
                    stroke={selectedCountry === 'BZ' ? '#FFFFFF' : 'rgba(255,255,255,0.25)'}
                    strokeWidth={selectedCountry === 'BZ' ? '2.5' : '1.3'}
                    filter={selectedCountry === 'BZ' ? 'url(#active-glow-orange)' : 'url(#country-depth)'}
                    className="hover:fill-[#1E578F] transition-all"
                  />
                  {/* Capital Dot */}
                  <circle cx="270" cy="115" r="4" fill="#003366" stroke="#FFFFFF" strokeWidth="1.5" />
                  <text x="295" y="118" fill={getTextColor('BZ')} fontSize="11" fontWeight="800" fontFamily="Raleway, sans-serif">
                    BELIZE
                  </text>
                  <text x="265" y="80" fill={selectedCountry === 'BZ' ? '#FFFFFF' : '#9FC6E8'} fontSize="9" fontWeight="700" transform="rotate(-90 265 80)">
                    Belmopan
                  </text>
                </g>

                {/* ============ 3. EL SALVADOR ============ */}
                <g
                  className="cursor-pointer transition-transform duration-200 active:scale-[0.99] group"
                  onClick={() => handleSelectCountry('SV')}
                >
                  <path
                    d="M 185,280 
                       C 215,265 255,270 295,275 
                       C 345,290 355,305 345,325 
                       C 320,335 265,335 230,320 
                       C 200,305 185,290 185,280 Z"
                    fill={getCountryFill('SV')}
                    stroke={selectedCountry === 'SV' ? '#FFFFFF' : 'rgba(255,255,255,0.25)'}
                    strokeWidth={selectedCountry === 'SV' ? '2.5' : '1.3'}
                    filter={selectedCountry === 'SV' ? 'url(#active-glow-orange)' : 'url(#country-depth)'}
                    className="hover:fill-[#1E578F] transition-all"
                  />
                  {/* Capital Dot */}
                  <circle cx="255" cy="295" r="4" fill="#003366" stroke="#FFFFFF" strokeWidth="1.5" />
                  <text x="275" y="302" fill={selectedCountry === 'SV' ? '#FFFFFF' : '#9FC6E8'} fontSize="9.5" fontWeight="700">
                    San Salvador
                  </text>
                  <text x="245" y="355" fill={getTextColor('SV')} fontSize="12" fontWeight="800" fontFamily="Raleway, sans-serif" textAnchor="middle">
                    EL SALVADOR
                  </text>
                </g>

                {/* ============ 4. HONDURAS ============ */}
                <g
                  className="cursor-pointer transition-transform duration-200 active:scale-[0.99] group"
                  onClick={() => handleSelectCountry('HN')}
                >
                  {/* Continental Shape with Caribbean Mosquitia contour */}
                  <path
                    d="M 285,185 
                       C 305,175 355,160 410,165 
                       C 475,170 515,195 565,220 
                       C 515,255 455,280 400,295 
                       C 365,305 345,325 345,290 
                       C 295,275 250,250 250,250 
                       C 270,240 290,215 285,185 Z"
                    fill={getCountryFill('HN')}
                    stroke={selectedCountry === 'HN' ? '#FFFFFF' : 'rgba(255,255,255,0.25)'}
                    strokeWidth={selectedCountry === 'HN' ? '2.5' : '1.3'}
                    filter={selectedCountry === 'HN' ? 'url(#active-glow-orange)' : 'url(#country-depth)'}
                    className="hover:fill-[#1E578F] transition-all"
                  />
                  {/* Bay Islands (Islas de la Bahía) */}
                  <ellipse cx="405" cy="140" rx="14" ry="4" fill={getCountryFill('HN')} stroke="rgba(255,255,255,0.3)" />
                  <ellipse cx="445" cy="145" rx="10" ry="3" fill={getCountryFill('HN')} stroke="rgba(255,255,255,0.3)" />

                  {/* Capital Dot */}
                  <circle cx="335" cy="255" r="4.5" fill="#003366" stroke="#FFFFFF" strokeWidth="1.5" />
                  <text x="390" y="215" fill={getTextColor('HN')} fontSize="13" fontWeight="800" fontFamily="Raleway, sans-serif" textAnchor="middle">
                    HONDURAS
                  </text>
                  <text x="350" y="260" fill={selectedCountry === 'HN' ? '#FFFFFF' : '#9FC6E8'} fontSize="10" fontWeight="600">
                    Tegucigalpa
                  </text>
                </g>

                {/* ============ 5. NICARAGUA ============ */}
                <g
                  className="cursor-pointer transition-transform duration-200 active:scale-[0.99] group"
                  onClick={() => handleSelectCountry('NI')}
                >
                  <path
                    d="M 345,290 
                       C 365,305 400,295 455,280 
                       C 515,255 565,220 565,220 
                       C 575,280 545,360 550,420 
                       C 485,430 425,435 395,415 
                       C 375,370 350,335 345,290 Z"
                    fill={getCountryFill('NI')}
                    stroke={selectedCountry === 'NI' ? '#FFFFFF' : 'rgba(255,255,255,0.25)'}
                    strokeWidth={selectedCountry === 'NI' ? '2.5' : '1.3'}
                    filter={selectedCountry === 'NI' ? 'url(#active-glow-orange)' : 'url(#country-depth)'}
                    className="hover:fill-[#1E578F] transition-all"
                  />
                  {/* Lakes (White Inset) */}
                  <path d="M 390,345 C 410,340 420,360 405,360 Z" fill="#001F3D" opacity="0.9" stroke="rgba(255,255,255,0.2)" />
                  <path d="M 420,365 C 465,355 485,405 455,420 C 430,415 415,390 420,365 Z" fill="#001F3D" opacity="0.95" stroke="rgba(255,255,255,0.2)" />

                  {/* Capital Dot */}
                  <circle cx="410" cy="340" r="4.5" fill="#003366" stroke="#FFFFFF" strokeWidth="1.5" />
                  <text x="425" y="344" fill={selectedCountry === 'NI' ? '#FFFFFF' : '#9FC6E8'} fontSize="10" fontWeight="700">
                    Managua
                  </text>
                  <text x="465" y="300" fill={getTextColor('NI')} fontSize="13" fontWeight="800" fontFamily="Raleway, sans-serif" textAnchor="middle">
                    NICARAGUA
                  </text>
                </g>

                {/* ============ 6. COSTA RICA (Sede Central) ============ */}
                <g
                  className="cursor-pointer transition-transform duration-200 active:scale-[0.99] group"
                  onClick={() => handleSelectCountry('CR')}
                >
                  {/* Realistic Silhouette with Península de Nicoya and Península de Osa */}
                  <path
                    d="M 395,415 
                       C 425,435 485,430 550,420 
                       C 565,465 545,510 525,520 
                       C 505,555 470,545 460,510 
                       C 440,490 425,460 395,465 
                       C 365,475 355,445 375,430 
                       C 385,425 390,420 395,415 Z"
                    fill={getCountryFill('CR')}
                    stroke={selectedCountry === 'CR' ? '#FFFFFF' : 'rgba(255,255,255,0.3)'}
                    strokeWidth={selectedCountry === 'CR' ? '3' : '1.6'}
                    filter={selectedCountry === 'CR' ? 'url(#active-glow-orange)' : 'url(#country-depth)'}
                    className="hover:fill-[#1E578F] transition-all"
                  />
                  {/* Sede Central Pulsing Pin */}
                  <circle cx="475" cy="460" r="5.5" fill="#003366" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="475" cy="460" r="10" stroke="#0077C8" strokeWidth="2" fill="none" className="animate-ping" />

                  <text x="490" y="460" fill={selectedCountry === 'CR' ? '#FFFFFF' : '#9FC6E8'} fontSize="10.5" fontWeight="800">
                    San José
                  </text>
                  <text x="445" y="535" fill={getTextColor('CR')} fontSize="13" fontWeight="800" fontFamily="Raleway, sans-serif" textAnchor="middle">
                    COSTA RICA
                  </text>
                  <text x="445" y="550" fill="#0077C8" fontSize="9.5" fontWeight="800" textAnchor="middle" fontMono="true">
                    ★ SEDE CENTRAL
                  </text>
                </g>

                {/* ============ 7. PANAMÁ ============ */}
                <g
                  className="cursor-pointer transition-transform duration-200 active:scale-[0.99] group"
                  onClick={() => handleSelectCountry('PA')}
                >
                  {/* S-Shaped Isthmus with Azuero Peninsula */}
                  <path
                    d="M 550,420 
                       C 590,430 655,440 735,465 
                       C 785,495 810,540 770,555 
                       C 720,535 690,520 670,505 
                       C 635,535 615,570 580,560 
                       C 565,525 560,490 525,520 
                       C 545,510 565,465 550,420 Z"
                    fill={getCountryFill('PA')}
                    stroke={selectedCountry === 'PA' ? '#FFFFFF' : 'rgba(255,255,255,0.25)'}
                    strokeWidth={selectedCountry === 'PA' ? '2.5' : '1.3'}
                    filter={selectedCountry === 'PA' ? 'url(#active-glow-orange)' : 'url(#country-depth)'}
                    className="hover:fill-[#1E578F] transition-all"
                  />
                  {/* Capital Dot */}
                  <circle cx="705" cy="485" r="4.5" fill="#003366" stroke="#FFFFFF" strokeWidth="1.5" />
                  <text x="718" y="480" fill={selectedCountry === 'PA' ? '#FFFFFF' : '#9FC6E8'} fontSize="10" fontWeight="700">
                    Panama
                  </text>
                  <text x="670" y="445" fill={getTextColor('PA')} fontSize="13" fontWeight="800" fontFamily="Raleway, sans-serif" textAnchor="middle">
                    PANAMA
                  </text>
                </g>
              </svg>
            </div>

            {/* Instruction Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px] text-[#9FC6E8] z-10">
              <span className="flex items-center gap-1.5 font-medium">
                <Navigation className="w-3.5 h-3.5 text-[#0077C8]" />
                Toca cualquier país en el mapa para seleccionarlo
              </span>
              <span className="font-mono-code text-[10px] text-[#9FC6E8]/70 hidden sm:inline">
                SICA &middot; ICAP 1954
              </span>
            </div>
          </div>

          {/* Country Detail Card (Desktop Sidebar) */}
          <div className="lg:col-span-5 hidden lg:flex flex-col justify-between bg-[#003366] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-xl">
            <div>
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
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#0077C8]/20 border border-[#0077C8]/50 text-[#F2B78A] text-xs font-bold mb-4 font-mono-code">
                <Building2 className="w-3.5 h-3.5 text-[#0077C8]" />
                <span>{current.status}</span>
              </div>

              {/* Description */}
              <p className="text-sm text-[#C9D9E8] leading-relaxed mb-6">
                {current.description}
              </p>

              {/* Highlight Focus */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <span className="text-[10px] font-mono-code uppercase font-bold tracking-wider text-[#9FC6E8] block">
                  Enfoque Institucional
                </span>
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#0077C8] shrink-0" />
                  <span>{current.highlight}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#9FC6E8]">
              <span>Presencia y Cooperación ICAP</span>
              <span className="font-mono-code font-bold text-white">{current.id}</span>
            </div>
          </div>
        </div>

        {/* 12 Countries Interactive Grid with Flags */}
        <div className="mt-6 sm:mt-8">
          <div className="flex items-center justify-between mb-3.5">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-300 font-mono-code">
              Listado Oficial de Países (12)
            </span>
            <span className="text-[11px] text-[#9FC6E8] hidden sm:block">
              Toca para enfocar en el mapa
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {countries.map((c) => {
              const isSelected = selectedCountry === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => handleSelectCountry(c.id)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-2xl border transition-all duration-200 text-left group active:scale-[0.98] cursor-pointer ${
                    isSelected
                      ? 'bg-[#0077C8] border-white text-white shadow-lg scale-[1.02] ring-2 ring-[#0077C8]/50'
                      : 'bg-[#003366] border-white/10 text-slate-200 hover:bg-white/10 hover:border-white/25 hover:text-white'
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
        <div className="space-y-4 text-slate-700">
          <div className="flex items-center gap-2 text-xs font-mono-code text-[#0077C8] font-bold">
            <MapPin className="w-4 h-4" />
            <span>{current.city}</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {current.description}
          </p>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[10px] font-mono-code uppercase font-bold tracking-wider text-slate-400 block">
              Enfoque Institucional
            </span>
            <div className="flex items-start gap-2 text-xs font-semibold text-[#003366]">
              <CheckCircle2 className="w-4 h-4 text-[#0077C8] shrink-0 mt-0.5" />
              <span>{current.highlight}</span>
            </div>
          </div>

          <button
            onClick={() => setShowDetailSheet(false)}
            className="mt-4 w-full py-3.5 rounded-2xl bg-[#003366] hover:bg-[#001F3D] text-white font-heading font-bold text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </BottomSheet>
    </section>
  );
}
