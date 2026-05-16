import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/constants';

const CTASection = () => {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="relative rounded-[3rem] overflow-hidden">
          {/* Advanced Gradient Map */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/20" />

          {/* Animated Mesh */}
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.15),transparent_50%)]" />

          <div className="relative z-10 p-10 md:p-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-4xl md:text-6xl font-sora font-extrabold text-foreground mb-6 leading-tight">
                ¿Listo para construir algo que<br />
                <span className="text-primary italic pr-2">no se quede pequeño?</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                Cada proyecto Idenza incluye el Hub completo: panel de control, consultoría IA y arquitectura modular escalable.
                Cupos limitados por trimestre.
              </p>
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.a
                href={getWhatsAppUrl("Hola, busco una arquitectura digital de alto nivel. Quisiera agendar una consultoría.")}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center gap-3 group uppercase tracking-widest"
              >
                Agendar Consultoría
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </motion.a>

              <motion.a
                href={getWhatsAppUrl("¡Hola! Tengo una consulta sobre Idenza Arquitectura Digital.")}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-foreground/5 border border-border text-foreground rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-foreground/10 transition-all flex items-center gap-3"
              >
                Hablar con un asesor
                <MessageCircle size={18} className="text-primary" />
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
