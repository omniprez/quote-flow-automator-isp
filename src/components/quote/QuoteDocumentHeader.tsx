
import { formatCurrency } from "@/lib/formatters";

interface QuoteDocumentHeaderProps {
  quoteData: any;
  companyLogo?: string;
  companyName?: string;
  companyAddress?: string;
  companyContact?: string;
  companyEmail?: string;
  primaryColor?: string;
}

export function QuoteDocumentHeader({
  quoteData,
  companyLogo = "/placeholder.svg",
  companyName = "ISP Services Ltd",
  companyAddress = "Ebene CyberCity\nEbene, Mauritius",
  companyContact = "+230 123 4567",
  companyEmail = "sales@ispservices.mu",
  primaryColor = "#000",
}: QuoteDocumentHeaderProps) {
  // Custom style for primary color elements
  const headerStyle = {
    color: primaryColor
  };

  return (
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
  );
}
