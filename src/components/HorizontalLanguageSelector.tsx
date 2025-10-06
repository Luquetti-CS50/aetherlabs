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

  // map context lang -> index
  useEffect(() => {
    const idx = languages.findIndex(l => l.code === language);
    if (idx >= 0) setCenterIndex(idx);
  }, [language]);

  // autorrotación hasta que el usuario interactúe
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

  // ===== Tuning visual =====
  const GAP = Math.max(120, Math.min(vw * 0.16, 220)); // espaciado entre items
  const FADE_WINDOW = vw * 0.60; // ~60% del ancho -> zona de visibilidad plena
  const HALF_WIN = FADE_WINDOW / 2;

  const SCALE_ACTIVE = 1.16;
  const SCALE_SIDE_MIN = 0.90;
  const OPACITY_MIN = 0.35;

  const SIDE_COUNT = 3; // visibles por lado (>=2)

  // Loop infinito por array extendido (3x)
  const N = languages.length;
  const extended = [...languages, ...languages, ...languages];
  const base = N; // bloque central
  const current = base + centerIndex;

  // Ventana de render alrededor del centro (performance)
  const start = Math.max(0, current - (SIDE_COUNT + 6));
  const end = Math.min(extended.length - 1, current + (SIDE_COUNT + 6));
  const count = end - start + 1;

  // Posición del track para centrar el item activo
  const trackX = (vw / 2) - (current * GAP);

  // Visual por item según distancia real al centro
  const getItemVisual = (absIndex: number) => {
    const delta = absIndex - current;
    const pixelDist = Math.abs(delta * GAP);
    const dNorm = Math.min(1, pixelDist / HALF_WIN);          // 0 centro → 1 borde
    const opacity = 1 - (1 - OPACITY_MIN) * dNorm;            // 1 → 0.35
    const scale = SCALE_ACTIVE - (SCALE_ACTIVE - SCALE_SIDE_MIN) * dNorm; // 1.16 → 0.90
    const blurPx = 0.4 + 1.4 * dNorm;                         // blur leve
    const isCentered = delta === 0;
    const x = absIndex * GAP;                                 // posición absoluta en la pista
    return { opacity, scale, blurPx, isCentered, x };
  };

  const onItemClick = (absIndex: number) => {
    const logicalIndex = (absIndex - base + N * 10) % N;
    handleLanguageChange(logicalIndex);
  };

  // Glow (blanco suave). Si preferís tu paleta, cambiá a cian/fucsia.
  const glow = "0 0 14px rgba(255,255,255,0.38), 0 0 28px rgba(255,255,255,0.22)";
  // const glow = "0 0 14px rgba(41,255,237,.45), 0 0 26px rgba(254,76,251,.30)";

  return (
    <div className="relative w-full z-10">
      <div
        ref={viewportRef}
        onWheel={handleWheel}
        className="relative mx-auto h-20 flex items-center justify-center overflow-hidden"
        style={{ maxWidth: "min(1200px, 92vw)" }}
        aria-label="Language selector"
      >
        {/* TRACK que se mueve como bloque */}
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
                } text-white`}
                onClick={() => onItemClick(absIndex)}
                // NOTA: no animamos x por-item; lo maneja el track
                animate={{ opacity, scale, filter: `blur(${blurPx}px)` }}
                transition={{ duration: 0.24, ease: "easeOut" }}
                style={{
                  left: x - start * GAP, // posición absoluta respecto al slice
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
