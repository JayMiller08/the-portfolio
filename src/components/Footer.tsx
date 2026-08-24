import { Github, Mail, Heart, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Sections live on different routes now, so these are route links rather
  // than bare anchors that would only resolve on the landing page.
  const quickLinks = [
    { label: "Developer work", to: "/dev" },
    { label: "Creator work", to: "/creator" },
    { label: "Resources", to: "/artifacts" },
  ];

  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-xl mb-4 text-neutral-900">Jay Mthethwa</h3>
              <p className="text-muted-foreground text-sm">
                Building, learning, and teaching. Empowering the next generation of South
                African developers.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                {quickLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-muted-foreground hover:text-foreground transition-colors rounded-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex gap-4">
                <a
                  href="https://github.com/JayMiller08"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors rounded-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                  aria-label="GitHub"
                >
                  <Github aria-hidden="true" className="h-5 w-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/kwandumusa-mthethwa/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors rounded-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                  aria-label="LinkedIn"
                >
                  <Linkedin aria-hidden="true" className="h-5 w-5" />
                </a>
                <a
                  href="mailto:realjaycoding@gmail.com"
                  className="text-muted-foreground hover:text-foreground transition-colors rounded-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                  aria-label="Email"
                >
                  <Mail aria-hidden="true" className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p className="flex items-center justify-center gap-1">
              © {currentYear} Jay Mthethwa. Built with{" "}
              <Heart aria-hidden="true" className="h-4 w-4 text-neutral-500" /> using React &amp;
              Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
