/*
  PageLoader — zero runtime dependencies.

  framer-motion has been removed intentionally: PageLoader is imported
  synchronously in App.tsx as a Suspense fallback, which meant the entire
  framer-motion bundle (~40kb gz) landed in the main chunk and blocked first
  paint. Pure CSS keyframes achieve the same visual at 0kb extra cost.
*/

const PageLoader = () => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm">
    {/* Inline keyframes — scoped, no class collisions, zero import cost */}
    <style>{`
      @keyframes idenza-breathe {
        0%, 100% { transform: scale(1);   opacity: 0.5; }
        50%       { transform: scale(1.2); opacity: 1;   }
      }
      @keyframes idenza-scan {
        from { transform: translateX(-100%); }
        to   { transform: translateX(400%);  }
      }
    `}</style>

    <div className="relative flex flex-col items-center">
      {/* Brand pulse */}
      <div
        className="w-12 h-12 mb-8 rounded-xl bg-gradient-to-br from-primary to-[#CCFF00] flex items-center justify-center shadow-[0_0_30px_rgba(123,44,191,0.5)]"
        style={{ animation: "idenza-breathe 1.5s ease-in-out infinite" }}
      >
        <div className="w-6 h-6 bg-white rounded-md opacity-90" />
      </div>

      {/* Progress scanner */}
      <div className="h-1 w-48 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full w-1/4 bg-primary rounded-full"
          style={{ animation: "idenza-scan 1s linear infinite" }}
        />
      </div>

      <p className="mt-4 text-xs font-mono text-muted-foreground tracking-[0.2em] uppercase animate-pulse">
        Cargando Experiencia...
      </p>
    </div>
  </div>
);

export default PageLoader;
