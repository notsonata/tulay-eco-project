
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Leaf } from "lucide-react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="border-b bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <Link to="/" className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-primary">San Pedro EcoWatch</h1>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
            >
              View Reports
            </Link>
            <Link 
              to="/submit" 
              className={`text-sm font-medium transition-colors ${isActive('/submit') ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
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
          <nav className="md:hidden flex flex-col space-y-4 mt-4 pb-2 animate-fade-in">
            <Link 
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm font-medium p-2 rounded-md ${isActive('/') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-primary/5'}`}
            >
              View Reports
            </Link>
            <Link 
              to="/submit" 
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm font-medium p-2 rounded-md ${isActive('/submit') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-primary/5'}`}
            >
              Submit Report
            </Link>
            <Link 
              to="/admin" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium p-2"
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
