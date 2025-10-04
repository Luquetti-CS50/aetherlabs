import { motion } from "framer-motion";
import { Instagram, Twitter, Youtube } from "lucide-react";

const socialLinks = [
  {
    icon: Instagram,
    name: "Instagram",
    handle: "@AetherGlobal",
    url: "#",
  },
  {
    icon: Twitter,
    name: "Twitter",
    handle: "@Aether Global",
    url: "#",
  },
  {
    icon: Youtube,
    name: "YouTube",
    handle: "Aether Industries",
    url: "#",
  },
];

export const Social = () => {
  return (
    <section 
      id="social" 
      className="min-h-[50vh] flex items-center justify-center px-6 py-20"
      style={{ scrollMarginTop: "80px" }}
      aria-labelledby="social-heading"
    >
      <div className="max-w-4xl w-full text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          id="social-heading"
          className="text-4xl font-bold mb-12 text-foreground"
          style={{ textShadow: "0 0 30px rgba(108, 99, 255, 0.4)" }}
        >
          Síguenos en Redes Sociales
        </motion.h2>

        <div className="flex justify-center gap-12 flex-wrap">
          {socialLinks.map((social, index) => {
            const Icon = social.icon;
            return (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group flex flex-col items-center gap-3 cursor-pointer"
                aria-label={`Visit our ${social.name}`}
              >
                <div className="relative p-6 rounded-full bg-muted/20 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:via-fuchsia group-hover:to-cyan transition-all duration-300">
                  <Icon className="w-10 h-10 text-muted-foreground group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {social.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {social.handle}
                  </span>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
