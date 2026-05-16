import { motion } from 'framer-motion';
import { 
  Check, 
  MessageCircle, 
  Clock, 
  Filter, 
  CreditCard, 
  ArrowRight,
  TrendingUp,
  Package,
  Calendar
} from 'lucide-react';
import idenzaLogo from '@/assets/idenza-logo.png';
import Button from '@/components/idenza/Button';
import WhatsAppBubble from '@/components/idenza/WhatsAppBubble';
import { getWhatsAppUrl } from '@/lib/constants';
import { Helmet } from 'react-helmet-async';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const Regalos = () => {
  return (
    <div className="dark">
      <div className="min-h-screen bg-black text-white font-inter overflow-x-hidden selection:bg-[#ccff00] selection:text-black">
        <Helmet>
          <title>Idenza | Tu Tienda de Regalos 24/7</title>
          <meta name="description" content="Automatiza tu tienda de regalos con un catálogo inteligente que trabaja por ti." />
        </Helmet>

        {/* ── WELCOME BANNER ─────────────────────────────────────────────────────────── */}
        <div className="bg-[#d4af37] text-black py-4 px-6 text-center font-bold relative z-[60] shadow-lg">
          <div className="max-w-4xl mx-auto text-sm md:text-base lg:text-lg leading-snug tracking-wide uppercase">
            Felicitaciones por llevar tu negocio al siguiente nivel. <br className="hidden sm:block" />
            Estás a solo 3 días de automatizar tus ventas por completo.
          </div>
        </div>

        {/* ── SIMPLE NAVBAR ─────────────────────────────────────────────────────────── */}
        <nav className="sticky top-0 w-full z-50 backdrop-blur-md border-b border-white/5 py-4 bg-black/50">
          <div className="max-w-7xl mx-auto px-6 flex justify-center">
            <img src={idenzaLogo} alt="Idenza" className="h-8 md:h-10" />
          </div>
        </nav>

        <main>
          {/* ── HERO SECTION ───────────────────────────────────────────────────────────── */}
          <section className="relative px-6 py-12 md:py-32 flex flex-col items-center text-center max-w-5xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block px-4 py-1.5 rounded-full border border-[#ccff00]/30 bg-[#ccff00]/10 text-[#ccff00] text-[10px] md:text-sm font-semibold mb-8 tracking-wider uppercase"
            >
              Para tiendas de regalos y sorpresas
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-sora text-3xl md:text-6xl font-bold leading-[1.1] mb-6 bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent px-2"
            >
              Tu tienda de regalos, <br className="md:hidden" /> abierta 24/7.
              <span className="text-[#d4af37] block mt-2 md:mt-0 md:inline"> Sin responder lo mismo todo el día.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base md:text-xl text-white/60 max-w-2xl mb-10 px-4"
            >
              Tus clientes eligen solos y te escriben listos para pagar.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4"
            >
              <Button 
                primary 
                className="bg-[#d4af37] text-black hover:bg-[#d4af37]/90 text-base md:text-lg py-5 md:py-6 h-auto"
                onClick={() => window.open(getWhatsAppUrl("¡Hola! Vi la landing de regalos y quiero ver cómo funciona."), "_blank")}
              >
                Ver cómo funciona →
              </Button>
              <Button 
                className="border-white/20 hover:bg-white/5 text-base md:text-lg py-5 md:py-6 h-auto"
                onClick={() => window.open("https://demo-idenza-03.lovable.app", "_blank")}
              >
                Ver demo en vivo
              </Button>
            </motion.div>
          </section>

          {/* ── EL PROBLEMA ──────────────────────────────────────────────────────────── */}
          <section className="px-6 py-16 md:py-20 bg-[#050505]">
            <div className="max-w-7xl mx-auto">
              <motion.h2 
                {...fadeIn}
                className="font-sora text-2xl md:text-4xl font-bold text-center mb-12 md:mb-16 leading-tight"
              >
                ¿Sientes que tu negocio <br className="md:hidden" /> depende de que estés pegada al celular?
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {[
                  {
                    title: "Respondes lo mismo 50 veces al día",
                    desc: "¿Qué tienen para regalo de S/50? Te pasas el día enviando fotos y precios manualmente.",
                    icon: MessageCircle
                  },
                  {
                    title: "Tu catálogo de WhatsApp no filtra curiosos",
                    desc: "Llegan todos, preguntan por todo, pero compran pocos porque no encuentran rápido lo que buscan.",
                    icon: Filter
                  },
                  {
                    title: "Pierdes ventas cuando no estás disponible",
                    desc: "El cliente pregunta a las 11pm y si no contestas al momento, ya le compró a la competencia.",
                    icon: Clock
                  }
                ].map((card, i) => (
                  <motion.div
                    key={i}
                    {...fadeIn}
                    transition={{ delay: i * 0.1 }}
                    className="bg-[#0c0c0e] border border-white/5 p-6 md:p-8 rounded-2xl hover:border-[#d4af37]/30 transition-colors group"
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-lg flex items-center justify-center mb-5 md:mb-6 group-hover:scale-110 transition-transform">
                      <card.icon className="text-[#d4af37]" size={20} />
                    </div>
                    <h3 className="font-sora text-lg md:text-xl font-bold mb-3 md:mb-4">{card.title}</h3>
                    <p className="text-sm md:text-base text-white/50 leading-relaxed">{card.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ── LA SOLUCIÓN ──────────────────────────────────────────────────────────── */}
          <section className="px-6 py-16 md:py-20">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              <div className="flex-1 w-full text-center lg:text-left">
                <motion.h2 
                  {...fadeIn}
                  className="font-sora text-2xl md:text-4xl font-bold mb-8 md:mb-12"
                >
                  Un catálogo que trabaja <br />
                  <span className="text-[#ccff00]">mientras tú descansas</span>
                </motion.h2>

                <div className="space-y-6 md:space-y-8 text-left">
                  {[
                    {
                      title: "Filtros por precio, categoría y ocasión",
                      desc: "Tus clientes encuentran el regalo perfecto en segundos.",
                      icon: Filter
                    },
                    {
                      title: "El cliente llega a WhatsApp listo para pagar",
                      desc: "Recibes un mensaje con el producto exacto y los datos de envío.",
                      icon: MessageCircle
                    },
                    {
                      title: "Tú actualizas productos sin saber código",
                      desc: "Cambia stock y precios desde un panel simple e intuitivo.",
                      icon: Package
                    }
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      {...fadeIn}
                      transition={{ delay: i * 0.2 }}
                      className="flex gap-4 md:gap-6"
                    >
                      <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
                        <Check className="text-[#ccff00]" size={18} />
                      </div>
                      <div>
                        <h4 className="font-sora text-base md:text-lg font-bold mb-1">{item.title}</h4>
                        <p className="text-sm md:text-base text-white/50">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div 
                {...fadeIn}
                className="flex-1 w-full max-w-sm lg:max-w-md bg-[#d4af37]/5 border border-[#d4af37]/10 rounded-3xl p-4 md:p-8 relative"
              >
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#ccff00]/20 blur-3xl rounded-full" />
                <div className="aspect-[9/16] bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                  <iframe 
                    src="https://demo-idenza-03.lovable.app" 
                    className="w-full h-full"
                    title="Demo en vivo"
                  />
                </div>
              </motion.div>
            </div>
          </section>

          {/* ── PLANES ───────────────────────────────────────────────────────────────── */}
          <section className="px-6 py-16 md:py-20 bg-[#050505]">
            <div className="max-w-7xl mx-auto">
              <motion.h2 
                {...fadeIn}
                className="font-sora text-2xl md:text-4xl font-bold text-center mb-12 md:mb-16"
              >
                Planes a tu medida
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
                {/* Plan Entrada */}
                <motion.div 
                  {...fadeIn}
                  className="bg-[#0c0c0e] border border-white/10 p-7 md:p-10 rounded-3xl flex flex-col"
                >
                  <h3 className="font-sora text-xl md:text-2xl font-bold mb-1 md:mb-2">Entrada</h3>
                  <div className="flex items-baseline gap-2 mb-6 md:mb-8">
                    <span className="text-3xl md:text-4xl font-bold text-[#d4af37]">S/250</span>
                    <span className="text-white/40 text-[10px] md:text-sm font-bold uppercase tracking-widest">pago único</span>
                  </div>

                  <div className="space-y-3 md:space-y-4 mb-8 md:mb-10 flex-grow text-left">
                    {[
                      "Catálogo editable",
                      "Filtros avanzados",
                      "Pedidos a WhatsApp",
                      "Entrega en 3 días",
                      "Mensualidad: S/30/mes"
                    ].map((item, i) => (
                      <div key={i} className="flex gap-3 items-center">
                        <Check size={14} className="text-[#d4af37] shrink-0" />
                        <span className="text-sm md:text-base text-white/70">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-5 border-t border-white/5 mb-8 text-left">
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">Condiciones de pago</p>
                    <p className="text-xs md:text-sm text-white/60">50% al confirmar, 50% al entregar</p>
                  </div>

                  <Button 
                    className="w-full border-[#d4af37]/30 hover:bg-[#d4af37]/10 py-4 h-auto"
                    onClick={() => window.open(getWhatsAppUrl("¡Hola! Me interesa el Plan Entrada para mi tienda de regalos."), "_blank")}
                  >
                    Elegir Plan Entrada
                  </Button>
                </motion.div>

                {/* Plan Completo */}
                <motion.div 
                  {...fadeIn}
                  className="bg-[#0c0c0e] border-2 border-[#d4af37] p-7 md:p-10 rounded-3xl flex flex-col relative"
                >
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#d4af37] text-black px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    Más popular
                  </div>
                  
                  <h3 className="font-sora text-xl md:text-2xl font-bold mb-1 md:mb-2">Completo</h3>
                  <div className="flex items-baseline gap-2 mb-6 md:mb-8">
                    <span className="text-3xl md:text-4xl font-bold text-[#d4af37]">S/350</span>
                    <span className="text-white/40 text-[10px] md:text-sm font-bold uppercase tracking-widest">pago único</span>
                  </div>

                  <div className="space-y-3 md:space-y-4 mb-8 md:mb-10 flex-grow text-left">
                    {[
                      "Todo lo del plan Entrada",
                      "Checkout con Yape/Plin/QR",
                      "Panel de pedidos Pro",
                      "Soporte prioritario",
                      "Mensualidad: S/30/mes"
                    ].map((item, i) => (
                      <div key={i} className="flex gap-3 items-center">
                        <Check size={14} className="text-[#ccff00] shrink-0" />
                        <span className="text-sm md:text-base text-white/70">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-5 border-t border-white/5 mb-8 text-left">
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">Condiciones de pago</p>
                    <p className="text-xs md:text-sm text-white/60">50% al confirmar, 50% al entregar</p>
                  </div>

                  <Button 
                    primary
                    className="w-full bg-[#d4af37] text-black hover:bg-[#d4af37]/90 py-4 h-auto"
                    onClick={() => window.open(getWhatsAppUrl("¡Hola! Me interesa el Plan Completo para mi tienda de regalos."), "_blank")}
                  >
                    Elegir Plan Completo
                  </Button>
                </motion.div>
              </div>
            </div>
          </section>

          {/* ── CTA FINAL ────────────────────────────────────────────────────────────── */}
          <section className="px-6 py-16 md:py-24 bg-[#d4af37] text-black text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="max-w-4xl mx-auto relative z-10">
              <motion.h2 
                {...fadeIn}
                className="font-sora text-2xl md:text-5xl font-bold mb-6 leading-tight"
              >
                ¿Lista para dejar de <br className="hidden md:block" /> responder lo mismo?
              </motion.h2>
              <motion.p 
                {...fadeIn}
                transition={{ delay: 0.2 }}
                className="text-base md:text-xl mb-10 font-medium opacity-80 px-4"
              >
                Tu catálogo inteligente puede estar listo esta misma semana.
              </motion.p>
              <motion.div
                {...fadeIn}
                transition={{ delay: 0.4 }}
                className="px-4"
              >
                <Button 
                  className="bg-black text-white hover:bg-black/90 w-full sm:w-auto px-10 py-5 md:py-6 text-lg md:text-xl h-auto"
                  onClick={() => window.open(getWhatsAppUrl("¡Hola Jack! Quiero automatizar mi tienda de regalos."), "_blank")}
                >
                  Hablar con Jack ahora
                </Button>
              </motion.div>
            </div>
          </section>
        </main>

        <footer className="py-10 md:py-12 border-t border-white/5 text-center text-[10px] md:text-xs text-white/30 uppercase tracking-[0.2em]">
          <p>© {new Date().getFullYear()} Idenza • Tecnologia para Emprendedores</p>
        </footer>

        <WhatsAppBubble />
      </div>
    </div>
  );
};

export default Regalos;
