
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
  companyLogo = "/lovable-uploads/1b83d0bf-d1e0-4307-a20b-c1cae596873e.png",
  companyName = "Rogers Capital Technology Services Ltd",
  companyAddress = "5, President John Kennedy Street\nPort Louis, Republic of Mauritius",
  companyContact = "+(230) 211 7801",
  companyEmail = "mcs_sales@rogerscapital.mu",
  primaryColor = "#000",
  logoRef
}: QuoteDocumentHeaderProps) {
  // Always use the fallback logo since it's guaranteed to work
  const fallbackLogo = "/lovable-uploads/1b83d0bf-d1e0-4307-a20b-c1cae596873e.png";
  const [logoUrl, setLogoUrl] = useState(fallbackLogo);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Custom style for primary color elements
  const headerStyle = {
    color: primaryColor
  };

  // Effect to handle logo loading
  useEffect(() => {
    console.log("Setting fallback logo as guaranteed option");
    setLogoUrl(fallbackLogo);
    setLogoLoaded(false);
    setLogoError(false);
    
    // Preload the logo to ensure it's in browser cache
    const img = new Image();
    img.src = fallbackLogo;
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      console.log("Fallback logo preloaded successfully");
      setLogoLoaded(true);
      setLogoError(false);
    };
    
    img.onerror = () => {
      console.error("Error loading fallback logo");
      setLogoError(true);
    };
  }, []);

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
        {/* Always use the fallback logo to ensure consistency */}
        <div className="h-16 mb-2" style={{ minHeight: '64px', minWidth: '64px' }}>
          <img 
            ref={logoRef}
            id="company-logo"
            src={logoUrl} 
            alt="Company Logo"
            className="h-16 mb-2 object-contain" 
            style={{ maxWidth: '240px', display: 'block' }}
            crossOrigin="anonymous"
            onLoad={() => {
              console.log("Logo loaded in DOM:", logoUrl);
              setLogoLoaded(true);
              setLogoError(false);
            }}
            onError={(e) => {
              console.error("Logo failed to load in DOM:", e);
              // Always revert to fallback on any error
              if (logoUrl !== fallbackLogo) {
                setLogoUrl(fallbackLogo);
              } else {
                // If the fallback itself fails, hide the image
                e.currentTarget.style.display = 'none';
              }
            }}
          />
        </div>
        <h2 className="font-bold text-xl">{companyName}</h2>
        <p className="mt-1 whitespace-pre-line">{companyAddress}</p>
        <p className="mt-1">Tel: {companyContact}</p>
        <p>Email: {companyEmail}</p>
      </div>
    </div>
  );
}
