
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

  // Ensure all images are loaded before generating the PDF
  const allImages = element.querySelectorAll('img');
  console.log(`Total images found: ${allImages.length}`);
  
  // Verify all images are loaded, especially the company logo
  const verifyImagesPromise = new Promise<void>((resolve) => {
    const companyLogo = element.querySelector('#company-logo') as HTMLImageElement;
    if (companyLogo) {
      // If the company logo isn't loaded, try the fallback
      if (!companyLogo.complete || companyLogo.naturalWidth === 0) {
        console.warn("Company logo not loaded properly, using fallback");
        companyLogo.src = '/lovable-uploads/1b83d0bf-d1e0-4307-a20b-c1cae596873e.png';
        // Wait for the fallback to load or timeout after 1 second
        setTimeout(() => resolve(), 1000);
      } else {
        resolve();
      }
    } else {
      resolve();
    }
  });
  
  await verifyImagesPromise;

  // Create canvas from the element
  const canvas = await html2canvas(element, {
    scale: 2, // Higher resolution
    useCORS: true, // Allow loading images from other domains
    allowTaint: true, // Allow cross-origin images to taint the canvas
    logging: true, // Enable logging for debugging
    backgroundColor: "#ffffff",
    imageTimeout: 30000, // Increase timeout for image loading
    onclone: (document) => {
      // Verify all images in the cloned document
      const images = document.querySelectorAll('img');
      console.log(`Found ${images.length} images in the document`);
      
      images.forEach((img, index) => {
        // Check if image has valid src and is loaded
        if (!img.complete || !img.src || img.src === 'about:blank' || img.src === window.location.href) {
          console.warn(`Image #${index} has issues:`, img.src);
          
          // Try to fix it using alternative sources
          const dataSrc = img.getAttribute('data-src');
          const alt = img.getAttribute('alt') || 'company logo';
          
          if (dataSrc) {
            img.src = dataSrc;
            console.log(`Fixed image #${index} src with data-src:`, dataSrc);
          } else if (alt.includes('logo') || img.id === 'company-logo') {
            // Use known working logo for company logo
            img.src = '/lovable-uploads/1b83d0bf-d1e0-4307-a20b-c1cae596873e.png';
            console.log(`Applied fallback image for ${alt}`);
          }
        } else {
          console.log(`Image #${index} src is valid and loaded:`, img.src);
        }
      });
    }
  });

  // Convert canvas to PDF
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });
  
  const imgWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;

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
