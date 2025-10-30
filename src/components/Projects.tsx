import { ProjectCard } from "./ProjectCard";

export const Projects = () => {
  const featuredProjects = [
    {
      title: "Smart Farm",
      description: "Precision agriculture application integrating IoT concepts for modern farming management and monitoring.",
      technologies: ["Java", "IoT", "Data Management", "Agriculture Tech"],
      githubUrl: "https://github.com/JayMiller08/smart-farm01",
      features: [
        "IoT device integration for farm monitoring",
        "Real-time data collection and analysis",
        "Smart resource management system",
        "User-friendly dashboard interface",
      ],
    },
    {
      title: "ATM Simulator",
      description: "Full-featured banking application simulator demonstrating core Java concepts and object-oriented programming principles.",
      technologies: ["Java", "OOP", "Data Structures", "Banking Logic"],
      githubUrl: "https://github.com/JayMiller08/ATM-Simulator",
      features: [
        "Account management (create, view, update)",
        "Secure transaction processing",
        "Balance inquiry and withdrawal systems",
        "User authentication and validation",
      ],
    },
  ];

  return (
    <section id="projects" className="py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Featured <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Projects</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Showcasing my journey from Java fundamentals to real-world applications
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={project.title} {...project} index={index} />
            ))}
          </div>

          <div className="text-center">
            <a 
              href="https://github.com/JayMiller08?tab=repositories" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-accent hover:text-accent/80 font-medium text-lg group"
            >
              View all projects on GitHub
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
