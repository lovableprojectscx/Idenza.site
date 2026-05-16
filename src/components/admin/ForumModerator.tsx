import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Trash2, MessageSquare, AlertCircle } from 'lucide-react';

interface Topic {
  id: string; title: string; content: string; author_name: string;
  created_at: string; _count: { replies: number };
}

export function ForumModerator() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTopics = useCallback(async () => {
    setLoading(true);
    // Para simplificar, obtenemos los topics. En un caso real haríamos un join para contar replies.
    const { data, error } = await supabase.from('forum_topics').select('*').order('created_at', { ascending: false });
    if (!error) setTopics(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadTopics(); }, [loadTopics]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-sora text-foreground">Debates (Foro)</h2>
        <p className="text-xs text-muted-foreground mt-1">Modera los temas de debate de la comunidad.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-muted-foreground/20" /></div>
      ) : topics.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground/20 font-mono text-sm border border-dashed border-border rounded-2xl flex flex-col items-center gap-3">
          <MessageSquare size={32} className="text-muted-foreground/10" />
          Nadie ha iniciado un debate aún.
        </div>
      ) : (
        <div className="space-y-3">
          {topics.map(t => (
            <div key={t.id} className="bg-card border border-border rounded-xl p-5 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-foreground/90 truncate">{t.title}</h3>
                <div className="text-xs text-muted-foreground line-clamp-1 mt-1">{t.content}</div>
                <div className="flex items-center gap-3 mt-3 text-[10px] uppercase tracking-wider font-mono text-muted-foreground/30">
                  <span>Por: <span className="text-primary/70">{t.author_name || 'Anónimo'}</span></span>
                  <span>·</span>
                  <span>{new Date(t.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <button onClick={async () => {
                  if(confirm('¿Seguro que deseas eliminar este tema y TODAS sus respuestas de forma permanente?')) {
                    await supabase.from('forum_topics').delete().eq('id', t.id);
                    loadTopics();
                  }
                }}
                className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 flex items-center justify-center shrink-0 transition-all">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
