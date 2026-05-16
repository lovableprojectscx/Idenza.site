import { motion } from 'framer-motion';
import { LayoutDashboard, BrainCircuit, Puzzle, Users, MapPin, BarChart3, Sparkles, TrendingUp, Zap, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const tabs = [
  { id: 'dashboard', label: 'Panel de Control', icon: LayoutDashboard, color: 'text-primary', border: 'border-primary/40', bg: 'bg-primary/10' },
  { id: 'ai', label: 'Consultoría IA', icon: BrainCircuit, color: 'text-secondary', border: 'border-secondary/40', bg: 'bg-secondary/10' },
  { id: 'modular', label: 'Arquitectura', icon: Puzzle, color: 'text-accent', border: 'border-accent/40', bg: 'bg-accent/10' },
];

// Mock Dashboard Preview
const DashboardPreview = () => (
  <motion.div
    key="dashboard"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.4 }}
    className="space-y-4"
  >
    {/* Stat Cards */}
    <div className="grid grid-cols-3 gap-3">
      {[
        { icon: Users, label: 'Leads este mes', value: '47', delta: '+18%', color: 'text-primary', bg: 'bg-primary/10' },
        { icon: MapPin, label: 'Ciudades activas', value: '6', delta: '+2 nuevas', color: 'text-secondary', bg: 'bg-secondary/10' },
        { icon: BarChart3, label: 'Conversión', value: '8.3%', delta: '+1.2pp', color: 'text-accent', bg: 'bg-accent/10' },
      ].map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className={`${stat.bg} border border-border rounded-xl p-3 flex flex-col gap-2`}
        >
          <stat.icon size={14} className={stat.color} />
          <div className={`text-xl font-bold font-sora ${stat.color}`}>{stat.value}</div>
          <div className="text-[9px] text-muted-foreground/50 font-mono uppercase tracking-wider leading-tight">{stat.label}</div>
          <div className="text-[9px] text-primary/80 font-mono">{stat.delta}</div>
        </motion.div>
      ))}
    </div>

    {/* Lead List Mock */}
    <div className="bg-card border border-border rounded-xl p-3 space-y-2">
      <div className="text-[9px] font-mono text-muted-foreground/40 uppercase tracking-widest mb-3">Últimos contactos</div>
      {[
        { name: 'Carlos R.', origin: 'Lima Centro', time: '2 min', status: 'Nuevo' },
        { name: 'Sofía M.', origin: 'Miraflores', time: '1h', status: 'En seguimiento' },
        { name: 'Diego P.', origin: 'San Isidro', time: '3h', status: 'Cerrado' },
      ].map((lead, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + i * 0.1 }}
          className="flex items-center justify-between py-1.5 border-b border-border last:border-0"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[9px] text-primary font-bold">
              {lead.name[0]}
            </div>
            <div>
              <div className="text-xs text-foreground/80 font-medium">{lead.name}</div>
              <div className="text-[9px] text-muted-foreground/40 font-mono">{lead.origin}</div>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${
              lead.status === 'Nuevo' ? 'bg-primary/20 text-primary' :
              lead.status === 'Cerrado' ? 'bg-secondary/20 text-secondary' :
              'bg-accent/20 text-accent'
            }`}>{lead.status}</div>
            <div className="text-[8px] text-muted-foreground/30 mt-1">{lead.time}</div>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

// Mock AI Preview
const AIPreview = () => (
  <motion.div
    key="ai"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.4 }}
    className="space-y-4"
  >
    {/* AI Header */}
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary/10 border border-secondary/20">
      <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
        <Sparkles size={14} className="text-secondary" />
      </div>
      <div>
        <div className="text-xs font-bold text-foreground">Idenza AI · Análisis activo</div>
        <div className="text-[9px] text-secondary/70 font-mono">Procesando datos de los últimos 30 días...</div>
      </div>
      <div className="ml-auto flex gap-1">
        <div className="w-1 h-3 bg-secondary/60 rounded-full animate-[bounce_0.6s_ease-in-out_infinite]" />
        <div className="w-1 h-3 bg-secondary/60 rounded-full animate-[bounce_0.6s_ease-in-out_0.1s_infinite]" />
        <div className="w-1 h-3 bg-secondary/60 rounded-full animate-[bounce_0.6s_ease-in-out_0.2s_infinite]" />
      </div>
    </div>

    {/* AI Insight Cards */}
    {[
      {
        icon: TrendingUp,
        type: 'Oportunidad detectada',
        insight: 'Tus clientes visitan más la página de servicios los viernes por la tarde. Considera lanzar una oferta semanal de cierre.',
        impact: 'Alta',
        color: 'text-secondary',
        bg: 'bg-secondary/10',
        border: 'border-secondary/20',
      },
      {
        icon: MapPin,
        type: 'Nicho sin explotar',
        insight: 'El 34% de tu tráfico viene de Surco, pero 0% de tus campañas apuntan a esa zona. Hay oportunidad real aquí.',
        impact: 'Media',
        color: 'text-primary',
        bg: 'bg-primary/10',
        border: 'border-primary/20',
      },
      {
        icon: Zap,
        type: 'Mejora rápida',
        insight: 'El botón de contacto en móvil tiene un 60% menos de clics que en desktop. Ajuste de posición recomendado.',
        impact: 'Rápida',
        color: 'text-accent',
        bg: 'bg-accent/10',
        border: 'border-accent/20',
      },
    ].map((card, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 + i * 0.15 }}
        className={`${card.bg} border ${card.border} rounded-xl p-3 flex gap-3`}
      >
        <card.icon size={14} className={`${card.color} mt-0.5 shrink-0`} />
        <div className="flex-1">
          <div className={`text-[9px] font-mono uppercase tracking-wider ${card.color} mb-1`}>{card.type}</div>
          <p className="text-xs text-foreground/70 leading-relaxed">{card.insight}</p>
        </div>
        <div className={`text-[8px] font-mono px-1.5 py-0.5 rounded ${card.bg} ${card.color} border ${card.border} h-fit shrink-0`}>
          {card.impact}
        </div>
      </motion.div>
    ))}
  </motion.div>
);

// Mock Modular Architecture Preview
const ModularPreview = () => (
  <motion.div
    key="modular"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.4 }}
    className="space-y-4"
  >
    <div className="text-[9px] font-mono text-muted-foreground/40 uppercase tracking-widest">Sistema activo · 4 módulos instalados</div>

    {/* Core + Modules visual */}
    <div className="space-y-2">
      {/* Core */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 border border-primary/30">
        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
          <Zap size={14} className="text-primary" />
        </div>
        <div>
          <div className="text-xs font-bold text-primary">CORE · Tu Web</div>
          <div className="text-[9px] text-muted-foreground/50 font-mono">Base escalable · código puro</div>
        </div>
        <div className="ml-auto text-[9px] font-mono text-secondary bg-secondary/10 px-2 py-0.5 rounded-full border border-secondary/20">
          Activo
        </div>
      </div>

      {/* Modules */}
      {[
        { label: 'Panel de Leads', status: 'Activo', color: 'text-primary', bg: 'bg-primary/15', border: 'border-primary/50' },
        { label: 'Pasarela de Pagos', status: 'Activo', color: 'text-secondary', bg: 'bg-secondary/15', border: 'border-secondary/50' },
        { label: 'Sistema de Reservas', status: 'Instalando...', color: 'text-accent', bg: 'bg-accent/15', border: 'border-accent/50' },
        { label: 'IA Consultora', status: 'Disponible', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/40' },
        { label: 'Portal de Clientes', status: '+ Añadir', color: 'text-muted-foreground', bg: 'bg-card', border: 'border-border' },
      ].map((mod, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 + i * 0.1 }}
          className={`flex items-center gap-3 p-2.5 rounded-lg ${mod.bg} border ${mod.border} ml-6`}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${mod.color.replace('text', 'bg')} ${mod.status === 'Instalando...' ? 'animate-pulse' : ''}`} />
          <span className="text-xs text-muted-foreground flex-1">{mod.label}</span>
          <span className={`text-[9px] font-mono ${mod.color}`}>{mod.status}</span>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const previewMap = {
  dashboard: <DashboardPreview />,
  ai: <AIPreview />,
  modular: <ModularPreview />,
};

const IdenzaHubSection = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ai' | 'modular'>('dashboard');

  return (
    <section className="py-32 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 border border-primary/50 text-primary font-mono text-[10px] tracking-[0.2em] mb-6">
              <span className="w-1 h-1 bg-primary rounded-full animate-pulse" />
              IDENZA HUB
            </div>
            <h2 className="text-4xl md:text-6xl font-sora font-bold text-foreground leading-tight mb-6">
              Tu web trabaja.<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary">
                Tú decides.
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              El Hub que viene con cada proyecto Idenza. No es un complemento — es parte de la arquitectura desde el primer día.
            </p>
          </motion.div>
        </div>

        {/* Main Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* Left: Tab Selector + Description */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {tabs.map((tab, i) => (
              <motion.button
                key={tab.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 group ${
                  activeTab === tab.id
                    ? `${tab.bg} ${tab.border} shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]`
                    : 'bg-card border-border hover:bg-foreground/5 hover:border-primary/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    activeTab === tab.id ? tab.bg : 'bg-foreground/5'
                  } border ${activeTab === tab.id ? tab.border : 'border-border'}`}>
                    <tab.icon size={18} className={activeTab === tab.id ? tab.color : 'text-muted-foreground/50'} />
                  </div>
                  <div className="flex-1">
                    <div className={`font-bold font-sora text-sm mb-1 ${activeTab === tab.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {tab.label}
                    </div>
                    <div className={`text-xs leading-relaxed ${activeTab === tab.id ? 'text-muted-foreground/80' : 'text-muted-foreground/40'}`}>
                      {tab.id === 'dashboard' && 'Todos tus leads, métricas y el origen de tus clientes. Centralizado, privado, en tiempo real.'}
                      {tab.id === 'ai' && 'La IA analiza el comportamiento de tus usuarios y te entrega recomendaciones de negocio concretas.'}
                      {tab.id === 'modular' && 'Añade pagos, reservas o portales sin romper nada. Tu web escala contigo, módulo a módulo.'}
                    </div>
                  </div>
                  <ArrowRight
                    size={16}
                    className={`shrink-0 mt-1 transition-all duration-300 ${
                      activeTab === tab.id ? `${tab.color} translate-x-1` : 'text-muted-foreground/30'
                    }`}
                  />
                </div>
              </motion.button>
            ))}
          </motion.div>

          {/* Right: Live Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-32"
          >
            <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-2xl">
              {/* Window Bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-foreground/5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                <div className="flex-1 mx-4 px-3 py-1 rounded-md bg-card border border-border">
                  <span className="text-[9px] font-mono text-muted-foreground/40">hub.idenza.com/dashboard</span>
                </div>
              </div>

              {/* Tab Bar inside preview */}
              <div className="flex border-b border-border">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex-1 py-2.5 text-[9px] font-mono uppercase tracking-wider transition-colors ${
                      activeTab === tab.id
                        ? `${tab.color} border-b-2 ${tab.border.replace('border', 'border-b')}`
                        : 'text-muted-foreground/60 hover:text-foreground'
                    }`}
                  >
                    {tab.label.split(' ')[0]}
                  </button>
                ))}
              </div>

              {/* Preview Content */}
              <div className="p-4 min-h-[420px]">
                {previewMap[activeTab]}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default IdenzaHubSection;
