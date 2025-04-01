
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const QuoteCreator = () => {
  const [activeStep, setActiveStep] = useState("customer");

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex flex-col space-y-3">
        <div className="flex items-center">
          <Link 
            to="/" 
            className="flex items-center text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Create New Quote</h1>
        </div>
        <p className="text-muted-foreground">
          Create a professional quote for your customers by following the steps below.
          All prices are in Mauritian Rupees (MUR) and exclusive of VAT.
        </p>
      </div>
      
      <Tabs defaultValue="customer" className="mt-6" onValueChange={setActiveStep}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="customer">Customer</TabsTrigger>
          <TabsTrigger value="service">Service Selection</TabsTrigger>
          <TabsTrigger value="options">Options & Features</TabsTrigger>
          <TabsTrigger value="review">Review & Generate</TabsTrigger>
        </TabsList>
        
        <TabsContent value="customer" className="mt-6">
          <div className="text-center py-10">
            Customer information section coming soon...
          </div>
        </TabsContent>
        
        <TabsContent value="service" className="mt-6">
          <div className="text-center py-10">
            Service selection section coming soon...
          </div>
        </TabsContent>
        
        <TabsContent value="options" className="mt-6">
          <div className="text-center py-10">
            Options and features section coming soon...
          </div>
        </TabsContent>
        
        <TabsContent value="review" className="mt-6">
          <div className="text-center py-10">
            Quote review and generation section coming soon...
          </div>
        </TabsContent>
      </Tabs>
      
      <Toaster />
    </div>
  );
};

export default QuoteCreator;
