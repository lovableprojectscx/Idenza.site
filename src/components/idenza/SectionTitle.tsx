import { motion } from 'framer-motion';

interface SectionTitleProps {
  subtitle: string;
  title: React.ReactNode;
  centered?: boolean;
}

const SectionTitle = ({ subtitle, title, centered = false }: SectionTitleProps) => (
  <motion.div
    className={`mb-12 ${centered ? 'text-center' : ''}`}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6 }}
  >
    <span className="text-primary font-inter uppercase tracking-[0.2em] text-xs md:text-sm font-bold block mb-4">
      {subtitle}
    </span>
    <h2 className="text-3xl md:text-5xl font-sora font-bold text-foreground leading-tight">
      {title}
    </h2>
  </motion.div>
);

export default SectionTitle;
