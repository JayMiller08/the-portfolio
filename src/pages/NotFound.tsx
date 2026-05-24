import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout className="flex flex-col items-center justify-center py-20">
      <div className="text-center space-y-6 max-w-md mx-auto p-4">
        <h1 className="text-7xl font-bold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">404</h1>
        <h2 className="text-2xl font-semibold">Oops! Page not found</h2>
        <p className="text-muted-foreground text-lg">The page you're looking for doesn't exist or has been moved.</p>
        <div className="pt-4">
          <Button asChild variant="hero" size="lg">
            <Link to="/">
              Return to Home
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
