import React, { useEffect, useRef, useState } from 'react';
import { Scale, HeartPulse, BarChart3, Leaf, Lightbulb, GraduationCap, CheckCircle2 } from 'lucide-react';

// Antes esta sección abría el detalle de cada área en un modal/bottom
// sheet aparte (había que tocar la tarjeta para leer la descripción y
// las líneas de trabajo) — se sentía como el directorio de servicios
// de un hospital. Ahora cada tarjeta va con todo su contenido a la
// vista de una vez, en celeste institucional con letras blancas: más
// elegante, sin esconder información detrás de un clic.
const AREAS = [
  {
    id: 'gobernanza',
    title: 'Gobernanza y regulación',
    tag: 'Políticas públicas y marcos regulatorios',
    longDesc: 'Fortalecimiento de los marcos jurídicos, transparencia institucional, modernización del Estado y diseño de políticas públicas orientadas al impacto social y la rendición de cuentas.',
    icon: Scale,
    points: [
      'Diseño y evaluación de políticas públicas sectoriales.',
      'Marcos regulatorios y simplificación de trámites gubernamentales.',
      'Gobernanza multinivel y descentralización administrativa.'
    ]
  },
  {
    id: 'salud',
    title: 'Gerencia de la salud',
    tag: 'Dirección en salud y seguridad social',
    longDesc: 'Programas y consultorías especializadas en gestión de servicios de salud, optimización de recursos hospitalarios y sostenibilidad de los sistemas de seguridad social en la región.',
    icon: HeartPulse,
    points: [
      'Gestión estratégica de servicios hospitalarios y redes de salud.',
      'Sostenibilidad financiera en seguridad social.',
      'Políticas públicas para la equidad y cobertura sanitaria.'
    ]
  },
  {
    id: 'proyectos',
    title: 'Gerencia de proyectos',
    tag: 'Planificación estratégica y dirección institucional',
    longDesc: 'Metodologías ágiles y tradicionales para la formulación, evaluación, financiamiento y ejecución exitosa de proyectos de desarrollo nacional e internacional.',
    icon: BarChart3,
    points: [
      'Formulación y evaluación ex-ante y ex-post de proyectos de inversión.',
      'Gestión de riesgos, cronogramas y presupuestos públicos.',
      'Cooperación técnica y vinculación con organismos multilaterales.'
    ]
  },
  {
    id: 'ambiente',
    title: 'Ambiente y energía',
    tag: 'Transición energética y gestión ambiental',
    longDesc: 'Acompañamiento a ministerios e instituciones en transición energética justa, mitigación del cambio climático y gestión sostenible de los recursos naturales.',
    icon: Leaf,
    points: [
      'Políticas de descarbonización y energías renovables.',
      'Gobernanza hídrica y gestión de cuencas compartidas.',
      'Mecanismos de financiamiento climático regional.'
    ]
  },
  {
    id: 'innovacion',
    title: 'Innovación pública',
    tag: 'Transformación digital y liderazgo adaptativo',
    longDesc: 'Laboratorios de innovación ciudadana, digitalización de servicios públicos, uso ético de inteligencia artificial y nuevas tecnologías aplicadas a la gestión pública.',
    icon: Lightbulb,
    points: [
      'Transformación digital del gobierno y servicios ciudadanos.',
      'Laboratorios de innovación y co-creación pública.',
      'Cultura organizacional ágil y liderazgo adaptativo.'
    ]
  },
  {
    id: 'formacion',
    title: 'Formación institucional',
    tag: 'Posgrados, maestrías y desarrollo del talento humano',
    longDesc: 'Oferta académica de posgrado (maestrías y doctorados) y programas de formación a la medida para cuadros directivos y técnicos del sector público.',
    icon: GraduationCap,
    points: [
      'Maestrías y doctorados especializados en administración pública.',
      'Cursos y diplomados ejecutivos virtuales y presenciales.',
      'Planes de carrera y competencias para el servidor público.'
    ]
  }
];

// Mismo celeste institucional para las 6 — un degradado (no un color
// plano) más un brillo radial arriba-izquierda, como si la superficie
// fuera ligeramente curva/pulida. Esa combinación es la que da la
// "ilusión 3D" (ver también el box-shadow de .area-card en
// global.css), sin usar ningún transform real ni animación.
const CARD_BACKGROUND =
  'radial-gradient(65% 70% at 14% -8%, rgba(255,255,255,0.4), transparent 42%), ' +
  'linear-gradient(160deg, #0090DD 0%, #0068AE 48%, #013A63 100%)';

export default function SpecializationAreas() {
  // Cada tarjeta aparece deslizándose desde su propio lado al entrar en
  // pantalla (columna izquierda ← izquierda, columna derecha ←
  // derecha), en vez de todas a la vez — un observer por tarjeta, no
  // uno solo para toda la sección. Y no es de una sola vez: si la
  // tarjeta sale de la pantalla (para cualquier lado, subiendo o
  // bajando) se vuelve a marcar como oculta, así que la próxima vez que
  // entre en pantalla se repite la animación — nunca se hace
  // `unobserve`, se sigue vigilando todo el tiempo que la sección esté
  // montada.
  const cardRefs = useRef({});
  const [visibleIds, setVisibleIds] = useState(() => new Set());

  useEffect(() => {
    const els = Object.values(cardRefs.current).filter(Boolean);
    if (els.length === 0) return undefined;

    // Mismo patrón que StatsSection/MissionVision: el IntersectionObserver
    // hay que sacarlo del `window` real dueño del documento donde viven
    // las tarjetas (no del `window` global del módulo), para que también
    // funcione dentro del iframe de "Vista Móvil".
    const view = els[0].ownerDocument?.defaultView;
    const IO = view?.IntersectionObserver;

    if (!IO) {
      // Sin soporte disponible: mostramos todo directo en vez de dejar
      // las tarjetas invisibles para siempre.
      setVisibleIds(new Set(AREAS.map((a) => a.id)));
      return undefined;
    }

    const observer = new IO(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.dataset.areaId;
          setVisibleIds((prev) => {
            const has = prev.has(id);
            if (entry.isIntersecting === has) return prev;
            const next = new Set(prev);
            if (entry.isIntersecting) next.add(id);
            else next.delete(id);
            return next;
          });
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -60px 0px' }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="px-4 sm:px-6 py-10 sm:py-16 bg-slate-50 relative">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 sm:mb-10 text-center sm:text-left">
          <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-[#0077C8] block mb-1 font-mono-code">
            Expertise y Oferta
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#003366] tracking-tight">
            Áreas de Especialización
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-md mx-auto sm:mx-0">
            Los seis frentes donde el ICAP acompaña a gobiernos e instituciones de la región.
          </p>
        </div>

        {/* Fichas ya expandidas, con todo su contenido a la vista —
            dos columnas desde tablet, una en móvil. */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {AREAS.map((area, idx) => {
            const Icon = area.icon;
            const fromRight = idx % 2 === 1;
            return (
              <div
                key={area.id}
                ref={(el) => {
                  cardRefs.current[area.id] = el;
                }}
                data-area-id={area.id}
                className={`h-full area-card-reveal ${fromRight ? 'area-card-reveal-right' : ''} ${
                  visibleIds.has(area.id) ? 'is-visible' : ''
                }`}
                style={{ transitionDelay: fromRight ? '120ms' : '0ms' }}
              >
              <article
                className="area-card group relative rounded-[28px] p-6 sm:p-7 overflow-hidden flex flex-col text-white h-full"
                style={{ background: CARD_BACKGROUND }}
              >
                {/* Hairline superior, apenas insinuada — el toque de
                    "borde pulido" en vez del acento de color de antes. */}
                <span
                  aria-hidden="true"
                  className="absolute top-0 left-7 right-7 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
                />

                <div className="relative flex items-start gap-4 mb-5">
                  <div className="w-14 h-14 min-w-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <h3 className="font-heading font-extrabold text-lg sm:text-xl text-white leading-tight">
                      {area.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-white/70 mt-1">{area.tag}</p>
                  </div>
                </div>

                <p className="relative text-xs sm:text-sm text-white/85 leading-relaxed mb-5">
                  {area.longDesc}
                </p>

                <div className="relative space-y-2 mt-auto pt-1">
                  {area.points.map((pt, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/10 border border-white/10 text-xs sm:text-[13px] text-white/90 leading-relaxed"
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-white" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
