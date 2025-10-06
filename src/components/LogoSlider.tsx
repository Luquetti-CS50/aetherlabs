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
import logo11 from "@/assets/logos/logo-11.png"; // agregado

const logos = [logo1, logo2, logo3, logo4, logo5, logo6, logo7, logo8, logo9, logo10, logo11];

// Parámetros visuales
const ITEM_W = 160;     // ancho aprox de celda (ajustable)
const ITEM_H = 64;      // alto target de logo (ajustable)
const GAP    = 56;      // separación entre logos
const BASE_PX_PER_SEC = 120; // velocidad base (px/s) -> más grande = más rápido
const MAX_PX_PER_SEC  = 500; // tope si hacés drag muy rápido
const FRICTION        = 0.06; // suavizado para volver a velocidad base

export const LogoSlider = () => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef    = useRef<HTMLDivElement>(null);

  // Ticker manual
  const posRef      = useRef(0);             // posición actual en px
  const velRef      = useRef(BASE_PX_PER_SEC); // velocidad actual en px/s (=> izquierda→derecha)
  const targetVel   = useRef(BASE_PX_PER_SEC); // velocidad objetivo (para easing)
  const lastTsRef   = useRef<number | null>(null);
  const rafRef      = useRef<number | null>(null);

  // Estado de interacción
  const [hovering, setHovering] = useState(false);
  const draggingRef            = useRef(false);
  const lastPointerX           = useRef(0);

  // Para loop perfecto, renderizamos 3 bandas seguidas
  const tripled = [...logos, ...logos, ...logos];

  // Iniciar ticker
  useEffect(() => {
    const step = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000; // en segundos
      lastTsRef.current = ts;

      // Easing de velocidad hacia el target
      velRef.current += (targetVel.current - velRef.current) * FRICTION;

      // Si está en hover pero NO drag, pausamos (targetVel=0 ya lo maneja)
      const v = velRef.current;

      // Actualizar posición
      posRef.current += v * dt; // + => izquierda→derecha

      // Wrap sin saltos: cuando nos pasamos del ancho de un ciclo, restamos ciclo
      const track = trackRef.current;
      if (track) {
        const cycleW = track.scrollWidth / 3; // una banda
        // mantener pos en [0, cycleW)
        if (posRef.current >= cycleW) posRef.current -= cycleW;
        if (posRef.current < 0)       posRef.current += cycleW;

        // aplicamos transform (mover hacia la izquierda para ver avance a la derecha)
        // truco: desplazamos -pos para que visualmente vaya izquierda→derecha
        track.style.transform = `translate3d(${-posRef.current}px, 0, 0)`;
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
    if (!draggingRef.current) {
      targetVel.current = 0; // pausa suave
    }
  };
  const onLeave = () => {
    setHovering(false);
    if (!draggingRef.current) {
      targetVel.current = BASE_PX_PER_SEC; // retoma suave
    }
  };

  // Drag manual sobre TODA la cinta (no sobre el PNG)
  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    draggingRef.current = true;
    lastPointerX.current = e.clientX;
    // si estaba corriendo, pauso para que el drag mande
    targetVel.current = 0;
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - lastPointerX.current;
    lastPointerX.current = e.clientX;

    // mover directamente la posición (drag inmediato)
    posRef.current -= dx; // restamos dx para que al arrastrar a la derecha, avance “hacia la derecha”
    const track = trackRef.current;
    if (track) {
      const cycleW = track.scrollWidth / 3;
      if (posRef.current >= cycleW) posRef.current -= cycleW;
      if (posRef.current < 0)       posRef.current += cycleW;
      track.style.transform = `translate3d(${-posRef.current}px, 0, 0)`;
    }

    // velocidad “inercial” temporal según drag
    // cap y signo: si arrastrás a la izquierda (dx negativo) el slider “retrocede”
    const instantaneous = Math.max(-MAX_PX_PER_SEC, Math.min(MAX_PX_PER_SEC, -dx * 20)); // factor sensibilidad
    velRef.current = instantaneous; // respuesta inmediata
  };

  const onPointerUp: React.PointerEventHandler<HTMLDivElement> = (e) => {
    draggingRef.current = false;
    // al soltar: que vuelva a la base a la derecha
    targetVel.current = BASE_PX_PER_SEC;
    (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
  };

  // Evitar seleccionar/arrastrar imagen
  const disableImgEvents = {
    draggable: false,
    onDragStart: (ev: React.DragEvent) => ev.preventDefault(),
  };

  return (
    <div className="relative w-full py-8">
      {/* viewport con fade suave en bordes y padding para que no se “corte” el halo */}
      <div
        ref={viewportRef}
        className="relative w-full overflow-hidden px-10"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,.45) 8%, rgba(0,0,0,1) 18%, rgba(0,0,0,1) 82%, rgba(0,0,0,.45) 92%, rgba(0,0,0,0) 100%)",
          maskImage:
            "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,.45) 8%, rgba(0,0,0,1) 18%, rgba(0,0,0,1) 82%, rgba(0,0,0,.45) 92%, rgba(0,0,0,0) 100%)",
        }}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        {/* TRACK: tres bandas consecutivas para loop perfecto */}
        <div
          ref={trackRef}
          className="flex will-change-transform"
          style={{
            gap: `${GAP}px`,
            transform: "translate3d(0,0,0)",
            padding: "8px 0", // espacio para que el halo no se corte
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {tripled.map((src, i) => (
            <div
              key={i}
              className="relative flex items-center justify-center select-none"
              style={{ width: ITEM_W, height: ITEM_H }}
            >
              {/* Halo horizontal controlado (sin quemar arriba/abajo) */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  // Elipse aplanada: más glow a los costados, menos arriba/abajo
                  background:
                    "radial-gradient(100% 55% at 50% 50%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.20) 45%, rgba(255,255,255,0.0) 70%)",
                  opacity: hovering ? 0.6 : 0.35,
                  transition: "opacity .25s ease",
                  filter: "blur(6px)",
                }}
              />
              <img
                src={src}
                alt={`Logo ${i + 1}`}
                className="max-w-full max-h-full object-contain pointer-events-none transition-all duration-200"
                style={{
                  filter: hovering ? "brightness(0) invert(1)" : "brightness(0) invert(0.75)",
                }}
                {...disableImgEvents}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
