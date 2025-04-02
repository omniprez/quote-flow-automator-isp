
import { ReactNode, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, isLoading, userRole, refreshUserRole } = useAuth();

  // Force a refresh of the user role on mount
  useEffect(() => {
    if (user) {
      refreshUserRole();
    }
  }, [user, refreshUserRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check for admin requirement
  if (requireAdmin && userRole !== 'admin') {
    console.log("Access denied: User role is", userRole, "but admin is required");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
