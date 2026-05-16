import { motion } from "framer-motion";
import { Check, X, ShoppingBag, Zap, Shield, MessageSquare, ArrowRight, Layout, TrendingUp, Sparkles, Smartphone, BarChart3, Bot, Star, CreditCard } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { getWhatsAppUrl } from "@/lib/constants";
import Navbar from "@/components/idenza/Navbar";
import Footer from "@/components/idenza/Footer";

const GoldText = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <span className={`text-[#d4af37] ${className}`}>{children}</span>
);

const LimeText = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <span className={`text-[#ccff00] ${className}`}>{children}</span>
);

export default function Ecommerce() {
  const WHATSAPP_URL = getWhatsAppUrl("Hola Jack, quiero información sobre el Kit Ecommerce");

  const plans = [
    {
      name: "Starter",
      price: "S/250",
      features: [
        "Página web + catálogo filtrable",
        "Pedidos a WhatsApp",
        "SEO local",
        "Panel editable",
        "QR Dinámico para volantes y redes",
        "Entrega 3 días"
      ]
    },
    {
      name: "Pro",
      price: "S/350",
      popular: true,
      features: [
        "Todo lo del Starter +",
        "Sistema de pedidos Yape/Plin/QR",
        "Código de seguimiento",
        "Panel admin de pedidos",
        "Ofertas con contador",
        "QR Dinámico para volantes y redes",
        "Entrega 4 días"
      ]
    },
    {
      name: "Business",
      price: "S/500",
      badge: "2 módulos gratis a elección",
      features: [
        "Todo lo del Pro +",
        "Chatbot IA 24/7",
        "CRM básico",
        "Contador de stock limitado",
        "Contador de visitas",
        "QR Dinámico para volantes y redes",
        "Entrega 5 días"
      ]
    }
  ];

  const modules = [
    { name: "Ruleta de descuentos", price: "S/50", image: "/ecommerce_module_ruleta_1778182475945.png" },
    { name: "Raspadito digital", price: "S/50", image: "/ecommerce_module_raspadito_1778182494607.png" },
    { name: "Sistema de puntos", price: "S/80", image: "/ecommerce_module_loyalty_individual_1778182564665.png" },
    { name: "Reseñas y valoraciones", price: "S/40", image: "/ecommerce_module_reviews_individual_1778182582982.png" },
    { name: "Importar desde Excel", price: "S/50", image: "/ecommerce_module_excel_individual_1778182604185.png" },
    { name: "Pasarela Culqi", price: "S/100", image: "/ecommerce_module_culqi_individual_1778182621919.png" }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#ccff00]/30 selection:text-[#ccff00]">
      <Helmet>
        <title>Kit Ecommerce Idenza | Vende Sin Comisiones</title>
        <meta name="description" content="Tu propio ecommerce sin mensualidades de plataforma ni comisiones. Sistema 100% tuyo con pedidos a WhatsApp y pagos QR." />
      </Helmet>

      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
            >
              <LimeText className="text-xs font-mono uppercase tracking-[0.2em] font-bold">Kit Ecommerce para tu negocio</LimeText>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-7xl font-bold font-sora leading-[1.1] mb-8"
            >
              Tu negocio vende solo. <br />
              <GoldText>Tú solo confirmas y entregas.</GoldText>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-white/60 mb-12 max-w-2xl mx-auto font-inter"
            >
              Sin Shopify, sin plantillas genéricas, sin comisiones por venta. <br className="hidden md:block" />
              Un sistema robusto que te pertenece al 100%.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <a 
                href="#planes" 
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#d4af37] text-black font-bold hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                Ver planes <ArrowRight size={18} />
              </a>
              <a 
                href="#" 
                className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/20 hover:bg-white/5 transition-all text-sm font-semibold"
              >
                Ver demo en vivo
              </a>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#d4af37]/10 blur-[120px] rounded-full -z-10" />
      </section>

      {/* VS SECTION */}
      <section className="py-20 bg-white/5 border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold font-sora text-center mb-12">Por qué elegir <GoldText>Idenza</GoldText></h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Other Platforms */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/40">
                    <X size={20} />
                  </div>
                  <h3 className="font-bold text-white/60">Shopify y otras plataformas</h3>
                </div>
                <ul className="space-y-6">
                  {[
                    "$29-79/mes solo de plataforma",
                    "Plantillas genéricas",
                    "Comisiones por venta",
                    "Soporte en inglés",
                    "Si dejas de pagar pierdes todo"
                  ].map((text, i) => (
                    <li key={i} className="flex items-center gap-4 text-sm text-white/40 font-inter">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Idenza Kit */}
              <div className="bg-[#d4af37]/5 border border-[#d4af37]/20 rounded-3xl p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles size={120} className="text-[#d4af37]" />
                </div>
                
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37]">
                    <Check size={20} />
                  </div>
                  <h3 className="font-bold text-[#d4af37]">Kit Ecommerce Idenza</h3>
                </div>
                <ul className="space-y-6">
                  {[
                    "S/250-500 una sola vez",
                    "100% personalizado",
                    "Sin comisiones por venta",
                    "Soporte directo en español",
                    "El sistema es tuyo para siempre"
                  ].map((text, i) => (
                    <li key={i} className="flex items-center gap-4 text-sm text-white font-medium font-inter">
                      <Check size={14} className="text-[#ccff00]" />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEMO SECTION */}
      <section className="py-24">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold font-sora mb-6">Así se ve tu <GoldText>tienda en vivo</GoldText></h2>
            <p className="text-white/60 font-inter mb-12 max-w-2xl mx-auto">
              Navega el demo real — filtra productos, simula un pedido y ve cómo llega a WhatsApp
            </p>
            
            <div className="relative group">
              {/* Glass frame */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#d4af37]/20 to-[#ccff00]/20 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative rounded-[2rem] border border-white/10 overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.15)]">
                <iframe 
                  src="https://demo-idenza-03.lovable.app" 
                  className="w-full h-[500px] md:h-[600px] bg-white"
                  title="Idenza Ecommerce Demo"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="mt-12 space-y-8">
              <p className="text-lg text-white/80 font-inter max-w-xl mx-auto">
                El tuyo lo personalizamos con <GoldText>tu marca</GoldText>, tus productos y tus colores. <br className="hidden md:block" />
                Entrega en <LimeText>3-5 días</LimeText>.
              </p>
              
              <a 
                href={WHATSAPP_URL}
                className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-[#d4af37] text-black font-bold text-lg hover:scale-105 transition-all shadow-xl shadow-[#d4af37]/20"
              >
                Quiero mi Kit Ecommerce <ShoppingBag size={20} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PLANS SECTION */}
      <section id="planes" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-sora mb-4">Planes a tu medida</h2>
            <p className="text-white/60 font-inter">Incluyen mantenimiento de S/30/mes y dominio gratis el 1er año</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-8 rounded-[2rem] border transition-all hover:scale-[1.02] ${
                  plan.popular 
                    ? 'bg-white/10 border-[#d4af37] ring-1 ring-[#d4af37]/50 shadow-[0_0_40px_rgba(212,175,55,0.1)]' 
                    : 'bg-white/5 border-white/10'
                } flex flex-col`}
              >
                {plan.badge && (
                  <div className="mb-4">
                    <span className="px-3 py-1 rounded-full bg-[#ccff00]/20 text-[#ccff00] text-[10px] font-bold uppercase tracking-wider">
                      {plan.badge}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold font-sora">{plan.name}</h3>
                  {plan.popular && <div className="p-2 rounded-lg bg-[#d4af37]/20"><Sparkles size={16} className="text-[#d4af37]" /></div>}
                </div>

                {/* Plan Blueprint/Preview */}
                <div className="relative aspect-square mb-8 bg-black/40 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center group-hover:border-[#d4af37]/30 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#d4af37]/5 to-transparent opacity-50" />
                  <div className="relative z-10 w-4/5 h-4/5 border border-[#d4af37]/20 rounded-xl flex items-center justify-center">
                    {/* Mimic the blueprint style with CSS lines if image not present, 
                        or user can place the images provided here */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#d4af37 1px, transparent 1px), linear-gradient(90deg, #d4af37 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                    <div className="w-full h-full flex flex-col items-center justify-center p-4">
                      <Smartphone className={`w-1/2 h-1/2 ${plan.popular ? 'text-[#d4af37]' : 'text-white/20'} mb-4`} />
                      <div className="text-[8px] font-mono text-center opacity-40 uppercase tracking-tighter leading-none">
                        {plan.name === 'Starter' && "Página Web + Catálogo"}
                        {plan.name === 'Pro' && "Pedidos + Panel Admin"}
                        {plan.name === 'Business' && "Chatbot IA + CRM + Analytics"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <span className="text-4xl font-bold font-sora">{plan.price}</span>
                  <span className="text-white/40 text-sm font-mono ml-2">pago único</span>
                </div>

                <ul className="space-y-4 mb-10 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-3 text-sm text-white/80 font-inter">
                      <Check size={16} className="text-[#d4af37] shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <a 
                  href={WHATSAPP_URL + `%20plan%20${plan.name}`}
                  className={`w-full py-4 rounded-xl text-center text-sm font-bold transition-all ${
                    plan.popular ? 'bg-[#d4af37] text-black hover:opacity-90' : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  Empezar ahora
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MODULES SECTION */}
      <section className="py-20 bg-white/5 border-y border-white/5">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <h2 className="text-2xl font-bold font-sora mb-12">Potencia tu tienda con <GoldText>Módulos Pro</GoldText></h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {modules.map((m, i) => (
              <div key={m.name} className="p-0 rounded-3xl bg-black border border-white/10 text-left hover:border-[#d4af37]/40 transition-all group overflow-hidden flex flex-col">
                <div className="aspect-square bg-gradient-to-br from-white/5 to-transparent p-6 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-[#d4af37]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <img 
                    src={m.image} 
                    alt={m.name} 
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 border-t border-white/5">
                  <h4 className="text-sm font-bold font-sora mb-1">{m.name}</h4>
                  <p className="text-xs text-[#ccff00] font-mono">{m.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAYMENT CONDITIONS */}
      <section className="py-24">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto p-10 rounded-[2.5rem] bg-gradient-to-b from-white/10 to-transparent border border-white/10">
            <h3 className="text-xl font-bold font-sora mb-6 underline decoration-[#d4af37] underline-offset-8">Condiciones de pago</h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-12">
              <div className="text-center">
                <p className="text-3xl font-bold font-sora mb-2">50%</p>
                <p className="text-xs text-white/40 font-mono uppercase tracking-widest">Al confirmar</p>
              </div>
              <div className="h-px w-12 bg-white/10 hidden md:block" />
              <div className="text-center">
                <p className="text-3xl font-bold font-sora mb-2 text-[#ccff00]">50%</p>
                <p className="text-xs text-white/40 font-mono uppercase tracking-widest">Al entregar</p>
              </div>
            </div>
            <p className="mt-10 text-sm text-white/40 font-inter italic">
              "Dominio (.com o .shop) incluido gratis el primer año"
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 pb-24">
        <div className="container mx-auto">
          <div className="rounded-[3rem] bg-[#d4af37] p-12 md:p-24 text-center text-black relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
              <div className="absolute top-0 left-0 w-64 h-64 border-[40px] border-black rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-96 h-96 border-[60px] border-black rounded-full translate-x-1/3 translate-y-1/3" />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-6xl font-bold font-sora mb-8 leading-tight">
                ¿Listo para vender sin <br className="hidden md:block" /> depender de nadie?
              </h2>
              <a 
                href={WHATSAPP_URL}
                className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-black text-white font-bold text-lg hover:scale-105 transition-all shadow-xl shadow-black/20"
              >
                Quiero mi Kit Ecommerce <ShoppingBag size={20} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
