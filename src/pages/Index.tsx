
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Settings, FileText } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="text-center space-y-8 max-w-3xl px-4">
        <h1 className="text-5xl font-bold mb-4 text-primary">ISP Quote Flow Automator</h1>
        <p className="text-xl text-gray-600 mx-auto">
          Create and manage professional quotes for internet service providers in Mauritius.
          Streamline your sales process with our automated workflow system for DIA, EBI, and Private WAN services.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
          <Button asChild size="lg" className="w-full">
            <Link to="/admin">
              <Settings className="mr-2 h-5 w-5" />
              Manage Services & Pricing
            </Link>
          </Button>
          <Button asChild size="lg" className="w-full">
            <Link to="/quotes/create">
              <FileText className="mr-2 h-5 w-5" />
              Create New Quote
            </Link>
          </Button>
        </div>
        
        <p className="text-sm text-gray-500 mt-8">
          All prices are in Mauritian Rupees (MUR) and exclusive of VAT.
        </p>
      </div>
    </div>
  );
};

export default Index;
