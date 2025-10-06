import { useEffect, useRef, useState } from "react";

import logo1 from "@/assets/logos/logo-1.png";
import logo2 from "@/assets/logos/logo-2.png";
import logo3 from "@/assets/logos/logo-3.png";
import logo4 from "@/assets/logos/logo-4.png";
import logo5 from "@/assets/logos/logo-5.png";
import logo6 from "@/assets/logos/logo-6.png";
import logo7 from "@/assets/logos/logo-7.png";
import logo8 from "@/assets/logos/logo-8.png";
import logo9 from "@/assets/logos/logo-9.png";
import logo10 from "@/assets/logos/logo-10.png";
import logo11 from "@/assets/logos/logo-11.png";

const logos = [logo1, logo2, logo3, logo4, logo5, logo6, logo7, logo8, logo9, logo10, logo11];

// Velocidades base (px/s)
const BASE_DESKTOP = 140;
const BASE_MOBILE  = 90;

// Máxima inercia por drag
const MAX_PX_PER_SEC = 520;
const FRICTION = 0.06;

export const LogoSlider = () => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  // Dimensiones responsivas (usamos clamp para no pasarnos)
  const ITEM_W = isMobile ?  Math.round(clamp(window.innerWidth * 0.28, 110, 150))
                          :  Math.round(clamp(window.innerWidth * 0.10, 150, 200));
  const ITEM_H = isMobile ?  Math.round(clamp(window.innerWidth * 0.10, 48, 60))
                          :  Math.round(clamp(window.innerWidth * 0.05, 64, 80));
  const GAP    = isMobile ?  Math.round(clamp(window.innerWidth * 0.06, 24, 36))
                          :  Math.round(clamp(window.innerWidth * 0.02, 40, 64));

  const BASE_PX_PER_SEC = isMobile ? BASE_MOBILE : BASE_DESKTOP;

  // Triplicamos para loop continuo
  const tripled = [...logos, ...logos, ...logos];

  // Estado/ticker
  const posRef = useRef(0);
  const velRef = useRef(BASE_PX_PER_SEC);
  const targetVel = useRef(BASE_PX_PER_SEC);
  const lastTsRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const draggingRef = useRef(false);
  const lastX = useRef(0);

  // Recalcular en resize
  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Posición inicial al centro del ciclo
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const cycleW = (ITEM_W + GAP) * logos.length;
    posRef.current = cycleW / 2;
    track.style.transform = `translate3d(${-posRef.current}px,0,0)`;
    // ancho explícito para evitar colapsos
    track.style.width = `${cycleW * 3}px`;
  }, [ITEM_W, GAP]);

  // Ticker rAF
  useEffect(() => {
    const step = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;

      velRef.current += (targetVel.current - velRef.current) * FRICTION;
      posRef.current += velRef.current * dt;

      const track = trackRef.current;
      if (track) {
        const cycleW = (ITEM_W + GAP) * logos.length;

        if (posRef.current >= cycleW) posRef.current -= cycleW;
        if (posRef.current < 0)       posRef.current += cycleW;

        track.style.transform = `translate3d(${-posRef.current}px,0,0)`;
      }

      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ITEM_W, GAP, BASE_PX_PER_SEC]);

  // Drag horizontal + permitir scroll vertical (clave en mobile)
  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    draggingRef.current = true;
    lastX.current = e.clientX;
    targetVel.current = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;

    posRef.current -= dx;

    const cycleW = (ITEM_W + GAP) * logos.length;
    if (posRef.current >= cycleW) posRef.current -= cycleW;
    if (posRef.current < 0)       posRef.current += cycleW;

    const track = trackRef.current;
    if (track) track.style.transform = `translate3d(${-posRef.current}px,0,0)`;

    // Inercia
    const inst = Math.max(-MAX_PX_PER_SEC, Math.min(MAX_PX_PER_SEC, -dx * 20));
    velRef.current = inst;
  };

  const onPointerUp: React.PointerEventHandler<HTMLDivElement> = (e) => {
    draggingRef.current = false;
    targetVel.current = BASE_PX_PER_SEC;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const imgCommon = {
    draggable: false,
    onDragStart: (ev: React.DragEvent) => ev.preventDefault(),
  };

  const haloOpacity = isMobile ? 0.35 : 0.45;
  const haloBlur = isMobile ? 4 : 5;

  return (
    <div className="relative w-full z-10">
      <div
        ref={viewportRef}
        className="relative w-full overflow-hidden"
        style={{
          minHeight: isMobile ? 96 : 120,
          padding: isMobile ? "6px 8px" : "10px 12px",
        }}
      >
        {/* Nota: touchAction pan-y permite scroll vertical y drag horizontal fluido */}
        <div
          ref={trackRef}
          className="flex will-change-transform"
          style={{
            gap: `${GAP}px`,
            alignItems: "center",
            transform: "translate3d(0,0,0)",
            touchAction: "pan-y",
            // zona de agarre mayor en mobile:
            paddingTop: isMobile ? 8 : 6,
            paddingBottom: isMobile ? 8 : 6,
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {[...logos, ...logos, ...logos].map((src, i) => (
            <div
              key={i}
              className="relative flex items-center justify-center select-none"
              style={{ width: ITEM_W, height: ITEM_H }}
            >
              {/* Halo horizontal (más leve en mobile) */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(100% 55% at 50% 50%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.14) 45%, rgba(255,255,255,0) 70%)",
                  opacity: haloOpacity,
                  filter: `blur(${haloBlur}px)`,
                }}
              />
              <img
                src={src}
                alt={`Logo ${i + 1}`}
                className="max-w-full max-h-full object-contain pointer-events-none"
                style={{
                  filter: isMobile ? "brightness(0) invert(0.9)" : "brightness(0) invert(0.8)",
                }}
                {...imgCommon}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// utilidad mínima local
function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
