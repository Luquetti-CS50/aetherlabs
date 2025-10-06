import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { languages } from "@/lib/translations";
import { useLanguage } from "@/contexts/LanguageContext";

interface HorizontalLanguageSelectorProps {
  onUserInteraction?: () => void;
  autoRotateIndex?: number;
}

export const HorizontalLanguageSelector = ({
  onUserInteraction,
  autoRotateIndex,
}: HorizontalLanguageSelectorProps) => {
  const { language, setLanguage } = useLanguage();

  // ---------- loop infinito ----------
  const N = languages.length;
  const EXT = [...languages, ...languages, ...languages]; // 3 ciclos
  const BASE = N; // ciclo central

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [centerIndex, setCenterIndex] = useState(0); // 0..N-1
  const [absCenter, setAbsCenter] = useState(BASE);  // índice absoluto en EXT
  const [hasInteracted, setHasInteracted] = useState(false);

  // ---------- responsive ----------
  const [vw, setVw] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1280
  );
  const isMobile = vw < 768;

  // ancho real del contenedor (para centrar perfecto en desktop)
  const [vpw, setVpw] = useState(0);
  useLayoutEffect(() => {
    const onR = () => setVw(window.innerWidth);
    window.addEventListener("resize", onR, { passive: true });
    return () => window.removeEventListener("resize", onR);
  }, []);

  useLayoutEffect(() => {
    if (!viewportRef.current) return;
    const el = viewportRef.current;
    const ro = new ResizeObserver(() => setVpw(el.clientWidth));
    ro.observe(el);
    setVpw(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  // alto de carrusel y tipografías (más compacto)
  const ROW_H = clamp(isMobile ? 56 : 72, 48, 84);
  const GAP = clamp(isMobile ? vw * 0.045 : vw * 0.03, 18, 48);

  const FONT_ACTIVE = isMobile ? "text-xl md:text-2xl" : "text-2xl md:text-3xl";
  const FONT_SIDE   = isMobile ? "text-sm md:text-base" : "text-base md:text-lg";

  // medimos anchos reales para spacing consistente
  const measureRef = useRef<HTMLDivElement>(null);
  const [wMax, setWMax] = useState(120);
  const [widths, setWidths] = useState<number[] | null>(null);

  // comprimimos el paso entre centros para que entren más ítems en pantalla
  const STEP_FACTOR = isMobile ? 0.72 : 0.78;
  const STEP = Math.round(wMax * STEP_FACTOR + GAP);

  // máscara de bordes (suave, no corta el glow)
  const maskCSS =
    "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,.22) 8%, rgba(0,0,0,1) 20%, rgba(0,0,0,1) 80%, rgba(0,0,0,.22) 92%, rgba(0,0,0,0) 100%)";

  // ---------- medir anchos ----------
  useEffect(() => {
    if (!measureRef.current) return;
    const id = window.setTimeout(() => {
      const nodes = Array.from(
        measureRef.current!.querySelectorAll<HTMLElement>("[data-measure]")
      );
      const ws = nodes.map((n) => Math.ceil(n.getBoundingClientRect().width));
      setWidths(ws);
      setWMax(ws.length ? Math.max(...ws) : 120);
    }, 0);
    return () => window.clearTimeout(id);
  }, [vw]);

  // ---------- mapear idioma actual -> índice lógico ----------
  useEffect(() => {
    const idx = languages.findIndex((l) => l.code === language);
    if (idx >= 0) setCenterIndex(idx);
  }, [language]);

  // ---------- autorrotación hasta primera interacción ----------
  useEffect(() => {
    if (!hasInteracted && autoRotateIndex !== undefined) {
      setCenterIndex(autoRotateIndex);
      setLanguage(languages[autoRotateIndex].code);
    }
  }, [autoRotateIndex, hasInteracted, setLanguage]);

  // ---------- mantener absCenter continuo (camino más corto) ----------
  useEffect(() => {
    const desired = BASE + centerIndex;
    const k = Math.round((absCenter - desired) / N);
    setAbsCenter(desired + k * N);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [centerIndex]);

  // helpers de geometría
  const cx = (absIdx: number) => (absIdx - BASE) * STEP; // centro geométrico
  const leftFromCenter = (absIdx: number, w: number) => cx(absIdx) - w / 2;

  // ---------- interacción: wheel local, drag táctil con snap ----------
  const draggingRef = useRef(false);
  const lastX = useRef(0);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY > 0 ? 1 : -1;
      changeTo((centerIndex + delta + N) % N, true);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [centerIndex]);

  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    draggingRef.current = true;
    lastX.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
    markInteracted();
  };

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    // movemos el “centro absoluto” de forma continua
    const deltaIdx = -dx / STEP;
    setAbsCenter((prev) => prev + deltaIdx);
  };

  const onPointerUp: React.PointerEventHandler<HTMLDivElement> = (e) => {
    draggingRef.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
    // snap al más cercano
    const nearest = Math.round(absCenter);
    const logical = mod(nearest, N);
    setAbsCenter(nearest);
    changeTo(logical, false);
  };

  const markInteracted = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      onUserInteraction?.();
    }
  };

  const changeTo = (index: number, fromWheel: boolean) => {
    if (!hasInteracted && !fromWheel) markInteracted();
    const desired = BASE + index;
    const k = Math.round((absCenter - desired) / N);
    const target = desired + k * N;
    setAbsCenter(target);
    setCenterIndex(index);
    setLanguage(languages[index].code);
  };

  // ---------- visual según distancia al centro ----------
  const viewportCenter = (vpw || vw) / 2; // centrado real
  const trackX = viewportCenter - cx(absCenter);

  const FADE_WIN = (vpw || vw) * 0.8; // ventana un poco más amplia
  const HALF = FADE_WIN / 2;
  const smooth = (t: number) => {
    const x = Math.min(1, Math.max(0, t));
    return x * x * (3 - 2 * x);
  };

  const visuals = (absIdx: number, w: number) => {
    const distPx = Math.abs(cx(absIdx) - cx(absCenter));
    const d = smooth(distPx / HALF);
    const opacity = 1 - (1 - 0.35) * d; // min 0.35
    const scale   = (isMobile ? 1.08 : 1.12) - (isMobile ? 0.14 : 0.20) * d;
    const blur    = 0.2 + 0.8 * d;
    const isC = distPx < 0.5;
    return { opacity, scale, blur, isC, left: leftFromCenter(absIdx, w) };
  };

  const glow =
    "0 0 14px rgba(255,255,255,0.30), 0 0 28px rgba(255,255,255,0.16)";

  // -------- pre-render de medición --------
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
        <div className="relative w-full h-20 flex items-center justify-center text-white/60">
          …
        </div>
      </>
    );
  }

  // ancho del track (3 ciclos)
  const TRACK_W = 3 * N * STEP;

  return (
    <div className="relative w-full z-10">
      <div
        ref={viewportRef}
        className="relative mx-auto flex items-center justify-center overflow-x-hidden overflow-y-visible"
        style={{
          maxWidth: "min(1200px, 92vw)",
          height: ROW_H,
          WebkitMaskImage: maskCSS,
          maskImage: maskCSS,
          touchAction: "pan-y", // móvil: drag horizontal sin romper el scroll vertical
        }}
        aria-label="Language selector"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <motion.div
          ref={trackRef}
          className="relative h-full"
          animate={{ x: trackX }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          style={{ width: TRACK_W, willChange: "transform" }}
        >
          {EXT.map((lang, absIdx) => {
            const logical = mod(absIdx, N);
            const w = widths![logical] ?? 120;
            const { opacity, scale, blur, isC, left } = visuals(absIdx, w);

            return (
              <motion.button
                key={`${lang.code}-${absIdx}`}
                className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap cursor-pointer leading-tight ${
                  isC ? `${FONT_ACTIVE} font-semibold` : `${FONT_SIDE}`
                } text-white px-3`}
                onClick={() => changeTo(logical, false)}
                animate={{ opacity, scale, filter: `blur(${blur}px)` }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                style={{
                  left,
                  textShadow: isC ? glow : "none",
                }}
                aria-pressed={isC}
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

// -------- utilidades pequeñas --------
function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}
function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}
