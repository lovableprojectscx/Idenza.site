import { motion } from 'framer-motion';
import { LogOut, ExternalLink, MapPin } from 'lucide-react';
import idenzaLogo from '@/assets/idenza-logo.png';
import { Project } from './types';
import { PRIMARY } from './utils';

export function ProjectPicker({ projects, onSelect, onSignOut, userEmail }: {
  projects: Project[]; onSelect: (p: Project) => void; onSignOut: () => void; userEmail: string;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/4 rounded-full" style={{ filter: 'blur(120px)' }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-blue-500/3 rounded-full" style={{ filter: 'blur(120px)' }} />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/4 bg-background/80 backdrop-blur-2xl">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <img src={idenzaLogo} alt="Idenza" className="h-7 w-auto" />
          <div className="flex items-center gap-5">
            <span className="text-[11px] text-white/20 hidden sm:block">{userEmail}</span>
            <button onClick={onSignOut} className="flex items-center gap-1.5 text-xs text-white/20 hover:text-white/50 transition-colors group">
              <LogOut size={13} className="group-hover:translate-x-0.5 transition-transform" />Salir
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="text-[10px] font-mono text-primary/60 uppercase tracking-[0.3em] mb-3">Hub de Analytics</div>
          <h1 className="text-3xl font-bold font-sora text-white mb-2">Tus proyectos</h1>
          <p className="text-sm text-white/30">Selecciona un proyecto para ver sus métricas</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {projects.map((project, i) => {
            const ready = project.events_count > 0;
            return (
              <motion.button key={project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }} whileHover={{ scale: 1.02, y: -3 }} whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(project)}
                className="group relative bg-[#080d1a] border border-white/8 hover:border-primary/30 rounded-3xl p-6 text-left transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_top_left,rgba(233,99,50,0.07),transparent_60%)]" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/25 to-primary/5 border border-primary/20 flex items-center justify-center font-bold text-primary text-base font-sora shadow-[0_0_20px_rgba(233,99,50,0.15)]">
                      {project.name[0].toUpperCase()}
                    </div>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-mono transition-all ${
                      ready
                        ? 'text-[#CCFF00] bg-emerald-500/8 border-emerald-500/15'
                        : 'text-white/20 bg-white/[0.03] border-white/6'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${ready ? 'bg-emerald-400 animate-pulse' : 'bg-white/15'}`} />
                      {ready ? 'Activo' : 'Configurando'}
                    </div>
                  </div>

                  <div className="font-bold text-white text-lg font-sora mb-1">{project.name}</div>
                  {project.website_url && (
                    <div className="flex items-center gap-1.5 text-xs text-white/25 mb-4 group-hover:text-primary/40 transition-colors">
                      <ExternalLink size={10} />
                      <span className="truncate">{project.website_url.replace(/^https?:\/\//, '')}</span>
                    </div>
                  )}
                  {(project.industry || project.city) && (
                    <div className="flex items-center gap-2 text-[11px] text-white/20 mb-5">
                      {project.industry && <span>{project.industry}</span>}
                      {project.industry && project.city && <span className="text-white/10">·</span>}
                      {project.city && <span className="flex items-center gap-1"><MapPin size={9} />{project.city}</span>}
                    </div>
                  )}

                  <div className="flex items-center gap-5 pt-4 border-t border-white/5">
                    {ready ? (
                      <>
                        <div>
                          <div className="text-xl font-bold font-sora" style={{ color: PRIMARY }}>{project.leads_count}</div>
                          <div className="text-[9px] font-mono text-white/20 uppercase tracking-wider mt-0.5">Leads</div>
                        </div>
                        <div>
                          <div className="text-xl font-bold font-sora text-primary/80">{project.events_count}</div>
                          <div className="text-[9px] font-mono text-white/20 uppercase tracking-wider mt-0.5">Visitas</div>
                        </div>
                        {project.leads_count > 0 && (
                          <div className="ml-auto">
                            <div className="text-xl font-bold font-sora text-[#CCFF00]/80">
                              {((project.leads_count / project.events_count) * 100).toFixed(1)}%
                            </div>
                            <div className="text-[9px] font-mono text-white/20 uppercase tracking-wider mt-0.5">Conversión</div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-white/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400/50 animate-pulse" />
                        Esperando activación
                      </div>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
