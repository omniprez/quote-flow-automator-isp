
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Debug the login page render
  useEffect(() => {
    console.log("Login page rendered. Auth state:", {
      isAuthenticated: !!user,
      currentPath: location.pathname,
      redirectPath: location.state?.from || "/"
    });
  }, [user, location]);
  
  // If user is already authenticated, redirect to homepage or the route they came from
  useEffect(() => {
    if (user) {
      const destination = location.state?.from || "/";
      console.log("User already authenticated, redirecting to:", destination);
      navigate(destination, { replace: true });
    }
  }, [user, navigate, location.state]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;
        toast.success("Account created! Please check your email to confirm your registration.");
      } else {
        // Sign in
        console.log("Attempting to sign in with:", email);
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        // Get the redirect path from location state or default to home
        const from = location.state?.from || "/";
        console.log("Login successful, redirecting to:", from);
        toast.success("Logged in successfully!");
        
        // Use replace to prevent the user from navigating back to the login page
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      toast.error(error.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-blue-100 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-indigo-100">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <FileText className="h-12 w-12 text-indigo-600" />
            </div>
            <CardTitle className="text-2xl font-display text-indigo-700">{isSignUp ? "Create an account" : "Welcome back"}</CardTitle>
            <CardDescription className="text-indigo-500">
              {isSignUp 
                ? "Enter your email and password to create your account" 
                : "Enter your email and password to access your account"}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleAuth}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-indigo-700">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="your.email@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-indigo-200 focus:border-indigo-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-indigo-700">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Your password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-indigo-200 focus:border-indigo-400"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all duration-300" 
                disabled={isLoading}
              >
                {isLoading ? "Please wait..." : isSignUp ? "Create account" : "Login"}
              </Button>
              <Button 
                type="button" 
                variant="link" 
                className="w-full text-indigo-600"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign up"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
