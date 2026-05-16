import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import idenzaLogo from '@/assets/idenza-logo.png';

const UpdatePassword = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);

  // Supabase envía el token en el hash de la URL (#access_token=...)
  // onAuthStateChange lo procesa automáticamente cuando detecta PASSWORD_RECOVERY
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true);
      }
    });
    // Si ya hay sesión activa con recovery token (cuando vienen de email), marcar como listo
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(error.message);
      toast.error('Error al actualizar la contraseña.');
    } else {
      toast.success('¡Contraseña actualizada exitosamente!');
      // Redirigir al panel correspondiente
      setTimeout(() => {
        navigate(isAdmin ? '/hub-admin' : '/hub/dashboard', { replace: true });
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">

      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.04, 0.07, 0.04] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary"
          style={{ filter: 'blur(120px)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.03, 0.05, 0.03] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-blue-500"
          style={{ filter: 'blur(100px)' }}
        />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-[400px] relative z-10"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-12"
        >
          <img src={idenzaLogo} alt="Idenza" className="h-8 w-auto" />
        </motion.div>

        {/* Card */}
        <div className="relative">
          <div className="absolute -inset-px rounded-[28px] bg-gradient-to-b from-white/8 to-white/2 pointer-events-none" />
          <div className="relative bg-[#080d1a]/90 backdrop-blur-2xl rounded-[28px] p-8 shadow-[0_32px_80px_rgba(0,0,0,0.6)]">

            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5">
                <ShieldCheck size={10} className="text-primary" />
                <span className="text-primary font-mono text-[10px] tracking-[0.25em] uppercase">Nueva Contraseña</span>
              </div>
              <h1 className="text-[22px] font-sora font-bold text-white leading-tight">
                Actualiza tu contraseña
              </h1>
              <p className="text-sm text-white/30 mt-1.5">
                Elige una contraseña segura para acceder a tu cuenta.
              </p>
            </div>

            {!ready ? (
              <div className="flex flex-col items-center justify-center py-8 gap-4">
                <Loader2 size={24} className="animate-spin text-primary/40" />
                <p className="text-xs text-white/20 font-mono">Verificando enlace...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nueva Contraseña */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-white/30 uppercase tracking-[0.15em]">
                    Nueva contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Mín. 6 caracteres"
                      required
                      minLength={6}
                      className="w-full h-12 bg-white/[0.04] border border-white/8 hover:border-white/12 focus:border-primary/40 rounded-2xl px-4 pr-12 text-sm text-white placeholder:text-white/15 outline-none transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
                    >
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Confirmar Contraseña */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-white/30 uppercase tracking-[0.15em]">
                    Confirmar contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Repite tu nueva contraseña"
                      required
                      className="w-full h-12 bg-white/[0.04] border border-white/8 hover:border-white/12 focus:border-primary/40 rounded-2xl px-4 pr-12 text-sm text-white placeholder:text-white/15 outline-none transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
                    >
                      {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400/90 text-xs bg-red-500/8 border border-red-500/15 rounded-xl px-4 py-2.5"
                  >
                    {error}
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full h-12 mt-2 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(var(--primary),0.25)] hover:shadow-[0_0_40px_rgba(var(--primary),0.35)] disabled:opacity-40 transition-all duration-200"
                >
                  {loading
                    ? <Loader2 size={16} className="animate-spin" />
                    : <><span>Guardar contraseña</span><ArrowRight size={15} /></>
                  }
                </motion.button>
              </form>
            )}

          </div>
        </div>

        <p className="text-center text-[10px] text-white/10 mt-8 font-mono tracking-widest">
          POWERED BY IDENZA · ACCESO PRIVADO
        </p>
      </motion.div>
    </div>
  );
};

export default UpdatePassword;
