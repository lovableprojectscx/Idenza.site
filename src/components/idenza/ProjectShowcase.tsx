import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Star, TrendingUp, ShieldCheck, Globe, MousePointer2, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionTitle from './SectionTitle';
import Modal from './Modal';

// Previews
import previewBakan from '@/assets/bakan-preview.png';
import previewGerencia from '@/assets/gerencia-preview-new.png';
import previewWinner from '@/assets/winner-preview.png';

// Logos
import logoGerencia from '@/assets/logo-gerencia.png';
import logoWinner from '@/assets/logo-winner.png';
import logoBakan from '@/assets/logo-bakan.png';

// Lazy Load Component for Iframes
const LazyIframe = ({ src, title, className }: { src: string, title: string, className?: string }) => {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '200px' } // Load when within 200px
        );

        if (containerRef.current) observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className={`w-full h-full relative ${className}`}>
            {isVisible ? (
                <iframe
                    src={src}
                    className="w-full h-full border-0"
                    title={title}
                    tabIndex={-1}
                    loading="lazy"
                />
            ) : (
                // Skeleton / Loading State
                <div className="w-full h-full bg-slate-900 animate-pulse flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
            )}
        </div>
    );
};

const projects = [
    {
        title: 'Bakan',
        url: 'bakan.vercel.app',
        link: 'https://bakan.vercel.app/',
        preview: previewBakan,
        logo: logoBakan,
        category: 'Plataforma FinTech',
        metrics: [
            { label: '+45% Conversión', icon: TrendingUp },
            { label: '100% Confianza', icon: ShieldCheck }
        ],
        description: 'Marketplace de pagos seguros. Compra y vende sin miedo con protección al comprador y vendedor.',
        quote: '"Bakan transformó nuestra idea en una plataforma profesional que transmite confianza desde el primer día."',
        author: 'Bakan Team',
        accentColor: 'blue'
    },
    {
        title: 'Gerencia Global',
        url: 'grupogerenciaglobal.com',
        link: 'https://grupogerenciaglobal.com/',
        preview: previewGerencia,
        logo: logoGerencia,
        category: 'Plataforma Educativa',
        metrics: [
            { label: '5,000+ Estudiantes', icon: Globe },
            { label: '120+ Cursos', icon: TrendingUp }
        ],
        description: 'Centro de certificaciones profesionales con cursos en Salud, Ingeniería y Gestión empresarial.',
        quote: '"Una web que refleja la seriedad de nuestra institución. Nuestras inscripciones aumentaron significativamente."',
        author: 'Grupo Gerencia',
        accentColor: 'orange'
    },
    {
        title: 'Winner Organa',
        url: 'winnerorgana.vercel.app',
        link: 'https://winnerorgana.vercel.app/',
        preview: previewWinner,
        logo: logoWinner,
        category: 'E-commerce',
        metrics: [
            { label: '21% Comisión', icon: TrendingUp },
            { label: '100% Orgánico', icon: Star }
        ],
        description: 'Tienda de productos orgánicos peruanos con programa de afiliados. Construye independencia financiera.',
        quote: '"El diseño captura perfectamente la esencia de nuestros productos naturales. Nuestros clientes confían más."',
        author: 'Winner Organa',
        accentColor: 'emerald'
    }
];

const accentStyles: Record<string, { border: string; shadow: string; text: string; bg: string; borderBadge: string }> = {
    blue: {
        border: 'hover:border-primary/50',
        shadow: 'hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.15)]',
        text: 'text-primary',
        bg: 'bg-primary/15',
        borderBadge: 'border-primary/50'
    },
    orange: {
        border: 'hover:border-secondary/50',
        shadow: 'hover:shadow-[0_0_15px_rgba(var(--secondary-rgb),0.15)]',
        text: 'text-secondary',
        bg: 'bg-secondary/15',
        borderBadge: 'border-secondary/50'
    },
    emerald: {
        border: 'hover:border-accent/50',
        shadow: 'hover:shadow-[0_0_15px_rgba(var(--accent-rgb),0.15)]',
        text: 'text-accent',
        bg: 'bg-accent/15',
        borderBadge: 'border-accent/50'
    }
};

const ProjectShowcase = () => {
    const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section id="portfolio" className="py-24 relative overflow-visible">
            <div className="max-w-7xl mx-auto px-6">
                <SectionTitle
                    subtitle="Proyectos Reales"
                    title="Webs que transforman negocios"
                />
                <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-16 -mt-8">
                    Cada proyecto es una historia de éxito. Mira lo que hemos construido para nuestros clientes.
                </p>

                <div
                    ref={scrollContainerRef}
                    className="
                    flex flex-col gap-8
                    md:grid md:grid-cols-3
                    
                    /* Mobile Horizontal Scroll Overrides */
                    max-md:flex-row max-md:overflow-x-auto max-md:snap-x max-md:snap-mandatory max-md:pb-12 max-md:px-4 max-md:-mx-4
                    scrollbar-hide
                    scroll-smooth
                ">
                    {projects.map((project, index) => {
                        const style = accentStyles[project.accentColor];
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group cursor-pointer min-w-[85vw] md:min-w-0 snap-center"
                                onClick={() => setSelectedProject(project)}
                            >
                                {/* Browser Window Card */}
                                <div className={`h-full bg-card backdrop-blur-sm border border-border rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 ${style.border} ${style.shadow} hover:-translate-y-2`}>

                                    {/* Browser Header */}
                                    <div className="h-10 bg-foreground/5 border-b border-border flex items-center px-4 gap-3">
                                        <div className="flex gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/40 group-hover:bg-red-500 transition-colors" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40 group-hover:bg-yellow-500 transition-colors" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/40 group-hover:bg-green-500 transition-colors" />
                                        </div>
                                        <div className="flex-1 text-[10px] font-mono text-muted-foreground/60 text-center bg-foreground/5 rounded mx-4 py-1 truncate group-hover:text-foreground/80 transition-colors">
                                            {project.url}
                                        </div>
                                    </div>

                                    {/* Preview Area (Static for Performance) */}
                                    <div className="h-48 relative overflow-hidden bg-muted flex items-start justify-center will-change-transform transform-gpu">
                                        {/* Static Preview Image */}
                                        <div className="absolute inset-0 w-full h-full overflow-hidden">
                                            <motion.img
                                                src={project.preview}
                                                alt={project.title}
                                                loading="lazy"
                                                decoding="async"
                                                className="w-full h-full object-cover object-top opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out will-change-transform transform-gpu"
                                            />
                                        </div>

                                        {/* Gradient Overlay for card aesthetic */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity pointer-events-none" />

                                        {/* Action Hint */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                            <div className="bg-background/80 backdrop-blur-md rounded-full px-4 py-2 border border-border flex items-center gap-2">
                                                <MousePointer2 className="text-foreground" size={16} />
                                                <span className="text-foreground text-xs font-bold uppercase tracking-wider">Ver Proyecto</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info Area */}
                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${style.bg} ${style.text} border ${style.borderBadge}`}>
                                                {project.category}
                                            </span>
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={10} className="fill-yellow-500 text-yellow-500" />
                                                ))}
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-sora font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                            {project.title}
                                        </h3>
                                        <p className="text-muted-foreground text-xs leading-relaxed mb-6 line-clamp-2">
                                            {project.description}
                                        </p>

                                        {/* Metrics */}
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            {project.metrics.map((metric, mIndex) => (
                                                <div key={mIndex} className="flex items-center gap-2 truncate">
                                                    <metric.icon size={14} className={style.text} />
                                                    <span className="text-[10px] font-medium text-muted-foreground">{metric.label}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Testimonial/Quote Card */}
                                        <div className="p-4 rounded-2xl bg-foreground/5 border border-border relative mb-6">
                                            <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                                                {project.quote}
                                            </p>
                                            <div className="mt-2 text-[9px] font-bold text-muted-foreground">
                                                — {project.author}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end mt-auto pt-4 border-t border-border">
                                            <button className="flex items-center gap-2 text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                                                Interacción Real
                                                <ExternalLink size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Mobile Navigation Controls */}
                <div className="flex md:hidden justify-center gap-4 mt-4">
                    <button
                        onClick={() => scroll('left')}
                        className="p-3 rounded-full bg-foreground/5 border border-border text-foreground hover:bg-foreground/10 active:scale-95 transition-all"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="p-3 rounded-full bg-foreground/5 border border-border text-foreground hover:bg-foreground/10 active:scale-95 transition-all"
                        aria-label="Scroll right"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>


            {/* Live Preview Modal */}
            <Modal
                isOpen={!!selectedProject}
                onClose={() => setSelectedProject(null)}
                content={
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-border pb-4">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-foreground/5 rounded-lg border border-border">
                                    <img src={selectedProject?.logo} alt="" className="h-8 w-auto object-contain" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold font-sora text-foreground">{selectedProject?.title}</h3>
                                    <p className="text-xs text-muted-foreground">{selectedProject?.url}</p>
                                </div>
                            </div>
                            <a
                                href={selectedProject?.link}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full text-xs font-bold hover:brightness-110 transition-all"
                            >
                                Visitar sitio real
                                <ExternalLink size={14} />
                            </a>
                        </div>
                        <div className="aspect-video w-full bg-muted rounded-xl overflow-hidden border border-border shadow-2xl relative">
                            {selectedProject && (
                                <iframe
                                    src={selectedProject.link}
                                    className="w-full h-full border-0"
                                    title={`Live preview of ${selectedProject.title}`}
                                />
                            )}
                            {/* Overlay to catch clicks if needed, removed to allow interaction */}
                        </div>
                        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                            <ShieldCheck size={14} className="text-emerald-400" />
                            Vista previa segura y encriptada
                        </div>
                    </div>
                }
            />
        </section>
    );
};

export default ProjectShowcase;

