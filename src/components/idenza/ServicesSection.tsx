import { motion } from 'framer-motion';
import { LayoutDashboard, BrainCircuit, Target, ArrowRight, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionTitle from './SectionTitle';
import Button from './Button';
import Modal from './Modal';
import { useState, useRef } from 'react';

interface ServiceModalContent {
  title: string;
  description: string;
  features?: { title: string; description: string }[];
  bullets?: string[];
}

const servicesData: Record<string, ServiceModalContent> = {
  construccion: {
    title: "Webs y Catálogos de Alto Rendimiento",
    description: "Desarrollo en código puro, sin plantillas pesadas (no WordPress, no Shopify). Construimos la base donde aterrizarán tus clientes con la máxima velocidad y un diseño premium, asegurando que tu imagen transmita confianza y exclusividad.",
    features: [
      { title: "El Recepcionista Digital", description: "Sistemas donde tu cliente filtra y elige, llegando a tu WhatsApp solo para pagar y agendar." },
      { title: "Gestión de Catálogo (Módulo BD)", description: "Un panel sencillo donde actualizas precios y productos sin tocar una sola línea de código." },
      { title: "Rendimiento Extremo", description: "Velocidad de carga sub-segundo, lo cual Google premia posicionándote más alto." },
      { title: "Sin comisiones abusivas", description: "Pagos de membresía fijos. Nada de porcentajes ocultos por cada venta como hacen otras plataformas." },
    ],
  },
  vigilancia: {
    title: "El Idenza Tracker Hub",
    description: "Instalamos nuestro código de rastreo silencioso. Desde el día 1 sabrás exactamente quién visita tu negocio, de qué ciudad te leen y qué productos son los más deseados, incluso si no compran.",
    bullets: [
      "Panel de control privado (CRM) incluido",
      "Captura automática de leads cualificados",
      "Historial de comportamiento de tus visitantes",
      "Métricas clave: Tasa de conversión y páginas top",
    ],
  },
  inteligencia: {
    title: "IA como tu Consultor Privado",
    description: "No te damos hojas de cálculo aburridas. Nuestro motor de Inteligencia Artificial lee tus datos mes a mes y te entrega un reporte ejecutivo con recomendaciones de negocio claras.",
    bullets: [
      "Reportes automáticos en texto plano fáciles de leer",
      "Detección de riesgos y oportunidades (Health Score)",
      "Recomendaciones para invertir mejor tu publicidad",
      "Todo basado en la data real de tu negocio, no en teorías",
    ],
  },
};

const services = [
  {
    id: 'construccion',
    icon: LayoutDashboard,
    category: "PILAR 01",
    title: 'Construcción Digital',
    description: 'Catálogos y webs rápidas hechas a código puro. Sin plantillas genéricas.',
    accent: "text-primary",
    border: "group-hover:border-primary/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)]",
    bgIcon: "bg-primary/10"
  },
  {
    id: 'vigilancia',
    icon: Target,
    category: "PILAR 02",
    title: 'Vigilancia (Tracker)',
    description: 'Captura de comportamiento, leads y visitas en tiempo real. Adiós a volar a ciegas.',
    accent: "text-secondary",
    border: "group-hover:border-secondary/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(var(--secondary-rgb),0.15)]",
    bgIcon: "bg-secondary/10"
  },
  {
    id: 'inteligencia',
    icon: BrainCircuit,
    category: "PILAR 03",
    title: 'Inteligencia de Negocio',
    description: 'Reportes generados por IA con recomendaciones concretas para aumentar tus ventas.',
    accent: "text-accent",
    border: "group-hover:border-accent/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(var(--accent-rgb),0.2)]",
    bgIcon: "bg-accent/10"
  },
];

const ServicesSection = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const renderModalContent = (serviceId: string) => {
    const data = servicesData[serviceId];
    if (!data) return null;

    return (
      <div className="space-y-6 text-foreground">
        <h3 className="text-3xl font-sora font-bold text-primary">{data.title}</h3>
        <p className="font-inter text-lg text-muted-foreground">{data.description}</p>

        {data.features && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {data.features.map((feature, i) => (
              <div key={i} className="bg-background p-6 rounded-lg border border-border/30">
                <h4 className="font-bold mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        )}

        {data.bullets && (
          <ul className="space-y-4 mt-4 font-inter">
            {data.bullets.map((bullet, i) => (
              <li key={i} className="flex items-center gap-3">
                <CheckCircle2 className="text-secondary shrink-0" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        )}

        <Button primary className="w-full mt-6" onClick={() => setActiveModal(null)}>
          Entendido, cerrar
        </Button>
      </div>
    );
  };

  return (
    <section id="process" className="py-24 relative overflow-visible">

      {/* Subtle Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <SectionTitle subtitle="La Metodología" title="Cómo transforma tu negocio" />
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            No vendemos páginas sueltas. Implementamos un ecosistema completo enfocado en vender y medir.
          </p>
        </div>

        {/* Mobile: Horizontal Scroll / Desktop: Grid */}
        <div
          ref={scrollContainerRef}
          className="
           flex flex-col gap-6 
           md:grid md:grid-cols-3
           
           /* Mobile Horizontal Scroll Overrides */
           max-md:flex-row max-md:overflow-x-auto max-md:snap-x max-md:snap-mandatory max-md:pb-8 max-md:px-4 max-md:-mx-4
           scrollbar-hide
           scroll-smooth
        ">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              onClick={() => setActiveModal(service.id)}
              className="group cursor-pointer h-full min-w-[85vw] md:min-w-0 snap-center"
            >
              <div className={`
                relative h-full bg-card backdrop-blur-md border border-border rounded-2xl p-6 
                transition-all duration-300 ${service.border} ${service.glow} hover:bg-foreground/5 
                flex flex-col
              `}>

                {/* Tech Corner Decoration */}
                <div className="absolute top-0 right-0 p-3 opacity-30 group-hover:opacity-100 transition-opacity">
                  <div className={`w-2 h-2 rounded-full ${service.accent.replace('text', 'bg')}`} />
                </div>

                {/* Icon Area */}
                <div className="mb-6 flex justify-between items-start">
                  <div className={`w-14 h-14 rounded-xl border border-border flex items-center justify-center relative overflow-hidden group-hover:scale-110 transition-transform duration-500 ${service.bgIcon}`}>
                    <service.icon className={`w-7 h-7 ${service.accent}`} />
                    <div className={`absolute inset-0 rounded-xl border ${service.accent.replace('text', 'border')}/20 opacity-0 group-hover:opacity-100 animate-pulse`} />
                  </div>

                  {/* Subtle Numbering */}
                  <span className="font-mono text-[10px] text-muted-foreground/50 select-none">0{index + 1}</span>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                  <div className={`text-[9px] font-mono uppercase tracking-[0.2em] font-bold ${service.accent} opacity-80`}>
                    {service.category.replace('FASE ', '')}
                  </div>
                  <h3 className="text-xl font-sora font-bold text-foreground group-hover:translate-x-1 transition-transform duration-300">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-foreground/80 transition-colors">
                    {service.description}
                  </p>
                </div>

                {/* Bottom Interaction Line */}
                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  <span>Ver detalles</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Navigation Controls */}
        <div className="flex md:hidden justify-center gap-4 mt-4">
          <button
            onClick={() => scroll('left')}
            className="p-3 rounded-full bg-foreground/5 border border-border text-foreground hover:bg-foreground/10 active:scale-95 transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-3 rounded-full bg-foreground/5 border border-border text-foreground hover:bg-foreground/10 active:scale-95 transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <Modal
        isOpen={!!activeModal}
        onClose={() => setActiveModal(null)}
        content={activeModal ? renderModalContent(activeModal) : null}
      />
    </section>
  );
};

export default ServicesSection;
