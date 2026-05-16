import { motion } from 'framer-motion';
import { Search, Code, Cpu, LineChart, Handshake } from 'lucide-react';
import SectionTitle from './SectionTitle';

const steps = [
  {
    icon: Search,
    title: "1. Te conocemos",
    desc: "Analizamos tu rubro y qué buscan tus clientes.",
    color: "text-secondary",
    bg: "bg-secondary/15",
    border: "border-secondary/50"
  },
  {
    icon: Code,
    title: "2. Arquitectura",
    desc: "Diseño premium, rápido y enfocado en que te escriban.",
    color: "text-secondary",
    bg: "bg-secondary/15",
    border: "border-secondary/50"
  },
  {
    icon: Cpu,
    title: "3. Instalamos Hub",
    desc: "30 días gratis de nuestro panel de control de datos.",
    color: "text-primary",
    bg: "bg-primary/15",
    border: "border-primary/50"
  },
  {
    icon: LineChart,
    title: "4. Ves resultados",
    desc: "Empiezan a llegar leads reales a tu WhatsApp.",
    color: "text-secondary",
    bg: "bg-secondary/15",
    border: "border-secondary/50"
  },
  {
    icon: Handshake,
    title: "5. Pagas si funciona",
    desc: "Crecimiento continuo asegurado sin riesgos.",
    color: "text-accent",
    bg: "bg-accent/15",
    border: "border-accent/50"
  }
];

const HowItWorksSection = () => {
  return (
    <section className="py-24 relative bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <SectionTitle subtitle="Tranquilidad total" title="Cómo funciona" />
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Un proceso tan simple que parece magia. Tú sigues operando tu negocio mientras nosotros llenamos tu embudo de ventas.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Horizontal Line connecting steps (Desktop) */}
          <div className="hidden md:block absolute top-[2.5rem] left-[10%] right-[10%] h-0.5 bg-border z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="flex flex-col items-center text-center group"
              >
                <div className={`w-20 h-20 rounded-full ${step.bg} ${step.border} border-2 flex items-center justify-center mb-6 relative group-hover:scale-110 transition-transform`}>
                  <step.icon className={`${step.color} w-8 h-8`} />
                  {/* Subtle pulse ring */}
                  <div className={`absolute inset-0 rounded-full border ${step.border} opacity-0 group-hover:opacity-100 animate-ping`} />
                </div>
                <h3 className="font-bold text-foreground text-lg mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed px-2">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
