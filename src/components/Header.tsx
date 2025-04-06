import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    // INCREASE THE Z-INDEX HERE
    <header className="border-b bg-white shadow-sm sticky top-0 z-[1100]"> 
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/lovable-uploads/37281d79-2c30-4ca8-be5d-9335a591c41c.png"
              alt="San Pedro EcoWatch Logo"
              className="h-20" // Consider maybe h-12 or h-16 if h-20 is too large for a sticky header
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive("/")
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              View Reports
            </Link>
            <Link
              to="/submit"
              className={`text-sm font-medium transition-colors ${
                isActive("/submit")
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              Submit Report
            </Link>
            <Link to="/admin">
              <Button variant="outline" size="sm">
                Admin Login
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          // Ensure mobile menu doesn't cause issues - it's within the header context
          <nav className="md:hidden flex flex-col space-y-4 mt-4 pb-2 animate-fade-in">
             {/* Links with onClick to close menu */}
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-sm font-medium p-2 rounded-md ${ // Added block
                isActive("/")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-primary/5"
              }`}
            >
              View Reports
            </Link>
            <Link
              to="/submit"
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-sm font-medium p-2 rounded-md ${ // Added block
                isActive("/submit")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-primary/5"
              }`}
            >
              Submit Report
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium p-2" // Added block
            >
              <Button variant="outline" className="w-full">
                Admin Login
              </Button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;