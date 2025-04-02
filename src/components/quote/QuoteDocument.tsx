
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/formatters";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface QuoteDocumentProps {
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
  htmlTemplate?: string;
}

export function QuoteDocument({ 
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
  htmlTemplate
}: QuoteDocumentProps) {
  if (!quoteData || !customerData) {
    return <div>No data available</div>;
  }

  const [renderedTemplate, setRenderedTemplate] = useState<string | null>(null);
  
  // If an HTML template is provided, use it
  useEffect(() => {
    if (htmlTemplate) {
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
    }
  }, [htmlTemplate, quoteData, customerData, serviceData, bandwidthData, featuresData, companyLogo, companyName, companyAddress, companyContact, companyEmail, primaryColor]);

  // If using an HTML template and it's processed, render it directly
  if (htmlTemplate && renderedTemplate) {
    return (
      <div 
        className="p-8 max-w-4xl mx-auto bg-white" 
        dangerouslySetInnerHTML={{ __html: renderedTemplate }}
      />
    );
  }

  // Custom style for primary color elements
  const headerStyle = {
    color: primaryColor
  };

  // Format the service description to include the service name and bandwidth
  const getServiceDescription = () => {
    if (!serviceData) return "Internet Service";
    
    let description = serviceData.name;
    
    // Add bandwidth if available
    if (bandwidthData) {
      description += ` - ${bandwidthData.bandwidth} ${bandwidthData.unit}`;
    }
    
    return description;
  };

  // If no HTML template is provided, use the default layout
  return (
    <div className="p-8 max-w-4xl mx-auto bg-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1" style={headerStyle}>QUOTE</h1>
          <p className="text-lg">#{quoteData.quote_number}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Date: {new Date(quoteData.quote_date || quoteData.created_at).toLocaleDateString()}
          </p>
          {quoteData.expiration_date && (
            <p className="text-sm text-muted-foreground">
              Valid until: {new Date(quoteData.expiration_date).toLocaleDateString()}
            </p>
          )}
        </div>
        <div className="mt-4 md:mt-0 text-right flex flex-col items-end">
          {companyLogo && (
            <img 
              src={companyLogo} 
              alt={companyName} 
              className="h-16 mb-2 object-contain" 
            />
          )}
          <h2 className="font-bold text-xl">{companyName}</h2>
          <p className="mt-1 whitespace-pre-line">{companyAddress}</p>
          <p className="mt-1">Tel: {companyContact}</p>
          <p>Email: {companyEmail}</p>
        </div>
      </div>

      <Separator className="my-6" style={{backgroundColor: primaryColor}} />

      {/* Customer and Service Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="font-bold mb-2" style={headerStyle}>Customer</h3>
          <p className="font-medium">{customerData.company_name}</p>
          <p>Contact: {customerData.contact_name}</p>
          <p>Email: {customerData.email}</p>
          {customerData.phone && <p>Phone: {customerData.phone}</p>}
          {customerData.address && (
            <>
              <p className="mt-1">{customerData.address}</p>
              <p>{customerData.city}{customerData.city && customerData.country ? ", " : ""}{customerData.country}</p>
            </>
          )}
        </div>
        <div>
          <h3 className="font-bold mb-2" style={headerStyle}>Service Details</h3>
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="py-1 text-muted-foreground">Service:</td>
                <td className="py-1">{serviceData?.name || "Internet Connectivity Service"}</td>
              </tr>
              <tr>
                <td className="py-1 text-muted-foreground">Bandwidth:</td>
                <td className="py-1">
                  {bandwidthData 
                    ? `${bandwidthData.bandwidth} ${bandwidthData.unit}` 
                    : "As specified"}
                </td>
              </tr>
              <tr>
                <td className="py-1 text-muted-foreground">Contract Term:</td>
                <td className="py-1">{quoteData.contract_term_months} months</td>
              </tr>
              <tr>
                <td className="py-1 text-muted-foreground">Status:</td>
                <td className="py-1 capitalize">{quoteData.status}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Service Details */}
      <div className="mb-8">
        <h3 className="font-bold mb-4" style={headerStyle}>Quote Summary</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr style={{backgroundColor: `${primaryColor}10`}}>
              <th className="py-2 px-4 text-left">Description</th>
              <th className="py-2 px-4 text-right">One-time Fee</th>
              <th className="py-2 px-4 text-right">Monthly Fee</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-3 px-4">{getServiceDescription()}</td>
              <td className="py-3 px-4 text-right">
                MUR {formatCurrency(serviceData?.setup_fee || 0)}
              </td>
              <td className="py-3 px-4 text-right">
                MUR {formatCurrency(bandwidthData?.monthly_price || 0)}
              </td>
            </tr>
            
            {featuresData && featuresData.length > 0 && featuresData.map((feature, index) => (
              <tr key={index} className="border-b">
                <td className="py-3 px-4">{feature.name}</td>
                <td className="py-3 px-4 text-right">
                  MUR {formatCurrency(feature.one_time_fee || 0)}
                </td>
                <td className="py-3 px-4 text-right">
                  MUR {formatCurrency(feature.monthly_price || 0)}
                </td>
              </tr>
            ))}
            
            <tr className="font-medium" style={{backgroundColor: `${primaryColor}05`}}>
              <td className="py-3 px-4">Total</td>
              <td className="py-3 px-4 text-right">
                MUR {formatCurrency(quoteData.total_one_time_cost)}
              </td>
              <td className="py-3 px-4 text-right">
                MUR {formatCurrency(quoteData.total_monthly_cost)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Notes */}
      {quoteData.notes && (
        <div className="mb-8">
          <h3 className="font-bold mb-2" style={headerStyle}>Notes</h3>
          <p className="text-sm whitespace-pre-line">{quoteData.notes}</p>
        </div>
      )}

      {/* Terms and conditions */}
      <div className="mt-8 text-sm">
        <h3 className="font-bold mb-2" style={headerStyle}>Terms & Conditions</h3>
        <ol className="list-decimal pl-5 space-y-1">
          <li>All prices are in Mauritian Rupees (MUR) and exclusive of VAT.</li>
          <li>This quote is valid for 30 days from the issue date.</li>
          <li>Installation timeline will be confirmed upon acceptance of the quote.</li>
          <li>Payment terms: 50% advance payment, 50% upon installation completion.</li>
          <li>Service level agreement details will be provided upon request.</li>
        </ol>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-4 border-t text-sm text-center text-muted-foreground" style={{borderColor: `${primaryColor}20`}}>
        <p>Thank you for your business!</p>
        <p className="mt-1">For any questions, please contact your account manager or call {companyContact}</p>
      </div>
    </div>
  );
}
