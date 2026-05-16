import { motion, useScroll, useTransform } from 'framer-motion';
import { Database, TrendingUp, Cpu, Workflow, Layers, Share2, Zap } from 'lucide-react';
import { useRef } from 'react';

const ScalabilitySection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);

  const modules = [
    {
      id: "marketing",
      icon: TrendingUp,
      label: "Panel de Control",
      sub: "Leads + Métricas en vivo",
      position: "top-0 -translate-y-[120%] left-1/2 -translate-x-1/2",
      delay: 0.2,
      color: "text-primary",
      borderColor: "border-primary/30",
      glow: "shadow-[0_0_30px_rgba(123,44,191,0.35)]",
      beamColor: "via-purple-600"
    },
    {
      id: "crm",
      icon: Database,
      label: "IA Consultora",
      sub: "Recomendaciones de negocio",
      position: "bottom-0 translate-y-[120%] left-1/4 -translate-x-1/2",
      delay: 0.4,
      color: "text-[#CCFF00]",
      borderColor: "border-[#CCFF00]/30",
      glow: "shadow-[0_0_30px_rgba(204,255,0,0.25)]",
      beamColor: "via-lime-400"
    },
    {
      id: "auto",
      icon: Workflow,
      label: "Módulos a Medida",
      sub: "Pagos · Reservas · APIs",
      position: "bottom-0 translate-y-[120%] right-1/4 translate-x-1/2",
      delay: 0.6,
      color: "text-violet-400",
      borderColor: "border-violet-500/30",
      glow: "shadow-[0_0_30px_rgba(139,92,246,0.3)]",
      beamColor: "via-violet-500"
    }
  ];

  return (
    <section ref={containerRef} className="py-32 relative overflow-hidden min-h-[90vh] flex items-center justify-center">

      {/* Smooth Transition Fade from Previous Section */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />

      {/* Moving Perspective Grid Background (Transparent Overlay) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Removed opaque background color to allow global bg to show */}
        <motion.div
          style={{ y }}
          className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_200px,rgba(var(--primary),0.05),transparent)] opacity-50"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block"
          >
            <h2 className="text-4xl md:text-6xl font-sora font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/60 mb-6 leading-tight">
              TU SISTEMA CRECE<br />
              <span className="text-primary">CONTIGO. SIN LÍMITES.</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              El Idenza Hub conecta tu panel de control, tu IA consultora y tus módulos a medida en un solo ecosistema. Añade funcionalidades como piezas de LEGO — sin romper nada.
            </p>
          </motion.div>
        </div>

        {/* The Modular Ecosystem Visualization */}
        <div className="relative min-h-[800px] md:min-h-0 md:h-[500px] flex flex-col md:flex-row items-center justify-center gap-12 md:gap-0">

          {/* Central Core */}
          <motion.div
            style={{ scale }}
            className="relative z-20 order-2 md:order-none my-8 md:my-0"
          >
            <div className="w-48 h-48 rounded-full bg-card backdrop-blur-xl border border-border flex items-center justify-center relative shadow-[0_0_50px_rgba(var(--primary-rgb),0.2)] group cursor-pointer hover:border-primary/50 transition-colors duration-500">
              {/* Inner Pulsing Rings */}
              <div className="absolute inset-0 rounded-full border border-primary/20 animate-[ping_3s_linear_infinite]" />
              <div className="absolute inset-4 rounded-full border border-primary/10 animate-[spin_10s_linear_infinite]" />

              <div className="text-center">
                <Cpu size={40} className="text-primary mx-auto mb-2" />
                <div className="font-mono text-xs text-primary tracking-[0.2em] font-bold">CORE_SYSTEM</div>
                <div className="text-foreground font-bold text-lg">TU WEB</div>
              </div>

              {/* Desktop Points */}
              <div className="hidden md:block">
                {modules.map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-primary rounded-full"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `rotate(${i * 120 - 90}deg) translateY(-6rem)`
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Modules - Responsive Positioning */}
          {modules.map((mod, i) => (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              animate={{
                y: [0, -10, 0],
                transition: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 1
                }
              }}
              className={`
                  relative md:absolute z-10 w-full md:w-auto flex justify-center
                  /* Order for stack: Marketing top, others bottom */
                  ${mod.id === 'marketing' ? 'order-1 md:order-none mb-4 md:mb-0 md:top-0 md:-translate-y-[130%]' : ''}
                  ${mod.id === 'crm' ? 'order-3 md:order-none mt-4 md:mt-0 md:bottom-0 md:translate-y-[130%] md:left-1/4 md:-translate-x-1/2' : ''}
                  ${mod.id === 'auto' ? 'order-3 md:order-none mt-4 md:mt-0 md:bottom-0 md:translate-y-[130%] md:right-1/4 md:translate-x-1/2' : ''}
              `}
            >
              {/* Connection Beam - Hidden on Mobile to avoid mess, visible on Desktop */}
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                whileInView={{ height: "100px", opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: mod.delay + 0.5, duration: 0.5 }}
                className={`hidden md:block absolute left-1/2 -translate-x-1/2 ${mod.id === 'marketing' ? 'top-full origin-top' : 'bottom-full origin-bottom'} w-[2px] bg-gradient-to-b from-transparent ${mod.beamColor} to-transparent`}
              />

              {/* Mobile Connection Line - Simple vertical line */}
              <div className={`md:hidden absolute w-[2px] h-12 bg-border left-1/2 -translate-x-1/2 
                  ${mod.id === 'marketing' ? 'top-full' : 'bottom-full'}
               `} />

              <div className={`
                p-6 rounded-2xl bg-card backdrop-blur-md
                border ${mod.borderColor} ${mod.glow}
                flex flex-col items-center gap-3 min-w-[240px] md:min-w-[180px]
                hover:scale-110 transition-transform duration-300 cursor-pointer group
              `}>
                <div className={`p-3 rounded-xl bg-foreground/5 ${mod.color}`}>
                  <mod.icon size={24} />
                </div>
                <div className="text-center">
                  <div className={`font-bold text-sm text-foreground`}>{mod.label}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">{mod.sub}</div>
                </div>

                {/* Active Indicator */}
                <div className={`w-1.5 h-1.5 rounded-full ${mod.color.replace('text', 'bg')} animate-pulse`} />
              </div>
            </motion.div>
          ))}

        </div>

        {/* Bottom Call to Action / Insight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-20 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-foreground/5 border border-border backdrop-blur-sm">
            <Zap size={16} className="text-yellow-400 fill-yellow-400" />
            <span className="text-sm text-foreground/80 font-medium">Idenza Hub · Sistema activo · Expansión ilimitada</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ScalabilitySection;

