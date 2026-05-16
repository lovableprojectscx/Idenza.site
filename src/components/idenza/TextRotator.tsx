import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WORDS = ["tu Visión.", "tu Crecimiento.", "tu Empresa.", "tu Ambición.", "tu Potencial."];
// Longest word — used as invisible sizer so the container never changes width
const LONGEST = "tu Crecimiento.";

const TextRotator = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(i => (i + 1) % WORDS.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="relative inline-grid text-primary">
      {/* Invisible sizer: reserves space of the longest word so layout never shifts */}
      <span className="invisible col-start-1 row-start-1 whitespace-nowrap" aria-hidden>
        {LONGEST}
      </span>

      {/* Animated word on top */}
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
          exit={{    opacity: 0, y: -14, filter: 'blur(6px)' }}
          transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
          className="col-start-1 row-start-1 whitespace-nowrap"
        >
          {WORDS[index]}
        </motion.span>
      </AnimatePresence>

      {/* Decorative underline */}
      <span className="absolute bottom-0 left-0 w-full h-[3px] bg-primary/25 rounded-full" />
      <span className="absolute -bottom-1 right-0 w-2 h-2 border-r-2 border-b-2 border-primary/60" />
    </span>
  );
};

export default TextRotator;
