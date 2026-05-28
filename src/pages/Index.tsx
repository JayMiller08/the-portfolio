import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { Layout } from "@/components/Layout";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Media } from "@/components/Media";
import { Contact } from "@/components/Contact";
import { JavaTutorialPopup } from "@/components/JavaTutorialPopup";

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
    <Layout>
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Media />
      <Contact />
      <JavaTutorialPopup />
    </Layout>
  );
};

export default Index;
