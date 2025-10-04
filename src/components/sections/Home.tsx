import { motion } from "framer-motion";

export const Home = () => {
  return (
    <section 
      id="home" 
      className="min-h-screen flex items-center justify-center px-6"
      style={{ scrollMarginTop: "80px" }}
      aria-labelledby="home-heading"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full glass rounded-2xl p-12 text-center
                   hover:scale-103 transition-transform duration-300 glow-primary"
      >
        <h2 id="home-heading" className="text-4xl font-bold mb-6 text-primary">
          Home Block
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Welcome to the heart of Aether Industries. We are pioneering the future of
          automation technology with cutting-edge solutions that transform industries
          and elevate human potential.
        </p>
      </motion.div>
    </section>
  );
};
