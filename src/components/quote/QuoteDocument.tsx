
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
  companyLogo = "/placeholder.svg",
  companyName = "ISP Services Ltd",
  companyAddress = "Ebene CyberCity\nEbene, Mauritius",
  companyContact = "+230 123 4567",
  companyEmail = "sales@ispservices.mu",
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
