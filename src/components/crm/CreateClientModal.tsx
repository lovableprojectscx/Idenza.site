import { useState } from 'react';
import { X, Eye, EyeOff, Loader2 } from 'lucide-react';
import { supabaseAdmin } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

const PLANS = [
  { value: 'gratuito', label: 'Gratuito — S/ 0/mes',          amount: 0   },
  { value: 'basico',   label: 'Básico — S/ 45/mes',           amount: 45  },
  { value: 'agencia',  label: 'Agencia — S/ 100/mes',          amount: 100 },
];

const inputCls = 'w-full h-11 bg-muted/30 border border-border hover:border-border/80 focus:border-primary/40 rounded-xl px-4 text-sm text-foreground placeholder:text-muted-foreground/30 outline-none transition-all';
const labelCls = 'text-[11px] font-mono text-muted-foreground uppercase tracking-widest block mb-1.5';

// Simple slug generator — no deps required
function toSlug(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50);
}

export function CreateClientModal({ onClose, onCreated }: Props) {
  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [projectName, setProjectName] = useState('');
  const [plan,        setPlan]        = useState('gratuito');
  const [showPass,    setShowPass]    = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');

  const selectedPlan = PLANS.find(p => p.value === plan) ?? PLANS[0];

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) {
      setError('El nombre del proyecto es obligatorio');
      return;
    }

    setLoading(true);
    setError('');

    // ── 1. Crear usuario en Auth ───────────────────────────────────────────
    const { data: authData, error: authErr } = await supabaseAdmin.auth.admin.createUser({
      email: email.toLowerCase().trim(),
      password,
      email_confirm: true,
    });

    if (authErr || !authData.user) {
      setError(authErr?.message ?? 'Error al crear el usuario');
      setLoading(false);
      return;
    }

    const userId = authData.user.id;
    const slug   = toSlug(projectName);
    const emailVal = email.toLowerCase().trim();
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    // ── 2. Crear organización ────────────────────────────────────────────────────────
    const { data: orgData, error: orgErr } = await supabaseAdmin
      .from('organizations')
      .insert({
        name:           projectName.trim(),
        slug:           slug || `org-${userId.slice(0, 8)}`,
        owner_email:    emailVal,
        plan_name:      selectedPlan.value,
        payment_status: 'activo',
        monthly_amount: selectedPlan.amount,
        client_email:   emailVal,
        token:          token,
      })
      .select('id')
      .single();

    if (orgErr || !orgData) {
      // Rollback: delete the auth user we just created
      await supabaseAdmin.auth.admin.deleteUser(userId);
      setError('Error al crear la organización: ' + (orgErr?.message ?? 'desconocido'));
      setLoading(false);
      return;
    }

    const orgId = orgData.id;

    // ── 3. Vincular usuario como owner de la organización ─────────────────
    const { error: memberErr } = await supabaseAdmin
      .from('organization_members')
      .insert({
        organization_id: orgId,
        user_id:         userId,
        role:            'owner',
      });

    if (memberErr) {
      // Non-blocking — log but don't fail
      console.warn('organization_members insert error:', memberErr.message);
    }

    // ── 4. Crear tracking token inicial ───────────────────────────────────
    const { error: tokenErr } = await supabaseAdmin
      .from('tracking_tokens')
      .insert({
        organization_id: orgId,
        label:           'Principal',
      });

    if (tokenErr) {
      console.warn('tracking_token insert error:', tokenErr.message);
    }

    toast.success(`Cliente "${projectName.trim()}" creado correctamente`);
    setLoading(false);
    onCreated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-md z-10"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-foreground font-semibold">Crear nuevo cliente</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Crea el usuario, la organización y el tracker en un solo paso</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors"><X size={18} /></button>
        </div>
        <form onSubmit={handle} className="space-y-4">
          <div>
            <label className={labelCls}>Nombre del proyecto / empresa</label>
            <input
              type="text"
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
              required
              placeholder="Empresa Ejemplo S.A."
              className={inputCls}
            />
            {projectName && (
              <p className="text-[10px] text-muted-foreground/50 mt-1 font-mono">slug: /{toSlug(projectName)}</p>
            )}
          </div>
          <div>
            <label className={labelCls}>Email del cliente</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="cliente@email.com" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Contraseña temporal</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="Mín. 8 caracteres" minLength={8} className={`${inputCls} pr-11`} />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <div>
            <label className={labelCls}>Plan inicial</label>
            <div className="grid grid-cols-3 gap-2">
              {PLANS.map(p => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPlan(p.value)}
                  className={`flex flex-col items-center py-3 px-2 rounded-xl border text-center transition-all ${
                    plan === p.value
                      ? 'border-primary/40 bg-primary/10 text-primary'
                      : 'border-border bg-muted/20 text-muted-foreground hover:border-border/80 hover:text-foreground'
                  }`}
                >
                  <span className="text-xs font-semibold">{p.value.charAt(0).toUpperCase() + p.value.slice(1)}</span>
                  <span className="text-[10px] mt-0.5 opacity-70">{p.amount === 0 ? 'S/ 0' : `S/ ${p.amount}/mes`}</span>
                </button>
              ))}
            </div>
          </div>
          {error && <p className="text-xs text-red-400 bg-red-500/10 rounded-xl px-3 py-2">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full h-11 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            {loading ? 'Creando...' : 'Crear cliente'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
