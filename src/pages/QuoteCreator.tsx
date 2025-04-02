
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { CustomerForm, CustomerFormValues } from "@/components/quote/CustomerForm";
import { ServiceSelection } from "@/components/quote/ServiceSelection";
import { OptionsFeatures } from "@/components/quote/OptionsFeatures";
import { QuoteReview } from "@/components/quote/QuoteReview";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface QuoteData {
  customerId?: string;
  customerData?: CustomerFormValues;
  serviceId?: string;
  serviceName?: string;
  bandwidthId?: string;
  bandwidthValue?: number;
  bandwidthUnit?: string;
  monthlyPrice?: number;
  setupFee?: number;
  contractMonths?: number;
  selectedFeatures?: {
    ids: string[];
    names: string[];
    monthlyTotal: number;
    oneTimeTotal: number;
  };
}

const QuoteCreator = () => {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState("customer");
  const [quoteData, setQuoteData] = useState<QuoteData>({});

  const handleCustomerComplete = (customerId: string, customerData: CustomerFormValues) => {
    setQuoteData({
      ...quoteData,
      customerId,
      customerData
    });
    setActiveStep("service");
  };

  const handleServiceComplete = (serviceData: {
    serviceId: string;
    serviceName: string;
    bandwidthId: string;
    bandwidthValue: number;
    bandwidthUnit: string;
    monthlyPrice: number;
    setupFee: number;
    contractMonths: number;
  }) => {
    setQuoteData({
      ...quoteData,
      ...serviceData
    });
    setActiveStep("options");
  };

  const handleOptionsComplete = (featuresData: {
    ids: string[];
    names: string[];
    monthlyTotal: number;
    oneTimeTotal: number;
  }) => {
    console.log("Features data received:", featuresData);
    setQuoteData({
      ...quoteData,
      selectedFeatures: featuresData
    });
    setActiveStep("review");
  };

  const handleQuoteGenerated = (quoteId: string) => {
    toast.success("Quote generated successfully!");
    console.log("Quote generated with ID:", quoteId);
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex flex-col space-y-3">
        <div className="flex items-center">
          <Link 
            to="/" 
            className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-indigo-700 font-display">Create New Quote</h1>
        </div>
        <p className="text-indigo-600">
          Create a professional quote for your customers by following the steps below.
          All prices are in Mauritian Rupees (MUR) and exclusive of VAT.
        </p>
      </div>
      
      <Tabs defaultValue="customer" className="mt-6" onValueChange={setActiveStep} value={activeStep}>
        <TabsList className="grid w-full grid-cols-4 bg-indigo-100">
          <TabsTrigger value="customer" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Customer</TabsTrigger>
          <TabsTrigger value="service" disabled={!quoteData.customerId} className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Service Selection</TabsTrigger>
          <TabsTrigger value="options" disabled={!quoteData.serviceId} className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Options & Features</TabsTrigger>
          <TabsTrigger value="review" disabled={!quoteData.serviceId} className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Review & Generate</TabsTrigger>
        </TabsList>
        
        <TabsContent value="customer" className="mt-6">
          <CustomerForm onComplete={handleCustomerComplete} defaultValues={quoteData.customerData} />
        </TabsContent>
        
        <TabsContent value="service" className="mt-6">
          <ServiceSelection 
            onComplete={handleServiceComplete} 
            defaultServiceId={quoteData.serviceId}
            defaultBandwidthId={quoteData.bandwidthId}
            defaultContractMonths={quoteData.contractMonths}
          />
        </TabsContent>
        
        <TabsContent value="options" className="mt-6">
          <OptionsFeatures
            onComplete={handleOptionsComplete}
            serviceId={quoteData.serviceId}
            defaultSelectedFeatures={quoteData.selectedFeatures?.ids}
          />
        </TabsContent>
        
        <TabsContent value="review" className="mt-6">
          <QuoteReview
            {...quoteData}
            onQuoteGenerated={handleQuoteGenerated}
          />
        </TabsContent>
      </Tabs>
      
      <Toaster />
    </div>
  );
};

export default QuoteCreator;
