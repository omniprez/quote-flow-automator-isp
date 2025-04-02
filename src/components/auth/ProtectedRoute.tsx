
import { ReactNode, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, isLoading, userRole, refreshUserRole } = useAuth();
  const navigate = useNavigate();

  // Force a refresh of the user role on mount
  useEffect(() => {
    if (user) {
      refreshUserRole();
    }
  }, [user, refreshUserRole]);

  // Effect to handle authentication redirects
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login', { replace: true });
    }
  }, [isLoading, user, navigate]);

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
