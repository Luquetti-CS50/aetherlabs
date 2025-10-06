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
import logo11 from "@/assets/logos/logo-11.png"; // nuevo logo

const logos = [
  { src: logo1, alt: "Partner 1" },
  { src: logo2, alt: "Partner 2" },
  { src: logo3, alt: "Partner 3" },
  { src: logo4, alt: "Partner 4" },
  { src: logo5, alt: "Partner 5" },
  { src: logo6, alt: "Partner 6" },
  { src: logo7, alt: "Partner 7" },
  { src: logo8, alt: "Partner 8" },
  { src: logo9, alt: "Partner 9" },
  { src: logo10, alt: "Partner 10" },
  { src: logo11, alt: "Partner 11" },
];

const duplicated = [...logos, ...logos];

export const LogoSlider = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const controls = useAnimation();
  const dragX = useMotionValue(0);
  const trackRef = useRef<HTMLDivElement>(null);

  // ⏩ velocidad más rápida
  const LOOP_DURATION = 18; // segundos por ciclo

  // Iniciar loop (derecha → izquierda para mantener estructura)
  const startLoop = async () => {
    await controls.start({
      x: ["0%", "-50%"],
      transition: {
        duration: LOOP_DURATION,
        ease: "linear",
        repeat: Infinity,
      },
    });
  };

  const stopLoop = () => controls.stop();

  useEffect(() => {
    if (!isPaused) startLoop();
    else stopLoop();
    return () => controls.stop();
  }, [isPaused]);

  const handlePointerDown = () => {
    setIsPaused(true);
  };

  const handlePointerUp = () => {
    setIsPaused(false);
    dragX.stop();
    dragX.set(0);
  };

  return (
    <div className="relative w-full py-8">
      {/* Máscara para fade en bordes */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,.4) 5%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 85%, rgba(0,0,0,.4) 95%, rgba(0,0,0,0) 100%)",
          maskImage:
            "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,.4) 5%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 85%, rgba(0,0,0,.4) 95%, rgba(0,0,0,0) 100%)",
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          setIsPaused(false);
          setHoveredIndex(null);
        }}
      >
        <motion.div
          ref={trackRef}
          className="flex gap-14 justify-end" // alineado al borde derecho
          animate={controls}
          style={{ x: dragX }}
          drag={isPaused ? "x" : false}
          dragConstraints={{ left: -Infinity, right: Infinity }}
          dragElastic={0.1}
          dragMomentum={false}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={(e) => {
            if ((e as any).buttons === 0) handlePointerUp(e as any);
          }}
        >
          {duplicated.map((logo, index) => (
            <motion.div
              key={index}
              className="relative flex-shrink-0 w-36 h-16 md:w-40 md:h-20 flex items-center justify-center cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              animate={{ scale: hoveredIndex === index ? 1.12 : 1 }}
              transition={{ duration: 0.25 }}
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="max-w-full max-h-full object-contain transition-all duration-300"
                style={{
                  filter:
                    hoveredIndex === index
                      ? "brightness(0) invert(1) drop-shadow(0 0 12px rgba(255,255,255,0.85))"
                      : "brightness(0) invert(0.75)",
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
