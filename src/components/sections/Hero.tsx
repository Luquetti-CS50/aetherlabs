import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { HorizontalLanguageSelector } from "@/components/HorizontalLanguageSelector";
import { languages } from "@/lib/translations";

export const Hero = () => {
  const { t, language, setLanguage } = useLanguage();

  const [currentLanguageIndex, setCurrentLanguageIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [lockedOnLeave, setLockedOnLeave] = useState(false); // ← lock al salir del hero

  const timeoutRef = useRef<NodeJS.Timeout>();
  const heroRef = useRef<HTMLElement>(null);

  // --- autorrotación aleatoria solo mientras no haya lock ni interacción
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
    return () => timeoutRef.current && clearTimeout(timeoutRef.current);
  }, [isAutoRotating]);

  // si cambia el idioma global por cualquier motivo, sincronizamos índice
  useEffect(() => {
    const idx = languages.findIndex((l) => l.code === language);
    if (idx >= 0) setCurrentLanguageIndex(idx);
  }, [language]);

  const stopAutoRotate = () => {
    setIsAutoRotating(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleUserInteraction = () => {
    // al tocar el carrusel en el hero, se apaga la autorrotación
    stopAutoRotate();
  };

  // --- al SALIR del hero por primera vez, fijar el idioma visible y apagar autorrotación
  useEffect(() => {
    if (!heroRef.current) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (!e.isIntersecting && !lockedOnLeave) {
          // fijamos el idioma actual y apagamos la rotación
          stopAutoRotate();
          setLanguage(languages[currentLanguageIndex].code);
          setLockedOnLeave(true); // solo la primera vez
        }
      },
      {
        root: null,
        threshold: 0.25, // si el hero queda <25% visible, lo consideramos “salió”
      }
    );

    obs.observe(heroRef.current);
    return () => obs.disconnect();
  }, [currentLanguageIndex, lockedOnLeave, setLanguage]);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-6"
    >
      {/* Carrusel de idiomas en el top del hero - centrado perfecto */}
      <div className="absolute top-8 w-full flex justify-center px-4">
        <div className="w-full max-w-[1200px]">
          <HorizontalLanguageSelector
            onUserInteraction={handleUserInteraction}
            autoRotateIndex={isAutoRotating ? currentLanguageIndex : undefined}
          />
        </div>
      </div>

      {/* Título con animación al cambiar idioma */}
      <div className="text-center space-y-8 max-w-4xl">
        <AnimatePresence mode="wait">
          <motion.h1
            key={`h1-${language}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.45 }}
            className="text-5xl md:text-7xl font-bold text-foreground"
            style={{ textShadow: "0 0 40px rgba(108, 99, 255, 0.5)" }}
            aria-live="polite"
          >
            {t.hero.welcome}
          </motion.h1>
        </AnimatePresence>

        {/* Slogan con el mismo fade rápido */}
        <AnimatePresence mode="wait">
          <motion.p
            key={`slogan-${language}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.35 }}
            className="text-2xl md:text-3xl text-foreground font-light"
            style={{ textShadow: "0 0 20px rgba(41, 255, 237, 0.4)" }}
          >
            {t.hero.slogan}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Lema de 3 palabras */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-20 flex flex-col items-center gap-6"
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={`motto-${language}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="text-lg md:text-xl font-medium tracking-wider"
            style={{
              background: "var(--gradient-primary)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {t.hero.motto}
          </motion.p>
        </AnimatePresence>
      </motion.div>
    </section>
  );
};
