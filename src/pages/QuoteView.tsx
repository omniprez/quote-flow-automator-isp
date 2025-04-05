
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Sheet } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";

import { QuoteDocument } from "@/components/quote/QuoteDocument";
import { QuoteHeader } from "@/components/quote/QuoteHeader";
import { QuoteActions } from "@/components/quote/QuoteActions";
import { BrandingSheet } from "@/components/quote/BrandingSheet";
import { generatePdf } from "@/lib/pdf-generator";

const QuoteView = () => {
  const { quoteId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quoteData, setQuoteData] = useState<any>(null);
  const [customerData, setCustomerData] = useState<any>(null);
  const [serviceData, setServiceData] = useState<any>(null);
  const [bandwidthData, setBandwidthData] = useState<any>(null);
  const [featuresData, setFeaturesData] = useState<any[]>([]);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const { user } = useAuth();
  
  // Company branding states
  const [companyLogo, setCompanyLogo] = useState<string>("/lovable-uploads/23117b0f-f2c2-44b0-a01f-0288914bd068.png");
  const [companyName, setCompanyName] = useState<string>("Rogers Capital Technology Services Ltd");
  const [companyAddress, setCompanyAddress] = useState<string>("5, President John Kennedy Street\nPort Louis, Republic of Mauritius");
  const [companyContact, setCompanyContact] = useState<string>("+(230) 211 7801");
  const [companyEmail, setCompanyEmail] = useState<string>("mcs_sales@rogerscapital.mu");
  const [primaryColor, setPrimaryColor] = useState<string>("#3b82f6");

  // Template states
  const [templateName, setTemplateName] = useState<string>("");
  const [savedTemplates, setSavedTemplates] = useState<{ name: string, settings: any }[]>([]);
  
  // Load company settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('companySettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (settings.companyLogo) setCompanyLogo(settings.companyLogo);
        if (settings.companyName) setCompanyName(settings.companyName);
        if (settings.companyAddress) setCompanyAddress(settings.companyAddress);
        if (settings.companyContact) setCompanyContact(settings.companyContact);
        if (settings.companyEmail) setCompanyEmail(settings.companyEmail);
        if (settings.primaryColor) setPrimaryColor(settings.primaryColor);
      } catch (e) {
        console.error("Error parsing company settings:", e);
      }
    } else {
      // Save default settings to localStorage if none exist
      const defaultSettings = {
        companyLogo: "/lovable-uploads/23117b0f-f2c2-44b0-a01f-0288914bd068.png",
        companyName: "Rogers Capital Technology Services Ltd",
        companyAddress: "5, President John Kennedy Street\nPort Louis, Republic of Mauritius",
        companyContact: "+(230) 211 7801",
        companyEmail: "mcs_sales@rogerscapital.mu",
        primaryColor: "#3b82f6"
      };
      localStorage.setItem('companySettings', JSON.stringify(defaultSettings));
    }
    
    // Load saved templates from localStorage
    const savedTemplatesData = localStorage.getItem('quoteTemplates');
    if (savedTemplatesData) {
      try {
        const templates = JSON.parse(savedTemplatesData);
        setSavedTemplates(templates);
      } catch (e) {
        console.error("Error parsing templates:", e);
      }
    }
  }, []);

  useEffect(() => {
    const fetchQuoteData = async () => {
      if (!quoteId) return;
      
      try {
        setIsLoading(true);
        
        // Fetch quote data
        const { data: quote, error: quoteError } = await supabase
          .from("quotes")
          .select("*")
          .eq("id", quoteId)
          .maybeSingle();
          
        if (quoteError) throw quoteError;
        if (!quote) {
          setError("Quote not found");
          setIsLoading(false);
          return;
        }
        
        setQuoteData(quote);
        
        // Fetch customer data
        const { data: customer, error: customerError } = await supabase
          .from("customers")
          .select("*")
          .eq("id", quote.customer_id)
          .maybeSingle();
          
        if (customerError) throw customerError;
        setCustomerData(customer);
        
        // Fetch service and bandwidth data
        // First, fetch all services to find what was used in this quote
        const { data: allServices, error: servicesError } = await supabase
          .from("services")
          .select("*");
          
        if (servicesError) throw servicesError;
        
        // Fetch all bandwidth options
        const { data: allBandwidthOptions, error: bandwidthError } = await supabase
          .from("bandwidth_options")
          .select("*");
          
        if (bandwidthError) throw bandwidthError;

        // For demo purposes, infer the service and bandwidth from the quote totals
        // In a real app, we would have proper foreign keys or junction tables
        if (allServices && allServices.length > 0) {
          // For now, use the first service as an example
          const service = allServices[0];
          setServiceData(service);
          
          if (allBandwidthOptions && allBandwidthOptions.length > 0) {
            // Find a bandwidth option that matches the service_id
            const bandwidth = allBandwidthOptions.find(b => b.service_id === service.id);
            if (bandwidth) {
              setBandwidthData({
                ...bandwidth,
                // Adjust the price based on the quote's monthly cost (excluding features)
                monthly_price: quote.total_monthly_cost - 15000 // Subtract known feature cost
              });
            }
          }
        }
        
        // Fetch all additional features for display
        const { data: features } = await supabase
          .from("additional_features")
          .select("*");
          
        if (features && features.length > 0) {
          // For demo, assume the feature with id matching our known feature id is included
          const includedFeatures = features.filter(f => 
            f.id === "0339521a-2aa5-46a4-8e49-dcfd0179365a");
          setFeaturesData(includedFeatures);
        }

      } catch (err) {
        console.error("Error fetching quote:", err);
        setError("Failed to load quote data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchQuoteData();
  }, [quoteId]);

  const handleSaveSettings = () => {
    const settings = {
      companyLogo,
      companyName,
      companyAddress,
      companyContact,
      companyEmail,
      primaryColor
    };
    
    localStorage.setItem('companySettings', JSON.stringify(settings));
    toast.success("Company branding saved successfully");
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setCompanyLogo(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      await generatePdf("quote-document", `Quote-${quoteData?.quote_number || quoteId}`);
      toast.success("Quote PDF downloaded successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to download PDF");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleSendEmail = () => {
    // In a real app, this would send the quote via email
    toast.info("Email functionality will be implemented in the future");
  };

  const handlePrint = () => {
    window.print();
  };
  
  const handleUpdateStatus = async (newStatus: string) => {
    if (!quoteId || !quoteData) return;
    
    setIsUpdatingStatus(true);
    
    try {
      const { error } = await supabase
        .from("quotes")
        .update({ status: newStatus })
        .eq("id", quoteId);
        
      if (error) throw error;
      
      setQuoteData({
        ...quoteData,
        status: newStatus
      });
      
      toast.success(`Quote status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating quote status:", error);
      toast.error("Failed to update quote status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Function to save current settings as a template
  const handleSaveTemplate = (name: string) => {
    const settings = {
      companyLogo,
      companyName,
      companyAddress,
      companyContact,
      companyEmail,
      primaryColor
    };

    const updatedTemplates = [
      ...savedTemplates,
      { name, settings }
    ];

    setSavedTemplates(updatedTemplates);
    localStorage.setItem('quoteTemplates', JSON.stringify(updatedTemplates));
    toast.success(`Template "${name}" saved successfully`);
  };

  // Function to apply a saved template
  const handleApplyTemplate = (index: number) => {
    if (index < 0 || index >= savedTemplates.length) return;
    
    const template = savedTemplates[index];
    const settings = template.settings;
    
    // Apply template settings
    if (settings.companyLogo) setCompanyLogo(settings.companyLogo);
    if (settings.companyName) setCompanyName(settings.companyName);
    if (settings.companyAddress) setCompanyAddress(settings.companyAddress);
    if (settings.companyContact) setCompanyContact(settings.companyContact);
    if (settings.companyEmail) setCompanyEmail(settings.companyEmail);
    if (settings.primaryColor) setPrimaryColor(settings.primaryColor);
    
    toast.success(`Template "${template.name}" applied successfully`);
  };

  // Function to delete a saved template
  const handleDeleteTemplate = (index: number) => {
    if (index < 0 || index >= savedTemplates.length) return;
    
    const updatedTemplates = [...savedTemplates];
    const deletedName = updatedTemplates[index].name;
    updatedTemplates.splice(index, 1);
    
    setSavedTemplates(updatedTemplates);
    localStorage.setItem('quoteTemplates', JSON.stringify(updatedTemplates));
    toast.success(`Template "${deletedName}" deleted`);
  };

  // Function to handle template file upload
  const handleTemplateFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // For now, just show a toast notification since we can't process docx files in the browser
    toast.info(`File "${file.name}" uploaded. Note: Processing DOCX files directly is not supported in this web app.`);
    
    // Create a template entry with the file name
    const templateEntry = {
      name: file.name.replace('.docx', ''),
      settings: {
        companyLogo,
        companyName,
        companyAddress,
        companyContact,
        companyEmail,
        primaryColor
      }
    };
    
    const updatedTemplates = [...savedTemplates, templateEntry];
    setSavedTemplates(updatedTemplates);
    localStorage.setItem('quoteTemplates', JSON.stringify(updatedTemplates));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="flex flex-col space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Error</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex flex-col space-y-6">
        <QuoteHeader 
          quoteData={quoteData}
          isUpdatingStatus={isUpdatingStatus}
          onUpdateStatus={handleUpdateStatus}
        />
        
        <QuoteActions
          isGeneratingPdf={isGeneratingPdf}
          onDownloadPdf={handleDownloadPdf}
          onSendEmail={handleSendEmail}
          onPrint={handlePrint}
        />
        
        <Separator className="my-2" />
        
        <div id="quote-document" className="bg-white rounded-md shadow-sm print:shadow-none">
          <QuoteDocument 
            quoteData={quoteData} 
            customerData={customerData}
            serviceData={serviceData}
            bandwidthData={bandwidthData}
            featuresData={featuresData}
            companyLogo={companyLogo}
            companyName={companyName}
            companyAddress={companyAddress}
            companyContact={companyContact}
            companyEmail={companyEmail}
            primaryColor={primaryColor}
          />
        </div>
      </div>
      
      {/* Branding Sheet */}
      <Sheet>
        <BrandingSheet
          companyLogo={companyLogo}
          companyName={companyName}
          companyAddress={companyAddress}
          companyContact={companyContact}
          companyEmail={companyEmail}
          primaryColor={primaryColor}
          savedTemplates={savedTemplates}
          onLogoChange={handleLogoChange}
          onCompanyNameChange={(e) => setCompanyName(e.target.value)}
          onCompanyAddressChange={(e) => setCompanyAddress(e.target.value)}
          onCompanyContactChange={(e) => setCompanyContact(e.target.value)}
          onCompanyEmailChange={(e) => setCompanyEmail(e.target.value)}
          onPrimaryColorChange={(e) => setPrimaryColor(e.target.value)}
          onApplyTemplate={handleApplyTemplate}
          onDeleteTemplate={handleDeleteTemplate}
          onSaveTemplate={handleSaveTemplate}
          onUploadTemplate={handleTemplateFileUpload}
          onSaveSettings={handleSaveSettings}
        />
      </Sheet>
    </div>
  );
};

export default QuoteView;
