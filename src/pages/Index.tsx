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
