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

  // ------- estado base / loop infinito -------
  const N = languages.length;
  const EXT = [...languages, ...languages, ...languages]; // 3 ciclos
  const BASE = N; // ciclo central

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // índice lógico (0..N-1) y absoluto (en EXT)
  const [centerIndex, setCenterIndex] = useState(0);
  const [absCenter, setAbsCenter] = useState(BASE);

  const [hasInteracted, setHasInteracted] = useState(false);

  // ------- responsive sizing -------
  const [vw, setVw] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1280
  );
  const isMobile = vw < 768;

  // alto de carrusel y tipografías
  const ROW_H = clamp(isMobile ? 64 : 84, 56, 96);
  const GAP = clamp(isMobile ? vw * 0.06 : vw * 0.04, 28, 80);
  const FONT_ACTIVE = isMobile ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl";
  const FONT_SIDE = isMobile ? "text-lg md:text-xl" : "text-xl md:text-2xl";

  // medimos anchos reales para spacing consistente
  const measureRef = useRef<HTMLDivElement>(null);
  const [wMax, setWMax] = useState(120);
  const [widths, setWidths] = useState<number[] | null>(null);

  // paso fijo entre CENTROS (equiespaciado) independiente del ancho del label
  const STEP = wMax + GAP;

  // máscara de bordes más suave
  const maskCSS =
    "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,.28) 10%, rgba(0,0,0,1) 22%, rgba(0,0,0,1) 78%, rgba(0,0,0,.28) 90%, rgba(0,0,0,0) 100%)";

  // ------- resize -------
  useLayoutEffect(() => {
    const onR = () => setVw(window.innerWidth);
    onR();
    window.addEventListener("resize", onR, { passive: true });
    return () => window.removeEventListener("resize", onR);
  }, []);

  // ------- medir anchos -------
  useEffect(() => {
    if (!measureRef.current) return;
    // dejamos que el navegador pinte una vez
    const id = setTimeout(() => {
      const nodes = Array.from(
        measureRef.current!.querySelectorAll<HTMLElement>("[data-measure]")
      );
      const ws = nodes.map((n) => Math.ceil(n.getBoundingClientRect().width));
      setWidths(ws);
      setWMax(ws.length ? Math.max(...ws) : 120);
    }, 0);
    return () => clearTimeout(id);
  }, [vw]);

  // ------- mapear idioma del contexto -> índice lógico -------
  useEffect(() => {
    const idx = languages.findIndex((l) => l.code === language);
    if (idx >= 0) setCenterIndex(idx);
  }, [language]);

  // ------- autorrotación sólo hasta interactuar -------
  useEffect(() => {
    if (!hasInteracted && autoRotateIndex !== undefined) {
      setCenterIndex(autoRotateIndex);
      setLanguage(languages[autoRotateIndex].code);
    }
  }, [autoRotateIndex, hasInteracted, setLanguage]);

  // ------- mantener absCenter continuo (camino más corto) -------
  useEffect(() => {
    const desired = BASE + centerIndex;
    const k = Math.round((absCenter - desired) / N);
    setAbsCenter(desired + k * N);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [centerIndex]);

  // helpers de geometría
  const cx = (absIdx: number) => (absIdx - BASE) * STEP; // centro "geométrico"
  const leftFromCenter = (absIdx: number, w: number) => cx(absIdx) - w / 2;

  // ------- interacción: wheel, drag táctil, snap -------
  const draggingRef = useRef(false);
  const lastX = useRef(0);
  const accX = useRef(0); // acumulado de desplazamiento para decidir el snap

  // bloqueo del scroll de página sólo cuando se usa wheel encima
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
    accX.current = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
    markInteracted();
  };

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    accX.current += dx;

    // convertimos desplazamiento en “medio paso” = cambio de índice suave
    const deltaIdx = -dx / STEP;
    setAbsCenter((prev) => prev + deltaIdx);
  };

  const onPointerUp: React.PointerEventHandler<HTMLDivElement> = (e) => {
    draggingRef.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);

    // snap al índice lógico más cercano
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

  // ------- visual según distancia al centro real -------
  const viewportCenter = vw / 2;
  const trackX = viewportCenter - cx(absCenter);

  // perfil de glow/opacity/scale suave
  const FADE_WIN = vw * 0.7; // ventana de influencia (70% de ancho)
  const HALF = FADE_WIN / 2;
  const smooth = (t: number) => {
    const x = Math.min(1, Math.max(0, t));
    return x * x * (3 - 2 * x);
  };
  const visuals = (absIdx: number, w: number) => {
    const distPx = Math.abs(cx(absIdx) - cx(absCenter));
    const d = smooth(distPx / HALF);
    const opacity = 1 - (1 - 0.3) * d; // min 0.3
    const scale = (isMobile ? 1.12 : 1.16) - (isMobile ? 0.18 : 0.26) * d;
    const blur = 0.3 + 1.0 * d;
    const isC = distPx < 0.5;
    return { opacity, scale, blur, isC, left: leftFromCenter(absIdx, w) };
  };

  const glow =
    "0 0 18px rgba(255,255,255,0.35), 0 0 36px rgba(255,255,255,0.20)";

  // medir antes de render principal
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
          touchAction: "pan-y", // móvil: permite scroll vertical + drag horizontal
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
            // ancho del label según el idioma lógico
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
