import { useTheme } from "@/components/ThemeProvider";
import { ArrowLeft, Sparkles, Sun, Moon, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ProductCard, Product } from "@/components/ProductCard";

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

const digitalProducts: Product[] = [
  {
    id: "ai-framework",
    title: "AI Productivity Framework",
    description: "Boost your efficiency and streamline your workflow with this comprehensive AI productivity framework.",
    downloadUrl: "/AI%20Productivity%20Framework.pdf",
    tag: "Free PDF Guide",
    image: "/images/ai_framework_preview.png"
  },
  {
    id: "software-career",
    title: "Software Developer Career Framework",
    description: "A complete framework to plan, navigate, and accelerate your software development career.",
    downloadUrl: "/software%20career.pdf",
    tag: "Free PDF Guide",
    image: "/images/software_career_preview.png"
  },
  {
    id: "handbook",
    title: "The Beginner Programmers' Survival Handbook",
    description: "A comprehensive guide to help you navigate the early stages of your programming journey.",
    gumroadUrl: "https://realjaycoding.gumroad.com/l/tpdhv",
    tag: "eBook",
    image: "/images/handbook_preview.png"
  },
  {
    id: "playbook",
    title: "The Self-Taught Developer Playbook",
    description: "Your roadmap to becoming a successful self-taught developer.",
    gumroadUrl: "https://realjaycoding.gumroad.com/l/selftaught-dev-playbook",
    tag: "eBook",
    image: "/images/playbook_preview.png"
  },
  {
    id: "notion-os",
    title: "The CS Student Life OS Notion Template",
    description: "Organize your computer science studies and life with this all-in-one Notion template.",
    gumroadUrl: "https://realjaycoding.gumroad.com/l/the-cs-student-life-os",
    previewUrl: "https://cultured-wind-77f.notion.site/The-CS-Student-Life-OS-2dc0625e4ddd803c87e0c147b4280065?pvs=74",
    tag: "Notion Template",
    image: "/images/notion_os_preview.png"
  }
];

const ArtifactsPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ArtifactsHeader />

      <main className="container mx-auto px-4 py-12 md:py-20">

        {/* Digital Products Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              <ShoppingBag className="h-4 w-4" />
              Digital Products
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Premium Resources
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive guides and templates to help you succeed in your developer journey.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {digitalProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 p-8 rounded-2xl bg-muted/50 border border-border">
          <h2 className="text-2xl font-bold mb-2">Want more resources?</h2>
          <p className="text-muted-foreground mb-6">
            Follow me on TikTok for daily coding tips and tutorials!
          </p>
          <Button variant="hero" size="lg" asChild>
            <a
              href="https://www.tiktok.com/@realjaycoding"
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
    </div>
  );
};

export default ArtifactsPage;