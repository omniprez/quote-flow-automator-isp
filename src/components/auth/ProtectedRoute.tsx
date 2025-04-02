
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, isLoading, userRole, refreshUserRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [redirectAttempted, setRedirectAttempted] = useState(false);

  // Debug output
  useEffect(() => {
    console.log("ProtectedRoute rendered:", {
      isLoading,
      hasUser: !!user,
      userRole,
      currentPath: location.pathname
    });
  }, [isLoading, user, userRole, location.pathname]);

  // Force a refresh of the user role on mount
  useEffect(() => {
    if (user) {
      refreshUserRole();
    }
  }, [user, refreshUserRole]);

  // Effect to handle authentication redirects
  useEffect(() => {
    // Only redirect if not loading, not authenticated, and not already on login page
    if (!isLoading && !user && !redirectAttempted && location.pathname !== '/login') {
      console.log("No user detected, redirecting to login");
      setRedirectAttempted(true);
      // Use replace: true to avoid adding to history stack
      navigate('/login', { replace: true });
    }
  }, [isLoading, user, navigate, redirectAttempted, location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If not authenticated and not on login page, redirect to login using Navigate component
  if (!user && location.pathname !== '/login') {
    console.log("User not authenticated, redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  // Check for admin requirement
  if (requireAdmin && userRole !== 'admin') {
    console.log("Access denied: User role is", userRole, "but admin is required");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
