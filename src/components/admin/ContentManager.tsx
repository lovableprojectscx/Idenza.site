import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, EyeOff, FileText, Image, Search, Loader2 } from 'lucide-react';
import { supabase, supabaseAdmin } from '@/lib/supabase';

interface Post {
  id: string; title: string; slug: string; content: string;
  post_type: 'informe' | 'anuncio'; cover_image_url: string;
  seo_keywords: string; is_published: boolean; author_name: string;
  ad_image_url?: string; ad_target_url?: string;
  created_at: string;
}

const inputCls = 'w-full h-11 bg-muted/30 border border-border hover:border-border/80 focus:border-primary/40 rounded-xl px-4 text-sm text-foreground placeholder:text-muted-foreground/30 outline-none transition-all duration-200';
const labelCls = 'text-[11px] font-mono text-muted-foreground/60 uppercase tracking-[0.15em] block mb-1.5';

function slugify(t: string) {
  return t.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export function ContentManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Post> | null>(null);
  const [saving, setSaving] = useState(false);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('content_posts').select('*').order('created_at', { ascending: false });
    if (!error) setPosts(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    const postData = {
      title: editing.title, slug: editing.slug, content: editing.content,
      post_type: editing.post_type || 'informe', cover_image_url: editing.cover_image_url,
      seo_keywords: editing.seo_keywords, is_published: editing.is_published || false,
      author_name: editing.author_name,
      ad_image_url: editing.ad_image_url,
      ad_target_url: editing.ad_target_url,
    };

    let error;
    if (editing.id) {
      const res = await supabase.from('content_posts').update(postData).eq('id', editing.id);
      error = res.error;
    } else {
      const res = await supabase.from('content_posts').insert([postData]);
      error = res.error;
    }

    setSaving(false);
    if (!error) {
      setEditing(null);
      loadPosts();
    } else {
      alert('Error: ' + error.message);
    }
  };

  const setEditField = (k: keyof Post, v: Post[keyof Post]) => setEditing(prev => prev ? { ...prev, [k]: v } : null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-sora text-foreground">Publicaciones</h2>
          <p className="text-xs text-muted-foreground mt-1">Gestiona los informes y anuncios de la plataforma.</p>
        </div>
        <button onClick={() => setEditing({ title: '', slug: '', content: '', post_type: 'informe', is_published: false })}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(var(--primary),0.2)] hover:scale-105 transition-all">
          <Plus size={16} />Nueva Publicación
        </button>
      </div>

      {loading ? (
         <div className="flex justify-center py-12"><Loader2 className="animate-spin text-muted-foreground/20" /></div>
      ) : posts.length === 0 ? (
         <div className="text-center py-20 text-muted-foreground/20 font-mono text-sm border border-dashed border-border rounded-2xl">No hay publicaciones creadas.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map(p => (
            <div key={p.id} className="bg-card border border-border hover:border-border/80 rounded-2xl overflow-hidden group transition-all">
              {p.cover_image_url ? (
                <div className="h-40 bg-muted border-b border-border relative">
                  <img src={p.cover_image_url} alt={p.title} className="w-full h-full object-cover opacity-80" />
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-background/60 dark:bg-black/60 rounded-md backdrop-blur-md text-[10px] font-mono text-foreground/80 uppercase">
                    {p.post_type}
                  </div>
                </div>
              ) : (
                <div className="h-24 bg-gradient-to-br from-primary/5 to-transparent border-b border-border flex items-center justify-center relative">
                  <FileText className="text-primary/10" size={32} />
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-background/40 dark:bg-black/40 rounded-md backdrop-blur-md text-[10px] font-mono text-foreground/80 uppercase">
                    {p.post_type}
                  </div>
                </div>
              )}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-sm text-foreground/90 leading-tight">{p.title}</h3>
                  {p.is_published ? <Eye size={14} className="text-primary shrink-0" /> : <EyeOff size={14} className="text-muted-foreground/20 shrink-0" />}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{p.content.replace(/<[^>]+>/g, '')}</p>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => setEditing(p)} className="flex-1 py-2 text-xs font-semibold bg-muted hover:bg-muted/80 rounded-lg text-muted-foreground transition-colors">Editar</button>
                  <button onClick={async () => { if(confirm('¿Eliminar post?')){ await supabase.from('content_posts').delete().eq('id', p.id); loadPosts(); } }} 
                    className="w-8 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"><Trash2 size={12} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      <AnimatePresence>
        {editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => !saving && setEditing(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-card border border-border rounded-3xl p-7 w-full max-w-3xl shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-bold text-foreground mb-6 font-sora">{editing.id ? 'Editar Publicación' : 'Nueva Publicación'}</h3>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className={labelCls}>Título *</label>
                    <input autoFocus required value={editing.title || ''} onChange={e => { setEditField('title', e.target.value); if(!editing.id) setEditField('slug', slugify(e.target.value)); }} className={inputCls} placeholder="Ej: Cómo vender más" />
                  </div>
                  <div>
                    <label className={labelCls}>Slug (URL)</label>
                    <input required value={editing.slug || ''} onChange={e => setEditField('slug', slugify(e.target.value))} className={`${inputCls} font-mono`} placeholder="como-vender-mas" />
                  </div>
                  <div>
                    <label className={labelCls}>Tipo</label>
                    <select value={editing.post_type} onChange={e => setEditField('post_type', e.target.value)} className={`${inputCls} bg-card`}>
                      <option value="informe">Informe (Blog)</option>
                      <option value="anuncio">Anuncio</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className={labelCls}>Autor</label>
                    <input value={editing.author_name || ''} onChange={e => setEditField('author_name', e.target.value)} className={inputCls} placeholder="Nombre del autor" />
                  </div>
                  <div className="col-span-2">
                    <label className={labelCls}>URL Imagen de Portada</label>
                    <div className="flex gap-2">
                      <div className="w-11 h-11 bg-muted rounded-xl flex items-center justify-center shrink-0"><Image size={16} className="text-muted-foreground/30" /></div>
                      <input type="url" value={editing.cover_image_url || ''} onChange={e => setEditField('cover_image_url', e.target.value)} className={inputCls} placeholder="https://..." />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className={labelCls}>Palabras clave SEO (separadas por coma)</label>
                    <input value={editing.seo_keywords || ''} onChange={e => setEditField('seo_keywords', e.target.value)} className={inputCls} placeholder="marketing, ventas, seo" />
                  </div>
                  
                  {/* Custom Ad Section */}
                  <div className="col-span-2 pt-4 border-t border-border">
                    <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4">Anuncio Personalizado (Interno)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>URL Imagen del Banner</label>
                        <input type="url" value={editing.ad_image_url || ''} onChange={e => setEditField('ad_image_url', e.target.value)} className={inputCls} placeholder="https://unsplash.com/..." />
                      </div>
                      <div>
                        <label className={labelCls}>Enlace de Destino (URL)</label>
                        <input type="url" value={editing.ad_target_url || ''} onChange={e => setEditField('ad_target_url', e.target.value)} className={inputCls} placeholder="https://identza.site/servicios" />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className={labelCls}>Contenido * (Soporta HTML/Markdown básico)</label>
                    <textarea required rows={10} value={editing.content || ''} onChange={e => setEditField('content', e.target.value)} className={`${inputCls} h-auto py-3 leading-relaxed`} placeholder="Escribe el contenido aquí..." />
                  </div>
                  <div className="col-span-2 flex items-center gap-3 bg-muted/50 p-4 rounded-xl border border-border mt-2">
                    <input type="checkbox" id="published" checked={editing.is_published || false} onChange={e => setEditField('is_published', e.target.checked)} className="w-5 h-5 accent-primary cursor-pointer" />
                    <label htmlFor="published" className="text-sm text-foreground/90 cursor-pointer select-none">Publicar ahora (Visible en la web)</label>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-6 border-t border-border mt-6">
                  <button type="button" onClick={() => setEditing(null)} className="px-6 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-sm font-semibold">Cancelar</button>
                  <button type="submit" disabled={saving} className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:scale-105 transition-all flex items-center gap-2">
                    {saving ? <Loader2 size={16} className="animate-spin" /> : 'Guardar'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
