import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Dice5, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="p-2 bg-primary/15 rounded-lg">
            <Dice5 className="w-6 h-6 text-primary" />
          </div>
          <span className="font-bold text-foreground text-lg hidden sm:inline">
            Catan Maps
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {isAuthenticated && (
            <>
              <Link
                to="/"
                className={`font-medium transition-colors ${
                  isActive("/")
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Home
              </Link>
              <Link
                to="/generator"
                className={`font-medium transition-colors ${
                  isActive("/generator")
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Generate
              </Link>
              <Link
                to="/friends"
                className={`font-medium transition-colors ${
                  isActive("/friends")
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Friends
              </Link>
            </>
          )}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {isAuthenticated && user && (
            <div className="hidden md:flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {user.username}
              </span>
              <Button
                onClick={handleLogout}
                className="bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/30 inline-flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          )}

          {!isAuthenticated && (
            <Link to="/login" className="hidden md:inline">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Sign In
              </Button>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-accent/10 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card p-4 space-y-3">
          {isAuthenticated && (
            <>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-foreground hover:bg-accent/10 rounded-lg transition-colors"
              >
                Home
              </Link>
              <Link
                to="/generator"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-foreground hover:bg-accent/10 rounded-lg transition-colors"
              >
                Generate
              </Link>
              <Link
                to="/friends"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-foreground hover:bg-accent/10 rounded-lg transition-colors"
              >
                Friends
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          )}
          {!isAuthenticated && (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-primary hover:bg-accent/10 rounded-lg transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
