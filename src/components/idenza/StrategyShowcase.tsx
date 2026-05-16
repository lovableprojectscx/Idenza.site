import { motion } from 'framer-motion';
import { Target, MousePointer2 } from 'lucide-react';

const StrategyShowcase = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="relative w-full h-[380px] rounded-xl overflow-hidden border border-secondary/30 shadow-elevated group bg-background"
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-card border-b border-border/30 flex items-center px-4 justify-between z-20">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-muted" />
          <div className="w-3 h-3 rounded-full bg-muted" />
        </div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
          Vista de Cliente
        </div>
      </div>

      {/* Content */}
      <div className="absolute inset-0 pt-10 bg-gradient-to-b from-background to-card flex flex-col items-center justify-center p-8 transition-all duration-500">
        {/* Value Proposition */}
        <div className="text-center space-y-4 max-w-md relative">
          <h3 className="text-2xl md:text-3xl font-sora font-bold text-foreground leading-tight">
            Ayudamos a escalar tu <br />
            <span className="text-primary">Consultoría B2B</span>
          </h3>

          {/* Annotation 1 */}
          <div className="absolute -right-24 top-0 hidden group-hover:flex items-center gap-2 animate-slide-in-right">
            <div className="w-2 h-2 bg-primary rounded-full" />
            <div className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded border border-primary/30 whitespace-nowrap">
              Claridad Inmediata
            </div>
          </div>
        </div>

        {/* Authority Subtitle */}
        <div className="mt-4 text-muted-foreground text-xs md:text-sm max-w-xs text-center relative">
          <p>Más de 50 empresas han duplicado su facturación con nuestro sistema.</p>

          {/* Annotation 2 */}
          <div className="absolute -left-28 top-0 hidden group-hover:flex items-center gap-2 animate-slide-in-right [animation-delay:100ms]">
            <div className="bg-secondary/10 text-secondary text-xs font-bold px-2 py-1 rounded border border-secondary/30 whitespace-nowrap text-right">
              Prueba Social
            </div>
            <div className="w-2 h-2 bg-secondary rounded-full" />
          </div>
        </div>

        {/* Main CTA */}
        <div className="mt-8 relative">
          <button className="bg-primary text-primary-foreground px-5 py-2.5 text-sm md:text-base rounded-lg font-semibold shadow-glow">
            Agendar Sesión
          </button>

          {/* Annotation 3 */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center gap-1 animate-fade-up [animation-delay:200ms]">
            <div className="w-px h-4 bg-green-400" />
            <div className="bg-green-500/10 text-green-400 text-xs font-bold px-2 py-1 rounded border border-green-500/30 whitespace-nowrap">
              Conversión Directa
            </div>
          </div>
        </div>

        {/* Simulated Cursor */}
        <div className="absolute bottom-10 right-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300">
          <MousePointer2 className="text-foreground drop-shadow-lg fill-background" size={24} />
        </div>
      </div>

      {/* Reveal Overlay */}
      <div className="absolute inset-0 bg-background/80 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
        <div className="text-center space-y-2">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto text-primary"
          >
            <Target size={24} />
          </motion.div>
          <p className="text-foreground font-sora font-semibold tracking-wide px-4">
            Pasa el cursor para ver la Estrategia
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default StrategyShowcase;
