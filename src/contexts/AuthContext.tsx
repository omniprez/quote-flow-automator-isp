
import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

type UserRole = 'admin' | 'user';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  userRole: UserRole;
  signOut: () => Promise<void>;
  refreshUserRole: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>('user');

  // Debug output for session state changes
  useEffect(() => {
    console.log("Auth state updated:", { 
      hasUser: !!user, 
      isLoading, 
      userRole 
    });
  }, [user, isLoading, userRole]);

  const fetchUserRole = async (userId: string) => {
    try {
      // Check if user is an admin
      const { data, error } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', userId);
      
      if (error) {
        console.error("Error fetching user role:", error);
        setUserRole('user'); // Default to user role if there's an error
        return;
      }
      
      if (data && data.length > 0) {
        setUserRole('admin');
      } else {
        setUserRole('user');
      }
    } catch (error) {
      console.error("Exception fetching user role:", error);
      setUserRole('user'); // Default to user role if there's an error
    }
  };

  const refreshUserRole = async () => {
    if (user?.id) {
      await fetchUserRole(user.id);
    }
  };

  useEffect(() => {
    // Track if component is mounted to prevent state updates after unmount
    let isMounted = true;
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state change event:", event, "Has session:", !!newSession);
        
        if (!isMounted) return;
        
        if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setUserRole('user');
          setIsLoading(false);
        } else if (newSession) {
          setSession(newSession);
          setUser(newSession.user ?? null);
          
          // If user logged in, fetch their role
          if (newSession.user) {
            setTimeout(() => {
              if (isMounted) fetchUserRole(newSession.user.id);
            }, 0);
          }
          
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      
      console.log("Initial session check:", !!session);
      setSession(session);
      setUser(session?.user ?? null);
      
      // If user is already logged in, fetch their role
      if (session?.user) {
        fetchUserRole(session.user.id);
      }
      
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log("Signing out...");
      
      // Clear local state immediately
      setUser(null);
      setSession(null);
      setUserRole('user');
      
      // Then sign out with Supabase (but don't wait for it to complete)
      // This prevents any redirect loops that might occur
      supabase.auth.signOut().catch(e => console.error("Error during Supabase signOut:", e));
      
      // Force a hard browser navigation to /login
      // This ensures a complete state reset and prevents React Router issues
      window.location.href = "/login";
      
    } catch (err) {
      console.error("Exception during sign out:", err);
      // Force navigation even on error
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, isLoading, userRole, signOut, refreshUserRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
