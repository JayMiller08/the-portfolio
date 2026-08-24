import { ProjectCard } from "./ProjectCard";

export const Projects = () => {
  const featuredProjects = [
    {
      title: "StudentOS",
      description:
        "University students lose hours every week just deciding what to work on next — assignments, deadlines, budgets and habits scattered across a dozen disconnected apps, with no single source of truth. I built StudentOS to remove that decision fatigue for university students: a mobile-first command center that scores every task against urgency, weight, effort and difficulty, then tells them the one thing that matters most right now. It's built with React 19, TypeScript and Vite on the front end, Supabase (Postgres, Auth and Edge Functions) on the back end, and Google Gemini for the AI coach and study-plan generator — shipped as an offline-capable PWA designed to scale to 100,000+ students.",
      technologies: ["React", "TypeScript", "Supabase", "Tailwind CSS", "Gemini AI", "PWA"],
      githubUrl: "https://github.com/JayMiller08/studentos",
      liveUrl: "https://studentos-theta.vercel.app",
      features: [
        "Priority engine that scores every task 0–100 and surfaces the next action",
        "AI coach and Smart Plan scheduler grounded in real deadlines",
        "Reload-proof Pomodoro focus center with deep-work mode",
        "Assignments, planner, calendar, habits, budget and notes in one place",
        "Offline-capable PWA with subscriptions and plan gating",
      ],
    },
    {
      // No repository, stack or feature list here on purpose: my involvement is
      // organisational, and listing any of those would imply I wrote the code.
      title: "AmanziGuard — Iqembulamanzi NPC",
      description:
        "A web-based system that lets community members report sewer incidents and infrastructure damage directly to their local municipality. The municipality dispatches repair crews from the report, and any resident can track the progress of a repair using the incident number issued when it was logged.",
      role: "Deputy Chairperson, Iqembulamanzi NPC (August 2025 – present). Associated with Tshwane University of Technology.",
    },
  ];

  return (
    <section id="projects" className="py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-center text-neutral-950 tracking-tight">
            Projects
          </h2>
          <p className="text-center text-neutral-600 mb-12 text-lg font-medium">
            Showcasing my latest work
          </p>

          <div className="grid lg:grid-cols-2 gap-8 items-stretch mb-12">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={project.title} {...project} index={index} />
            ))}
          </div>

          <div className="text-center">
            <a
              href="https://github.com/JayMiller08?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-neutral-900 hover:text-neutral-600 font-semibold text-base group transition-colors"
            >
              View all projects on GitHub
              <span aria-hidden="true" className="ml-2 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
