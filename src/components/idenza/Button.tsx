import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ButtonProps {
  children: React.ReactNode;
  primary?: boolean;
  onClick?: () => void;
  className?: string;
  size?: 'default' | 'lg';
}

const Button = ({ children, primary, onClick, className = '', size = 'default' }: ButtonProps) => {
  const sizeClasses = size === 'lg'
    ? 'px-8 py-4 text-base md:text-lg'
    : 'px-6 py-3 md:px-8 md:py-4 text-sm md:text-base';

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'rounded-lg font-sora font-semibold tracking-wide transition-all duration-300 whitespace-nowrap',
        sizeClasses,
        primary
          ? 'bg-primary text-primary-foreground shadow-glow hover:shadow-[0_20px_50px_-10px_hsl(var(--primary)/0.5)]'
          : 'bg-transparent border border-secondary text-foreground hover:bg-secondary/20',
        className
      )}
    >
      {children}
    </motion.button>
  );
};

export default Button;
