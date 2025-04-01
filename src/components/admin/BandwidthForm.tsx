
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Bandwidth {
  id: string;
  service_id: string;
  bandwidth: number;
  unit: "Mbps" | "Gbps" | "Tbps";
  monthly_price: number;
  is_available: boolean;
}

interface BandwidthFormProps {
  initialData?: Partial<Bandwidth>;
  onSubmit: (data: Partial<Bandwidth>) => void;
  onCancel: () => void;
}

const BandwidthForm = ({ initialData, onSubmit, onCancel }: BandwidthFormProps) => {
  const [formData, setFormData] = useState<Partial<Bandwidth>>({
    bandwidth: initialData?.bandwidth || 0,
    unit: initialData?.unit || "Mbps",
    monthly_price: initialData?.monthly_price || 0,
    is_available: initialData?.is_available !== undefined ? initialData.is_available : true,
  });

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseFloat(value) });
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData({ ...formData, is_available: checked });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="bandwidth" className="text-sm font-medium">
            Bandwidth
          </label>
          <Input
            id="bandwidth"
            name="bandwidth"
            type="number"
            min="0"
            step="0.01"
            value={formData.bandwidth}
            onChange={handleNumberChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="unit" className="text-sm font-medium">
            Unit
          </label>
          <Select
            name="unit"
            value={formData.unit}
            onValueChange={(value) => handleSelectChange(value, "unit")}
          >
            <SelectTrigger id="unit">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mbps">Mbps</SelectItem>
              <SelectItem value="Gbps">Gbps</SelectItem>
              <SelectItem value="Tbps">Tbps</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="monthly_price" className="text-sm font-medium">
          Monthly Price (Rs.)
        </label>
        <Input
          id="monthly_price"
          name="monthly_price"
          type="number"
          min="0"
          step="0.01"
          value={formData.monthly_price}
          onChange={handleNumberChange}
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_available"
          checked={formData.is_available}
          onCheckedChange={handleSwitchChange}
        />
        <Label htmlFor="is_available">Available for selection</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData?.id ? "Update Bandwidth" : "Create Bandwidth"}
        </Button>
      </div>
    </form>
  );
};

export default BandwidthForm;
