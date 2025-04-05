
import { Separator } from "@/components/ui/separator";
import { useEffect, useRef } from "react";
import { QuoteDocumentHeader } from "./QuoteDocumentHeader";
import { CustomerServiceDetails } from "./CustomerServiceDetails";
import { QuoteSummaryTable } from "./QuoteSummaryTable";
import { QuoteNotes } from "./QuoteNotes";
import { TermsConditions } from "./TermsConditions";
import { QuoteFooter } from "./QuoteFooter";

interface QuoteDocumentProps {
  quoteData: any;
  customerData: any;
  serviceData?: any;
  bandwidthData?: any;
  featuresData?: any[];
  companyLogo?: string;
  companyName?: string;
  companyAddress?: string;
  companyContact?: string;
  companyEmail?: string;
  primaryColor?: string;
}

export function QuoteDocument({ 
  quoteData, 
  customerData,
  serviceData,
  bandwidthData,
  featuresData = [],
  companyLogo = "/lovable-uploads/1b83d0bf-d1e0-4307-a20b-c1cae596873e.png",
  companyName = "Rogers Capital Technology Services Ltd",
  companyAddress = "5, President John Kennedy Street\nPort Louis, Republic of Mauritius",
  companyContact = "+(230) 211 7801",
  companyEmail = "mcs_sales@rogerscapital.mu",
  primaryColor = "#000",
}: QuoteDocumentProps) {
  const logoRef = useRef<HTMLImageElement>(null);
  
  // Add a useEffect to handle logo loading and debugging
  useEffect(() => {
    console.log("QuoteDocument rendered with logo path:", companyLogo);
    console.log("Applying compressed layout for better page fit");
    
    // Verify that the logo is loaded correctly
    if (logoRef.current) {
      const logoElement = logoRef.current;
      
      if (logoElement.complete) {
        console.log("Logo loaded in DOM:", logoElement.src);
      }
      
      logoElement.onload = () => {
        console.log("Logo loaded successfully:", logoElement.src);
        console.log("Logo verified and loaded:", logoElement.src);
      };
      
      logoElement.onerror = (e) => {
        console.error("Failed to load logo:", logoElement.src, e);
        // Fallback to default logo if loading fails
        logoElement.src = "/lovable-uploads/1b83d0bf-d1e0-4307-a20b-c1cae596873e.png";
      };
    }
  }, [companyLogo]);

  if (!quoteData || !customerData) {
    return <div>No data available</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto bg-white">
      {/* Pass logo reference to header */}
      <QuoteDocumentHeader
        quoteData={quoteData}
        companyLogo={companyLogo}
        companyName={companyName}
        companyAddress={companyAddress}
        companyContact={companyContact}
        companyEmail={companyEmail}
        primaryColor={primaryColor}
        logoRef={logoRef}
      />

      <Separator className="my-2" style={{backgroundColor: primaryColor}} />

      {/* Customer and Service Details */}
      <CustomerServiceDetails
        customerData={customerData}
        serviceData={serviceData}
        bandwidthData={bandwidthData}
        quoteData={quoteData}
        primaryColor={primaryColor}
      />

      {/* Service Details */}
      <QuoteSummaryTable
        serviceData={serviceData}
        bandwidthData={bandwidthData}
        featuresData={featuresData}
        quoteData={quoteData}
        primaryColor={primaryColor}
      />

      {/* Notes */}
      <QuoteNotes
        notes={quoteData.notes}
        primaryColor={primaryColor}
      />

      {/* Terms and conditions */}
      <TermsConditions primaryColor={primaryColor} />

      {/* Footer */}
      <QuoteFooter
        companyContact={companyContact}
        primaryColor={primaryColor}
      />
    </div>
  );
}
