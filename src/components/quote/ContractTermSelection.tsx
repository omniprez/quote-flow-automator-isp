
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ServiceFormValues } from "./ServiceFormSchema";

interface ContractTermSelectionProps {
  form: UseFormReturn<ServiceFormValues>;
}

export function ContractTermSelection({ form }: ContractTermSelectionProps) {
  return (
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
  );
}
