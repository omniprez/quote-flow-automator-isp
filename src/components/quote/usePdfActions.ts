
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
      
      // Preload all images with absolute URL
      const preloadImages = async () => {
        const preloadPromises = Array.from(allImages).map((imgElement) => {
          return new Promise((resolve) => {
            const img = new Image();
            const imgSrc = (imgElement as HTMLImageElement).src;
            
            // Set the company logo ID directly on the element for easier identification
            if (imgSrc.includes('lovable-uploads') || imgElement.id === 'company-logo' || 
                (imgElement as HTMLImageElement).alt === 'Company Logo') {
              imgElement.id = 'company-logo';
            }
            
            // If image is already loaded, resolve immediately
            if ((imgElement as HTMLImageElement).complete) {
              console.log("Image already loaded:", imgSrc);
              resolve(true);
              return;
            }
            
            img.src = imgSrc;
            img.crossOrigin = "anonymous";
            
            img.onload = () => {
              console.log("Image preloaded successfully:", imgSrc);
              resolve(true);
            };
            img.onerror = (e) => {
              console.error("Failed to preload image:", imgSrc, e);
              // Try with a fallback logo if it's the company logo
              if (imgElement.id === 'company-logo' || 
                  (imgElement as HTMLImageElement).alt === 'Company Logo') {
                const fallbackLogo = '/lovable-uploads/1b83d0bf-d1e0-4307-a20b-c1cae596873e.png';
                console.log("Using fallback logo:", fallbackLogo);
                (imgElement as HTMLImageElement).src = fallbackLogo;
              }
              resolve(false);
            };
          });
        });
        
        return Promise.all(preloadPromises);
      };
      
      await preloadImages();
      
      // More reliable delay to ensure all DOM changes are applied
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Make sure the logo is properly loaded before capturing
      const logoImg = document.querySelector('#company-logo');
      if (logoImg && !(logoImg as HTMLImageElement).complete) {
        console.log("Company logo not loaded yet, forcing fallback");
        (logoImg as HTMLImageElement).src = '/lovable-uploads/1b83d0bf-d1e0-4307-a20b-c1cae596873e.png';
        // Extra time for fallback to load
        await new Promise(resolve => setTimeout(resolve, 1000));
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
