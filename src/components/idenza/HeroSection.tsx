import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import TextRotator from './TextRotator';
import Button from './Button';
import { useNavigate } from 'react-router-dom';
import { getWhatsAppUrl } from '@/lib/constants';
import logoGerencia from '@/assets/logo-gerencia-transparent-v3.png';
import logoWinner from '@/assets/logo-winner-transparent-v3.png';
import logoBakan from '@/assets/logo-bakan-transparent-v3.png';
import logoSkilljab from '@/assets/logo-skilljab-transparent-v3.png';
import logoCeafg from '@/assets/logo-ceafg-transparent-v3.png';
import { MousePointer2 } from 'lucide-react';

// ─── LOGO TICKER ──────────────────────────────────────────────────────────────
const LOGOS = [
  { src: logoGerencia, alt: 'Gerencia y Desarrollo Global' },
  { src: logoWinner,   alt: 'Winner Organa' },
  { src: logoBakan,    alt: 'Bakan' },
  { src: logoSkilljab, alt: 'Skilljab' },
  { src: logoCeafg,    alt: 'CEAFG' },
];

const LogoTicker = () => {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % LOGOS.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14">
      {LOGOS.map((logo, i) => (
        <motion.div
          key={i}
          animate={{
            scale:   active === i ? 1.08 : 1,
            opacity: active === i ? 1    : 0.35,
            filter:  active === i ? 'grayscale(0%)' : 'grayscale(100%)',
          }}
          transition={{ duration: 0.5 }}
          whileHover={{ opacity: 1, filter: 'grayscale(0%)', scale: 1.08 }}
          className="relative"
        >
          {active === i && (
            <motion.div
              layoutId="logoGlow"
              className="absolute inset-0 bg-primary/15 blur-xl rounded-full"
              transition={{ duration: 0.5 }}
            />
          )}
          <img src={logo.src} alt={logo.alt} className="h-9 md:h-12 w-auto object-contain relative z-10" />
        </motion.div>
      ))}
    </div>
  );
};

// ─── HERO SECTION ─────────────────────────────────────────────────────────────
const HeroSection = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });

  const y       = useTransform(scrollYProgress, [0, 0.5], ['0%', '-18%']);
  const scale   = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const blur    = useTransform(scrollYProgress, [0, 0.3], ['blur(0px)', 'blur(10px)']);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-20"
    >

      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full opacity-[0.05]"
          style={{ background: 'radial-gradient(ellipse, var(--primary) 0%, transparent 70%)', filter: 'blur(60px)' }}
        />
        <div
          className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)', filter: 'blur(80px)' }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '36px 36px' }}
        />
      </div>

      {/* ── Single content layer — no duplicate ── */}
      <motion.div
        style={{ y, scale, opacity, filter: blur }}
        className="relative z-10 w-full will-change-transform"
      >
        <div className="max-w-4xl mx-auto px-6 text-center">

          {/* System status */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex justify-center items-center gap-2 mb-7"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-foreground/[0.08] border border-foreground/20 text-foreground font-mono text-[10px] tracking-widest uppercase font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary-rgb),0.8)]" />
              OPERACIONES EN LÍNEA
            </span>
          </motion.div>

          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex justify-center gap-3 mb-8 flex-wrap"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-foreground/[0.07] border border-foreground/20 text-foreground font-mono text-[10px] tracking-[0.2em] font-semibold">
              <span className="w-1 h-1 bg-primary rounded-full animate-pulse" />
              EXCLUSIVIDAD DIGITAL
            </div>
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-foreground/[0.07] border border-foreground/20 text-foreground font-mono text-[10px] tracking-[0.2em] font-semibold">
              <span className="w-1 h-1 bg-secondary rounded-full animate-pulse" />
              ARQUITECTURA ESCALABLE
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.2, ease: 'easeOut' }}
            className="text-[2.2rem] sm:text-[3rem] md:text-5xl lg:text-[4rem] font-sora font-extrabold leading-[1.12] tracking-tight mb-6"
          >
            No vendemos páginas web.<br />
            Construimos <span className="text-primary italic inline-block">conversión.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Transformamos tu negocio con un <span className="text-foreground font-bold">recepcionista digital</span> que captura clientes, analiza su comportamiento y te entrega ventas directas a tu WhatsApp.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-5 justify-center items-center"
          >
            <a
              href={getWhatsAppUrl("Hola Idenza, me interesa implementar un Recepcionista Digital en mi negocio.")}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-10 h-14 flex items-center justify-center text-sm font-bold tracking-widest uppercase bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-full shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)] hover:shadow-[0_0_40px_rgba(var(--primary-rgb),0.4)] hover:scale-[1.02] transition-all"
            >
              Hablar con un Asesor
            </a>
            <Button
              className="w-full sm:w-auto px-8 h-12 text-sm font-bold border-border bg-card backdrop-blur-sm hover:bg-foreground/5 hover:border-primary/50 text-foreground"
              onClick={() => navigate('/planes')}
            >
              Ver Planes Tracker
            </Button>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-16 md:mt-20 flex flex-col items-center gap-5"
          >
            <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.3em]">
              Operando en sistemas de alto rendimiento
            </p>
            <LogoTicker />
          </motion.div>

        </div>
      </motion.div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 w-full h-28 bg-gradient-to-t from-background to-transparent pointer-events-none z-20" />

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 7, 0], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
      >
        <MousePointer2 size={13} className="text-muted-foreground" />
      </motion.div>

    </section>
  );
};

export default HeroSection;
