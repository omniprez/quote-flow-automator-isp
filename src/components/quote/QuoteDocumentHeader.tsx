
import { formatCurrency } from "@/lib/formatters";
import { useEffect, useState, Ref } from "react";

interface QuoteDocumentHeaderProps {
  quoteData: any;
  companyLogo?: string;
  companyName?: string;
  companyAddress?: string;
  companyContact?: string;
  companyEmail?: string;
  primaryColor?: string;
  logoRef?: Ref<HTMLImageElement>;
}

export function QuoteDocumentHeader({
  quoteData,
  companyLogo = "/lovable-uploads/22a2e78f-c2e3-4522-838b-ba6971d8cec9.png",
  companyName = "Rogers Capital Technology Services Ltd",
  companyAddress = "5, President John Kennedy Street\nPort Louis, Republic of Mauritius",
  companyContact = "+(230) 211 7801",
  companyEmail = "mcs_sales@rogerscapital.mu",
  primaryColor = "#000",
  logoRef
}: QuoteDocumentHeaderProps) {
  // Always use the new logo as default
  const newLogo = "/lovable-uploads/22a2e78f-c2e3-4522-838b-ba6971d8cec9.png";
  const [logoUrl, setLogoUrl] = useState(newLogo);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Custom style for primary color elements
  const headerStyle = {
    color: primaryColor
  };

  // Effect to handle logo loading
  useEffect(() => {
    console.log("Setting new Rogers Capital logo");
    setLogoUrl(newLogo);
    setLogoLoaded(false);
    setLogoError(false);
    
    // Preload the logo to ensure it's in browser cache
    const img = new Image();
    img.src = newLogo;
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      console.log("New logo preloaded successfully");
      setLogoLoaded(true);
      setLogoError(false);
    };
    
    img.onerror = () => {
      console.error("Error loading new logo");
      setLogoError(true);
    };
  }, []);

  return (
    <div className="flex flex-col md:flex-row justify-between items-start mb-4">
      <div>
        {/* Left side is empty now that we've removed QUOTE, quote number and date */}
        {quoteData.expiration_date && (
          <p className="text-sm text-muted-foreground">
            Valid until: {new Date(quoteData.expiration_date).toLocaleDateString()}
          </p>
        )}
      </div>
      <div className="md:mt-0 text-right flex flex-col items-end">
        {/* Display the Rogers Capital logo with reduced margin */}
        <div className="mb-1" style={{ minHeight: '40px', width: '250px' }}>
          <img 
            ref={logoRef}
            id="company-logo"
            src={logoUrl} 
            alt="Company Logo"
            className="object-contain" 
            style={{ width: '250px', height: 'auto', display: 'block' }}
            crossOrigin="anonymous"
            onLoad={() => {
              console.log("Logo loaded in DOM:", logoUrl);
              setLogoLoaded(true);
              setLogoError(false);
            }}
            onError={(e) => {
              console.error("Logo failed to load in DOM:", e);
              // Always revert to new logo on any error
              if (logoUrl !== newLogo) {
                setLogoUrl(newLogo);
              } else {
                // If the new logo itself fails, hide the image
                e.currentTarget.style.display = 'none';
              }
            }}
          />
        </div>
        <h2 className="font-bold text-lg mb-0">{companyName}</h2>
        <p className="whitespace-pre-line text-sm leading-tight">{companyAddress}</p>
        <p className="text-sm leading-tight">Tel: {companyContact}</p>
        <p className="text-sm leading-tight">Email: {companyEmail}</p>
      </div>
    </div>
  );
}
