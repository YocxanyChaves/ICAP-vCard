import React, { useMemo, useState } from 'react';
import { Search, X, Building2, CalendarDays, MapPin, FolderOpen, Layers } from 'lucide-react';
import KickerBadge from './KickerBadge';
import BottomSheet from '../../components/BottomSheet';
import { AREA_META, getAreaMeta } from './areaMeta';
import { PROYECTOS_AT, TIPOS_CLIENTE } from './proyectosData';
import { useLanguage } from '../../i18n/LanguageContext';

/**
 * Portafolio de proyectos de Asistencia Técnica: buscador + filtros por
 * Área (mismos colores/íconos de areaMeta.js que el mapa y los aliados)
 * y por tipo de cliente, con una ficha de detalle al tocar cada tarjeta.
 * Los datos viven aparte en proyectosData.js para que sumar proyectos no
 * obligue a tocar este componente.
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

// Para buscar sin que importen tildes ni mayúsculas ("genero" encuentra
// "Género").
const normalizar = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

const AREAS = Object.keys(AREA_META);

function AreaBadge({ area, label }) {
  const meta = getAreaMeta(area);
  const Icon = meta.icon;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-heading font-bold tracking-wide"
      style={{ backgroundColor: meta.color, color: meta.text }}
    >
      <Icon className="w-3 h-3 shrink-0" />
      {label}
    </span>
  );
}

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

export default function ProyectosAT() {
  const { lang, t: tAll } = useLanguage();
  const t = tAll.proyectosAT;
  const locale = lang === 'en' ? 'en-US' : 'es-CR';
  const ahora = mesActual();

  const [busqueda, setBusqueda] = useState('');
  const [area, setArea] = useState(null);
  const [tipo, setTipo] = useState(null);
  const [seleccionado, setSeleccionado] = useState(null);

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

  // El conteo por área respeta la búsqueda y el tipo de cliente, para que
  // cada chip diga cuántos resultados daría al tocarlo.
  const coincideTexto = (p) => {
    if (!busqueda.trim()) return true;
    const q = normalizar(busqueda.trim());
    return normalizar(`${p.titulo} ${p.cliente} ${p.area} ${p.alcance}`).includes(q);
  };
  const baseSinArea = ordenados.filter((p) => coincideTexto(p) && (!tipo || p.tipoCliente === tipo));
  const conteoPorArea = baseSinArea.reduce((acc, p) => ({ ...acc, [p.area]: (acc[p.area] || 0) + 1 }), {});
  const visibles = area ? baseSinArea.filter((p) => p.area === area) : baseSinArea;

  const hayFiltros = busqueda || area || tipo;
  const limpiar = () => {
    setBusqueda('');
    setArea(null);
    setTipo(null);
  };

  const chipBase =
    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-heading font-semibold border transition-all active:scale-95';

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
            ].map(([valor, etiqueta]) => (
              <div
                key={etiqueta}
                className="rounded-2xl bg-white/70 dark:bg-white/5 border border-white dark:border-white/10 py-2.5 px-2"
              >
                <div className="font-heading font-extrabold text-xl sm:text-2xl text-[#0077C8] dark:text-[#4FB2F2] leading-none">
                  {valor}
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-tight">
                  {etiqueta}
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
        <div className="flex justify-center mb-3">
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

        {/* Áreas */}
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-5">
          <button
            onClick={() => setArea(null)}
            aria-pressed={!area}
            className={`${chipBase} ${
              !area
                ? 'bg-[#003366] dark:bg-[#0077C8] text-white border-transparent shadow'
                : 'bg-white/70 dark:bg-white/5 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-white/10'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            {t.allAreas}
            <span className="opacity-70">{baseSinArea.length}</span>
          </button>
          {AREAS.map((a) => {
            const meta = getAreaMeta(a);
            const Icon = meta.icon;
            const activo = area === a;
            const n = conteoPorArea[a] || 0;
            return (
              <button
                key={a}
                onClick={() => setArea(activo ? null : a)}
                aria-pressed={activo}
                disabled={!n && !activo}
                className={`${chipBase} disabled:opacity-35 disabled:pointer-events-none ${
                  activo
                    ? 'border-transparent shadow'
                    : 'bg-white/70 dark:bg-white/5 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-white/10'
                }`}
                style={activo ? { backgroundColor: meta.color, color: meta.text } : undefined}
              >
                <Icon className="w-3.5 h-3.5" style={activo ? undefined : { color: meta.color }} />
                {t.areas[a] || a}
                <span className="opacity-70">{n}</span>
              </button>
            );
          })}
        </div>

        {/* Conteo + limpiar */}
        <div className="flex items-center justify-between gap-3 mb-3 text-[11px] sm:text-xs text-slate-600 dark:text-slate-300">
          <span>
            {t.showing} <strong className="text-slate-900 dark:text-white">{visibles.length}</strong> {t.of}{' '}
            {resumen.total} {t.projectsWord}
          </span>
          {hayFiltros && (
            <button onClick={limpiar} className="font-heading font-bold text-[#0077C8] dark:text-[#4FB2F2] hover:underline">
              {t.clearFilters}
            </button>
          )}
        </div>

        {/* Tarjetas */}
        {visibles.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {visibles.map((p) => {
              const meta = getAreaMeta(p.area);
              return (
                <button
                  key={`${p.titulo}-${p.desde}`}
                  onClick={() => setSeleccionado(p)}
                  className="group text-left rounded-2xl bg-white dark:bg-[#0B2340] border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col"
                >
                  <div className="h-1.5 shrink-0" style={{ backgroundColor: meta.color }} />
                  <div className="p-4 flex flex-col gap-2.5 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <AreaBadge area={p.area} label={t.areas[p.area] || p.area} />
                      <EstadoBadge activo={enCurso(p, ahora)} t={t} />
                    </div>
                    <h3 className="font-heading font-bold text-sm leading-snug text-[#003366] dark:text-white line-clamp-3 group-hover:text-[#0077C8] dark:group-hover:text-[#4FB2F2] transition-colors">
                      {p.titulo}
                    </h3>
                    <p className="flex items-start gap-1.5 text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                      <Building2 className="w-3.5 h-3.5 shrink-0 mt-px text-slate-400" />
                      <span>{p.cliente}</span>
                    </p>
                    <div className="mt-auto pt-2 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-2 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-mono-code">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" />
                        {formatearPeriodo(p, locale)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {t.scopes[p.alcance] || p.alcance}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
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

      {/* Ficha de detalle */}
      <BottomSheet
        isOpen={!!seleccionado}
        onClose={() => setSeleccionado(null)}
        title={t.detailTitle}
        subtitle={seleccionado ? t.areas[seleccionado.area] || seleccionado.area : ''}
        icon={
          seleccionado &&
          (() => {
            const meta = getAreaMeta(seleccionado.area);
            const Icon = meta.icon;
            return (
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: meta.color, color: meta.text }}
              >
                <Icon className="w-4 h-4" />
              </div>
            );
          })()
        }
        maxWidth="max-w-xl"
      >
        {seleccionado && (
          <div className="space-y-4 text-slate-900 dark:text-slate-100">
            <div className="flex flex-wrap items-center gap-2">
              <AreaBadge area={seleccionado.area} label={t.areas[seleccionado.area] || seleccionado.area} />
              <EstadoBadge activo={enCurso(seleccionado, ahora)} t={t} />
            </div>
            <h3 className="font-heading font-extrabold text-base sm:text-lg leading-snug text-[#003366] dark:text-white">
              {seleccionado.titulo}
            </h3>
            <dl className="grid grid-cols-1 gap-2.5">
              {[
                [Building2, t.client, seleccionado.cliente],
                [Layers, t.clientType, t.clientTypes[seleccionado.tipoCliente]],
                [CalendarDays, t.period, formatearPeriodo(seleccionado, locale)],
                [MapPin, t.scope, t.scopes[seleccionado.alcance] || seleccionado.alcance]
              ].map(([Icon, etiqueta, valor]) => (
                <div
                  key={etiqueta}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-start gap-3"
                >
                  <Icon className="w-4 h-4 text-[#0077C8] shrink-0 mt-0.5" />
                  <div>
                    <dt className="font-heading font-bold text-[10px] uppercase tracking-wide text-slate-500 dark:text-[#9FC6E8]">
                      {etiqueta}
                    </dt>
                    <dd className="text-xs sm:text-sm">{valor}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        )}
      </BottomSheet>
    </section>
  );
}
