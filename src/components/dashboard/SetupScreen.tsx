import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronUp, ChevronDown, RefreshCw, Copy, ArrowRight } from 'lucide-react';
import { Project } from './types';
import { parseBrief } from './types';
import { TRACKER_HOST } from '@/lib/supabase';

function SnippetBox({ orgId, token }: { orgId: string; token: string }) {
  const [copied, setCopied] = useState(false);
  const snippet = `<script\n  src="${TRACKER_HOST}/tracker.js"\n  data-token="${token}"\n  data-org="${orgId}"\n></script>`;
  const copy = () => { navigator.clipboard.writeText(snippet); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="relative">
      <pre className="bg-muted border border-border rounded-2xl p-5 text-[11px] font-mono text-primary overflow-x-auto whitespace-pre-wrap leading-relaxed">{snippet}</pre>
      <button onClick={copy} className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-background border border-border text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
        {copied ? <><Check size={12} className="text-emerald-500" /><span className="text-emerald-500">Copiado</span></> : <><Copy size={12} />Copiar</>}
      </button>
    </div>
  );
}

export function SetupScreen({ project, onRefresh, refreshing, onGoToEmpresa }: {
  project: Project;
  onRefresh: () => void;
  refreshing: boolean;
  onGoToEmpresa?: () => void;
}) {
  const trackerOk = project.events_count > 0;
  const brief = parseBrief(project.description);
  const briefOk = !!brief || !!(project.description && project.description.trim().length > 10);
  const [snippetOpen, setSnippetOpen] = useState(!trackerOk);

  const steps = [
    {
      n: 1, done: trackerOk,
      title: 'Instala el tracker en tu sitio',
      subtitle: trackerOk
        ? 'Tu sitio web está enviando datos correctamente.'
        : 'Pega el siguiente código en el <head> de tu sitio web.',
      border: trackerOk ? 'border-emerald-500/20' : 'border-border',
      glow:   trackerOk ? 'bg-emerald-500/5'      : 'bg-card',
    },
    {
      n: 2, done: briefOk,
      title: 'Completá el perfil de tu empresa',
      subtitle: briefOk
        ? 'Tu perfil está listo. El Asesor IA ya conoce tu negocio.'
        : 'Contanos sobre tu negocio para activar el Asesor IA personalizado.',
      border: briefOk ? 'border-emerald-500/20' : 'border-primary/15',
      glow:   briefOk ? 'bg-emerald-500/5'      : 'bg-primary/[0.03]',
      cta: !briefOk,
    },
  ];

  return (
    <div className="max-w-xl mx-auto py-6 sm:py-12 space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-[10px] font-mono text-primary/60 uppercase tracking-[0.3em] mb-3">Configuración</div>
        <h2 className="text-2xl font-bold font-sora text-foreground mb-2">Activá tu panel</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Completá estos dos pasos para empezar a ver métricas reales de tu negocio.
        </p>
      </motion.div>

      <div className="space-y-3">
        {steps.map((step, i) => (
          <motion.div
            key={step.n}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`border rounded-2xl overflow-hidden transition-all ${step.border} ${step.glow}`}
          >
            <div className="flex items-center gap-4 px-5 py-4">
              <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 transition-all ${
                step.done
                  ? 'bg-emerald-500/15 border-emerald-500/25'
                  : 'bg-muted border-border'
              }`}>
                {step.done
                  ? <Check size={14} className="text-emerald-500" />
                  : <span className="text-xs font-bold font-mono text-muted-foreground">{step.n}</span>
                }
              </div>

              <div className="flex-1 min-w-0">
                <div className={`text-sm font-semibold ${step.done ? 'text-foreground' : 'text-foreground/70'}`}>
                  {step.title}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{step.subtitle}</div>
              </div>

              {'cta' in step && step.cta && onGoToEmpresa ? (
                <button
                  onClick={onGoToEmpresa}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-xl text-[11px] font-semibold text-primary hover:bg-primary/20 transition-all"
                >
                  Completar
                  <ArrowRight size={11} />
                </button>
              ) : (
                <div className={`shrink-0 w-2 h-2 rounded-full ${step.done ? 'bg-emerald-400' : 'bg-muted-foreground/20'}`} />
              )}
            </div>

            {step.n === 1 && !step.done && (
              <div className="border-t border-border">
                <button
                  onClick={() => setSnippetOpen(o => !o)}
                  className="w-full flex items-center justify-between px-5 py-3 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="font-mono">Ver código de instalación</span>
                  {snippetOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </button>
                <AnimatePresence initial={false}>
                  {snippetOpen && (
                    <motion.div
                      key="snippet"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-3">
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          Copiá este código y pegalo dentro del <code className="text-primary bg-primary/10 px-1 rounded">&lt;head&gt;</code> de todas las páginas de tu sitio. No necesita reinicio.
                        </p>
                        <SnippetBox orgId={project.id} token={project.token} />
                        <div className="text-[10px] text-muted-foreground font-mono space-y-2 mt-1">
                          <p>El tracker captura automáticamente:</p>
                          <ul className="list-disc pl-4 space-y-1 text-muted-foreground/70">
                            <li>Vistas de página, dispositivos y ubicación.</li>
                            <li>Envíos de formularios de contacto.</li>
                            <li>Estructura de cada página para la auditoría IA.</li>
                          </ul>
                          <p className="text-muted-foreground/60 pt-1">El panel se activa automáticamente al detectar los primeros eventos.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex justify-center pt-2">
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-5 py-2.5 bg-muted border border-border rounded-xl text-xs text-muted-foreground hover:text-foreground hover:border-border/80 disabled:opacity-40 transition-all"
        >
          <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
          Verificar estado
        </button>
      </motion.div>

      {trackerOk && briefOk && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-6 bg-emerald-500/8 border border-emerald-500/20 rounded-2xl"
        >
          <div className="text-emerald-500 text-sm font-bold mb-1">¡Todo listo!</div>
          <div className="text-xs text-muted-foreground">Cargando tu dashboard...</div>
        </motion.div>
      )}
    </div>
  );
}
