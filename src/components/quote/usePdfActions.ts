
import { useState } from "react";
import { toast } from "sonner";
import { generatePdf } from "@/lib/pdf-generator";

export function usePdfActions() {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadPdf = async (quoteNumber?: string, quoteId?: string) => {
    try {
      setIsGeneratingPdf(true);
      console.log("Starting PDF generation for quote:", quoteNumber || quoteId);
      
      // Force all images to be loaded before generating PDF
      const allImages = document.querySelectorAll('#quote-document img');
      console.log(`Found ${allImages.length} images in the document to preload`);
      
      // Explicitly set logo ID to all potential logo images
      const possibleLogos = document.querySelectorAll('#quote-document img[alt="Company Logo"], #quote-document img[class*="logo"]');
      possibleLogos.forEach(img => {
        img.id = 'company-logo';
        (img as HTMLImageElement).crossOrigin = "anonymous";
        console.log("Marked image as company logo:", (img as HTMLImageElement).src);
      });
      
      // Directly replace with known working fallback logo
      // This ensures we don't rely on potentially problematic logo loading
      const logoElements = document.querySelectorAll('#company-logo');
      if (logoElements.length > 0) {
        const fallbackLogo = '/lovable-uploads/1b83d0bf-d1e0-4307-a20b-c1cae596873e.png';
        console.log(`Using guaranteed working fallback logo for ${logoElements.length} logo elements`);
        
        logoElements.forEach(logo => {
          (logo as HTMLImageElement).src = fallbackLogo;
          (logo as HTMLImageElement).crossOrigin = "anonymous";
          console.log("Set fallback logo src:", fallbackLogo);
        });
      } else {
        console.warn("No logo elements found to set fallback");
      }
      
      // Force a longer wait to ensure the fallback logo is loaded
      console.log("Waiting for fallback logo to fully load...");
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Final check for any images still loading
      const stillLoadingImages = Array.from(allImages).filter(img => 
        !(img as HTMLImageElement).complete || (img as HTMLImageElement).naturalHeight === 0
      );
      
      if (stillLoadingImages.length > 0) {
        console.warn(`${stillLoadingImages.length} images still not loaded completely`);
        // Force one final wait
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        console.log("All images are loaded and ready for PDF generation");
      }
      
      // Generate PDF with all images properly loaded
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
