
import * as z from "zod";

// Define the validation schema
export const serviceSchema = z.object({
  serviceId: z.string().min(1, "Please select a service"),
  bandwidthId: z.string().min(1, "Please select a bandwidth option"),
  contractMonths: z.coerce.number().min(1, "Please select a contract term"),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;
