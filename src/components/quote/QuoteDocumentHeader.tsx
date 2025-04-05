
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
  companyName = "Rogers Capital Technology Services Ltd",
  companyAddress = "5, President John Kennedy Street\nPort Louis, Republic of Mauritius",
  companyContact = "+(230) 211 7801",
  companyEmail = "mcs_sales@rogerscapital.mu",
  primaryColor = "#000",
}: QuoteDocumentHeaderProps) {
  // Custom style for primary color elements
  const headerStyle = {
    color: primaryColor
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start mb-8">
      <div>
        {/* Left side is empty now that we've removed QUOTE, quote number and date */}
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
