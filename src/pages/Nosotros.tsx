import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/idenza/Navbar';
import Footer from '@/components/idenza/Footer';
import DesignManifesto from '@/components/idenza/DesignManifesto';
import Meteors from '@/components/idenza/Meteors';
import HolographicGlobe from '@/components/idenza/HolographicGlobe';
import { Target, Zap, Shield, Crown, Sparkles, ArrowRight } from 'lucide-react';

const Nosotros = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <Navbar />

      {/* Modern Premium Hero */}
      <section className="relative pt-32 pb-32 md:pt-40 md:pb-40 px-4 md:px-6 overflow-hidden min-h-[100vh] md:min-h-[110vh] flex items-center">
        {/* ANIMATED PLANET BACKGROUND */}
        <HolographicGlobe />

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-background/90 via-transparent to-background/40 pointer-events-none" />

        {/* BOTTOM FADE - SEAMLESS PROFESSIONAL BLEND */}
        {/* Using h-[500px] and from-background to perfectly match the next section's color */}
        <div className="absolute bottom-0 left-0 z-10 w-full h-[500px] bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />

        {/* Abstract Background Element - Floating Orbs */}
        <div className="absolute top-20 right-20 w-64 h-64 md:w-96 md:h-96 bg-primary/15 rounded-full blur-[80px] md:blur-[100px] animate-pulse opacity-50 pointer-events-none" />
        <div className="absolute bottom-20 left-20 w-48 h-48 md:w-64 md:h-64 bg-[#CCFF00]/8 rounded-full blur-[60px] md:blur-[80px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-2 mb-6 md:mb-8">
                <span className="h-px w-6 md:w-8 bg-primary/50"></span>
                <span className="text-primary font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase">The Vision</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-7xl font-sora font-bold leading-[1] md:leading-[0.95] tracking-tight mb-6 md:mb-8">
                Arquitectos de <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-[#CCFF00]">
                  Sistemas Digitales.
                </span>
              </h1>
              <p className="text-base md:text-xl text-muted-foreground leading-relaxed max-w-lg mb-8 md:mb-10 border-l-2 border-primary/20 pl-4 md:pl-6 backdrop-blur-sm bg-black/10 py-3 md:py-4 rounded-r-xl">
                No hacemos plantillas. Construimos infraestructura de alto rendimiento en código puro, potenciada con IA, para empresas que tienen una visión ambiciosa y necesitan una web que crezca con ellas.
              </p>
            </motion.div>

            {/* Elite Stats / "Control Center" Look */}
            <div className="relative hidden lg:block h-[500px]">
              {/* Card 1: Elite Performance Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute top-0 right-10 z-20"
              >
                <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl w-72 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                  {/* Radial Progress Background */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2" />

                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                      <Crown className="text-primary w-6 h-6" />
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono text-muted-foreground mb-1">GLOBAL RANK</div>
                      <div className="text-green-400 font-mono text-xs flex items-center justify-end gap-1">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        ACTIVE
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="text-6xl font-mono font-bold text-white tracking-tighter mb-1">1%</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-widest font-semibold border-t border-white/10 pt-2 mt-2">
                      Calidad de Código
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
                      Superando el estándar de la industria en performance, accesibilidad y SEO técnico.
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[99%]" />
                  </div>
                </div>
              </motion.div>

              {/* Card 2: Technical Precision */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-10 left-10 z-10"
              >
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl w-80 backdrop-blur-md relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Sparkles className="text-primary w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">Pixel</div>
                      <div className="text-[10px] text-primary tracking-[0.2em]">PERFECTION</div>
                    </div>
                  </div>

                  {/* "Scanning" Visualization */}
                  <div className="relative h-24 bg-black/50 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.05)_50%,transparent_100%)] animate-[shimmer_2s_infinite]" />
                    <div className="grid grid-cols-12 gap-1 w-full p-2 h-full opacity-30">
                      {Array.from({ length: 48 }).map((_, i) => (
                        <div key={i} className="bg-primary/40 rounded-sm h-full w-full" style={{ opacity: Math.random() }} />
                      ))}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-primary/80 tracking-widest bg-black/40 backdrop-blur-[2px]">
                      SCANNING_UI_ELEMENTS
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Connecting Line */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" style={{ zIndex: 0 }}>
                <motion.path
                  d="M 150 150 C 250 150, 400 350, 500 400"
                  stroke="url(#gradient-line)"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 0.5 }}
                />
                <defs>
                  <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="white" stopOpacity="0" />
                    <stop offset="50%" stopColor="var(--tech-blue)" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* The Manifesto - Scroll Reveal */}
      <DesignManifesto />

      {/* Values - Bento Grid Layout - Ultra Dense */}
      <section className="py-16 md:py-20 px-4 md:px-6 relative bg-black/20">
        <div className="max-w-7xl mx-auto">
          <SectionHeader title="Lo que nos hace distintos" subtitle="ADN Idenza" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[280px] md:auto-rows-[300px]">
            {/* Maestría Estratégica - USING A BRIGHTER ABSTRACT MAP IMAGE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2 relative overflow-hidden rounded-2xl md:rounded-3xl bg-black border border-white/10 p-6 md:p-10 group"
            >
              {/* IMAGE: Global Network connection, blue/bright, good contrast */}
              <motion.div
                animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop')] bg-cover bg-center opacity-60 mix-blend-screen"
              />

              {/* MOBILE OPTIMIZED CIRCLE: Moved -right-20 on mobile to not block text, scaled down */}
              <div className="absolute top-1/2 right-[-60px] md:right-10 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 border border-white/5 rounded-full flex items-center justify-center opacity-30 md:opacity-50 group-hover:opacity-70 transition-opacity">
                <div className="w-32 h-32 md:w-48 md:h-48 border border-white/10 rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite]">
                  <div className="w-1 h-20 md:h-32 bg-gradient-to-t from-transparent to-primary/50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 origin-bottom rotate-0" />
                </div>
                <div className="w-24 h-24 md:w-32 md:h-32 border border-primary/20 rounded-full" />
                <Target className="absolute text-primary/20 w-64 h-64 md:w-96 md:h-96 opacity-20" />
              </div>

              <div className="relative z-10 h-full flex flex-col justify-end max-w-md">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 border border-primary/10">
                  <Target size={20} className="text-primary md:w-6 md:h-6" />
                </div>
                <h3 className="text-2xl md:text-3xl font-sora font-bold mb-3 md:mb-4 text-white drop-shadow-md">Diseño + Escalabilidad</h3>
                <p className="text-gray-200 text-xs md:text-sm leading-relaxed border-l border-white/30 pl-4 font-medium backdrop-blur-md bg-black/40 p-3 md:p-4 rounded-r-lg shadow-lg">
                  El arma de doble filo: diseño de élite que impresiona desde el primer píxel, sobre infraestructura modular que no tiene techos de cristal. Nunca tienes que rehacer desde cero.
                </p>
              </div>
            </motion.div>

            {/* Velocidad Extrema - "Server Room" aesthetic */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="md:row-span-2 relative overflow-hidden rounded-2xl md:rounded-3xl bg-black border border-white/10 p-6 md:p-8 group flex flex-col"
            >
              {/* Active Moving Image Background */}
              <motion.div
                animate={{ scale: [1, 1.05, 1], filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-50 mix-blend-screen"
              />
              <Meteors number={15} />

              <div className="absolute right-4 top-10 bottom-10 w-1 flex flex-col gap-1 opacity-70">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className={`w-1 h-full rounded-full bg-primary/40 ${i % 3 === 0 ? 'animate-pulse bg-primary' : ''}`} />
                ))}
              </div>

              <div className="relative z-20 h-full flex flex-col justify-between">
                <div className="p-3 md:p-4 bg-black/40 w-fit rounded-2xl border border-white/10 backdrop-blur-md shadow-inner">
                  <Zap size={24} className="text-yellow-400 fill-yellow-400 md:w-8 md:h-8" />
                </div>

                <div>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-5xl md:text-6xl font-mono font-bold text-white tracking-tighter drop-shadow-md">99</span>
                    <span className="text-lg md:text-xl font-mono text-primary mb-2">/100</span>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full mb-6 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "99%" }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-yellow-400 shadow-[0_0_10px_#facc15]"
                    />
                  </div>

                  <h3 className="text-xl md:text-2xl font-sora font-bold mb-2 text-white">Velocidad Extrema</h3>
                  <p className="text-gray-200 text-[10px] md:text-xs leading-relaxed font-medium bg-black/50 p-3 rounded-lg backdrop-blur-md shadow-lg">
                    Código puro, sin bloat de plugins. Carga instantánea que Google premia y que convierte más. Una infraestructura ligera es el mejor SEO técnico.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Seguridad Blindada - USING A BRIGHTER CYBER SECURITY IMAGE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-black border border-white/10 p-6 md:p-8 group"
            >
              {/* IMAGE: Digital Lock / Matrix Code - BRIGHT GREEN */}
              <motion.div
                animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-60 mix-blend-screen"
              />

              {/* Scanning Beam */}
              <div className="absolute top-0 left-0 w-full h-1 bg-[#CCFF00]/50 shadow-[0_0_20px_rgba(204,255,0,0.5)] animate-[scan_3s_linear_infinite]" />

              <Shield className="w-8 h-8 md:w-10 md:h-10 text-[#CCFF00] mb-6 relative z-10 drop-shadow-lg" />
              <h3 className="text-lg md:text-xl font-sora font-bold mb-2 relative z-10 text-white drop-shadow-md">Infraestructura Segura</h3>
              <p className="text-[10px] md:text-xs text-gray-200 relative z-10 mb-4 font-medium backdrop-blur-md bg-black/50 p-2 rounded shadow-lg">
                SSL, protección DDoS y arquitectura robusta. Tu sistema no se cae cuando crece tu tráfico.
              </p>

              <div className="relative z-10 text-[10px] font-mono text-[#CCFF00] flex gap-2 font-bold tracking-wider">
                <span className="animate-pulse">● SECURE</span>
                <span>● ENCRYPTED</span>
              </div>
            </motion.div>

            {/* Innovación - USING A BRIGHTER NEON/FUTURE IMAGE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-black border border-white/10 p-6 md:p-8 group"
            >
              {/* IMAGE: Abstract Purple/Pink Lights */}
              <motion.div
                animate={{ rotate: [0, 5, 0, -5, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-60 mix-blend-screen"
              />

              <div className="relative z-10 h-full flex flex-col">
                <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-primary mb-auto drop-shadow-md" />

                <h3 className="text-lg md:text-xl font-sora font-bold mb-2 text-white drop-shadow-md">IA + Innovación</h3>
                <p className="text-[10px] md:text-xs text-gray-200 mb-4 font-medium backdrop-blur-md bg-black/50 p-2 rounded shadow-lg">
                  El Idenza Hub integra IA que analiza tu data y te da recomendaciones de negocio reales, antes que tu competencia.
                </p>

                <div
                  onClick={() => navigate('/proyectos')}
                  className="mt-auto flex items-center gap-2 text-primary text-[10px] md:text-xs font-bold group-hover:translate-x-2 transition-transform cursor-pointer"
                >
                  DESCUBRIR <ArrowRight size={14} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* High-End CTA */}
      <section className="py-24 md:py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />
        {/* Cinematic Background Video/Image */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 group-hover:scale-105 transition-transform duration-1000" />

        <div className="max-w-4xl mx-auto text-center relative z-20">
          <h2 className="text-3xl md:text-6xl font-sora font-bold mb-8 tracking-tight">
            ¿Listo para construir tu sistema?
          </h2>
          <motion.div
            className="inline-block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/planes"
              className="inline-flex items-center gap-3 px-6 py-4 md:px-8 md:py-5 bg-white text-black rounded-full font-bold text-sm md:text-lg hover:bg-gray-200 transition-colors"
            >
              Iniciar Transformación
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// Helper Component for consistency
const SectionHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <div className="mb-8 md:mb-12">
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="flex items-center gap-3 mb-4"
    >
      <div className="w-8 h-px md:w-12 bg-primary"></div>
      <span className="text-primary font-mono text-[10px] md:text-xs uppercase tracking-widest">{subtitle}</span>
    </motion.div>
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-2xl md:text-4xl font-sora font-bold"
    >
      {title}
    </motion.h2>
  </div>
);

export default Nosotros;
