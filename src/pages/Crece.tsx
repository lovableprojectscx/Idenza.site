import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import {
  ArrowRight, MessageCircle, AlertTriangle, TrendingDown,
  Clock, Eye, CheckCircle, Zap, Rocket, Crown, Search
} from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/constants';

import imgBakan       from '@/assets/bakan-preview.png';
import imgGerencia    from '@/assets/gerencia-preview-new.png';
import imgWinner      from '@/assets/winner-preview.png';
import imgBakanMob    from '@/assets/bakan-mobile.png';
import imgAuthority   from '@/assets/idenza-authority.png';
import logoGerencia   from '@/assets/logo-gerencia-transparent-v3.png';
import logoWinner     from '@/assets/logo-winner-transparent-v3.png';
import logoBakan      from '@/assets/logo-bakan-transparent-v3.png';
import logoSkilljab   from '@/assets/logo-skilljab-transparent-v3.png';
import logoCeafg      from '@/assets/logo-ceafg-transparent-v3.png';

/* ── helpers ────────────────────────────────────────────────────────────── */
const DotGrid = ({ className = '' }: { className?: string }) => (
  <div className={`absolute pointer-events-none ${className}`}
    style={{ backgroundImage: 'radial-gradient(circle,rgba(255,255,255,0.05) 1px,transparent 1px)', backgroundSize: '28px 28px' }} />
);

const F = ({ children, delay = 0, y = 24, className = '' }: {
  children: React.ReactNode; delay?: number; y?: number; className?: string;
}) => (
  <motion.div initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.65, delay, ease: 'easeOut' }}
    className={className}>
    {children}
  </motion.div>
);

// Número animado
const Counter = ({ to, suffix = '' }: { to: number; suffix?: string }) => {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = to / 40;
    const t = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(t); } else setVal(Math.floor(start));
    }, 30);
    return () => clearInterval(t);
  }, [inView, to]);
  return <span ref={ref}>{val}{suffix}</span>;
};

const WA_AUDIT   = getWhatsAppUrl('¡Hola! Quiero que Idenza audite mi sitio web de forma gratuita.');
const WA_GENERAL = getWhatsAppUrl('¡Hola! Vi la página Crece de Idenza y quiero empezar.');

/* ═══════════════════════════════════════════════════════════════════════════ */
const Crece = () => (
  <div className="bg-[#0e0e10] text-white overflow-x-hidden" style={{ fontFamily: "'Inter',sans-serif" }}>

    {/* ── NAV ─────────────────────────────────────────────────────────── */}
    <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 sm:px-6 lg:px-12 py-3.5
                    bg-[#0e0e10]/90 backdrop-blur-xl border-b border-white/[0.06]">
      <a href="/" className="flex items-center gap-2 font-sora font-extrabold text-[15px] tracking-tight">
        <span className="w-2 h-2 rounded-full bg-[#CCFF00]" />
        Idenza
      </a>
      <div className="flex items-center gap-2 sm:gap-3">
        <a href="#proyectos" className="hidden sm:block text-white/40 text-[13px] hover:text-white/70 transition-colors">Proyectos</a>
        <a href="#planes"    className="hidden sm:block text-white/40 text-[13px] hover:text-white/70 transition-colors">Precios</a>
        <a href={WA_AUDIT} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 bg-[#CCFF00] text-[#0e0e10] font-bold
                     text-[12px] sm:text-[13px] px-3.5 sm:px-5 py-2.5 rounded-lg hover:bg-[#d4ff1a] transition-all whitespace-nowrap">
          <Search size={12} />
          <span className="hidden xs:inline sm:inline">Auditar</span>
          <span className="hidden sm:inline"> mi web</span>
        </a>
      </div>
    </nav>

    {/* ══════════════════════════════════════════════════════════════════
        1. HERO — golpe emocional inmediato
    ══════════════════════════════════════════════════════════════════ */}
    <section className="relative pt-14 min-h-screen flex items-center">
      <DotGrid className="inset-0" />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(123,44,191,0.14) 0%, transparent 65%)' }} />
      <div className="absolute top-10 right-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-[0.06]"
        style={{ background: 'radial-gradient(circle,#CCFF00 0%,transparent 70%)', filter: 'blur(90px)' }} />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Texto — ocupa toda la pantalla en móvil */}
          <div>
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 border border-red-500/30 rounded-full
                         px-3 py-1.5 text-[10px] text-red-400 font-mono tracking-wide mb-5 bg-red-500/[0.06]">
              <AlertTriangle size={10} />
              Tu web está perdiendo clientes
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.1 }}
              className="font-sora font-extrabold leading-[1.06] tracking-tight mb-5
                         text-[2.2rem] sm:text-[2.8rem] md:text-[3.2rem] lg:text-[3.8rem]">
              El 75% de tus clientes<br />te juzga por tu web<br />
              <span className="text-[#CCFF00]">antes de contactarte.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="text-white/45 text-[14px] sm:text-base leading-relaxed mb-7 max-w-md">
              Si tu sitio es lento, genérico o amateur, tu competencia ya te está ganando.
              Nosotros lo cambiamos.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}
              className="flex flex-col sm:flex-row gap-3">
              <a href={WA_AUDIT} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#CCFF00] text-[#0e0e10]
                           font-bold text-[14px] px-6 py-4 rounded-xl hover:bg-[#d4ff1a]
                           active:scale-95 hover:shadow-[0_8px_24px_rgba(204,255,0,0.2)] transition-all">
                <Search size={16} />
                Audita mi web gratis
              </a>
              <a href="#proyectos"
                className="inline-flex items-center justify-center gap-2 text-white/50 font-medium
                           text-[14px] px-6 py-4 rounded-xl border border-white/[0.08]
                           hover:bg-white/[0.04] hover:text-white/70 active:scale-95 transition-all">
                Ver proyectos
              </a>
            </motion.div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="text-white/20 text-[11px] mt-4 tracking-wide">
              Sin costo · Sin compromiso · Resultado en 24h
            </motion.p>
          </div>

          {/* Mockup — solo visible en desktop (lg+) */}
          <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="relative hidden lg:block">
            <div className="absolute -inset-4 rounded-3xl pointer-events-none"
              style={{ background: 'radial-gradient(ellipse,rgba(123,44,191,0.2) 0%,rgba(204,255,0,0.03) 60%,transparent 80%)', filter: 'blur(40px)' }} />
            <div className="relative rounded-xl overflow-hidden border border-white/[0.09]
                            shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(123,44,191,0.12)]">
              <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#1c1c20] border-b border-white/[0.07]">
                <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
                <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
                <span className="w-2 h-2 rounded-full bg-[#28c840]" />
                <div className="flex-1 mx-3 bg-white/[0.05] rounded px-3 py-1">
                  <p className="text-white/25 text-[10px] font-mono">idenza.site</p>
                </div>
              </div>
              <img src={imgBakan} alt="Proyecto Bakan" className="w-full block" />
            </div>
            <div className="absolute -bottom-4 -right-4 w-[100px] rounded-xl overflow-hidden
                            border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.7)]">
              <img src={imgBakanMob} alt="Vista móvil" className="w-full block" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>

    {/* ══════════════════════════════════════════════════════════════════
        2. DOLOR — 3 verdades que duelen
    ══════════════════════════════════════════════════════════════════ */}
    <section className="border-t border-white/[0.06] py-14 lg:py-24 bg-[#0a0a0c]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12">
        <F className="text-center mb-10 sm:mb-14">
          <p className="text-[10px] font-mono text-red-400 tracking-[0.22em] uppercase mb-4">Diagnóstico brutal</p>
          <h2 className="font-sora font-extrabold tracking-tight text-[1.6rem] sm:text-[1.9rem] lg:text-[2.5rem]">
            ¿Te identificas con alguno de estos?
          </h2>
        </F>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {[
            {
              icon: <TrendingDown size={22} />, color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.15)',
              stat: '53%', statLabel: 'de visitas perdidas',
              title: '"Mi web carga lento"',
              desc: 'El 53% de los usuarios abandona un sitio que tarda más de 3 segundos. Cada segundo de retraso vale dinero que no entra.',
            },
            {
              icon: <Eye size={22} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.15)',
              stat: '0.05s', statLabel: 'para formarse una opinión',
              title: '"Mi diseño no impresiona"',
              desc: 'En 50 milisegundos el cliente decide si eres profesional o no. Una plantilla genérica te hace ver como cualquiera.',
            },
            {
              icon: <Clock size={22} />, color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.15)',
              stat: '75%', statLabel: 'basa su confianza en el diseño',
              title: '"No genero contactos"',
              desc: 'Un sitio bonito sin estrategia de conversión es una galería. Necesitas diseño que guíe, no que adorne.',
            },
          ].map((item, i) => (
            <F key={item.title} delay={i * 0.1}>
              <div className="h-full p-5 sm:p-7 rounded-2xl border flex flex-col"
                style={{ backgroundColor: item.bg, borderColor: item.border }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 flex-shrink-0"
                  style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                  {item.icon}
                </div>
                <div className="mb-4">
                  <p className="font-sora font-black text-[2rem] leading-none" style={{ color: item.color }}>
                    {item.stat}
                  </p>
                  <p className="text-white/30 text-[11px] uppercase tracking-widest mt-1">{item.statLabel}</p>
                </div>
                <p className="font-sora font-bold text-[15px] mb-2">{item.title}</p>
                <p className="text-white/40 text-[13px] leading-relaxed flex-1">{item.desc}</p>
              </div>
            </F>
          ))}
        </div>
      </div>
    </section>

    {/* ══════════════════════════════════════════════════════════════════
        3. OFERTA AUDITORÍA — gancho de entrada
    ══════════════════════════════════════════════════════════════════ */}
    <section className="border-t border-white/[0.06] py-14 lg:py-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12">
        <F>
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a0d2e] via-[#0f0f14] to-[#0e0e10]" />
            <DotGrid className="inset-0 opacity-60" />
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20 pointer-events-none"
              style={{ background: 'radial-gradient(circle,#7B2CBF 0%,transparent 70%)', filter: 'blur(60px)' }} />
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl ring-1 ring-[#7B2CBF]/20" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center p-6 sm:p-10 md:p-14 lg:p-16">
              <div>
                <div className="inline-flex items-center gap-2 bg-[#CCFF00]/10 border border-[#CCFF00]/25
                                rounded-full px-4 py-1.5 text-[11px] text-[#CCFF00] font-mono tracking-widest mb-6">
                  <Zap size={11} />
                  Sin costo · Sin compromiso
                </div>
                <h2 className="font-sora font-extrabold leading-[1.08] tracking-tight mb-4
                               text-[1.7rem] sm:text-[2rem] md:text-[2.5rem] lg:text-[3rem]">
                  Auditamos tu web.<br />
                  <span className="text-[#CCFF00]">Te decimos exactamente<br />qué está fallando.</span>
                </h2>
                <p className="text-white/40 text-[14px] lg:text-base leading-relaxed mb-8 max-w-md">
                  Revisamos velocidad, diseño, SEO y conversión. Te entregamos un diagnóstico real en menos de 24 horas — sin costo, sin letra chica.
                </p>
                <a href={WA_AUDIT} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-[#CCFF00] text-[#0e0e10] font-bold
                             text-[15px] px-8 py-4 rounded-xl hover:bg-[#d4ff1a]
                             hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(204,255,0,0.2)] transition-all">
                  <Search size={17} />
                  Quiero mi auditoría gratis
                </a>
              </div>

              {/* Checklist visual */}
              <div className="flex flex-col gap-3">
                {[
                  'Velocidad de carga y rendimiento',
                  'Diseño y experiencia de usuario',
                  'Optimización SEO técnica',
                  'Tasa de conversión y CTAs',
                  'Adaptación móvil (responsive)',
                  'Oportunidades de mejora concretas',
                ].map((item, i) => (
                  <motion.div key={item} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.5 }}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                    <CheckCircle size={16} className="text-[#CCFF00] flex-shrink-0" />
                    <span className="text-white/70 text-[13px]">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </F>
      </div>
    </section>

    {/* ══════════════════════════════════════════════════════════════════
        4. LOGOS — prueba social
    ══════════════════════════════════════════════════════════════════ */}
    <section className="border-t border-white/[0.06] py-10 sm:py-12 bg-[#0a0a0c]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12">
        <F>
          <p className="text-center text-[9px] font-mono text-white/20 uppercase tracking-[0.35em] mb-7">
            Marcas que ya confían en Idenza
          </p>
          <div className="flex flex-wrap justify-center items-center gap-5 sm:gap-8 md:gap-14">
            {[
              { src: logoGerencia, alt: 'Gerencia y Desarrollo Global' },
              { src: logoWinner,   alt: 'Winner Organa' },
              { src: logoBakan,    alt: 'Bakan' },
              { src: logoSkilljab, alt: 'Skilljab' },
              { src: logoCeafg,    alt: 'CEAFG' },
            ].map(l => (
              <img key={l.alt} src={l.src} alt={l.alt}
                className="h-7 md:h-9 w-auto object-contain opacity-25 hover:opacity-60 grayscale hover:grayscale-0 transition-all" />
            ))}
          </div>
        </F>
      </div>
    </section>

    {/* ══════════════════════════════════════════════════════════════════
        5. PROYECTOS — prueba de trabajo real
    ══════════════════════════════════════════════════════════════════ */}
    <section id="proyectos" className="border-t border-white/[0.06] py-14 lg:py-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12">
        <F className="text-center mb-10 sm:mb-14">
          <p className="text-[10px] font-mono text-[#CCFF00] tracking-[0.22em] uppercase mb-4">Resultados reales</p>
          <h2 className="font-sora font-extrabold tracking-tight text-[1.6rem] sm:text-[1.9rem] lg:text-[2.5rem]">
            Sitios que construimos.<br />
            <span className="text-white/40 font-medium text-[1.2rem] sm:text-[1.4rem] lg:text-[1.7rem]">Clientes que quedaron.</span>
          </h2>
        </F>

        {/* Proyecto grande — Gerencia */}
        <F className="mb-4 sm:mb-5">
          <div className="group relative rounded-2xl overflow-hidden border border-white/[0.07] bg-[#131316]
                          hover:border-white/[0.13] transition-all duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative overflow-hidden aspect-[16/10]">
                <img src={imgGerencia} alt="Gerencia Global"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#131316] hidden lg:block" />
              </div>
              <div className="flex flex-col justify-center px-5 sm:px-8 lg:px-10 py-6 sm:py-8 lg:py-0">
                <img src={logoGerencia} alt="Gerencia Global" className="h-7 sm:h-8 w-auto object-contain mb-4 opacity-60 self-start" />
                <span className="text-[9px] font-mono text-[#CCFF00] tracking-widest uppercase mb-3">Web corporativa</span>
                <h3 className="font-sora font-extrabold text-[1.2rem] sm:text-[1.4rem] mb-3">Gerencia y Desarrollo Global</h3>
                <p className="text-white/40 text-[13px] leading-relaxed mb-6 max-w-sm">
                  Plataforma completa con diseño premium, SEO optimizado e identidad visual de autoridad internacional.
                </p>
                <a href={WA_GENERAL} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#CCFF00] font-semibold text-[13px]
                             hover:gap-3 transition-all self-start">
                  Quiero algo así <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </F>

        {/* Dos proyectos menores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {[
            { img: imgWinner, logo: logoWinner, tag: 'Marca & web', name: 'Winner Organa',
              desc: 'Identidad digital premium con enfoque en conversión y posicionamiento de marca.' },
            { img: imgBakan,  logo: logoBakan,  tag: 'Branding digital', name: 'Bakan',
              desc: 'Diseño moderno orientado a captar clientes desde el primer scroll.' },
          ].map((p, i) => (
            <F key={p.name} delay={i * 0.1}>
              <div className="group relative rounded-2xl overflow-hidden border border-white/[0.07] bg-[#131316]
                              hover:border-white/[0.13] transition-all duration-500">
                <div className="relative overflow-hidden aspect-[16/9]">
                  <img src={p.img} alt={p.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#131316]/80 to-transparent" />
                  <span className="absolute top-3 left-3 text-[9px] font-mono font-semibold tracking-widest uppercase
                                   bg-[#0e0e10]/70 backdrop-blur-sm text-white/50 px-2.5 py-1 rounded-full border border-white/[0.08]">
                    {p.tag}
                  </span>
                </div>
                <div className="px-6 py-5">
                  <img src={p.logo} alt={p.name} className="h-6 w-auto object-contain opacity-50 mb-3" />
                  <p className="font-sora font-bold text-[15px] mb-1.5">{p.name}</p>
                  <p className="text-white/35 text-[13px] leading-relaxed mb-4">{p.desc}</p>
                  <a href={WA_GENERAL} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#CCFF00] font-semibold text-[12px]
                               hover:gap-2.5 transition-all">
                    Quiero algo así <ArrowRight size={13} />
                  </a>
                </div>
              </div>
            </F>
          ))}
        </div>
      </div>
    </section>

    {/* ══════════════════════════════════════════════════════════════════
        6. AUTORIDAD — quiénes somos
    ══════════════════════════════════════════════════════════════════ */}
    <section className="border-t border-white/[0.06] py-14 lg:py-24 bg-[#0a0a0c]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">

          <F y={0} className="order-2 lg:order-1">
            <div className="relative pb-4 pr-4">
              <img src={imgAuthority} alt="Idenza"
                className="w-full rounded-2xl border border-white/[0.07]
                           shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_60px_rgba(123,44,191,0.1)]" />
              {/* Badge flotante — con padding para no salir del contenedor */}
              <div className="absolute bottom-0 right-0 bg-[#0e0e10] border border-white/[0.1]
                              rounded-xl px-4 py-2.5 shadow-xl">
                <p className="font-sora font-black text-[1.4rem] text-[#CCFF00] leading-none">100%</p>
                <p className="text-white/40 text-[10px] uppercase tracking-widest mt-0.5">Garantía</p>
              </div>
            </div>
          </F>

          <F y={0} className="order-1 lg:order-2">
            <p className="text-[10px] font-mono text-[#CCFF00] tracking-[0.22em] uppercase mb-4">Quiénes somos</p>
            <h2 className="font-sora font-extrabold leading-[1.08] tracking-tight mb-6
                           text-[1.9rem] lg:text-[2.5rem]">
              No somos una agencia más.<br />
              <span className="text-[#7B2CBF]">Somos tu ventaja competitiva.</span>
            </h2>
            <p className="text-white/40 text-[14px] leading-relaxed mb-8">
              Combinamos diseño de élite, desarrollo técnico y estrategia de conversión en cada proyecto.
              No entregamos plantillas. Entregamos sistemas que hacen crecer negocios reales.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { val: 5, suffix: 'd',   label: 'Entrega mínima' },
                { val: 100, suffix: '%', label: 'Garantía total' },
              ].map(s => (
                <div key={s.label} className="p-5 rounded-xl border border-white/[0.07] bg-white/[0.02]">
                  <p className="font-sora font-black text-[2.2rem] text-[#CCFF00] leading-none">
                    <Counter to={s.val} suffix={s.suffix} />
                  </p>
                  <p className="text-white/30 text-[11px] uppercase tracking-widest mt-1.5">{s.label}</p>
                </div>
              ))}
            </div>

            <a href={WA_GENERAL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#7B2CBF] text-white font-bold
                         text-[14px] px-7 py-4 rounded-xl hover:bg-[#9D4EDD] transition-all">
              Trabajar con Idenza <ArrowRight size={15} />
            </a>
          </F>
        </div>
      </div>
    </section>

    {/* ══════════════════════════════════════════════════════════════════
        7. PLANES
    ══════════════════════════════════════════════════════════════════ */}
    <section id="planes" className="border-t border-white/[0.06] py-14 lg:py-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12">
        <F className="text-center mb-10 sm:mb-14">
          <p className="text-[10px] font-mono text-[#CCFF00] tracking-[0.22em] uppercase mb-4">Inversión</p>
          <h2 className="font-sora font-extrabold tracking-tight text-[1.6rem] sm:text-[1.9rem] lg:text-[2.5rem]">
            Elige tu punto de partida.
          </h2>
          <p className="text-white/35 text-[14px] mt-3 max-w-sm mx-auto">
            Sin contratos ocultos. Sin sorpresas. Precio fijo desde el día uno.
          </p>
        </F>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: <Zap size={20} />, iconStyle: 'bg-white/[0.05] text-white/40',
              name: 'Lanzamiento', price: '$149', oldPrice: null,
              desc: 'Landing page profesional, responsive y lista en 5 días.',
              features: ['Landing page 1 sección', 'Responsive móvil + PC', 'Formulario + WhatsApp', 'SEO básico', 'Entrega en 5 días'],
              highlight: false,
              msg: '¡Hola! Quiero cotizar el plan Lanzamiento de Idenza.',
            },
            {
              icon: <Rocket size={20} />, iconStyle: 'bg-[#7B2CBF]/20 text-[#9D4EDD]',
              name: 'Crecimiento', price: '$349', oldPrice: '$499',
              desc: 'Sitio completo de hasta 5 páginas con estrategia de conversión.',
              features: ['Hasta 5 páginas', 'Diseño premium', 'SEO optimizado', 'Blog o sistema de citas', 'Entrega en 10 días'],
              highlight: true, badge: 'Más elegido',
              msg: '¡Hola! Quiero cotizar el plan Crecimiento de Idenza.',
            },
            {
              icon: <Crown size={20} />, iconStyle: 'bg-white/[0.05] text-white/40',
              name: 'Dominio Total', price: '$999', oldPrice: null,
              desc: 'Plataforma digital a medida, sin límites de páginas ni funciones.',
              features: ['Páginas ilimitadas', 'Diseño ultra-premium', 'Integraciones API', 'SEO avanzado', 'Entrega en 15+ días'],
              highlight: false,
              msg: '¡Hola! Quiero cotizar el plan Dominio Total de Idenza.',
            },
          ].map((plan, i) => (
            <F key={plan.name} delay={i * 0.08}>
              <div className={`relative rounded-2xl p-5 sm:p-8 flex flex-col h-full border ${plan.highlight
                ? 'border-[#7B2CBF]/50 bg-[#0d0b18] shadow-[0_0_60px_rgba(123,44,191,0.1)]'
                : 'border-white/[0.07] bg-[#131316]'}`}>
                {plan.highlight && (
                  <div className="absolute top-0 left-0 w-full h-[2px] rounded-t-2xl
                                  bg-gradient-to-r from-transparent via-[#7B2CBF] to-transparent" />
                )}
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#7B2CBF] text-white
                                   text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                    {plan.badge}
                  </span>
                )}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-5 ${plan.iconStyle}`}>
                  {plan.icon}
                </div>
                <p className="font-sora font-extrabold text-[17px] mb-2">{plan.name}</p>
                <p className="text-white/35 text-[13px] leading-relaxed mb-5">{plan.desc}</p>
                <ul className="flex flex-col gap-2 mb-7 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-[13px] text-white/55">
                      <CheckCircle size={13} className="text-[#CCFF00] flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mb-6">
                  {plan.oldPrice && <p className="text-white/20 text-sm line-through mb-0.5">{plan.oldPrice}</p>}
                  <span className="font-sora font-black text-[2.6rem] leading-none">{plan.price}</span>
                  <span className="text-white/25 text-sm ml-1.5">USD</span>
                </div>
                <a href={getWhatsAppUrl(plan.msg)} target="_blank" rel="noopener noreferrer"
                  className={`w-full py-3.5 rounded-xl font-semibold text-[13px] text-center
                              transition-all flex items-center justify-center gap-2 ${plan.highlight
                    ? 'bg-[#7B2CBF] text-white hover:bg-[#9D4EDD]'
                    : 'bg-white/[0.04] border border-white/[0.08] text-white/70 hover:bg-white/[0.08]'}`}>
                  <MessageCircle size={14} />
                  Cotizar este plan
                </a>
              </div>
            </F>
          ))}
        </div>
      </div>
    </section>

    {/* ══════════════════════════════════════════════════════════════════
        8. CTA FINAL — cierre de venta
    ══════════════════════════════════════════════════════════════════ */}
    <section className="border-t border-white/[0.06] py-14 lg:py-24 px-4 sm:px-6 lg:px-12">
      <div className="max-w-[1200px] mx-auto">
        <F>
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1c0d30] via-[#0f0f14] to-[#0b1a0d]" />
            <DotGrid className="inset-0 opacity-60" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-64 rounded-full opacity-20 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse,#7B2CBF 0%,transparent 70%)', filter: 'blur(60px)' }} />
            <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full opacity-10 pointer-events-none"
              style={{ background: 'radial-gradient(circle,#CCFF00 0%,transparent 70%)', filter: 'blur(60px)' }} />
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl ring-1 ring-white/[0.07]" />

            <div className="relative z-10 max-w-xl mx-auto px-6 sm:px-8 py-12 sm:py-16 lg:py-20">
              <p className="text-[10px] font-mono text-[#CCFF00] tracking-[0.22em] uppercase mb-5">
                Tu competencia no espera
              </p>
              <h2 className="font-sora font-extrabold leading-[1.07] tracking-tight mb-4
                             text-[1.7rem] sm:text-[2.2rem] md:text-[2.8rem] lg:text-[3.2rem]">
                Cada día sin un sitio profesional es un cliente que pierde.{' '}
                <span className="text-[#CCFF00]">Empieza hoy.</span>
              </h2>
              <p className="text-white/35 text-[13px] sm:text-[14px] leading-relaxed mb-8 sm:mb-10">
                Una conversación de 10 minutos puede ser el antes y el después de tu negocio digital.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href={WA_AUDIT} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-[#CCFF00] text-[#0e0e10]
                             font-bold text-[15px] px-8 py-4 rounded-xl hover:bg-[#d4ff1a]
                             hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(204,255,0,0.2)] transition-all">
                  <Search size={17} />
                  Auditar mi web gratis
                </a>
                <a href={WA_GENERAL} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-[#25D366] text-white
                             font-bold text-[15px] px-8 py-4 rounded-xl hover:bg-[#20bd5a]
                             hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(37,211,102,0.2)] transition-all">
                  <MessageCircle size={17} />
                  Hablar con Idenza
                </a>
              </div>
              <p className="text-white/20 text-[11px] mt-6 tracking-wide">
                Sin compromiso · Respuesta en menos de 24h · Garantía total de calidad
              </p>
            </div>
          </div>
        </F>
      </div>
    </section>

    {/* ── FOOTER ──────────────────────────────────────────────────────── */}
    <footer className="border-t border-white/[0.06] px-4 sm:px-6 lg:px-12 py-5 flex items-center justify-between flex-wrap gap-3">
      <a href="/" className="flex items-center gap-2 font-sora font-extrabold text-[14px]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00]" />
        Idenza
      </a>
      <p className="text-white/20 text-[11px]">© 2026 Idenza</p>
    </footer>

  </div>
);

export default Crece;
