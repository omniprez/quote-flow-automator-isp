
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Trash, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import BandwidthForm from "./BandwidthForm";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Service {
  id: string;
  name: string;
  type: string;
}

interface Bandwidth {
  id: string;
  service_id: string;
  bandwidth: number;
  unit: "Mbps" | "Gbps" | "Tbps";
  monthly_price: number;
  is_available: boolean;
}

interface BandwidthWithService extends Bandwidth {
  service: Service;
}

const BandwidthManager = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [bandwidths, setBandwidths] = useState<BandwidthWithService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBandwidth, setEditingBandwidth] = useState<Bandwidth | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (services.length > 0) {
      // Set the first service as default selected if none is selected
      if (!selectedServiceId) {
        setSelectedServiceId(services[0].id);
      }
      fetchBandwidths(selectedServiceId || services[0].id);
    }
  }, [services, selectedServiceId]);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("id, name, type")
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
    }
  };

  const fetchBandwidths = async (serviceId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("bandwidth_options")
        .select(`
          *,
          service:services(id, name, type)
        `)
        .eq("service_id", serviceId)
        .order("bandwidth");

      if (error) throw error;
      setBandwidths(data);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error fetching bandwidth options",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this bandwidth option?")) {
      try {
        const { error } = await supabase
          .from("bandwidth_options")
          .delete()
          .eq("id", id);

        if (error) throw error;
        
        toast({
          title: "Bandwidth option deleted",
          description: "The bandwidth option was successfully deleted.",
        });
        
        setBandwidths(bandwidths.filter((b) => b.id !== id));
      } catch (err: any) {
        toast({
          title: "Error deleting bandwidth option",
          description: err.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = (bandwidth: Bandwidth) => {
    setEditingBandwidth(bandwidth);
    setShowForm(true);
  };

  const handleFormSubmit = async (bandwidthData: Partial<Bandwidth>) => {
    try {
      if (editingBandwidth) {
        // Update existing bandwidth
        const { data, error } = await supabase
          .from("bandwidth_options")
          .update(bandwidthData)
          .eq("id", editingBandwidth.id)
          .select(`
            *,
            service:services(id, name, type)
          `);

        if (error) throw error;

        toast({
          title: "Bandwidth option updated",
          description: "The bandwidth option was successfully updated.",
        });

        setBandwidths(bandwidths.map((b) => (b.id === editingBandwidth.id ? data[0] : b)));
      } else {
        // Create new bandwidth option
        const { data, error } = await supabase
          .from("bandwidth_options")
          .insert([{ ...bandwidthData, service_id: selectedServiceId }])
          .select(`
            *,
            service:services(id, name, type)
          `);

        if (error) throw error;

        toast({
          title: "Bandwidth option created",
          description: "The new bandwidth option was successfully created.",
        });

        setBandwidths([...bandwidths, data[0]]);
      }

      setShowForm(false);
      setEditingBandwidth(null);
    } catch (err: any) {
      toast({
        title: "Error saving bandwidth option",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleServiceChange = (serviceId: string) => {
    setSelectedServiceId(serviceId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Bandwidth Options Management</h2>
        <Button onClick={() => {
          setEditingBandwidth(null);
          setShowForm(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Bandwidth Option
        </Button>
      </div>

      <div className="space-y-4">
        <div className="w-full md:w-1/3">
          <label htmlFor="service-select" className="text-sm font-medium block mb-1">
            Select Service
          </label>
          <Select
            value={selectedServiceId || ""}
            onValueChange={handleServiceChange}
          >
            <SelectTrigger id="service-select">
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingBandwidth ? "Edit Bandwidth Option" : "Add New Bandwidth Option"}</CardTitle>
            </CardHeader>
            <CardContent>
              <BandwidthForm 
                initialData={editingBandwidth || undefined}
                onSubmit={handleFormSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingBandwidth(null);
                }}
              />
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="text-center py-10">Loading bandwidth options...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">{error}</div>
        ) : bandwidths.length === 0 ? (
          <div className="text-center py-10">No bandwidth options found for this service. Add your first bandwidth option!</div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bandwidth</TableHead>
                    <TableHead>Monthly Price (Rs.)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bandwidths.map((bandwidth) => (
                    <TableRow key={bandwidth.id}>
                      <TableCell>
                        <div className="font-medium">{bandwidth.bandwidth} {bandwidth.unit}</div>
                      </TableCell>
                      <TableCell>{bandwidth.monthly_price.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${bandwidth.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {bandwidth.is_available ? 'Available' : 'Unavailable'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button size="icon" variant="ghost" onClick={() => handleEdit(bandwidth)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => handleDelete(bandwidth.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BandwidthManager;
