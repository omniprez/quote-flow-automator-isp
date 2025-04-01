
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ServiceData } from "@/hooks/useServiceData";
import { ServiceFormValues } from "./ServiceFormSchema";

interface ServiceTypeSelectionProps {
  form: UseFormReturn<ServiceFormValues>;
  services: ServiceData[];
}

export function ServiceTypeSelection({ form, services }: ServiceTypeSelectionProps) {
  return (
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
  );
}
