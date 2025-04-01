
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ServiceData {
  id: string;
  name: string;
  type: string;
  description: string | null;
  setup_fee: number;
  min_contract_months: number;
}

export interface BandwidthOption {
  id: string;
  service_id: string;
  bandwidth: number;
  unit: string;
  monthly_price: number;
  is_available: boolean;
}

export function useServiceData() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [bandwidthOptions, setBandwidthOptions] = useState<BandwidthOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch services
        const { data: servicesData, error: servicesError } = await supabase
          .from("services")
          .select("*")
          .order("name");

        if (servicesError) throw servicesError;
        
        if (servicesData && servicesData.length > 0) {
          console.log("Services data:", servicesData);
          setServices(servicesData);
        } else {
          setError("No services found. Please contact your administrator.");
          toast.error("No services found");
        }

        // Fetch bandwidth options
        const { data: bandwidthData, error: bandwidthError } = await supabase
          .from("bandwidth_options")
          .select("*")
          .eq("is_available", true)
          .order("bandwidth");

        if (bandwidthError) throw bandwidthError;
        
        if (bandwidthData && bandwidthData.length > 0) {
          console.log("Bandwidth options data:", bandwidthData);
          setBandwidthOptions(bandwidthData);
        } else {
          console.log("No bandwidth options found.");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    services,
    bandwidthOptions,
    isLoading,
    error
  };
}
