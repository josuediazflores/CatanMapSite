import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 pt-20">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <h1 className="text-8xl font-bold text-primary mb-2">404</h1>
          <h2 className="text-2xl font-bold text-foreground">Page Not Found</h2>
        </div>

        <p className="text-muted-foreground mb-8 leading-relaxed">
          Sorry! The page you're looking for doesn't exist. It might have been
          moved or deleted.
        </p>

        <div className="space-y-3">
          <Link to="/" className="block">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground inline-flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          <Link to="/generator" className="block">
            <Button className="w-full bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/30">
              Go to Map Generator
            </Button>
          </Link>
        </div>

        <p className="text-xs text-muted-foreground mt-8">
          Error code: {location.pathname}
        </p>
      </div>
    </div>
  );
};

export default NotFound;
