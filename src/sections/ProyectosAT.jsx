import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Search, X, Building2, CalendarDays, MapPin, FolderOpen, Layers, ChevronDown, Handshake, Earth, RotateCcw } from 'lucide-react';
import KickerBadge from '../components/KickerBadge';
import { ETIQUETAS, getEtiqueta, nombreEtiqueta } from '../data/etiquetas';
import { PROYECTOS_AT, REGION_PAISES, proyectosDeSocio } from '../data/proyectosData';
import { useLanguage } from '../i18n/LanguageContext';
import EscudoICAP from '../components/EscudoICAP';
import { BANDERAS } from '../data/banderas';

/**
 * Portafolio de proyectos de Asistencia Técnica: buscador (nombre del
 * proyecto o cliente) + filtros por PAÍS (banderitas) y por ETIQUETA (las
 * 14 de etiquetas.js, que son también las Áreas de Especialización).
 *
 * Países y etiquetas son de selección múltiple y se combinan con "Y": un
 * proyecto aparece si tiene TODAS las etiquetas y TODOS los países
 * elegidos (un proyecto puede tener varias etiquetas y abarcar varios
 * países a la vez). Si ninguno cumple, se muestra el aviso de vacío.
 *
 * Al tocar una tarjeta, su ficha se abre a lo ancho en el renglón
 * SIGUIENTE de la grilla, y en su lugar queda un hueco punteado hasta que
 * se cierra; sólo puede haber una abierta.
 *
 * `filtroInicial` llega desde otras secciones (Brochure.jsx):
 *  - { etiqueta }  "Ver proyectos relacionados" de Áreas.
 *  - { socio }     un socio del carrusel de Organismos y Socios.
 *  - { pais }      un país de Presencia.
 *  - { proyecto }  un proyecto puntual: queda abierto y a la vista.
 */

// Países con banderita en el filtro: los del mapa de Presencia, de
// norte a sur y después los de fuera del istmo.
const PAISES = ['GT', 'BZ', 'SV', 'HN', 'NI', 'CR', 'PA', 'DO', 'MX', 'CO'];
const paisesDe = (p) => REGION_PAISES[p.region] || [];

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

// Agrega o quita un valor de una lista (selección múltiple).
const alternar = (lista, valor) => (lista.includes(valor) ? lista.filter((v) => v !== valor) : [...lista, valor]);

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

/**
 * Botón de país (o el de "Todos", con el mapamundi), como en
 * referencias-proyectos (BandaPaises.jsx): un disco claro y, adentro, la
 * bandera real en un círculo más pequeño. Seleccionado, el anillo de luz
 * gira alrededor del disco. Mientras se filtra, los no elegidos se
 * atenúan un poco.
 */
function BanderaPais({ code, nombre, n, activo, atenuado, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      title={n == null ? nombre : `${nombre} · ${n}`}
      className={`group flex flex-col items-center gap-1.5 transition-opacity duration-200 ${
        (n === 0 && !activo) ? 'opacity-35' : atenuado ? 'opacity-60 hover:opacity-100' : ''
      }`}
    >
      <span
        className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-transform duration-300 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] ${
          activo ? 'scale-110' : 'group-hover:-translate-y-0.5 group-hover:scale-105'
        }`}
      >
        {activo && <span aria-hidden="true" className="absolute -inset-[3px] rounded-full authority-ring" />}
        {/* Disco */}
        <span
          className={`relative w-full h-full rounded-full flex items-center justify-center border shadow-[0_2px_6px_-3px_rgba(0,51,102,0.3)] transition-colors ${
            activo
              ? 'bg-[#EAF3FB] dark:bg-white/15 border-transparent'
              : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 group-hover:bg-[#EAF3FB] dark:group-hover:bg-white/10'
          }`}
        >
          {/* Bandera (o mapamundi) en su círculo, más pequeño que el disco */}
          {code ? (
            <img
              src={BANDERAS[code]}
              alt=""
              draggable={false}
              className="w-[72%] h-[72%] rounded-full object-cover ring-1 ring-black/10 dark:ring-white/15"
            />
          ) : (
            <span className="w-[72%] h-[72%] rounded-full bg-[#0077C8] text-white flex items-center justify-center">
              <Earth className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </span>
          )}
        </span>
        {/* Cuántos proyectos daría al sumarlo */}
        {n != null && (
          <span
            className={`absolute -top-1 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full text-[9px] font-mono-code font-bold flex items-center justify-center ring-2 ring-[#D6E9F7] dark:ring-[#001F3D] ${
              activo ? 'bg-[#0077C8] text-white' : 'bg-white dark:bg-[#0B2340] text-slate-600 dark:text-slate-300'
            }`}
          >
            {n}
          </span>
        )}
      </span>
      <span
        className={`text-[10px] sm:text-[11px] font-heading leading-tight text-center ${
          activo ? 'font-extrabold text-[#003366] dark:text-white' : 'font-semibold text-slate-600 dark:text-slate-300'
        }`}
      >
        {nombre}
      </span>
    </button>
  );
}

/** Tarjeta compacta de la grilla (todas del mismo alto). */
function TarjetaProyecto({ p, onOpen, lang }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-expanded={false}
      className="group relative h-[132px] w-full text-left rounded-2xl bg-white dark:bg-[#0B2340] border border-slate-100 dark:border-white/10 shadow-sm overflow-hidden p-4 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#0077C8]/25 dark:hover:border-[#4FB2F2]/30"
    >
      <EscudoICAP tono="navy" className="dark:hidden absolute -right-6 -bottom-8 w-32 opacity-[0.06] rotate-[-8deg] pointer-events-none" />
      <EscudoICAP tono="white" className="hidden dark:block absolute -right-6 -bottom-8 w-32 opacity-[0.07] rotate-[-8deg] pointer-events-none" />
      <span className="relative flex items-center justify-between gap-3">
        <PuntosEtiquetas etiquetas={p.etiquetas} lang={lang} />
        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 group-hover:translate-y-0.5" />
      </span>
      <h3 className="relative font-heading font-bold text-sm leading-snug text-[#003366] dark:text-white line-clamp-3">
        {p.titulo}
      </h3>
    </button>
  );
}

/** Hueco que deja la tarjeta abierta en su renglón (al tocarlo, cierra). */
function HuecoProyecto({ onClose, t }) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label={t.close}
      className="h-[132px] w-full rounded-2xl border-2 border-dashed border-[#0077C8]/35 dark:border-[#4FB2F2]/35 bg-[#0077C8]/[0.04] dark:bg-white/[0.03] flex flex-col items-center justify-center gap-1 text-[#0077C8] dark:text-[#4FB2F2] transition-colors hover:bg-[#0077C8]/[0.08]"
    >
      <ChevronDown className="w-5 h-5 animate-bounce" />
      <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider">{t.openBelow}</span>
    </button>
  );
}

/**
 * Ficha completa, a lo ancho del renglón siguiente. Una flechita arriba
 * apunta a la columna de donde salió el proyecto.
 */
function DetalleProyecto({ p, columna, columnas, onClose, t, tAll, lang, locale, ahora, panelRef }) {
  const flecha = `${((columna + 0.5) / columnas) * 100}%`;
  const paises = paisesDe(p);
  return (
    <div ref={panelRef} className="col-span-full relative pt-2 animate-proyecto-in">
      <span
        aria-hidden="true"
        className="absolute top-0 w-4 h-4 -translate-x-1/2 rotate-45 bg-white dark:bg-[#0B2340] border-l border-t border-[#0077C8]/40 dark:border-[#4FB2F2]/40 z-10"
        style={{ left: flecha }}
      />
      <article className="relative rounded-2xl bg-white dark:bg-[#0B2340] border border-[#0077C8]/40 dark:border-[#4FB2F2]/40 shadow-xl overflow-hidden">
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#003366] via-[#0077C8] to-[#4FB2F2]" />
        <EscudoICAP tono="navy" className="dark:hidden absolute -right-8 -bottom-10 w-48 opacity-[0.06] rotate-[-8deg] pointer-events-none" />
        <EscudoICAP tono="white" className="hidden dark:block absolute -right-8 -bottom-10 w-48 opacity-[0.07] rotate-[-8deg] pointer-events-none" />

        <div className="relative p-4 sm:p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-heading font-extrabold text-base sm:text-lg leading-snug text-[#003366] dark:text-white">
              {p.titulo}
            </h3>
            <button
              type="button"
              onClick={onClose}
              aria-label={t.close}
              className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-300 hover:bg-[#0077C8] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

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

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <EstadoBadge activo={enCurso(p, ahora)} t={t} />
              {/* Banderitas de los países que abarca */}
              {paises.length > 0 && (
                <span className="flex items-center -space-x-1.5">
                  {paises.map((code) => (
                    <img
                      key={code}
                      src={BANDERAS[code]}
                      alt={tAll.regionalMap.countries[code]?.name || code}
                      title={tAll.regionalMap.countries[code]?.name || code}
                      draggable={false}
                      className="w-5 h-5 rounded-full object-cover ring-2 ring-white dark:ring-[#0B2340]"
                    />
                  ))}
                </span>
              )}
            </div>
            <span className="text-[10px] font-mono-code text-slate-400">#{p.id}</span>
          </div>
        </div>
      </article>
    </div>
  );
}

export default function ProyectosAT({ filtroInicial = null }) {
  const { lang, t: tAll } = useLanguage();
  const t = tAll.proyectosAT;
  const locale = lang === 'en' ? 'en-US' : 'es-CR';
  const ahora = mesActual();

  const [busqueda, setBusqueda] = useState('');
  const [etiquetas, setEtiquetas] = useState(filtroInicial?.etiqueta ? [filtroInicial.etiqueta] : []);
  const [paises, setPaises] = useState(filtroInicial?.pais ? [filtroInicial.pais] : []);
  const [socio, setSocio] = useState(filtroInicial?.socio || null);
  const [abierto, setAbierto] = useState(filtroInicial?.proyecto || null);
  const panelRef = useRef(null);
  // La grilla va en estado (callback ref) porque desaparece cuando no hay
  // resultados y vuelve a montarse después.
  const [grid, setGrid] = useState(null);

  // Columnas reales de la grilla (1, 2 o 3 según el ancho), para saber
  // dónde termina el renglón de la tarjeta abierta.
  const [columnas, setColumnas] = useState(1);
  useLayoutEffect(() => {
    if (!grid) return undefined;
    const medir = () => {
      const view = grid.ownerDocument.defaultView;
      const n = view.getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length;
      setColumnas(n || 1);
    };
    medir();
    const RO = grid.ownerDocument.defaultView.ResizeObserver;
    if (!RO) return undefined;
    const ro = new RO(medir);
    ro.observe(grid);
    return () => ro.disconnect();
  }, [grid]);

  // Al abrir una ficha a mano NO se mueve la pantalla: se despliega y el
  // usuario baja si quiere. Sólo cuando se llega desde otra sección con un
  // proyecto puntual (filtroInicial.proyecto) se lleva a la vista, porque
  // si no, no sabría dónde quedó.
  useEffect(() => {
    if (!filtroInicial?.proyecto) return undefined;
    const id = setTimeout(() => {
      panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 350);
    return () => clearTimeout(id);
  }, [filtroInicial]);

  // Más recientes primero.
  const ordenados = useMemo(() => [...PROYECTOS_AT].sort((a, b) => b.desde.localeCompare(a.desde)), []);

  const resumen = useMemo(
    () => ({
      total: PROYECTOS_AT.length,
      clientes: new Set(PROYECTOS_AT.map((p) => p.cliente)).size,
      activos: PROYECTOS_AT.filter((p) => enCurso(p, ahora)).length
    }),
    [ahora]
  );

  const idsSocio = useMemo(() => (socio ? new Set(proyectosDeSocio(socio).map((p) => p.id)) : null), [socio]);

  // Búsqueda: sólo nombre del proyecto y cliente.
  const q = normalizar(busqueda.trim());
  const base = ordenados.filter(
    (p) => (!q || normalizar(`${p.titulo} ${p.cliente}`).includes(q)) && (!idsSocio || idsSocio.has(p.id))
  );
  const cumpleEtiquetas = (p, lista) => lista.every((id) => p.etiquetas.includes(id));
  const cumplePaises = (p, lista) => lista.every((code) => paisesDe(p).includes(code));
  const visibles = base.filter((p) => cumpleEtiquetas(p, etiquetas) && cumplePaises(p, paises));

  // Cada cápsula / bandera dice cuántos resultados quedarían al sumarla
  // a lo que ya está elegido.
  const conteoEtiqueta = (id) =>
    etiquetas.includes(id)
      ? visibles.length
      : visibles.filter((p) => p.etiquetas.includes(id)).length;
  const conteoPais = (code) =>
    paises.includes(code) ? visibles.length : visibles.filter((p) => paisesDe(p).includes(code)).length;

  const hayFiltros = busqueda || etiquetas.length || paises.length || socio;
  const limpiar = () => {
    setBusqueda('');
    setEtiquetas([]);
    setPaises([]);
    setSocio(null);
  };

  // Dónde va la ficha abierta: al final del renglón de su tarjeta.
  const idxAbierto = visibles.findIndex((p) => p.id === abierto);
  const proyectoAbierto = idxAbierto >= 0 ? visibles[idxAbierto] : null;
  const finRenglon = idxAbierto >= 0 ? Math.min(Math.floor(idxAbierto / columnas) * columnas + columnas, visibles.length) - 1 : -1;
  const cerrar = () => setAbierto(null);

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
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1.5 max-w-lg mx-auto">{t.subtitle}</p>

          <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3 max-w-md mx-auto">
            {[
              [resumen.total, t.statProjects],
              [resumen.clientes, t.statClients],
              [resumen.activos, t.statActive]
            ].map(([valor, etq]) => (
              <div key={etq} className="rounded-2xl bg-white/70 dark:bg-white/5 border border-white dark:border-white/10 py-2.5 px-2">
                <div className="font-heading font-extrabold text-xl sm:text-2xl text-[#0077C8] dark:text-[#4FB2F2] leading-none">
                  {valor}
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-tight">{etq}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Buscador: nombre del proyecto o cliente */}
        <div className="relative max-w-xl mx-auto mb-6">
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

        {/* Países: banderitas en círculo, selección múltiple */}
        <p className="text-center font-heading font-bold text-[10px] uppercase tracking-[0.14em] text-[#0077C8] dark:text-[#4FB2F2]">
          {t.countriesLabel}
        </p>
        <p className="text-center text-[10px] text-slate-500 dark:text-slate-400 mb-3">{t.countriesHint}</p>
        <div className="flex flex-wrap justify-center gap-x-3 sm:gap-x-4 gap-y-4 max-w-3xl mx-auto mb-7 pt-1">
          {/* Mapamundi: todos los países (quita la selección) */}
          <BanderaPais
            nombre={t.allCountries}
            activo={!paises.length}
            atenuado={paises.length > 0}
            onClick={() => setPaises([])}
          />
          {PAISES.map((code) => (
            <BanderaPais
              key={code}
              code={code}
              nombre={tAll.regionalMap.countries[code]?.name || code}
              n={conteoPais(code)}
              activo={paises.includes(code)}
              atenuado={paises.length > 0 && !paises.includes(code)}
              onClick={() => setPaises((prev) => alternar(prev, code))}
            />
          ))}
        </div>

        {/* Etiquetas: grilla pareja de cápsulas, selección múltiple. Cada
            una lleva su color; al activarla se rellena de ese color. */}
        <p className="text-center font-heading font-bold text-[10px] uppercase tracking-[0.14em] text-[#0077C8] dark:text-[#4FB2F2]">
          {t.tagsLabel}
        </p>
        <p className="text-center text-[10px] text-slate-500 dark:text-slate-400 mb-3">{t.tagsHint}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-6">
          <button
            onClick={() => setEtiquetas([])}
            aria-pressed={!etiquetas.length}
            className={`col-span-2 sm:col-span-1 min-h-[44px] flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-2xl text-[11px] sm:text-xs font-heading font-bold border-2 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 ${
              !etiquetas.length
                ? 'bg-[#003366] dark:bg-[#0077C8] text-white border-transparent shadow-lg'
                : 'bg-white dark:bg-white/5 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-white/10 hover:shadow-md'
            }`}
          >
            {t.allTags}
          </button>
          {ETIQUETAS.map((e) => {
            const activo = etiquetas.includes(e.id);
            const n = conteoEtiqueta(e.id);
            return (
              <button
                key={e.id}
                onClick={() => setEtiquetas((prev) => alternar(prev, e.id))}
                aria-pressed={activo}
                className={`min-h-[44px] flex items-center gap-2 px-3 py-1.5 rounded-2xl text-left text-[11px] sm:text-xs font-heading font-bold border-2 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 ${
                  activo ? '' : 'hover:shadow-md'
                } ${!n && !activo ? 'opacity-45' : ''}`}
                style={
                  activo
                    ? {
                        backgroundColor: e.color,
                        borderColor: e.color,
                        color: e.text,
                        boxShadow: `0 6px 18px -4px ${e.color}AA, 0 0 0 3px ${e.color}33`
                      }
                    : { borderColor: `${e.color}66`, backgroundColor: `${e.color}14` }
                }
              >
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: activo ? e.text : e.color }} />
                <span className={`flex-1 leading-tight ${activo ? '' : 'text-slate-800 dark:text-slate-100'}`}>
                  {e[lang === 'en' ? 'en' : 'es']}
                </span>
                <span className={`shrink-0 ${activo ? 'opacity-80' : 'opacity-60 text-slate-700 dark:text-slate-200'}`}>{n}</span>
              </button>
            );
          })}
        </div>

        {/* Socio que llegó desde el carrusel de Organismos y Socios */}
        {socio && (
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center gap-2 pl-3 pr-1 py-1 rounded-full bg-[#003366] text-white text-[11px] sm:text-xs font-heading font-semibold shadow">
              <Handshake className="w-3.5 h-3.5" />
              {t.partnerFilter}: {tAll.allies.items[socio]?.name || socio}
              <button
                onClick={() => setSocio(null)}
                aria-label={t.removeFilter}
                className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white/20"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          </div>
        )}

        {/* Conteo + limpiar */}
        <div className="flex items-center justify-between gap-3 mb-4 text-[11px] sm:text-xs text-slate-600 dark:text-slate-300">
          <span>
            {t.showing} <strong className="text-slate-900 dark:text-white">{visibles.length}</strong> {t.of} {resumen.total}{' '}
            {t.projectsWord} · <span className="opacity-80">{t.tapHint}</span>
          </span>
          {/* Siempre visible; apagado mientras no haya nada que limpiar */}
          <button
            onClick={limpiar}
            disabled={!hayFiltros}
            className="shrink-0 inline-flex items-center gap-1.5 h-9 px-4 rounded-xl font-heading font-bold text-[11px] sm:text-xs bg-[#0077C8] text-white shadow-md shadow-[#0077C8]/25 transition-all hover:bg-[#005A96] hover:-translate-y-0.5 active:scale-95 disabled:bg-white/70 disabled:dark:bg-white/5 disabled:text-slate-400 disabled:shadow-none disabled:translate-y-0 disabled:cursor-default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {t.clearFilters}
          </button>
        </div>

        {/* Tarjetas. La abierta deja su hueco y su ficha va a lo ancho
            justo después del renglón donde está. */}
        {visibles.length ? (
          <div ref={setGrid} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {visibles.map((p, i) => (
              <Fragment key={p.id}>
                {p.id === abierto ? (
                  <HuecoProyecto onClose={cerrar} t={t} />
                ) : (
                  <TarjetaProyecto
                    p={p}
                    onOpen={() => setAbierto(p.id)}
                    lang={lang}
                  />
                )}
                {i === finRenglon && proyectoAbierto && (
                  <DetalleProyecto
                    key={`detalle-${proyectoAbierto.id}`}
                    p={proyectoAbierto}
                    columna={idxAbierto % columnas}
                    columnas={columnas}
                    onClose={cerrar}
                    t={t}
                    tAll={tAll}
                    lang={lang}
                    locale={locale}
                    ahora={ahora}
                    panelRef={panelRef}
                  />
                )}
              </Fragment>
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
