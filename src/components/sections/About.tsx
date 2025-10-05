import { motion } from "framer-motion";
import { LogoSlider } from "@/components/LogoSlider";
import { useLanguage } from "@/contexts/LanguageContext";

export const About = () => {
  const { t } = useLanguage();

  return (
    <section
      id="about"
      className="min-h-screen flex items-center justify-center px-6 py-20"
      style={{ scrollMarginTop: "120px" }}
      aria-labelledby="about-heading"
    >
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="space-y-12"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="glass rounded-2xl p-8 space-y-4">
              <h2 id="about-heading" className="text-4xl font-bold text-primary">
                {t.about.title}
              </h2>
              <h3 className="text-2xl font-semibold" style={{
                background: "var(--gradient-primary)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                {t.about.subtitle}
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t.about.description}
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center"
            >
              <div className="relative w-64 h-64 rounded-full glass glow-primary flex items-center justify-center">
                <div 
                  className="absolute inset-4 rounded-full"
                  style={{
                    background: "var(--gradient-primary)",
                    filter: "blur(20px)",
                  }}
                />
                <div className="relative z-10 text-6xl font-bold" style={{
                  background: "var(--gradient-primary)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  AI
                </div>
              </div>
            </motion.div>
          </div>

          <div className="glass rounded-2xl p-8 space-y-6">
            <h3 className="text-2xl font-bold text-center" style={{
              background: "var(--gradient-primary)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              {t.about.partners}
            </h3>
            <LogoSlider />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
