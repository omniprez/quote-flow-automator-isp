
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, isLoading, userRole, refreshUserRole } = useAuth();
  const location = useLocation();

  // Debug output
  useEffect(() => {
    console.log("ProtectedRoute FIXED render:", {
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

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If not authenticated, redirect to login with current path for later redirect
  if (!user) {
    console.log("FIXED: User not authenticated, redirecting to /login with path:", location.pathname);
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check for admin requirement
  if (requireAdmin && userRole !== 'admin') {
    console.log("Access denied: User role is", userRole, "but admin is required");
    return <Navigate to="/" replace />;
  }

  // User is authenticated and has required role, render the protected content
  return <>{children}</>;
}
