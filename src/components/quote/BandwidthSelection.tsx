
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { BandwidthOption } from "@/hooks/useServiceData";
import { ServiceFormValues } from "./ServiceFormSchema";

interface BandwidthSelectionProps {
  form: UseFormReturn<ServiceFormValues>;
  filteredBandwidth: BandwidthOption[];
  serviceId: string | undefined;
}

export function BandwidthSelection({ form, filteredBandwidth, serviceId }: BandwidthSelectionProps) {
  return (
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
            disabled={!serviceId}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select bandwidth" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="max-h-[300px] overflow-y-auto">
              {filteredBandwidth.length === 0 ? (
                <div className="px-2 py-4 text-center text-muted-foreground">
                  {serviceId ? "No bandwidth options available for this service" : "Select a service first"}
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
  );
}
