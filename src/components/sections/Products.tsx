import { motion } from "framer-motion";
import { Package, Wrench, Cpu, Settings, Plug, Scissors, CircleDot, Cog } from "lucide-react";

const products = [
  {
    icon: Package,
    code: "X",
    title: "Envasado",
    description: "Sistemas automatizados de envasado industrial de alta precisión",
  },
  {
    icon: Wrench,
    code: "R",
    title: "Soldadura",
    description: "Tecnología robótica avanzada para soldadura de precisión",
  },
  {
    icon: Cpu,
    code: "A",
    title: "Brazos Robóticos",
    description: "Brazos robóticos articulados para aplicaciones industriales complejas",
  },
  {
    icon: Settings,
    code: "S",
    title: "Sistemas de Control",
    description: "Sistemas inteligentes de control y automatización industrial",
  },
  {
    icon: Plug,
    code: "P",
    title: "Periféricos",
    description: "Equipamiento y soporte complementario para sistemas automatizados",
  },
  {
    icon: Scissors,
    code: "C",
    title: "CNC – Corte",
    description: "Maquinaria CNC de corte de alta precisión y velocidad",
  },
  {
    icon: CircleDot,
    code: "T",
    title: "CNC – Torneado",
    description: "Tornos CNC automatizados para manufactura de precisión",
  },
  {
    icon: Cog,
    code: "F",
    title: "CNC – Fresado",
    description: "Fresadoras CNC de última generación para mecanizado complejo",
  },
  {
    icon: Settings,
    code: "M",
    title: "CNC – Mecanizado",
    description: "Centros de mecanizado CNC multifuncionales de alto rendimiento",
  },
];

export const Products = () => {
  return (
    <section 
      id="products" 
      className="min-h-screen flex items-center justify-center px-6 py-20"
      style={{ scrollMarginTop: "120px" }}
      aria-labelledby="products-heading"
    >
      <div className="max-w-6xl w-full">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          id="products-heading"
          className="text-5xl font-bold text-center mb-16 text-foreground"
          style={{ textShadow: "0 0 30px rgba(108, 99, 255, 0.4)" }}
        >
          Our Products
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6">
          {products.map((product, index) => {
            const Icon = product.icon;
            return (
              <motion.div
                key={product.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="glass rounded-2xl p-6 hover:scale-103 transition-all duration-300
                         hover:shadow-[0_0_40px_rgba(255,77,210,0.4)] cursor-pointer group"
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="relative">
                    <div className="p-4 rounded-xl bg-primary/10 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:via-fuchsia group-hover:to-cyan transition-all">
                      <Icon className="w-10 h-10 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia to-cyan flex items-center justify-center text-xs font-bold text-white">
                      {product.code}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
