import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, ArrowLeft, Check, UploadCloud, Store, Building2, Gift, Scissors, 
  Camera, Heart, Cake, Shirt, Globe, Home, Dumbbell, UtensilsCrossed, 
  GraduationCap, Gem, Stethoscope, PartyPopper, Sparkles, X, ImagePlus, Loader2, 
  FileText, Clock, ShieldCheck, HelpCircle, Send, MessageSquare, Instagram, Facebook
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ClientOnboarding() {
  const { token } = useParams<{ token: string }>();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  
  const [step, setStep] = useState(1);
  
  // State for all 7 steps
  const [step1, setStep1] = useState({
    nombre: '',
    promesa: '',
    diferencial: '',
    tono: '',
    ref_web: '',
    colors: '',
    logo_url: '',
    logo_name: ''
  });
  
  const [step2, setStep2] = useState({
    whatsapp: '',
    email_orders: '',
    hours: '',
    dias: [] as string[],
    panel_user: '',
    wa_notif: '',
    instagram: '',
    facebook: '',
    tiktok: ''
  });
  
  const [step3, setStep3] = useState({
    categories: '',
    product_count: '',
    variants: '',
    photos: [] as { name: string; url: string; preview?: string }[],
    drive_link: ''
  });
  
  const [step4, setStep4] = useState({
    delivery_zones: '',
    same_day: '',
    cutoff_time: ''
  });
  
  const [step5, setStep5] = useState({
    izi_api_key: '',
    izi_merchant_id: '',
    izi_env: '',
    yape_plin: ''
  });
  
  const [step6, setStep6] = useState({
    popup_content: '',
    first_discount: '',
    discount_amount: '',
    banner_image: '',
    banner_image_name: '',
    banner_frequency: ''
  });
  
  const [step7, setStep7] = useState({
    brand_photos: [] as { name: string; url: string; preview?: string }[],
    photographer: '',
    notes: ''
  });
  
  const [uploadingType, setUploadingType] = useState<string | null>(null);
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
        
        // Load step 1
        if (ob.step1_data) {
          setStep1({
            nombre: ob.step1_data.nombre || ob.business_name || '',
            promesa: ob.step1_data.promesa || '',
            diferencial: ob.step1_data.diferencial || '',
            tono: ob.step1_data.tono || '',
            ref_web: ob.step1_data.ref_web || '',
            colors: ob.step1_data.colors || '',
            logo_url: ob.step1_data.logo_url || '',
            logo_name: ob.step1_data.logo_name || ''
          });
        } else {
          setStep1(prev => ({ ...prev, nombre: ob.business_name || '' }));
        }
        
        // Load step 2
        if (ob.step2_data) {
          setStep2({
            whatsapp: ob.step2_data.whatsapp || '',
            email_orders: ob.step2_data.email_orders || '',
            hours: ob.step2_data.hours || '',
            dias: ob.step2_data.dias || [],
            panel_user: ob.step2_data.panel_user || '',
            wa_notif: ob.step2_data.wa_notif || '',
            instagram: ob.step2_data.instagram || '',
            facebook: ob.step2_data.facebook || '',
            tiktok: ob.step2_data.tiktok || ''
          });
        }
        
        // Load step 3
        if (ob.step3_data) {
          setStep3({
            categories: ob.step3_data.categories || '',
            product_count: ob.step3_data.product_count || '',
            variants: ob.step3_data.variants || '',
            photos: ob.step3_data.photos || [],
            drive_link: ob.step3_data.drive_link || ''
          });
        }
        
        // Load step 4
        if (ob.step4_data) {
          setStep4({
            delivery_zones: ob.step4_data.delivery_zones || '',
            same_day: ob.step4_data.same_day || '',
            cutoff_time: ob.step4_data.cutoff_time || ''
          });
        }
        
        // Load step 5
        if (ob.step5_data) {
          setStep5({
            izi_api_key: ob.step5_data.izi_api_key || '',
            izi_merchant_id: ob.step5_data.izi_merchant_id || '',
            izi_env: ob.step5_data.izi_env || '',
            yape_plin: ob.step5_data.yape_plin || ''
          });
        }
        
        // Load step 6
        if (ob.step6_data) {
          setStep6({
            popup_content: ob.step6_data.popup_content || '',
            first_discount: ob.step6_data.first_discount || '',
            discount_amount: ob.step6_data.discount_amount || '',
            banner_image: ob.step6_data.banner_image || '',
            banner_image_name: ob.step6_data.banner_image_name || '',
            banner_frequency: ob.step6_data.banner_frequency || ''
          });
        }
        
        // Load step 7
        if (ob.step7_data) {
          setStep7({
            brand_photos: ob.step7_data.brand_photos || [],
            photographer: ob.step7_data.photographer || '',
            notes: ob.step7_data.notes || ''
          });
        }
      }
      setLoading(false);
    };
    fetchToken();
  }, [token]);

  const saveStep = async (nextStep: number) => {
    if (!data) return;
    
    let updates: any = {};
    if (step === 1) {
      updates = { step1_data: step1, business_name: step1.nombre };
      setData({ ...data, business_name: step1.nombre });
    }
    else if (step === 2) updates = { step2_data: step2 };
    else if (step === 3) updates = { step3_data: step3 };
    else if (step === 4) updates = { step4_data: step4 };
    else if (step === 5) updates = { step5_data: step5 };
    else if (step === 6) updates = { step6_data: step6 };
    else if (step === 7) updates = { step7_data: step7 };
    
    await supabase.from('client_onboardings').update(updates).eq('id', data.id);
    setStep(nextStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Upload single file (Logo or Banner) ──
  const handleSingleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file || !data) return;
    
    setUploadingType(type);
    const ext = file.name.split('.').pop();
    const path = `${data.id}/${type}-${Date.now()}.${ext}`;
    
    const { error } = await supabase.storage
      .from('onboarding-photos')
      .upload(path, file, { upsert: true });
      
    if (!error) {
      const { data: urlData } = supabase.storage
        .from('onboarding-photos')
        .getPublicUrl(path);
        
      if (type === 'logo') {
        setStep1(prev => ({
          ...prev,
          logo_url: urlData.publicUrl,
          logo_name: file.name
        }));
      } else {
        setStep6(prev => ({
          ...prev,
          banner_image: urlData.publicUrl,
          banner_image_name: file.name
        }));
      }
      toast({ title: 'Archivo subido', description: `${file.name} se subió correctamente.` });
    } else {
      toast({ title: 'Error al subir', description: 'Inténtalo de nuevo con otra imagen.', variant: 'destructive' });
    }
    setUploadingType(null);
  };

  // ── Upload multiple files (Product photos or Brand photos) ──
  const handleMultipleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'products' | 'brand') => {
    const files = e.target.files;
    if (!files || files.length === 0 || !data) return;
    
    setUploadingType(type);
    const fileArr = Array.from(files);
    const newUploadedList: any[] = [];
    
    for (const file of fileArr) {
      const ext = file.name.split('.').pop();
      const path = `${data.id}/${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
      
      const { error } = await supabase.storage
        .from('onboarding-photos')
        .upload(path, file, { upsert: true });
        
      if (!error) {
        const { data: urlData } = supabase.storage
          .from('onboarding-photos')
          .getPublicUrl(path);
          
        newUploadedList.push({
          name: file.name,
          url: urlData.publicUrl
        });
      }
    }
    
    if (type === 'products') {
      setStep3(prev => ({
        ...prev,
        photos: [...prev.photos, ...newUploadedList]
      }));
    } else {
      setStep7(prev => ({
        ...prev,
        brand_photos: [...prev.brand_photos, ...newUploadedList]
      }));
    }
    
    toast({ title: 'Fotos subidas', description: `Se agregaron ${newUploadedList.length} fotos exitosamente.` });
    setUploadingType(null);
  };

  const removeUploadedFile = (idx: number, type: 'products' | 'brand') => {
    if (type === 'products') {
      setStep3(prev => ({
        ...prev,
        photos: prev.photos.filter((_, i) => i !== idx)
      }));
    } else {
      setStep7(prev => ({
        ...prev,
        brand_photos: prev.brand_photos.filter((_, i) => i !== idx)
      }));
    }
  };

  const submitFinal = async () => {
    if (!data) return;
    setSubmitting(true);
    
    // Save Step 7 first
    const updates = { 
      step7_data: step7,
      status: 'completed', 
      completed_at: new Date().toISOString() 
    };
    
    const { error } = await supabase.from('client_onboardings').update(updates).eq('id', data.id);
    
    setSubmitting(false);
    if (!error) {
      setCompleted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast({ title: '¡Listo!', description: 'Onboarding completado con éxito. Pronto empezaremos a trabajar en tu e-commerce.' });
    } else {
      toast({ title: 'Error', description: 'Hubo un problema al enviar la información. Intenta de nuevo.', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center text-muted-foreground gap-3">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="text-sm font-medium">Cargando tu sesión de onboarding...</p>
      </div>
    );
  }
  
  if (!data) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full bg-[#111827] border border-[#1e293b] p-8 rounded-3xl text-center shadow-xl">
          <HelpCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-foreground mb-2">Enlace inválido o expirado</h1>
          <p className="text-sm text-muted-foreground mb-6">Por favor solicita un nuevo enlace de configuración a tu asesor de Idenza.</p>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          className="max-w-lg w-full bg-[#111827] border border-[#1e293b] p-10 rounded-3xl text-center shadow-2xl space-y-6"
        >
          <div className="bg-emerald-500/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
            <Check size={40} className="text-emerald-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold font-sora text-foreground">¡Información Recibida!</h1>
            <p className="text-sm text-primary font-semibold tracking-wider uppercase">Onboarding Completado — {data.business_name}</p>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
            Hemos registrado todas tus preferencias, logos, fotos y configuraciones operativas de forma exitosa. Nuestro equipo de diseño y desarrollo ha sido notificado y empezará a armar tu e-commerce de inmediato.
          </p>
          <div className="pt-4 border-t border-border/30 flex justify-center gap-4">
            <a href="https://wa.me/51900827299" target="_blank" rel="noopener noreferrer" className="px-5 py-3 bg-[#25d366]/10 text-[#25d366] font-semibold text-xs rounded-xl flex items-center gap-2 border border-[#25d366]/20 hover:bg-[#25d366]/20 transition-all">
              <MessageSquare size={14} /> Escríbenos por WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  const getRubroIcon = () => {
    switch(data.rubro) {
      case 'Regalos':     return <Gift size={20} className="text-primary" />;
      case 'Florería':   return <Store size={20} className="text-primary" />;
      case 'Grabados':    return <Scissors size={20} className="text-primary" />;
      case 'Pastelería':  return <Cake size={20} className="text-primary" />;
      case 'Globos':      return <PartyPopper size={20} className="text-primary" />;
      case 'Chocolates':  return <Heart size={20} className="text-primary" />;
      case 'Serigrafía':  return <Shirt size={20} className="text-primary" />;
      case 'Joyería':    return <Gem size={20} className="text-primary" />;
      case 'Ropa':        return <Shirt size={20} className="text-primary" />;
      case 'Fotografía':  return <Camera size={20} className="text-primary" />;
      case 'Salud':       return <Stethoscope size={20} className="text-primary" />;
      case 'Educación':  return <GraduationCap size={20} className="text-primary" />;
      case 'Restaurante': return <UtensilsCrossed size={20} className="text-primary" />;
      case 'Tecnología':  return <Globe size={20} className="text-primary" />;
      case 'Inmobiliaria':return <Home size={20} className="text-primary" />;
      case 'Belleza':     return <Sparkles size={20} className="text-primary" />;
      case 'Deporte':     return <Dumbbell size={20} className="text-primary" />;
      case 'Eventos':     return <PartyPopper size={20} className="text-primary" />;
      default:            return <Building2 size={20} className="text-primary" />;
    }
  };

  const stepsLabel = [
    'Identidad de Marca',
    'Operaciones y Redes',
    'Catálogo y Productos',
    'Delivery',
    'Pasarela IZI',
    'Popups y Banners',
    'Activos y Notas'
  ];

  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-foreground flex flex-col font-sans">
      
      {/* HEADER */}
      <header className="p-5 flex items-center justify-between border-b border-[#1e293b] bg-[#0d1117]/80 backdrop-blur sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center border border-border/20 shadow-md">
            {getRubroIcon()}
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight text-foreground">{data.business_name}</h1>
            <p className="text-[9px] text-[#6366f1] font-semibold tracking-wider uppercase">Idenza E-Commerce Onboarding</p>
          </div>
        </div>
        
        {/* Step dots */}
        <div className="flex items-center gap-1.5 hidden sm:flex">
          {[1, 2, 3, 4, 5, 6, 7].map(s => (
            <div 
              key={s} 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s === step ? 'w-8 bg-[#6366f1]' : s < step ? 'w-4 bg-emerald-500' : 'w-2 bg-foreground/15'
              }`} 
            />
          ))}
        </div>
        
        <div className="text-xs bg-[#6366f1]/10 px-3 py-1.5 rounded-full text-[#a5b4fc] border border-[#6366f1]/20 font-medium">
          Paso {step} de 7
        </div>
      </header>

      {/* PROGRESS BAR STICKY FOR MOBILE */}
      <div className="w-full bg-[#111827]/40 border-b border-border/5 px-6 py-2 sticky top-[73px] bg-background z-30">
        <div className="max-w-2xl mx-auto flex items-center justify-between text-xs text-muted-foreground">
          <span>Siguiente: {step < 7 ? stepsLabel[step] : 'Finalizar'}</span>
          <span className="font-medium text-foreground">{stepsLabel[step - 1]}</span>
        </div>
        <div className="max-w-2xl mx-auto w-full bg-foreground/10 h-1 rounded-full mt-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] h-full transition-all duration-500" 
            style={{ width: `${(step / 7) * 100}%` }}
          />
        </div>
      </div>

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-12 flex flex-col justify-start">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: IDENTIDAD DE MARCA */}
          {step === 1 && (
            <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-8">
              <div>
                <h2 className="text-3xl font-sora font-extrabold text-foreground mb-2 flex items-center gap-2">
                  <span className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-transparent bg-clip-text">1.</span> Identidad de Marca
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Cuéntanos sobre la esencia y la estética de tu negocio. Esto nos servirá de base para el diseño visual de tu e-commerce.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Nombre del Negocio <span className="text-red-500">*</span></label>
                  <input 
                    value={step1.nombre} 
                    onChange={e => setStep1({...step1, nombre: e.target.value})} 
                    type="text" 
                    className="w-full bg-[#111827] border border-[#1e293b] rounded-xl px-4 py-3.5 text-sm text-foreground focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/15 transition-all" 
                    placeholder="Ej: Bocafest Food Box" 
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Promesa Principal <span className="text-red-500">*</span></label>
                  <p className="text-[11px] text-muted-foreground mb-2">¿Qué le prometes a tus clientes? (Ej: "Regalos que sacan sonrisas inolvidables").</p>
                  <textarea 
                    value={step1.promesa} 
                    onChange={e => setStep1({...step1, promesa: e.target.value})} 
                    rows={3} 
                    className="w-full bg-[#111827] border border-[#1e293b] rounded-xl p-4 text-sm text-foreground focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/15 transition-all" 
                    placeholder="Escribe la promesa principal de tu negocio..." 
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Diferencial <span className="text-red-500">*</span></label>
                  <p className="text-[11px] text-muted-foreground mb-2">¿Por qué te eligen a ti y no a otro competidor?</p>
                  <textarea 
                    value={step1.diferencial} 
                    onChange={e => setStep1({...step1, diferencial: e.target.value})} 
                    rows={3} 
                    className="w-full bg-[#111827] border border-[#1e293b] rounded-xl p-4 text-sm text-foreground focus:outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/15 transition-all" 
                    placeholder="Ej: Diseños florales exclusivos 100% personalizados y delivery express." 
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tono de Marca <span className="text-red-500">*</span></label>
                    <select 
                      value={step1.tono} 
                      onChange={e => setStep1({...step1, tono: e.target.value})}
                      className="w-full bg-[#111827] border border-[#1e293b] rounded-xl px-4 py-3.5 text-sm text-foreground focus:outline-none focus:border-[#6366f1] transition-all"
                    >
                      <option value="">Seleccionar tono...</option>
                      <option value="elegante">Elegante y Sofisticado</option>
                      <option value="cercano">Cercano y Amigable</option>
                      <option value="romantico">Romántico y Emocional</option>
                      <option value="profesional">Profesional y Corporativo</option>
                      <option value="juvenil">Juvenil y Divertido</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Web de Referencia de Diseño</label>
                    <input 
                      value={step1.ref_web} 
                      onChange={e => setStep1({...step1, ref_web: e.target.value})} 
                      type="url" 
                      className="w-full bg-[#111827] border border-[#1e293b] rounded-xl px-4 py-3.5 text-sm text-foreground focus:outline-none focus:border-[#6366f1] transition-all" 
                      placeholder="https://ejemplo.com" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Paleta de Colores</label>
                  <p className="text-[11px] text-muted-foreground mb-2">Pega códigos hexadecimales o referencias visuales (Ej: Negro mate, Blanco puro y Dorado).</p>
                  <input 
                    value={step1.colors} 
                    onChange={e => setStep1({...step1, colors: e.target.value})} 
                    type="text" 
                    className="w-full bg-[#111827] border border-[#1e293b] rounded-xl px-4 py-3.5 text-sm text-foreground focus:outline-none focus:border-[#6366f1] transition-all" 
                    placeholder="Ej: #111827, #FFFFFF, #EAB308" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Logo Principal (PNG Transparente / SVG) <span className="text-red-500">*</span></label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#1e293b] hover:border-[#6366f1] rounded-2xl p-6 cursor-pointer hover:bg-[#6366f1]/5 transition-all text-center">
                    {uploadingType === 'logo' ? (
                      <div className="space-y-2">
                        <Loader2 size={24} className="animate-spin text-primary mx-auto" />
                        <span className="text-xs text-muted-foreground">Subiendo logo a Supabase...</span>
                      </div>
                    ) : step1.logo_url ? (
                      <div className="space-y-3">
                        <div className="w-16 h-16 rounded-xl border border-[#1e293b] p-2 mx-auto bg-black/30 flex items-center justify-center">
                          <img src={step1.logo_url} alt="Logo" className="max-h-full max-w-full object-contain" />
                        </div>
                        <span className="text-xs text-emerald-500 font-semibold block">✓ {step1.logo_name || 'Logo subido con éxito'}</span>
                        <span className="text-[10px] text-muted-foreground hover:underline block">Hacer clic para cambiar</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <UploadCloud size={28} className="text-muted-foreground mx-auto" />
                        <p className="text-xs font-bold text-foreground">Arrastra o selecciona el logo</p>
                        <p className="text-[10px] text-muted-foreground">Formato PNG sin fondo o SVG</p>
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/png,image/svg+xml" 
                      className="hidden" 
                      onChange={e => handleSingleFileUpload(e, 'logo')}
                      disabled={uploadingType !== null}
                    />
                  </label>
                </div>
              </div>

              <button 
                onClick={() => saveStep(2)} 
                disabled={!step1.nombre || !step1.promesa || !step1.diferencial || !step1.tono || !step1.logo_url} 
                className="w-full py-4 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:opacity-95 transition-opacity disabled:opacity-50 shadow-lg shadow-[#6366f1]/20 mt-4"
              >
                Siguiente Paso <ArrowRight size={18} />
              </button>
            </motion.div>
          )}

          {/* STEP 2: OPERACIONES Y REDES */}
          {step === 2 && (
            <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-8">
              <div>
                <h2 className="text-3xl font-sora font-extrabold text-foreground mb-2 flex items-center gap-2">
                  <span className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-transparent bg-clip-text">2.</span> Operaciones y Redes
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Detalles sobre cómo gestionarás los pedidos y los canales de redes sociales de tu negocio.
                </p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">WhatsApp Principal <span className="text-red-500">*</span></label>
                    <input 
                      value={step2.whatsapp} 
                      onChange={e => setStep2({...step2, whatsapp: e.target.value})} 
                      type="tel" 
                      className="w-full bg-[#111827] border border-[#1e293b] rounded-xl px-4 py-3.5 text-sm text-foreground focus:outline-none focus:border-[#6366f1] transition-all" 
                      placeholder="Ej: +51 987 654 321" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Correo de Pedidos <span className="text-red-500">*</span></label>
                    <input 
                      value={step2.email_orders} 
                      onChange={e => setStep2({...step2, email_orders: e.target.value})} 
                      type="email" 
                      className="w-full bg-[#111827] border border-[#1e293b] rounded-xl px-4 py-3.5 text-sm text-foreground focus:outline-none focus:border-[#6366f1] transition-all" 
                      placeholder="pedidos@tunegocio.com" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Horarios de Atención</label>
                  <input 
                    value={step2.hours} 
                    onChange={e => setStep2({...step2, hours: e.target.value})} 
                    type="text" 
                    className="w-full bg-[#111827] border border-[#1e293b] rounded-xl px-4 py-3.5 text-sm text-foreground focus:outline-none focus:border-[#6366f1] transition-all" 
                    placeholder="Ej: Lunes a Sábado de 9:00 am - 7:00 pm" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Días de Atención</label>
                  <div className="flex flex-wrap gap-2">
                    {diasSemana.map(dia => {
                      const selected = step2.dias.includes(dia);
                      return (
                        <button
                          key={dia}
                          onClick={() => {
                            setStep2(prev => ({
                              ...prev,
                              dias: selected ? prev.dias.filter(d => d !== dia) : [...prev.dias, dia]
                            }));
                          }}
                          className={`px-4 py-2 text-xs rounded-lg border font-medium transition-all ${
                            selected 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                              : 'bg-[#111827] border-[#1e293b] text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {dia.substring(0, 3)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">¿Quién manejará el panel?</label>
                    <div className="flex gap-2">
                      {['Sola', 'Con equipo'].map(opt => (
                        <button
                          key={opt}
                          onClick={() => setStep2({...step2, panel_user: opt})}
                          className={`flex-1 py-3 text-xs rounded-lg border font-medium transition-all ${
                            step2.panel_user === opt 
                              ? 'bg-[#6366f1]/10 text-[#a5b4fc] border-[#6366f1]/30' 
                              : 'bg-[#111827] border-[#1e293b] text-muted-foreground'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">¿Notificaciones por WhatsApp?</label>
                    <div className="flex gap-2">
                      {['Sí', 'No'].map(opt => (
                        <button
                          key={opt}
                          onClick={() => setStep2({...step2, wa_notif: opt})}
                          className={`flex-1 py-3 text-xs rounded-lg border font-medium transition-all ${
                            step2.wa_notif === opt 
                              ? 'bg-[#6366f1]/10 text-[#a5b4fc] border-[#6366f1]/30' 
                              : 'bg-[#111827] border-[#1e293b] text-muted-foreground'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#1e293b]/50 pt-6">
                  <h3 className="text-sm font-semibold text-foreground mb-4">Redes Sociales</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5"><Instagram size={14} className="text-[#e1306c]" /> Instagram</label>
                      <input 
                        value={step2.instagram} 
                        onChange={e => setStep2({...step2, instagram: e.target.value})} 
                        type="text" 
                        className="w-full bg-[#111827] border border-[#1e293b] rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-[#6366f1] transition-all" 
                        placeholder="@tu.marca" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5"><Facebook size={14} className="text-[#1877f2]" /> Facebook</label>
                      <input 
                        value={step2.facebook} 
                        onChange={e => setStep2({...step2, facebook: e.target.value})} 
                        type="text" 
                        className="w-full bg-[#111827] border border-[#1e293b] rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-[#6366f1] transition-all" 
                        placeholder="facebook.com/tu.marca" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5"><HelpCircle size={14} className="text-[#010101] border border-muted-foreground/30 rounded-full" /> TikTok (si tiene)</label>
                      <input 
                        value={step2.tiktok} 
                        onChange={e => setStep2({...step2, tiktok: e.target.value})} 
                        type="text" 
                        className="w-full bg-[#111827] border border-[#1e293b] rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-[#6366f1] transition-all" 
                        placeholder="@tu.marca" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button 
                  onClick={() => setStep(1)} 
                  className="px-6 py-4 bg-[#111827] border border-[#1e293b] text-muted-foreground font-semibold rounded-2xl hover:text-foreground hover:bg-[#1f2937] transition-all flex items-center gap-2"
                >
                  <ArrowLeft size={16} /> Atrás
                </button>
                <button 
                  onClick={() => saveStep(3)} 
                  disabled={!step2.whatsapp || !step2.email_orders} 
                  className="flex-1 py-4 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:opacity-95 transition-opacity disabled:opacity-50 shadow-lg shadow-[#6366f1]/20"
                >
                  Siguiente Paso <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: PRODUCTOS Y CATÁLOGO */}
          {step === 3 && (
            <motion.div key="step3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-8">
              <div>
                <h2 className="text-3xl font-sora font-extrabold text-foreground mb-2 flex items-center gap-2">
                  <span className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-transparent bg-clip-text">3.</span> Catálogo y Productos
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Comparte detalles sobre los productos que se ofrecerán en la tienda online y sus formatos.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Categorías principales <span className="text-red-500">*</span></label>
                  <p className="text-[11px] text-muted-foreground mb-2">Ej: Arreglos Florales, Ramos Rosas, Cajas de Regalo, Globos con Helio.</p>
                  <textarea 
                    value={step3.categories} 
                    onChange={e => setStep3({...step3, categories: e.target.value})} 
                    rows={3} 
                    className="w-full bg-[#111827] border border-[#1e293b] rounded-xl p-4 text-sm text-foreground focus:outline-none focus:border-[#6366f1] transition-all" 
                    placeholder="Ramos, Cajas sorpresa, Globos..." 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Número Aprox. de Productos</label>
                    <input 
                      value={step3.product_count} 
                      onChange={e => setStep3({...step3, product_count: e.target.value})} 
                      type="number" 
                      className="w-full bg-[#111827] border border-[#1e293b] rounded-xl px-4 py-3.5 text-sm text-foreground focus:outline-none focus:border-[#6366f1] transition-all" 
                      placeholder="Ej: 30" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">¿Los productos tienen variantes?</label>
                    <div className="flex gap-2">
                      {['Sí', 'No'].map(opt => (
                        <button
                          key={opt}
                          onClick={() => setStep3({...step3, variants: opt})}
                          className={`flex-1 py-3 text-xs rounded-lg border font-medium transition-all ${
                            step3.variants === opt 
                              ? 'bg-[#6366f1]/10 text-[#a5b4fc] border-[#6366f1]/30' 
                              : 'bg-[#111827] border-[#1e293b] text-muted-foreground'
                          }`}
                        >
                          {opt === 'Sí' ? 'Sí (Color, Tamaño...)' : 'No'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Subir fotos de Productos</label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#1e293b] hover:border-[#6366f1] rounded-2xl p-6 cursor-pointer hover:bg-[#6366f1]/5 transition-all text-center">
                    {uploadingType === 'products' ? (
                      <div className="space-y-2">
                        <Loader2 size={24} className="animate-spin text-primary mx-auto" />
                        <span className="text-xs text-muted-foreground">Subiendo fotos de catálogo...</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <ImagePlus size={28} className="text-muted-foreground mx-auto" />
                        <p className="text-xs font-bold text-foreground">Seleccionar fotos de productos</p>
                        <p className="text-[10px] text-muted-foreground">JPG, PNG o WEBP (puedes elegir varias)</p>
                      </div>
                    )}
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      className="hidden" 
                      onChange={e => handleMultipleFileUpload(e, 'products')}
                      disabled={uploadingType !== null}
                    />
                  </label>
                  
                  {/* Gallery preview */}
                  {step3.photos.length > 0 && (
                    <div className="mt-4 grid grid-cols-4 gap-2">
                      {step3.photos.map((p, idx) => (
                        <div key={idx} className="relative aspect-square border border-[#1e293b] rounded-lg overflow-hidden bg-black/40">
                          <img src={p.url} className="w-full h-full object-cover" />
                          <button 
                            onClick={() => removeUploadedFile(idx, 'products')}
                            className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">O pega un link de Google Drive</label>
                  <input 
                    value={step3.drive_link} 
                    onChange={e => setStep3({...step3, drive_link: e.target.value})} 
                    type="url" 
                    className="w-full bg-[#111827] border border-[#1e293b] rounded-xl px-4 py-3.5 text-sm text-foreground focus:outline-none focus:border-[#6366f1] transition-all" 
                    placeholder="https://drive.google.com/..." 
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button 
                  onClick={() => setStep(2)} 
                  className="px-6 py-4 bg-[#111827] border border-[#1e293b] text-muted-foreground font-semibold rounded-2xl hover:text-foreground hover:bg-[#1f2937] transition-all flex items-center gap-2"
                >
                  <ArrowLeft size={16} /> Atrás
                </button>
                <button 
                  onClick={() => saveStep(4)} 
                  disabled={!step3.categories} 
                  className="flex-1 py-4 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:opacity-95 transition-opacity disabled:opacity-50 shadow-lg shadow-[#6366f1]/20"
                >
                  Siguiente Paso <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: DELIVERY */}
          {step === 4 && (
            <motion.div key="step4" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-8">
              <div>
                <h2 className="text-3xl font-sora font-extrabold text-foreground mb-2 flex items-center gap-2">
                  <span className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-transparent bg-clip-text">4.</span> Delivery y Logística
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Definamos las zonas que cubres y los horarios de corte de envío de tu negocio.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Distritos o Zonas que cubre <span className="text-red-500">*</span></label>
                  <p className="text-[11px] text-muted-foreground mb-2">Escribe los distritos principales de entrega. En el panel administrativo de Idenza podrás asignar tarifas de envío específicas para cada uno.</p>
                  <textarea 
                    value={step4.delivery_zones} 
                    onChange={e => setStep4({...step4, delivery_zones: e.target.value})} 
                    rows={3} 
                    className="w-full bg-[#111827] border border-[#1e293b] rounded-xl p-4 text-sm text-foreground focus:outline-none focus:border-[#6366f1] transition-all" 
                    placeholder="Ej: Miraflores, San Isidro, Surco, Barranco..." 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">¿Tiene horario límite para pedidos del mismo día?</label>
                  <div className="flex gap-2 mb-3">
                    {['Sí', 'No'].map(opt => (
                      <button
                        key={opt}
                        onClick={() => setStep4({...step4, same_day: opt, cutoff_time: opt === 'No' ? '' : step4.cutoff_time})}
                        className={`flex-1 py-3 text-xs rounded-lg border font-medium transition-all ${
                          step4.same_day === opt 
                            ? 'bg-[#6366f1]/10 text-[#a5b4fc] border-[#6366f1]/30' 
                            : 'bg-[#111827] border-[#1e293b] text-muted-foreground'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  
                  {step4.same_day === 'Sí' && (
                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111827] border border-[#1e293b] p-4 rounded-xl space-y-2">
                      <label className="block text-[11px] font-semibold text-muted-foreground uppercase">Hora Límite de Corte</label>
                      <input 
                        value={step4.cutoff_time} 
                        onChange={e => setStep4({...step4, cutoff_time: e.target.value})} 
                        type="time" 
                        className="bg-black/30 border border-[#1e293b] rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-[#6366f1] w-full max-w-[200px]" 
                      />
                      <span className="text-[10px] text-muted-foreground block mt-1">Los pedidos que ingresen después de esta hora se reprogramarán automáticamente para el día siguiente.</span>
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button 
                  onClick={() => setStep(3)} 
                  className="px-6 py-4 bg-[#111827] border border-[#1e293b] text-muted-foreground font-semibold rounded-2xl hover:text-foreground hover:bg-[#1f2937] transition-all flex items-center gap-2"
                >
                  <ArrowLeft size={16} /> Atrás
                </button>
                <button 
                  onClick={() => saveStep(5)} 
                  disabled={!step4.delivery_zones} 
                  className="flex-1 py-4 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:opacity-95 transition-opacity disabled:opacity-50 shadow-lg shadow-[#6366f1]/20"
                >
                  Siguiente Paso <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: PASARELA IZI */}
          {step === 5 && (
            <motion.div key="step5" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-8">
              <div>
                <h2 className="text-3xl font-sora font-extrabold text-foreground mb-2 flex items-center gap-2">
                  <span className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-transparent bg-clip-text">5.</span> Pasarela IZI
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Configura tus llaves de cobro en línea. Izipay permite cobros con tarjetas de crédito/débito directamente en tu tienda.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">API Key (Llave de API)</label>
                  <input 
                    value={step5.izi_api_key} 
                    onChange={e => setStep5({...step5, izi_api_key: e.target.value})} 
                    type="password" 
                    className="w-full bg-[#111827] border border-[#1e293b] rounded-xl px-4 py-3.5 text-sm text-foreground focus:outline-none focus:border-[#6366f1] transition-all" 
                    placeholder="••••••••••••••••••••••••••••" 
                  />
                  <span className="text-[10px] text-muted-foreground mt-1 block">Tu API Key se encriptará de forma segura en nuestros servidores de base de datos de producción.</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Merchant ID (ID de Comercio)</label>
                  <input 
                    value={step5.izi_merchant_id} 
                    onChange={e => setStep5({...step5, izi_merchant_id: e.target.value})} 
                    type="text" 
                    className="w-full bg-[#111827] border border-[#1e293b] rounded-xl px-4 py-3.5 text-sm text-foreground focus:outline-none focus:border-[#6366f1] transition-all" 
                    placeholder="Ej: merchant_xxxxxxxx" 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Ambiente</label>
                    <div className="flex gap-2">
                      {['produccion', 'sandbox'].map(opt => (
                        <button
                          key={opt}
                          onClick={() => setStep5({...step5, izi_env: opt})}
                          className={`flex-1 py-3 text-xs rounded-lg border font-medium transition-all ${
                            step5.izi_env === opt 
                              ? 'bg-[#6366f1]/10 text-[#a5b4fc] border-[#6366f1]/30' 
                              : 'bg-[#111827] border-[#1e293b] text-muted-foreground'
                          }`}
                        >
                          {opt === 'produccion' ? 'Producción' : 'Sandbox (Pruebas)'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">¿Acepta Yape / Plin?</label>
                    <div className="flex gap-2">
                      {['Sí', 'No'].map(opt => (
                        <button
                          key={opt}
                          onClick={() => setStep5({...step5, yape_plin: opt})}
                          className={`flex-1 py-3 text-xs rounded-lg border font-medium transition-all ${
                            step5.yape_plin === opt 
                              ? 'bg-[#6366f1]/10 text-[#a5b4fc] border-[#6366f1]/30' 
                              : 'bg-[#111827] border-[#1e293b] text-muted-foreground'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button 
                  onClick={() => setStep(4)} 
                  className="px-6 py-4 bg-[#111827] border border-[#1e293b] text-muted-foreground font-semibold rounded-2xl hover:text-foreground hover:bg-[#1f2937] transition-all flex items-center gap-2"
                >
                  <ArrowLeft size={16} /> Atrás
                </button>
                <button 
                  onClick={() => saveStep(6)} 
                  className="flex-1 py-4 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:opacity-95 transition-opacity shadow-lg shadow-[#6366f1]/20"
                >
                  Siguiente Paso <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 6: POPUPS Y BANNERS */}
          {step === 6 && (
            <motion.div key="step6" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-8">
              <div>
                <h2 className="text-3xl font-sora font-extrabold text-foreground mb-2 flex items-center gap-2">
                  <span className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-transparent bg-clip-text">6.</span> Popups y Banners
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Define el contenido publicitario inicial y banners del portal de comercio electrónico.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">¿Qué quieres en el Popup de Bienvenida?</label>
                  <p className="text-[11px] text-muted-foreground mb-2">El popup que se abre al entrar por primera vez al portal (Ej: 10% de descuento registrándote).</p>
                  <textarea 
                    value={step6.popup_content} 
                    onChange={e => setStep6({...step6, popup_content: e.target.value})} 
                    rows={3} 
                    className="w-full bg-[#111827] border border-[#1e293b] rounded-xl p-4 text-sm text-foreground focus:outline-none focus:border-[#6366f1] transition-all" 
                    placeholder="Regístrate y recibe un regalo..." 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">¿Descuento en primera compra?</label>
                    <div className="flex gap-2">
                      {['Sí', 'No'].map(opt => (
                        <button
                          key={opt}
                          onClick={() => setStep6({...step6, first_discount: opt, discount_amount: opt === 'No' ? '' : step6.discount_amount})}
                          className={`flex-1 py-3 text-xs rounded-lg border font-medium transition-all ${
                            step6.first_discount === opt 
                              ? 'bg-[#6366f1]/10 text-[#a5b4fc] border-[#6366f1]/30' 
                              : 'bg-[#111827] border-[#1e293b] text-muted-foreground'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">¿Cuánto descuento?</label>
                    <input 
                      value={step6.discount_amount} 
                      onChange={e => setStep6({...step6, discount_amount: e.target.value})} 
                      type="text" 
                      disabled={step6.first_discount !== 'Sí'}
                      className="w-full bg-[#111827] border border-[#1e293b] rounded-xl px-4 py-3.5 text-sm text-foreground focus:outline-none focus:border-[#6366f1] transition-all disabled:opacity-50" 
                      placeholder="Ej: 10% o S/.15 de descuento" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Imagen del Banner Principal</label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#1e293b] hover:border-[#6366f1] rounded-2xl p-6 cursor-pointer hover:bg-[#6366f1]/5 transition-all text-center">
                    {uploadingType === 'banner' ? (
                      <div className="space-y-2">
                        <Loader2 size={24} className="animate-spin text-primary mx-auto" />
                        <span className="text-xs text-muted-foreground">Subiendo imagen de banner...</span>
                      </div>
                    ) : step6.banner_image ? (
                      <div className="space-y-3">
                        <div className="w-full max-w-[200px] h-20 rounded-xl border border-[#1e293b] overflow-hidden mx-auto bg-black/30">
                          <img src={step6.banner_image} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs text-emerald-500 font-semibold block">✓ Banner subido correctamente</span>
                        <span className="text-[10px] text-muted-foreground hover:underline block">Cambiar banner</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <UploadCloud size={28} className="text-muted-foreground mx-auto" />
                        <p className="text-xs font-bold text-foreground">Seleccionar imagen del banner</p>
                        <p className="text-[10px] text-muted-foreground">Resolución sugerida: 1920x600px</p>
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={e => handleSingleFileUpload(e, 'banner')}
                      disabled={uploadingType !== null}
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">¿Cada cuánto quieres cambiar el banner?</label>
                  <select 
                    value={step6.banner_frequency} 
                    onChange={e => setStep6({...step6, banner_frequency: e.target.value})}
                    className="w-full bg-[#111827] border border-[#1e293b] rounded-xl px-4 py-3.5 text-sm text-foreground focus:outline-none focus:border-[#6366f1] transition-all"
                  >
                    <option value="">Seleccionar frecuencia...</option>
                    <option value="semanal">Semanalmente</option>
                    <option value="quincenal">Quincenalmente</option>
                    <option value="mensual">Mensualmente</option>
                    <option value="campanas">Por Temporadas y Campañas</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button 
                  onClick={() => setStep(5)} 
                  className="px-6 py-4 bg-[#111827] border border-[#1e293b] text-muted-foreground font-semibold rounded-2xl hover:text-foreground hover:bg-[#1f2937] transition-all flex items-center gap-2"
                >
                  <ArrowLeft size={16} /> Atrás
                </button>
                <button 
                  onClick={() => saveStep(7)} 
                  className="flex-1 py-4 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:opacity-95 transition-opacity shadow-lg shadow-[#6366f1]/20"
                >
                  Siguiente Paso <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 7: ACTIVOS Y NOTAS */}
          {step === 7 && (
            <motion.div key="step7" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-8">
              <div>
                <h2 className="text-3xl font-sora font-extrabold text-foreground mb-2 flex items-center gap-2">
                  <span className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-transparent bg-clip-text">7.</span> Activos y Notas
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Finalicemos recopilando fotos del negocio y notas aclaratorias para el lanzamiento.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Fotos del negocio para el diseño</label>
                  <p className="text-[11px] text-muted-foreground mb-2">Fotos del taller, local, interiores o imágenes corporativas que podamos usar en las secciones.</p>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#1e293b] hover:border-[#6366f1] rounded-2xl p-6 cursor-pointer hover:bg-[#6366f1]/5 transition-all text-center">
                    {uploadingType === 'brand' ? (
                      <div className="space-y-2">
                        <Loader2 size={24} className="animate-spin text-primary mx-auto" />
                        <span className="text-xs text-muted-foreground">Subiendo fotos...</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <ImagePlus size={28} className="text-muted-foreground mx-auto" />
                        <p className="text-xs font-bold text-foreground">Seleccionar fotos decorativas</p>
                        <p className="text-[10px] text-muted-foreground">Puedes seleccionar varios archivos</p>
                      </div>
                    )}
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      className="hidden" 
                      onChange={e => handleMultipleFileUpload(e, 'brand')}
                      disabled={uploadingType !== null}
                    />
                  </label>
                  
                  {/* Gallery preview */}
                  {step7.brand_photos.length > 0 && (
                    <div className="mt-4 grid grid-cols-4 gap-2">
                      {step7.brand_photos.map((p, idx) => (
                        <div key={idx} className="relative aspect-square border border-[#1e293b] rounded-lg overflow-hidden bg-black/40">
                          <img src={p.url} className="w-full h-full object-cover" />
                          <button 
                            onClick={() => removeUploadedFile(idx, 'brand')}
                            className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">¿Tienes fotógrafo o necesitas referencias?</label>
                  <div className="flex flex-col gap-2">
                    {[
                      { id: 'tengo', label: 'Tengo fotógrafo propio' },
                      { id: 'necesito', label: 'Necesito que Idenza me provea referencias' },
                      { id: 'propias', label: 'Uso mis propias fotos del celular' }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setStep7({...step7, photographer: opt.label})}
                        className={`w-full text-left px-4 py-3.5 text-xs rounded-xl border font-medium transition-all ${
                          step7.photographer === opt.label 
                            ? 'bg-[#6366f1]/10 text-[#a5b4fc] border-[#6366f1]/30' 
                            : 'bg-[#111827] border-[#1e293b] text-muted-foreground'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Notas Adicionales</label>
                  <textarea 
                    value={step7.notes} 
                    onChange={e => setStep7({...step7, notes: e.target.value})} 
                    rows={4} 
                    className="w-full bg-[#111827] border border-[#1e293b] rounded-xl p-4 text-sm text-foreground focus:outline-none focus:border-[#6366f1] transition-all" 
                    placeholder="Escribe comentarios, observaciones o especificaciones sobre cómo quieres que se construya tu sitio web..." 
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button 
                  onClick={() => setStep(6)} 
                  className="px-6 py-4 bg-[#111827] border border-[#1e293b] text-muted-foreground font-semibold rounded-2xl hover:text-foreground hover:bg-[#1f2937] transition-all flex items-center gap-2"
                >
                  <ArrowLeft size={16} /> Atrás
                </button>
                <button 
                  onClick={submitFinal} 
                  disabled={submitting || uploadingType !== null} 
                  className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:opacity-95 transition-opacity disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Enviando Formulario...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Finalizar y Enviar Onboarding
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
