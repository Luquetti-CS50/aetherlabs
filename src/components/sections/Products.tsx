import { motion } from "framer-motion";
import { Cpu, Zap, Shield, Sparkles } from "lucide-react";

const products = [
  {
    icon: Cpu,
    title: "Neural Engine",
    description: "Advanced AI processing for real-time decision making",
  },
  {
    icon: Zap,
    title: "Quantum Core",
    description: "Next-generation computational power at your fingertips",
  },
  {
    icon: Shield,
    title: "SecureNet",
    description: "Military-grade security infrastructure for your systems",
  },
  {
    icon: Sparkles,
    title: "AutoFlow",
    description: "Seamless automation workflows that adapt to your needs",
  },
];

export const Products = () => {
  return (
    <section 
      id="products" 
      className="min-h-screen flex items-center justify-center px-6 py-20"
      style={{ scrollMarginTop: "80px" }}
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

        <div className="grid md:grid-cols-2 gap-8">
          {products.map((product, index) => {
            const Icon = product.icon;
            return (
              <motion.div
                key={product.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass rounded-2xl p-8 hover:scale-103 transition-all duration-300
                         hover:shadow-[0_0_40px_rgba(108,99,255,0.4)] cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
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
