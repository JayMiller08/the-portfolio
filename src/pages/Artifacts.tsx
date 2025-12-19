import { useState } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArtifactCard, Artifact } from "@/components/ArtifactCard";
import { EmailCaptureModal } from "@/components/EmailCaptureModal";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

// Sample artifacts data
const artifacts: Artifact[] = [
  {
    id: "1",
    title: "Java Mastery Cheatsheet",
    description:
      "A comprehensive quick-reference guide covering Java fundamentals, OOP concepts, data structures, and common patterns. Perfect for interview prep!",
    type: "pdf",
    tag: "Java",
    url: "/resources/java-cheatsheet.pdf",
  },
  {
    id: "2",
    title: "Portfolio UI Kit",
    description:
      "My custom Figma design system with reusable components, color tokens, and layouts. Use it to build your own stunning portfolio.",
    type: "figma",
    tag: "Design",
    url: "https://figma.com/community",
  },
  {
    id: "3",
    title: "2025 Developer Roadmap",
    description:
      "Watch my breakdown of the skills, tools, and technologies you need to master in 2025 to land your dream dev job.",
    type: "video",
    tag: "Career",
    url: "https://www.tiktok.com/@jaymiller08",
  },
  {
    id: "4",
    title: "React Hooks Deep Dive",
    description:
      "A detailed guide explaining useState, useEffect, useContext, and custom hooks with practical examples for beginners.",
    type: "pdf",
    tag: "React",
    url: "/resources/react-hooks-guide.pdf",
  },
  {
    id: "5",
    title: "Coding Interview Prep Playlist",
    description:
      "Curated YouTube playlist with 20+ videos covering DSA, system design basics, and behavioral interview tips.",
    type: "link",
    tag: "Career",
    url: "https://youtube.com/playlist",
  },
  {
    id: "6",
    title: "Git & GitHub Essentials",
    description:
      "Everything you need to know about version control: branching, merging, PRs, and collaboration workflows explained simply.",
    type: "pdf",
    tag: "Tools",
    url: "/resources/git-essentials.pdf",
  },
];

const ArtifactsHeader = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-lg">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to Portfolio</span>
        </Link>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </nav>
    </header>
  );
};

const ArtifactsPage = () => {
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAccessClick = (artifact: Artifact) => {
    // Check if user already has access
    if (localStorage.getItem("artifacts_email_captured") === "true") {
      // Direct access
      if (artifact.type === "pdf") {
        const link = document.createElement("a");
        link.href = artifact.url;
        link.download = artifact.title;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        window.open(artifact.url, "_blank");
      }
    } else {
      // Show email capture modal
      setSelectedArtifact(artifact);
      setIsModalOpen(true);
    }
  };

  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen bg-background text-foreground">
        <ArtifactsHeader />

        <main className="container mx-auto px-4 py-12 md:py-20">
          {/* Hero Section */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Free Resources
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              The <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Vault</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Curated resources to accelerate your coding journey. From cheatsheets to video tutorials — everything you need to level up.
            </p>
          </div>

          {/* Artifacts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {artifacts.map((artifact) => (
              <ArtifactCard
                key={artifact.id}
                artifact={artifact}
                onAccessClick={handleAccessClick}
              />
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16 p-8 rounded-2xl bg-muted/50 border border-border">
            <h2 className="text-2xl font-bold mb-2">Want more resources?</h2>
            <p className="text-muted-foreground mb-6">
              Follow me on TikTok for daily coding tips and tutorials!
            </p>
            <Button variant="hero" size="lg" asChild>
              <a
                href="https://www.tiktok.com/@jaymiller08"
                target="_blank"
                rel="noopener noreferrer"
              >
                Follow on TikTok
              </a>
            </Button>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border py-8">
          <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
            <p>© {new Date().getFullYear()} Jay Mthethwa. All rights reserved.</p>
          </div>
        </footer>

        {/* Email Capture Modal */}
        {selectedArtifact && (
          <EmailCaptureModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedArtifact(null);
            }}
            resourceTitle={selectedArtifact.title}
            resourceUrl={selectedArtifact.url}
            resourceType={selectedArtifact.type}
          />
        )}
      </div>
    </ThemeProvider>
  );
};

export default ArtifactsPage;