import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ManifestItem = ({ children, index, total }: { children: React.ReactNode, index: number, total: number }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0.3, 0.5, 0.8], [0.3, 1, 0.3]);
    const scale = useTransform(scrollYProgress, [0.3, 0.5], [0.95, 1]);

    return (
        <motion.span
            ref={ref}
            style={{ opacity, scale }}
            className="inline-block mr-2 md:mr-4 transition-colors duration-200 text-foreground"
        >
            {children}
        </motion.span>
    );
};

const DesignManifesto = () => {
    const text = "Las plantillas frenan visiones ambiciosas. Nosotros no construimos webs. Construimos sistemas vivos: diseño que impresiona, infraestructura que escala, inteligencia que recomienda. Tu negocio no se queda pequeño. Crece. Eso es Idenza.";
    const words = text.split(" ");

    return (
        <section className="py-32 md:py-48 px-6 bg-background relative z-10">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-sora font-bold leading-[1.1] md:leading-[1.15] tracking-tight text-center flex flex-wrap justify-center">
                    {words.map((word, i) => (
                        <ManifestItem key={i} index={i} total={words.length}>
                            {word}
                        </ManifestItem>
                    ))}
                </h2>
            </div>
        </section>
    );
};

export default DesignManifesto;
