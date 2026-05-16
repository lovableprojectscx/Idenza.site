import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Plus, Copy, Check, ExternalLink, RefreshCw, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function OnboardingManager() {
  const { toast } = useToast();
  const [onboardings, setOnboardings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Form state
  const [businessName, setBusinessName] = useState('');
  const [rubro, setRubro] = useState('Regalos');
  const [creating, setCreating] = useState(false);

  // Review state
  const [reviewing, setReviewing] = useState<any | null>(null);

  const fetchOnboardings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('client_onboardings')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (!error && data) setOnboardings(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOnboardings();
  }, []);

  const handleCreate = async () => {
    if (!businessName) return;
    setCreating(true);
    
    const { data, error } = await supabase
      .from('client_onboardings')
      .insert([{ business_name: businessName, rubro }])
      .select()
      .single();

    if (error) {
      toast({ title: 'Error', description: 'No se pudo crear el enlace.' });
    } else {
      toast({ title: 'Enlace generado', description: 'El enlace está listo para compartir.' });
      setShowModal(false);
      setBusinessName('');
      setOnboardings([data, ...onboardings]);
    }
    setCreating(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este formulario?")) return;
    
    const { error } = await supabase
      .from('client_onboardings')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: 'No se pudo eliminar el formulario.' });
    } else {
      toast({ title: 'Eliminado', description: 'Formulario eliminado exitosamente.' });
      setOnboardings(onboardings.filter(ob => ob.id !== id));
    }
  };

  const copyLink = (token: string) => {
    const link = `${window.location.origin}/onboarding/${token}`;
    navigator.clipboard.writeText(link);
    toast({ title: 'Copiado', description: 'Enlace copiado al portapapeles.' });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground font-sora mb-2">Onboarding Dinámico</h2>
          <p className="text-muted-foreground">Genera formularios para recopilar información de clientes.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchOnboardings} className="px-4 py-2 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-xl text-sm flex items-center gap-2 transition-colors">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refrescar
          </button>
          <button onClick={() => setShowModal(true)} className="px-5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-sm flex items-center gap-2 transition-colors">
            <Plus size={16} />
            Nuevo Cliente
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-muted-foreground text-center py-20">Cargando datos...</div>
      ) : onboardings.length === 0 ? (
        <div className="text-center py-20 border border-border/50 rounded-3xl bg-foreground/5">
          <p className="text-muted-foreground mb-4">No tienes formularios creados.</p>
          <button onClick={() => setShowModal(true)} className="px-5 py-2 border border-primary/30 text-primary rounded-xl text-sm hover:bg-primary/10 transition-colors">Crear el primero</button>
        </div>
      ) : (
        <div className="grid gap-4">
          {onboardings.map((ob) => (
            <div key={ob.id} className="flex items-center justify-between p-5 border border-border bg-card hover:bg-foreground/5 transition-colors rounded-2xl">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold text-foreground">{ob.business_name}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md border border-border text-muted-foreground">{ob.rubro}</span>
                  {ob.status === 'completed' ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md border border-emerald-500/30 text-emerald-500 bg-emerald-500/10 flex items-center gap-1"><Check size={10}/> Completado</span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md border border-amber-500/30 text-amber-500 bg-amber-500/10">Pendiente</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{new Date(ob.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => copyLink(ob.token)} className="px-4 py-2 border border-border text-muted-foreground hover:text-foreground rounded-xl text-xs flex items-center gap-2 transition-colors">
                  <Copy size={12} /> Copiar Link
                </button>
                {ob.status === 'completed' && (
                  <button onClick={() => setReviewing(ob)} className="px-4 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 hover:bg-emerald-500/20 rounded-xl text-xs flex items-center gap-2 transition-colors">
                    Revisar Datos
                  </button>
                )}
                <button onClick={() => handleDelete(ob.id)} className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20 rounded-xl text-xs flex items-center gap-2 transition-colors">
                  <Trash2 size={12} /> Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Nuevo Cliente */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border border-border rounded-3xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-foreground mb-4">Generar Formulario</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Nombre del Negocio</label>
                <input value={businessName} onChange={e => setBusinessName(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50" placeholder="Ej: Sorpresas Ayacucho" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Rubro</label>
                <select value={rubro} onChange={e => setRubro(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50">
                  <optgroup label="Regalos y Emociones">
                    <option value="Regalos">Regalos / Sorpresas</option>
                    <option value="Florería">Florería / Arreglos Florales</option>
                    <option value="Pastelería">Pastelería / Tortas</option>
                    <option value="Globos">Globos / Decoración de Eventos</option>
                    <option value="Chocolates">Chocolates / Bombonería</option>
                  </optgroup>
                  <optgroup label="Productos Personalizados">
                    <option value="Grabados">Grabados / Personalizados</option>
                    <option value="Serigrafía">Serigrafía / Estampados</option>
                    <option value="Joyería">Joyería / Accesorios</option>
                    <option value="Ropa">Ropa / Indumentaria</option>
                  </optgroup>
                  <optgroup label="Servicios">
                    <option value="Fotografía">Fotografía / Video</option>
                    <option value="Salud">Salud / Clínica / Dental</option>
                    <option value="Educación">Educación / Academia</option>
                    <option value="Restaurante">Restaurante / Comida</option>
                    <option value="Tecnología">Tecnología / Servicios IT</option>
                    <option value="Inmobiliaria">Inmobiliaria / Bienes Raíces</option>
                    <option value="Belleza">Belleza / Estética / Spa</option>
                    <option value="Deporte">Deporte / Gym / Nutrición</option>
                    <option value="Eventos">Eventos / Catering</option>
                    <option value="General">Servicio General</option>
                  </optgroup>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">Cancelar</button>
              <button onClick={handleCreate} disabled={!businessName || creating} className="px-5 py-2 bg-primary text-primary-foreground font-semibold rounded-xl text-sm disabled:opacity-50">Generar Link</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal Revisión */}
      {reviewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-background/60 backdrop-blur-sm">
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} className="bg-card border-l border-border w-full max-w-2xl h-full overflow-y-auto p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-foreground">{reviewing.business_name}</h3>
                <p className="text-primary font-mono text-sm">Respuestas de Onboarding</p>
              </div>
              <button onClick={() => setReviewing(null)} className="p-2 bg-foreground/5 rounded-xl hover:bg-foreground/10 transition-colors text-foreground">Cerrar</button>
            </div>

            <div className="space-y-8">
              {/* Identidad */}
              <div className="bg-background border border-border rounded-2xl p-6">
                <h4 className="text-foreground font-bold border-b border-border pb-2 mb-4">1. Identidad de Marca</h4>
                <div className="space-y-4">
                  <div><p className="text-xs text-muted-foreground mb-1">Promesa Principal</p><p className="text-sm text-foreground">{reviewing.step1_data?.promesa || '-'}</p></div>
                  <div><p className="text-xs text-muted-foreground mb-1">Diferencial</p><p className="text-sm text-foreground">{reviewing.step1_data?.diferencial || '-'}</p></div>
                  <div><p className="text-xs text-muted-foreground mb-1">Tono de Marca</p><p className="text-sm text-foreground">{reviewing.step1_data?.tono || '-'}</p></div>
                </div>
              </div>

              {/* Operaciones */}
              <div className="bg-background border border-border rounded-2xl p-6">
                <h4 className="text-foreground font-bold border-b border-border pb-2 mb-4">2. Operaciones</h4>
                <div className="space-y-4">
                  <div><p className="text-xs text-muted-foreground mb-1">Número de WhatsApp</p><p className="text-sm text-foreground">{reviewing.step2_data?.whatsapp || '-'}</p></div>
                  <div><p className="text-xs text-muted-foreground mb-1">Horarios de Atención</p><p className="text-sm text-foreground">{reviewing.step2_data?.horarios || '-'}</p></div>
                  <div><p className="text-xs text-muted-foreground mb-1">Zonas de Delivery</p><p className="text-sm text-foreground">{reviewing.step2_data?.zonas || '-'}</p></div>
                </div>
              </div>

              {/* Activos / Fotos */}
              <div className="bg-background border border-border rounded-2xl p-6">
                <h4 className="text-foreground font-bold border-b border-border pb-2 mb-4">3. Activos / Fotos</h4>
                {reviewing.step3_data?.photos?.length > 0 ? (
                  <div>
                    <p className="text-xs text-muted-foreground mb-3">{reviewing.step3_data.photos.length} foto(s) subidas por el cliente</p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {reviewing.step3_data.photos.map((p: any, i: number) => (
                        <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" className="group relative aspect-square rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all">
                          <img src={p.url} alt={p.name || `foto-${i+1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <div className="absolute bottom-0 inset-x-0 bg-black/60 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-[9px] text-white truncate">{p.name}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                    <a
                      href={reviewing.step3_data.photos[0]?.url?.split('/onboarding-photos/')[0] + '/onboarding-photos/' + reviewing.id + '/'}
                      className="inline-flex items-center gap-2 mt-4 text-primary hover:underline text-xs font-semibold"
                    >
                      Descargar todas las fotos
                    </a>
                  </div>
                ) : reviewing.step3_data?.drive_link ? (
                  <a href={reviewing.step3_data.drive_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline bg-primary/10 px-4 py-2 rounded-xl text-sm font-semibold">
                    Abrir Carpeta de Fotos (Drive)
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">No se subieron fotos aún.</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
