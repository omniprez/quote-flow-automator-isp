import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Download, Send, Printer, Settings, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { QuoteDocument } from "@/components/quote/QuoteDocument";
import { generatePdf } from "@/lib/pdf-generator";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  
  // Create refs for the sheet close button
  const sheetCloseRef = useRef<HTMLButtonElement>(null);
  
  // Company branding states
  const [companyLogo, setCompanyLogo] = useState<string>("/placeholder.svg");
  const [companyName, setCompanyName] = useState<string>("MCS Ltd");
  const [companyAddress, setCompanyAddress] = useState<string>("Ebene CyberCity\nEbene, Mauritius");
  const [companyContact, setCompanyContact] = useState<string>("+230 123 4567");
  const [companyEmail, setCompanyEmail] = useState<string>("sales@mcs.mu");
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
  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      toast.error("Please enter a template name");
      return;
    }

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
      { name: templateName, settings }
    ];

    setSavedTemplates(updatedTemplates);
    localStorage.setItem('quoteTemplates', JSON.stringify(updatedTemplates));
    setTemplateName("");
    toast.success(`Template "${templateName}" saved successfully`);
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

  // Function to handle docx file upload
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

  // Function to close the sheet
  const closeSheet = () => {
    if (sheetCloseRef.current) {
      sheetCloseRef.current.click();
    }
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
          <Button asChild>
            <Link to="/quotes/create">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Create New Quote
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center">
          <Link 
            to="/" 
            className="flex items-center text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quote #{quoteData?.quote_number}</h1>
            <p className="text-muted-foreground">
              Created on {new Date(quoteData?.created_at).toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Select
              value={quoteData?.status}
              onValueChange={handleUpdateStatus}
              disabled={isUpdatingStatus}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="declined">Decline</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            
            <Badge variant="outline" className="capitalize">
              {quoteData?.status || "draft"}
            </Badge>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3 print:hidden">
          <Button 
            onClick={handleDownloadPdf} 
            disabled={isGeneratingPdf}
            className="flex-1"
          >
            <Download className="mr-2 h-4 w-4" />
            {isGeneratingPdf ? "Generating..." : "Download PDF"}
          </Button>
          <Button onClick={handleSendEmail} variant="outline" className="flex-1">
            <Send className="mr-2 h-4 w-4" />
            Email Quote
          </Button>
          <Button onClick={handlePrint} variant="outline" className="flex-1">
            <Printer className="mr-2 h-4 w-4" />
            Print Quote
          </Button>
          
          {/* Sheet for company branding with improved layout */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex-1">
                <Settings className="mr-2 h-4 w-4" />
                Company Branding
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetClose ref={sheetCloseRef} className="hidden" />
              <SheetHeader>
                <SheetTitle>Company Branding</SheetTitle>
                <SheetDescription>
                  Customize your quote with your company branding
                </SheetDescription>
              </SheetHeader>
              
              <ScrollArea className="h-[calc(100vh-180px)] pr-4">
                {/* Templates Section */}
                <div className="space-y-6 pt-4">
                  <div className="border rounded-md p-4">
                    <h3 className="text-md font-medium mb-2">Templates</h3>
                    
                    {/* Upload template file */}
                    <div className="grid gap-2 mb-4">
                      <Label htmlFor="templateUpload">Upload Template (.docx)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="templateUpload"
                          type="file"
                          accept=".docx"
                          onChange={handleTemplateFileUpload}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Upload a DOCX template to save its name and your current branding settings.
                      </p>
                    </div>
                    
                    {/* Save current as template */}
                    <div className="grid gap-2 mb-4">
                      <Label htmlFor="templateName">Save Current as Template</Label>
                      <div className="flex gap-2">
                        <Input
                          id="templateName"
                          placeholder="Template name"
                          value={templateName}
                          onChange={(e) => setTemplateName(e.target.value)}
                        />
                        <Button onClick={handleSaveTemplate}>Save</Button>
                      </div>
                    </div>
                    
                    {/* Saved templates list */}
                    {savedTemplates.length > 0 && (
                      <div className="mt-4">
                        <Label>Saved Templates</Label>
                        <div className="mt-2 space-y-2">
                          {savedTemplates.map((template, index) => (
                            <div key={index} className="flex items-center justify-between border p-2 rounded">
                              <span className="text-sm font-medium">{template.name}</span>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleApplyTemplate(index)}
                                >
                                  Apply
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive" 
                                  onClick={() => handleDeleteTemplate(index)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                
                  {/* Company Branding Settings */}
                  <div className="border rounded-md p-4">
                    <h3 className="text-md font-medium mb-2">Branding Settings</h3>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="logo">Company Logo</Label>
                        <div className="flex items-center gap-4">
                          {companyLogo && (
                            <img 
                              src={companyLogo} 
                              alt="Company Logo" 
                              className="h-12 w-auto object-contain"
                            />
                          )}
                          <Input
                            id="logo"
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                          id="companyName"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="companyAddress">Company Address</Label>
                        <Textarea
                          id="companyAddress"
                          value={companyAddress}
                          onChange={(e) => setCompanyAddress(e.target.value)}
                          rows={2}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="companyContact">Phone Number</Label>
                        <Input
                          id="companyContact"
                          value={companyContact}
                          onChange={(e) => setCompanyContact(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="companyEmail">Email</Label>
                        <Input
                          id="companyEmail"
                          type="email"
                          value={companyEmail}
                          onChange={(e) => setCompanyEmail(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="primaryColor">Primary Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="primaryColor"
                            type="color"
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="w-16 h-10 p-1"
                          />
                          <Input
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            placeholder="#000000"
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
              
              <div className="mt-6 flex justify-end gap-2">
                <Button variant="outline" onClick={closeSheet}>Cancel</Button>
                <Button onClick={() => {
                  handleSaveSettings();
                  closeSheet();
                }}>
                  Save Changes
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
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
    </div>
  );
};

export default QuoteView;
