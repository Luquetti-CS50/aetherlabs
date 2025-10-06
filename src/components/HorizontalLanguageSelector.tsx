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
    const currentIndex = languages.findIndex((l) => l.code === language);
    if (currentIndex >= 0) setCenterIndex(currentIndex);
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
  // Distancia horizontal constante entre items:
  const GAP = Math.max(120, Math.min(vw * 0.18, 240)); // 120–240px aprox; ~18% vw
  // Ventana de visibilidad plena (~60% de la pantalla)
  const FADE_WINDOW = vw * 0.60;
  const HALF_WIN = FADE_WINDOW / 2;

  const SCALE_ACTIVE = 1.16;
  const SCALE_SIDE_MIN = 0.90;
  const OPACITY_MIN = 0.35;

  // Para loop infinito: extendemos el array 3x
  const N = languages.length;
  const extended = [...languages, ...languages, ...languages];
  // El “centro” real está en el bloque del medio
  const base = N; // offset de inicio del bloque central
  const current = base + centerIndex; // índice absoluto dentro de `extended`

  // Mostramos una ventana alrededor del centro
  const SIDE_COUNT = 3; // 3 por lado (total ~7 visibles)
  const start = Math.max(0, current - SIDE_COUNT - 4);
  const end = Math.min(extended.length - 1, current + SIDE_COUNT + 4);

  // La pista (track) se mueve como bloque; cada item queda fijo en su “posición absoluta”
  const trackX = (vw / 2) - (current * GAP);

  // Cálculo visual por ítem (en base a distancia al centro)
  const getItemVisual = (absIndex: number) => {
    const delta = absIndex - current;            // en cantidad de pasos
    const pixelDist = Math.abs(delta * GAP);     // distancia real en px
    const dNorm = Math.min(1, pixelDist / HALF_WIN); // 0 centro → 1 borde ventana

    const opacity = 1 - (1 - OPACITY_MIN) * dNorm;                 // 1 → 0.35
    const scale = SCALE_ACTIVE - (SCALE_ACTIVE - SCALE_SIDE_MIN) * dNorm; // 1.16 → 0.90
    const blurPx = 0.5 + 1.5 * dNorm;                               // leve blur lateral

    const isCentered = delta === 0;
    return { opacity, scale, blurPx, isCentered, x: absIndex * GAP };
  };

  const onItemClick = (absIndex: number) => {
    const logicalIndex = (absIndex - base + N * 10) % N;
    handleLanguageChange(logicalIndex);
  };

  return (
    <div className="relative w-full">
      <div
        ref={viewportRef}
        onWheel={handleWheel}
        className="relative mx-auto h-20 flex items-center justify-center overflow-hidden"
        style={{
          // máscara: centro opaco del 20% al 80% (≈60% visible pleno)
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)",
          maskImage: "linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)",
          maxWidth: "min(1200px, 92vw)"
        }}
        aria-label="Language selector"
      >
        {/* TRACK que se mueve como bloque */}
        <motion.div
          className="relative h-full"
          animate={{ x: trackX }}
          transition={{ duration: 0.36, ease: "easeOut" }}
          style={{ width: (extended.length * GAP) + "px" }}
        >
          {extended.slice(start, end + 1).map((lang, i) => {
            const absIndex = start + i;
            const { opacity, scale, blurPx, isCentered, x } = getItemVisual(absIndex);

            // Glow doble, sin corte
            const glow =
              "0 0 14px rgba(255,255,255,0.38), 0 0 28px rgba(255,255,255,0.22)";

            return (
              <motion.button
                key={`${lang.code}-${absIndex}`}
                className={`absolute top-1/2 -translate-y-1/2 text-foreground font-medium whitespace-nowrap cursor-pointer ${
                  isCentered ? "text-3xl md:text-4xl font-semibold" : "text-xl md:text-2xl"
                }`}
                onClick={() => onItemClick(absIndex)}
                animate={{
                  opacity,
                  scale,
                  filter: `blur(${blurPx}px)`
                }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                style={{
                  left: 0,
                  transform: `translate(${x}px, -50%)`, // posición absoluta en la pista
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
