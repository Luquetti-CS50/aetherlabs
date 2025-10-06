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
  const viewportRef = useRef<HTMLDivElement>(null);
  const [centerIndex, setCenterIndex] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  // medidas responsive
  const [vw, setVw] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1200);
  useLayoutEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // map context lang -> current index
  useEffect(() => {
    const idx = languages.findIndex((l) => l.code === language);
    if (idx >= 0) setCenterIndex(idx);
  }, [language]);

  // autorotate hasta interacción / primera salida
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
    const next = (centerIndex + delta + languages.length) % languages.length;
    handleLanguageChange(next);
  };

  // ====== Tuning visual ======
  const GAP = Math.max(120, Math.min(vw * 0.16, 220)); // 120–220px aprox.
  const FADE_WINDOW = vw * 0.60;
  const HALF_WIN = FADE_WINDOW / 2;

  const SCALE_ACTIVE = 1.16;
  const SCALE_SIDE_MIN = 0.90;
  const OPACITY_MIN = 0.35;

  const SIDE_COUNT = 3; // 3 por lado visible

  // Loop infinito con array extendido
  const N = languages.length;
  const extended = [...languages, ...languages, ...languages];
  const base = N; // bloque central
  const current = base + centerIndex;

  // Ventana de render alrededor del centro (evita renderizar todo)
  const start = Math.max(0, current - (SIDE_COUNT + 6));
  const end = Math.min(extended.length - 1, current + (SIDE_COUNT + 6));
  const count = end - start + 1;

  // posicionar la pista para que el item "current" quede en el centro del viewport
  const trackX = (vw / 2) - (current * GAP);

  const getItemVisual = (absIndex: number) => {
    const delta = absIndex - current;
    const pixelDist = Math.abs(delta * GAP);
    const dNorm = Math.min(1, pixelDist / HALF_WIN);

    const opacity = 1 - (1 - OPACITY_MIN) * dNorm;
    const scale = SCALE_ACTIVE - (SCALE_ACTIVE - SCALE_SIDE_MIN) * dNorm;
    const blurPx = 0.4 + 1.4 * dNorm;

    const isCentered = delta === 0;
    const x = absIndex * GAP;
    return { opacity, scale, blurPx, isCentered, x };
  };

  const onItemClick = (absIndex: number) => {
    const logicalIndex = (absIndex - base + N * 10) % N;
    handleLanguageChange(logicalIndex);
  };

  // --- visibilidad/máscara ---
  const USE_MASK = false; // poné true si querés el fade por máscara en los bordes
  const maskStyles = USE_MASK
    ? {
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)",
        maskImage:
          "linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)",
      }
    : {};

  // Glow doble
  const glow = "0 0 14px rgba(255,255,255,0.38), 0 0 28px rgba(255,255,255,0.22)";
  // Si querés paleta:
  // const glow = "0 0 14px rgba(41,255,237,.45), 0 0 26px rgba(254,76,251,.30)";

  return (
    <div className="relative w-full z-10"> {/* z para evitar que algo lo tape */}
      <div
        ref={viewportRef}
        onWheel={handleWheel}
        className="relative mx-auto h-20 flex items-center justify-center overflow-hidden"
        style={{
          ...maskStyles,
          maxWidth: "min(1200px, 92vw)"
        }}
        aria-label="Language selector"
      >
        {/* TRACK */}
        <motion.div
          className="relative h-full"
          animate={{ x: trackX }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{ width: count * GAP }}
        >
          {extended.slice(start, end + 1).map((lang, i) => {
            const absIndex = start + i;
            const { opacity, scale, blurPx, isCentered, x } = getItemVisual(absIndex);
            return (
              <motion.button
                key={`${lang.code}-${absIndex}`}
                className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap cursor-pointer ${
                  isCentered ? "text-3xl md:text-4xl font-semibold" : "text-xl md:text-2xl"
                } text-white`} // <- color explícito
                onClick={() => onItemClick(absIndex)}
                animate={{ opacity, scale, filter: `blur(${blurPx}px)` }}
                transition={{ duration: 0.24, ease: "easeOut" }}
                style={{
                  left: 0,
                  transform: `translate(${x - start * GAP}px, -50%)`, // posición relativa a la ventana slice
                  textShadow: isCentered ? glow : "none",
                  willChange: "transform, opacity, filter"
                }}
                aria-pressed={isCentered}
              >
                {lang.name}
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};
