import { useRef, useEffect, useState, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { languages } from "@/lib/translations";
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

  // viewport measurements
  const [vw, setVw] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1200);

  useLayoutEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // map context lang -> current index
  useEffect(() => {
    const currentIndex = languages.findIndex((lang) => lang.code === language);
    if (currentIndex >= 0) setCenterIndex(currentIndex);
  }, [language]);

  // autorotate until interaction / first fix
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

  // ---------- Visual tuning ----------
  // gap entre items en píxeles (responsivo)
  const GAP = Math.max(120, Math.min(vw * 0.18, 240)); // ~18% del ancho, cap 120..240
  // ventana de visibilidad "plena" ≈ 60% del ancho
  const FADE_WINDOW = vw * 0.60; // px
  const HALF_WIN = FADE_WINDOW / 2;

  const SCALE_ACTIVE = 1.16;
  const SCALE_SIDE_MIN = 0.90;
  const OPACITY_MIN = 0.35; // opacidad mínima en el borde de la ventana

  // cuántos ítems mostrar a la vez (por lado)
  const SIDE_COUNT = 3; // => muestra hasta 3 por lado (6 + 1 centrado)

  const getVisibleLanguages = () => {
    const visible = [];
    for (let i = -SIDE_COUNT; i <= SIDE_COUNT; i++) {
      const index = (centerIndex + i + languages.length) % languages.length;
      visible.push({
        ...languages[index],
        offset: i,
        index,
      });
    }
    return visible;
  };

  // estilo según distancia real al centro (en píxeles)
  const getItemStyle = (offset: number) => {
    const pixelDist = Math.abs(offset * GAP);
    const dNorm = Math.min(1, pixelDist / HALF_WIN); // 0 en centro, 1 en borde de ventana
    const opacity = 1 - (1 - OPACITY_MIN) * dNorm; // 1→OPACITY_MIN
    const scale = SCALE_ACTIVE - (SCALE_ACTIVE - SCALE_SIDE_MIN) * dNorm; // ACTIVE→SIDE_MIN
    const blurPx = 0.5 + 1.5 * dNorm; // blur leve para suavizar laterales
    return { opacity, scale, blurPx };
  };

  const visibleLanguages = getVisibleLanguages();

  return (
    <div
      className="relative w-full"
      // wrapper sin mask para no recortar el glow
    >
      <div
        ref={containerRef}
        onWheel={handleWheel}
        className="relative mx-auto h-20 flex items-center justify-center overflow-hidden"
        style={{
          // máscara: centro opaco (20%→80%) = ~60% del ancho
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)",
          maxWidth: "min(1200px, 92vw)",
        }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {visibleLanguages.map((lang) => {
            const isCentered = lang.offset === 0;
            const { opacity, scale, blurPx } = getItemStyle(lang.offset);
            const translateX = lang.offset * GAP;

            // Glow: doble halo suave (blanco). Usamos textShadow para mantener nitidez de texto.
            const glow =
              "0 0 14px rgba(255,255,255,0.38), 0 0 28px rgba(255,255,255,0.22)";

            return (
              <motion.button
                key={`${lang.code}-${lang.offset}`}
                onClick={() => handleLanguageChange(lang.index)}
                animate={{
                  opacity,
                  scale,
                  x: translateX,
                  filter: `blur(${blurPx}px)`,
                }}
                transition={{ duration: 0.36, ease: "easeOut" }}
                className={`absolute text-foreground font-medium transition-all duration-300 whitespace-nowrap cursor-pointer ${
                  isCentered ? "text-3xl md:text-4xl font-semibold" : "text-xl md:text-2xl"
                }`}
                style={{
                  // glow solo cuando está centrado (evita “cortes” al borde de la máscara)
                  textShadow: isCentered ? glow : "none",
                  // asegura que el glow no lo tape el stacking context
                  willChange: "transform, opacity, filter",
                }}
                aria-pressed={isCentered}
              >
                {lang.name}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
