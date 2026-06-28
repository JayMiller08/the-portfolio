import { motion } from "framer-motion";
import { Github, TrendingUp, Code2, Star, Users, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

interface GitHubStats {
  publicRepos: number;
  followers: number;
  totalStars: number;
  topLanguages: { name: string; percentage: number }[];
}

interface GitHubRepo {
  stargazers_count: number;
  language: string | null;
}

export const Hero = () => {
  const [stats, setStats] = useState<GitHubStats>({
    publicRepos: 48,
    totalStars: 8,
    followers: 7,
    topLanguages: [{ name: "TypeScript", percentage: 100 }]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        const userResponse = await fetch("https://api.github.com/users/JayMiller08");
        const userData = await userResponse.json();

        const reposResponse = await fetch("https://api.github.com/users/JayMiller08/repos?per_page=100");
        const reposData = await reposResponse.json();

        const totalStars = reposData.reduce((acc: number, repo: GitHubRepo) => acc + repo.stargazers_count, 0);

        const languageCounts: Record<string, number> = {};
        reposData.forEach((repo: GitHubRepo) => {
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
          publicRepos: 48,
          followers: 7,
          totalStars: 8,
          topLanguages,
        });
      } catch (error) {
        console.error("Error fetching GitHub stats:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchGitHubStats();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative overflow-visible bg-white pt-2 pb-16">
      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 bg-transparent pt-0 mt-0">
        <div className="max-w-6xl mx-auto relative bg-transparent pt-0 mt-0">
          {/* Absolute Digital Tools Badge */}
          <div className="absolute top-0 right-0 z-20">
            <a
              href="/artifacts"
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-neutral-100 border border-neutral-200 text-xs text-neutral-600 font-semibold hover:bg-neutral-200 hover:scale-105 hover:shadow-md hover:shadow-neutral-300/50 transition-all duration-300 ease-in-out group shadow-sm"
            >
              <span>Digital Tools</span>
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white border border-neutral-200 text-neutral-800 shadow-sm group-hover:translate-x-1 transition-transform duration-300">
                <ArrowRight className="h-3 w-3" />
              </div>
            </a>
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-8 items-center pt-4 mt-0 bg-transparent">
            {/* Left Column (Content) */}
            <div className="lg:col-span-1 flex flex-col text-left pt-0 mt-0 bg-transparent relative z-10 animate-fade-in-up w-full">
              <motion.div
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 border border-neutral-200 mb-6 w-fit mx-auto lg:mx-0">
                  <Code2 className="h-4 w-4 text-neutral-800" />
                  <span className="text-sm font-semibold text-neutral-800">Available for freelance & internships</span>
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl lg:whitespace-nowrap font-black mb-6 text-neutral-950 tracking-tight leading-none select-none text-center lg:text-left">
                  <span className="inline-block">
                    {"Jay".split("").map((letter, index) => (
                      <span key={`jay-${index}`} className="pulsate-hover">
                        {letter}
                      </span>
                    ))}
                  </span>
                  {"\u00A0"}
                  <span className="inline-block">
                    {"Mthethwa".split("").map((letter, index) => (
                      <span key={`mth-${index}`} className="pulsate-hover">
                        {letter}
                      </span>
                    ))}
                  </span>
                </h1>

                <p className="text-xl md:text-2xl text-neutral-800 mb-4 font-semibold text-center lg:text-left">
                  Java Dev • React Learner • Tech Storyteller
                </p>

                <p className="text-base md:text-lg text-neutral-600 mb-8 max-w-xl text-center lg:text-left mx-auto lg:mx-0">
                  Building and teaching, documenting the journey into freelance web development,
                  and creating educational content for South African teens.
                </p>

                <div className="flex flex-wrap gap-4 items-center justify-center lg:justify-start mb-8 bg-transparent">
                  <Button
                    variant="hero"
                    size="lg"
                    onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    View Projects
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <a href="https://github.com/JayMiller08" target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-5 w-5" />
                      GitHub
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <a href="/affiliates">
                      <Users className="mr-2 h-5 w-5" />
                      Affiliates
                    </a>
                  </Button>
                </div>

                {/* GitHub Stats (Bento Grid) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="grid grid-cols-2 gap-4 lg:grid-cols-4 items-center justify-center w-full"
                >
                  <div className="bg-white border border-neutral-200/60 rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <Github className="h-5 w-5 text-neutral-700" />
                      <p className="text-3xl font-black text-neutral-900">{stats.publicRepos}</p>
                    </div>
                    <p className="text-sm text-neutral-500 font-medium">Total Repositories</p>
                  </div>

                  <div className="bg-white border border-neutral-200/60 rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-5 w-5 text-neutral-700" />
                      <p className="text-3xl font-black text-neutral-900">{stats.totalStars}</p>
                    </div>
                    <p className="text-sm text-neutral-500 font-medium">Total Stars</p>
                  </div>

                  <div className="bg-white border border-neutral-200/60 rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-neutral-700" />
                      <p className="text-3xl font-black text-neutral-900">{stats.followers}</p>
                    </div>
                    <p className="text-sm text-neutral-500 font-medium">Followers</p>
                  </div>

                  <div className="bg-white border border-neutral-200/60 rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all duration-300">
                    <div className="mb-2">
                      <p className="text-lg md:text-xl font-black text-neutral-900 tracking-tight pt-1">
                        {stats.topLanguages[0]?.name || "TypeScript"}
                      </p>
                    </div>
                    <p className="text-sm text-neutral-500 font-medium">Top language</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Right Column (Image) */}
            <div className="hidden lg:flex lg:col-span-1 flex-col justify-end items-center lg:items-end bg-transparent overflow-visible animate-fade-in-up w-full">
              <img
                src="/images/jay.jpg"
                alt="Jay Mthethwa"
                className="w-[70%] max-w-[260px] mx-auto lg:w-full lg:max-w-[450px] lg:ml-auto h-auto object-contain mix-blend-multiply"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
