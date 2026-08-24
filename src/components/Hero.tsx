import { motion } from "framer-motion";
import { Github, Code2, Users, ArrowRight, CalendarDays, Braces, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { StatRow } from "./StatRow";
import { ReachStats } from "./ReachStats";
import { useGitHubStats } from "@/hooks/useGitHubStats";

export type HeroVariant = "landing" | "dev" | "creator";

interface HeroCopy {
  badge: string;
  tagline: string;
  intro: string;
}

/**
 * One hero, three emphases. Every claim here traces to a fact stated elsewhere
 * on the site: year of study, the Zaio contract, and StudentOS.
 */
const COPY: Record<HeroVariant, HeroCopy> = {
  landing: {
    badge: "Available for freelance & internships",
    tagline: "Web developer & content creator",
    intro:
      "Third-year Computer Science student at Tshwane University of Technology. I build web applications, and I create tech education content on contract for Zaio Institute of Technology.",
  },
  dev: {
    badge: "Available for junior developer roles & internships",
    tagline: "Junior web developer",
    intro:
      "Third-year Computer Science student at Tshwane University of Technology. I build full-stack web applications, most recently StudentOS: a React, TypeScript and Supabase PWA.",
  },
  creator: {
    badge: "On contract with Zaio Institute of Technology",
    tagline: "Social media content creator",
    intro:
      "I write, shoot and edit short-form tech education for South African students, on contract for Zaio Institute of Technology and on my own channel.",
  },
};

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

export const Hero = ({ variant = "landing" }: { variant?: HeroVariant }) => {
  const { stats } = useGitHubStats();
  const copy = COPY[variant];

  // Stars, followers and following are deliberately not surfaced: they are small
  // numbers that read as achievements when displayed this prominently.
  const githubItems = [
    { icon: Github, value: String(stats.publicRepos), label: "Total repositories" },
    { icon: Braces, value: stats.topLanguage, label: "Top language", variant: "text" as const },
    { icon: CalendarDays, value: String(stats.memberSince), label: "On GitHub since" },
  ];

  const showGitHub = variant === "landing" || variant === "dev";
  const showReach = variant === "landing" || variant === "creator";

  return (
    <section className="relative overflow-visible bg-white pt-2 pb-16">
      <div className="container relative z-10 mx-auto px-4 bg-transparent pt-0 mt-0">
        <div className="max-w-6xl mx-auto relative bg-transparent pt-0 mt-0">
          <div className="absolute top-0 right-0 z-20">
            <Link
              to="/artifacts"
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-neutral-100 border border-neutral-200 text-xs text-neutral-700 font-semibold hover:bg-neutral-200 motion-safe:hover:scale-105 hover:shadow-md transition-all duration-300 ease-in-out group shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            >
              <span>Digital Tools</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white border border-neutral-200 text-neutral-800 shadow-sm motion-safe:group-hover:translate-x-1 transition-transform duration-300">
                <ArrowRight aria-hidden="true" className="h-3 w-3" />
              </span>
            </Link>
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-8 items-center pt-4 mt-0 bg-transparent">
            <div className="lg:col-span-1 flex flex-col text-left pt-0 mt-0 bg-transparent relative z-10 w-full">
              <motion.div
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 border border-neutral-200 mb-6 w-fit mx-auto lg:mx-0">
                  <Code2 aria-hidden="true" className="h-4 w-4 text-neutral-800" />
                  <span className="text-sm font-semibold text-neutral-800">{copy.badge}</span>
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl lg:whitespace-nowrap font-black mb-6 text-neutral-950 tracking-tight leading-none select-none text-center lg:text-left">
                  <span className="inline-block">
                    {"Jay".split("").map((letter, index) => (
                      <span key={"jay-" + index} className="pulsate-hover">
                        {letter}
                      </span>
                    ))}
                  </span>
                  {" "}
                  <span className="inline-block">
                    {"Mthethwa".split("").map((letter, index) => (
                      <span key={"mth-" + index} className="pulsate-hover">
                        {letter}
                      </span>
                    ))}
                  </span>
                </h1>

                <p className="text-xl md:text-2xl text-neutral-800 mb-4 font-semibold text-center lg:text-left">
                  {copy.tagline}
                </p>

                <p className="text-base md:text-lg text-neutral-600 mb-8 max-w-xl text-center lg:text-left mx-auto lg:mx-0">
                  {copy.intro}
                </p>

                <div className="flex flex-wrap gap-4 items-center justify-center lg:justify-start mb-8 bg-transparent">
                  {variant === "creator" ? (
                    <Button variant="hero" size="lg" onClick={() => scrollTo("media")}>
                      <Play aria-hidden="true" className="mr-2 h-5 w-5" />
                      Watch the work
                    </Button>
                  ) : (
                    <Button variant="hero" size="lg" onClick={() => scrollTo("projects")}>
                      View Projects
                    </Button>
                  )}

                  {variant === "creator" ? (
                    <Button variant="outline" size="lg" asChild>
                      <a href="https://www.tiktok.com/@realjaycoding" target="_blank" rel="noopener noreferrer">
                        TikTok
                      </a>
                    </Button>
                  ) : (
                    <Button variant="outline" size="lg" asChild>
                      <a href="https://github.com/JayMiller08" target="_blank" rel="noopener noreferrer">
                        <Github aria-hidden="true" className="mr-2 h-5 w-5" />
                        GitHub
                      </a>
                    </Button>
                  )}

                  {variant === "landing" && (
                    <Button variant="outline" size="lg" asChild>
                      <Link to="/affiliates">
                        <Users aria-hidden="true" className="mr-2 h-5 w-5" />
                        Affiliates
                      </Link>
                    </Button>
                  )}
                </div>

                <div className="space-y-6 w-full">
                  {showGitHub && (
                    <StatRow items={githubItems} ariaLabel="GitHub activity" className="w-full" />
                  )}
                  {showReach && <ReachStats className="w-full" />}
                </div>
              </motion.div>
            </div>

            <div className="hidden lg:flex lg:col-span-1 flex-col justify-end items-center lg:items-end bg-transparent overflow-visible w-full">
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
