import { motion } from "framer-motion";
import { Github, TrendingUp, Code2, Star } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import heroBg from "@/assets/hero-bg.jpg";

interface GitHubStats {
  publicRepos: number;
  followers: number;
  totalStars: number;
  topLanguages: { name: string; percentage: number }[];
}

export const Hero = () => {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        const userResponse = await fetch("https://api.github.com/users/JayMiller08");
        const userData = await userResponse.json();

        const reposResponse = await fetch("https://api.github.com/users/JayMiller08/repos?per_page=100");
        const reposData = await reposResponse.json();

        const totalStars = reposData.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0);

        const languageCounts: Record<string, number> = {};
        reposData.forEach((repo: any) => {
          if (repo.language) {
            languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
          }
        });

        const total = Object.values(languageCounts).reduce((a: number, b: number) => a + b, 0);
        const topLanguages = Object.entries(languageCounts)
          .map(([name, count]) => ({
            name,
            percentage: Math.round((count / total) * 100),
          }))
          .sort((a, b) => b.percentage - a.percentage)
          .slice(0, 3);

        setStats({
          publicRepos: userData.public_repos,
          followers: userData.followers,
          totalStars,
          topLanguages,
        });
      } catch (error) {
        console.error("Error fetching GitHub stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubStats();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 backdrop-blur-sm border border-border mb-6">
              <Code2 className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">Available for freelance & internships</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-accent to-primary bg-clip-text text-transparent">
              Jay Mthethwa
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-4 font-medium">
              Java Dev • React Learner • Tech Storyteller
            </p>

            <p className="text-base md:text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
              Building and teaching, documenting the journey into freelance web development, 
              and creating educational content for South African teens.
            </p>

            <div className="flex flex-wrap gap-4 justify-center mb-16">
              <Button variant="hero" size="lg" onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}>
                View Projects
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="https://github.com/JayMiller08" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-5 w-5" />
                  GitHub
                </a>
              </Button>
            </div>

            {/* GitHub Stats */}
            {!loading && stats && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
              >
                <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:bg-card/70 transition-colors">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Github className="h-5 w-5 text-primary" />
                    <p className="text-3xl font-bold text-foreground">{stats.publicRepos}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Repositories</p>
                </div>

                <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:bg-card/70 transition-colors">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Star className="h-5 w-5 text-secondary" />
                    <p className="text-3xl font-bold text-foreground">{stats.totalStars}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Total Stars</p>
                </div>

                <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:bg-card/70 transition-colors">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-accent" />
                    <p className="text-3xl font-bold text-foreground">{stats.followers}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>

                <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:bg-card/70 transition-colors">
                  <div className="mb-2">
                    <p className="text-2xl font-bold text-foreground">
                      {stats.topLanguages[0]?.name || "Java"}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">Top Language</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
