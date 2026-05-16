import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '@/components/idenza/Navbar';
import Footer from '@/components/idenza/Footer';
import { CheckCircle2, Rocket, TrendingUp, Globe, ShieldCheck, Star } from 'lucide-react';
import SectionHeader from '@/components/idenza/SectionTitle';

// Previews
import previewBakan from '@/assets/bakan-mobile.png';
import previewGerencia from '@/assets/gerencia-mobile.png';
import previewWinner from '@/assets/winner-mobile.png';

const PortfolioHero = () => (
  <section className="pt-32 pb-20 px-6">
    <div className="max-w-5xl mx-auto text-center">
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-block px-4 py-1 rounded-full bg-card border border-secondary/30 text-secondary font-mono text-xs tracking-widest mb-6"
      >
        RESULTADOS REALES
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-4xl md:text-6xl font-sora font-extrabold leading-tight mb-6"
      >
        Esto no es un portafolio. <br />
        <span className="text-primary">Son negocios transformados.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
      >
        Cada caso de éxito aquí representa un emprendedor que dejó de esperar.
        Tecnología, diseño y estrategia aplicados a problemas reales.
      </motion.p>
    </div>
  </section>
);

const PortfolioGrid = () => {
  const projects = [
    {
      title: "Bakan",
      category: "Plataforma FinTech",
      image: previewBakan,
      stat: "+45% Conversión",
      icon: TrendingUp
    },
    {
      title: "Winner Organa",
      category: "E-commerce Orgánico",
      image: previewWinner,
      stat: "Indice Oro",
      icon: Star
    },
    {
      title: "Gerencia Global",
      category: "EdTech Platform",
      image: previewGerencia,
      stat: "5,000+ Alumnos",
      icon: Globe
    }
  ];

  return (
    <section className="py-10 px-6 bg-background relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Project Cards */}
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative h-[600px] rounded-[2.5rem] overflow-hidden cursor-pointer border border-border hover:border-primary/50 transition-all duration-500 shadow-2xl"
            >
              {/* Phone Content Area */}
              <div className="absolute inset-x-0 top-0 bottom-0 overflow-hidden bg-[#0a0c14]">
                <motion.img
                  src={project.image}
                  alt={project.title}
                  initial={{ y: 0 }}
                  whileHover={{ y: "-65%" }}
                  transition={{ duration: 7, ease: "linear" }}
                  className="w-full h-auto object-cover object-top will-change-transform"
                />
              </div>

              {/* Glass Overlay for Metadata */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />

              <div className="absolute bottom-0 left-0 w-full p-8 z-20">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[9px] items-center gap-1 inline-flex px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white font-mono tracking-widest uppercase shadow-lg">
                    <CheckCircle2 size={10} className="text-green-400" /> CASO_REAL
                  </span>
                </div>

                <h3 className="text-3xl font-sora font-black text-white mb-2 tracking-tight drop-shadow-lg">{project.title}</h3>

                <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-2">
                  <span className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-mono">{project.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black text-primary bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20 backdrop-blur-md">{project.stat}</span>
                  </div>
                </div>
              </div>

              {/* Shine Effect */}
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-tr from-primary/5 via-transparent to-white/5" />
            </motion.div>
          ))}

          {/* "Your Project Here" Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="relative h-[600px] rounded-[2.5rem] overflow-hidden border-2 border-dashed border-border hover:border-primary/50 transition-all duration-500 bg-foreground/[0.04] flex flex-col items-center justify-center text-center p-8 group cursor-pointer"
          >
            <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
              <Rocket size={32} className="text-primary" />
            </div>
            <h3 className="text-3xl font-sora font-black text-foreground mb-4 tracking-tight">Tu Marca Aquí</h3>
            <p className="text-sm text-muted-foreground max-w-[240px] mb-10 leading-relaxed font-medium">
              ¿Listo para que tu negocio sea el siguiente caso de éxito?
            </p>
            <Link to="/launchpad" className="px-10 py-4 bg-primary text-primary-foreground font-black rounded-2xl transition-all text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/40">
              INICIAR DESPLIEGUE
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Proyectos = () => {
  return (
    <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-500">
      <Navbar />
      <PortfolioHero />
      <PortfolioGrid />
      <Footer />
    </div>
  );
};

export default Proyectos;
