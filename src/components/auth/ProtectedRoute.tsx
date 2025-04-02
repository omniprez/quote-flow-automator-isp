
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
  const [hasAttemptedRedirect, setHasAttemptedRedirect] = useState(false);

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
    if (!isLoading && !user && !hasAttemptedRedirect) {
      console.log("No user detected, redirecting to login");
      setHasAttemptedRedirect(true);
      navigate('/login', { replace: true });
    }
  }, [isLoading, user, navigate, hasAttemptedRedirect]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
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
