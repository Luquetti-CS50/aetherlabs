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
  const [vpw, setVpw] = useState<number>(0); // ancho visible real del carrusel

  // medición de anchos
  const measureRef = useRef<HTMLDivElement>(null);
  const [widths, setWidths] = useState<number[] | null>(null);         // ancho de cada idioma (N)
  const [positions, setPositions] = useState<number[] | null>(null);   // posición acumulada (borde izq)
  const [totalLen, setTotalLen] = useState<number>(0);                 // largo total (último borde der)

  // ===== helpers =====
  const N = languages.length;
  const extended = [...languages, ...languages, ...languages]; // loop infinito
  const base = N;                                              // bloque central
  const currentAbs = base + centerIndex;                       // índice absoluto en extendido

  // estilos/parametría
  const BASE_GAP = Math.max(48, Math.min(vw * 0.04, 80)); // gap base entre etiquetas
  const SCALE_ACTIVE = 1.16;
  const SCALE_SIDE_MIN = 0.90;
  const OPACITY_MIN = 0.35;

  // fade: 60% del ancho del viewport real
  const FADE_WINDOW = (vpw || vw) * 0.60;
  const HALF_WIN = FADE_WINDOW / 2;

  // ===== medir anchos reales una sola vez (y en resize) =====
  useLayoutEffect(() => {
    const onResize = () => {
      setVw(window.innerWidth);
      setVpw(viewportRef.current?.clientWidth || 0);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    // renderizamos los labels en un contenedor invisible para medirlos con las mismas clases
    if (!measureRef.current) return;
    // pequeño timeout por si la fuente aún no cargó
    const id = window.setTimeout(() => {
      const nodes = Array.from(
        measureRef.current!.querySelectorAll<HTMLElement>("[data-measure]")
      );
      const ws = nodes.map((n) => Math.ceil(n.getBoundingClientRect().width));
      // posiciones acumuladas (izq)
      const pos: number[] = new Array(N).fill(0);
      for (let i = 1; i < N; i++) {
        pos[i] = pos[i - 1] + ws[i - 1] + BASE_GAP;
      }
      const total = pos[N - 1] + ws[N - 1]; // largo total (sin gap al final)
      setWidths(ws);
      setPositions(pos);
      setTotalLen(total + BASE_GAP); // sumo un gap final para aire
    }, 0);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vpw, vw]); // re-medir si cambia el ancho disponible (por seguridad)

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

  // bloquear scroll de la página cuando el mouse está sobre el carrusel
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY > 0 ? 1 : -1;
      const next = (centerIndex + delta + N) % N;
      handleLanguageChange(next);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [centerIndex]);

  // === track X para centrar el ítem por su centro geométrico ===
  const centerPx = (vpw || vw) / 2;

  const basePos = (idx: number) => (positions ? positions[idx] : idx * (BASE_GAP + 120));
  const itemWidth = (idx: number) => (widths ? widths[idx] : 120);

  // posición absoluta del índice extendido (x izquierda)
  const absLeft = (absIdx: number) => {
    const cycle = Math.floor(absIdx / N) - 1;        // -1,0,1 para 3 bloques
    const idx = ((absIdx % N) + N) % N;              // 0..N-1
    return cycle * totalLen + basePos(idx);
  };

  // centro geométrico del item actual (en coords del track)
  const currentCenter = absLeft(currentAbs) + itemWidth(centerIndex) / 2;

  // track se mueve para alinear el centro del ítem con el centro visual del viewport
  const trackX = centerPx - currentCenter;

  // visual por ítem según distancia real al centro
  const getItemVisual = (absIdx: number) => {
    const left = absLeft(absIdx);
    const idx = ((absIdx % N) + N) % N;
    const w = itemWidth(idx);
    const itemCenter = left + w / 2;

    const pixelDist = Math.abs(itemCenter - currentCenter);
    const dNorm = Math.min(1, pixelDist / HALF_WIN);

    const opacity = 1 - (1 - OPACITY_MIN) * dNorm;                  // 1 → 0.35
    const scale = SCALE_ACTIVE - (SCALE_ACTIVE - SCALE_SIDE_MIN) * dNorm; // 1.16 → 0.90
    const blurPx = 0.4 + 1.2 * dNorm;

    const isCentered = pixelDist < 0.5; // prácticamente alineado
    return { opacity, scale, blurPx, isCentered, left };
  };

  const onItemClick = (absIdx: number) => {
    const logicalIndex = ((absIdx % N) + N) % N;
    handleLanguageChange(logicalIndex);
  };

  const glow = "0 0 14px rgba(255,255,255,0.38), 0 0 28px rgba(255,255,255,0.22)";
  // const glow = "0 0 14px rgba(41,255,237,.45), 0 0 26px rgba(254,76,251,.30)";

  // si todavía no medimos, montamos el medidor invisible y mostramos una versión simple
  if (!widths || !positions) {
    return (
      <>
        {/* Medidor invisible con mismo estilo tipográfico */}
        <div ref={measureRef} className="fixed -top-[9999px] -left-[9999px]">
          {languages.map((l) => (
            <span
              key={l.code}
              data-measure
              className="text-2xl md:text-3xl font-medium whitespace-nowrap px-3"
            >
              {l.name}
            </span>
          ))}
        </div>
        {/* Fallback minimal mientras mide */}
        <div className="relative w-full z-10">
          <div
            ref={viewportRef}
            className="relative mx-auto h-24 flex items-center justify-center overflow-x-hidden overflow-y-visible"
            style={{ maxWidth: "min(1200px, 92vw)" }}
          >
            <div className="text-white/60 text-sm">Loading…</div>
          </div>
        </div>
      </>
    );
  }

  const TOTAL = extended.length; // ahora sí usamos todo el extendido (track largo)

  return (
    <div className="relative w-full z-10">
      <div
        ref={viewportRef}
        className="relative mx-auto h-24 flex items-center justify-center overflow-x-hidden overflow-y-visible"
        style={{ maxWidth: "min(1200px, 92vw)", paddingTop: 2 }}
        aria-label="Language selector"
      >
        {/* TRACK */}
        <motion.div
          className="relative h-full"
          animate={{ x: trackX }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          style={{ width: TOTAL * (BASE_GAP + 1) + totalLen * 2 }} // ancho holgado
        >
          {extended.map((lang, absIdx) => {
            const { opacity, scale, blurPx, isCentered, left } = getItemVisual(absIdx);
            return (
              <motion.button
                key={`${lang.code}-${absIdx}`}
                className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap cursor-pointer leading-tight ${
                  isCentered ? "text-3xl md:text-4xl font-semibold" : "text-xl md:text-2xl"
                } text-white px-3`} // padding horizontal para aire
                onClick={() => onItemClick(absIdx)}
                animate={{ opacity, scale, filter: `blur(${blurPx}px)` }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{
                  left,
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
