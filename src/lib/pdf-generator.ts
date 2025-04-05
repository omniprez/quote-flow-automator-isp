
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

/**
 * Generate a PDF from an HTML element
 * 
 * @param elementId The ID of the HTML element to convert to PDF
 * @param fileName The name of the PDF file (without extension)
 * @returns Promise that resolves when the PDF is generated and downloaded
 */
export async function generatePdf(elementId: string, fileName: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with ID ${elementId} not found`);
  }

  // Critical: Force the new logo right before generating
  const logoElement = element.querySelector('#company-logo') as HTMLImageElement;
  if (logoElement) {
    const newLogo = '/lovable-uploads/22a2e78f-c2e3-4522-838b-ba6971d8cec9.png';
    console.log("Final verification - forcing new Rogers Capital logo:", newLogo);
    logoElement.src = newLogo;
    logoElement.crossOrigin = "anonymous";
    
    // Ensure logo is displayed with correct dimensions
    logoElement.style.display = 'block';
    logoElement.style.visibility = 'visible';
    logoElement.style.width = '250px';
    logoElement.style.height = 'auto';
    
    // Wait for logo to load
    await new Promise<void>((resolve) => {
      const checkLoaded = () => {
        if (logoElement.complete) {
          console.log("New logo loaded successfully");
          resolve();
        } else {
          console.log("Waiting for new logo to load...");
          setTimeout(checkLoaded, 500);
        }
      };
      checkLoaded();
    });
  } else {
    console.warn("No logo element found during final check");
  }

  // Compress the page and font size for PDF
  const originalFontSize = window.getComputedStyle(element).fontSize;
  element.style.fontSize = '0.9em';
  
  // Apply minimum height to make content more compact
  element.querySelectorAll('div, p, h2, h3').forEach(el => {
    if (el instanceof HTMLElement) {
      // Reduce margins and paddings
      if (window.getComputedStyle(el).marginBottom) {
        el.style.marginBottom = '4px';
      }
      if (window.getComputedStyle(el).paddingBottom) {
        el.style.paddingBottom = '4px';
      }
    }
  });

  // Create canvas from the element with maximum compatibility settings
  console.log("Starting html2canvas conversion with logo status:", logoElement?.complete);
  const canvas = await html2canvas(element, {
    scale: 2, // Higher resolution
    useCORS: true, // Allow loading images from other domains
    allowTaint: true, // Allow cross-origin images to taint the canvas
    logging: true, // Enable logging for debugging
    backgroundColor: "#ffffff",
    imageTimeout: 0, // No timeout for image loading
    onclone: (clonedDoc) => {
      // Final attempt to fix logo in the cloned document that will be rendered
      const clonedLogo = clonedDoc.querySelector('#company-logo') as HTMLImageElement;
      if (clonedLogo) {
        clonedLogo.src = '/lovable-uploads/22a2e78f-c2e3-4522-838b-ba6971d8cec9.png';
        clonedLogo.crossOrigin = "anonymous";
        clonedLogo.style.display = 'block';
        clonedLogo.style.visibility = 'visible';
        clonedLogo.style.width = '250px';
        clonedLogo.style.height = 'auto';
        console.log("Set new logo in cloned document");
      }
      
      // Compress cloned document further to fit on one page
      const docElement = clonedDoc.getElementById(elementId);
      if (docElement) {
        docElement.style.fontSize = '0.9em';
        docElement.querySelectorAll('div, p, h2, h3').forEach(el => {
          if (el instanceof HTMLElement) {
            // Reduce margins and paddings
            el.style.marginBottom = '4px';
            el.style.paddingBottom = '4px';
          }
        });
      }
    }
  });
  
  // Restore original font size after capture
  element.style.fontSize = originalFontSize;

  // Convert canvas to PDF
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true
  });
  
  const imgWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;

  // Compress content to try to fit on a single page
  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  // Add more pages if content doesn't fit on one page
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  // Download the PDF
  pdf.save(`${fileName}.pdf`);
}
