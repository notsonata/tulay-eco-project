
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Leaf, Lock, Loader } from "lucide-react";
import { verifyAdmin } from "@/lib/data";
import { toast } from "@/components/ui/use-toast";

const Admin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      await verifyAdmin(username, password);
      
      // Admin verified
      toast({
        title: "Login Successful",
        description: "Welcome to the administration panel.",
      });
      
      // Store admin status in sessionStorage (in a real app, use proper auth)
      sessionStorage.setItem("isAdmin", "true");
      
      // Redirect to admin dashboard
      navigate("/admin/dashboard");
      
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-primary">
            <Leaf className="h-8 w-8" />
            <h1 className="text-3xl font-bold">San Pedro EcoWatch</h1>
          </Link>
          <p className="text-muted-foreground mt-2">Administrator Access</p>
        </div>
        
        <Card className="border shadow-md">
          <CardHeader>
            <CardTitle className="text-center">Admin Login</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={loading}
                />
              </div>
              
              {error && (
                <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm flex items-start">
                  <Lock className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              
              <div className="text-xs text-muted-foreground">
                <p>For demo purposes, use:</p>
                <p>Username: <code className="bg-muted px-1 rounded">admin</code></p>
                <p>Password: <code className="bg-muted px-1 rounded">admin123</code></p>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
            ← Return to Public Site
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Admin;
