import { motion } from 'framer-motion';
import idenzaLogo from '@/assets/idenza-logo.png';
import { Link } from 'react-router-dom';

const Footer = () => {
  const links = [
    { href: '/nosotros', label: 'Nosotros' },
    { href: '/proyectos', label: 'Proyectos' },
    { href: '/planes', label: 'Planes' },
    { href: '/privacidad', label: 'Privacidad' },
    { href: '/terminos', label: 'Términos' },
  ];

  return (
    <footer className="border-t border-border/30 py-12 bg-background-deep text-muted-foreground text-sm">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <Link to="/">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer"
          >
            <img src={idenzaLogo} alt="Idenza Logo" className="h-8 w-auto" />
          </motion.div>
        </Link>

        <div className="flex gap-8">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="hover:text-primary transition-colors link-underline py-1"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground/50">© 2026 IDENZA. ARQUITECTURA DIGITAL DE ÉLITE.</div>
      </div>
    </footer>
  );
};

export default Footer;
