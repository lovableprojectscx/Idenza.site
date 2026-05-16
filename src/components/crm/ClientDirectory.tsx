import { useState, useMemo } from 'react';
import {
  Search, Plus, RefreshCw, ChevronRight,
  Globe, TrendingUp, CheckCircle2, Clock, XCircle,
  Filter, SlidersHorizontal
} from 'lucide-react';
import { supabaseAdmin, ADMIN_SECRET, isAdminConfigured } from '@/lib/supabase';
import { toast } from 'sonner';
import type { ClientRow } from '@/pages/AdminHub';
import { CreateClientModal } from '@/components/crm/CreateClientModal';

interface Props {
  clients: ClientRow[];
  loading: boolean;
  onSelect: (c: ClientRow) => void;
  onRefresh: () => void;
}

const STATUS_CONFIG: Record<string, { label: string; dot: string; text: string; bg: string }> = {
  activo:    { label: 'Activo',    dot: 'bg-emerald-400', text: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  pendiente: { label: 'Pendiente', dot: 'bg-amber-400',   text: 'text-amber-400',   bg: 'bg-amber-400/10' },
  inactivo:  { label: 'Inactivo',  dot: 'bg-gray-500',    text: 'text-gray-500',    bg: 'bg-gray-500/10' },
};

const PLAN_LABEL: Record<string, string> = {
  gratuito: 'Gratuito',
  basico:   'Básico',
  agencia:  'Agencia',
  // legacy keys (for existing records)
  lanzamiento:   'Básico',
  crecimiento:   'Básico',
  dominio_total: 'Agencia',
  hub:           'Básico',
  one_time:      'Gratuito',
};

const PAGE_SIZE = 8;

export function ClientDirectory({ clients, loading, onSelect, onRefresh }: Props) {
  const [search, setSearch]         = useState('');
  const [statusFilter, setStatus]   = useState<string>('all');
  const [page, setPage]             = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const filtered = useMemo(() => {
    return clients.filter(c => {
      const proj = c.projects[0];
      const matchSearch =
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        (proj?.name ?? '').toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        statusFilter === 'all' ||
        (proj?.payment_status ?? 'activo') === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [clients, search, statusFilter]);

  const paginated = useMemo(() => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filtered, page]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  const stats = useMemo(() => ({
    total: clients.length,
    activos: clients.filter(c => c.projects[0]?.payment_status === 'activo').length,
    mrr: clients.flatMap(c => c.projects)
      .filter(p => p.payment_status === 'activo')
      .reduce((s, p) => s + (p.monthly_amount ?? 0), 0),
  }), [clients]);

  return (
    <div className="p-6 lg:p-8 xl:p-10 max-w-7xl space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
          <p className="text-sm text-muted-foreground mt-1">{clients.length} cliente{clients.length !== 1 ? 's' : ''} registrado{clients.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2.5 rounded-xl border border-border bg-muted/30 text-muted-foreground hover:text-foreground hover:border-border/80 transition-all disabled:opacity-40"
            title="Actualizar"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold uppercase tracking-widest transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-95"
          >
            <Plus size={15} /> Nuevo cliente
          </button>
        </div>
      </div>

      {/* ── Stat pills ── */}
      <div className="flex gap-3 flex-wrap">
        {[
          { label: 'Total', value: stats.total, color: 'text-gray-300', active: statusFilter === 'all', onClick: () => { setStatus('all'); setPage(1); } },
          { label: 'Activos', value: stats.activos, color: 'text-emerald-400', active: statusFilter === 'activo', onClick: () => { setStatus('activo'); setPage(1); } },
          { label: 'MRR', value: `S/${stats.mrr}`, color: 'text-primary', active: false, onClick: undefined },
        ].map(s => (
          <button
            key={s.label}
            onClick={s.onClick}
            disabled={!s.onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
              s.active
                ? 'border-primary/30 bg-primary/10 text-primary'
                : s.onClick
                  ? 'border-white/[0.06] bg-white/[0.02] text-gray-500 hover:border-white/[0.1] hover:text-gray-300'
                  : 'border-white/[0.04] bg-white/[0.01] text-gray-600 cursor-default'
            }`}
          >
            <span className={s.color + ' font-bold tabular-nums'}>{s.value}</span>
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      {/* ── Search + Filter ── */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Buscar por email o nombre de proyecto..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-muted/30 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/30 focus:bg-muted/50 outline-none transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => { setStatus(e.target.value); setPage(1); }}
          className="px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-muted-foreground focus:border-primary/30 outline-none cursor-pointer appearance-none pr-8"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%236b7280'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
        >
          <option value="all" className="bg-[#0d0d12]">Todos</option>
          <option value="activo" className="bg-[#0d0d12]">Activos</option>
          <option value="pendiente" className="bg-[#0d0d12]">Pendientes</option>
          <option value="inactivo" className="bg-[#0d0d12]">Inactivos</option>
        </select>
      </div>

      {/* ── Table ── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">

        {/* Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3.5 border-b border-border">
          <div className="col-span-5 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Cliente / Proyecto</div>
          <div className="col-span-2 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Plan</div>
          <div className="col-span-2 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Estado</div>
          <div className="col-span-1 text-[10px] font-mono text-muted-foreground uppercase tracking-widest text-right">Leads</div>
          <div className="col-span-2 text-[10px] font-mono text-muted-foreground uppercase tracking-widest text-right">MRR</div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Search size={24} className="text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">{search ? 'Sin resultados' : 'No hay clientes aún'}</p>
            {!search && (
              <button
                onClick={() => setShowCreate(true)}
                className="text-xs text-primary hover:text-primary/80 transition-colors mt-1"
              >
                + Crear primer cliente
              </button>
            )}
          </div>
        ) : (
          paginated.map((client, i) => {
            const proj    = client.projects[0];
            const status  = proj?.payment_status ?? 'activo';
            const plan    = proj?.plan_name ?? 'hub';
            const sCfg    = STATUS_CONFIG[status] ?? STATUS_CONFIG.activo;
            const initial = (proj?.name ?? client.email)[0].toUpperCase();

            return (
              <button
                key={client.user_id}
                onClick={() => onSelect(client)}
                className={`w-full grid grid-cols-12 gap-4 px-6 py-4 text-left hover:bg-muted/50 transition-all group ${
                  i < paginated.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                {/* Client info */}
                <div className="col-span-5 flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/15 flex items-center justify-center text-primary text-sm font-bold shrink-0">
                    {initial}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-foreground font-medium truncate group-hover:text-primary/80 transition-colors">
                      {proj?.name ?? '—'}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">{client.email}</p>
                  </div>
                </div>

                {/* Plan */}
                <div className="col-span-2 flex items-center">
                  <span className="text-xs text-muted-foreground font-medium">{PLAN_LABEL[plan] ?? plan}</span>
                </div>

                {/* Status */}
                <div className="col-span-2 flex items-center">
                  <span className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg font-semibold ${sCfg.text} ${sCfg.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sCfg.dot}`} />
                    {sCfg.label}
                  </span>
                </div>

                {/* Leads */}
                <div className="col-span-1 flex items-center justify-end">
                  <span className="text-sm text-foreground/80 font-mono tabular-nums">{(proj?.leads_count ?? 0).toLocaleString()}</span>
                </div>

                {/* MRR + Arrow */}
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <span className="text-sm font-semibold font-mono tabular-nums" style={{ color: (proj?.monthly_amount ?? 0) > 0 ? '#D4AF37' : '#374151' }}>
                    {(proj?.monthly_amount ?? 0) > 0 ? `S/${proj!.monthly_amount}` : '—'}
                  </span>
                  <ChevronRight size={14} className="text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</span>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                  n === page
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >{n}</button>
            ))}
          </div>
        </div>
      )}

      {showCreate && (
        <CreateClientModal
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); onRefresh(); }}
        />
      )}
    </div>
  );
}
