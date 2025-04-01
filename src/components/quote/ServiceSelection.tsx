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

  // Fetch services and bandwidth options
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
  }, [form, bandwidthOptions]);

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
                      <SelectContent className="max-h-[300px] overflow-y-auto">
                        {filteredBandwidth.length === 0 ? (
                          <div className="px-2 py-4 text-center text-muted-foreground">
                            {watchServiceId ? "No bandwidth options available for this service" : "Select a service first"}
                          </div>
                        ) : (
                          filteredBandwidth.map((option) => (
                            <SelectItem key={option.id} value={option.id} className="py-2">
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
