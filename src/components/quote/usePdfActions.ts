
import { useState } from "react";
import { toast } from "sonner";
import { generatePdf } from "@/lib/pdf-generator";

export function usePdfActions() {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadPdf = async (quoteNumber?: string, quoteId?: string) => {
    try {
      setIsGeneratingPdf(true);
      console.log("Starting PDF generation for quote:", quoteNumber || quoteId);
      
      // Ensure all images are loaded before generating PDF
      const logoElement = document.querySelector('#quote-document img');
      if (logoElement) {
        console.log("Logo element found in the DOM:", logoElement);
      } else {
        console.warn("Logo element not found in the DOM before PDF generation");
      }
      
      // Preload logo image with absolute URL
      const preloadLogo = (logoUrl: string) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          // Convert relative URL to absolute URL if needed
          const absoluteUrl = logoUrl.startsWith('http') ? logoUrl : window.location.origin + logoUrl;
          img.src = absoluteUrl;
          
          img.onload = () => {
            console.log("Logo preloaded successfully:", absoluteUrl);
            resolve(true);
          };
          img.onerror = (e) => {
            console.error("Failed to preload logo:", absoluteUrl, e);
            // Resolve anyway to continue the process
            resolve(false);
          };
        });
      };
      
      // Get logo URL from the DOM
      const logoSrc = logoElement ? (logoElement as HTMLImageElement).src : '/lovable-uploads/1b83d0bf-d1e0-4307-a20b-c1cae596873e.png';
      
      // Preload the logo and wait a bit to ensure rendering
      await preloadLogo(logoSrc);
      
      // Small delay to ensure everything is rendered
      await new Promise(resolve => setTimeout(resolve, 500));
      
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
