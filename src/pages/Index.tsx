import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Home } from "@/components/sections/Home";
import { About } from "@/components/sections/About";
import { Products } from "@/components/sections/Products";
import { Contact } from "@/components/sections/Contact";

const Index = () => {
  const [activeSection, setActiveSection] = useState("hero");
  const [showNavbar, setShowNavbar] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const hasScrolledRef = useRef(false);

  // Scroll spy with IntersectionObserver
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id || "hero";
          setActiveSection(sectionId);
          
          // Update URL hash without jumping
          if (sectionId !== "hero") {
            window.history.replaceState(null, "", `#${sectionId}`);
          } else {
            window.history.replaceState(null, "", window.location.pathname);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Handle initial hash navigation
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          setShowNavbar(true);
          hasScrolledRef.current = true;
        }
      }, 100);
    }
  }, []);

  // Handle first scroll transition
  const handleScrollStart = () => {
    if (!hasScrolledRef.current) {
      hasScrolledRef.current = true;
      setShowTransition(true);
      
      setTimeout(() => {
        setShowNavbar(true);
        setTimeout(() => {
          setShowTransition(false);
        }, 400);
      }, 300);
    }
  };

  // Detect manual scroll
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (window.scrollY > 100 && !hasScrolledRef.current) {
          handleScrollStart();
        }
      }, 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  const handleNavigate = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    
    if (!hasScrolledRef.current) {
      handleScrollStart();
    }
  };

  return (
    <div className="relative">
      {/* Black transition overlay */}
      <AnimatePresence>
        {showTransition && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black z-[100] pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Navbar */}
      <Navbar 
        activeSection={activeSection} 
        onNavigate={handleNavigate}
        isVisible={showNavbar}
      />

      {/* Hero Section */}
      <Hero onScrollStart={handleScrollStart} />

      {/* Main Sections */}
      <Home />
      <About />
      <Products />
      <Contact />
    </div>
  );
};

export default Index;
