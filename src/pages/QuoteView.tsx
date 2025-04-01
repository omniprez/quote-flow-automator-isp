
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Download, Send, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { QuoteDocument } from "@/components/quote/QuoteDocument";
import { generatePdf } from "@/lib/pdf-generator";

const QuoteView = () => {
  const { quoteId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quoteData, setQuoteData] = useState<any>(null);
  const [customerData, setCustomerData] = useState<any>(null);
  const [serviceData, setServiceData] = useState<any>(null);
  const [bandwidthData, setBandwidthData] = useState<any>(null);
  const [featuresData, setFeaturesData] = useState<any[]>([]);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    const fetchQuoteData = async () => {
      if (!quoteId) return;
      
      try {
        setIsLoading(true);
        
        // Fetch quote data
        const { data: quote, error: quoteError } = await supabase
          .from("quotes")
          .select("*")
          .eq("id", quoteId)
          .maybeSingle();
          
        if (quoteError) throw quoteError;
        if (!quote) {
          setError("Quote not found");
          setIsLoading(false);
          return;
        }
        
        setQuoteData(quote);
        
        // Fetch customer data
        const { data: customer, error: customerError } = await supabase
          .from("customers")
          .select("*")
          .eq("id", quote.customer_id)
          .maybeSingle();
          
        if (customerError) throw customerError;
        setCustomerData(customer);
        
        // For a real implementation, we would fetch service, bandwidth, and features data
        // based on what was saved in the quote
        // This is a simplified implementation

      } catch (err) {
        console.error("Error fetching quote:", err);
        setError("Failed to load quote data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchQuoteData();
  }, [quoteId]);

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      await generatePdf("quote-document", `Quote-${quoteData?.quote_number || quoteId}`);
      toast.success("Quote PDF downloaded successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to download PDF");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleSendEmail = () => {
    // In a real app, this would send the quote via email
    toast.info("Email functionality will be implemented in the future");
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="flex flex-col space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Error</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button asChild>
            <Link to="/quotes/create">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Create New Quote
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex flex-col space-y-6">
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
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="capitalize">
              {quoteData?.status || "draft"}
            </Badge>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3 print:hidden">
          <Button 
            onClick={handleDownloadPdf} 
            disabled={isGeneratingPdf}
            className="flex-1"
          >
            <Download className="mr-2 h-4 w-4" />
            {isGeneratingPdf ? "Generating..." : "Download PDF"}
          </Button>
          <Button onClick={handleSendEmail} variant="outline" className="flex-1">
            <Send className="mr-2 h-4 w-4" />
            Email Quote
          </Button>
          <Button onClick={handlePrint} variant="outline" className="flex-1">
            <Printer className="mr-2 h-4 w-4" />
            Print Quote
          </Button>
        </div>
        
        <Separator className="my-2" />
        
        <div id="quote-document" className="bg-white rounded-md shadow-sm print:shadow-none">
          <QuoteDocument quoteData={quoteData} customerData={customerData} />
        </div>
      </div>
    </div>
  );
};

export default QuoteView;
