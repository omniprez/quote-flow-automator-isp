
import { useState } from "react";
import { toast } from "sonner";
import { generatePdf } from "@/lib/pdf-generator";

export function usePdfActions() {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadPdf = async (quoteNumber?: string, quoteId?: string) => {
    try {
      setIsGeneratingPdf(true);
      console.log("Starting PDF generation for quote:", quoteNumber || quoteId);
      
      // Check if the company logo exists in the DOM before generating PDF
      const logoElement = document.querySelector('#quote-document img');
      if (logoElement) {
        console.log("Logo element found in the DOM:", logoElement);
      } else {
        console.warn("Logo element not found in the DOM before PDF generation");
      }
      
      await generatePdf("quote-document", `Quote-${quoteNumber || quoteId}`);
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

  return {
    isGeneratingPdf,
    handleDownloadPdf,
    handleSendEmail,
    handlePrint
  };
}
