import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, MapPin, BrainCircuit, Sparkles, Loader2 } from 'lucide-react';
import { Lead, Project } from './types';
import { statusConfig, timeAgo } from './utils';
import { analyzeLeadCase, LeadAnalysis, OrgContext } from '@/lib/ai';

export function LeadCard({ lead, onStatusChange, ctx }: { lead: Lead; onStatusChange: (id: string, s: Lead['status']) => void; ctx: OrgContext }) {
  const [open, setOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<LeadAnalysis | null>(null);

  const cfg = statusConfig[lead.status];
  const statuses: Lead['status'][] = ['new', 'contacted', 'closed'];

  const runInvestigation = async () => {
    setAnalyzing(true);
    try {
      const res = await analyzeLeadCase(lead, ctx);
      setAnalysis(res);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border hover:border-border/80 rounded-2xl overflow-hidden transition-colors">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-4 px-5 py-4 text-left">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/10 flex items-center justify-center shrink-0 font-bold text-primary text-xs font-sora">
          {(lead.name || lead.email || '?')[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-foreground text-sm truncate">{lead.name || '—'}</div>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
            {lead.email && <span className="truncate">{lead.email}</span>}
            {lead.city && <span className="flex items-center gap-1 shrink-0"><MapPin size={9} />{lead.city}</span>}
            {lead.time_on_page && (
              <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider ${
                lead.time_on_page > 60 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
              }`}>
                {lead.time_on_page > 60 ? 'Interés Alto' : 'Interés Medio'}
              </span>
            )}
          </div>
        </div>
        <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-medium ${cfg.bg} ${cfg.border} ${cfg.color} shrink-0`}>
          <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-mono text-muted-foreground/50">{timeAgo(lead.created_at)}</span>
          <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.15 }} className="text-muted-foreground/30">
            <ChevronRight size={14} />
          </motion.div>
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden border-t border-border">
            <div className="px-5 py-4 space-y-5">
              {(lead.email || lead.phone || lead.message) && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {lead.email   && <div className="bg-muted/50 border border-border rounded-xl p-3"><div className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-1">Email</div><div className="text-xs text-foreground/70 truncate">{lead.email}</div></div>}
                  {lead.phone   && <div className="bg-muted/50 border border-border rounded-xl p-3"><div className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-1">Teléfono</div><div className="text-xs text-foreground/70">{lead.phone}</div></div>}
                  {lead.message && <div className="bg-muted/50 border border-border rounded-xl p-3 sm:col-span-3"><div className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-1">Mensaje</div><div className="text-xs text-foreground/70 leading-relaxed">{lead.message}</div></div>}
                </div>
              )}

              {/* ─── IA INVESTIGATOR ─── */}
              <div className="bg-primary/5 border border-primary/15 rounded-2xl p-4 relative overflow-hidden group/ia">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/ia:opacity-10 transition-opacity">
                  <BrainCircuit size={80} />
                </div>

                <div className="relative flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Sparkles size={14} />
                    <span className="text-xs font-bold uppercase tracking-widest font-mono">Investigador IA</span>
                  </div>
                  {!analysis && !analyzing && (
                    <button
                      onClick={runInvestigation}
                      className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-[10px] font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
                    >
                      Estudiar caso
                    </button>
                  )}
                </div>

                {analyzing ? (
                  <div className="flex flex-col items-center justify-center py-6 gap-3">
                    <Loader2 size={24} className="animate-spin text-primary/40" />
                    <p className="text-[10px] font-mono text-primary/60 animate-pulse">Analizando comportamiento y contexto...</p>
                  </div>
                ) : analysis ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="text-[9px] font-mono text-primary/50 uppercase tracking-wider mb-1">Intención detectada</div>
                        <p className="text-sm font-medium text-foreground/80 leading-snug">{analysis.intent}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-[9px] font-mono text-primary/50 uppercase tracking-wider mb-1">Probabilidad de cierre</div>
                        <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          analysis.probability === 'alta' ? 'bg-emerald-500/20 text-emerald-500' :
                          analysis.probability === 'media' ? 'bg-amber-500/20 text-amber-500' : 'bg-red-500/20 text-red-500'
                        }`}>
                          {analysis.probability}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-background/40 rounded-xl p-3 border border-primary/10">
                      <div className="text-[9px] font-mono text-primary/50 uppercase tracking-wider mb-2">Hallazgos clave</div>
                      <ul className="space-y-1.5">
                        {analysis.insights.map((ins, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-foreground/70">
                            <div className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                            {ins}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-primary/10 rounded-xl p-3 border border-primary/20">
                      <div className="text-[9px] font-mono text-primary uppercase tracking-wider mb-1">Recomendación comercial</div>
                      <p className="text-xs italic text-foreground/90 leading-relaxed font-serif">"{analysis.recommendation}"</p>
                    </div>
                  </motion.div>
                ) : (
                  <p className="text-[11px] text-muted-foreground/60 leading-relaxed">
                    Usa el Investigador IA para analizar el comportamiento de este lead y obtener una estrategia de venta personalizada basada en su navegación.
                  </p>
                )}
              </div>

              <div>
                <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider mb-2">Cambiar estado</div>
                <div className="flex gap-2 flex-wrap">
                  {statuses.map(s => {
                    const c = statusConfig[s]; const Icon = c.icon;
                    return (
                      <button key={s} onClick={() => onStatusChange(lead.id, s)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[11px] font-medium transition-all ${lead.status === s ? `${c.bg} ${c.border} ${c.color}` : 'bg-muted/30 border-border text-muted-foreground hover:text-foreground hover:border-border/80'}`}>
                        <Icon size={11} />{c.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
