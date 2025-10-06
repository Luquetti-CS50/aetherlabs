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

const ITEM_W = 180;
const ITEM_H = 72;
const GAP = 56;
const BASE_PX_PER_SEC = 140;
const MAX_PX_PER_SEC = 520;
const FRICTION = 0.06;

// Activalo luego que confirmemos que se ve
const USE_MASK = false;

export const LogoSlider = () => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Triplicamos para loop continuo
  const tripled = [...logos, ...logos, ...logos];

  // Estado/ticker
  const posRef = useRef(0);
  const velRef = useRef(BASE_PX_PER_SEC);
  const targetVel = useRef(BASE_PX_PER_SEC);
  const lastTsRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const [hovering, setHovering] = useState(false);
  const draggingRef = useRef(false);
  const lastX = useRef(0);

  // Inicializar posición al centro del primer ciclo para evitar quedar fuera
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const cycleW = (ITEM_W + GAP) * logos.length;
    posRef.current = cycleW / 2;
    track.style.transform = `translate3d(${-posRef.current}px,0,0)`;
  }, []);

  // Ticker
  useEffect(() => {
    const step = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;

      velRef.current += (targetVel.current - velRef.current) * FRICTION;

      posRef.current += velRef.current * dt; // + = izquierda→derecha

      const track = trackRef.current;
      if (track) {
        const cycleW = (ITEM_W + GAP) * logos.length;
        const fullW = cycleW * 3;

        // wrap suave
        if (posRef.current >= cycleW) posRef.current -= cycleW;
        if (posRef.current < 0) posRef.current += cycleW;

        track.style.transform = `translate3d(${-posRef.current}px,0,0)`;
        // ancho explícito del track para evitar colapsos
        track.style.width = `${fullW}px`;
      }

      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Hover pausa (pero permite drag)
  const onEnter = () => {
    setHovering(true);
    if (!draggingRef.current) targetVel.current = 0;
  };
  const onLeave = () => {
    setHovering(false);
    if (!draggingRef.current) targetVel.current = BASE_PX_PER_SEC;
  };

  // Drag en todo el track
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
    if (posRef.current < 0) posRef.current += cycleW;

    const track = trackRef.current;
    if (track) track.style.transform = `translate3d(${-posRef.current}px,0,0)`;

    // inercia temporal
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
    onError: (ev: any) => {
      // Log rápido para detectar rutas rotas
      // console.warn("Logo no cargó:", ev?.currentTarget?.src);
    },
  };

  return (
    <div className="relative w-full z-10">
      <div
        ref={viewportRef}
        className="relative w-full overflow-hidden"
        style={{
          minHeight: 120, // asegura “caja” visible
          padding: "12px 16px",
          ...(USE_MASK
            ? {
                WebkitMaskImage:
                  "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,.45) 8%, rgba(0,0,0,1) 18%, rgba(0,0,0,1) 82%, rgba(0,0,0,.45) 92%, rgba(0,0,0,0) 100%)",
                maskImage:
                  "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,.45) 8%, rgba(0,0,0,1) 18%, rgba(0,0,0,1) 82%, rgba(0,0,0,.45) 92%, rgba(0,0,0,0) 100%)",
              }
            : {}),
        }}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        <div
          ref={trackRef}
          className="flex will-change-transform"
          style={{
            gap: `${GAP}px`,
            alignItems: "center",
            transform: "translate3d(0,0,0)",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {tripled.map((src, i) => (
            <div
              key={i}
              className="relative flex items-center justify-center"
              style={{
                width: ITEM_W,
                height: ITEM_H,
              }}
            >
              {/* Halo horizontal más controlado */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(100% 55% at 50% 50%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.14) 45%, rgba(255,255,255,0) 70%)",
                  opacity: hovering ? 0.5 : 0.3,
                  transition: "opacity .2s ease",
                  filter: "blur(5px)",
                }}
              />
              <img
                src={src}
                alt={`Logo ${i + 1}`}
                className="max-w-full max-h-full object-contain pointer-events-none transition-all duration-150"
                style={{
                  filter: hovering
                    ? "brightness(0) invert(1)"
                    : "brightness(0) invert(0.75)",
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
