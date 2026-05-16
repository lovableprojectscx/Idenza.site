import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2, KeyRound } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import idenzaLogo from '@/assets/idenza-logo.png';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Ingresa tu email para restablecer la contraseña.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const { error } = await resetPassword(email.toLowerCase().trim());
    setLoading(false);
    
    if (error) {
      toast.error('Error: ' + error);
      setError(error);
    } else {
      setSuccess(true);
      toast.success('Se ha enviado un enlace de recuperación a tu email.');
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
                <KeyRound size={10} className="text-primary" />
                <span className="text-primary font-mono text-[10px] tracking-[0.25em] uppercase">Recuperación</span>
              </div>
              <h1 className="text-[22px] font-sora font-bold text-white leading-tight">
                Restablecer contraseña
              </h1>
              <p className="text-sm text-white/30 mt-1.5">
                Te enviaremos un enlace para que puedas crear una nueva contraseña.
              </p>
            </div>

            {success ? (
              <div className="space-y-6">
                 <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 text-center">
                    <p className="text-sm text-white/80">Revisa tu bandeja de entrada o la carpeta de spam. Te hemos enviado un correo con las instrucciones.</p>
                 </div>
                 <Link 
                    to="/hub/login"
                    className="w-full h-12 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl font-bold text-sm flex items-center justify-center transition-all duration-200"
                  >
                    Volver al login
                 </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-white/30 uppercase tracking-[0.15em]">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="tu@empresa.com"
                    required
                    className="w-full h-12 bg-white/[0.04] border border-white/8 hover:border-white/12 focus:border-primary/40 rounded-2xl px-4 text-sm text-white placeholder:text-white/15 outline-none transition-all duration-200"
                  />
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
                    : <><span>Enviar enlace</span><ArrowRight size={15} /></>
                  }
                </motion.button>

                <div className="mt-6 text-center">
                  <Link 
                      to="/hub/login"
                      className="inline-flex items-center gap-2 text-[11px] font-mono text-white/40 hover:text-white transition-colors uppercase tracking-widest"
                  >
                      <ArrowLeft size={12} />
                      Volver al login
                  </Link>
                </div>
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

export default ForgotPassword;
