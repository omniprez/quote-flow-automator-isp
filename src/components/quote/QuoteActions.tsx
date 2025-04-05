
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Send, 
  Printer, 
  Settings
} from "lucide-react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";

interface QuoteActionsProps {
  isGeneratingPdf: boolean;
  onDownloadPdf: () => Promise<void>;
  onSendEmail: () => void;
  onPrint: () => void;
}

export function QuoteActions({
  isGeneratingPdf,
  onDownloadPdf,
  onSendEmail,
  onPrint
}: QuoteActionsProps) {
  return (
    <div className="flex flex-col md:flex-row gap-3 print:hidden">
      <Button 
        onClick={onDownloadPdf} 
        disabled={isGeneratingPdf}
        className="flex-1"
      >
        <Download className="mr-2 h-4 w-4" />
        {isGeneratingPdf ? "Generating..." : "Download PDF"}
      </Button>
      <Button onClick={onSendEmail} variant="outline" className="flex-1">
        <Send className="mr-2 h-4 w-4" />
        Email Quote
      </Button>
      <Button onClick={onPrint} variant="outline" className="flex-1">
        <Printer className="mr-2 h-4 w-4" />
        Print Quote
      </Button>
      
      {/* Branding Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="flex-1">
            <Settings className="mr-2 h-4 w-4" />
            Company Branding
          </Button>
        </SheetTrigger>
      </Sheet>
    </div>
  );
}
