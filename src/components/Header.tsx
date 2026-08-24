import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface NavItem {
  label: string;
  to: string;
}

/**
 * Navigation is route-based rather than section-based.
 *
 * Sections no longer all live on "/", so anchors alone cannot reach them.
 * Contact is the exception: every route renders it, so it stays a scroll.
 */
const NAV_ITEMS: NavItem[] = [
  { label: "Developer", to: "/dev" },
  { label: "Creator", to: "/creator" },
  { label: "Resources", to: "/artifacts" },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const goToContact = () => {
    setMobileMenuOpen(false);
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    // Routes without a contact section fall back to the landing page's.
    navigate("/#contact");
  };

  const linkClass = (to: string) =>
    `text-sm font-medium transition-colors rounded-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 ${
      location.pathname === to
        ? "text-neutral-950 font-semibold"
        : "text-neutral-600 hover:text-neutral-950"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-100 bg-white/90 backdrop-blur-md">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4" aria-label="Main">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
        >
          <img src="/icon.png" alt="Jay Mthethwa — home" className="w-8 h-8 object-contain rounded-md" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={linkClass(item.to)}
              aria-current={location.pathname === item.to ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="rounded-full px-5 text-xs font-semibold"
            onClick={goToContact}
          >
            Contact
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? (
              <X aria-hidden="true" className="h-6 w-6 text-neutral-900" />
            ) : (
              <Menu aria-hidden="true" className="h-6 w-6 text-neutral-900" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="absolute top-full left-0 w-full md:hidden border-b border-neutral-100 bg-white/95 backdrop-blur-md shadow-lg"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`${linkClass(item.to)} py-2`}
                aria-current={location.pathname === item.to ? "page" : undefined}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Button variant="outline" size="sm" className="w-full rounded-full" onClick={goToContact}>
              Contact
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
