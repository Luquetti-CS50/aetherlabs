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
  const [vpw, setVpw] = useState<number>(0); // ancho real del viewport del carrusel

  useLayoutEffect(() => {
    const onResize = () => {
      setVw(window.innerWidth);
      setVpw(viewportRef.current?.clientWidth || 0);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // map context lang -> index
  useEffect(() => {
    const idx = languages.findIndex((l) => l.code === language);
    if (idx >= 0) setCenterIndex(idx);
  }, [language]);

  // autorrotación hasta interacción
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

  // Capturar la rueda sólo cuando el mouse está dentro, para que NO scrollee la página
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault(); // bloquea scroll de la página
      e.stopPropagation();
      const delta = e.deltaY > 0 ? 1 : -1;
      const next = (centerIndex + delta + languages.length) % languages.length;
      handleLanguageChange(next);
    };

    // listener no-passive para poder preventDefault
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [centerIndex]);

  // ===== Tuning visual =====
  const GAP = Math.max(130, Math.min(vw * 0.18, 240));       // más aire entre idiomas
  const FADE_WINDOW = (viewportRef.current?.clientWidth || vw) * 0.60; // 60% del ancho visible
  const HALF_WIN = FADE_WINDOW / 2;

  const SCALE_ACTIVE = 1.16;
  const SCALE_SIDE_MIN = 0.90;
  const OPACITY_MIN = 0.35;

  const SIDE_COUNT = 3; // ≥2 visibles por lado

  // Loop infinito por array extendido (3x)
  const N = languages.length;
  const extended = [...languages, ...languages, ...languages];
  const base = N; // bloque central
  const current = base + centerIndex;

  // Ya NO recortamos con slice para evitar desalineaciones de track
  const TOTAL = extended.length;

  // Posición del track para centrar el item activo usando el centro REAL del viewport del carrusel
  const centerPx = (vpw || vw) / 2;
  const trackX = centerPx - current * GAP;

  const getItemVisual = (absIndex: number) => {
    const delta = absIndex - current;                // pasos desde el centro
    const pixelDist = Math.abs(delta * GAP);         // distancia real en px
    const dNorm = Math.min(1, pixelDist / HALF_WIN); // 0 centro → 1 borde ventana

    const opacity = 1 - (1 - OPACITY_MIN) * dNorm;                   // 1 → 0.35
    const scale = SCALE_ACTIVE - (SCALE_ACTIVE - SCALE_SIDE_MIN) * dNorm; // 1.16 → 0.90
    const blurPx = 0.4 + 1.4 * dNorm;

    const isCentered = delta === 0;
    const x = absIndex * GAP;
    return { opacity, scale, blurPx, isCentered, x };
  };

  const onItemClick = (absIndex: number) => {
    const logicalIndex = (absIndex - base + N * 10) % N;
    handleLanguageChange(logicalIndex);
  };

  // Glow (blanco suave). Cambiá por paleta si querés.
  const glow = "0 0 14px rgba(255,255,255,0.38), 0 0 28px rgba(255,255,255,0.22)";
  // const glow = "0 0 14px rgba(41,255,237,.45), 0 0 26px rgba(254,76,251,.30)";

  return (
    <div className="relative w-full z-10">
      <div
        ref={viewportRef}
        // overflow-x oculto, overflow-y visible para que NO se corten por abajo
        className="relative mx-auto h-24 flex items-center justify-center overflow-x-hidden overflow-y-visible"
        style={{ maxWidth: "min(1200px, 92vw)", paddingTop: 2 }}
        aria-label="Language selector"
      >
        {/* TRACK que se mueve como bloque */}
        <motion.div
          className="relative h-full"
          animate={{ x: trackX }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          style={{ width: TOTAL * GAP }}
        >
          {extended.map((lang, absIndex) => {
            const { opacity, scale, blurPx, isCentered, x } = getItemVisual(absIndex);

            return (
              <motion.button
                key={`${lang.code}-${absIndex}`}
                className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap cursor-pointer leading-tight ${
                  isCentered ? "text-3xl md:text-4xl font-semibold" : "text-xl md:text-2xl"
                } text-white`}
                onClick={() => onItemClick(absIndex)}
                // Importante: No animamos x por item; solo scale/opacity/blur.
                animate={{ opacity, scale, filter: `blur(${blurPx}px)` }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{
                  left: x, // posición absoluta estable
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
