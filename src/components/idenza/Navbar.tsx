import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, LayoutDashboard } from 'lucide-react';
import idenzaLogo from '@/assets/idenza-logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../ThemeToggle';

const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/nosotros', label: 'NOSOTROS' },
    { href: '/proyectos', label: 'PROYECTOS' },
    { href: '/planes', label: 'PLANES' },
    { href: '/comunidad', label: 'COMUNIDAD' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 w-full z-40 transition-all duration-300 ${isScrolled
        ? 'backdrop-blur-xl bg-background/80 border-b border-border/30'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <img src={idenzaLogo} alt="Idenza Logo" className="h-8 md:h-9 w-auto" />
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 text-sm font-semibold tracking-wide text-muted-foreground">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="hover:text-primary transition-colors link-underline py-1"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{ height: isMobileMenuOpen ? 'auto' : 0 }}
        className="md:hidden overflow-hidden bg-card border-b border-border"
      >
        <div className="px-6 py-4 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="block text-sm font-semibold tracking-wide text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Tema</span>
            <ThemeToggle />
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
