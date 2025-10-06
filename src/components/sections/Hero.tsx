import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { HorizontalLanguageSelector } from "@/components/HorizontalLanguageSelector";
import { languages } from "@/lib/translations";

export const Hero = () => {
  const { t, language } = useLanguage(); // <- tomamos language para las animaciones
  const [currentLanguageIndex, setCurrentLanguageIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!isAutoRotating) return;

    const getRandomInterval = () => Math.floor(Math.random() * 5000) + 5000;

    const scheduleNextChange = () => {
      timeoutRef.current = setTimeout(() => {
        setCurrentLanguageIndex((prev) => (prev + 1) % languages.length);
        scheduleNextChange();
      }, getRandomInterval());
    };

    scheduleNextChange();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isAutoRotating]);

  const handleUserInteraction = () => {
    setIsAutoRotating(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-6">
      {/* Carrusel de idiomas en el tope del Hero */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-full px-6 flex justify-center">
        <HorizontalLanguageSelector
          onUserInteraction={handleUserInteraction}
          autoRotateIndex={isAutoRotating ? currentLanguageIndex : undefined}
        />
      </div>

      {/* Título con animación existente (se mantiene) */}
      <div className="text-center space-y-8 max-w-4xl">
        <AnimatePresence mode="wait">
          <motion.h1
            key={`title-${language}`} // <- anima cuando cambia idioma
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-7xl font-bold text-foreground"
            style={{ textShadow: "0 0 40px rgba(108, 99, 255, 0.5)" }}
            aria-live="polite"
          >
            {t.hero.welcome}
          </motion.h1>
        </AnimatePresence>

        {/* Eslogan con fade-out / fade-in rápido al cambiar idioma */}
        <AnimatePresence mode="wait">
          <motion.p
            key={`slogan-${language}`}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="text-2xl md:text-3xl text-foreground font-light"
            style={{ textShadow: "0 0 20px rgba(41, 255, 237, 0.4)" }}
          >
            {t.hero.slogan}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Tríada (Excelencia | Eficiencia | Potencia) con el mismo efecto */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`motto-${language}`}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -3 }}
          transition={{ duration: 0.18, ease: "easeOut", delay: 0.02 }}
          className="absolute bottom-20 flex flex-col items-center gap-6"
        >
          <p
            className="text-lg md:text-xl font-medium tracking-wider"
            style={{
              background: "var(--gradient-primary)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {t.hero.motto}
          </p>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};
