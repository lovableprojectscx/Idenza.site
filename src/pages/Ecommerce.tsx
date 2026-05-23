import { useEffect, useRef, useState } from "react";
import { Check, ArrowRight, X, ShoppingBag, Zap, Globe, HeadphonesIcon } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { getWhatsAppUrl } from "@/lib/constants";
import Navbar from "@/components/idenza/Navbar";
import Footer from "@/components/idenza/Footer";

/* ─────────────────────────────────────────────
   TIPOS
───────────────────────────────────────────── */
interface Project {
  id: number;
  name: string;
  badge: string;
  city: string;
  pills: string[];
  image: string | null;
  plan: string;
  built: string[];
  result: string;
  demo?: string;
}

interface Plan {
  name: string;
  price: string;
  monthly: string;
  popular?: boolean;
  badge?: string;
  features: string[];
  delivery: string;
}

/* ─────────────────────────────────────────────
   DATOS
───────────────────────────────────────────── */
const PROJECTS: Project[] = [
  {
    id: 1,
    name: "Miraflores Boutique Floral",
    badge: "Proyecto a medida · S/1,100",
    city: "Lima, Perú",
    pills: ["Pasarela de pago", "Zonas de entrega", "Panel completo"],
    image: "/miraflores.png",
    plan: "A medida",
    built: [
      "Tienda con catálogo de arreglos y bouquets",
      "Pasarela Culqi para pagos con tarjeta",
      "Selector de zonas de entrega con precios",
      "Panel admin completo de pedidos y stock",
      "SEO local optimizado para Lima",
    ],
    result:
      "Incremento del 40% en ventas online el primer mes. Cero comisiones por venta, el sistema es 100% de la boutique.",
  },
  {
    id: 2,
    name: "BocaFest Food Box",
    badge: "Plan Business · S/350",
    city: "Ayacucho, Perú",
    pills: ["Catálogo de productos", "Pedidos WhatsApp", "Panel admin"],
    image: "/bocafest.png",
    plan: "Business",
    built: [
      "Catálogo filtrable por categoría",
      "Sistema de pedidos directo a WhatsApp",
      "Panel admin para gestión de órdenes",
      "Contador de ofertas con temporizador",
      "Diseño con identidad visual del festival",
    ],
    result:
      "Lanzamiento en 4 días. Primeros 50 pedidos gestionados sin fricción desde WhatsApp Business.",
    demo: "https://www.bocafestfoodbox.com/",
  },
  {
    id: 3,
    name: "Florería para Velorio",
    badge: "Plan Starter · S/250",
    city: "Lima y Callao, Perú",
    pills: ["Catálogo de arreglos", "Delivery mismo día", "Atención 24h"],
    image: "/floresparavelorio.png",
    plan: "Starter",
    built: [
      "Catálogo de arreglos fúnebres con filtros",
      "Botón WhatsApp con mensaje pre-cargado",
      "Configuración de delivery mismo día",
      "Diseño sobrio y profesional",
      "Panel editable para actualizar precios",
    ],
    result:
      "Operativa en 3 días. El negocio ahora recibe pedidos las 24h sin necesidad de estar en línea.",
    demo: "https://www.floreriaparavelorio.com/",
  },
  {
    id: 4,
    name: "Mundo de Sorpresas",
    badge: "Plan Business · S/350",
    city: "Ayacucho, Perú",
    pills: ["Catálogo de regalos", "Pedidos WhatsApp", "Seguimiento"],
    image: null,
    plan: "Business",
    built: [
      "Catálogo de regalos personalizados",
      "Sistema de pedidos a WhatsApp",
      "Código de seguimiento de órdenes",
      "Panel admin de gestión",
      "SEO local para búsquedas en Ayacucho",
    ],
    result:
      "Lanzamiento en 4 días con sistema de seguimiento que reduce consultas al 30%.",
    demo: "https://www.mundo-de-sorpresas-ayacucho.com/",
  },
];

const PLANS: Plan[] = [
  {
    name: "Starter",
    price: "S/250",
    monthly: "S/30/mes",
    delivery: "3 días",
    features: [
      "Landing + catálogo filtrable",
      "Botón WhatsApp directo",
      "Panel admin",
      "QR Dinámico",
      "SEO local",
    ],
  },
  {
    name: "Business",
    price: "S/350",
    monthly: "S/40/mes",
    popular: true,
    badge: "⭐ MÁS POPULAR",
    delivery: "4 días",
    features: [
      "Todo lo del Starter",
      "Sistema de pedidos",
      "Seguimiento de órdenes",
      "Panel admin avanzado",
      "Ofertas con contador",
    ],
  },
  {
    name: "Pro",
    price: "S/950",
    monthly: "S/50/mes",
    delivery: "5 días",
    features: [
      "Todo lo del Business",
      "Pasarela de pago (Culqi/IZI)",
      "Panel completo de gestión",
      "CRM básico",
      "Contador de stock limitado",
    ],
  },
];

/* ─────────────────────────────────────────────
   CUSTOM CURSOR
───────────────────────────────────────────── */
function GoldCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (dot.current) {
        dot.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }
      if (ring.current) {
        ring.current.style.transform = `translate(${e.clientX - 18}px, ${e.clientY - 18}px)`;
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <div
        ref={dot}
        className="fixed top-0 left-0 w-2 h-2 bg-[#ffb900] rounded-full pointer-events-none z-[9999] transition-none"
        style={{ willChange: "transform" }}
      />
      <div
        ref={ring}
        className="fixed top-0 left-0 w-9 h-9 border border-[#ffb900]/40 rounded-full pointer-events-none z-[9999]"
        style={{ willChange: "transform", transition: "transform 0.08s linear" }}
      />
    </>
  );
}

/* ─────────────────────────────────────────────
   SCROLL REVEAL HOOK
───────────────────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

/* ─────────────────────────────────────────────
   REVEAL WRAPPER
───────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   MODAL
───────────────────────────────────────────── */
function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{ background: "#111111", border: "1px solid #ffb900", boxShadow: "0 0 60px rgba(255,185,0,0.15)" }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full text-white/60 hover:text-[#ffb900] hover:bg-white/5 transition-all z-10"
        >
          <X size={18} />
        </button>

        {/* Image */}
        {project.image ? (
          <div className="w-full h-56 overflow-hidden rounded-t-2xl">
            <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-full h-56 rounded-t-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #1a1500 0%, #111 100%)", borderBottom: "1px solid rgba(255,185,0,0.2)" }}>
            <span className="text-[#ffb900]/30 font-mono text-sm uppercase tracking-widest">Vista previa no disponible</span>
          </div>
        )}

        {/* Content */}
        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h3 className="ec-headline text-3xl text-white mb-2">
                {project.name}
              </h3>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: "rgba(255,185,0,0.15)", color: "#ffb900", border: "1px solid rgba(255,185,0,0.3)" }}>
                {project.badge}
              </span>
            </div>
            <span className="text-white/40 text-sm whitespace-nowrap">📍 {project.city}</span>
          </div>

          {/* Lo que construimos */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#ffb900]/60 mb-3">Qué construimos</h4>
            <ul className="space-y-2">
              {project.built.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                  <Check size={14} className="text-[#ffb900] shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Resultado */}
          <div className="mb-8 p-4 rounded-xl" style={{ background: "rgba(255,185,0,0.06)", border: "1px solid rgba(255,185,0,0.15)" }}>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#ffb900]/60 mb-2">Resultado</h4>
            <p className="text-sm text-white/80">{project.result}</p>
          </div>

          {/* CTA */}
          <div className="flex gap-3">
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer"
                className="flex-1 py-3 text-center text-sm font-bold rounded-xl transition-all hover:opacity-90"
                style={{ background: "#ffb900", color: "#080808" }}>
                Ver demo en vivo →
              </a>
            )}
            <button onClick={onClose}
              className="flex-1 py-3 text-center text-sm font-semibold rounded-xl transition-all hover:bg-white/10"
              style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)" }}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function Ecommerce() {
  const WHATSAPP_URL = getWhatsAppUrl("Hola Jack, quiero información sobre el Kit Ecommerce");
  const [activeModal, setActiveModal] = useState<Project | null>(null);

  return (
    <>
      {/* Custom cursor — desktop only */}
      <div className="hidden md:block">
        <GoldCursor />
      </div>

      {/* Global styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

        .ec-root {
          cursor: none;
          font-family: 'DM Sans', sans-serif;
          background: #080808;
          color: #ffffff;
        }
        @media (max-width: 768px) { .ec-root { cursor: auto; } }

        /* Grain overlay */
        .ec-root::before {
          content: '';
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          opacity: 0.032;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 128px;
        }

        /* Bebas Neue para headlines — tracking ajustado */
        .ec-headline {
          font-family: 'Bebas Neue', sans-serif;
          font-weight: 400;
          letter-spacing: 0.02em;
        }

        /* Hero headline especial — dos tamaños distintos */
        .ec-hero-h1 {
          font-family: 'Bebas Neue', sans-serif;
          font-weight: 400;
          letter-spacing: 0.015em;
          line-height: 1.0;
          font-size: clamp(3.4rem, 10vw, 7.5rem);
        }
        @media (max-width: 480px) {
          .ec-hero-h1 { font-size: clamp(2.8rem, 13vw, 4.2rem); }
        }

        /* Geo lines */
        .geo-line {
          position: absolute;
          background: rgba(255,185,0,0.08);
          pointer-events: none;
        }
        @media (max-width: 768px) { .geo-line { display: none; } }

        /* Section number */
        .sec-num {
          font-family: 'Bebas Neue', sans-serif;
          font-weight: 400;
          font-size: clamp(80px, 14vw, 200px);
          line-height: 1;
          color: transparent;
          -webkit-text-stroke: 1px rgba(255,185,0,0.06);
          pointer-events: none;
          user-select: none;
          position: absolute;
        }
        @media (max-width: 768px) { .sec-num { display: none; } }

        /* Project card */
        .proj-card {
          border-left: 3px solid transparent;
          transition: border-color 0.25s ease, background 0.25s ease;
        }
        .proj-card:hover {
          border-left-color: #ffb900;
          background: rgba(255,185,0,0.04) !important;
        }

        /* Plan card */
        .plan-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .plan-card:hover {
          transform: translateY(-4px) scale(1.015);
        }

        /* Badge float */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .badge-float { animation: float 3s ease-in-out infinite; }

        /* Pill */
        .pill {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
          background: rgba(255,185,0,0.08);
          color: rgba(255,185,0,0.8);
          border: 1px solid rgba(255,185,0,0.2);
          white-space: nowrap;
        }

        /* Pills — wrap en mobile */
        .pill-wrap { display: flex; flex-wrap: wrap; gap: 6px; }

        /* Project card image — fija en mobile */
        @media (max-width: 767px) {
          .proj-img-wrap { width: 100% !important; height: 200px !important; }
          .proj-img-wrap img { object-position: center top; }
          .plan-card:hover { transform: none; }
          .ec-root { padding-bottom: env(safe-area-inset-bottom); }
        }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #080808; }
        ::-webkit-scrollbar-thumb { background: rgba(255,185,0,0.3); border-radius: 2px; }
      `}</style>

      <div className="ec-root min-h-screen selection:bg-[#ffb900]/20 selection:text-[#ffb900]">
        <Helmet>
          <title>Kit Ecommerce Idenza | Vende Sin Comisiones</title>
          <meta name="description" content="Tu propio ecommerce sin mensualidades de plataforma ni comisiones. Sistema 100% tuyo con pedidos a WhatsApp y pagos QR." />
        </Helmet>

        <Navbar />

        {/* ══════════════════════════════════════
            HERO
        ══════════════════════════════════════ */}
        <section className="relative pt-28 md:pt-36 pb-16 md:pb-28 overflow-hidden">
          {/* Gold radial glow */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div style={{
              width: "700px", height: "700px",
              background: "radial-gradient(ellipse at center, rgba(255,185,0,0.09) 0%, transparent 70%)",
              borderRadius: "50%",
            }} />
          </div>

          {/* Geo lines */}
          <div className="geo-line" style={{ top: "15%", left: 0, right: 0, height: "1px" }} />
          <div className="geo-line" style={{ top: 0, bottom: 0, left: "8%", width: "1px" }} />
          <div className="geo-line" style={{ top: 0, bottom: 0, right: "8%", width: "1px" }} />

          <div className="relative z-10 container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">

              {/* Badge */}
              <div className="flex justify-center mb-10">
                <span className="badge-float inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold"
                  style={{ background: "rgba(255,185,0,0.12)", border: "1px solid rgba(255,185,0,0.35)", color: "#ffb900" }}>
                  ⚡ Entrega en 3-5 días
                </span>
              </div>

              {/* Headline */}
              <h1 className="ec-hero-h1 mb-6">
                <span className="text-white block">Tu negocio vende solo.</span>
                <span style={{ color: "#ffb900" }} className="block">Tú solo confirmas y entregas.</span>
              </h1>

              {/* Sub */}
              <p className="text-white/55 text-base md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                Sin Shopify. Sin comisiones. El sistema es tuyo para siempre.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="#planes"
                  className="flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-bold transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,185,0,0.3)]"
                  style={{ background: "#ffb900", color: "#080808" }}>
                  Ver planes <ArrowRight size={16} />
                </a>
                <a href="https://demo-idenza-03.lovable.app" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-semibold transition-all hover:bg-white/5"
                  style={{ border: "1px solid rgba(255,255,255,0.18)", color: "#fff" }}>
                  Ver demo en vivo
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            PROPUESTA DE VALOR
        ══════════════════════════════════════ */}
        <section className="py-20" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { icon: <Zap size={22} strokeWidth={1.5} />, title: "Sin comisiones por venta", desc: "Cada sol que entra es tuyo. Sin porcentajes, sin sorpresas." },
                { icon: <Globe size={22} strokeWidth={1.5} />, title: "100% personalizado", desc: "Tu marca, tus colores, tus productos. Nada genérico." },
                { icon: <HeadphonesIcon size={22} strokeWidth={1.5} />, title: "Soporte en español", desc: "Contacto directo contigo. Sin tickets, sin esperas." },
              ].map((item, i) => (
                <Reveal key={i} delay={i * 100} className="flex flex-col items-center text-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ border: "1px solid rgba(255,185,0,0.35)", color: "#ffb900" }}>
                    {item.icon}
                  </div>
                  <h3 className="ec-headline text-base tracking-wide text-white">{item.title}</h3>
                  <p className="text-white/45 text-sm leading-relaxed">{item.desc}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            PROYECTOS REALES  (sección 02)
        ══════════════════════════════════════ */}
        <section className="relative py-28 overflow-hidden">
          {/* Big number */}
          <span className="sec-num" style={{ top: "-20px", left: "-10px" }}>02</span>

          <div className="relative z-10 container mx-auto px-6">
            <Reveal className="text-center mb-16">
              <p className="text-[#ffb900] text-xs font-bold uppercase tracking-[0.3em] mb-4">Casos reales</p>
              <h2 className="ec-headline text-[clamp(2.4rem,6vw,4rem)] text-white">Lo que construimos</h2>
            </Reveal>

            <div className="flex flex-col gap-5 max-w-4xl mx-auto">
              {PROJECTS.map((proj, i) => (
                <Reveal key={proj.id} delay={i * 80}>
                  <div
                    className="proj-card rounded-2xl overflow-hidden cursor-pointer"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                    onClick={() => setActiveModal(proj)}
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Image */}
                      <div className="proj-img-wrap w-full md:w-56 h-44 md:h-auto shrink-0 overflow-hidden"
                        style={{ minHeight: "160px" }}>
                        {proj.image ? (
                          <img src={proj.image} alt={proj.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"
                            style={{ background: "linear-gradient(135deg,#150f00,#0c0c0c)", minHeight: "160px" }}>
                            <ShoppingBag size={36} className="text-[#ffb900]/25" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 p-6 flex flex-col justify-between gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <span className="text-xs font-bold px-3 py-1 rounded-full"
                              style={{ background: "rgba(255,185,0,0.12)", color: "#ffb900", border: "1px solid rgba(255,185,0,0.25)" }}>
                              {proj.badge}
                            </span>
                            <span className="text-white/35 text-xs">📍 {proj.city}</span>
                          </div>
                          <h3 className="ec-headline text-2xl md:text-3xl text-white mb-3">{proj.name}</h3>
                          <div className="flex flex-wrap gap-2">
                            {proj.pills.map(p => (
                              <span key={p} className="pill">{p}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <button
                            className="flex items-center gap-2 text-sm font-semibold transition-all hover:gap-3"
                            style={{ color: "#ffb900" }}>
                            Ver proyecto <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            PLANES  (sección 03)
        ══════════════════════════════════════ */}
        <section id="planes" className="relative py-28 overflow-hidden"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <span className="sec-num" style={{ top: "-20px", right: "-10px", left: "auto" }}>03</span>

          <div className="relative z-10 container mx-auto px-6">
            <Reveal className="text-center mb-16">
              <p className="text-[#ffb900] text-xs font-bold uppercase tracking-[0.3em] mb-4">Sin sorpresas</p>
              <h2 className="ec-headline text-[clamp(2.4rem,6vw,4rem)] text-white">Planes a tu medida</h2>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {PLANS.map((plan, i) => (
                <Reveal key={plan.name} delay={i * 100}>
                  <div
                    className="plan-card rounded-2xl p-7 flex flex-col h-full"
                    style={{
                      background: plan.popular
                        ? "rgba(255,185,0,0.06)"
                        : "rgba(255,255,255,0.03)",
                      border: plan.popular
                        ? "2px solid #ffb900"
                        : "1px solid rgba(255,255,255,0.08)",
                      boxShadow: plan.popular ? "0 0 40px rgba(255,185,0,0.08)" : "none",
                    }}
                  >
                    {plan.badge && (
                      <span className="inline-flex self-start text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-5"
                        style={{ background: "rgba(255,185,0,0.2)", color: "#ffb900" }}>
                        {plan.badge}
                      </span>
                    )}

                    <h3 className="ec-headline text-3xl text-white mb-1">{plan.name}</h3>
                    <div className="flex items-end gap-2 mb-1">
                      <span className="ec-headline text-5xl" style={{ color: "#ffb900" }}>{plan.price}</span>
                      <span className="text-white/35 text-sm mb-1">pago único</span>
                    </div>
                    <span className="text-white/35 text-xs mb-7">+ {plan.monthly} mantenimiento</span>

                    <ul className="space-y-3 flex-1 mb-8">
                      {plan.features.map(f => (
                        <li key={f} className="flex items-start gap-3 text-sm text-white/70">
                          <Check size={14} className="shrink-0 mt-0.5" style={{ color: "#ffb900" }} />
                          {f}
                        </li>
                      ))}
                      <li className="flex items-start gap-3 text-sm text-white/50">
                        <Check size={14} className="shrink-0 mt-0.5 text-white/30" />
                        Entrega en {plan.delivery}
                      </li>
                    </ul>

                    <a href={`${WHATSAPP_URL}%20plan%20${plan.name}`}
                      className="w-full py-3.5 rounded-xl text-center text-sm font-bold transition-all hover:opacity-90"
                      style={plan.popular
                        ? { background: "#ffb900", color: "#080808" }
                        : { background: "rgba(255,255,255,0.07)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" }}>
                      Empezar ahora
                    </a>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Condiciones */}
            <Reveal delay={300} className="mt-10 text-center">
              <p className="text-white/35 text-sm mb-2">50% al confirmar · 50% al entregar</p>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold"
                style={{ background: "rgba(34,197,94,0.12)", color: "rgb(74,222,128)", border: "1px solid rgba(34,197,94,0.25)" }}>
                🎁 Dominio gratis el primer año
              </span>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════════════════════
            CTA FINAL
        ══════════════════════════════════════ */}
        <section className="px-6 pb-28">
          <Reveal>
            <div className="container mx-auto">
              <div className="rounded-3xl px-10 py-20 text-center relative overflow-hidden"
                style={{ background: "#ffb900" }}>
                {/* Decorative circles */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full opacity-10"
                    style={{ border: "50px solid #080808" }} />
                  <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full opacity-10"
                    style={{ border: "70px solid #080808" }} />
                </div>

                <div className="relative z-10">
                  <h2 className="ec-headline text-[clamp(2.8rem,7vw,5rem)] text-[#080808] mb-8 leading-none">
                    ¿Listo para vender sin<br className="hidden md:block" /> depender de nadie?
                  </h2>
                  <a href={WHATSAPP_URL}
                    className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-white text-base font-bold transition-all hover:scale-105"
                    style={{ background: "#080808", boxShadow: "0 8px 30px rgba(0,0,0,0.25)" }}>
                    Quiero mi Kit Ecommerce <ArrowRight size={18} />
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        <Footer />
      </div>

      {/* Modal */}
      {activeModal && (
        <ProjectModal project={activeModal} onClose={() => setActiveModal(null)} />
      )}
    </>
  );
}
