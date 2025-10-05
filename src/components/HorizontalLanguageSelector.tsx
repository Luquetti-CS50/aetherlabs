import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { languages, Language } from "@/lib/translations";
import { useLanguage } from "@/contexts/LanguageContext";

interface HorizontalLanguageSelectorProps {
  onUserInteraction?: () => void;
  autoRotateIndex?: number;
}

export const HorizontalLanguageSelector = ({
  onUserInteraction,
  autoRotateIndex
}: HorizontalLanguageSelectorProps) => {
  const { language, setLanguage } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [centerIndex, setCenterIndex] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const currentIndex = languages.findIndex((lang) => lang.code === language);
    setCenterIndex(currentIndex);
  }, [language]);

  useEffect(() => {
    if (!hasInteracted && autoRotateIndex !== undefined) {
      setCenterIndex(autoRotateIndex);
      setLanguage(languages[autoRotateIndex].code);
    }
  }, [autoRotateIndex, hasInteracted, setLanguage]);

  const handleLanguageChange = (index: number) => {
    if (!hasInteracted) {
      setHasInteracted(true);
      onUserInteraction?.();
    }
    setCenterIndex(index);
    setLanguage(languages[index].code);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 1 : -1;
    const newIndex = (centerIndex + delta + languages.length) % languages.length;
    handleLanguageChange(newIndex);
  };

  const getVisibleLanguages = () => {
    const visible = [];
    for (let i = -2; i <= 2; i++) {
      const index = (centerIndex + i + languages.length) % languages.length;
      visible.push({
        ...languages[index],
        offset: i,
        index,
      });
    }
    return visible;
  };

  const getItemStyle = (offset: number) => {
    const distance = Math.abs(offset);
    const opacity = offset === 0 ? 1 : Math.max(0, 1 - distance * 0.4);
    const scale = offset === 0 ? 1.3 : Math.max(0.7, 1 - distance * 0.2);

    return {
      opacity,
      scale,
      filter: distance === 0 ? "blur(0px)" : `blur(${distance * 1}px)`,
    };
  };

  const visibleLanguages = getVisibleLanguages();

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      className="relative w-full max-w-2xl h-20 overflow-hidden flex items-center justify-center"
      style={{
        WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
        maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)"
      }}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {visibleLanguages.map((lang) => {
          const style = getItemStyle(lang.offset);
          const isCentered = lang.offset === 0;
          const translateX = lang.offset * 180;

          return (
            <motion.button
              key={`${lang.code}-${lang.offset}`}
              onClick={() => handleLanguageChange(lang.index)}
              animate={{
                opacity: style.opacity,
                scale: style.scale,
                x: translateX,
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`absolute text-foreground font-medium transition-all duration-300 whitespace-nowrap cursor-pointer ${
                isCentered ? "text-3xl font-semibold" : "text-xl"
              }`}
              style={{
                filter: style.filter,
                textShadow: isCentered ? "0 0 25px rgba(41, 255, 237, 0.8), 0 0 40px rgba(41, 255, 237, 0.5)" : "none",
              }}
            >
              {lang.name}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
