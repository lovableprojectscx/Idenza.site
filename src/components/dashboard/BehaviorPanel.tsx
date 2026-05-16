import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import {
  MousePointerClick, AlertOctagon, ArrowUpFromLine, ExternalLink,
  Chrome, Clock, FormInput, Lock,
} from 'lucide-react';
import type { Analytics, PlanConfig } from './types';
import { ChartTooltip } from './ChartTooltip';
import { PRIMARY } from './utils';

interface Props {
  analytics: Analytics | null;
  plan: PlanConfig;
}

function Locked({ feature }: { feature: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-3 border border-dashed border-border rounded-2xl">
      <Lock size={20} className="text-muted-foreground/30" />
      <p className="text-xs text-muted-foreground/40 text-center max-w-[200px]">
        <span className="font-bold text-muted-foreground/60">{feature}</span> disponible desde el plan Professional
      </p>
    </div>
  );
}

function StatChip({ label, value, color = 'text-foreground' }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <div className={`text-2xl font-bold font-sora ${color}`}>{value}</div>
      <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
}

export function BehaviorPanel({ analytics, plan }: Props) {
  const f = plan.features;

  if (!analytics) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground/40 text-sm font-mono">
        Sin datos de comportamiento aún.
      </div>
    );
  }

  const browserColors = ['#7B2CBF', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  const eventTypeLabels: Record<string, string> = {
    pageview: 'Visitas',
    pageview_anonymous: 'Anónimas',
    click_cta: 'Clicks CTA',
    scroll_50: 'Scroll 50%',
    scroll_90: 'Scroll 90%',
    form_started: 'Form iniciado',
    rage_click: 'Rage Click',
    session_leave: 'Salidas',
    consent_granted: 'Consentimiento',
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

      {/* ── KPIs de comportamiento ── */}
      {f.behavior ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatChip
            label="Scroll 50%"
            value={`${analytics.scroll_50_rate.toFixed(0)}%`}
            color="text-[#CCFF00]"
          />
          <StatChip
            label="Scroll 90%"
            value={`${analytics.scroll_90_rate.toFixed(0)}%`}
            color="text-primary"
          />
          <StatChip
            label="Rage Clicks"
            value={analytics.rage_click_count}
            color={analytics.rage_click_count > 5 ? 'text-red-400' : 'text-muted-foreground'}
          />
          <StatChip
            label="Tiempo promedio"
            value={analytics.avg_time_on_page > 0
              ? analytics.avg_time_on_page < 60
                ? `${analytics.avg_time_on_page}s`
                : `${Math.floor(analytics.avg_time_on_page / 60)}m ${analytics.avg_time_on_page % 60}s`
              : '—'}
            color="text-blue-400"
          />
        </div>
      ) : (
        <Locked feature="Comportamiento profundo" />
      )}

      {/* ── Eventos por tipo ── */}
      {f.funnelEvents ? (
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-1">
            <MousePointerClick size={13} className="text-muted-foreground" />
            <div className="font-bold text-foreground/80 text-sm">Eventos del tracker</div>
          </div>
          <div className="text-xs text-muted-foreground mb-5">Qué hacen los visitantes en tu web</div>
          {analytics.by_event_type.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground/40 text-xs font-mono">Sin datos aún</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={analytics.by_event_type.map(e => ({
                  name: eventTypeLabels[e.event_type] ?? e.event_type,
                  count: e.count,
                }))}
                margin={{ top: 0, right: 0, left: -20, bottom: 30 }}
              >
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'rgba(100,116,139,0.7)' }} tickLine={false} axisLine={false} angle={-30} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 10, fill: 'rgba(100,116,139,0.7)' }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} content={<ChartTooltip />} />
                <Bar dataKey="count" name="Eventos" fill={PRIMARY} fillOpacity={0.8} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <MousePointerClick size={13} className="text-muted-foreground" />
            <div className="font-bold text-foreground/80 text-sm">Eventos del tracker</div>
          </div>
          <Locked feature="Eventos detallados (scroll, clicks, formularios)" />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* ── Fuentes de tráfico (referrers) ── */}
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-1">
            <ExternalLink size={13} className="text-muted-foreground" />
            <div className="font-bold text-foreground/80 text-sm">Origen del tráfico</div>
          </div>
          <div className="text-xs text-muted-foreground mb-4">¿De dónde vienen tus visitantes?</div>
          {!f.referrers ? (
            <Locked feature="Fuentes de tráfico" />
          ) : analytics.by_referrer.length === 0 ? (
            <div className="flex items-center justify-center h-24 text-muted-foreground/40 text-xs font-mono">Sin referrers detectados</div>
          ) : (
            <div className="space-y-2.5">
              {analytics.by_referrer.slice(0, 6).map((r, i) => {
                const max = analytics.by_referrer[0].count;
                const pct = Math.round((r.count / max) * 100);
                const label = r.referrer === 'directo' ? '📍 Directo' : r.referrer;
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-foreground/70 truncate max-w-[160px]" title={r.referrer}>{label}</span>
                      <span className="text-xs font-bold text-foreground/80 shrink-0 ml-2">{r.count}</span>
                    </div>
                    <div className="h-1.5 bg-border rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                        transition={{ delay: i * 0.05, duration: 0.5 }}
                        className="h-full rounded-full" style={{ background: PRIMARY }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Navegadores ── */}
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-1">
            <Chrome size={13} className="text-muted-foreground" />
            <div className="font-bold text-foreground/80 text-sm">Navegadores</div>
          </div>
          <div className="text-xs text-muted-foreground mb-4">¿Qué browser usan tus visitantes?</div>
          {!f.browsers ? (
            <Locked feature="Análisis de navegadores" />
          ) : analytics.by_browser.length === 0 ? (
            <div className="flex items-center justify-center h-24 text-muted-foreground/40 text-xs font-mono">Sin datos</div>
          ) : (
            <div className="flex gap-4">
              <PieChart width={120} height={120}>
                <Pie data={analytics.by_browser} cx={55} cy={55} innerRadius={35} outerRadius={52} paddingAngle={3} dataKey="count" strokeWidth={0}>
                  {analytics.by_browser.map((_, i) => (
                    <Cell key={i} fill={browserColors[i % browserColors.length]} fillOpacity={0.85} />
                  ))}
                </Pie>
              </PieChart>
              <div className="flex flex-col justify-center gap-2 flex-1">
                {analytics.by_browser.map((b, i) => {
                  const total = analytics.by_browser.reduce((s, x) => s + x.count, 0);
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: browserColors[i % browserColors.length] }} />
                      <span className="text-xs text-muted-foreground/70 flex-1 truncate">{b.browser || 'Otro'}</span>
                      <span className="text-[10px] text-muted-foreground/40">{((b.count / total) * 100).toFixed(0)}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Rage Clicks ── */}
      {f.heatmapData && analytics.rage_click_count > 0 && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-2">
            <AlertOctagon size={14} className="text-red-400" />
            <div className="font-bold text-red-400 text-sm">¡Atención! {analytics.rage_click_count} Rage Clicks detectados</div>
          </div>
          <p className="text-xs text-muted-foreground/70 leading-relaxed">
            Los "rage clicks" ocurren cuando un visitante hace clic varias veces seguidas en el mismo lugar. Indica que algo no responde como esperan.
            Revisa los elementos donde más ocurren para mejorar la experiencia.
          </p>
        </div>
      )}

      {/* ── Embudo de formularios ── */}
      {f.funnelEvents && (
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-1">
            <FormInput size={13} className="text-muted-foreground" />
            <div className="font-bold text-foreground/80 text-sm">Embudo de formularios</div>
          </div>
          <div className="text-xs text-muted-foreground mb-5">Cuántos visitantes iniciaron vs. enviaron un formulario</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-xl border border-border">
              <div className="text-2xl font-bold font-sora text-blue-400">{analytics.form_started_count}</div>
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mt-1">Iniciaron formulario</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-xl border border-border">
              <div className="text-2xl font-bold font-sora text-primary">
                {analytics.form_started_count > 0
                  ? `${Math.round(100)}%`
                  : '—'}
              </div>
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mt-1">Completaron envío</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Consentimiento ── */}
      {f.behavior && (
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={13} className="text-muted-foreground" />
            <div className="font-bold text-foreground/80 text-sm">Consentimiento de cookies</div>
          </div>
          <div className="text-xs text-muted-foreground mb-4">% de visitantes que aceptaron el tracking</div>
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold font-sora text-[#CCFF00]">
              {analytics.consent_rate.toFixed(0)}%
            </div>
            <div className="flex-1 h-3 bg-border rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${analytics.consent_rate}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full bg-[#CCFF00]"
              />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
