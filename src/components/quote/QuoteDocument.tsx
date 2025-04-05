import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
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
  companyLogo = "/lovable-uploads/4ef83d86-9b81-4e3d-b16a-446ea5809713.png",
  companyName = "Rogers Capital Technology Services Ltd",
  companyAddress = "5, President John Kennedy Street\nPort Louis, Republic of Mauritius",
  companyContact = "+(230) 211 7801",
  companyEmail = "mcs_sales@rogerscapital.mu",
  primaryColor = "#000",
}: QuoteDocumentProps) {
  if (!quoteData || !customerData) {
    return <div>No data available</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white">
      {/* Header */}
      <QuoteDocumentHeader
        quoteData={quoteData}
        companyLogo={companyLogo}
        companyName={companyName}
        companyAddress={companyAddress}
        companyContact={companyContact}
        companyEmail={companyEmail}
        primaryColor={primaryColor}
      />

      <Separator className="my-6" style={{backgroundColor: primaryColor}} />

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
