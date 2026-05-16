import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import idenzaLogo from '@/assets/idenza-logo.png';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 relative overflow-hidden">

      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] opacity-[0.05]"
          style={{ background: 'radial-gradient(ellipse, var(--primary) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute inset-0 opacity-[0.015]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center"
      >
        <img src={idenzaLogo} alt="Idenza" className="h-7 w-auto mx-auto mb-12 opacity-30" />

        <div className="font-mono text-[10px] text-white/20 tracking-[0.4em] uppercase mb-4">
          ERROR_404
        </div>

        <h1 className="text-[6rem] font-sora font-extrabold text-white/5 leading-none select-none mb-0">
          404
        </h1>
        <p className="text-lg font-sora font-bold text-white/70 -mt-4 mb-3">
          Página no encontrada
        </p>
        <p className="text-sm text-white/25 mb-10 max-w-xs mx-auto leading-relaxed">
          La ruta que buscas no existe o fue movida.
        </p>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/[0.05] border border-white/10 text-white/60 rounded-xl text-sm font-semibold hover:bg-white/8 hover:text-white transition-all"
        >
          <ArrowLeft size={14} />
          Volver al inicio
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NotFound;
