
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Trash, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import FeatureForm from "./FeatureForm";

interface Feature {
  id: string;
  name: string;
  description: string;
  monthly_price: number;
  one_time_fee: number;
}

const FeaturesManager = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("additional_features")
        .select("*")
        .order("name");

      if (error) throw error;
      setFeatures(data);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error fetching features",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this feature?")) {
      try {
        const { error } = await supabase
          .from("additional_features")
          .delete()
          .eq("id", id);

        if (error) throw error;
        
        toast({
          title: "Feature deleted",
          description: "The feature was successfully deleted.",
        });
        
        setFeatures(features.filter((feature) => feature.id !== id));
      } catch (err: any) {
        toast({
          title: "Error deleting feature",
          description: err.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = (feature: Feature) => {
    setEditingFeature(feature);
    setShowForm(true);
  };

  const handleFormSubmit = async (featureData: Partial<Feature>) => {
    try {
      if (editingFeature) {
        // Update existing feature
        const { data, error } = await supabase
          .from("additional_features")
          .update(featureData)
          .eq("id", editingFeature.id)
          .select();

        if (error) throw error;

        toast({
          title: "Feature updated",
          description: "The feature was successfully updated.",
        });

        setFeatures(features.map((f) => (f.id === editingFeature.id ? data[0] : f)));
      } else {
        // Create new feature
        const { data, error } = await supabase
          .from("additional_features")
          .insert([featureData])
          .select();

        if (error) throw error;

        toast({
          title: "Feature created",
          description: "The new feature was successfully created.",
        });

        setFeatures([...features, data[0]]);
      }

      setShowForm(false);
      setEditingFeature(null);
    } catch (err: any) {
      toast({
        title: "Error saving feature",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Additional Features Management</h2>
        <Button onClick={() => {
          setEditingFeature(null);
          setShowForm(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Feature
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingFeature ? "Edit Feature" : "Add New Feature"}</CardTitle>
          </CardHeader>
          <CardContent>
            <FeatureForm 
              initialData={editingFeature || undefined}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingFeature(null);
              }}
            />
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="text-center py-10">Loading features...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-10">{error}</div>
      ) : features.length === 0 ? (
        <div className="text-center py-10">No features found. Add your first feature!</div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Monthly Price (Rs.)</TableHead>
                  <TableHead>One-time Fee (Rs.)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {features.map((feature) => (
                  <TableRow key={feature.id}>
                    <TableCell>
                      <div className="font-medium">{feature.name}</div>
                    </TableCell>
                    <TableCell>{feature.description}</TableCell>
                    <TableCell>{feature.monthly_price.toLocaleString()}</TableCell>
                    <TableCell>{feature.one_time_fee.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button size="icon" variant="ghost" onClick={() => handleEdit(feature)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDelete(feature.id)}>
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
  );
};

export default FeaturesManager;
