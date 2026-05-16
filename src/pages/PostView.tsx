import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Helmet } from 'react-helmet-async';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navbar from '@/components/idenza/Navbar';
import Footer from '@/components/idenza/Footer';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';

interface Post {
  title: string; content: string; cover_image_url: string; 
  seo_keywords: string; author_name: string; created_at: string;
  ad_image_url?: string; ad_target_url?: string;
}

const parseMarkdown = (text: string) => {
  return text
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
};

export default function PostView() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('content_posts').select('*').eq('slug', slug).single();
        if (error) console.error("Error cargando post:", error);
        if (data) setPost(data);
      } catch (err) {
        console.error("Excepción fatal en fetchPost:", err);
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) {
      fetchPost();
    } else {
      setLoading(false);
    }
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-16 h-16 border-t-2 border-primary rounded-full animate-spin"></div>
    </div>
  );

  if (!post) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-foreground text-xl">
      Artículo no encontrado
      <Link to="/comunidad" className="mt-4 text-primary text-sm font-bold flex items-center gap-2"><ArrowLeft size={16}/> Volver</Link>
    </div>
  );

  const CustomAds = [
    // Dynamic Ad from DB
    ...(post.ad_image_url ? [(
      <a href={post.ad_target_url || '#'} key="dynamic-ad" target="_blank" rel="noopener noreferrer" className="block my-14 w-full group">
        <div className="relative w-full h-[200px] md:h-[300px] rounded-[2.5rem] overflow-hidden border border-border group-hover:border-primary/40 transition-all duration-500 shadow-2xl">
          <img src={post.ad_image_url} alt="Anuncio Personalizado" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8">
            <div className="bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wider">Patrocinado</div>
          </div>
        </div>
      </a>
    )] : []),
    // Ad 1: SaaS Gyms
    (
      <div key="saas-gyms" className="my-14 w-full p-8 md:p-12 bg-card border border-primary/20 rounded-[2.5rem] relative overflow-hidden group flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-primary/20 transition-colors duration-700" />
        <div className="relative z-10 flex-1 text-center md:text-left">
          <span className="text-primary font-mono text-[10px] md:text-xs uppercase tracking-widest mb-3 block font-bold">SOFTWARE COMO SERVICIO</span>
          <h4 className="text-foreground text-2xl md:text-3xl font-sora font-bold mb-3">Sistema SaaS para Gyms</h4>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto md:mx-0">Optimiza la gestión total de tu gimnasio con nuestra plataforma B2B. Suscripciones recurrentes, control de accesos automatizado y reportes en tiempo real para tu negocio.</p>
        </div>
        <Link to="/proyectos" className="relative z-10 whitespace-nowrap bg-primary text-primary-foreground font-bold px-8 py-4 rounded-xl hover:scale-105 active:scale-95 transition-transform">
          Ver Demostración
        </Link>
      </div>
    ),
    // Ad 2: Idenza Services
    (
      <div key="idenza-studio" className="my-14 w-full p-8 md:p-12 bg-card border border-border rounded-[2.5rem] relative overflow-hidden group flex flex-col md:flex-row items-center justify-between gap-8 hover:border-primary/30 transition-colors shadow-sm">
        <div className="absolute top-0 left-0 w-80 h-80 bg-primary/5 blur-[100px] rounded-full -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        
        <div className="relative z-10 flex-1 text-center md:text-left">
          <span className="text-muted-foreground font-mono text-[10px] md:text-xs uppercase tracking-widest mb-3 block font-bold border border-border w-fit md:mx-0 mx-auto px-3 py-1 rounded-md">IDENZA STUDIO</span>
          <h4 className="text-foreground text-2xl md:text-3xl font-sora font-bold mb-3">Escala tu Empresa a nivel global</h4>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto md:mx-0">Transformamos tu modelo de negocio físico con ingeniería de software ultra-optimizada, branding institucional de alto impacto y automatizaciones IA.</p>
        </div>
        <Link to="/crece" className="relative z-10 whitespace-nowrap bg-secondary border border-border text-secondary-foreground font-bold px-8 py-4 rounded-xl hover:opacity-90 transition-all">
          Agendar Consulta
        </Link>
      </div>
    )
  ];

  const paragraphs = post.content.split('\n\n').filter(p => p.trim());
  const contentWithAds = paragraphs.map((par, i) => {
    return (
      <div key={i}>
        <div className="text-foreground/80 leading-[1.7] md:leading-[1.8] text-base md:text-lg lg:text-[1.15rem] font-light tracking-wide mb-6 md:mb-8" dangerouslySetInnerHTML={{ __html: parseMarkdown(par) }} />
        {(i > 0 && i % 4 === 0) && (
          CustomAds[Math.floor(i / 4) % CustomAds.length]
        )}
      </div>
    );
  });

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 selection:text-foreground">
      <Helmet>
        <title>{post.title} | IDENZA</title>
        <meta name="description" content={post.content.slice(0, 160).replace(/<[^>]+>/g, '') + '...'} />
        {post.seo_keywords && <meta name="keywords" content={post.seo_keywords} />}
        {post.cover_image_url && <meta property="og:image" content={post.cover_image_url} />}
      </Helmet>

      <Navbar />

      <main className="relative z-10">
        
        {/* PARALLAX HERO SECTION */}
        <div className="relative w-full h-[50vh] md:h-[65vh] flex items-end justify-center overflow-hidden">
          {post.cover_image_url && (
            <motion.div style={{ y: y1 }} className="absolute inset-0 w-full h-[120%] -top-[10%] z-0">
              <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover opacity-40 dark:opacity-60" />
            </motion.div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
          
          <div className="relative z-20 w-full max-w-4xl mx-auto px-4 md:px-6 pb-8 md:pb-16 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
              <div className="flex items-center justify-center gap-4 md:gap-6 text-muted-foreground font-mono text-[10px] md:text-xs uppercase tracking-widest mb-4 md:mb-6">
                <span className="flex items-center gap-2"><User size={14} className="text-primary" /> {post.author_name || 'Idenza Team'}</span>
                <span className="flex items-center gap-2"><Calendar size={14} className="text-primary" /> {new Date(post.created_at).toLocaleDateString()}</span>
              </div>
              <h1 className="text-3xl md:text-6xl lg:text-7xl font-bold text-foreground font-sora leading-[1.2] md:leading-[1.1] mb-4 md:mb-8 px-2">{post.title}</h1>
            </motion.div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="max-w-4xl mx-auto px-4 md:px-6 pb-20 md:pb-32 pt-6 md:pt-8">
          
          <div className="flex justify-between items-center border-b border-border pb-6 mb-10">
            <Link to="/comunidad" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all text-xs font-bold uppercase tracking-widest">
              <ArrowLeft size={16} /> Comunidad
            </Link>
            <button 
              onClick={() => {
                const url = window.location.href;
                const title = post.title;
                if (navigator.share) {
                  navigator.share({ title, url }).catch(console.error);
                } else {
                  navigator.clipboard.writeText(url);
                  import('sonner').then(({ toast }) => toast.success('URL copiada al portapapeles'));
                }
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-muted-foreground hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest active:scale-95"
            >
              <Share2 size={16} /> Compartir
            </button>
          </div>

          <motion.article initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }} className="prose dark:prose-invert max-w-none">
            {contentWithAds}
          </motion.article>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}
