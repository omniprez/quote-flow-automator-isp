
import { formatCurrency } from "@/lib/formatters";
import { useEffect, useState } from "react";

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
  companyLogo = "/lovable-uploads/1b83d0bf-d1e0-4307-a20b-c1cae596873e.png",
  companyName = "Rogers Capital Technology Services Ltd",
  companyAddress = "5, President John Kennedy Street\nPort Louis, Republic of Mauritius",
  companyContact = "+(230) 211 7801",
  companyEmail = "mcs_sales@rogerscapital.mu",
  primaryColor = "#000",
}: QuoteDocumentHeaderProps) {
  // State to track if the logo is loaded
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [logoUrl, setLogoUrl] = useState(companyLogo);

  // Custom style for primary color elements
  const headerStyle = {
    color: primaryColor
  };

  // Effect to handle logo loading and fallbacks
  useEffect(() => {
    // Make sure we start with the provided logo
    setLogoUrl(companyLogo);
    setLogoLoaded(false);
    setLogoError(false);
    
    // Preload the logo
    const img = new Image();
    img.src = companyLogo;
    
    img.onload = () => {
      console.log("Logo loaded successfully:", companyLogo);
      setLogoLoaded(true);
      setLogoError(false);
    };
    
    img.onerror = () => {
      console.error("Error loading logo:", companyLogo);
      setLogoError(true);
      // Try the fallback logo
      const fallbackLogo = "/lovable-uploads/1b83d0bf-d1e0-4307-a20b-c1cae596873e.png";
      setLogoUrl(fallbackLogo);
      
      // Try to load the fallback
      const fallbackImg = new Image();
      fallbackImg.src = fallbackLogo;
      fallbackImg.onload = () => {
        console.log("Fallback logo loaded successfully");
        setLogoLoaded(true);
      };
    };
  }, [companyLogo]);

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
        {logoUrl && (
          <div className="h-16 mb-2" style={{ minHeight: '64px', minWidth: '64px' }}>
            <img 
              src={logoUrl} 
              alt={companyName}
              className="h-16 mb-2 object-contain" 
              style={{ maxWidth: '240px' }}
              data-src={logoUrl} // Backup source attribute
              onLoad={() => console.log("Logo loaded in DOM:", logoUrl)}
              onError={(e) => {
                console.error("Logo failed to load in DOM:", e);
                // If this is the first error, try the backup
                if (!logoError) {
                  const fallbackLogo = "/lovable-uploads/1b83d0bf-d1e0-4307-a20b-c1cae596873e.png";
                  console.log("Switching to fallback logo:", fallbackLogo);
                  setLogoUrl(fallbackLogo);
                  setLogoError(true);
                } else {
                  // If we already tried a fallback, just hide the image
                  e.currentTarget.style.display = 'none';
                }
              }}
            />
          </div>
        )}
        <h2 className="font-bold text-xl">{companyName}</h2>
        <p className="mt-1 whitespace-pre-line">{companyAddress}</p>
        <p className="mt-1">Tel: {companyContact}</p>
        <p>Email: {companyEmail}</p>
      </div>
    </div>
  );
}
