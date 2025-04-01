
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useServiceData, ServiceData, BandwidthOption } from "@/hooks/useServiceData";
import { ServiceTypeSelection } from "./ServiceTypeSelection";
import { BandwidthSelection } from "./BandwidthSelection";
import { ContractTermSelection } from "./ContractTermSelection";
import { serviceSchema, ServiceFormValues } from "./ServiceFormSchema";

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
  const { services, bandwidthOptions, isLoading, error } = useServiceData();
  const [filteredBandwidth, setFilteredBandwidth] = useState<BandwidthOption[]>([]);
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
              <ServiceTypeSelection form={form} services={services} />
              <BandwidthSelection form={form} filteredBandwidth={filteredBandwidth} serviceId={watchServiceId} />
              <ContractTermSelection form={form} />
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
