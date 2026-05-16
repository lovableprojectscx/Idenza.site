import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Navbar from '@/components/idenza/Navbar';
import Footer from '@/components/idenza/Footer';
import { MessageSquare, ArrowRight, Zap, Sparkles } from 'lucide-react';

interface Post { id: string; title: string; slug: string; post_type: string; cover_image_url: string; created_at: string; }
interface Topic { id: string; title: string; author_name: string; created_at: string; }

export default function Comunidad() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [ps, ts] = await Promise.all([
        supabase.from('content_posts').select('id,title,slug,post_type,cover_image_url,created_at').eq('is_published', true).order('created_at', { ascending: false }).limit(7),
        supabase.from('forum_topics').select('id,title,author_name,created_at').order('created_at', { ascending: false }).limit(3)
      ]);
      if(ps.data) setPosts(ps.data);
      if(ts.data) setTopics(ts.data);
      setLoading(false);
    };
    load();
  }, []);

  const heroPost = posts.find(p => p.post_type === 'informe');
  const restPosts = posts.filter(p => p.id !== heroPost?.id);

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-16 h-16 border-t-2 border-primary rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground pb-0">
      <Helmet>
        <title>Comunidad y Recursos | IDENZA</title>
      </Helmet>
      <Navbar />

      <main className="pt-32 max-w-7xl mx-auto px-6 relative z-10 pb-24">
        
        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-16 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/[0.07] border border-foreground/20 text-foreground text-xs font-bold font-mono uppercase tracking-widest mb-6">
            <Sparkles size={14} className="text-primary" /> Hub Oficial Idenza
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 font-sora tracking-tight leading-tight">
            Bienvenido a la <span className="text-primary italic">Comunidad.</span>
          </h1>
          <p className="text-muted-foreground text-lg font-light">Explora informes exclusivos, tendencias digitales y súmate al debate profesional.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* MAIN HERO CARD (Bento Left) */}
          {heroPost && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="lg:col-span-8 group">
              <Link to={`/comunidad/${heroPost.slug}`} className="block relative h-[320px] sm:h-[400px] md:h-[500px] w-full rounded-[2rem] overflow-hidden border border-border hover:border-primary/50 transition-all duration-500 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
                <img src={heroPost.cover_image_url} alt={heroPost.title} loading="eager" decoding="async" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                
                <div className="absolute inset-0 z-20 p-8 md:p-12 flex flex-col justify-end">
                  <div className="flex items-center gap-3 mb-3 md:mb-4">
                    <span className="px-3 py-1 bg-primary text-primary-foreground font-bold text-[10px] md:text-xs uppercase tracking-widest rounded-lg">Destacado</span>
                    <span className="text-white/70 font-mono text-[10px] md:text-xs">{new Date(heroPost.created_at).toLocaleDateString()}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white leading-tight font-sora mt-1 md:mt-2">{heroPost.title}</h2>
                  <div className="mt-4 md:mt-6 flex items-center gap-2 text-primary font-bold text-sm md:text-base group-hover:translate-x-2 transition-transform">
                    Leer artículo <ArrowRight size={16} className="md:w-[18px] md:h-[18px]" />
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* SIDEBAR FORUMS (Bento Right) */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-card border border-border rounded-[2rem] p-8 h-full relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              
              <div className="flex items-center gap-3 text-foreground mb-8">
                <MessageSquare className="text-primary" size={24} />
                <h3 className="text-2xl font-bold font-sora">Foro Activo</h3>
              </div>
              
              <div className="space-y-4">
                {topics.length === 0 ? <p className="text-muted-foreground">Sin debates recientes.</p> : topics.map(t => (
                  <Link to={`/comunidad/foro/${t.id}`} key={t.id} className="block group/item">
                    <div className="bg-foreground/[0.04] border border-border group-hover/item:border-primary/40 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1">
                      <h4 className="font-bold text-foreground leading-tight mb-3 text-sm">{t.title}</h4>
                      <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                        <span>@{t.author_name || 'Anónimo'}</span>
                        <ArrowRight size={12} className="group-hover/item:text-primary transition-colors" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* SECONDARY GRID (Anuncios e informes menores) */}
          {restPosts.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + (i * 0.1) }} className="lg:col-span-4 col-span-1 md:col-span-6 group">
              <Link to={`/comunidad/${p.slug}`} className="block relative h-80 rounded-[2rem] overflow-hidden border border-border hover:border-primary/30 transition-all shadow-lg hover:shadow-2xl hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                {p.cover_image_url ? (
                  <img src={p.cover_image_url} alt={p.title} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="absolute inset-0 bg-foreground/5 flex items-center justify-center"><Zap size={40} className="text-primary/30" /></div>
                )}
                
                <div className="absolute inset-0 z-20 p-6 flex flex-col justify-between">
                  <div className="self-end">
                    <span className="px-3 py-1 bg-foreground/20 backdrop-blur-md border border-foreground/10 text-white font-mono text-[10px] uppercase tracking-widest rounded-lg">
                      {p.post_type}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 leading-tight font-sora">{p.title}</h3>
                    <div className="text-primary font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      Leer <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
          
        </div>
      </main>
      <Footer />
    </div>
  );
}
