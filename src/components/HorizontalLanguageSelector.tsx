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

  // Refs & states
  const viewportRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  const N = languages.length;
  // 5 ciclos → siempre hay vecinos visibles a ambos lados
  const extended = [...languages, ...languages, ...languages, ...languages, ...languages];
  const base = 2 * N; // bloque central

  const [centerIndex, setCenterIndex] = useState(0);   // índice lógico 0..N-1
  const [absCenter, setAbsCenter] = useState(base);    // índice absoluto en extendido
  const [hasInteracted, setHasInteracted] = useState(false);

  const [vw, setVw] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1200);
  const [vpw, setVpw] = useState<number>(0); // ancho visible real del carrusel

  // Medición de anchos de textos
  const [widths, setWidths] = useState<number[] | null>(null);
  const [maxW, setMaxW] = useState<number>(120);

  // ===== helpers visuales =====
  const GAP = Math.max(56, Math.min(vw * 0.045, 92)); // separador adicional (un toque más aire)
  // Paso fijo entre CENTROS (spacing uniforme, independientemente del ancho)
  const STEP = (maxW || 120) + GAP;

  // Fade más suave y ancho (70% → 90%)
  const FADE_WINDOW = (vpw || vw) * 0.90;
  const HALF_WIN = FADE_WINDOW / 2;

  const SCALE_ACTIVE = 1.16;
  const SCALE_SIDE_MIN = 0.90;
  const OPACITY_MIN = 0.45; // laterales más visibles

  // ===== resize =====
  useLayoutEffect(() => {
    const onResize = () => {
      setVw(window.innerWidth);
      setVpw(viewportRef.current?.clientWidth || 0);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ===== medir anchos reales =====
  useEffect(() => {
    if (!measureRef.current) return;
    const id = window.setTimeout(() => {
      const nodes = Array.from(
        measureRef.current!.querySelectorAll<HTMLElement>("[data-measure]")
      );
      const ws = nodes.map((n) => Math.ceil(n.getBoundingClientRect().width));
      const mx = ws.length ? Math.max(...ws) : 120;
      setWidths(ws);
      setMaxW(mx);
    }, 0);
    return () => window.clearTimeout(id);
  }, [vpw, vw]);

  // ===== mapear idioma del contexto -> índice lógico =====
  useEffect(() => {
    const idx = languages.findIndex((l) => l.code === language);
    if (idx >= 0) setCenterIndex(idx);
  }, [language]);

  // ===== autorrotación hasta interacción =====
  useEffect(() => {
    if (!hasInteracted && autoRotateIndex !== undefined) {
      setCenterIndex(autoRotateIndex);
      setLanguage(languages[autoRotateIndex].code);
    }
  }, [autoRotateIndex, hasInteracted, setLanguage]);

  // Mantener absCenter en una banda estable y camino corto
  const clampAbs = (abs: number) => {
    const min = base - N;
    const max = base + N;
    while (abs < min) abs += N;
    while (abs > max) abs -= N;
    return abs;
  };

  useEffect(() => {
    const desired = base + centerIndex; // posición “base” equivalente
    const k = Math.round((absCenter - desired) / N);
    let targetAbs = desired + k * N;
    setAbsCenter(clampAbs(targetAbs));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [centerIndex]);

  const handleLanguageChange = (index: number) => {
    if (!hasInteracted) {
      setHasInteracted(true);
      onUserInteraction?.();
    }
    // elegir camino más corto desde absCenter actual
    const desired = base + index;
    const k = Math.round((absCenter - desired) / N);
    let targetAbs = desired + k * N;
    targetAbs = clampAbs(targetAbs);
    setAbsCenter(targetAbs);
    setCenterIndex(index);
    setLanguage(languages[index].code);
  };

  // ===== bloquear scroll de la página cuando el mouse está sobre el carrusel =====
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
  }, [centerIndex, absCenter]);

  // ===== posiciones por CENTRO (spacing uniforme) =====
  const itemWidth = (idx: number) => (widths ? widths[idx] : 120);

  // centro del índice absoluto en el track
  const centerX = (absIdx: number) => {
    const cycle = Math.floor(absIdx / N) - 2; // -2,-1,0,1,2 para 5 bloques
    const logicalCenter = (absIdx - base) * STEP;        // centro equiespaciado
    const loopOffset = cycle * (N * STEP);
    return logicalCenter + loopOffset;
  };

  // borde izquierdo a partir del centro
  const leftFromCenter = (absIdx: number) => {
    const idx = ((absIdx % N) + N) % N;
    return centerX(absIdx) - itemWidth(idx) / 2;
  };

  // trackX: alinear centro del ítem activo con el centro del viewport real
  const viewportCenter = (vpw || vw) / 2;
  const trackX = viewportCenter - centerX(absCenter);

  // smoothstep (0..1)
  const smooth = (x: number) => {
    const t = Math.min(1, Math.max(0, x));
    return t * t * (3 - 2 * t);
  };

  // visual por item según distancia real al centro
  const getItemVisual = (absIdx: number) => {
    const myCenter = centerX(absIdx);
    const pixelDist = Math.abs(myCenter - centerX(absCenter));
    const dNorm = smooth(pixelDist / HALF_WIN); // curva suave
    const opacity = 1 - (1 - OPACITY_MIN) * dNorm;
    const scale = SCALE_ACTIVE - (SCALE_ACTIVE - SCALE_SIDE_MIN) * dNorm;
    const blurPx = 0.3 + 1.0 * dNorm;
    const isCentered = pixelDist < 0.5;
    return { opacity, scale, blurPx, isCentered, left: leftFromCenter(absIdx) };
  };

  const onItemClick = (absIdx: number) => {
    const logicalIndex = ((absIdx % N) + N) % N;
    handleLanguageChange(logicalIndex);
  };

  const glow =
    "0 0 14px rgba(255,255,255,0.38), 0 0 28px rgba(255,255,255,0.22)";
  // const glow = "0 0 14px rgba(41,255,237,.45), 0 0 26px rgba(254,76,251,.30)";

  // Si todavía no medimos, montamos el medidor invisible y mostramos fallback
  if (!widths) {
    return (
      <>
        <div ref={measureRef} className="fixed -top-[9999px] -left-[9999px]">
          {languages.map((l) => (
            <span
              key={l.code}
              data-measure
              className="text-3xl font-medium whitespace-nowrap px-3"
            >
              {l.name}
            </span>
          ))}
        </div>
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

  // Ancho del track: 5 ciclos holgados
  const TRACK_W = 5 * N * STEP;

  return (
    <div className="relative w-full z-10">
      <div
        ref={viewportRef}
        className="relative mx-auto h-24 flex items-center justify-center overflow-x-hidden overflow-y-visible"
        style={{
          maxWidth: "min(1200px, 92vw)",
          paddingTop: 2,
          // Máscara suave (si querés, podés comentarla)
          WebkitMaskImage:
            "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 4%, rgba(0,0,0,1) 12%, rgba(0,0,0,1) 88%, rgba(0,0,0,0.35) 96%, rgba(0,0,0,0) 100%)",
          maskImage:
            "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 4%, rgba(0,0,0,1) 12%, rgba(0,0,0,1) 88%, rgba(0,0,0,0.35) 96%, rgba(0,0,0,0) 100%)",
        }}
        aria-label="Language selector"
      >
        {/* TRACK */}
        <motion.div
          className="relative h-full"
          animate={{ x: trackX }}
          transition={{ duration: 0.24, ease: "easeOut" }}
          style={{ width: TRACK_W }}
        >
          {extended.map((lang, absIdx) => {
            const { opacity, scale, blurPx, isCentered, left } = getItemVisual(absIdx);
            return (
              <motion.button
                key={`${lang.code}-${absIdx}`}
                className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap cursor-pointer leading-tight ${
                  isCentered ? "text-3xl md:text-4xl font-semibold" : "text-xl md:text-2xl"
                } text-white px-3`}
                onClick={() => onItemClick(absIdx)}
                animate={{ opacity, scale, filter: `blur(${blurPx}px)` }}
                transition={{ duration: 0.18, ease: "easeOut" }}
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
