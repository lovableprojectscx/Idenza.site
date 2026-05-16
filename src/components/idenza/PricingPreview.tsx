import { motion } from 'framer-motion';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

const PricingPreview = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 relative bg-background border-y border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          
          {/* Left Text */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:w-1/2 text-left"
          >
            <h2 className="text-3xl md:text-4xl font-sora font-extrabold text-foreground mb-4">
              Transparencia desde el día uno.
            </h2>
            <p className="text-muted-foreground text-lg">
              No ocultamos nuestros precios porque sabemos el valor exacto que te entregamos. Inversiones claras para retornos medibles.
            </p>
          </motion.div>

          {/* Right Cards / Prices */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:w-1/2 w-full grid gap-4"
          >
            {/* Tracker / Hub - DESTACADO */}
            <div className="bg-card border border-primary/50 rounded-2xl p-5 flex justify-between items-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-primary">Idenza Tracker (Hub)</h4>
                  <span className="bg-primary/20 text-primary text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Más Vendido</span>
                </div>
                <p className="text-sm text-muted-foreground">Seguimiento digital, analytics y CRM</p>
              </div>
              <div className="text-right relative z-10">
                <span className="text-primary font-mono opacity-80 text-xs">Suscripción</span>
                <p className="font-sora font-extrabold text-foreground md:text-xl">$21 <span className="text-muted-foreground/50 font-normal text-sm">/mes</span></p>
              </div>
            </div>

            {/* Landing Page */}
            <div className="bg-card border border-border rounded-2xl p-5 flex justify-between items-center hover:bg-foreground/5 transition-colors">
              <div>
                <h4 className="font-bold text-foreground">Landing Page Vendedora</h4>
                <p className="text-sm text-muted-foreground">One-page ultra rápida para pautar</p>
              </div>
              <div className="text-right">
                <span className="text-foreground font-mono opacity-80 text-xs">Desde</span>
                <p className="font-sora font-extrabold text-foreground md:text-xl">$79 <span className="text-muted-foreground/50 font-normal text-sm">- $129</span></p>
              </div>
            </div>

            {/* Web Corporativa */}
            <div className="bg-card border border-border rounded-2xl p-5 flex justify-between items-center hover:bg-foreground/5 transition-colors">
              <div>
                <h4 className="font-bold text-foreground">Web Multisección</h4>
                <p className="text-sm text-muted-foreground">Plataforma corporativa escalable</p>
              </div>
              <div className="text-right">
                <span className="text-foreground font-mono opacity-80 text-xs">Desde</span>
                <p className="font-sora font-extrabold text-foreground md:text-xl">$199 <span className="text-muted-foreground/50 font-normal text-sm">- $399</span></p>
              </div>
            </div>

            <Button onClick={() => navigate('/planes')} className="mt-2 w-full h-12 border-border text-foreground hover:bg-foreground/5">Ver detalles completos de planes</Button>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default PricingPreview;
