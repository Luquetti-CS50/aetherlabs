import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import LogoAether from "@/assets/LogoAether.svg";

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  isVisible: boolean;
}

export const Navbar = ({ activeSection, onNavigate, isVisible }: NavbarProps) => {
  const { t } = useLanguage();
  
  const navItems = [
    { id: "home", label: t.nav.home },
    { id: "about", label: t.nav.about },
    { id: "products", label: t.nav.products },
    { id: "contact", label: t.nav.contact },
  ];
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: isVisible ? 0 : -100, opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 glass"
      style={{ 
        background: "rgba(21, 21, 52, 0.8)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="container mx-auto px-3 md:px-6 py-2 md:py-4">
        <div className="flex items-center justify-between">
          <motion.button
            onClick={() => onNavigate("hero")}
            className="flex items-center transition-transform duration-300 hover:scale-105"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            aria-label="Scroll to hero"
          >
            <img src={LogoAether} alt="Aether Industries" className="h-8 md:h-10 lg:h-12 w-auto" />
          </motion.button>
          
          <ul className="flex gap-3 md:gap-6 lg:gap-8">
            {navItems.map((item, index) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`
                    relative text-sm md:text-base lg:text-lg font-medium transition-all duration-300
                    hover:text-primary hover:scale-103
                    ${activeSection === item.id ? "text-primary" : "text-foreground"}
                  `}
                  aria-current={activeSection === item.id ? "page" : undefined}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.span
                      layoutId="activeSection"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary glow-primary"
                      initial={false}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.nav>
  );
};
