import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export const Home = () => {
  const { t } = useLanguage();

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center px-6 py-20"
      style={{ scrollMarginTop: "80px" }}
      aria-labelledby="home-heading"
    >
      <div className="container mx-auto flex items-center justify-center max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="w-full glass rounded-2xl p-6 md:p-10 lg:p-12 text-center
                     hover:scale-103 transition-transform duration-300 glow-primary"
        >
          <AnimatePresence mode="wait">
            <motion.h2
              key={t.home.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              id="home-heading"
              className="text-3xl md:text-4xl font-bold mb-6 text-primary"
            >
              {t.home.title}
            </motion.h2>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.p
              key={t.home.description}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-base md:text-lg text-muted-foreground leading-relaxed"
            >
              {t.home.description}
            </motion.p>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
