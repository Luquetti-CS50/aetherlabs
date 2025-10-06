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

  // -------- datos base / loop extendido --------
  const N = languages.length;
  const EXT = [...languages, ...languages, ...languages]; // 3 ciclos
  const BASE = N; // ciclo central

  const viewportRef = useRef<HTMLDivElement>(null);

  const [centerIndex, setCenterIndex] = useState(0); // 0..N-1
  const [absCenter, setAbsCenter] = useState(BASE);  // índice absoluto
  const [hasInteracted, setHasInteracted] = useState(false);

  // -------- responsive + ancho real del viewport --------
  const [vw, setVw] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1280
  );
  useLayoutEffect(() => {
    const onR = () => setVw(window.innerWidth);
    window.addEventListener("resize", onR, { passive: true });
    return () => window.removeEventListener("resize", onR);
  }, []);
  const isMobile = vw < 768;

  const [vpw, setVpw] = useState(0);
  useLayoutEffect(() => {
    if (!viewportRef.current) return;
    const el = viewportRef.current;
    const ro = new ResizeObserver(() => setVpw(el.clientWidth));
    ro.observe(el);
    setVpw(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  // -------- layout compacto --------
  const ROW_H = clamp(isMobile ? 54 : 72, 48, 84);
  const GAP = clamp(isMobile ? vw * 0.032 : vw * 0.028, 14, 40);

  // tipografías
  const FONT_ACTIVE = isMobile ? "text-lg md:text-2xl" : "text-2xl md:text-3xl";
  const FONT_SIDE   = isMobile ? "text-xs md:text-base" : "text-base md:text-lg";

  // ancho "virtual" por paso (no depende del ancho real del texto)
  // para ver más ítems a los lados, comprimimos el paso en mobile.
  const STEP_FACTOR = isMobile ? 0.64 : 0.76;  // ← más chico = más ítems visibles
  const BASE_STEP = 120; // base razonable
  const STEP = Math.round(BASE_STEP * STEP_FACTOR + GAP);

  // -------- idioma actual -> índice lógico --------
  useEffect(() => {
    const idx = languages.findIndex((l) => l.code === language);
    if (idx >= 0) setCenterIndex(idx);
  }, [language]);

  // -------- autorrotación hasta primera interacción --------
  useEffect(() => {
    if (!hasInteracted && autoRotateIndex !== undefined) {
      setCenterIndex(autoRotateIndex);
      setLanguage(languages[autoRotateIndex].code);
    }
  }, [autoRotateIndex, hasInteracted, setLanguage]);

  // -------- mantener absCenter cerca del bloque central --------
  useEffect(() => {
    const desired = BASE + centerIndex;
    const k = Math.round((absCenter - desired) / N);
    setAbsCenter(desired + k * N);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [centerIndex]);

  // normalización suave: si el usuario arrastra mucho, volvemos a la zona media
  useEffect(() => {
    const LOW = BASE - N * 0.75;
    const HIGH = BASE + N * 0.75;
    if (absCenter < LOW) setAbsCenter((prev) => prev + N);
    else if (absCenter > HIGH) setAbsCenter((prev) => prev - N);
  }, [absCenter, N]);

  // -------- interacción: wheel local + drag con snap --------
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

  const draggingRef = useRef(false);
  const lastX = useRef(0);

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
    const deltaIdx = -dx / STEP;
    setAbsCenter((prev) => prev + deltaIdx);
  };

  const onPointerUp: React.PointerEventHandler<HTMLDivElement> = (e) => {
    draggingRef.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
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

  // -------- geometría & visual --------
  const cx = (absIdx: number) => (absIdx - BASE) * STEP;   // centro geométrico
  const viewportCenter = (vpw || vw) / 2;
  const trackX = viewportCenter - cx(absCenter);

  const FADE_WIN = (vpw || vw) * 0.82; // ventana algo amplia
  const HALF = FADE_WIN / 2;
  const smooth = (t: number) => {
    const x = Math.min(1, Math.max(0, t));
    return x * x * (3 - 2 * x);
  };

  const visuals = (absIdx: number) => {
    const distPx = Math.abs(cx(absIdx) - cx(absCenter));
    const d = smooth(distPx / HALF);
    const opacity = 1 - (1 - 0.35) * d; // min 0.35
    const scale   = (isMobile ? 1.06 : 1.12) - (isMobile ? 0.12 : 0.20) * d;
    const blur    = 0.2 + 0.8 * d;
    const isC     = distPx < 0.5;
    return { opacity, scale, blur, isC, left: cx(absIdx) };
  };

  const glow =
    "0 0 14px rgba(255,255,255,0.30), 0 0 28px rgba(255,255,255,0.16)";

  const maskCSS =
    "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,.22) 8%, rgba(0,0,0,1) 20%, rgba(0,0,0,1) 80%, rgba(0,0,0,.22) 92%, rgba(0,0,0,0) 100%)";

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
          touchAction: "pan-y",
        }}
        aria-label="Language selector"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <motion.div
          className="relative h-full"
          animate={{ x: trackX }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          style={{ width: TRACK_W, willChange: "transform" }}
        >
          {EXT.map((lang, absIdx) => {
            const logical = mod(absIdx, N);
            const { opacity, scale, blur, isC, left } = visuals(absIdx);

            return (
              <motion.button
                key={`${lang.code}-${absIdx}`}
                className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 whitespace-nowrap cursor-pointer leading-tight ${
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

// -------- utilidades --------
function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}
function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}
