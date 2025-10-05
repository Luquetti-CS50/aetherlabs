import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { languages, Language } from "@/lib/translations";
import { useLanguage } from "@/contexts/LanguageContext";

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [centerIndex, setCenterIndex] = useState(0);
  const itemHeight = 60;

  useEffect(() => {
    const currentIndex = languages.findIndex((lang) => lang.code === language);
    setCenterIndex(currentIndex);
  }, [language]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 1 : -1;
    const newIndex = Math.max(0, Math.min(languages.length - 1, centerIndex + delta));
    
    if (newIndex !== centerIndex) {
      setCenterIndex(newIndex);
      setLanguage(languages[newIndex].code);
    }
  };

  const getItemStyle = (index: number) => {
    const distance = Math.abs(index - centerIndex);
    const opacity = Math.max(0, 1 - distance * 0.3);
    const scale = Math.max(0.6, 1 - distance * 0.15);
    const translateY = (index - centerIndex) * itemHeight;

    return {
      opacity,
      scale,
      translateY,
      filter: distance === 0 ? "blur(0px)" : `blur(${distance * 1.5}px)`,
    };
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      className="relative h-[300px] w-[200px] overflow-hidden flex items-center justify-center"
      style={{ 
        WebkitMaskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
        maskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)"
      }}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        {languages.map((lang, index) => {
          const style = getItemStyle(index);
          const isCentered = index === centerIndex;

          return (
            <motion.button
              key={lang.code}
              onClick={() => {
                setCenterIndex(index);
                setLanguage(lang.code);
              }}
              animate={{
                opacity: style.opacity,
                scale: style.scale,
                y: style.translateY,
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`absolute text-foreground font-medium transition-all duration-300 whitespace-nowrap cursor-pointer ${
                isCentered ? "text-2xl" : "text-lg"
              }`}
              style={{
                filter: style.filter,
                textShadow: isCentered ? "0 0 20px rgba(41, 255, 237, 0.6)" : "none",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={`${lang.code}-${isCentered}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {lang.name}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
