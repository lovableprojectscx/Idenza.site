import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { 
  Plus, Copy, Check, ExternalLink, RefreshCw, Trash2,
  Store, Globe, Palette, Calendar, Clock, CreditCard, Sparkles, Image,
  Eye, EyeOff, Phone, Mail, MessageSquare, HardDrive, Download, Info, Shield, X, Camera,
  Facebook, Instagram, Building2, Gift, Scissors, Cake, Heart, Shirt, Gem, Stethoscope, PartyPopper
} from 'lucide-react';
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
  const [activeReviewTab, setActiveReviewTab] = useState<'brand' | 'ops' | 'catalog' | 'delivery' | 'payments' | 'marketing' | 'assets'>('brand');
  const [showApiKey, setShowApiKey] = useState(false);

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

  const renderColors = (colorString: string) => {
    if (!colorString) return <span className="text-muted-foreground">-</span>;
    const hexRegex = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g;
    const matches = colorString.match(hexRegex);
    if (matches && matches.length > 0) {
      return (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            {matches.map((hex, idx) => (
              <div key={idx} className="flex items-center gap-1.5 bg-background border border-border px-2 py-1 rounded-lg text-xs font-mono shadow-sm">
                <span className="w-3.5 h-3.5 rounded-full border border-foreground/15 shadow-inner" style={{ backgroundColor: hex }} />
                {hex}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground italic">Detalle: {colorString}</p>
        </div>
      );
    }
    return <p className="text-sm text-foreground">{colorString}</p>;
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
          <motion.div 
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            className="bg-card border-l border-border w-full max-w-3xl h-full overflow-y-auto p-8 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-border/50 pb-6 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <h3 className="text-2xl font-bold text-foreground font-sora leading-tight">{reviewing.business_name}</h3>
                  <span className="text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full border border-border text-muted-foreground capitalize">
                    {reviewing.rubro}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                  <p>Creado: <span className="font-semibold text-foreground">{new Date(reviewing.created_at).toLocaleDateString()}</span></p>
                  {reviewing.completed_at ? (
                    <p className="flex items-center gap-1 text-emerald-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Completado: <span className="font-semibold">{new Date(reviewing.completed_at).toLocaleDateString()}</span>
                    </p>
                  ) : (
                    <p className="flex items-center gap-1 text-amber-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      Pendiente
                    </p>
                  )}
                </div>
              </div>
              <button 
                onClick={() => setReviewing(null)} 
                className="p-2.5 bg-foreground/5 hover:bg-foreground/10 text-foreground hover:scale-105 rounded-xl transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Quick Actions Bar */}
            <div className="bg-background/40 border border-border/80 p-3 rounded-2xl mb-6 flex flex-wrap gap-2.5 justify-between items-center shadow-sm backdrop-blur-sm">
              <span className="text-[10px] font-mono font-semibold text-muted-foreground pl-1">ACCIONES RÁPIDAS:</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => copyLink(reviewing.token)} 
                  className="px-3 py-1.5 border border-border text-muted-foreground hover:text-foreground bg-background rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:border-primary/30 transition-all"
                >
                  <Copy size={12} /> Copiar Link Form
                </button>
                <a 
                  href={`${window.location.origin}/onboarding/${reviewing.token}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  Ver Formulario <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex gap-2 border-b border-border/60 pb-3.5 mb-6 overflow-x-auto scrollbar-thin">
              {[
                { id: 'brand', label: 'Identidad', icon: Store },
                { id: 'ops', label: 'Operaciones', icon: Clock },
                { id: 'catalog', label: 'Catálogo', icon: Gift },
                { id: 'delivery', label: 'Delivery', icon: Globe },
                { id: 'payments', label: 'Pasarela IZI', icon: CreditCard },
                { id: 'marketing', label: 'Marketing', icon: Sparkles },
                { id: 'assets', label: 'Activos', icon: Image }
              ].map(t => {
                const Icon = t.icon;
                const active = activeReviewTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveReviewTab(t.id as any)}
                    className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border ${
                      active 
                        ? 'bg-primary border-primary text-primary-foreground shadow-md scale-105' 
                        : 'bg-background hover:bg-foreground/5 border-border/80 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon size={13} />
                    {t.label}
                  </button>
                );
              })}
            </div>

            {/* Content Container */}
            <div className="flex-1 overflow-y-auto pr-1 pb-6 space-y-6">
              {/* Tab 1: Brand */}
              {activeReviewTab === 'brand' && (
                <div className="space-y-6">
                  <div className="bg-background/40 border border-border/85 rounded-2xl p-6 space-y-4 shadow-sm backdrop-blur-sm">
                    <h4 className="text-foreground font-bold text-base flex items-center gap-2 border-b border-border/50 pb-2.5">
                      <Store size={18} className="text-primary animate-pulse" />
                      Identidad del Negocio
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Nombre Comercial</p>
                        <p className="text-sm font-bold text-foreground">{reviewing.step1_data?.nombre || reviewing.business_name || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Rubro de la Tienda</p>
                        <span className="inline-flex text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary uppercase tracking-wider font-mono">
                          {reviewing.rubro || '-'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Promesa Principal (¿Qué prometen a los clientes?)</p>
                      <p className="text-sm text-foreground bg-background/50 border border-border/40 p-3.5 rounded-xl leading-relaxed whitespace-pre-wrap">{reviewing.step1_data?.promesa || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Diferencial (¿Por qué te eligen a ti y no a otro?)</p>
                      <p className="text-sm text-foreground bg-background/50 border border-border/40 p-3.5 rounded-xl leading-relaxed whitespace-pre-wrap">{reviewing.step1_data?.diferencial || '-'}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Tono de Voz de la Marca</p>
                        {reviewing.step1_data?.tono ? (
                          <span className="inline-flex text-xs font-semibold px-3 py-1.5 rounded-xl bg-card border border-border text-foreground capitalize">
                            {reviewing.step1_data.tono}
                          </span>
                        ) : <span className="text-muted-foreground">-</span>}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Web de Referencia de Diseño</p>
                        {reviewing.step1_data?.ref_web ? (
                          <a href={reviewing.step1_data.ref_web.startsWith('http') ? reviewing.step1_data.ref_web : `https://${reviewing.step1_data.ref_web}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-semibold bg-primary/5 px-2.5 py-1 rounded-xl border border-primary/10">
                            {reviewing.step1_data.ref_web} <ExternalLink size={12} />
                          </a>
                        ) : <span className="text-muted-foreground">-</span>}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Paleta de Colores de la Marca</p>
                      {renderColors(reviewing.step1_data?.colors)}
                    </div>
                  </div>

                  {/* Logo section */}
                  <div className="bg-background/40 border border-border/85 rounded-2xl p-6 space-y-4 shadow-sm backdrop-blur-sm">
                    <h4 className="text-foreground font-bold text-base flex items-center gap-2 border-b border-border/50 pb-2.5">
                      <Palette size={18} className="text-primary" />
                      Logotipo Corporativo (PNG Transparente)
                    </h4>
                    {reviewing.step1_data?.logo_url ? (
                      <div className="flex flex-col sm:flex-row items-center gap-6 bg-background/50 border border-border/40 p-4 rounded-2xl">
                        <div className="w-28 h-28 rounded-xl bg-neutral-950 border border-border/60 flex items-center justify-center p-2.5 relative overflow-hidden group shadow-inner">
                          <img src={reviewing.step1_data.logo_url} alt="Logo" className="max-w-full max-h-full object-contain" />
                        </div>
                        <div className="flex-1 space-y-2 text-center sm:text-left">
                          <p className="text-sm font-bold text-foreground truncate max-w-[280px]">{reviewing.step1_data.logo_name || 'logo-cliente.png'}</p>
                          <p className="text-xs text-muted-foreground">Logotipo con fondo transparente (PNG)</p>
                          <a href={reviewing.step1_data.logo_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all">
                            <Download size={12} /> Descargar Logo
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground border border-dashed border-border/60 rounded-xl">
                        No se subió logotipo corporativo
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Operations */}
              {activeReviewTab === 'ops' && (
                <div className="space-y-6">
                  <div className="bg-background/40 border border-border/85 rounded-2xl p-6 space-y-4 shadow-sm backdrop-blur-sm">
                    <h4 className="text-foreground font-bold text-base flex items-center gap-2 border-b border-border/50 pb-2.5">
                      <Phone size={18} className="text-primary" />
                      Canales y Horarios de Atención
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Número de WhatsApp</p>
                        {reviewing.step2_data?.whatsapp ? (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-bold text-foreground">{reviewing.step2_data.whatsapp}</span>
                            <a href={`https://wa.me/${reviewing.step2_data.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] bg-[#25d366]/10 border border-[#25d366]/20 text-[#25d366] hover:bg-[#25d366]/20 px-2 py-0.5 rounded-md font-semibold transition-all">
                              Chatear <ExternalLink size={10} />
                            </a>
                          </div>
                        ) : <span className="text-muted-foreground">-</span>}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Correo de Pedidos</p>
                        <p className="text-sm text-foreground font-medium mt-1">{reviewing.step2_data?.email_orders || '-'}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Horarios de Atención</p>
                        <p className="text-sm text-foreground mt-1">{reviewing.step2_data?.hours || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">¿Quién manejará el panel?</p>
                        <span className="inline-flex text-xs font-semibold px-2.5 py-1 rounded-full bg-foreground/5 border border-border text-foreground capitalize mt-1">
                          {reviewing.step2_data?.panel_user === 'equipo' ? 'Equipo de trabajo' : 'Ella sola'}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">¿Notificaciones de pedidos por WhatsApp?</p>
                        <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full ${reviewing.step2_data?.wa_notif === 'si' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border border-red-500/20 text-red-500'}`}>
                          {reviewing.step2_data?.wa_notif === 'si' ? 'Sí, notificar por WhatsApp además de correo' : 'No, solo notificar por correo'}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Días de Atención</p>
                        {reviewing.step2_data?.dias && reviewing.step2_data.dias.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {reviewing.step2_data.dias.map((d: string) => (
                              <span key={d} className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-primary/10 border border-primary/20 text-primary capitalize">{d}</span>
                            ))}
                          </div>
                        ) : <span className="text-muted-foreground">-</span>}
                      </div>
                    </div>
                  </div>

                  {/* Social Networks */}
                  <div className="bg-background/40 border border-border/85 rounded-2xl p-6 space-y-4 shadow-sm backdrop-blur-sm">
                    <h4 className="text-foreground font-bold text-base flex items-center gap-2 border-b border-border/50 pb-2.5">
                      <Globe size={18} className="text-primary" />
                      Redes Sociales del Negocio
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-background/50 border border-border/40 p-4 rounded-xl space-y-2">
                        <div className="flex items-center gap-2 text-[#e1306c]">
                          <Instagram size={16} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Instagram</span>
                        </div>
                        {reviewing.step2_data?.instagram ? (
                          <a href={reviewing.step2_data.instagram.startsWith('http') ? reviewing.step2_data.instagram : `https://instagram.com/${reviewing.step2_data.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-xs text-foreground hover:underline font-semibold flex items-center gap-1 truncate max-w-full">
                            {reviewing.step2_data.instagram} <ExternalLink size={10} />
                          </a>
                        ) : (
                          <p className="text-xs text-muted-foreground">No especificado</p>
                        )}
                      </div>

                      <div className="bg-background/50 border border-border/40 p-4 rounded-xl space-y-2">
                        <div className="flex items-center gap-2 text-[#1877f2]">
                          <Facebook size={16} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Facebook</span>
                        </div>
                        {reviewing.step2_data?.facebook ? (
                          <a href={reviewing.step2_data.facebook.startsWith('http') ? reviewing.step2_data.facebook : `https://facebook.com/${reviewing.step2_data.facebook}`} target="_blank" rel="noopener noreferrer" className="text-xs text-foreground hover:underline font-semibold flex items-center gap-1 truncate max-w-full">
                            {reviewing.step2_data.facebook} <ExternalLink size={10} />
                          </a>
                        ) : (
                          <p className="text-xs text-muted-foreground">No especificado</p>
                        )}
                      </div>

                      <div className="bg-background/50 border border-border/40 p-4 rounded-xl space-y-2">
                        <div className="flex items-center gap-2 text-foreground">
                          <span className="text-[10px] font-bold uppercase tracking-wider">TikTok</span>
                        </div>
                        {reviewing.step2_data?.tiktok ? (
                          <a href={reviewing.step2_data.tiktok.startsWith('http') ? reviewing.step2_data.tiktok : `https://tiktok.com/@${reviewing.step2_data.tiktok.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-xs text-foreground hover:underline font-semibold flex items-center gap-1 truncate max-w-full">
                            {reviewing.step2_data.tiktok} <ExternalLink size={10} />
                          </a>
                        ) : (
                          <p className="text-xs text-muted-foreground">No especificado</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Catalog */}
              {activeReviewTab === 'catalog' && (
                <div className="space-y-6">
                  <div className="bg-background/40 border border-border/85 rounded-2xl p-6 space-y-4 shadow-sm backdrop-blur-sm">
                    <h4 className="text-foreground font-bold text-base flex items-center gap-2 border-b border-border/50 pb-2.5">
                      <Gift size={18} className="text-primary" />
                      Definición del Catálogo de Productos
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Categorías que maneja</p>
                        <p className="text-sm text-foreground font-semibold bg-background/50 border border-border/40 p-3 rounded-xl">{reviewing.step3_data?.categories || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Número aproximado de productos</p>
                        <span className="inline-flex text-xs font-bold px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary mt-1">
                          {reviewing.step3_data?.product_count || '-'} productos
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">¿Los productos tienen variantes? (Tamaño, color)</p>
                      <p className="text-sm text-foreground bg-background/50 border border-border/40 p-3.5 rounded-xl">{reviewing.step3_data?.variants || '-'}</p>
                    </div>
                  </div>

                  {/* Photos and Drive Link */}
                  <div className="bg-background/40 border border-border/85 rounded-2xl p-6 space-y-4 shadow-sm backdrop-blur-sm">
                    <h4 className="text-foreground font-bold text-base flex items-center gap-2 border-b border-border/50 pb-2.5">
                      <HardDrive size={18} className="text-primary" />
                      Fotos de Productos
                    </h4>
                    {reviewing.step3_data?.photos && reviewing.step3_data.photos.length > 0 ? (
                      <div className="space-y-4">
                        <p className="text-xs text-muted-foreground">{reviewing.step3_data.photos.length} fotos subidas por el cliente</p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                          {reviewing.step3_data.photos.map((p: any, i: number) => (
                            <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" className="group relative aspect-square rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all shadow-sm">
                              <img src={p.url} alt={p.name || `foto-${i+1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                              <div className="absolute bottom-0 inset-x-0 bg-black/60 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-[9px] text-white truncate">{p.name}</p>
                              </div>
                            </a>
                          ))}
                        </div>
                        <div className="flex gap-3">
                          <a
                            href={reviewing.step3_data.photos[0]?.url?.split('/onboarding-photos/')[0] + '/onboarding-photos/' + reviewing.id + '/'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all"
                          >
                            <Download size={12} /> Descargar de Supabase
                          </a>
                        </div>
                      </div>
                    ) : reviewing.step3_data?.drive_link ? (
                      <div className="flex items-center gap-4 bg-background/50 border border-border/40 p-4 rounded-xl justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-foreground">Carpeta de Google Drive</p>
                          <p className="text-xs text-muted-foreground">El cliente subió sus fotos a una carpeta externa</p>
                        </div>
                        <a href={reviewing.step3_data.drive_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline bg-primary/10 border border-primary/20 px-4 py-2.5 rounded-xl text-xs font-bold transition-all">
                          Abrir Carpeta Drive <ExternalLink size={12} />
                        </a>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground border border-dashed border-border/60 rounded-xl">
                        No se subieron fotos del catálogo
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 4: Delivery */}
              {activeReviewTab === 'delivery' && (
                <div className="space-y-6">
                  <div className="bg-background/40 border border-border/85 rounded-2xl p-6 space-y-4 shadow-sm backdrop-blur-sm">
                    <h4 className="text-foreground font-bold text-base flex items-center gap-2 border-b border-border/50 pb-2.5">
                      <Globe size={18} className="text-primary" />
                      Delivery y Cobertura
                    </h4>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Distritos que cubre</p>
                      <p className="text-sm text-foreground bg-background/50 border border-border/40 p-3.5 rounded-xl leading-relaxed whitespace-pre-wrap">{reviewing.step4_data?.delivery_zones || '-'}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="bg-background/50 border border-border/40 p-4 rounded-xl">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">¿Tiene horario límite para pedidos del mismo día?</p>
                        <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full ${reviewing.step4_data?.same_day === 'si' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border border-red-500/20 text-red-500'}`}>
                          {reviewing.step4_data?.same_day === 'si' ? 'Sí, tiene delivery Same-Day' : 'No tiene delivery Same-Day'}
                        </span>
                      </div>
                      {reviewing.step4_data?.same_day === 'si' && (
                        <div className="bg-background/50 border border-border/40 p-4 rounded-xl">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Horario límite (Cutoff Time)</p>
                          <div className="flex items-center gap-2 text-foreground font-bold mt-1">
                            <Clock size={14} className="text-primary" />
                            <span>{reviewing.step4_data?.cutoff_time || '-'}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: Payments */}
              {activeReviewTab === 'payments' && (
                <div className="space-y-6">
                  <div className="bg-background/40 border border-border/85 rounded-2xl p-6 space-y-4 shadow-sm backdrop-blur-sm">
                    <h4 className="text-foreground font-bold text-base flex items-center gap-2 border-b border-border/50 pb-2.5">
                      <CreditCard size={18} className="text-primary" />
                      Pasarela de Pagos IZI
                    </h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Merchant ID</p>
                          {reviewing.step5_data?.izi_merchant_id ? (
                            <div className="flex items-center gap-2 bg-background/50 border border-border/40 px-3.5 py-2 rounded-xl mt-1">
                              <span className="text-sm font-mono font-semibold text-foreground flex-1 truncate">{reviewing.step5_data.izi_merchant_id}</span>
                              <button onClick={() => {
                                navigator.clipboard.writeText(reviewing.step5_data.izi_merchant_id);
                                toast({ title: 'Copiado', description: 'Merchant ID copiado al portapapeles.' });
                              }} className="p-1 hover:bg-foreground/5 rounded text-muted-foreground hover:text-foreground">
                                <Copy size={14} />
                              </button>
                            </div>
                          ) : <span className="text-muted-foreground">-</span>}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Ambiente de Operación</p>
                          <span className={`inline-flex text-xs font-bold px-3 py-1.5 rounded-xl border mt-1.5 capitalize ${reviewing.step5_data?.izi_env === 'produccion' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'}`}>
                            {reviewing.step5_data?.izi_env === 'produccion' ? 'Producción (En vivo)' : 'Pruebas / Sandbox'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">API Key (Llave Secreta)</p>
                        {reviewing.step5_data?.izi_api_key ? (
                          <div className="flex items-center gap-2 bg-background/50 border border-border/40 px-3.5 py-2.5 rounded-xl mt-1">
                            <span className="text-xs font-mono font-semibold text-foreground flex-1 truncate">
                              {showApiKey ? reviewing.step5_data.izi_api_key : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                            </span>
                            <button onClick={() => setShowApiKey(!showApiKey)} className="p-1 hover:bg-foreground/5 rounded text-muted-foreground hover:text-foreground">
                              {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                            <button onClick={() => {
                              navigator.clipboard.writeText(reviewing.step5_data.izi_api_key);
                              toast({ title: 'Copiado', description: 'API Key copiada al portapapeles.' });
                            }} className="p-1 hover:bg-foreground/5 rounded text-muted-foreground hover:text-foreground">
                              <Copy size={14} />
                            </button>
                          </div>
                        ) : <span className="text-muted-foreground">-</span>}
                      </div>
                    </div>
                  </div>

                  {/* Yape/Plin details */}
                  <div className="bg-background/40 border border-border/85 rounded-2xl p-6 space-y-4 shadow-sm backdrop-blur-sm">
                    <h4 className="text-foreground font-bold text-base flex items-center gap-2 border-b border-border/50 pb-2.5">
                      <Shield size={18} className="text-primary" />
                      Métodos de Pago Directos (Yape / Plin)
                    </h4>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Configuración de Transferencias / QR</p>
                      <p className="text-sm text-foreground bg-background/50 border border-border/40 p-4 rounded-xl font-medium leading-relaxed">{reviewing.step5_data?.yape_plin || '-'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 6: Marketing */}
              {activeReviewTab === 'marketing' && (
                <div className="space-y-6">
                  <div className="bg-background/40 border border-border/85 rounded-2xl p-6 space-y-4 shadow-sm backdrop-blur-sm">
                    <h4 className="text-foreground font-bold text-base flex items-center gap-2 border-b border-border/50 pb-2.5">
                      <Sparkles size={18} className="text-primary animate-pulse" />
                      Popup de Bienvenida / Descuentos
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">¿Ofrece descuento por primera compra?</p>
                        <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full ${reviewing.step6_data?.first_discount === 'si' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border border-red-500/20 text-red-500'}`}>
                          {reviewing.step6_data?.first_discount === 'si' ? 'Sí, ofrece descuento' : 'No ofrece descuento'}
                        </span>
                      </div>
                      {reviewing.step6_data?.first_discount === 'si' && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Porcentaje o Monto del Descuento</p>
                          <span className="inline-flex text-xs font-bold px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary mt-1">
                            {reviewing.step6_data?.discount_amount || '-'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Contenido / Texto del Popup de Bienvenida</p>
                      <p className="text-sm text-foreground bg-background/50 border border-border/40 p-4 rounded-xl leading-relaxed whitespace-pre-wrap">{reviewing.step6_data?.popup_content || '-'}</p>
                    </div>
                  </div>

                  {/* Banner principal */}
                  <div className="bg-background/40 border border-border/85 rounded-2xl p-6 space-y-4 shadow-sm backdrop-blur-sm">
                    <h4 className="text-foreground font-bold text-base flex items-center gap-2 border-b border-border/50 pb-2.5">
                      <Image size={18} className="text-primary" />
                      Banner de Tienda (Flyer / Carrusel Principal)
                    </h4>
                    {reviewing.step6_data?.banner_image ? (
                      <div className="space-y-4">
                        <div className="relative aspect-[21/9] w-full rounded-xl overflow-hidden border border-border/60 bg-neutral-950 group shadow-inner">
                          <img src={reviewing.step6_data.banner_image} alt="Banner" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-background/50 border border-border/40 p-3.5 rounded-xl">
                          <div className="space-y-0.5">
                            <p className="text-sm font-bold text-foreground truncate max-w-[280px]">{reviewing.step6_data.banner_image_name || 'banner-tienda.jpg'}</p>
                            <p className="text-xs text-muted-foreground">Banner subido por el cliente</p>
                          </div>
                          <a href={reviewing.step6_data.banner_image} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all">
                            <Download size={12} /> Descargar Banner
                          </a>
                        </div>
                        {reviewing.step6_data?.banner_frequency && (
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Preferencia de rotación / frecuencia de banner</p>
                            <span className="inline-flex text-xs font-semibold px-3 py-1.5 rounded-xl bg-foreground/5 border border-border text-foreground">
                              {reviewing.step6_data.banner_frequency}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground border border-dashed border-border/60 rounded-xl">
                        No se subió banner de tienda
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 7: Assets */}
              {activeReviewTab === 'assets' && (
                <div className="space-y-6">
                  <div className="bg-background/40 border border-border/85 rounded-2xl p-6 space-y-4 shadow-sm backdrop-blur-sm">
                    <h4 className="text-foreground font-bold text-base flex items-center gap-2 border-b border-border/50 pb-2.5">
                      <Camera size={18} className="text-primary animate-pulse" />
                      Fotos de Marca (Lifestyle, local, equipo)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
                      <div className="bg-background/50 border border-border/40 p-4 rounded-xl">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">¿Tiene fotos profesionales (con fotógrafo)?</p>
                        <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full ${reviewing.step7_data?.photographer === 'si' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border border-red-500/20 text-red-500'}`}>
                          {reviewing.step7_data?.photographer === 'si' ? 'Sí, cuenta con material profesional' : 'No cuenta con material profesional'}
                        </span>
                      </div>
                    </div>
                    {reviewing.step7_data?.brand_photos && reviewing.step7_data.brand_photos.length > 0 ? (
                      <div className="space-y-4 pt-2">
                        <p className="text-xs text-muted-foreground">{reviewing.step7_data.brand_photos.length} foto(s) de marca subida(s)</p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                          {reviewing.step7_data.brand_photos.map((p: any, i: number) => (
                            <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" className="group relative aspect-square rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all shadow-sm">
                              <img src={p.url} alt={p.name || `marca-foto-${i+1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                              <div className="absolute bottom-0 inset-x-0 bg-black/60 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-[9px] text-white truncate">{p.name}</p>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground border border-dashed border-border/60 rounded-xl">
                        No se subieron fotos de estilo de vida adicionales
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  <div className="bg-background/40 border border-border/85 rounded-2xl p-6 space-y-4 shadow-sm backdrop-blur-sm">
                    <h4 className="text-foreground font-bold text-base flex items-center gap-2 border-b border-border/50 pb-2.5">
                      <Info size={18} className="text-primary" />
                      Notas y Comentarios del Cliente
                    </h4>
                    <p className="text-sm text-foreground bg-background/50 border border-border/40 p-4 rounded-xl leading-relaxed whitespace-pre-wrap">
                      {reviewing.step7_data?.notes || 'Sin comentarios adicionales.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
