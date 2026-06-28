import { ProjectCard } from "./ProjectCard";

export const Projects = () => {
  const featuredProjects = [
    {
      title: "The Portfolio",
      description: "My personal portfolio website showcasing my skills, projects, and journey as a developer.",
      technologies: ["React", "TypeScript", "Vite", "Tailwind CSS"],
      githubUrl: "https://github.com/JayMiller08/the-portfolio",
      liveUrl: "https://jaymthethwa.vercel.app/",
      features: [
        "Dynamic GitHub stats fetching",
        "Modern and responsive design",
        "Project showcase",
        "Smooth animations",
      ],
    },
    {
      title: "90 Day Journal",
      description: "A comprehensive daily journaling application designed to help users track their thoughts, goals, and progress over a 90-day period.",
      technologies: ["React", "TypeScript", "Vite", "Tailwind CSS"],
      githubUrl: "https://github.com/JayMiller08/90-Day-Journal",
      features: [
        "Daily entry tracking",
        "Progress visualization",
        "Goal setting and monitoring",
        "Responsive user interface",
      ],
    },
    {
      title: "Bank Management System",
      description: "A robust banking application demonstrating core Java concepts, object-oriented programming, and secure data handling.",
      technologies: ["Java", "OOP", "Banking Logic"],
      githubUrl: "https://github.com/JayMiller08/bank-management-system",
      features: [
        "Account creation and management",
        "Secure transaction processing",
        "Balance inquiry and withdrawal",
        "User authentication",
      ],
    },
    {
      title: "Thenga Bay",
      description: "A modern e-commerce platform built with TypeScript, offering a seamless shopping experience.",
      technologies: ["React", "TypeScript", "Tailwind CSS"],
      githubUrl: "https://github.com/JayMiller08/thenga-bay",
      features: [
        "Product catalog and search",
        "Shopping cart management",
        "User authentication",
        "Responsive design",
      ],
    },
  ];

  const contributedProjects = [
    {
      title: "Foundations of Git",
      description: "An interactive exercise repository designed to help developers master Git fundamentals and best practices.",
      technologies: ["Git", "Version Control", "Documentation"],
      githubUrl: "https://github.com/JayMiller08/foundations-of-git-exercise-repo",
      features: [
        "Interactive Git exercises",
        "Best practices documentation",
        "Version control scenarios",
        "Collaborative workflows",
      ],
    },
    {
      title: "Iqembulamanzi Frontend",
      description: "The frontend interface for the Iqembulamanzi project, built to provide an intuitive user experience.",
      technologies: ["JavaScript", "Frontend Development", "UI/UX"],
      githubUrl: "https://github.com/JayMiller08/iqembulamanzi-frontend",
      features: [
        "Responsive user interface",
        "Dynamic content rendering",
        "API integration",
        "State management",
      ],
    },
    {
      title: "Iqembulamanzi Backend",
      description: "The backend server and API for the Iqembulamanzi project, handling data processing and business logic.",
      technologies: ["JavaScript", "Node.js", "Backend Architecture"],
      githubUrl: "https://github.com/JayMiller08/iqembulamanzi-backend",
      features: [
        "RESTful API design",
        "Database integration",
        "Authentication & authorization",
        "Data validation",
      ],
    },
  ];

  return (
    <section id="projects" className="py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-center text-neutral-950 tracking-tight">
            Featured Projects
          </h2>
          <p className="text-center text-neutral-500 mb-12 text-lg font-medium">
            Showcasing my latest work
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-24">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={project.title} {...project} index={index} />
            ))}
          </div>

          <h2 className="text-4xl md:text-5xl font-black mb-4 text-center text-neutral-950 tracking-tight">
            Contributed to
          </h2>
          <p className="text-center text-neutral-500 mb-12 text-lg font-medium">
            Open source projects and collaborations
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {contributedProjects.map((project, index) => (
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
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
