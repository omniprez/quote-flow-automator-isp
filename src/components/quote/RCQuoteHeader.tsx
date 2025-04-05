
import { Ref } from "react";

interface RCQuoteHeaderProps {
  quoteData: any;
  companyLogo?: string;
}

export function RCQuoteHeader({
  quoteData,
  companyLogo = "/lovable-uploads/22a2e78f-c2e3-4522-838b-ba6971d8cec9.png",
}: RCQuoteHeaderProps) {
  return (
    <div className="flex justify-between items-start mb-2">
      <div className="flex items-center space-x-2">
        <div className="bg-blue-800 p-1 text-white">
          <span className="transform rotate-90 inline-block">▶</span>
          <span className="ml-1 font-medium">Technology</span>
        </div>
      </div>
      <div className="flex items-center">
        <img 
          id="company-logo"
          src={companyLogo} 
          alt="Rogers Capital"
          className="h-10 object-contain" 
          crossOrigin="anonymous"
        />
      </div>
      
      <div className="w-full mt-4">
        <div className="bg-blue-800 text-white text-center py-1 font-medium">
          Service Order Form
        </div>
        <div className="grid grid-cols-2 border border-blue-800">
          <div className="p-1 font-medium">Document Number</div>
          <div className="p-1 border-l border-blue-800 font-medium">Date</div>
          <div className="p-1">{quoteData.quote_number}</div>
          <div className="p-1 border-l border-blue-800">
            {new Date(quoteData.quote_date).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
