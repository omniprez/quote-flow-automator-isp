
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
  
  console.log("PDF Generator: Starting PDF generation with proper spacing");

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

  // Apply better spacing preservation for PDF
  // Store original styles
  const originalStyles = new Map();
  
  // Save original styles for restoration later
  element.querySelectorAll('div, p, h2, h3, td, th').forEach(el => {
    if (el instanceof HTMLElement) {
      originalStyles.set(el, {
        fontSize: el.style.fontSize,
        lineHeight: el.style.lineHeight,
        marginBottom: el.style.marginBottom,
        marginTop: el.style.marginTop,
        paddingBottom: el.style.paddingBottom,
        paddingTop: el.style.paddingTop
      });
    }
  });
  
  // Apply proper spacing that preserves the layout while still fitting on page
  element.style.width = '100%';
  element.style.maxWidth = '830px'; // Wider content area for PDF
  
  // Reduce header spacing specifically
  const headerElement = element.querySelector('.flex.flex-col.md\\:flex-row.justify-between.items-start.mb-2');
  if (headerElement instanceof HTMLElement) {
    headerElement.style.marginBottom = '5px';
  }
  
  console.log("PDF Generator: Applied layout preservation settings");

  // Create canvas from the element with maximum compatibility settings
  console.log("Starting html2canvas conversion with logo status:", logoElement?.complete);
  const canvas = await html2canvas(element, {
    scale: 2, // Higher resolution
    useCORS: true, // Allow loading images from other domains
    allowTaint: true, // Allow cross-origin images to taint the canvas
    logging: true, // Enable logging for debugging
    backgroundColor: "#ffffff",
    imageTimeout: 0, // No timeout for image loading
    width: 830, // Fixed width to match A4 proportions better
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
      
      // Better spacing in cloned document
      const docElement = clonedDoc.getElementById(elementId);
      if (docElement) {
        docElement.style.width = '100%';
        docElement.style.maxWidth = '830px';
        
        // Reduce header whitespace specifically
        const headerElement = docElement.querySelector('.flex.flex-col.md\\:flex-row.justify-between.items-start.mb-2');
        if (headerElement instanceof HTMLElement) {
          headerElement.style.marginBottom = '5px';
        }
        
        console.log("Applied proper spacing to cloned document");
      }
    }
  });
  
  // Restore original styles after capture
  element.querySelectorAll('div, p, h2, h3, td, th').forEach(el => {
    if (el instanceof HTMLElement && originalStyles.has(el)) {
      const styles = originalStyles.get(el);
      el.style.fontSize = styles.fontSize;
      el.style.lineHeight = styles.lineHeight;
      el.style.marginBottom = styles.marginBottom;
      el.style.marginTop = styles.marginTop;
      el.style.paddingBottom = styles.paddingBottom;
      el.style.paddingTop = styles.paddingTop;
    }
  });
  
  console.log("PDF Generator: Canvas generated, creating PDF with proper spacing");

  // Convert canvas to PDF with proper dimensions
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

  // Add content with proper spacing
  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;
  
  console.log("PDF Generator: Content height ratio:", imgHeight/pageHeight);
  console.log("PDF Generator: Single page status:", heightLeft <= 0 ? "Success" : "Needs multiple pages");

  // Add more pages if content doesn't fit on one page
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    console.log("PDF Generator: Added additional page");
  }

  // Download the PDF
  pdf.save(`${fileName}.pdf`);
  console.log("PDF Generator: PDF saved successfully");
}
