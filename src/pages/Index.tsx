
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold mb-4">ISP Quote Flow Automator</h1>
        <p className="text-xl text-gray-600 max-w-md mx-auto">
          Create and manage quotes for ISP services in Mauritius with our automated workflow system.
        </p>
        <div className="flex justify-center space-x-4 mt-8">
          <Button asChild size="lg">
            <Link to="/admin">
              <Settings className="mr-2 h-5 w-5" />
              Manage Services & Pricing
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
