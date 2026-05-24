import { useEffect, useRef, useState } from "react";
import { Check, ArrowRight, Zap, Globe, ShoppingBag, Gift, Gem, Gamepad, Shirt } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { getWhatsAppUrl } from "@/lib/constants";
import Navbar from "@/components/idenza/Navbar";
import Footer from "@/components/idenza/Footer";

/* ─────────────────────────────────────────────
   TIPOS
   ───────────────────────────────────────────── */
interface Niche {
  id: number;
  name: string;
  badge: string;
  isAvailable: boolean;
  desc: string;
  icon: React.ReactNode;
  pills: string[];
  link?: string;
  glowColor: string;
}

/* ─────────────────────────────────────────────
   DATOS
   ───────────────────────────────────────────── */
const NICHES: Niche[] = [
  {
    id: 1,
    name: "Florerías y Regalos",
    badge: "Disponible",
    isAvailable: true,
    desc: "Sistemas con catálogo interactivo, cálculo de costo de delivery por zonas y pedidos ordenados directo a WhatsApp o pasarela Culqi.",
    icon: <Gift size={24} />,
    pills: ["Delivery por Zonas", "Catálogo Floral", "Pedidos WhatsApp"],
    link: "/ecommerce-floreria",
    glowColor: "rgba(196, 116, 138, 0.15)", // Rose glow
  },
  {
    id: 2,
    name: "Joyerías y Accesorios",
    badge: "Próximamente",
    isAvailable: false,
    desc: "Plataformas con zoom premium de productos, filtros de colecciones refinados, pasarelas de pago integradas y control de stock en tiempo real.",
    icon: <Gem size={24} />,
    pills: ["Zoom HD", "Filtro de Colecciones", "Pasarela de Pago"],
    glowColor: "rgba(201, 169, 110, 0.15)", // Gold glow
  },
  {
    id: 3,
    name: "Jugueterías y Hobbies",
    badge: "Próximamente",
    isAvailable: false,
    desc: "Catálogos segmentados por edades, gestión rápida de inventario, checkouts ultra rápidos y cupones de descuento automáticos.",
    icon: <Gamepad size={24} />,
    pills: ["Filtro de Edades", "Stock Dinámico", "Checkout Express"],
    glowColor: "rgba(122, 158, 126, 0.15)", // Green glow
  },
  {
    id: 4,
    name: "Boutiques de Moda",
    badge: "Próximamente",
    isAvailable: false,
    desc: "Filtros dinámicos de tallas, colores y marcas, tablas de equivalencias, galería de imágenes en alta definición y pasarela integrada.",
    icon: <Shirt size={24} />,
    pills: ["Tallas y Colores", "Tabla de Medidas", "Lookbook"],
    glowColor: "rgba(122, 163, 220, 0.15)", // Blue glow
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
   MAIN PAGE
   ───────────────────────────────────────────── */
export default function Ecommerce() {
  const WHATSAPP_URL = getWhatsAppUrl("Hola Jack, quiero información sobre las soluciones de Ecommerce Especializado");

  return (
    <>
      {/* Custom cursor — desktop only */}
      <div className="hidden md:block">
        <GoldCursor />
      </div>

      {/* Global styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

        .hub-root {
          cursor: none;
          font-family: 'DM Sans', sans-serif;
          background: #080808;
          color: #ffffff;
          overflow-x: hidden;
        }
        @media (max-width: 768px) { .hub-root { cursor: auto; } }

        /* Grain overlay */
        .hub-root::before {
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

        .hub-headline {
          font-family: 'Bebas Neue', sans-serif;
          font-weight: 400;
          letter-spacing: 0.02em;
        }

        /* Niche Card styles */
        .niche-card {
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.07);
        }
        
        .niche-card:hover {
          transform: translateY(-8px);
          border-color: rgba(255, 185, 0, 0.25);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
        }

        .niche-pill {
          font-size: 11px;
          font-weight: 600;
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>

      <div className="hub-root min-h-screen selection:bg-[#ffb900]/20 selection:text-[#ffb900]">
        <Helmet>
          <title>Idenza | Ecommerces Especializados de Nicho</title>
          <meta name="description" content="Sistemas de venta online optimizados para tu sector específico. Florerías, Joyerías, Jugueterías, Boutiques y más." />
        </Helmet>

        <Navbar />

        {/* ══════════════════════════════════════
            HERO
        ══════════════════════════════════════ */}
        <section className="relative pt-32 md:pt-44 pb-20 md:pb-28 overflow-hidden">
          {/* Ambient center radial glow */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div style={{
              width: "800px", height: "800px",
              background: "radial-gradient(ellipse at center, rgba(255,185,0,0.06) 0%, transparent 70%)",
              borderRadius: "50%",
            }} />
          </div>

          <div className="relative z-10 container mx-auto px-6 max-w-5xl text-center">
            <Reveal>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-6"
                style={{ background: "rgba(255,185,0,0.08)", border: "1px solid rgba(255,185,0,0.25)", color: "#ffb900" }}>
                ⚡ Soluciones Ecommerce de Alto Rendimiento
              </span>
              <h1 className="hub-headline text-[50px] md:text-[88px] leading-[1.0] text-white mb-6">
                Ecommerces de <span className="text-[#ffb900]">Nicho.</span>
              </h1>
              <p className="text-white/60 text-base md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                Sistemas de venta especializados, sin comisiones de plataforma y adaptados 100% a la lógica de tu sector. Elige tu nicho e impulsa tus ventas.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════════════════════
            NICHE GRID
        ══════════════════════════════════════ */}
        <section className="pb-28 relative z-10">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {NICHES.map((niche, i) => (
                <Reveal key={niche.id} delay={i * 100}>
                  <div className="niche-card rounded-3xl p-8 h-full flex flex-col justify-between relative overflow-hidden group">
                    {/* Hover ambient color glow in the background of the card */}
                    <div className="absolute top-0 right-0 w-44 h-44 rounded-full blur-[70px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: niche.glowColor }} />

                    <div>
                      {/* Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-[#ffb900]"
                          style={{ background: "rgba(255, 185, 0, 0.08)", border: "1px solid rgba(255, 185, 0, 0.15)" }}>
                          {niche.icon}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                          style={niche.isAvailable
                            ? { background: "rgba(34, 197, 94, 0.12)", color: "#4ade80", border: "1px solid rgba(34, 197, 94, 0.25)" }
                            : { background: "rgba(255, 255, 255, 0.05)", color: "rgba(255, 255, 255, 0.5)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                          {niche.badge}
                        </span>
                      </div>

                      {/* Content */}
                      <h3 className="hub-headline text-3xl text-white mb-3 tracking-wide">{niche.name}</h3>
                      <p className="text-white/50 text-sm leading-relaxed mb-6">{niche.desc}</p>

                      {/* Pills */}
                      <div className="flex flex-wrap gap-2 mb-8">
                        {niche.pills.map(p => (
                          <span key={p} className="niche-pill px-3 py-1 rounded-full text-xs">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Link */}
                    <div>
                      {niche.isAvailable && niche.link ? (
                        <Link to={niche.link}
                          className="w-full py-4 rounded-2xl text-center text-sm font-bold flex items-center justify-center gap-2 transition-all hover:gap-3"
                          style={{ background: "#ffb900", color: "#080808" }}>
                          Ver solución especializada <ArrowRight size={16} />
                        </Link>
                      ) : (
                        <a href={`${WHATSAPP_URL}%20nicho%20${niche.name}`}
                          className="w-full py-4 rounded-2xl text-center text-sm font-bold flex items-center justify-center gap-2 transition-all"
                          style={{ border: "1px solid rgba(255, 255, 255, 0.12)", color: "rgba(255,255,255,0.6)" }}>
                          Me interesa / Solicitar Demo
                        </a>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            WHY SPECIALIZED ECOMMERCE
        ══════════════════════════════════════ */}
        <section className="py-24 border-t border-white/5 bg-white/[0.01]">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <Reveal className="mb-16">
              <h2 className="hub-headline text-4xl md:text-5xl text-white">¿Por qué un ecommerce especializado de nicho?</h2>
              <p className="text-white/40 text-sm md:text-base mt-2">Diferencias clave frente a plantillas estándar como Shopify o WooCommerce</p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              {[
                {
                  title: "Cero Comisiones por Venta",
                  desc: "No pagas comisiones por transacción a plataformas de e-commerce ni mensualidades exageradas. Todo lo que vendes va directo a tu cuenta."
                },
                {
                  title: "Lógica de Compra Adaptada",
                  desc: "Una florería necesita selección de fecha, dedicatoria y cálculo de zonas de delivery. Una joyería requiere zoom HD de alta fidelidad. Construimos lo que tu negocio necesita, no lo adaptamos a una plantilla rígida."
                },
                {
                  title: "Velocidad de Carga Superior",
                  desc: "Nuestros sitios están desarrollados en React y Vite con código ultraligero. Cargan en milisegundos, garantizando un posicionamiento SEO local óptimo y tasas de conversión elevadas."
                },
                {
                  title: "Entrega en Tiempo Récord",
                  desc: "Dado que ya tenemos la estructura base por nicho optimizada, entregamos tu tienda funcional e integrada en un plazo de 3 a 5 días hábiles."
                }
              ].map((item, i) => (
                <Reveal key={i} delay={i * 80} className="p-6 rounded-2xl bg-white/[0.01] border border-white/5">
                  <h3 className="text-lg font-bold text-[#ffb900] mb-2 flex items-center gap-2">
                    <Check size={16} /> {item.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            CTA FINAL
        ══════════════════════════════════════ */}
        <section className="py-24 px-6 text-center">
          <Reveal>
            <div className="container mx-auto max-w-3xl rounded-3xl p-12 md:p-20 relative overflow-hidden"
              style={{ background: "#ffb900" }}>
              <h2 className="hub-headline text-[36px] md:text-[60px] text-[#080808] leading-none mb-6">
                ¿Tu negocio no está en la lista?
              </h2>
              <p className="text-[#080808]/75 text-base md:text-lg mb-8 max-w-xl mx-auto font-medium">
                Desarrollamos soluciones personalizadas para cualquier modelo de retail o servicio en tiempo récord.
              </p>
              <a href={WHATSAPP_URL}
                className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl text-white text-base font-bold transition-all hover:scale-105"
                style={{ background: "#080808", boxShadow: "0 8px 30px rgba(0,0,0,0.25)" }}>
                Conversar por WhatsApp <ArrowRight size={18} />
              </a>
            </div>
          </Reveal>
        </section>

        <Footer />
      </div>
    </>
  );
}
