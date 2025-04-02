
import { useEffect, useState } from "react";

interface HtmlTemplateRendererProps {
  htmlTemplate: string;
  quoteData: any;
  customerData: any;
  serviceData?: any;
  bandwidthData?: any;
  featuresData?: any[];
  companyLogo?: string;
  companyName?: string;
  companyAddress?: string;
  companyContact?: string;
  companyEmail?: string;
  primaryColor?: string;
}

export function HtmlTemplateRenderer({
  htmlTemplate,
  quoteData,
  customerData,
  serviceData,
  bandwidthData,
  featuresData = [],
  companyLogo = "/placeholder.svg",
  companyName = "ISP Services Ltd",
  companyAddress = "Ebene CyberCity\nEbene, Mauritius",
  companyContact = "+230 123 4567",
  companyEmail = "sales@ispservices.mu",
  primaryColor = "#000",
}: HtmlTemplateRendererProps) {
  const [renderedTemplate, setRenderedTemplate] = useState<string | null>(null);
  
  useEffect(() => {
    try {
      // Replace placeholders in the HTML template with actual data
      let processedTemplate = htmlTemplate;
      
      // Quote information
      processedTemplate = processedTemplate.replace(/{{quoteNumber}}/g, quoteData.quote_number || "");
      processedTemplate = processedTemplate.replace(/{{quoteDate}}/g, new Date(quoteData.quote_date || quoteData.created_at).toLocaleDateString());
      processedTemplate = processedTemplate.replace(/{{quoteStatus}}/g, quoteData.status || "");
      processedTemplate = processedTemplate.replace(/{{expirationDate}}/g, quoteData.expiration_date ? new Date(quoteData.expiration_date).toLocaleDateString() : "");
      processedTemplate = processedTemplate.replace(/{{totalMonthly}}/g, formatCurrency(quoteData.total_monthly_cost || 0));
      processedTemplate = processedTemplate.replace(/{{totalOneTime}}/g, formatCurrency(quoteData.total_one_time_cost || 0));
      processedTemplate = processedTemplate.replace(/{{contractTerm}}/g, quoteData.contract_term_months?.toString() || "");
      processedTemplate = processedTemplate.replace(/{{notes}}/g, quoteData.notes || "");
      
      // Customer information
      processedTemplate = processedTemplate.replace(/{{customerName}}/g, customerData.company_name || "");
      processedTemplate = processedTemplate.replace(/{{contactName}}/g, customerData.contact_name || "");
      processedTemplate = processedTemplate.replace(/{{customerEmail}}/g, customerData.email || "");
      processedTemplate = processedTemplate.replace(/{{customerPhone}}/g, customerData.phone || "");
      processedTemplate = processedTemplate.replace(/{{customerAddress}}/g, customerData.address || "");
      processedTemplate = processedTemplate.replace(/{{customerCity}}/g, customerData.city || "");
      processedTemplate = processedTemplate.replace(/{{customerCountry}}/g, customerData.country || "");
      
      // Service information
      if (serviceData) {
        processedTemplate = processedTemplate.replace(/{{serviceName}}/g, serviceData.name || "");
        processedTemplate = processedTemplate.replace(/{{serviceSetupFee}}/g, formatCurrency(serviceData.setup_fee || 0));
      }
      
      // Bandwidth information
      if (bandwidthData) {
        processedTemplate = processedTemplate.replace(/{{bandwidth}}/g, `${bandwidthData.bandwidth || ""} ${bandwidthData.unit || ""}`);
        processedTemplate = processedTemplate.replace(/{{bandwidthPrice}}/g, formatCurrency(bandwidthData.monthly_price || 0));
      }
      
      // Company information
      processedTemplate = processedTemplate.replace(/{{companyLogo}}/g, companyLogo || "");
      processedTemplate = processedTemplate.replace(/{{companyName}}/g, companyName || "");
      processedTemplate = processedTemplate.replace(/{{companyAddress}}/g, companyAddress.replace(/\n/g, "<br>") || "");
      processedTemplate = processedTemplate.replace(/{{companyContact}}/g, companyContact || "");
      processedTemplate = processedTemplate.replace(/{{companyEmail}}/g, companyEmail || "");
      processedTemplate = processedTemplate.replace(/{{primaryColor}}/g, primaryColor || "");
      
      // Features information
      let featuresHtml = "";
      if (featuresData && featuresData.length > 0) {
        featuresData.forEach(feature => {
          featuresHtml += `
            <tr class="border-b">
              <td class="py-3 px-4">${feature.name || ""}</td>
              <td class="py-3 px-4 text-right">MUR ${formatCurrency(feature.one_time_fee || 0)}</td>
              <td class="py-3 px-4 text-right">MUR ${formatCurrency(feature.monthly_price || 0)}</td>
            </tr>
          `;
        });
      }
      processedTemplate = processedTemplate.replace(/{{featuresRows}}/g, featuresHtml);
      
      setRenderedTemplate(processedTemplate);
    } catch (error) {
      console.error("Error processing HTML template:", error);
    }
  }, [htmlTemplate, quoteData, customerData, serviceData, bandwidthData, featuresData, companyLogo, companyName, companyAddress, companyContact, companyEmail, primaryColor]);

  if (!renderedTemplate) return null;

  return (
    <div 
      className="p-8 max-w-4xl mx-auto bg-white" 
      dangerouslySetInnerHTML={{ __html: renderedTemplate }}
    />
  );
}

// Import formatCurrency at the top level to make it available for the useEffect hook
import { formatCurrency } from "@/lib/formatters";
