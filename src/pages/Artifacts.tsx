import { useTheme } from "@/components/ThemeProvider";
import { supabase } from "@/lib/supabaseClient"; // Assuming supabase client is imported from here

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
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchArtifacts();
  }, []);

  const fetchArtifacts = async () => {
    try {
      const { data, error } = await supabase
        .from('artifacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map Supabase data to Artifact interface
      const mappedArtifacts: Artifact[] = (data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        type: item.resource_type.toLowerCase() as any, // Ensure type matches union
        tag: item.tag || 'Resource',
        url: item.file_url,
      }));

      setArtifacts(mappedArtifacts);
    } catch (error) {
      console.error('Error fetching artifacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

      // Increment download count (fire and forget)
      supabase.rpc('increment_download_count', { artifact_id: artifact.id });

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
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {artifacts.map((artifact) => (
                <ArtifactCard
                  key={artifact.id}
                  artifact={artifact}
                  onAccessClick={handleAccessClick}
                />
              ))}
            </div>
          )}

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