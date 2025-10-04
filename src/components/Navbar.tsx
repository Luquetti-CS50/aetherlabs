import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  isVisible: boolean;
}

const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "products", label: "Products" },
  { id: "contact", label: "Contact Us" },
];

export const Navbar = ({ activeSection, onNavigate, isVisible }: NavbarProps) => {
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
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.h2 
            className="text-2xl font-bold text-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Aether Industries
          </motion.h2>
          
          <ul className="flex gap-8">
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
                    relative text-lg font-medium transition-all duration-300
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
