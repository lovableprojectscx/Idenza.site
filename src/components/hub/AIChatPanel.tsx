import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, User, Sparkles, BrainCircuit } from 'lucide-react';
import { sendChatMessage, ChatMessage, OrgContext } from '@/lib/ai';
import idenzaLogo from '@/assets/idenza-logo.png';

// Sugerencias base — siempre disponibles
const BASE_SUGGESTIONS = [
  '¿Cuáles son mis mejores oportunidades ahora mismo?',
  '¿Cómo puedo convertir más leads en clientes?',
  'Dame un resumen ejecutivo de este mes.',
];

// Sugerencias contextuales — aparecen según los datos disponibles
function buildSuggestions(ctx: OrgContext): string[] {
  const suggestions = [...BASE_SUGGESTIONS];

  if (ctx.cities.length > 1) {
    suggestions.push(`¿En qué ciudades debo enfocar mis campañas? Tengo visitas de ${ctx.cities.slice(0, 3).join(', ')}.`);
  }

  if (ctx.newLeads > 0) {
    suggestions.push(`Tengo ${ctx.newLeads} leads sin responder. ¿Por cuál empiezo?`);
  }

  if (ctx.snapshots.length > 0) {
    const worstPage = ctx.leadsByPage.length > 0
      ? null
      : ctx.snapshots.find(s => s.ctas.length === 0);
    if (worstPage) {
      const path = worstPage.page_url.replace(/^https?:\/\/[^/]+/, '') || '/';
      suggestions.push(`Mi página "${path}" no tiene CTAs. ¿Qué debería agregar?`);
    } else {
      suggestions.push('¿Qué páginas de mi web necesitan más trabajo para convertir mejor?');
    }
  }

  if (ctx.brief) {
    suggestions.push(`Dados mis desafíos actuales (${ctx.brief.challenges.slice(0, 60)}...), ¿qué harías primero?`);
  }

  if (ctx.totalVisits > 0 && ctx.totalLeads === 0) {
    suggestions.push('Tengo visitas pero cero leads. ¿Qué está fallando?');
  }

  // Devolver máximo 5 sugerencias únicas
  return [...new Set(suggestions)].slice(0, 5);
}

interface Props { ctx: OrgContext; }

const AIChatPanel = ({ ctx }: Props) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => buildSuggestions(ctx), [
    ctx.newLeads, ctx.cities.length, ctx.snapshots.length,
    ctx.totalLeads, ctx.totalVisits, ctx.brief?.challenges,
  ]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    setError('');
    const userMsg: ChatMessage = { role: 'user', content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setLoading(true);
    try {
      const trimmed = updated.slice(-20);
      const reply = await sendChatMessage(trimmed, ctx);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setError('Error al conectar con la IA. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Altura: 100% en mobile dentro de su contenedor, fija en desktop
    <div className="flex flex-col bg-[#080d1a] border border-white/5 rounded-3xl overflow-hidden h-[560px] sm:h-[620px]">

      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-white/5 bg-[#060b16]/80 shrink-0">
        <img src={idenzaLogo} alt="Idenza" className="h-5 w-auto" />
        <div className="h-4 w-px bg-white/8" />
        <div className="flex items-center gap-2">
          <BrainCircuit size={14} className="text-purple-400/70" />
          <span className="text-sm font-semibold text-white/60 font-sora">Asesor IA</span>
        </div>
        <div className="ml-auto flex items-center gap-2 text-[10px] font-mono text-white/15">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {ctx.brief ? `Conoce ${ctx.orgName}` : 'Analizando datos'}
        </div>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 scrollbar-hide">

        {/* Bienvenida */}
        {messages.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-2xl bg-purple-500/10 border border-purple-500/15 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles size={13} className="text-purple-400/80" />
              </div>
              <div className="bg-white/[0.04] border border-white/6 rounded-2xl rounded-tl-sm px-5 py-3.5 text-sm text-white/60 leading-relaxed max-w-sm">
                {ctx.brief ? (
                  <>
                    Hola, conozco <span className="text-white/80 font-semibold">{ctx.orgName}</span> y
                    tengo acceso a tus datos en tiempo real.
                    {ctx.totalLeads > 0
                      ? ` Veo ${ctx.totalLeads} leads y ${ctx.totalVisits} visitas. ¿Qué querés analizar?`
                      : ' ¿Sobre qué querés que te asesore?'
                    }
                  </>
                ) : (
                  <>
                    Hola, tengo acceso a la data de{' '}
                    <span className="text-white/80 font-semibold">{ctx.orgName}</span>.
                    {ctx.totalLeads > 0
                      ? ` Veo ${ctx.totalLeads} leads y ${ctx.totalVisits} visitas. ¿Qué querés analizar?`
                      : ' Aún no hay datos suficientes, pero puedo orientarte sobre qué hacer ahora.'
                    }
                  </>
                )}
              </div>
            </div>

            {/* Chips de sugerencias contextuales */}
            <div className="pl-11 space-y-2">
              <p className="text-[10px] font-mono text-white/15 uppercase tracking-widest mb-3">Sugerencias</p>
              {suggestions.map((s, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                  onClick={() => send(s)}
                  className="block w-full text-left text-xs text-white/35 bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2.5 hover:bg-white/[0.05] hover:text-white/60 hover:border-purple-500/15 transition-all duration-150"
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Chat */}
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 border ${
                msg.role === 'user'
                  ? 'bg-primary/10 border-primary/15'
                  : 'bg-purple-500/10 border-purple-500/15'
              }`}>
                {msg.role === 'user'
                  ? <User size={13} className="text-primary/80" />
                  : <Sparkles size={13} className="text-purple-400/80" />
                }
              </div>
              <div className={`rounded-2xl px-5 py-3.5 text-sm leading-relaxed max-w-[78%] whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-primary/10 border border-primary/15 text-white/80 rounded-tr-sm'
                  : 'bg-white/[0.04] border border-white/6 text-white/65 rounded-tl-sm'
              }`}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Indicador de escritura */}
        {loading && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
            <div className="w-8 h-8 rounded-2xl bg-purple-500/10 border border-purple-500/15 flex items-center justify-center shrink-0">
              <Sparkles size={13} className="text-purple-400/80" />
            </div>
            <div className="bg-white/[0.04] border border-white/6 rounded-2xl rounded-tl-sm px-5 py-3.5">
              <div className="flex gap-1.5 items-center h-4">
                {[0, 0.15, 0.3].map((delay, i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.7, repeat: Infinity, delay }}
                    className="w-1.5 h-1.5 rounded-full bg-purple-400/40"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <div className="text-red-400/70 text-xs bg-red-500/6 border border-red-500/10 rounded-xl px-4 py-2.5 ml-11">
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-white/5 px-5 py-4 bg-[#060b16]/50 shrink-0">
        <form onSubmit={e => { e.preventDefault(); send(input); }} className="flex gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Preguntá sobre tu negocio..."
            disabled={loading}
            className="flex-1 h-11 bg-white/[0.04] border border-white/8 hover:border-white/12 focus:border-purple-500/30 rounded-xl px-4 text-sm text-white placeholder:text-white/15 outline-none transition-all duration-200 disabled:opacity-40"
          />
          <motion.button
            type="submit"
            disabled={loading || !input.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-11 h-11 rounded-xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center text-purple-400/70 hover:bg-purple-500/25 hover:text-purple-400 disabled:opacity-25 transition-all shrink-0"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default AIChatPanel;
