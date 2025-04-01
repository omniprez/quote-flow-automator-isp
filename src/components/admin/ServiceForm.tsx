
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Service {
  id: string;
  name: string;
  type: "DIA" | "EBI" | "Private WAN";
  description: string;
  setup_fee: number;
  min_contract_months: number;
}

interface ServiceFormProps {
  initialData?: Partial<Service>;
  onSubmit: (data: Partial<Service>) => void;
  onCancel: () => void;
}

const ServiceForm = ({ initialData, onSubmit, onCancel }: ServiceFormProps) => {
  const [formData, setFormData] = useState<Partial<Service>>({
    name: initialData?.name || "",
    type: initialData?.type || "DIA",
    description: initialData?.description || "",
    setup_fee: initialData?.setup_fee || 0,
    min_contract_months: initialData?.min_contract_months || 12,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseFloat(value) });
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Service Name
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="type" className="text-sm font-medium">
            Service Type
          </label>
          <Select
            name="type"
            value={formData.type}
            onValueChange={(value) => handleSelectChange(value, "type")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select service type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DIA">Dedicated Internet Access (DIA)</SelectItem>
              <SelectItem value="EBI">Enterprise Broadband Internet (EBI)</SelectItem>
              <SelectItem value="Private WAN">Private WAN</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="setup_fee" className="text-sm font-medium">
            Setup Fee (Rs.)
          </label>
          <Input
            id="setup_fee"
            name="setup_fee"
            type="number"
            min="0"
            step="0.01"
            value={formData.setup_fee}
            onChange={handleNumberChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="min_contract_months" className="text-sm font-medium">
            Minimum Contract (Months)
          </label>
          <Input
            id="min_contract_months"
            name="min_contract_months"
            type="number"
            min="1"
            value={formData.min_contract_months}
            onChange={handleNumberChange}
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData?.id ? "Update Service" : "Create Service"}
        </Button>
      </div>
    </form>
  );
};

export default ServiceForm;
