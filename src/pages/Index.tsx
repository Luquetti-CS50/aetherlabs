import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Home } from "@/components/sections/Home";
import { About } from "@/components/sections/About";
import { Products } from "@/components/sections/Products";
import { Contact } from "@/components/sections/Contact";

const Index = () => {
  const [activeSection, setActiveSection] = useState("hero");
  const [showNavbar, setShowNavbar] = useState(false);
  const [isHeroActive, setIsHeroActive] = useState(true);

  // Background management
  useEffect(() => {
    if (isHeroActive) {
      document.body.classList.add("hero-active");
      document.body.classList.remove("sections-active");
    } else {
      document.body.classList.remove("hero-active");
      document.body.classList.add("sections-active");
    }
  }, [isHeroActive]);

  // Scroll spy with IntersectionObserver
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id || "hero";
          setActiveSection(sectionId);
          
          // Manage navbar and background based on section
          if (sectionId === "hero") {
            setShowNavbar(false);
            setIsHeroActive(true);
          } else {
            setShowNavbar(true);
            setIsHeroActive(false);
          }
          
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
          setIsHeroActive(false);
        }
      }, 100);
    }
  }, []);

  const handleNavigate = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative">
      {/* Navbar */}
      <Navbar 
        activeSection={activeSection} 
        onNavigate={handleNavigate}
        isVisible={showNavbar}
      />

      {/* Hero Section */}
      <Hero />

      {/* Main Sections */}
      <Home />
      <About />
      <Products />
      <Contact />
    </div>
  );
};

export default Index;
