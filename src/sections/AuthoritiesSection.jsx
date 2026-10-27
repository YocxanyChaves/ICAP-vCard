import { useEffect, useRef, useState } from 'react';
import { Mail, UserPlus, Quote, RotateCw, RotateCcw, Crown, Handshake, GraduationCap } from 'lucide-react';
import { LinkedinIcon, WhatsAppIcon } from '../components/Icons';
import { downloadVCard, whatsappDigits } from '../components/VCardDownload';
import { useLanguage } from '../i18n/LanguageContext';
import KickerBadge from '../components/KickerBadge';
import EscudoICAP from '../components/EscudoICAP';

/**
 * Autoridades del ICAP: la Dirección General arriba y las direcciones de
 * los dos departamentos debajo, unidas por un organigrama con un pulso de
 * luz que baja de una a las otras. Reúne piezas del resto del sitio: el
 * volteo 3D de Misión/Visión, el bloque navy con escudo, el anillo de luz
 * del logo de Valores (girando alrededor de cada retrato) y los botones
 * de Contacto.
 *
 * DATOS: mientras `photo` esté vacío se muestran las iniciales; los
 * botones sin dato salen deshabilitados ("Dato pendiente"); el reverso
 * muestra un aviso hasta que `quote` tenga texto. Para completarlo basta
 * llenar los campos de abajo (`photo` es un import de src/assets).
 */
const AUTHORITIES = {
  director: {
    name: 'Edgar Balsells',
    initials: 'EB',
    photo: null,
    linkedin: '',
    whatsapp: '',
    email: '',
    quote: { es: '', en: '' }
  },
  at: {
    name: 'Carlos Calderón',
    initials: 'CC',
    photo: null,
    linkedin: '',
    whatsapp: '',
    email: '',
    quote: { es: '', en: '' }
  },
  docencia: {
    name: 'Jean Paul Vargas',
    initials: 'JV',
    photo: null,
    linkedin: '',
    whatsapp: '',
    email: '',
    quote: { es: '', en: '' }
  }
};

const DEPT_ICONS = { director: Crown, at: Handshake, docencia: GraduationCap };

// Retardo de la chispa en cada tramo del organigrama: el tallo arranca,
// los dos brazos siguen y las dos bajadas cierran — encadenados al ~36%
// del ciclo de 2.6s que dura cada cruce (ver .authority-pulse-* en
// global.css), para que se lea como un solo pulso que viaja.
const CONNECTOR_DELAYS = { stem: '0s', arms: '0.85s', drops: '1.7s' };

/**
 * Retrato circular con el anillo de luz girando alrededor. Si todavía
 * no hay foto, iniciales sobre un degradé institucional.
 */
function Portrait({ person, size = 'md', onDark = false }) {
  const dims = size === 'lg' ? 'w-28 h-28 sm:w-32 sm:h-32' : 'w-24 h-24 sm:w-28 sm:h-28';
  const text = size === 'lg' ? 'text-3xl sm:text-4xl' : 'text-[1.7rem] sm:text-3xl';
  return (
    <div className={`relative shrink-0 ${dims}`}>
      {/* Halo suave detrás del retrato */}
      <div
        aria-hidden="true"
        className={`absolute -inset-3 rounded-full blur-xl animate-pulse-slow ${
          onDark ? 'bg-[#4FB2F2]/30' : 'bg-[#0077C8]/20 dark:bg-[#4FB2F2]/25'
        }`}
      />
      <div aria-hidden="true" className="absolute -inset-[5px] rounded-full authority-ring" />
      <div
        className={`relative w-full h-full rounded-full overflow-hidden flex items-center justify-center ring-4 ${
          onDark ? 'ring-white/15' : 'ring-white dark:ring-white/10'
        } bg-[radial-gradient(circle_at_32%_26%,#4FB2F2_0%,#0077C8_52%,#003366_100%)]`}
      >
        {person.photo ? (
          <img src={person.photo} alt={person.name} className="w-full h-full object-cover" draggable={false} />
        ) : (
          <span className={`font-heading font-extrabold text-white tracking-wide drop-shadow ${text}`}>
            {person.initials}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Botón de contacto: link real si el dato existe; si no, la misma
 * píldora apagada con el aviso "Dato pendiente", para que el diseño se
 * vea completo mientras se recopilan los datos.
 */
function ContactChip({ href, onClick, icon: Icon, label, pendingLabel, tone }) {
  const enabled = Boolean(href || onClick);
  const base =
    'inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-xl text-[11px] font-heading font-bold tracking-wide border transition-all';
  const toneClasses =
    tone === 'dark'
      ? 'bg-white/10 border-white/15 text-white'
      : 'bg-[#EAF3FB] dark:bg-white/10 border-[#0077C8]/15 dark:border-white/10 text-[#003366] dark:text-white';
  const hover =
    tone === 'dark'
      ? 'hover:bg-white/20 hover:-translate-y-0.5 active:scale-95'
      : 'hover:bg-[#0077C8] hover:text-white hover:border-[#0077C8] hover:-translate-y-0.5 active:scale-95';

  if (!enabled) {
    return (
      <span
        title={pendingLabel}
        aria-disabled="true"
        className={`${base} ${toneClasses} opacity-40 cursor-not-allowed`}
      >
        <Icon className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{label}</span>
      </span>
    );
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} title={label} className={`${base} ${toneClasses} ${hover} cursor-pointer`}>
        <Icon className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{label}</span>
      </button>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      className={`${base} ${toneClasses} ${hover}`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
}

function ContactRow({ person, role, tone, centered }) {
  const { t } = useLanguage();
  const a = t.authorities;
  const [firstName, ...rest] = person.name.split(' ');
  const saveContact = () =>
    downloadVCard({
      firstName,
      lastName: rest.join(' '),
      fullName: person.name,
      title: role,
      org: 'Instituto Centroamericano de Administración Pública (ICAP)',
      cellPhone: person.whatsapp,
      phone: person.whatsapp,
      email: person.email,
      url: 'https://icap.ac.cr',
      address: 'San José, Costa Rica',
      notes: role
    });

  return (
    <div className={`flex flex-wrap gap-2 ${centered ? 'justify-center' : 'justify-center sm:justify-start'}`}>
      <ContactChip
        href={person.linkedin}
        icon={LinkedinIcon}
        label={a.linkedin}
        pendingLabel={`${a.linkedin} · ${a.pending}`}
        tone={tone}
      />
      <ContactChip
        href={
          person.whatsapp
            ? `https://wa.me/${whatsappDigits(person.whatsapp)}?text=${encodeURIComponent(a.whatsappMessage(person.name))}`
            : ''
        }
        icon={WhatsAppIcon}
        label={a.whatsapp}
        pendingLabel={`${a.whatsapp} · ${a.pending}`}
        tone={tone}
      />
      <ContactChip
        href={person.email ? `mailto:${person.email}` : ''}
        icon={Mail}
        label={a.email}
        pendingLabel={`${a.email} · ${a.pending}`}
        tone={tone}
      />
      <ContactChip onClick={saveContact} icon={UserPlus} label={a.saveContact} tone={tone} />
    </div>
  );
}

function FlipButton({ onClick, icon: Icon, label, tone }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 text-[11px] sm:text-xs font-heading font-bold uppercase tracking-wider transition-colors group cursor-pointer ${
        tone === 'dark'
          ? 'text-[#9FC6E8] hover:text-white'
          : 'text-[#0077C8] hover:text-[#005A96] dark:text-[#9FC6E8] dark:hover:text-white'
      }`}
    >
      <Icon className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
      {label}
    </button>
  );
}

/** Mismo volteo 3D que las fichas de Misión/Visión (ver MissionVision.jsx). */
function FlipCard({ flipped, hint, front, back }) {
  return (
    <div className="relative h-full" style={{ perspective: '1800px' }}>
      <div
        className={`relative w-full h-full grid ${hint ? 'animate-flip-hint' : ''}`}
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.85s cubic-bezier(0.4, 0.12, 0.16, 1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        <div
          inert={flipped}
          style={{ gridArea: '1 / 1', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          {front}
        </div>
        <div
          inert={!flipped}
          style={{
            gridArea: '1 / 1',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          {back}
        </div>
      </div>
    </div>
  );
}

/** Reverso: la frase de la persona (o el aviso de pendiente). */
function QuoteBack({ person, role, onFlip, large = false }) {
  const { lang, t } = useLanguage();
  const quote = person.quote[lang] || person.quote.es;
  return (
    <article className="relative h-full rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#003366] via-[#0B5A96] to-[#0077C8] dark:from-[#00264D] dark:via-[#003366] dark:to-[#0B5A96] mv-card-dark p-6 sm:p-8 flex flex-col text-white">
      <EscudoICAP
        tono="white" plano
        className="pointer-events-none absolute -right-10 -bottom-10 w-48 opacity-[0.07]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute -top-16 -left-10 w-56 h-56 rounded-full bg-[#4FB2F2]/25 blur-3xl animate-aurora" />

      <div className="relative flex-1 flex flex-col items-center justify-center text-center gap-4 py-2">
        <Quote className="w-9 h-9 sm:w-10 sm:h-10 text-[#7dd3fc] fill-[#7dd3fc]/20" strokeWidth={1.6} />
        {quote ? (
          <p
            className={`font-heading font-semibold leading-relaxed text-white ${
              large ? 'text-base sm:text-xl max-w-xl' : 'text-sm sm:text-base'
            }`}
          >
            “{quote}”
          </p>
        ) : (
          <p className="text-xs sm:text-sm italic text-[#C9D9E8] max-w-xs leading-relaxed">
            {t.authorities.quotePending}
          </p>
        )}
        <div className="flex flex-col items-center gap-0.5">
          <span className="w-8 h-0.5 rounded-full bg-[#7dd3fc]/70 mb-1.5" />
          <span className="font-heading font-bold text-sm">{person.name}</span>
          <span className="text-[11px] text-[#9FC6E8]">{role}</span>
        </div>
      </div>

      <div className="relative pt-4 flex justify-center">
        <FlipButton onClick={onFlip} icon={RotateCcw} label={t.authorities.flipBack} tone="dark" />
      </div>
    </article>
  );
}

/** Ficha grande de la Dirección General (frente navy, como Investigación). */
function DirectorFront({ person, role, tag, onFlip }) {
  const { t } = useLanguage();
  const TagIcon = DEPT_ICONS.director;
  return (
    <article className="relative h-full rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#001F3D] via-[#003366] to-[#0B5A96] dark:from-[#00172E] dark:via-[#00264D] dark:to-[#003366] mv-card-dark p-6 sm:p-8 text-white">
      <EscudoICAP
        tono="white" plano
        className="pointer-events-none absolute -right-12 -top-10 w-60 sm:w-72 opacity-[0.06]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -left-16 w-64 h-64 rounded-full bg-[#0077C8]/30 blur-3xl animate-aurora" />

      <div className="relative flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
        <Portrait person={person} size="lg" onDark />

        <div className="flex-1 min-w-0 flex flex-col items-center sm:items-start text-center sm:text-left gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-[#4FB2F2]/40 text-[10px] sm:text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#9FC6E8]">
            <TagIcon className="w-3 h-3" />
            {tag}
          </span>
          <div>
            <h3 className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight leading-tight">{person.name}</h3>
            <p className="text-sm sm:text-base text-[#9FC6E8] font-semibold mt-0.5">{role}</p>
          </div>
          <ContactRow person={person} role={role} tone="dark" />
          <div className="pt-1">
            <FlipButton onClick={onFlip} icon={RotateCw} label={t.authorities.flipFront} tone="dark" />
          </div>
        </div>
      </div>
    </article>
  );
}

/** Ficha clara de la dirección de cada departamento. */
function DeptFront({ deptKey, person, role, tag, isCurrent, onFlip }) {
  const { t } = useLanguage();
  const TagIcon = DEPT_ICONS[deptKey];
  return (
    <article
      className={`relative h-full rounded-[2rem] overflow-hidden bg-white dark:bg-[#0A2A4A] mv-card-light dark:shadow-none p-7 sm:p-8 flex flex-col items-center text-center gap-5 border ${
        isCurrent ? 'border-[#4FB2F2]/70 dark:border-[#4FB2F2]/60' : 'border-white dark:border-white/10'
      }`}
    >
      <EscudoICAP
        tono="navy" plano
        className="pointer-events-none absolute -right-8 -bottom-8 w-44 opacity-[0.05] dark:invert"
      />
      {/* Franja superior en degradé: identidad de "ficha" institucional */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#003366] via-[#0077C8] to-[#4FB2F2]" />

      <div className="relative flex items-center gap-2 flex-wrap justify-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0077C8]/10 dark:bg-white/10 border border-[#0077C8]/20 dark:border-white/15 text-[10px] sm:text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#0077C8] dark:text-[#9FC6E8]">
          <TagIcon className="w-3 h-3" />
          {tag}
        </span>
        {isCurrent && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0077C8] text-white text-[9px] sm:text-[10px] font-mono-code font-bold uppercase tracking-wider shadow">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7dd3fc] animate-ping" />
            {t.authorities.currentDept}
          </span>
        )}
      </div>

      <Portrait person={person} />

      <div className="relative">
        <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#003366] dark:text-white tracking-tight">
          {person.name}
        </h3>
        <p className="text-sm sm:text-base text-slate-600 dark:text-[#9FC6E8] font-semibold mt-0.5">{role}</p>
      </div>

      <div className="relative mt-auto flex flex-col items-center gap-4">
        <ContactRow person={person} role={role} tone="light" centered />
        <FlipButton onClick={onFlip} icon={RotateCw} label={t.authorities.flipFront} tone="light" />
      </div>
    </article>
  );
}

/** Tramo del organigrama con su chispa de luz viajando adentro. */
function ConnectorLine({ axis, delay, className = '', reverse = false }) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden bg-[#0077C8]/25 dark:bg-[#4FB2F2]/25 rounded-full ${className}`}
      style={reverse ? { transform: 'scaleX(-1)' } : undefined}
    >
      <span
        className={`absolute ${
          axis === 'y'
            ? 'inset-x-0 top-0 h-[60%] authority-pulse-y bg-[linear-gradient(180deg,transparent,#4FB2F2,#bfe6ff,transparent)]'
            : 'inset-y-0 left-0 w-[60%] authority-pulse-x bg-[linear-gradient(90deg,transparent,#4FB2F2,#bfe6ff,transparent)]'
        }`}
        style={{ animationDelay: delay }}
      />
    </div>
  );
}

// Sección compartida entre los dos departamentos (ver Brochure.jsx): el
// kicker lleva el estilo del departamento activo ("glow" en AT, "dot" en
// Docencia) y la ficha de su dirección se marca como "Departamento
// actual" (en móvil, además, pasa a ser la primera).
export default function AuthoritiesSection({ dept = 'at' }) {
  const { t } = useLanguage();
  const a = t.authorities;
  const sectionRef = useRef(null);

  const [flipped, setFlipped] = useState({ director: false, at: false, docencia: false });
  const [hint, setHint] = useState({ director: false, at: false, docencia: false });
  // Espejo en ref para que los timeouts del observer (que corre una
  // sola vez) no asomen una ficha que el usuario ya volteó a mano.
  const flippedRef = useRef(flipped);

  const toggle = (key) => {
    setFlipped((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      flippedRef.current = next;
      return next;
    });
  };

  // Asomo de las tres fichas al entrar a la vista, las tres a la vez. Se
  // usa el window del ownerDocument (como en MissionVision) para que
  // funcione también dentro del iframe de "Vista Móvil".
  useEffect(() => {
    const el = sectionRef.current;
    const IO = el?.ownerDocument?.defaultView?.IntersectionObserver;
    if (!IO) return undefined;
    const timeouts = [];
    const HINT_MS = 1200;
    const observer = new IO(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        const keys = ['director', 'at', 'docencia'];
        const pick = (value) => Object.fromEntries(keys.map((key) => [key, value && !flippedRef.current[key]]));
        timeouts.push(
          setTimeout(() => {
            setHint(pick(true));
            timeouts.push(setTimeout(() => setHint(pick(false)), HINT_MS));
          }, 900)
        );
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      timeouts.forEach(clearTimeout);
    };
  }, []);

  const deptCard = (key) => {
    const person = AUTHORITIES[key];
    const role = a.roles[key];
    const isCurrent = dept === key;
    return (
      <div
        key={key}
        className={`relative animate-authority-rise ${isCurrent ? 'order-first sm:order-none' : ''}`}
      >
        {isCurrent && (
          <div aria-hidden="true" className="absolute -inset-2 rounded-[2.4rem] bg-[#4FB2F2]/25 blur-xl animate-pulse-slow" />
        )}
        <FlipCard
          flipped={flipped[key]}
          hint={hint[key]}
          front={
            <DeptFront
              deptKey={key}
              person={person}
              role={role}
              tag={a.tags[key]}
              isCurrent={isCurrent}
              onFlip={() => toggle(key)}
            />
          }
          back={<QuoteBack person={person} role={role} onFlip={() => toggle(key)} />}
        />
      </div>
    );
  };

  return (
    <section
      ref={sectionRef}
      className="px-4 sm:px-6 pt-[var(--docencia-gap)] pb-12 sm:pb-20 bg-[#D6E9F7] dark:bg-[#001F3D] relative overflow-hidden"
    >
      {/* Resplandores ambientales de fondo */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#0077C8]/[0.08] blur-3xl animate-glow-drift" />
      <div aria-hidden="true" className="pointer-events-none absolute top-1/2 -right-24 w-96 h-96 rounded-full bg-[#003366]/[0.06] dark:bg-[#0077C8]/[0.1] blur-3xl" />

      <div className="relative max-w-5xl mx-auto">
        <div className="mb-8 sm:mb-10 text-center">
          <div className="mb-1.5 sm:mb-2 flex justify-center">
            <KickerBadge variant={dept === 'docencia' ? 'dot' : 'glow'}>{a.kicker}</KickerBadge>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#003366] dark:text-[#9FC6E8] tracking-tight">
            {a.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1.5 max-w-xl mx-auto leading-relaxed">
            {a.subtitle}
          </p>
        </div>

        {/* Dirección General — se queda en el ancho de antes (4xl)
            mientras las dos fichas de abajo ocupan el contenedor más
            ancho (5xl), para que crezcan sin agrandar también ésta. */}
        <div className="max-w-4xl mx-auto animate-authority-rise">
          <FlipCard
            flipped={flipped.director}
            hint={hint.director}
            front={
              <DirectorFront
                person={AUTHORITIES.director}
                role={a.roles.director}
                tag={a.tags.director}
                onFlip={() => toggle('director')}
              />
            }
            back={
              <QuoteBack
                person={AUTHORITIES.director}
                role={a.roles.director}
                onFlip={() => toggle('director')}
                large
              />
            }
          />
        </div>

        {/* Organigrama: en móvil sólo el tallo (las fichas van apiladas);
            desde sm el árbol completo que se abre hacia las dos columnas.
            El centro de cada columna de abajo cae en 25% / 75% del ancho
            corrido gap/4 hacia adentro (gap sm:gap-6 = 1.5rem → 0.375rem),
            así que los brazos y las bajadas llegan justo ahí. */}
        <div className="relative h-8 sm:h-14">
          <ConnectorLine axis="y" delay={CONNECTOR_DELAYS.stem} className="absolute left-1/2 -translate-x-1/2 top-0 w-[3px] h-full sm:h-1/2" />
          <div className="hidden sm:block">
            <ConnectorLine axis="x" delay={CONNECTOR_DELAYS.arms} reverse className="absolute top-1/2 left-[calc(25%+0.375rem)] w-[calc(25%-0.375rem)] h-[3px]" />
            <ConnectorLine axis="x" delay={CONNECTOR_DELAYS.arms} className="absolute top-1/2 left-1/2 w-[calc(25%-0.375rem)] h-[3px]" />
            <ConnectorLine axis="y" delay={CONNECTOR_DELAYS.drops} className="absolute top-1/2 left-[calc(25%+0.375rem)] -translate-x-1/2 w-[3px] h-1/2" />
            <ConnectorLine axis="y" delay={CONNECTOR_DELAYS.drops} className="absolute top-1/2 left-[calc(75%-0.375rem)] -translate-x-1/2 w-[3px] h-1/2" />
          </div>
          {/* Nodo donde se reparte el pulso */}
          <span aria-hidden="true" className="hidden sm:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#0077C8] dark:bg-[#4FB2F2] ring-4 ring-[#D6E9F7] dark:ring-[#001F3D]" />
        </div>

        {/* Direcciones de departamento */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-6">
          {deptCard('at')}
          {deptCard('docencia')}
        </div>
      </div>
    </section>
  );
}
