import { motion } from "framer-motion";
import { Package, Flame, Gauge, Plug, Box, Circle, Grid3x3, Cog, Wrench } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const productLines = [
  { prefix: "X", icon: Package, key: "x" as const },
  { prefix: "R", icon: Flame, key: "r" as const },
  { prefix: "A", icon: Wrench, key: "a" as const },
  { prefix: "S", icon: Gauge, key: "s" as const },
  { prefix: "P", icon: Plug, key: "p" as const },
  { prefix: "C", icon: Box, key: "c" as const },
  { prefix: "T", icon: Circle, key: "t" as const },
  { prefix: "F", icon: Grid3x3, key: "f" as const },
  { prefix: "M", icon: Cog, key: "m" as const },
];

export const Products = () => {
  const { t } = useLanguage();

  return (
    <section
      id="products"
      className="min-h-screen flex items-center justify-center px-6 py-20"
      style={{ scrollMarginTop: "120px" }}
      aria-labelledby="products-heading"
    >
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="space-y-12"
        >
          <div className="text-center space-y-4">
            <h2 id="products-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary">
              {t.products.title}
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground">
              {t.products.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 md:gap-6 lg:gap-8">
            {productLines.map((product, index) => {
              const Icon = product.icon;
              const lineData = t.products.lines[product.key];

              return (
                <motion.div
                  key={product.prefix}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="glass rounded-2xl p-4 md:p-6 lg:p-8 text-center space-y-2 md:space-y-3 lg:space-y-4
                           hover:scale-105 transition-all duration-300 group
                           hover:shadow-[0_0_30px_rgba(41,255,237,0.3)]"
                >
                  <div className="flex flex-col items-center gap-2 md:gap-3 lg:gap-4">
                    <div className="relative">
                      <div 
                        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: "var(--gradient-primary)",
                          filter: "blur(20px)",
                        }}
                      />
                      <div className="relative z-10 w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full glass flex items-center justify-center">
                        <Icon className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-primary" />
                      </div>
                    </div>

                    <div className="text-2xl md:text-3xl lg:text-4xl font-bold" style={{
                      background: "var(--gradient-primary)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}>
                      {product.prefix}
                    </div>
                  </div>

                  <div className="space-y-1 md:space-y-2">
                    <h3 className="text-sm md:text-base lg:text-xl font-bold text-foreground">
                      {lineData.name}
                    </h3>
                    <p className="text-xs md:text-sm lg:text-lg text-muted-foreground">
                      {lineData.type}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
