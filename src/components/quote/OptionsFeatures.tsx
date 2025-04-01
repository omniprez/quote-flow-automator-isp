
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Feature {
  id: string;
  name: string;
  description: string | null;
  monthly_price: number;
  one_time_fee: number;
}

interface OptionsFeaturesProps {
  onComplete: (selectedFeatures: {
    ids: string[];
    names: string[];
    monthlyTotal: number;
    oneTimeTotal: number;
  }) => void;
  serviceId?: string;
  defaultSelectedFeatures?: string[];
}

export function OptionsFeatures({
  onComplete,
  serviceId,
  defaultSelectedFeatures = [],
}: OptionsFeaturesProps) {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(defaultSelectedFeatures);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch available features
  useEffect(() => {
    const fetchFeatures = async () => {
      if (!serviceId) {
        setIsLoading(false);
        return;
      }

      try {
        // First, get feature IDs linked to this service
        const { data: serviceFeatures, error: serviceError } = await supabase
          .from("service_features")
          .select("feature_id")
          .eq("service_id", serviceId);

        if (serviceError) throw serviceError;

        if (!serviceFeatures || serviceFeatures.length === 0) {
          setFeatures([]);
          setIsLoading(false);
          return;
        }

        // Get feature IDs as an array
        const featureIds = serviceFeatures.map(sf => sf.feature_id);

        // Then, get the actual feature details
        const { data: featuresData, error: featuresError } = await supabase
          .from("additional_features")
          .select("*")
          .in("id", featureIds);

        if (featuresError) throw featuresError;
        setFeatures(featuresData || []);
      } catch (error) {
        console.error("Error fetching features:", error);
        toast.error("Failed to load available features");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatures();
  }, [serviceId]);

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId) 
        : [...prev, featureId]
    );
  };

  const handleSubmit = () => {
    // Calculate pricing totals
    const selectedFeatureObjects = features.filter(feature => 
      selectedFeatures.includes(feature.id)
    );
    
    const monthlyTotal = selectedFeatureObjects.reduce(
      (sum, feature) => sum + feature.monthly_price, 0
    );
    
    const oneTimeTotal = selectedFeatureObjects.reduce(
      (sum, feature) => sum + feature.one_time_fee, 0
    );

    onComplete({
      ids: selectedFeatures,
      names: selectedFeatureObjects.map(f => f.name),
      monthlyTotal,
      oneTimeTotal
    });
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading available features...</div>;
  }

  if (!serviceId) {
    return (
      <div className="text-center py-10">
        Please select a service first to see available features.
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Select Additional Features</h3>
            
            {features.length === 0 ? (
              <p className="text-muted-foreground">No additional features available for this service.</p>
            ) : (
              <div className="grid gap-4">
                {features.map((feature) => (
                  <div key={feature.id} className="flex items-start space-x-3 p-4 border rounded-md">
                    <Checkbox 
                      id={`feature-${feature.id}`} 
                      checked={selectedFeatures.includes(feature.id)}
                      onCheckedChange={() => toggleFeature(feature.id)}
                    />
                    <div className="space-y-1">
                      <Label 
                        htmlFor={`feature-${feature.id}`}
                        className="font-medium cursor-pointer"
                      >
                        {feature.name} - MUR {feature.monthly_price.toLocaleString()}/month
                      </Label>
                      {feature.one_time_fee > 0 && (
                        <p className="text-sm text-muted-foreground">
                          One-time fee: MUR {feature.one_time_fee.toLocaleString()}
                        </p>
                      )}
                      {feature.description && (
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSubmit}>
              Continue to Review
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
