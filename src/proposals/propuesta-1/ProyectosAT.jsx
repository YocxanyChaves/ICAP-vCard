import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X, Building2, CalendarDays, MapPin, FolderOpen, Layers, ChevronDown, Handshake } from 'lucide-react';
import KickerBadge from './KickerBadge';
import { ETIQUETAS, getEtiqueta, nombreEtiqueta } from './etiquetas';
import { PROYECTOS_AT, TIPOS_CLIENTE, proyectosDePais, proyectosDeSocio } from './proyectosData';
import { useLanguage } from '../../i18n/LanguageContext';
import icapEscudoNavy from '../../assets/icap-escudo-navy.svg';
import icapEscudoWhite from '../../assets/icap-escudo-white.svg';

/**
 * Portafolio de proyectos de Asistencia Técnica: buscador + filtros por
 * etiqueta (las 14 de etiquetas.js, que son también las Áreas de
 * Especialización) y por tipo de cliente. Cada tarjeta muestra sólo el
 * nombre y un puntito por etiqueta; al tocarla se despliega ahí mismo
 * con el resto de la ficha.
 *
 * `filtroInicial` llega desde otras secciones (Propuesta1.jsx):
 *  - { etiqueta }  "Ver proyectos relacionados" de Áreas.
 *  - { socio }     un socio del carrusel de Organismos y Socios.
 *  - { pais }      un país de Presencia.
 *  - { proyecto }  un proyecto puntual: queda abierto y a la vista.
 */

// 'AAAA-MM' del mes actual — un proyecto cuyo "hasta" sea este mes o
// posterior se considera en curso.
const mesActual = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

const enCurso = (p, ahora) => p.hasta >= ahora;

const formatearFecha = (valor, locale) => {
  const [anio, mes] = valor.split('-').map(Number);
  if (!mes) return String(anio);
  const texto = new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' }).format(
    new Date(anio, mes - 1, 1)
  );
  return texto.replace('.', '');
};

const formatearPeriodo = (p, locale) => {
  const desde = formatearFecha(p.desde, locale);
  const hasta = formatearFecha(p.hasta, locale);
  return desde === hasta ? desde : `${desde} – ${hasta}`;
};

const REGION_EN = {
  'Costa Rica': 'Costa Rica',
  Guatemala: 'Guatemala',
  'Centroamérica': 'Central America',
  'Centroamérica y Rep. Dominicana': 'Central America and Dominican Rep.',
  'Centroamérica y Caribe': 'Central America and the Caribbean',
  'Costa Rica, Colombia y México': 'Costa Rica, Colombia and Mexico',
  'Internacional (Unión Europea)': 'International (European Union)'
};

// Para buscar sin que importen tildes ni mayúsculas ("genero" encuentra
// "Género").
const normalizar = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

function EstadoBadge({ activo, t }) {
  return activo ? (
    <span className="inline-flex items-center gap-1 text-[10px] font-mono-code font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      {t.statusActive}
    </span>
  ) : (
    <span className="text-[10px] font-mono-code font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
      {t.statusDone}
    </span>
  );
}

function PuntosEtiquetas({ etiquetas, lang }) {
  return (
    <span className="flex items-center gap-1.5 shrink-0">
      {etiquetas.map((id) => (
        <span
          key={id}
          title={nombreEtiqueta(id, lang)}
          className="w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-[#0B2340]"
          style={{ backgroundColor: getEtiqueta(id).color }}
        />
      ))}
    </span>
  );
}

function TarjetaProyecto({ p, abierto, onToggle, t, lang, locale, ahora, refCallback }) {
  return (
    <article
      ref={refCallback}
      className={`relative rounded-2xl bg-white dark:bg-[#0B2340] border overflow-hidden transition-all duration-300 ${
        abierto
          ? 'border-[#0077C8]/40 dark:border-[#4FB2F2]/40 shadow-xl sm:col-span-2 lg:col-span-3'
          : 'border-slate-100 dark:border-white/10 shadow-sm hover:shadow-lg hover:-translate-y-0.5'
      }`}
    >
      {/* Marca de agua: el escudo del ICAP, apenas insinuado. */}
      <img
        src={icapEscudoNavy}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="dark:hidden absolute -right-6 -bottom-8 w-36 opacity-[0.06] rotate-[-8deg] pointer-events-none select-none"
      />
      <img
        src={icapEscudoWhite}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="hidden dark:block absolute -right-6 -bottom-8 w-36 opacity-[0.07] rotate-[-8deg] pointer-events-none select-none"
      />

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={abierto}
        className="relative w-full text-left p-4 flex flex-col gap-3 min-h-[112px]"
      >
        <div className="flex items-center justify-between gap-3">
          <PuntosEtiquetas etiquetas={p.etiquetas} lang={lang} />
          <ChevronDown
            className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${abierto ? 'rotate-180' : ''}`}
          />
        </div>
        <h3
          className={`font-heading font-bold text-sm leading-snug text-[#003366] dark:text-white ${
            abierto ? '' : 'line-clamp-3'
          }`}
        >
          {p.titulo}
        </h3>
      </button>

      {/* Ficha desplegable: grid-rows 0fr → 1fr anima la altura sin
          tener que medirla. */}
      <div
        className={`relative grid transition-[grid-template-rows] duration-300 ease-out ${
          abierto ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {p.etiquetas.map((id) => {
                const e = getEtiqueta(id);
                const Icon = e.icon;
                return (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-heading font-bold"
                    style={{ backgroundColor: e.color, color: e.text }}
                  >
                    <Icon className="w-3 h-3 shrink-0" />
                    {nombreEtiqueta(id, lang)}
                  </span>
                );
              })}
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                [Building2, t.client, p.cliente],
                [Layers, t.clientType, t.clientTypes[p.tipoCliente]],
                [CalendarDays, t.period, formatearPeriodo(p, locale)],
                [MapPin, t.region, lang === 'en' ? REGION_EN[p.region] || p.region : p.region]
              ].map(([Icon, etiqueta, valor]) => (
                <div
                  key={etiqueta}
                  className="p-2.5 rounded-xl bg-slate-50/90 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-start gap-2.5"
                >
                  <Icon className="w-4 h-4 text-[#0077C8] dark:text-[#4FB2F2] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <dt className="font-heading font-bold text-[10px] uppercase tracking-wide text-slate-500 dark:text-[#9FC6E8]">
                      {etiqueta}
                    </dt>
                    <dd className="text-xs sm:text-[13px] text-slate-800 dark:text-slate-100">{valor}</dd>
                  </div>
                </div>
              ))}
            </dl>
            <div className="flex items-center justify-between">
              <EstadoBadge activo={enCurso(p, ahora)} t={t} />
              <span className="text-[10px] font-mono-code text-slate-400">#{p.id}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ProyectosAT({ filtroInicial = null }) {
  const { lang, t: tAll } = useLanguage();
  const t = tAll.proyectosAT;
  const locale = lang === 'en' ? 'en-US' : 'es-CR';
  const ahora = mesActual();

  const [busqueda, setBusqueda] = useState('');
  const [etiqueta, setEtiqueta] = useState(filtroInicial?.etiqueta || null);
  const [tipo, setTipo] = useState(null);
  const [socio, setSocio] = useState(filtroInicial?.socio || null);
  const [pais, setPais] = useState(filtroInicial?.pais || null);
  const [abierto, setAbierto] = useState(filtroInicial?.proyecto || null);
  const tarjetasRef = useRef({});

  // Si se llegó por un proyecto puntual, se lleva a la vista ya abierto.
  useEffect(() => {
    if (!filtroInicial?.proyecto) return undefined;
    const id = setTimeout(() => {
      tarjetasRef.current[filtroInicial.proyecto]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 350);
    return () => clearTimeout(id);
  }, [filtroInicial]);

  // Más recientes primero.
  const ordenados = useMemo(
    () => [...PROYECTOS_AT].sort((a, b) => b.desde.localeCompare(a.desde)),
    []
  );

  const resumen = useMemo(
    () => ({
      total: PROYECTOS_AT.length,
      clientes: new Set(PROYECTOS_AT.map((p) => p.cliente)).size,
      activos: PROYECTOS_AT.filter((p) => enCurso(p, ahora)).length
    }),
    [ahora]
  );

  // Socio y país vienen de otras secciones: se traducen a un conjunto de
  // ids para filtrar igual que el resto.
  const idsContexto = useMemo(() => {
    if (socio) return new Set(proyectosDeSocio(socio).map((p) => p.id));
    if (pais) return new Set(proyectosDePais(pais).map((p) => p.id));
    return null;
  }, [socio, pais]);

  // El conteo por etiqueta respeta los demás filtros, para que cada
  // cápsula diga cuántos resultados daría al tocarla.
  const coincideTexto = (p) => {
    if (!busqueda.trim()) return true;
    const q = normalizar(busqueda.trim());
    const nombres = p.etiquetas.map((id) => nombreEtiqueta(id, lang)).join(' ');
    return normalizar(`${p.titulo} ${p.cliente} ${nombres} ${p.region}`).includes(q);
  };
  const baseSinEtiqueta = ordenados.filter(
    (p) => coincideTexto(p) && (!tipo || p.tipoCliente === tipo) && (!idsContexto || idsContexto.has(p.id))
  );
  const conteoPorEtiqueta = baseSinEtiqueta.reduce((acc, p) => {
    p.etiquetas.forEach((id) => {
      acc[id] = (acc[id] || 0) + 1;
    });
    return acc;
  }, {});
  const visibles = etiqueta ? baseSinEtiqueta.filter((p) => p.etiquetas.includes(etiqueta)) : baseSinEtiqueta;

  const hayFiltros = busqueda || etiqueta || tipo || socio || pais;
  const limpiar = () => {
    setBusqueda('');
    setEtiqueta(null);
    setTipo(null);
    setSocio(null);
    setPais(null);
  };

  const contexto = socio
    ? { label: t.partnerFilter, valor: tAll.allies.items[socio]?.name || socio, quitar: () => setSocio(null) }
    : pais
      ? { label: t.countryFilter, valor: tAll.regionalMap.countries[pais]?.name || pais, quitar: () => setPais(null) }
      : null;

  return (
    <section className="px-4 sm:px-6 pt-[var(--docencia-gap)] pb-12 sm:pb-20 bg-[#D6E9F7] dark:bg-[#001F3D] text-slate-900 dark:text-white">
      <div className="max-w-5xl mx-auto">
        {/* Encabezado */}
        <div className="mb-6 sm:mb-8 text-center">
          <div className="mb-1 sm:mb-1.5">
            <KickerBadge variant="glow">{t.kicker}</KickerBadge>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#003366] dark:text-[#9FC6E8] tracking-tight">
            {t.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1.5 max-w-lg mx-auto">
            {t.subtitle}
          </p>

          <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3 max-w-md mx-auto">
            {[
              [resumen.total, t.statProjects],
              [resumen.clientes, t.statClients],
              [resumen.activos, t.statActive]
            ].map(([valor, etq]) => (
              <div
                key={etq}
                className="rounded-2xl bg-white/70 dark:bg-white/5 border border-white dark:border-white/10 py-2.5 px-2"
              >
                <div className="font-heading font-extrabold text-xl sm:text-2xl text-[#0077C8] dark:text-[#4FB2F2] leading-none">
                  {valor}
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-tight">
                  {etq}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buscador */}
        <div className="relative max-w-xl mx-auto mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchPlaceholder}
            className="w-full h-11 pl-10 pr-10 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0077C8]/40 [&::-webkit-search-cancel-button]:hidden"
          />
          {busqueda && (
            <button
              onClick={() => setBusqueda('')}
              aria-label={t.clearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Tipo de cliente */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex flex-wrap justify-center items-center bg-white/70 dark:bg-black/30 p-0.5 rounded-xl border border-slate-200 dark:border-white/10">
            {[null, ...TIPOS_CLIENTE].map((tp) => (
              <button
                key={tp || 'todos'}
                onClick={() => setTipo(tp)}
                aria-pressed={tipo === tp}
                className={`px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-heading font-semibold transition-all ${
                  tipo === tp
                    ? 'bg-[#0077C8] text-white shadow'
                    : 'text-slate-600 dark:text-[#9FC6E8] hover:bg-slate-100 dark:hover:bg-white/10'
                }`}
              >
                {tp ? t.clientTypes[tp] : t.allClients}
              </button>
            ))}
          </div>
        </div>

        {/* Etiquetas: cada cápsula lleva su color; al activarla se
            rellena entera de ese color, con un halo del mismo tono. */}
        <p className="text-center font-heading font-bold text-[10px] uppercase tracking-[0.14em] text-[#0077C8] dark:text-[#4FB2F2] mb-2">
          {t.tagsLabel}
        </p>
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-5">
          <button
            onClick={() => setEtiqueta(null)}
            aria-pressed={!etiqueta}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-heading font-bold border-2 transition-all active:scale-95 ${
              !etiqueta
                ? 'bg-[#003366] dark:bg-[#0077C8] text-white border-transparent shadow-lg'
                : 'bg-white dark:bg-white/5 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-white/10'
            }`}
          >
            {t.allTags}
            <span className="opacity-70">{baseSinEtiqueta.length}</span>
          </button>
          {ETIQUETAS.map((e) => {
            const activo = etiqueta === e.id;
            const n = conteoPorEtiqueta[e.id] || 0;
            return (
              <button
                key={e.id}
                onClick={() => setEtiqueta(activo ? null : e.id)}
                aria-pressed={activo}
                disabled={!n && !activo}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-heading font-bold border-2 transition-all duration-200 active:scale-95 disabled:opacity-35 disabled:pointer-events-none"
                style={
                  activo
                    ? {
                        backgroundColor: e.color,
                        borderColor: e.color,
                        color: e.text,
                        boxShadow: `0 6px 18px -4px ${e.color}AA, 0 0 0 3px ${e.color}33`,
                        transform: 'scale(1.06)'
                      }
                    : { borderColor: `${e.color}66`, backgroundColor: `${e.color}14` }
                }
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: activo ? e.text : e.color }}
                />
                <span className={activo ? '' : 'text-slate-800 dark:text-slate-100'}>{e[lang === 'en' ? 'en' : 'es']}</span>
                <span className={activo ? 'opacity-80' : 'opacity-60 text-slate-700 dark:text-slate-200'}>{n}</span>
              </button>
            );
          })}
        </div>

        {/* Filtro que llegó desde Socios o Presencia */}
        {contexto && (
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center gap-2 pl-3 pr-1 py-1 rounded-full bg-[#003366] text-white text-[11px] sm:text-xs font-heading font-semibold shadow">
              {socio ? <Handshake className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
              {contexto.label}: {contexto.valor}
              <button
                onClick={contexto.quitar}
                aria-label={t.removeFilter}
                className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white/20"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          </div>
        )}

        {/* Conteo + limpiar */}
        <div className="flex items-center justify-between gap-3 mb-3 text-[11px] sm:text-xs text-slate-600 dark:text-slate-300">
          <span>
            {t.showing} <strong className="text-slate-900 dark:text-white">{visibles.length}</strong> {t.of}{' '}
            {resumen.total} {t.projectsWord} · <span className="opacity-80">{t.tapHint}</span>
          </span>
          {hayFiltros && (
            <button onClick={limpiar} className="font-heading font-bold text-[#0077C8] dark:text-[#4FB2F2] hover:underline shrink-0">
              {t.clearFilters}
            </button>
          )}
        </div>

        {/* Tarjetas */}
        {visibles.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 items-start grid-flow-row-dense">
            {visibles.map((p) => (
              <TarjetaProyecto
                key={p.id}
                p={p}
                abierto={abierto === p.id}
                onToggle={() => setAbierto((prev) => (prev === p.id ? null : p.id))}
                t={t}
                lang={lang}
                locale={locale}
                ahora={ahora}
                refCallback={(el) => {
                  tarjetasRef.current[p.id] = el;
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-14 rounded-2xl border border-dashed border-slate-300 dark:border-white/15">
            <FolderOpen className="w-8 h-8 mx-auto text-slate-400 mb-2" />
            <p className="text-sm text-slate-600 dark:text-slate-300">{t.empty}</p>
            <button onClick={limpiar} className="mt-3 text-xs font-heading font-bold text-[#0077C8] dark:text-[#4FB2F2] hover:underline">
              {t.clearFilters}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
