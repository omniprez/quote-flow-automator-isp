
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Trash, Edit, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import ServiceForm from "./ServiceForm";

interface Service {
  id: string;
  name: string;
  type: "DIA" | "EBI" | "Private WAN";
  description: string;
  setup_fee: number;
  min_contract_months: number;
}

const ServiceManager = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("name");

      if (error) throw error;
      setServices(data);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error fetching services",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this service? This will also delete all associated bandwidth options.")) {
      try {
        const { error } = await supabase
          .from("services")
          .delete()
          .eq("id", id);

        if (error) throw error;
        
        toast({
          title: "Service deleted",
          description: "The service was successfully deleted.",
        });
        
        setServices(services.filter((service) => service.id !== id));
      } catch (err: any) {
        toast({
          title: "Error deleting service",
          description: err.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleFormSubmit = async (serviceData: Partial<Service>) => {
    try {
      if (editingService) {
        // Update existing service
        const { data, error } = await supabase
          .from("services")
          .update(serviceData)
          .eq("id", editingService.id)
          .select();

        if (error) throw error;

        toast({
          title: "Service updated",
          description: "The service was successfully updated.",
        });

        setServices(services.map((s) => (s.id === editingService.id ? { ...s, ...data[0] } : s)));
      } else {
        // Create new service
        const { data, error } = await supabase
          .from("services")
          .insert([serviceData])
          .select();

        if (error) throw error;

        toast({
          title: "Service created",
          description: "The new service was successfully created.",
        });

        setServices([...services, data[0]]);
      }

      setShowForm(false);
      setEditingService(null);
    } catch (err: any) {
      toast({
        title: "Error saving service",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Service Management</h2>
        <Button onClick={() => {
          setEditingService(null);
          setShowForm(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingService ? "Edit Service" : "Add New Service"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ServiceForm 
              initialData={editingService || undefined}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingService(null);
              }}
            />
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="text-center py-10">Loading services...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-10">{error}</div>
      ) : services.length === 0 ? (
        <div className="text-center py-10">No services found. Add your first service!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
            <Card key={service.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <div className="flex space-x-1">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(service)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(service.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">Type: {service.type}</div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3">{service.description}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Setup Fee:</span> Rs. {service.setup_fee.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Min Contract:</span> {service.min_contract_months} months
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceManager;
