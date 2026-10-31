import { useEffect, useRef, useState } from 'react';
import { Mail, UserPlus, Quote, RotateCw, RotateCcw, Crown, MapPin, Landmark } from 'lucide-react';
import { LinkedinIcon, WhatsAppIcon } from '../components/Icons';
import { downloadVCard, whatsappDigits } from '../components/VCardDownload';
import { useLanguage } from '../i18n/LanguageContext';
import KickerBadge from '../components/KickerBadge';
import EscudoICAP from '../components/EscudoICAP';

/**
 * Autoridades del ICAP: una sola ficha de vitrina para la Dirección
 * General. Reúne piezas del resto del sitio: el volteo 3D de
 * Misión/Visión, el bloque navy con escudo, el anillo de luz del logo de
 * Valores (girando alrededor del retrato) y los botones de Contacto, más
 * un marco de luz que recorre el borde de la ficha (.authority-frame).
 *
 * DATOS: mientras `photo` esté vacío se muestran las iniciales; los
 * botones sin dato salen deshabilitados ("Dato pendiente"); el reverso
 * muestra un aviso hasta que `quote` tenga texto. Para completarlo basta
 * llenar los campos de abajo (`photo` es un import de src/assets).
 */
const DIRECTOR = {
  name: 'Edgar Balsells',
  initials: 'EB',
  photo: null,
  linkedin: 'https://www.linkedin.com/in/edgar-balsells-8a448b27',
  // Teléfono y correo: en espera de confirmar si se publican.
  whatsapp: '',
  email: '',
  quote: { es: '', en: '' }
};

/**
 * Retrato circular grande con el anillo de luz girando, una órbita
 * punteada más lenta por fuera y la corona de la Dirección General como
 * sello en la esquina. Si todavía no hay foto, iniciales sobre un degradé
 * institucional.
 */
function Portrait({ person }) {
  return (
    <div className="relative shrink-0 w-36 h-36 sm:w-44 sm:h-44">
      {/* Halo suave detrás del retrato */}
      <div aria-hidden="true" className="absolute -inset-5 rounded-full bg-[#4FB2F2]/30 blur-2xl animate-pulse-slow" />
      {/* Órbita punteada */}
      <div
        aria-hidden="true"
        className="absolute -inset-4 sm:-inset-5 rounded-full border border-dashed border-white/25"
        style={{ animation: 'orbitSpin 22s linear infinite' }}
      />
      <div aria-hidden="true" className="absolute -inset-[6px] rounded-full authority-ring" />
      <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center ring-4 ring-white/15 bg-[radial-gradient(circle_at_32%_26%,#4FB2F2_0%,#0077C8_52%,#003366_100%)] shadow-2xl shadow-black/40">
        {person.photo ? (
          <img src={person.photo} alt={person.name} className="w-full h-full object-cover" draggable={false} />
        ) : (
          <span className="font-heading font-extrabold text-white tracking-wide drop-shadow text-5xl sm:text-6xl">
            {person.initials}
          </span>
        )}
      </div>
      {/* Sello de la Dirección General */}
      <span
        aria-hidden="true"
        className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#bfe6ff] via-[#4FB2F2] to-[#0077C8] text-[#003366] flex items-center justify-center ring-4 ring-[#003366] shadow-lg"
      >
        <Crown className="w-5 h-5" strokeWidth={2.2} />
      </span>
    </div>
  );
}

/**
 * Botón de contacto: link real si el dato existe; si no, la misma
 * píldora apagada con el aviso "Dato pendiente", para que el diseño se
 * vea completo mientras se recopilan los datos.
 */
function ContactChip({ href, onClick, icon: Icon, label, pendingLabel }) {
  const enabled = Boolean(href || onClick);
  const base =
    'inline-flex items-center justify-center gap-1.5 h-10 px-3.5 rounded-xl text-[11px] sm:text-xs font-heading font-bold tracking-wide border transition-all bg-white/10 border-white/15 text-white';
  const hover = 'hover:bg-white/20 hover:border-white/30 hover:-translate-y-0.5 active:scale-95';

  if (!enabled) {
    return (
      <span title={pendingLabel} aria-disabled="true" className={`${base} opacity-40 cursor-not-allowed`}>
        <Icon className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{label}</span>
      </span>
    );
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} title={label} className={`${base} ${hover} cursor-pointer`}>
        <Icon className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{label}</span>
      </button>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" title={label} className={`${base} ${hover}`}>
      <Icon className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
}

function ContactRow({ person, role }) {
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
    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
      <ContactChip href={person.linkedin} icon={LinkedinIcon} label={a.linkedin} pendingLabel={`${a.linkedin} · ${a.pending}`} />
      <ContactChip
        href={
          person.whatsapp
            ? `https://wa.me/${whatsappDigits(person.whatsapp)}?text=${encodeURIComponent(a.whatsappMessage(person.name))}`
            : ''
        }
        icon={WhatsAppIcon}
        label={a.whatsapp}
        pendingLabel={`${a.whatsapp} · ${a.pending}`}
      />
      <ContactChip
        href={person.email ? `mailto:${person.email}` : ''}
        icon={Mail}
        label={a.email}
        pendingLabel={`${a.email} · ${a.pending}`}
      />
      <ContactChip onClick={saveContact} icon={UserPlus} label={a.saveContact} />
    </div>
  );
}

function FlipButton({ onClick, icon: Icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-heading font-bold uppercase tracking-wider transition-colors group cursor-pointer text-[#9FC6E8] hover:text-white"
    >
      <Icon className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
      {label}
    </button>
  );
}

/** Mismo volteo 3D que las fichas de Misión/Visión (ver MissionVision.jsx). */
function FlipCard({ flipped, hint, front, back }) {
  return (
    <div className="relative h-full" style={{ perspective: '2000px' }}>
      <div
        className={`relative w-full h-full grid ${hint ? 'animate-flip-hint' : ''}`}
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.85s cubic-bezier(0.4, 0.12, 0.16, 1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        <div inert={flipped} style={{ gridArea: '1 / 1', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
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

/**
 * Marco de la ficha: un borde de 2px con una luz celeste que lo recorre
 * sin parar (un conic-gradient girando detrás, recortado por la ficha),
 * sobre el bloque navy con escudo, auroras y una trama de puntos.
 */
function FramedCard({ children, className = '' }) {
  return (
    <article className="relative h-full rounded-[2.25rem] p-[2px] overflow-hidden mv-card-dark">
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-[2.25rem]">
        <div className="authority-frame" />
      </div>
      <div
        className={`relative h-full rounded-[calc(2.25rem-2px)] overflow-hidden bg-gradient-to-br from-[#001F3D] via-[#003366] to-[#0B5A96] dark:from-[#00172E] dark:via-[#00264D] dark:to-[#003366] text-white ${className}`}
      >
        {/* Trama de puntos que se desvanece hacia abajo */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.16] [mask-image:linear-gradient(180deg,#000,transparent_75%)]"
          style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)', backgroundSize: '18px 18px' }}
        />
        <EscudoICAP tono="white" plano className="pointer-events-none absolute -right-14 -bottom-16 w-72 sm:w-96 opacity-[0.07]" />
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 -left-20 w-80 h-80 rounded-full bg-[#0077C8]/35 blur-3xl animate-aurora" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 right-1/4 w-72 h-72 rounded-full bg-[#4FB2F2]/20 blur-3xl animate-glow-drift" />
        {/* Destello que cruza la ficha de vez en cuando */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="authority-sheen" />
        </div>
        <div className="relative h-full">{children}</div>
      </div>
    </article>
  );
}

/** Frente: retrato, nombre, cargo, sello institucional y contacto. */
function DirectorFront({ person, role, tag, onFlip }) {
  const { t } = useLanguage();
  const a = t.authorities;
  return (
    <FramedCard className="p-7 sm:p-10">
      <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-12">
        <Portrait person={person} />

        <div className="flex-1 min-w-0 flex flex-col items-center sm:items-start text-center sm:text-left gap-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 border border-[#4FB2F2]/40 text-[10px] sm:text-[11px] font-mono-code font-bold uppercase tracking-[0.18em] text-[#bfe6ff] shadow-[0_0_18px_-4px_rgba(79,178,242,0.6)]">
            <Crown className="w-3 h-3" />
            {tag}
          </span>

          <div>
            <h3 className="font-heading font-extrabold text-[2.1rem] sm:text-5xl tracking-tight leading-[1.05] bg-gradient-to-r from-white via-white to-[#9FD5FA] bg-clip-text text-transparent drop-shadow-sm">
              {person.name}
            </h3>
            <p className="text-sm sm:text-lg text-[#9FC6E8] font-semibold mt-1.5">{role}</p>
          </div>

          {/* Línea de luz bajo el nombre */}
          <span aria-hidden="true" className="h-[3px] w-24 sm:w-32 rounded-full bg-gradient-to-r from-[#4FB2F2] via-[#bfe6ff] to-transparent" />

          {/* Sello institucional */}
          <div className="flex flex-col gap-1.5 text-[11px] sm:text-xs text-[#C9D9E8]">
            <span className="inline-flex items-center justify-center sm:justify-start gap-2">
              <Landmark className="w-3.5 h-3.5 text-[#7dd3fc] shrink-0" />
              {a.institution}
            </span>
            <span className="inline-flex items-center justify-center sm:justify-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#7dd3fc] shrink-0" />
              {a.location}
            </span>
          </div>

          <ContactRow person={person} role={role} />

          <div className="pt-1">
            <FlipButton onClick={onFlip} icon={RotateCw} label={a.flipFront} />
          </div>
        </div>
      </div>
    </FramedCard>
  );
}

/** Reverso: la frase de la persona (o el aviso de pendiente). */
function QuoteBack({ person, role, onFlip }) {
  const { lang, t } = useLanguage();
  const quote = person.quote[lang] || person.quote.es;
  return (
    <FramedCard className="p-7 sm:p-10 flex flex-col">
      <div className="h-full flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-5 py-4">
          <Quote className="w-11 h-11 sm:w-12 sm:h-12 text-[#7dd3fc] fill-[#7dd3fc]/20" strokeWidth={1.6} />
          {quote ? (
            <p className="font-heading font-semibold leading-relaxed text-white text-base sm:text-2xl max-w-2xl">
              “{quote}”
            </p>
          ) : (
            <p className="text-xs sm:text-sm italic text-[#C9D9E8] max-w-xs leading-relaxed">{t.authorities.quotePending}</p>
          )}
          <div className="flex flex-col items-center gap-0.5">
            <span className="w-10 h-0.5 rounded-full bg-[#7dd3fc]/70 mb-2" />
            <span className="font-heading font-bold text-base">{person.name}</span>
            <span className="text-xs text-[#9FC6E8]">{role}</span>
          </div>
        </div>
        <div className="pt-4 flex justify-center">
          <FlipButton onClick={onFlip} icon={RotateCcw} label={t.authorities.flipBack} />
        </div>
      </div>
    </FramedCard>
  );
}

// Sección compartida entre los dos departamentos (ver Brochure.jsx): el
// kicker lleva el estilo del departamento activo ("glow" en AT, "dot" en
// Docencia).
export default function AuthoritiesSection({ dept = 'at' }) {
  const { t } = useLanguage();
  const a = t.authorities;
  const sectionRef = useRef(null);

  const [flipped, setFlipped] = useState(false);
  const [hint, setHint] = useState(false);
  // Espejo en ref para que el timeout del observer (que corre una sola
  // vez) no asome la ficha si el usuario ya la volteó a mano.
  const flippedRef = useRef(false);

  const toggle = () => {
    flippedRef.current = !flippedRef.current;
    setFlipped(flippedRef.current);
  };

  // Asomo de la ficha al entrar a la vista. Se usa el window del
  // ownerDocument (como en MissionVision) para que funcione también
  // dentro del iframe de "Vista Móvil".
  useEffect(() => {
    const el = sectionRef.current;
    const IO = el?.ownerDocument?.defaultView?.IntersectionObserver;
    if (!IO) return undefined;
    const timeouts = [];
    const observer = new IO(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        timeouts.push(
          setTimeout(() => {
            if (flippedRef.current) return;
            setHint(true);
            timeouts.push(setTimeout(() => setHint(false), 1200));
          }, 1100)
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

  return (
    <section
      ref={sectionRef}
      className="px-4 sm:px-6 pt-[var(--docencia-gap)] pb-12 sm:pb-20 bg-[#D6E9F7] dark:bg-[#001F3D] relative overflow-hidden"
    >
      {/* Resplandores ambientales de fondo */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#0077C8]/[0.08] blur-3xl animate-glow-drift" />
      <div aria-hidden="true" className="pointer-events-none absolute top-1/2 -right-24 w-96 h-96 rounded-full bg-[#003366]/[0.06] dark:bg-[#0077C8]/[0.1] blur-3xl" />

      <div className="relative max-w-4xl mx-auto">
        <div className="mb-8 sm:mb-12 text-center">
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

        <div className="relative animate-authority-rise">
          {/* Resplandor detrás de la ficha */}
          <div aria-hidden="true" className="absolute -inset-3 sm:-inset-5 rounded-[2.75rem] bg-[#4FB2F2]/25 dark:bg-[#4FB2F2]/20 blur-2xl animate-pulse-slow" />
          <FlipCard
            flipped={flipped}
            hint={hint}
            front={<DirectorFront person={DIRECTOR} role={a.roles.director} tag={a.tags.director} onFlip={toggle} />}
            back={<QuoteBack person={DIRECTOR} role={a.roles.director} onFlip={toggle} />}
          />
        </div>
      </div>
    </section>
  );
}
