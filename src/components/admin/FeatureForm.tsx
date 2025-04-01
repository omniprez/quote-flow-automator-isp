
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Feature {
  id: string;
  name: string;
  description: string;
  monthly_price: number;
  one_time_fee: number;
}

interface FeatureFormProps {
  initialData?: Partial<Feature>;
  onSubmit: (data: Partial<Feature>) => void;
  onCancel: () => void;
}

const FeatureForm = ({ initialData, onSubmit, onCancel }: FeatureFormProps) => {
  const [formData, setFormData] = useState<Partial<Feature>>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    monthly_price: initialData?.monthly_price || 0,
    one_time_fee: initialData?.one_time_fee || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseFloat(value) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Feature Name
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

        <div className="space-y-2">
          <label htmlFor="one_time_fee" className="text-sm font-medium">
            One-time Fee (Rs.)
          </label>
          <Input
            id="one_time_fee"
            name="one_time_fee"
            type="number"
            min="0"
            step="0.01"
            value={formData.one_time_fee}
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
          {initialData?.id ? "Update Feature" : "Create Feature"}
        </Button>
      </div>
    </form>
  );
};

export default FeatureForm;
