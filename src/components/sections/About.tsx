import { motion } from "framer-motion";

export const About = () => {
  return (
    <section 
      id="about" 
      className="min-h-screen flex items-center justify-center px-6"
      style={{ scrollMarginTop: "120px" }}
      aria-labelledby="about-heading"
    >
      <div className="max-w-6xl w-full">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          id="about-heading"
          className="text-5xl font-bold text-center mb-16 text-foreground"
          style={{ textShadow: "0 0 30px rgba(108, 99, 255, 0.4)" }}
        >
          About Section
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass rounded-2xl p-8 space-y-4"
          >
            <h3 className="text-2xl font-semibold text-primary">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">
              At Aether Industries, we believe in the power of intelligent automation
              to reshape the world. Our mission is to develop sophisticated systems
              that blend precision engineering with artificial intelligence.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We are committed to innovation, sustainability, and creating technology
              that empowers businesses to reach new heights of efficiency and creativity.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center"
          >
            <div 
              className="w-64 h-64 rounded-full glass flex items-center justify-center
                         hover:scale-105 transition-transform duration-300"
              style={{
                boxShadow: "0 0 60px rgba(108, 99, 255, 0.5), inset 0 0 40px rgba(159, 155, 255, 0.2)",
              }}
            >
              <div className="text-center">
                <p className="text-6xl font-bold text-primary animate-glow-pulse">AI</p>
                <p className="text-sm text-accent mt-2 uppercase tracking-wider">Powered</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
