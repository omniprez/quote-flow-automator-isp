
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const AdminHeader = () => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center">
        <Link 
          to="/" 
          className="flex items-center text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      </div>
      <p className="text-muted-foreground">
        Manage ISP services, bandwidth options, and additional features for Mauritius.
      </p>
    </div>
  );
};

export default AdminHeader;
