import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import StrategyShowcase from './StrategyShowcase';

const StrategySection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <StrategyShowcase />
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono mb-6">
              <Sparkles size={14} />
              <span>NO ES MAGIA, ES ESTRATEGIA</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-sora font-bold text-foreground leading-tight mb-6">
              Diseñamos para <br />
              <span className="text-secondary">generar Confianza.</span>
            </h2>

            <p className="text-muted-foreground text-lg leading-relaxed">
              No te entregamos solo "archivos de código". Te entregamos un activo digital
              pensado psicológicamente.
              <br /><br />
              Cada color, cada frase y cada botón tiene un propósito:{' '}
              <strong className="text-foreground">
                Posicionarte como la mejor opción del mercado.
              </strong>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StrategySection;
