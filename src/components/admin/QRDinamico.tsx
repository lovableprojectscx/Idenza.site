import { useState, useRef, useEffect, useCallback } from 'react';
import QRCodeStyling, { DotType, CornerSquareType, CornerDotType } from 'qr-code-styling';
import {
  QrCode, Link2, Download, RefreshCw, Eye, Palette,
  CheckCircle2, Copy, ExternalLink, Zap, ImagePlus, X,
  Save, BarChart2,
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export interface QRTemplate {
  id: string;
  label: string;
  dotType: DotType;
  cornerSquareType: CornerSquareType;
  cornerDotType: CornerDotType;
  dotColor: string;
  bgColor: string;
  cornerColor: string;
  cornerDotColor: string;
  gradientFrom?: string;
  gradientTo?: string;
}

export interface Industry {
  id: string;
  label: string;
  badge: string;
  description: string;
  templates: QRTemplate[];
}

export interface QRLink {
  id: string;
  slug: string;
  destination: string;
  industry_id: string;
  template_id: string;
  is_active: boolean;
  click_count: number;
  created_at: string;
  updated_at: string;
  custom_colors?: any;
  logo_url?: string | null;
}

// ─── INDUSTRIES + TEMPLATES ───────────────────────────────────────────────────
export const INDUSTRIES: Industry[] = [
  {
    id: 'restaurante', label: 'Restaurante', badge: '🍔',
    description: 'Menú digital, delivery, reservas',
    templates: [
      { id: 'clasico',    label: 'Clásico',    dotType: 'rounded',        cornerSquareType: 'extra-rounded', cornerDotType: 'dot',    dotColor: '#b91c1c', bgColor: '#fff7f7', cornerColor: '#b91c1c', cornerDotColor: '#7f1d1d' },
      { id: 'oscuro',     label: 'Oscuro',     dotType: 'dots',           cornerSquareType: 'dot',           cornerDotType: 'dot',    dotColor: '#fff',    bgColor: '#1a0000', cornerColor: '#ef4444', cornerDotColor: '#ffffff' },
      { id: 'moderno',    label: 'Moderno',    dotType: 'classy-rounded', cornerSquareType: 'extra-rounded', cornerDotType: 'square', dotColor: '#ea580c', bgColor: '#ffffff', cornerColor: '#c2410c', cornerDotColor: '#ea580c', gradientFrom: '#dc2626', gradientTo: '#ea580c' },
    ],
  },
  {
    id: 'cafe', label: 'Café / Bakery', badge: '☕',
    description: 'Carta, pedidos, fidelización',
    templates: [
      { id: 'artesanal',  label: 'Artesanal',  dotType: 'classy-rounded', cornerSquareType: 'extra-rounded', cornerDotType: 'dot',    dotColor: '#6f4e37', bgColor: '#fdf6ec', cornerColor: '#4e342e', cornerDotColor: '#6f4e37' },
      { id: 'minimalista',label: 'Minimalista',dotType: 'square',         cornerSquareType: 'square',        cornerDotType: 'square', dotColor: '#292524', bgColor: '#fafaf9', cornerColor: '#292524', cornerDotColor: '#292524' },
      { id: 'vintage',    label: 'Vintage',    dotType: 'dots',           cornerSquareType: 'dot',           cornerDotType: 'dot',    dotColor: '#92400e', bgColor: '#fffbeb', cornerColor: '#78350f', cornerDotColor: '#d97706' },
    ],
  },
  {
    id: 'moda', label: 'Moda / Zapatería', badge: '👟',
    description: 'Catálogo, tallas, colecciones',
    templates: [
      { id: 'luxury',     label: 'Luxury',     dotType: 'square',         cornerSquareType: 'square',        cornerDotType: 'square', dotColor: '#0f0f0f', bgColor: '#ffffff', cornerColor: '#0f0f0f', cornerDotColor: '#0f0f0f' },
      { id: 'chic',       label: 'Chic',       dotType: 'rounded',        cornerSquareType: 'extra-rounded', cornerDotType: 'dot',    dotColor: '#db2777', bgColor: '#fff1f2', cornerColor: '#be185d', cornerDotColor: '#db2777' },
      { id: 'street',     label: 'Street',     dotType: 'classy',         cornerSquareType: 'dot',           cornerDotType: 'square', dotColor: '#1d4ed8', bgColor: '#eff6ff', cornerColor: '#1e40af', cornerDotColor: '#3b82f6' },
    ],
  },
  {
    id: 'salud', label: 'Salud / Clínica', badge: '🏥',
    description: 'Citas, recetas, información médica',
    templates: [
      { id: 'profesional',label: 'Profesional',dotType: 'rounded',        cornerSquareType: 'extra-rounded', cornerDotType: 'dot',    dotColor: '#1d4ed8', bgColor: '#f0f9ff', cornerColor: '#1e40af', cornerDotColor: '#3b82f6' },
      { id: 'natural',    label: 'Natural',    dotType: 'dots',           cornerSquareType: 'extra-rounded', cornerDotType: 'dot',    dotColor: '#16a34a', bgColor: '#f0fdf4', cornerColor: '#15803d', cornerDotColor: '#22c55e' },
      { id: 'moderno',    label: 'Moderno',    dotType: 'classy-rounded', cornerSquareType: 'square',        cornerDotType: 'square', dotColor: '#0891b2', bgColor: '#ecfeff', cornerColor: '#0e7490', cornerDotColor: '#22d3ee' },
    ],
  },
  {
    id: 'hotel', label: 'Hotel / Turismo', badge: '🏨',
    description: 'Check-in, servicios, experiencias',
    templates: [
      { id: 'premium',    label: 'Premium',    dotType: 'classy',         cornerSquareType: 'square',        cornerDotType: 'square', dotColor: '#0f0f0f', bgColor: '#fffff0', cornerColor: '#d4af37', cornerDotColor: '#b8860b' },
      { id: 'resort',     label: 'Resort',     dotType: 'rounded',        cornerSquareType: 'extra-rounded', cornerDotType: 'dot',    dotColor: '#0369a1', bgColor: '#f0f9ff', cornerColor: '#0284c7', cornerDotColor: '#38bdf8' },
      { id: 'boutique',   label: 'Boutique',   dotType: 'dots',           cornerSquareType: 'dot',           cornerDotType: 'dot',    dotColor: '#7c3aed', bgColor: '#faf5ff', cornerColor: '#6d28d9', cornerDotColor: '#8b5cf6' },
    ],
  },
  {
    id: 'regalo', label: 'Tienda de Regalos', badge: '🎁',
    description: 'Catálogo, gift cards, experiencias',
    templates: [
      { id: 'festivo',    label: 'Festivo',    dotType: 'dots',           cornerSquareType: 'dot',           cornerDotType: 'dot',    dotColor: '#c026d3', bgColor: '#fdf4ff', cornerColor: '#a21caf', cornerDotColor: '#e879f9' },
      { id: 'elegante',   label: 'Elegante',   dotType: 'classy-rounded', cornerSquareType: 'extra-rounded', cornerDotType: 'dot',    dotColor: '#be185d', bgColor: '#fff1f2', cornerColor: '#9d174d', cornerDotColor: '#f43f5e' },
      { id: 'minimalista',label: 'Minimalista',dotType: 'rounded',        cornerSquareType: 'extra-rounded', cornerDotType: 'dot',    dotColor: '#6366f1', bgColor: '#eef2ff', cornerColor: '#4f46e5', cornerDotColor: '#818cf8' },
    ],
  },
  {
    id: 'educacion', label: 'Educación', badge: '🎓',
    description: 'Cursos, matrículas, campus virtual',
    templates: [
      { id: 'academico',  label: 'Académico',  dotType: 'square',         cornerSquareType: 'square',        cornerDotType: 'square', dotColor: '#1e3a5f', bgColor: '#f8faff', cornerColor: '#1e3a5f', cornerDotColor: '#c9a227' },
      { id: 'digital',    label: 'Digital',    dotType: 'classy-rounded', cornerSquareType: 'extra-rounded', cornerDotType: 'dot',    dotColor: '#2563eb', bgColor: '#eff6ff', cornerColor: '#1d4ed8', cornerDotColor: '#60a5fa' },
      { id: 'juvenil',    label: 'Juvenil',    dotType: 'dots',           cornerSquareType: 'dot',           cornerDotType: 'dot',    dotColor: '#7c3aed', bgColor: '#f5f3ff', cornerColor: '#6d28d9', cornerDotColor: '#a78bfa' },
      { id: 'executive',  label: 'Executive',  dotType: 'classy',         cornerSquareType: 'square',        cornerDotType: 'square', dotColor: '#0f172a', bgColor: '#f8fafc', cornerColor: '#334155', cornerDotColor: '#0284c7' },
      { id: 'creative',   label: 'Creative',   dotType: 'rounded',        cornerSquareType: 'extra-rounded', cornerDotType: 'dot',    dotColor: '#db2777', bgColor: '#fff1f2', cornerColor: '#9d174d', cornerDotColor: '#f472b6' },
      { id: 'ecocampus',  label: 'EcoCampus',  dotType: 'dots',           cornerSquareType: 'extra-rounded', cornerDotType: 'dot',    dotColor: '#166534', bgColor: '#f0fdf4', cornerColor: '#15803d', cornerDotColor: '#4ade80' },
    ],
  },
  {
    id: 'tecnologia', label: 'Tecnología', badge: '💻',
    description: 'SaaS, apps, soporte técnico',
    templates: [
      { id: 'dark',       label: 'Dark Mode',  dotType: 'rounded',        cornerSquareType: 'extra-rounded', cornerDotType: 'dot',    dotColor: '#ffffff', bgColor: '#09090b', cornerColor: '#22d3ee', cornerDotColor: '#06b6d4' },
      { id: 'neon',       label: 'Neon',       dotType: 'dots',           cornerSquareType: 'dot',           cornerDotType: 'dot',    dotColor: '#10b981', bgColor: '#022c22', cornerColor: '#34d399', cornerDotColor: '#6ee7b7' },
      { id: 'corporate',  label: 'Corporate',  dotType: 'classy',         cornerSquareType: 'square',        cornerDotType: 'square', dotColor: '#0f172a', bgColor: '#f8fafc', cornerColor: '#334155', cornerDotColor: '#64748b' },
    ],
  },
  {
    id: 'belleza', label: 'Belleza / Spa', badge: '💆',
    description: 'Citas, servicios, productos',
    templates: [
      { id: 'rose',       label: 'Rose Gold',  dotType: 'dots',           cornerSquareType: 'extra-rounded', cornerDotType: 'dot',    dotColor: '#be185d', bgColor: '#fff0f6', cornerColor: '#9d174d', cornerDotColor: '#f9a8d4' },
      { id: 'zen',        label: 'Zen',        dotType: 'rounded',        cornerSquareType: 'extra-rounded', cornerDotType: 'dot',    dotColor: '#6b7280', bgColor: '#f9fafb', cornerColor: '#4b5563', cornerDotColor: '#9ca3af' },
      { id: 'glam',       label: 'Glam',       dotType: 'classy-rounded', cornerSquareType: 'dot',           cornerDotType: 'dot',    dotColor: '#7e22ce', bgColor: '#faf5ff', cornerColor: '#6b21a8', cornerDotColor: '#c084fc' },
    ],
  },
  {
    id: 'gym', label: 'Gym / Fitness', badge: '💪',
    description: 'Membresías, clases, nutrición',
    templates: [
      { id: 'power',      label: 'Power',      dotType: 'square',         cornerSquareType: 'square',        cornerDotType: 'square', dotColor: '#dc2626', bgColor: '#0a0a0a', cornerColor: '#ef4444', cornerDotColor: '#fca5a5' },
      { id: 'energy',     label: 'Energy',     dotType: 'classy-rounded', cornerSquareType: 'extra-rounded', cornerDotType: 'dot',    dotColor: '#f97316', bgColor: '#0c0a09', cornerColor: '#fb923c', cornerDotColor: '#fdba74' },
      { id: 'clean',      label: 'Clean',      dotType: 'rounded',        cornerSquareType: 'extra-rounded', cornerDotType: 'dot',    dotColor: '#0f172a', bgColor: '#f1f5f9', cornerColor: '#1e293b', cornerDotColor: '#475569' },
    ],
  },
  {
    id: 'inmobiliaria', label: 'Inmobiliaria', badge: '🏠',
    description: 'Propiedades, visitas, contacto',
    templates: [
      { id: 'premium',    label: 'Premium',    dotType: 'classy',         cornerSquareType: 'square',        cornerDotType: 'square', dotColor: '#1c1917', bgColor: '#fafaf9', cornerColor: '#292524', cornerDotColor: '#a8a29e' },
      { id: 'modern',     label: 'Modern',     dotType: 'rounded',        cornerSquareType: 'extra-rounded', cornerDotType: 'dot',    dotColor: '#065f46', bgColor: '#ecfdf5', cornerColor: '#047857', cornerDotColor: '#34d399' },
      { id: 'luxury',     label: 'Luxury',     dotType: 'dots',           cornerSquareType: 'dot',           cornerDotType: 'dot',    dotColor: '#92400e', bgColor: '#fffbeb', cornerColor: '#78350f', cornerDotColor: '#d97706' },
    ],
  },
  {
    id: 'automotriz', label: 'Auto / Mecánica', badge: '🚗',
    description: 'Servicios, presupuestos, talleres',
    templates: [
      { id: 'racing',     label: 'Racing',     dotType: 'square',         cornerSquareType: 'square',        cornerDotType: 'square', dotColor: '#dc2626', bgColor: '#0a0a0a', cornerColor: '#ef4444', cornerDotColor: '#fca5a5' },
      { id: 'profesional',label: 'Profesional',dotType: 'classy',         cornerSquareType: 'square',        cornerDotType: 'square', dotColor: '#1e3a5f', bgColor: '#f8faff', cornerColor: '#1e3a5f', cornerDotColor: '#6b7280' },
      { id: 'industrial', label: 'Industrial', dotType: 'dots',           cornerSquareType: 'dot',           cornerDotType: 'dot',    dotColor: '#374151', bgColor: '#f9fafb', cornerColor: '#1f2937', cornerDotColor: '#9ca3af' },
    ],
  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
export const generateSlug = (url: string): string => {
  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    const base = hostname.split('.')[0].toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12);
    const rand = Math.random().toString(36).substring(2, 6);
    return `${base}-${rand}`;
  } catch {
    return `qr-${Math.random().toString(36).substring(2, 8)}`;
  }
};

export const BASE_URL = 'https://idenza.site/r/';

export const buildQR = (template: QRTemplate, url: string, logo?: string | null): QRCodeStyling => {
  return new QRCodeStyling({
    width: 320,
    height: 320,
    type: 'svg',
    data: url,
    dotsOptions: {
      color: template.dotColor,
      type: template.dotType,
    },
    cornersSquareOptions: {
      color: template.cornerColor,
      type: template.cornerSquareType,
    },
    cornersDotOptions: {
      color: template.cornerDotColor,
      type: template.cornerDotType,
    },
    backgroundOptions: { color: template.bgColor },
    image: logo || undefined,
    imageOptions: {
      crossOrigin: 'anonymous',
      margin: 8,
      imageSize: 0.35
    },
    qrOptions: { errorCorrectionLevel: 'H' }
  });
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export function QRDinamico() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [clientUrl, setClientUrl] = useState('');
  const [slug, setSlug] = useState('');
  const [editingSlug, setEditingSlug] = useState(false);

  const [selectedIndustry, setSelectedIndustry] = useState<Industry>(INDUSTRIES[0]);
  const [selectedTemplate, setSelectedTemplate] = useState<QRTemplate>(INDUSTRIES[0].templates[0]);

  // Custom colors (init with template defaults)
  const [customColors, setCustomColors] = useState({
    dotColor: INDUSTRIES[0].templates[0].dotColor,
    bgColor: INDUSTRIES[0].templates[0].bgColor,
    cornerColor: INDUSTRIES[0].templates[0].cornerColor,
    cornerDotColor: INDUSTRIES[0].templates[0].cornerDotColor,
  });
  const [showCustom, setShowCustom] = useState(false);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [clickCount, setClickCount] = useState(0);

  const qrRef = useRef<HTMLDivElement>(null);
  const qrInstance = useRef<QRCodeStyling | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const idenzaUrl = `${BASE_URL}${slug}`;

  // ── When industry changes, reset to first template of that industry ─────────
  const handleSelectIndustry = (ind: Industry) => {
    setSelectedIndustry(ind);
    const firstTpl = ind.templates[0];
    setSelectedTemplate(firstTpl);
    setCustomColors({
      dotColor: firstTpl.dotColor,
      bgColor: firstTpl.bgColor,
      cornerColor: firstTpl.cornerColor,
      cornerDotColor: firstTpl.cornerDotColor,
    });
  };

  const handleSelectTemplate = (tpl: QRTemplate) => {
    setSelectedTemplate(tpl);
    setCustomColors({
      dotColor: tpl.dotColor,
      bgColor: tpl.bgColor,
      cornerColor: tpl.cornerColor,
      cornerDotColor: tpl.cornerDotColor,
    });
  };

  // ── Destroy old instance, create new one, append to DOM ───────────────────
  const renderQR = useCallback(() => {
    if (!qrRef.current || !slug) return;

    // Always clear and create fresh — qr-code-styling .update() has known bugs
    // with type changes (dotType, cornerSquareType) on SVG mode
    qrRef.current.innerHTML = '';
    qrInstance.current = null;

    const effectiveTemplate = { ...selectedTemplate, ...customColors };
    const instance = buildQR(effectiveTemplate, idenzaUrl, logoPreview);
    instance.append(qrRef.current);
    qrInstance.current = instance;
  }, [selectedTemplate, idenzaUrl, logoPreview, slug, customColors]);

  // Re-render whenever template, logo, or slug changes (only after QR is in step 3)
  useEffect(() => {
    if (step === 3) {
      const timer = setTimeout(renderQR, 50);
      return () => clearTimeout(timer);
    }
  }, [selectedTemplate, logoPreview, renderQR, step, customColors]);

  // ── Step 1 → 2 ───────────────────────────────────────────────────────────
  const handleGenerate = () => {
    if (!clientUrl.trim()) { toast.error('Ingresa la URL del cliente'); return; }
    try { new URL(clientUrl); } catch { toast.error('URL inválida. Incluye https://'); return; }
    setSlug(generateSlug(clientUrl));
    setStep(2);
  };

  // ── Step 2 → 3 ───────────────────────────────────────────────────────────
  const handleCreateQR = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 400));
    setStep(3);
    setIsGenerating(false);
    // renderQR is called by the useEffect above once step === 3
  };

  // ── Save to Supabase ──────────────────────────────────────────────────────
  const handleSave = async () => {
    setIsSaving(true);
    
    let uploadedLogoUrl = null;
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
        setIsSaving(false);
        return;
      }
    }

    const { data, error } = await supabase
      .from('qr_links')
      .insert({
        slug,
        destination: clientUrl,
        industry_id: selectedIndustry.id,
        template_id: selectedTemplate.id,
        custom_colors: customColors,
        logo_url: uploadedLogoUrl,
      })
      .select('id')
      .single();

    if (error) {
      if (error.code === '23505') {
        toast.error('Este slug ya está en uso. Edítalo e intenta de nuevo.');
      } else {
        toast.error('Error al guardar: ' + error.message);
      }
    } else {
      setSavedId(data.id);
      toast.success('QR guardado correctamente');
    }
    setIsSaving(false);
  };

  // ── Logo upload ────────────────────────────────────────────────────────────
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = ev => setLogoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  // ── Download ───────────────────────────────────────────────────────────────
  const handleDownload = async (fmt: 'png' | 'svg') => {
    if (!qrInstance.current) { toast.error('El QR no está listo'); return; }
    await qrInstance.current.download({ name: `qr-idenza-${slug}`, extension: fmt });
    toast.success(`Descargado como ${fmt.toUpperCase()}`);
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(idenzaUrl);
    toast.success('URL copiada');
  };

  const reset = () => {
    setStep(1); setClientUrl(''); setSlug('');
    setLogoFile(null); setLogoPreview(null); setSavedId(null); setClickCount(0);
    setSelectedIndustry(INDUSTRIES[0]); setSelectedTemplate(INDUSTRIES[0].templates[0]);
    if (qrRef.current) qrRef.current.innerHTML = '';
    qrInstance.current = null;
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center">
            <QrCode size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">QR Dinámico</h1>
            <p className="text-xs text-muted-foreground font-mono">Genera QRs con diseño de marca por industria</p>
          </div>
        </div>
        {step > 1 && (
          <button
            onClick={reset}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-foreground/5 border border-border/50 transition-all"
          >
            <RefreshCw size={12} /> Nuevo QR
          </button>
        )}
      </div>

      {/* ── Progress ── */}
      <div className="flex items-center gap-2">
        {(['URL Cliente', 'Industria & Diseño', 'QR Listo'] as const).map((label, i) => {
          const n = (i + 1) as 1 | 2 | 3;
          const done = step > n;
          const active = step === n;
          return (
            <div key={label} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                done   ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' :
                active ? 'bg-primary/15 text-primary border border-primary/25' :
                         'bg-foreground/5 text-muted-foreground border border-border/50'
              }`}>
                {done
                  ? <CheckCircle2 size={12} />
                  : <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold border border-current">{n}</span>
                }
                {label}
              </div>
              {i < 2 && <div className={`h-px w-6 transition-colors ${step > n ? 'bg-emerald-500/40' : 'bg-border/50'}`} />}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* ── Left panel ── */}
        <div className="lg:col-span-3 space-y-5">

          {/* STEP 1 — URL */}
          <div className={`rounded-2xl border p-5 transition-all ${step === 1 ? 'border-primary/30 bg-primary/5' : 'border-border/50 bg-card'}`}>
            <div className="flex items-center gap-2 mb-4">
              <Link2 size={15} className={step === 1 ? 'text-primary' : 'text-muted-foreground'} />
              <span className="text-sm font-semibold">1. URL del cliente</span>
            </div>
            <div className="space-y-3">
              <input
                type="url"
                value={clientUrl}
                onChange={e => setClientUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && step === 1 && handleGenerate()}
                placeholder="https://clienteejemplo.com"
                disabled={step > 1}
                className="w-full bg-background border border-border/60 rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all disabled:opacity-50"
              />
              {step === 1 && (
                <button
                  onClick={handleGenerate}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Zap size={15} /> Generar Link Idenza
                </button>
              )}
            </div>
          </div>

          {/* STEP 2 — Diseño (Persistent editor) */}
          {step >= 2 && (
            <div className={`rounded-2xl border p-5 transition-all ${step === 2 ? 'border-primary/30 bg-primary/5' : 'border-border/50 bg-card'}`}>
              <div className="flex items-center gap-2 mb-5">
                <Palette size={15} className={step >= 2 ? 'text-primary' : 'text-muted-foreground'} />
                <span className="text-sm font-semibold">2. Industria & Diseño</span>
              </div>

              {/* Slug editor */}
              <div className="mb-5">
                <label className="text-[10px] text-muted-foreground mb-2 block font-mono uppercase tracking-widest">Link Idenza generado</label>
                <div className="flex items-center gap-2 p-3 bg-background rounded-xl border border-border/60">
                  <span className="text-xs text-muted-foreground shrink-0 font-mono">{BASE_URL}</span>
                  {editingSlug ? (
                    <input
                      autoFocus
                      value={slug}
                      onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      onBlur={() => setEditingSlug(false)}
                      onKeyDown={e => e.key === 'Enter' && setEditingSlug(false)}
                      className="flex-1 bg-transparent text-xs font-mono text-primary outline-none border-b border-primary/50"
                    />
                  ) : (
                    <button onClick={() => setEditingSlug(true)} className="flex-1 text-left text-xs font-mono text-primary hover:underline">
                      {slug}
                    </button>
                  )}
                  <button onClick={copyUrl} className="p-1.5 rounded-lg hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-colors">
                    <Copy size={12} />
                  </button>
                  <a href={clientUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-colors">
                    <ExternalLink size={12} />
                  </a>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1.5 font-mono">→ Redirige a: <span className="text-foreground/60">{clientUrl}</span></p>
              </div>

              {/* Industry grid */}
              <label className="text-[10px] text-muted-foreground mb-3 block font-mono uppercase tracking-widest">Selecciona el sector</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-5">
                {INDUSTRIES.map(ind => (
                  <button
                    key={ind.id}
                    onClick={() => handleSelectIndustry(ind)}
                    className={`relative p-3 rounded-xl border text-left transition-all ${
                      selectedIndustry.id === ind.id
                        ? 'border-primary/50 bg-primary/10 ring-1 ring-primary/20'
                        : 'border-border/50 bg-background hover:border-primary/20 hover:bg-primary/5'
                    }`}
                  >
                    {selectedIndustry.id === ind.id && (
                      <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-primary flex items-center justify-center">
                        <CheckCircle2 size={9} className="text-primary-foreground" />
                      </span>
                    )}
                    <span className="text-xl mb-1 block">{ind.badge}</span>
                    <p className="text-[10px] font-semibold text-foreground leading-tight">{ind.label}</p>
                  </button>
                ))}
              </div>

              {/* Template selector — 3 designs per sector */}
              <label className="text-[10px] text-muted-foreground mb-3 block font-mono uppercase tracking-widest">
                Diseño para {selectedIndustry.label}
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 mb-5">
                {selectedIndustry.templates.map(tpl => (
                  <button
                    key={tpl.id}
                    onClick={() => handleSelectTemplate(tpl)}
                    className={`relative p-3 rounded-xl border transition-all text-left ${
                      selectedTemplate.id === tpl.id
                        ? 'border-primary/50 bg-primary/10 ring-1 ring-primary/20'
                        : 'border-border/50 bg-background hover:border-primary/20 hover:bg-primary/5'
                    }`}
                  >
                    {/* Mini QR preview swatch */}
                    <div
                      className="w-full aspect-square rounded-lg mb-2 flex items-center justify-center overflow-hidden"
                      style={{ background: tpl.bgColor, border: `2px solid ${tpl.cornerColor}22` }}
                    >
                      {/* Dot pattern visual hint */}
                      <div className="grid grid-cols-4 gap-[3px] p-1.5">
                        {Array.from({ length: 16 }).map((_, i) => {
                          const isBig = i === 0 || i === 3 || i === 12;
                          return (
                            <div
                              key={i}
                              style={{
                                width: isBig ? 8 : 4,
                                height: isBig ? 8 : 4,
                                borderRadius: tpl.dotType === 'dots' ? '50%' :
                                              tpl.dotType === 'rounded' || tpl.dotType === 'classy-rounded' ? '30%' :
                                              tpl.dotType === 'classy' ? '20% 0 20% 0' : '0',
                                background: isBig ? tpl.cornerColor : (Math.random() > 0.35 ? tpl.dotColor : 'transparent'),
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                    <p className="text-[10px] font-semibold text-foreground text-center leading-tight truncate">{tpl.label}</p>
                    {/* Color dots */}
                    <div className="flex justify-center gap-1 mt-1.5">
                      <span className="w-2.5 h-2.5 rounded-full ring-1 ring-border/30" style={{ background: tpl.dotColor }} />
                      <span className="w-2.5 h-2.5 rounded-full ring-1 ring-border/30" style={{ background: tpl.cornerColor }} />
                      <span className="w-2.5 h-2.5 rounded-full ring-1 ring-border/30" style={{ background: tpl.bgColor }} />
                    </div>
                    {selectedTemplate.id === tpl.id && (
                      <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-primary flex items-center justify-center">
                        <CheckCircle2 size={9} className="text-primary-foreground" />
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Advanced Customization Toggle */}
              <div className="mb-5">
                <button
                  onClick={() => setShowCustom(!showCustom)}
                  className="flex items-center gap-2 text-[10px] font-mono text-primary hover:underline uppercase tracking-widest"
                >
                  {showCustom ? '− Ocultar ajustes manuales' : '+ Personalizar colores a mano'}
                </button>

                {showCustom && (
                  <div className="mt-4 grid grid-cols-2 gap-4 p-4 rounded-xl bg-background border border-border/40 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div>
                      <label className="text-[9px] text-muted-foreground block mb-1 uppercase">Puntos QR</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={customColors.dotColor}
                          onChange={e => setCustomColors(prev => ({ ...prev, dotColor: e.target.value }))}
                          className="w-8 h-8 rounded-lg bg-transparent border-0 p-0 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={customColors.dotColor}
                          onChange={e => setCustomColors(prev => ({ ...prev, dotColor: e.target.value }))}
                          className="flex-1 bg-transparent border-b border-border/50 text-[10px] font-mono outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[9px] text-muted-foreground block mb-1 uppercase">Fondo</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={customColors.bgColor}
                          onChange={e => setCustomColors(prev => ({ ...prev, bgColor: e.target.value }))}
                          className="w-8 h-8 rounded-lg bg-transparent border-0 p-0 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={customColors.bgColor}
                          onChange={e => setCustomColors(prev => ({ ...prev, bgColor: e.target.value }))}
                          className="flex-1 bg-transparent border-b border-border/50 text-[10px] font-mono outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[9px] text-muted-foreground block mb-1 uppercase">Marcos (Esquinas)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={customColors.cornerColor}
                          onChange={e => setCustomColors(prev => ({ ...prev, cornerColor: e.target.value }))}
                          className="w-8 h-8 rounded-lg bg-transparent border-0 p-0 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={customColors.cornerColor}
                          onChange={e => setCustomColors(prev => ({ ...prev, cornerColor: e.target.value }))}
                          className="flex-1 bg-transparent border-b border-border/50 text-[10px] font-mono outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[9px] text-muted-foreground block mb-1 uppercase">Centro esquinas</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={customColors.cornerDotColor}
                          onChange={e => setCustomColors(prev => ({ ...prev, cornerDotColor: e.target.value }))}
                          className="w-8 h-8 rounded-lg bg-transparent border-0 p-0 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={customColors.cornerDotColor}
                          onChange={e => setCustomColors(prev => ({ ...prev, cornerDotColor: e.target.value }))}
                          className="flex-1 bg-transparent border-b border-border/50 text-[10px] font-mono outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Logo upload */}
              <div className="mb-5">
                <label className="text-[10px] text-muted-foreground mb-2 block font-mono uppercase tracking-widest">Logo del cliente (opcional)</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-border/60 hover:border-primary/40 text-xs text-muted-foreground hover:text-primary bg-background transition-all"
                  >
                    <ImagePlus size={14} /> {logoFile ? logoFile.name : 'Subir logo PNG'}
                  </button>
                  {logoPreview && (
                    <div className="relative">
                      <img src={logoPreview} alt="logo" className="w-10 h-10 rounded-lg object-contain border border-border/50 bg-white p-1" />
                      <button onClick={() => { setLogoFile(null); setLogoPreview(null); }} className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                        <X size={8} className="text-white" />
                      </button>
                    </div>
                  )}
                </div>
                <input ref={logoInputRef} type="file" accept="image/png,image/svg+xml,image/jpeg,image/webp" className="hidden" onChange={handleLogoUpload} />
              </div>

              {step === 2 && (
                <button
                  onClick={handleCreateQR}
                  disabled={isGenerating}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isGenerating
                    ? <><RefreshCw size={15} className="animate-spin" /> Generando...</>
                    : <><QrCode size={15} /> Crear QR con diseño {selectedTemplate.label}</>
                  }
                </button>
              )}
            </div>
          )}

          {/* End of left panel */}
        </div>

        {/* ── Right panel — QR Preview ── */}
        <div className="lg:col-span-2">
          <div className="sticky top-6 rounded-2xl border border-border/50 bg-card p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Eye size={15} className="text-muted-foreground" />
              <span className="text-sm font-semibold">Preview</span>
              {step === 3 && (
                <span className="ml-auto text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded-full font-mono">
                  ● Live
                </span>
              )}
            </div>

            {/* QR Canvas */}
            <div
              className="flex items-center justify-center min-h-[260px] rounded-xl border border-border/30 relative overflow-hidden"
              style={{ background: step === 3 ? selectedTemplate.bgColor : 'transparent' }}
            >
              {step < 3 ? (
                <div className="text-center p-8">
                  <QrCode size={48} className="text-muted-foreground/20 mx-auto mb-3" />
                  <p className="text-xs text-muted-foreground">El QR aparecerá aquí</p>
                  <p className="text-[10px] text-muted-foreground/50 mt-1">Completa los pasos para generarlo</p>
                </div>
              ) : (
                <div ref={qrRef} className="flex items-center justify-center p-4" />
              )}
            </div>

            {/* Industry + template info */}
            {step === 3 && (
              <div className="rounded-xl p-3 bg-foreground/5 border border-border/30">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">{selectedIndustry.badge}</span>
                  <div>
                    <p className="text-xs font-semibold">{selectedIndustry.label}</p>
                    <p className="text-[10px] text-muted-foreground">{selectedTemplate.label}</p>
                  </div>
                  <div className="ml-auto flex gap-1">
                    <span className="w-3.5 h-3.5 rounded-full ring-1 ring-border/30" style={{ background: selectedTemplate.dotColor }} />
                    <span className="w-3.5 h-3.5 rounded-full ring-1 ring-border/30" style={{ background: selectedTemplate.cornerColor }} />
                  </div>
                </div>
              </div>
            )}

            {/* Link summary */}
            {slug && (
              <div className="rounded-xl bg-background border border-border/50 p-3 space-y-2 text-[10px] font-mono">
                <div>
                  <p className="text-muted-foreground uppercase tracking-widest mb-0.5">Link Idenza</p>
                  <p className="text-primary truncate">{idenzaUrl}</p>
                </div>
                <div className="h-px bg-border/50" />
                <div>
                  <p className="text-muted-foreground uppercase tracking-widest mb-0.5">Destino</p>
                  <p className="text-foreground/60 truncate">{clientUrl}</p>
                </div>
                {savedId && (
                  <>
                    <div className="h-px bg-border/50" />
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 size={10} /> Guardado en Supabase
                    </div>
                  </>
                )}
                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => {
                      setStep(1);
                      setSlug('');
                      setClientUrl('');
                    }}
                    className="flex-1 py-3.5 rounded-xl border border-foreground/10 font-bold text-sm hover:bg-foreground/5 transition-all"
                  >
                    Crear otro QR
                  </button>
                  <button 
                    onClick={() => {
                      const tabElement = document.querySelector('[data-value="manager"]');
                      if (tabElement instanceof HTMLElement) tabElement.click();
                    }}
                    className="flex-1 py-3.5 rounded-xl bg-foreground text-background font-bold text-sm hover:opacity-90 transition-all"
                  >
                    Ver mis QRs
                  </button>
                </div>
                {clickCount > 0 && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <BarChart2 size={10} /> {clickCount} scans registrados
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            {step === 3 && (
              <div className="space-y-2">
                {/* Save button */}
                {!savedId && (
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full py-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isSaving ? <><RefreshCw size={13} className="animate-spin" /> Guardando...</> : <><Save size={13} /> Activar redirect (guardar)</>}
                  </button>
                )}
                {/* Download */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleDownload('png')}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all"
                  >
                    <Download size={13} /> PNG
                  </button>
                  <button
                    onClick={() => handleDownload('svg')}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border/60 text-foreground text-xs font-semibold hover:bg-foreground/5 transition-all"
                  >
                    <Download size={13} /> SVG
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
