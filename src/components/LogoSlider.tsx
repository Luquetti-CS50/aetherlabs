import { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useMotionValue } from "framer-motion";

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

// 4) CLICK EN LOGO — definí hrefs reales acá si querés abrir webs:
const logos: { src: string; alt: string; href?: string }[] = [
  { src: logo1, alt: "Partner 1", href: "#" },
  { src: logo2, alt: "Partner 2", href: "#" },
  { src: logo3, alt: "Partner 3", href: "#" },
  { src: logo4, alt: "Partner 4", href: "#" },
  { src: logo5, alt: "Partner 5", href: "#" },
  { src: logo6, alt: "Partner 6", href: "#" },
  { src: logo7, alt: "Partner 7", href: "#" },
  { src: logo8, alt: "Partner 8", href: "#" },
  { src: logo9, alt: "Partner 9", href: "#" },
  { src: logo10, alt: "Partner 10", href: "#" },
];

// Duplicamos para loop sin saltos (2 bandas iguales)
const duplicated = [...logos, ...logos];

export const LogoSlider = () => {
  // 1) VELOCIDAD + DIRECCIÓN
  // Dirección a la DERECHA (pedido tuyo). Ajustá duration para más rápido/lento.
  const LOOP_DURATION = 28; // segundos por ciclo completo

  // 7) DRAG SCRUB: arrastre manual mientras está pausado
  const [isPaused, setIsPaused] = useState(false);
  const [isInView, setIsInView] = useState(true); // extra: pausa fuera de viewport
  const hoveredIndexRef = useRef<number | null>(null);

  // Controles framer para la banda base (auto-movimiento)
  const controls = useAnimation();

  // Contenedor para medir ancho y calcular offset de wrap
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  // Offset de drag manual (se aplica sobre el auto-movimiento)
  const dragX = useMotionValue(0);

  // Iniciar / detener auto-loop
  const startLoop = async () => {
    // Animación infinita de 0% a +50% y volver (porque duplicamos banda)
    // Hacemos dos keyframes para que sea perfectamente linear y reiniciable.
    await controls.start({
      // Movemos medio track hacia la DERECHA (para que "entre" la segunda banda)
      x: ["0%", "50%"],
      transition: {
        duration: LOOP_DURATION,
        ease: "linear",
        repeat: Infinity,
      },
    });
  };

  const stopLoop = () => {
    controls.stop();
  };

  // 2) LOOP INFINITO SIN SALTOS + 8) FADE EN BORDES + PAUSA AL HOVER
  useEffect(() => {
    if (!isPaused && isInView) {
      startLoop();
    } else {
      stopLoop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaused, isInView]);

  // EXTRA: pausa la animación si el slider sale del viewport
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        setIsInView(entries[0]?.isIntersecting ?? true);
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // 7) DRAG: solo habilitamos drag cuando está pausado (hover o focus)
  const handlePointerDown: React.PointerEventHandler<HTMLDivElement> = () => {
    // al comenzar drag, pausamos y dejamos que el usuario “scrubee”
    if (!isPaused) setIsPaused(true);
  };

  const handlePointerUp: React.PointerEventHandler<HTMLDivElement> = () => {
    // al soltar, reanudamos el loop
    setIsPaused(false);
    // reseteo suave del drag offset para no acumular
    dragX.stop();
    dragX.set(0);
  };

  return (
    <div className="relative w-full py-8">
      {/* 8) Fade en bordes con mask (suave). Removelo si preferís sin máscara. */}
      <div
        ref={viewportRef}
        className="relative w-full overflow-hidden"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,.35) 4%, rgba(0,0,0,1) 12%, rgba(0,0,0,1) 88%, rgba(0,0,0,.35) 96%, rgba(0,0,0,0) 100%)",
          maskImage:
            "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,.35) 4%, rgba(0,0,0,1) 12%, rgba(0,0,0,1) 88%, rgba(0,0,0,.35) 96%, rgba(0,0,0,0) 100%)",
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          setIsPaused(false);
          hoveredIndexRef.current = null;
        }}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
      >
        {/* TRACK externo: auto-movimiento */}
        <motion.div
          ref={trackRef}
          className="flex gap-14"
          animate={controls}
          style={{ x: dragX }} // 7) el drag suma offset al auto-movimiento
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={(e) => {
            // si el usuario suelta fuera, igual reanudamos
            if ((e as any).buttons === 0) handlePointerUp(e as any);
          }}
          drag={isPaused ? "x" : false}
          dragConstraints={{ left: -Infinity, right: Infinity }}
          dragElastic={0}
          dragMomentum={false}
        >
          {/* Doble banda para loop sin cortes: */}
          {duplicated.map((item, index) => (
            <motion.a
              key={index}
              href={item.href || undefined}
              target={item.href ? "_blank" : undefined}
              rel={item.href ? "noopener noreferrer" : undefined}
              role={item.href ? "link" : undefined}
              aria-label={item.alt}
              className="relative flex-shrink-0 w-36 h-16 md:w-40 md:h-20 flex items-center justify-center outline-none"
              onMouseEnter={() => (hoveredIndexRef.current = index)}
              onMouseLeave={() => (hoveredIndexRef.current = null)}
              whileHover={{ scale: 1.12 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <img
                src={item.src}
                alt={item.alt}
                className="max-w-full max-h-full object-contain transition-all duration-300"
                style={{
                  filter:
                    hoveredIndexRef.current === index
                      ? "brightness(0) invert(1) drop-shadow(0 0 10px rgba(255,255,255,0.85))"
                      : "brightness(0) invert(0.75)",
                }}
              />
            </motion.a>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
