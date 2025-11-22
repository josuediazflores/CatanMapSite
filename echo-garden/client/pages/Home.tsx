import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Dice5 } from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4 md:px-8">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-primary/15 rounded-2xl border border-primary/20">
                <Dice5 className="w-12 h-12 text-primary" />
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Generate & Share
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Catan Game Maps
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Create randomized Catan boards instantly. Share with friends,
              track your favorite configurations, and never waste time setting up
              again.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/generator">
                <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 rounded-lg font-semibold text-base transition-all hover:scale-105">
                  Create Your Map
                </Button>
              </Link>

              {user && (
                <Link to="/my-maps">
                  <Button className="w-full sm:w-auto bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/30 px-8 py-6 rounded-lg font-semibold text-base transition-colors">
                    My Maps
                  </Button>
                </Link>
              )}
            </div>

            {user && (
              <p className="text-sm text-muted-foreground mt-6">
                Welcome back, <span className="font-semibold">{user.username}</span>!
              </p>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
