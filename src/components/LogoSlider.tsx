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
import logo11 from "@/assets/logos/logo-11.png";

const logos = [
  logo1, logo2, logo3, logo4, logo5,
  logo6, logo7, logo8, logo9, logo10, logo11,
];

const duplicated = [...logos, ...logos];

export const LogoSlider = () => {
  const [hovered, setHovered] = useState<number | null>(null);
  const controls = useAnimation();
  const dragX = useMotionValue(0);
  const [speed, setSpeed] = useState(18); // segundos por ciclo (más bajo = más rápido)
  const baseSpeed = 18;
  const trackRef = useRef<HTMLDivElement>(null);

  // --- función de loop continua (izquierda → derecha)
  const loop = async () => {
    await controls.start({
      x: ["-50%", "0%"],
      transition: {
        duration: speed,
        ease: "linear",
        repeat: Infinity,
      },
    });
  };

  // --- start/stop controlado
  const stopLoop = () => controls.stop();

  useEffect(() => {
    loop();
    return () => controls.stop();
  }, [speed]);

  // --- velocidad dinámica (drag)
  const handleDrag = (_: any, info: any) => {
    const dragVelocity = info.velocity.x;
    const dragSpeed = Math.abs(dragVelocity) / 300; // sensibilidad
    const newSpeed = Math.max(8, Math.min(30, baseSpeed / dragSpeed));
    setSpeed(newSpeed);
  };

  const handleDragEnd = () => {
    // vuelve gradualmente a la velocidad estable
    let frame: number;
    const smooth = () => {
      setSpeed((s) => {
        const next = s + (baseSpeed - s) * 0.05;
        if (Math.abs(next - baseSpeed) > 0.1) frame = requestAnimationFrame(smooth);
        return next;
      });
    };
    smooth();
    return () => cancelAnimationFrame(frame);
  };

  return (
    <div className="relative w-full py-8">
      <div
        className="relative w-full overflow-hidden px-8"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,.5) 10%, rgba(0,0,0,1) 25%, rgba(0,0,0,1) 75%, rgba(0,0,0,.5) 90%, rgba(0,0,0,0) 100%)",
          maskImage:
            "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,.5) 10%, rgba(0,0,0,1) 25%, rgba(0,0,0,1) 75%, rgba(0,0,0,.5) 90%, rgba(0,0,0,0) 100%)",
          pointerEvents: "auto",
        }}
      >
        <motion.div
          ref={trackRef}
          className="flex gap-16 justify-start will-change-transform"
          animate={controls}
          style={{ x: dragX }}
          drag="x"
          dragConstraints={{ left: -Infinity, right: Infinity }}
          dragElastic={0.1}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
        >
          {duplicated.map((src, i) => (
            <motion.div
              key={i}
              className="relative flex-shrink-0 w-36 h-16 md:w-44 md:h-20 flex items-center justify-center select-none"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              animate={{ scale: hovered === i ? 1.12 : 1 }}
              transition={{ duration: 0.25 }}
            >
              <img
                src={src}
                alt={`Logo ${i + 1}`}
                draggable={false}
                className="max-w-full max-h-full object-contain transition-all duration-300 pointer-events-none"
                style={{
                  filter:
                    hovered === i
                      ? "brightness(0) invert(1) drop-shadow(0 0 16px rgba(255,255,255,0.9))"
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
