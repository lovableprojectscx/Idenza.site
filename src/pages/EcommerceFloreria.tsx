import { useEffect, useRef, useState } from "react";
import { Check, ArrowRight, X, ShoppingBag, Zap, Globe, HeadphonesIcon } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { getWhatsAppUrl } from "@/lib/constants";
import Navbar from "@/components/idenza/Navbar";
import idenzaLogo from '@/assets/idenza-logo.png';

/* ─────────────────────────────────────────────
   TIPOS
   ───────────────────────────────────────────── */
interface Project {
  id: number;
  name: string;
  badge: string;
  city: string;
  pills: string[];
  image: string;
  plan: string;
  desc: string;
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
    desc: "Tienda premium con pasarela de pago, zonas de entrega y panel completo de gestión.",
    built: [
      "Tienda con catálogo de arreglos y bouquets",
      "Pasarela Culqi para pagos con tarjeta",
      "Selector de zonas de entrega con precios",
      "Panel admin completo de pedidos y stock",
      "SEO local optimizado para Lima",
    ],
    result: "Incremento del 40% en ventas online el primer mes. Cero comisiones por venta, el sistema es 100% de la boutique.",
  },
  {
    id: 2,
    name: "BocaFest Food Box",
    badge: "Plan Business · S/350",
    city: "Ayacucho, Perú",
    pills: ["Catálogo de productos", "Pedidos WhatsApp", "Panel admin"],
    image: "/bocafest.png",
    plan: "Business",
    desc: "Tienda de cajas gourmet con catálogo filtrable y pedidos directos a WhatsApp.",
    built: [
      "Catálogo filtrable por categoría",
      "Sistema de pedidos directo a WhatsApp",
      "Panel admin para gestión de órdenes",
      "Contador de ofertas con temporizador",
      "Diseño con identidad visual del festival",
    ],
    result: "Lanzamiento en 4 días. Primeros 50 pedidos gestionados sin fricción desde WhatsApp Business.",
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
    desc: "Florería de ceremonias con catálogo de arreglos y atención las 24 horas.",
    built: [
      "Catálogo de arreglos fúnebres con filtros",
      "Botón WhatsApp con mensaje pre-cargado",
      "Configuración de delivery mismo día",
      "Diseño sobrio y profesional",
      "Panel editable para actualizar precios",
    ],
    result: "Operativa en 3 días. El negocio ahora recibe pedidos las 24h sin necesidad de estar en línea.",
    demo: "https://www.floreriaparavelorio.com/",
  },
  {
    id: 4,
    name: "Mundo de Sorpresas",
    badge: "Plan Business · S/350",
    city: "Ayacucho, Perú",
    pills: ["Catálogo de regalos", "Pedidos WhatsApp", "Seguimiento"],
    image: "/store_placeholder.png",
    plan: "Business",
    desc: "Tienda de regalos y flores con seguimiento de pedidos y catálogo filtrable.",
    built: [
      "Catálogo de regalos personalizados",
      "Sistema de pedidos a WhatsApp",
      "Código de seguimiento de órdenes",
      "Panel admin de gestión",
      "SEO local para Ayacucho",
    ],
    result: "Lanzamiento en 4 días con sistema de seguimiento que reduce consultas al 30%.",
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
      "SEO local básico",
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
      "Sistema de pedidos completo",
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
      "Contador de stock",
    ],
  },
];

/* ─────────────────────────────────────────────
   CUSTOM CURSOR
   ───────────────────────────────────────────── */
function RoseCursor() {
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
        className="fixed top-0 left-0 w-2 h-2 rose-cursor-dot rounded-full pointer-events-none z-[9999] transition-none"
        style={{ willChange: "transform" }}
      />
      <div
        ref={ring}
        className="fixed top-0 left-0 w-9 h-9 border rose-cursor-ring rounded-full pointer-events-none z-[9999]"
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
      style={{ background: "rgba(44,44,44,0.4)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 md:p-8"
        style={{ background: "#FFFFFF", border: "1px solid rgba(196, 116, 138, 0.3)", boxShadow: "0 20px 50px rgba(196,116,138,0.15)" }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 flex items-center justify-center rounded-full text-[#8A8A8A] hover:text-[#C4748A] hover:bg-[#F5EEE8] transition-all z-10"
        >
          <X size={20} />
        </button>

        {/* Image */}
        <div className="w-full h-64 md:h-80 overflow-hidden rounded-2xl mb-8 relative">
          <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
        </div>

        {/* Content */}
        <div>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold mb-2"
                style={{ background: "rgba(196,116,138,0.12)", color: "#C4748A", border: "1px solid rgba(196,116,138,0.2)" }}>
                {project.badge}
              </span>
              <h3 className="font-cormorant text-3xl md:text-4xl text-[#2C2C2C] font-semibold">
                {project.name}
              </h3>
            </div>
            <span className="text-[#8A8A8A] text-sm font-medium whitespace-nowrap self-start sm:self-center">📍 {project.city}</span>
          </div>

          {/* Description */}
          <p className="text-[#8A8A8A] text-base leading-relaxed mb-6 font-cormorant-italic text-[18px]">
            "{project.desc}"
          </p>

          {/* Built List */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C4748A] mb-3">Qué construimos</h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.built.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-[#2C2C2C]">
                  <Check size={16} className="text-[#7A9E7E] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Result */}
          <div className="mb-8 p-6 rounded-2xl" style={{ background: "#F5EEE8", border: "1px solid rgba(196,116,138,0.1)" }}>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C4748A] mb-2">Resultado</h4>
            <p className="text-sm text-[#2C2C2C] leading-relaxed">{project.result}</p>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3">
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer"
                className="flex-1 py-3 text-center text-sm font-bold rounded-xl transition-all hover:opacity-90 shadow-md"
                style={{ background: "#C4748A", color: "#FFFFFF" }}>
                Ver demo en vivo →
              </a>
            )}
            <button onClick={onClose}
              className="flex-1 py-3 text-center text-sm font-semibold rounded-xl transition-all hover:bg-[#F5EEE8]"
              style={{ border: "1px solid rgba(196, 116, 138, 0.2)", color: "#8A8A8A" }}>
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
export default function EcommerceFloreria() {
  const WHATSAPP_URL = getWhatsAppUrl("Hola Jack, quiero información sobre el Kit Ecommerce");
  const [activeModal, setActiveModal] = useState<Project | null>(null);

  return (
    <>
      {/* Custom cursor — desktop only */}
      <div className="hidden md:block">
        <RoseCursor />
      </div>

      {/* Global styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

        :root {
          --color-bg: #FDFAF7;
          --color-bg-2: #F5EEE8;
          --color-primary: #C4748A;
          --color-secondary: #7A9E7E;
          --color-accent: #C9A96E;
          --color-text: #2C2C2C;
          --color-text-light: #8A8A8A;
        }

        .ec-root {
          cursor: none;
          font-family: 'DM Sans', sans-serif;
          background-color: var(--color-bg);
          color: var(--color-text);
          overflow-x: hidden;
        }
        @media (max-width: 768px) { .ec-root { cursor: auto; } }

        /* Grain overlay — desktop only */
        .ec-root::before {
          content: '';
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 128px;
        }
        @media (max-width: 768px) {
          .ec-root::before { display: none; }
        }

        .font-cormorant {
          font-family: 'Cormorant Garamond', serif;
        }

        .font-cormorant-italic {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
        }

        /* Custom cursor styling */
        .rose-cursor-dot {
          background-color: #C4748A;
        }
        .rose-cursor-ring {
          border-color: rgba(196, 116, 138, 0.4);
        }

        /* Floating pulse tag */
        @keyframes pulse-float {
          0%, 100% {
            transform: translateY(0px) scale(1);
            box-shadow: 0 4px 15px rgba(196, 116, 138, 0.15);
          }
          50% {
            transform: translateY(-6px) scale(1.02);
            box-shadow: 0 8px 25px rgba(196, 116, 138, 0.25);
          }
        }
        .badge-pulse {
          animation: pulse-float 3s ease-in-out infinite;
        }

        /* Project card */
        .proj-card {
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease;
          background: #FFFFFF;
          border: 1px solid rgba(196, 116, 138, 0.08);
        }
        .proj-card:hover {
          transform: scale(1.02);
          box-shadow: 0 20px 40px rgba(196, 116, 138, 0.08);
          border-color: rgba(196, 116, 138, 0.25);
        }

        /* Plan card */
        .plan-card {
          background: #FFFFFF;
          border: 1px solid rgba(196, 116, 138, 0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .plan-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(196, 116, 138, 0.08);
        }

        /* Navbar overrides inside ec-root */
        .ec-root nav {
          background: rgba(253, 250, 247, 0.8) !important;
          border-bottom: 1px solid rgba(196, 116, 138, 0.08) !important;
          backdrop-filter: blur(12px) !important;
        }
        .ec-root nav a {
          color: #2C2C2C !important;
          font-weight: 500 !important;
        }
        .ec-root nav a:hover {
          color: #C4748A !important;
        }
        .ec-root nav button {
          color: #2C2C2C !important;
        }

        /* Mobile specific layouts */
        @media (max-width: 767px) {
          .proj-img-wrap {
            width: 100% !important;
            height: 220px !important;
          }
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #FDFAF7;
        }
        ::-webkit-scrollbar-thumb {
          background: #C4748A;
          border-radius: 3px;
        }
      `}</style>

      <div className="ec-root min-h-screen selection:bg-[#C4748A]/20 selection:text-[#C4748A]">
        <Helmet>
          <title>Kit Ecommerce Idenza | Especialistas en Florerías y Regalos</title>
          <meta name="description" content="Diseño premium de tiendas online para florerías y negocios de regalos. Sin comisiones, pedidos directos a WhatsApp." />
        </Helmet>

        <Navbar />

        {/* ══════════════════════════════════════
            HERO
        ══════════════════════════════════════ */}
        <section className="relative pt-28 md:pt-40 pb-20 md:pb-32 overflow-hidden bg-[#FDFAF7]">
          {/* Decorative Blobs — Desktop only */}
          <div className="hidden md:block absolute top-0 right-0 w-[550px] h-[550px] rounded-full blur-[140px] pointer-events-none opacity-[0.09]" style={{ background: '#C4748A' }} />
          <div className="hidden md:block absolute bottom-0 left-0 w-[550px] h-[550px] rounded-full blur-[140px] pointer-events-none opacity-[0.09]" style={{ background: '#7A9E7E' }} />

          {/* Golden background line pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

          <div className="relative z-10 container mx-auto px-6 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-12">
              {/* Text Column */}
              <div className="md:col-span-7 text-left">
                {/* Tagline */}
                <span className="inline-block text-[#C4748A] text-sm md:text-base font-semibold tracking-wider mb-5">
                  ✦ Especialistas en florerías y regalos
                </span>

                {/* Headline */}
                <h1 className="font-cormorant text-[42px] md:text-[72px] leading-[1.08] font-bold text-[#2C2C2C] mb-6">
                  Tu florería vende<br />
                  <span className="font-cormorant-italic text-[#C4748A] font-medium">mientras duermes.</span>
                </h1>

                {/* Subtitle */}
                <p className="text-[#8A8A8A] text-base md:text-lg mb-10 max-w-xl leading-relaxed">
                  Catálogo online, pedidos a WhatsApp y panel de control. Sin Shopify. Sin comisiones. El sistema es tuyo.
                </p>

                {/* Buttons */}
                <div className="flex flex-wrap items-center gap-4 mb-10">
                  <a href="#planes"
                    className="px-8 py-4 rounded-full text-sm font-bold text-white transition-all hover:scale-105"
                    style={{ background: "#C4748A", boxShadow: "0 8px 25px rgba(196, 116, 138, 0.25)" }}>
                    Ver planes
                  </a>
                  <a href="https://demo-idenza-03.lovable.app" target="_blank" rel="noopener noreferrer"
                    className="px-8 py-4 rounded-full text-sm font-bold transition-all hover:bg-[#C4748A]/5"
                    style={{ border: "1px solid #C4748A", color: "#C4748A" }}>
                    Ver demo en vivo
                  </a>
                </div>

                {/* Animated Floating Badge */}
                <div className="inline-flex">
                  <span className="badge-pulse inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs md:text-sm font-bold bg-white"
                    style={{ border: "1px solid rgba(196, 116, 138, 0.2)", color: "#C4748A" }}>
                    ⚡ Entrega en 3-5 días · Pago 50/50
                  </span>
                </div>
              </div>

              {/* Mockup Column */}
              <div className="md:col-span-5 flex justify-center relative">
                {/* Backglow behind phone mockup */}
                <div className="absolute w-72 h-72 rounded-full blur-[100px] pointer-events-none opacity-30" style={{ background: '#C4748A', top: '10%' }} />

                {/* Phone mockup */}
                <div className="relative max-w-[280px] md:max-w-[320px] w-full rounded-[48px] p-3.5 bg-[#2C2C2C] shadow-2xl border border-gray-300/40">
                  <div className="rounded-[36px] overflow-hidden aspect-[9/19] bg-white relative">
                    <img src="/hero_mockup.png" alt="Florist Mobile Mockup" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            PROPUESTA DE VALOR
        ══════════════════════════════════════ */}
        {/* Wave Divider 1 */}
        <div className="w-full overflow-hidden leading-[0]" style={{ background: '#FDFAF7' }}>
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px]" style={{ fill: '#F5EEE8' }}>
            <path d="M0,0 C150,90 350,120 600,60 C850,0 1050,30 1200,90 L1200,120 L0,120 Z"></path>
          </svg>
        </div>

        <section className="py-20 relative z-10" style={{ background: '#F5EEE8' }}>
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
              {[
                {
                  icon: <Zap size={22} strokeWidth={1.5} />,
                  title: "Sin comisiones por venta",
                  desc: "Cada pedido es 100% tuyo. Sin sorpresas al final del mes."
                },
                {
                  icon: <Globe size={22} strokeWidth={1.5} />,
                  title: "Personalizado para tu marca",
                  desc: "Tus colores, tu logo, tus productos. No una plantilla genérica."
                },
                {
                  icon: <HeadphonesIcon size={22} strokeWidth={1.5} />,
                  title: "Listo en 3 a 5 días",
                  desc: "No esperas meses. Tu tienda online funciona esta semana."
                },
              ].map((item, i) => (
                <Reveal key={i} delay={i * 100} className="flex flex-col items-center text-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white"
                    style={{ border: "1px solid rgba(196,116,138,0.25)", color: "#C4748A" }}>
                    {item.icon}
                  </div>
                  <h3 className="font-cormorant text-xl font-bold tracking-wide text-[#2C2C2C]">{item.title}</h3>
                  <p className="text-[#8A8A8A] text-sm leading-relaxed">{item.desc}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Wave Divider 2 */}
        <div className="w-full overflow-hidden leading-[0] rotate-180" style={{ background: '#FDFAF7' }}>
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px]" style={{ fill: '#F5EEE8' }}>
            <path d="M0,0 C150,90 350,120 600,60 C850,0 1050,30 1200,90 L1200,120 L0,120 Z"></path>
          </svg>
        </div>

        {/* ══════════════════════════════════════
            PROYECTOS REALES
        ══════════════════════════════════════ */}
        <section className="py-24 relative z-10 bg-[#FDFAF7]">
          {/* Soft green/rose blobs behind cards */}
          <div className="hidden md:block absolute top-[15%] left-[5%] w-[450px] h-[450px] rounded-full blur-[130px] pointer-events-none opacity-[0.08]" style={{ background: '#7A9E7E' }} />
          <div className="hidden md:block absolute bottom-[15%] right-[5%] w-[450px] h-[450px] rounded-full blur-[130px] pointer-events-none opacity-[0.08]" style={{ background: '#C4748A' }} />

          <div className="relative z-10 container mx-auto px-6">
            <Reveal className="text-center mb-16">
              <span className="text-[#C4748A] text-sm font-semibold tracking-widest uppercase">✦ Casos reales</span>
              <h2 className="font-cormorant text-4xl md:text-5xl font-semibold text-[#2C2C2C] mt-2">Lo que construimos</h2>
            </Reveal>

            <div className="flex flex-col gap-8 max-w-4xl mx-auto">
              {PROJECTS.map((proj, i) => (
                <Reveal key={proj.id} delay={i * 80}>
                  <div
                    className="proj-card rounded-3xl overflow-hidden cursor-pointer group"
                    onClick={() => setActiveModal(proj)}
                  >
                    <div className={`flex flex-col ${proj.id % 2 === 1 ? 'md:flex-row' : 'md:flex-row-reverse'} md:items-stretch min-h-[280px]`}>
                      {/* Image */}
                      <div className="proj-img-wrap w-full md:w-[45%] shrink-0 relative overflow-hidden md:self-stretch" style={{ minHeight: '220px' }}>
                        <img src={proj.image} alt={proj.name}
                          className="w-full h-full object-cover object-left-top transition-transform duration-500 group-hover:scale-[1.02]" />
                        {/* Soft overlay (max 30% opacity) ONLY on ID 3 (Florería para Velorio) */}
                        {proj.id === 3 && (
                          <div className="absolute inset-0 bg-black/15 transition-opacity duration-300 group-hover:opacity-0 pointer-events-none" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 p-6 md:p-8 flex flex-col justify-center gap-4 text-left">
                        <div>
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <span className="text-xs font-bold px-3 py-1 rounded-full"
                              style={{ background: "rgba(196,116,138,0.12)", color: "#C4748A", border: "1px solid rgba(196,116,138,0.2)" }}>
                              {proj.badge}
                            </span>
                            <span className="text-[#8A8A8A] text-xs">📍 {proj.city}</span>
                          </div>

                          <h3 className="font-cormorant text-2xl md:text-3xl font-semibold text-[#2C2C2C] mb-2">{proj.name}</h3>
                          <p className="text-[#8A8A8A] text-sm mb-4 leading-relaxed">{proj.desc}</p>

                          <div className="flex flex-wrap gap-2">
                            {proj.pills.map(p => (
                              <span key={p} className="text-[11px] font-semibold px-3 py-1 rounded-full"
                                style={{ background: "rgba(122,158,126,0.12)", color: "#7A9E7E", border: "1px solid rgba(122,158,126,0.2)" }}>
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="inline-flex items-center gap-2 text-sm font-bold transition-all hover:gap-3" style={{ color: "#C4748A" }}>
                            Ver proyecto <ArrowRight size={16} />
                          </span>
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
            PLANES
        ══════════════════════════════════════ */}
        {/* Wave Divider 3 */}
        <div className="w-full overflow-hidden leading-[0]" style={{ background: '#FDFAF7' }}>
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px]" style={{ fill: '#F5EEE8' }}>
            <path d="M985.66,92.83C906.67,72 823.78,31 743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"></path>
          </svg>
        </div>

        <section id="planes" className="py-24 relative z-10 bg-[#F5EEE8]">
          <div className="container mx-auto px-6">
            <Reveal className="text-center mb-16">
              <span className="text-[#C4748A] text-sm font-semibold tracking-widest uppercase">✦ Sin sorpresas</span>
              <h2 className="font-cormorant text-4xl md:text-5xl font-semibold text-[#2C2C2C] mt-2">Planes a tu medida</h2>
              <p className="text-[#8A8A8A] text-sm md:text-base mt-3 max-w-xl mx-auto leading-relaxed">
                Incluyen dominio gratis el primer año · 50% al confirmar, 50% al entregar
              </p>
            </Reveal>

            {/* Flexbox stack on mobile (Business plan first) and Grid on desktop */}
            <div className="flex flex-col md:grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {PLANS.map((plan) => {
                const isPopular = plan.popular;
                // Mobile orders: Business is 1, Starter is 2, Pro is 3
                let mobileOrder = "order-3";
                if (plan.name === "Business") mobileOrder = "order-1";
                if (plan.name === "Starter") mobileOrder = "order-2";

                return (
                  <Reveal key={plan.name} className={`${mobileOrder} md:order-none`}>
                    <div
                      className="plan-card rounded-3xl p-8 flex flex-col h-full"
                      style={{
                        background: '#FFFFFF',
                        border: isPopular ? "2px solid #C4748A" : "1px solid rgba(196,116,138,0.1)",
                        boxShadow: isPopular ? "0 15px 40px rgba(196,116,138,0.08)" : "none",
                      }}
                    >
                      {isPopular && (
                        <span className="inline-flex self-start text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-6"
                          style={{ background: "#C4748A", color: "#FFFFFF" }}>
                          {plan.badge}
                        </span>
                      )}

                      <h3 className="font-cormorant text-3xl font-semibold text-[#2C2C2C] mb-1">{plan.name}</h3>

                      <div className="flex items-end gap-2 mb-2">
                        <span className="font-cormorant text-5xl font-bold" style={{ color: "#C4748A" }}>{plan.price}</span>
                        <span className="text-[#8A8A8A] text-sm mb-1 font-medium">pago único</span>
                      </div>

                      <span className="text-[#8A8A8A] text-xs font-semibold uppercase tracking-wider mb-6">+ {plan.monthly} mantenimiento</span>

                      {/* Thin gold decorative separator */}
                      <div className="h-px w-full bg-[#C9A96E] opacity-20 mb-6" />

                      <ul className="space-y-4 flex-1 mb-8">
                        {plan.features.map(f => (
                          <li key={f} className="flex items-start gap-3 text-sm text-[#2C2C2C] text-left">
                            <Check size={16} className="shrink-0 mt-0.5" style={{ color: "#7A9E7E" }} />
                            <span>{f}</span>
                          </li>
                        ))}
                        <li className="flex items-start gap-3 text-sm text-[#8A8A8A] text-left">
                          <Check size={16} className="shrink-0 mt-0.5 opacity-40" />
                          <span>Entrega en {plan.delivery}</span>
                        </li>
                      </ul>

                      {/* Thin gold decorative separator */}
                      <div className="h-px w-full bg-[#C9A96E] opacity-20 mb-6" />

                      <a href={`${WHATSAPP_URL}%20plan%20${plan.name}`}
                        className="w-full py-3.5 rounded-full text-center text-sm font-bold transition-all hover:scale-[1.02]"
                        style={isPopular
                          ? { background: "#C4748A", color: "#FFFFFF", boxShadow: "0 6px 20px rgba(196, 116, 138, 0.2)" }
                          : { border: "1px solid #C4748A", color: "#C4748A" }}>
                        Empezar
                      </a>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            CTA FINAL
        ══════════════════════════════════════ */}
        {/* Wave Divider 4 */}
        <div className="w-full overflow-hidden leading-[0]" style={{ background: '#F5EEE8' }}>
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px]" style={{ fill: '#C4748A' }}>
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>

        <section className="py-24 px-6 relative z-10" style={{ background: 'linear-gradient(135deg, #C4748A 0%, #C9A96E 100%)' }}>
          <Reveal>
            <div className="container mx-auto text-center max-w-3xl">
              <h2 className="font-cormorant text-[36px] md:text-[54px] font-semibold text-white mb-4 leading-tight">
                ¿Lista para vender sin depender de nadie?
              </h2>
              <p className="text-white/80 text-base md:text-lg mb-8 font-medium">
                Tu tienda online lista esta semana.
              </p>
              <a href={WHATSAPP_URL}
                className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-white text-base font-bold transition-all hover:scale-105"
                style={{ color: "#C4748A", boxShadow: "0 8px 30px rgba(0,0,0,0.15)" }}>
                Quiero mi tienda <ArrowRight size={18} />
              </a>
            </div>
          </Reveal>
        </section>

        {/* ══════════════════════════════════════
            CUSTOM FOOTER
        ══════════════════════════════════════ */}
        <footer className="py-16 text-white" style={{ background: '#2C2C2C' }}>
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
            {/* Logo */}
            <a href="/">
              <div className="transition-all hover:scale-105 cursor-pointer">
                <img src={idenzaLogo} alt="Idenza Logo" className="h-8 w-auto brightness-0 invert" />
              </div>
            </a>

            {/* Links */}
            <div className="flex flex-wrap justify-center gap-8 text-sm font-semibold tracking-wide text-white/70">
              <a href="/nosotros" className="hover:text-[#C4748A] transition-colors">Nosotros</a>
              <a href="/proyectos" className="hover:text-[#C4748A] transition-colors">Proyectos</a>
              <a href="/planes" className="hover:text-[#C4748A] transition-colors">Planes</a>
              <a href="/privacidad" className="hover:text-[#C4748A] transition-colors">Privacidad</a>
            </div>

            {/* Copyright */}
            <div className="text-xs font-semibold tracking-widest text-white/40 uppercase">
              © 2026 Idenza · Arquitectura digital para negocios que crecen
            </div>
          </div>
        </footer>
      </div>

      {/* Modal */}
      {activeModal && (
        <ProjectModal project={activeModal} onClose={() => setActiveModal(null)} />
      )}
    </>
  );
}
