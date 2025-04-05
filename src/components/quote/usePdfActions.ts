
import { useState } from "react";
import { toast } from "sonner";
import { generatePdf } from "@/lib/pdf-generator";

export function usePdfActions() {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadPdf = async (quoteNumber?: string, quoteId?: string) => {
    try {
      setIsGeneratingPdf(true);
      console.log("Starting PDF generation for quote:", quoteNumber || quoteId);
      console.log("PDF generation timestamp:", new Date().toISOString());
      
      // Apply additional compression to document for PDF generation
      const quoteDocument = document.getElementById('quote-document');
      if (quoteDocument) {
        console.log("Applying document compression for PDF generation");
        quoteDocument.classList.add('pdf-generation-mode');
        
        // Additional CSS to further reduce whitespace
        console.log("Applying additional spacing reduction");
        quoteDocument.style.fontSize = '0.8em';
        quoteDocument.style.lineHeight = '1.1';
        quoteDocument.querySelectorAll('div, p, h2, h3, td, th').forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.margin = '0';
            el.style.padding = '0';
          }
        });
      }
      
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
      
      // Directly replace with new Rogers Capital logo
      const logoElements = document.querySelectorAll('#company-logo');
      if (logoElements.length > 0) {
        const newLogo = '/lovable-uploads/22a2e78f-c2e3-4522-838b-ba6971d8cec9.png';
        console.log(`Using new Rogers Capital logo for ${logoElements.length} logo elements`);
        
        logoElements.forEach(logo => {
          (logo as HTMLImageElement).src = newLogo;
          (logo as HTMLImageElement).crossOrigin = "anonymous";
          // Set the dimensions to ensure it's displayed correctly
          (logo as HTMLImageElement).style.width = '250px';
          (logo as HTMLImageElement).style.height = 'auto';
          console.log("Set new logo src:", newLogo);
        });
      } else {
        console.warn("No logo elements found to set");
      }
      
      // Force a wait to ensure the logo is loaded
      console.log("Waiting for logo to fully load...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Final check for any images still loading
      const stillLoadingImages = Array.from(allImages).filter(img => 
        !(img as HTMLImageElement).complete || (img as HTMLImageElement).naturalHeight === 0
      );
      
      if (stillLoadingImages.length > 0) {
        console.warn(`${stillLoadingImages.length} images still not loaded completely`);
        // Force one final wait
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        console.log("All images are loaded and ready for PDF generation");
      }
      
      // Additional compression - check document overall height before PDF generation
      if (quoteDocument) {
        const docHeight = quoteDocument.offsetHeight;
        console.log("Document height before PDF generation:", docHeight, "pixels");
        if (docHeight > 1000) {
          console.log("Document is tall, applying extra compression");
          quoteDocument.style.fontSize = '0.75em';
          quoteDocument.style.lineHeight = '1';
        }
      }
      
      // Generate PDF with all images properly loaded
      await generatePdf("quote-document", `Quote-${quoteNumber || quoteId}`);
      toast.success("Quote PDF downloaded successfully");
      
      // Remove the compression class after PDF generation
      if (quoteDocument) {
        quoteDocument.classList.remove('pdf-generation-mode');
        // Reset inline styles
        quoteDocument.style.fontSize = '';
        quoteDocument.style.lineHeight = '';
        quoteDocument.querySelectorAll('div, p, h2, h3, td, th').forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.margin = '';
            el.style.padding = '';
          }
        });
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to download PDF");
      
      // Make sure to remove compression class on error
      const quoteDocument = document.getElementById('quote-document');
      if (quoteDocument) {
        quoteDocument.classList.remove('pdf-generation-mode');
        // Reset inline styles
        quoteDocument.style.fontSize = '';
        quoteDocument.style.lineHeight = '';
      }
    } finally {
      setIsGeneratingPdf(false);
      console.log("PDF generation process completed at:", new Date().toISOString());
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
