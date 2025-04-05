
import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Sheet } from "@/components/ui/sheet";
import { useState } from "react";

import { QuoteDocument } from "@/components/quote/QuoteDocument";
import { QuoteHeader } from "@/components/quote/QuoteHeader";
import { QuoteActions } from "@/components/quote/QuoteActions";
import { BrandingSheet } from "@/components/quote/BrandingSheet";
import { useQuoteData } from "@/hooks/useQuoteData";
import { useCompanyBranding } from "@/hooks/useCompanyBranding";
import { usePdfActions } from "@/components/quote/usePdfActions";
import { Button } from "@/components/ui/button";
import { LayoutTemplate } from "lucide-react";

const QuoteView = () => {
  const { quoteId } = useParams();
  const [useAlternateTemplate, setUseAlternateTemplate] = useState(false);
  
  const { 
    isLoading, 
    error, 
    quoteData, 
    customerData,
    serviceData,
    bandwidthData,
    featuresData,
    updateQuoteStatus
  } = useQuoteData(quoteId);

  const {
    isGeneratingPdf,
    handleDownloadPdf,
    handleSendEmail,
    handlePrint
  } = usePdfActions();

  const {
    companyLogo,
    companyName,
    companyAddress,
    companyContact,
    companyEmail,
    primaryColor,
    savedTemplates,
    setCompanyName,
    setCompanyAddress,
    setCompanyContact,
    setCompanyEmail,
    setPrimaryColor,
    handleLogoChange,
    saveSettings,
    saveTemplate,
    applyTemplate,
    deleteTemplate,
    uploadTemplate
  } = useCompanyBranding();

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
        </div>
      </div>
    );
  }

  const handleUpdateStatus = async (newStatus: string) => {
    const isUpdating = await updateQuoteStatus(newStatus);
    return isUpdating;
  };

  const handleDownloadPdfClick = async () => {
    await handleDownloadPdf(quoteData?.quote_number, quoteId);
  };

  const toggleTemplate = () => {
    setUseAlternateTemplate(!useAlternateTemplate);
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex flex-col space-y-6">
        <QuoteHeader 
          quoteData={quoteData}
          isUpdatingStatus={false}
          onUpdateStatus={handleUpdateStatus}
        />
        
        <div className="flex flex-col md:flex-row gap-3 print:hidden">
          <Button 
            variant={useAlternateTemplate ? "default" : "outline"}
            onClick={toggleTemplate}
            className="flex-1"
          >
            <LayoutTemplate className="mr-2 h-4 w-4" />
            {useAlternateTemplate ? "Using Rogers Capital Template" : "Switch to Rogers Capital Template"}
          </Button>
        </div>
        
        <QuoteActions
          isGeneratingPdf={isGeneratingPdf}
          onDownloadPdf={handleDownloadPdfClick}
          onSendEmail={handleSendEmail}
          onPrint={handlePrint}
        />
        
        <Separator className="my-2" />
        
        <div id="quote-document" className="bg-white rounded-md shadow-sm print:shadow-none">
          <QuoteDocument 
            quoteData={quoteData} 
            customerData={customerData}
            serviceData={serviceData}
            bandwidthData={bandwidthData}
            featuresData={featuresData}
            companyLogo={companyLogo}
            companyName={companyName}
            companyAddress={companyAddress}
            companyContact={companyContact}
            companyEmail={companyEmail}
            primaryColor={useAlternateTemplate ? "#003366" : primaryColor}
            useAlternateTemplate={useAlternateTemplate}
          />
        </div>
      </div>
      
      {/* Branding Sheet */}
      <Sheet>
        <BrandingSheet
          companyLogo={companyLogo}
          companyName={companyName}
          companyAddress={companyAddress}
          companyContact={companyContact}
          companyEmail={companyEmail}
          primaryColor={primaryColor}
          savedTemplates={savedTemplates}
          onLogoChange={handleLogoChange}
          onCompanyNameChange={(e) => setCompanyName(e.target.value)}
          onCompanyAddressChange={(e) => setCompanyAddress(e.target.value)}
          onCompanyContactChange={(e) => setCompanyContact(e.target.value)}
          onCompanyEmailChange={(e) => setCompanyEmail(e.target.value)}
          onPrimaryColorChange={(e) => setPrimaryColor(e.target.value)}
          onApplyTemplate={applyTemplate}
          onDeleteTemplate={deleteTemplate}
          onSaveTemplate={saveTemplate}
          onUploadTemplate={uploadTemplate}
          onSaveSettings={saveSettings}
        />
      </Sheet>
    </div>
  );
};

export default QuoteView;
