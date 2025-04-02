
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Settings, FileText, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { useEffect } from "react";

const Index = () => {
  const { userRole, signOut, refreshUserRole } = useAuth();
  
  // Force refresh role on mount to ensure we have the latest role
  useEffect(() => {
    refreshUserRole();
  }, [refreshUserRole]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-blue-100">
      <div className="text-center space-y-8 max-w-3xl px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold mb-4 text-indigo-700 font-display">MCS Quote Automator</h1>
          <p className="text-xl text-indigo-600 mx-auto font-light">
            Quote automation app to increase your productivity
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 gap-4 mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {userRole === 'admin' && (
            <Button asChild size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all duration-300">
              <Link to="/admin">
                <Settings className="mr-2 h-5 w-5" />
                Manage Services & Pricing
              </Link>
            </Button>
          )}
          
          <Button asChild size="lg" className="w-full bg-purple-600 hover:bg-purple-700 transition-all duration-300">
            <Link to="/quotes/create">
              <FileText className="mr-2 h-5 w-5" />
              Create New Quote
            </Link>
          </Button>
          
          <Button onClick={signOut} variant="outline" size="lg" className="w-full border-indigo-300 text-indigo-700 hover:bg-indigo-100 transition-all duration-300">
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </motion.div>
        
        <p className="text-sm text-indigo-500 mt-8">
          All prices are in Mauritian Rupees (MUR) and exclusive of VAT.
        </p>
      </div>
    </div>
  );
};

export default Index;
