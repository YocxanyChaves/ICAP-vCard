import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Shield, Star, Users, Heart, Award, Sparkles } from 'lucide-react';
import icapLogoMark from '../../assets/icap-logo-mark.png';

const VALUES = [
  {
    id: 'integridad',
    name: 'Integridad',
    icon: Shield,
    description: 'Actuamos con ética, honestidad y apego irrestricto a los principios del servicio público y la transparencia.'
  },
  {
    id: 'excelencia',
    name: 'Excelencia',
    icon: Star,
    description: 'Buscamos los más altos estándares de calidad técnica, rigor académico e innovación en cada proyecto regional.'
  },
  {
    id: 'equipo',
    name: 'Trabajo en equipo',
    icon: Users,
    description: 'Fomentamos la colaboración multidisciplinaria e interinstitucional para alcanzar metas regionales conjuntas.'
  },
  {
    id: 'compromiso',
    name: 'Compromiso',
    icon: Heart,
    description: 'Dedicación total con el desarrollo, bienestar e integración de los pueblos centroamericanos.'
  },
  {
    id: 'respeto',
    name: 'Respeto',
    icon: Award,
    description: 'Reconocemos y valoramos la diversidad cultural, institucional y humana de nuestra región.'
  },
  {
    id: 'transparencia',
    name: 'Transparencia',
    icon: Sparkles,
    description: 'Rendición de cuentas clara, acceso a la información y gestión abierta hacia la ciudadanía y socios.'
  }
];

const N = VALUES.length;
const ATTRACT_MS = 850;
const HOLD_MS = 1900;
const RELEASE_MS = 750;
const GAP_MS = 350;

const STARS = Array.from({ length: 26 }, (_, i) => {
  const seed = i * 137.5;
  return {
    top: (Math.sin(seed) * 0.5 + 0.5) * 100,
    left: (Math.cos(seed * 1.7) * 0.5 + 0.5) * 100,
    size: 1 + ((i * 7) % 3),
    delay: (i % 6) * 0.4
  };
});

export default function ValuesWheel() {
  const containerRef = useRef(null);
  const [size, setSize] = useState(280);
  const [rotation, setRotation] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [phase, setPhase] = useState('orbit'); // 'orbit' | 'attract' | 'hold' | 'release'
  const [pulse, setPulse] = useState(false);
  const timeoutsRef = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        if (w > 0) setSize(w);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let last = performance.now();
    const tick = (now) => {
      const dt = now - last;
      last = now;
      setRotation((r) => r + dt * 0.012);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const clearTimers = useCallback(() => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
  }, []);

  const runCycle = useCallback(
    (startIndex) => {
      clearTimers();
      let idx = startIndex;

      const step = () => {
        setActiveIndex(idx);
        setPhase('attract');

        const t1 = setTimeout(() => {
          setPhase('hold');
          setPulse(true);
          const t2 = setTimeout(() => setPulse(false), 380);
          timeoutsRef.current.push(t2);

          const t3 = setTimeout(() => {
            setPhase('release');

            const t4 = setTimeout(() => {
              setPhase('orbit');

              const t5 = setTimeout(() => {
                idx = (idx + 1) % N;
                step();
              }, GAP_MS);
              timeoutsRef.current.push(t5);
            }, RELEASE_MS);
            timeoutsRef.current.push(t4);
          }, HOLD_MS);
          timeoutsRef.current.push(t3);
        }, ATTRACT_MS);
        timeoutsRef.current.push(t1);
      };

      step();
    },
    [clearTimers]
  );

  useEffect(() => {
    runCycle(0);
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activate = (index) => {
    runCycle(index);
  };

  const radius = size * 0.35;
  const planetR = size < 320 ? 18 : 26;
  const current = VALUES[activeIndex];
  const attracted = phase === 'attract' || phase === 'hold';
  const centerX = size / 2;
  const centerY = size / 2;
  const activeAngle = (activeIndex / N) * 2 * Math.PI + (rotation * Math.PI) / 180;
  const tetherX = centerX + Math.cos(activeAngle) * radius;
  const tetherY = centerY + Math.sin(activeAngle) * radius;

  return (
    <section className="px-4 sm:px-6 py-14 sm:py-24 bg-[#001F3D] text-white relative overflow-hidden">
      {/* Starfield */}
      <div className="absolute inset-0 pointer-events-none">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white/70 animate-pulse"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animationDelay: `${s.delay}s`,
              animationDuration: '3.5s'
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative">
        {/* Header */}
        <span className="text-[11px] sm:text-xs font-bold tracking-widest uppercase text-[#0077C8] block mb-1.5 font-mono-code">
          Nuestra cultura
        </span>
        <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-white tracking-tight mb-2.5">
          Valores Institucionales
        </h2>
        <p className="text-xs sm:text-sm text-[#9FC6E8] max-w-md mb-8 sm:mb-12 leading-relaxed">
          Una pequeña galaxia de principios que orbitan el propósito del ICAP: toque cualquier valor para atraerlo al centro.
        </p>

        {/* Mobile Quick Selector Chips */}
        <div className="flex sm:hidden items-center gap-1.5 overflow-x-auto w-full pb-3 mb-4 scrollbar-none px-1">
          {VALUES.map((v, i) => {
            const isSelected = activeIndex === i;
            return (
              <button
                key={v.id}
                onClick={() => activate(i)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-heading font-bold shrink-0 transition-all ${
                  isSelected
                    ? 'bg-[#0077C8] text-white shadow-md'
                    : 'bg-[#003366] text-slate-300 border border-white/10'
                }`}
              >
                <span>{v.name}</span>
              </button>
            );
          })}
        </div>

        {/* Orbital Galaxy */}
        <div ref={containerRef} className="relative w-[280px] h-[280px] sm:w-96 sm:h-96 my-2 sm:my-4">
          {/* Dashed orbit guide */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${size} ${size}`}>
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1.5"
              strokeDasharray="4 8"
              fill="none"
            />
            {attracted && (
              <line
                x1={centerX}
                y1={centerY}
                x2={tetherX}
                y2={tetherY}
                stroke="#0077C8"
                strokeWidth="1.5"
                strokeDasharray="3 5"
                opacity="0.85"
              />
            )}
          </svg>

          {/* Central Logo Node */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
            style={{ width: size < 320 ? 64 : 96, height: size < 320 ? 64 : 96 }}
          >
            <div
              className="absolute inset-[-14px] rounded-full bg-[#0077C8] blur-xl transition-opacity duration-300"
              style={{ opacity: pulse ? 0.55 : 0.18 }}
            />
            <div
              className="relative w-full h-full rounded-full bg-white shadow-xl flex items-center justify-center p-2 transition-transform duration-300 ring-4 ring-[#0077C8]/30"
              style={{ transform: pulse ? 'scale(1.08)' : 'scale(1)' }}
            >
              <img
                src={icapLogoMark}
                alt="Isotipo ICAP"
                className="w-[70%] h-[70%] object-contain"
                draggable={false}
              />
            </div>
          </div>

          {/* Orbiting / Attracted Value Nodes */}
          {VALUES.map((v, i) => {
            const Icon = v.icon;
            const isActive = activeIndex === i;
            const angle = (i / N) * 2 * Math.PI + (rotation * Math.PI) / 180;
            const orbitX = centerX + Math.cos(angle) * radius;
            const orbitY = centerY + Math.sin(angle) * radius;
            const isFlyingToCenter = isActive && attracted;
            const x = isFlyingToCenter ? centerX : orbitX;
            const y = isFlyingToCenter ? centerY : orbitY;

            return (
              <button
                key={v.id}
                onClick={() => activate(i)}
                className="absolute flex flex-col items-center gap-1 focus:outline-none z-20"
                style={{
                  left: x,
                  top: y,
                  transform: 'translate(-50%, -50%)',
                  transition: isActive
                    ? 'left 0.85s cubic-bezier(0.34, 1.2, 0.4, 1), top 0.85s cubic-bezier(0.34, 1.2, 0.4, 1)'
                    : 'none'
                }}
              >
                <div
                  className={`rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
                    isActive
                      ? 'bg-[#0077C8] text-white shadow-lg shadow-[#0077C8]/40 border-2 border-white'
                      : 'bg-[#003366] text-[#0077C8] border border-white/20'
                  }`}
                  style={{
                    width: isFlyingToCenter ? planetR * 1.55 : planetR * 1.3,
                    height: isFlyingToCenter ? planetR * 1.55 : planetR * 1.3
                  }}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span
                  className="text-[10px] sm:text-xs font-semibold leading-tight text-[#EAF3FB] whitespace-nowrap transition-opacity duration-200"
                  style={{ opacity: isFlyingToCenter ? 0 : 1 }}
                >
                  {v.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Value Detail Card */}
        <div
          key={current.id}
          className="animate-page-in mt-6 sm:mt-8 max-w-md w-full bg-[#003366]/90 border border-white/15 rounded-3xl p-5 sm:p-6 backdrop-blur-sm shadow-xl text-left"
        >
          <div className="flex items-center gap-3 mb-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0077C8]/20 border border-[#0077C8]/40 flex items-center justify-center text-[#0077C8]">
              {React.createElement(current.icon, { className: 'w-4 h-4' })}
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] font-mono-code text-[#9FC6E8] uppercase tracking-wider block">
                Pilar Institucional
              </span>
              <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                {current.name}
              </h3>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-[#C9D9E8] leading-relaxed">
            {current.description}
          </p>
        </div>

        <p className="text-[10px] sm:text-[11px] text-[#6E8AA8] mt-4 max-w-xs">
          Toca cualquier valor para atraerlo al centro, o dejá que la galaxia gire sola.
        </p>
      </div>
    </section>
  );
}
