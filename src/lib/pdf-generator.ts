
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

  // Create canvas from the element
  const canvas = await html2canvas(element, {
    scale: 2, // Higher resolution
    useCORS: true, // Allow loading images from other domains
    logging: false,
    backgroundColor: "#ffffff"
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
