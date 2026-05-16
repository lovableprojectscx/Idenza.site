import { motion } from 'framer-motion';
import { X, CheckCircle2, Zap, Target, ShieldCheck, ArrowRight } from 'lucide-react';
import SectionTitle from './SectionTitle';
import idenzaAuthority from '../../assets/idenza-authority.png';

const ProblemSection = () => {
  return (
    <section id="problem" className="py-24 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      {/* Dynamic Background Glows Removed for cleaner look */}

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left: Copy with high-impact messaging */}
          <div>
            <SectionTitle
              subtitle="Por qué elegir IDENZA"
              title={
                <span className="leading-tight">
                  Hacemos que tu negocio llegue a más clientes{" "}
                  <span className="text-primary italic underline decoration-primary/30 underline-offset-8">sin que hagas nada técnico.</span>
                </span>
              }
            />
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed max-w-xl">
              Somos IDENZA. No necesitas entender de tecnología, programar o lidiar con sistemas complejos.{" "}
              <span className="text-foreground font-bold">Nosotros lo construimos por ti para que tú te enfoques en vender.</span>
            </p>

            <div className="space-y-6">
              {[
                {
                  title: "CAOS OPERATIVO POR WHATSAPP",
                  desc: "Pasas horas respondiendo precios y detalles a curiosos que nunca compran, perdiendo ventas por demoras en la atención.",
                  icon: Zap,
                  color: "text-secondary",
                  bg: "bg-secondary/10"
                },
                {
                  title: "WEBS QUE NO VENDEN",
                  desc: "Un folleto digital muerto. No sabes cuánta gente lo visita, de dónde viene, ni por qué la publicidad no funciona.",
                  icon: Target,
                  color: "text-foreground",
                  bg: "bg-foreground/10"
                },
                {
                  title: "TECNOLOGÍA INACCESIBLE",
                  desc: "Plataformas como Shopify son caras, difíciles de usar y no te pertenecen. Agencias o freelancers te dejan a la deriva.",
                  icon: ShieldCheck,
                  color: "text-primary",
                  bg: "bg-primary/10"
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="flex gap-5 p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                    <item.icon className={item.color} size={24} />
                  </div>
                  <div>
                    <h4 className="text-foreground font-bold text-base mb-1">{item.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Emotional Visual Comparison */}
          <div className="relative">
            <div className="flex flex-col gap-8">

              {/* Average Web - "The Pain" */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative group/pain"
              >
                <div className="absolute -top-4 left-6 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-[10px] font-bold text-red-500 uppercase tracking-widest z-10 backdrop-blur-md">
                  PLANTILLA GENÉRICA: SIN FUTURO
                </div>
                <div className="h-[200px] rounded-3xl overflow-hidden grayscale contrast-75 brightness-75 border border-border relative">
                  {/* Generic/Boring UI Placeholder */}
                  <div className="absolute inset-0 bg-card flex flex-col p-6 space-y-4">
                    <div className="w-24 h-4 bg-foreground/10 rounded-full" />
                    <div className="w-full h-24 bg-foreground/5 rounded-2xl border border-dashed border-border" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="w-full h-12 bg-foreground/5 rounded-xl" />
                      <div className="w-full h-12 bg-foreground/5 rounded-xl" />
                    </div>
                  </div>
                  {/* Overlay indicating problems */}
                  <div className="absolute inset-0 bg-red-950/20 flex items-center justify-center opacity-0 group-hover/pain:opacity-100 transition-opacity">
                    <div className="flex flex-col items-center gap-2">
                      <X size={40} className="text-red-500/40" />
                      <span className="text-red-500 font-mono text-[10px] tracking-tighter">SIN AUTORIDAD • SIN VENTAS</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Connector */}
              <div className="flex justify-center -my-4 relative z-20">
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.5)] border-2 border-background"
                >
                  <ArrowRight className="text-primary-foreground rotate-90" size={20} />
                </motion.div>
              </div>

              {/* Idenza Web - "The Win" */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="relative group/win"
              >
                <div className="absolute -top-4 right-6 px-3 py-1 bg-primary/20 border border-primary/40 rounded-full text-[10px] font-bold text-primary uppercase tracking-widest z-30 backdrop-blur-md shadow-[0_0_15px_rgba(var(--primary),0.3)] anim-pulse">
                  SISTEMA IDENZA: ÉLITE + ESCALABLE
                </div>

                <div className="h-[280px] rounded-3xl overflow-hidden border-2 border-primary/30 shadow-[0_0_40px_rgba(var(--primary-rgb),0.15)] relative bg-card">

                  {/* Ultra-Fast Loading Overlay */}
                  <motion.div
                    initial={{ opacity: 1 }}
                    whileInView={{ opacity: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    className="absolute inset-0 z-20 bg-card flex flex-col items-center justify-center p-8 pointer-events-none"
                  >
                    <div className="w-full max-w-[200px] h-1 bg-foreground/10 rounded-full overflow-hidden mb-3">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="h-full bg-primary"
                      />
                    </div>
                    <span className="text-[10px] font-mono text-primary/60 animate-pulse tracking-widest">LOADING_ULTRA_FAST_V.2.0</span>
                  </motion.div>

                  {/* Main Mockup with Reveal Animation */}
                  <motion.div
                    initial={{ scale: 1.1, filter: "blur(10px)", opacity: 0 }}
                    whileInView={{ scale: 1, filter: "blur(0px)", opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.4, duration: 0.8, ease: "easeOut" }}
                    className="w-full h-full"
                  >
                    <img
                      src={idenzaAuthority}
                      alt="Idenza Authority Mockup"
                      className="w-full h-full object-cover group-hover/win:scale-105 transition-transform duration-700"
                    />
                  </motion.div>

                  {/* Speed Badge - Pops up after load */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 2.2, type: "spring", damping: 12 }}
                    className="absolute top-6 left-6 px-4 py-2 bg-primary rounded-xl shadow-[0_0_20px_rgba(var(--primary-rgb),0.6)] z-30"
                  >
                    <div className="flex items-center gap-2">
                      <Zap size={14} className="text-primary-foreground animate-pulse" />
                      <span className="text-primary-foreground font-bold text-xs tracking-tight">CARGA: 0.5s</span>
                    </div>
                  </motion.div>

                  {/* Floating Trust Markers */}
                  <div className="absolute inset-0 pointer-events-none">
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 2.5 }}
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                      >
                        <ShieldCheck size={60} className="text-primary/20" />
                      </motion.div>
                    </motion.div>

                    {/* Data Tags */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 2.7 }}
                      className="absolute bottom-6 left-6 flex flex-col gap-2"
                    >
                      <div className="px-3 py-1.5 rounded-lg bg-background/80 backdrop-blur-md border border-primary/30 text-[9px] font-bold text-foreground flex items-center gap-2">
                        <Zap size={10} className="text-primary" />
                        HUB INTEGRADO
                      </div>
                      <div className="px-3 py-1.5 rounded-lg bg-background/80 backdrop-blur-md border border-primary/30 text-[9px] font-bold text-foreground flex items-center gap-2">
                        <CheckCircle2 size={10} className="text-primary" />
                        ESCALA SIN LÍMITES
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
