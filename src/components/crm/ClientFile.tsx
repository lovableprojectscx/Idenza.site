import { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft, Globe, Github, Database, Server, Code2,
  FileText, Copy, Check, Save, Loader2, Sparkles,
  TrendingUp, Users, BarChart3, Clock, Download,
  Plus, Trash2, ExternalLink, RefreshCw, AlertCircle,
  Upload, File, X as XIcon
} from 'lucide-react';
import { supabase, supabaseAdmin, ADMIN_SECRET, TRACKER_HOST, isAdminConfigured } from '@/lib/supabase';
import { toast } from 'sonner';
import type { ClientRow, ProjectRow } from '@/pages/AdminHub';
import { generateMonthlyReport, type MonthlyReport } from '@/lib/ai';

interface Props {
  client: ClientRow;
  onBack: () => void;
  onRefresh: () => void;
}

type Tab = 'panorama' | 'infraestructura' | 'reportes';

const PLAN_OPTIONS = [
  { value: 'free',         label: 'Free — S/ 0/mes (cada 45d)', amount: 0 },
  { value: 'starter',      label: 'Starter — S/ 35/mes (mensual)',  amount: 35 },
  { value: 'professional', label: 'Professional — S/ 55/mes (mensual)', amount: 55 },
  { value: 'enterprise',   label: 'Enterprise — S/ 90/mes (quincenal)', amount: 90 },
];
const DB_OPTIONS = [
  { value: 'none',  label: 'Sin Catálogo' },
  { value: 'basic', label: 'BD Básica (+S/20)' },
  { value: 'pro',   label: 'BD Profesional (+S/65)' },
];
const HOSTING_OPTIONS = ['vercel', 'netlify', 'railway', 'vps', 'otro'];
const FRAMEWORK_OPTIONS = ['react', 'next.js', 'vue', 'astro', 'wordpress', 'otro'];

const inputCls = 'w-full bg-muted/30 border border-border focus:border-primary/40 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors';
const labelCls = 'text-[11px] font-mono text-muted-foreground uppercase tracking-widest block mb-1.5';
const selectCls = `${inputCls} cursor-pointer`;

interface CrmReport {
  id: string;
  title: string;
  period: string;
  content: MonthlyReport;
  generated_at: string;
  sent_whatsapp: boolean;
}

type ClientProjectRow = ProjectRow & { db_module?: string | null };
type LeadAnalyticsRow = {
  name: string | null;
  email: string | null;
  city: string | null;
  status: string;
  created_at: string;
  page_url: string | null;
};

function SnippetBox({ orgId, token }: { orgId: string; token: string }) {
  const [copied, setCopied] = useState(false);
  const snippet = `<script\n  src="${TRACKER_HOST}/tracker.js"\n  data-token="${token}"\n  data-org="${orgId}"\n  defer\n></script>`;
  const copy = () => { navigator.clipboard.writeText(snippet); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="relative">
      <pre className="bg-muted border border-border rounded-xl p-4 text-[11px] font-mono text-emerald-600 dark:text-emerald-400/80 overflow-x-auto whitespace-pre-wrap leading-relaxed">{snippet}</pre>
      <button onClick={copy} className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-background border border-border text-[10px] text-muted-foreground hover:text-foreground transition-all">
        {copied ? <><Check size={11} className="text-emerald-500" /><span className="text-emerald-500">Copiado</span></> : <><Copy size={11} />Copiar</>}
      </button>
    </div>
  );
}

export function ClientFile({ client, onBack, onRefresh }: Props) {
  const [activeProjIdx, setActiveProjIdx] = useState(0);
  const proj = client.projects[activeProjIdx] as ClientProjectRow | undefined;
  const [tab, setTab] = useState<Tab>('panorama');

  // ── Infra form state ─────────────────────────────────────────────────────
  const [infra, setInfra] = useState({
    plan_name:           proj?.plan_name           ?? 'hub',
    payment_status:      proj?.payment_status      ?? 'activo',
    monthly_amount:      String(proj?.monthly_amount ?? 0),
    next_billing_date:   proj?.next_billing_date   ?? '',
    github_url:          proj?.github_url          ?? '',
    supabase_project_id: proj?.supabase_project_id ?? '',
    hosting_provider:    proj?.hosting_provider    ?? 'vercel',
    framework:           proj?.framework           ?? 'react',
    client_email:        proj?.client_email        ?? client.email,
    internal_notes:      proj?.internal_notes      ?? '',
    db_module:           proj?.db_module           ?? 'none',
  });
  const [saving, setSaving] = useState(false);

  // Sync state when client changes (e.g. after save/refresh)
  useEffect(() => {
    if (proj) {
      setInfra({
        plan_name:           proj.plan_name           ?? 'hub',
        payment_status:      proj.payment_status      ?? 'activo',
        monthly_amount:      String(proj.monthly_amount ?? 0),
        next_billing_date:   proj.next_billing_date   ?? '',
        github_url:          proj.github_url          ?? '',
        supabase_project_id: proj.supabase_project_id ?? '',
        hosting_provider:    proj.hosting_provider    ?? 'vercel',
        framework:           proj.framework           ?? 'react',
        client_email:        proj.client_email        ?? client.email,
        internal_notes:      proj.internal_notes      ?? '',
        db_module:           proj.db_module           ?? 'none',
      });
    }
  }, [proj]);

  // ── Analytics ────────────────────────────────────────────────────────────
  const [analytics, setAnalytics] = useState<{
    totalLeads: number; totalVisits: number; newLeads: number;
    leadsByStatus: Record<string, number>; topPages: { page: string; count: number }[];
    recentLeads: { name: string | null; email: string | null; city: string | null; status: string; created_at: string }[];
  } | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // ── Reports ──────────────────────────────────────────────────────────────
  const [reports, setReports]           = useState<CrmReport[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportPeriod, setReportPeriod] = useState(() => {
    const d = new Date();
    return `${d.toLocaleString('es-PE', { month: 'long' })} ${d.getFullYear()}`;
  });

  // ── Documents ─────────────────────────────────────────────────────────────
  interface ClientDoc { id: string; name: string; file_path: string; file_size: number | null; mime_type: string | null; uploaded_at: string; }
  const [docs, setDocs]                   = useState<ClientDoc[]>([]);
  const [loadingDocs, setLoadingDocs]     = useState(false);
  const [uploadingDoc, setUploadingDoc]   = useState(false);
  const fileInputRef                      = useRef<HTMLInputElement>(null);

  // ── Load documents ────────────────────────────────────────────────────────
  const loadDocs = async () => {
    if (!proj || !isAdminConfigured) return;
    setLoadingDocs(true);
    const { data } = await supabaseAdmin
      .from('client_documents')
      .select('*')
      .eq('organization_id', proj.id)
      .order('uploaded_at', { ascending: false });
    setDocs((data as ClientDoc[]) ?? []);
    setLoadingDocs(false);
  };

  // ── Upload document ───────────────────────────────────────────────────────
  const handleUploadDoc = async (file: File) => {
    if (!proj || !isAdminConfigured) { toast.error('Service Role Key no configurada'); return; }
    setUploadingDoc(true);
    const ext   = file.name.split('.').pop() ?? 'bin';
    const path  = `${proj.id}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

    const { error: upErr } = await supabaseAdmin.storage.from('client-docs').upload(path, file, { upsert: false });
    if (upErr) { toast.error('Error subiendo archivo: ' + upErr.message); setUploadingDoc(false); return; }

    const { error: dbErr } = await supabaseAdmin.from('client_documents').insert({
      organization_id: proj.id,
      name:       file.name,
      file_path:  path,
      file_size:  file.size,
      mime_type:  file.type || `application/${ext}`,
    });
    if (dbErr) { toast.error('Error registrando documento'); setUploadingDoc(false); return; }

    toast.success(`"${file.name}" subido correctamente`);
    loadDocs();
    setUploadingDoc(false);
  };

  // ── Delete document ───────────────────────────────────────────────────────
  const handleDeleteDoc = async (doc: ClientDoc) => {
    if (!isAdminConfigured) return;
    await supabaseAdmin.storage.from('client-docs').remove([doc.file_path]);
    await supabaseAdmin.from('client_documents').delete().eq('id', doc.id);
    setDocs(prev => prev.filter(d => d.id !== doc.id));
    toast.success('Documento eliminado');
  };

  // ── Download document ─────────────────────────────────────────────────────
  const handleDownloadDoc = async (doc: ClientDoc) => {
    if (!isAdminConfigured) return;
    const { data } = await supabaseAdmin.storage.from('client-docs').createSignedUrl(doc.file_path, 60);
    if (data?.signedUrl) window.open(data.signedUrl, '_blank');
  };

  // ── Load analytics ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!proj) return;
    setLoadingAnalytics(true);

    // Use secure RPC to bypass RLS and avoid dependency on service role keys in frontend
    Promise.all([
      supabase.rpc('get_admin_leads', { p_admin_secret: ADMIN_SECRET, p_org_id: proj.id }),
      supabase.rpc('get_project_analytics', { p_org_id: proj.id, p_days: 30 }),
    ]).then(([leadsRes, analyticsRes]) => {
      const leads = ((leadsRes.data ?? []) as LeadAnalyticsRow[]);
      const byStatus = leads.reduce((acc: Record<string, number>, l: { status: string }) => {
        acc[l.status] = (acc[l.status] ?? 0) + 1;
        return acc;
      }, {});
      const byPage = leads.reduce((acc: Record<string, number>, l: { page_url: string | null }) => {
        if (l.page_url) acc[l.page_url] = (acc[l.page_url] ?? 0) + 1;
        return acc;
      }, {});
      const topPages = Object.entries(byPage).sort(([,a],[,b]) => b - a).slice(0,5).map(([page, count]) => ({ page, count }));
      const analyticsData = analyticsRes.data ?? {};

      setAnalytics({
        totalLeads:   leads.length,
        newLeads:     byStatus['new'] ?? 0,
        totalVisits:  (analyticsData as { unique_sessions?: number }).unique_sessions ?? proj.events_count,
        leadsByStatus: byStatus,
        topPages,
        recentLeads: leads.slice(0, 8),
      });
    }).finally(() => setLoadingAnalytics(false));
  }, [proj?.id]);

  // ── Load reports ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!proj || !isAdminConfigured) return;
    setLoadingReports(true);
    const loadReports = async () => {
      const { data } = await supabaseAdmin
        .from('crm_reports')
        .select('*')
        .eq('organization_id', proj.id)
        .order('generated_at', { ascending: false })
        .limit(10);
      setReports((data as CrmReport[]) ?? []);
      setLoadingReports(false);
    };
    loadReports();
  }, [proj?.id]);

  // Load documents on mount
  useEffect(() => { loadDocs(); }, [proj?.id]);

  // ── Save infra ────────────────────────────────────────────────────────────
  const handleSaveInfra = async () => {
    if (!proj) return;
    setSaving(true);
    
    const { error } = await supabase.rpc('update_organization_admin', {
      p_admin_secret: ADMIN_SECRET,
      p_org_id: proj.id,
      p_updates: {
        plan_name:           infra.plan_name,
        payment_status:      infra.payment_status,
        monthly_amount:      parseFloat(infra.monthly_amount) || 0,
        next_billing_date:   infra.next_billing_date || null,
        github_url:          infra.github_url || null,
        supabase_project_id: infra.supabase_project_id || null,
        hosting_provider:    infra.hosting_provider,
        framework:           infra.framework,
        client_email:        infra.client_email || null,
        internal_notes:      infra.internal_notes || null,
        db_module:           infra.db_module,
      }
    });

    setSaving(false);
    if (error) { toast.error('Error al guardar: ' + error.message); return; }
    toast.success('Datos guardados');
    onRefresh();
  };

  // ── Generate report ───────────────────────────────────────────────────────
  const handleGenerateReport = async () => {
    if (!proj || !analytics) { toast.error('Sin datos de analítica'); return; }
    setGeneratingReport(true);
    try {
      const report = await generateMonthlyReport({
        orgName:     proj.name,
        industry:    proj.industry,
        city:        proj.city,
        website:     proj.website_url,
        period:      reportPeriod,
        totalLeads:  analytics.totalLeads,
        newLeads:    analytics.newLeads,
        totalVisits: analytics.totalVisits,
        leadsByStatus: analytics.leadsByStatus,
        topPages:    analytics.topPages,
        plan:        infra.plan_name,
        mrr:         parseFloat(infra.monthly_amount) || 0,
        snapshots:   [],
      });

      if (isAdminConfigured) {
        const { data, error } = await supabaseAdmin
          .from('crm_reports')
          .insert({
            organization_id: proj.id,
            title:           `Informe ${reportPeriod} — ${proj.name}`,
            period:          reportPeriod,
            content:         report as unknown as Record<string, unknown>,
          })
          .select()
          .single();
        if (!error && data) setReports(prev => [data as CrmReport, ...prev]);
      }
      toast.success('Informe generado correctamente');
    } catch (e) {
      toast.error('Error al generar informe: ' + (e instanceof Error ? e.message : 'desconocido'));
    } finally {
      setGeneratingReport(false);
    }
  };

  // ── Download report ───────────────────────────────────────────────────────
  const downloadReport = (r: CrmReport) => {
    const c = r.content;
    const txt = [
      `INFORME MENSUAL — ${r.period}`,
      `Proyecto: ${proj?.name ?? ''}`,
      `Generado: ${new Date(r.generated_at).toLocaleDateString('es-PE')}`,
      '',
      '═══ RESUMEN EJECUTIVO ═══',
      c.summary,
      '',
      `Score de salud: ${c.healthScore}/10`,
      '',
      '═══ MÉTRICAS ═══',
      `Visitas: ${c.metrics.visits}`,
      `Leads: ${c.metrics.leads}`,
      `Conversión: ${c.metrics.conversionRate}%`,
      `MRR: $${c.metrics.mrr}`,
      '',
      '═══ LOGROS DEL MES ═══',
      ...(c.highlights ?? []).map((h: string) => `• ${h}`),
      '',
      '═══ RIESGOS ═══',
      ...(c.risks ?? []).map((r: string) => `⚠ ${r}`),
      '',
      '═══ PLAN DE ACCIÓN ═══',
      ...(c.actionPlan ?? []).map((a: { priority: number; action: string; impact: string }, i: number) => `${i+1}. ${a.action} (${a.impact})`),
      '',
      '— Generado por IDENZA Core —',
    ].join('\n');

    const blob = new Blob([txt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `informe-${proj?.slug ?? 'cliente'}-${r.period.replace(' ', '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!proj) {
    return (
      <div className="p-8">
        <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-6"><ArrowLeft size={16} /> Volver</button>
        <p className="text-muted-foreground">Este cliente no tiene proyectos asignados aún.</p>
      </div>
    );
  }

  const STATUS_COLORS: Record<string, string> = {
    activo: 'bg-emerald-500/10 text-emerald-400', pendiente: 'bg-amber-500/10 text-amber-400', inactivo: 'bg-gray-500/10 text-gray-500',
  };

  return (
    <div className="flex flex-col h-full">

      {/* ── File header ── */}
      <div className="px-6 lg:px-8 py-5 border-b border-border">
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3">
          <ArrowLeft size={13} /> Todos los clientes
        </button>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center text-xl font-bold">
              {proj.name[0].toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="text-xl font-bold text-foreground">{proj.name}</h1>
                {client.projects.length > 1 && (
                  <select 
                    value={activeProjIdx} 
                    onChange={e => setActiveProjIdx(parseInt(e.target.value))}
                    className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded border border-primary/20 outline-none cursor-pointer"
                  >
                    {client.projects.map((p, i) => (
                      <option key={p.id} value={i} className="bg-card text-foreground">{p.name}</option>
                    ))}
                  </select>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground">{client.email}</span>
                {proj.website_url && (
                  <a href={proj.website_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                    onClick={e => e.stopPropagation()}>
                    <ExternalLink size={10} />{proj.website_url.replace(/^https?:\/\//, '')}
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${STATUS_COLORS[infra.payment_status] ?? STATUS_COLORS.activo}`}>
              {infra.payment_status} · Tracker {infra.plan_name}
            </span>
            {infra.db_module !== 'none' && (
              <span className="text-[10px] px-2 py-1 rounded-full font-medium bg-primary/10 text-primary border border-primary/20">
                + DB {infra.db_module}
              </span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-5">
          {([
            { id: 'panorama',      label: 'Panorama',            icon: <BarChart3 size={13} /> },
            { id: 'infraestructura', label: 'Infraestructura',   icon: <Server size={13} /> },
            { id: 'reportes',      label: 'Motor IA & Informes', icon: <Sparkles size={13} /> },
          ] as { id: Tab; label: string; icon: React.ReactNode }[]).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                tab === t.id ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {t.icon}{t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="flex-1 overflow-auto px-6 lg:px-8 py-6">

        {/* ══ PANORAMA ══ */}
        {tab === 'panorama' && (
          <div className="space-y-6 max-w-3xl">
            {loadingAnalytics ? (
              <div className="flex items-center gap-2 text-muted-foreground text-sm"><Loader2 size={15} className="animate-spin" /> Cargando analítica...</div>
            ) : analytics ? (
              <>
                {/* KPIs */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: 'Leads totales',  value: analytics.totalLeads, color: 'text-primary' },
                    { label: 'Leads nuevos',   value: analytics.newLeads,   color: 'text-amber-400' },
                    { label: 'Visitas (30d)',  value: analytics.totalVisits, color: 'text-sky-400' },
                    { label: 'Conversión',     value: analytics.totalVisits > 0 ? `${((analytics.totalLeads / analytics.totalVisits) * 100).toFixed(1)}%` : '0%', color: 'text-emerald-400' },
                  ].map(kpi => (
                    <div key={kpi.label} className="bg-card border border-border rounded-xl p-4">
                      <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{kpi.label}</p>
                    </div>
                  ))}
                </div>

                {/* Lead status breakdown */}
                <div className="bg-card border border-border rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Users size={14} className="text-primary" /> Estado de leads</h3>
                  <div className="flex gap-4 flex-wrap">
                    {[
                      { status: 'new',       label: 'Nuevos',     color: 'text-primary' },
                      { status: 'contacted', label: 'Contactados', color: 'text-amber-500' },
                      { status: 'closed',    label: 'Cerrados',   color: 'text-emerald-500' },
                    ].map(s => (
                      <div key={s.status} className="flex items-center gap-2">
                        <span className={`text-xl font-bold ${s.color}`}>{analytics.leadsByStatus[s.status] ?? 0}</span>
                        <span className="text-xs text-muted-foreground">{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top pages */}
                {analytics.topPages.length > 0 && (
                  <div className="bg-card border border-border rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><TrendingUp size={14} className="text-primary" /> Páginas con más leads</h3>
                    <div className="space-y-2">
                      {analytics.topPages.map(pg => (
                        <div key={pg.page} className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground truncate font-mono">{pg.page.replace(/^https?:\/\/[^/]+/, '') || '/'}</span>
                          <span className="text-xs text-primary font-bold ml-3 shrink-0">{pg.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent leads */}
                {analytics.recentLeads.length > 0 && (
                  <div className="bg-card border border-border rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><Clock size={14} className="text-primary" /> Leads recientes</h3>
                    <div className="space-y-1.5">
                      {analytics.recentLeads.map((lead, i) => (
                        <div key={i} className="flex items-center gap-3 py-1.5 border-b border-border last:border-0">
                          <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center shrink-0">
                            {(lead.name ?? lead.email ?? '?')[0]?.toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-foreground truncate">{lead.name ?? lead.email ?? 'Desconocido'}</p>
                            {lead.city && <p className="text-[10px] text-muted-foreground">{lead.city}</p>}
                          </div>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                            lead.status === 'new' ? 'bg-primary/10 text-primary' :
                            lead.status === 'contacted' ? 'bg-amber-500/10 text-amber-500' :
                            'bg-emerald-500/10 text-emerald-500'
                          }`}>{lead.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground text-sm"><AlertCircle size={15} /> Sin datos de analítica disponibles</div>
            )}
          </div>
        )}

        {/* ══ INFRAESTRUCTURA ══ */}
        {tab === 'infraestructura' && (
          <div className="space-y-6 max-w-2xl">

            {/* Billing */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Facturación y Plan</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Plan</label>
                  <select 
                    value={infra.plan_name} 
                    onChange={e => {
                      const val = e.target.value;
                      const opt = PLAN_OPTIONS.find(o => o.value === val);
                      setInfra(p => ({ 
                        ...p, 
                        plan_name: val, 
                        monthly_amount: opt ? String(opt.amount) : p.monthly_amount 
                      }));
                    }} 
                    className={selectCls}
                  >
                    {PLAN_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-card">{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Módulo Base de Datos</label>
                  <select 
                    value={infra.db_module} 
                    onChange={e => {
                      const val = e.target.value;
                      setInfra(p => ({ 
                        ...p, 
                        db_module: val
                      }));
                    }} 
                    className={selectCls}
                  >
                    {DB_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-card">{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Estado de pago</label>
                  <select value={infra.payment_status} onChange={e => setInfra(p => ({ ...p, payment_status: e.target.value }))} className={selectCls}>
                    <option value="activo" className="bg-card">✓ Activo</option>
                    <option value="pendiente" className="bg-card">⏳ Pendiente</option>
                    <option value="inactivo" className="bg-card">✗ Inactivo</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Monto mensual (S/)</label>
                  <input type="number" value={infra.monthly_amount} onChange={e => setInfra(p => ({ ...p, monthly_amount: e.target.value }))} placeholder="21" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Próxima facturación</label>
                  <input type="date" value={infra.next_billing_date} onChange={e => setInfra(p => ({ ...p, next_billing_date: e.target.value }))} className={inputCls} />
                </div>
              </div>
            </div>

            {/* Tech stack */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Infraestructura Técnica</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}><Code2 size={10} className="inline mr-1" /> Framework</label>
                    <select value={infra.framework} onChange={e => setInfra(p => ({ ...p, framework: e.target.value }))} className={selectCls}>
                      {FRAMEWORK_OPTIONS.map(o => <option key={o} value={o} className="bg-card">{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}><Server size={10} className="inline mr-1" /> Hosting</label>
                    <select value={infra.hosting_provider} onChange={e => setInfra(p => ({ ...p, hosting_provider: e.target.value }))} className={selectCls}>
                      {HOSTING_OPTIONS.map(o => <option key={o} value={o} className="bg-card">{o}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelCls}><Github size={10} className="inline mr-1" /> Repositorio GitHub</label>
                  <input value={infra.github_url} onChange={e => setInfra(p => ({ ...p, github_url: e.target.value }))} placeholder="https://github.com/idenza/proyecto" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}><Database size={10} className="inline mr-1" /> Supabase Project ID</label>
                  <input value={infra.supabase_project_id} onChange={e => setInfra(p => ({ ...p, supabase_project_id: e.target.value }))} placeholder="abc123xyz" className={inputCls} />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">Notas internas de la agencia</h3>
              <textarea
                value={infra.internal_notes}
                onChange={e => setInfra(p => ({ ...p, internal_notes: e.target.value }))}
                rows={5}
                placeholder="Observaciones, acuerdos, historial de contacto, detalles del proyecto..."
                className={`${inputCls} resize-none leading-relaxed`}
              />
            </div>

            {/* Tracker snippet */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">Snippet del Tracker</h3>
              <SnippetBox orgId={proj.id} token={proj.token} />
            </div>

            {/* Save button */}
            <button
              onClick={handleSaveInfra}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-3 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground text-sm font-semibold rounded-xl transition-colors"
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>

            {/* ── Documentos del cliente ── */}
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <FileText size={14} className="text-primary" /> Documentos del cliente
                </h3>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingDoc}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/20 border border-primary/30 hover:bg-primary/30 text-primary text-xs font-medium transition-all disabled:opacity-50"
                >
                  {uploadingDoc ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                  {uploadingDoc ? 'Subiendo...' : 'Subir archivo'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.webp,.txt"
                  onChange={e => { const f = e.target.files?.[0]; if (f) { handleUploadDoc(f); e.target.value = ''; } }}
                />
              </div>

              {/* Drop zone */}
              <div
                className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/30 hover:bg-primary/[0.03] transition-all"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleUploadDoc(f); }}
              >
                <Upload size={20} className="text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Arrastra un archivo aquí o <span className="text-primary">selecciona uno</span></p>
                <p className="text-[10px] text-muted-foreground/60 mt-1">PDF, Word, Excel, imágenes — máx. 50MB</p>
              </div>

              {/* Document list */}
              {loadingDocs ? (
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <Loader2 size={13} className="animate-spin" /> Cargando documentos...
                </div>
              ) : docs.length === 0 ? (
                <p className="text-xs text-muted-foreground/60 text-center py-2">No hay documentos subidos aún</p>
              ) : (
                <div className="space-y-1.5">
                  {docs.map(doc => (
                    <div key={doc.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/20 border border-border group hover:border-border/80 transition-all">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <File size={14} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground font-medium truncate">{doc.name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {doc.file_size ? `${(doc.file_size / 1024).toFixed(0)} KB` : '—'} · {new Date(doc.uploaded_at).toLocaleDateString('es-PE')}
                        </p>
                      </div>
                      <button onClick={() => handleDownloadDoc(doc)} className="text-muted-foreground hover:text-primary transition-colors p-1" title="Descargar">
                        <Download size={13} />
                      </button>
                      <button onClick={() => handleDeleteDoc(doc)} className="text-muted-foreground/30 hover:text-red-400 transition-colors p-1 opacity-0 group-hover:opacity-100" title="Eliminar">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ MOTOR IA & REPORTES ══ */}
        {tab === 'reportes' && (
          <div className="space-y-6 max-w-2xl">

            {/* Generate */}
            <div className="bg-card border border-primary/20 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
                <Sparkles size={14} className="text-primary" /> Generar Informe Mensual
              </h3>
              <p className="text-xs text-muted-foreground mb-4">El Motor IA analiza leads, tráfico y estructura web para redactar un informe profesional.</p>

              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className={labelCls}>Período del informe</label>
                  <input
                    value={reportPeriod}
                    onChange={e => setReportPeriod(e.target.value)}
                    placeholder="Abril 2026"
                    className={inputCls}
                  />
                </div>
                <button
                  onClick={handleGenerateReport}
                  disabled={generatingReport || !analytics}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 disabled:opacity-40 text-primary-foreground text-sm font-semibold rounded-xl transition-colors shrink-0"
                >
                  {generatingReport ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
                  {generatingReport ? 'Generando...' : 'Generar'}
                </button>
              </div>

              {!analytics && (
                <p className="text-xs text-amber-400/70 mt-2 flex items-center gap-1">
                  <AlertCircle size={11} /> Carga los datos de analítica primero (tab Panorama)
                </p>
              )}
            </div>

            {/* History */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileText size={14} className="text-primary" /> Historial de Informes
              </h3>

              {loadingReports ? (
                <div className="flex items-center gap-2 text-muted-foreground text-xs py-4"><Loader2 size={13} className="animate-spin" /> Cargando...</div>
              ) : reports.length === 0 ? (
                <p className="text-sm text-muted-foreground/60 py-4">No hay informes generados aún.</p>
              ) : (
                <div className="space-y-2">
                  {reports.map(r => (
                    <div key={r.id} className="flex items-center gap-4 p-3 rounded-xl bg-muted/20 border border-border hover:border-border/80 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <FileText size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground font-medium truncate">{r.title}</p>
                        <p className="text-[10px] text-muted-foreground">{new Date(r.generated_at).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                      {r.content && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono shrink-0">
                          Score {r.content.healthScore}/10
                        </span>
                      )}
                      <button onClick={() => downloadReport(r)} className="text-muted-foreground hover:text-primary transition-colors shrink-0">
                        <Download size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Report preview (latest) */}
            {reports[0]?.content && (
              <ReportPreview report={reports[0].content} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Report preview card ────────────────────────────────────────────────────────
function ReportPreview({ report }: { report: MonthlyReport }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Vista previa — último informe</h3>
        <span className={`text-lg font-bold ${report.healthScore >= 7 ? 'text-emerald-500' : report.healthScore >= 4 ? 'text-amber-500' : 'text-red-500'}`}>
          {report.healthScore}/10
        </span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{report.summary}</p>
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Visitas', value: report.metrics.visits },
          { label: 'Leads',   value: report.metrics.leads },
          { label: 'Conv.',   value: `${report.metrics.conversionRate}%` },
          { label: 'MRR',     value: `$${report.metrics.mrr}` },
        ].map(m => (
          <div key={m.label} className="bg-muted/50 rounded-lg p-2 text-center">
            <p className="text-sm font-bold text-foreground">{m.value}</p>
            <p className="text-[9px] text-muted-foreground/60">{m.label}</p>
          </div>
        ))}
      </div>
      {report.actionPlan?.slice(0, 3).map((a, i) => (
        <div key={i} className="flex items-start gap-2 text-xs">
          <span className="text-primary font-bold shrink-0">{i + 1}.</span>
          <span className="text-muted-foreground">{a.action}</span>
          <span className={`ml-auto shrink-0 text-[10px] font-medium ${a.impact === 'alto' ? 'text-emerald-600' : a.impact === 'medio' ? 'text-amber-600' : 'text-muted-foreground/40'}`}>
            {a.impact}
          </span>
        </div>
      ))}
    </div>
  );
}
