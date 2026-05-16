import { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, Users, FileText, MessageSquare,
  Settings, LogOut, ChevronRight, Menu, X,
  Zap, TrendingUp, Shield, QrCode, PlusCircle, List
} from 'lucide-react';
import { supabase, supabaseAdmin, ADMIN_SECRET, isAdminConfigured } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { ContentManager } from '@/components/admin/ContentManager';
import { ForumModerator } from '@/components/admin/ForumModerator';
import { CRMDashboard } from '@/components/crm/CRMDashboard';
import { ClientDirectory } from '@/components/crm/ClientDirectory';
import { ClientFile } from '@/components/crm/ClientFile';
import { CRMConfig } from '@/components/crm/CRMConfig';
import { OnboardingManager } from '@/components/dashboard/OnboardingManager';
import { QRDinamico } from '@/components/admin/QRDinamico';
import { QRManager } from '@/components/admin/QRManager';
import { ThemeToggle } from '@/components/ThemeToggle';
import idenzaLogo from '@/assets/idenza-logo.png';

// ─── TYPES ────────────────────────────────────────────────────────────────────
export interface ProjectRow {
  id: string; name: string; slug: string;
  website_url: string | null; industry: string | null;
  city: string | null; description: string | null;
  token: string; created_at: string;
  leads_count: number; events_count: number;
  // CRM fields
  plan_name: string | null;
  payment_status: string | null;
  monthly_amount: number | null;
  next_billing_date: string | null;
  internal_notes: string | null;
  github_url: string | null;
  supabase_project_id: string | null;
  hosting_provider: string | null;
  framework: string | null;
  client_email: string | null;
}
export interface ClientRow {
  user_id: string; email: string; created_at: string;
  projects: ProjectRow[];
}

type Section = 'dashboard' | 'clientes' | 'onboarding' | 'qr' | 'contenido' | 'foros' | 'config';

const NAV: { id: Section; label: string; icon: React.ReactNode; badge?: boolean; isNew?: boolean }[] = [
  { id: 'dashboard', label: 'Dashboard',  icon: <LayoutDashboard size={16} /> },
  { id: 'clientes',  label: 'Clientes',   icon: <Users size={16} />, badge: true },
  { id: 'onboarding',label: 'Onboarding', icon: <Zap size={16} /> },
  { id: 'qr',        label: 'QR Dinámico',icon: <QrCode size={16} />, isNew: true },
  { id: 'contenido', label: 'Contenido',  icon: <FileText size={16} /> },
  { id: 'foros',     label: 'Foros',      icon: <MessageSquare size={16} /> },
  { id: 'config',    label: 'Config',     icon: <Settings size={16} /> },
];

// ─── MAIN CRM SHELL ───────────────────────────────────────────────────────────
export default function AdminHub() {
  const { signOut } = useAuth();
  const [section, setSection]               = useState<Section>('dashboard');
  const [selectedClient, setSelectedClient] = useState<ClientRow | null>(null);
  const [clients, setClients]               = useState<ClientRow[]>([]);
  const [loading, setLoading]               = useState(true);
  const [sidebarOpen, setSidebarOpen]       = useState(false);

  // ── Load clients ──────────────────────────────────────────────────────────
  const loadClients = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_admin_clients', {
        p_admin_secret: ADMIN_SECRET,
      });
      if (error) throw error;

      const raw = (data as ClientRow[]) ?? [];
      
      // Ensure monthly_amount is always a number
      const enriched: ClientRow[] = raw.map(c => ({
        ...c,
        projects: c.projects.map(p => ({
          ...p,
          monthly_amount: p.monthly_amount != null ? Number(p.monthly_amount) : 0
        })),
      }));

      setClients(enriched);

      if (selectedClient) {
        const refreshed = enriched.find(c => c.user_id === selectedClient.user_id);
        if (refreshed) setSelectedClient(refreshed);
      }
    } catch (e) {
      console.error('loadClients error:', e);
    } finally {
      setLoading(false);
    }
  }, [selectedClient?.user_id]);

  useEffect(() => { loadClients(); }, []);

  const goTo = (s: Section) => {
    setSection(s);
    if (s !== 'clientes') setSelectedClient(null);
    setSidebarOpen(false);
  };

  const openClient = (client: ClientRow) => {
    setSelectedClient(client);
    setSection('clientes');
    setSidebarOpen(false);
  };

  const [qrTab, setQrTab] = useState<'crear' | 'gestionar'>('crear');

  const renderContent = () => {
    if (section === 'dashboard') return <CRMDashboard clients={clients} loading={loading} onNavigate={goTo} onOpenClient={openClient} />;
    if (section === 'clientes') {
      if (selectedClient) return <ClientFile client={selectedClient} onBack={() => setSelectedClient(null)} onRefresh={loadClients} />;
      return <ClientDirectory clients={clients} loading={loading} onSelect={openClient} onRefresh={loadClients} />;
    }
    if (section === 'qr') return (
      <div className="flex flex-col h-full">
        {/* QR sub-tabs */}
        <div className="flex items-center gap-2 px-6 pt-5 pb-0 border-b border-border/50">
          <button
            onClick={() => setQrTab('crear')}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-xl text-xs font-semibold border-b-2 transition-all ${
              qrTab === 'crear'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <PlusCircle size={13} /> Crear QR
          </button>
          <button
            onClick={() => setQrTab('gestionar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-xl text-xs font-semibold border-b-2 transition-all ${
              qrTab === 'gestionar'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <List size={13} /> Mis QRs
          </button>
        </div>
        <div className="flex-1 overflow-auto">
          {qrTab === 'crear' ? <QRDinamico /> : <QRManager />}
        </div>
      </div>
    );
    if (section === 'contenido') return <ContentManager />;
    if (section === 'onboarding') return <OnboardingManager />;
    if (section === 'foros')     return <ForumModerator />;
    if (section === 'config')    return <CRMConfig />;
    return null;
  };

  const totalMRR = clients.flatMap(c => c.projects)
    .filter(p => p.payment_status === 'activo')
    .reduce((s, p) => s + (Number(p.monthly_amount) || 0), 0);

  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans">

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 z-40 flex flex-col bg-card border-r border-border/50
        transition-transform duration-300 ease-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static
      `}>

        {/* Logo area */}
        <div className="px-5 pt-6 pb-5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
              <img src={idenzaLogo} alt="Idenza" className="h-5 w-auto" onError={e => (e.currentTarget.style.display = 'none')} />
            </div>
            <div>
              <p className="text-foreground text-sm font-bold tracking-wide leading-none">IDENZA</p>
              <p className="text-[10px] text-primary/80 font-mono tracking-[0.15em] uppercase mt-0.5">Core CRM</p>
            </div>
          </div>

          {/* Quick MRR stat */}
          <div className="bg-primary/5 border border-primary/15 rounded-2xl p-3.5">
            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest mb-1">MRR Activo</p>
            <p className="text-2xl font-bold text-foreground">S/{totalMRR.toFixed(0)}<span className="text-sm text-muted-foreground font-normal ml-1">Soles</span></p>
            <div className="flex items-center gap-1 mt-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <p className="text-[10px] text-emerald-400">{clients.length} clientes activos</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.2em] px-3 mb-2">Navegación</p>
          {NAV.map(item => {
            const active = section === item.id;
            return (
              <button
                key={item.id}
                onClick={() => goTo(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative ${
                  active
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
                }`}
                style={active ? {
                  background: 'linear-gradient(135deg, rgba(var(--primary-rgb),0.15) 0%, rgba(var(--primary-rgb),0.05) 100%)',
                  border: '1px solid rgba(var(--primary-rgb),0.25)',
                  boxShadow: '0 0 20px rgba(var(--primary-rgb),0.08)'
                } : {}}
              >
                {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-full" />}
                <span className={`transition-colors ${active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {item.badge && clients.length > 0 && (
                  <span className="ml-auto text-[10px] bg-primary/20 text-primary border border-primary/25 px-1.5 py-0.5 rounded-lg font-mono font-semibold">
                    {clients.length}
                  </span>
                )}
                {item.isNew && (
                  <span className="ml-auto text-[9px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-1.5 py-0.5 rounded-lg font-mono font-semibold tracking-wider">
                    NEW
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border/50">
          <div className="flex items-center gap-2 px-3 py-2 mb-2 rounded-xl bg-foreground/5">
            <div className="w-7 h-7 rounded-lg bg-primary/20 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              J
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-foreground font-medium truncate">Jack Franklin</p>
              <p className="text-[10px] text-muted-foreground truncate">Admin</p>
            </div>
            <Shield size={12} className="text-emerald-500/60 shrink-0" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={signOut}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-red-400 hover:bg-red-500/[0.06] transition-all group"
            >
              <LogOut size={14} className="group-hover:text-red-400 transition-colors" />
              Salir
            </button>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
          <button onClick={() => setSidebarOpen(true)} className="text-muted-foreground hover:text-foreground p-1 transition-colors">
            <Menu size={20} />
          </button>
          <span className="text-foreground text-sm font-semibold">IDENZA Core</span>
          {selectedClient && section === 'clientes' && (
            <div className="flex items-center gap-1 ml-auto text-xs text-muted-foreground">
              <button onClick={() => setSelectedClient(null)} className="hover:text-primary transition-colors">Clientes</button>
              <ChevronRight size={12} />
              <span className="text-primary">{selectedClient.projects[0]?.name ?? selectedClient.email}</span>
            </div>
          )}
        </header>

        {/* Desktop breadcrumb */}
        {section === 'clientes' && selectedClient && (
          <div className="hidden lg:flex items-center gap-1.5 px-8 py-3 text-xs text-foreground/70 border-b border-border/50">
            <button onClick={() => setSelectedClient(null)} className="hover:text-primary transition-colors font-medium">Clientes</button>
            <ChevronRight size={12} />
            <span className="text-muted-foreground">{selectedClient.email}</span>
            {selectedClient.projects[0] && (
              <>
                <ChevronRight size={12} />
                <span className="text-primary font-medium">{selectedClient.projects[0].name}</span>
              </>
            )}
          </div>
        )}

        {/* Content */}
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
