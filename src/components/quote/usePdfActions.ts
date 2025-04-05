
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
      
      // Apply PDF preparation styles
      const quoteDocument = document.getElementById('quote-document');
      if (quoteDocument) {
        console.log("Applying document preparation for PDF generation");
        quoteDocument.classList.add('pdf-generation-mode');
        
        // Ensure proper overall width for PDF generation
        quoteDocument.style.width = '100%';
        quoteDocument.style.maxWidth = '830px';
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
          (logo as HTMLImageElement).style.marginBottom = '8px'; // Add spacing below logo
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
      
      // Additional check - ensure document width is set properly before PDF generation
      if (quoteDocument) {
        const docWidth = quoteDocument.offsetWidth;
        console.log("Document width before PDF generation:", docWidth, "pixels");
      }
      
      // Generate PDF with proper spacing
      await generatePdf("quote-document", `Quote-${quoteNumber || quoteId}`);
      toast.success("Quote PDF downloaded successfully");
      
      // Remove the PDF preparation class after PDF generation
      if (quoteDocument) {
        quoteDocument.classList.remove('pdf-generation-mode');
        // Reset inline styles
        quoteDocument.style.width = '';
        quoteDocument.style.maxWidth = '';
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to download PDF");
      
      // Make sure to remove PDF preparation class on error
      const quoteDocument = document.getElementById('quote-document');
      if (quoteDocument) {
        quoteDocument.classList.remove('pdf-generation-mode');
        // Reset inline styles
        quoteDocument.style.width = '';
        quoteDocument.style.maxWidth = '';
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

