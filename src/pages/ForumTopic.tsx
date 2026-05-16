import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/idenza/Navbar';
import { Loader2, ArrowLeft, Send, User, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth';

interface Topic {
  id: string; title: string; content: string; author_name: string; created_at: string;
}
interface Reply {
  id: string; content: string; author_name: string; created_at: string;
}

const parseMarkdown = (text: string) => {
  return text
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
};

export default function ForumTopic() {
  const { id } = useParams();
  const { user } = useAuth();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [newReply, setNewReply] = useState('');
  const [guestName, setGuestName] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const [{ data: tData }, { data: rData }] = await Promise.all([
      supabase.from('forum_topics').select('*').eq('id', id).single(),
      supabase.from('forum_replies').select('id,content,author_name,created_at').eq('topic_id', id).order('created_at', { ascending: true })
    ]);
    if (tData) setTopic(tData);
    if (rData) setReplies(rData);
    setLoading(false);
  }, [id]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReply.trim() || !id) return;
    setSendError(null);

    const displayName = user
      ? (user.email?.split('@')[0] ?? 'Usuario')
      : (guestName.trim() || null);

    if (!user && !displayName) {
      setSendError('Por favor, escribe tu nombre o alias para publicar.');
      return;
    }

    setSending(true);
    const payload = {
      topic_id: id,
      content: newReply.trim(),
      author_id: user?.id ?? null,
      author_name: displayName ?? 'Visitante',
    };

    const { error } = await supabase.from('forum_replies').insert([payload]);
    setSending(false);

    if (error) {
      if (error.code === '42501' || error.message?.includes('policy')) {
        setSendError('No tienes permiso para comentar. Inicia sesión o contacta al administrador.');
      } else {
        setSendError('Error al publicar. Intenta de nuevo.');
      }
    } else {
      setNewReply('');
      setGuestName('');
      await loadData();
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="animate-spin text-primary" size={40} />
    </div>
  );

  if (!topic) return (
    <div className="min-h-screen bg-background flex items-center justify-center text-foreground text-xl">
      Debate no encontrado
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{topic.title} | Debates IDENZA</title>
        <meta name="description" content={`Participa en el debate: ${topic.title}`} />
      </Helmet>

      <Navbar />

      <main className="pt-24 md:pt-32 pb-16 md:pb-24 max-w-4xl mx-auto px-4 md:px-6 relative z-10">
        {/* Back link */}
        <Link
          to="/comunidad"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 md:mb-8 w-fit text-sm"
        >
          <ArrowLeft size={16} /> Volver a comunidad
        </Link>

        {/* Main Topic */}
        <div className="bg-card border border-border rounded-2xl md:rounded-3xl p-5 md:p-8 mb-8 md:mb-10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4 font-sora leading-tight">
            {topic.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 md:gap-3 text-muted-foreground font-mono text-[10px] md:text-xs mb-6 md:mb-8 uppercase tracking-wider">
            <span>Iniciado por {topic.author_name || 'Usuario'}</span>
            <span className="hidden sm:inline">·</span>
            <span>{new Date(topic.created_at).toLocaleString()}</span>
          </div>
          <div
            className="text-foreground/80 leading-relaxed text-base md:text-lg"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(topic.content) }}
          />
        </div>

        {/* Replies */}
        <div className="space-y-4 md:space-y-6 mb-10 md:mb-12">
          <h3 className="text-lg md:text-xl font-bold text-foreground font-sora flex items-center gap-3">
            <span className="bg-muted px-3 py-1 rounded-lg text-sm text-muted-foreground">
              {replies.length}
            </span>
            Respuestas
          </h3>

          {replies.length === 0 && (
            <p className="text-muted-foreground text-sm italic">
              Sé el primero en responder este debate.
            </p>
          )}

          {replies.map(r => (
            <div key={r.id} className="bg-muted/40 border border-border rounded-2xl p-4 md:p-6">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <span className="font-bold text-foreground text-sm md:text-base">
                  {r.author_name || 'Usuario'}
                </span>
                <span className="text-[10px] md:text-xs text-muted-foreground font-mono">
                  {new Date(r.created_at).toLocaleString()}
                </span>
              </div>
              <div
                className="text-foreground/70 text-sm md:text-base"
                dangerouslySetInnerHTML={{ __html: parseMarkdown(r.content) }}
              />
            </div>
          ))}
        </div>

        {/* Reply Form */}
        <form onSubmit={handleSend} className="bg-card border border-border rounded-2xl p-4 md:p-6">
          <h4 className="font-bold text-foreground mb-3 md:mb-4 text-sm md:text-base">
            Añadir una respuesta
          </h4>

          {!user && (
            <div className="flex items-center gap-3 bg-muted border border-border rounded-xl px-4 py-3 mb-3">
              <User size={16} className="text-muted-foreground shrink-0" />
              <input
                type="text"
                value={guestName}
                onChange={e => setGuestName(e.target.value)}
                placeholder="Tu nombre o alias (requerido)"
                maxLength={40}
                className="flex-1 bg-transparent text-foreground text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          )}

          <textarea
            required
            value={newReply}
            onChange={e => setNewReply(e.target.value)}
            rows={3}
            className="w-full bg-background border border-border hover:border-border/80 focus:border-primary/50 text-foreground text-sm md:text-base rounded-xl p-3 md:p-4 outline-none transition-colors mb-3 md:mb-4 resize-none"
            placeholder="Escribe tu opinión aquí..."
          />

          {sendError && (
            <div className="flex items-center gap-2 text-red-500 text-xs mb-3 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              <AlertCircle size={14} className="shrink-0" />
              {sendError}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={sending}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl active:scale-95 hover:opacity-90 transition-all disabled:opacity-50 text-sm"
            >
              {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              Publicar
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
