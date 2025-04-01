
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
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .order("name");

        if (error) throw error;
        setServices(data || []);
      } catch (error) {
        console.error("Error fetching services:", error);
        toast.error("Failed to load services");
      }
    };

    const fetchBandwidthOptions = async () => {
      try {
        const { data, error } = await supabase
          .from("bandwidth_options")
          .select("*")
          .eq("is_available", true)
          .order("bandwidth");

        if (error) throw error;
        setBandwidthOptions(data || []);
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
    return <div className="text-center py-10">Loading services...</div>;
  }

  return (
    <Card>
      <CardContent className="pt-6">
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
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name} ({service.type})
                          </SelectItem>
                        ))}
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
                        {filteredBandwidth.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.bandwidth} {option.unit} - MUR {option.monthly_price.toLocaleString()} /month
                          </SelectItem>
                        ))}
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
