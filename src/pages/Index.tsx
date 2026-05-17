import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Media } from "@/components/Media";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { CareerFrameworkPopup } from "@/components/CareerFrameworkPopup";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      // A small timeout ensures the page has rendered the sections before scrolling
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, [location.hash]);

  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main>
          <Hero />
          <About />
          <Projects />
          <Skills />
          <Media />
          <Contact />
        </main>
        <Footer />
        <CareerFrameworkPopup />
      </div>
    </ThemeProvider>
  );
};

export default Index;
