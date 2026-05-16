import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Globe, BarChart3, LogOut, Loader2,
  BrainCircuit, ArrowLeft, ExternalLink, TrendingUp, Activity,
  Monitor, Smartphone, Link2, MapPin, Building2, Scan, MousePointerClick, Shield,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import AIChatPanel from '@/components/hub/AIChatPanel';
import type { OrgContext } from '@/lib/ai';
import idenzaLogo from '@/assets/idenza-logo.png';

import { Lead, TrackerEvent, Project, DayData, Analytics, SiteSnapshot, parseBrief, resolvePlan, PLAN_CONFIGS, PlanConfig } from './types';
import { PRIMARY, statusConfig, shortDate } from './utils';
import { SetupScreen } from './SetupScreen';
import { LeadCard } from './LeadCard';
import { ChartTooltip } from './ChartTooltip';
import { BusinessBriefPanel } from './BusinessBriefPanel';
import { WebAuditPanel } from './WebAuditPanel';
import { BehaviorPanel } from './BehaviorPanel';

export function OrgDashboard({ project, multiProject, onBack, onSignOut, userEmail }: {
  project: Project; multiProject: boolean;
  onBack: () => void; onSignOut: () => void; userEmail: string;
}) {
  const [plan, setPlan] = useState<PlanConfig>(PLAN_CONFIGS['free']);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [chartData, setChartData] = useState<DayData[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [snapshots, setSnapshots] = useState<SiteSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [liveProject, setLiveProject] = useState<Project>(project);
  const [tab, setTab] = useState<'overview' | 'traffic' | 'behavior' | 'leads' | 'empresa' | 'audit' | 'ai'>('overview');

  const trackerActive = liveProject.events_count > 0;
  const briefReady    = !!(liveProject.description && liveProject.description.trim().length > 10);
  const isReady       = trackerActive && briefReady;

  const liveProjectRef = useRef(liveProject);
  useEffect(() => { liveProjectRef.current = liveProject; }, [liveProject]);

  const fetchStatus = useCallback(async (): Promise<Project> => {
    const [orgRes, leadsRes, eventsRes] = await Promise.all([
      supabase.from('organizations')
        .select('name, slug, website_url, industry, city, description, token, plan_name')
        .eq('id', project.id).maybeSingle(),
      supabase.from('leads').select('*', { count: 'exact', head: true }).eq('organization_id', project.id),
      supabase.from('events').select('*', { count: 'exact', head: true }).eq('organization_id', project.id),
    ]);
    const base = liveProjectRef.current;
    const updated: Project = {
      ...base,
      ...(orgRes.data || {}),
      id: project.id,
      leads_count:  leadsRes.count  ?? base.leads_count,
      events_count: eventsRes.count ?? base.events_count,
      plan_name: orgRes.data?.plan_name ?? base.plan_name,
    };
    const tier = resolvePlan(updated.plan_name);
    setPlan(PLAN_CONFIGS[tier]);
    setLiveProject(updated);
    return updated;
  }, [project.id]);

  const loadAnalytics = useCallback(async (p: Project) => {
    const { data: leadsData } = await supabase
      .from('leads').select('*').eq('organization_id', p.id)
      .order('created_at', { ascending: false }).limit(500);
    const allLeads = (leadsData as Lead[]) || [];

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const [richEventsRes, analyticsRes, snapshotsRes] = await Promise.all([
      supabase.from('events')
        .select('id, event_type, page_url, referrer, city, country, device, browser, session_id, metadata, created_at')
        .eq('organization_id', p.id)
        .gte('created_at', thirtyDaysAgo)
        .order('created_at', { ascending: false })
        .limit(5000),
      supabase.rpc('get_project_analytics', { p_org_id: p.id, p_days: 30 }),
      supabase.from('site_snapshots').select('*').eq('organization_id', p.id).order('captured_at', { ascending: false }),
    ]);
    const richEvents = (richEventsRes.data as TrackerEvent[]) || [];

    // Build enriched analytics from raw events
    if (analyticsRes.data) {
      const base = analyticsRes.data as Analytics;

      // Browsers
      const browserMap: Record<string, number> = {};
      richEvents.forEach(e => { if (e.browser) browserMap[e.browser] = (browserMap[e.browser] || 0) + 1; });
      const by_browser = Object.entries(browserMap).sort(([,a],[,b]) => b-a).map(([browser, count]) => ({ browser, count }));

      // Event types
      const etMap: Record<string, number> = {};
      richEvents.forEach(e => { etMap[e.event_type] = (etMap[e.event_type] || 0) + 1; });
      const by_event_type = Object.entries(etMap).sort(([,a],[,b]) => b-a).map(([event_type, count]) => ({ event_type, count }));

      // Referrers
      const refMap: Record<string, number> = {};
      richEvents.filter(e => e.event_type === 'pageview').forEach(e => {
        const ref = e.referrer?.trim() ? new URL(e.referrer).hostname.replace('www.', '') : 'directo';
        refMap[ref] = (refMap[ref] || 0) + 1;
      });
      const by_referrer = Object.entries(refMap).sort(([,a],[,b]) => b-a).map(([referrer, count]) => ({ referrer, count }));

      // Behavior metrics
      const sessions = new Set(richEvents.map(e => e.session_id).filter(Boolean));
      const sessionsWithScroll50 = new Set(richEvents.filter(e => e.event_type === 'scroll_50').map(e => e.session_id));
      const sessionsWithScroll90 = new Set(richEvents.filter(e => e.event_type === 'scroll_90').map(e => e.session_id));
      const totalSessions = sessions.size || 1;
      const scroll_50_rate = (sessionsWithScroll50.size / totalSessions) * 100;
      const scroll_90_rate = (sessionsWithScroll90.size / totalSessions) * 100;
      const rage_click_count = richEvents.filter(e => e.event_type === 'rage_click').length;
      const form_started_count = richEvents.filter(e => e.event_type === 'form_started').length;

      // Avg time on page from session_leave metadata
      const sessionLeaveEvents = richEvents.filter(e => e.event_type === 'session_leave' && e.metadata?.time_active_seconds);
      const avg_time_on_page = sessionLeaveEvents.length > 0
        ? Math.round(sessionLeaveEvents.reduce((s, e) => s + (e.metadata?.time_active_seconds ?? 0), 0) / sessionLeaveEvents.length)
        : 0;

      // Consent rate
      const consentGranted = richEvents.filter(e => e.event_type === 'consent_granted').length;
      const consentTotal = richEvents.filter(e => e.event_type === 'consent_granted' || e.event_type === 'consent_necessary_only').length;
      const consent_rate = consentTotal > 0 ? (consentGranted / consentTotal) * 100 : 0;

      setAnalytics({ ...base, by_browser, by_event_type, by_referrer, scroll_50_rate, scroll_90_rate, rage_click_count, form_started_count, avg_time_on_page, consent_rate });
    }
    if (snapshotsRes.data) setSnapshots(snapshotsRes.data as SiteSnapshot[]);

    const days: DayData[] = Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      const iso = d.toISOString().split('T')[0];
      return {
        date: iso, label: shortDate(iso),
        leads:  allLeads.filter(l => l.created_at.startsWith(iso)).length,
        visits: richEvents.filter(e => e.created_at.startsWith(iso) && e.event_type === 'pageview').length,
      };
    });
    setLeads(allLeads);
    setChartData(days);
  }, []);

  const init = useCallback(async () => {
    setLoading(true);
    const fresh = await fetchStatus();
    const ok = fresh.events_count > 0 && !!(fresh.description && fresh.description.trim().length > 10);
    if (ok) await loadAnalytics(fresh);
    setLoading(false);
  }, [fetchStatus, loadAnalytics]);

  // ── Realtime Listener ───────────────────────────────────────────────────
  useEffect(() => {
    if (!project.id) return;

    const channel = supabase
      .channel(`org-${project.id}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'leads',
        filter: `organization_id=eq.${project.id}`
      }, (payload) => {
        const newLead = payload.new as Lead;
        setLeads(prev => {
          if (prev.find(l => l.id === newLead.id)) return prev;
          
          toast.success('¡Nuevo lead capturado!', {
            description: `${newLead.name || 'Anónimo'} acaba de completar un formulario.`,
            duration: 5000,
          });
          
          return [newLead, ...prev];
        });
        setLiveProject(prev => ({ ...prev, leads_count: (prev.leads_count || 0) + 1 }));
      })
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'events',
        filter: `organization_id=eq.${project.id}`
      }, () => {
        setLiveProject(prev => ({ ...prev, events_count: (prev.events_count || 0) + 1 }));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [project.id]);

  useEffect(() => { init(); }, [init]);

  const handleRefresh = async () => {
    setRefreshing(true);
    const fresh = await fetchStatus();
    const freshOk = fresh.events_count > 0 && !!(fresh.description && fresh.description.trim().length > 10);
    const wasReady = liveProjectRef.current.events_count > 0 &&
      !!(liveProjectRef.current.description && liveProjectRef.current.description.trim().length > 10);
    if (freshOk && !wasReady) {
      setLoading(true);
      await loadAnalytics(fresh);
      setLoading(false);
    }
    setRefreshing(false);
  };

  const updateLeadStatus = async (id: string, status: Lead['status']) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    await supabase.from('leads').update({ status }).eq('id', id);
  };

  const {
    newLeads, contacted, closed, totalVisits, convRate, thisWeekLeads,
    statusDist, topCities, leadsByPage, aiCtx
  } = useMemo(() => {
    const newL    = leads.filter(l => l.status === 'new').length;
    const cont    = leads.filter(l => l.status === 'contacted').length;
    const cls     = leads.filter(l => l.status === 'closed').length;
    const visits  = chartData.reduce((s, d) => s + d.visits, 0);
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    const leads30d     = leads.filter(l => Date.now() - new Date(l.created_at).getTime() < thirtyDaysMs).length;
    const rate         = visits > 0 ? ((leads30d / visits) * 100).toFixed(1) : '—';
    const thisWkLeads  = leads.filter(l => Date.now() - new Date(l.created_at).getTime() < 7 * 24 * 60 * 60 * 1000).length;

    const sDist = [
      { name: 'Nuevos',      value: newL,   color: '#3b82f6' },
      { name: 'Seguimiento', value: cont,  color: '#f59e0b' },
      { name: 'Cerrados',    value: cls,     color: '#10b981' },
    ].filter(d => d.value > 0);

    const cCount = leads.reduce((acc, l) => {
      if (l.city) acc[l.city] = (acc[l.city] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const tCities = Object.entries(cCount).sort(([, a], [, b]) => b - a).slice(0, 5).map(([city, count]) => ({ city, count }));

    // Atribución: leads por página
    const pageCount = leads.reduce((acc, l) => {
      if (l.page_url) acc[l.page_url] = (acc[l.page_url] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const lByPage = Object.entries(pageCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([page, count]) => ({ page, count }));

    const brief = parseBrief(liveProject.description);

    const context: OrgContext = {
      orgName: liveProject.name, industry: liveProject.industry, city: liveProject.city,
      website: liveProject.website_url, totalLeads: leads.length, newLeads: newL,
      totalVisits: visits, cities: Object.keys(cCount),
      recentLeads: leads.slice(0, 10).map(l => ({ name: l.name, city: l.city, status: l.status })),
      brief,
      snapshots,
      leadsByPage: lByPage,
    };

    return {
      newLeads: newL, contacted: cont, closed: cls, totalVisits: visits,
      convRate: rate, thisWeekLeads: thisWkLeads, statusDist: sDist, topCities: tCities,
      leadsByPage: lByPage, aiCtx: context
    };
  }, [leads, chartData, liveProject, snapshots]);

  const TABS = [
    { id: 'overview',  label: 'Resumen',      icon: BarChart3,        active: 'text-primary border-primary/20 bg-primary/10' },
    { id: 'traffic',   label: 'Tráfico',      icon: Globe,            active: 'text-[#CCFF00] border-[#CCFF00]/20 bg-[#CCFF00]/10' },
    { id: 'behavior',  label: 'Comportamiento', icon: MousePointerClick, active: 'text-blue-400 border-blue-400/20 bg-blue-400/10' },
    { id: 'leads',     label: 'Leads',        icon: Users,            active: 'text-primary border-primary/20 bg-primary/10', count: leads.length > 0 ? leads.length : undefined },
    { id: 'empresa',   label: 'Mi Empresa',   icon: Building2,        active: 'text-violet-400 border-violet-400/20 bg-violet-400/10' },
    { id: 'audit',     label: 'Auditoría',    icon: Scan,             active: 'text-amber-400 border-amber-400/20 bg-amber-400/10' },
    { id: 'ai',        label: 'Asesor IA',    icon: BrainCircuit,     active: 'text-primary border-primary/20 bg-primary/10' },
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/3 rounded-full" style={{ filter: 'blur(120px)' }} />
      </div>

      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-2xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {multiProject ? (
              <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group">
                <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-xs font-medium hidden sm:block">Proyectos</span>
              </button>
            ) : (
              <img src={idenzaLogo} alt="Idenza" className="h-6 w-auto opacity-60" />
            )}
            <div className="h-4 w-px bg-border" />
            <span className="font-bold text-foreground text-sm font-sora truncate max-w-[120px] sm:max-w-xs">{liveProject.name}</span>
            {liveProject.website_url && (
              <a href={liveProject.website_url} target="_blank" rel="noreferrer" className="text-muted-foreground/40 hover:text-primary transition-colors hidden sm:block">
                <ExternalLink size={13} />
              </a>
            )}
          </div>
          <div className="flex items-center gap-4">
            {/* Plan badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-mono" style={{ color: plan.color, borderColor: `${plan.color}30`, background: `${plan.color}10` }}>
              <Shield size={10} />
              {plan.label}
            </div>
            <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-mono transition-all ${
              isReady
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                : 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${isReady ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`} />
              {isReady ? 'En vivo' : 'Configurando'}
            </div>
            <span className="text-[11px] text-muted-foreground/50 hidden sm:block">{userEmail}</span>
            <button onClick={onSignOut} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group">
              <LogOut size={13} className="group-hover:translate-x-0.5 transition-transform" />Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10">
        {loading ? (
          <div className="flex justify-center py-32"><Loader2 size={20} className="animate-spin text-muted-foreground" /></div>
        ) : !isReady ? (
          <SetupScreen
            project={liveProject}
            onRefresh={handleRefresh}
            refreshing={refreshing}
            onGoToEmpresa={() => setTab('empresa')}
          />
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {[
                { icon: Users,      label: 'Leads totales',  value: leads.length,   sub: thisWeekLeads > 0 ? `+${thisWeekLeads} esta semana` : 'Sin actividad reciente', color: 'text-primary',      glow: 'rgba(233,99,50,0.12)' },
                { icon: BarChart3,  label: 'Visitas (30d)',  value: totalVisits,    sub: 'Últimos 30 días',                                                              color: 'text-primary',     glow: 'rgba(123,44,191,0.15)' },
                { icon: TrendingUp, label: 'Conversión',     value: `${convRate}%`, sub: 'Leads / visitas',                                                             color: 'text-[#CCFF00]',   glow: 'rgba(204,255,0,0.12)' },
                { icon: Activity,   label: 'Sin responder',  value: newLeads,       sub: newLeads === 0 ? 'Todo al día' : `${newLeads} requieren atención`,             color: newLeads > 0 ? 'text-amber-400' : 'text-[#CCFF00]', glow: newLeads > 0 ? 'rgba(245,158,11,0.12)' : 'rgba(204,255,0,0.12)' },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  className="relative bg-card border border-border rounded-2xl p-4 sm:p-5 overflow-hidden group hover:shadow-md transition-all">
                  <s.icon size={14} className={`${s.color} mb-3 opacity-60`} />
                  <div className={`text-2xl font-bold font-sora ${s.color}`}>{s.value}</div>
                  <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mt-1">{s.label}</div>
                  <div className="text-[10px] text-muted-foreground/60 mt-1 truncate">{s.sub}</div>
                </motion.div>
              ))}
            </div>

            {/* Tabs — fade en el borde derecho indica scroll en mobile */}
            <div className="relative mb-8">
              <div className="flex gap-1 p-1 bg-muted/50 border border-border rounded-2xl overflow-x-auto scrollbar-hide">
                {TABS.map(t => (
                  <button key={t.id} onClick={() => setTab(t.id as typeof tab)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border whitespace-nowrap ${tab === t.id ? t.active : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
                    <t.icon size={14} />
                    {t.label}
                    {'count' in t && t.count !== undefined && <span className="text-[10px] font-mono opacity-60">{t.count}</span>}
                  </button>
                ))}
              </div>
              {/* Fade derecho visible solo en mobile para indicar scroll */}
              <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-background to-transparent pointer-events-none rounded-r-2xl sm:hidden" />
            </div>

            <AnimatePresence mode="wait">

              {/* ─── OVERVIEW ──────────────────────────────────────────────────── */}
              {tab === 'overview' && (
                <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                  <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-3 mb-5 flex-wrap">
                      <div>
                        <div className="font-bold text-foreground/80 text-sm">Actividad — últimos 30 días</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Leads captados y visitas al sitio</div>
                      </div>
                      <div className="flex items-center gap-4 text-[11px] text-muted-foreground shrink-0">
                        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded inline-block" style={{ background: PRIMARY }} />Leads</span>
                        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded bg-blue-400/60 inline-block" />Visitas</span>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={180}>
                      <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="gradLeads" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor={PRIMARY}   stopOpacity={0.25} />
                            <stop offset="95%" stopColor={PRIMARY}   stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="gradVisits" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                        <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'rgba(100,116,139,0.7)' }} tickLine={false} axisLine={false} interval={4} />
                        <YAxis tick={{ fontSize: 10, fill: 'rgba(100,116,139,0.7)' }} tickLine={false} axisLine={false} allowDecimals={false} />
                        <Tooltip content={<ChartTooltip />} />
                        <Area type="monotone" dataKey="visits" name="Visitas" stroke="#3b82f6" strokeWidth={1.5} strokeOpacity={0.6} fill="url(#gradVisits)" dot={false} />
                        <Area type="monotone" dataKey="leads"  name="Leads"   stroke={PRIMARY}  strokeWidth={2} fill="url(#gradLeads)" dot={false} activeDot={{ r: 4, fill: PRIMARY }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
                      <div className="font-bold text-foreground/80 text-sm mb-1">Estado de leads</div>
                      <div className="text-xs text-muted-foreground mb-5">Distribución por etapa</div>
                      {leads.length === 0 ? (
                        <div className="flex items-center justify-center h-40 text-muted-foreground/40 text-xs font-mono">Sin leads aún</div>
                      ) : (
                        <>
                          <div className="flex justify-center mb-4">
                            <PieChart width={160} height={160}>
                              <Pie data={statusDist} cx={75} cy={75} innerRadius={50} outerRadius={72} paddingAngle={3} dataKey="value" strokeWidth={0}>
                                {statusDist.map((entry, i) => <Cell key={i} fill={entry.color} fillOpacity={0.85} />)}
                              </Pie>
                            </PieChart>
                          </div>
                          <div className="space-y-2">
                            {statusDist.map((d, i) => (
                              <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                                  <span className="text-xs text-muted-foreground/70">{d.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-foreground/80">{d.value}</span>
                                  <span className="text-[10px] text-muted-foreground/30">{((d.value / leads.length) * 100).toFixed(0)}%</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
                      <div className="font-bold text-foreground/80 text-sm mb-1">Leads por ciudad</div>
                      <div className="text-xs text-muted-foreground mb-5">Top 5 ciudades</div>
                      {topCities.length === 0 ? (
                        <div className="flex items-center justify-center h-40 text-muted-foreground/40 text-xs font-mono">Sin datos de ciudad</div>
                      ) : (
                        <ResponsiveContainer width="100%" height={170}>
                          <BarChart data={topCities} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
                            <XAxis type="number" hide />
                            <YAxis dataKey="city" type="category" tick={{ fontSize: 10, fill: 'rgba(100,116,139,0.5)' }} tickLine={false} axisLine={false} width={55} />
                            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} content={<ChartTooltip />} />
                            <Bar dataKey="count" name="Leads" fill={PRIMARY} fillOpacity={0.75} radius={[0, 6, 6, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>

                  {/* Atribución de leads por página */}
                  {leadsByPage.length > 0 && (
                    <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
                      <div className="flex items-center gap-2 mb-1">
                        <Link2 size={13} className="text-muted-foreground" />
                        <div className="font-bold text-foreground/80 text-sm">Páginas que más generan leads</div>
                      </div>
                      <div className="text-xs text-muted-foreground mb-5">De qué páginas vienen tus contactos</div>
                      <div className="space-y-3">
                        {leadsByPage.map((p, i) => {
                          const max = leadsByPage[0].count;
                          const pct = Math.round((p.count / max) * 100);
                          const path = p.page.replace(/^https?:\/\/[^/]+/, '') || '/';
                          return (
                            <div key={i}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-foreground/70 truncate max-w-[280px]" title={p.page}>{path}</span>
                                <span className="text-xs font-bold text-foreground/80 shrink-0 ml-2">{p.count} {p.count === 1 ? 'lead' : 'leads'}</span>
                              </div>
                              <div className="h-1.5 bg-border rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: i * 0.06, duration: 0.5 }}
                                  className="h-full rounded-full" style={{ background: PRIMARY }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {leads.length > 0 && (
                    <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-5">
                        <div>
                          <div className="font-bold text-foreground/80 text-sm">Leads recientes</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Últimas 5 capturas</div>
                        </div>
                        {leads.length > 5 && (
                          <button onClick={() => setTab('leads')} className="text-xs text-primary/60 hover:text-primary transition-colors">Ver todos →</button>
                        )}
                      </div>
                      <div className="space-y-2">
                        {leads.slice(0, 5).map(lead => {
                          const cfg = statusConfig[lead.status];
                          return (
                            <div key={lead.id} className="flex items-center gap-3 px-4 py-3 bg-muted/30 border border-border rounded-xl">
                              <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center font-bold text-primary text-xs font-sora shrink-0">
                                {(lead.name || lead.email || '?')[0].toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-foreground/80 truncate">{lead.name || lead.email || 'Anónimo'}</div>
                                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground/30">
                                  {lead.city && <span className="flex items-center gap-1"><MapPin size={9} />{lead.city}</span>}
                                  {lead.page_url && <span className="hidden sm:inline truncate max-w-[100px]">{lead.page_url.replace(/^https?:\/\/[^/]+/, '') || '/'}</span>}
                                  {lead.time_on_page !== null && lead.time_on_page !== undefined && (
                                    <span className="hidden sm:inline shrink-0">{lead.time_on_page < 60 ? `${lead.time_on_page}s` : `${Math.floor(lead.time_on_page / 60)}m`} en página</span>
                                  )}
                                </div>
                              </div>
                              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium ${cfg.bg} ${cfg.color} shrink-0`}>
                                <div className={`w-1 h-1 rounded-full ${cfg.dot}`} />
                                {cfg.label}
                              </div>
                              <span className="text-[10px] font-mono text-muted-foreground/40 shrink-0">{shortDate(lead.created_at)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ─── TRAFFIC ───────────────────────────────────────────────────── */}
              {tab === 'traffic' && (
                <motion.div key="traffic" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { label: 'Sesiones únicas (30d)', value: analytics?.unique_sessions ?? 0,  color: 'text-[#CCFF00]' },
                      { label: 'Páginas únicas',        value: analytics?.top_pages.length ?? 0, color: 'text-primary' },
                      { label: 'Países detectados',     value: analytics?.by_country.length ?? 0, color: 'text-violet-400' },
                    ].map((s, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        className="bg-card border border-border rounded-2xl p-4 sm:p-5">
                        <div className={`text-2xl font-bold font-sora ${s.color}`}>{s.value}</div>
                        <div className="text-[10px] font-mono text-muted-foreground/30 uppercase tracking-wider mt-1">{s.label}</div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
                    <div className="font-bold text-foreground/80 text-sm mb-1">Visitas por hora del día</div>
                    <div className="text-xs text-muted-foreground mb-5">¿A qué hora llega más tráfico a tu web?</div>
                    {!analytics?.by_hour.length ? (
                      <div className="flex items-center justify-center h-32 text-muted-foreground/40 text-xs font-mono">Sin datos aún</div>
                    ) : (
                      <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={Array.from({ length: 24 }, (_, h) => ({
                          hour: `${h}h`,
                          visits: analytics.by_hour.find(x => x.hour === h)?.count ?? 0,
                        }))} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                          <XAxis dataKey="hour" tick={{ fontSize: 9, fill: 'rgba(100,116,139,0.7)' }} tickLine={false} axisLine={false} interval={2} />
                          <YAxis tick={{ fontSize: 10, fill: 'rgba(100,116,139,0.7)' }} tickLine={false} axisLine={false} allowDecimals={false} />
                          <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} content={<ChartTooltip />} />
                          <Bar dataKey="visits" name="Visitas" fill="#10b981" fillOpacity={0.7} radius={[3, 3, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
                      <div className="flex items-center gap-2 mb-1">
                        <Link2 size={13} className="text-muted-foreground" />
                        <div className="font-bold text-foreground/80 text-sm">Páginas más visitadas</div>
                      </div>
                      <div className="text-xs text-muted-foreground mb-5">Rutas con más tráfico</div>
                      {!analytics?.top_pages.length ? (
                        <div className="flex items-center justify-center h-32 text-muted-foreground/40 text-xs font-mono">Sin datos aún</div>
                      ) : (
                        <div className="space-y-3">
                          {analytics.top_pages.map((p, i) => {
                            const max = analytics.top_pages[0].count;
                            const pct = Math.round((p.count / max) * 100);
                            const path = p.url.replace(/^https?:\/\/[^/]+/, '') || '/';
                            return (
                              <div key={i}>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-foreground/70 truncate max-w-[200px]" title={p.url}>{path}</span>
                                  <span className="text-xs font-bold text-foreground/80 shrink-0 ml-2">{p.count}</span>
                                </div>
                                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: i * 0.05, duration: 0.5 }}
                                    className="h-full rounded-full" style={{ background: PRIMARY }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="bg-card border border-border rounded-2xl p-4 sm:p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <Monitor size={13} className="text-muted-foreground" />
                          <div className="font-bold text-foreground/80 text-sm">Dispositivos</div>
                        </div>
                        {!analytics?.by_device.length ? (
                          <div className="text-muted-foreground/40 text-xs font-mono">Sin datos</div>
                        ) : (
                          <div className="space-y-2">
                            {analytics.by_device.map((d, i) => {
                              const total = analytics.by_device.reduce((s, x) => s + x.count, 0);
                              const Icon = d.device?.toLowerCase().includes('mobile') ? Smartphone : Monitor;
                              return (
                                <div key={i} className="flex items-center gap-3">
                                  <Icon size={12} className="text-muted-foreground/30 shrink-0" />
                                  <span className="text-xs text-muted-foreground/70 flex-1 truncate capitalize">{d.device}</span>
                                  <span className="text-xs font-bold text-muted-foreground/300">{d.count}</span>
                                  <span className="text-[10px] text-muted-foreground/30 w-8 text-right">{((d.count / total) * 100).toFixed(0)}%</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <div className="bg-card border border-border rounded-2xl p-4 sm:p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <Globe size={13} className="text-muted-foreground" />
                          <div className="font-bold text-foreground/80 text-sm">Países</div>
                        </div>
                        {!analytics?.by_country.length ? (
                          <div className="text-muted-foreground/40 text-xs font-mono">Sin datos</div>
                        ) : (
                          <div className="space-y-2">
                            {analytics.by_country.map((c, i) => {
                              const total = analytics.by_country.reduce((s, x) => s + x.count, 0);
                              return (
                                <div key={i} className="flex items-center gap-3">
                                  <span className="text-xs text-muted-foreground/70 flex-1 truncate">{c.country}</span>
                                  <span className="text-xs font-bold text-muted-foreground/300">{c.count}</span>
                                  <span className="text-[10px] text-muted-foreground/30 w-8 text-right">{((c.count / total) * 100).toFixed(0)}%</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ─── COMPORTAMIENTO ─────────────────────────────────────────────── */}
              {tab === 'behavior' && (
                <motion.div key="behavior" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <BehaviorPanel analytics={analytics} plan={plan} />
                </motion.div>
              )}

              {/* ─── LEADS ─────────────────────────────────────────────────────── */}
              {tab === 'leads' && (
                <motion.div key="leads" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2">
                  {!plan.features.leads ? (
                    <div className="text-center py-24">
                      <Shield size={32} className="text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-muted-foreground/40 font-mono text-sm">Captura de leads disponible desde el plan Starter.</p>
                    </div>
                  ) : leads.length === 0 ? (
                    <div className="text-center py-24">
                      <Users size={32} className="text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-muted-foreground/40 font-mono text-sm">Aún no hay leads.</p>
                      <p className="text-muted-foreground/60 text-xs mt-1">El tracker capturará los formularios de tu web automáticamente.</p>
                    </div>
                  ) : leads.map(lead => <LeadCard key={lead.id} lead={lead} onStatusChange={updateLeadStatus} ctx={aiCtx} />)}
                </motion.div>
              )}

              {/* ─── MI EMPRESA ────────────────────────────────────────────────── */}
              {tab === 'empresa' && (
                <motion.div key="empresa" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <BusinessBriefPanel
                    projectId={liveProject.id}
                    description={liveProject.description}
                    onSaved={(desc) => setLiveProject(prev => ({ ...prev, description: desc }))}
                    onGoToAudit={() => setTab('audit')}
                  />
                </motion.div>
              )}

              {/* ─── AUDITORÍA ─────────────────────────────────────────────────── */}
              {tab === 'audit' && (
                <motion.div key="audit" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <WebAuditPanel ctx={aiCtx} onGoToEmpresa={() => setTab('empresa')} />
                </motion.div>
              )}

              {/* ─── ASESOR IA ─────────────────────────────────────────────────── */}
              {tab === 'ai' && (
                <motion.div key="ai" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <AIChatPanel ctx={aiCtx} />
                </motion.div>
              )}

            </AnimatePresence>
          </>
        )}
      </main>
    </div>
  );
}
