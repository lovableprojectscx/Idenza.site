import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scan, Loader2, AlertTriangle, Lightbulb, CheckCircle2,
  ListChecks, ChevronDown, ChevronUp, TrendingUp, Zap, Clock, ArrowRight
} from 'lucide-react';
import { runWebAudit, type WebAuditResult, type OrgContext } from '@/lib/ai';

interface Props {
  ctx: OrgContext;
  onGoToEmpresa?: () => void;
}

// Mapeo robusto — maneja respuestas en español e inglés de Gemini
const EFFORT_COLOR: Record<string, string> = {
  bajo:   'text-[#CCFF00] bg-[#CCFF00]/8 border-[#CCFF00]/15',
  low:    'text-[#CCFF00] bg-[#CCFF00]/8 border-[#CCFF00]/15',
  medio:  'text-amber-400 bg-amber-500/8 border-amber-500/15',
  medium: 'text-amber-400 bg-amber-500/8 border-amber-500/15',
  alto:   'text-red-400 bg-red-500/8 border-red-500/15',
  high:   'text-red-400 bg-red-500/8 border-red-500/15',
};

const EFFORT_LABEL: Record<string, string> = {
  bajo: 'bajo', low: 'bajo', medio: 'medio', medium: 'medio', alto: 'alto', high: 'alto',
};

const IMPACT_COLOR: Record<string, string> = {
  alto: 'text-[#CCFF00]', high: 'text-[#CCFF00]',
  medio: 'text-amber-400', medium: 'text-amber-400',
  bajo: 'text-blue-400', low: 'text-blue-400',
};

const IMPACT_LABEL: Record<string, string> = {
  alto: 'alto', high: 'alto', medio: 'medio', medium: 'medio', bajo: 'bajo', low: 'bajo',
};

function effortColor(val: string) { return EFFORT_COLOR[val?.toLowerCase()] ?? 'text-white/30 bg-white/[0.03] border-white/6'; }
function effortLabel(val: string) { return EFFORT_LABEL[val?.toLowerCase()] ?? val; }
function impactColor(val: string) { return IMPACT_COLOR[val?.toLowerCase()] ?? 'text-white/40'; }
function impactLabel(val: string) { return IMPACT_LABEL[val?.toLowerCase()] ?? val; }

const SCORE_LABEL: [number, string, string][] = [
  [8, 'Excelente',    '#CCFF00'],
  [6, 'Bueno',        '#CCFF00'],
  [4, 'Necesita trabajo', '#f59e0b'],
  [0, 'Crítico',      '#ef4444'],
];

function getScoreMeta(score: number) {
  for (const [min, label, color] of SCORE_LABEL) {
    if (score >= min) return { label, color };
  }
  return { label: 'Crítico', color: '#ef4444' };
}

function ScoreRing({ score }: { score: number }) {
  const pct = (score / 10) * 100;
  const { color, label } = getScoreMeta(score);
  const r = 32;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-1.5 shrink-0">
      <div className="relative w-20 h-20 flex items-center justify-center">
        <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
          <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
          <motion.circle
            cx="40" cy="40" r={r} fill="none"
            stroke={color} strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={`${circ}`}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - dash }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold font-sora leading-none" style={{ color }}>{score}</span>
          <span className="text-[9px] font-mono text-white/25">/10</span>
        </div>
      </div>
      <span className="text-[10px] font-mono font-semibold" style={{ color }}>{label}</span>
    </div>
  );
}

function Section({ title, icon: Icon, color, children }: {
  title: string;
  icon: React.ElementType;
  color: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-[#080d1a] border border-white/5 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-white/[0.02] transition-colors"
      >
        <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-white/[0.04] shrink-0">
          <Icon size={13} className={color} />
        </div>
        <span className="font-semibold text-white/80 text-sm flex-1 text-left">{title}</span>
        {open
          ? <ChevronUp size={14} className="text-white/20 shrink-0" />
          : <ChevronDown size={14} className="text-white/20 shrink-0" />
        }
      </button>
      {/* AnimatePresence con initial={false} evita el flash en el primer render */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-white/5"
          >
            <div className="px-5 py-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function WebAuditPanel({ ctx, onGoToEmpresa }: Props) {
  const [result, setResult] = useState<WebAuditResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canAudit = ctx.snapshots.length > 0;
  const hasBrief = !!ctx.brief;

  const handleAudit = async () => {
    setLoading(true);
    setError('');
    try {
      const audit = await runWebAudit(ctx);
      setResult(audit);
    } catch {
      setError('No se pudo generar la auditoría. Verificá tu conexión e intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Sin snapshots — el tracker todavía no procesó ninguna página
  if (!canAudit) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/6 flex items-center justify-center">
          <Scan size={22} className="text-white/15" />
        </div>
        <div className="space-y-1.5">
          <p className="text-white/40 font-semibold text-sm">Sin datos de la web aún</p>
          <p className="text-white/15 text-xs max-w-[260px] leading-relaxed">
            El tracker necesita visitar al menos una página de tu sitio para capturar su estructura. Una vez que haya visitantes, la auditoría estará disponible.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <div className="text-[10px] font-mono text-primary/60 uppercase tracking-[0.3em] mb-2">Análisis IA</div>
        <h2 className="text-xl font-bold font-sora text-white/90 mb-1">Auditoría de tu web</h2>
        <p className="text-sm text-white/30 leading-relaxed">
          La IA analiza la estructura real de tus páginas, tus datos de tráfico y tu perfil de negocio para darte un diagnóstico concreto.
        </p>
      </div>

      {/* Chips de contexto */}
      <div className="flex flex-wrap gap-2">
        {/* Chip de brief — si falta, muestra botón para ir a Mi Empresa */}
        {hasBrief ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-mono text-[#CCFF00] bg-[#CCFF00]/8 border-[#CCFF00]/15">
            <div className="w-1.5 h-1.5 rounded-full bg-[#CCFF00]" />
            Perfil de negocio completo
          </div>
        ) : (
          <button
            onClick={onGoToEmpresa}
            disabled={!onGoToEmpresa}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-mono text-amber-400/80 bg-amber-500/8 border-amber-500/15 hover:bg-amber-500/15 transition-colors disabled:cursor-default"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Completar perfil del negocio
            {onGoToEmpresa && <ArrowRight size={10} />}
          </button>
        )}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-mono text-blue-400 bg-blue-500/8 border-blue-500/15">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          {ctx.snapshots.length} {ctx.snapshots.length === 1 ? 'página analizada' : 'páginas analizadas'}
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-mono text-white/25 bg-white/[0.02] border-white/5">
          {ctx.totalVisits} visitas · {ctx.totalLeads} leads
        </div>
      </div>

      {/* CTA principal */}
      {!result && (
        <motion.div
          className="bg-[#080d1a] border border-white/5 rounded-2xl p-5 sm:p-8 flex flex-col items-center text-center space-y-5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center">
            <Scan size={24} className="text-primary/70" />
          </div>
          <div>
            <p className="font-bold text-white/80 text-base mb-2">
              Auditar {ctx.snapshots.length} {ctx.snapshots.length === 1 ? 'página detectada' : 'páginas detectadas'}
            </p>
            <p className="text-sm text-white/25 max-w-sm leading-relaxed">
              La IA revisará cada página, detectará problemas críticos de conversión y te dará un plan de acción priorizado.
              {!hasBrief && (
                <span className="block mt-2 text-amber-400/60">
                  💡 El análisis mejora si completás tu perfil de negocio primero.
                </span>
              )}
            </p>
          </div>
          {error && (
            <p className="text-red-400/70 text-xs bg-red-500/6 border border-red-500/10 rounded-xl px-4 py-2.5 max-w-sm">{error}</p>
          )}
          <motion.button
            onClick={handleAudit}
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2.5 px-8 py-3 bg-primary/20 border border-primary/25 rounded-xl text-sm font-semibold text-primary/90 hover:bg-primary/30 disabled:opacity-50 transition-all"
          >
            {loading
              ? <><Loader2 size={15} className="animate-spin" />Analizando tu web...</>
              : <><Scan size={15} />Iniciar auditoría</>
            }
          </motion.button>
          {loading && (
            <p className="text-xs text-white/15 font-mono animate-pulse">
              Esto puede tardar 15-20 segundos...
            </p>
          )}
        </motion.div>
      )}

      {/* Resultados */}
      {result && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">

          {/* Score — layout responsive */}
          <div className="bg-[#080d1a] border border-white/5 rounded-2xl p-5 flex flex-col sm:flex-row gap-5 sm:gap-6 items-center sm:items-start">
            <ScoreRing score={result.score} />
            <div className="flex-1 text-center sm:text-left">
              <div className="text-[10px] font-mono text-white/25 uppercase tracking-wider mb-2">Diagnóstico general</div>
              <p className="text-sm text-white/60 leading-relaxed">{result.summary}</p>
            </div>
          </div>

          {/* Fortalezas — primero lo positivo */}
          {result.strengths.length > 0 && (
            <Section title={`Lo que está bien (${result.strengths.length})`} icon={CheckCircle2} color="text-[#CCFF00]">
              <div className="space-y-2">
                {result.strengths.map((s, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 size={13} className="text-[#CCFF00] mt-0.5 shrink-0" />
                    <p className="text-sm text-white/50">{s}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Problemas críticos */}
          {result.critical.length > 0 && (
            <Section title={`Problemas críticos (${result.critical.length})`} icon={AlertTriangle} color="text-red-400">
              <div className="space-y-3">
                {result.critical.map((c, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl"
                  >
                    <div className="flex items-start gap-2 mb-1.5">
                      <AlertTriangle size={12} className="text-red-400 mt-0.5 shrink-0" />
                      <span className="text-sm font-semibold text-white/80">{c.title}</span>
                    </div>
                    <p className="text-xs text-white/40 leading-relaxed pl-5">{c.description}</p>
                    {c.page && (
                      <div className="mt-2 pl-5">
                        <span className="text-[10px] font-mono text-red-400/60 bg-red-500/8 px-2 py-0.5 rounded-lg">
                          {c.page}
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </Section>
          )}

          {/* Oportunidades */}
          {result.opportunities.length > 0 && (
            <Section title={`Oportunidades (${result.opportunities.length})`} icon={Lightbulb} color="text-amber-400">
              <div className="space-y-3">
                {result.opportunities.map((o, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl"
                  >
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <div className="flex items-start gap-2">
                        <Lightbulb size={12} className="text-amber-400 mt-0.5 shrink-0" />
                        <span className="text-sm font-semibold text-white/80">{o.title}</span>
                      </div>
                      <span className={`shrink-0 text-[10px] font-mono ${impactColor(o.impact)}`}>
                        impacto {impactLabel(o.impact)}
                      </span>
                    </div>
                    <p className="text-xs text-white/40 leading-relaxed pl-5">{o.description}</p>
                  </motion.div>
                ))}
              </div>
            </Section>
          )}

          {/* Plan de acción */}
          {result.recommendations.length > 0 && (
            <Section title="Plan de acción priorizado" icon={ListChecks} color="text-[#CCFF00]">
              <div className="space-y-3">
                {[...result.recommendations]
                  .sort((a, b) => a.priority - b.priority)
                  .map((r, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-4 bg-white/[0.02] border border-white/4 rounded-xl"
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-7 h-7 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0 font-bold text-primary text-xs font-mono">
                          {r.priority}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white/80 mb-1">{r.action}</p>
                          <p className="text-xs text-white/30 leading-relaxed">{r.why}</p>
                        </div>
                      </div>
                      <div className={`self-start sm:self-start px-2.5 py-1 rounded-lg border text-[10px] font-mono flex items-center gap-1 ${effortColor(r.effort)}`}>
                        {effortLabel(r.effort) === 'bajo'
                          ? <Zap size={9} />
                          : effortLabel(r.effort) === 'medio'
                            ? <TrendingUp size={9} />
                            : <Clock size={9} />
                        }
                        {effortLabel(r.effort)}
                      </div>
                    </motion.div>
                  ))}
              </div>
            </Section>
          )}

          {/* Nueva auditoría */}
          <div className="flex justify-center pt-2">
            <button
              onClick={() => setResult(null)}
              className="text-xs text-white/20 hover:text-white/50 transition-colors font-mono"
            >
              Nueva auditoría
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
