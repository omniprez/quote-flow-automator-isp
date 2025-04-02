
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

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
        console.log("Fetching features for service ID:", serviceId);
        
        // First approach: Get all features (if service_features might be empty)
        const { data: allFeatures, error: allFeaturesError } = await supabase
          .from("additional_features")
          .select("*")
          .order("name");
        
        if (allFeaturesError) throw allFeaturesError;
        
        if (allFeatures && allFeatures.length > 0) {
          console.log("All available features:", allFeatures);
          setFeatures(allFeatures);
          setIsLoading(false);
          return;
        }

        // If we have no features at all, stop here
        setFeatures([]);
        setIsLoading(false);

      } catch (error) {
        console.error("Error fetching features:", error);
        toast.error("Failed to load available features");
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

    console.log("Selected features for quote:", {
      ids: selectedFeatures,
      names: selectedFeatureObjects.map(f => f.name),
      monthlyTotal,
      oneTimeTotal
    });

    onComplete({
      ids: selectedFeatures,
      names: selectedFeatureObjects.map(f => f.name),
      monthlyTotal,
      oneTimeTotal
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10 space-x-2">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span>Loading available features...</span>
      </div>
    );
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
                    <div className="space-y-1 flex-1">
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
