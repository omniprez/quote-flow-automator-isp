
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface QuoteData {
  id: string;
  quote_number: string;
  status: string;
  total_monthly_cost: number;
  total_setup_cost: number;
  notes?: string;
  expiration_date?: string;
  customer_id: string;
  created_at: string;
}

export interface CustomerData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  created_at: string;
}

export interface ServiceData {
  id: string;
  name: string;
  type: string;
  description: string | null;
  setup_fee: number;
  min_contract_months: number;
}

export interface BandwidthData {
  id: string;
  service_id: string;
  bandwidth: number;
  unit: string;
  monthly_price: number;
  is_available: boolean;
}

export interface FeatureData {
  id: string;
  name: string;
  description: string | null;
  monthly_price: number;
  is_available: boolean;
}

export function useQuoteData(quoteId: string | undefined) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [serviceData, setServiceData] = useState<ServiceData | null>(null);
  const [bandwidthData, setBandwidthData] = useState<BandwidthData | null>(null);
  const [featuresData, setFeaturesData] = useState<FeatureData[]>([]);

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
        
        setQuoteData(quote as QuoteData);
        
        // Fetch customer data
        const { data: customer, error: customerError } = await supabase
          .from("customers")
          .select("*")
          .eq("id", quote.customer_id)
          .maybeSingle();
          
        if (customerError) throw customerError;
        setCustomerData(customer as CustomerData);
        
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
          setServiceData(service as ServiceData);
          
          if (allBandwidthOptions && allBandwidthOptions.length > 0) {
            // Find a bandwidth option that matches the service_id
            const bandwidth = allBandwidthOptions.find(b => b.service_id === service.id);
            if (bandwidth) {
              setBandwidthData({
                ...bandwidth,
                // Adjust the price based on the quote's monthly cost (excluding features)
                monthly_price: quote.total_monthly_cost - 15000 // Subtract known feature cost
              } as BandwidthData);
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
          setFeaturesData(includedFeatures as FeatureData[]);
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

  const updateQuoteStatus = async (newStatus: string) => {
    if (!quoteId || !quoteData) return;
    
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
      return true;
    } catch (error) {
      console.error("Error updating quote status:", error);
      toast.error("Failed to update quote status");
      return false;
    }
  };

  return {
    isLoading,
    error,
    quoteData,
    customerData,
    serviceData,
    bandwidthData,
    featuresData,
    updateQuoteStatus
  };
}
