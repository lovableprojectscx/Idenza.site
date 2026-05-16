import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, UploadCloud, Store, Building2, Gift, Scissors, Camera, Heart, Cake, Shirt, Globe, Home, Dumbbell, UtensilsCrossed, GraduationCap, Gem, Stethoscope, PartyPopper, Sparkles, X, ImagePlus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ClientOnboarding() {
  const { token } = useParams<{ token: string }>();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  
  const [step, setStep] = useState(1);
  const [step1, setStep1] = useState({ nombre: '', promesa: '', diferencial: '', tono: '' });
  const [step2, setStep2] = useState({ whatsapp: '', horarios: '', zonas: '' });
  
  // Photo upload state
  const [uploadedPhotos, setUploadedPhotos] = useState<{ name: string; url: string; preview: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const fetchToken = async () => {
      if (!token) return;
      const { data: ob, error } = await supabase
        .from('client_onboardings')
        .select('*')
        .eq('token', token)
        .single();
        
      if (error || !ob) {
        toast({ title: 'Enlace inválido', description: 'Este enlace de onboarding no existe o ya expiró.', variant: 'destructive' });
      } else {
        setData(ob);
        if (ob.status === 'completed') setCompleted(true);
        if (ob.step1_data) {
          setStep1({ ...ob.step1_data, nombre: ob.step1_data.nombre || ob.business_name || '' });
        } else {
          setStep1({ nombre: ob.business_name || '', promesa: '', diferencial: '', tono: '' });
        }
        if (ob.step2_data) setStep2(ob.step2_data);
        if (ob.step3_data?.photos) setUploadedPhotos(ob.step3_data.photos);
      }
      setLoading(false);
    };
    fetchToken();
  }, [token]);

  const saveStep = async () => {
    if (!data) return;
    
    let updates: any = {};
    if (step === 1) {
      updates = { step1_data: step1, business_name: step1.nombre };
      setData({ ...data, business_name: step1.nombre });
    }
    if (step === 2) updates = { step2_data: step2 };
    
    await supabase.from('client_onboardings').update(updates).eq('id', data.id);
    setStep(step + 1);
  };

  // ── Upload photos to Supabase Storage ─────────────────────────────────────
  const uploadFiles = async (files: FileList | File[]) => {
    const fileArr = Array.from(files);
    if (!fileArr.length || !data) return;
    setUploading(true);
    
    const newPhotos: { name: string; url: string; preview: string }[] = [];
    
    for (const file of fileArr) {
      if (!file.type.startsWith('image/')) continue;
      
      // Generate a unique path
      const ext = file.name.split('.').pop();
      const path = `${data.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      
      const { error } = await supabase.storage
        .from('onboarding-photos')
        .upload(path, file, { upsert: true });
      
      if (!error) {
        const { data: urlData } = supabase.storage
          .from('onboarding-photos')
          .getPublicUrl(path);
        
        newPhotos.push({
          name: file.name,
          url: urlData.publicUrl,
          preview: URL.createObjectURL(file),
        });
      }
    }
    
    setUploadedPhotos(prev => [...prev, ...newPhotos]);
    setUploading(false);
  };

  const removePhoto = async (idx: number) => {
    const photo = uploadedPhotos[idx];
    // Extract path from URL
    const urlParts = photo.url.split('/onboarding-photos/');
    if (urlParts[1]) {
      await supabase.storage.from('onboarding-photos').remove([urlParts[1]]);
    }
    setUploadedPhotos(prev => prev.filter((_, i) => i !== idx));
  };

  const submitFinal = async () => {
    if (!data) return;
    setSubmitting(true);
    
    const updates = { 
      step3_data: { photos: uploadedPhotos }, 
      status: 'completed', 
      completed_at: new Date().toISOString() 
    };
    
    const { error } = await supabase.from('client_onboardings').update(updates).eq('id', data.id);
    
    setSubmitting(false);
    if (!error) {
      setCompleted(true);
      toast({ title: '¡Listo!', description: 'Hemos recibido tu información. Pronto empezaremos a trabajar en tu web.' });
    } else {
      toast({ title: 'Error', description: 'Hubo un problema al guardar. Intenta de nuevo.', variant: 'destructive' });
    }
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Verificando enlace...</div>;
  if (!data) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Enlace inválido o expirado.</div>;

  if (completed) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mb-6">
          <Check size={32} className="text-primary" />
        </motion.div>
        <h1 className="text-3xl font-bold font-sora text-foreground mb-2 text-center">¡Información Recibida!</h1>
        <p className="text-muted-foreground text-center max-w-sm">Ya tenemos todo lo necesario para {data.business_name}. Nuestro equipo empezará a trabajar pronto.</p>
      </div>
    );
  }

  const getRubroIcon = () => {
    switch(data.rubro) {
      case 'Regalos':     return <Gift size={24} className="text-primary" />;
      case 'Florería':   return <Store size={24} className="text-primary" />;
      case 'Grabados':    return <Scissors size={24} className="text-primary" />;
      case 'Pastelería':  return <Cake size={24} className="text-primary" />;
      case 'Globos':      return <PartyPopper size={24} className="text-primary" />;
      case 'Chocolates':  return <Heart size={24} className="text-primary" />;
      case 'Serigrafía':  return <Shirt size={24} className="text-primary" />;
      case 'Joyería':    return <Gem size={24} className="text-primary" />;
      case 'Ropa':        return <Shirt size={24} className="text-primary" />;
      case 'Fotografía':  return <Camera size={24} className="text-primary" />;
      case 'Salud':       return <Stethoscope size={24} className="text-primary" />;
      case 'Educación':  return <GraduationCap size={24} className="text-primary" />;
      case 'Restaurante': return <UtensilsCrossed size={24} className="text-primary" />;
      case 'Tecnología':  return <Globe size={24} className="text-primary" />;
      case 'Inmobiliaria':return <Home size={24} className="text-primary" />;
      case 'Belleza':     return <Sparkles size={24} className="text-primary" />;
      case 'Deporte':     return <Dumbbell size={24} className="text-primary" />;
      case 'Eventos':     return <PartyPopper size={24} className="text-primary" />;
      default:            return <Building2 size={24} className="text-primary" />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 flex flex-col">
      <header className="p-6 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center border border-border">
            {getRubroIcon()}
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight text-foreground">{data.business_name}</h1>
            <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest">IDENZA Onboarding</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {[1, 2, 3].map(s => (
            <div key={s} className={`w-8 h-1 rounded-full transition-colors ${s <= step ? 'bg-primary' : 'bg-foreground/15'}`} />
          ))}
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-12 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          
          {step === 1 && (
            <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-8">
              <div>
                <h2 className="text-3xl font-sora font-bold text-foreground mb-3">Identidad de Marca</h2>
                <p className="text-muted-foreground leading-relaxed">Cuéntanos sobre la esencia de {data.business_name}. Esto nos ayudará a crear textos persuasivos.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Nombre de la Marca</label>
                  <p className="text-xs text-muted-foreground mb-3">¿Cómo se llama tu negocio?</p>
                  <input value={step1.nombre} onChange={e => setStep1({...step1, nombre: e.target.value})} type="text" className="w-full bg-background border border-border rounded-2xl p-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors" placeholder="Nombre comercial" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Promesa Principal</label>
                  <p className="text-xs text-muted-foreground mb-3">¿Qué le prometes a tus clientes? (Ej: "Regalos que sacan sonrisas inolvidables").</p>
                  <textarea value={step1.promesa} onChange={e => setStep1({...step1, promesa: e.target.value})} rows={3} className="w-full bg-background border border-border rounded-2xl p-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors" placeholder="Escribe aquí..." />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Diferencial (Valor Añadido)</label>
                  <p className="text-xs text-muted-foreground mb-3">¿Por qué deberían comprarte a ti y no a la competencia? (Ej: "Entregas en menos de 2 horas", "Peluches importados").</p>
                  <textarea value={step1.diferencial} onChange={e => setStep1({...step1, diferencial: e.target.value})} rows={3} className="w-full bg-background border border-border rounded-2xl p-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors" placeholder="Escribe aquí..." />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Tono de la Marca</label>
                  <p className="text-xs text-muted-foreground mb-3">¿Cómo hablas? (Ej: "Formal y elegante", "Cercano y divertido", "Emocional").</p>
                  <input value={step1.tono} onChange={e => setStep1({...step1, tono: e.target.value})} type="text" className="w-full bg-background border border-border rounded-2xl p-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors" placeholder="Ej: Cercano y amigable" />
                </div>
              </div>

              <button onClick={saveStep} disabled={!step1.promesa} className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50">
                Siguiente paso <ArrowRight size={18} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-8">
              <div>
                <h2 className="text-3xl font-sora font-bold text-foreground mb-3">Operaciones y Contacto</h2>
                <p className="text-muted-foreground leading-relaxed">Detalles técnicos necesarios para configurar los botones de compra de tu web.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Número de WhatsApp Principal</label>
                  <p className="text-xs text-muted-foreground mb-3">El número donde quieres recibir los pedidos.</p>
                  <input value={step2.whatsapp} onChange={e => setStep2({...step2, whatsapp: e.target.value})} type="tel" className="w-full bg-background border border-border rounded-2xl p-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors" placeholder="+51 987 654 321" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Horarios de Atención</label>
                  <textarea value={step2.horarios} onChange={e => setStep2({...step2, horarios: e.target.value})} rows={2} className="w-full bg-background border border-border rounded-2xl p-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors" placeholder="Lunes a Sábado de 9:00 am a 6:00 pm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Zonas de Delivery o Ubicación</label>
                  <p className="text-xs text-muted-foreground mb-3">¿A dónde envían sus {data.rubro.toLowerCase()}? Si tienen local físico, pon la dirección.</p>
                  <textarea value={step2.zonas} onChange={e => setStep2({...step2, zonas: e.target.value})} rows={2} className="w-full bg-background border border-border rounded-2xl p-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors" placeholder="Delivery a todo Ayacucho..." />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="px-6 py-4 bg-foreground/5 text-muted-foreground font-semibold rounded-2xl hover:bg-foreground/10 transition-colors">Volver</button>
                <button onClick={saveStep} disabled={!step2.whatsapp} className="flex-1 py-4 bg-primary text-primary-foreground font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50">
                  Siguiente paso <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-8">
              <div>
                <h2 className="text-3xl font-sora font-bold text-foreground mb-3">Fotos y Activos</h2>
                <p className="text-muted-foreground leading-relaxed">Sube el mejor material visual de tu negocio. Esto es clave para una web premium.</p>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 mb-6">
                <h3 className="font-bold text-primary mb-2 flex items-center gap-2"><Check size={16}/> Instrucciones para {data.rubro}</h3>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
                  {data.rubro === 'Regalos' && (<>
                    <li>Fotos de tus cajas sorpresa más vendidas (buena iluminación).</li>
                    <li>Fotos de peluches y detalles adicionales.</li>
                    <li>Logo de la empresa en alta calidad (PNG transparente si es posible).</li>
                  </>)}
                  {data.rubro === 'Florería' && (<>
                    <li>Fotos de arreglos florales y ramos buchones (tu trabajo estrella).</li>
                    <li>Fotos de decoraciones para fechas especiales.</li>
                    <li>Logo de la empresa en alta calidad (PNG transparente).</li>
                  </>)}
                  {data.rubro === 'Grabados' && (<>
                    <li>Fotos de cerca de los grabados (para ver el detalle y calidad).</li>
                    <li>Fotos del taller o del proceso (opcional pero recomendado).</li>
                    <li>Logo de la empresa en alta calidad.</li>
                  </>)}
                  {data.rubro === 'Pastelería' && (<>
                    <li>Fotos de tus tortas más vistosas (luz natural o caja de luz).</li>
                    <li>Fotos de cupcakes, postres u otros productos del catálogo.</li>
                    <li>Fotos del proceso o decoración si tienes (genera confianza).</li>
                    <li>Logo en alta calidad.</li>
                  </>)}
                  {data.rubro === 'Globos' && (<>
                    <li>Fotos de tus decoraciones más elaboradas (cumpleaños, matrimonios).</li>
                    <li>Fotos de arcos de globos o columnas decorativas.</li>
                    <li>Logo de la empresa.</li>
                  </>)}
                  {data.rubro === 'Chocolates' && (<>
                    <li>Fotos de tus cajas de chocolates y presentaciones especiales.</li>
                    <li>Fotos de productos más pedidos (corazón, figuras, etc.).</li>
                    <li>Logo de la marca en alta calidad.</li>
                  </>)}
                  {data.rubro === 'Serigrafía' && (<>
                    <li>Fotos de prendas estampadas (polos, buzos, gorras).</li>
                    <li>Fotos del proceso de estampado si es posible.</li>
                    <li>Catálogo de diseños disponibles o ejemplos de clientes.</li>
                    <li>Logo de la empresa.</li>
                  </>)}
                  {data.rubro === 'Joyería' && (<>
                    <li>Fotos de tus piezas más vendidas (collares, anillos, pulseras).</li>
                    <li>Fotos con fondo blanco o neutro para resaltar los detalles.</li>
                    <li>Logo o nombre de la marca en alta calidad.</li>
                  </>)}
                  {data.rubro === 'Ropa' && (<>
                    <li>Fotos de tus prendas estrella (bien presentadas o con modelo).</li>
                    <li>Fotos del catálogo o colección actual.</li>
                    <li>Logo o etiqueta de la marca en alta calidad.</li>
                  </>)}
                  {data.rubro === 'Fotografía' && (<>
                    <li>Una selección de tus mejores trabajos (máx. 20 fotos representativas).</li>
                    <li>Fotos de distintos estilos: bodas, retratos, eventos, publicidad, etc.</li>
                    <li>Logo o firma de marca en alta calidad.</li>
                  </>)}
                  {data.rubro === 'Salud' && (<>
                    <li>Fotos del consultorio o clínica (limpia y bien iluminada).</li>
                    <li>Fotos del equipo de profesionales (con su consentimiento).</li>
                    <li>Logo de la clínica en alta calidad.</li>
                    <li>Opcional: fotos de equipos o procedimientos (sin contenido sensible).</li>
                  </>)}
                  {data.rubro === 'Educación' && (<>
                    <li>Fotos del aula o espacio de estudio.</li>
                    <li>Fotos de clases en acción (con permiso de los alumnos).</li>
                    <li>Logo de la academia o instituto en alta calidad.</li>
                    <li>Fotos del equipo docente.</li>
                  </>)}
                  {data.rubro === 'Restaurante' && (<>
                    <li>Fotos de tus platos estrella (buena presentación e iluminación).</li>
                    <li>Fotos del interior del local (ambiente, mesas, mostrador).</li>
                    <li>Logo del restaurante en alta calidad.</li>
                    <li>Fotos del menú si tienes versión digital.</li>
                  </>)}
                  {data.rubro === 'Tecnología' && (<>
                    <li>Fotos del equipo de trabajo.</li>
                    <li>Capturas o imágenes de tus proyectos/servicios (interfaces, dashboards, etc.).</li>
                    <li>Logo de la empresa en alta calidad.</li>
                  </>)}
                  {data.rubro === 'Inmobiliaria' && (<>
                    <li>Fotos de tus propiedades actuales (exterior e interior).</li>
                    <li>Fotos del equipo de asesores.</li>
                    <li>Logo de la inmobiliaria en alta calidad.</li>
                  </>)}
                  {data.rubro === 'Belleza' && (<>
                    <li>Fotos del local/spa (recepción, salas de tratamiento).</li>
                    <li>Fotos de resultados de tus servicios (antes y después si aplica).</li>
                    <li>Logo del negocio en alta calidad.</li>
                  </>)}
                  {data.rubro === 'Deporte' && (<>
                    <li>Fotos del gimnasio o espacio de entrenamiento.</li>
                    <li>Fotos de clases o sesiones (con permiso).</li>
                    <li>Fotos del equipo de entrenadores.</li>
                    <li>Logo o marca del negocio en alta calidad.</li>
                  </>)}
                  {data.rubro === 'Eventos' && (<>
                    <li>Fotos de eventos que hayas organizado (recepciones, bodas, etc.).</li>
                    <li>Fotos de montajes, mesas y decoraciones destacadas.</li>
                    <li>Logo de la empresa en alta calidad.</li>
                  </>)}
                  {(!data.rubro || data.rubro === 'General') && (<>
                    <li>Fotos de tus productos o servicios principales.</li>
                    <li>Fotos del local o equipo de trabajo.</li>
                    <li>Logo de la empresa en alta calidad.</li>
                  </>)}
                </ul>
              </div>

              {/* ── Photo Upload Area ── */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">Sube tus fotos directamente</label>
                <p className="text-xs text-muted-foreground mb-4">JPG, PNG o WEBP • Máx. 10 MB por foto • Puedes subir varias a la vez</p>

                {/* Drop zone */}
                <label
                  htmlFor="photo-upload"
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); uploadFiles(e.dataTransfer.files); }}
                  className={`block w-full border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
                    dragOver
                      ? 'border-primary bg-primary/5 scale-[1.01]'
                      : 'border-border hover:border-primary/50 hover:bg-foreground/[0.02]'
                  }`}
                >
                  {uploading ? (
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 size={36} className="text-primary animate-spin" />
                      <p className="text-sm font-semibold text-foreground">Subiendo fotos...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 pointer-events-none">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <ImagePlus size={26} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">Arrastra las fotos aquí</p>
                        <p className="text-xs text-muted-foreground mt-1">o haz clic para seleccionarlas desde tu dispositivo</p>
                      </div>
                      <span className="px-4 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl">
                        Seleccionar fotos
                      </span>
                    </div>
                  )}
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={e => e.target.files && uploadFiles(e.target.files)}
                  />
                </label>

                {/* Thumbnails grid */}
                {uploadedPhotos.length > 0 && (
                  <div className="mt-5">
                    <p className="text-xs font-semibold text-muted-foreground mb-3">{uploadedPhotos.length} foto{uploadedPhotos.length !== 1 ? 's' : ''} subida{uploadedPhotos.length !== 1 ? 's' : ''}</p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {uploadedPhotos.map((p, i) => (
                        <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-border">
                          <img src={p.preview || p.url} alt={p.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => removePhoto(i)}
                              className="w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <div className="absolute bottom-0 inset-x-0 bg-black/60 px-2 py-1">
                            <p className="text-[9px] text-white/80 truncate">{p.name}</p>
                          </div>
                        </div>
                      ))}
                      {/* Add more slot */}
                      <label htmlFor="photo-upload-more" className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center cursor-pointer transition-colors">
                        <ImagePlus size={20} className="text-muted-foreground/50" />
                        <span className="text-[10px] text-muted-foreground mt-1">Añadir</span>
                        <input id="photo-upload-more" type="file" accept="image/*" multiple className="hidden" onChange={e => e.target.files && uploadFiles(e.target.files)} />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="px-6 py-4 bg-foreground/5 text-muted-foreground font-semibold rounded-2xl hover:bg-foreground/10 transition-colors">Volver</button>
                <button
                  onClick={submitFinal}
                  disabled={uploadedPhotos.length === 0 || submitting || uploading}
                  className="flex-1 py-4 bg-emerald-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                  {submitting ? 'Enviando...' : `Finalizar y Enviar (${uploadedPhotos.length} foto${uploadedPhotos.length !== 1 ? 's' : ''})`}
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
