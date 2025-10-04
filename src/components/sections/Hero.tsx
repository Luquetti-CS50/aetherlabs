import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const languages = [
  { code: "en", text: "Welcome to Aether Industries" },
  { code: "es", text: "Bienvenido a Aether Industries" },
  { code: "fr", text: "Bienvenue chez Aether Industries" },
  { code: "pt", text: "Bem-vindo à Aether Industries" },
  { code: "de", text: "Willkommen bei Aether Industries" },
  { code: "it", text: "Benvenuto in Aether Industries" },
  { code: "ja", text: "Aether Industriesへようこそ" },
  { code: "ko", text: "Aether Industries에 오신 것을 환영합니다" },
  { code: "no", text: "Velkommen til Aether Industries" },
  { code: "de-ch", text: "Willkomme bi Aether Industries" },
];

interface HeroProps {
  onScrollStart: () => void;
}

export const Hero = ({ onScrollStart }: HeroProps) => {
  const [currentLanguageIndex, setCurrentLanguageIndex] = useState(0);

  useEffect(() => {
    const getRandomInterval = () => Math.floor(Math.random() * 5000) + 5000; // 5-10 seconds
    
    let timeoutId: NodeJS.Timeout;
    
    const scheduleNextChange = () => {
      timeoutId = setTimeout(() => {
        setCurrentLanguageIndex((prev) => (prev + 1) % languages.length);
        scheduleNextChange();
      }, getRandomInterval());
    };

    scheduleNextChange();

    return () => clearTimeout(timeoutId);
  }, []);

  const handleScroll = () => {
    onScrollStart();
    const homeSection = document.getElementById("home");
    if (homeSection) {
      homeSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-6">
      <div className="text-center space-y-8 max-w-4xl">
        <AnimatePresence mode="wait">
          <motion.h1
            key={currentLanguageIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-7xl font-bold text-foreground"
            style={{
              textShadow: "0 0 40px rgba(108, 99, 255, 0.5)",
            }}
            aria-live="polite"
          >
            {languages[currentLanguageIndex].text}
          </motion.h1>
        </AnimatePresence>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-2xl md:text-3xl text-foreground font-light"
          style={{
            textShadow: "0 0 20px rgba(159, 155, 255, 0.4)",
          }}
        >
          Un futuro más limpio empieza con cada gota
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <button
            onClick={handleScroll}
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-full glass
                     text-lg font-medium text-foreground
                     transition-all duration-300 hover:scale-103 glow-primary
                     hover:bg-primary/10"
            aria-label="Scroll to home section"
          >
            Explore
            <ChevronDown className="w-5 h-5 animate-bounce-slow" />
          </button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-20 flex flex-col items-center gap-6"
      >
        <p className="text-lg md:text-xl text-muted-foreground font-medium tracking-wider">
          Excelencia | Eficiencia | Potencia
        </p>
        <button
          onClick={handleScroll}
          className="text-accent animate-bounce-slow"
          aria-label="Scroll down"
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      </motion.div>
    </section>
  );
};
