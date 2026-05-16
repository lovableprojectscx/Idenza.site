import { motion } from 'framer-motion';
import { Users, CalendarCheck, ArrowUpRight } from 'lucide-react';
import SectionTitle from './SectionTitle';

const SocialProofSection = () => {
  return (
    <section className="py-20 relative overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <SectionTitle subtitle="Resultados Reales" title="Deja de perder clientes." />
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Negocios reales que ya escalaron usando el Sistema Idenza.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-border rounded-3xl p-8 hover:bg-foreground/5 transition-colors relative group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                  <Users size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-lg">Clínica Dental</h4>
                  <p className="text-muted-foreground text-sm">Sector Salud</p>
                </div>
              </div>
              <ArrowUpRight className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-4xl font-sora font-black text-foreground">+47%</span>
                <span className="text-primary font-medium mb-1">pacientes nuevos</span>
              </div>
              <p className="text-muted-foreground text-sm">Incremento comprobado en el Mes 1 tras el lanzamiento del sistema.</p>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-3xl p-8 hover:bg-foreground/5 transition-colors relative group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#CCFF00]/20 flex items-center justify-center text-[#CCFF00]">
                  <CalendarCheck size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-lg">Restaurante Local</h4>
                  <p className="text-muted-foreground text-sm">Gastronomía</p>
                </div>
              </div>
              <ArrowUpRight className="text-[#CCFF00] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-4xl font-sora font-black text-foreground">+32%</span>
                <span className="text-[#CCFF00] font-medium mb-1">reservas online</span>
              </div>
              <p className="text-muted-foreground text-sm">Optimización del funnel y botón flotante estratégico automatizado.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
