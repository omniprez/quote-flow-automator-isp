
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Define the validation schema
const serviceSchema = z.object({
  serviceId: z.string().min(1, "Please select a service"),
  bandwidthId: z.string().min(1, "Please select a bandwidth option"),
  contractMonths: z.coerce.number().min(1, "Please select a contract term"),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;

interface ServiceData {
  id: string;
  name: string;
  type: string;
  description: string | null;
  setup_fee: number;
  min_contract_months: number;
}

interface BandwidthOption {
  id: string;
  service_id: string;
  bandwidth: number;
  unit: string;
  monthly_price: number;
  is_available: boolean;
}

interface ServiceSelectionProps {
  onComplete: (serviceData: {
    serviceId: string;
    serviceName: string;
    bandwidthId: string;
    bandwidthValue: number;
    bandwidthUnit: string;
    monthlyPrice: number;
    setupFee: number;
    contractMonths: number;
  }) => void;
  defaultServiceId?: string;
  defaultBandwidthId?: string;
  defaultContractMonths?: number;
}

export function ServiceSelection({
  onComplete,
  defaultServiceId,
  defaultBandwidthId,
  defaultContractMonths,
}: ServiceSelectionProps) {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [bandwidthOptions, setBandwidthOptions] = useState<BandwidthOption[]>([]);
  const [filteredBandwidth, setFilteredBandwidth] = useState<BandwidthOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<ServiceData | null>(null);
  const [selectedBandwidth, setSelectedBandwidth] = useState<BandwidthOption | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize the form
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      serviceId: defaultServiceId || "",
      bandwidthId: defaultBandwidthId || "",
      contractMonths: defaultContractMonths || 12,
    },
  });

  const watchServiceId = form.watch("serviceId");

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        console.log("Fetching services...");
        setError(null);
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .order("name");

        if (error) {
          throw error;
        }
        
        console.log("Services data:", data);
        if (!data || data.length === 0) {
          // Insert predefined services if none exist
          const predefinedServices = [
            {
              name: "Dedicated Internet Access",
              type: "DIA",
              description: "Premium dedicated internet connection with guaranteed bandwidth",
              setup_fee: 5000,
              min_contract_months: 12
            },
            {
              name: "Enterprise Business Internet",
              type: "EBI",
              description: "Business-grade internet solution with shared bandwidth",
              setup_fee: 3000,
              min_contract_months: 12
            },
            {
              name: "Private WAN",
              type: "Private WAN",
              description: "Secure private network connecting multiple business locations",
              setup_fee: 7500,
              min_contract_months: 12
            }
          ];
          
          toast.info("Adding predefined services to the database");
          
          // Insert the predefined services
          for (const service of predefinedServices) {
            await supabase.from("services").insert(service);
          }
          
          // Fetch again to get the newly inserted services with their IDs
          const { data: refreshedData } = await supabase
            .from("services")
            .select("*")
            .order("name");
            
          setServices(refreshedData || []);
        } else {
          setServices(data);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        setError("Failed to load services. Please try again later.");
        toast.error("Failed to load services");
      }
    };

    const fetchBandwidthOptions = async () => {
      try {
        console.log("Fetching bandwidth options...");
        const { data, error } = await supabase
          .from("bandwidth_options")
          .select("*")
          .eq("is_available", true)
          .order("bandwidth");

        if (error) {
          throw error;
        }
        
        console.log("Bandwidth options data:", data);
        if (!data || data.length === 0) {
          // If no bandwidth options exist, we'll need to create some after we have services
          toast.info("No bandwidth options found. You may need to add some in the admin panel.");
        } else {
          setBandwidthOptions(data);
        }
      } catch (error) {
        console.error("Error fetching bandwidth options:", error);
        toast.error("Failed to load bandwidth options");
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
    fetchBandwidthOptions();
  }, []);

  // Filter bandwidth options based on selected service
  useEffect(() => {
    if (watchServiceId) {
      const filtered = bandwidthOptions.filter(
        (option) => option.service_id === watchServiceId
      );
      setFilteredBandwidth(filtered);

      const service = services.find((s) => s.id === watchServiceId);
      setSelectedService(service || null);

      // Reset bandwidth selection when service changes
      if (!filtered.find(b => b.id === form.getValues().bandwidthId)) {
        form.setValue("bandwidthId", "");
      }
      
      // If no bandwidth options exist for this service, we can create some placeholders
      if (filtered.length === 0 && service) {
        const createBandwidthOptions = async () => {
          toast.info(`Creating bandwidth options for ${service.name}`);
          
          // Define different options based on service type
          let options = [];
          
          if (service.type === "DIA") {
            options = [
              { bandwidth: 10, unit: "Mbps", monthly_price: 2000 },
              { bandwidth: 20, unit: "Mbps", monthly_price: 3000 },
              { bandwidth: 50, unit: "Mbps", monthly_price: 5000 },
              { bandwidth: 100, unit: "Mbps", monthly_price: 8000 },
            ];
          } else if (service.type === "EBI") {
            options = [
              { bandwidth: 10, unit: "Mbps", monthly_price: 1500 },
              { bandwidth: 25, unit: "Mbps", monthly_price: 2500 },
              { bandwidth: 50, unit: "Mbps", monthly_price: 4000 },
            ];
          } else if (service.type === "Private WAN") {
            options = [
              { bandwidth: 5, unit: "Mbps", monthly_price: 3000 },
              { bandwidth: 10, unit: "Mbps", monthly_price: 4500 },
              { bandwidth: 20, unit: "Mbps", monthly_price: 7000 },
            ];
          }
          
          // Insert the options
          for (const option of options) {
            await supabase.from("bandwidth_options").insert({
              service_id: service.id,
              ...option,
              is_available: true
            });
          }
          
          // Fetch the newly created options
          const { data } = await supabase
            .from("bandwidth_options")
            .select("*")
            .eq("service_id", service.id)
            .eq("is_available", true)
            .order("bandwidth");
            
          if (data) {
            const allOptions = [...bandwidthOptions, ...data];
            setBandwidthOptions(allOptions);
            setFilteredBandwidth(data);
          }
        };
        
        createBandwidthOptions();
      }
    } else {
      setFilteredBandwidth([]);
      setSelectedService(null);
    }
  }, [watchServiceId, bandwidthOptions, services, form]);

  // Update selected bandwidth when bandwidth ID changes
  useEffect(() => {
    const bandwidthId = form.getValues().bandwidthId;
    if (bandwidthId) {
      const bandwidth = bandwidthOptions.find((b) => b.id === bandwidthId);
      setSelectedBandwidth(bandwidth || null);
    } else {
      setSelectedBandwidth(null);
    }
  }, [form.getValues().bandwidthId, bandwidthOptions]);

  const onSubmit = (data: ServiceFormValues) => {
    if (!selectedService || !selectedBandwidth) {
      toast.error("Please select both service and bandwidth");
      return;
    }

    onComplete({
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      bandwidthId: selectedBandwidth.id,
      bandwidthValue: selectedBandwidth.bandwidth,
      bandwidthUnit: selectedBandwidth.unit,
      monthlyPrice: selectedBandwidth.monthly_price,
      setupFee: selectedService.setup_fee,
      contractMonths: data.contractMonths,
    });
  };

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Loading services...</p>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        {error && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-md text-sm">
            {error}
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="serviceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Type*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {services.length === 0 ? (
                          <div className="px-2 py-4 text-center text-muted-foreground">
                            No services available
                          </div>
                        ) : (
                          services.map((service) => (
                            <SelectItem key={service.id} value={service.id}>
                              {service.name} ({service.type})
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bandwidthId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bandwidth*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                      disabled={!watchServiceId}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select bandwidth" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredBandwidth.length === 0 ? (
                          <div className="px-2 py-4 text-center text-muted-foreground">
                            {watchServiceId ? "No bandwidth options available" : "Select a service first"}
                          </div>
                        ) : (
                          filteredBandwidth.map((option) => (
                            <SelectItem key={option.id} value={option.id}>
                              {option.bandwidth} {option.unit} - MUR {option.monthly_price.toLocaleString()} /month
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contractMonths"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Term*</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value.toString()}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select contract term" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="12">12 Months</SelectItem>
                        <SelectItem value="24">24 Months</SelectItem>
                        <SelectItem value="36">36 Months</SelectItem>
                        <SelectItem value="48">48 Months</SelectItem>
                        <SelectItem value="60">60 Months</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {selectedService && (
              <div className="bg-muted p-4 rounded-md mt-4">
                <h3 className="font-medium">{selectedService.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedService.description}
                </p>
                <p className="text-sm mt-2">
                  Setup Fee: MUR {selectedService.setup_fee.toLocaleString()}
                </p>
              </div>
            )}

            <div className="flex justify-end">
              <Button type="submit">
                Save & Continue
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
