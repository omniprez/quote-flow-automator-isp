
import React, { useRef, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { RCQuoteHeader } from "./RCQuoteHeader";
import { RCCustomerDetails } from "./RCCustomerDetails";
import { RCServiceSummary } from "./RCServiceSummary";
import { RCTermsConditions } from "./RCTermsConditions";
import { RCQuoteFooter } from "./RCQuoteFooter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface RogersCapitalTemplateProps {
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

export function RogersCapitalTemplate({
  quoteData,
  customerData,
  serviceData,
  bandwidthData,
  featuresData = [],
  companyLogo = "/lovable-uploads/22a2e78f-c2e3-4522-838b-ba6971d8cec9.png",
  companyName = "Rogers Capital Technology Services Ltd",
  companyAddress = "5, President John Kennedy Street\nPort Louis, Republic of Mauritius",
  companyContact = "+(230) 211 7801",
  companyEmail = "mcs_sales@rogerscapital.mu",
  primaryColor = "#003366",
}: RogersCapitalTemplateProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 2; // Set based on your template design
  const pageRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  
  // Navigation between pages 
  const goToPage = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="p-0 mx-auto bg-white relative">
      {/* Page 1 */}
      <div 
        ref={pageRefs[0]}
        className={`page page-1 relative ${currentPage === 1 ? "block" : "hidden"} min-h-[1120px] border border-gray-200 rounded-sm shadow-sm`}
        id="quote-page-1"
      >
        <div className="px-6 py-4 print:px-8 print:py-6">
          {/* Header with document number and date */}
          <RCQuoteHeader 
            quoteData={quoteData}
            companyLogo={companyLogo}
          />
          
          {/* Document subtitle and description */}
          <div className="border-b border-blue-800 py-2 mb-2 bg-gray-100">
            <p className="text-sm text-center">
              This Service Order is issued in terms of the master services agreement between Rogers Capital Technology Services Ltd and the customer, and form part thereof. Other terms and conditions mentioned herein prevail.
            </p>
          </div>
          
          {/* Customer Details Section */}
          <RCCustomerDetails 
            customerData={customerData}
            primaryColor={primaryColor}
          />
          
          {/* Service Summary Section */}
          <RCServiceSummary
            serviceData={serviceData}
            bandwidthData={bandwidthData}
            featuresData={featuresData}
            quoteData={quoteData}
            primaryColor={primaryColor}
          />
          
          {/* Footer with page number */}
          <RCQuoteFooter 
            currentPage={currentPage} 
            totalPages={totalPages}
            companyAddress={companyAddress}
            companyContact={companyContact}
            companyEmail={companyEmail}
          />
        </div>
        
        {/* Page navigation buttons */}
        <div className="absolute bottom-4 right-4 flex space-x-2 print:hidden">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Page 2 */}
      <div 
        ref={pageRefs[1]}
        className={`page page-2 relative ${currentPage === 2 ? "block" : "hidden"} min-h-[1120px] border border-gray-200 rounded-sm shadow-sm mt-4`}
        id="quote-page-2"
      >
        <div className="px-6 py-4 print:px-8 print:py-6">
          {/* Header with document number and date (repeated on all pages) */}
          <RCQuoteHeader 
            quoteData={quoteData}
            companyLogo={companyLogo}
          />
          
          {/* Document subtitle and description */}
          <div className="border-b border-blue-800 py-2 mb-4 bg-gray-100">
            <p className="text-sm text-center">
              This Service Order is issued in terms of the master services agreement between Rogers Capital Technology Services Ltd and the customer, and form part thereof. Other terms and conditions mentioned herein prevail.
            </p>
          </div>
          
          {/* Terms and Conditions */}
          <RCTermsConditions primaryColor={primaryColor} />
          
          {/* Signature Section */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="border border-blue-800 bg-blue-50 p-2">
              <h3 className="text-sm font-bold bg-blue-800 text-white p-1">On and on behalf of RC Technology Services Ltd</h3>
              <div className="grid grid-cols-2 gap-1 text-sm">
                <div className="text-gray-600">Signature:</div>
                <div className="border-b border-gray-400 h-6"></div>
                <div className="text-gray-600">Designation:</div>
                <div className="border-b border-gray-400 h-6"></div>
                <div className="text-gray-600">Name:</div>
                <div className="border-b border-gray-400 h-6"></div>
                <div className="text-gray-600">Date:</div>
                <div className="border-b border-gray-400 h-6"></div>
              </div>
            </div>
            <div className="border border-blue-800 bg-blue-50 p-2">
              <h3 className="text-sm font-bold bg-blue-800 text-white p-1">On and on behalf of the Customer</h3>
              <div className="grid grid-cols-2 gap-1 text-sm">
                <div className="text-gray-600">Signature:</div>
                <div className="border-b border-gray-400 h-6"></div>
                <div className="text-gray-600">Designation:</div>
                <div className="border-b border-gray-400 h-6"></div>
                <div className="text-gray-600">Name:</div>
                <div className="border-b border-gray-400 h-6"></div>
                <div className="text-gray-600">Date:</div>
                <div className="border-b border-gray-400 h-6"></div>
              </div>
            </div>
          </div>
          
          {/* Footer with page number */}
          <RCQuoteFooter 
            currentPage={currentPage} 
            totalPages={totalPages}
            companyAddress={companyAddress}
            companyContact={companyContact}
            companyEmail={companyEmail}
          />
        </div>
        
        {/* Page navigation buttons */}
        <div className="absolute bottom-4 left-4 flex space-x-2 print:hidden">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Previous
          </Button>
        </div>
      </div>
      
      {/* Print version that shows all pages */}
      <div className="hidden print:block" id="print-all-pages">
        <div className="page page-1 mb-4" id="print-page-1">
          {/* Content from page 1 */}
        </div>
        <div className="page page-2" id="print-page-2">
          {/* Content from page 2 */}
        </div>
      </div>
    </div>
  );
}
