import { useState } from "react";
import { motion } from "framer-motion";
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

const logos = [logo1, logo2, logo3, logo4, logo5, logo6, logo7, logo8, logo9, logo10];

export const LogoSlider = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Duplicate logos for seamless loop
  const duplicatedLogos = [...logos, ...logos];

  return (
    <div className="relative w-full overflow-hidden py-8">
      <div 
        className="flex gap-12"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          setIsPaused(false);
          setHoveredIndex(null);
        }}
      >
        <motion.div
          className="flex gap-12 flex-shrink-0"
          animate={{
            x: isPaused ? undefined : [0, -100 * logos.length + "%"],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {duplicatedLogos.map((logo, index) => (
            <motion.div
              key={index}
              className="relative flex-shrink-0 w-32 h-16 flex items-center justify-center"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              animate={{
                scale: hoveredIndex === index ? 1.15 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={logo}
                alt={`Partner logo ${(index % logos.length) + 1}`}
                className="max-w-full max-h-full object-contain filter brightness-0 invert transition-all duration-300"
                style={{
                  filter: hoveredIndex === index 
                    ? "brightness(0) invert(1) drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))" 
                    : "brightness(0) invert(0.7)",
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
