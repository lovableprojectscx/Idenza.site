import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  delay?: number;
}

const Card = ({ children, className = '', hoverable = true, delay = 0 }: CardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay }}
    whileHover={hoverable ? { y: -8 } : undefined}
    className={cn(
      'bg-card rounded-2xl p-6 md:p-8 border border-border/20',
      'shadow-card hover:border-primary/50 transition-colors duration-300',
      className
    )}
  >
    {children}
  </motion.div>
);

export default Card;
