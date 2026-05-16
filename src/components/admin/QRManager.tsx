import {
  QrCode, Trash2, Pause, Play, BarChart2, ExternalLink,
  RefreshCw, Search, Copy, AlertTriangle, Calendar,
  Edit2, Check, X as CloseIcon, Download, Palette, Eye
} from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { INDUSTRIES, buildQR, type QRTemplate } from './QRDinamico';
import QRCodeStyling from 'qr-code-styling';

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface QRLink {
  id: string;
  slug: string;
  destination: string;
  industry_id: string;
  template_id: string;
  click_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  custom_colors?: any;
  logo_url?: string | null;
}

const BASE_URL = 'https://idenza.site/r/';

const INDUSTRY_BADGES: Record<string, string> = {
  restaurante: '🍔', cafe: '☕', moda: '👟', salud: '🏥',
  hotel: '🏨', regalo: '🎁', educacion: '🎓', tecnologia: '💻',
  belleza: '💆', gym: '💪', inmobiliaria: '🏠', automotriz: '🚗',
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-PE', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

// ─── CONFIRM DIALOG ───────────────────────────────────────────────────────────
function ConfirmDialog({
  open, title, description, onConfirm, onCancel, danger = false,
}: {
  open: boolean; title: string; description: string;
  onConfirm: () => void; onCancel: () => void; danger?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-card border border-border/60 rounded-2xl shadow-2xl p-6 w-full max-w-sm space-y-4">
        <div className="flex items-start gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${danger ? 'bg-red-500/15 border border-red-500/25' : 'bg-amber-500/15 border border-amber-500/25'}`}>
            <AlertTriangle size={16} className={danger ? 'text-red-400' : 'text-amber-400'} />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-xl border border-border/60 text-xs font-semibold text-muted-foreground hover:bg-foreground/5 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${danger ? 'bg-red-500/15 border border-red-500/40 text-red-400 hover:bg-red-500/25' : 'bg-amber-500/15 border border-amber-500/40 text-amber-400 hover:bg-amber-500/25'}`}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export function QRManager() {
  const [links, setLinks] = useState<QRLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'paused'>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState('');

  // Preview / Redesign Modal State
  const [previewLink, setPreviewLink] = useState<QRLink | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<QRTemplate | null>(null);
  const [customColors, setCustomColors] = useState<any>(null);
  const [isSavingDesign, setIsSavingDesign] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const qrRef = useRef<HTMLDivElement>(null);
  const qrInstance = useRef<QRCodeStyling | null>(null);

  // Confirm dialog state
  const [confirmState, setConfirmState] = useState<{
    open: boolean; type: 'delete' | 'toggle'; link: QRLink | null;
  }>({ open: false, type: 'delete', link: null });

  // ── Fetch QRs ──────────────────────────────────────────────────────────────
  const fetchLinks = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('qr_links')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Error al cargar QRs: ' + error.message);
    } else {
      setLinks(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchLinks(); }, [fetchLinks]);

  // ── Toggle active/paused ───────────────────────────────────────────────────
  const toggleActive = async (link: QRLink) => {
    setActionLoading(link.id);
    const { error } = await supabase
      .from('qr_links')
      .update({ is_active: !link.is_active })
      .eq('id', link.id);

    if (error) {
      toast.error('Error al actualizar: ' + error.message);
    } else {
      toast.success(link.is_active ? 'QR pausado' : 'QR reactivado');
      setLinks(prev => prev.map(l => l.id === link.id ? { ...l, is_active: !l.is_active } : l));
    }
    setActionLoading(null);
    setConfirmState({ open: false, type: 'toggle', link: null });
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const deleteLink = async (link: QRLink) => {
    setActionLoading(link.id);
    const { error } = await supabase
      .from('qr_links')
      .delete()
      .eq('id', link.id);

    if (error) {
      toast.error('Error al eliminar: ' + error.message);
    } else {
      toast.success('QR eliminado');
      setLinks(prev => prev.filter(l => l.id !== link.id));
    }
    setActionLoading(null);
    setConfirmState({ open: false, type: 'delete', link: null });
  };

  const saveEdit = async (link: QRLink) => {
    if (!editUrl.trim()) return;
    try { new URL(editUrl); } catch { toast.error('URL inválida. Incluye https://'); return; }

    setActionLoading(link.id);
    const { error } = await supabase
      .from('qr_links')
      .update({ destination: editUrl })
      .eq('id', link.id);

    if (error) {
      toast.error('Error al actualizar destino: ' + error.message);
    } else {
      toast.success('Destino actualizado correctamente');
      setLinks(prev => prev.map(l => l.id === link.id ? { ...l, destination: editUrl } : l));
      setEditingId(null);
    }
    setActionLoading(null);
  };

  const startEdit = (link: QRLink) => {
    setEditingId(link.id);
    setEditUrl(link.destination);
  };

  // ── REDESIGN LOGIC ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (previewLink) {
      const template = INDUSTRIES.flatMap(i => i.templates).find(t => t.id === previewLink.template_id) || INDUSTRIES[0].templates[0];
      setSelectedTemplate(template);
      setCustomColors(previewLink.custom_colors || {
        dotColor: template.dotColor,
        bgColor: template.bgColor,
        cornerColor: template.cornerColor,
        cornerDotColor: template.cornerDotColor,
      });
      setLogoPreview(previewLink.logo_url || null);
      setLogoFile(null);
    }
  }, [previewLink]);

  const renderPreviewQR = useCallback(() => {
    if (!previewLink || !qrRef.current || !selectedTemplate || !customColors) return;
    qrRef.current.innerHTML = '';
    
    const effectiveTemplate = { ...selectedTemplate, ...customColors };
    const BASE_REDIRECT_URL = "https://idenza.site/r/";
    const instance = buildQR(effectiveTemplate, BASE_REDIRECT_URL + previewLink.slug, logoPreview);
    instance.append(qrRef.current);
    qrInstance.current = instance;
  }, [previewLink, selectedTemplate, customColors, logoPreview]);

  useEffect(() => {
    if (previewLink) {
      const timer = setTimeout(renderPreviewQR, 50);
      return () => clearTimeout(timer);
    }
  }, [renderPreviewQR, previewLink]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = ev => setLogoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const saveNewDesign = async () => {
    if (!previewLink || !selectedTemplate) return;
    setIsSavingDesign(true);

    let uploadedLogoUrl = logoPreview;
    if (logoFile) {
      try {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('qr-assets')
          .upload(filePath, logoFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('qr-assets')
          .getPublicUrl(filePath);
        
        uploadedLogoUrl = publicUrl;
      } catch (err: any) {
        toast.error('Error al subir logo: ' + err.message);
        setIsSavingDesign(false);
        return;
      }
    }

    const { error } = await supabase
      .from('qr_links')
      .update({
        template_id: selectedTemplate.id,
        industry_id: INDUSTRIES.find(ind => ind.templates.some(t => t.id === selectedTemplate.id))?.id || previewLink.industry_id,
        custom_colors: customColors,
        logo_url: uploadedLogoUrl
      })
      .eq('id', previewLink.id);

    if (error) {
      toast.error('Error al guardar diseño: ' + error.message);
    } else {
      toast.success('Diseño actualizado');
      setLinks(prev => prev.map(l => l.id === previewLink.id ? { 
        ...l, 
        template_id: selectedTemplate.id,
        custom_colors: customColors,
        logo_url: uploadedLogoUrl
      } : l));
    }
    setIsSavingDesign(false);
  };

  const downloadQR = (ext: 'png' | 'svg') => {
    if (!qrInstance.current || !previewLink) return;
    qrInstance.current.download({ name: `idenza-qr-${previewLink.slug}`, extension: ext });
  };

  const copyUrl = (slug: string) => {
    navigator.clipboard.writeText(BASE_URL + slug);
    toast.success('URL copiada');
  };

  // ── Filtered list ──────────────────────────────────────────────────────────
  const filtered = links.filter(l => {
    const matchSearch =
      l.slug.includes(search.toLowerCase()) ||
      l.destination.toLowerCase().includes(search.toLowerCase()) ||
      l.industry_id.includes(search.toLowerCase());
    const matchFilter =
      filterActive === 'all' ||
      (filterActive === 'active' && l.is_active) ||
      (filterActive === 'paused' && !l.is_active);
    return matchSearch && matchFilter;
  });

  const totalClicks = links.reduce((s, l) => s + l.click_count, 0);
  const activeCount = links.filter(l => l.is_active).length;

  // ─── RENDER ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Preview / Redesign Modal */}
      {previewLink && selectedTemplate && customColors && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col md:flex-row">
            
            {/* Left: Design Controls */}
            <div className="flex-1 p-6 overflow-y-auto border-r border-border/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Rediseñar QR</h3>
                <span className="text-xs font-mono text-muted-foreground">/{previewLink.slug}</span>
              </div>

              {/* Templates Selector */}
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] text-muted-foreground mb-3 block font-mono uppercase tracking-widest">Cambiar Estilo</label>
                  <div className="grid grid-cols-3 gap-2">
                    {INDUSTRIES.find(i => i.id === previewLink.industry_id)?.templates.map(tpl => (
                      <button
                        key={tpl.id}
                        onClick={() => {
                          setSelectedTemplate(tpl);
                          setCustomColors({
                            dotColor: tpl.dotColor,
                            bgColor: tpl.bgColor,
                            cornerColor: tpl.cornerColor,
                            cornerDotColor: tpl.cornerDotColor,
                          });
                        }}
                        className={`p-2 rounded-xl border transition-all text-center ${
                          selectedTemplate.id === tpl.id
                            ? 'border-primary bg-primary/10'
                            : 'border-border bg-background/50'
                        }`}
                      >
                        <div className="flex justify-center gap-1 mb-1">
                          <span className="w-2 h-2 rounded-full" style={{ background: tpl.dotColor }} />
                          <span className="w-2 h-2 rounded-full" style={{ background: tpl.cornerColor }} />
                        </div>
                        <p className="text-[9px] font-medium truncate">{tpl.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Colors */}
                <div>
                  <label className="text-[10px] text-muted-foreground mb-3 block font-mono uppercase tracking-widest">Ajustes de Color</label>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(customColors).map(([key, val]: [string, any]) => (
                      <div key={key} className="space-y-1">
                        <label className="text-[8px] text-muted-foreground uppercase">{key.replace('Color', '')}</label>
                        <div className="flex items-center gap-2 bg-background rounded-lg border border-border/50 p-1.5">
                          <input 
                            type="color" 
                            value={val} 
                            onChange={e => setCustomColors((prev: any) => ({ ...prev, [key]: e.target.value }))}
                            className="w-5 h-5 rounded cursor-pointer bg-transparent border-0 p-0"
                          />
                          <span className="text-[9px] font-mono opacity-50 uppercase">{val}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Logo Customization */}
                <div>
                  <label className="text-[10px] text-muted-foreground mb-3 block font-mono uppercase tracking-widest">Logo (Opcional)</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => logoInputRef.current?.click()}
                      className="flex-1 py-2 rounded-xl border border-dashed border-border/60 hover:border-primary/40 text-[10px] text-muted-foreground hover:text-primary bg-background transition-all"
                    >
                      {logoFile ? logoFile.name : (logoPreview ? 'Cambiar logo' : 'Subir logo PNG')}
                    </button>
                    {logoPreview && (
                      <div className="relative">
                        <img src={logoPreview} alt="logo" className="w-8 h-8 rounded-lg object-contain border border-border/50 bg-white p-1" />
                        <button 
                          onClick={() => { setLogoFile(null); setLogoPreview(null); }} 
                          className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center"
                        >
                          <CloseIcon size={8} className="text-white" />
                        </button>
                      </div>
                    )}
                  </div>
                  <input ref={logoInputRef} type="file" accept="image/png,image/svg+xml,image/jpeg,image/webp" className="hidden" onChange={handleLogoUpload} />
                </div>

                <button
                  onClick={saveNewDesign}
                  disabled={isSavingDesign}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {isSavingDesign ? 'Guardando...' : 'Guardar Nuevo Diseño'}
                </button>
              </div>
            </div>

            {/* Right: QR Preview & Download */}
            <div className="w-full md:w-[320px] bg-muted/30 p-8 flex flex-col items-center justify-center gap-6 relative">
              <button 
                onClick={() => setPreviewLink(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-background/50 transition-all"
              >
                <CloseIcon size={20} />
              </button>

              <div className="bg-white p-4 rounded-3xl shadow-xl">
                <div ref={qrRef} />
              </div>

              <div className="w-full space-y-2">
                <button 
                  onClick={() => downloadQR('png')}
                  className="w-full py-2.5 rounded-xl bg-foreground text-background font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90"
                >
                  <Download size={14} /> Descargar PNG
                </button>
                <button 
                  onClick={() => downloadQR('svg')}
                  className="w-full py-2.5 rounded-xl border border-foreground/10 font-bold text-xs flex items-center justify-center gap-2 hover:bg-foreground/5"
                >
                  <Download size={14} /> Descargar SVG
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmState.open}
        danger={confirmState.type === 'delete'}
        title={
          confirmState.type === 'delete'
            ? 'Eliminar QR'
            : confirmState.link?.is_active ? 'Pausar QR' : 'Reactivar QR'
        }
        description={
          confirmState.type === 'delete'
            ? `Se eliminará el QR /${confirmState.link?.slug} permanentemente. Los scans dejarán de funcionar.`
            : confirmState.link?.is_active
              ? `El QR /${confirmState.link?.slug} dejará de redirigir hasta que lo reactives.`
              : `El QR /${confirmState.link?.slug} volverá a estar activo.`
        }
        onCancel={() => setConfirmState({ open: false, type: 'delete', link: null })}
        onConfirm={() => {
          if (!confirmState.link) return;
          if (confirmState.type === 'delete') deleteLink(confirmState.link);
          else toggleActive(confirmState.link);
        }}
      />

      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center">
              <QrCode size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Gestión de QRs</h1>
              <p className="text-xs text-muted-foreground font-mono">Pausa, reactiva o elimina tus links QR</p>
            </div>
          </div>
          <button
            onClick={fetchLinks}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-foreground/5 border border-border/50 transition-all disabled:opacity-50"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            Actualizar
          </button>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total QRs', value: links.length, color: 'text-foreground' },
            { label: 'Activos', value: activeCount, color: 'text-emerald-400' },
            { label: 'Scans totales', value: totalClicks, color: 'text-primary' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl border border-border/50 bg-card p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por slug, URL o sector..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-background border border-border/60 rounded-xl text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>
          <div className="flex gap-1.5">
            {(['all', 'active', 'paused'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilterActive(f)}
                className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${filterActive === f
                  ? 'bg-primary/15 text-primary border-primary/30'
                  : 'bg-background text-muted-foreground border-border/50 hover:bg-foreground/5'}`}
              >
                {f === 'all' ? 'Todos' : f === 'active' ? '✓ Activos' : '⏸ Pausados'}
              </button>
            ))}
          </div>
        </div>

        {/* ── List ── */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw size={20} className="animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-dashed border-border/50">
            <QrCode size={40} className="text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              {search || filterActive !== 'all' ? 'Sin resultados' : 'No hay QRs guardados aún'}
            </p>
            <p className="text-xs text-muted-foreground/50 mt-1">
              {!search && filterActive === 'all' && 'Crea tu primer QR en la pestaña "Crear QR"'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(link => (
              <div
                key={link.id}
                className={`rounded-2xl border p-4 transition-all ${link.is_active
                  ? 'border-border/50 bg-card'
                  : 'border-border/30 bg-card/50 opacity-70'}`}
              >
                <div className="flex items-center gap-3 flex-wrap">

                  {/* Industry badge */}
                  <div className="w-10 h-10 rounded-xl bg-foreground/5 border border-border/40 flex items-center justify-center text-xl shrink-0">
                    {INDUSTRY_BADGES[link.industry_id] ?? '🔗'}
                  </div>

                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-foreground font-mono">
                        /{link.slug}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold border ${link.is_active
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/25'}`}>
                        {link.is_active ? '● Activo' : '⏸ Pausado'}
                      </span>
                    </div>

                    {editingId === link.id ? (
                      <div className="flex items-center gap-2 mt-1.5 animate-in fade-in slide-in-from-left-2 duration-200">
                        <input
                          autoFocus
                          type="url"
                          value={editUrl}
                          onChange={e => setEditUrl(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && saveEdit(link)}
                          onKeyDownCapture={e => e.key === 'Escape' && setEditingId(null)}
                          className="flex-1 min-w-[200px] bg-background border border-primary/50 rounded-lg px-3 py-1.5 text-xs outline-none shadow-[0_0_10px_rgba(var(--primary-rgb),0.1)]"
                        />
                        <button
                          onClick={() => saveEdit(link)}
                          className="p-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1.5 rounded-lg bg-foreground/5 text-muted-foreground hover:text-foreground transition-all"
                        >
                          <CloseIcon size={14} />
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground truncate mt-0.5 max-w-[400px]">
                        → {link.destination}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground font-mono">
                      <span className="flex items-center gap-1">
                        <BarChart2 size={9} /> {link.click_count} scans
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={9} /> {fmtDate(link.created_at)}
                      </span>
                      <span className="capitalize">{link.industry_id} · {link.template_id}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* View / Redesign */}
                    <button
                      onClick={() => setPreviewLink(link)}
                      title="Ver y Rediseñar QR"
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-primary bg-primary/5 hover:bg-primary/20 border border-primary/20 transition-all"
                    >
                      <Eye size={13} />
                    </button>

                    {/* Edit Destination */}
                    <button
                      onClick={() => startEdit(link)}
                      disabled={editingId === link.id}
                      title="Editar destino"
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 border border-border/50 transition-all disabled:opacity-0"
                    >
                      <Edit2 size={13} />
                    </button>

                    {/* Copy URL */}
                    <button
                      onClick={() => copyUrl(link.slug)}
                      title="Copiar URL"
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/5 border border-border/50 transition-all"
                    >
                      <Copy size={13} />
                    </button>

                    {/* Open URL */}
                    <a
                      href={BASE_URL + link.slug}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Abrir link"
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/5 border border-border/50 transition-all"
                    >
                      <ExternalLink size={13} />
                    </a>

                    {/* Pause / Resume */}
                    <button
                      onClick={() => setConfirmState({ open: true, type: 'toggle', link })}
                      disabled={actionLoading === link.id}
                      title={link.is_active ? 'Pausar QR' : 'Reactivar QR'}
                      className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all disabled:opacity-50 ${link.is_active
                        ? 'text-amber-400 hover:bg-amber-500/10 border-amber-500/25'
                        : 'text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/25'}`}
                    >
                      {actionLoading === link.id
                        ? <RefreshCw size={13} className="animate-spin" />
                        : link.is_active ? <Pause size={13} /> : <Play size={13} />}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setConfirmState({ open: true, type: 'delete', link })}
                      disabled={actionLoading === link.id}
                      title="Eliminar QR"
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-all disabled:opacity-50"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
