import { motion } from 'framer-motion';
import Navbar from '@/components/idenza/Navbar';
import Footer from '@/components/idenza/Footer';
import { getWhatsAppUrl } from '@/lib/constants';
import { Check, Zap, Target, BrainCircuit, Database, ArrowRight, ShieldCheck, Sparkles, Plus } from 'lucide-react';

// ─── SETUP DATA ─────────────────────────────────────────────────────────────
const setupPromo = {
  precioNormal: '350',
  precioPromo: '250',
  ahorro: '100',
  disponibles: 4,
};

// ─── TRACKER DATA ───────────────────────────────────────────────────────────
const trackerPlans = [
  {
    nombre: 'Free',
    precio: '0',
    descripcion: 'Pruébanos sin riesgo. Obtén una visión general de tu negocio.',
    icono: Target,
    frecuencia: '/mes',
    features: [
      { item: 'Informe cada 45 días', incl: true },
      { item: 'Análisis IA básico', incl: true },
      { item: '1 modificación / mes', incl: true },
      { item: 'Captura de Leads', incl: false },
    ]
  },
  {
    nombre: 'Starter',
    precio: '35',
    descripcion: 'Para negocios que quieren datos constantes todos los meses.',
    icono: Zap,
    destacado: true,
    frecuencia: '/mes',
    features: [
      { item: 'Informe Mensual', incl: true },
      { item: 'Análisis IA Estándar', incl: true },
      { item: '1 modificación / mes', incl: true },
      { item: 'Leads, visitas y ciudades', incl: true },
    ]
  },
  {
    nombre: 'Professional',
    precio: '55',
    descripcion: 'Para negocios en crecimiento que toman decisiones con datos.',
    icono: BrainCircuit,
    frecuencia: '/mes',
    features: [
      { item: 'Informe Mensual Completo', incl: true },
      { item: 'Oportunidades de negocio (IA)', incl: true },
      { item: '2 modificaciones / mes', incl: true },
      { item: 'Comportamiento profundo', incl: true },
    ]
  },
  {
    nombre: 'Enterprise',
    precio: '90',
    descripcion: 'Tu socio tecnológico VIP. Nivel élite de análisis.',
    icono: Sparkles,
    frecuencia: '/mes',
    features: [
      { item: 'Informe Quincenal', incl: true },
      { item: 'Auditoría + Mapas de calor', incl: true },
      { item: '3 modificaciones / mes', incl: true },
      { item: 'Soporte prioritario 24/7', incl: true },
    ]
  }
];

// ─── DATABASE DATA ──────────────────────────────────────────────────────────
const dbModules = [
  {
    nombre: 'BD Básica',
    precioSolo: '30',
    precioCombo: '20',
    descripcion: 'Catálogo editable de productos. Actualiza tú mismo.',
  },
  {
    nombre: 'BD Profesional',
    precioSolo: '85',
    precioCombo: '65',
    descripcion: 'Inventario avanzado, pedidos e historial de clientes.',
  }
];

const Planes = () => {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 text-foreground">
      <Navbar />

      <main className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10 mb-16 mt-10">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-foreground/[0.07] border border-foreground/20 text-foreground font-mono text-[10px] tracking-[0.3em] uppercase mb-8">
            <Sparkles className="w-3 h-3 text-primary" /> Ecosistema de Conversión
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl sm:text-6xl md:text-7xl font-sora font-black tracking-tight leading-[1.1] mb-8">
            Paga por el valor, <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent italic pr-2">no por el código.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto font-medium mb-16">
            Construimos tu infraestructura digital con un pago único, y luego pagas una pequeña mensualidad por el cerebro (Tracker e IA) que la hace vender más.
          </motion.p>
        </div>

        {/* ─── 1. SETUP INICIAL ─── */}
        <div className="max-w-4xl mx-auto mb-24 relative z-10">
          <div className="absolute -inset-10 bg-gradient-to-r from-primary/10 to-transparent blur-[50px] opacity-50 pointer-events-none" />
          
          <div className="bg-card border border-primary/40 rounded-[2.5rem] p-8 sm:p-12 relative overflow-hidden shadow-[0_20px_60px_-15px_rgba(var(--primary-rgb),0.2)] flex flex-col md:flex-row items-center gap-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[60px] pointer-events-none" />
            
            <div className="flex-1 text-left relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold uppercase tracking-widest mb-4">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> Oferta Lanzamiento
              </div>
              <h2 className="text-3xl sm:text-4xl font-sora font-black text-foreground mb-4">
                Setup: Arquitectura Web Inicial
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                El pago único para construir tu web, conectar el dominio, instalar el Tracker Hub y dejar todo listo para vender. Construido en código puro, sin plantillas.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-foreground/80"><Check className="text-primary w-4 h-4" /> Diseño personalizado de alto rendimiento</div>
                <div className="flex items-center gap-3 text-sm text-foreground/80"><Check className="text-primary w-4 h-4" /> Integración del Recepcionista Digital (WhatsApp)</div>
                <div className="flex items-center gap-3 text-sm text-foreground/80"><Check className="text-primary w-4 h-4" /> Hosting ultra-rápido incluido</div>
              </div>
            </div>

            <div className="bg-card p-8 rounded-3xl border border-border w-full md:w-auto shrink-0 relative z-10 text-center">
              <p className="text-[10px] text-muted-foreground font-mono tracking-widest uppercase mb-2">Pago Único</p>
              <div className="flex items-center justify-center gap-3 mb-1">
                <span className="text-lg text-muted-foreground line-through decoration-red-500">S/ {setupPromo.precioNormal}</span>
                <span className="text-5xl font-black font-sora text-primary">S/ {setupPromo.precioPromo}</span>
              </div>
              <p className="text-xs text-primary/80 font-bold mb-6">Ahorras S/ {setupPromo.ahorro}</p>
              
              <a
                href={getWhatsAppUrl(`¡Hola! Quiero aprovechar la promo de Setup a S/${setupPromo.precioPromo} para mi tienda.`)}
                target="_blank" rel="noopener noreferrer"
                className="w-full py-4 bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
              >
                Solicitar Setup <ArrowRight className="w-4 h-4" />
              </a>
              <p className="text-[10px] text-muted-foreground/60 mt-4">Solo {setupPromo.disponibles} cupos disponibles con este precio.</p>
            </div>
          </div>
        </div>

        {/* ─── 2. TRACKER PLANS ─── */}
        <div className="max-w-7xl mx-auto mb-24 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-sora font-black mb-4">El Cerebro: Planes Tracker</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              La inteligencia mensual que captura leads, analiza visitas y te entrega informes generados por IA.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trackerPlans.map((plan, i) => (
              <motion.div
                key={plan.nombre}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col ${
                  plan.destacado
                    ? 'bg-card border border-primary/50 shadow-[0_0_40px_rgba(var(--primary-rgb),0.15)]'
                    : 'bg-card border border-border'
                }`}
              >
                {plan.destacado && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-[8px] font-black tracking-widest uppercase rounded-b-lg">Recomendado</div>
                )}
                
                <plan.icono className={`w-8 h-8 mb-6 ${plan.destacado ? 'text-primary' : 'text-muted-foreground'}`} />
                <h3 className="text-2xl font-sora font-bold text-foreground mb-2">{plan.nombre}</h3>
                <p className="text-xs text-muted-foreground h-10 mb-6 leading-relaxed">{plan.descripcion}</p>
                
                <div className="mb-8 flex items-end gap-1">
                  <span className="text-xl text-muted-foreground font-medium">S/</span>
                  <span className={`text-5xl font-black font-sora tracking-tighter ${plan.destacado ? 'text-primary' : 'text-foreground'}`}>{plan.precio}</span>
                  <span className="text-sm text-muted-foreground font-medium mb-1">{plan.frecuencia}</span>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className={`w-4 h-4 mt-0.5 ${f.incl ? 'text-primary' : 'text-muted-foreground/30'}`} />
                      <span className={`text-sm ${f.incl ? 'text-foreground/80' : 'text-muted-foreground/40'}`}>{f.item}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={getWhatsAppUrl(`¡Hola! Me interesa el plan Tracker ${plan.nombre}.`)}
                  target="_blank" rel="noopener noreferrer"
                  className={`w-full py-3 rounded-xl text-[11px] font-black uppercase tracking-widest text-center transition-all ${
                    plan.destacado
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-foreground/[0.07] border border-border text-foreground hover:bg-foreground/10'
                  }`}
                >
                  Seleccionar
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ─── 3. DATABASE ADDONS ─── */}
        <div className="max-w-5xl mx-auto relative z-10 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-sora font-black mb-4 flex items-center justify-center gap-3">
              <Database className="text-primary" /> Módulos de Catálogo
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Si tienes muchos productos, necesitas un panel para autogestionarlos sin depender de un programador.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {dbModules.map((db, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-card border border-border rounded-[2rem] p-8 hover:border-primary/30 transition-colors group"
              >
                <h3 className="text-2xl font-sora font-bold text-foreground mb-2">{db.nombre}</h3>
                <p className="text-sm text-muted-foreground mb-8">{db.descripcion}</p>
                
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-foreground/[0.05] border border-border">
                    <span className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Solo el módulo</span>
                    <span className="text-xl font-bold text-foreground">S/ {db.precioSolo}<span className="text-xs text-muted-foreground font-normal">/mes</span></span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-xl bg-primary/10 border border-primary/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/20 blur-2xl" />
                    <div className="relative z-10">
                      <span className="text-xs text-primary uppercase tracking-widest font-mono font-bold flex items-center gap-1"><Plus size={12}/> COMBINADO CON TRACKER</span>
                      <p className="text-[10px] text-primary/60 mt-0.5">Ahorro automático aplicado</p>
                    </div>
                    <span className="text-2xl font-black text-primary relative z-10">S/ {db.precioCombo}<span className="text-xs font-medium text-primary/60">/mes</span></span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ─── INFRASTRUCTURE (ANNUAL) ─── */}
        <div className="max-w-4xl mx-auto text-center relative z-10 border-t border-border pt-16">
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.3em] mb-4">Costos de Infraestructura</p>
          <div className="flex flex-wrap justify-center gap-4 text-xs font-medium text-muted-foreground">
            <span className="bg-foreground/[0.05] px-4 py-2 rounded-full border border-border flex items-center gap-2"><Check size={12} className="text-emerald-500"/> Hosting Incluido (Vercel)</span>
            <span className="bg-foreground/[0.05] px-4 py-2 rounded-full border border-border flex items-center gap-2"><Check size={12} className="text-emerald-500"/> SSL de Seguridad Incluido</span>
            <span className="bg-foreground/[0.05] px-4 py-2 rounded-full border border-border flex items-center gap-2"><ShieldCheck size={12} className="text-amber-500"/> Dominio Anual: ~S/ 90-100 (Pago externo)</span>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default Planes;
