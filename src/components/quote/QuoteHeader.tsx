
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface QuoteHeaderProps {
  quoteData: any;
  isUpdatingStatus: boolean;
  onUpdateStatus: (newStatus: string) => Promise<void>;
}

export function QuoteHeader({
  quoteData,
  isUpdatingStatus,
  onUpdateStatus
}: QuoteHeaderProps) {
  return (
    <>
      <div className="flex items-center">
        <Link 
          to="/" 
          className="flex items-center text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quote #{quoteData?.quote_number}</h1>
          <p className="text-muted-foreground">
            Created on {new Date(quoteData?.created_at).toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select
            value={quoteData?.status}
            onValueChange={onUpdateStatus}
            disabled={isUpdatingStatus}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="declined">Decline</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
          
          <Badge variant="outline" className="capitalize">
            {quoteData?.status || "draft"}
          </Badge>
        </div>
      </div>
    </>
  );
}
