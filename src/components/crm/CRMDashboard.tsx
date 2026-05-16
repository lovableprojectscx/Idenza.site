import { useMemo } from 'react';
import {
  DollarSign, Users, TrendingUp, AlertTriangle,
  Plus, FileText, Zap, Clock, CheckCircle2, XCircle,
  ArrowUpRight, Activity, Sparkles
} from 'lucide-react';
import type { ClientRow, ProjectRow } from '@/pages/AdminHub';

interface Props {
  clients: ClientRow[];
  loading: boolean;
  onNavigate: (s: 'dashboard' | 'clientes' | 'contenido' | 'foros' | 'config') => void;
  onOpenClient: (c: ClientRow) => void;
}

interface Insight {
  type: 'warning' | 'opportunity' | 'alert';
  title: string;
  description: string;
  clientEmail?: string;
  client?: ClientRow;
}

function buildInsights(clients: ClientRow[]): Insight[] {
  const insights: Insight[] = [];
  const now = new Date();

  clients.forEach(c => {
    c.projects.forEach(p => {
      if (p.payment_status === 'pendiente') {
        insights.push({ type: 'alert', title: 'Pago pendiente', description: `${p.name} — S/${p.monthly_amount ?? 0}/mes sin confirmar`, clientEmail: c.email, client: c });
      }
      if (p.payment_status === 'inactivo' && (p.monthly_amount ?? 0) > 0) {
        insights.push({ type: 'warning', title: 'Cliente inactivo con plan', description: `${p.name} figura inactivo pero tiene plan asignado`, clientEmail: c.email, client: c });
      }
      if (p.events_count > 500) {
        insights.push({ type: 'opportunity', title: 'Alto tráfico', description: `${p.name} tiene ${p.events_count.toLocaleString()} eventos — momento ideal para un informe`, clientEmail: c.email, client: c });
      }
      if (p.leads_count > 5 && p.payment_status === 'activo') {
        insights.push({ type: 'opportunity', title: 'Leads sin reporte', description: `${p.name} acumula ${p.leads_count} leads — usa el Motor IA`, clientEmail: c.email, client: c });
      }
      if (p.next_billing_date) {
        const diff = Math.ceil((new Date(p.next_billing_date).getTime() - now.getTime()) / 86400000);
        if (diff >= 0 && diff <= 5) {
          insights.push({ type: 'warning', title: `Facturación en ${diff}d`, description: `${p.name} — vence el ${new Date(p.next_billing_date).toLocaleDateString('es-PE')}`, clientEmail: c.email, client: c });
        }
      }
    });
  });

  return insights.slice(0, 6);
}

const INSIGHT_COLORS = {
  alert:       { dot: 'bg-red-400',     text: 'text-red-400',     bg: 'from-red-500/5 to-transparent',     border: 'border-red-500/15' },
  warning:     { dot: 'bg-amber-400',   text: 'text-amber-400',   bg: 'from-amber-500/5 to-transparent',   border: 'border-amber-500/15' },
  opportunity: { dot: 'bg-emerald-400', text: 'text-emerald-400', bg: 'from-emerald-500/5 to-transparent', border: 'border-emerald-500/15' },
};

const STATUS_DOT: Record<string, string> = {
  activo:    'bg-emerald-400',
  pendiente: 'bg-amber-400',
  inactivo:  'bg-gray-500',
};

export function CRMDashboard({ clients, loading, onNavigate, onOpenClient }: Props) {
  const allProjects = useMemo(() => clients.flatMap(c => c.projects), [clients]);
  const mrr        = useMemo(() => allProjects.filter(p => p.payment_status === 'activo').reduce((s, p) => s + (Number(p.monthly_amount) || 0), 0), [allProjects]);
  const activos    = useMemo(() => allProjects.filter(p => p.payment_status === 'activo').length, [allProjects]);
  const pendientes = useMemo(() => allProjects.filter(p => p.payment_status === 'pendiente').length, [allProjects]);
  const totalLeads = useMemo(() => allProjects.reduce((s, p) => s + p.leads_count, 0), [allProjects]);
  const insights   = useMemo(() => buildInsights(clients), [clients]);

  const recentClients = useMemo(() =>
    [...clients].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5),
    [clients]
  );

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-xs text-muted-foreground font-mono">Cargando CRM...</p>
      </div>
    </div>
  );

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <div className="p-6 lg:p-8 xl:p-10 space-y-8 max-w-7xl">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{greeting}, Jack 👋</p>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {now.toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button
          onClick={() => onNavigate('clientes')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold uppercase tracking-widest transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-95"
        >
          <Plus size={15} /> Nuevo cliente
        </button>
      </div>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            label: 'MRR',
            value: `S/${mrr.toFixed(0)}`,
            sub: 'Soles / mes',
            icon: <DollarSign size={20} />,
            gradient: 'from-emerald-500/20 to-teal-500/5',
            border: 'border-emerald-500/15',
            iconColor: 'text-emerald-400',
            iconBg: 'bg-emerald-500/10',
            trend: mrr > 0 ? '+activo' : null,
          },
          {
            label: 'Clientes activos',
            value: activos,
            sub: 'proyectos en curso',
            icon: <CheckCircle2 size={20} />,
            gradient: 'from-primary/20 to-accent/5',
            border: 'border-primary/15',
            iconColor: 'text-primary',
            iconBg: 'bg-primary/10',
            trend: null,
          },
          {
            label: 'Leads totales',
            value: totalLeads.toLocaleString(),
            sub: 'capturados por tracker',
            icon: <TrendingUp size={20} />,
            gradient: 'from-sky-500/20 to-blue-500/5',
            border: 'border-sky-500/15',
            iconColor: 'text-sky-400',
            iconBg: 'bg-sky-500/10',
            trend: totalLeads > 0 ? 'activo' : null,
          },
          {
            label: 'Pagos pendientes',
            value: pendientes,
            sub: pendientes > 0 ? 'requieren atención' : 'todo al día',
            icon: <AlertTriangle size={20} />,
            gradient: pendientes > 0 ? 'from-amber-500/20 to-orange-500/5' : 'from-white/[0.02] to-transparent',
            border: pendientes > 0 ? 'border-amber-500/20' : 'border-border',
            iconColor: pendientes > 0 ? 'text-amber-400' : 'text-muted-foreground',
            iconBg: pendientes > 0 ? 'bg-amber-500/10' : 'bg-muted/50',
            trend: null,
          },
        ].map(kpi => (
          <div
            key={kpi.label}
            className={`relative overflow-hidden rounded-2xl border ${kpi.border} p-5 bg-card`}
          >
            <div className="relative">
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${kpi.iconBg} ${kpi.iconColor} mb-4`}>
                {kpi.icon}
              </div>
              <p className="text-3xl font-bold text-foreground tabular-nums">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
              <p className="text-[11px] text-muted-foreground/60 mt-0.5">{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Two columns ── */}
      <div className="grid lg:grid-cols-5 gap-6">

        {/* Insights — 3/5 */}
        <div className="lg:col-span-3 rounded-2xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles size={13} className="text-primary" />
              </div>
              <h2 className="text-sm font-semibold text-foreground">Insights Proactivos</h2>
            </div>
            <span className={`text-[10px] font-mono px-2 py-1 rounded-lg ${insights.length > 0 ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
              {insights.length > 0 ? `${insights.length} alertas` : '✓ todo en orden'}
            </span>
          </div>

          <div className="p-4 space-y-2">
            {insights.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <CheckCircle2 size={32} className="text-emerald-500/30" />
              <p className="text-sm text-muted-foreground">Sin alertas activas</p>
                <p className="text-[11px] text-muted-foreground/60">Todos los clientes están bien</p>
              </div>
            ) : (
              insights.map((ins, i) => {
                const s = INSIGHT_COLORS[ins.type];
                return (
                  <button
                    key={i}
                    onClick={() => ins.client && onOpenClient(ins.client)}
                    className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border ${s.border} bg-gradient-to-r ${s.bg} hover:scale-[1.01] transition-all duration-150 group`}
                  >
                    <div className={`w-2 h-2 rounded-full ${s.dot} shrink-0 shadow-sm`} style={{ boxShadow: `0 0 8px currentColor` }} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold ${s.text}`}>{ins.title}</p>
                      <p className="text-[11px] text-muted-foreground truncate mt-0.5">{ins.description}</p>
                    </div>
                    <ArrowUpRight size={13} className="text-muted-foreground/40 group-hover:text-muted-foreground transition-colors shrink-0" />
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Clientes recientes — 2/5 */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Activity size={13} className="text-primary" />
              </div>
              <h2 className="text-sm font-semibold text-foreground">Recientes</h2>
            </div>
            <button onClick={() => onNavigate('clientes')} className="text-[11px] text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
              Ver todos <ArrowUpRight size={11} />
            </button>
          </div>

          <div className="divide-y divide-border">
            {recentClients.map(c => {
              const proj = c.projects[0];
              const status = proj?.payment_status ?? 'activo';
              return (
                <button
                  key={c.user_id}
                  onClick={() => onOpenClient(c)}
                  className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-muted/50 transition-colors group text-left"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/15 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                    {(proj?.name ?? c.email)[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground font-medium truncate group-hover:text-primary transition-colors">
                      {proj?.name ?? c.email}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">{c.email}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status] ?? STATUS_DOT.activo}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Acciones rápidas ── */}
      <div>
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] mb-3">Acciones rápidas</p>
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Nuevo cliente',     icon: <Plus size={14} />,       action: () => onNavigate('clientes'),  color: 'hover:border-primary/30 hover:text-primary hover:bg-primary/[0.05]' },
            { label: 'Gestionar contenido', icon: <FileText size={14} />, action: () => onNavigate('contenido'), color: 'hover:border-sky-500/30 hover:text-sky-300 hover:bg-sky-500/[0.05]' },
            { label: 'Ver foros',         icon: <Users size={14} />,      action: () => onNavigate('foros'),     color: 'hover:border-emerald-500/30 hover:text-emerald-300 hover:bg-emerald-500/[0.05]' },
          ].map(a => (
            <button
              key={a.label}
              onClick={a.action}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-muted/30 text-muted-foreground text-sm font-medium transition-all duration-150 ${a.color} active:scale-95`}
            >
              {a.icon}{a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
