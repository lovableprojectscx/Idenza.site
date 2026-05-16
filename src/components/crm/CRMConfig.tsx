import { useState } from 'react';
import { Copy, Check, ShieldAlert, Code2, Info } from 'lucide-react';
import { TRACKER_HOST, ADMIN_SECRET } from '@/lib/supabase';

function CopyBox({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div>
      <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest mb-1.5">{label}</p>
      <div className="flex items-center gap-2 bg-muted/50 border border-border rounded-xl px-4 py-2.5">
        <span className="flex-1 text-sm text-muted-foreground truncate font-mono">{value}</span>
        <button onClick={copy} className="shrink-0 text-muted-foreground hover:text-primary transition-colors">
          {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
        </button>
      </div>
    </div>
  );
}

export function CRMConfig() {
  return (
    <div className="p-6 lg:p-8 max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configuracion</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Sistema y referencias tecnicas del CRM</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Code2 size={14} className="text-primary" /> Tracker de Idenza
        </h2>
        <CopyBox label="Host" value={TRACKER_HOST} />
        <CopyBox label="Snippet base" value={`<script src="${TRACKER_HOST}/tracker.js" data-token="TOKEN" data-org="ORG_ID" defer></script>`} />
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-xs text-muted-foreground space-y-1.5 leading-relaxed">
          <p className="text-primary font-semibold mb-2 flex items-center gap-1.5"><Info size={12} /> Guia rapida</p>
          <p>1. Copia el snippet desde el expediente del cliente, tab Infraestructura.</p>
          <p>2. Pegalo en el head del sitio del cliente antes del cierre /head.</p>
          <p>3. El tracker detecta rutas SPA, formularios y geolocalizacion automaticamente.</p>
          <p>4. Datos disponibles en menos de 60 segundos.</p>
          <p>5. Usa data-idenza-ignore en campos sensibles para excluirlos.</p>
        </div>
      </div>

      <div className="bg-card border border-amber-500/20 rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <ShieldAlert size={14} className="text-amber-500" /> Seguridad
        </h2>
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 text-xs text-amber-600 dark:text-amber-400/80 space-y-1.5">
          <p className="font-semibold text-amber-600 dark:text-amber-400 mb-1">Acciones pendientes</p>
          <p>- Rotar ADMIN_SECRET cada 90 dias desde Supabase Dashboard.</p>
          <p>- Migrar GEMINI_KEY a Edge Function antes de escalar a +10k req/mes.</p>
          <p>- SERVICE_ROLE_KEY nunca en repositorios publicos.</p>
        </div>
        <CopyBox label="Admin Secret actual" value={ADMIN_SECRET} />
        <div>
          <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest mb-1.5">Variables de entorno requeridas</p>
          <div className="bg-muted/50 border border-border rounded-xl p-4 font-mono text-xs text-muted-foreground space-y-1">
            {['VITE_SUPABASE_URL','VITE_SUPABASE_ANON_KEY','VITE_SUPABASE_SERVICE_ROLE_KEY','VITE_ADMIN_SECRET','VITE_GEMINI_KEY'].map(v => (
              <p key={v}><span className="text-primary">{v}</span>=...</p>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-muted-foreground mb-3">WhatsApp API — Fase 3</h2>
        <p className="text-xs text-muted-foreground/60 leading-relaxed">
          La integracion con WhatsApp Business API se conectara al evento crm_reports para enviar informes automaticos.
          Numero base: +51 921 585 977. Pendiente Fase 3.
        </p>
      </div>
    </div>
  );
}
